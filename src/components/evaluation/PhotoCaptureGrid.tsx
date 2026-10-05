import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  RotateCcw,
  Sparkles,
  Info,
  Check,
  FileText,
  Car,
} from 'lucide-react';
import { ComprehensivePhotoSlot, UserRole } from '../../types';
import { REQUIRED_PHOTO_KEYS, OPTIONAL_PHOTO_KEYS } from '../../data/photoChecklist';

interface PhotoCaptureGridProps {
  photoSlots: ComprehensivePhotoSlot[];
  onUpdateSlot: (updated: ComprehensivePhotoSlot) => void;
  onAddCloseupSlot?: (label: string, instruction: string) => void;
  userRole?: UserRole;
  onLoadDevDemoPack?: () => void;
  onLoadVehicleSample?: (vehicleKey: 'grand_vitara' | 'dzire' | 'brezza' | 'creta' | 'nexon' | 'thar') => void;
}

export const PhotoCaptureGrid: React.FC<PhotoCaptureGridProps> = ({
  photoSlots,
  onUpdateSlot,
  userRole,
  onLoadDevDemoPack,
  onLoadVehicleSample,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'required' | 'optional'>('all');
  const [previewSlot, setPreviewSlot] = useState<ComprehensivePhotoSlot | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetUploadSlotId, setTargetUploadSlotId] = useState<string | null>(null);

  const requiredSlots = photoSlots.filter((s) => s.isRequired);
  const optionalSlots = photoSlots.filter((s) => !s.isRequired);

  const displayedSlots =
    filterTab === 'required'
      ? requiredSlots
      : filterTab === 'optional'
      ? optionalSlots
      : photoSlots;

  const totalRequiredCaptured = requiredSlots.filter(
    (s) => (s.status === 'captured' || Boolean(s.dataUrl)) && s.dataUrl
  ).length;
  const totalOptionalCaptured = optionalSlots.filter(
    (s) => (s.status === 'captured' || Boolean(s.dataUrl)) && s.dataUrl
  ).length;
  const totalCaptured = totalRequiredCaptured + totalOptionalCaptured;

  const allRequiredComplete = totalRequiredCaptured === 9;

  const handleTriggerUpload = (slotId: string) => {
    setTargetUploadSlotId(slotId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetUploadSlotId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const targetSlot = photoSlots.find((s) => s.id === targetUploadSlotId);
      if (!targetSlot) return;

      const isFileTooSmall = file.size < 12 * 1024; // < 12kb is likely corrupted or empty

      if (isFileTooSmall) {
        onUpdateSlot({
          ...targetSlot,
          dataUrl,
          status: 'quality_flagged',
          qualityIssue: 'Resolution too low. Please upload a clear photo.',
          capturedAt: new Date().toLocaleTimeString('en-IN'),
        });
      } else {
        onUpdateSlot({
          ...targetSlot,
          dataUrl,
          status: 'captured',
          qualityIssue: undefined,
          capturedAt: new Date().toLocaleTimeString('en-IN'),
        });
      }
      setTargetUploadSlotId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleClearSlot = (slot: ComprehensivePhotoSlot) => {
    onUpdateSlot({
      ...slot,
      dataUrl: undefined,
      status: 'pending',
      qualityIssue: undefined,
      capturedAt: undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Redesigned Clean Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <span>Redesigned Evidence Session</span>
            <span>•</span>
            <span className="text-slate-400">Strict 9 Required + 3 Optional</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 font-display">
            Vehicle Photo Upload
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Upload the 9 required photos (Exterior, Odometer, Interiors, and RC Smartcard) for AI vehicle identification, cross-checking, and market price valuation. Optional photos enhance condition accuracy without blocking evaluation.
          </p>
        </div>

        {/* Progress Counters */}
        <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Required:</span>
            <span
              className={`font-mono font-bold ${
                allRequiredComplete ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {totalRequiredCaptured} / 9
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Optional:</span>
            <span className="font-mono font-bold text-slate-300">
              {totalOptionalCaptured} / 3
            </span>
          </div>

          {allRequiredComplete ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready for AI Identification</span>
            </div>
          ) : (
            <div className="text-[11px] text-amber-400/90 font-medium">
              {9 - totalRequiredCaptured} required {9 - totalRequiredCaptured === 1 ? 'photo' : 'photos'} remaining
            </div>
          )}
        </div>
      </div>

      {/* Quick Test Seed Tool for Instant Multi-Model Testing */}
      {onLoadVehicleSample && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="font-semibold text-white">One-Click Test Vehicle Seeds:</span>
            <span className="text-slate-400 hidden sm:inline">
              Instantly populate authentic photos & RC evidence to test AI identification and valuation:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onLoadVehicleSample('grand_vitara')}
              className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/60 font-medium transition text-[11px]"
            >
              Grand Vitara 2024
            </button>
            <button
              type="button"
              onClick={() => onLoadVehicleSample('dzire')}
              className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/60 font-medium transition text-[11px]"
            >
              Dzire ZXi+
            </button>
            <button
              type="button"
              onClick={() => onLoadVehicleSample('brezza')}
              className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/60 font-medium transition text-[11px]"
            >
              Brezza ZXi
            </button>
            <button
              type="button"
              onClick={() => onLoadVehicleSample('creta')}
              className="px-2.5 py-1 rounded-lg bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border border-indigo-700/60 font-medium transition text-[11px]"
            >
              Creta SX(O)
            </button>
            <button
              type="button"
              onClick={() => onLoadVehicleSample('nexon')}
              className="px-2.5 py-1 rounded-lg bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border border-indigo-700/60 font-medium transition text-[11px]"
            >
              Nexon XZ+
            </button>
            <button
              type="button"
              onClick={() => onLoadVehicleSample('thar')}
              className="px-2.5 py-1 rounded-lg bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border border-indigo-700/60 font-medium transition text-[11px]"
            >
              Thar LX 4x4
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs: All (12), Required (9), Optional (3) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterTab === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Photos ({photoSlots.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('required')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              filterTab === 'required'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>Required (9)</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                allRequiredComplete ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-amber-400'
              }`}
            >
              {totalRequiredCaptured}/9
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('optional')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              filterTab === 'optional'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>Optional (3)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {totalOptionalCaptured}/3
            </span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 hidden sm:block">
          Evidence Priority: <span className="text-white font-medium">RC Front + RC Back + Odometer + Exterior</span>
        </div>
      </div>

      {/* Clean 12-Slot Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedSlots.map((slot, index) => {
          const isCaptured = (slot.status === 'captured' || Boolean(slot.dataUrl)) && slot.dataUrl;
          const isFlagged = slot.status === 'quality_flagged';
          const isRc = slot.key === 'rc_front' || slot.key === 'rc_back';
          const isOdo = slot.key === 'odometer';

          return (
            <div
              key={slot.id}
              className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between space-y-3 transition relative group ${
                isCaptured
                  ? 'border-emerald-600/60 shadow-sm'
                  : isFlagged
                  ? 'border-amber-500/80 bg-amber-950/10'
                  : slot.isRequired
                  ? 'border-slate-800 hover:border-slate-700'
                  : 'border-slate-800/80 hover:border-slate-700 opacity-90'
              }`}
            >
              {/* Slot Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0">
                      {photoSlots.findIndex((s) => s.id === slot.id) + 1}
                    </span>
                    <h4 className="text-xs font-bold text-white tracking-tight">{slot.label}</h4>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {slot.isRequired ? (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/80">
                        Required
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                        Optional
                      </span>
                    )}

                    {isCaptured && (
                      <span className="text-emerald-400" title="Captured">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug line-clamp-2">
                  {slot.instruction}
                </p>
              </div>

              {/* Photo Viewport / Upload Container */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-slate-700 transition">
                {isCaptured && slot.dataUrl ? (
                  <>
                    <img
                      src={slot.dataUrl}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewSlot(slot)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white shadow-lg transition"
                        title="View Full Resolution"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(slot.id)}
                        className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition"
                        title="Retake Photograph"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleClearSlot(slot)}
                        className="p-2 rounded-xl bg-rose-900/80 hover:bg-rose-800 text-rose-200 shadow-lg transition"
                        title="Remove Photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Tag badge for high-priority evidence */}
                    {(isRc || isOdo) && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[10px] font-semibold text-blue-300 border border-slate-700">
                        {isRc ? 'High Priority RC' : 'High Priority ODO'}
                      </div>
                    )}
                  </>
                ) : isFlagged && slot.dataUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={slot.dataUrl}
                      alt={slot.label}
                      className="w-full h-full object-cover filter blur-[1px]"
                    />
                    <div className="absolute inset-0 bg-amber-950/80 p-2.5 flex flex-col items-center justify-center text-center space-y-1.5">
                      <AlertTriangle className="w-5 h-5 text-amber-300" />
                      <p className="text-[11px] font-semibold text-amber-200">
                        {slot.qualityIssue || 'Please retake this photograph.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleTriggerUpload(slot.id)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold shadow transition"
                      >
                        Retake Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleTriggerUpload(slot.id)}
                    className="w-full h-full flex flex-col items-center justify-center p-4 space-y-2 hover:bg-slate-900/50 transition cursor-pointer text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500 transition">
                      {isRc ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition block">
                        Upload Photo
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Tap or drag & drop
                      </span>
                    </div>
                  </button>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleTriggerUpload(slot.id)}
                  className={`w-full py-2 rounded-xl text-xs font-semibold transition text-center ${
                    isCaptured
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : slot.isRequired
                      ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/80'
                  }`}
                >
                  {isCaptured ? 'Replace Photo' : 'Upload Photo'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Preview Modal */}
      {previewSlot && previewSlot.dataUrl && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewSlot(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{previewSlot.label}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{previewSlot.instruction}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewSlot(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-hidden rounded-xl bg-black flex items-center justify-center">
              <img
                src={previewSlot.dataUrl}
                alt={previewSlot.label}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Evidence Captured & Verified</span>
              <button
                type="button"
                onClick={() => setPreviewSlot(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
