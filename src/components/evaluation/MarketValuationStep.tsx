import React from 'react';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Info,
  CheckCircle2,
  Car,
  Tag,
} from 'lucide-react';
import { MarketValuation, VehicleDetails } from '../../types';
import { formatINR } from '../../utils/valuationEngine';

interface MarketValuationStepProps {
  valuation: MarketValuation;
  details: VehicleDetails;
  onGenerateReport: () => void;
  onBack: () => void;
}

export const MarketValuationStep: React.FC<MarketValuationStepProps> = ({
  valuation,
  details,
  onGenerateReport,
  onBack,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Automotive Valuation Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5 font-display">
            Used-Car Market Valuation & Dealer Buy Range
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Targeted for {details.city || 'Hyderabad'} regional secondary market demand
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
            ESTIMATED VALUATION
          </span>
        </div>
      </div>

      {/* Primary Value Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estimated Market Retail Value */}
        <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Estimated Market Value
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
              Retail Secondary Index
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {formatINR(valuation.estimatedMarketValueMin)} – {formatINR(valuation.estimatedMarketValueMax)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Anticipated selling price to retail buyer in {details.city} following clean certification
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Market Benchmark Baseline:</span>
            <span className="font-mono font-semibold text-slate-200">
              {formatINR(valuation.baseMarketValue)}
            </span>
          </div>
        </div>

        {/* Suggested Dealer Purchase Range */}
        <div className="bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-600/50 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Suggested Dealer Purchase Range
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              Procurement Target
            </span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
              {formatINR(valuation.suggestedDealerPurchaseMin)} – {formatINR(valuation.suggestedDealerPurchaseMax)}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Recommended dealer entry price to preserve healthy margin after reconditioning
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">Target Dealer Margin:</span>
              <div className="font-bold text-white font-mono mt-0.5">~9.5% (₹1.10L)</div>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Repair & Prep Outlay:</span>
              <div className="font-bold text-amber-300 font-mono mt-0.5">
                {formatINR(valuation.expectedRepairAllowance)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Valuation Waterfall Adjustments Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Valuation Calibration Breakdown
          </h3>
          <span className="text-[11px] text-slate-400">
            Factors applied to base showroom and regional market index
          </span>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {valuation.breakdownWaterfall.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-white">{item.label}</div>
                {item.note && (
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.note}</div>
                )}
              </div>
              <div
                className={`font-mono font-bold whitespace-nowrap ${
                  item.type === 'positive'
                    ? 'text-emerald-400'
                    : item.type === 'negative'
                    ? 'text-red-400'
                    : 'text-slate-200'
                }`}
              >
                {item.amount > 0 && item.type === 'positive' ? `+${formatINR(item.amount)}` : formatINR(item.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          ← Back to Condition
        </button>

        <button
          type="button"
          onClick={onGenerateReport}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition"
        >
          Generate Official Appraisal Certificate →
        </button>
      </div>
    </div>
  );
};
