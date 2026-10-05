import React, { useState } from 'react';
import {
  Settings,
  Building,
  Sliders,
  History,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Shield,
  PlusCircle,
  UserCheck,
  Phone,
  MessageSquare,
  MapPin,
} from 'lucide-react';
import { DealershipSettings, ValuationOverrideLog } from '../types';
import { formatINR } from '../utils/valuationEngine';

interface SettingsViewProps {
  settings: DealershipSettings;
  overrideLogs: ValuationOverrideLog[];
  onSaveSettings: (settings: DealershipSettings) => void;
  onAddOverrideLog?: (log: ValuationOverrideLog) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings: initialSettings,
  overrideLogs: initialLogs,
  onSaveSettings,
}) => {
  const [settings, setSettings] = useState<DealershipSettings>(initialSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Manual Override Form State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [newOverride, setNewOverride] = useState({
    registrationNumber: '',
    originalEstimate: 0,
    newEstimate: 0,
    reason: '',
    author: 'Dealer Principal (Sai Ram AutoAnalytics)',
  });
  const [overrideLogs, setOverrideLogs] = useState<ValuationOverrideLog[]>(initialLogs);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCreateOverride = (e: React.FormEvent) => {
    e.preventDefault();
    const log: ValuationOverrideLog = {
      id: `OVR-${Date.now()}`,
      evaluationId: `EV-MANUAL`,
      registrationNumber: newOverride.registrationNumber.toUpperCase(),
      originalEstimate: Number(newOverride.originalEstimate),
      newEstimate: Number(newOverride.newEstimate),
      reason: newOverride.reason,
      author: newOverride.author,
      timestamp: new Date().toLocaleString('en-IN'),
    };
    setOverrideLogs([log, ...overrideLogs]);
    setShowOverrideModal(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            System Administration
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5 font-display">
            Dealership Profile & Valuation Tuning
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure dealership business credentials, profit margins, reconditioning allowances, and audit manual overrides
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved Successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* BUSINESS DETAILS SECTION */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">01. Dealership Business Profile</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Registered Business Entity</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Trade Brand Name</label>
              <input
                type="text"
                value={settings.tradeName}
                onChange={(e) => setSettings({ ...settings, tradeName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Goods & Services Tax (GSTIN)</label>
              <input
                type="text"
                value={settings.gstin}
                onChange={(e) => setSettings({ ...settings, gstin: e.target.value.toUpperCase() })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Dealer Principal In-Charge</label>
              <input
                type="text"
                value={settings.dealerPrincipal}
                onChange={(e) => setSettings({ ...settings, dealerPrincipal: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Support Helpline</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Procurement Desk Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Yard Address / Physical Hub</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* VALUATION ENGINE PARAMETERS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">02. Valuation Algorithm Calibration</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Target Dealer Buy Margin (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.defaultMarginPercent}
                onChange={(e) => setSettings({ ...settings, defaultMarginPercent: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Typical Indian used-car dealer margin: 8-11%</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Panel Repaint Outlay (₹)
              </label>
              <input
                type="number"
                value={settings.panelRefinishingCostINR}
                onChange={(e) => setSettings({ ...settings, panelRefinishingCostINR: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Booth bake paint cost per flagged panel</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Flood Risk Buffer (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={settings.floodRiskBufferPercent}
                onChange={(e) => setSettings({ ...settings, floodRiskBufferPercent: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Protective discount if water markers detected</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Expected Annual Mileage
              </label>
              <input
                type="number"
                value={settings.baselineAnnualKm}
                onChange={(e) => setSettings({ ...settings, baselineAnnualKm: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Benchmark: 12,500 km/year in Indian metros</span>
            </div>
          </div>
        </div>

        {/* TRUSTED EVALUATOR CONFIGURATION */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <div>
                <h2 className="text-base font-bold text-white">03. Primary Trusted Evaluator Configuration</h2>
                <p className="text-xs text-slate-400">Designate the certified physical vehicle assessor for on-site inspection dispatches and customer inquiries</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 text-[11px]">
              ✓ {settings.trustedEvaluator?.status || 'TRUSTED EVALUATOR'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Evaluator Full Name</label>
              <input
                type="text"
                value={settings.trustedEvaluator?.name || 'T. SURESH'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    trustedEvaluator: {
                      ...(settings.trustedEvaluator || {
                        name: 'T. SURESH',
                        role: 'SENIOR MOST SECOND AND CAR EVALUATOR',
                        phone: '9951696943',
                        whatsapp: '9951696943',
                        location: 'Hyderabad, Telangana',
                        status: 'TRUSTED EVALUATOR',
                        experience: '18+ Years Physical Inspection Experience',
                        isPrimary: true,
                      }),
                      name: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Professional Title / Role</label>
              <input
                type="text"
                value={settings.trustedEvaluator?.role || 'SENIOR MOST SECOND AND CAR EVALUATOR'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    trustedEvaluator: {
                      ...(settings.trustedEvaluator || {
                        name: 'T. SURESH',
                        role: 'SENIOR MOST SECOND AND CAR EVALUATOR',
                        phone: '9951696943',
                        whatsapp: '9951696943',
                        location: 'Hyderabad, Telangana',
                        status: 'TRUSTED EVALUATOR',
                        experience: '18+ Years Physical Inspection Experience',
                        isPrimary: true,
                      }),
                      role: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Operating Region / Hub</label>
              <input
                type="text"
                value={settings.trustedEvaluator?.location || 'Hyderabad, Telangana'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    trustedEvaluator: {
                      ...(settings.trustedEvaluator || {
                        name: 'T. SURESH',
                        role: 'SENIOR MOST SECOND AND CAR EVALUATOR',
                        phone: '9951696943',
                        whatsapp: '9951696943',
                        location: 'Hyderabad, Telangana',
                        status: 'TRUSTED EVALUATOR',
                        experience: '18+ Years Physical Inspection Experience',
                        isPrimary: true,
                      }),
                      location: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assessor Calling Phone (tel:)</label>
              <input
                type="text"
                value={settings.trustedEvaluator?.phone || '9951696943'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    trustedEvaluator: {
                      ...(settings.trustedEvaluator || {
                        name: 'T. SURESH',
                        role: 'SENIOR MOST SECOND AND CAR EVALUATOR',
                        phone: '9951696943',
                        whatsapp: '9951696943',
                        location: 'Hyderabad, Telangana',
                        status: 'TRUSTED EVALUATOR',
                        experience: '18+ Years Physical Inspection Experience',
                        isPrimary: true,
                      }),
                      phone: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Stored securely for dialer actions (tel: link)</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Assessor WhatsApp Direct</label>
              <input
                type="text"
                value={settings.trustedEvaluator?.whatsapp || '9951696943'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    trustedEvaluator: {
                      ...(settings.trustedEvaluator || {
                        name: 'T. SURESH',
                        role: 'SENIOR MOST SECOND AND CAR EVALUATOR',
                        phone: '9951696943',
                        whatsapp: '9951696943',
                        location: 'Hyderabad, Telangana',
                        status: 'TRUSTED EVALUATOR',
                        experience: '18+ Years Physical Inspection Experience',
                        isPrimary: true,
                      }),
                      whatsapp: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Used to initiate direct WhatsApp inspection dispatch</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Status Badge Text</label>
              <input
                type="text"
                value={settings.trustedEvaluator?.status || 'TRUSTED EVALUATOR'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    trustedEvaluator: {
                      ...(settings.trustedEvaluator || {
                        name: 'T. SURESH',
                        role: 'SENIOR MOST SECOND AND CAR EVALUATOR',
                        phone: '9951696943',
                        whatsapp: '9951696943',
                        location: 'Hyderabad, Telangana',
                        status: 'TRUSTED EVALUATOR',
                        experience: '18+ Years Physical Inspection Experience',
                        isPrimary: true,
                      }),
                      status: e.target.value,
                    },
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white uppercase focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-400">
              <span className="font-semibold text-slate-200">Evaluator Contact Gateway:</span>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                Physical inspection dispatch destination: +91 {(settings.trustedEvaluator?.whatsapp || '9951696943').replace(/\D/g, '').slice(-10)} (T. Suresh)
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={`tel:${(settings.trustedEvaluator?.phone || '9951696943').replace(/\D/g, '').slice(-10)}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 text-[11px] font-semibold transition"
              >
                <Phone className="w-3 h-3" />
                <span>Test Call</span>
              </a>
              <a
                href={`https://wa.me/91${(settings.trustedEvaluator?.whatsapp || '9951696943').replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
                  'Test connection from Sai Ram AutoAnalytics Admin Terminal.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 text-[11px] font-semibold transition"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Test WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* 04. DIRECT WHATSAPP EVALUATOR AUTOMATION */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-white">04. Direct WhatsApp Evaluator Automation</h2>
                <p className="text-xs text-slate-400">
                  Zero-setup automated dispatch using evaluator T. Suresh's provided WhatsApp number
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border text-[11px] bg-emerald-950 text-emerald-300 border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>DIRECT AUTOMATION ACTIVE</span>
            </span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Target Evaluator Number:</span>
                <span className="text-white font-bold font-mono text-sm block mt-0.5">
                  +91 {(settings.trustedEvaluator?.whatsapp || '9951696943').replace(/\D/g, '').slice(-10)} (T. Suresh)
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Configured under Primary Trusted Evaluator profile above.
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] font-medium">Automation Architecture:</span>
                <span className="text-emerald-400 font-semibold block mt-0.5">
                  Zero ENV / Zero Meta Cloud API Requirements
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Generates pre-formatted 180-point vehicle inspection dossiers with customer and valuation details.
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <span className="text-slate-400 text-[11px]">Verify Evaluator Gateway:</span>
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/91${(settings.trustedEvaluator?.whatsapp || '9951696943').replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
                    'Verification ping from Sai Ram AutoAnalytics Admin Terminal. Evaluator WhatsApp dispatch operational.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Send Test Ping to T. Suresh</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>

      {/* VALUATION MANUAL OVERRIDE AUDIT LOGS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">05. Manual Valuation Override Audit Trail</h2>
              <p className="text-xs text-slate-400">Strict transparency tracking whenever the dealer principal modifies algorithmic appraisal prices</p>
            </div>
          </div>

          <button
            onClick={() => setShowOverrideModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-950 text-amber-300 text-xs font-semibold border border-amber-800 hover:bg-amber-900 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Record Manual Price Override</span>
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Override ID</th>
                <th className="py-2.5 px-3">Registration</th>
                <th className="py-2.5 px-3">System Estimate</th>
                <th className="py-2.5 px-3">New Agreed Price</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Authorized Justification</th>
                <th className="py-2.5 px-3">Author</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {overrideLogs.map((log) => {
                const diff = log.newEstimate - log.originalEstimate;
                return (
                  <tr key={log.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-3 font-mono text-blue-400 text-[11px] whitespace-nowrap">{log.id}</td>
                    <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">{log.registrationNumber}</td>
                    <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap">{formatINR(log.originalEstimate)}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400 whitespace-nowrap">{formatINR(log.newEstimate)}</td>
                    <td className="py-3 px-3 font-mono text-xs whitespace-nowrap">
                      <span className={diff >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {diff >= 0 ? `+${formatINR(diff)}` : formatINR(diff)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-sm leading-relaxed">{log.reason}</td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">{log.author}</td>
                    <td className="py-3 px-3 text-right font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD MANUAL OVERRIDE MODAL */}
      {showOverrideModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowOverrideModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Record Manual Price Override</h3>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOverride} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Registration Number</label>
                <input
                  type="text"
                  required
                  value={newOverride.registrationNumber}
                  onChange={(e) => setNewOverride({ ...newOverride, registrationNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">System Estimate (₹)</label>
                  <input
                    type="number"
                    required
                    value={newOverride.originalEstimate}
                    onChange={(e) => setNewOverride({ ...newOverride, originalEstimate: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">New Agreed Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newOverride.newEstimate}
                    onChange={(e) => setNewOverride({ ...newOverride, newEstimate: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason & Commercial Justification</label>
                <textarea
                  rows={3}
                  required
                  value={newOverride.reason}
                  onChange={(e) => setNewOverride({ ...newOverride, reason: e.target.value })}
                  placeholder="Explain why the algorithmic valuation was adjusted..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Authorizing Principal</label>
                <input
                  type="text"
                  required
                  value={newOverride.author}
                  onChange={(e) => setNewOverride({ ...newOverride, author: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
                >
                  Record to Audit Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
