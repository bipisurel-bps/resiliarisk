import React, { useState } from 'react';
import { RiskItem, LikelihoodScale, ImpactScale } from '../types/risk';
import { calculateRiskLevel, LIKELIHOOD_LABELS, IMPACT_LABELS } from '../utils/riskCalculations';
import { Eye, ShieldCheck, Flame, Info } from 'lucide-react';

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
  const [viewMode, setViewMode] = useState<'residual' | 'inherent' | 'compare'>('residual');

  // Likelihood 5 down to 1 (Y axis)
  const likelihoods: LikelihoodScale[] = [5, 4, 3, 2, 1];
  // Impact 1 to 5 (X axis)
  const impacts: ImpactScale[] = [1, 2, 3, 4, 5];

  // Helper to get risks in a specific coordinate
  const getRisksInCell = (l: LikelihoodScale, i: ImpactScale, mode: 'residual' | 'inherent') => {
    return risks.filter(r => {
      if (mode === 'inherent') {
        return r.inherentLikelihood === l && r.inherentImpact === i;
      }
      return r.residualLikelihood === l && r.residualImpact === i;
    });
  };

  // Tactile Antislop Pastel Cell Background generator based on ISO 31000 score
  const getCellBgClass = (l: LikelihoodScale, i: ImpactScale) => {
    const level = calculateRiskLevel(l, i);
    switch (level) {
      case 'EXTREME':
        return 'bg-red-50/90 border-red-200 text-red-900 hover:bg-red-100/90 dark:bg-red-500/20 dark:border-red-500/40 dark:text-red-300';
      case 'HIGH':
        return 'bg-orange-50/90 border-orange-200 text-orange-950 hover:bg-orange-100/90 dark:bg-orange-500/20 dark:border-orange-500/40 dark:text-orange-300';
      case 'MEDIUM':
        return 'bg-amber-50/90 border-amber-200 text-amber-950 hover:bg-amber-100/90 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300';
      case 'LOW':
      default:
        return 'bg-emerald-50/90 border-emerald-200 text-emerald-950 hover:bg-emerald-100/90 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-300';
    }
  };

  return (
    <div id="heatmap-section" className="glass-card rounded-2xl p-4 sm:p-6 mb-8 scroll-mt-24">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Matriks Heatmap Risiko 5x5 (ISO 31000)
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 font-bold">
              Interaktif
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualisasi sebaran risiko berdasarkan probabilitas (Likelihood) vs dampak finansial &amp; operasional (Impact).
          </p>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="flex items-center bg-slate-100 dark:bg-[#101723] p-1 rounded-xl border border-slate-200/90 dark:border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('residual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'residual'
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80 dark:bg-emerald-600 dark:text-white dark:border-transparent'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" />
            <span>Risiko Residual (Saat Ini)</span>
          </button>

          <button
            onClick={() => setViewMode('inherent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'inherent'
                ? 'bg-white text-rose-800 shadow-xs border border-slate-200/80 dark:bg-rose-600 dark:text-white dark:border-transparent'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-300" />
            <span>Risiko Inheren (Awal)</span>
          </button>

          <button
            onClick={() => setViewMode('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'compare'
                ? 'bg-white text-blue-800 shadow-xs border border-slate-200/80 dark:bg-blue-600 dark:text-white dark:border-transparent'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-300" />
            <span>Perpindahan (Shift)</span>
          </button>
        </div>
      </div>

      {/* Main Heatmap Container */}
      <div className="relative overflow-x-auto pb-2">
        <div className="min-w-[640px]">
          
          {/* Y-Axis Label + Grid Layout */}
          <div className="flex">
            
            {/* Vertical Y-Axis Label (Likelihood) */}
            <div className="w-32 shrink-0 flex flex-col justify-between pr-3 text-right">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-end gap-1">
                <span>Kemungkinan</span>
                <span className="text-[10px] text-blue-600 font-mono">(L)</span>
              </div>
              {likelihoods.map(l => (
                <div key={l} className="h-16 flex flex-col justify-center text-right pr-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {l} - {LIKELIHOOD_LABELS[l].label.split(' - ')[1]}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">
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
                        className={`h-16 rounded-xl border p-1.5 flex flex-col justify-between transition-all duration-200 relative group cursor-pointer shadow-2xs ${getCellBgClass(
                          l,
                          i
                        )}`}
                      >
                        {/* Top row in cell: Score & Level label */}
                        <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                          <span className="font-black text-xs">{cellScore}</span>
                          <span className="text-[9px] uppercase font-bold opacity-75">
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
                                  className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-300 hover:scale-105 shadow-2xs cursor-pointer"
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
                                  className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 hover:scale-105 shadow-2xs cursor-pointer"
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
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg shadow-xs transition-all hover:scale-110 cursor-pointer ${
                                  selectedRiskId === risk.id
                                    ? 'bg-blue-600 text-white ring-2 ring-blue-600 shadow-sm'
                                    : 'bg-white text-slate-800 border border-slate-300/90 hover:border-blue-500 hover:text-blue-600'
                                }`}
                              >
                                {risk.code.replace('RSK-OPS-', '#')}
                              </button>
                            ))
                          )}
                        </div>

                        {/* Hover Quick Tooltip indicator */}
                        {activeRisks.length > 0 && (
                          <div className="text-[9px] text-right font-sans font-semibold opacity-75">
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
            <div className="w-32 shrink-0 text-right pr-3" />
            <div className="flex-1 grid grid-cols-5 gap-2 text-center">
              {impacts.map(i => (
                <div key={i} className="pt-2">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {i} - {IMPACT_LABELS[i].label.split(' - ')[1]}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {IMPACT_LABELS[i].lossEst}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X-Axis Title */}
          <div className="text-center mt-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
            <span>Tingkat Dampak Finansial &amp; Operasional</span>
            <span className="text-[10px] text-blue-600 font-mono">(I)</span>
          </div>

        </div>
      </div>

      {/* Heatmap Legend & ISO Matrix Explanation */}
      <div className="mt-6 pt-4 border-t border-stone-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-600 dark:text-slate-400 text-[11px]">Kategori ISO 31000:</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-400" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Rendah (1 - 4)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Sedang (5 - 9)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-orange-100 border border-orange-400" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Tinggi (10 - 14)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-red-100 border border-red-400" />
            <span className="text-slate-800 dark:text-slate-300 font-bold">Ekstrem (15 - 25)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
          <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Klik pin risiko (<code className="text-blue-700 dark:text-blue-300 font-mono font-bold">#001</code>) untuk menyorot detail mitigasinya.</span>
        </div>
      </div>

    </div>
  );
};
