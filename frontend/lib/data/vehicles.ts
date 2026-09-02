import { Vehicle, VehicleMake } from '../types';

export const VEHICLE_MAKES_DATABASE: VehicleMake[] = [
  {
    name: 'Volkswagen',
    models: [
      {
        name: 'Golf',
        generations: [
          {
            name: 'Golf Mk7 (5G1, BQ1, BE1, BE2)',
            yearRange: '2012 - 2020',
            startYear: 2012,
            endYear: 2020,
            engines: [
              { id: 'vw-golf-mk7-16tdi-115', name: '1.6 TDI (115 HP / 85 kW)', code: 'DDYA, DGTE', displacement: '1598 ccm', powerHp: 115, powerKw: 85, fuelType: 'Diesel' },
              { id: 'vw-golf-mk7-20tdi-150', name: '2.0 TDI (150 HP / 110 kW)', code: 'CRBC, CRLB, CRMB', displacement: '1968 ccm', powerHp: 150, powerKw: 110, fuelType: 'Diesel' },
              { id: 'vw-golf-mk7-14tsi-125', name: '1.4 TSI (125 HP / 92 kW)', code: 'CZCA', displacement: '1395 ccm', powerHp: 125, powerKw: 92, fuelType: 'Petrol' },
              { id: 'vw-golf-mk7-20gti-230', name: '2.0 GTI (230 HP / 169 kW)', code: 'CHHA', displacement: '1984 ccm', powerHp: 230, powerKw: 169, fuelType: 'Petrol' },
              { id: 'vw-golf-mk7-15tsi-150', name: '1.5 TSI EVO (150 HP / 110 kW)', code: 'DADA, DPCA', displacement: '1498 ccm', powerHp: 150, powerKw: 110, fuelType: 'Petrol' },
            ],
          },
          {
            name: 'Golf Mk6 (5K1)',
            yearRange: '2008 - 2013',
            startYear: 2008,
            endYear: 2013,
            engines: [
              { id: 'vw-golf-mk6-16tdi-105', name: '1.6 TDI (105 HP / 77 kW)', code: 'CAYC', displacement: '1598 ccm', powerHp: 105, powerKw: 77, fuelType: 'Diesel' },
              { id: 'vw-golf-mk6-20tdi-140', name: '2.0 TDI (140 HP / 103 kW)', code: 'CBAB, CFFB', displacement: '1968 ccm', powerHp: 140, powerKw: 103, fuelType: 'Diesel' },
              { id: 'vw-golf-mk6-14tsi-122', name: '1.4 TSI (122 HP / 90 kW)', code: 'CAXA', displacement: '1390 ccm', powerHp: 122, powerKw: 90, fuelType: 'Petrol' },
            ],
          },
          {
            name: 'Golf Mk8 (CD1)',
            yearRange: '2019 - Present',
            startYear: 2019,
            endYear: 2026,
            engines: [
              { id: 'vw-golf-mk8-15etsi-150', name: '1.5 eTSI Mild Hybrid (150 HP / 110 kW)', code: 'DFYA', displacement: '1498 ccm', powerHp: 150, powerKw: 110, fuelType: 'Hybrid' },
              { id: 'vw-golf-mk8-20tdi-150', name: '2.0 TDI (150 HP / 110 kW)', code: 'DSRB, DTSA', displacement: '1968 ccm', powerHp: 150, powerKw: 110, fuelType: 'Diesel' },
              { id: 'vw-golf-mk8-20gti-245', name: '2.0 GTI (245 HP / 180 kW)', code: 'DNPA', displacement: '1984 ccm', powerHp: 245, powerKw: 180, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Passat',
        generations: [
          {
            name: 'Passat B8 (3G2, CB2)',
            yearRange: '2014 - 2023',
            startYear: 2014,
            endYear: 2023,
            engines: [
              { id: 'vw-passat-b8-20tdi-150', name: '2.0 TDI (150 HP / 110 kW)', code: 'CRLB, DFEA', displacement: '1968 ccm', powerHp: 150, powerKw: 110, fuelType: 'Diesel' },
              { id: 'vw-passat-b8-20tdi-190', name: '2.0 TDI (190 HP / 140 kW)', code: 'DDAA, DFHA', displacement: '1968 ccm', powerHp: 190, powerKw: 140, fuelType: 'Diesel' },
              { id: 'vw-passat-b8-14gte-218', name: '1.4 GTE Hybrid (218 HP / 160 kW)', code: 'CUKC', displacement: '1395 ccm', powerHp: 218, powerKw: 160, fuelType: 'Hybrid' },
            ],
          },
        ],
      },
      {
        name: 'Tiguan',
        generations: [
          {
            name: 'Tiguan II (AD1, AX1)',
            yearRange: '2016 - 2024',
            startYear: 2016,
            endYear: 2024,
            engines: [
              { id: 'vw-tiguan-2-20tdi-150', name: '2.0 TDI 4Motion (150 HP / 110 kW)', code: 'DFGA', displacement: '1968 ccm', powerHp: 150, powerKw: 110, fuelType: 'Diesel' },
              { id: 'vw-tiguan-2-20tsi-180', name: '2.0 TSI 4Motion (180 HP / 132 kW)', code: 'CZPA', displacement: '1984 ccm', powerHp: 180, powerKw: 132, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Polo',
        generations: [
          {
            name: 'Polo Mk6 (AW1, BZ1)',
            yearRange: '2017 - Present',
            startYear: 2017,
            endYear: 2026,
            engines: [
              { id: 'vw-polo-6-10tsi-95', name: '1.0 TSI (95 HP / 70 kW)', code: 'DKLA, DLAC', displacement: '999 ccm', powerHp: 95, powerKw: 70, fuelType: 'Petrol' },
              { id: 'vw-polo-6-10tsi-110', name: '1.0 TSI (110 HP / 81 kW)', code: 'DLAA', displacement: '999 ccm', powerHp: 110, powerKw: 81, fuelType: 'Petrol' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'BMW',
    models: [
      {
        name: '3 Series',
        generations: [
          {
            name: '3 Series (F30, F31, F80)',
            yearRange: '2011 - 2019',
            startYear: 2011,
            endYear: 2019,
            engines: [
              { id: 'bmw-3-f30-320d-190', name: '320d 2.0 (190 HP / 140 kW)', code: 'B47D20A', displacement: '1995 ccm', powerHp: 190, powerKw: 140, fuelType: 'Diesel' },
              { id: 'bmw-3-f30-320i-184', name: '320i 2.0 (184 HP / 135 kW)', code: 'B48B20A', displacement: '1998 ccm', powerHp: 184, powerKw: 135, fuelType: 'Petrol' },
              { id: 'bmw-3-f30-330d-258', name: '330d 3.0 (258 HP / 190 kW)', code: 'N57D30A', displacement: '2993 ccm', powerHp: 258, powerKw: 190, fuelType: 'Diesel' },
              { id: 'bmw-3-f30-335i-306', name: '335i 3.0 (306 HP / 225 kW)', code: 'N55B30A', displacement: '2979 ccm', powerHp: 306, powerKw: 225, fuelType: 'Petrol' },
            ],
          },
          {
            name: '3 Series (G20, G21)',
            yearRange: '2018 - Present',
            startYear: 2018,
            endYear: 2026,
            engines: [
              { id: 'bmw-3-g20-320d-190', name: '320d Mild-Hybrid (190 HP / 140 kW)', code: 'B47D20B', displacement: '1995 ccm', powerHp: 190, powerKw: 140, fuelType: 'Diesel' },
              { id: 'bmw-3-g20-330i-258', name: '330i 2.0 (258 HP / 190 kW)', code: 'B48B20B', displacement: '1998 ccm', powerHp: 258, powerKw: 190, fuelType: 'Petrol' },
              { id: 'bmw-3-g20-m340i-374', name: 'M340i xDrive (374 HP / 275 kW)', code: 'B58B30B', displacement: '2998 ccm', powerHp: 374, powerKw: 275, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: '5 Series',
        generations: [
          {
            name: '5 Series (G30, F90, G31)',
            yearRange: '2016 - 2023',
            startYear: 2016,
            endYear: 2023,
            engines: [
              { id: 'bmw-5-g30-520d-190', name: '520d 2.0 (190 HP / 140 kW)', code: 'B47D20A', displacement: '1995 ccm', powerHp: 190, powerKw: 140, fuelType: 'Diesel' },
              { id: 'bmw-5-g30-530e-252', name: '530e Plug-in Hybrid (252 HP / 185 kW)', code: 'B48B20A', displacement: '1998 ccm', powerHp: 252, powerKw: 185, fuelType: 'Hybrid' },
            ],
          },
        ],
      },
      {
        name: '1 Series',
        generations: [
          {
            name: '1 Series (F20, F21)',
            yearRange: '2011 - 2019',
            startYear: 2011,
            endYear: 2019,
            engines: [
              { id: 'bmw-1-f20-118d-150', name: '118d 2.0 (150 HP / 110 kW)', code: 'B47D20A', displacement: '1995 ccm', powerHp: 150, powerKw: 110, fuelType: 'Diesel' },
              { id: 'bmw-1-f20-118i-136', name: '118i 1.5 (136 HP / 100 kW)', code: 'B38B15A', displacement: '1499 ccm', powerHp: 136, powerKw: 100, fuelType: 'Petrol' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Audi',
    models: [
      {
        name: 'A4',
        generations: [
          {
            name: 'A4 B9 (8W2, 8WC, 8W5)',
            yearRange: '2015 - 2023',
            startYear: 2015,
            endYear: 2023,
            engines: [
              { id: 'audi-a4-b9-20tdi-150', name: '2.0 TDI (150 HP / 110 kW)', code: 'DEUA, DEUB', displacement: '1968 ccm', powerHp: 150, powerKw: 110, fuelType: 'Diesel' },
              { id: 'audi-a4-b9-20tfsi-190', name: '2.0 TFSI (190 HP / 140 kW)', code: 'CVKB, DBPA', displacement: '1984 ccm', powerHp: 190, powerKw: 140, fuelType: 'Petrol' },
              { id: 'audi-a4-b9-30tdi-272', name: '3.0 TDI quattro (272 HP / 200 kW)', code: 'CRTC', displacement: '2967 ccm', powerHp: 272, powerKw: 200, fuelType: 'Diesel' },
            ],
          },
        ],
      },
      {
        name: 'A3',
        generations: [
          {
            name: 'A3 8V (8V1, 8VK, 8VA)',
            yearRange: '2012 - 2020',
            startYear: 2012,
            endYear: 2020,
            engines: [
              { id: 'audi-a3-8v-16tdi-115', name: '1.6 TDI (115 HP / 85 kW)', code: 'DDYA', displacement: '1598 ccm', powerHp: 115, powerKw: 85, fuelType: 'Diesel' },
              { id: 'audi-a3-8v-20tdi-150', name: '2.0 TDI (150 HP / 110 kW)', code: 'CRLB', displacement: '1968 ccm', powerHp: 150, powerKw: 110, fuelType: 'Diesel' },
              { id: 'audi-a3-8v-14tfsi-150', name: '1.4 TFSI CoD (150 HP / 110 kW)', code: 'CZEA', displacement: '1395 ccm', powerHp: 150, powerKw: 110, fuelType: 'Petrol' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Toyota',
    models: [
      {
        name: 'Corolla',
        generations: [
          {
            name: 'Corolla E210 (_E21_)',
            yearRange: '2018 - Present',
            startYear: 2018,
            endYear: 2026,
            engines: [
              { id: 'toyota-corolla-e210-18h-122', name: '1.8 Hybrid (122 HP / 90 kW)', code: '2ZR-FXE', displacement: '1798 ccm', powerHp: 122, powerKw: 90, fuelType: 'Hybrid' },
              { id: 'toyota-corolla-e210-20h-184', name: '2.0 Hybrid (184 HP / 135 kW)', code: 'M20A-FXS', displacement: '1987 ccm', powerHp: 184, powerKw: 135, fuelType: 'Hybrid' },
              { id: 'toyota-corolla-e210-12t-116', name: '1.2 Turbo (116 HP / 85 kW)', code: '8NR-FTS', displacement: '1197 ccm', powerHp: 116, powerKw: 85, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Yaris',
        generations: [
          {
            name: 'Yaris IV (_P21_, _PA1_, _PH1_)',
            yearRange: '2020 - Present',
            startYear: 2020,
            endYear: 2026,
            engines: [
              { id: 'toyota-yaris-4-15h-116', name: '1.5 Hybrid (116 HP / 85 kW)', code: 'M15A-FXE', displacement: '1490 ccm', powerHp: 116, powerKw: 85, fuelType: 'Hybrid' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Ford',
    models: [
      {
        name: 'Focus',
        generations: [
          {
            name: 'Focus Mk4 (HN)',
            yearRange: '2018 - Present',
            startYear: 2018,
            endYear: 2026,
            engines: [
              { id: 'ford-focus-mk4-10eb-125', name: '1.0 EcoBoost (125 HP / 92 kW)', code: 'B7DA', displacement: '999 ccm', powerHp: 125, powerKw: 92, fuelType: 'Petrol' },
              { id: 'ford-focus-mk4-15eb-150', name: '1.5 EcoBoost (150 HP / 110 kW)', code: 'YZDA', displacement: '1496 ccm', powerHp: 150, powerKw: 110, fuelType: 'Petrol' },
              { id: 'ford-focus-mk4-15ecoblue-120', name: '1.5 EcoBlue (120 HP / 88 kW)', code: 'ZTDA', displacement: '1499 ccm', powerHp: 120, powerKw: 88, fuelType: 'Diesel' },
            ],
          },
          {
            name: 'Focus Mk3 (DYB)',
            yearRange: '2010 - 2018',
            startYear: 2010,
            endYear: 2018,
            engines: [
              { id: 'ford-focus-mk3-10eb-125', name: '1.0 EcoBoost (125 HP / 92 kW)', code: 'M1DA', displacement: '998 ccm', powerHp: 125, powerKw: 92, fuelType: 'Petrol' },
              { id: 'ford-focus-mk3-16tdci-115', name: '1.6 TDCi (115 HP / 85 kW)', code: 'T1DA', displacement: '1560 ccm', powerHp: 115, powerKw: 85, fuelType: 'Diesel' },
            ],
          },
        ],
      },
      {
        name: 'Fiesta',
        generations: [
          {
            name: 'Fiesta Mk7 (HJ, HF)',
            yearRange: '2017 - 2023',
            startYear: 2017,
            endYear: 2023,
            engines: [
              { id: 'ford-fiesta-7-10eb-100', name: '1.0 EcoBoost (100 HP / 74 kW)', code: 'SFJC', displacement: '998 ccm', powerHp: 100, powerKw: 74, fuelType: 'Petrol' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Mercedes-Benz',
    models: [
      {
        name: 'C-Class',
        generations: [
          {
            name: 'C-Class (W205, S205)',
            yearRange: '2014 - 2021',
            startYear: 2014,
            endYear: 2021,
            engines: [
              { id: 'mb-c220d-w205-170', name: 'C 220 d 2.1 (170 HP / 125 kW)', code: 'OM 651.921', displacement: '2143 ccm', powerHp: 170, powerKw: 125, fuelType: 'Diesel' },
              { id: 'mb-c200-w205-184', name: 'C 200 2.0 (184 HP / 135 kW)', code: 'M 274.920', displacement: '1991 ccm', powerHp: 184, powerKw: 135, fuelType: 'Petrol' },
            ],
          },
        ],
      },
    ],
  },
];

export interface VinDecodeResult {
  code: string;
  vehicle: Vehicle;
}

export const SAMPLE_VIN_REG_DATABASE: VinDecodeResult[] = [
  {
    code: 'WF18XKV',
    vehicle: {
      id: 'vw-golf-mk7-16tdi-115',
      make: 'Volkswagen',
      model: 'Golf',
      generation: 'Golf Mk7 (5G1, BQ1, BE1, BE2)',
      yearRange: '2012 - 2020',
      year: 2018,
      engine: '1.6 TDI (115 HP / 85 kW)',
      engineCode: 'DDYA',
      powerHp: 115,
      fuelType: 'Diesel',
      regNumber: 'WF18 XKV',
      vin: 'WVWZZZAUZJP184920',
      nickname: 'Daily Golf Mk7',
    },
  },
  {
    code: 'WVWZZZAUZJP184920',
    vehicle: {
      id: 'vw-golf-mk7-16tdi-115',
      make: 'Volkswagen',
      model: 'Golf',
      generation: 'Golf Mk7 (5G1, BQ1, BE1, BE2)',
      yearRange: '2012 - 2020',
      year: 2018,
      engine: '1.6 TDI (115 HP / 85 kW)',
      engineCode: 'DDYA',
      powerHp: 115,
      fuelType: 'Diesel',
      regNumber: 'WF18 XKV',
      vin: 'WVWZZZAUZJP184920',
      nickname: 'Daily Golf Mk7',
    },
  },
  {
    code: 'KU67YZL',
    vehicle: {
      id: 'bmw-3-f30-320d-190',
      make: 'BMW',
      model: '3 Series',
      generation: '3 Series (F30, F31, F80)',
      yearRange: '2011 - 2019',
      year: 2017,
      engine: '320d 2.0 (190 HP / 140 kW)',
      engineCode: 'B47D20A',
      powerHp: 190,
      fuelType: 'Diesel',
      regNumber: 'KU67 YZL',
      vin: 'WBA3D3100EK987654',
      nickname: 'Family Tourer',
    },
  },
  {
    code: 'HN19OPA',
    vehicle: {
      id: 'audi-a4-b9-20tdi-150',
      make: 'Audi',
      model: 'A4',
      generation: 'A4 B9 (8W2, 8WC, 8W5)',
      yearRange: '2015 - 2023',
      year: 2019,
      engine: '2.0 TDI (150 HP / 110 kW)',
      engineCode: 'DEUA',
      powerHp: 150,
      fuelType: 'Diesel',
      regNumber: 'HN19 OPA',
      vin: 'WAUZZZF45KA112233',
    },
  },
  {
    code: 'LR71KMB',
    vehicle: {
      id: 'toyota-corolla-e210-18h-122',
      make: 'Toyota',
      model: 'Corolla',
      generation: 'Corolla E210 (_E21_)',
      yearRange: '2018 - Present',
      year: 2021,
      engine: '1.8 Hybrid (122 HP / 90 kW)',
      engineCode: '2ZR-FXE',
      powerHp: 122,
      fuelType: 'Hybrid',
      regNumber: 'LR71 KMB',
      vin: 'JTDKN36U001998877',
    },
  },
  {
    code: 'BD20VXZ',
    vehicle: {
      id: 'ford-focus-mk4-15eb-150',
      make: 'Ford',
      model: 'Focus',
      generation: 'Focus Mk4 (HN)',
      yearRange: '2018 - Present',
      year: 2020,
      engine: '1.5 EcoBoost (150 HP / 110 kW)',
      engineCode: 'YZDA',
      powerHp: 150,
      fuelType: 'Petrol',
      regNumber: 'BD20 VXZ',
      vin: 'WF0KXXGCRK1239999',
    },
  },
];

export const INITIAL_GARAGE_VEHICLES: Vehicle[] = [
  SAMPLE_VIN_REG_DATABASE[0].vehicle,
  SAMPLE_VIN_REG_DATABASE[2].vehicle,
];

export function decodeVinOrReg(query: string): Vehicle {
  const clean = query.replace(/\s+/g, '').toUpperCase();
  const found = SAMPLE_VIN_REG_DATABASE.find(
    item => item.code.replace(/\s+/g, '').toUpperCase() === clean
  );
  if (found) return { ...found.vehicle };

  const randomEngine = VEHICLE_MAKES_DATABASE[0].models[0].generations[0].engines[1];
  return {
    id: `custom-veh-${Date.now()}`,
    make: 'Volkswagen',
    model: 'Golf',
    generation: 'Golf Mk7 (5G1, BQ1, BE1, BE2)',
    yearRange: '2012 - 2020',
    year: 2017,
    engine: randomEngine.name,
    engineCode: randomEngine.code,
    powerHp: randomEngine.powerHp,
    fuelType: randomEngine.fuelType,
    regNumber: query.length <= 8 ? query.toUpperCase() : 'GB68 TYU',
    vin: query.length > 8 ? query.toUpperCase() : 'WVWZZZAUZHP992810',
    nickname: 'Verified Vehicle',
  };
}
