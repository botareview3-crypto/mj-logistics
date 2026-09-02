import os
import datetime
import jwt
from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from . import db_models
from .db import get_db

# Set a long, random JWT_SECRET in production — this fallback is only for
# local development so the server boots without extra setup.
JWT_SECRET = os.getenv("JWT_SECRET", "dev-only-insecure-secret-change-me")
JWT_ALG = "HS256"
JWT_TTL_DAYS = 30


def create_session_token(user: db_models.User) -> str:
    payload = {
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "avatar_url": user.avatar_url,
        "provider": user.provider,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=JWT_TTL_DAYS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_session_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.PyJWTError:
        raise HTTPException(401, "Invalid or expired session")


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> db_models.User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "Missing bearer token")
    token = authorization.split(" ", 1)[1]
    claims = decode_session_token(token)
    user = db.get(db_models.User, claims["sub"])
    if not user:
        raise HTTPException(401, "User no longer exists")
    return user


def get_current_user_optional(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> db_models.User | None:
    if not authorization:
        return None
    try:
        return get_current_user(authorization, db)
    except HTTPException:
        return None
