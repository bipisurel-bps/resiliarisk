import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  FileSpreadsheet, 
  Lock, 
  X,
  Award,
  Globe2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeroHeaderProps {
  onOpenNewRisk: () => void;
  onOpenAcademy: () => void;
  onOpenTemplates: () => void;
  onOpenReport: () => void;
  onOpenCertificateModal: () => void;
  onSwitchTab: (tab: 'dashboard' | 'rcsa' | 'kri' | 'academy') => void;
  totalRisks: number;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onOpenNewRisk,
  onOpenAcademy,
  onOpenTemplates,
  onOpenReport,
  onOpenCertificateModal,
  onSwitchTab,
  totalRisks,
}) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  return (
    <div className="relative mb-8 overflow-hidden rounded-b-[36px] sm:rounded-b-[48px] bg-gradient-to-b from-white via-[#FAF7F2] to-[#F1ECE1] border-b-2 border-stone-300 px-4 pt-6 pb-12 sm:px-8 shadow-xs">
      
      {/* Background Soft Ambient Light */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-8 right-1/3 translate-x-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center">
        
        {/* Top Tagline Pill & Verified Green Status */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          <button
            onClick={onOpenAcademy}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-300 text-slate-900 text-xs font-black shadow-2xs hover:border-blue-400 hover:text-blue-800 transition-all cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-700 group-hover:rotate-12 transition-transform" />
            <span>Resilia Risk Academy • Standar ISO 31000:2018</span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            <span className="text-blue-800 underline decoration-blue-400 underline-offset-2">
              Mulai Belajar &amp; Ujian →
            </span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-bold shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Terverifikasi Aman (Flag Hijau)</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 font-sans leading-tight">
          Pusat Belajar &amp; Praktik <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 bg-clip-text text-transparent">
            Manajemen Risiko ISO 31000 &amp; RCSA.
          </span>
        </h1>

        {/* Subtitle - High Contrast Slate-800 */}
        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-800 leading-relaxed mb-6 font-semibold">
          Kuasai konsep fundamental <em>Cause-Event-Impact</em>, simulasikan keputusan mitigasi industri, peroleh <strong>Sertifikat Kompetensi Resmi</strong>, dan terapkan langsung pada <strong>Kertas Kerja RCSA &amp; Heatmap 5x5 Dinamis</strong>.
        </p>

        {/* User Greeting Callout if authenticated */}
        {isAuthenticated && user && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-stone-300 shadow-xs mb-6 text-xs text-slate-900 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Selamat datang kembali, <strong>{user.name}</strong> ({user.institution})</span>
            {user.progress.certificateEarned && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-black text-[10px]">
                🏆 Certified
              </span>
            )}
          </div>
        )}

        {/* Main CTA Buttons - Focused on Academy, Register/Google, and RCSA */}
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-20">
          <button
            type="button"
            onClick={onOpenAcademy}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-black text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-700/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span>Mulai Belajar di Risk Academy</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {!isAuthenticated ? (
            <button
              type="button"
              onClick={openAuthModal}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-stone-50 border-2 border-stone-300 transition-all cursor-pointer shadow-xs hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Daftar / Masuk Akun</span>
            </button>
          ) : user?.progress.certificateEarned ? (
            <button
              type="button"
              onClick={onOpenCertificateModal}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-black text-amber-950 bg-amber-300 hover:bg-amber-400 border border-amber-400 transition-all cursor-pointer shadow-xs hover:scale-[1.02] active:scale-95"
            >
              <Award className="w-4 h-4 text-amber-900" />
              <span>Lihat Lembar Sertifikat</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSwitchTab('academy')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-emerald-950 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Klaim Sertifikat ISO 31000</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenNewRisk}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-stone-50 border border-stone-300 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95"
          >
            <span>+ Buat Lembar RCSA</span>
          </button>
        </div>

        {/* Interactive Feature Pills Strip - ALL HIGH CONTRAST */}
        <div className="mt-8 pt-6 border-t border-stone-300 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs font-bold">
          
          <button
            type="button"
            onClick={onOpenNewRisk}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-slate-900 hover:border-blue-500 hover:text-blue-900 hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-blue-700" />
            <span>Kalkulator Likelihood x Impact (1-25)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSwitchTab('dashboard');
              const el = document.getElementById('heatmap-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-slate-900 hover:border-blue-500 hover:text-blue-900 hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Heatmap 5x5 Dinamis</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-slate-900 hover:border-blue-500 hover:text-blue-900 hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-700" />
            <span>Cetak PDF Audit &amp; CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPrivacyNotice(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-slate-900 hover:border-blue-500 hover:text-blue-900 hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Akses Bebas dari Jaringan Kantor / Seluler</span>
          </button>

        </div>

      </div>

      {/* Privacy modal popup if clicked */}
      {showPrivacyNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-300 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  Status Jaringan &amp; Privasi Data
                </h3>
              </div>
              <button
                onClick={() => setShowPrivacyNotice(false)}
                className="p-1 rounded-lg text-slate-600 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-800 leading-relaxed font-medium mb-3">
              Resilia dirancang dengan enkripsi TLS 1.3 tingkat perbankan dan arsitektur <strong>Client-Side Isolated Storage</strong>. 
            </p>

            <ul className="text-xs text-slate-800 space-y-2 mb-4 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Flag Hijau:</strong> Aman diakses dari jaringan kantor (corporate intranet), jaringan kampus, maupun seluler tanpa terblokir.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>Zero Data Leakage:</strong> Seluruh draf penilaian RCSA dan data sensitif tetap tersimpan di browser Anda.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span><strong>ISO 27001 &amp; UU PDP Ready:</strong> Tidak mengirimkan data identitas risiko internal Anda ke server pihak ketiga.</span>
              </li>
            </ul>

            <button
              onClick={() => setShowPrivacyNotice(false)}
              className="w-full py-2.5 rounded-xl bg-blue-700 text-white text-xs font-black hover:bg-blue-800 cursor-pointer"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
