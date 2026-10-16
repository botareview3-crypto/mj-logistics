"""
Signed-in account features: saved addresses, orders (+ tracking), cart and
garage sync across devices, and stock alerts.

Every route needs the bearer token from /api/auth (get_current_user) and only
ever touches the caller's own rows.

Important limits (also noted in CLAUDE.md / CHAT_HISTORY.md):
  * The storefront catalog is static and lives in the frontend, so an order
    stores the item name/SKU/price the browser sent at checkout. The totals
    (discount, delivery, VAT) are recomputed here, but staff should still
    confirm prices when they confirm the order.
  * No payment is taken. An order is a request that staff review and move
    through the statuses below from the admin console.
"""
import datetime
import json
import secrets
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .. import db_models as m
from ..auth import get_current_user
from ..db import get_db

router = APIRouter(prefix="/api/account", tags=["account"])

# ── Order rules (mirror the numbers the cart page shows) ───────────────────
ORDER_STATUSES = ["received", "confirmed", "packed", "dispatched", "delivered", "cancelled"]
CANCELLABLE = {"received", "confirmed"}
PROMO_CODES = {"AUTOPRO10": 10, "PROMO10": 10, "FREESHIP": 5}  # code -> % off
FREE_SHIPPING_FROM = 75.0
SHIPPING_COST = 9.99
VAT_RATE = 0.08
MAX_ADDRESSES = 10
MAX_CART_LINES = 100
MAX_GARAGE_VEHICLES = 50
MAX_ALERTS = 100
MAX_JSON_CHARS = 200_000


def _now() -> datetime.datetime:
    return datetime.datetime.utcnow()


def _iso(dt: datetime.datetime) -> str:
    return dt.replace(microsecond=0).isoformat() + "Z"


# ── Cart sync ──────────────────────────────────────────────────────────────
class CartLine(BaseModel):
    partId: str = Field(min_length=1, max_length=100)
    quantity: int = Field(ge=1, le=99)
    addedForVehicle: Optional[dict] = None


class CartBody(BaseModel):
    items: list[CartLine] = Field(max_length=MAX_CART_LINES)


@router.get("/cart")
def get_cart(user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = db.get(m.UserCart, user.id)
    return {"items": json.loads(row.data) if row else []}


@router.put("/cart")
def put_cart(body: CartBody, user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    data = json.dumps([line.model_dump() for line in body.items])
    if len(data) > MAX_JSON_CHARS:
        raise HTTPException(413, "Cart is too large")
    row = db.get(m.UserCart, user.id)
    if row:
        row.data, row.updated_at = data, _now()
    else:
        db.add(m.UserCart(user_id=user.id, data=data, updated_at=_now()))
    db.commit()
    return {"items": json.loads(data)}


# ── Garage sync ────────────────────────────────────────────────────────────
class GarageBody(BaseModel):
    vehicles: list[dict] = Field(max_length=MAX_GARAGE_VEHICLES)
    activeVehicleId: str = Field(default="", max_length=100)


@router.get("/garage")
def get_garage(user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    row = db.get(m.UserGarage, user.id)
    if not row:
        return {"vehicles": [], "activeVehicleId": ""}
    return {"vehicles": json.loads(row.vehicles), "activeVehicleId": row.active_vehicle_id}


@router.put("/garage")
def put_garage(body: GarageBody, user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    data = json.dumps(body.vehicles)
    if len(data) > MAX_JSON_CHARS:
        raise HTTPException(413, "Garage is too large")
    row = db.get(m.UserGarage, user.id)
    if row:
        row.vehicles, row.active_vehicle_id, row.updated_at = data, body.activeVehicleId, _now()
    else:
        db.add(m.UserGarage(user_id=user.id, vehicles=data, active_vehicle_id=body.activeVehicleId, updated_at=_now()))
    db.commit()
    return {"vehicles": body.vehicles, "activeVehicleId": body.activeVehicleId}


# ── Saved addresses ────────────────────────────────────────────────────────
class AddressBody(BaseModel):
    label: str = Field(default="", max_length=60)
    full_name: str = Field(min_length=1, max_length=200)
    phone: str = Field(default="", max_length=40)
    line1: str = Field(min_length=1, max_length=200)
    line2: str = Field(default="", max_length=200)
    city: str = Field(min_length=1, max_length=120)
    region: str = Field(default="", max_length=120)
    postal_code: str = Field(default="", max_length=30)
    country: str = Field(min_length=1, max_length=120)
    is_default: bool = False


def _address_out(a: m.Address) -> dict:
    return {
        "id": a.id, "label": a.label, "full_name": a.full_name, "phone": a.phone,
        "line1": a.line1, "line2": a.line2, "city": a.city, "region": a.region,
        "postal_code": a.postal_code, "country": a.country, "is_default": a.is_default,
    }


def _own_address(db: Session, user: m.User, address_id: str) -> m.Address:
    addr = db.get(m.Address, address_id)
    if not addr or addr.user_id != user.id:
        raise HTTPException(404, "Address not found")
    return addr


def _clear_default(db: Session, user: m.User, except_id: str = ""):
    for other in db.query(m.Address).filter_by(user_id=user.id, is_default=True):
        if other.id != except_id:
            other.is_default = False


@router.get("/addresses")
def list_addresses(user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(m.Address).filter_by(user_id=user.id).order_by(m.Address.created_at).all()
    return [_address_out(a) for a in rows]


@router.post("/addresses", status_code=201)
def create_address(body: AddressBody, user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    count = db.query(m.Address).filter_by(user_id=user.id).count()
    if count >= MAX_ADDRESSES:
        raise HTTPException(400, f"You can save up to {MAX_ADDRESSES} addresses")
    addr = m.Address(id=str(uuid.uuid4()), user_id=user.id, **body.model_dump())
    if count == 0:
        addr.is_default = True  # the first address is the default
    db.add(addr)
    db.flush()
    if addr.is_default:
        _clear_default(db, user, except_id=addr.id)
    db.commit()
    return _address_out(addr)


@router.put("/addresses/{address_id}")
def update_address(address_id: str, body: AddressBody, user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    addr = _own_address(db, user, address_id)
    for key, value in body.model_dump().items():
        setattr(addr, key, value)
    if addr.is_default:
        _clear_default(db, user, except_id=addr.id)
    db.commit()
    return _address_out(addr)


@router.delete("/addresses/{address_id}", status_code=204)
def delete_address(address_id: str, user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    addr = _own_address(db, user, address_id)
    was_default = addr.is_default
    db.delete(addr)
    db.flush()
    if was_default:
        nxt = db.query(m.Address).filter_by(user_id=user.id).order_by(m.Address.created_at).first()
        if nxt:
            nxt.is_default = True
    db.commit()


# ── Orders ─────────────────────────────────────────────────────────────────
class OrderItemIn(BaseModel):
    part_id: str = Field(min_length=1, max_length=100)
    sku: str = Field(default="", max_length=100)
    name: str = Field(min_length=1, max_length=300)
    brand: str = Field(default="", max_length=120)
    image: str = Field(default="", max_length=500)
    unit_price: float = Field(gt=0, le=100_000)
    quantity: int = Field(ge=1, le=99)


class OrderIn(BaseModel):
    client_ref: str = Field(min_length=8, max_length=64)
    address_id: str
    items: list[OrderItemIn] = Field(min_length=1, max_length=50)
    promo_code: str = Field(default="", max_length=30)


def order_out(o: m.Order) -> dict:
    return {
        "id": o.id,
        "number": o.number,
        "status": o.status,
        "items": json.loads(o.items_json),
        "address": json.loads(o.address_json),
        "history": json.loads(o.history_json),
        "promo_code": o.promo_code,
        "subtotal": o.subtotal,
        "discount": o.discount,
        "shipping": o.shipping,
        "vat": o.vat,
        "total": o.total,
        "created_at": _iso(o.created_at),
        "updated_at": _iso(o.updated_at),
        "can_cancel": o.status in CANCELLABLE,
    }


def _new_order_number(db: Session) -> str:
    for _ in range(10):
        number = f"MJ-{_now():%y%m%d}-{secrets.token_hex(2).upper()}"
        if not db.query(m.Order).filter_by(number=number).first():
            return number
    raise HTTPException(500, "Could not allocate an order number, please retry")


def _compute_totals(items: list[OrderItemIn], promo_code: str) -> dict:
    subtotal = round(sum(i.unit_price * i.quantity for i in items), 2)
    pct = 0
    code = promo_code.strip().upper()
    if code:
        if code not in PROMO_CODES:
            raise HTTPException(400, "That promo code isn't valid")
        pct = PROMO_CODES[code]
    discount = round(subtotal * pct / 100, 2)
    shipping = 0.0 if subtotal >= FREE_SHIPPING_FROM else SHIPPING_COST
    vat = round((subtotal - discount) * VAT_RATE, 2)
    total = round(subtotal - discount + shipping + vat, 2)
    return {"subtotal": subtotal, "discount": discount, "shipping": shipping, "vat": vat, "total": total}


@router.get("/orders")
def list_orders(user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(m.Order).filter_by(user_id=user.id).order_by(m.Order.created_at.desc()).limit(100).all()
    return [order_out(o) for o in rows]


@router.get("/orders/{order_id}")
def get_order(order_id: str, user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    o = db.get(m.Order, order_id)
    if not o or o.user_id != user.id:
        raise HTTPException(404, "Order not found")
    return order_out(o)


@router.post("/orders", status_code=201)
def place_order(body: OrderIn, user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Same client_ref from the same user = the same order (retry-safe).
    existing = db.query(m.Order).filter_by(user_id=user.id, client_ref=body.client_ref).first()
    if existing:
        return order_out(existing)

    addr = _own_address(db, user, body.address_id)
    totals = _compute_totals(body.items, body.promo_code)
    now = _now()
    order = m.Order(
        id=str(uuid.uuid4()),
        number=_new_order_number(db),
        user_id=user.id,
        client_ref=body.client_ref,
        status="received",
        items_json=json.dumps([i.model_dump() for i in body.items]),
        address_json=json.dumps(_address_out(addr)),
        history_json=json.dumps([{"status": "received", "at": _iso(now)}]),
        promo_code=body.promo_code.strip().upper(),
        created_at=now,
        updated_at=now,
        **totals,
    )
    db.add(order)
    try:
        db.commit()
    except IntegrityError:
        # Two identical requests raced; return the one that won.
        db.rollback()
        winner = db.query(m.Order).filter_by(user_id=user.id, client_ref=body.client_ref).first()
        if winner:
            return order_out(winner)
        raise
    return order_out(order)


def apply_status(order: m.Order, status: str):
    """Shared by customer cancel and the admin status change."""
    history = json.loads(order.history_json)
    history.append({"status": status, "at": _iso(_now())})
    order.status = status
    order.history_json = json.dumps(history)
    order.updated_at = _now()


@router.post("/orders/{order_id}/cancel")
def cancel_order(order_id: str, user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    o = db.get(m.Order, order_id)
    if not o or o.user_id != user.id:
        raise HTTPException(404, "Order not found")
    if o.status not in CANCELLABLE:
        raise HTTPException(400, "This order can no longer be cancelled online — please contact us")
    apply_status(o, "cancelled")
    db.commit()
    return order_out(o)


# ── Stock alerts ───────────────────────────────────────────────────────────
class AlertIn(BaseModel):
    part_id: str = Field(min_length=1, max_length=100)
    part_name: str = Field(default="", max_length=300)
    sku: str = Field(default="", max_length=100)


def _alert_out(a: m.StockAlert) -> dict:
    return {"id": a.id, "part_id": a.part_id, "part_name": a.part_name, "sku": a.sku, "created_at": _iso(a.created_at)}


@router.get("/stock-alerts")
def list_alerts(user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.query(m.StockAlert).filter_by(user_id=user.id).order_by(m.StockAlert.created_at.desc()).all()
    return [_alert_out(a) for a in rows]


@router.post("/stock-alerts", status_code=201)
def add_alert(body: AlertIn, user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(m.StockAlert).filter_by(user_id=user.id, part_id=body.part_id).first()
    if existing:
        return _alert_out(existing)
    if db.query(m.StockAlert).filter_by(user_id=user.id).count() >= MAX_ALERTS:
        raise HTTPException(400, f"You can watch up to {MAX_ALERTS} parts")
    alert = m.StockAlert(id=str(uuid.uuid4()), user_id=user.id, **body.model_dump())
    db.add(alert)
    db.commit()
    return _alert_out(alert)


@router.delete("/stock-alerts/{part_id}", status_code=204)
def remove_alert(part_id: str, user: m.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(m.StockAlert).filter_by(user_id=user.id, part_id=part_id).delete()
    db.commit()
