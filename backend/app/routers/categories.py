from fastapi import APIRouter, HTTPException
from .. import data

router = APIRouter(prefix="/api/categories", tags=["categories"])


def _serialize(cat) -> dict:
    return {
        "id": cat.id, "name": cat.name, "slug": cat.slug,
        "level": cat.level, "children": [
            _serialize(c) for c in data.category_children(cat.id)
        ],
    }


@router.get("")
def full_tree():
    roots = data.category_children(None)
    return [_serialize(r) for r in roots]


@router.get("/{slug}")
def get_category(slug: str):
    cat = data.category_by_slug(slug)
    if not cat:
        raise HTTPException(404, "Category not found")
    return _serialize(cat)


@router.get("/{slug}/breadcrumb")
def breadcrumb(slug: str):
    cat = data.category_by_slug(slug)
    if not cat:
        raise HTTPException(404, "Category not found")
    trail = [cat]
    parent_id = cat.parent_id
    while parent_id:
        parent = data.CATEGORIES[parent_id]
        trail.insert(0, parent)
        parent_id = parent.parent_id
    return trail


@router.get("/{slug}/part-types")
def part_types(slug: str):
    """Return filter facets for a level-three (product) category."""
    cat = data.category_by_slug(slug)
    if not cat:
        raise HTTPException(404, "Category not found")
    if cat.level != 3:
        raise HTTPException(400, "Part types are available on subsystem categories only")
    return sorted({part.part_type for part in data.parts_in_category(cat.id)})
