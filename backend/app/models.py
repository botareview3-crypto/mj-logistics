from typing import Optional
from pydantic import BaseModel


class Brand(BaseModel):
    id: str
    name: str
    logo_url: Optional[str] = None
    description: Optional[str] = None


class Category(BaseModel):
    id: str
    name: str
    slug: str
    parent_id: Optional[str] = None
    level: int  # 1 = Root (Car Parts / Accessories), 2 = System, 3 = Subsystem


class Fitment(BaseModel):
    id: str
    part_id: str
    make: str
    model: str
    generation: Optional[str] = None
    year_from: int
    year_to: Optional[int] = None
    engine_code: Optional[str] = None
    position: Optional[str] = None  # front/rear/left/right


class Part(BaseModel):
    id: str
    sku: str
    name: str
    category_id: str  # Subsystem-level category
    part_type: str  # facet value, e.g. "Brake Pads - Front"
    brand_id: str
    oem_numbers: list[str] = []
    price: float
    original_price: Optional[float] = None  # set higher than `price` to show a discount strike-through
    stock_qty: int
    attributes: dict = {}
    images: list[str] = []
    description: str = ""
    universal: bool = False
    rating: float = 0.0  # admin-set average, 0-5 — no per-review data yet
    review_count: int = 0
    warranty_years: int = 1
    delivery_days: int = 3
    featured: bool = False
    bestseller: bool = False


class Vehicle(BaseModel):
    id: str
    vin: Optional[str] = None
    registration_number: Optional[str] = None
    make: str
    model: str
    generation: Optional[str] = None
    year_from: int
    year_to: Optional[int] = None
    engine_code: Optional[str] = None
    fuel_type: Optional[str] = None
    displacement_cc: Optional[int] = None
    power_hp: Optional[int] = None
    transmission_type: Optional[str] = None
    body_type: Optional[str] = None


class VehicleCreate(BaseModel):
    make: str
    model: str
    generation: Optional[str] = None
    year_from: int
    year_to: Optional[int] = None
    engine_code: Optional[str] = None


class AdminPartCreate(BaseModel):
    sku: str
    name: str
    category_slug: str
    part_type: str
    brand: str
    price: float
    original_price: Optional[float] = None
    stock_qty: int = 0
    attributes: dict = {}
    oem_numbers: list[str] = []
    universal: bool = False
    description: str = ""
    rating: float = 0.0
    review_count: int = 0
    warranty_years: int = 1
    delivery_days: int = 3
    featured: bool = False
    bestseller: bool = False
    position: Optional[str] = None
    fitment_make: Optional[str] = None
    fitment_model: Optional[str] = None
    fitment_generation: Optional[str] = None
    fitment_year_from: Optional[int] = None
    fitment_year_to: Optional[int] = None
    fitment_engine_code: Optional[str] = None
    vin_reference: Optional[str] = None


class AdminPartUpdate(BaseModel):
    name: Optional[str] = None
    part_type: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    stock_qty: Optional[int] = None
    attributes: Optional[dict] = None
    oem_numbers: Optional[list[str]] = None
    universal: Optional[bool] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    warranty_years: Optional[int] = None
    delivery_days: Optional[int] = None
    featured: Optional[bool] = None
    bestseller: Optional[bool] = None


class SiteSettings(BaseModel):
    maintenance_mode: bool = False
    announcement: str = ""
