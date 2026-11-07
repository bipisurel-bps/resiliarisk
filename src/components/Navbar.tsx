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
  Moon
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
  theme,
  toggleTheme,
  totalRisks,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-3 py-3.5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <nav className="glass-pill rounded-2xl px-3.5 py-2.5 sm:px-5 flex items-center justify-between gap-3 transition-all duration-300">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-md shadow-blue-500/20 text-white">
              <ShieldAlert className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0b0f17]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                  Resilia
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30">
                  ISO 31000
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                Operational Risk &amp; RCSA Studio
              </p>
            </div>
          </div>

          {/* Navigation Pill Items */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-[#101723]/70 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80 dark:bg-blue-600 dark:text-white dark:border-transparent'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard &amp; Heatmap</span>
            </button>

            <button
              onClick={() => setActiveTab('rcsa')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'rcsa'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80 dark:bg-blue-600 dark:text-white dark:border-transparent'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>RCSA Register</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono">
                {totalRisks}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kri')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'kri'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80 dark:bg-blue-600 dark:text-white dark:border-transparent'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>KRI Monitor</span>
            </button>

            <button
              onClick={() => setActiveTab('academy')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'academy'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80 dark:bg-blue-600 dark:text-white dark:border-transparent'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30 transition-all cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden sm:inline">Template</span>
            </button>

            <button
              onClick={onOpenReport}
              title="Laporan Eksekutif & Ekspor"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100/90 hover:bg-slate-200 border border-slate-200/80 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span className="hidden lg:inline">Laporan</span>
            </button>

            <button
              onClick={onOpenNewRisk}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Risiko</span>
            </button>

            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 border border-slate-200/80 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:border-slate-700/60 transition-all cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Bar Sub-strip */}
        <div className="flex md:hidden items-center justify-around gap-1 mt-2 p-1 rounded-xl bg-white/90 dark:bg-[#131b26]/90 border border-slate-200 dark:border-slate-800 text-[11px] shadow-sm">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 text-center font-semibold rounded-lg transition-all ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('rcsa')}
            className={`flex-1 py-1.5 text-center font-semibold rounded-lg transition-all ${
              activeTab === 'rcsa' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            RCSA ({totalRisks})
          </button>
          <button
            onClick={() => setActiveTab('kri')}
            className={`flex-1 py-1.5 text-center font-semibold rounded-lg transition-all ${
              activeTab === 'kri' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            KRI
          </button>
          <button
            onClick={() => setActiveTab('academy')}
            className={`flex-1 py-1.5 text-center font-semibold rounded-lg transition-all ${
              activeTab === 'academy' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Belajar MR
          </button>
        </div>
      </div>
    </header>
  );
};
