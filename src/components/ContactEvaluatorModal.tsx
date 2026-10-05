import React from 'react';
import { X, Phone, MessageSquare, ShieldCheck, MapPin, UserCheck } from 'lucide-react';
import { TrustedEvaluatorConfig } from '../types';

interface ContactEvaluatorModalProps {
  isOpen?: boolean;
  onClose: () => void;
  evaluationId?: string;
  vehicleSummary?: string;
  onRequestInspection?: () => void;
  onRequestPhysicalInspection?: () => void;
  trustedEvaluator?: TrustedEvaluatorConfig;
}

export const ContactEvaluatorModal: React.FC<ContactEvaluatorModalProps> = ({
  isOpen = true,
  onClose,
  evaluationId,
  vehicleSummary,
  onRequestInspection,
  onRequestPhysicalInspection,
  trustedEvaluator,
}) => {
  if (isOpen === false) return null;

  const onInspectAction = onRequestPhysicalInspection || onRequestInspection;

  const evaluatorName = trustedEvaluator?.name || 'T. SURESH';
  const role = trustedEvaluator?.role || 'SENIOR MOST SECOND AND CAR EVALUATOR';
  const location = trustedEvaluator?.location || 'Hyderabad, Telangana';
  const phone = trustedEvaluator?.phone || '9951696943';
  const whatsapp = trustedEvaluator?.whatsapp || '9951696943';
  const status = trustedEvaluator?.status || 'TRUSTED EVALUATOR';

  const cleanPhone = phone.replace(/\D/g, '');
  const cleanWhatsapp = whatsapp.replace(/\D/g, '');
  const dynamicEvalId = evaluationId && evaluationId.trim() !== '' ? evaluationId : 'PENDING';
  const whatsappMessage = encodeURIComponent(
    `Hello, I would like to request a physical inspection for a vehicle evaluated through Sai Ram AutoAnalytics. Evaluation ID: ${dynamicEvalId}.`
  );
  const whatsappUrl = `https://wa.me/91${cleanWhatsapp.slice(-10)}?text=${whatsappMessage}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              Direct Assessor Contact
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              TRUSTED VEHICLE EVALUATOR
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evaluator Identity Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-black text-white font-display tracking-wide">{evaluatorName}</h4>
              <p className="text-xs text-slate-300 font-semibold">{role}</p>
              <p className="text-[11px] text-slate-400">Primary Evaluator for Sai Ram AutoAnalytics</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 text-[11px]">
              ✓ {status}
            </span>
            <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
              <MapPin className="w-3 h-3 text-slate-500" />
              {location}
            </span>
          </div>

          {evaluationId && (
            <div className="text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
              Evaluation Reference: <span className="font-mono text-blue-400 font-bold">{evaluationId}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* CALL EVALUATOR */}
          <a
            href={`tel:${cleanPhone.slice(-10)}`}
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition border border-blue-400/30"
          >
            <Phone className="w-4 h-4" />
            <span>CALL EVALUATOR</span>
          </a>

          {/* WHATSAPP EVALUATOR */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg transition border border-emerald-500/40"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WHATSAPP EVALUATOR</span>
          </a>

          {/* REQUEST PHYSICAL INSPECTION */}
          {onInspectAction && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onInspectAction();
              }}
              className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>DISPATCH PHYSICAL INSPECTION</span>
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-500 text-center">
          Sai Ram AutoAnalytics verified contact gateway. Direct assessor dispatch available across Hyderabad & Telangana.
        </p>
      </div>
    </div>
  );
};
