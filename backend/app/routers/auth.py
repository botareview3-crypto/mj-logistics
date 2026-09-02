"""
Social sign-in (Google, Apple, ...).

Flow (works with a static-exported frontend that has no server of its own):
  1. Frontend sends the browser to        GET /api/auth/{provider}/login
  2. We redirect to the provider's consent screen.
  3. Provider redirects back to           /api/auth/{provider}/callback
  4. We exchange the code, upsert a User row, mint our own JWT, and redirect
     the browser to FRONTEND_URL/account?token=<jwt> so the SPA can pick it
     up and store it (see frontend/lib/auth.ts).

Required env vars (see README-AUTH.md for full setup steps):
  JWT_SECRET, SESSION_SECRET, FRONTEND_URL
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
  APPLE_CLIENT_ID (Services ID), APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY
"""
import os
import time
import uuid
from urllib.parse import urlencode
import httpx
import jwt as pyjwt
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.orm import Session

from .. import db_models
from ..db import get_db
from ..auth import create_session_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

oauth = OAuth()
oauth.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    client_kwargs={"scope": "openid email profile"},
)

# Providers you can add later just by registering them the same way Google is
# above (Authlib ships presets for facebook, github, microsoft, etc.) — that
# covers the "etc" in "Google, Apple, etc" with minimal new code.
SUPPORTED_SIMPLE_PROVIDERS = {"google"}


def _apple_client_secret() -> str:
    """Apple doesn't take a static client secret — it wants a short-lived JWT
    signed with your Sign in with Apple private key (ES256)."""
    team_id = os.getenv("APPLE_TEAM_ID")
    key_id = os.getenv("APPLE_KEY_ID")
    client_id = os.getenv("APPLE_CLIENT_ID")
    private_key = os.getenv("APPLE_PRIVATE_KEY", "").replace("\\n", "\n")
    if not all([team_id, key_id, client_id, private_key]):
        raise HTTPException(500, "Apple sign-in is not configured on the server yet")
    now = int(time.time())
    payload = {
        "iss": team_id,
        "iat": now,
        "exp": now + 3600,
        "aud": "https://appleid.apple.com",
        "sub": client_id,
    }
    return pyjwt.encode(payload, private_key, algorithm="ES256", headers={"kid": key_id})


def _upsert_user(db: Session, provider: str, provider_sub: str, email: str, name: str, avatar_url: str = "") -> db_models.User:
    user = (
        db.query(db_models.User)
        .filter_by(provider=provider, provider_sub=provider_sub)
        .one_or_none()
    )
    if user:
        # Keep the profile fresh, but don't blank out a name/avatar we
        # already have if this login didn't return one (Apple only sends
        # name on the very first authorization).
        user.email = email or user.email
        user.name = name or user.name
        user.avatar_url = avatar_url or user.avatar_url
    else:
        user = db_models.User(
            id=str(uuid.uuid4()), provider=provider, provider_sub=provider_sub,
            email=email, name=name, avatar_url=avatar_url,
        )
        db.add(user)
    db.commit()
    db.refresh(user)
    return user


def _redirect_with_token(user: db_models.User) -> RedirectResponse:
    token = create_session_token(user)
    return RedirectResponse(f"{FRONTEND_URL}/account?token={token}")


def _redirect_with_error(message: str) -> RedirectResponse:
    return RedirectResponse(f"{FRONTEND_URL}/account?auth_error={message}")


@router.get("/{provider}/login")
async def login(provider: str, request: Request):
    if provider == "apple":
        if not all([os.getenv("APPLE_CLIENT_ID"), os.getenv("APPLE_TEAM_ID"), os.getenv("APPLE_KEY_ID"), os.getenv("APPLE_PRIVATE_KEY")]):
            return _redirect_with_error("apple_not_configured")
        params = {
            "response_type": "code",
            "response_mode": "form_post",  # Apple requires this to get name/email
            "client_id": os.getenv("APPLE_CLIENT_ID", ""),
            "redirect_uri": f"{BACKEND_URL}/api/auth/apple/callback",
            "scope": "name email",
            "state": str(uuid.uuid4()),
        }
        return RedirectResponse(f"https://appleid.apple.com/auth/authorize?{urlencode(params)}")
    if provider in SUPPORTED_SIMPLE_PROVIDERS:
        if not os.getenv("GOOGLE_CLIENT_ID") or not os.getenv("GOOGLE_CLIENT_SECRET"):
            return _redirect_with_error(f"{provider}_not_configured")
        client = oauth.create_client(provider)
        redirect_uri = f"{BACKEND_URL}/api/auth/{provider}/callback"
        return await client.authorize_redirect(request, redirect_uri)
    raise HTTPException(404, f"Unknown provider '{provider}'")


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        client = oauth.create_client("google")
        token = await client.authorize_access_token(request)
        userinfo = token.get("userinfo") or await client.userinfo(token=token)
    except Exception:
        return _redirect_with_error("google_sign_in_failed")
    user = _upsert_user(
        db, provider="google", provider_sub=userinfo["sub"],
        email=userinfo.get("email", ""), name=userinfo.get("name", ""),
        avatar_url=userinfo.get("picture", ""),
    )
    return _redirect_with_token(user)


@router.post("/apple/callback")
async def apple_callback(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    code = form.get("code")
    if not code:
        return _redirect_with_error("apple_sign_in_failed")

    async with httpx.AsyncClient() as http_client:
        resp = await http_client.post(
            "https://appleid.apple.com/auth/token",
            data={
                "client_id": os.getenv("APPLE_CLIENT_ID", ""),
                "client_secret": _apple_client_secret(),
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": f"{BACKEND_URL}/api/auth/apple/callback",
            },
        )
    if resp.status_code != 200:
        return _redirect_with_error("apple_sign_in_failed")
    token_data = resp.json()
    id_claims = pyjwt.decode(token_data["id_token"], options={"verify_signature": False})

    # Apple only sends the user's name (as a JSON string in the "user" form
    # field) on the very first authorization ever — capture it if present.
    name = ""
    user_blob = form.get("user")
    if user_blob:
        import json
        try:
            parsed = json.loads(user_blob)
            name = " ".join(filter(None, [parsed.get("name", {}).get("firstName"), parsed.get("name", {}).get("lastName")]))
        except (ValueError, AttributeError):
            pass

    user = _upsert_user(
        db, provider="apple", provider_sub=id_claims["sub"],
        email=id_claims.get("email", ""), name=name,
    )
    return _redirect_with_token(user)


@router.get("/me")
def me(current_user: db_models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "avatar_url": current_user.avatar_url,
        "provider": current_user.provider,
    }


@router.post("/logout")
def logout():
    # Sessions are stateless JWTs, so there's nothing to invalidate
    # server-side yet — the frontend just deletes the stored token.
    return {"ok": True}
