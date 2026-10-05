import React, { useState } from 'react';
import {
  Search,
  Filter,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Car,
  ChevronRight,
  ArrowRight,
  Eye,
  CheckCircle2,
  X,
  UserCheck,
} from 'lucide-react';
import { EvaluationRecord } from '../types';
import { formatINR } from '../utils/valuationEngine';

interface VehicleHistoryViewProps {
  evaluations: EvaluationRecord[];
  onSelectEvaluation: (record: EvaluationRecord) => void;
  onRequestInspection: (record: EvaluationRecord) => void;
  onOpenNewEvaluation: () => void;
}

export const VehicleHistoryView: React.FC<VehicleHistoryViewProps> = ({
  evaluations,
  onSelectEvaluation,
  onRequestInspection,
  onOpenNewEvaluation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTimelineRecord, setActiveTimelineRecord] = useState<EvaluationRecord | null>(null);

  const filtered = evaluations.filter((item) => {
    const matchesQuery =
      searchQuery === '' ||
      item.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.conditionStatus === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Valuation Audit Trail
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5 font-display">
            Vehicle Appraisal History
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Searchable log of all previously evaluated vehicles, inspection records, and dealer margin outcomes
          </p>
        </div>

        <button
          onClick={onOpenNewEvaluation}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
        >
          <span>+ Evaluate New Car</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Reg No, Make, Model, or Evaluation ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Filter Condition:</span>
          {['all', 'Good', 'Verified', 'Needs Inspection', 'Damage Detected', 'Possible Flood Exposure'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* History Grid / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Evaluation ID</th>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4">Vehicle Specs</th>
                <th className="py-3 px-4">Odometer</th>
                <th className="py-3 px-4">Estimated Value Range</th>
                <th className="py-3 px-4">Suggested Dealer Buy</th>
                <th className="py-3 px-4">Condition Status</th>
                <th className="py-3 px-4">Inspection</th>
                <th className="py-3 px-4 text-right">Audit Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length > 0 ? (
                filtered.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-800/40 transition cursor-pointer"
                    onClick={() => onSelectEvaluation(record)}
                  >
                    <td className="py-3.5 px-4 font-mono text-[11px] text-blue-400 whitespace-nowrap">
                      {record.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {record.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white">
                        {record.year} {record.make} {record.model}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {record.variant} • {record.fuelType}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {record.km.toLocaleString('en-IN')} km
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-white whitespace-nowrap">
                      {formatINR(record.estimatedValueMin)} – {formatINR(record.estimatedValueMax)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {formatINR(record.dealerBuyMin)} – {formatINR(record.dealerBuyMax)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        record.conditionStatus === 'Good' || record.conditionStatus === 'Verified'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : record.conditionStatus === 'Needs Inspection'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-red-950 text-red-300 border-red-800'
                      }`}>
                        {record.conditionStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[11px] ${
                        record.inspectionStatus === 'Completed' ? 'text-blue-400 font-semibold' : 'text-slate-400'
                      }`}>
                        {record.inspectionStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveTimelineRecord(record)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition flex items-center gap-1"
                          title="View complete appraisal lifecycle timeline"
                        >
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Timeline</span>
                        </button>
                        <button
                          onClick={() => onSelectEvaluation(record)}
                          className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-medium border border-blue-500/30 transition flex items-center gap-1"
                          title="Open full printable evaluation certificate"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Report</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : evaluations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs space-y-2">
                    <p className="text-sm font-semibold text-slate-300">No evaluation history found.</p>
                    <p className="text-slate-500">Evaluated vehicles will be recorded here with an immutable audit timeline.</p>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 text-xs">
                    No historical evaluation records matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL LIFECYCLE TIMELINE MODAL */}
      {activeTimelineRecord && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveTimelineRecord(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-blue-400 font-bold">{activeTimelineRecord.id}</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Lifecycle Audit: {activeTimelineRecord.registrationNumber} ({activeTimelineRecord.make} {activeTimelineRecord.model})
                </h3>
              </div>
              <button
                onClick={() => setActiveTimelineRecord(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center flex-shrink-0 font-bold text-[11px]">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-white">01. Vehicle Details & Document Ingestion</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Logged by Dealer Terminal at {activeTimelineRecord.date}. Stated KM: {activeTimelineRecord.km.toLocaleString('en-IN')}. RC extracted successfully.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center flex-shrink-0 font-bold text-[11px]">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-white">02. 16 Photographic Angles Uploaded</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    All primary profiles (Front, Rear, Left, Right) and technical undercarriage/engine slots validated against lighting quality thresholds.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center flex-shrink-0 font-bold text-[11px]">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-white">03. Algorithmic Condition & Risk Assessment</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Exterior condition score: {activeTimelineRecord.conditionStatus}. Water damage forensic index: Low indication.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center flex-shrink-0 font-bold text-[11px]">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-white">04. Regional Wholesale Market Valuation Generated</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Market Range: {formatINR(activeTimelineRecord.estimatedValueMin)} – {formatINR(activeTimelineRecord.estimatedValueMax)}. Suggested Dealer Buy: {formatINR(activeTimelineRecord.dealerBuyMin)} – {formatINR(activeTimelineRecord.dealerBuyMax)}.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[11px] ${
                  activeTimelineRecord.inspectionStatus === 'Completed'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {activeTimelineRecord.inspectionStatus === 'Completed' ? '✓' : '○'}
                </div>
                <div>
                  <div className="font-bold text-white">05. Technical Inspection Status</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Current status: <strong className="text-white">{activeTimelineRecord.inspectionStatus}</strong>.
                    {activeTimelineRecord.inspectionStatus !== 'Completed' && (
                      <span className="text-amber-400 ml-1">Assigned technician report required before final purchase voucher.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const r = activeTimelineRecord;
                  setActiveTimelineRecord(null);
                  onSelectEvaluation(r);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                View Full Valuation Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
