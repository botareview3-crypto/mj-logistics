"""
Export the live catalog (parts, fitments, categories, brands) out of the
running backend into CSVs, ready for a WordPress/WooCommerce import.

Why this hits the LIVE API instead of reading data.py directly: the backend's
storage is in-memory only (see CLAUDE.md), so anything added or edited
through the admin console since the last restart — including uploaded
photos — exists only in that running process, not in the seed-data source
file. Reading data.py would silently miss all of that.

Usage:
    python export_catalog.py --api-base https://mj-logistics-backend-7crs.onrender.com --admin-token YOUR_TOKEN

Or set env vars instead of flags:
    set API_BASE=https://mj-logistics-backend-7crs.onrender.com
    set ADMIN_TOKEN=your-token-here
    python export_catalog.py

Only uses the Python standard library — nothing to pip install.
Writes four files into ./export/:
  - products.csv    (WooCommerce product-importer format)
  - fitments.csv    (part SKU -> vehicle compatibility, for your fitment plugin)
  - categories.csv  (full category tree, for reference while setting up WooCommerce categories)
  - brands.csv      (for reference while setting up WooCommerce brand taxonomy/attribute)
"""
import argparse
import csv
import json
import os
import sys
import urllib.error
import urllib.request


def fetch_json(url: str, admin_token: str | None = None) -> object:
    req = urllib.request.Request(url)
    if admin_token:
        req.add_header("X-Admin-Token", admin_token)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        print(f"Request to {url} failed: HTTP {exc.code}\n{body}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as exc:
        print(f"Could not reach {url}: {exc.reason}", file=sys.stderr)
        sys.exit(1)


def category_path(cat_id: str, categories_by_id: dict) -> str:
    """Build 'Car Parts > Braking System > Brake Discs' from a category id."""
    parts = []
    current = categories_by_id.get(cat_id)
    while current:
        parts.append(current["name"])
        current = categories_by_id.get(current.get("parent_id"))
    return " > ".join(reversed(parts))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--api-base", default=os.getenv("API_BASE", "http://localhost:8000"))
    parser.add_argument("--admin-token", default=os.getenv("ADMIN_TOKEN"))
    parser.add_argument("--out-dir", default="export")
    args = parser.parse_args()

    if not args.admin_token:
        print("Missing admin token. Pass --admin-token or set ADMIN_TOKEN.", file=sys.stderr)
        sys.exit(1)

    api = args.api_base.rstrip("/")
    os.makedirs(args.out_dir, exist_ok=True)

    print("Fetching live parts from admin API...")
    parts = fetch_json(f"{api}/api/admin/parts", args.admin_token)
    print(f"  {len(parts)} parts")

    print("Fetching category tree...")
    categories_tree = fetch_json(f"{api}/api/categories")
    # Flatten the tree (however it's nested) into a flat list keyed by slug/id if needed.
    # The public /api/categories response shape mirrors the Category model fields per node.
    flat_categories = []

    def _flatten(node, parent_id=None):
        flat_categories.append({
            "id": node.get("id"), "name": node.get("name"), "slug": node.get("slug"),
            "parent_id": node.get("parent_id", parent_id), "level": node.get("level"),
        })
        for child in node.get("children", []) or []:
            _flatten(child, node.get("id"))

    if isinstance(categories_tree, list):
        for node in categories_tree:
            _flatten(node)
    else:
        _flatten(categories_tree)

    categories_by_id = {c["id"]: c for c in flat_categories}
    categories_by_slug = {c["slug"]: c for c in flat_categories}
    print(f"  {len(flat_categories)} categories")

    # ── categories.csv ──────────────────────────────────────────────────────
    with open(os.path.join(args.out_dir, "categories.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["id", "name", "slug", "parent_id", "level", "full_path"])
        w.writeheader()
        for c in flat_categories:
            w.writerow({**c, "full_path": category_path(c["id"], categories_by_id)})

    # ── brands.csv (derived from what's actually used on parts) ────────────
    brand_names = sorted({p["brand"] for p in parts if p.get("brand")})
    with open(os.path.join(args.out_dir, "brands.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["name"])
        for name in brand_names:
            w.writerow([name])
    print(f"  {len(brand_names)} distinct brands")

    # ── products.csv (WooCommerce product-importer format) ─────────────────
    fieldnames = [
        "SKU", "Name", "Description", "Short description",
        "Regular price", "Sale price", "In stock?", "Stock",
        "Categories", "Images",
        "Attribute 1 name", "Attribute 1 value(s)",
        "Attribute 2 name", "Attribute 2 value(s)",
        "Attribute 3 name", "Attribute 3 value(s)",
        "Meta: rating", "Meta: review_count", "Meta: warranty_years",
        "Meta: delivery_days", "Meta: featured", "Meta: bestseller",
    ]
    with open(os.path.join(args.out_dir, "products.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for p in parts:
            cat = categories_by_slug.get(p.get("category_slug"))
            original_price = p.get("original_price")
            price = p.get("price")
            has_discount = original_price is not None and original_price > price
            # The admin list endpoint doesn't include the full description —
            # fetch it from the public single-part endpoint, which does.
            full_part = fetch_json(f"{api}/api/parts/{p['id']}")
            w.writerow({
                "SKU": p["sku"],
                "Name": p["name"],
                "Description": full_part.get("description", ""),
                "Short description": p.get("part_type", ""),
                "Regular price": original_price if has_discount else price,
                "Sale price": price if has_discount else "",
                "In stock?": 1 if p.get("stock_qty", 0) > 0 else 0,
                "Stock": p.get("stock_qty", 0),
                "Categories": category_path(cat["id"], categories_by_id) if cat else "",
                "Images": ", ".join(p.get("images", [])),
                "Attribute 1 name": "Brand", "Attribute 1 value(s)": p.get("brand", ""),
                "Attribute 2 name": "Part Type", "Attribute 2 value(s)": p.get("part_type", ""),
                "Attribute 3 name": "OEM Numbers", "Attribute 3 value(s)": ", ".join(p.get("oem_numbers", [])),
                "Meta: rating": p.get("rating", 0),
                "Meta: review_count": p.get("review_count", 0),
                "Meta: warranty_years": p.get("warranty_years", 1),
                "Meta: delivery_days": p.get("delivery_days", 3),
                "Meta: featured": p.get("featured", False),
                "Meta: bestseller": p.get("bestseller", False),
            })

    # ── fitments.csv ─────────────────────────────────────────────────────
    print("Fetching fitments per part...")
    fitment_rows = []
    for p in parts:
        fitments = fetch_json(f"{api}/api/parts/{p['id']}/fitments")
        for fm in fitments:
            fitment_rows.append({
                "part_sku": p["sku"], "part_name": p["name"],
                "make": fm.get("make", ""), "model": fm.get("model", ""),
                "generation": fm.get("generation", ""),
                "year_from": fm.get("year_from", ""), "year_to": fm.get("year_to", ""),
                "engine_code": fm.get("engine_code", ""), "position": fm.get("position", ""),
            })
    with open(os.path.join(args.out_dir, "fitments.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=[
            "part_sku", "part_name", "make", "model", "generation",
            "year_from", "year_to", "engine_code", "position",
        ])
        w.writeheader()
        w.writerows(fitment_rows)
    print(f"  {len(fitment_rows)} fitment records across all parts")

    print(f"\nDone. Files written to ./{args.out_dir}/")


if __name__ == "__main__":
    main()
