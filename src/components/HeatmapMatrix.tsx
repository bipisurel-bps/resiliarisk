import React, { useState } from 'react';
import { RiskItem, LikelihoodScale, ImpactScale } from '../types/risk';
import { calculateRiskLevel, getRiskLevelLabel, LIKELIHOOD_LABELS, IMPACT_LABELS } from '../utils/riskCalculations';
import { ArrowRight, Eye, ShieldCheck, Flame, Info } from 'lucide-react';

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
  const [hoveredCell, setHoveredCell] = useState<{ l: number; i: number } | null>(null);

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

  // Cell Background generator based on ISO 31000 score
  const getCellBgClass = (l: LikelihoodScale, i: ImpactScale) => {
    const level = calculateRiskLevel(l, i);
    switch (level) {
      case 'EXTREME':
        return 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 border-orange-500/40 text-orange-300 hover:bg-orange-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30';
      case 'LOW':
      default:
        return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Matriks Heatmap Risiko 5x5 (ISO 31000)
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              Interaktif
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualisasi sebaran risiko berdasarkan probabilitas (Likelihood) vs dampak finansial &amp; operasional (Impact).
          </p>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="flex items-center bg-[#101723] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('residual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'residual'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Risiko Residual (Saat Ini)</span>
          </button>

          <button
            onClick={() => setViewMode('inherent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'inherent'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-300" />
            <span>Risiko Inheren (Awal)</span>
          </button>

          <button
            onClick={() => setViewMode('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'compare'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-300" />
            <span>Perpindahan (Shift)</span>
          </button>
        </div>
      </div>

      {/* Main Heatmap Container */}
      <div className="relative overflow-x-auto pb-2">
        <div className="min-w-[620px]">
          
          {/* Y-Axis Label + Grid Layout */}
          <div className="flex">
            
            {/* Vertical Y-Axis Label (Likelihood) */}
            <div className="w-28 shrink-0 flex flex-col justify-between pr-3 text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-end gap-1">
                <span>Kemungkinan</span>
                <span className="text-[10px] text-blue-400 font-mono">(L)</span>
              </div>
              {likelihoods.map(l => (
                <div key={l} className="h-16 flex flex-col justify-center text-right pr-2">
                  <span className="text-xs font-bold text-slate-200">{l} - {LIKELIHOOD_LABELS[l].label.split(' - ')[1]}</span>
                  <span className="text-[10px] text-slate-500 truncate">{LIKELIHOOD_LABELS[l].freq}</span>
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
                        onMouseEnter={() => setHoveredCell({ l, i })}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`h-16 rounded-xl border p-1.5 flex flex-col justify-between transition-all duration-200 relative group cursor-pointer ${getCellBgClass(
                          l,
                          i
                        )}`}
                      >
                        {/* Top row in cell: Score & Level label */}
                        <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                          <span className="font-extrabold text-xs opacity-90">{cellScore}</span>
                          <span className="text-[9px] uppercase font-semibold opacity-75">
                            {cellLevel === 'EXTREME' ? 'EKS' : cellLevel === 'HIGH' ? 'HGH' : cellLevel === 'MEDIUM' ? 'MED' : 'LOW'}
                          </span>
                        </div>

                        {/* Risk Pins Inside Cell */}
                        <div className="flex flex-wrap gap-1 overflow-y-auto max-h-9 items-center">
                          {viewMode === 'compare' ? (
                            <>
                              {/* Compare Mode: Show both with shift indicator */}
                              {inherentRisksInCell.map(risk => (
                                <button
                                  key={`inh-${risk.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectRisk(risk);
                                  }}
                                  title={`[Inheren] ${risk.code}: ${risk.title}`}
                                  className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-600/50 hover:scale-105"
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
                                  className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:scale-105"
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
                                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm transition-transform hover:scale-110 cursor-pointer ${
                                  selectedRiskId === risk.id
                                    ? 'ring-2 ring-white bg-blue-600 text-white'
                                    : 'bg-black/60 text-white border border-white/20'
                                }`}
                              >
                                {risk.code.replace('RSK-OPS-', '#')}
                              </button>
                            ))
                          )}
                        </div>

                        {/* Hover Quick Tooltip indicator */}
                        {activeRisks.length > 0 && (
                          <div className="text-[9px] text-right font-sans opacity-70">
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
            <div className="w-28 shrink-0 text-right pr-3" />
            <div className="flex-1 grid grid-cols-5 gap-2 text-center">
              {impacts.map(i => (
                <div key={i} className="pt-2">
                  <div className="text-xs font-bold text-slate-200">
                    {i} - {IMPACT_LABELS[i].label.split(' - ')[1]}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {IMPACT_LABELS[i].lossEst}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X-Axis Title */}
          <div className="text-center mt-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
            <span>Tingkat Dampak Finansial &amp; Operasional</span>
            <span className="text-[10px] text-blue-400 font-mono">(I)</span>
          </div>

        </div>
      </div>

      {/* Heatmap Legend & ISO Matrix Explanation */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-semibold text-slate-400 text-[11px]">Kategori ISO 31000:</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" />
            <span className="text-slate-300">Rendah (1 - 4)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500" />
            <span className="text-slate-300">Sedang (5 - 9)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-orange-500/30 border border-orange-500" />
            <span className="text-slate-300">Tinggi (10 - 14)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500/30 border border-red-500" />
            <span className="text-slate-300 font-medium">Ekstrem (15 - 25)</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Klik pin nomor risiko (<code className="text-blue-300 font-mono">#001</code>) untuk melihat detail mitigasinya.</span>
        </div>
      </div>

    </div>
  );
};
