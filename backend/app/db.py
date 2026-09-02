import os
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# DATABASE_URL should point at a real Postgres instance in production (e.g. a
# Render Postgres add-on, Neon, or Supabase) since Render's free web-service
# disk is ephemeral and wiped on every redeploy/restart.
#
# Without DATABASE_URL set, this falls back to a local SQLite file — fine for
# local development, but accounts will NOT survive a redeploy on Render's
# free tier if you leave it unset there.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./autoparts_users.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
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
