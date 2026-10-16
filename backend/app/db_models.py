import datetime
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("provider", "provider_sub", name="uq_provider_identity"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    email: Mapped[str] = mapped_column(String(320), index=True)
    name: Mapped[str] = mapped_column(String(200), default="")
    avatar_url: Mapped[str] = mapped_column(String(500), default="")
    # "google", "apple", etc. — one row per (provider, provider account),
    # so the same email signing in via two different providers gets two rows.
    provider: Mapped[str] = mapped_column(String(30))
    provider_sub: Mapped[str] = mapped_column(String(255))  # provider's stable user id ("sub" claim)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)


# ── Account features: addresses, orders, synced cart/garage, stock alerts ──
# All of these are NEW tables, so `init_db()` (Base.metadata.create_all)
# creates them on the next boot without touching the existing users table.

class Address(Base):
    __tablename__ = "addresses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    label: Mapped[str] = mapped_column(String(60), default="")
    full_name: Mapped[str] = mapped_column(String(200))
    phone: Mapped[str] = mapped_column(String(40), default="")
    line1: Mapped[str] = mapped_column(String(200))
    line2: Mapped[str] = mapped_column(String(200), default="")
    city: Mapped[str] = mapped_column(String(120))
    region: Mapped[str] = mapped_column(String(120), default="")
    postal_code: Mapped[str] = mapped_column(String(30), default="")
    country: Mapped[str] = mapped_column(String(120))
    is_default: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)


class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (UniqueConstraint("user_id", "client_ref", name="uq_order_client_ref"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    number: Mapped[str] = mapped_column(String(30), unique=True, index=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    # Lets the browser retry a request (cold-starting backend, double click)
    # without creating a second order.
    client_ref: Mapped[str] = mapped_column(String(64), default="")
    # received -> confirmed -> packed -> dispatched -> delivered, or cancelled.
    status: Mapped[str] = mapped_column(String(20), default="received", index=True)
    # JSON snapshots: items as they were at checkout, the delivery address,
    # and [{status, at}] for the tracking timeline.
    items_json: Mapped[str] = mapped_column(Text)
    address_json: Mapped[str] = mapped_column(Text)
    history_json: Mapped[str] = mapped_column(Text, default="[]")
    promo_code: Mapped[str] = mapped_column(String(30), default="")
    subtotal: Mapped[float] = mapped_column(Float)
    discount: Mapped[float] = mapped_column(Float, default=0.0)
    shipping: Mapped[float] = mapped_column(Float, default=0.0)
    vat: Mapped[float] = mapped_column(Float, default=0.0)
    total: Mapped[float] = mapped_column(Float)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)


class UserCart(Base):
    """One row per user: the signed-in user's cart as [{partId, quantity, addedForVehicle}]."""
    __tablename__ = "user_carts"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), primary_key=True)
    data: Mapped[str] = mapped_column(Text, default="[]")
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)


class UserGarage(Base):
    """One row per user: saved vehicles (JSON list) and which one is active."""
    __tablename__ = "user_garages"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), primary_key=True)
    vehicles: Mapped[str] = mapped_column(Text, default="[]")
    active_vehicle_id: Mapped[str] = mapped_column(String(100), default="")
    updated_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)


class StockAlert(Base):
    __tablename__ = "stock_alerts"
    __table_args__ = (UniqueConstraint("user_id", "part_id", name="uq_alert_user_part"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    part_id: Mapped[str] = mapped_column(String(100), index=True)
    part_name: Mapped[str] = mapped_column(String(300), default="")
    sku: Mapped[str] = mapped_column(String(100), default="")
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)
