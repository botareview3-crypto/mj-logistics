"""Staff-side order handling for the /admin console (X-Admin-Token protected)."""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import db_models as m
from ..db import get_db
from .account import ORDER_STATUSES, apply_status, order_out
from .admin import require_admin

router = APIRouter(prefix="/api/admin", tags=["admin-orders"], dependencies=[Depends(require_admin)])


class StatusBody(BaseModel):
    status: str


@router.get("/orders")
def admin_list_orders(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(m.Order, m.User).join(m.User, m.User.id == m.Order.user_id)
    if status:
        q = q.filter(m.Order.status == status)
    rows = q.order_by(m.Order.created_at.desc()).limit(200).all()
    out = []
    for order, user in rows:
        data = order_out(order)
        data["customer"] = {"name": user.name, "email": user.email}
        out.append(data)
    return out


@router.patch("/orders/{order_id}/status")
def admin_set_status(order_id: str, body: StatusBody, db: Session = Depends(get_db)):
    if body.status not in ORDER_STATUSES:
        raise HTTPException(400, f"Status must be one of: {', '.join(ORDER_STATUSES)}")
    order = db.get(m.Order, order_id)
    if not order:
        raise HTTPException(404, "Order not found")
    if order.status != body.status:
        apply_status(order, body.status)
        db.commit()
    return order_out(order)


@router.get("/stock-alerts")
def admin_alert_demand(db: Session = Depends(get_db)):
    """How many customers are waiting on each part."""
    rows = (
        db.query(m.StockAlert.part_id, func.max(m.StockAlert.part_name), func.max(m.StockAlert.sku), func.count(m.StockAlert.id))
        .group_by(m.StockAlert.part_id)
        .order_by(func.count(m.StockAlert.id).desc())
        .all()
    )
    return [{"part_id": pid, "part_name": name, "sku": sku, "watchers": n} for pid, name, sku, n in rows]
