import React, { useState } from 'react';
import { ISO_PRINCIPLES, THREE_LINES_MODEL, ISO_QUIZZES } from '../data/iso31000Guide';
import { GraduationCap, CheckCircle2, XCircle, Sparkles, ArrowRight } from 'lucide-react';

export const IsoAcademy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'principles' | 'lines' | 'anatomy' | 'quiz'>('principles');
  
  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQuiz = ISO_QUIZZES[currentQuizIdx];

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
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuizScore(0);
    setCompleted(false);
  };

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Pusat Edukasi &amp; Panduan ISO 31000:2018
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pelajari konsep fundamental manajemen risiko, model tiga lini pertahanan, dan anatomi risiko operasional secara interaktif.
          </p>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center bg-slate-100 dark:bg-[#101723] p-1 rounded-xl border border-stone-200/90 dark:border-slate-800 text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSection('principles')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'principles' 
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 dark:bg-blue-600 dark:text-white' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            8 Prinsip ISO
          </button>
          <button
            onClick={() => setActiveSection('lines')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'lines' 
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 dark:bg-blue-600 dark:text-white' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tiga Lini Model
          </button>
          <button
            onClick={() => setActiveSection('anatomy')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'anatomy' 
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 dark:bg-blue-600 dark:text-white' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Anatomi Risiko
          </button>
          <button
            onClick={() => setActiveSection('quiz')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'quiz' 
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200 dark:bg-blue-600 dark:text-white' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kuis Studi Kasus
          </button>
        </div>
      </div>

      {/* Section 1: 8 Prinsip ISO 31000 */}
      {activeSection === 'principles' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 font-medium leading-relaxed">
            💡 <strong>Tujuan ISO 31000:2018:</strong> Menciptakan dan melindungi nilai <em>(Value Creation &amp; Protection)</em> bagi organisasi melalui pengelolaan ketidakpastian secara sistematis dan terintegrasi.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ISO_PRINCIPLES.map((p) => (
              <div
                key={p.number}
                className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-blue-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-2xl font-black font-rank text-blue-600">
                    {p.number}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {p.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {p.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-stone-200 text-[11px] text-slate-600">
                  <span className="text-emerald-700 font-bold block mb-0.5">Contoh Praktis:</span>
                  {p.practicalExample}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Tiga Lini Model Pertahanan (Three Lines Model) */}
      {activeSection === 'lines' && (
        <div className="space-y-4 text-xs">
          <p className="text-slate-700 font-medium">
            Model Tiga Lini (The IIA's Three Lines Model) adalah standar tata kelola global untuk membagi peran dan tanggung jawab pengelolaan risiko:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {THREE_LINES_MODEL.map((line, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-stone-200 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div 
                    className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: line.color }}
                  >
                    {line.line}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {line.owner}
                  </h3>
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold mb-3 border border-slate-200">
                    Peran: {line.role}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    {line.duty}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 text-[10px] text-slate-400 font-medium">
                  Resilia RCSA digunakan oleh lini pertama untuk pemetaan mandiri.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Anatomi Risiko Operasional */}
      {activeSection === 'anatomy' && (
        <div className="space-y-5 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Formula Anatomi Risiko: Cause ➔ Event ➔ Impact
            </h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Banyak praktisi salah mendefinisikan risiko dengan mencampuradukkan penyebab, peristiwa, dan dampaknya. Berikut adalah panduan pembedaannya:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                  1. Penyebab (Root Cause)
                </span>
                <p className="font-bold text-slate-900 mb-1">"Mengapa bisa terjadi?"</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Pemicu awal: bug aplikasi, kelalaian manusia, koneksi kabel putus, vendor ingkar janji, atau ketiadaan SOP.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block mb-1">
                  2. Peristiwa (Risk Event)
                </span>
                <p className="font-bold text-slate-900 mb-1">"Apa kejadian aktualnya?"</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Titik kejadian operasional: API payment gateway timeout 1 jam, kasir salah transfer dana Rp 50 Juta, file data nasabah bocor.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block mb-1">
                  3. Dampak (Consequence)
                </span>
                <p className="font-bold text-slate-900 mb-1">"Berapa kerugiannya?"</p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Konsekuensi akhir: kehilangan pendapatan tunai, komplain publik viral, sanksi denda regulator, gugatan hukum.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-emerald-900">
            🎯 <strong>Kunci Efektivitas RCSA:</strong> Pengendalian <em>Preventif</em> berfokus mematikan <strong>Penyebab (Cause)</strong>, sedangkan pengendalian <em>Korektif</em> berfokus meredam <strong>Dampak (Impact)</strong>.
          </div>
        </div>
      )}

      {/* Section 4: Kuis Simulasi Interaktif */}
      {activeSection === 'quiz' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 shadow-xs text-xs">
          {!completed ? (
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-700 uppercase font-mono">
                    Pertanyaan {currentQuizIdx + 1} dari {ISO_QUIZZES.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  Skor Anda: <span className="text-emerald-700 font-bold">{quizScore}</span>
                </div>
              </div>

              {/* Skenario */}
              <div className="p-4 rounded-xl bg-slate-50 border border-stone-200 mb-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Studi Kasus Riil:
                </span>
                <p className="text-slate-800 text-sm leading-relaxed font-medium">
                  "{currentQuiz.scenario}"
                </p>
              </div>

              {/* Pertanyaan */}
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                {currentQuiz.question}
              </h3>

              {/* Pilihan Jawaban */}
              <div className="space-y-2 mb-4">
                {currentQuiz.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let btnClass = 'bg-slate-50/80 border-stone-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100';

                  if (showExplanation) {
                    if (opt.isCorrect) {
                      btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
                    } else if (isSelected && !opt.isCorrect) {
                      btnClass = 'bg-rose-50 border-rose-400 text-rose-900';
                    }
                  } else if (isSelected) {
                    btnClass = 'border-blue-500 bg-blue-50 text-blue-900';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${btnClass}`}
                    >
                      <div className="mt-0.5">
                        {showExplanation && opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : showExplanation && isSelected && !opt.isCorrect ? (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {String.fromCharCode(65 + idx)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{opt.text}</span>
                        {showExplanation && (
                          <p className={`mt-1.5 text-[11px] font-normal leading-relaxed ${opt.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                            {opt.explanation}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Tombol Selanjutnya */}
              {showExplanation && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuiz}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-sm"
                  >
                    <span>{currentQuizIdx < ISO_QUIZZES.length - 1 ? 'Pertanyaan Selanjutnya' : 'Lihat Hasil Akhir'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-10 h-10 text-amber-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Kuis Selesai!
              </h3>
              <p className="text-xs text-slate-600 mb-5">
                Skor Anda: <strong className="text-emerald-700 text-sm">{quizScore} / {ISO_QUIZZES.length} Benar</strong>
              </p>
              <button
                onClick={handleResetQuiz}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer hover:bg-blue-700 shadow-sm"
              >
                Ulangi Kuis
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
