import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .routers import vehicles, categories, parts, admin, auth
from .db import init_db

app = FastAPI(title="Auto Parts Catalog API", version="0.1.0")

# Creates the users table (and any future ones) on the configured database —
# see app/db.py for how DATABASE_URL controls where that lives.
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authlib's OAuth client stores a short-lived `state` value in the request
# session while the user is off on Google's consent screen — this is what
# makes that possible. SESSION_SECRET should be a long random string in
# production (falls back to a dev-only value so local runs still work).
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET", "dev-only-insecure-secret-change-me"))

app.include_router(vehicles.router)
app.include_router(categories.router)
app.include_router(parts.router)
app.include_router(admin.router)
app.include_router(auth.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/site/settings")
def public_site_settings():
    """Public, read-only settings consumed by the storefront shell."""
    return admin.SITE_SETTINGS
