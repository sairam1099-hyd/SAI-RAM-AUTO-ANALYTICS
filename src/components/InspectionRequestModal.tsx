import React, { useState, useMemo } from 'react';
import {
  X,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Car,
  CheckCircle2,
  Phone,
  MessageSquare,
  AlertTriangle,
  RotateCw,
  Lock,
  User,
  ExternalLink,
} from 'lucide-react';
import {
  InspectionRequest,
  InspectionManager,
  EvaluationRecord,
  TrustedEvaluatorConfig,
  WhatsAppNotificationStatus,
} from '../types';

interface InspectionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillRecord?: Partial<EvaluationRecord> | null;
  selectedManager?: InspectionManager | null;
  managers: InspectionManager[];
  onSubmit: (request: InspectionRequest) => void;
  trustedEvaluator?: TrustedEvaluatorConfig;
}

export const InspectionRequestModal: React.FC<InspectionRequestModalProps> = ({
  isOpen,
  onClose,
  prefillRecord,
  selectedManager,
  managers,
  onSubmit,
  trustedEvaluator,
}) => {
  if (!isOpen) return null;

  // Dynamic 12-month date calculation starting from today
  const { todayStr, maxDateStr } = useMemo(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    const nextYear = new Date(now);
    nextYear.setFullYear(now.getFullYear() + 1);
    const maxDate = `${nextYear.getFullYear()}-${pad(nextYear.getMonth() + 1)}-${pad(nextYear.getDate())}`;

    return { todayStr: today, maxDateStr: maxDate };
  }, []);

  const assignedEvaluatorName = trustedEvaluator?.name || 'T. SURESH';
  const assignedEvaluatorRole = trustedEvaluator?.role || 'SENIOR MOST SECOND AND CAR EVALUATOR';
  const rawEvaluatorPhone = trustedEvaluator?.phone || '9951696943';
  const rawEvaluatorWhatsapp = trustedEvaluator?.whatsapp || '9951696943';
  const cleanPhone = rawEvaluatorPhone.replace(/\D/g, '');
  const cleanWhatsapp = rawEvaluatorWhatsapp.replace(/\D/g, '');

  // Auto-populated fields from current evaluation
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);

  const [registration, setRegistration] = useState(prefillRecord?.registrationNumber || '');
  const [evaluationId, setEvaluationId] = useState(prefillRecord?.id || '');
  const [vehicle, setVehicle] = useState(
    prefillRecord && (prefillRecord.make || prefillRecord.model)
      ? `${prefillRecord.year || ''} ${prefillRecord.make || ''} ${prefillRecord.model || ''} ${prefillRecord.variant || ''}`.trim()
      : ''
  );

  const [location, setLocation] = useState(
    prefillRecord?.city
      ? `${prefillRecord.city}, Telangana (Customer Location / Sai Ram Yard)`
      : 'Plot 42, Road No. 36, Jubilee Hills, Hyderabad, Telangana'
  );

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });

  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [inspectionType, setInspectionType] = useState('Full Vehicle Inspection (Comprehensive 180-Point)');
  const [notes, setNotes] = useState('');

  // Submission & WhatsApp notification state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<InspectionRequest | null>(null);
  const [whatsappDelivery, setWhatsappDelivery] = useState<{
    status: WhatsAppNotificationStatus;
    error?: string;
    recipientPhone?: string;
    directLink?: string;
  } | null>(null);

  // Form validation errors
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!customerName.trim()) {
      setFormError('Customer Name is required.');
      return;
    }
    const cleanCustomerDigits = customerPhone.replace(/\D/g, '');
    if (!customerPhone.trim() || cleanCustomerDigits.length < 10) {
      setFormError('Please enter a valid 10-digit customer contact phone number.');
      return;
    }
    if (!consentAgreed) {
      setFormError('You must confirm sharing your contact number with the assigned evaluator to proceed.');
      return;
    }
    if (!date || date < todayStr || date > maxDateStr) {
      setFormError(`Please select a preferred date between ${todayStr} and ${maxDateStr}.`);
      return;
    }
    if (!preferredTime.trim()) {
      setFormError('Please select a valid preferred appointment time.');
      return;
    }

    setIsSubmitting(true);

    const estMarketValue =
      prefillRecord?.estimatedValueMin && prefillRecord?.estimatedValueMax
        ? `₹${(prefillRecord.estimatedValueMin).toLocaleString('en-IN')} - ₹${(prefillRecord.estimatedValueMax).toLocaleString('en-IN')}`
        : 'NOT AVAILABLE';

    const dealerPurchaseRange =
      prefillRecord?.dealerBuyMin && prefillRecord?.dealerBuyMax
        ? `₹${(prefillRecord.dealerBuyMin).toLocaleString('en-IN')} - ₹${(prefillRecord.dealerBuyMax).toLocaleString('en-IN')}`
        : 'NOT AVAILABLE';

    const payload = {
      evaluationId: evaluationId || undefined,
      registrationNumber: registration.toUpperCase(),
      vehicleDetails: vehicle || 'Evaluated Vehicle',
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerConsentAgreed: true,
      location: location.trim(),
      requestedDate: date,
      preferredDate: date,
      preferredTime,
      inspectionType,
      notes: notes.trim(),
      estimatedMarketValue: estMarketValue,
      suggestedDealerPurchaseRange: dealerPurchaseRange,
      assignedManagerId: 'eval-suresh',
      assignedManagerName: assignedEvaluatorName,
      assignedManagerRole: assignedEvaluatorRole,
      assignedManagerPhone: cleanPhone,
      assignedManagerWhatsapp: cleanWhatsapp,
    };

    try {
      const res = await fetch('/api/inspections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success && data.request) {
        setSubmittedRequest(data.request);
        setWhatsappDelivery(data.whatsappDelivery);
        onSubmit(data.request);

        // Simplest available automation: automatically trigger pre-filled WhatsApp link to evaluator's number
        if (data.whatsappDelivery?.directLink) {
          try {
            window.open(data.whatsappDelivery.directLink, '_blank', 'noopener,noreferrer');
          } catch (_) {
            // Popup blocker fallback is handled gracefully by prominent UI action button below
          }
        }
      } else {
        setFormError(data.error || 'Failed to submit physical inspection request. Please try again.');
      }
    } catch (err: any) {
      setFormError(`Network error dispatching inspection request: ${err.message || err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSubmittedRequest(null);
    setWhatsappDelivery(null);
    setFormError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={handleModalClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Technical Verification Dispatch</span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5 font-display tracking-tight">
              DISPATCH PHYSICAL INSPECTION
            </h3>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUBMISSION RESULT VIEW */}
        {submittedRequest ? (
          <div className="space-y-4 py-1">
            {/* SUCCESS BANNER */}
            <div className="bg-emerald-950/40 border border-emerald-800 rounded-xl p-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                REQUEST DISPATCHED TO EVALUATOR
              </h4>
              <p className="text-xs text-emerald-300 font-medium max-w-md mx-auto leading-relaxed">
                Your physical inspection request has been formatted into a complete vehicle assessment brief and routed directly to primary evaluator <strong className="text-white">{assignedEvaluatorName}</strong> (+91 {cleanWhatsapp.slice(-10)}).
              </p>
            </div>

            {/* Structured Request Confirmation Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-2.5 font-mono">
              <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-sans">Evaluator:</span>
                <span className="text-white font-sans font-bold">{submittedRequest.assignedManagerName}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-sans">Role:</span>
                <span className="text-slate-300 font-sans text-[11px]">{submittedRequest.assignedManagerRole || assignedEvaluatorRole}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-sans">Inspection ID:</span>
                <span className="text-blue-400 font-bold">{submittedRequest.id}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-sans">Evaluation ID:</span>
                <span className="text-blue-400 font-bold">{submittedRequest.evaluationId || 'NOT AVAILABLE'}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-sans">Preferred Date:</span>
                <span className="text-slate-200">{submittedRequest.preferredDate || submittedRequest.requestedDate}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-sans">Preferred Time:</span>
                <span className="text-slate-200">{submittedRequest.preferredTime || '11:00 AM'}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-sans">Vehicle:</span>
                <span className="text-slate-200 font-sans">{submittedRequest.vehicleDetails}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800/80">
                <span className="text-slate-400 font-sans">Registration:</span>
                <span className="text-white font-bold">{submittedRequest.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Status:</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  {submittedRequest.status}
                </span>
              </div>
            </div>

            {/* Evaluator Contact Actions */}
            <div className="space-y-2 pt-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Assigned Evaluator Direct Access ({assignedEvaluatorName})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`tel:${cleanPhone.slice(-10)}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition border border-blue-400/30"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>CALL {assignedEvaluatorName}</span>
                </a>

                <a
                  href={whatsappDelivery?.directLink || `https://wa.me/91${cleanWhatsapp.slice(-10)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition border border-emerald-400/40"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WHATSAPP {assignedEvaluatorName}</span>
                  <ExternalLink className="w-3 h-3 text-emerald-200" />
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          /* REQUEST FORM */
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {formError && (
              <div className="p-3 bg-red-950/70 border border-red-800 rounded-lg text-red-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            {/* Customer Information (Section 1 & 2) */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Customer Contact Details</span>
                </span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Confidential • Evaluator Only</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Customer Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Customer / Dealer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 placeholder-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Customer Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98490 28410"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500 placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Privacy Disclosure & Explicit Confirmation */}
              <div className="bg-blue-950/30 border border-blue-900/60 rounded-lg p-2.5 space-y-2">
                <p className="text-[11px] text-blue-200 leading-relaxed font-medium">
                  &ldquo;Your contact number will be shared with the assigned evaluator so they can contact you regarding this inspection request.&rdquo;
                </p>
                <label className="flex items-start gap-2 cursor-pointer pt-0.5">
                  <input
                    type="checkbox"
                    required
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-300 select-none">
                    I agree to share my contact number with the assigned evaluator for this inspection request. (Customer contact details are protected and will never be published in public vehicle reports).
                  </span>
                </label>
              </div>
            </div>

            {/* Vehicle & Evaluation Information (Auto-populated) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Vehicle Registration <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TS 09 EA 4821"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-blue-500 uppercase placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Evaluation ID</label>
                <input
                  type="text"
                  readOnly
                  placeholder="e.g. SRA-2026-XXXX"
                  value={evaluationId}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-blue-400 font-mono focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Vehicle Details <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 2021 Hyundai Creta SX(O) AT"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Inspection Location <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Plot 42, Road No 36, Jubilee Hills, Hyderabad or Doorstep Address"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-blue-500 placeholder-slate-600"
                />
              </div>
            </div>

            {/* Date and Time Picker (Dynamic 12-month range, no past dates) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-semibold">
                    Preferred Date <span className="text-red-400">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Next 12 Months</span>
                </div>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={todayStr}
                    max={maxDateStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Preferred Time <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="09:30 AM">09:30 AM (Morning Slot)</option>
                  <option value="11:00 AM">11:00 AM (Mid-Day Slot)</option>
                  <option value="02:00 PM">02:00 PM (Early Afternoon Slot)</option>
                  <option value="03:30 PM">03:30 PM (Mid Afternoon Slot)</option>
                  <option value="05:00 PM">05:00 PM (Late Afternoon Slot)</option>
                  <option value="06:30 PM">06:30 PM (Evening Slot)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Inspection Type</label>
              <select
                value={inspectionType}
                onChange={(e) => setInspectionType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Full Vehicle Inspection (Comprehensive 180-Point)">
                  Full Vehicle Inspection (Comprehensive 180-Point)
                </option>
                <option value="Chassis, Apron & Pillar Weld Inspection">
                  Chassis, Apron & Pillar Weld Inspection (Accident Audit)
                </option>
                <option value="Flood & Water Submersion Assessment">
                  Flood & Water Submersion Assessment (Rust & Harness Audit)
                </option>
                <option value="Engine Compression & OBD-II ECU Scan">
                  Engine Compression & OBD-II ECU Scan (Powertrain Diagnostic)
                </option>
                <option value="Pre-Procurement Dealer Clearance Inspection">
                  Pre-Procurement Dealer Clearance Inspection (Immediate Purchase)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Additional Notes</label>
              <textarea
                rows={2}
                placeholder="Specific inspection requests (e.g., paint thickness on left fender, hydraulic hoist underbody scan, transmission gear shift test)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 placeholder-slate-600"
              />
            </div>

            {/* Evaluator Assignment Badge */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 flex items-center justify-between">
              <div>
                <span className="font-semibold text-white">Assigned Primary Evaluator:</span>{' '}
                <span className="text-blue-400 font-bold">{assignedEvaluatorName}</span>
                <div className="text-[10px] text-slate-500 mt-0.5">{assignedEvaluatorRole} • Hyderabad, Telangana</div>
              </div>
              <div className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 text-[10px] font-bold">
                ✓ VERIFIED EVALUATOR
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition border border-blue-400/30 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'DISPATCHING...' : 'DISPATCH PHYSICAL INSPECTION'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
