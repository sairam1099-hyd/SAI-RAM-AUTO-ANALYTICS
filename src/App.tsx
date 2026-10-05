import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { EvaluateFlow } from './components/EvaluateFlow';
import { VehicleHistoryView } from './components/VehicleHistoryView';
import { MarketPricesView } from './components/MarketPricesView';
import { InspectionsView } from './components/InspectionsView';
import { ManagersView } from './components/ManagersView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { InspectionRequestModal } from './components/InspectionRequestModal';
import {
  EvaluationRecord,
  InspectionRequest,
  InspectionManager,
  DealershipSettings,
  ValuationOverrideLog,
  UserRole,
  VehicleDetails,
} from './types';
import { Car, MapPin, ShieldCheck, Phone, Mail, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [userRole, setUserRole] = useState<UserRole>('USER / DEALER');
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [inspections, setInspections] = useState<InspectionRequest[]>([]);
  const [managers, setManagers] = useState<InspectionManager[]>([
    {
      id: 'mgr-01',
      name: 'PRIMARY TRUSTED PHYSICAL EVALUATOR',
      role: 'Authorized Automotive Technical Assessor',
      city: 'Hyderabad',
      phone: '[TRUSTED_EVALUATOR_NUMBER]',
      email: 'evaluator@sairamauto.in',
      specialisations: [
        'Paint Depth Gauge Micrometer Scan',
        'Hydraulic Hoist Sealant Audit',
        'Pillar Spot-Weld Verification',
        'OBD-II ECU Error Diagnostic',
      ],
      completedInspections: 0,
      isVerified: true,
      experienceYears: 12,
    },
  ]);
  const [settings, setSettings] = useState<DealershipSettings>({
    businessName: 'Sai Ram Automotive Services LLP',
    tradeName: 'Sai Ram AutoAnalytics',
    gstin: '36AAACS4821M1ZH',
    dealerPrincipal: 'Raghavendra K. (Managing Partner)',
    address: 'Plot 42, Road No. 36, Jubilee Hills / Gachibowli Outer Ring Hub, Hyderabad, Telangana 500033',
    phone: '+91 98490 28410',
    email: 'procurement@sairamauto.in',
    defaultMarginPercent: 9.5,
    panelRefinishingCostINR: 6500,
    floodRiskBufferPercent: 6.5,
    baselineAnnualKm: 12500,
  });
  const [overrideLogs, setOverrideLogs] = useState<ValuationOverrideLog[]>([
    {
      id: 'OVR-101',
      evaluationId: 'EV-2026-0891',
      registrationNumber: 'TS 09 EA 4821',
      originalEstimate: 1320000,
      newEstimate: 1355000,
      reason: 'Pristine authorized single-owner Hyundai service history verified via Dealer Management System; customer exchanging for new Alcazar.',
      author: 'Raghavendra K. (Dealer Principal)',
      timestamp: '2026-09-18 16:45',
    },
  ]);

  // Selected vehicle for full report view
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationRecord | null>(null);

  // Inspection modal state
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState<boolean>(false);
  const [inspectionModalPrefill, setInspectionModalPrefill] = useState<Partial<EvaluationRecord> | null>(null);
  const [selectedManagerForInspection, setSelectedManagerForInspection] = useState<InspectionManager | null>(null);

  // Load initial dataset from backend API
  useEffect(() => {
    async function loadData() {
      try {
        const [evalsRes, inspsRes, mgrsRes, setsRes, logsRes] = await Promise.allSettled([
          fetch('/api/evaluations').then((r) => r.json()),
          fetch('/api/inspections').then((r) => r.json()),
          fetch('/api/managers').then((r) => r.json()),
          fetch('/api/settings').then((r) => r.json()),
          fetch('/api/override-logs').then((r) => r.json()),
        ]);

        if (evalsRes.status === 'fulfilled') {
          const list = Array.isArray(evalsRes.value)
            ? evalsRes.value
            : evalsRes.value?.evaluations || [];
          if (list.length > 0) {
            setEvaluations(list);
            setSelectedEvaluation(list[0]);
          }
        }
        if (inspsRes.status === 'fulfilled') {
          const list = Array.isArray(inspsRes.value)
            ? inspsRes.value
            : inspsRes.value?.requests || [];
          if (list.length > 0) {
            setInspections(list);
          }
        }
        if (mgrsRes.status === 'fulfilled') {
          const list = Array.isArray(mgrsRes.value)
            ? mgrsRes.value
            : mgrsRes.value?.managers || [];
          if (list.length > 0) {
            setManagers(list);
          }
        }
        if (setsRes.status === 'fulfilled' && setsRes.value) {
          const val = setsRes.value.settings || setsRes.value;
          if (val && val.businessProfile) {
            setSettings({
              businessName: val.businessProfile.registeredEntity || 'Sai Ram Automotive Services LLP',
              tradeName: val.businessProfile.companyName || 'Sai Ram AutoAnalytics',
              gstin: val.businessProfile.gstin || '36AAACS4821M1ZH',
              dealerPrincipal: val.businessProfile.ownerName || 'Raghavendra K. (Managing Partner)',
              address: val.businessProfile.address || 'Plot 42, Road No. 36, Jubilee Hills, Hyderabad',
              phone: val.businessProfile.phone || '+91 98490 28410',
              email: val.businessProfile.email || 'procurement@sairamauto.in',
              defaultMarginPercent: val.valuationRules?.dealerMarginTargetPercent || 9.5,
              panelRefinishingCostINR: val.valuationRules?.paintPanelRefinishCostINR || 6500,
              floodRiskBufferPercent: val.valuationRules?.waterExposureBufferPercent || 6.5,
              baselineAnnualKm: 12500,
            });
          }
        }
        if (logsRes.status === 'fulfilled') {
          const list = Array.isArray(logsRes.value) ? logsRes.value : [];
          if (list.length > 0) setOverrideLogs(list);
        }
      } catch (err) {
        console.warn('API data loaded with local automotive fallbacks');
      }
    }
    loadData();
  }, []);

  const [evaluationPrefill, setEvaluationPrefill] = useState<Partial<VehicleDetails> | null>(null);

  // Handler to open new evaluation flow
  const handleOpenNewEvaluation = (prefill?: Partial<VehicleDetails>) => {
    setEvaluationPrefill(prefill || null);
    setCurrentTab('evaluate');
  };

  // Handler when evaluation is completed
  const handleCompleteEvaluation = (newRecord: EvaluationRecord) => {
    setEvaluations((prev) => [newRecord, ...prev]);
    setSelectedEvaluation(newRecord);
    setCurrentTab('reports');

    // Post to server
    fetch('/api/evaluations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    }).catch((e) => console.warn('Failed to sync evaluation to server', e));
  };

  // Handler to view evaluation report
  const handleSelectEvaluation = (record: EvaluationRecord) => {
    setSelectedEvaluation(record);
    setCurrentTab('reports');
  };

  // Handler to initiate an inspection request
  const handleRequestInspection = (record?: Partial<EvaluationRecord>, manager?: InspectionManager) => {
    setInspectionModalPrefill(record || null);
    setSelectedManagerForInspection(manager || null);
    setIsInspectionModalOpen(true);
  };

  // Handler when an inspection is dispatched
  const handleSubmitInspection = (newRequest: InspectionRequest) => {
    setInspections((prev) => {
      const idx = prev.findIndex((item) => item.id === newRequest.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = newRequest;
        return next;
      }
      return [newRequest, ...prev];
    });

    // Update the corresponding evaluation's inspectionStatus
    if (newRequest.registrationNumber) {
      setEvaluations((prev) =>
        prev.map((e) =>
          e.registrationNumber.toUpperCase() === newRequest.registrationNumber.toUpperCase()
            ? { ...e, inspectionStatus: 'Scheduled' }
            : e
        )
      );
    }
  };

  const handleUpdateInspection = (updated: InspectionRequest) => {
    setInspections((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  // Handler to save settings
  const handleSaveSettings = (updated: DealershipSettings) => {
    setSettings(updated);
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch((e) => console.warn('Failed to sync settings to server', e));
  };

  // Handler to add manager
  const handleAddManager = (newManager: InspectionManager) => {
    setManagers((prev) => [...prev, newManager]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenNewEvaluation={handleOpenNewEvaluation}
        recentEvaluations={evaluations}
        onSelectEvaluation={handleSelectEvaluation}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            evaluations={evaluations}
            onStartEvaluation={handleOpenNewEvaluation}
            onViewHistory={() => setCurrentTab('history')}
            onSelectEvaluation={handleSelectEvaluation}
            onRequestInspection={(rec) => handleRequestInspection(rec)}
          />
        )}

        {currentTab === 'evaluate' && (
          <EvaluateFlow
            initialPrefill={evaluationPrefill}
            onComplete={handleCompleteEvaluation}
            onCancel={() => {
              setEvaluationPrefill(null);
              setCurrentTab('dashboard');
            }}
            onRequestInspection={(rec) => handleRequestInspection(rec)}
            userRole={userRole}
          />
        )}

        {currentTab === 'history' && (
          <VehicleHistoryView
            evaluations={evaluations}
            onSelectEvaluation={handleSelectEvaluation}
            onRequestInspection={(rec) => handleRequestInspection(rec)}
            onOpenNewEvaluation={handleOpenNewEvaluation}
          />
        )}

        {currentTab === 'market-prices' && (
          <MarketPricesView onStartFullEvaluation={handleOpenNewEvaluation} />
        )}

        {currentTab === 'inspections' && (
          <InspectionsView
            inspections={inspections}
            managers={managers}
            onOpenNewInspectionRequest={() => handleRequestInspection()}
            onUpdateInspection={handleUpdateInspection}
            trustedEvaluator={settings.trustedEvaluator}
          />
        )}

        {currentTab === 'managers' && (
          <ManagersView
            managers={managers}
            onRequestInspection={(mgr) => handleRequestInspection(undefined, mgr)}
            onAddManager={handleAddManager}
            userRole={userRole}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            evaluation={selectedEvaluation}
            onBackToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            settings={settings}
            overrideLogs={overrideLogs}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </main>

      {/* Reusable Inspection Dispatch Modal */}
      <InspectionRequestModal
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        prefillRecord={inspectionModalPrefill}
        selectedManager={selectedManagerForInspection}
        managers={managers}
        onSubmit={handleSubmitInspection}
        trustedEvaluator={settings.trustedEvaluator}
      />

      {/* Professional Dealer Footer (Hidden on Print) */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-400 font-black">
                SR
              </div>
              <div>
                <div className="font-extrabold text-white text-sm font-display tracking-wider">
                  SAI RAM AUTOANALYTICS
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  Know the Car. Know the Value. • Indian Used-Car Dealer Procurement Terminal
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="hover:text-white transition"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleOpenNewEvaluation()}
                className="hover:text-white transition"
              >
                Evaluate Car
              </button>
              <button
                onClick={() => setCurrentTab('history')}
                className="hover:text-white transition"
              >
                Vehicle History
              </button>
              <button
                onClick={() => setCurrentTab('market-prices')}
                className="hover:text-white transition"
              >
                Market Prices
              </button>
              <button
                onClick={() => setCurrentTab('settings')}
                className="hover:text-white transition"
              >
                Settings
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © {new Date().getFullYear()} Sai Ram Automotive Services LLP. All rights reserved. Registered Dealer Hub: Jubilee Hills, Hyderabad (TS RTO).
            </div>
            <div className="flex items-center gap-4">
              <span>GSTIN: 36AAACS4821M1ZH</span>
              <span>•</span>
              <span>Helpline: +91 98490 28410</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Analysis Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
