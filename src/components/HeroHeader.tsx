import React, { useState } from 'react';
import { Sparkles, BookOpen, ArrowUpRight, CheckCircle2, ShieldCheck, Zap, FileSpreadsheet, Lock, X } from 'lucide-react';

interface HeroHeaderProps {
  onOpenNewRisk: () => void;
  onOpenAcademy: () => void;
  onOpenTemplates: () => void;
  onOpenReport: () => void;
  onSwitchTab: (tab: 'dashboard' | 'rcsa' | 'kri' | 'academy') => void;
  totalRisks: number;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onOpenNewRisk,
  onOpenAcademy,
  onOpenTemplates,
  onOpenReport,
  onSwitchTab,
}) => {
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);

  return (
    <div className="relative mb-8 overflow-hidden rounded-b-[36px] sm:rounded-b-[44px] bg-gradient-to-b from-white via-[#FAF7F2] to-[#F3EFE8] border-b border-stone-200 px-4 pt-6 pb-12 sm:px-8 shadow-xs">
      
      {/* Background Soft Ambient Light */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-8 right-1/3 translate-x-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center">
        
        {/* Top Tagline Pill - Clickable to open Academy */}
        <button
          onClick={onOpenAcademy}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 text-slate-800 text-xs font-bold mb-5 shadow-2xs hover:border-blue-300 hover:text-blue-700 transition-all cursor-pointer group"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 group-hover:rotate-12 transition-transform" />
          <span>ISO 31000:2018 Standard &amp; Three Lines Model</span>
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className="text-blue-700 font-semibold underline decoration-blue-300 underline-offset-2">
            Buka Panduan MR →
          </span>
        </button>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 font-sans leading-tight">
          Kendalikan Risiko Operasional <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 bg-clip-text text-transparent">
            Sebelum Menjadi Kerugian Finansial.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-700 leading-relaxed mb-7 font-medium">
          Platform SaaS interaktif untuk mengidentifikasi <em>Cause-Event-Impact</em>, memetakan risiko inheren vs residual pada <strong>Heatmap 5x5 dinamis</strong>, dan memantau indikator <strong>KRI</strong> secara mandiri.
        </p>

        {/* Main CTA Buttons - 100% Clickable with Tactile Hover */}
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-20">
          <button
            type="button"
            onClick={onOpenNewRisk}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-700/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <span>+ Buat Lembar RCSA</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={onOpenTemplates}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Load Template Industri</span>
          </button>

          <button
            type="button"
            onClick={onOpenAcademy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-800 bg-white hover:bg-slate-50 border border-stone-300 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>Panduan ISO 31000 &amp; Kuis</span>
          </button>
        </div>

        {/* Interactive Feature Pills Strip - ALL CLICKABLE */}
        <div className="mt-8 pt-6 border-t border-stone-200/90 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold">
          
          <button
            type="button"
            onClick={onOpenNewRisk}
            title="Klik untuk membuka kalkulator skor risiko"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-stone-200 text-slate-800 hover:border-blue-400 hover:text-blue-800 hover:bg-white hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Kalkulasi Otomatis Skor 1-25</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSwitchTab('dashboard');
              const el = document.getElementById('heatmap-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            title="Klik untuk melihat animasi pergeseran kontrol"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-stone-200 text-slate-800 hover:border-blue-400 hover:text-blue-800 hover:bg-white hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Animasi Pergeseran Kontrol</span>
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            title="Klik untuk membuka laporan audit & ekspor"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-stone-200 text-slate-800 hover:border-blue-400 hover:text-blue-800 hover:bg-white hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export CSV &amp; Cetak PDF Audit</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPrivacyNotice(true)}
            title="Klik untuk melihat jaminan privasi data"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-stone-200 text-slate-800 hover:border-blue-400 hover:text-blue-800 hover:bg-white hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data Tersimpan Privat di Browser</span>
          </button>

        </div>

      </div>

      {/* Privacy modal popup if clicked */}
      {showPrivacyNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 border border-stone-200 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Keamanan &amp; Privasi Data Anda
                </h3>
              </div>
              <button 
                onClick={() => setShowPrivacyNotice(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Seluruh data register risiko dan KRI perusahaan yang Anda masukkan <strong>hanya disimpan secara lokal di memori browser (LocalStorage) perangkat Anda</strong>. 
            </p>
            <div className="space-y-2 text-xs text-slate-700 mb-5">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Zero Data Leakage: Tidak ada data yang dikirim ke server pihak ketiga.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Cadangkan kapan saja: Gunakan tombol <strong>Laporan &gt; Backup JSON</strong> untuk menyimpan berkas cadangan offline.</span>
              </div>
            </div>
            <button
              onClick={() => setShowPrivacyNotice(false)}
              className="w-full py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
