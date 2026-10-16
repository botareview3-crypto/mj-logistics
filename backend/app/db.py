import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# DATABASE_URL should point at a real Postgres instance in production (we use
# Neon's free plan, which doesn't expire; Render's free Postgres does) since Render's free web-service
# disk is ephemeral and wiped on every redeploy/restart.
#
# Without DATABASE_URL set, this falls back to a local SQLite file — fine for
# local development, but accounts will NOT survive a redeploy on Render's
# free tier if you leave it unset there.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./autoparts_users.db")

# Some providers hand out `postgres://...`, which SQLAlchemy 2 rejects.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = "postgresql://" + DATABASE_URL[len("postgres://"):]

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
# pool_pre_ping / pool_recycle: serverless Postgres (Neon) suspends idle
# compute and drops idle connections, so test a connection before using it
# and retire pooled ones early instead of failing the first request.
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=240,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # Import models so they're registered on Base.metadata before create_all.
    from . import db_models  # noqa: F401
    Base.metadata.create_all(bind=engine)
