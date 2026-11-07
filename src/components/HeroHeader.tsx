import React from 'react';
import { Shield, Sparkles, BookOpen, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface HeroHeaderProps {
  onOpenNewRisk: () => void;
  onOpenAcademy: () => void;
  onOpenTemplates: () => void;
  totalRisks: number;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onOpenNewRisk,
  onOpenAcademy,
  onOpenTemplates,
}) => {
  return (
    <div className="relative mb-8 overflow-hidden rounded-b-[36px] sm:rounded-b-[44px] bg-gradient-to-b from-white via-[#FAF8F5] to-[#F3EFEA] dark:from-[#131b26]/90 dark:via-[#0f1724] dark:to-[#0b0f17] border-b border-stone-200/90 dark:border-slate-800 px-4 pt-8 pb-12 sm:px-8 shadow-xs">
      
      {/* Background Soft Ambient Glows */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-8 right-1/3 translate-x-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-blue-500/10 border border-stone-200 dark:border-blue-500/20 text-slate-800 dark:text-blue-400 text-xs font-semibold mb-5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>ISO 31000:2018 Standard &amp; Three Lines Model</span>
          <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-blue-400" />
          <span className="text-slate-500 dark:text-slate-400 font-normal">SaaS RCSA &amp; Risk Academy</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4 font-sans leading-tight">
          Kendalikan Risiko Operasional <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-300 bg-clip-text text-transparent">
            Sebelum Menjadi Kerugian Finansial.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-7">
          Platform SaaS interaktif untuk mengidentifikasi <em>Cause-Event-Impact</em>, memetakan risiko inheren vs residual pada <strong>Heatmap 5x5 dinamis</strong>, dan memantau indikator <strong>KRI</strong> secara mandiri.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenNewRisk}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span>+ Buat Lembar RCSA</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30 transition-all cursor-pointer shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Load Template Industri</span>
          </button>

          <button
            onClick={onOpenAcademy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-stone-200/90 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Panduan ISO 31000 &amp; Kuis</span>
          </button>
        </div>

        {/* Micro Features bullet strip */}
        <div className="mt-8 pt-6 border-t border-stone-200/80 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kalkulasi Otomatis Skor 1-25</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Animasi Pergeseran Kontrol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV &amp; Cetak PDF Siap Audit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data Tersimpan Privat di Browser</span>
          </div>
        </div>

      </div>
    </div>
  );
};
