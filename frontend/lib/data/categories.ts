import { CategoryRoot, CategorySystem, CategorySubsystem } from '../types';

export const CATEGORY_ROOTS: CategoryRoot[] = [
  {
    id: 'car-parts',
    name: 'Car Parts',
    description: 'Precision mechanical, electrical, and maintenance components guaranteed to fit your vehicle.',
    systems: [
      {
        id: 'braking-system',
        rootId: 'car-parts',
        name: 'Braking System',
        iconName: 'Disc',
        description: 'Brake pads, discs, calipers, master cylinders, and hydraulic lines.',
        image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=600&q=80',
        subsystems: [
          {
            id: 'brake-pads',
            systemId: 'braking-system',
            name: 'Brake Pads',
            iconName: 'Shield',
            description: 'Front and rear ceramic, semi-metallic, and low-metallic disc brake pads.',
            itemCount: 4280,
            image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'brake-discs',
            systemId: 'braking-system',
            name: 'Brake Discs (Rotors)',
            iconName: 'Disc',
            description: 'Vented, drilled, slotted, and high-carbon coated brake discs.',
            itemCount: 3120,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'brake-calipers',
            systemId: 'braking-system',
            name: 'Brake Calipers',
            iconName: 'Layers',
            description: 'New and remanufactured 1-piston, 2-piston, and multi-piston calipers.',
            itemCount: 1840,
            image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'brake-drums-shoes',
            systemId: 'braking-system',
            name: 'Brake Drums & Shoes',
            iconName: 'CircleDot',
            description: 'Rear drum brake kits, friction shoes, and cylinder assemblies.',
            itemCount: 940,
            image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'master-cylinder',
            systemId: 'braking-system',
            name: 'Brake Master Cylinder & Booster',
            iconName: 'Cpu',
            description: 'Hydraulic master cylinders, brake fluid reservoirs, and vacuum servos.',
            itemCount: 650,
            image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'brake-hoses-fluid',
            systemId: 'braking-system',
            name: 'Brake Fluid & Hoses',
            iconName: 'Droplet',
            description: 'DOT 4, DOT 5.1 high boiling point brake fluids and braided hoses.',
            itemCount: 1120,
            image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
      {
        id: 'engine-transmission',
        rootId: 'car-parts',
        name: 'Engine & Transmission',
        iconName: 'Gauge',
        description: 'Filters, timing belts, spark plugs, sensors, engine mounts, and fluids.',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
        subsystems: [
          {
            id: 'oil-filters',
            systemId: 'engine-transmission',
            name: 'Oil Filters',
            iconName: 'Filter',
            description: 'Spin-on and cartridge oil filters offering 99%+ particle retention.',
            itemCount: 2980,
            image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'air-cabin-filters',
            systemId: 'engine-transmission',
            name: 'Air & Cabin Filters',
            iconName: 'Wind',
            description: 'High airflow engine air filters and activated carbon pollen filters.',
            itemCount: 3450,
            image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'spark-glow-plugs',
            systemId: 'engine-transmission',
            name: 'Spark & Glow Plugs',
            iconName: 'Zap',
            description: 'Iridium, platinum, and nickel spark plugs plus rapid-glow diesel heater plugs.',
            itemCount: 2190,
            image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'timing-belts-kits',
            systemId: 'engine-transmission',
            name: 'Timing Belts & Water Pump Kits',
            iconName: 'RefreshCw',
            description: 'Complete camshaft timing belt sets with tensioner rollers and water pump.',
            itemCount: 1620,
            image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'engine-oil-lubricants',
            systemId: 'engine-transmission',
            name: 'Engine Oil & Lubricants',
            iconName: 'Droplets',
            description: 'Fully synthetic 0W-20, 0W-30, 5W-30, 5W-40 oils with OEM approvals.',
            itemCount: 1890,
            image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'gaskets-seals',
            systemId: 'engine-transmission',
            name: 'Gaskets & Engine Seals',
            iconName: 'Maximize2',
            description: 'Cylinder head gaskets, rocker cover seals, and crankshaft oil seals.',
            itemCount: 1410,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
      {
        id: 'suspension-steering',
        rootId: 'car-parts',
        name: 'Suspension & Steering',
        iconName: 'Sliders',
        description: 'Shock absorbers, coil springs, control arms, tie rod ends, and wheel bearings.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
        subsystems: [
          {
            id: 'shock-absorbers',
            systemId: 'suspension-steering',
            name: 'Shock Absorbers & Struts',
            iconName: 'Activity',
            description: 'Twin-tube gas pressurized and mono-tube performance dampers.',
            itemCount: 3820,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'control-arms-wishbones',
            systemId: 'suspension-steering',
            name: 'Control Arms & Wishbones',
            iconName: 'GitCommit',
            description: 'Forged aluminum and pressed steel suspension track control arms.',
            itemCount: 2740,
            image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'wheel-bearings',
            systemId: 'suspension-steering',
            name: 'Wheel Hubs & Bearings',
            iconName: 'Target',
            description: 'Integrated hub bearing units with magnetic ABS sensor encoder rings.',
            itemCount: 1910,
            image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'anti-roll-bar-links',
            systemId: 'suspension-steering',
            name: 'Anti-Roll Bar Links & Bushings',
            iconName: 'Link',
            description: 'Stabilizer drop links and polyurethane anti-sway bar bushings.',
            itemCount: 1350,
            image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
      {
        id: 'exhaust-system',
        rootId: 'car-parts',
        name: 'Exhaust System',
        iconName: 'Flame',
        description: 'Silencers, catalytic converters, DPFs, lambda sensors, and assembly hardware.',
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
        subsystems: [
          {
            id: 'exhaust-silencers',
            systemId: 'exhaust-system',
            name: 'Silencers & Mufflers',
            iconName: 'VolumeX',
            description: 'Center and rear aluminized steel exhaust boxes and chrome tips.',
            itemCount: 1460,
            image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'catalytic-converters',
            systemId: 'exhaust-system',
            name: 'Catalytic Converters & DPF',
            iconName: 'Filter',
            description: 'Euro 5/6 compliant ceramic monolith catalytic converters and soot traps.',
            itemCount: 1180,
            image: 'https://images.unsplash.com/photo-1600790142055-619df03207e6?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'lambda-sensors',
            systemId: 'exhaust-system',
            name: 'Lambda Oxygen Sensors',
            iconName: 'Radio',
            description: 'Pre-cat regulating and post-cat diagnostic O2 sensors.',
            itemCount: 2130,
            image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'exhaust-assembly-parts',
            systemId: 'exhaust-system',
            name: 'Individual Assembly Parts',
            iconName: 'Tool',
            description: 'Exhaust gaskets, sleeve clamps, rubber hanger rings, and pipe brackets.',
            itemCount: 920,
            image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
      {
        id: 'electrical-lighting',
        rootId: 'car-parts',
        name: 'Electrical & Lighting',
        iconName: 'Zap',
        description: 'Car batteries, headlamps, alternators, starter motors, and engine sensors.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
        subsystems: [
          {
            id: 'car-batteries',
            systemId: 'electrical-lighting',
            name: 'Car Batteries (AGM & EFB)',
            iconName: 'BatteryCharging',
            description: 'Start-stop AGM, EFB, and conventional lead-acid 12V starter batteries.',
            itemCount: 1250,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'headlights-bulbs',
            systemId: 'electrical-lighting',
            name: 'Headlights & LED Bulbs',
            iconName: 'Sun',
            description: 'H7, H4, LED conversion bulbs, and complete front optical units.',
            itemCount: 3870,
            image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'alternators-starters',
            systemId: 'electrical-lighting',
            name: 'Alternators & Starter Motors',
            iconName: 'RotateCw',
            description: 'High output 120A-180A alternators and high-torque gear-reduction starters.',
            itemCount: 1690,
            image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
      {
        id: 'cooling-heating',
        rootId: 'car-parts',
        name: 'Cooling & Heating',
        iconName: 'Thermometer',
        description: 'Engine radiators, cabin blower fans, thermostats, and AC compressors.',
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&q=80',
        subsystems: [
          {
            id: 'engine-radiators',
            systemId: 'cooling-heating',
            name: 'Engine Coolant Radiators',
            iconName: 'Grid',
            description: 'Aluminum core radiators with high thermal dissipation fins.',
            itemCount: 1840,
            image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'thermostats-coolant',
            systemId: 'cooling-heating',
            name: 'Thermostats & Coolant',
            iconName: 'Droplet',
            description: 'Electronically controlled thermostats and G12/G13 antifreeze fluids.',
            itemCount: 1420,
            image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories and Equipment',
    description: 'Specialist garage tools, detailing supplies, wiper blades, and vehicle accessories.',
    systems: [
      {
        id: 'car-care-detailing',
        rootId: 'accessories',
        name: 'Car Care & Detailing',
        iconName: 'Sparkles',
        description: 'Shampoos, ceramic coats, waxes, microfiber towels, and interior cleaners.',
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80',
        subsystems: [
          {
            id: 'shampoos-waxes',
            systemId: 'car-care-detailing',
            name: 'Shampoos, Waxes & Sealants',
            iconName: 'Sparkles',
            description: 'pH-neutral snow foams, carnauba waxes, and SiO2 ceramic spray sealants.',
            itemCount: 890,
            image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'washer-fluids',
            systemId: 'car-care-detailing',
            name: 'Windshield Washer Fluids',
            iconName: 'Droplets',
            description: 'All-season and sub-zero -30°C de-icing windshield fluid concentrates.',
            itemCount: 340,
            image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
      {
        id: 'tools-workshop',
        rootId: 'accessories',
        name: 'Tools & Garage Equipment',
        iconName: 'Wrench',
        description: 'Diagnostic OBD2 scanners, torque wrenches, hydraulic jacks, and socket sets.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        subsystems: [
          {
            id: 'obd2-scanners',
            systemId: 'tools-workshop',
            name: 'OBD2 Diagnostic Scanners',
            iconName: 'Cpu',
            description: 'Handheld code readers, ABS/SRS reset tools, and live data telemetry scanners.',
            itemCount: 280,
            image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'jacks-stands',
            systemId: 'tools-workshop',
            name: 'Trolley Jacks & Axle Stands',
            iconName: 'ArrowUpCircle',
            description: 'Low-profile 2.5T / 3T hydraulic service jacks and locking ratchet stands.',
            itemCount: 310,
            image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'torque-wrenches',
            systemId: 'tools-workshop',
            name: 'Torque Wrenches & Sockets',
            iconName: 'Tool',
            description: '1/2" and 3/8" calibrated click-type torque wrenches with metric socket sets.',
            itemCount: 450,
            image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
      {
        id: 'interior-exterior-equipment',
        rootId: 'accessories',
        name: 'Interior & Exterior Equipment',
        iconName: 'ShieldCheck',
        description: 'Wiper blades, fitted rubber floor mats, boot liners, and roof crossbars.',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        subsystems: [
          {
            id: 'wiper-blades',
            systemId: 'interior-exterior-equipment',
            name: 'Flat Wiper Blades',
            iconName: 'Eye',
            description: 'Aerodynamic beam wiper blades with graphite coating for streak-free wiping.',
            itemCount: 1680,
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
          },
          {
            id: 'floor-mats-liners',
            systemId: 'interior-exterior-equipment',
            name: 'All-Weather Floor Mats',
            iconName: 'Square',
            description: 'Laser-measured TPE heavy-duty waterproof floor mats with raised lip edges.',
            itemCount: 760,
            image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
    ],
  },
];

export function findSystemById(systemId: string): CategorySystem | undefined {
  for (const root of CATEGORY_ROOTS) {
    const sys = root.systems.find(s => s.id === systemId);
    if (sys) return sys;
  }
  return undefined;
}

export function findSubsystemById(subsystemId: string): { system: CategorySystem; subsystem: CategorySubsystem } | undefined {
  for (const root of CATEGORY_ROOTS) {
    for (const sys of root.systems) {
      const sub = sys.subsystems.find(s => s.id === subsystemId);
      if (sub) {
        return { system: sys, subsystem: sub };
      }
    }
  }
  return undefined;
}

export function getCategoryById(systemId?: string, subsystemId?: string): {
  root?: CategoryRoot;
  system?: CategorySystem;
  subsystem?: CategorySubsystem;
} {
  let matchedRoot: CategoryRoot | undefined;
  let matchedSys: CategorySystem | undefined;
  let matchedSub: CategorySubsystem | undefined;

  for (const root of CATEGORY_ROOTS) {
    for (const sys of root.systems) {
      if (systemId && sys.id === systemId) {
        matchedRoot = root;
        matchedSys = sys;
      }
      if (subsystemId) {
        const sub = sys.subsystems.find(s => s.id === subsystemId);
        if (sub) {
          matchedRoot = root;
          matchedSys = sys;
          matchedSub = sub;
        }
      }
    }
  }

  return { root: matchedRoot, system: matchedSys, subsystem: matchedSub };
}


