import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Calendar,
  MapPin,
  FileText,
  Search,
  PlusCircle,
  Phone,
  MessageSquare,
  RotateCw,
  ExternalLink,
  ChevronDown,
  Car,
  DollarSign,
  Filter,
} from 'lucide-react';
import {
  InspectionRequest,
  InspectionManager,
  InspectionStatusType,
  TrustedEvaluatorConfig,
} from '../types';

interface InspectionsViewProps {
  inspections: InspectionRequest[];
  managers: InspectionManager[];
  onOpenNewInspectionRequest: () => void;
  onUpdateInspection?: (updated: InspectionRequest) => void;
  trustedEvaluator?: TrustedEvaluatorConfig;
}

const ALL_STATUSES: InspectionStatusType[] = [
  'REQUESTED',
  'ASSIGNED',
  'CONTACTED',
  'SCHEDULED',
  'IN PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

export const InspectionsView: React.FC<InspectionsViewProps> = ({
  inspections,
  managers,
  onOpenNewInspectionRequest,
  onUpdateInspection,
  trustedEvaluator,
}) => {
  const [selectedInspection, setSelectedInspection] = useState<InspectionRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Edit findings state inside modal
  const [editPaintMicrons, setEditPaintMicrons] = useState<number | ''>('');
  const [editChassisNote, setEditChassisNote] = useState('');
  const [editObdSummary, setEditObdSummary] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [isSavingFindings, setIsSavingFindings] = useState(false);

  const evaluatorName = trustedEvaluator?.name || 'T. SURESH';
  const evaluatorRole = trustedEvaluator?.role || 'SENIOR MOST SECOND AND CAR EVALUATOR';
  const evaluatorPhone = (trustedEvaluator?.phone || '9951696943').replace(/\D/g, '');
  const evaluatorWhatsapp = (trustedEvaluator?.whatsapp || '9951696943').replace(/\D/g, '');

  const filtered = inspections.filter((ins) => {
    const matchesSearch =
      ins.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.vehicleDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ins.customerName && ins.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ins.id && ins.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ins.assignedManagerName.toLowerCase().includes(searchQuery.toLowerCase());

    const normalizedStatus = (ins.status || 'REQUESTED').toUpperCase();
    const matchesFilter =
      statusFilter === 'ALL' ||
      normalizedStatus === statusFilter ||
      (statusFilter === 'SCHEDULED' && normalizedStatus === 'SCHEDULED');

    return matchesSearch && matchesFilter;
  });

  // Status transition handler
  const handleStatusChange = async (req: InspectionRequest, newStatus: InspectionStatusType) => {
    setUpdatingId(req.id);
    try {
      const res = await fetch(`/api/inspections/${req.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.inspection) {
        if (onUpdateInspection) onUpdateInspection(data.inspection);
        if (selectedInspection?.id === req.id) {
          setSelectedInspection(data.inspection);
        }
      }
    } catch (e) {
      console.error('Failed to update inspection status', e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Retry WhatsApp notification handler
  const handleRetryWhatsApp = async (reqId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRetryingId(reqId);
    try {
      const res = await fetch(`/api/inspections/${reqId}/retry-notification`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.request) {
        if (onUpdateInspection) onUpdateInspection(data.request);
        if (selectedInspection?.id === reqId) {
          setSelectedInspection(data.request);
        }
      }
    } catch (err) {
      console.error('Failed to retry WhatsApp alert', err);
    } finally {
      setRetryingId(null);
    }
  };

  const handleOpenFindingsModal = (req: InspectionRequest) => {
    setSelectedInspection(req);
    setEditPaintMicrons(req.physicalFindings?.paintMicrons ?? '');
    setEditChassisNote(req.physicalFindings?.chassisNote || '');
    setEditObdSummary(req.physicalFindings?.obdSummary || '');
    setEditNotes(req.notes || '');
  };

  const handleSaveFindings = async () => {
    if (!selectedInspection) return;
    setIsSavingFindings(true);
    try {
      const res = await fetch(`/api/inspections/${selectedInspection.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'COMPLETED',
          notes: editNotes,
          physicalFindings: {
            paintMicrons: editPaintMicrons !== '' ? Number(editPaintMicrons) : undefined,
            chassisNote: editChassisNote,
            obdSummary: editObdSummary,
          },
        }),
      });
      const data = await res.json();
      if (res.ok && data.inspection) {
        if (onUpdateInspection) onUpdateInspection(data.inspection);
        setSelectedInspection(data.inspection);
      }
    } catch (e) {
      console.error('Failed to save findings', e);
    } finally {
      setIsSavingFindings(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Evaluator Details Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Assigned Assessor Hub • Physical Verification</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5 font-display">
            Evaluator Dashboard & On-Site Inspections
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time physical inspection requests assigned to {evaluatorName} ({evaluatorRole})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewInspectionRequest}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>DISPATCH PHYSICAL INSPECTION</span>
          </button>
        </div>
      </div>

      {/* Primary Evaluator Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-900/40 border border-blue-700/60 flex items-center justify-center text-blue-400 font-black text-lg">
            TS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-display">{evaluatorName}</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                ✓ PRIMARY TRUSTED EVALUATOR
              </span>
            </div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">{evaluatorRole}</div>
            <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-blue-400" />
                Hyderabad, Telangana
              </span>
              <span>•</span>
              <span className="font-mono text-slate-300">WhatsApp: +91 {evaluatorWhatsapp.slice(-10)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${evaluatorPhone.slice(-10)}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            <Phone className="w-3.5 h-3.5 text-blue-400" />
            <span>Call Evaluator</span>
          </a>
          <a
            href={`https://wa.me/91${evaluatorWhatsapp.slice(-10)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold border border-emerald-600/40 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Direct</span>
          </a>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Reg No, Customer Name, Vehicle, or Inspection ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing <strong className="text-white">{filtered.length}</strong> of {inspections.length} Total Requests
          </div>
        </div>

        {/* Status Filter Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
              statusFilter === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ALL ({inspections.length})
          </button>
          {ALL_STATUSES.map((st) => {
            const count = inspections.filter(
              (i) => (i.status || 'REQUESTED').toUpperCase() === st
            ).length;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* INSPECTIONS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3.5">Inspection ID</th>
                <th className="py-3 px-3.5">Customer & Phone</th>
                <th className="py-3 px-3.5">Vehicle & Reg</th>
                <th className="py-3 px-3.5">Scheduled Slot</th>
                <th className="py-3 px-3.5">Assigned To</th>
                <th className="py-3 px-3.5">WhatsApp Alert</th>
                <th className="py-3 px-3.5">Inspection Status</th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No physical inspection requests found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => {
                  const normStatus = (req.status || 'REQUESTED').toUpperCase();
                  const waStatus = req.whatsappStatus || 'PENDING';

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-800/40 transition cursor-pointer"
                      onClick={() => handleOpenFindingsModal(req)}
                    >
                      {/* Inspection ID */}
                      <td className="py-3 px-3.5 font-mono text-[11px] whitespace-nowrap">
                        <span className="text-blue-400 font-bold block">{req.id}</span>
                        <span className="text-[10px] text-slate-500 block">
                          Eval: {req.evaluationId || 'SRA-PENDING'}
                        </span>
                      </td>

                      {/* Customer & Phone (Direct Dialable) */}
                      <td className="py-3 px-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="font-bold text-white text-xs">
                          {req.customerName || 'Customer (Unspecified)'}
                        </div>
                        {req.customerPhone ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <a
                              href={`tel:${req.customerPhone.replace(/\D/g, '')}`}
                              className="text-blue-400 hover:text-blue-300 font-mono text-[11px] flex items-center gap-1"
                              title="Call Customer"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{req.customerPhone}</span>
                            </a>
                            <a
                              href={`https://wa.me/91${req.customerPhone.replace(/\D/g, '').slice(-10)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300"
                              title="Message Customer via WhatsApp"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">No Phone Declared</span>
                        )}
                      </td>

                      {/* Vehicle & Reg */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="font-bold text-white text-xs">{req.registrationNumber}</div>
                        <div className="text-[11px] text-slate-300 max-w-[200px] truncate">
                          {req.vehicleDetails}
                        </div>
                        {req.estimatedMarketValue && req.estimatedMarketValue !== 'NOT AVAILABLE' && (
                          <div className="text-[10px] text-emerald-400 font-mono">
                            Est: {typeof req.estimatedMarketValue === 'number' ? `₹${req.estimatedMarketValue.toLocaleString('en-IN')}` : req.estimatedMarketValue}
                          </div>
                        )}
                      </td>

                      {/* Scheduled Slot */}
                      <td className="py-3 px-3.5 whitespace-nowrap font-mono text-slate-300 text-[11px]">
                        <div className="flex items-center gap-1 text-slate-200">
                          <Calendar className="w-3 h-3 text-blue-400" />
                          <span>{req.preferredDate || req.requestedDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{req.preferredTime || '11:00 AM'}</span>
                        </div>
                      </td>

                      {/* Assigned Assessor */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                          <span>{req.assignedManagerName || evaluatorName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">
                          {req.location}
                        </span>
                      </td>

                      {/* WhatsApp Evaluator Direct Dispatch */}
                      <td className="py-3 px-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={req.whatsappDirectLink || `https://wa.me/91${(req.assignedManagerWhatsapp || evaluatorWhatsapp).replace(/\D/g, '').slice(-10)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition"
                          title={`Open pre-filled WhatsApp dispatch to ${req.assignedManagerName || evaluatorName}`}
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp Dispatched</span>
                          <ExternalLink className="w-2.5 h-2.5 text-emerald-400/70" />
                        </a>
                      </td>

                      {/* Inspection Workflow Status (Interactive Selector) */}
                      <td className="py-3 px-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={normStatus}
                          disabled={updatingId === req.id}
                          onChange={(e) =>
                            handleStatusChange(req, e.target.value as InspectionStatusType)
                          }
                          className={`text-[11px] font-bold px-2 py-1 rounded border focus:outline-none cursor-pointer ${
                            normStatus === 'COMPLETED'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : normStatus === 'IN PROGRESS'
                              ? 'bg-blue-950 text-blue-300 border-blue-800'
                              : normStatus === 'CANCELLED'
                              ? 'bg-red-950 text-red-300 border-red-800'
                              : normStatus === 'SCHEDULED'
                              ? 'bg-purple-950 text-purple-300 border-purple-800'
                              : normStatus === 'CONTACTED'
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                              : normStatus === 'ASSIGNED'
                              ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                              : 'bg-amber-950 text-amber-300 border-amber-800'
                          }`}
                        >
                          {ALL_STATUSES.map((st) => (
                            <option key={st} value={st} className="bg-slate-900 text-white">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenFindingsModal(req)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
                        >
                          Assessment Sheet
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED INSPECTION MODAL / JOB SHEET */}
      {selectedInspection && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setSelectedInspection(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-blue-400 font-bold">
                    {selectedInspection.id}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      (selectedInspection.status || '').toUpperCase() === 'COMPLETED'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}
                  >
                    {selectedInspection.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  Physical Technical Assessment: {selectedInspection.registrationNumber} ({selectedInspection.vehicleDetails})
                </h3>
              </div>
              <button
                onClick={() => setSelectedInspection(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Customer & Inspector Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Customer Name & Phone:</span>
                <strong className="text-white block mt-0.5">
                  {selectedInspection.customerName || 'Customer (Unspecified)'}
                </strong>
                {selectedInspection.customerPhone && (
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={`tel:${selectedInspection.customerPhone.replace(/\D/g, '')}`}
                      className="text-blue-400 font-mono text-[11px] hover:underline"
                    >
                      📞 {selectedInspection.customerPhone}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Assigned Assessor:</span>
                <strong className="text-white block mt-0.5">
                  {selectedInspection.assignedManagerName || evaluatorName}
                </strong>
                <span className="text-[10px] text-slate-500">
                  {selectedInspection.assignedManagerRole || evaluatorRole}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Inspection Slot & Hub:</span>
                <strong className="text-white block mt-0.5">
                  {selectedInspection.preferredDate || selectedInspection.requestedDate} @{' '}
                  {selectedInspection.preferredTime || '11:00 AM'}
                </strong>
                <span className="text-[10px] text-slate-500 block truncate">
                  {selectedInspection.location}
                </span>
              </div>
            </div>

            {/* WhatsApp Evaluator Direct Automation Banner */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>DISPATCHED TO ASSIGNED EVALUATOR</span>
                  </span>
                  <span className="font-semibold text-white">{selectedInspection.assignedManagerName || evaluatorName}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Direct WhatsApp automation targeted to evaluator: <span className="font-mono text-emerald-400 font-semibold">+91 {evaluatorWhatsapp.slice(-10)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={selectedInspection.whatsappDirectLink || `https://wa.me/91${evaluatorWhatsapp.slice(-10)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open WhatsApp Chat</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Technical Findings Job Sheet */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Physical On-Site Inspection Job Sheet
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Paint Depth Gauge Micrometer Scan (Microns)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 110 (Factory OEM) or 175 (Repaint)"
                    value={editPaintMicrons}
                    onChange={(e) =>
                      setEditPaintMicrons(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Benchmark: 90 - 130 microns factory coat. 160+ indicates repaint/putty.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Chassis, Apron & Undercarriage Hoist Findings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Floorpan intact, zero rust, steering rack oil seal dry"
                    value={editChassisNote}
                    onChange={(e) => setEditChassisNote(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  OBD-II ECU Diagnostic Scan Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clean ECU scan. Zero active DTC fault codes. Airbag & ABS circuits normal."
                  value={editObdSummary}
                  onChange={(e) => setEditObdSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-xs">
                  Assessor Detailed Observation Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional technical comments for valuation report..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Update Status:</span>
                <select
                  value={(selectedInspection.status || 'REQUESTED').toUpperCase()}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedInspection,
                      e.target.value as InspectionStatusType
                    )
                  }
                  className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white font-bold"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedInspection(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveFindings}
                  disabled={isSavingFindings}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isSavingFindings ? 'Saving Findings...' : 'Save Assessment & Mark Completed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
