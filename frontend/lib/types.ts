export interface Vehicle {
  id: string;
  make: string;
  model: string;
  generation: string;
  yearRange: string;
  year: number;
  engine: string;
  engineCode?: string;
  powerHp?: number;
  fuelType?: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  vin?: string;
  regNumber?: string;
  nickname?: string;
}

export interface VehicleMake {
  name: string;
  logoUrl?: string;
  models: VehicleModel[];
}

export interface VehicleModel {
  name: string;
  generations: VehicleGeneration[];
}

export interface VehicleGeneration {
  name: string;
  yearRange: string;
  startYear: number;
  endYear: number;
  engines: VehicleEngine[];
}

export interface VehicleEngine {
  id: string;
  name: string;
  code: string;
  displacement: string;
  powerHp: number;
  powerKw: number;
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
}

export interface CategoryRoot {
  id: 'car-parts' | 'accessories';
  name: string;
  description: string;
  systems: CategorySystem[];
}

export interface CategorySystem {
  id: string;
  rootId: 'car-parts' | 'accessories';
  name: string;
  iconName: string;
  description: string;
  image?: string;
  subsystems: CategorySubsystem[];
}

export interface CategorySubsystem {
  id: string;
  systemId: string;
  name: string;
  iconName?: string;
  description: string;
  itemCount: number;
  image?: string;
}

export interface PartSpec {
  [key: string]: string | number;
}

export interface CompatibleVehicleRef {
  make: string;
  model: string;
  generation: string;
  yearRange: string;
  engineNames: string[];
}

export interface PartReview {
  id: string;
  author?: string;
  userName?: string;
  userCar?: string;
  vehicleOwned?: string;
  rating: number;
  date: string;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Part {
  id: string;
  sku: string;
  name: string;
  brand: string;
  brandLogo?: string;
  systemId: string;
  subsystemId: string;
  category?: string;
  partType: string;
  position?: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount: number;
  deliveryDays: number;
  warrantyYears: number;
  rating: number;
  reviewCount: number;
  images: string[];
  specs: PartSpec;
  oemNumbers: string[];
  description: string;
  material?: string;
  fitsVehicles: CompatibleVehicleRef[];
  compatibleEngineIds: string[];
  complementaryPartIds?: string[];
  isBestSeller?: boolean;
  featured?: boolean;
  reviews?: PartReview[];
}

export interface CartItem {
  part: Part;
  quantity: number;
  addedForVehicle?: Vehicle | null;
}

export interface FilterState {
  searchQuery: string;
  partTypes: string[];
  brands: string[];
  positions: string[];
  minPrice: number;
  maxPrice: number;
  onlyFitsVehicle: boolean;
  onlyInStock: boolean;
  sortBy: 'popularity' | 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc';
}
