import React, { useState } from 'react';
import {
  Printer,
  Share2,
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
  Car,
  Check,
  UserCheck,
} from 'lucide-react';
import { EvaluationRecord } from '../../types';
import { formatINR } from '../../utils/valuationEngine';
import { ContactEvaluatorModal } from '../ContactEvaluatorModal';

interface FinalReportViewProps {
  evaluation: EvaluationRecord;
  onRequestPhysicalInspection: () => void;
  onFinish: () => void;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({
  evaluation,
  onRequestPhysicalInspection,
  onFinish,
}) => {
  const [showContactModal, setShowContactModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Toolbar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 no-print">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Official Appraisal Certificate
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5 font-display">
            Evaluation & Appraisal Report
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluation ID: <span className="font-mono text-blue-300 font-bold">{evaluation.id}</span> • Sai Ram AutoAnalytics Procurement Desk
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold border border-slate-700 transition"
          >
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>CONTACT EVALUATOR</span>
          </button>

          <button
            type="button"
            onClick={onRequestPhysicalInspection}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>DISPATCH PHYSICAL INSPECTION</span>
          </button>

          <button
            type="button"
            onClick={onFinish}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            Done & Save
          </button>
        </div>
      </div>

      {/* PHYSICAL INSPECTION RECOMMENDATION (Prominent Banner) */}
      <div className="bg-blue-950/40 border border-blue-800/80 rounded-2xl p-5 sm:p-6 space-y-3 no-print shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span>PHYSICAL INSPECTION RECOMMENDED</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-3xl">
          Photo analysis cannot verify every mechanical, structural or water-damage issue. Request a physical inspection before making the final purchase decision.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowContactModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition shadow"
          >
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span>CONTACT EVALUATOR</span>
          </button>
          <button
            type="button"
            onClick={onRequestPhysicalInspection}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition border border-blue-400/30"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>DISPATCH PHYSICAL INSPECTION</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE CERTIFICATE DOCUMENT */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-100 print:bg-white print:text-black print:p-0 print:border-0 print:shadow-none">
        {/* Dealership Header Letterhead */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800 print:border-slate-300">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                SR
              </div>
              <div>
                <span className="font-black text-lg text-white font-display tracking-wide print:text-black">
                  SAI RAM AUTOANALYTICS
                </span>
                <p className="text-[10px] text-slate-400 font-medium">Know the Car. Know the Value.</p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Jubilee Hills / Gachibowli Hub, Hyderabad, Telangana • GSTIN: 36AAACS4821M1ZH
            </p>
          </div>

          <div className="text-left sm:text-right text-xs">
            <div className="text-[11px] font-semibold text-slate-400">Official Evaluation ID:</div>
            <div className="font-mono text-base font-bold text-blue-400 print:text-black mt-0.5">
              {evaluation.id}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Date: {evaluation.date} • {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Vehicle Identity & Core Specs */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3 print:bg-slate-50 print:border-slate-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xl sm:text-2xl font-black text-white print:text-black">
                {evaluation.year} {evaluation.make} {evaluation.model}
              </span>
              <div className="text-xs font-semibold text-blue-300 print:text-blue-800 mt-0.5">
                {evaluation.variant}
              </div>
            </div>

            <div className="font-mono text-sm font-bold bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-100 print:bg-white print:border-slate-400 print:text-black">
              {evaluation.registrationNumber}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Fuel & Gear</span>
              <div className="font-bold text-white print:text-black mt-0.5">
                {evaluation.fuelType} • {evaluation.transmission}
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Odometer</span>
              <div className="font-mono font-bold text-white print:text-black mt-0.5">
                {evaluation.km.toLocaleString('en-IN')} KM
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Ownership</span>
              <div className="font-bold text-white print:text-black mt-0.5">
                Owner {evaluation.owners}
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">RTO Jurisdiction</span>
              <div className="font-bold text-white print:text-black mt-0.5">
                {evaluation.city}
              </div>
            </div>
          </div>
        </div>

        {/* Valuation Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-1 print:bg-slate-50 print:border-slate-300">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Estimated Market Value (Retail)
            </span>
            <div className="text-xl sm:text-2xl font-black text-white print:text-black font-mono">
              {formatINR(evaluation.estimatedValueMin)} – {formatINR(evaluation.estimatedValueMax)}
            </div>
            <p className="text-[10px] text-slate-400">Secondary market fair retail transaction estimate</p>
          </div>

          <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-4 space-y-1 print:bg-blue-50 print:border-blue-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800">
              Suggested Dealer Purchase Range
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 print:text-emerald-800 font-mono">
              {formatINR(evaluation.dealerBuyMin)} – {formatINR(evaluation.dealerBuyMax)}
            </div>
            <p className="text-[10px] text-slate-300 print:text-slate-600">
              Dealer wholesale acquisition target with reconditioning buffer
            </p>
          </div>
        </div>

        {/* Condition & Screening Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1 print:border-slate-300">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Overall Condition</span>
            <div className="font-bold text-white print:text-black mt-0.5">
              {evaluation.conditionStatus}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1 print:border-slate-300">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Flood / Water Screening</span>
            <div className="font-bold text-white print:text-black mt-0.5">
              {evaluation.conditionScore?.floodRiskCategory || 'LOW INDICATION'}
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1 print:border-slate-300">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Physical Inspection</span>
            <div className="font-bold text-amber-400 print:text-amber-800 mt-0.5">
              {evaluation.inspectionStatus}
            </div>
          </div>
        </div>

        {/* Visible Damage Summary */}
        <div className="space-y-2 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Visible Observations & Damage Notes ({evaluation.damageFindings?.length || 0})
          </span>
          {evaluation.damageFindings && evaluation.damageFindings.length > 0 ? (
            <div className="space-y-1.5">
              {evaluation.damageFindings.map((dmg, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start justify-between gap-3 print:border-slate-300"
                >
                  <div>
                    <span className="font-bold text-white print:text-black">{dmg.component}</span>
                    <p className="text-[11px] text-slate-300 print:text-slate-700 mt-0.5">{dmg.finding}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-semibold border border-amber-800 print:bg-amber-100 print:text-amber-900">
                    Requires physical verification
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-center">
              No visible structural or cosmetic panel defects detected during photographic scan.
            </div>
          )}
        </div>

        {/* Legal Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-800 print:border-slate-300 text-[10px] text-slate-400 leading-relaxed space-y-1">
          <p className="font-semibold text-slate-300 print:text-black">Terms & Disclaimer:</p>
          <p>
            This document represents an indicative wholesale evaluation generated by Sai Ram AutoAnalytics based on photographic evidence, instrument cluster reads, and RTO registration smartcard analysis. Photographs alone cannot determine hidden mechanical condition with certainty. Physical inspection verifies what photographs cannot.
          </p>
        </div>
      </div>

      {/* Contact Evaluator Modal */}
      {showContactModal && (
        <ContactEvaluatorModal
          evaluationId={evaluation.id}
          vehicleSummary={`${evaluation.year} ${evaluation.make} ${evaluation.model} ${evaluation.variant} (${evaluation.registrationNumber})`}
          onClose={() => setShowContactModal(false)}
          onRequestPhysicalInspection={() => {
            setShowContactModal(false);
            onRequestPhysicalInspection();
          }}
        />
      )}
    </div>
  );
};
