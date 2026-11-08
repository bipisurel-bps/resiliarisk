import React, { useState } from 'react';
import { 
  ISO_PRINCIPLES, 
  THREE_LINES_MODEL, 
  BASEL_CATEGORIES, 
  CASE_STUDIES, 
  ISO_QUIZZES 
} from '../data/iso31000Guide';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Award, 
  ShieldCheck, 
  AlertTriangle, 
  Compass, 
  Flame, 
  RotateCcw,
  UserCheck,
  Building,
  Printer
} from 'lucide-react';

interface IsoAcademyProps {
  onOpenCertificateModal?: () => void;
}

export const IsoAcademy: React.FC<IsoAcademyProps> = ({ onOpenCertificateModal }) => {
  const { user, isAuthenticated, openAuthModal, updateProgress, issueCertificate } = useAuth();

  const [activeTab, setActiveTab] = useState<'modules' | 'simulator' | 'quiz' | 'certificate'>('modules');
  const [selectedCurriculumSection, setSelectedCurriculumSection] = useState<'principles' | 'anatomy' | 'basel' | 'lines' | 'treatment'>('principles');

  // Case Study Simulator state
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [selectedCaseOption, setSelectedCaseOption] = useState<string | null>(null);

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQuiz = ISO_QUIZZES[currentQuizIdx];
  const activeCase = CASE_STUDIES[selectedCaseIdx];

  const handleSelectOption = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (currentQuiz.options[idx].isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentQuizIdx < ISO_QUIZZES.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setCompleted(true);
      const finalScore = quizScore;
      updateProgress('iso-31000-exam', finalScore);

      try {
        localStorage.setItem('resilia_pending_quiz_result', JSON.stringify({
          score: finalScore,
          passed: finalScore >= 7,
          timestamp: new Date().toISOString()
        }));
      } catch (e) {}

      // If passed (score >= 7 out of 10) and user is authenticated
      if (finalScore >= 7 && isAuthenticated) {
        issueCertificate();
      }
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScore(0);
    setCompleted(false);
  };

  const handleClaimCertificate = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    issueCertificate();
    if (onOpenCertificateModal) {
      onOpenCertificateModal();
    }
  };

  const passPercentage = Math.round((quizScore / ISO_QUIZZES.length) * 100);
  const isPassed = completed && quizScore >= 7;

  return (
    <div className="academy-shell glass-card p-4 sm:p-7 mb-8">
      
      {/* Academy Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-700 text-white shadow-sm shadow-blue-700/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                  Resilia Risk Academy &amp; ISO 31000
                </h2>
                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  Kurikulum 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
                Materi mandiri, studi kasus, dan latihan keputusan untuk memahami dasar manajemen risiko.
              </p>
            </div>
          </div>
        </div>

        {/* User Progress Mini Card */}
        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 p-2.5 bg-stone-100 rounded-2xl border border-stone-300">
          <div className="text-left text-xs">
            <p className="font-bold text-slate-900">
              {user ? user.name : 'Peserta Belajar'}
            </p>
            <p className="text-[11px] text-slate-700 font-semibold">
              {user?.progress.certificateEarned ? 'Pembelajaran selesai' : 'Target: selesaikan jalur belajar'}
            </p>
          </div>

          {user?.progress.certificateEarned ? (
            <button
              onClick={onOpenCertificateModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-amber-950 bg-amber-300 hover:bg-amber-400 border border-amber-400 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Award className="w-4 h-4 text-amber-900" />
              <span>Sertifikat Saya</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('quiz')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ambil Ujian</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 my-6 p-1.5 bg-stone-100 rounded-2xl border border-stone-300 text-xs sm:text-sm font-black overflow-x-auto">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'modules'
              ? 'bg-white text-blue-900 shadow-sm border border-stone-300'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-700" />
          <span>1. Kurikulum &amp; Modul Belajar</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'simulator'
              ? 'bg-white text-blue-900 shadow-sm border border-stone-300'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-600" />
          <span>2. Simulator Keputusan Riil</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'bg-white text-blue-900 shadow-sm border border-stone-300'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>3. Ujian Evaluasi Kompetensi</span>
        </button>

        <button
          onClick={() => setActiveTab('certificate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'certificate'
              ? 'bg-white text-blue-900 shadow-sm border border-stone-300'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>4. Sertifikat Kelulusan</span>
        </button>
      </div>

      {/* TAB 1: KURIKULUM & MODUL BELAJAR */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Sub-selector for Curriculum Topics */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-50 rounded-xl border border-stone-200 text-xs font-bold">
            <button
              onClick={() => setSelectedCurriculumSection('principles')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCurriculumSection === 'principles'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'text-slate-800 hover:bg-stone-200'
              }`}
            >
              8 Prinsip ISO 31000
            </button>

            <button
              onClick={() => setSelectedCurriculumSection('anatomy')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCurriculumSection === 'anatomy'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'text-slate-800 hover:bg-stone-200'
              }`}
            >
              Anatomi Risiko (Cause-Event-Impact)
            </button>

            <button
              onClick={() => setSelectedCurriculumSection('basel')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCurriculumSection === 'basel'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'text-slate-800 hover:bg-stone-200'
              }`}
            >
              7 Kategori Basel II
            </button>

            <button
              onClick={() => setSelectedCurriculumSection('lines')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCurriculumSection === 'lines'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'text-slate-800 hover:bg-stone-200'
              }`}
            >
              Model Tiga Lini (Three Lines)
            </button>

            <button
              onClick={() => setSelectedCurriculumSection('treatment')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCurriculumSection === 'treatment'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'text-slate-800 hover:bg-stone-200'
              }`}
            >
              Strategi 4T Perlakuan Risiko
            </button>
          </div>

          {/* Sub-topic 1: 8 Prinsip ISO 31000 */}
          {selectedCurriculumSection === 'principles' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs sm:text-sm text-blue-950 font-medium leading-relaxed">
                🎯 <strong>Tujuan Utama ISO 31000:2018:</strong> Menciptakan dan melindungi nilai <em>(Value Creation and Protection)</em> bagi organisasi. Manajemen risiko meningkatkan kinerja, mendorong inovasi, dan mendukung pencapaian sasaran strategis.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ISO_PRINCIPLES.map(p => (
                  <div
                    key={p.number}
                    className="p-5 rounded-2xl bg-white border border-stone-300 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-black font-rank text-blue-700">
                          {p.number}
                        </span>
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-slate-900">
                            {p.title}
                          </h3>
                          <p className="text-xs text-slate-700 font-bold">
                            {p.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-800 leading-relaxed font-medium mb-3.5">
                        {p.description}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-xs text-slate-800">
                      <span className="text-emerald-800 font-black block mb-1">
                        Contoh Praktis di Lapangan:
                      </span>
                      <p className="font-medium leading-relaxed">{p.practicalExample}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-topic 2: Anatomi Risiko */}
          {selectedCurriculumSection === 'anatomy' && (
            <div className="space-y-5 text-xs sm:text-sm">
              <div className="p-6 rounded-2xl bg-white border border-stone-300 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900">
                  Formula Baku Anatomi Risiko: Cause ➔ Event ➔ Impact
                </h3>
                <p className="text-slate-800 font-medium leading-relaxed">
                  Banyak pemula sering keliru merumuskan risiko karena mencampuradukkan antara <em>akar penyebab</em>, <em>kejadian risiko</em>, dan <em>konsekuensi kerugian</em>. Berikut cara membedakannya:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block mb-1">
                      1. Akar Penyebab (Root Cause)
                    </span>
                    <p className="font-black text-slate-900 text-sm mb-1.5">"Mengapa bisa terjadi?"</p>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed">
                      Kondisi pemicu: bug software, kelalaian manusia, kabel optik terputus, vendor ingkar janji, atau ketiadaan SOP tertulis.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-300">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 block mb-1">
                      2. Peristiwa Risiko (Risk Event)
                    </span>
                    <p className="font-black text-slate-900 text-sm mb-1.5">"Apa kejadian aktualnya?"</p>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed">
                      Titik kejadian operasional: API payment gateway timeout 2 jam, kasir salah transfer dana Rp 50 Juta, file data nasabah bocor ke forum publik.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-300">
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-900 block mb-1">
                      3. Dampak (Consequence)
                    </span>
                    <p className="font-black text-slate-900 text-sm mb-1.5">"Berapa kerugiannya?"</p>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed">
                      Konsekuensi akhir: hilangnya pendapatan tunai, denda sanksi regulator, reputasi merek anjlok, atau gugatan hukum perdata.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-medium">
                  💡 <strong>Kunci Sukses RCSA:</strong> Pengendalian <em>Preventif</em> dirancang untuk mematikan <strong>Penyebab (Cause)</strong>, sedangkan pengendalian <em>Korektif</em> dirancang untuk memperkecil <strong>Dampak (Impact)</strong>.
                </div>
              </div>
            </div>
          )}

          {/* Sub-topic 3: 7 Taksonomi Basel II */}
          {selectedCurriculumSection === 'basel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs sm:text-sm text-amber-950 font-medium">
                🏛️ <strong>Standar Basel II:</strong> Mengklasifikasikan risiko operasional menjadi 7 taksonomi peristiwa untuk memastikan seluruh spektrum kerugian teridentifikasi tanpa tumpang tindih.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BASEL_CATEGORIES.map(b => (
                  <div key={b.code} className="p-5 rounded-2xl bg-white border border-stone-300 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                        {b.code}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {b.name}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-slate-900 mb-1.5">
                      {b.nameId}
                    </h4>

                    <p className="text-xs text-slate-800 font-medium leading-relaxed mb-3">
                      {b.definition}
                    </p>

                    <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs mb-2">
                      <span className="font-bold text-slate-900 block mb-0.5">Contoh Kasus:</span>
                      <ul className="list-disc pl-4 text-slate-800 space-y-0.5 font-medium">
                        {b.examples.map((ex, i) => (
                          <li key={i}>{ex}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[11px] text-emerald-900 font-bold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      🛡️ Mitigasi: {b.preventiveControl}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-topic 4: Three Lines Model */}
          {selectedCurriculumSection === 'lines' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <p className="text-slate-800 font-semibold leading-relaxed">
                Model Tiga Lini (The IIA's Three Lines Model) adalah kerangka tata kelola global yang membedakan akuntabilitas antara eksekusi operasional, pengawasan risiko, dan audit independen:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {THREE_LINES_MODEL.map((line, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border-2 border-stone-300 flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: line.color }}>
                        {line.line}
                      </div>
                      <h3 className="text-base font-black text-slate-900 mb-2">
                        {line.owner}
                      </h3>
                      <div className="inline-block px-2.5 py-1 rounded-md bg-stone-100 text-slate-900 font-bold mb-3 border border-stone-300">
                        Peran: {line.role}
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {line.duty}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-slate-700 font-bold">
                      {idx === 0 && '👉 Mengisi lembar RCSA & mengelola kontrol harian.'}
                      {idx === 1 && '👉 Meninjau & memvalidasi skor risiko serta batas KRI.'}
                      {idx === 2 && '👉 Menguji efektivitas kepatuhan secara independen.'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-topic 5: 4T Treatment Strategy */}
          {selectedCurriculumSection === 'treatment' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="p-6 rounded-2xl bg-white border border-stone-300 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900">
                  Kerangka Perlakuan Risiko (4T: Tolerate, Treat, Transfer, Terminate)
                </h3>
                <p className="text-slate-800 font-medium leading-relaxed">
                  Setelah mengukur level risiko residual, organisasi wajib mengambil satu dari empat keputusan strategis berikut:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-700 text-white mb-2 inline-block">
                      1. TOLERATE (Menerima)
                    </span>
                    <p className="font-black text-slate-900 mb-1">Menerima risiko tanpa kontrol tambahan.</p>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed">
                      Dipilih apabila biaya pemasangan mitigasi jauh lebih mahal dibanding potensi kerugian yang terjadi, atau level risiko sudah berada di zona Rendah (skor 1-4).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-300">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-700 text-white mb-2 inline-block">
                      2. TREAT (Memitigasi)
                    </span>
                    <p className="font-black text-slate-900 mb-1">Memasang kontrol pencegahan / peredam dampak.</p>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed">
                      Tindakan paling umum: SOP baru, validasi sistem otomatis, sistem Maker-Checker, backup data berkala, pelatihan staf.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-700 text-white mb-2 inline-block">
                      3. TRANSFER (Mengalihkan)
                    </span>
                    <p className="font-black text-slate-900 mb-1">Mengalihkan beban finansial ke pihak ketiga.</p>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed">
                      Membeli polis asuransi (Property, Cyber, Business Interruption), perjanjian SLA dengan vendor outsource, atau hedging keuangan.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-300">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-rose-700 text-white mb-2 inline-block">
                      4. TERMINATE (Menghindari)
                    </span>
                    <p className="font-black text-slate-900 mb-1">Menghentikan atau membatalkan aktivitas berisiko.</p>
                    <p className="text-slate-800 text-xs font-medium leading-relaxed">
                      Dilakukan jika level risiko terlalu ekstrem dan tidak ada kontrol yang sanggup meredamnya (misal: membatalkan peluncuran fitur pinjaman ilegal).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SIMULATOR KEPUTUSAN RIIL */}
      {activeTab === 'simulator' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Simulator Studi Kasus Industri
              </h3>
              <p className="text-xs text-slate-700 font-semibold">
                Pilih keputusan mitigasi terbaik dan lihat dampaknya terhadap skor residual secara interaktif.
              </p>
            </div>

            {/* Case selector pills */}
            <div className="flex items-center gap-2">
              {CASE_STUDIES.map((cs, idx) => (
                <button
                  key={cs.id}
                  onClick={() => {
                    setSelectedCaseIdx(idx);
                    setSelectedCaseOption(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedCaseIdx === idx
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-stone-100 text-slate-800 hover:bg-stone-200 border border-stone-300'
                  }`}
                >
                  Kasus {idx + 1}: {cs.industry.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Active Case Card */}
          <div className="p-6 rounded-2xl bg-white border border-stone-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-stone-200">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                Sektor: {activeCase.industry}
              </span>
              <div className="text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                Skor Inheren Awal: {activeCase.initialInherentScore} (Ekstrem / Bencana)
              </div>
            </div>

            <h4 className="text-base font-black text-slate-900">
              "{activeCase.title}"
            </h4>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {activeCase.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-100 border border-stone-200">
                <span className="font-black text-slate-900 block mb-0.5">Penyebab (Root Cause):</span>
                <p className="text-slate-800 font-medium">{activeCase.rootCause}</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-100 border border-stone-200">
                <span className="font-black text-slate-900 block mb-0.5">Peristiwa Risiko:</span>
                <p className="text-slate-800 font-medium">{activeCase.riskEvent}</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-100 border border-stone-200">
                <span className="font-black text-slate-900 block mb-0.5">Dampak Awal:</span>
                <p className="text-slate-800 font-medium">{activeCase.initialImpact}</p>
              </div>
            </div>

            {/* Decision options */}
            <div className="pt-2">
              <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
                Pilih Keputusan Mitigasi Anda:
              </h5>

              <div className="space-y-3">
                {activeCase.options.map(opt => {
                  const isSelected = selectedCaseOption === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedCaseOption(opt.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                          : 'border-stone-300 hover:border-slate-400 bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setSelectedCaseOption(opt.id)}
                            className="mt-1 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.2 rounded bg-stone-200 text-slate-900">
                                Strategi: {opt.strategyType}
                              </span>
                              <span className="text-xs font-bold text-slate-700">
                                Biaya: {opt.financialCost}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                              {opt.action}
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="shrink-0 text-right">
                            <span className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                              opt.outcomeVerdict === 'Optimal'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : opt.outcomeVerdict === 'Sub-optimal'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}>
                              Hasil: {opt.outcomeVerdict}
                            </span>
                            <p className="text-[11px] font-black text-slate-800 mt-1">
                              Residual: Skor {opt.residualScore}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Explanation if selected */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-blue-200 text-xs font-medium text-slate-800 leading-relaxed bg-white/80 p-3 rounded-lg">
                          <strong>Analisis Pakar:</strong> {opt.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UJIAN EVALUASI KOMPETENSI (10 SOAL) */}
      {activeTab === 'quiz' && (
        <div className="p-5 sm:p-7 rounded-2xl bg-white border border-stone-300 shadow-sm text-xs sm:text-sm">
          {!completed ? (
            <div>
              {/* Progress & Score Bar */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-blue-800 uppercase font-mono bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    Soal {currentQuizIdx + 1} dari {ISO_QUIZZES.length}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-900">
                  Skor Saat Ini: <span className="text-emerald-700 font-black">{quizScore} Benar</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-5">
                <div 
                  className="h-full bg-blue-700 transition-all duration-300"
                  style={{ width: `${((currentQuizIdx) / ISO_QUIZZES.length) * 100}%` }}
                />
              </div>

              {/* Skenario */}
              <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 mb-4">
                <span className="text-[11px] uppercase font-black text-slate-700 block mb-1">
                  Studi Kasus:
                </span>
                <p className="text-slate-900 text-sm leading-relaxed font-bold">
                  "{currentQuiz.scenario}"
                </p>
              </div>

              {/* Pertanyaan */}
              <h3 className="text-base font-black text-slate-900 mb-4 leading-snug">
                {currentQuiz.question}
              </h3>

              {/* Pilihan Jawaban */}
              <div className="space-y-2.5 mb-5">
                {currentQuiz.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let btnClass = 'bg-stone-50 border-stone-300 text-slate-900 hover:border-slate-500 hover:bg-stone-100';

                  if (showExplanation) {
                    if (opt.isCorrect) {
                      btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black';
                    } else if (isSelected && !opt.isCorrect) {
                      btnClass = 'bg-rose-50 border-rose-500 text-rose-950';
                    }
                  } else if (isSelected) {
                    btnClass = 'border-blue-700 bg-blue-50 text-blue-950 font-black';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${btnClass}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {showExplanation && opt.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        ) : showExplanation && isSelected && !opt.isCorrect ? (
                          <XCircle className="w-5 h-5 text-rose-700" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs font-black text-slate-900">
                            {String.fromCharCode(65 + idx)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{opt.text}</span>
                        {showExplanation && (
                          <p className={`mt-2 text-xs font-medium leading-relaxed ${opt.isCorrect ? 'text-emerald-900' : 'text-rose-900'}`}>
                            {opt.explanation}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Next Question Button */}
              {showExplanation && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuiz}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black cursor-pointer shadow-md text-xs sm:text-sm active:scale-95"
                  >
                    <span>{currentQuizIdx < ISO_QUIZZES.length - 1 ? 'Pertanyaan Selanjutnya' : 'Selesaikan & Lihat Hasil'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
                <Award className="w-10 h-10 text-amber-700" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {isPassed ? 'Selamat! Anda Dinyatakan LULUS!' : 'Evaluasi Selesai'}
                </h3>
                <p className="text-sm font-bold text-slate-700 mt-1">
                  Skor Anda: <strong className="text-emerald-700 font-black">{quizScore} / {ISO_QUIZZES.length} Benar ({passPercentage}%)</strong>
                </p>
              </div>

              <p className="max-w-md mx-auto text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {isPassed
                  ? 'Anda telah menyelesaikan evaluasi pembelajaran Resilia. Sertifikat yang tersedia mencatat penyelesaian kursus, bukan sertifikasi profesi.'
                  : 'Batas kelulusan minimum adalah 70% (7 Benar). Pelajari kembali materi modul dan silakan ulangi evaluasi.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                {isPassed && (
                  <button
                    onClick={handleClaimCertificate}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm cursor-pointer shadow-md active:scale-95"
                  >
                    <Award className="w-4 h-4 text-amber-900" />
                    <span>
                      {isAuthenticated ? 'Lihat bukti penyelesaian belajar' : 'Masuk / Daftar untuk melihat bukti belajar'}
                    </span>
                  </button>
                )}

                <button
                  onClick={handleResetQuiz}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-slate-900 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Ujian</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SERTIFIKAT KELULUSAN */}
      {activeTab === 'certificate' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-300 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 p-1 shadow-md flex items-center justify-center">
            <Award className="w-10 h-10 text-amber-900" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              Sertifikat Penyelesaian Pembelajaran Manajemen Risiko
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-semibold mt-1">
              Bukti bahwa peserta telah menyelesaikan modul dan evaluasi pembelajaran Resilia.
            </p>
          </div>

          {user?.progress.certificateEarned ? (
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-300 max-w-lg mx-auto text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">Nomor Registrasi:</span>
                <span className="font-mono font-black text-blue-900 text-xs">
                  {user.progress.certificateId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">Nama Pemegang:</span>
                <span className="font-bold text-slate-900 text-xs">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">Organisasi:</span>
                <span className="font-bold text-slate-900 text-xs">{user.institution}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">Tanggal Terbit:</span>
                <span className="font-bold text-slate-900 text-xs">{user.progress.certificateDate}</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Status: Pembelajaran selesai</span>
                </div>

                <button
                  onClick={onOpenCertificateModal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs cursor-pointer shadow-xs active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Buka Lembar Sertifikat</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-3">
              <p className="font-bold leading-relaxed">
                Selesaikan modul belajar dan raih skor minimal <strong>70% (7 benar)</strong> untuk mendapatkan bukti penyelesaian belajar. Dokumen ini bukan sertifikasi profesi atau akreditasi ISO.
              </p>
              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black cursor-pointer shadow-xs"
              >
                Mulai Ujian Sekarang →
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
