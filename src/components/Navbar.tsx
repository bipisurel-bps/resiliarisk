import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  TableProperties, 
  Gauge, 
  GraduationCap, 
  Plus, 
  FileDown, 
  Sparkles, 
  Sun, 
  Moon,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'rcsa' | 'kri' | 'academy';
  setActiveTab: (tab: 'dashboard' | 'rcsa' | 'kri' | 'academy') => void;
  onOpenNewRisk: () => void;
  onOpenReport: () => void;
  onOpenTemplates: () => void;
  onResetData: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  totalRisks: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRisk,
  onOpenReport,
  onOpenTemplates,
  onResetData,
  theme,
  toggleTheme,
  totalRisks,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-3 py-3 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <nav className="glass-pill rounded-2xl px-3 py-2.5 sm:px-5 flex items-center justify-between gap-3 transition-all duration-300">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 shadow-md shadow-blue-500/20 text-white">
              <ShieldAlert className="w-5 h-5 text-blue-200" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0b0f17] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white dark:text-white font-sans">
                  Resilia
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  ISO 31000
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Operational Risk &amp; RCSA Studio
              </p>
            </div>
          </div>

          {/* Navigation Pill Items */}
          <div className="hidden md:flex items-center gap-1 bg-[#101723]/70 dark:bg-[#101723]/70 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard &amp; Heatmap</span>
            </button>

            <button
              onClick={() => setActiveTab('rcsa')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'rcsa'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>RCSA Register</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {totalRisks}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kri')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'kri'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>KRI Monitor</span>
            </button>

            <button
              onClick={() => setActiveTab('academy')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'academy'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Belajar MR</span>
            </button>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTemplates}
              title="Muat Template Industri"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Template</span>
            </button>

            <button
              onClick={onOpenReport}
              title="Laporan Eksekutif & Ekspor"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Laporan</span>
            </button>

            <button
              onClick={onOpenNewRisk}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Risiko</span>
            </button>

            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Bar Sub-strip */}
        <div className="flex md:hidden items-center justify-around gap-1 mt-2 p-1 rounded-xl bg-[#131b26]/90 border border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 text-center font-medium rounded-lg transition-all ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('rcsa')}
            className={`flex-1 py-1.5 text-center font-medium rounded-lg transition-all ${
              activeTab === 'rcsa' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            RCSA ({totalRisks})
          </button>
          <button
            onClick={() => setActiveTab('kri')}
            className={`flex-1 py-1.5 text-center font-medium rounded-lg transition-all ${
              activeTab === 'kri' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            KRI
          </button>
          <button
            onClick={() => setActiveTab('academy')}
            className={`flex-1 py-1.5 text-center font-medium rounded-lg transition-all ${
              activeTab === 'academy' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            Belajar MR
          </button>
        </div>
      </div>
    </header>
  );
};
