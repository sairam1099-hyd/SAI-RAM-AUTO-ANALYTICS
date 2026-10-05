import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit3,
  ShieldCheck,
  AlertCircle,
  Car,
  Fuel,
  Gauge,
  Calendar,
  Layers,
  MapPin,
  Check,
  RotateCcw,
  FileCheck,
  Search,
  HelpCircle,
  Info,
} from 'lucide-react';
import { VehicleDetails, CrossCheckReport } from '../../types';
import { POPULAR_INDIAN_MAKES, MODELS_BY_MAKE, INDIAN_CITIES } from '../../data/indianCarCatalog';
import { getVariantsForVehicle } from '../../data/vehicleVariants';

interface VehicleConfirmationStepProps {
  identified: {
    make: string;
    model: string;
    variant: string;
    approxYear: number | null;
    fuelType: string;
    transmission: string;
    registrationNumber: string;
    odometerKm: number | null;
    confidence: string;
    uncertainFields?: string[];
    colour?: string;
    crossCheckReport?: CrossCheckReport;
  };
  details: VehicleDetails;
  onConfirm: (confirmedDetails: VehicleDetails) => void;
}

export const VehicleConfirmationStep: React.FC<VehicleConfirmationStepProps> = ({
  identified,
  details: initialDetails,
  onConfirm,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<VehicleDetails>({
    ...initialDetails,
    make: identified.make && identified.make !== 'Unable to verify' ? identified.make : initialDetails.make,
    model: identified.model && identified.model !== 'Unable to verify' ? identified.model : initialDetails.model,
    variant:
      identified.variant &&
      identified.variant !== 'Unable to verify' &&
      identified.variant !== 'Variant requires verification'
        ? identified.variant
        : (initialDetails.variant && initialDetails.variant !== 'Variant requires verification' && initialDetails.variant !== 'Unable to verify' ? initialDetails.variant : ''),
    manufacturingYear: identified.approxYear || initialDetails.manufacturingYear || new Date().getFullYear() - 2,
    registrationYear: identified.approxYear || initialDetails.registrationYear || new Date().getFullYear() - 2,
    fuelType: (identified.fuelType as any) && identified.fuelType !== 'Unable to verify' ? (identified.fuelType as any) : initialDetails.fuelType || 'Petrol',
    transmission: (identified.transmission as any) && identified.transmission !== 'Unable to verify' ? (identified.transmission as any) : initialDetails.transmission || 'Manual',
    registrationNumber: identified.registrationNumber && identified.registrationNumber !== 'Unable to verify' ? identified.registrationNumber : initialDetails.registrationNumber,
    kilometresDriven: identified.odometerKm !== null ? identified.odometerKm : initialDetails.kilometresDriven,
  });

  const availableModels = MODELS_BY_MAKE[formData.make] || [];
  const availableVariants = getVariantsForVehicle(formData.make, formData.model, formData.manufacturingYear);

  const report = identified.crossCheckReport;
  const isVariantUnverified =
    !formData.variant ||
    formData.variant === 'Unable to verify' ||
    formData.variant === 'Variant requires verification';
  const isOdoUnverified = formData.kilometresDriven === null || formData.kilometresDriven === 0 || (identified.uncertainFields && identified.uncertainFields.includes('odometerKm'));
  const isRegUnverified = !formData.registrationNumber || formData.registrationNumber === 'Unable to verify' || (identified.uncertainFields && identified.uncertainFields.includes('registrationNumber'));

  const handleSaveAndConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Badge */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                Visual OCR & Evidence Cross-Check
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                VEHICLE IDENTIFICATION RESULT
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {identified.confidence === 'High' ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                High Confidence Verification
              </span>
            ) : identified.confidence === 'Medium' ? (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                Moderate Confidence
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Requires Verification
              </span>
            )}
          </div>
        </div>

        {/* Primary Identification Display (Non-editing view) */}
        {!isEditing ? (
          <div className="space-y-6">
            {/* Main Vehicle Hero Block */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">
                      {formData.manufacturingYear} {formData.make || 'Unable to verify'} {formData.model || ''}
                    </span>
                  </div>
                  <div className="text-sm font-semibold mt-1">
                    {isVariantUnverified ? (
                      <div className="mt-2 p-3.5 bg-amber-950/40 border border-amber-600/60 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span>Variant requires verification</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Trim badge could not be confirmed from photos. Please select the vehicle's verified variant:
                        </p>
                        <div className="pt-1">
                          <select
                            value={formData.variant}
                            onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                            className="w-full bg-slate-900 border-2 border-amber-500 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                          >
                            <option value="">-- Select Verified Variant --</option>
                            {availableVariants.map((v) => (
                              <option key={v.id || v.variant} value={v.variant}>
                                {v.variant} ({v.tier} Trim • {v.fuelTypes.join('/')} • {v.transmissions.join('/')})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-blue-300 font-bold text-base">
                          Trim / Variant: {formData.variant}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="text-xs text-blue-400 hover:text-blue-300 underline font-medium ml-2"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Reg Plate</div>
                  <div className="text-base font-mono font-bold text-white">
                    {formData.registrationNumber || (
                      <span className="text-amber-400 text-xs">Unable to verify</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Spec Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Fuel Type</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {formData.fuelType || <span className="text-amber-400 text-xs">Unable to verify</span>}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Transmission</div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {formData.transmission || <span className="text-amber-400 text-xs">Unable to verify</span>}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Odometer (Cluster)</div>
                  <div className="text-sm font-bold mt-0.5 font-mono">
                    {formData.kilometresDriven && formData.kilometresDriven > 0 ? (
                      <span className="text-emerald-400">{formData.kilometresDriven.toLocaleString('en-IN')} KM</span>
                    ) : (
                      <span className="text-amber-400 text-xs">Unable to verify</span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Mfg / Reg Year</div>
                  <div className="text-sm font-bold text-white mt-0.5 font-mono">
                    {formData.manufacturingYear || <span className="text-amber-400 text-xs">Unable to verify</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Cross-Check Evidence Table */}
            {report && report.fields && report.fields.length > 0 && (
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <FileCheck className="w-4 h-4 text-blue-400" />
                    <span>Evidence Cross-Check Across Photos</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    RC Front + RC Back + Odometer + Exterior + Interior
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {report.fields.map((f, i) => (
                    <div key={i} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div className="flex items-center gap-2">
                        {f.status === 'Verified' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        )}
                        <span className="font-semibold text-white">{f.field}:</span>
                        <span className="font-mono text-slate-300">{f.value}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                          Source: {f.source}
                        </span>
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                            f.status === 'Verified'
                              ? 'bg-emerald-950 text-emerald-300'
                              : 'bg-amber-950 text-amber-300'
                          }`}
                        >
                          {f.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {report.unverifiedNotes && report.unverifiedNotes.length > 0 && (
                  <div className="pt-2 text-[11px] text-amber-300/90 bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/40">
                    <span className="font-bold">Verification Note: </span>
                    {report.unverifiedNotes.join(' ')}
                  </div>
                )}
              </div>
            )}

            {/* Prompt & Confirmation Actions */}
            <div className="p-5 bg-blue-950/30 border border-blue-800/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Confirm vehicle specifications to generate current market valuation
                </p>
                <p className="text-xs mt-0.5">
                  {isVariantUnverified ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 inline" />
                      Select a verified variant above before generating market valuation.
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Verified configuration ready: {formData.manufacturingYear} {formData.make} {formData.model} {formData.variant}.
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>EDIT DETAILS</span>
                </button>
                <button
                  type="button"
                  disabled={isVariantUnverified}
                  onClick={() => {
                    if (isVariantUnverified) return;
                    onConfirm(formData);
                  }}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition border ${
                    isVariantUnverified
                      ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-60'
                      : 'bg-blue-600 hover:bg-blue-500 border-blue-400/40 cursor-pointer'
                  }`}
                  title={isVariantUnverified ? 'Please select a variant to proceed' : 'Proceed to Market Valuation'}
                >
                  <Check className="w-4 h-4" />
                  <span>{isVariantUnverified ? 'SELECT VARIANT TO CONTINUE' : 'CONFIRM & GET MARKET VALUATION'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Focused Edit Drawer */
          <form onSubmit={handleSaveAndConfirm} className="space-y-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Update Vehicle Parameters
                </h3>
                <span className="text-[10px] text-slate-400">
                  Select verified variant & details from dynamic catalog
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Make</label>
                  <select
                    value={formData.make}
                    onChange={(e) => {
                      const newMake = e.target.value;
                      const newModels = MODELS_BY_MAKE[newMake] || [];
                      const newModel = newModels[0] || '';
                      setFormData({
                        ...formData,
                        make: newMake,
                        model: newModel,
                        variant: '',
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {POPULAR_INDIAN_MAKES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Model</label>
                  <select
                    value={formData.model}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        model: e.target.value,
                        variant: '',
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {availableModels.map((mdl) => (
                      <option key={mdl} value={mdl}>
                        {mdl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Verified Variant
                  </label>
                  {availableVariants.length > 0 ? (
                    <select
                      value={formData.variant}
                      onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- Select Verified Variant --</option>
                      {availableVariants.map((v) => (
                        <option key={v.id || v.variant} value={v.variant}>
                          {v.variant} ({v.fuelTypes.join('/')} | {v.transmissions.join('/')})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.variant}
                      onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                      placeholder="e.g. Alpha, ZXi+, SX(O)"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Manufacturing Year</label>
                  <input
                    type="number"
                    value={formData.manufacturingYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        manufacturingYear: Number(e.target.value),
                        registrationYear: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Transmission</label>
                  <select
                    value={formData.transmission}
                    onChange={(e) =>
                      setFormData({ ...formData, transmission: e.target.value as any })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="AMT">AMT</option>
                    <option value="CVT">CVT</option>
                    <option value="DCT">DCT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Confirmed Kilometres (Odometer)
                  </label>
                  <input
                    type="number"
                    value={formData.kilometresDriven || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, kilometresDriven: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                    placeholder="e.g. 32000"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, registrationNumber: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                    placeholder="e.g. TS 09 EA 4821"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Cancel Edits
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                Save & Confirm
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
