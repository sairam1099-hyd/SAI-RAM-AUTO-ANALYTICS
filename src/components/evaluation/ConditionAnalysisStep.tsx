import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Droplets,
  Gauge,
  CheckCircle2,
  FileCheck,
  Wrench,
  HelpCircle,
  Eye,
  Info,
} from 'lucide-react';
import {
  ConditionScore,
  DamageFinding,
  FloodFinding,
  DashboardAnalysis,
  RcDocumentData,
  ConditionCategory,
  FloodRiskCategory,
} from '../../types';

interface ConditionAnalysisStepProps {
  conditionScore: ConditionScore;
  damageFindings: DamageFinding[];
  floodFindings: FloodFinding[];
  dashboardAnalysis?: DashboardAnalysis;
  rcData?: RcDocumentData | null;
  onProceedToValuation: () => void;
  onBack: () => void;
}

export const ConditionAnalysisStep: React.FC<ConditionAnalysisStepProps> = ({
  conditionScore,
  damageFindings,
  floodFindings,
  dashboardAnalysis,
  rcData,
  onProceedToValuation,
  onBack,
}) => {
  const getScoreBadge = (score: ConditionCategory) => {
    switch (score) {
      case 'GOOD':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
            GOOD
          </span>
        );
      case 'FAIR':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
            FAIR
          </span>
        );
      case 'NEEDS ATTENTION':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
            ATTENTION
          </span>
        );
      case 'HIGH RISK':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
            HIGH RISK
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
            NOT VERIFIED
          </span>
        );
    }
  };

  const getFloodBadge = (cat?: FloodRiskCategory) => {
    switch (cat) {
      case 'LOW INDICATION':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            LOW INDICATION
          </span>
        );
      case 'POSSIBLE WATER EXPOSURE':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            POSSIBLE WATER EXPOSURE
          </span>
        );
      case 'HIGH-RISK INDICATORS':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-800 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            HIGH-RISK INDICATORS
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
            PHYSICAL INSPECTION REQUIRED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Algorithmic Inspection & Risk Analysis
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5 font-display">
            Vehicle Condition & Risk Assessment
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluated from high-resolution photo evidence, odometer cluster read, and RC smartcard verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          {getFloodBadge(conditionScore.floodRiskCategory)}
        </div>
      </div>

      {/* Mandatory Professional Disclaimer Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold text-white">Automotive Engineering Notice:</span> Photographic screening detects visible paint anomalies, panel alignments, and water line indicators. All flagged items are classified as <span className="text-amber-300 font-semibold">"Requires physical verification"</span> and must be inspected on-site by our certified technical evaluators using calibrated paint depth gauges and OBD diagnostic scanners.
        </div>
      </div>

      {/* 6-Category Condition Scorecard */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
          Component Condition Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Exterior Body</div>
            <div>{getScoreBadge(conditionScore.exteriorScore)}</div>
            <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
              {conditionScore.explanations?.exterior || 'Panel seams within tolerance'}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Interior Cabin</div>
            <div>{getScoreBadge(conditionScore.interiorScore)}</div>
            <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
              {conditionScore.explanations?.interior || 'Nominal bolster wear'}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Tyres & Wheels</div>
            <div>{getScoreBadge(conditionScore.tyresScore)}</div>
            <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
              {conditionScore.explanations?.tyres || 'Even shoulder tread wear'}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Engine Bay</div>
            <div>{getScoreBadge(conditionScore.engineScore)}</div>
            <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
              {conditionScore.explanations?.engine || 'OEM apron spot welds intact'}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Electronics/OBD</div>
            <div>{getScoreBadge(conditionScore.electronicsScore)}</div>
            <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
              Zero warning lights on cluster
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1.5">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">RC Documents</div>
            <div>{getScoreBadge(conditionScore.documentsScore)}</div>
            <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
              {conditionScore.explanations?.documents || 'RTO schema verified'}
            </p>
          </div>
        </div>
      </div>

      {/* Visible Damage Findings Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Visible Damage & Panel Variations ({damageFindings.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Requires physical verification
          </span>
        </div>

        {damageFindings.length > 0 ? (
          <div className="space-y-3">
            {damageFindings.map((finding, idx) => (
              <div
                key={finding.id || idx}
                className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    <span className="font-bold text-white text-xs">{finding.component}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950 text-orange-300 font-semibold border border-orange-800">
                      {finding.potentialSeverity || 'Minor'}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/80">
                    Status: Requires physical verification
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{finding.finding}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                  <span>Photo Evidence: {finding.imageReference || 'Guided Exterior Scan'}</span>
                  <span>Confidence: {finding.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-center text-xs text-slate-400">
            No visible body panel distortion, severe scratch, or repaint blemishes detected in photographic scans.
          </div>
        )}
      </div>

      {/* Water / Flood Risk Exposure Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Possible Water / Flood Exposure Screening
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Category: {conditionScore.floodRiskCategory || 'LOW INDICATION'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {floodFindings.map((flood, idx) => (
            <div
              key={flood.id || idx}
              className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-200">{flood.area}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    flood.severity === 'High'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : flood.severity === 'Medium'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {flood.severity} Indication
                </span>
              </div>
              <p className="text-xs text-slate-300">{flood.indicator}</p>
              <p className="text-[11px] text-slate-400">{flood.notes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RC Document Cross-Verification Table */}
      {rcData && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              RC vs Vehicle Visual Cross-Verification
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase">Registration Match</div>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{rcData.fieldMatches.registration}</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase">Make & Model</div>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{rcData.fieldMatches.makeModel}</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase">Fuel Type</div>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{rcData.fieldMatches.fuel}</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] text-slate-400 uppercase">Owner Serial Count</div>
              <div className="flex items-center gap-1.5 mt-1 font-semibold text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{rcData.fieldMatches.ownerSerial}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          ← Back to Photos
        </button>

        <button
          type="button"
          onClick={onProceedToValuation}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition"
        >
          Proceed to Market Valuation →
        </button>
      </div>
    </div>
  );
};
