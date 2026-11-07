import React, { useState } from 'react';
import { RiskItem, RiskCategory, RiskLevel, RiskStatus } from '../types/risk';
import { getRiskLevelLabel, getCategoryBadge } from '../utils/riskCalculations';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  ShieldCheck, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
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
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              RCSA Register (Risk &amp; Control Self-Assessment)
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {filteredRisks.length} dari {risks.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Lembar kerja penilaian risiko operasional dan efektivitas pengendalian internal lini pertama.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode, nama, atau penyebab..."
            className="w-full bg-[#101723] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-5 pb-3 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span className="font-medium">Filter:</span>
        </div>

        {/* Dept Selector */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-[#101723] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
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
          className="bg-[#101723] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
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
          className="bg-[#101723] border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">Semua Level Residual</option>
          <option value="EXTREME">Ekstrem / Kritis</option>
          <option value="HIGH">Tinggi</option>
          <option value="MEDIUM">Moderat / Sedang</option>
          <option value="LOW">Rendah</option>
        </select>
      </div>

      {/* Main Table View (Desktop & Tablet) */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#101723] border-b border-slate-800 text-slate-400 font-semibold tracking-wider text-[11px] uppercase">
              <th className="py-3 px-3.5">Kode &amp; Unit</th>
              <th className="py-3 px-3.5 min-w-[220px]">Peristiwa Risiko &amp; Penyebab</th>
              <th className="py-3 px-3 text-center">Inheren (L x I)</th>
              <th className="py-3 px-3.5 min-w-[180px]">Pengendalian Internal</th>
              <th className="py-3 px-3 text-center">Residual (L x I)</th>
              <th className="py-3 px-3.5 min-w-[190px]">Rencana Aksi Mitigasi</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRisks.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-slate-500">
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
                    className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-950/20 ring-1 ring-inset ring-blue-500/50' : ''
                    }`}
                  >
                    {/* Code & Dept */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="font-mono font-bold text-blue-400">
                        {risk.code}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {risk.department}
                      </div>
                      <div className="mt-1.5">
                        <span 
                          className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                          style={{ color: catBadge.color, backgroundColor: catBadge.bg }}
                        >
                          {catBadge.label.split(' (')[0]}
                        </span>
                      </div>
                    </td>

                    {/* Title & Cause */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="font-semibold text-slate-100 text-xs leading-snug">
                        {risk.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        <span className="text-slate-500 font-medium">Penyebab: </span>
                        {risk.cause}
                      </div>
                    </td>

                    {/* Inherent Score Badge */}
                    <td className="py-3.5 px-3 align-top text-center">
                      <div 
                        className="inline-flex flex-col items-center justify-center px-2 py-1 rounded-lg border font-mono font-bold text-xs"
                        style={{ color: inhLabel.color, backgroundColor: inhLabel.bg, borderColor: inhLabel.border }}
                      >
                        <span>{risk.inherentScore}</span>
                        <span className="text-[9px] font-sans font-normal opacity-90">
                          {risk.inherentLikelihood}x{risk.inherentImpact}
                        </span>
                      </div>
                    </td>

                    {/* Existing Controls */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="text-[11px] text-slate-300 line-clamp-2">
                        {risk.existingControls}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {risk.controlType}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          risk.controlEffectiveness === 'STRONG'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : risk.controlEffectiveness === 'ADEQUATE'
                            ? 'bg-blue-500/15 text-blue-400'
                            : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          {risk.controlEffectiveness}
                        </span>
                      </div>
                    </td>

                    {/* Residual Score Badge */}
                    <td className="py-3.5 px-3 align-top text-center">
                      <div 
                        className="inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-lg border font-mono font-bold text-xs shadow-sm"
                        style={{ color: resLabel.color, backgroundColor: resLabel.bg, borderColor: resLabel.border }}
                      >
                        <span>{risk.residualScore}</span>
                        <span className="text-[9px] font-sans font-normal opacity-90">
                          {risk.residualLikelihood}x{risk.residualImpact}
                        </span>
                      </div>
                      <div className="text-[9px] text-emerald-400/90 font-medium mt-1 flex items-center justify-center gap-0.5">
                        <TrendingDown className="w-2.5 h-2.5" />
                        <span>-{risk.inherentScore - risk.residualScore}</span>
                      </div>
                    </td>

                    {/* Action Plan */}
                    <td className="py-3.5 px-3.5 align-top">
                      <div className="text-[11px] text-slate-300 line-clamp-2">
                        {risk.actionPlan}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                        <span className="font-semibold text-blue-400">
                          [{risk.actionStrategy}]
                        </span>
                        <span className="truncate max-w-[100px] text-slate-400">
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
                        className={`text-[10px] font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          risk.status === 'CLOSED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : risk.status === 'IN_PROGRESS'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : risk.status === 'MITIGATED'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="OPEN" className="bg-[#101723] text-amber-400">OPEN</option>
                        <option value="IN_PROGRESS" className="bg-[#101723] text-blue-400">IN PROGRESS</option>
                        <option value="MITIGATED" className="bg-[#101723] text-purple-400">MITIGATED</option>
                        <option value="CLOSED" className="bg-[#101723] text-emerald-400">CLOSED</option>
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
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Hapus risiko ${risk.code}?`)) {
                              onDeleteRisk(risk.id);
                            }
                          }}
                          title="Hapus Risiko"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
