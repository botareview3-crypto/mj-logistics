import os
import cloudinary.uploader
from fastapi import APIRouter, Depends, Header, HTTPException, UploadFile, File
from .. import data
from .. import cloudinary_config  # noqa: F401 — importing runs cloudinary.config()
from ..models import AdminPartCreate, AdminPartUpdate, Fitment, Part, SiteSettings

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Set ADMIN_TOKEN in the environment before deploying. The development value is
# intentional so a new local checkout can exercise the console immediately.
DEVELOPMENT_TOKEN = "change-me-before-production"
SITE_SETTINGS = SiteSettings()


def require_admin(x_admin_token: str | None = Header(default=None)):
    expected = os.getenv("ADMIN_TOKEN", DEVELOPMENT_TOKEN)
    if x_admin_token != expected:
        raise HTTPException(401, "Invalid admin token")


def serialize(part: Part) -> dict:
    brand = data.BRANDS.get(part.brand_id)
    category = data.CATEGORIES.get(part.category_id)
    return {
        "id": part.id, "sku": part.sku, "name": part.name, "part_type": part.part_type,
        "brand": brand.name if brand else "", "category_slug": category.slug if category else "",
        "price": part.price, "stock_qty": part.stock_qty, "attributes": part.attributes,
        "oem_numbers": part.oem_numbers, "universal": part.universal,
    }


@router.get("/overview", dependencies=[Depends(require_admin)])
def overview():
    return {
        "parts": len(data.PARTS), "categories": len(data.CATEGORIES), "brands": len(data.BRANDS),
        "low_stock": len([part for part in data.PARTS.values() if part.stock_qty <= 5]),
        "settings": SITE_SETTINGS.model_dump(),
    }


@router.get("/parts", dependencies=[Depends(require_admin)])
def list_parts(q: str = ""):
    query = q.casefold().strip()
    parts = [serialize(part) for part in data.PARTS.values()]
    if query:
        parts = [part for part in parts if query in part["name"].casefold() or query in part["sku"].casefold()]
    return sorted(parts, key=lambda part: part["name"])


@router.post("/parts", status_code=201, dependencies=[Depends(require_admin)])
def create_part(payload: AdminPartCreate):
    category = data.category_by_slug(payload.category_slug)
    if not category or category.level != 3:
        raise HTTPException(422, "category_slug must identify a subsystem category")
    if any(part.sku.casefold() == payload.sku.casefold() for part in data.PARTS.values()):
        raise HTTPException(409, "SKU already exists")
    part_id = data.next_id("part")
    part = Part(
        id=part_id, sku=payload.sku.strip(), name=payload.name.strip(), category_id=category.id,
        part_type=payload.part_type.strip(), brand_id=data.brand_id_for_name(payload.brand),
        price=payload.price, stock_qty=payload.stock_qty, attributes={
            **payload.attributes,
            **({"position": payload.position} if payload.position else {}),
            **({"vin_reference": payload.vin_reference} if payload.vin_reference else {}),
        },
        oem_numbers=payload.oem_numbers, universal=payload.universal,
        description=payload.description or "Added from the staff admin console.", images=[],
    )
    data.PARTS[part_id] = part
    if payload.fitment_make and payload.fitment_model and payload.fitment_year_from:
        fitment_id = data.next_id("fit")
        data.FITMENTS[fitment_id] = Fitment(
            id=fitment_id, part_id=part_id, make=payload.fitment_make,
            model=payload.fitment_model, generation=payload.fitment_generation,
            year_from=payload.fitment_year_from, year_to=payload.fitment_year_to,
            engine_code=payload.fitment_engine_code, position=payload.position,
        )
    return serialize(part)


@router.patch("/parts/{part_id}", dependencies=[Depends(require_admin)])
def update_part(part_id: str, payload: AdminPartUpdate):
    current = data.PARTS.get(part_id)
    if not current:
        raise HTTPException(404, "Part not found")
    changes = payload.model_dump(exclude_none=True)
    if "brand" in changes:
        changes["brand_id"] = data.brand_id_for_name(changes.pop("brand"))
    data.PARTS[part_id] = current.model_copy(update=changes)
    return serialize(data.PARTS[part_id])


@router.delete("/parts/{part_id}", status_code=204, dependencies=[Depends(require_admin)])
def remove_part(part_id: str):
    if part_id not in data.PARTS:
        raise HTTPException(404, "Part not found")
    data.delete_part(part_id)


@router.post("/parts/{part_id}/images", dependencies=[Depends(require_admin)])
def upload_part_image(part_id: str, file: UploadFile = File(...)):
    current = data.PARTS.get(part_id)
    if not current:
        raise HTTPException(404, "Part not found")
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(422, "File must be an image")

    try:
        result = cloudinary.uploader.upload(
            file.file,
            folder=f"mj-logistics/parts/{part_id}",
        )
    except Exception as exc:  # cloudinary raises its own error types
        raise HTTPException(502, f"Cloudinary upload failed: {exc}") from exc

    image_url = result["secure_url"]
    updated_images = [*current.images, image_url]
    data.PARTS[part_id] = current.model_copy(update={"images": updated_images})
    return serialize(data.PARTS[part_id])


@router.delete("/parts/{part_id}/images", dependencies=[Depends(require_admin)])
def remove_part_image(part_id: str, image_url: str):
    current = data.PARTS.get(part_id)
    if not current:
        raise HTTPException(404, "Part not found")
    if image_url not in current.images:
        raise HTTPException(404, "Image not found on this part")
    remaining = [url for url in current.images if url != image_url]
    data.PARTS[part_id] = current.model_copy(update={"images": remaining})
    return serialize(data.PARTS[part_id])


@router.get("/settings", dependencies=[Depends(require_admin)])
def get_settings():
    return SITE_SETTINGS


@router.put("/settings", dependencies=[Depends(require_admin)])
def update_settings(payload: SiteSettings):
    global SITE_SETTINGS
    SITE_SETTINGS = payload
    return SITE_SETTINGS
