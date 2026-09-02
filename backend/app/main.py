import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import vehicles, categories, parts, admin

app = FastAPI(title="Auto Parts Catalog API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vehicles.router)
app.include_router(categories.router)
app.include_router(parts.router)
app.include_router(admin.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/site/settings")
def public_site_settings():
    """Public, read-only settings consumed by the storefront shell."""
    return admin.SITE_SETTINGS
