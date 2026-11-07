import React from 'react';
import { RiskItem, KRIItem } from '../types/risk';
import { ShieldCheck, AlertTriangle, Flame, Activity, ArrowDownRight, Layers } from 'lucide-react';

interface StatsOverviewProps {
  risks: RiskItem[];
  kris: KRIItem[];
  onFilterLevel?: (level: string | null) => void;
  selectedLevel?: string | null;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  risks,
  kris,
  onFilterLevel,
  selectedLevel,
}) => {
  const total = risks.length;
  
  // Inherent vs Residual stats
  const inherentExtreme = risks.filter(r => r.inherentLevel === 'EXTREME').length;
  const inherentHigh = risks.filter(r => r.inherentLevel === 'HIGH').length;
  
  const residualExtreme = risks.filter(r => r.residualLevel === 'EXTREME').length;
  const residualHigh = risks.filter(r => r.residualLevel === 'HIGH').length;
  const residualMedium = risks.filter(r => r.residualLevel === 'MEDIUM').length;
  const residualLow = risks.filter(r => r.residualLevel === 'LOW').length;

  // Average score reduction %
  const totalInherentScore = risks.reduce((acc, curr) => acc + curr.inherentScore, 0);
  const totalResidualScore = risks.reduce((acc, curr) => acc + curr.residualScore, 0);
  const reductionPercentage = totalInherentScore > 0 
    ? Math.round(((totalInherentScore - totalResidualScore) / totalInherentScore) * 100)
    : 0;

  // KRI Alerts
  const redKris = kris.filter(k => k.status === 'RED').length;
  const amberKris = kris.filter(k => k.status === 'AMBER').length;
  const greenKris = kris.filter(k => k.status === 'GREEN').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* Stat 1: Total Profil Risiko Terdaftar */}
      <div 
        onClick={() => onFilterLevel && onFilterLevel(null)}
        className={`glass-card p-4 rounded-2xl relative overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
          selectedLevel === null ? 'ring-1 ring-blue-500' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Total Risiko Terdaftar</span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-white font-rank">
            {total}
          </span>
          <span className="text-xs text-slate-400">item RCSA</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
          <span>ISO 31000 5x5 Register</span>
        </div>
      </div>

      {/* Stat 2: Efektivitas Pengendalian (Risk Reduction) */}
      <div className="glass-card p-4 rounded-2xl relative overflow-hidden transition-all hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Efektivitas Kontrol</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-rank">
            -{reductionPercentage}%
          </span>
          <span className="text-xs text-slate-400">penurunan risiko</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 text-emerald-400/90">
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>Dari {totalInherentScore} skor ke {totalResidualScore} skor</span>
        </div>
      </div>

      {/* Stat 3: Risiko Kritis (Residual vs Inherent) */}
      <div 
        onClick={() => onFilterLevel && onFilterLevel('HIGH_OR_EXTREME')}
        className={`glass-card p-4 rounded-2xl relative overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
          selectedLevel === 'HIGH_OR_EXTREME' ? 'ring-1 ring-rose-500' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Risiko Ekstrem &amp; Tinggi</span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-rank">
            {residualExtreme + residualHigh}
          </span>
          <span className="text-xs text-slate-400">
            (awal: {inherentExtreme + inherentHigh})
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="text-emerald-400 font-semibold">{residualLow} Rendah</span>
          <span>•</span>
          <span className="text-amber-400 font-semibold">{residualMedium} Sedang</span>
        </div>
      </div>

      {/* Stat 4: KRI Status Alert Radar */}
      <div className="glass-card p-4 rounded-2xl relative overflow-hidden transition-all hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Status KRI (Warning)</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-bold text-slate-200">{greenKris}</span>
          </div>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm font-bold text-amber-300">{amberKris}</span>
          </div>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-bounce" />
            <span className="text-sm font-bold text-rose-400">{redKris}</span>
          </div>
        </div>
        <div className="mt-2 text-[11px] text-slate-400">
          {redKris > 0 ? (
            <span className="text-rose-400 font-medium">⚠️ {redKris} KRI butuh perhatian segera!</span>
          ) : (
            <span className="text-emerald-400">Semua indikator dalam ambang aman</span>
          )}
        </div>
      </div>

    </div>
  );
};
