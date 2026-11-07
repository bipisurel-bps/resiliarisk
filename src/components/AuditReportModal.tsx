import React, { useRef } from 'react';
import { RiskItem, KRIItem } from '../types/risk';
import { Printer, Download, Upload, X, FileText } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#131b26] w-full max-w-4xl rounded-2xl border border-stone-300 dark:border-slate-700 shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Controls Header (no-print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-300 bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Laporan Eksekutif Manajemen Risiko &amp; Pusat Ekspor
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 cursor-pointer"
              title="Backup JSON"
            >
              <span>Backup JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 cursor-pointer">
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
              className="p-1.5 rounded-lg text-slate-700 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Audit Report Document Body */}
        <div className="p-8 max-h-[80vh] overflow-y-auto text-xs bg-white text-slate-900 print:p-0">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-800 pb-4 mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-black tracking-tight text-slate-900 font-sans">
                  RESILIA GRC STUDIO
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-blue-700 text-white font-mono font-bold">
                  ISO 31000:2018
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-800">
                LAPORAN EKSEKUTIF PROFIL RISIKO OPERASIONAL &amp; RCSA
              </h2>
              <p className="text-[11px] text-slate-800 font-medium">
                Dokumen Resmi Komite Manajemen Risiko &amp; Pengendalian Internal
              </p>
            </div>

            <div className="text-right text-[11px] text-slate-600 space-y-0.5">
              <div>Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>Klasifikasi: <strong className="text-rose-700 font-bold">RAHASIA / INTERNAL</strong></div>
              <div>Total Risiko: {risks.length} | KRI Aktif: {kris.length}</div>
            </div>
          </div>

          {/* Executive Summary Metrics */}
          <div className="grid grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
            <div>
              <span className="text-[10px] text-slate-800 font-semibold block uppercase">Total Register:</span>
              <span className="text-2xl font-black text-slate-900 font-rank">{risks.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-800 font-semibold block uppercase">Ekstrem Residual:</span>
              <span className="text-2xl font-black text-rose-600 font-rank">
                {risks.filter(r => r.residualLevel === 'EXTREME').length}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-800 font-semibold block uppercase">Tinggi Residual:</span>
              <span className="text-2xl font-black text-orange-600 font-rank">
                {risks.filter(r => r.residualLevel === 'HIGH').length}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-800 font-semibold block uppercase">KRI Peringatan:</span>
              <span className="text-2xl font-black text-amber-600 font-rank">
                {kris.filter(k => k.status === 'RED').length}
              </span>
            </div>
          </div>

          {/* Section: Prioritas Risiko Tinggi & Rencana Mitigasi */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              1. Daftar Prioritas Risiko Yang Memerlukan Aksi Manajemen Segera
            </h4>

            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                  <tr>
                    <th className="p-2.5">Kode</th>
                    <th className="p-2.5">Peristiwa Risiko</th>
                    <th className="p-2.5 text-center">Inheren</th>
                    <th className="p-2.5 text-center">Residual</th>
                    <th className="p-2.5">Rencana Aksi Mitigasi</th>
                    <th className="p-2.5">Owner &amp; Tenggat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {highAndExtreme.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-5 text-center text-slate-800">
                        Tidak ada risiko berlevel Tinggi atau Ekstrem pada posisi residual saat ini.
                      </td>
                    </tr>
                  ) : (
                    highAndExtreme.map(risk => (
                      <tr key={risk.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-bold text-blue-700">{risk.code}</td>
                        <td className="p-2.5 font-semibold text-slate-900">
                          {risk.title}
                          <div className="text-[10px] text-slate-800 font-normal">{risk.department}</div>
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-rose-700">
                          {risk.inherentScore} ({risk.inherentLevel})
                        </td>
                        <td className="p-2.5 text-center font-mono font-bold text-amber-700">
                          {risk.residualScore} ({risk.residualLevel})
                        </td>
                        <td className="p-2.5 text-slate-700">{risk.actionPlan}</td>
                        <td className="p-2.5 text-slate-600 font-medium">
                          {risk.actionOwner}
                          <div className="font-mono text-[10px] text-slate-700">{risk.actionDeadline}</div>
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
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              2. Status Pemantauan Indikator Kunci (Key Risk Indicators - KRI)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {kris.map(kri => (
                <div key={kri.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-blue-700 mr-2">{kri.code}</span>
                    <span className="text-slate-800 font-medium">{kri.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900">{kri.currentValue} {kri.metricUnit}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      kri.status === 'RED' ? 'bg-red-50 text-red-700 border-red-300' : kri.status === 'AMBER' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    }`}>
                      {kri.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="pt-8 mt-10 border-t border-slate-300 grid grid-cols-3 text-center text-[11px]">
            <div>
              <p className="text-slate-600 mb-12 font-medium">Disiapkan Oleh (1st Line):</p>
              <div className="w-36 border-b border-slate-500 mx-auto" />
              <p className="font-bold text-slate-900 mt-1">Operational Risk Officer</p>
            </div>
            <div>
              <p className="text-slate-600 mb-12 font-medium">Ditinjau Oleh (2nd Line):</p>
              <div className="w-36 border-b border-slate-500 mx-auto" />
              <p className="font-bold text-slate-900 mt-1">Head of Risk &amp; Compliance</p>
            </div>
            <div>
              <p className="text-slate-600 mb-12 font-medium">Disetujui Oleh:</p>
              <div className="w-36 border-b border-slate-500 mx-auto" />
              <p className="font-bold text-slate-900 mt-1">Komite Risiko &amp; Direksi</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
