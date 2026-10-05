import React, { useState } from 'react';
import {
  Car,
  LayoutDashboard,
  ClipboardCheck,
  History,
  TrendingUp,
  UserCheck,
  FileText,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { EvaluationRecord, UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenNewEvaluation: () => void;
  recentEvaluations: EvaluationRecord[];
  onSelectEvaluation: (ev: EvaluationRecord) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenNewEvaluation,
  recentEvaluations,
  onSelectEvaluation,
  userRole,
  setUserRole,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Search filtered results
  const searchResults = searchQuery.trim()
    ? recentEvaluations.filter(
        (e) =>
          e.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const alertCount = recentEvaluations.filter(
    (e) => e.conditionStatus === 'Damage Detected' || e.conditionStatus === 'Possible Flood Exposure'
  ).length;

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'evaluate', label: 'Evaluate Car', icon: ClipboardCheck },
    { id: 'history', label: 'Vehicle History', icon: History },
    { id: 'market-prices', label: 'Market Prices', icon: TrendingUp },
    { id: 'inspections', label: 'Inspections', icon: ShieldCheck },
    { id: 'managers', label: 'Evaluators', icon: UserCheck },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const roles: UserRole[] = ['USER / DEALER', 'EVALUATOR', 'ADMIN / OWNER'];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 no-print">
      {/* Top Utility Bar for Dealership Identity */}
      <div className="bg-slate-950 px-4 lg:px-8 py-1.5 text-xs text-slate-400 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Analysis Ready
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            Jubilee Hills / Gachibowli Hub, Hyderabad
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-blue-300 transition"
              title="Switch Active Access Role"
            >
              <span>Role: {userRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-1 z-50">
                <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-semibold">
                  Select User Role:
                </div>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition ${
                      userRole === r
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400 font-mono">GSTIN: 36AAACS4821M1ZH</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-700/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition">
              <Car className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold tracking-wider text-white text-base font-display">SAI RAM</span>
                <span className="text-xs font-semibold text-blue-400 tracking-wide uppercase">AutoAnalytics</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">Know the Car. Know the Value.</p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1 ml-4">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'evaluate') {
                      onOpenNewEvaluation();
                    } else {
                      setCurrentTab(item.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 text-xs border border-transparent hover:border-slate-700"
              title="Search Vehicle by Registration or Model"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden md:inline text-slate-400">Search vehicle...</span>
            </button>

            {searchOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-3 z-50">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter Reg No (e.g. TS 09, MH 02) or Model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-700 rounded-md pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="mt-2 max-h-60 overflow-y-auto space-y-1 divide-y divide-slate-800/60">
                  {searchResults.length > 0 ? (
                    searchResults.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onSelectEvaluation(e);
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="pt-2 pb-1.5 px-2 hover:bg-slate-800/80 rounded cursor-pointer transition flex items-center justify-between"
                      >
                        <div>
                          <div className="font-mono text-xs font-semibold text-blue-400">{e.registrationNumber}</div>
                          <div className="text-xs text-slate-200">{e.year} {e.make} {e.model}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-medium text-emerald-400">
                            ₹{(e.estimatedValueMin / 100000).toFixed(2)} - {(e.estimatedValueMax / 100000).toFixed(2)}L
                          </div>
                          <div className="text-[10px] text-slate-400">{e.conditionStatus}</div>
                        </div>
                      </div>
                    ))
                  ) : searchQuery.trim() ? (
                    <div className="py-4 text-center text-xs text-slate-400">
                      No vehicles matching "{searchQuery}"
                    </div>
                  ) : (
                    <div className="py-2 text-[11px] text-slate-400 text-center">
                      Type registration or model name to lookup valuation record
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Notifications / Risk Alerts */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition relative"
              title="Inspection Alerts"
            >
              <Bell className="w-4 h-4 text-slate-400" />
              {alertCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-white">Dealer Risk & Inspection Alerts</span>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                    {alertCount} Active
                  </span>
                </div>
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                  {recentEvaluations
                    .filter((e) => e.conditionStatus === 'Damage Detected' || e.conditionStatus === 'Possible Flood Exposure')
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectEvaluation(item);
                          setNotificationsOpen(false);
                        }}
                        className="p-2 bg-slate-950/60 rounded border border-slate-800/80 hover:border-slate-700 cursor-pointer transition"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{item.conditionStatus}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 font-mono">{item.registrationNumber} — {item.make} {item.model}</p>
                        <p className="text-[11px] text-slate-400 mt-1">Physical verification recommended before final purchase order.</p>
                      </div>
                    ))}
                  {alertCount === 0 && (
                    <div className="py-4 text-center text-xs text-slate-400">
                      No active damage or flood risk alerts in saved catalog.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick "+ Evaluate Vehicle" Primary CTA */}
          <button
            onClick={onOpenNewEvaluation}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition border border-blue-400/30"
          >
            <span>+ Evaluate Car</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'evaluate') {
                    onOpenNewEvaluation();
                  } else {
                    setCurrentTab(item.id);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
