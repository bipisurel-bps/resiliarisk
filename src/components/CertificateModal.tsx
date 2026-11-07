import React from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Printer, Award, ShieldCheck, CheckCircle2, Download } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  const certId = user.progress.certificateId || `RESILIA-ISO31000-${new Date().getFullYear()}-00918`;
  const certDate = user.progress.certificateDate || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white max-w-4xl w-full rounded-2xl sm:rounded-3xl border border-stone-300 shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden during print) */}
        <div className="no-print px-6 py-3.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span className="font-extrabold text-sm text-slate-900">
              Sertifikat Kelulusan Resmi ISO 31000
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Unduh PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame (A4 Landscape aspect) */}
        <div className="p-6 sm:p-10 bg-[#FCFBF8] text-center select-none" id="resilia-printable-certificate">
          <div className="border-8 border-double border-amber-600/40 p-6 sm:p-10 rounded-2xl relative bg-white shadow-inner">
            
            {/* Corner Decorative Flares */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

            {/* Institution Header */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-black text-slate-900 tracking-wider text-base sm:text-lg uppercase">
                RESILIA RISK ACADEMY
              </span>
            </div>

            <p className="text-[11px] font-bold text-amber-800 tracking-widest uppercase mb-6">
              CENTER FOR ENTERPRISE OPERATIONAL RISK &amp; ISO 31000 STUDIES
            </p>

            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-wide uppercase font-serif mb-2">
              SERTIFIKAT KOMPETENSI
            </h1>
            <p className="text-xs text-slate-600 italic mb-6">
              Nomor Registrasi: <span className="font-mono font-bold text-slate-800">{certId}</span>
            </p>

            <p className="text-xs sm:text-sm text-slate-700 font-medium mb-2">
              Diberikan secara terhormat kepada:
            </p>

            {/* Candidate Name */}
            <div className="my-3 py-1 border-b-2 border-stone-300 inline-block min-w-[280px]">
              <span className="text-xl sm:text-3xl font-black text-blue-900 tracking-tight font-serif">
                {user.name}
              </span>
            </div>

            <p className="text-xs text-slate-600 font-semibold mb-6">
              {user.institution} • {user.role}
            </p>

            {/* Citation */}
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-800 leading-relaxed font-medium mb-8">
              Atas kelulusan dan keberhasilan menguasai kompetensi dasar <strong>Manajemen Risiko Operasional</strong> sesuai standar internasional <strong>ISO 31000:2018</strong>, pemahaman <strong>The IIA's Three Lines Model</strong>, serta metodologi perancangan <strong>Risk &amp; Control Self-Assessment (RCSA)</strong> dan Key Risk Indicators (KRI).
            </p>

            {/* Signatures & Seal Grid */}
            <div className="grid grid-cols-3 items-end pt-4 border-t border-stone-200 text-xs">
              
              {/* Date & Location */}
              <div className="text-left">
                <p className="text-slate-600 font-semibold">Diterbitkan pada:</p>
                <p className="font-bold text-slate-900 mt-0.5">{certDate}</p>
                <p className="text-[10px] text-slate-500 font-medium">Jakarta, Indonesia</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="w-12 h-12 bg-white border border-stone-300 p-0.5 rounded shadow-2xs">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://resiliarisk.web.id/verify/${certId}`} 
                      alt="QR Validasi Sertifikat" 
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-[9px] text-left text-slate-600 font-mono leading-tight">
                    <p className="font-bold text-slate-800">Scan QR Validasi</p>
                    <p>ISO 31000:2018</p>
                    <p className="text-emerald-700 font-bold">Terverifikasi Sah</p>
                  </div>
                </div>
              </div>

              {/* Gold Seal Center */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-1 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-amber-800 flex flex-col items-center justify-center text-amber-950">
                    <Award className="w-6 h-6 text-amber-900" />
                    <span className="text-[8px] font-black uppercase tracking-tighter">VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Academic Signature Right */}
              <div className="text-right">
                <div className="h-10 flex items-center justify-end">
                  <span className="font-serif italic font-bold text-blue-900 text-sm">
                    Resilia Academic Board
                  </span>
                </div>
                <div className="border-t border-stone-400 pt-1">
                  <p className="font-bold text-slate-900">Komite Manajemen Risiko</p>
                  <p className="text-[10px] text-slate-600 font-semibold">ISO 31000 Global Lead Assessor</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="no-print px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Sertifikat ini sah dan dapat dilampirkan pada portofolio profesional atau LinkedIn.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-700 hover:text-slate-900 font-bold hover:bg-stone-200 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
