import React from 'react';
import { Shield, Sparkles, BookOpen, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';

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
  totalRisks,
}) => {
  return (
    <div className="relative mb-6 overflow-hidden rounded-b-[32px] sm:rounded-b-[40px] bg-gradient-to-b from-[#131b26]/90 via-[#0f1724] to-[#0b0f17] border-b border-slate-800/80 px-4 pt-6 pb-10 sm:px-8">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/4 translate-x-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl text-center">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>ISO 31000:2018 Standard &amp; Three Lines Model</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-slate-400 font-normal">SaaS RCSA &amp; Risk Academy</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 font-sans leading-tight">
          Kendalikan Risiko Operasional <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            Sebelum Menjadi Kerugian Nyata.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          Platform interaktif untuk mengidentifikasi <em>Cause-Event-Impact</em>, menilai risiko inheren vs residual pada <strong>Heatmap 5x5 dinamis</strong>, dan memantau peringatan dini <strong>KRI</strong> secara mandiri.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenNewRisk}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>+ Buat Lembar RCSA</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Load Template Industri</span>
          </button>

          <button
            onClick={onOpenAcademy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Panduan ISO 31000 &amp; Kuis</span>
          </button>
        </div>

        {/* Micro Features bullet strip */}
        <div className="mt-7 pt-5 border-t border-slate-800/60 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kalkulasi Otomatis Skor 1-25</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Animasi Pergeseran Kontrol</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV &amp; Cetak PDF Siap Audit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data Tersimpan Privat di Browser</span>
          </div>
        </div>

      </div>
    </div>
  );
};
