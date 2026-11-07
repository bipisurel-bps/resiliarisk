import React, { useState } from 'react';
import { RiskItem, RiskLevel, LikelihoodScale, ImpactScale } from '../types/risk';
import { calculateRiskLevel, LIKELIHOOD_LABELS, IMPACT_LABELS } from '../utils/riskCalculations';
import { ShieldCheck, Flame, Eye, Info, CheckCircle2 } from 'lucide-react';

interface HeatmapMatrixProps {
  risks: RiskItem[];
  onSelectRisk: (risk: RiskItem) => void;
  selectedRiskId?: string;
}

export const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({
  risks,
  onSelectRisk,
  selectedRiskId,
}) => {
  // 'residual' (current mitigated risk) | 'inherent' (initial unmitigated) | 'compare' (both)
  const [viewMode, setViewMode] = useState<'residual' | 'inherent' | 'compare'>('residual');

  const likelihoods: LikelihoodScale[] = [5, 4, 3, 2, 1]; // Y-axis top to bottom
  const impacts: ImpactScale[] = [1, 2, 3, 4, 5];     // X-axis left to right

  // Filter risks by coordinate
  const getRisksInCell = (l: number, i: number, mode: 'inherent' | 'residual') => {
    return risks.filter(r => {
      if (mode === 'inherent') {
        return r.inherentLikelihood === l && r.inherentImpact === i;
      }
      return r.residualLikelihood === l && r.residualImpact === i;
    });
  };

  // Cell soft background colors with dark text
  const getCellBgClass = (l: LikelihoodScale, i: ImpactScale) => {
    const level = calculateRiskLevel(l, i);
    switch (level) {
      case 'EXTREME':
        return 'bg-red-50 border-red-300 text-red-950 hover:bg-red-100 hover:border-red-400';
      case 'HIGH':
        return 'bg-orange-50 border-orange-300 text-orange-950 hover:bg-orange-100 hover:border-orange-400';
      case 'MEDIUM':
        return 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100 hover:border-amber-400';
      case 'LOW':
        return 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100 hover:border-emerald-400';
    }
  };

  return (
    <div id="heatmap-section" className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-8 border border-stone-300 shadow-md">
      
      {/* Header and Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans">
              Matriks Heatmap Risiko ISO 31000 (5x5)
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-black">
              Interaktif
            </span>
          </div>
          <p className="text-xs text-slate-800 font-bold mt-1">
            Visualisasi sebaran risiko berdasarkan probabilitas (Likelihood) vs dampak finansial &amp; operasional (Impact).
          </p>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs">
          <button
            onClick={() => setViewMode('residual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
              viewMode === 'residual'
                ? 'bg-white text-emerald-900 shadow-xs border border-stone-300'
                : 'text-slate-800 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Residual (Setelah Kontrol)</span>
          </button>

          <button
            onClick={() => setViewMode('inherent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
              viewMode === 'inherent'
                ? 'bg-white text-rose-900 shadow-xs border border-stone-300'
                : 'text-slate-800 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-700" />
            <span>Inheren (Awal)</span>
          </button>

          <button
            onClick={() => setViewMode('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer ${
              viewMode === 'compare'
                ? 'bg-white text-blue-900 shadow-xs border border-stone-300'
                : 'text-slate-800 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-700" />
            <span>Perpindahan Kontrol</span>
          </button>
        </div>
      </div>

      {/* Main Heatmap Container */}
      <div className="relative overflow-x-auto pb-2">
        <div className="min-w-[640px]">
          
          {/* Y-Axis Label + Grid Layout */}
          <div className="flex">
            
            {/* Vertical Y-Axis Label (Likelihood) */}
            <div className="w-36 shrink-0 flex flex-col justify-between pr-3 text-right">
              <div className="text-[11px] font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-end gap-1">
                <span>Kemungkinan</span>
                <span className="text-[10px] text-blue-800 font-mono">(L)</span>
              </div>
              {likelihoods.map(l => (
                <div key={l} className="h-16 flex flex-col justify-center text-right pr-2">
                  <span className="text-xs font-black text-slate-900">
                    {l} - {LIKELIHOOD_LABELS[l].label.split(' - ')[1]}
                  </span>
                  <span className="text-[10px] text-slate-800 font-bold truncate">
                    {LIKELIHOOD_LABELS[l].freq}
                  </span>
                </div>
              ))}
            </div>

            {/* 5x5 Grid Cells */}
            <div className="flex-1 grid grid-cols-5 gap-2">
              {likelihoods.map(l => (
                <React.Fragment key={`row-${l}`}>
                  {impacts.map(i => {
                    const cellScore = l * i;
                    const cellLevel = calculateRiskLevel(l, i);
                    const inherentRisksInCell = getRisksInCell(l, i, 'inherent');
                    const residualRisksInCell = getRisksInCell(l, i, 'residual');
                    
                    const activeRisks = viewMode === 'inherent' 
                      ? inherentRisksInCell 
                      : residualRisksInCell;

                    return (
                      <div
                        key={`cell-${l}-${i}`}
                        className={`h-16 rounded-xl border-2 p-1.5 flex flex-col justify-between transition-all duration-200 relative group cursor-pointer shadow-2xs ${getCellBgClass(
                          l,
                          i
                        )}`}
                      >
                        {/* Top row in cell: Score & Level label */}
                        <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                          <span className="font-black text-xs text-slate-900">{cellScore}</span>
                          <span className="text-[9px] uppercase font-black px-1 rounded bg-black/10">
                            {cellLevel === 'EXTREME' ? 'EKS' : cellLevel === 'HIGH' ? 'HGH' : cellLevel === 'MEDIUM' ? 'MED' : 'LOW'}
                          </span>
                        </div>

                        {/* Risk Pins Inside Cell */}
                        <div className="flex flex-wrap gap-1 overflow-y-auto max-h-9 items-center">
                          {viewMode === 'compare' ? (
                            <>
                              {inherentRisksInCell.map(risk => (
                                <button
                                  key={`inh-${risk.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectRisk(risk);
                                  }}
                                  title={`[Inheren] ${risk.code}: ${risk.title}`}
                                  className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-rose-200 text-rose-950 border border-rose-400 hover:scale-105 shadow-2xs cursor-pointer"
                                >
                                  {risk.code.replace('RSK-OPS-', '#')}I
                                </button>
                              ))}
                              {residualRisksInCell.map(risk => (
                                <button
                                  key={`res-${risk.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectRisk(risk);
                                  }}
                                  title={`[Residual] ${risk.code}: ${risk.title}`}
                                  className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-950 border border-emerald-400 hover:scale-105 shadow-2xs cursor-pointer"
                                >
                                  {risk.code.replace('RSK-OPS-', '#')}R
                                </button>
                              ))}
                            </>
                          ) : (
                            activeRisks.map(risk => (
                              <button
                                key={risk.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectRisk(risk);
                                }}
                                title={`${risk.code}: ${risk.title} (${risk.department})`}
                                className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-lg shadow-xs transition-all hover:scale-110 cursor-pointer ${
                                  selectedRiskId === risk.id
                                    ? 'bg-blue-700 text-white ring-2 ring-blue-700 shadow-sm'
                                    : 'bg-white text-slate-900 border border-stone-400 hover:border-blue-600 hover:text-blue-700'
                                }`}
                              >
                                {risk.code.replace('RSK-OPS-', '#')}
                              </button>
                            ))
                          )}
                        </div>

                        {/* Quick Count */}
                        {activeRisks.length > 0 && (
                          <div className="text-[9px] text-right font-sans font-bold text-slate-800">
                            {activeRisks.length} risiko
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

          </div>

          {/* X-Axis Labels (Impact) */}
          <div className="flex mt-2">
            <div className="w-36 shrink-0 text-right pr-3" />
            <div className="flex-1 grid grid-cols-5 gap-2 text-center">
              {impacts.map(i => (
                <div key={i} className="pt-2">
                  <div className="text-xs font-black text-slate-900">
                    {i} - {IMPACT_LABELS[i].label.split(' - ')[1]}
                  </div>
                  <div className="text-[10px] text-slate-800 font-bold">
                    {IMPACT_LABELS[i].lossEst}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X-Axis Title */}
          <div className="text-center mt-3 text-[11px] font-black text-slate-900 uppercase tracking-wider flex items-center justify-center gap-1">
            <span>Tingkat Dampak Finansial &amp; Operasional</span>
            <span className="text-[10px] text-blue-800 font-mono">(I)</span>
          </div>

        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="mt-6 pt-4 border-t border-stone-300 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-black text-slate-900 text-xs">Kategori ISO 31000:</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-100 border-2 border-emerald-500" />
            <span className="text-slate-900 font-bold">Rendah (1 - 4)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-100 border-2 border-amber-500" />
            <span className="text-slate-900 font-bold">Sedang (5 - 9)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-orange-100 border-2 border-orange-500" />
            <span className="text-slate-900 font-bold">Tinggi (10 - 14)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-red-100 border-2 border-red-500" />
            <span className="text-slate-900 font-black">Ekstrem (15 - 25)</span>
          </div>
        </div>

        <div className="text-xs text-slate-800 flex items-center gap-1.5 font-bold">
          <Info className="w-4 h-4 text-blue-700" />
          <span>Klik pin risiko (<code className="text-blue-800 font-mono font-black">#001</code>) untuk meninjau formulir mitigasi.</span>
        </div>
      </div>

    </div>
  );
};
