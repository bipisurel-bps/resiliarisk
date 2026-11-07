import React, { useRef } from 'react';
import { RiskItem, KRIItem } from '../types/risk';
import { getRiskLevelLabel } from '../utils/riskCalculations';
import { Printer, Download, Upload, X, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  risks: RiskItem[];
  kris: KRIItem[];
  onImportJson: (importedRisks: RiskItem[]) => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({
  isOpen,
  onClose,
  risks,
  kris,
  onImportJson,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    const headers = [
      'Kode Risiko',
      'Judul Risiko',
      'Departemen',
      'Kategori',
      'Akar Penyebab',
      'Peristiwa',
      'Dampak Finansial',
      'Inherent L',
      'Inherent I',
      'Inherent Score',
      'Inherent Level',
      'Pengendalian Eksisting',
      'Tipe Kontrol',
      'Efektivitas Kontrol',
      'Residual L',
      'Residual I',
      'Residual Score',
      'Residual Level',
      'Rencana Aksi Mitigasi',
      'Strategi 4T',
      'Penanggung Jawab',
      'Tenggat Waktu',
      'Status'
    ];

    const rows = risks.map(r => [
      `"${r.code}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.department.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${r.cause.replace(/"/g, '""')}"`,
      `"${r.event.replace(/"/g, '""')}"`,
      `"${r.impactDescription.replace(/"/g, '""')}"`,
      r.inherentLikelihood,
      r.inherentImpact,
      r.inherentScore,
      `"${r.inherentLevel}"`,
      `"${r.existingControls.replace(/"/g, '""')}"`,
      `"${r.controlType}"`,
      `"${r.controlEffectiveness}"`,
      r.residualLikelihood,
      r.residualImpact,
      r.residualScore,
      `"${r.residualLevel}"`,
      `"${r.actionPlan.replace(/"/g, '""')}"`,
      `"${r.actionStrategy}"`,
      `"${r.actionOwner.replace(/"/g, '""')}"`,
      `"${r.actionDeadline}"`,
      `"${r.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Resilia_RCSA_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(risks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `resilia_rcsa_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportJson(parsed);
            alert(`Berhasil mengimpor ${parsed.length} risiko ke dalam lembar kerja!`);
            onClose();
          } else {
            alert('Format file JSON tidak valid.');
          }
        } catch {
          alert('Gagal membaca file JSON.');
        }
      };
    }
  };

  const highAndExtreme = risks.filter(r => r.residualLevel === 'EXTREME' || r.residualLevel === 'HIGH');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card w-full max-w-4xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Controls Header (no-print) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#101723] no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Laporan Eksekutif Manajemen Risiko &amp; Pusat Ekspor
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer"
              title="Backup JSON"
            >
              <span>Backup JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Audit Report Document Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto text-xs bg-[#0b0f17] print:bg-white print:text-black">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-700 pb-4 mb-5 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-extrabold tracking-tight text-white print:text-black font-sans">
                  RESILIA GRC STUDIO
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-mono">
                  ISO 31000:2018
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-200 print:text-gray-800">
                LAPORAN EKSEKUTIF PROFIL RISIKO OPERASIONAL &amp; RCSA
              </h2>
              <p className="text-[11px] text-slate-400 print:text-gray-500">
                Dokumen Resmi Komite Manajemen Risiko &amp; Pengendalian Internal
              </p>
            </div>

            <div className="text-right text-[11px] text-slate-400 print:text-gray-600">
              <div>Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>Klasifikasi: <strong className="text-amber-400 print:text-black font-semibold">RAHASIA / INTERNAL</strong></div>
              <div>Total Risiko: {risks.length} | KRI Aktif: {kris.length}</div>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#101723] print:bg-gray-100 border border-slate-800 mb-5">
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600 block">Total Register:</span>
              <span className="text-xl font-bold text-white print:text-black font-rank">{risks.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600 block">Risiko Ekstrem Residual:</span>
              <span className="text-xl font-bold text-rose-400 print:text-red-600 font-rank">
                {risks.filter(r => r.residualLevel === 'EXTREME').length}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600 block">Risiko Tinggi Residual:</span>
              <span className="text-xl font-bold text-orange-400 print:text-orange-600 font-rank">
                {risks.filter(r => r.residualLevel === 'HIGH').length}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 print:text-gray-600 block">KRI Ambang Bahaya:</span>
              <span className="text-xl font-bold text-amber-400 print:text-black font-rank">
                {kris.filter(k => k.status === 'RED').length}
              </span>
            </div>
          </div>

          {/* Section: Prioritas Risiko Tinggi & Rencana Mitigasi */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-white print:text-black uppercase tracking-wider mb-2">
              1. Daftar Prioritas Risiko Yang Memerlukan Aksi Manajemen Segera
            </h4>

            <div className="border border-slate-800 print:border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-[#101723] print:bg-gray-200 border-b border-slate-800 text-slate-400 print:text-gray-700">
                  <tr>
                    <th className="p-2">Kode</th>
                    <th className="p-2">Peristiwa Risiko</th>
                    <th className="p-2 text-center">Inheren</th>
                    <th className="p-2 text-center">Residual</th>
                    <th className="p-2">Rencana Aksi Mitigasi</th>
                    <th className="p-2">Owner &amp; Tenggat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                  {highAndExtreme.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400">
                        Tidak ada risiko berlevel Tinggi atau Ekstrem pada posisi residual saat ini.
                      </td>
                    </tr>
                  ) : (
                    highAndExtreme.map(risk => (
                      <tr key={risk.id}>
                        <td className="p-2 font-mono font-bold text-blue-400 print:text-blue-700">{risk.code}</td>
                        <td className="p-2 font-medium text-slate-200 print:text-black">
                          {risk.title}
                          <div className="text-[10px] text-slate-400 print:text-gray-600">{risk.department}</div>
                        </td>
                        <td className="p-2 text-center font-mono font-bold text-rose-400 print:text-red-700">
                          {risk.inherentScore} ({risk.inherentLevel})
                        </td>
                        <td className="p-2 text-center font-mono font-bold text-amber-400 print:text-amber-700">
                          {risk.residualScore} ({risk.residualLevel})
                        </td>
                        <td className="p-2 text-slate-300 print:text-gray-800">{risk.actionPlan}</td>
                        <td className="p-2 text-slate-400 print:text-gray-600">
                          {risk.actionOwner}
                          <div className="font-mono text-[10px]">{risk.actionDeadline}</div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Status Key Risk Indicators */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-white print:text-black uppercase tracking-wider mb-2">
              2. Status Pemantauan Indikator Kunci (Key Risk Indicators - KRI)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {kris.map(kri => (
                <div key={kri.id} className="p-2 rounded bg-[#101723] print:bg-gray-100 border border-slate-800 print:border-gray-300 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-blue-400 print:text-blue-700 mr-2">{kri.code}</span>
                    <span className="text-slate-200 print:text-black">{kri.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-white print:text-black">{kri.currentValue} {kri.metricUnit}</span>
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      kri.status === 'RED' ? 'bg-red-500/20 text-red-400' : kri.status === 'AMBER' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {kri.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures Footer (Print standard) */}
          <div className="pt-6 mt-8 border-t border-slate-800 print:border-gray-400 grid grid-cols-3 text-center text-[11px]">
            <div>
              <p className="text-slate-400 print:text-gray-600 mb-10">Disiapkan Oleh (1st Line):</p>
              <div className="w-32 border-b border-slate-600 mx-auto" />
              <p className="font-bold text-slate-200 print:text-black mt-1">Operational Risk Officer</p>
            </div>
            <div>
              <p className="text-slate-400 print:text-gray-600 mb-10">Ditinjau Oleh (2nd Line):</p>
              <div className="w-32 border-b border-slate-600 mx-auto" />
              <p className="font-bold text-slate-200 print:text-black mt-1">Head of Risk &amp; Compliance</p>
            </div>
            <div>
              <p className="text-slate-400 print:text-gray-600 mb-10">Disetujui Oleh:</p>
              <div className="w-32 border-b border-slate-600 mx-auto" />
              <p className="font-bold text-slate-200 print:text-black mt-1">Komite Risiko &amp; Direksi</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
