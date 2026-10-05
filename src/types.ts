export type ConditionCategory = 'GOOD' | 'FAIR' | 'NEEDS ATTENTION' | 'HIGH RISK';
export type FloodRiskCategory = 'LOW INDICATION' | 'POSSIBLE WATER EXPOSURE' | 'HIGH-RISK INDICATORS' | 'PHYSICAL INSPECTION REQUIRED';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type InspectionStatus = 'Not Requested' | 'Pending' | 'Scheduled' | 'Completed' | 'REQUESTED' | 'ASSIGNED' | 'IN PROGRESS' | 'CANCELLED';
export type InspectionRequestStatus = 'REQUESTED' | 'ASSIGNED' | 'IN PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type DocumentMatchStatus = 'MATCH' | 'MISMATCH' | 'UNREADABLE' | 'REQUIRES_VERIFICATION';
export type UserRole = 'USER / DEALER' | 'EVALUATOR' | 'ADMIN / OWNER';

export interface UserSession {
  role: UserRole;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

export type PhotoCategory = 'exterior' | 'interior' | 'engine' | 'tyres' | 'underbody' | 'documents' | 'closeups';

export interface ComprehensivePhotoSlot {
  id: string;
  category: PhotoCategory;
  key: string;
  label: string;
  instruction: string;
  isRequired: boolean;
  isNotApplicableAllowed?: boolean;
  isNotApplicable?: boolean;
  notCapturedReason?: string;
  dataUrl?: string;
  status: 'pending' | 'captured' | 'quality_flagged' | 'not_applicable' | 'not_captured';
  qualityIssue?: string;
  capturedAt?: string;
}

export interface VehicleVariant {
  id: string;
  make: string;
  model: string;
  generation?: string;
  variant: string;
  yearStart: number;
  yearEnd: number;
  fuelTypes: ('Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid')[];
  transmissions: ('Manual' | 'Automatic' | 'AMT' | 'CVT' | 'DCT')[];
  baseExShowroomINR: number;
  tier: 'Base' | 'Mid' | 'Top' | 'Premium';
  keyFeatures: string[];
  isCustom?: boolean;
}

export type VehicleConditionGrade = 'Excellent' | 'Good' | 'Fair' | 'Refurbishment Required';

export interface VehicleDetails {
  registrationNumber: string;
  make: string;
  model: string;
  variant: string;
  manufacturingYear: number;
  registrationYear: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic' | 'AMT' | 'CVT' | 'DCT';
  engineDisplacement?: string;
  kilometresDriven: number;
  numberOfOwners: number;
  city: string;
  insuranceStatus: 'Comprehensive' | 'Third Party Only' | 'Expired' | "Don't know";
  serviceHistory: 'Authorized Dealership Only' | 'Mixed Service Records' | 'Independent Garage' | "Don't know";
  accidentHistory: 'No Claims / Accident Free' | 'Minor Cosmetic Claim' | 'Major Structural Claim' | "Don't know";
  knownRepairs: string;
  loanStatus: 'Clear / No Loan' | 'Hypothecated to Bank' | 'NOC in Hand' | "Don't know";
  vinChassis?: string;
  conditionGrade?: VehicleConditionGrade;
  variantRequiresVerification?: boolean;
  variantDetectionSource?: 'auto_rc' | 'manual_verified' | 'unverified';
}

export type PhotoSlotKey =
  | 'front'
  | 'right_side'
  | 'left_side'
  | 'rear'
  | 'odometer'
  | 'front_interior'
  | 'rear_interior'
  | 'rc_front'
  | 'rc_back'
  | 'engine_bay'
  | 'front_tyre'
  | 'rear_tyre'
  // Legacy aliases for backward compatibility
  | 'front_left_corner'
  | 'front_right_corner'
  | 'rear_left_corner'
  | 'rear_right_corner'
  | 'dashboard'
  | 'front_seats'
  | 'rear_seats'
  | 'boot'
  | 'tyres'
  | 'underbody'
  | 'rc_scan';

export interface CrossCheckField {
  field: string;
  value: string;
  source: string;
  status: 'Verified' | 'Unable to verify' | 'Discrepancy';
  detail: string;
}

export interface CrossCheckReport {
  overallConfidence: 'High' | 'Medium' | 'Low' | 'Requires Verification';
  fields: CrossCheckField[];
  unverifiedNotes: string[];
  exteriorEvidence: string;
  rcEvidence: string;
  odometerEvidence: string;
  interiorEvidence: string;
}

export interface VehiclePhotoSlot {
  key: PhotoSlotKey;
  label: string;
  description: string;
  isRequired: boolean;
  isPrimary: boolean;
  dataUrl?: string;
  status: 'empty' | 'uploaded' | 'warning' | 'error';
  qualityIssue?: string;
  confidenceScore?: number;
}

export interface RcDocumentData {
  registrationNumber: string;
  ownerName: string;
  ownerSerial: string;
  make: string;
  model: string;
  fuelType: string;
  registrationDate: string;
  engineNumber: string;
  chassisNumber: string;
  fitnessUpto: string;
  insuranceUpto: string;
  isMasked: boolean;
  fieldMatches: {
    registration: DocumentMatchStatus;
    makeModel: DocumentMatchStatus;
    fuel: DocumentMatchStatus;
    ownerSerial: DocumentMatchStatus;
  };
}

export interface DamageFinding {
  id: string;
  component: string;
  finding: string;
  confidence: 'High' | 'Medium' | 'Low';
  imageReference: string;
  potentialSeverity: 'Minor' | 'Moderate' | 'Critical';
  status: 'Requires physical verification';
  repairEstimateINR: number;
}

export interface FloodFinding {
  id: string;
  area: string;
  indicator: string;
  severity: 'Low' | 'Medium' | 'High';
  notes: string;
}

export interface WarningLightStatus {
  light: string;
  active: boolean;
  label: string;
}

export interface DashboardAnalysis {
  detectedOdometerKm: number;
  statedKm: number;
  discrepancyStatus: 'Consistent' | 'Potential Discrepancy' | 'Unverified';
  confidence: 'High' | 'Medium' | 'Low';
  warningLights: WarningLightStatus[];
  fuelLevel: string;
  tempIndicator: string;
}

export interface ConditionScore {
  overallCategory: ConditionCategory;
  exteriorScore: ConditionCategory;
  interiorScore: ConditionCategory;
  tyresScore: ConditionCategory;
  electronicsScore: ConditionCategory;
  engineScore: ConditionCategory;
  documentsScore: ConditionCategory;
  floodRiskCategory: FloodRiskCategory;
  explanations: {
    exterior: string;
    interior: string;
    tyres: string;
    electronics?: string;
    engine?: string;
    documents: string;
  };
}

export interface ValuationWaterfallItem {
  label: string;
  amount: number;
  type: 'positive' | 'negative' | 'neutral';
  note: string;
}

export interface ComparableVehicle {
  id: string;
  makeModel: string;
  year: number;
  km: number;
  location: string;
  priceType: 'Listing Price' | 'Observed Transaction' | 'Estimated Price';
  priceINR: number;
  differenceVsEstimate: number;
}

export interface MarketValuation {
  baseMarketValue: number;
  estimatedMarketValueMin: number;
  estimatedMarketValueMax: number;
  suggestedDealerPurchaseMin: number;
  suggestedDealerPurchaseMax: number;
  potentialRetailMin: number;
  potentialRetailMax: number;
  expectedNegotiationBuffer: number;
  expectedRepairAllowance: number;
  breakdownWaterfall: ValuationWaterfallItem[];
  comparableVehicles: ComparableVehicle[];
}

export interface TrustedManager {
  id: string;
  name: string;
  role: string;
  specialisation: string;
  location: string;
  phone: string;
  whatsapp: string;
  availability: string;
  yearsOfExperience: number;
  verificationStatus: 'Verified Manager' | 'Pending';
}

export interface InspectionManager {
  id: string;
  name: string;
  role: string;
  city: string;
  phone: string;
  email: string;
  specialisations: string[];
  experienceYears?: number;
  completedInspections: number;
  rating?: number;
  isVerified: boolean;
}

export interface TrustedEvaluatorConfig {
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  location: string;
  specialisation?: string;
  availability?: string;
  profilePhoto?: string;
  status: string;
  experience?: string;
  isPrimary?: boolean;
}

export interface WhatsAppApiConfig {
  phoneNumberId?: string;
  apiToken?: string;
  businessAccountId?: string;
  isEnabled?: boolean;
}

export interface DealershipSettings {
  businessName: string;
  tradeName: string;
  gstin: string;
  dealerPrincipal: string;
  address: string;
  phone: string;
  email: string;
  defaultMarginPercent: number;
  panelRefinishingCostINR: number;
  floodRiskBufferPercent: number;
  baselineAnnualKm: number;
  trustedEvaluator?: TrustedEvaluatorConfig;
  whatsappApi?: WhatsAppApiConfig;
}

export interface ValuationOverrideLog {
  id: string;
  evaluationId: string;
  registrationNumber: string;
  originalEstimate: number;
  newEstimate: number;
  reason: string;
  author: string;
  timestamp: string;
}

export type InspectionStatusType =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'CONTACTED'
  | 'SCHEDULED'
  | 'IN PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'Requested'
  | 'Scheduled'
  | 'Completed'
  | 'In Progress';

export type WhatsAppNotificationStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';

export interface InspectionRequest {
  id: string;
  vehicleId?: string;
  evaluationId?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerConsentAgreed?: boolean;
  registrationNumber: string;
  vehicleDetails: string;
  assignedManagerId: string;
  assignedManagerName: string;
  assignedManagerRole?: string;
  assignedManagerPhone?: string;
  assignedManagerWhatsapp?: string;
  requestedDate: string;
  preferredDate?: string;
  preferredTime?: string;
  inspectionType?: string;
  location: string;
  notes: string;
  estimatedMarketValue?: number | string;
  suggestedDealerPurchaseRange?: string;
  status: InspectionStatusType;
  whatsappStatus?: WhatsAppNotificationStatus;
  whatsappError?: string;
  whatsappSentAt?: string;
  whatsappDirectLink?: string;
  createdAt?: string;
  physicalFindings?: {
    paintMicrons?: number;
    chassisNote?: string;
    obdSummary?: string;
  };
}

export interface PhysicalComparisonItem {
  findingId: string;
  component: string;
  photoFinding: string;
  physicalFinding: string;
  variance: string;
  verifiedStatus: 'Confirmed' | 'Disproved' | 'Modified';
}

export interface ManualOverrideEntry {
  evaluationId: string;
  registrationNumber: string;
  originalMin: number;
  originalMax: number;
  newMin: number;
  newMax: number;
  reason: string;
  author: string;
  timestamp: string;
}

export interface EvaluationRecord {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  fuelType: string;
  transmission: string;
  km: number;
  owners: number;
  city: string;
  conditionStatus: 'Good' | 'Needs Inspection' | 'Damage Detected' | 'Possible Flood Exposure' | 'Verified';
  riskLevel: RiskLevel;
  estimatedValueMin: number;
  estimatedValueMax: number;
  dealerBuyMin: number;
  dealerBuyMax: number;
  retailMin: number;
  retailMax: number;
  repairAllowance: number;
  negotiationBuffer: number;
  inspectionStatus: InspectionStatus;
  date: string;
  completedAt?: string;
  details: Partial<VehicleDetails>;
  photos: VehiclePhotoSlot[];
  rcData?: RcDocumentData;
  damageFindings: DamageFinding[];
  floodFindings: FloodFinding[];
  dashboardAnalysis: DashboardAnalysis;
  conditionScore: ConditionScore;
  valuationBreakdown: ValuationWaterfallItem[];
  comparableVehicles: ComparableVehicle[];
  physicalComparison?: PhysicalComparisonItem[];
  manualOverride?: ManualOverrideEntry;
}

export interface DealerSettings {
  businessProfile: {
    companyName: string;
    registeredEntity: string;
    dealershipId: string;
    ownerName: string;
    phone: string;
    email: string;
    address: string;
    gstin: string;
    authorizedInspectionHubs: string;
    reportDisclaimer: string;
  };
  valuationRules: {
    dealerMarginTargetPercent: number;
    minNegotiationBufferINR: number;
    paintPanelRefinishCostINR: number;
    tyrePerUnitAllowanceINR: number;
    waterExposureBufferPercent: number;
    secondOwnerDepreciationPercent: number;
  };
  marketAdjustments: {
    hyderabadMultiplier: number;
    bangaloreMultiplier: number;
    mumbaiMultiplier: number;
    delhiNcrMultiplier: number;
  };
  overrideAuditLogs: ManualOverrideEntry[];
}
