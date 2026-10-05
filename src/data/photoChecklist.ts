import { ComprehensivePhotoSlot, PhotoSlotKey } from '../types';

/**
 * REDESIGNED EVALUATE CAR PHOTO CHECKLIST
 * Strictly 9 REQUIRED and 3 OPTIONAL inputs.
 * All other photo-upload requirements removed.
 */
export const REQUIRED_PHOTO_KEYS: PhotoSlotKey[] = [
  'front',
  'right_side',
  'left_side',
  'rear',
  'odometer',
  'front_interior',
  'rear_interior',
  'rc_front',
  'rc_back',
];

export const OPTIONAL_PHOTO_KEYS: PhotoSlotKey[] = [
  'engine_bay',
  'front_tyre',
  'rear_tyre',
];

export const REDESIGNED_PHOTO_CHECKLIST: ComprehensivePhotoSlot[] = [
  // ==========================================
  // REQUIRED PHOTOS (1 - 9)
  // ==========================================
  {
    id: 'req-front',
    category: 'exterior',
    key: 'front',
    label: '1. Front Photo',
    instruction: 'Stand 2-3 meters head-on. Capture complete front bumper, grille, headlamps, and registration plate.',
    isRequired: true,
    status: 'pending',
  },
  {
    id: 'req-right-side',
    category: 'exterior',
    key: 'right_side',
    label: '2. Right Side Photo',
    instruction: 'Full right-side profile showing both doors, running board, right fender, and wheel alignment.',
    isRequired: true,
    status: 'pending',
  },
  {
    id: 'req-left-side',
    category: 'exterior',
    key: 'left_side',
    label: '3. Left Side Photo',
    instruction: 'Full left-side profile showing both doors, quarter panels, rocker sill, and paint continuity.',
    isRequired: true,
    status: 'pending',
  },
  {
    id: 'req-rear',
    category: 'exterior',
    key: 'rear',
    label: '4. Rear Photo',
    instruction: 'Direct rear view. Capture rear bumper, boot lid, taillights, model & variant badging.',
    isRequired: true,
    status: 'pending',
  },
  {
    id: 'req-odometer',
    category: 'interior',
    key: 'odometer',
    label: '5. Odometer',
    instruction: 'Clear, glare-free photo of instrument cluster with ignition ON showing total km reading.',
    isRequired: true,
    status: 'pending',
  },
  {
    id: 'req-front-interior',
    category: 'interior',
    key: 'front_interior',
    label: '6. Front Interior',
    instruction: 'Front cabin shot capturing dashboard, steering wheel, gear shifter (manual/auto), and front seats.',
    isRequired: true,
    status: 'pending',
  },
  {
    id: 'req-rear-interior',
    category: 'interior',
    key: 'rear_interior',
    label: '7. Rear Interior',
    instruction: 'Rear cabin shot capturing rear seat upholstery, floor carpets, door trim, and rear AC vents.',
    isRequired: true,
    status: 'pending',
  },
  {
    id: 'req-rc-front',
    category: 'documents',
    key: 'rc_front',
    label: '8. RC Front',
    instruction: 'Clear photo of Registration Certificate FRONT showing Reg No, Owner Name, Maker & Model.',
    isRequired: true,
    status: 'pending',
  },
  {
    id: 'req-rc-back',
    category: 'documents',
    key: 'rc_back',
    label: '9. RC Back',
    instruction: 'Clear photo of Registration Certificate REVERSE showing Chassis/VIN, Engine No, Fuel & Mfg Year.',
    isRequired: true,
    status: 'pending',
  },

  // ==========================================
  // OPTIONAL PHOTOS (10 - 12)
  // ==========================================
  {
    id: 'opt-engine-bay',
    category: 'engine',
    key: 'engine_bay',
    label: '10. Engine Bay',
    instruction: 'Full engine compartment with bonnet raised showing apron seals, fluid reservoirs, and battery.',
    isRequired: false,
    status: 'pending',
  },
  {
    id: 'opt-front-tyre',
    category: 'tyres',
    key: 'front_tyre',
    label: '11. Front Tyre',
    instruction: 'Close-up of front tyre tread depth grooves, sidewall condition, and rim/alloy surface.',
    isRequired: false,
    status: 'pending',
  },
  {
    id: 'opt-rear-tyre',
    category: 'tyres',
    key: 'rear_tyre',
    label: '12. Rear Tyre',
    instruction: 'Close-up of rear tyre tread pattern, shoulder wear, and wheel arch cleanliness.',
    isRequired: false,
    status: 'pending',
  },
];

// Alias exports for compatibility
export const COMPREHENSIVE_PHOTO_CHECKLIST = REDESIGNED_PHOTO_CHECKLIST;
export const INITIAL_EVALUATE_PHOTO_SLOTS = REDESIGNED_PHOTO_CHECKLIST;

/**
 * Pre-configured test vehicle photo packs for quick one-click evaluator verification
 * Covering Grand Vitara, Dzire, Brezza, Creta, Nexon, Scorpio-N as requested.
 */
export interface TestVehiclePhotoPack {
  id: string;
  name: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic' | 'AMT' | 'CVT' | 'DCT';
  odometerKm: number;
  regNumber: string;
  conditionGrade: 'Excellent' | 'Good' | 'Fair' | 'Refurbishment Required';
  photos: Record<string, string>;
  notes: string;
}

export const TEST_VEHICLE_PACKS: TestVehiclePhotoPack[] = [
  {
    id: 'grand-vitara-sigma',
    name: 'Maruti Suzuki Grand Vitara (Sigma 2024)',
    make: 'Maruti Suzuki',
    model: 'Grand Vitara',
    variant: 'Sigma',
    year: 2024,
    fuelType: 'Petrol',
    transmission: 'Manual',
    odometerKm: 18450,
    regNumber: 'TS 09 GV 8841',
    conditionGrade: 'Good',
    notes: 'Single owner, pristine showroom condition, verified Sigma trim.',
    photos: {
      front: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      right_side: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
      left_side: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      odometer: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
      front_interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
      rear_interior: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
      rc_front: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
      rc_back: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
      engine_bay: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
      front_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
      rear_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
    },
  },
  {
    id: 'dzire-zxi-plus',
    name: 'Maruti Suzuki Dzire (ZXi+ 2023)',
    make: 'Maruti Suzuki',
    model: 'Dzire',
    variant: 'ZXi+',
    year: 2023,
    fuelType: 'Petrol',
    transmission: 'Manual',
    odometerKm: 32100,
    regNumber: 'MH 02 DZ 4120',
    conditionGrade: 'Good',
    notes: 'Well maintained, top-spec ZXi+ with touchscreen and push start, clean RC.',
    photos: {
      front: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      right_side: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
      left_side: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      odometer: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
      front_interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
      rear_interior: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
      rc_front: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
      rc_back: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
      engine_bay: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
      front_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
      rear_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
    },
  },
  {
    id: 'brezza-zxi',
    name: 'Maruti Suzuki Brezza (ZXi 2023)',
    make: 'Maruti Suzuki',
    model: 'Brezza',
    variant: 'ZXi',
    year: 2023,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    odometerKm: 26800,
    regNumber: 'KA 03 BZ 9012',
    conditionGrade: 'Good',
    notes: 'Sunroof equipped ZXi AT, regular Maruti dealership service logs.',
    photos: {
      front: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      right_side: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
      left_side: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      odometer: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
      front_interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
      rear_interior: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
      rc_front: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
      rc_back: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
      engine_bay: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
      front_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
      rear_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
    },
  },
  {
    id: 'creta-sx-o',
    name: 'Hyundai Creta (SX(O) Diesel AT 2022)',
    make: 'Hyundai',
    model: 'Creta',
    variant: 'SX(O)',
    year: 2022,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    odometerKm: 39500,
    regNumber: 'TS 09 EA 4821',
    conditionGrade: 'Good',
    notes: 'Top trim with panoramic roof, Bose audio, verified Telangana RTO registration.',
    photos: {
      front: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      right_side: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
      left_side: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      odometer: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
      front_interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
      rear_interior: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
      rc_front: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
      rc_back: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
      engine_bay: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
      front_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
      rear_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
    },
  },
  {
    id: 'nexon-xz-plus',
    name: 'Tata Motors Nexon (XZ+ 2022)',
    make: 'Tata Motors',
    model: 'Nexon',
    variant: 'XZ+',
    year: 2022,
    fuelType: 'Petrol',
    transmission: 'Manual',
    odometerKm: 28400,
    regNumber: 'DL 3C CE 1092',
    conditionGrade: 'Good',
    notes: 'Sunroof & Harman audio, 5-star GNCAP rating, clean single ownership.',
    photos: {
      front: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1000&q=80',
      right_side: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
      left_side: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      odometer: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
      front_interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
      rear_interior: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
      rc_front: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
      rc_back: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
      engine_bay: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
      front_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
      rear_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
    },
  },
  {
    id: 'scorpio-n-z8l',
    name: 'Mahindra Scorpio-N (Z8 L 4XPLOR 2023)',
    make: 'Mahindra',
    model: 'Scorpio-N',
    variant: 'Z8 L',
    year: 2023,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    odometerKm: 21900,
    regNumber: 'MH 14 SN 5500',
    conditionGrade: 'Excellent',
    notes: 'Top-of-line Z8 L 4WD with Sony 3D audio and coffee leatherette interior.',
    photos: {
      front: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      right_side: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1000&q=80',
      left_side: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
      rear: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      odometer: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
      front_interior: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
      rear_interior: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
      rc_front: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80',
      rc_back: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80',
      engine_bay: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
      front_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
      rear_tyre: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
    },
  },
];
