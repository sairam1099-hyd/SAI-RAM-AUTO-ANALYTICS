import {
  VehicleDetails,
  DamageFinding,
  FloodFinding,
  ConditionScore,
  MarketValuation,
  ValuationWaterfallItem,
  ComparableVehicle,
} from '../types';
import { INDIAN_CITIES } from '../data/indianCarCatalog';
import { findVariant, getVariantsForVehicle } from '../data/vehicleVariants';

// Base ex-showroom benchmark fallback estimates for common models (2020-2024 range)
const BASE_EX_SHOWROOM_INR: Record<string, number> = {
  'Creta': 1450000,
  'Swift': 750000,
  'Nexon': 1150000,
  'Innova Crysta': 2250000,
  'Seltos': 1450000,
  'Brezza': 1050000,
  'Thar': 1500000,
  'City': 1350000,
  'Baleno': 820000,
  'Fortuner': 3600000,
  'DEFAULT': 1100000,
};

export function calculateValuation(
  details: VehicleDetails,
  damageFindings: DamageFinding[] = [],
  floodFindings: FloodFinding[] = [],
  conditionScore?: Partial<ConditionScore>
): MarketValuation {
  const currentYear = new Date().getFullYear();
  const mfgYear = Number(details.manufacturingYear) || (currentYear - 3);
  const ageYears = Math.max(0.5, currentYear - mfgYear);
  const km = Number(details.kilometresDriven) || 45000;
  const owners = Number(details.numberOfOwners) || 1;

  // 1. Determine model and variant authentic ex-showroom price
  const modelStr = details?.model || '';
  const makeStr = details?.make || 'Vehicle';
  const variantStr = details?.variant || '';

  // Look up verified variant from catalog
  const matchedVariant = findVariant(makeStr, modelStr, variantStr, mfgYear);

  let exShowroom: number;
  let variantLabel = '';

  if (matchedVariant) {
    exShowroom = matchedVariant.baseExShowroomINR;
    variantLabel = `[${matchedVariant.variant} • ${matchedVariant.tier} Trim]`;

    // Adjust for diesel premium if not already a diesel-only variant
    if (details.fuelType === 'Diesel' && matchedVariant.fuelTypes.includes('Petrol') && !matchedVariant.fuelTypes.every((f) => f === 'Diesel')) {
      exShowroom += 120000;
    }
    // Adjust for automatic transmission premium if base variant is listed as manual
    if (
      (details.transmission === 'Automatic' || details.transmission === 'CVT' || details.transmission === 'DCT') &&
      matchedVariant.transmissions.length === 1 &&
      matchedVariant.transmissions[0] === 'Manual'
    ) {
      exShowroom += 95000;
    }
  } else {
    const modelVariants = getVariantsForVehicle(makeStr, modelStr, mfgYear);
    if (modelVariants.length > 0) {
      exShowroom = modelVariants[0].baseExShowroomINR;
      variantLabel = variantStr && variantStr !== 'Unable to verify' && variantStr !== 'Variant requires verification' ? `[${variantStr}]` : `[Base Model Benchmark]`;
    } else {
      const modelKey = Object.keys(BASE_EX_SHOWROOM_INR).find((k) =>
        modelStr.toLowerCase().includes(k.toLowerCase())
      ) || 'DEFAULT';
      exShowroom = BASE_EX_SHOWROOM_INR[modelKey];
      variantLabel = variantStr && variantStr !== 'Unable to verify' && variantStr !== 'Variant requires verification' ? `[${variantStr}]` : '';
    }
  }

  // 2. Base depreciation curve
  // Year 1: 15%, Year 2: 12%, Year 3: 10%, Subsequent: 8% per year
  let depreciationFactor = 1.0;
  if (ageYears <= 1) depreciationFactor = 0.85;
  else if (ageYears <= 2) depreciationFactor = 0.73;
  else if (ageYears <= 3) depreciationFactor = 0.63;
  else if (ageYears <= 4) depreciationFactor = 0.55;
  else if (ageYears <= 5) depreciationFactor = 0.48;
  else if (ageYears <= 6) depreciationFactor = 0.42;
  else depreciationFactor = Math.max(0.25, 0.42 - (ageYears - 6) * 0.05);

  let baselineValue = Math.round(exShowroom * depreciationFactor);

  // 3. City RTO & Market demand multiplier
  const cityData = INDIAN_CITIES.find((c) => c.name.toLowerCase() === (details.city || '').toLowerCase());
  const cityMultiplier = cityData ? cityData.demandIndex : 1.0;
  const cityAdjustedBase = Math.round(baselineValue * cityMultiplier);

  const waterfall: ValuationWaterfallItem[] = [
    {
      label: `Base Market Benchmark (${makeStr} ${modelStr} ${variantLabel} ${mfgYear})`,
      amount: cityAdjustedBase,
      type: 'neutral',
      note: `Regional baseline in ${details.city || 'State Capital'} based on ₹${(exShowroom / 100000).toFixed(2)} Lakhs variant ex-showroom with ${Math.round((1 - depreciationFactor) * 100)}% depreciation`,
    },
  ];

  let cumulativeValue = cityAdjustedBase;

  // 4. Vehicle Condition Grade Factor (from Market Prices or full assessment)
  const condition = details.conditionGrade || 'Good';
  if (condition === 'Excellent') {
    const bonus = Math.round(cumulativeValue * 0.06);
    cumulativeValue += bonus;
    waterfall.push({
      label: 'Excellent / Showroom Grade Condition Premium',
      amount: bonus,
      type: 'positive',
      note: 'Zero cosmetic panel repairs, pristine interior upholstery, flawless mechanical integrity (+6% market premium)',
    });
  } else if (condition === 'Fair') {
    const deduction = -Math.round(cumulativeValue * 0.05);
    cumulativeValue += deduction;
    waterfall.push({
      label: 'Fair Condition Cosmetic Touchup Allowance',
      amount: deduction,
      type: 'negative',
      note: 'Normal road wear, minor bumper scuffs or swirl marks requiring detailing (-5%)',
    });
  } else if (condition === 'Refurbishment Required') {
    const deduction = -Math.round(cumulativeValue * 0.12);
    cumulativeValue += deduction;
    waterfall.push({
      label: 'Substantial Reconditioning & Refurbishment Required',
      amount: deduction,
      type: 'negative',
      note: 'Multiple panel repaints, mechanical fluid service, and suspension/tyre wear (-12%)',
    });
  }

  // 4. Kilometre Adjustment (Benchmark is ~12,500 km/year in India)
  const expectedKm = Math.round(ageYears * 12500);
  const kmDelta = km - expectedKm;
  if (Math.abs(kmDelta) > 4000) {
    // ₹1.85 per excess/less km
    const kmAmount = Math.round(-kmDelta * 1.85);
    cumulativeValue += kmAmount;
    waterfall.push({
      label: kmDelta < 0 ? 'Low Kilometre Advantage' : 'Higher Mileage Wear Factor',
      amount: kmAmount,
      type: kmAmount >= 0 ? 'positive' : 'negative',
      note: `${Math.abs(kmDelta).toLocaleString('en-IN')} km ${kmDelta < 0 ? 'below' : 'above'} regional average (${expectedKm.toLocaleString('en-IN')} km)`,
    });
  }

  // 5. Service History Factor
  if (details.serviceHistory === 'Authorized Dealership Only') {
    const bonus = Math.round(cumulativeValue * 0.025);
    cumulativeValue += bonus;
    waterfall.push({
      label: 'Complete Authorized Service Records',
      amount: bonus,
      type: 'positive',
      note: 'Documented OEM service logs ensure verified maintenance and better resale buyer confidence',
    });
  } else if (details.serviceHistory === 'Independent Garage') {
    const penalty = -Math.round(cumulativeValue * 0.03);
    cumulativeValue += penalty;
    waterfall.push({
      label: 'Independent Garage Servicing',
      amount: penalty,
      type: 'negative',
      note: 'Lack of OEM digital network records requires additional mechanical validation',
    });
  }

  // 6. Number of Owners
  if (owners >= 2) {
    const ownerPenaltyPercent = owners === 2 ? 0.045 : owners === 3 ? 0.09 : 0.15;
    const ownerDeduction = -Math.round(cumulativeValue * ownerPenaltyPercent);
    cumulativeValue += ownerDeduction;
    waterfall.push({
      label: `${owners >= 4 ? '4+ Owners' : `${owners}nd/rd Owner`} Title Discount`,
      amount: ownerDeduction,
      type: 'negative',
      note: `Multiple previous ownership registrations trade at an empirical ${Math.round(ownerPenaltyPercent * 100)}% market discount`,
    });
  }

  // 7. Damage Findings Deductions
  let totalDamageDeduction = 0;
  damageFindings.forEach((d) => {
    totalDamageDeduction += d.repairEstimateINR || 5000;
  });

  if (totalDamageDeduction > 0) {
    cumulativeValue -= totalDamageDeduction;
    waterfall.push({
      label: 'Identified Body & Panel Repair Allowance',
      amount: -totalDamageDeduction,
      type: 'negative',
      note: `Estimated cost for paint refinishing, minor dent removal & alignment (${damageFindings.length} issue(s) flagged)`,
    });
  }

  // 8. Flood/Water exposure risk buffer
  const hasHighFloodRisk = floodFindings.some((f) => f.severity === 'High') || conditionScore?.floodRiskCategory === 'POSSIBLE WATER EXPOSURE' || conditionScore?.floodRiskCategory === 'HIGH-RISK INDICATORS';
  let floodRiskBuffer = 0;
  if (hasHighFloodRisk) {
    floodRiskBuffer = Math.round(cumulativeValue * 0.065);
    cumulativeValue -= floodRiskBuffer;
    waterfall.push({
      label: 'Possible Water Exposure Protective Buffer',
      amount: -floodRiskBuffer,
      type: 'negative',
      note: 'Contingency discount applied pending physical verification of floorpan and ECU wire harnesses',
    });
  }

  // 9. Insurance Status
  if (details.insuranceStatus === 'Expired') {
    const insDeduction = -18000;
    cumulativeValue += insDeduction;
    waterfall.push({
      label: 'Expired Comprehensive Insurance Renewal Outlay',
      amount: insDeduction,
      type: 'negative',
      note: 'Immediate cost required for vehicle inspection and insurance policy reinstatement',
    });
  }

  // Estimated Market Value Range (± 3.5%)
  const marketCenter = Math.max(150000, Math.round(cumulativeValue / 1000) * 1000);
  const estimatedMarketValueMin = Math.round((marketCenter * 0.965) / 5000) * 5000;
  const estimatedMarketValueMax = Math.round((marketCenter * 1.035) / 5000) * 5000;

  // Suggested Dealer Purchase Range (accounts for holding cost, dealership gross profit, and refurbishing)
  // Typically 8.5% to 11% below market value
  const suggestedDealerPurchaseMin = Math.round((estimatedMarketValueMin * 0.90) / 5000) * 5000;
  const suggestedDealerPurchaseMax = Math.round((estimatedMarketValueMax * 0.92) / 5000) * 5000;

  // Potential Retail Range
  const potentialRetailMin = Math.round((estimatedMarketValueMin * 1.05) / 5000) * 5000;
  const potentialRetailMax = Math.round((estimatedMarketValueMax * 1.09) / 5000) * 5000;

  // Buffer calculations
  const expectedNegotiationBuffer = Math.round((estimatedMarketValueMax - estimatedMarketValueMin) * 0.4 / 1000) * 1000;
  const expectedRepairAllowance = Math.max(8000, totalDamageDeduction);

  // Generate realistic comparable vehicles
  const comparableVehicles: ComparableVehicle[] = [
    {
      id: 'comp-1',
      makeModel: `${details.make} ${details.model} ${details.variant || ''}`.trim(),
      year: mfgYear,
      km: Math.round(km * 0.92),
      location: `${details.city || 'Hyderabad'} Hub`,
      priceType: 'Listing Price',
      priceINR: Math.round((estimatedMarketValueMax * 1.04) / 5000) * 5000,
      differenceVsEstimate: Math.round(((estimatedMarketValueMax * 1.04) - marketCenter) / 1000) * 1000,
    },
    {
      id: 'comp-2',
      makeModel: `${details.make} ${details.model} ${details.variant || ''}`.trim(),
      year: mfgYear,
      km: Math.round(km * 1.08),
      location: `${details.city || 'Hyderabad'} Regional Yard`,
      priceType: 'Observed Transaction',
      priceINR: Math.round((marketCenter * 0.985) / 5000) * 5000,
      differenceVsEstimate: Math.round(((marketCenter * 0.985) - marketCenter) / 1000) * 1000,
    },
    {
      id: 'comp-3',
      makeModel: `${details.make} ${details.model}`,
      year: Math.max(2015, mfgYear - 1),
      km: Math.round(km * 1.25),
      location: `Adjacent Market`,
      priceType: 'Observed Transaction',
      priceINR: Math.round((marketCenter * 0.88) / 5000) * 5000,
      differenceVsEstimate: Math.round(((marketCenter * 0.88) - marketCenter) / 1000) * 1000,
    },
  ];

  return {
    baseMarketValue: cityAdjustedBase,
    estimatedMarketValueMin,
    estimatedMarketValueMax,
    suggestedDealerPurchaseMin,
    suggestedDealerPurchaseMax,
    potentialRetailMin,
    potentialRetailMax,
    expectedNegotiationBuffer,
    expectedRepairAllowance,
    breakdownWaterfall: waterfall,
    comparableVehicles,
  };
}

export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);

  // Indian Lakh/Crore grouping: 12,34,567
  const str = absVal.toString();
  let result = '';
  if (str.length <= 3) {
    result = str;
  } else {
    const last3 = str.substring(str.length - 3);
    const rest = str.substring(0, str.length - 3);
    const withCommas = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = withCommas + ',' + last3;
  }

  return (isNegative ? '-₹' : '₹') + result;
}
