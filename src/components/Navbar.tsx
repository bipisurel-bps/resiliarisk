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
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { UserProfileMenu } from './UserProfileMenu';

interface NavbarProps {
  activeTab: 'dashboard' | 'rcsa' | 'kri' | 'academy';
  setActiveTab: (tab: 'dashboard' | 'rcsa' | 'kri' | 'academy') => void;
  onOpenNewRisk: () => void;
  onOpenReport: () => void;
  onOpenTemplates: () => void;
  onOpenCertificateModal: () => void;
  totalRisks: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRisk,
  onOpenReport,
  onOpenTemplates,
  onOpenCertificateModal,
  totalRisks,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full px-2 sm:px-6 py-2.5 pointer-events-none">
      <div className="mx-auto max-w-7xl">
        <nav className="glass-pill rounded-2xl px-3 py-2 sm:px-5 sm:py-2.5 flex items-center justify-between gap-2.5 pointer-events-auto shadow-sm border border-stone-300">
          
          {/* Brand Logo & Security Green Flag Indicator */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setActiveTab('academy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 shrink-0 text-left cursor-pointer group"
              title="Kembali ke Beranda / Academy"
            >
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 shadow-md shadow-blue-700/25 text-white group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" title="Sistem Aktif & Terverifikasi" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-sans group-hover:text-blue-800 transition-colors">
                    Resilia
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                    ISO 31000
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 hidden sm:block font-bold">
                  Risk Academy &amp; RCSA Studio
                </p>
              </div>
            </button>

            {/* Verified Green Flag Pill */}
            <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-[11px] font-bold text-emerald-900" title="Koneksi Aman TLS 1.3 Terverifikasi">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Flag Hijau: Aman &amp; Publik</span>
            </div>
          </div>

          {/* Navigation Pill Items (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-300">
            {/* Prominent Risk Academy First */}
            <button
              onClick={() => setActiveTab('academy')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                activeTab === 'academy'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-slate-900 hover:text-blue-800 hover:bg-stone-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>🎓 Belajar MR (Academy)</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-900 shadow-xs border border-stone-300 font-black'
                  : 'text-slate-800 hover:text-slate-900 hover:bg-stone-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-700" />
              <span>Heatmap 5x5</span>
            </button>

            <button
              onClick={() => setActiveTab('rcsa')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'rcsa'
                  ? 'bg-white text-blue-900 shadow-xs border border-stone-300 font-black'
                  : 'text-slate-800 hover:text-slate-900 hover:bg-stone-200'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5 text-blue-700" />
              <span>Kertas Kerja RCSA</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-slate-900 font-mono font-bold">
                {totalRisks}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kri')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'kri'
                  ? 'bg-white text-blue-900 shadow-xs border border-stone-300 font-black'
                  : 'text-slate-800 hover:text-slate-900 hover:bg-stone-200'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 text-blue-700" />
              <span>KRI Monitor</span>
            </button>
          </div>

          {/* Action Buttons & User Menu Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTemplates}
              title="Muat Contoh Skenario Industri"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Template</span>
            </button>

            <button
              onClick={onOpenReport}
              title="Laporan Eksekutif & Ekspor"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-800" />
              <span className="hidden sm:inline">Laporan</span>
            </button>

            <button
              onClick={onOpenNewRisk}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 shadow-sm shadow-blue-700/25 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden xs:inline">+ RCSA</span>
            </button>

            {/* Google OAuth & User Profile Menu */}
            <UserProfileMenu 
              onOpenCertificate={onOpenCertificateModal}
              onOpenAcademy={() => {
                setActiveTab('academy');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        </nav>

        {/* Mobile Navigation Sub-bar */}
        <div className="flex md:hidden items-center justify-around gap-1 mt-2 p-1 rounded-xl bg-white border border-stone-300 text-xs shadow-sm pointer-events-auto font-bold">
          <button
            onClick={() => setActiveTab('academy')}
            className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer ${
              activeTab === 'academy' ? 'bg-blue-700 text-white font-black shadow-xs' : 'text-slate-800'
            }`}
          >
            🎓 Belajar
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-blue-700 text-white font-black shadow-xs' : 'text-slate-800'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setActiveTab('rcsa')}
            className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer ${
              activeTab === 'rcsa' ? 'bg-blue-700 text-white font-black shadow-xs' : 'text-slate-800'
            }`}
          >
            RCSA ({totalRisks})
          </button>
          <button
            onClick={() => setActiveTab('kri')}
            className={`flex-1 py-1.5 text-center rounded-lg transition-all cursor-pointer ${
              activeTab === 'kri' ? 'bg-blue-700 text-white font-black shadow-xs' : 'text-slate-800'
            }`}
          >
            KRI
          </button>
        </div>
      </div>
    </header>
  );
};
