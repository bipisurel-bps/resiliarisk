import React from 'react';
import { RiskItem, KRIItem } from '../types/risk';
import { ShieldCheck, Flame, Activity, ArrowDownRight, Layers } from 'lucide-react';

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
      
      {/* Stat 1: Total Profil Risiko Terdaftar */}
      <div 
        onClick={() => onFilterLevel && onFilterLevel(null)}
        className={`glass-card p-4 sm:p-5 rounded-2xl relative overflow-hidden cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md border border-stone-300 ${
          selectedLevel === null ? 'ring-2 ring-blue-700' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-800">Total Profil Risiko</span>
          <div className="p-2 rounded-xl bg-blue-100 text-blue-900 border border-blue-200">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-rank">
            {total}
          </span>
          <span className="text-xs text-slate-800 font-bold">item RCSA</span>
        </div>
        <div className="mt-2.5 text-[11px] text-slate-800 flex items-center gap-1.5 font-bold">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-700" />
          <span>Matriks ISO 31000 5x5</span>
        </div>
      </div>

      {/* Stat 2: Efektivitas Pengendalian (Risk Reduction) */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md border border-stone-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-800">Efektivitas Kontrol</span>
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-emerald-800 font-rank">
            -{reductionPercentage}%
          </span>
          <span className="text-xs text-slate-800 font-bold">penurunan risiko</span>
        </div>
        <div className="mt-2.5 text-[11px] text-emerald-900 font-bold flex items-center gap-1">
          <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
          <span>Skor {totalInherentScore} ➔ {totalResidualScore}</span>
        </div>
      </div>

      {/* Stat 3: Risiko Kritis (Residual vs Inherent) */}
      <div 
        onClick={() => onFilterLevel && onFilterLevel('HIGH_OR_EXTREME')}
        className={`glass-card p-4 sm:p-5 rounded-2xl relative overflow-hidden cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md border border-stone-300 ${
          selectedLevel === 'HIGH_OR_EXTREME' ? 'ring-2 ring-rose-700' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-800">Ekstrem &amp; Tinggi</span>
          <div className="p-2 rounded-xl bg-rose-100 text-rose-900 border border-rose-200">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-rose-700 font-rank">
            {residualExtreme + residualHigh}
          </span>
          <span className="text-xs text-slate-800 font-bold">
            (awal: {inherentExtreme + inherentHigh})
          </span>
        </div>
        <div className="mt-2.5 text-[11px] text-slate-900 flex items-center gap-2 font-bold">
          <span className="text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">{residualLow} Rendah</span>
          <span>•</span>
          <span className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">{residualMedium} Sedang</span>
        </div>
      </div>

      {/* Stat 4: KRI Status Alert Radar */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl relative overflow-hidden transition-all hover:scale-[1.01] hover:shadow-md border border-stone-300">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-800">Status KRI Alarm</span>
          <div className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span className="text-sm font-black text-slate-900">{greenKris}</span>
          </div>
          <span className="text-slate-400 font-bold">/</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm font-black text-amber-800">{amberKris}</span>
          </div>
          <span className="text-slate-400 font-bold">/</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600" />
            <span className="text-sm font-black text-rose-800">{redKris}</span>
          </div>
        </div>
        <div className="mt-2.5 text-[11px] font-bold">
          {redKris > 0 ? (
            <span className="text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">⚠️ {redKris} KRI butuh perhatian!</span>
          ) : (
            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">Semua KRI ambang aman</span>
          )}
        </div>
      </div>

    </div>
  );
};
