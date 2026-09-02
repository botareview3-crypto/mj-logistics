from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .. import data
from ..models import Vehicle

router = APIRouter(prefix="/api/vehicles", tags=["vehicles"])

# Simple in-memory "garage" (no auth/session in this MVP — single shared list)
GARAGE: list[str] = []


class GarageVehicleRequest(BaseModel):
    vehicle_id: str


@router.get("/makes")
def list_makes():
    return sorted(data.MAKES_MODELS.keys())


@router.get("/models")
def list_models(make: str):
    return sorted(data.MAKES_MODELS.get(make, {}).keys())


@router.get("/generations")
def list_generations(make: str, model: str):
    return data.MAKES_MODELS.get(make, {}).get(model, [])


@router.get("/engines")
def list_engines(make: str, model: str, generation: str | None = None):
    matches = [
        v for v in data.VEHICLES.values()
        if v.make == make and v.model == model and (generation is None or v.generation == generation)
    ]
    return [
        {"vehicle_id": v.id, "engine_code": v.engine_code, "fuel_type": v.fuel_type,
         "displacement_cc": v.displacement_cc, "power_hp": v.power_hp}
        for v in matches
    ]


@router.get("/decode-vin")
def decode_vin(vin: str):
    """
    Stub VIN decoder for the MVP. Real implementation should call a VIN decode
    API (e.g. NHTSA for the US, or a TecDoc-licensed provider for Europe) and
    upsert the resulting Vehicle record. Here we just deterministically map a
    VIN to one of the seeded demo vehicles so the frontend flow is testable
    end-to-end.
    """
    if not vin or len(vin) < 5:
        raise HTTPException(400, "Invalid VIN")
    vehicles = list(data.VEHICLES.values())
    chosen = vehicles[sum(map(ord, vin)) % len(vehicles)]
    return chosen


@router.get("/lookup-reg")
def lookup_registration(reg: str):
    """Demo lookup that returns a deterministic seeded vehicle until a regional provider is configured."""
    if not reg or len(reg.strip()) < 3:
        raise HTTPException(400, "Invalid registration number")
    vehicles = list(data.VEHICLES.values())
    return vehicles[sum(map(ord, reg.strip().upper())) % len(vehicles)]


@router.get("/{vehicle_id}")
def get_vehicle(vehicle_id: str):
    v = data.VEHICLES.get(vehicle_id)
    if not v:
        raise HTTPException(404, "Vehicle not found")
    return v


@router.get("/garage/vehicles")
def list_garage():
    return [data.VEHICLES[vid] for vid in GARAGE]


@router.post("/garage/vehicles")
def add_to_garage(payload: GarageVehicleRequest):
    if payload.vehicle_id not in data.VEHICLES:
        raise HTTPException(404, "Vehicle not found")
    if payload.vehicle_id not in GARAGE:
        GARAGE.append(payload.vehicle_id)
    return [data.VEHICLES[vid] for vid in GARAGE]


@router.delete("/garage/vehicles/{vehicle_id}")
def remove_from_garage(vehicle_id: str):
    if vehicle_id not in GARAGE:
        raise HTTPException(404, "Vehicle not found in garage")
    GARAGE.remove(vehicle_id)
    return {"status": "removed", "vehicle_id": vehicle_id}
