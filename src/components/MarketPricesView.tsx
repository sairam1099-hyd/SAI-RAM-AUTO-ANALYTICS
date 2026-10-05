import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  MapPin,
  Car,
  DollarSign,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Info,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Fuel,
  Gauge,
  Sliders,
  Award,
} from 'lucide-react';
import { INDIAN_CITIES, POPULAR_INDIAN_MAKES, MODELS_BY_MAKE } from '../data/indianCarCatalog';
import { calculateValuation, formatINR } from '../utils/valuationEngine';
import { VehicleDetails, VehicleVariant, VehicleConditionGrade } from '../types';
import {
  DEFAULT_VEHICLE_VARIANTS,
  getVariantsForVehicle,
  findVariant,
  detectVariantFromTextOrRC,
  calculateVariantPriceDifference,
} from '../data/vehicleVariants';

interface MarketPricesViewProps {
  onStartFullEvaluation: (prefill?: Partial<VehicleDetails>) => void;
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({
  onStartFullEvaluation,
}) => {
  // Custom variants loaded from backend admin settings
  const [customVariants, setCustomVariants] = useState<VehicleVariant[]>([]);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Quick RC Detection input state
  const [rcInput, setRcInput] = useState('');
  const [detectionBanner, setDetectionBanner] = useState<{
    show: boolean;
    status: 'verified' | 'requires_verification';
    message: string;
    detectedVariant?: string;
  }>({
    show: false,
    status: 'requires_verification',
    message: '',
  });

  // Rapid Valuation Sandbox State following the exact required flow:
  // Make -> Model -> Year -> Variant -> Fuel -> Transmission -> KM -> Condition -> Market Price
  const [make, setMake] = useState('Hyundai');
  const [model, setModel] = useState('Creta');
  const [year, setYear] = useState(2022);
  const [variant, setVariant] = useState('SX');
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid'>('Diesel');
  const [transmission, setTransmission] = useState<'Manual' | 'Automatic' | 'AMT' | 'CVT' | 'DCT'>('Manual');
  const [kilometresDriven, setKilometresDriven] = useState(38000);
  const [conditionGrade, setConditionGrade] = useState<VehicleConditionGrade>('Good');
  const [numberOfOwners, setNumberOfOwners] = useState(1);
  const [city, setCity] = useState('Hyderabad');

  // Load custom variants from API on mount
  useEffect(() => {
    fetch('/api/market-variants')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCustomVariants(data);
        }
      })
      .catch((err) => console.warn('Could not load custom market variants', err));
  }, []);

  // Filter variants strictly linked to selected Make + Model + Year
  const availableVariants = useMemo(() => {
    return getVariantsForVehicle(make, model, year, customVariants);
  }, [make, model, year, customVariants]);

  // Ensure selected variant is valid for current Make + Model + Year
  // Automatically clear invalid variant if model or year changes
  useEffect(() => {
    if (availableVariants.length > 0) {
      const match = availableVariants.find((v) => v.variant.toLowerCase() === variant.toLowerCase());
      if (!match) {
        setVariant(availableVariants[0].variant);
        if (availableVariants[0].fuelTypes.length > 0 && !availableVariants[0].fuelTypes.includes(fuelType)) {
          setFuelType(availableVariants[0].fuelTypes[0]);
        }
        if (availableVariants[0].transmissions.length > 0 && !availableVariants[0].transmissions.includes(transmission)) {
          setTransmission(availableVariants[0].transmissions[0]);
        }
      }
    } else {
      setVariant('');
    }
  }, [availableVariants]);

  // Selected variant details
  const activeVariant = useMemo(() => {
    return findVariant(make, model, variant, year, customVariants);
  }, [make, model, variant, year, customVariants]);

  // Price difference vs base variant of the same model
  const variantDiff = useMemo(() => {
    if (!activeVariant || availableVariants.length === 0) return null;
    return calculateVariantPriceDifference(activeVariant, availableVariants);
  }, [activeVariant, availableVariants]);

  // Construct complete vehicle details for valuation engine
  const currentVehicleDetails: VehicleDetails = useMemo(() => {
    return {
      registrationNumber: rcInput || 'APPLIED FOR',
      make,
      model,
      variant,
      manufacturingYear: year,
      registrationYear: year,
      fuelType,
      transmission,
      kilometresDriven,
      numberOfOwners,
      city,
      conditionGrade,
      variantRequiresVerification: detectionBanner.status === 'requires_verification',
      variantDetectionSource: detectionBanner.status === 'verified' ? 'auto_rc' : 'unverified',
      insuranceStatus: 'Comprehensive',
      serviceHistory: 'Authorized Dealership Only',
      accidentHistory: 'No Claims / Accident Free',
      knownRepairs: '',
      loanStatus: 'Clear / No Loan',
    };
  }, [make, model, variant, year, fuelType, transmission, kilometresDriven, numberOfOwners, city, conditionGrade, rcInput, detectionBanner]);

  // Calculate live market valuation
  const valuation = useMemo(() => {
    return calculateValuation(currentVehicleDetails);
  }, [currentVehicleDetails]);

  // Handle Make change
  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    const availableModels = MODELS_BY_MAKE[newMake] || [];
    const newModel = availableModels[0] || '';
    setModel(newModel);
    if (detectionBanner.show) {
      setDetectionBanner({ show: false, status: 'requires_verification', message: '' });
    }

    const variants = getVariantsForVehicle(newMake, newModel, year, customVariants);
    if (variants.length > 0) {
      setVariant(variants[0].variant);
      if (variants[0].fuelTypes.length > 0) setFuelType(variants[0].fuelTypes[0]);
      if (variants[0].transmissions.length > 0) setTransmission(variants[0].transmissions[0]);
    } else {
      setVariant('');
    }
  };

  // Handle Model change
  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    if (detectionBanner.show) {
      setDetectionBanner({ show: false, status: 'requires_verification', message: '' });
    }

    const variants = getVariantsForVehicle(make, newModel, year, customVariants);
    if (variants.length > 0) {
      setVariant(variants[0].variant);
      if (variants[0].fuelTypes.length > 0) setFuelType(variants[0].fuelTypes[0]);
      if (variants[0].transmissions.length > 0) setTransmission(variants[0].transmissions[0]);
    } else {
      setVariant('');
    }
  };

  // Handle Year change (Year-Aware logic)
  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    const variants = getVariantsForVehicle(make, model, newYear, customVariants);
    if (variants.length > 0) {
      const stillValid = variants.find((v) => v.variant.toLowerCase() === variant.toLowerCase());
      if (stillValid) {
        setVariant(stillValid.variant);
      } else {
        setVariant(variants[0].variant);
        if (variants[0].fuelTypes.length > 0) setFuelType(variants[0].fuelTypes[0]);
        if (variants[0].transmissions.length > 0) setTransmission(variants[0].transmissions[0]);
      }
    } else {
      setVariant('');
    }
  };

  // Handle Variant change
  const handleVariantChange = (newVariantName: string) => {
    setVariant(newVariantName);
    const matched = availableVariants.find((v) => v.variant === newVariantName);
    if (matched) {
      // Auto-align fuel or transmission if current selection is invalid
      if (!matched.fuelTypes.includes(fuelType)) {
        setFuelType(matched.fuelTypes[0]);
      }
      if (!matched.transmissions.includes(transmission)) {
        setTransmission(matched.transmissions[0]);
      }
    }
    // If user explicitly chooses the variant, clear "requires verification"
    if (detectionBanner.status === 'requires_verification') {
      setDetectionBanner({
        show: true,
        status: 'verified',
        message: `Variant manually confirmed by evaluator as: ${newVariantName}`,
        detectedVariant: newVariantName,
      });
    }
  };

  // Handle RC search / detection
  const handleRunRCDetection = (searchVal: string) => {
    const val = searchVal.trim().toUpperCase();
    setRcInput(val);

    const result = detectVariantFromTextOrRC(val, make, model, customVariants);

    if (result.detected) {
      if (result.make && POPULAR_INDIAN_MAKES.includes(result.make)) {
        setMake(result.make);
      }
      if (result.model) {
        setModel(result.model);
      }
      if (result.year) {
        setYear(result.year);
      }
      if (result.fuelType) {
        setFuelType(result.fuelType);
      }
      if (result.transmission) {
        setTransmission(result.transmission);
      }

      if (result.variant && !result.requiresVerification) {
        setVariant(result.variant);
        setDetectionBanner({
          show: true,
          status: 'verified',
          message: result.reason || `Reliable RC match: Detected ${result.make} ${result.model} ${result.variant}`,
          detectedVariant: result.variant,
        });
      } else {
        // EXACT REQUIREMENT: If the exact variant cannot be identified, show "Variant requires verification" instead of guessing.
        setDetectionBanner({
          show: true,
          status: 'requires_verification',
          message: result.reason || 'Variant requires verification: RC confirms vehicle model but trim package (Base/Mid/Top) must be verified.',
        });
      }
    } else {
      setDetectionBanner({
        show: true,
        status: 'requires_verification',
        message: 'Variant requires verification: No verified RTO record found for this registration number. Please select the confirmed physical variant.',
      });
    }
  };

  // Convert to full inspection
  const handleProceedToInspection = () => {
    onStartFullEvaluation(currentVehicleDetails);
  };

  // Admin Variant Form State
  const [adminMake, setAdminMake] = useState(make);
  const [adminModel, setAdminModel] = useState(model);
  const [editingVariant, setEditingVariant] = useState<Partial<VehicleVariant> | null>(null);
  const [adminForm, setAdminForm] = useState<{
    variantName: string;
    yearStart: number;
    yearEnd: number;
    baseExShowroomINR: number;
    tier: 'Base' | 'Mid' | 'Top' | 'Premium';
    fuelTypes: string[];
    transmissions: string[];
    features: string;
  }>({
    variantName: '',
    yearStart: 2021,
    yearEnd: 2025,
    baseExShowroomINR: 1000000,
    tier: 'Mid',
    fuelTypes: ['Petrol', 'Diesel'],
    transmissions: ['Manual', 'Automatic'],
    features: 'Alloy Wheels, Touchscreen, Reverse Camera',
  });

  const handleOpenAddVariant = () => {
    setEditingVariant(null);
    setAdminForm({
      variantName: '',
      yearStart: 2021,
      yearEnd: 2025,
      baseExShowroomINR: 1000000,
      tier: 'Mid',
      fuelTypes: ['Petrol', 'Diesel'],
      transmissions: ['Manual', 'Automatic'],
      features: '',
    });
  };

  const handleOpenEditVariant = (v: VehicleVariant) => {
    setEditingVariant(v);
    setAdminForm({
      variantName: v.variant,
      yearStart: v.yearStart,
      yearEnd: v.yearEnd,
      baseExShowroomINR: v.baseExShowroomINR,
      tier: v.tier,
      fuelTypes: [...v.fuelTypes],
      transmissions: [...v.transmissions],
      features: v.keyFeatures.join(', '),
    });
  };

  const handleSaveVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.variantName.trim()) return;

    const payload: VehicleVariant = {
      id: editingVariant?.id || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      make: adminMake,
      model: adminModel,
      variant: adminForm.variantName.trim(),
      yearStart: Number(adminForm.yearStart),
      yearEnd: Number(adminForm.yearEnd),
      baseExShowroomINR: Number(adminForm.baseExShowroomINR),
      tier: adminForm.tier,
      fuelTypes: adminForm.fuelTypes as any,
      transmissions: adminForm.transmissions as any,
      keyFeatures: adminForm.features.split(',').map((s) => s.trim()).filter(Boolean),
      isCustom: true,
    };

    try {
      const res = await fetch('/api/market-variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setCustomVariants(data.variants || [...customVariants, payload]);
        // Also update active variant if it was this one
        if (adminMake === make && adminModel === model) {
          setVariant(payload.variant);
        }
        setEditingVariant(null);
      }
    } catch (err) {
      // Local fallback
      setCustomVariants((prev) => {
        const filtered = prev.filter((p) => p.id !== payload.id);
        return [...filtered, payload];
      });
      setEditingVariant(null);
    }
  };

  const handleDeleteVariant = async (id: string) => {
    try {
      await fetch(`/api/market-variants/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn(err);
    }
    setCustomVariants((prev) => prev.filter((v) => v.id !== id));
  };

  // Empirical depreciation segments (kept intact)
  const depreciationSegments = [
    {
      segment: 'Hatchbacks (Swift, Baleno, i20)',
      year1: '14%',
      year2: '24%',
      year3: '33%',
      year5: '48%',
      demand: 'High Liquidity',
      notes: 'Strongest resale retention in Indian metro and Tier-2 hubs.',
    },
    {
      segment: 'Compact & Mid SUVs (Creta, Seltos, Nexon, Brezza)',
      year1: '12%',
      year2: '22%',
      year3: '30%',
      year5: '45%',
      demand: 'Highest Dealer Velocity',
      notes: 'Dominant market demand; turns over within 14-18 days.',
    },
    {
      segment: 'Diesel MPVs & UVs (Innova Crysta, Ertiga, Scorpio-N)',
      year1: '10%',
      year2: '18%',
      year3: '25%',
      year5: '38%',
      demand: 'Exceptional (South / West)',
      notes: 'Innova retains highest residual value across South Indian routes.',
    },
    {
      segment: 'Executive Sedans (City, Verna, Virtus, Slavia)',
      year1: '16%',
      year2: '28%',
      year3: '38%',
      year5: '55%',
      demand: 'Moderate Niche',
      notes: 'Petrol automatics command steady demand from corporate buyers.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Regional Pricing Intelligence & Variant Master
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5 font-display">
            Indian Used-Car Market Index & Pricing Sandbox
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time variant differentiation, benchmark depreciation curves, and rapid dealer appraisal simulator
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setAdminMake(make);
              setAdminModel(model);
              setIsAdminModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Settings className="w-4 h-4 text-blue-400" />
            <span>Admin Variant Catalog</span>
          </button>

          <button
            type="button"
            onClick={handleProceedToInspection}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
          >
            <span>Start Full 16-Point Inspection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUICK VALUATION SANDBOX */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-6">
        <div className="border-b border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              <span>Rapid Dealer Valuation Sandbox</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Flow: <strong className="text-slate-300">Make → Model → Year → Variant → Fuel → Transmission → KM → Condition → Market Price</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Variant Valuation Active
            </span>
          </div>
        </div>

        {/* Automatic RC / Vehicle Number Verification Bar */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Quick RC / Vehicle Number Lookup
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={rcInput}
                    onChange={(e) => setRcInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRunRCDetection(rcInput);
                    }}
                    placeholder="Enter Indian Reg. No. e.g. TS 09 EA 4821 or paste RC document text..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRunRCDetection(rcInput)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify RC</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Pre-fills */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Test RTO Records:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRunRCDetection('TS09EA4821')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono border border-slate-700"
                  title="Hyundai Creta SX(O) - Verified High Confidence"
                >
                  TS09EA4821 (Creta SX(O))
                </button>
                <button
                  type="button"
                  onClick={() => handleRunRCDetection('MH02FJ9182')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono border border-slate-700"
                  title="Maruti Swift ZXi+ - Verified High Confidence"
                >
                  MH02FJ9182 (Swift ZXi+)
                </button>
                <button
                  type="button"
                  onClick={() => handleRunRCDetection('DL3CCE1092')}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-mono border border-slate-700"
                  title="Tata Nexon XZ+ - Verified High Confidence"
                >
                  DL3CCE1092 (Nexon XZ+)
                </button>
                <button
                  type="button"
                  onClick={() => handleRunRCDetection('TS09AB1234')}
                  className="px-2 py-1 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 rounded text-[10px] font-mono border border-amber-800/80"
                  title="Ambiguous trim - Will trigger 'Variant requires verification'"
                >
                  TS09AB1234 (Ambiguous Trim)
                </button>
              </div>
            </div>
          </div>

          {/* Automatic Variant Detection Alert / Verified Status Banner */}
          {detectionBanner.show && (
            <div>
              {detectionBanner.status === 'verified' ? (
                <div className="bg-emerald-950/50 border border-emerald-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Verified Variant:</strong>{' '}
                      <span className="font-mono font-bold text-white bg-emerald-900/80 px-1.5 py-0.5 rounded border border-emerald-700">
                        {detectionBanner.detectedVariant || variant}
                      </span>{' '}
                      • {detectionBanner.message}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200 border border-emerald-700">
                    High Confidence
                  </span>
                </div>
              ) : (
                /* EXACT REQUIREMENT: If the exact variant cannot be identified, show "Variant requires verification" instead of guessing. */
                <div className="bg-amber-950/70 border border-amber-700/90 rounded-lg p-3 space-y-1.5 text-xs text-amber-200">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="uppercase tracking-wider font-extrabold text-sm">
                      Variant requires verification
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-200/90 leading-relaxed">
                    {detectionBanner.message} Secondary market prices vary significantly between base (e.g. E / LXi / Smart) and top trims (e.g. SX(O) / ZXi+ / Fearless). Please confirm the physical vehicle variant below before quoting dealer procurement value.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 9-STEP WORKFLOW GRID:
            1. Make -> 2. Model -> 3. Year -> 4. Variant -> 5. Fuel -> 6. Transmission -> 7. KM -> 8. Condition -> 9. Market Price
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Section (2 Columns) */}
          <div className="lg:col-span-2 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. MAKE */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>1. Make</span>
                  <span className="text-[10px] text-slate-500 font-normal">Step 1</span>
                </label>
                <select
                  value={make}
                  onChange={(e) => handleMakeChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  {POPULAR_INDIAN_MAKES.map((m) => (
                    <option key={m} value={m} className="bg-slate-900">
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. MODEL */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>2. Model</span>
                  <span className="text-[10px] text-slate-500 font-normal">Step 2</span>
                </label>
                <select
                  value={model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  {(MODELS_BY_MAKE[make] || [model]).map((mod) => (
                    <option key={mod} value={mod} className="bg-slate-900">
                      {mod}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. YEAR */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>3. Manufacturing Year</span>
                  <span className="text-[10px] text-slate-500 font-normal">Step 3</span>
                </label>
                <select
                  value={year}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                    <option key={y} value={y} className="bg-slate-900">
                      {y} ({new Date().getFullYear() - y} yrs old)
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. VARIANT (Linked strictly to Make + Model + Year) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-blue-400 font-bold flex items-center gap-1.5">
                    <span>4. Variant</span>
                    {activeVariant && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        activeVariant.tier === 'Premium'
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : activeVariant.tier === 'Top'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : activeVariant.tier === 'Mid'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {activeVariant.tier}
                      </span>
                    )}
                  </label>
                  <span className={`text-[10px] font-mono ${availableVariants.length > 0 ? 'text-blue-400/80' : 'text-amber-400'}`}>
                    {availableVariants.length > 0 ? `${availableVariants.length} Trims Available` : '0 Trims Available'}
                  </span>
                </div>

                <select
                  value={variant}
                  onChange={(e) => handleVariantChange(e.target.value)}
                  className={`w-full bg-slate-950 border-2 rounded-lg px-3 py-2 font-bold focus:outline-none shadow-sm ${
                    availableVariants.length > 0 ? 'border-blue-600/80 text-white focus:border-blue-400' : 'border-amber-600/80 text-amber-300 focus:border-amber-400'
                  }`}
                >
                  {availableVariants.length > 0 ? (
                    availableVariants.map((v) => (
                      <option key={v.id || v.variant} value={v.variant} className="bg-slate-900 text-white">
                        {v.variant} • [{v.tier} Trim] {v.generation ? `• ${v.generation} ` : ''}(Ex-Showroom: ₹{(v.baseExShowroomINR / 100000).toFixed(2)}L)
                      </option>
                    ))
                  ) : (
                    <option value="" disabled className="bg-slate-900 text-amber-300">
                      No verified variants available for this model/year.
                    </option>
                  )}
                </select>

                {availableVariants.length === 0 && (
                  <div className="mt-1.5 p-2 rounded bg-amber-950/60 border border-amber-800 text-[11px] text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>No verified variants available for {year} {make} {model}. Please select an active manufacturing year.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Active Variant Equipment Summary & Price Impact Card */}
            {activeVariant && (
              <div className="bg-slate-950/60 border border-blue-900/40 rounded-xl p-3.5 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-slate-200">
                      {make} {model} <strong className="text-white">{activeVariant.variant}</strong> ({activeVariant.tier} Specification)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">Baseline MSRP:</span>
                    <span className="text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {formatINR(activeVariant.baseExShowroomINR)}
                    </span>
                  </div>
                </div>

                {/* Key OEM Features */}
                {activeVariant.keyFeatures.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeVariant.keyFeatures.map((feat, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded-full border border-slate-800 flex items-center gap-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                        {feat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Variant Price Differential vs Model Base Trim */}
                {variantDiff && variantDiff.differenceINR > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      Trim Premium vs Base <strong className="text-slate-300">{variantDiff.baseVariant.variant}</strong>:
                    </span>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      +{formatINR(variantDiff.differenceINR)} (+{variantDiff.percentage}%)
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Powertrain & Driving Parameters (5. Fuel, 6. Transmission, 7. KM, 8. Condition) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* 5. FUEL */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>5. Fuel Type</span>
                  <span className="text-[10px] text-slate-500 font-normal">Step 5</span>
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {(activeVariant?.fuelTypes || ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']).map((f) => (
                    <option key={f} value={f} className="bg-slate-900">
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. TRANSMISSION */}
              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>6. Transmission</span>
                  <span className="text-[10px] text-slate-500 font-normal">Step 6</span>
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {(activeVariant?.transmissions || ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT']).map((t) => (
                    <option key={t} value={t} className="bg-slate-900">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. KM (Kilometres Driven) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-bold">7. Kilometres Driven</label>
                  <span className="text-[10px] text-slate-500 font-normal">Step 7</span>
                </div>
                <input
                  type="number"
                  value={kilometresDriven}
                  onChange={(e) => setKilometresDriven(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <div className="flex gap-1.5 mt-1.5">
                  {[20000, 40000, 60000, 80000].map((kmPreset) => (
                    <button
                      key={kmPreset}
                      type="button"
                      onClick={() => setKilometresDriven(kmPreset)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition border ${
                        kilometresDriven === kmPreset
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {(kmPreset / 1000).toFixed(0)}k km
                    </button>
                  ))}
                </div>
              </div>

              {/* 8. CONDITION */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-bold">8. Overall Condition</label>
                  <span className="text-[10px] text-slate-500 font-normal">Step 8</span>
                </div>
                <select
                  value={conditionGrade}
                  onChange={(e) => setConditionGrade(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="Excellent" className="bg-slate-900 text-emerald-400">
                    Excellent (+6% Showroom Condition)
                  </option>
                  <option value="Good" className="bg-slate-900 text-slate-200">
                    Good (Standard Baseline Clean)
                  </option>
                  <option value="Fair" className="bg-slate-900 text-amber-400">
                    Fair (-5% Minor Cosmetic Scuffs)
                  </option>
                  <option value="Refurbishment Required" className="bg-slate-900 text-red-400">
                    Refurbishment Required (-12% Mechanical/Body Rework)
                  </option>
                </select>
              </div>

              {/* Target Regional Market & Owners */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Regional Market</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name} className="bg-slate-900">
                      {c.name} ({c.rtoPrefix} RTO - {c.demandIndex}x)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Ownership</label>
                <select
                  value={numberOfOwners}
                  onChange={(e) => setNumberOfOwners(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value={1} className="bg-slate-900">1st Owner (Single Handed)</option>
                  <option value={2} className="bg-slate-900">2nd Owner</option>
                  <option value={3} className="bg-slate-900">3rd+ Owner</option>
                </select>
              </div>
            </div>
          </div>

          {/* 9. MARKET PRICE OUTPUT CARD */}
          <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 relative">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  9. Market Price Output
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  variant ? 'bg-blue-950 text-blue-300 border-blue-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}>
                  {variant || 'No Variant'}
                </span>
              </div>

              {/* Vehicle Title */}
              <div className="mt-3">
                <div className="text-base font-extrabold text-white">
                  {year} {make} {model}{' '}
                  {variant ? (
                    <span className="text-blue-400">{variant}</span>
                  ) : (
                    <span className="text-amber-400 text-xs font-normal">(No verified variant for this year)</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {fuelType} • {transmission} • {kilometresDriven.toLocaleString('en-IN')} KM • {city}
                </div>
              </div>

              {/* Price Figures */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3.5">
                {/* Wholesale Market Value */}
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Estimated Wholesale Value:</span>
                    <span className="text-[10px] text-slate-500 font-mono">B2B Index</span>
                  </div>
                  <div className="text-lg font-black text-white font-mono mt-0.5">
                    {formatINR(valuation.estimatedMarketValueMin)} – {formatINR(valuation.estimatedMarketValueMax)}
                  </div>
                </div>

                {/* Suggested Dealer Purchase Range */}
                <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 p-3 rounded-lg border border-emerald-700/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-400">Suggested Dealer Buy Range:</span>
                    <span className="text-[9px] uppercase bg-emerald-950 px-1.5 py-0.2 rounded text-emerald-300 border border-emerald-800">
                      Procurement Target
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono tracking-tight">
                    {formatINR(valuation.suggestedDealerPurchaseMin)} – {formatINR(valuation.suggestedDealerPurchaseMax)}
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Accounts for {activeVariant?.tier || 'standard'} trim demand, {conditionGrade.toLowerCase()} condition & dealer margin
                  </p>
                </div>

                {/* Potential Retail Asking */}
                <div>
                  <span className="text-[11px] text-slate-400">Potential Retail Asking Price:</span>
                  <div className="text-sm font-bold text-slate-200 font-mono mt-0.5">
                    {formatINR(valuation.potentialRetailMin)} – {formatINR(valuation.potentialRetailMax)}
                  </div>
                </div>
              </div>

              {/* Live Waterfall Breakdown preview */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] space-y-1">
                <div className="text-slate-400 font-semibold uppercase">Pricing Baseline Waterfall:</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Variant MSRP Baseline:</span>
                  <span className="font-mono text-white font-semibold">
                    {formatINR(activeVariant?.baseExShowroomINR || 1000000)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Condition Grade ({conditionGrade}):</span>
                  <span className={`font-mono font-semibold ${
                    conditionGrade === 'Excellent' ? 'text-emerald-400' : conditionGrade === 'Fair' || conditionGrade === 'Refurbishment Required' ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    {conditionGrade === 'Excellent' ? '+6%' : conditionGrade === 'Fair' ? '-5%' : conditionGrade === 'Refurbishment Required' ? '-12%' : '0%'}
                  </span>
                </div>
              </div>
            </div>

            {/* Convert to Full Inspection Button */}
            <button
              type="button"
              onClick={handleProceedToInspection}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg border border-blue-400/40"
            >
              <span>Convert to Full 16-Point Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* REGIONAL RTO DEMAND INDICES */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span>Regional City Demand Multipliers (Indian Auto Hubs)</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {INDIAN_CITIES.map((c) => (
            <div key={c.name} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{c.name}</span>
                <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                  {c.rtoPrefix}
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">{c.state}</div>
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Demand Index:</span>
                <span
                  className={`font-mono font-bold ${
                    c.demandIndex >= 1.02
                      ? 'text-emerald-400'
                      : c.demandIndex >= 0.98
                      ? 'text-blue-400'
                      : 'text-amber-400'
                  }`}
                >
                  {c.demandIndex}x
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEGMENT DEPRECIATION TABLE */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Empirical Indian Used-Car Depreciation Curves by Segment</span>
        </h2>

        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Vehicle Category & Representative Models</th>
                <th className="py-3 px-4">Year 1</th>
                <th className="py-3 px-4">Year 2</th>
                <th className="py-3 px-4">Year 3</th>
                <th className="py-3 px-4">Year 5</th>
                <th className="py-3 px-4">Dealer Liquidity</th>
                <th className="py-3 px-4">Market Observations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {depreciationSegments.map((seg, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                    {seg.segment}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{seg.year1}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{seg.year2}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{seg.year3}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{seg.year5}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 text-[11px]">
                      {seg.demand}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px] leading-relaxed">
                    {seg.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMIN VARIANT & PRICING CATALOG MODAL */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Admin Variant & Pricing Catalog</h3>
                  <p className="text-xs text-slate-400">
                    Add or edit authentic vehicle variants, ex-showroom benchmarks, and feature tiers
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter by Make & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Make</label>
                <select
                  value={adminMake}
                  onChange={(e) => {
                    const m = e.target.value;
                    setAdminMake(m);
                    setAdminModel(MODELS_BY_MAKE[m]?.[0] || '');
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {POPULAR_INDIAN_MAKES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Model</label>
                <select
                  value={adminModel}
                  onChange={(e) => setAdminModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {(MODELS_BY_MAKE[adminMake] || []).map((mod) => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleOpenAddVariant}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Variant</span>
                </button>
              </div>
            </div>

            {/* Add / Edit Form */}
            {(editingVariant !== null || adminForm.variantName !== '') && (
              <form onSubmit={handleSaveVariant} className="bg-slate-950 border border-blue-600/40 rounded-xl p-4 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-sm">
                    {editingVariant ? `Edit Variant: ${editingVariant.variant}` : `Create Variant for ${adminMake} ${adminModel}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingVariant(null);
                      setAdminForm({ ...adminForm, variantName: '' });
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Variant Name</label>
                    <input
                      type="text"
                      value={adminForm.variantName}
                      onChange={(e) => setAdminForm({ ...adminForm, variantName: e.target.value })}
                      placeholder="e.g. XZ+, ZXi+, SX(O), XM"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Equipment Tier</label>
                    <select
                      value={adminForm.tier}
                      onChange={(e) => setAdminForm({ ...adminForm, tier: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="Base">Base Trim</option>
                      <option value="Mid">Mid Trim</option>
                      <option value="Top">Top Trim</option>
                      <option value="Premium">Premium / Tech+ Trim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Base Ex-Showroom INR</label>
                    <input
                      type="number"
                      value={adminForm.baseExShowroomINR}
                      onChange={(e) => setAdminForm({ ...adminForm, baseExShowroomINR: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                      step={10000}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Key OEM Features (comma-separated)</label>
                  <input
                    type="text"
                    value={adminForm.features}
                    onChange={(e) => setAdminForm({ ...adminForm, features: e.target.value })}
                    placeholder="e.g. Electric Sunroof, 16-inch Alloys, 6 Airbags, 10.25-inch Touchscreen"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                  >
                    Save Variant to Database
                  </button>
                </div>
              </form>
            )}

            {/* List of Current Variants for Selected Make & Model */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Configured Variants for {adminMake} {adminModel}
              </h4>
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Variant</th>
                      <th className="py-2.5 px-3">Tier</th>
                      <th className="py-2.5 px-3">Base Ex-Showroom</th>
                      <th className="py-2.5 px-3">Key Features</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {getVariantsForVehicle(adminMake, adminModel, undefined, customVariants).map((v) => (
                      <tr key={v.id || v.variant} className="hover:bg-slate-900/50">
                        <td className="py-2.5 px-3 font-bold text-white">
                          {v.variant} {v.isCustom && <span className="text-[10px] text-blue-400">(Custom)</span>}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            v.tier === 'Premium' ? 'bg-purple-950 text-purple-300' : v.tier === 'Top' ? 'bg-blue-950 text-blue-300' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {v.tier}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                          {formatINR(v.baseExShowroomINR)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px] max-w-xs truncate">
                          {v.keyFeatures.join(', ')}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditVariant(v)}
                              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                              title="Edit Variant"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {v.isCustom && (
                              <button
                                type="button"
                                onClick={() => handleDeleteVariant(v.id)}
                                className="p-1 rounded hover:bg-red-950 text-red-400 hover:text-red-300"
                                title="Delete Custom Variant"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
