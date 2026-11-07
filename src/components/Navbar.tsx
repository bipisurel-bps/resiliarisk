import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  TableProperties, 
  Gauge, 
  GraduationCap, 
  Plus, 
  FileDown, 
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'rcsa' | 'kri' | 'academy';
  setActiveTab: (tab: 'dashboard' | 'rcsa' | 'kri' | 'academy') => void;
  onOpenNewRisk: () => void;
  onOpenReport: () => void;
  onOpenTemplates: () => void;
  totalRisks: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRisk,
  onOpenReport,
  onOpenTemplates,
  totalRisks,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full px-3 py-3 sm:px-6 pointer-events-none">
      <div className="mx-auto max-w-7xl">
        <nav className="glass-pill rounded-2xl px-3.5 py-2.5 sm:px-5 flex items-center justify-between gap-3 pointer-events-auto shadow-sm">
          
          {/* Brand Logo - Clicking resets to dashboard */}
          <button 
            onClick={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 shrink-0 text-left cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 shadow-md shadow-blue-600/20 text-white group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-sans group-hover:text-blue-700 transition-colors">
                  Resilia
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  ISO 31000
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-semibold">
                Operational Risk &amp; RCSA Studio
              </p>
            </div>
          </button>

          {/* Navigation Pill Items (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-1 bg-stone-100/90 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-800 shadow-xs border border-stone-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
              <span>Dashboard &amp; Heatmap</span>
            </button>

            <button
              onClick={() => setActiveTab('rcsa')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rcsa'
                  ? 'bg-white text-blue-800 shadow-xs border border-stone-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5 text-blue-600" />
              <span>RCSA Register</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 font-mono font-bold">
                {totalRisks}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kri')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'kri'
                  ? 'bg-white text-blue-800 shadow-xs border border-stone-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 text-blue-600" />
              <span>KRI Monitor</span>
            </button>

            <button
              onClick={() => setActiveTab('academy')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'academy'
                  ? 'bg-white text-blue-800 shadow-xs border border-stone-200'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>Belajar MR</span>
            </button>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTemplates}
              title="Muat Template Industri"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Template</span>
            </button>

            <button
              onClick={onOpenReport}
              title="Laporan Eksekutif & Ekspor"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden lg:inline">Laporan</span>
            </button>

            <button
              onClick={onOpenNewRisk}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-white bg-blue-700 hover:bg-blue-800 shadow-sm shadow-blue-700/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Risiko</span>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Bar Sub-strip */}
        <div className="flex md:hidden items-center justify-around gap-1 mt-2 p-1 rounded-xl bg-white/95 border border-stone-200 text-[11px] shadow-sm pointer-events-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-700'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('rcsa')}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'rcsa' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-700'
            }`}
          >
            RCSA ({totalRisks})
          </button>
          <button
            onClick={() => setActiveTab('kri')}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'kri' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-700'
            }`}
          >
            KRI
          </button>
          <button
            onClick={() => setActiveTab('academy')}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'academy' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-700'
            }`}
          >
            Belajar MR
          </button>
        </div>
      </div>
    </header>
  );
};
