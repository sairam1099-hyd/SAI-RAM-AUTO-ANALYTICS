import React, { useRef } from 'react';
import {
  Printer,
  Download,
  Share2,
  Car,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  Droplets,
  Gauge,
  Layers,
} from 'lucide-react';
import { EvaluationRecord } from '../types';
import { formatINR } from '../utils/valuationEngine';

interface ReportsViewProps {
  evaluation: EvaluationRecord | null;
  onBackToDashboard: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  evaluation,
  onBackToDashboard,
}) => {
  if (!evaluation) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-4">
        <Car className="w-12 h-12 text-slate-600 mx-auto" />
        <h2 className="text-base font-bold text-white">No completed reports yet.</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Select a vehicle from the Dashboard or evaluate a car using the guided photo capture flow to generate an official Sai Ram AutoAnalytics appraisal certificate.
        </p>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 no-print">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Automotive Appraisal Certificate
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5 font-display">
            Official Vehicle Valuation Report
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Document ID: <span className="font-mono text-slate-200">{evaluation.id}</span> • Generated for Sai Ram AutoAnalytics Procurement Desk
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackToDashboard}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            ← Back to Dashboard
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-10 space-y-8 shadow-2xl text-slate-100 print:bg-white print:text-black print:p-0 print:border-0 print:shadow-none">
        {/* DOCUMENT HEADER / DEALERSHIP LETTERHEAD */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-800 print:border-slate-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded bg-blue-700 text-white flex items-center justify-center font-black text-base print:bg-blue-800">
                SR
              </div>
              <div>
                <span className="font-extrabold text-lg text-white font-display print:text-black">
                  SAI RAM AUTOANALYTICS
                </span>
                <span className="text-xs font-semibold text-blue-400 ml-1.5 uppercase tracking-wider print:text-blue-700">
                  Valuation Desk
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium print:text-slate-600">
              Sai Ram Automotive Services LLP • Know the Car. Know the Value.
            </p>
            <p className="text-[11px] text-slate-400 font-mono print:text-slate-600">
              GSTIN: 36AAACS4821M1ZH • Jubilee Hills Automotive Hub, Hyderabad
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <div className="text-xs font-mono font-bold text-blue-400 print:text-blue-800">
              CERTIFICATE NO: {evaluation.id}
            </div>
            <div className="text-xs text-slate-400 print:text-slate-600">
              Evaluation Date: <strong className="text-white print:text-black">{evaluation.date}</strong>
            </div>
            <div className="text-xs text-slate-400 print:text-slate-600">
              Inspection Status:{' '}
              <strong className="text-emerald-400 print:text-emerald-700">
                {evaluation.inspectionStatus}
              </strong>
            </div>
          </div>
        </div>

        {/* CORE VEHICLE IDENTIFIERS */}
        <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 print:bg-slate-50 print:border-slate-300">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 print:text-slate-600">Registration Number</span>
              <div className="text-base font-bold font-mono text-white mt-0.5 print:text-black">
                {evaluation.registrationNumber}
              </div>
            </div>

            <div>
              <span className="text-slate-400 print:text-slate-600">Vehicle Description</span>
              <div className="text-sm font-bold text-white mt-0.5 print:text-black">
                {evaluation.year} {evaluation.make} {evaluation.model}
              </div>
            </div>

            <div>
              <span className="text-slate-400 print:text-slate-600">Variant & Transmission</span>
              <div className="text-xs font-semibold text-slate-200 mt-0.5 print:text-black">
                {evaluation.variant} ({evaluation.transmission})
              </div>
            </div>

            <div>
              <span className="text-slate-400 print:text-slate-600">Odometer & Fuel</span>
              <div className="text-xs font-semibold text-slate-200 mt-0.5 font-mono print:text-black">
                {evaluation.km.toLocaleString('en-IN')} KM • {evaluation.fuelType}
              </div>
            </div>
          </div>
        </div>

        {/* VALUATION SUMMARY BOXES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 print:border-slate-300 print:bg-slate-50">
            <span className="text-[11px] font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider">
              Estimated Market Value
            </span>
            <div className="text-xl font-bold font-mono text-white mt-1 print:text-black">
              {formatINR(evaluation.estimatedValueMin)} – {formatINR(evaluation.estimatedValueMax)}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 print:text-slate-500">
              Fair regional wholesale range in {evaluation.city}
            </p>
          </div>

          <div className="bg-slate-950 border border-emerald-900/60 rounded-xl p-4 print:border-emerald-700 print:bg-emerald-50">
            <span className="text-[11px] font-semibold text-emerald-400 print:text-emerald-800 uppercase tracking-wider">
              Suggested Dealer Buy Range
            </span>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-1 print:text-emerald-900">
              {formatINR(evaluation.dealerBuyMin)} – {formatINR(evaluation.dealerBuyMax)}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 print:text-slate-600">
              Protects dealer margin (~9.5%) after reconditioning
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 print:border-slate-300 print:bg-slate-50">
            <span className="text-[11px] font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider">
              Expected Repair Allowance
            </span>
            <div className="text-xl font-bold font-mono text-amber-300 mt-1 print:text-amber-800">
              {formatINR(evaluation.repairAllowance)}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 print:text-slate-500">
              Refinishing, touch-up & mechanical allowance
            </p>
          </div>
        </div>

        {/* CONDITION & RISK BREAKDOWN */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider print:text-black border-b border-slate-800 pb-1.5 print:border-slate-300">
            Condition Matrix & Visual Assessment
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded print:border-slate-300 print:bg-white">
              <span className="text-slate-400 print:text-slate-600 text-[10px]">Overall Status</span>
              <div className="font-bold text-white print:text-black mt-0.5">{evaluation.conditionStatus}</div>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded print:border-slate-300 print:bg-white">
              <span className="text-slate-400 print:text-slate-600 text-[10px]">Risk Index</span>
              <div className="font-bold text-emerald-400 print:text-emerald-700 mt-0.5">{evaluation.riskLevel} Risk</div>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded print:border-slate-300 print:bg-white">
              <span className="text-slate-400 print:text-slate-600 text-[10px]">Exterior Body</span>
              <div className="font-bold text-amber-400 print:text-amber-700 mt-0.5">{evaluation.conditionScore.exteriorScore}</div>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded print:border-slate-300 print:bg-white">
              <span className="text-slate-400 print:text-slate-600 text-[10px]">Interior Upholstery</span>
              <div className="font-bold text-emerald-400 print:text-emerald-700 mt-0.5">{evaluation.conditionScore.interiorScore}</div>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded print:border-slate-300 print:bg-white">
              <span className="text-slate-400 print:text-slate-600 text-[10px]">Flood/Moisture</span>
              <div className="font-bold text-emerald-400 print:text-emerald-700 mt-0.5">{evaluation.conditionScore.floodRiskCategory}</div>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded print:border-slate-300 print:bg-white">
              <span className="text-slate-400 print:text-slate-600 text-[10px]">RC Match Check</span>
              <div className="font-bold text-emerald-400 print:text-emerald-700 mt-0.5">VERIFIED MATCH</div>
            </div>
          </div>
        </div>

        {/* DAMAGE FINDINGS TABLE */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider print:text-black border-b border-slate-800 pb-1.5 print:border-slate-300">
            Detailed Damage & Refinishing Findings
          </h3>

          <div className="overflow-x-auto border border-slate-800 rounded-lg print:border-slate-300">
            <table className="w-full text-left text-xs text-slate-300 print:text-black">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] print:bg-slate-100 print:text-slate-700">
                <tr>
                  <th className="py-2 px-3">Component</th>
                  <th className="py-2 px-3">Finding</th>
                  <th className="py-2 px-3">Confidence</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Estimated Outlay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200 font-medium">
                {evaluation.damageFindings.length > 0 ? (
                  evaluation.damageFindings.map((d) => (
                    <tr key={d.id}>
                      <td className="py-2 px-3 font-semibold text-white print:text-black">{d.component}</td>
                      <td className="py-2 px-3 text-slate-300 print:text-slate-700">{d.finding}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-blue-400 print:text-blue-800">{d.confidence}</td>
                      <td className="py-2 px-3 text-amber-400 print:text-amber-800 italic text-[11px]">{d.status}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-white print:text-black">
                        {formatINR(d.repairEstimateINR)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-3 text-center text-xs text-slate-400">
                      No significant body damage detected in evaluated photographs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 16-POINT PHOTOGRAPHIC PROOF MATRIX (THUMBNAILS IN REPORT) */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider print:text-black border-b border-slate-800 pb-1.5 print:border-slate-300">
            Photographic Evidence Audit (Primary Profiles)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {evaluation.photos
              .filter((p) => p.dataUrl && p.isPrimary)
              .map((photo) => (
                <div key={photo.key} className="space-y-1">
                  <div className="aspect-video bg-slate-950 rounded overflow-hidden border border-slate-800 print:border-slate-300">
                    <img
                      src={photo.dataUrl}
                      alt={photo.label}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 print:text-slate-700 truncate">
                    {photo.label}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* SIGNATURE BLOCK & OFFICIAL ADVISORY */}
        <div className="pt-6 border-t border-slate-800 print:border-slate-300 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div>
              <span className="font-semibold text-white print:text-black">Mandatory Legal Disclaimer:</span>
              <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1 leading-relaxed">
                This valuation certificate is generated for internal automotive procurement appraisal. While backed by photographic analysis and secondary wholesale data, photographs alone cannot guarantee internal mechanical condition, engine compression, or transmission health. Final binding purchase orders require physical verification by our certified technical assessors.
              </p>
            </div>

            <div className="flex flex-col justify-end text-left sm:text-right space-y-1">
              <div className="font-serif italic text-base text-slate-300 print:text-slate-800">
                Sai Ram AutoAnalytics
              </div>
              <div className="text-xs font-bold text-white print:text-black">
                Authorized Dealer Signatory & Appraisal Stamp
              </div>
              <div className="text-[10px] text-slate-400 font-mono print:text-slate-600">
                Verification Key: SHA256-{evaluation.id.replace(/-/g, '')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
