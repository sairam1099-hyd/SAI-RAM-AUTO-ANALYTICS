import React, { useState } from 'react';
import {
  UserCheck,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  MapPin,
  Award,
  PlusCircle,
  X,
  Wrench,
  Car,
  Lock,
  Info,
} from 'lucide-react';
import { InspectionManager, UserRole } from '../types';

interface ManagersViewProps {
  managers: InspectionManager[];
  onRequestInspection: (manager?: InspectionManager) => void;
  onAddManager: (newManager: InspectionManager) => void;
  userRole?: UserRole;
}

export const ManagersView: React.FC<ManagersViewProps> = ({
  managers,
  onRequestInspection,
  onAddManager,
  userRole = 'USER / DEALER',
}) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newManager, setNewManager] = useState<Partial<InspectionManager>>({
    name: '',
    role: 'Automotive Technical Inspector',
    city: 'Hyderabad',
    phone: '',
    email: '',
    specialisations: ['Paint Gauge Scan', 'Underbody Hoist Check'],
    experienceYears: 5,
    isVerified: true,
  });

  const handleSaveManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManager.name) return;

    const created: InspectionManager = {
      id: `mgr-${Date.now()}`,
      name: newManager.name,
      role: newManager.role || 'Senior Technical Inspector',
      city: newManager.city || 'Hyderabad',
      phone: newManager.phone || '[TRUSTED_EVALUATOR_NUMBER]',
      email: newManager.email || `${newManager.name.toLowerCase().replace(/\s+/g, '.')}@sairamauto.in`,
      specialisations: newManager.specialisations || ['Paint Depth Gauge', 'OBD Scanner'],
      completedInspections: 0,
      isVerified: true,
    };

    onAddManager(created);
    setAddModalOpen(false);
  };

  const isAdmin = userRole === 'ADMIN / OWNER';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Physical Inspection Authority
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5 font-display">
            Physical Inspection Evaluators
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 max-w-3xl">
            Authorized automotive technical evaluators designated to perform on-site body micrometer scans, lift inspections, and ECU diagnostics. Contact details are secured per privacy policy.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Configure Evaluator</span>
          </button>
        )}
      </div>

      {/* Security notice */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3 text-xs text-slate-300">
        <Lock className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Privacy & Access Protection:</span> Evaluator contact details are protected in business settings. Public phone numbers are masked. Direct communication and dispatch are managed through the evaluation terminal.
        </div>
      </div>

      {/* Managers Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {managers.map((mgr) => (
          <div
            key={mgr.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
          >
            <div>
              {/* Profile Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center font-bold text-blue-300 text-sm">
                    {mgr.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white text-sm">{mgr.name}</h3>
                      {mgr.isVerified && (
                        <span title="Authorized Evaluator">
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-blue-400 font-medium">{mgr.role}</p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{mgr.city} Hub</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Profile Details */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 py-1 border-y border-slate-800/80">
                  <span>Inspection History:</span>
                  <span className="font-semibold text-slate-200">
                    {mgr.completedInspections && mgr.completedInspections > 0
                      ? `${mgr.completedInspections} Audits Completed`
                      : 'No inspection history yet'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 py-1 border-b border-slate-800/80">
                  <span>Authorized Contact:</span>
                  <span className="font-mono text-slate-300 text-[11px]">
                    {isAdmin && mgr.phone && mgr.phone !== '[TRUSTED_EVALUATOR_NUMBER]'
                      ? mgr.phone
                      : '[TRUSTED_EVALUATOR_NUMBER]'}
                  </span>
                </div>

                {/* Core Specialisations */}
                <div className="pt-2">
                  <div className="text-[11px] text-slate-400 font-semibold mb-1">
                    Technical Scope:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {mgr.specialisations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onRequestInspection(mgr)}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition text-center"
              >
                Dispatch Physical Inspection
              </button>
            </div>
          </div>
        ))}

        {/* If only primary evaluator exists, show clean placeholder */}
        {managers.length === 1 && (
          <div className="bg-slate-950 border border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
            <UserCheck className="w-8 h-8 text-slate-600" />
            <h4 className="text-xs font-bold text-slate-300">
              No additional evaluators configured
            </h4>
            <p className="text-[11px] text-slate-500 max-w-xs">
              All physical inspections are routed to the Primary Trusted Physical Evaluator.
            </p>
          </div>
        )}
      </div>

      {/* Add Manager Modal for Admin */}
      {addModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Configure Evaluator</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManager} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Evaluator Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={newManager.name}
                  onChange={(e) => setNewManager({ ...newManager, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Role Title</label>
                <input
                  type="text"
                  value={newManager.role}
                  onChange={(e) => setNewManager({ ...newManager, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">City Hub</label>
                <input
                  type="text"
                  value={newManager.city}
                  onChange={(e) => setNewManager({ ...newManager, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Protected Contact Number</label>
                <input
                  type="text"
                  placeholder="[TRUSTED_EVALUATOR_NUMBER] or +91..."
                  value={newManager.phone}
                  onChange={(e) => setNewManager({ ...newManager, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Evaluator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
