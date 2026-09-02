"""
In-memory seed data / repository layer.

This is intentionally storage-agnostic: swap the functions in this file for
real MongoDB (motor) calls later without touching the routers, since routers
only call these functions, never touch the raw dicts directly.
"""
from itertools import count
from .models import Category, Brand, Part, Fitment, Vehicle

_id = count(1)


def next_id(prefix: str) -> str:
    return f"{prefix}-{next(_id)}"


# ---------------------------------------------------------------------------
# Categories: Root (level 1) -> System (level 2) -> Subsystem (level 3)
# ---------------------------------------------------------------------------
CATEGORIES: dict[str, Category] = {}


def _add_category(name: str, slug: str, parent_id: str | None, level: int) -> str:
    cid = next_id("cat")
    CATEGORIES[cid] = Category(id=cid, name=name, slug=slug, parent_id=parent_id, level=level)
    return cid


car_parts_root = _add_category("Car Parts", "car-parts", None, 1)
accessories_root = _add_category("Accessories and Equipment", "accessories-and-equipment", None, 1)

# Systems under Car Parts
braking_system = _add_category("Braking System", "braking-system", car_parts_root, 2)
engine = _add_category("Engine", "engine", car_parts_root, 2)
suspension = _add_category("Suspension and Steering", "suspension-and-steering", car_parts_root, 2)
exhaust_system = _add_category("Exhaust System", "exhaust-system", car_parts_root, 2)
filters = _add_category("Filters", "filters", car_parts_root, 2)

# Subsystems under Braking System
brake_pads = _add_category("Brake Pads", "brake-pads", braking_system, 3)
brake_discs = _add_category("Brake Discs", "brake-discs", braking_system, 3)
brake_calipers = _add_category("Brake Calipers", "brake-calipers", braking_system, 3)

# Subsystems under Engine
timing_system = _add_category("Timing System", "timing-system", engine, 3)
engine_mounts = _add_category("Engine Mounts", "engine-mounts", engine, 3)

# Subsystems under Suspension
shock_absorbers = _add_category("Shock Absorbers / Struts", "shock-absorbers-struts", suspension, 3)
control_arms = _add_category("Control Arms", "control-arms", suspension, 3)

# Subsystems under Exhaust System
individual_assembly_parts = _add_category(
    "Individual Assembly Parts", "individual-assembly-parts", exhaust_system, 3
)
catalytic_converters = _add_category("Catalytic Converters", "catalytic-converters", exhaust_system, 3)

# Subsystems under Filters
oil_filters = _add_category("Oil Filters", "oil-filters", filters, 3)
air_filters = _add_category("Air Filters", "air-filters", filters, 3)
cabin_filters = _add_category("Cabin Filters", "cabin-filters", filters, 3)

# Systems under Accessories
fluids = _add_category("Fluids and Consumables", "fluids-and-consumables", accessories_root, 2)
wipers = _add_category("Wiper Blades", "wiper-blades", accessories_root, 2)

fluids_engine_oil = _add_category("Engine Oil", "engine-oil", fluids, 3)
wiper_blades_front = _add_category("Wiper Blades - Front", "wiper-blades-front", wipers, 3)


# ---------------------------------------------------------------------------
# Brands
# ---------------------------------------------------------------------------
BRANDS: dict[str, Brand] = {}


def _add_brand(name: str) -> str:
    bid = next_id("brand")
    BRANDS[bid] = Brand(id=bid, name=name)
    return bid


bosch = _add_brand("Bosch")
brembo = _add_brand("Brembo")
ate = _add_brand("ATE")
mann_filter = _add_brand("Mann-Filter")
monroe = _add_brand("Monroe")
febi = _add_brand("Febi Bilstein")


# ---------------------------------------------------------------------------
# Vehicles (a small reference set of makes/models/generations/engines)
# ---------------------------------------------------------------------------
VEHICLES: dict[str, Vehicle] = {}


def _add_vehicle(**kwargs) -> str:
    vid = next_id("veh")
    VEHICLES[vid] = Vehicle(id=vid, **kwargs)
    return vid


golf_mk7_tdi = _add_vehicle(
    make="Volkswagen", model="Golf", generation="Mk7", year_from=2013, year_to=2019,
    engine_code="CRBC", fuel_type="Diesel", displacement_cc=1598, power_hp=115,
    transmission_type="Manual", body_type="Hatchback",
)
golf_mk7_tsi = _add_vehicle(
    make="Volkswagen", model="Golf", generation="Mk7", year_from=2013, year_to=2019,
    engine_code="CHPA", fuel_type="Petrol", displacement_cc=1395, power_hp=125,
    transmission_type="Manual", body_type="Hatchback",
)
corolla_e210 = _add_vehicle(
    make="Toyota", model="Corolla", generation="E210", year_from=2018, year_to=2023,
    engine_code="2ZR-FXE", fuel_type="Hybrid", displacement_cc=1798, power_hp=122,
    transmission_type="CVT", body_type="Hatchback",
)
focus_mk4 = _add_vehicle(
    make="Ford", model="Focus", generation="Mk4", year_from=2018, year_to=2024,
    engine_code="M9DA", fuel_type="Petrol", displacement_cc=999, power_hp=125,
    transmission_type="Manual", body_type="Hatchback",
)

MAKES_MODELS: dict[str, dict[str, list[str]]] = {}
for v in VEHICLES.values():
    MAKES_MODELS.setdefault(v.make, {}).setdefault(v.model, [])
    if v.generation and v.generation not in MAKES_MODELS[v.make][v.model]:
        MAKES_MODELS[v.make][v.model].append(v.generation)


# ---------------------------------------------------------------------------
# Parts + Fitments
# ---------------------------------------------------------------------------
PARTS: dict[str, Part] = {}
FITMENTS: dict[str, Fitment] = {}


def _add_part(category_id: str, part_type: str, name: str, brand_id: str, price: float,
              oem_numbers: list[str] | None = None, universal: bool = False,
              attributes: dict | None = None) -> str:
    pid = next_id("part")
    sku = f"SKU{pid.split('-')[1].zfill(5)}"
    PARTS[pid] = Part(
        id=pid, sku=sku, name=name, category_id=category_id, part_type=part_type,
        brand_id=brand_id, oem_numbers=oem_numbers or [], price=price, stock_qty=50,
        attributes=attributes or {}, images=[], description=f"{name} — {sku}",
        universal=universal,
    )
    return pid


def _add_fitment(part_id: str, vehicle_id: str, position: str | None = None) -> None:
    v = VEHICLES[vehicle_id]
    fid = next_id("fit")
    FITMENTS[fid] = Fitment(
        id=fid, part_id=part_id, make=v.make, model=v.model, generation=v.generation,
        year_from=v.year_from, year_to=v.year_to, engine_code=v.engine_code, position=position,
    )


# Brake pads
p = _add_part(brake_pads, "Brake Pads - Front", "Front Brake Pad Set, Ceramic", brembo, 45.99,
              oem_numbers=["1K0698151"], attributes={"material": "ceramic", "position": "front"})
_add_fitment(p, golf_mk7_tdi, "front")
_add_fitment(p, golf_mk7_tsi, "front")

p = _add_part(brake_pads, "Brake Pads - Rear", "Rear Brake Pad Set, Semi-Metallic", ate, 38.50,
              oem_numbers=["1K0698451"], attributes={"material": "semi-metallic", "position": "rear"})
_add_fitment(p, golf_mk7_tdi, "rear")

p = _add_part(brake_pads, "Brake Pads - Front", "Front Brake Pad Set, Ceramic", brembo, 42.00,
              oem_numbers=["04465-02350"], attributes={"material": "ceramic", "position": "front"})
_add_fitment(p, corolla_e210, "front")

# Brake discs
p = _add_part(brake_discs, "Brake Discs - Front, Vented", "Front Brake Disc (Vented, Pair)", ate, 89.00,
              oem_numbers=["1K0615301AA"], attributes={"type": "vented", "position": "front"})
_add_fitment(p, golf_mk7_tdi, "front")
_add_fitment(p, golf_mk7_tsi, "front")

# Brake calipers
p = _add_part(brake_calipers, "Brake Caliper - Front Left", "Front Left Brake Caliper", ate, 120.00,
              oem_numbers=["1K0615123"], attributes={"position": "front-left"})
_add_fitment(p, golf_mk7_tdi, "front-left")

# Timing
p = _add_part(timing_system, "Timing Belt Kit", "Timing Belt Kit + Water Pump", febi, 149.99,
              oem_numbers=["03L198119"])
_add_fitment(p, golf_mk7_tdi)

p = _add_part(engine_mounts, "Engine Mount - Right", "Engine Mount, Right Side", febi, 55.00,
              oem_numbers=["5Q0199262BB"])
_add_fitment(p, golf_mk7_tsi)

# Suspension
p = _add_part(shock_absorbers, "Shock Absorber - Front", "Front Gas Shock Absorber", monroe, 65.00,
              oem_numbers=["5Q0413031AK"], attributes={"position": "front"})
_add_fitment(p, golf_mk7_tdi, "front")
_add_fitment(p, golf_mk7_tsi, "front")

p = _add_part(control_arms, "Control Arm - Front Left, Lower", "Lower Front Left Control Arm", febi, 72.00,
              oem_numbers=["5Q0407151"], attributes={"position": "front-left"})
_add_fitment(p, golf_mk7_tsi, "front-left")

# Exhaust — individual assembly parts (matches the observed Trodo subcategory)
p = _add_part(individual_assembly_parts, "Gasket", "Exhaust Manifold Gasket", febi, 8.50)
_add_fitment(p, focus_mk4)

p = _add_part(individual_assembly_parts, "Clamp", "Exhaust Pipe Clamp, 55mm", febi, 6.00, universal=True)

p = _add_part(individual_assembly_parts, "Rubber Buffer", "Exhaust Rubber Mount Buffer", febi, 5.50, universal=True)

p = _add_part(catalytic_converters, "Catalytic Converter", "Three-Way Catalytic Converter", bosch, 210.00,
              oem_numbers=["1K0131701FX"])
_add_fitment(p, golf_mk7_tsi)

# Filters
p = _add_part(oil_filters, "Oil Filter", "Oil Filter, Spin-On", mann_filter, 9.99,
              oem_numbers=["03C115561B"], universal=False)
_add_fitment(p, golf_mk7_tdi)
_add_fitment(p, golf_mk7_tsi)

p = _add_part(air_filters, "Air Filter", "Engine Air Filter", mann_filter, 14.50,
              oem_numbers=["5Q0129620"])
_add_fitment(p, golf_mk7_tsi)

p = _add_part(cabin_filters, "Cabin Filter", "Pollen / Cabin Air Filter, Activated Carbon", mann_filter, 16.00,
              universal=False)
_add_fitment(p, corolla_e210)
_add_fitment(p, focus_mk4)

# Accessories
p = _add_part(fluids_engine_oil, "Engine Oil", "Fully Synthetic Engine Oil 5W-30, 5L", bosch, 34.99, universal=True)
p = _add_part(wiper_blades_front, "Wiper Blade - Front", "Front Wiper Blade, 26in", bosch, 12.99, universal=True)


def category_children(parent_id: str | None) -> list[Category]:
    return [c for c in CATEGORIES.values() if c.parent_id == parent_id]


def category_by_slug(slug: str) -> Category | None:
    return next((c for c in CATEGORIES.values() if c.slug == slug), None)


def parts_in_category(category_id: str) -> list[Part]:
    return [p for p in PARTS.values() if p.category_id == category_id]


def fitments_for_part(part_id: str) -> list[Fitment]:
    return [f for f in FITMENTS.values() if f.part_id == part_id]


def part_fits_vehicle(part: Part, vehicle: Vehicle) -> bool:
    if part.universal:
        return True
    for f in fitments_for_part(part.id):
        if f.make != vehicle.make or f.model != vehicle.model:
            continue
        if f.generation and vehicle.generation and f.generation != vehicle.generation:
            continue
        if f.engine_code and vehicle.engine_code and f.engine_code != vehicle.engine_code:
            continue
        return True
    return False


def brand_id_for_name(name: str) -> str:
    existing = next((brand_id for brand_id, brand in BRANDS.items() if brand.name.casefold() == name.casefold()), None)
    return existing or _add_brand(name.strip())


def delete_part(part_id: str) -> None:
    PARTS.pop(part_id, None)
    for fitment_id, fitment in list(FITMENTS.items()):
        if fitment.part_id == part_id:
            FITMENTS.pop(fitment_id)
