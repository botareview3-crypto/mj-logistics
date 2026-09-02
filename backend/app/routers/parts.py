from fastapi import APIRouter, HTTPException
from .. import data

router = APIRouter(prefix="/api/parts", tags=["parts"])


def _serialize(p) -> dict:
    brand = data.BRANDS.get(p.brand_id)
    return {
        "id": p.id, "sku": p.sku, "name": p.name, "part_type": p.part_type,
        "brand": brand.name if brand else None, "price": p.price,
        "stock_qty": p.stock_qty, "attributes": p.attributes, "universal": p.universal,
        "oem_numbers": p.oem_numbers,
    }


@router.get("")
def list_parts(category_slug: str | None = None, part_type: str | None = None,
               brand: str | None = None, vehicle_id: str | None = None,
               page: int = 1, page_size: int = 20):
    if page < 1 or not 1 <= page_size <= 100:
        raise HTTPException(422, "page must be positive and page_size must be between 1 and 100")
    results = list(data.PARTS.values())

    if category_slug:
        cat = data.category_by_slug(category_slug)
        if not cat:
            raise HTTPException(404, "Category not found")
        results = [p for p in results if p.category_id == cat.id]

    if part_type:
        results = [p for p in results if p.part_type.casefold() == part_type.casefold()]

    if brand:
        brand_ids = {bid for bid, b in data.BRANDS.items() if b.name.lower() == brand.lower()}
        results = [p for p in results if p.brand_id in brand_ids]

    fits_badge = {}
    if vehicle_id:
        vehicle = data.VEHICLES.get(vehicle_id)
        if not vehicle:
            raise HTTPException(404, "Vehicle not found")
        results = [p for p in results if data.part_fits_vehicle(p, vehicle)]
        fits_badge = {p.id: True for p in results}

    available_part_types = sorted({p.part_type for p in results})
    available_brands = sorted({data.BRANDS[p.brand_id].name for p in results if p.brand_id in data.BRANDS})

    start = (page - 1) * page_size
    page_items = results[start:start + page_size]

    return {
        "total": len(results),
        "page": page,
        "page_size": page_size,
        "filters": {"part_types": available_part_types, "brands": available_brands},
        "items": [
            {**_serialize(p), "fits_vehicle": fits_badge.get(p.id, False) if vehicle_id else None}
            for p in page_items
        ],
    }


@router.get("/search")
def search_parts(q: str, vehicle_id: str | None = None):
    q_lower = q.lower()
    results = [
        p for p in data.PARTS.values()
        if q_lower in p.name.lower()
        or q_lower in p.sku.lower()
        or any(q_lower in oem.lower() for oem in p.oem_numbers)
        or q_lower in data.BRANDS.get(p.brand_id, data.Brand(id="", name="")).name.lower()
    ]
    if vehicle_id:
        vehicle = data.VEHICLES.get(vehicle_id)
        if vehicle:
            results = [p for p in results if data.part_fits_vehicle(p, vehicle)]
    return {"query": q, "total": len(results), "items": [_serialize(p) for p in results]}


@router.get("/{part_id}")
def get_part(part_id: str):
    part = data.PARTS.get(part_id)
    if not part:
        raise HTTPException(404, "Part not found")
    cat = data.CATEGORIES.get(part.category_id)
    return {
        **_serialize(part),
        "description": part.description,
        "category": {"id": cat.id, "name": cat.name, "slug": cat.slug} if cat else None,
    }


@router.get("/{part_id}/fitments")
def part_fitments(part_id: str):
    if part_id not in data.PARTS:
        raise HTTPException(404, "Part not found")
    return data.fitments_for_part(part_id)
