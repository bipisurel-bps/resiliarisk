import React, { useState } from 'react';
import { RiskItem, RiskStatus } from '../types/risk';
import { getRiskLevelLabel, getCategoryBadge } from '../utils/riskCalculations';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  TrendingDown
} from 'lucide-react';

interface RcsaWorkspaceProps {
  risks: RiskItem[];
  onEditRisk: (risk: RiskItem) => void;
  onDeleteRisk: (id: string) => void;
  onSelectRisk: (risk: RiskItem) => void;
  onUpdateStatus: (id: string, newStatus: RiskStatus) => void;
  selectedRiskId?: string;
}

export const RcsaWorkspace: React.FC<RcsaWorkspaceProps> = ({
  risks,
  onEditRisk,
  onDeleteRisk,
  onSelectRisk,
  onUpdateStatus,
  selectedRiskId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  // Extract unique departments
  const departments = ['ALL', ...Array.from(new Set(risks.map(r => r.department)))];

  // Filtering
  const filteredRisks = risks.filter(risk => {
    const matchesSearch = 
      risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || risk.department === selectedDept;
    const matchesCat = selectedCat === 'ALL' || risk.category === selectedCat;
    const matchesLevel = selectedLevel === 'ALL' || risk.residualLevel === selectedLevel;

    return matchesSearch && matchesDept && matchesCat && matchesLevel;
  });

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-8 border border-stone-300 shadow-md">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans">
              Lembar Kerja RCSA (Risk &amp; Control Self-Assessment)
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-200 text-slate-900 font-mono font-black border border-stone-300">
              {filteredRisks.length} dari {risks.length}
            </span>
          </div>
          <p className="text-xs text-slate-800 font-bold mt-1">
            Daftar register risiko operasional, efektivitas pengendalian, dan rencana aksi lini pertama.
          </p>
        </div>

        {/* Search Input - High Contrast */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode, nama, atau penyebab..."
            className="w-full bg-white border-2 border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2.5 mb-5 pb-3 border-b border-stone-300 text-xs">
        <div className="flex items-center gap-1.5 text-slate-900 mr-2 font-black text-xs">
          <Filter className="w-4 h-4 text-blue-700" />
          <span>Filter:</span>
        </div>

        {/* Dept Selector */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-white border-2 border-stone-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-700 shadow-2xs cursor-pointer font-bold"
        >
          {departments.map(d => (
            <option key={d} value={d}>
              {d === 'ALL' ? 'Semua Unit Kerja' : d}
            </option>
          ))}
        </select>

        {/* Category Selector */}
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-white border-2 border-stone-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-700 shadow-2xs cursor-pointer font-bold"
        >
          <option value="ALL">Semua Kategori Risiko</option>
          <option value="PEOPLE">Manusia (People &amp; Fraud)</option>
          <option value="SYSTEM">Sistem &amp; IT / Cyber</option>
          <option value="PROCESS">Proses &amp; Prosedur</option>
          <option value="EXTERNAL">Kejadian Eksternal</option>
        </select>

        {/* Level Selector */}
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="bg-white border-2 border-stone-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-700 shadow-2xs cursor-pointer font-bold"
        >
          <option value="ALL">Semua Level Residual</option>
          <option value="EXTREME">Ekstrem / Kritis</option>
          <option value="HIGH">Tinggi</option>
          <option value="MEDIUM">Moderat / Sedang</option>
          <option value="LOW">Rendah</option>
        </select>
      </div>

      {/* Main Table View */}
      <div className="overflow-x-auto rounded-xl border border-stone-300 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100 border-b-2 border-stone-300 text-slate-900 font-black tracking-wider text-[11px] uppercase">
              <th className="py-3.5 px-3.5">Kode &amp; Unit</th>
              <th className="py-3.5 px-3.5 min-w-[220px]">Peristiwa Risiko &amp; Penyebab</th>
              <th className="py-3.5 px-3 text-center">Inheren (L x I)</th>
              <th className="py-3.5 px-3.5 min-w-[180px]">Pengendalian Internal</th>
              <th className="py-3.5 px-3 text-center">Residual (L x I)</th>
              <th className="py-3.5 px-3.5 min-w-[190px]">Rencana Aksi Mitigasi</th>
              <th className="py-3.5 px-3 text-center">Status</th>
              <th className="py-3.5 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {filteredRisks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-800 font-bold">
                  Tidak ada risiko yang sesuai dengan filter pencarian.
                </td>
              </tr>
            ) : (
              filteredRisks.map((risk) => {
                const inhLabel = getRiskLevelLabel(risk.inherentLevel);
                const resLabel = getRiskLevelLabel(risk.residualLevel);
                const catBadge = getCategoryBadge(risk.category);
                const isSelected = selectedRiskId === risk.id;

                return (
                  <tr
                    key={risk.id}
                    onClick={() => onSelectRisk(risk)}
                    className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/80 ring-1 ring-inset ring-blue-600' : ''
                    }`}
                  >
                    {/* Code & Dept */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="font-mono font-black text-blue-900">
                        {risk.code}
                      </div>
                      <div className="text-[11px] text-slate-800 font-bold mt-0.5 line-clamp-1">
                        {risk.department}
                      </div>
                      <div className="mt-1.5">
                        <span 
                          className="text-[9px] px-2 py-0.5 rounded-md font-black border"
                          style={{ color: catBadge.color, backgroundColor: catBadge.bg, borderColor: `${catBadge.color}40` }}
                        >
                          {catBadge.label.split(' (')[0]}
                        </span>
                      </div>
                    </td>

                    {/* Title & Cause */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="font-black text-slate-900 text-xs leading-snug">
                        {risk.title}
                      </div>
                      <div className="text-[11px] text-slate-800 mt-1 line-clamp-2 font-medium">
                        <span className="text-slate-900 font-bold">Penyebab: </span>
                        {risk.cause}
                      </div>
                    </td>

                    {/* Inherent Score Badge */}
                    <td className="py-3.5 px-3 align-top text-center">
                      <div 
                        className="inline-flex flex-col items-center justify-center px-2 py-1 rounded-lg border font-mono font-black text-xs shadow-2xs"
                        style={{ color: inhLabel.color, backgroundColor: inhLabel.bg, borderColor: inhLabel.border }}
                      >
                        <span>{risk.inherentScore}</span>
                        <span className="text-[9px] font-sans font-bold">
                          {risk.inherentLikelihood}x{risk.inherentImpact}
                        </span>
                      </div>
                    </td>

                    {/* Existing Controls */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="text-[11px] text-slate-900 font-medium line-clamp-2">
                        {risk.existingControls}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-slate-900 font-bold border border-stone-300">
                          {risk.controlType}
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          risk.controlEffectiveness === 'STRONG'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                            : risk.controlEffectiveness === 'ADEQUATE'
                            ? 'bg-blue-100 text-blue-950 border border-blue-300'
                            : 'bg-amber-100 text-amber-950 border border-amber-300'
                        }`}>
                          {risk.controlEffectiveness}
                        </span>
                      </div>
                    </td>

                    {/* Residual Score Badge */}
                    <td className="py-3.5 px-3 align-top text-center">
                      <div 
                        className="inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-lg border font-mono font-black text-xs shadow-2xs"
                        style={{ color: resLabel.color, backgroundColor: resLabel.bg, borderColor: resLabel.border }}
                      >
                        <span>{risk.residualScore}</span>
                        <span className="text-[9px] font-sans font-bold">
                          {risk.residualLikelihood}x{risk.residualImpact}
                        </span>
                      </div>
                      <div className="text-[9px] text-emerald-800 font-black mt-1 flex items-center justify-center gap-0.5">
                        <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                        <span>-{risk.inherentScore - risk.residualScore}</span>
                      </div>
                    </td>

                    {/* Action Plan */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="text-[11px] text-slate-900 font-medium line-clamp-2">
                        {risk.actionPlan}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-800 font-bold mt-1.5">
                        <span className="font-black text-blue-800">
                          [{risk.actionStrategy}]
                        </span>
                        <span className="truncate max-w-[100px] text-slate-700">
                          {risk.actionOwner.split(' ')[0]}...
                        </span>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-3 align-top text-center">
                      <select
                        value={risk.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onUpdateStatus(risk.id, e.target.value as RiskStatus)}
                        className={`text-[10px] font-black px-2 py-1 rounded-lg border-2 focus:outline-none cursor-pointer ${
                          risk.status === 'CLOSED'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                            : risk.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-950 border-blue-400'
                            : risk.status === 'MITIGATED'
                            ? 'bg-purple-100 text-purple-950 border-purple-400'
                            : 'bg-amber-100 text-amber-950 border-amber-400'
                        }`}
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="MITIGATED">MITIGATED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditRisk(risk);
                          }}
                          title="Edit Risiko"
                          className="p-1.5 rounded-lg text-slate-800 hover:text-blue-800 hover:bg-stone-100 transition-colors cursor-pointer border border-transparent hover:border-stone-300"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Hapus risiko ${risk.code}?`)) {
                              onDeleteRisk(risk.id);
                            }
                          }}
                          title="Hapus Risiko"
                          className="p-1.5 rounded-lg text-rose-700 hover:text-rose-900 hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
