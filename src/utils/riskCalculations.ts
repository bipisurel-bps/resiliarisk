import { RiskLevel, LikelihoodScale, ImpactScale, ControlEffectiveness } from '../types/risk';

/**
 * Standard ISO 31000:2018 5x5 Heatmap Matrix Calculation
 * Likelihood (1-5) x Impact (1-5) = Score (1-25)
 */
export function calculateRiskLevel(likelihood: LikelihoodScale, impact: ImpactScale): RiskLevel {
  const score = likelihood * impact;
  
  if (score >= 15) return 'EXTREME';
  if (score >= 10) return 'HIGH';
  if (score >= 5) return 'MEDIUM';
  return 'LOW';
}

export function getRiskLevelLabel(level: RiskLevel): { id: string; en: string; color: string; bg: string; border: string } {
  switch (level) {
    case 'EXTREME':
      return {
        id: 'Ekstrem / Kritis',
        en: 'Extreme / Critical',
        color: '#dc2626',
        bg: '#fef2f2',
        border: '#fecaca',
      };
    case 'HIGH':
      return {
        id: 'Tinggi',
        en: 'High',
        color: '#ea580c',
        bg: '#fff7ed',
        border: '#fed7aa',
      };
    case 'MEDIUM':
      return {
        id: 'Moderat / Sedang',
        en: 'Medium / Moderate',
        color: '#d97706',
        bg: '#fffbeb',
        border: '#fde68a',
      };
    case 'LOW':
    default:
      return {
        id: 'Rendah',
        en: 'Low',
        color: '#059669',
        bg: '#ecfdf5',
        border: '#a7f3d0',
      };
  }
}

export const LIKELIHOOD_LABELS: Record<LikelihoodScale, { label: string; desc: string; freq: string }> = {
  1: { label: '1 - Sangat Jarang', desc: 'Hampir tidak pernah terjadi', freq: '< 1x dalam 3-5 tahun' },
  2: { label: '2 - Jarang', desc: 'Kemungkinan kecil terjadi', freq: '1x dalam 1-2 tahun' },
  3: { label: '3 - Sedang / Kadang', desc: 'Dapat terjadi dalam kondisi normal', freq: '1-2x per tahun' },
  4: { label: '4 - Sering', desc: 'Sangat mungkin terjadi', freq: 'Beberapa kali dalam sebulan' },
  5: { label: '5 - Hampir Pasti', desc: 'Pasti/hampir selalu terjadi', freq: 'Mingguan / Harian' },
};

export const IMPACT_LABELS: Record<ImpactScale, { label: string; desc: string; lossEst: string }> = {
  1: { label: '1 - Tidak Signifikan', desc: 'Dampak operasional terabaikan', lossEst: '< Rp 10 Juta' },
  2: { label: '2 - Minor', desc: 'Dampak kecil, tertangani tim internal', lossEst: 'Rp 10 Jt - Rp 50 Jt' },
  3: { label: '3 - Moderat', desc: 'Gangguan proses, butuh eskalasi manajemen', lossEst: 'Rp 50 Jt - Rp 250 Jt' },
  4: { label: '4 - Signifikan / Mayor', desc: 'Kerugian besar, reputasi terancam', lossEst: 'Rp 250 Jt - Rp 1 Miliar' },
  5: { label: '5 - Katastropik / Bencana', desc: 'Kelumpuhan bisnis, sanksi regulasi berat', lossEst: '> Rp 1 Miliar' },
};

export function getCategoryBadge(cat: string): { label: string; color: string; bg: string } {
  switch (cat) {
    case 'PEOPLE':
      return { label: 'Manusia (People & Fraud)', color: '#be185d', bg: '#fdf2f8' };
    case 'SYSTEM':
      return { label: 'Sistem & IT / Cyber', color: '#0369a1', bg: '#f0f9ff' };
    case 'PROCESS':
      return { label: 'Proses & Prosedur', color: '#1d4ed8', bg: '#eff6ff' };
    case 'EXTERNAL':
    default:
      return { label: 'Kejadian Eksternal', color: '#6d28d9', bg: '#f5f3ff' };
  }
}

/**
 * Otomatis menghitung rekomendasi Residual Risk berdasarkan efektivitas kontrol
 */
export function estimateResidualValues(
  inherentL: LikelihoodScale,
  inherentI: ImpactScale,
  effectiveness: ControlEffectiveness
): { residualL: LikelihoodScale; residualI: ImpactScale } {
  if (effectiveness === 'NONE') {
    return { residualL: inherentL, residualI: inherentI };
  }
  if (effectiveness === 'WEAK') {
    const l = Math.max(1, inherentL - 1) as LikelihoodScale;
    return { residualL: l, residualI: inherentI };
  }
  if (effectiveness === 'ADEQUATE') {
    const l = Math.max(1, inherentL - 2) as LikelihoodScale;
    const i = Math.max(1, inherentI - 1) as ImpactScale;
    return { residualL: l, residualI: i };
  }
  // STRONG
  const l = Math.max(1, inherentL - 3) as LikelihoodScale;
  const i = Math.max(1, inherentI - 2) as ImpactScale;
  return { residualL: l, residualI: i };
}
