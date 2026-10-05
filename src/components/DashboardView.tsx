import React, { useState } from 'react';
import {
  Car,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Droplets,
  PlusCircle,
  History,
  FileText,
  Search,
  ChevronRight,
  Filter,
  Eye,
  Calendar,
  AlertCircle,
  Info,
} from 'lucide-react';
import { EvaluationRecord } from '../types';
import { formatINR } from '../utils/valuationEngine';

interface DashboardViewProps {
  evaluations: EvaluationRecord[];
  onStartEvaluation: () => void;
  onViewHistory: () => void;
  onSelectEvaluation: (record: EvaluationRecord) => void;
  onRequestInspection: (record: EvaluationRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  evaluations,
  onStartEvaluation,
  onViewHistory,
  onSelectEvaluation,
  onRequestInspection,
}) => {
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Computations for real dealer KPIs based on actual evaluated inventory
  const totalEvaluated = evaluations.length;
  const pendingInspections = evaluations.filter((e) => e.inspectionStatus === 'Pending' || e.inspectionStatus === 'Scheduled').length;
  const damageAlerts = evaluations.filter((e) => e.conditionStatus === 'Damage Detected').length;
  const floodRiskAlerts = evaluations.filter((e) => e.conditionStatus === 'Possible Flood Exposure').length;

  const totalMarketVal = evaluations.reduce((acc, curr) => acc + (curr.estimatedValueMin + curr.estimatedValueMax) / 2, 0);
  const avgMarketVal = totalEvaluated > 0 ? Math.round(totalMarketVal / totalEvaluated) : 0;

  const totalDealerBuy = evaluations.reduce((acc, curr) => acc + (curr.dealerBuyMin + curr.dealerBuyMax) / 2, 0);
  const avgDealerBuy = totalEvaluated > 0 ? Math.round(totalDealerBuy / totalEvaluated) : 0;

  // Filtered recent list
  const filteredVehicles = evaluations.filter((e) => {
    const matchesCondition = filterCondition === 'all' || e.conditionStatus === filterCondition;
    const matchesQuery =
      searchQuery === '' ||
      e.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCondition && matchesQuery;
  });

  const getConditionBadge = (condition: EvaluationRecord['conditionStatus']) => {
    switch (condition) {
      case 'Good':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/70 text-emerald-300 border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Good
          </span>
        );
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-950/70 text-blue-300 border border-blue-800/80">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            Verified
          </span>
        );
      case 'Needs Inspection':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/70 text-amber-300 border border-amber-800/80">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            Needs Inspection
          </span>
        );
      case 'Damage Detected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-950/70 text-orange-300 border border-orange-800/80">
            <AlertTriangle className="w-3 h-3 text-orange-400" />
            Damage Detected
          </span>
        );
      case 'Possible Flood Exposure':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-950/70 text-red-300 border border-red-800/80">
            <Droplets className="w-3 h-3 text-red-400" />
            Possible Flood Exposure
          </span>
        );
      default:
        return <span>{condition}</span>;
    }
  };

  const getRiskBadge = (risk: EvaluationRecord['riskLevel']) => {
    switch (risk) {
      case 'Low':
        return <span className="text-[11px] font-medium text-emerald-400">Low</span>;
      case 'Medium':
        return <span className="text-[11px] font-medium text-amber-400">Medium</span>;
      case 'High':
        return <span className="text-[11px] font-medium text-red-400 font-semibold">High</span>;
      default:
        return <span>{risk}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dealer Top Identity & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <span>Sai Ram AutoAnalytics</span>
            <span>•</span>
            <span className="text-slate-400">Used-Car Valuation Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1 font-display">
            Dealership Valuation & Inspection Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Real-time market valuation, structured photographic condition assessment, damage flagging, and trusted physical inspection management for used-car buying in India.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onViewHistory}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>View Vehicle History</span>
          </button>
          <button
            onClick={onStartEvaluation}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition border border-blue-400/30"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Evaluate Vehicle</span>
          </button>
        </div>
      </div>

      {/* Professional Notice Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-white">System Advisory:</span> Photographs alone cannot guarantee the exact internal mechanical condition or exact transaction price. Sai Ram AutoAnalytics delivers an <span className="text-blue-300 font-medium">Indicative Purchase Range</span> and highlights visible risks requiring physical verification by our verified inspection managers.
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Vehicles Evaluated */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Vehicles Evaluated</span>
            <Car className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">{totalEvaluated}</div>
          <div className="mt-1 text-[11px] text-slate-400">Active dealer catalog</div>
        </div>

        {/* Pending Inspections */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pending Inspections</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-300 font-mono">{pendingInspections}</div>
          <div className="mt-1 text-[11px] text-slate-400">Awaiting technical assessor</div>
        </div>

        {/* Potential Damage Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Damage Alerts</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-orange-300 font-mono">{damageAlerts}</div>
          <div className="mt-1 text-[11px] text-slate-400">Panel & paint variance</div>
        </div>

        {/* Flood-Risk Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Flood-Risk Alerts</span>
            <Droplets className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-red-300 font-mono">{floodRiskAlerts}</div>
          <div className="mt-1 text-[11px] text-slate-400">Moisture / rust markers</div>
        </div>

        {/* Average Purchase Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Avg Purchase Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold text-emerald-300 font-mono">
            {totalEvaluated > 0 ? formatINR(avgDealerBuy) : '—'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Suggested dealer buy</div>
        </div>

        {/* Estimated Market Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Avg Market Value</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold text-blue-300 font-mono">
            {totalEvaluated > 0 ? formatINR(avgMarketVal) : '—'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Indicative wholesale</div>
        </div>
      </div>

      {/* Recent Evaluations Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-md overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Recent Evaluations</span>
              <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {filteredVehicles.length} of {evaluations.length} records
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Evaluated used vehicles with condition and valuation status</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Filter registration / make..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-md pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono w-44 sm:w-56"
              />
            </div>

            {/* Condition Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-md px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none pr-2 cursor-pointer"
              >
                <option value="all" className="bg-slate-900">All Conditions</option>
                <option value="Good" className="bg-slate-900">Good</option>
                <option value="Needs Inspection" className="bg-slate-900">Needs Inspection</option>
                <option value="Damage Detected" className="bg-slate-900">Damage Detected</option>
                <option value="Possible Flood Exposure" className="bg-slate-900">Possible Flood Exposure</option>
                <option value="Verified" className="bg-slate-900">Verified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4">Make / Model</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Variant</th>
                <th className="py-3 px-4">KM Driven</th>
                <th className="py-3 px-4">Estimated Value</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Inspection Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-800/50 transition cursor-pointer group"
                    onClick={() => onSelectEvaluation(row)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {row.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100 whitespace-nowrap">
                      {row.make} {row.model}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {row.year}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap max-w-[150px] truncate" title={row.variant}>
                      {row.variant}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {row.km.toLocaleString('en-IN')} km
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                      ₹{(row.estimatedValueMin / 100000).toFixed(2)} - {(row.estimatedValueMax / 100000).toFixed(2)} Lakh
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getConditionBadge(row.conditionStatus)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRiskBadge(row.riskLevel)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`text-[11px] font-medium ${
                        row.inspectionStatus === 'Completed'
                          ? 'text-blue-400'
                          : row.inspectionStatus === 'Scheduled' || row.inspectionStatus === 'Pending'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}>
                        {row.inspectionStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {row.date}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectEvaluation(row)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition"
                          title="Open Full Evaluation Report"
                        >
                          View Report
                        </button>
                        {row.inspectionStatus !== 'Completed' && (
                          <button
                            onClick={() => onRequestInspection(row)}
                            className="px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[11px] font-medium border border-blue-500/30 transition"
                            title="Request physical inspection"
                          >
                            Inspection
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : evaluations.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 text-xs space-y-3">
                    <p className="text-sm font-semibold text-slate-300">No completed evaluations yet.</p>
                    <p className="text-slate-500">Capture your first vehicle using the guided photo workflow to generate real-time metrics.</p>
                    <button
                      onClick={onStartEvaluation}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition mt-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Start First Evaluation</span>
                    </button>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400 text-xs">
                    No evaluated vehicles match your search or condition criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Indian Regional Market Index: Active (Hyderabad, Bengaluru, Mumbai, Delhi)</span>
          </div>
          <div>
            Showing recent evaluations from dealer database
          </div>
        </div>
      </div>
    </div>
  );
};
