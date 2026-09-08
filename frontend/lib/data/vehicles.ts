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
      {
        name: 'Tiguan',
        generations: [
          {
            name: 'Tiguan I (5N)',
            yearRange: '2007 - 2016',
            startYear: 2007,
            endYear: 2016,
            engines: [
              { id: 'vw-tiguan-1-20tdi-140', name: '2.0 TDI 4Motion (140 HP / 103 kW)', code: 'CFGB', displacement: '1968 ccm', powerHp: 140, powerKw: 103, fuelType: 'Diesel' },
              { id: 'vw-tiguan-1-14tsi-122', name: '1.4 TSI (122 HP / 90 kW)', code: 'CAVD', displacement: '1390 ccm', powerHp: 122, powerKw: 90, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'T-Roc',
        generations: [
          {
            name: 'T-Roc (A1)',
            yearRange: '2017 - Present',
            startYear: 2017,
            endYear: 2026,
            engines: [
              { id: 'vw-troc-a1-10tsi-115', name: '1.0 TSI (115 HP / 85 kW)', code: 'DKRF', displacement: '999 ccm', powerHp: 115, powerKw: 85, fuelType: 'Petrol' },
              { id: 'vw-troc-a1-20tdi-150', name: '2.0 TDI 4Motion (150 HP / 110 kW)', code: 'DFHA', displacement: '1968 ccm', powerHp: 150, powerKw: 110, fuelType: 'Diesel' },
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
      {
        name: 'X3',
        generations: [
          {
            name: 'X3 (G01)',
            yearRange: '2017 - Present',
            startYear: 2017,
            endYear: 2026,
            engines: [
              { id: 'bmw-x3-g01-20d-190', name: 'X3 xDrive20d (190 HP / 140 kW)', code: 'B47D20B', displacement: '1995 ccm', powerHp: 190, powerKw: 140, fuelType: 'Diesel' },
              { id: 'bmw-x3-g01-30i-252', name: 'X3 xDrive30i (252 HP / 185 kW)', code: 'B48B20B', displacement: '1998 ccm', powerHp: 252, powerKw: 185, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'X5',
        generations: [
          {
            name: 'X5 (G05)',
            yearRange: '2018 - Present',
            startYear: 2018,
            endYear: 2026,
            engines: [
              { id: 'bmw-x5-g05-30d-286', name: 'X5 xDrive30d (286 HP / 210 kW)', code: 'B57D30A', displacement: '2993 ccm', powerHp: 286, powerKw: 210, fuelType: 'Diesel' },
              { id: 'bmw-x5-g05-40i-340', name: 'X5 xDrive40i (340 HP / 250 kW)', code: 'B58B30M0', displacement: '2998 ccm', powerHp: 340, powerKw: 250, fuelType: 'Petrol' },
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
      {
        name: 'Q5',
        generations: [
          {
            name: 'Q5 II (FY)',
            yearRange: '2017 - Present',
            startYear: 2017,
            endYear: 2026,
            engines: [
              { id: 'audi-q5-fy-20tdi-190', name: '2.0 TDI quattro (190 HP / 140 kW)', code: 'DFGA', displacement: '1968 ccm', powerHp: 190, powerKw: 140, fuelType: 'Diesel' },
              { id: 'audi-q5-fy-40tfsi-249', name: '40 TFSI quattro (249 HP / 183 kW)', code: 'DPCA', displacement: '1984 ccm', powerHp: 249, powerKw: 183, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'A6',
        generations: [
          {
            name: 'A6 C8 (4A2, 4A5)',
            yearRange: '2018 - Present',
            startYear: 2018,
            endYear: 2026,
            engines: [
              { id: 'audi-a6-c8-40tdi-204', name: '40 TDI (204 HP / 150 kW)', code: 'DTUC', displacement: '1968 ccm', powerHp: 204, powerKw: 150, fuelType: 'Diesel' },
              { id: 'audi-a6-c8-45tfsi-245', name: '45 TFSI quattro (245 HP / 180 kW)', code: 'DPBA', displacement: '1984 ccm', powerHp: 245, powerKw: 180, fuelType: 'Petrol' },
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
      {
        name: 'RAV4',
        generations: [
          {
            name: 'RAV4 V (_A5_)',
            yearRange: '2018 - Present',
            startYear: 2018,
            endYear: 2026,
            engines: [
              { id: 'toyota-rav4-5-25h-218', name: '2.5 Hybrid AWD-i (218 HP / 160 kW)', code: 'A25A-FXS', displacement: '2487 ccm', powerHp: 218, powerKw: 160, fuelType: 'Hybrid' },
              { id: 'toyota-rav4-5-20-173', name: '2.0 Valvematic (173 HP / 127 kW)', code: 'M20A-FKS', displacement: '1987 ccm', powerHp: 173, powerKw: 127, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Hilux',
        generations: [
          {
            name: 'Hilux VIII (_N2_, _N3_)',
            yearRange: '2015 - Present',
            startYear: 2015,
            endYear: 2026,
            engines: [
              { id: 'toyota-hilux-8-24d-150', name: '2.4 D-4D (150 HP / 110 kW)', code: '2GD-FTV', displacement: '2393 ccm', powerHp: 150, powerKw: 110, fuelType: 'Diesel' },
              { id: 'toyota-hilux-8-28d-204', name: '2.8 D-4D (204 HP / 150 kW)', code: '1GD-FTV', displacement: '2755 ccm', powerHp: 204, powerKw: 150, fuelType: 'Diesel' },
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
      {
        name: 'Kuga',
        generations: [
          {
            name: 'Kuga III',
            yearRange: '2019 - Present',
            startYear: 2019,
            endYear: 2026,
            engines: [
              { id: 'ford-kuga-3-15ecoblue-120', name: '1.5 EcoBlue (120 HP / 88 kW)', code: 'UFDA', displacement: '1499 ccm', powerHp: 120, powerKw: 88, fuelType: 'Diesel' },
              { id: 'ford-kuga-3-25phev-225', name: '2.5 PHEV (225 HP / 165 kW)', code: 'K4MB', displacement: '2488 ccm', powerHp: 225, powerKw: 165, fuelType: 'Hybrid' },
            ],
          },
        ],
      },
      {
        name: 'Ranger',
        generations: [
          {
            name: 'Ranger IV',
            yearRange: '2019 - Present',
            startYear: 2019,
            endYear: 2026,
            engines: [
              { id: 'ford-ranger-4-20ecoblue-170', name: '2.0 EcoBlue Bi-Turbo (213 HP / 157 kW)', code: 'CFPA', displacement: '1996 ccm', powerHp: 213, powerKw: 157, fuelType: 'Diesel' },
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
      {
        name: 'E-Class',
        generations: [
          {
            name: 'E-Class (W213, S213)',
            yearRange: '2016 - 2023',
            startYear: 2016,
            endYear: 2023,
            engines: [
              { id: 'mb-e220d-w213-194', name: 'E 220 d 2.0 (194 HP / 143 kW)', code: 'OM 654.920', displacement: '1950 ccm', powerHp: 194, powerKw: 143, fuelType: 'Diesel' },
              { id: 'mb-e200-w213-184', name: 'E 200 2.0 (184 HP / 135 kW)', code: 'M 264.920', displacement: '1991 ccm', powerHp: 184, powerKw: 135, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'GLC',
        generations: [
          {
            name: 'GLC (X253)',
            yearRange: '2015 - 2022',
            startYear: 2015,
            endYear: 2022,
            engines: [
              { id: 'mb-glc220d-x253-194', name: 'GLC 220 d 4MATIC (194 HP / 143 kW)', code: 'OM 654.920', displacement: '1950 ccm', powerHp: 194, powerKw: 143, fuelType: 'Diesel' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Hyundai',
    models: [
      {
        name: 'Elantra',
        generations: [
          {
            name: 'Elantra CN7',
            yearRange: '2020 - Present',
            startYear: 2020,
            endYear: 2026,
            engines: [
              { id: 'hyundai-elantra-cn7-16-123', name: '1.6 MPI (123 HP / 90 kW)', code: 'G4FG', displacement: '1591 ccm', powerHp: 123, powerKw: 90, fuelType: 'Petrol' },
              { id: 'hyundai-elantra-cn7-20-149', name: '2.0 MPI (149 HP / 110 kW)', code: 'G4NL', displacement: '1999 ccm', powerHp: 149, powerKw: 110, fuelType: 'Petrol' },
            ],
          },
          {
            name: 'Elantra AD',
            yearRange: '2015 - 2020',
            startYear: 2015,
            endYear: 2020,
            engines: [
              { id: 'hyundai-elantra-ad-16-128', name: '1.6 GDI (128 HP / 94 kW)', code: 'G4FD', displacement: '1591 ccm', powerHp: 128, powerKw: 94, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Tucson',
        generations: [
          {
            name: 'Tucson TL',
            yearRange: '2015 - 2020',
            startYear: 2015,
            endYear: 2020,
            engines: [
              { id: 'hyundai-tucson-tl-20crdi-185', name: '2.0 CRDi (185 HP / 136 kW)', code: 'D4HA', displacement: '1995 ccm', powerHp: 185, powerKw: 136, fuelType: 'Diesel' },
              { id: 'hyundai-tucson-tl-16t-177', name: '1.6 T-GDI (177 HP / 130 kW)', code: 'G4FJ', displacement: '1591 ccm', powerHp: 177, powerKw: 130, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'i30',
        generations: [
          {
            name: 'i30 III (PD)',
            yearRange: '2016 - Present',
            startYear: 2016,
            endYear: 2026,
            engines: [
              { id: 'hyundai-i30-pd-16crdi-136', name: '1.6 CRDi (136 HP / 100 kW)', code: 'D4FB', displacement: '1582 ccm', powerHp: 136, powerKw: 100, fuelType: 'Diesel' },
              { id: 'hyundai-i30-pd-14t-140', name: '1.4 T-GDI (140 HP / 103 kW)', code: 'G4LD', displacement: '1353 ccm', powerHp: 140, powerKw: 103, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Santa Fe',
        generations: [
          {
            name: 'Santa Fe IV (TM)',
            yearRange: '2018 - Present',
            startYear: 2018,
            endYear: 2026,
            engines: [
              { id: 'hyundai-santafe-tm-22crdi-202', name: '2.2 CRDi 4WD (202 HP / 147 kW)', code: 'D4HC', displacement: '2151 ccm', powerHp: 202, powerKw: 147, fuelType: 'Diesel' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Nissan',
    models: [
      {
        name: 'X-Trail',
        generations: [
          {
            name: 'X-Trail T32',
            yearRange: '2014 - 2022',
            startYear: 2014,
            endYear: 2022,
            engines: [
              { id: 'nissan-xtrail-t32-16dci-130', name: '1.6 dCi (130 HP / 96 kW)', code: 'R9M', displacement: '1598 ccm', powerHp: 130, powerKw: 96, fuelType: 'Diesel' },
              { id: 'nissan-xtrail-t32-25-171', name: '2.5 (171 HP / 126 kW)', code: 'QR25DE', displacement: '2488 ccm', powerHp: 171, powerKw: 126, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Sunny',
        generations: [
          {
            name: 'Sunny B17',
            yearRange: '2011 - Present',
            startYear: 2011,
            endYear: 2026,
            engines: [
              { id: 'nissan-sunny-b17-16-107', name: '1.6 (107 HP / 79 kW)', code: 'HR16DE', displacement: '1598 ccm', powerHp: 107, powerKw: 79, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Qashqai',
        generations: [
          {
            name: 'Qashqai II (J11)',
            yearRange: '2013 - 2021',
            startYear: 2013,
            endYear: 2021,
            engines: [
              { id: 'nissan-qashqai-j11-16dci-130', name: '1.6 dCi (130 HP / 96 kW)', code: 'R9M', displacement: '1598 ccm', powerHp: 130, powerKw: 96, fuelType: 'Diesel' },
              { id: 'nissan-qashqai-j11-13dig-140', name: '1.3 DIG-T (140 HP / 103 kW)', code: 'HR13DDT', displacement: '1332 ccm', powerHp: 140, powerKw: 103, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Navara',
        generations: [
          {
            name: 'Navara (D23)',
            yearRange: '2015 - Present',
            startYear: 2015,
            endYear: 2026,
            engines: [
              { id: 'nissan-navara-d23-23dci-190', name: '2.3 dCi Twin-Turbo (190 HP / 140 kW)', code: 'YS23', displacement: '2298 ccm', powerHp: 190, powerKw: 140, fuelType: 'Diesel' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Isuzu',
    models: [
      {
        name: 'D-Max',
        generations: [
          {
            name: 'D-Max III',
            yearRange: '2012 - Present',
            startYear: 2012,
            endYear: 2026,
            engines: [
              { id: 'isuzu-dmax-3-25ddi-136', name: '2.5 DDi (136 HP / 100 kW)', code: '4JK1-TC', displacement: '2499 ccm', powerHp: 136, powerKw: 100, fuelType: 'Diesel' },
              { id: 'isuzu-dmax-3-30ddi-177', name: '3.0 DDi (177 HP / 130 kW)', code: '4JJ1-TC', displacement: '2999 ccm', powerHp: 177, powerKw: 130, fuelType: 'Diesel' },
            ],
          },
        ],
      },
      {
        name: 'MU-X',
        generations: [
          {
            name: 'MU-X II',
            yearRange: '2020 - Present',
            startYear: 2020,
            endYear: 2026,
            engines: [
              { id: 'isuzu-mux-2-30ddi-190', name: '3.0 DDi (190 HP / 140 kW)', code: '4JJ3-TCX', displacement: '2999 ccm', powerHp: 190, powerKw: 140, fuelType: 'Diesel' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Suzuki',
    models: [
      {
        name: 'Vitara',
        generations: [
          {
            name: 'Vitara IV (LY)',
            yearRange: '2015 - Present',
            startYear: 2015,
            endYear: 2026,
            engines: [
              { id: 'suzuki-vitara-4-16-120', name: '1.6 VVT (120 HP / 88 kW)', code: 'M16A', displacement: '1586 ccm', powerHp: 120, powerKw: 88, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Swift',
        generations: [
          {
            name: 'Swift IV (AZ)',
            yearRange: '2017 - Present',
            startYear: 2017,
            endYear: 2026,
            engines: [
              { id: 'suzuki-swift-4-12-90', name: '1.2 Dualjet (90 HP / 66 kW)', code: 'K12C', displacement: '1242 ccm', powerHp: 90, powerKw: 66, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'Jimny',
        generations: [
          {
            name: 'Jimny IV (JB74)',
            yearRange: '2018 - Present',
            startYear: 2018,
            endYear: 2026,
            engines: [
              { id: 'suzuki-jimny-4-13-102', name: '1.3 VVT (102 HP / 75 kW)', code: 'K13C', displacement: '1328 ccm', powerHp: 102, powerKw: 75, fuelType: 'Petrol' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Kia',
    models: [
      {
        name: 'Sportage',
        generations: [
          {
            name: 'Sportage V (NQ5)',
            yearRange: '2021 - Present',
            startYear: 2021,
            endYear: 2026,
            engines: [
              { id: 'kia-sportage-5-16t-150', name: '1.6 T-GDI (150 HP / 110 kW)', code: 'G4FT', displacement: '1591 ccm', powerHp: 150, powerKw: 110, fuelType: 'Petrol' },
              { id: 'kia-sportage-5-16crdi-136', name: '1.6 CRDi (136 HP / 100 kW)', code: 'D4FE', displacement: '1598 ccm', powerHp: 136, powerKw: 100, fuelType: 'Diesel' },
            ],
          },
          {
            name: 'Sportage IV (QL)',
            yearRange: '2015 - 2021',
            startYear: 2015,
            endYear: 2021,
            engines: [
              { id: 'kia-sportage-4-17crdi-115', name: '1.7 CRDi (115 HP / 85 kW)', code: 'D4FD', displacement: '1685 ccm', powerHp: 115, powerKw: 85, fuelType: 'Diesel' },
            ],
          },
        ],
      },
      {
        name: 'Ceed',
        generations: [
          {
            name: 'Ceed III (CD)',
            yearRange: '2018 - Present',
            startYear: 2018,
            endYear: 2026,
            engines: [
              { id: 'kia-ceed-3-14t-140', name: '1.4 T-GDI (140 HP / 103 kW)', code: 'G4LD', displacement: '1353 ccm', powerHp: 140, powerKw: 103, fuelType: 'Petrol' },
              { id: 'kia-ceed-3-16crdi-136', name: '1.6 CRDi (136 HP / 100 kW)', code: 'D4FB', displacement: '1582 ccm', powerHp: 136, powerKw: 100, fuelType: 'Diesel' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Honda',
    models: [
      {
        name: 'Civic',
        generations: [
          {
            name: 'Civic X (FK, FC)',
            yearRange: '2016 - 2021',
            startYear: 2016,
            endYear: 2021,
            engines: [
              { id: 'honda-civic-10-16idtec-120', name: '1.6 i-DTEC (120 HP / 88 kW)', code: 'N16A2', displacement: '1597 ccm', powerHp: 120, powerKw: 88, fuelType: 'Diesel' },
              { id: 'honda-civic-10-10vtec-129', name: '1.0 VTEC Turbo (129 HP / 95 kW)', code: 'P10A3', displacement: '988 ccm', powerHp: 129, powerKw: 95, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: 'CR-V',
        generations: [
          {
            name: 'CR-V V (RW, RT)',
            yearRange: '2018 - Present',
            startYear: 2018,
            endYear: 2026,
            engines: [
              { id: 'honda-crv-5-15vtec-193', name: '1.5 VTEC Turbo (193 HP / 142 kW)', code: 'L15BD', displacement: '1498 ccm', powerHp: 193, powerKw: 142, fuelType: 'Petrol' },
              { id: 'honda-crv-5-20h-184', name: '2.0 i-MMD Hybrid (184 HP / 135 kW)', code: 'LFA', displacement: '1993 ccm', powerHp: 184, powerKw: 135, fuelType: 'Hybrid' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Mazda',
    models: [
      {
        name: '3',
        generations: [
          {
            name: 'Mazda3 (BP)',
            yearRange: '2019 - Present',
            startYear: 2019,
            endYear: 2026,
            engines: [
              { id: 'mazda-3-bp-20skyactivg-122', name: '2.0 Skyactiv-G (122 HP / 90 kW)', code: 'PE-VPS', displacement: '1998 ccm', powerHp: 122, powerKw: 90, fuelType: 'Petrol' },
              { id: 'mazda-3-bp-18skyactivd-116', name: '1.8 Skyactiv-D (116 HP / 85 kW)', code: 'S8-Y1', displacement: '1759 ccm', powerHp: 116, powerKw: 85, fuelType: 'Diesel' },
            ],
          },
        ],
      },
      {
        name: 'CX-5',
        generations: [
          {
            name: 'CX-5 (KF)',
            yearRange: '2017 - Present',
            startYear: 2017,
            endYear: 2026,
            engines: [
              { id: 'mazda-cx5-kf-22skyactivd-184', name: '2.2 Skyactiv-D AWD (184 HP / 135 kW)', code: 'SH-VPTS', displacement: '2191 ccm', powerHp: 184, powerKw: 135, fuelType: 'Diesel' },
              { id: 'mazda-cx5-kf-25skyactivg-194', name: '2.5 Skyactiv-G AWD (194 HP / 143 kW)', code: 'PY-VPS', displacement: '2488 ccm', powerHp: 194, powerKw: 143, fuelType: 'Petrol' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Peugeot',
    models: [
      {
        name: '308',
        generations: [
          {
            name: '308 II (T9)',
            yearRange: '2013 - 2021',
            startYear: 2013,
            endYear: 2021,
            engines: [
              { id: 'peugeot-308-2-16bluehdi-120', name: '1.6 BlueHDi (120 HP / 88 kW)', code: 'BH02', displacement: '1560 ccm', powerHp: 120, powerKw: 88, fuelType: 'Diesel' },
              { id: 'peugeot-308-2-12puretech-130', name: '1.2 PureTech (130 HP / 96 kW)', code: 'EB2ADTS', displacement: '1199 ccm', powerHp: 130, powerKw: 96, fuelType: 'Petrol' },
            ],
          },
        ],
      },
      {
        name: '3008',
        generations: [
          {
            name: '3008 II (P84)',
            yearRange: '2016 - Present',
            startYear: 2016,
            endYear: 2026,
            engines: [
              { id: 'peugeot-3008-2-15bluehdi-130', name: '1.5 BlueHDi (130 HP / 96 kW)', code: 'YH01', displacement: '1499 ccm', powerHp: 130, powerKw: 96, fuelType: 'Diesel' },
              { id: 'peugeot-3008-2-13puretech-131', name: '1.3 PureTech (131 HP / 96 kW)', code: 'EB2DTS', displacement: '1199 ccm', powerHp: 131, powerKw: 96, fuelType: 'Petrol' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Renault',
    models: [
      {
        name: 'Clio',
        generations: [
          {
            name: 'Clio V (BJA)',
            yearRange: '2019 - Present',
            startYear: 2019,
            endYear: 2026,
            engines: [
              { id: 'renault-clio-5-10tce-100', name: '1.0 TCe (100 HP / 74 kW)', code: 'H4D400', displacement: '999 ccm', powerHp: 100, powerKw: 74, fuelType: 'Petrol' },
              { id: 'renault-clio-5-15dci-85', name: '1.5 dCi (85 HP / 63 kW)', code: 'K9K656', displacement: '1461 ccm', powerHp: 85, powerKw: 63, fuelType: 'Diesel' },
            ],
          },
        ],
      },
      {
        name: 'Megane',
        generations: [
          {
            name: 'Megane IV (B9, K9)',
            yearRange: '2015 - 2022',
            startYear: 2015,
            endYear: 2022,
            engines: [
              { id: 'renault-megane-4-15dci-110', name: '1.5 dCi (110 HP / 81 kW)', code: 'K9K646', displacement: '1461 ccm', powerHp: 110, powerKw: 81, fuelType: 'Diesel' },
              { id: 'renault-megane-4-13tce-140', name: '1.3 TCe (140 HP / 103 kW)', code: 'H5H400', displacement: '1332 ccm', powerHp: 140, powerKw: 103, fuelType: 'Petrol' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Mitsubishi',
    models: [
      {
        name: 'Outlander',
        generations: [
          {
            name: 'Outlander III',
            yearRange: '2012 - 2021',
            startYear: 2012,
            endYear: 2021,
            engines: [
              { id: 'mitsubishi-outlander-3-22di-150', name: '2.2 DI-D (150 HP / 110 kW)', code: '4N14', displacement: '2268 ccm', powerHp: 150, powerKw: 110, fuelType: 'Diesel' },
              { id: 'mitsubishi-outlander-3-20phev-224', name: '2.0 PHEV (224 HP / 165 kW)', code: '4B11', displacement: '1998 ccm', powerHp: 224, powerKw: 165, fuelType: 'Hybrid' },
            ],
          },
        ],
      },
      {
        name: 'L200',
        generations: [
          {
            name: 'L200 (Series 6)',
            yearRange: '2019 - Present',
            startYear: 2019,
            endYear: 2026,
            engines: [
              { id: 'mitsubishi-l200-6-24di-181', name: '2.4 DI-D (181 HP / 133 kW)', code: '4N15', displacement: '2442 ccm', powerHp: 181, powerKw: 133, fuelType: 'Diesel' },
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
