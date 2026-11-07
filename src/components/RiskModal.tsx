import React, { useState, useEffect } from 'react';
import { 
  RiskItem, 
  RiskCategory, 
  LikelihoodScale, 
  ImpactScale, 
  ControlType, 
  ControlEffectiveness, 
  ActionPlanStrategy, 
  RiskStatus 
} from '../types/risk';
import { 
  calculateRiskLevel, 
  getRiskLevelLabel, 
  LIKELIHOOD_LABELS, 
  IMPACT_LABELS, 
  estimateResidualValues 
} from '../utils/riskCalculations';
import { X, ShieldAlert, Sparkles, Check, HelpCircle, ArrowRight } from 'lucide-react';

interface RiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (riskData: Omit<RiskItem, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  editingRisk?: RiskItem | null;
  existingCount: number;
}

export const RiskModal: React.FC<RiskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRisk,
  existingCount,
}) => {
  if (!isOpen) return null;

  const defaultCode = `RSK-OPS-${String(existingCount + 1).padStart(3, '0')}`;

  const [code, setCode] = useState(editingRisk?.code || defaultCode);
  const [title, setTitle] = useState(editingRisk?.title || '');
  const [department, setDepartment] = useState(editingRisk?.department || 'Teknologi Informasi & Infrastruktur');
  const [category, setCategory] = useState<RiskCategory>(editingRisk?.category || 'SYSTEM');
  
  // Anatomy
  const [cause, setCause] = useState(editingRisk?.cause || '');
  const [event, setEvent] = useState(editingRisk?.event || '');
  const [impactDescription, setImpactDescription] = useState(editingRisk?.impactDescription || '');

  // Inherent
  const [inherentLikelihood, setInherentLikelihood] = useState<LikelihoodScale>(editingRisk?.inherentLikelihood || 3);
  const [inherentImpact, setInherentImpact] = useState<ImpactScale>(editingRisk?.inherentImpact || 4);

  // Controls
  const [existingControls, setExistingControls] = useState(editingRisk?.existingControls || '');
  const [controlType, setControlType] = useState<ControlType>(editingRisk?.controlType || 'PREVENTIVE');
  const [controlEffectiveness, setControlEffectiveness] = useState<ControlEffectiveness>(editingRisk?.controlEffectiveness || 'ADEQUATE');

  // Residual
  const [residualLikelihood, setResidualLikelihood] = useState<LikelihoodScale>(editingRisk?.residualLikelihood || 2);
  const [residualImpact, setResidualImpact] = useState<ImpactScale>(editingRisk?.residualImpact || 2);

  // Action Plan
  const [actionPlan, setActionPlan] = useState(editingRisk?.actionPlan || '');
  const [actionStrategy, setActionStrategy] = useState<ActionPlanStrategy>(editingRisk?.actionStrategy || 'TREAT');
  const [actionOwner, setActionOwner] = useState(editingRisk?.actionOwner || '');
  const [actionDeadline, setActionDeadline] = useState(editingRisk?.actionDeadline || '2026-12-31');
  const [status, setStatus] = useState<RiskStatus>(editingRisk?.status || 'OPEN');

  // Calculated values
  const inherentScore = inherentLikelihood * inherentImpact;
  const inherentLevel = calculateRiskLevel(inherentLikelihood, inherentImpact);
  const inhBadge = getRiskLevelLabel(inherentLevel);

  const residualScore = residualLikelihood * residualImpact;
  const residualLevel = calculateRiskLevel(residualLikelihood, residualImpact);
  const resBadge = getRiskLevelLabel(residualLevel);

  // When control effectiveness changes, suggest residual automatically
  const handleEffectivenessChange = (newEff: ControlEffectiveness) => {
    setControlEffectiveness(newEff);
    const estimated = estimateResidualValues(inherentLikelihood, inherentImpact, newEff);
    setResidualLikelihood(estimated.residualL);
    setResidualImpact(estimated.residualI);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !cause.trim()) {
      alert('Mohon isi Judul Risiko dan Akar Penyebab.');
      return;
    }

    onSave({
      code,
      title,
      department,
      category,
      cause,
      event: event || title,
      impactDescription,
      inherentLikelihood,
      inherentImpact,
      inherentScore,
      inherentLevel,
      existingControls,
      controlType,
      controlEffectiveness,
      residualLikelihood,
      residualImpact,
      residualScore,
      residualLevel,
      actionPlan,
      actionStrategy,
      actionOwner: actionOwner || 'Process Owner',
      actionDeadline,
      status,
    }, editingRisk?.id);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card w-full max-w-3xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#101723]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/15 text-blue-400 border border-blue-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {editingRisk ? 'Perbarui Lembar RCSA' : 'Identifikasi Risiko Baru (RCSA)'}
              </h3>
              <p className="text-xs text-slate-400">
                Format Penilaian Mandiri Kontrol &amp; Risiko Berbasis ISO 31000:2018
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 max-h-[80vh] overflow-y-auto space-y-5 text-xs">
          
          {/* Section 1: Profil & Identifikasi */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <span>1. Identifikasi &amp; Konteks Organisasi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Kode Risiko</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Unit Kerja / Departemen</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. IT & Infrastruktur, Kas, SDM"
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Taksonomi Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RiskCategory)}
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="SYSTEM">Sistem &amp; IT / Cyber</option>
                  <option value="PROCESS">Proses &amp; Prosedur</option>
                  <option value="PEOPLE">Manusia (People &amp; Fraud)</option>
                  <option value="EXTERNAL">Kejadian Eksternal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Nama / Judul Risiko Operasional</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kegagalan Koneksi Gateway Pembayaran saat Jam Sibuk"
                className="w-full bg-[#101723] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-medium"
                required
              />
            </div>

            {/* Anatomi Risiko: Cause - Event - Impact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                  <span>Akar Penyebab (Root Cause)</span>
                  <span className="text-[10px] text-slate-500">Mengapa bisa terjadi?</span>
                </label>
                <textarea
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  rows={2}
                  placeholder="e.g. Kapasitas memory server database tidak memadai dan autoscaling timeout..."
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                  <span>Dampak Finansial &amp; Operasional</span>
                  <span className="text-[10px] text-slate-500">Berapa kerugian/reputasinya?</span>
                </label>
                <textarea
                  value={impactDescription}
                  onChange={(e) => setImpactDescription(e.target.value)}
                  rows={2}
                  placeholder="e.g. Estimasi kehilangan omzet Rp 200 Juta, komplain pelanggan, sanksi SLA..."
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Penilaian Risiko Inheren */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                2. Penilaian Risiko Inheren (Inherent Risk - Tanpa Kontrol)
              </span>
              <div 
                className="px-2.5 py-0.5 rounded-full border text-xs font-bold font-mono"
                style={{ color: inhBadge.color, backgroundColor: inhBadge.bg, borderColor: inhBadge.border }}
              >
                Skor: {inherentScore} ({inhBadge.id})
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Likelihood Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-200">
                    Kemungkinan (Likelihood): {inherentLikelihood}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {LIKELIHOOD_LABELS[inherentLikelihood].freq}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={inherentLikelihood}
                  onChange={(e) => setInherentLikelihood(Number(e.target.value) as LikelihoodScale)}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {LIKELIHOOD_LABELS[inherentLikelihood].label} — {LIKELIHOOD_LABELS[inherentLikelihood].desc}
                </p>
              </div>

              {/* Impact Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-200">
                    Dampak (Impact): {inherentImpact}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {IMPACT_LABELS[inherentImpact].lossEst}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={inherentImpact}
                  onChange={(e) => setInherentImpact(Number(e.target.value) as ImpactScale)}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {IMPACT_LABELS[inherentImpact].label} — {IMPACT_LABELS[inherentImpact].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Pengendalian Internal Eksisting */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>3. Evaluasi Pengendalian Internal Eksisting (Control Assessment)</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Deskripsi Kontrol yang Saat Ini Berjalan
              </label>
              <textarea
                value={existingControls}
                onChange={(e) => setExistingControls(e.target.value)}
                rows={2}
                placeholder="e.g. SOP validasi berjenjang Maker-Checker, backup harian otomatis, firewall..."
                className="w-full bg-[#101723] border border-slate-800 rounded-lg p-2.5 text-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tipe Pengendalian</label>
                <select
                  value={controlType}
                  onChange={(e) => setControlType(e.target.value as ControlType)}
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="PREVENTIVE">Preventif (Mencegah sebelum kejadian)</option>
                  <option value="DETECTIVE">Detektif (Mendeteksi saat/sesudah kejadian)</option>
                  <option value="CORRECTIVE">Korektif (Memulihkan dampak pasca insiden)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Tingkat Efektivitas Kontrol
                </label>
                <select
                  value={controlEffectiveness}
                  onChange={(e) => handleEffectivenessChange(e.target.value as ControlEffectiveness)}
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-semibold text-emerald-400"
                >
                  <option value="STRONG">Efektif / Kuat (Mengurangi L &amp; I secara drastis)</option>
                  <option value="ADEQUATE">Memadai / Cukup (Mengurangi sebagian besar risiko)</option>
                  <option value="WEAK">Kurang / Lemah (Kontrol belum konsisten)</option>
                  <option value="NONE">Tidak Ada / Gagal Total (Risiko Residual = Inheren)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Penilaian Risiko Residual */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                4. Risiko Residual (Setelah Kontrol Dijalankan)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">
                  {inherentScore} ➔
                </span>
                <div 
                  className="px-2.5 py-0.5 rounded-full border text-xs font-bold font-mono"
                  style={{ color: resBadge.color, backgroundColor: resBadge.bg, borderColor: resBadge.border }}
                >
                  Skor: {residualScore} ({resBadge.id})
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Residual L */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-200">
                    Residual Likelihood: {residualLikelihood}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={residualLikelihood}
                  onChange={(e) => setResidualLikelihood(Number(e.target.value) as LikelihoodScale)}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {LIKELIHOOD_LABELS[residualLikelihood].label}
                </p>
              </div>

              {/* Residual I */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-200">
                    Residual Impact: {residualImpact}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={residualImpact}
                  onChange={(e) => setResidualImpact(Number(e.target.value) as ImpactScale)}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {IMPACT_LABELS[residualImpact].label}
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Rencana Aksi Mitigasi (4T) */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              5. Rencana Perlakuan Risiko (Risk Treatment - Strategi 4T)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Strategi 4T</label>
                <select
                  value={actionStrategy}
                  onChange={(e) => setActionStrategy(e.target.value as ActionPlanStrategy)}
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 font-semibold"
                >
                  <option value="TREAT">TREAT (Mitigasi)</option>
                  <option value="TRANSFER">TRANSFER (Asuransi/Pihak 3)</option>
                  <option value="TOLERATE">TOLERATE (Terima)</option>
                  <option value="TERMINATE">TERMINATE (Hentikan)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-medium mb-1">Penanggung Jawab (Action Owner)</label>
                <input
                  type="text"
                  value={actionOwner}
                  onChange={(e) => setActionOwner(e.target.value)}
                  placeholder="e.g. VP Operations, Lead SRE, Manager Kas"
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Tenggat Waktu</label>
                <input
                  type="date"
                  value={actionDeadline}
                  onChange={(e) => setActionDeadline(e.target.value)}
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg px-2.5 py-2 text-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Detail Rencana Aksi Mitigasi</label>
              <textarea
                value={actionPlan}
                onChange={(e) => setActionPlan(e.target.value)}
                rows={2}
                placeholder="Langkah konkret mitigasi, pengadaan alat bantu, pelatihan staf, atau revisi SOP..."
                className="w-full bg-[#101723] border border-slate-800 rounded-lg p-2.5 text-slate-200"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors font-medium cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingRisk ? 'Simpan Perubahan' : 'Daftarkan Risiko ke RCSA'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
