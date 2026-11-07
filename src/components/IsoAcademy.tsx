import React, { useState } from 'react';
import { ISO_PRINCIPLES, THREE_LINES_MODEL, ISO_QUIZZES, QuizQuestion } from '../data/iso31000Guide';
import { GraduationCap, BookOpen, Layers, HelpCircle, CheckCircle2, XCircle, Sparkles, ArrowRight } from 'lucide-react';

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
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Pusat Edukasi &amp; Panduan ISO 31000:2018
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pelajari konsep fundamental manajemen risiko, model tiga lini pertahanan, dan anatomi risiko operasional secara interaktif.
          </p>
        </div>

        {/* Section Navigation Pills */}
        <div className="flex items-center bg-[#101723] p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSection('principles')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'principles' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            8 Prinsip ISO
          </button>
          <button
            onClick={() => setActiveSection('lines')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'lines' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tiga Lini Model
          </button>
          <button
            onClick={() => setActiveSection('anatomy')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'anatomy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anatomi Risiko
          </button>
          <button
            onClick={() => setActiveSection('quiz')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSection === 'quiz' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kuis Studi Kasus
          </button>
        </div>
      </div>

      {/* Section 1: 8 Prinsip ISO 31000 */}
      {activeSection === 'principles' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200">
            💡 <strong>Tujuan ISO 31000:2018:</strong> Menciptakan dan melindungi nilai (Value Creation &amp; Protection) bagi organisasi melalui pengelolaan ketidakpastian secara sistematis.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ISO_PRINCIPLES.map((p) => (
              <div
                key={p.number}
                className="p-4 rounded-xl bg-[#101723]/90 border border-slate-800 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl font-black font-rank text-blue-500/80">
                    {p.number}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {p.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {p.description}
                </p>

                <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800/80 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold block mb-0.5">Contoh Nyata:</span>
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
          <p className="text-slate-300">
            Model Tiga Lini (The IIA's Three Lines Model) adalah standar global tata kelola untuk membagi peran dan tanggung jawab pengelolaan risiko:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {THREE_LINES_MODEL.map((line, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#101723] border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div 
                    className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: line.color }}
                  >
                    {line.line}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    {line.owner}
                  </h3>
                  <div className="inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium mb-3">
                    Peran: {line.role}
                  </div>
                  <p className="text-slate-400 leading-relaxed text-xs">
                    {line.duty}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500">
                  Resilia RCSA terutama digunakan oleh lini ini untuk pemetaan mandiri.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Anatomi Risiko Operasional */}
      {activeSection === 'anatomy' && (
        <div className="space-y-5 text-xs">
          <div className="p-4 rounded-xl bg-[#101723] border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2">
              Formula Anatomi Risiko: Cause ➔ Event ➔ Impact
            </h3>
            <p className="text-slate-300 mb-4">
              Banyak praktisi salah mendefinisikan risiko dengan mencampuradukkan penyebab, kejadian, dan dampaknya. Berikut adalah panduan membedakannya:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  1. Penyebab (Cause / Threat)
                </span>
                <p className="font-semibold text-slate-200 mb-1">"Mengapa bisa terjadi?"</p>
                <p className="text-slate-400 text-[11px]">
                  Faktor pemicu awal: bug aplikasi, kelalaian manusia, kabel putus, vendor ingkar janji, atau ketiadaan SOP.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                  2. Peristiwa (Risk Event)
                </span>
                <p className="font-semibold text-slate-200 mb-1">"Apa kejadian aktualnya?"</p>
                <p className="text-slate-400 text-[11px]">
                  Titik kejadian operasional: API payment down 1 jam, kasir salah transfer Rp 50 Juta, file data nasabah bocor.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  3. Dampak (Impact / Consequence)
                </span>
                <p className="font-semibold text-slate-200 mb-1">"Berapa kerugiannya?"</p>
                <p className="text-slate-400 text-[11px]">
                  Konsekuensi akhir: kerugian finansial uang tunai, komplain viral, sanksi pencabutan izin OJK, tuntutan hukum.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
            🎯 <strong>Kunci Efektivitas RCSA:</strong> Pengendalian <em>Preventif</em> berfokus mematikan <strong>Penyebab (Cause)</strong>, sedangkan pengendalian <em>Korektif</em> berfokus meredam <strong>Dampak (Impact)</strong>.
          </div>
        </div>
      )}

      {/* Section 4: Kuis Simulasi Interaktif */}
      {activeSection === 'quiz' && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#101723] border border-slate-800 text-xs">
          {!completed ? (
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-400 uppercase font-mono">
                    Pertanyaan {currentQuizIdx + 1} dari {ISO_QUIZZES.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-300">
                  Skor Anda: <span className="text-emerald-400 font-bold">{quizScore}</span>
                </div>
              </div>

              {/* Skenario */}
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80 mb-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Studi Kasus Riil:
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">
                  "{currentQuiz.scenario}"
                </p>
              </div>

              {/* Pertanyaan */}
              <h3 className="text-sm font-bold text-white mb-3">
                {currentQuiz.question}
              </h3>

              {/* Pilihan Jawaban */}
              <div className="space-y-2 mb-4">
                {currentQuiz.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  let btnClass = 'bg-[#0b0f17] border-slate-800 text-slate-300 hover:border-slate-700';

                  if (showExplanation) {
                    if (opt.isCorrect) {
                      btnClass = 'bg-emerald-950/30 border-emerald-500 text-emerald-300 font-semibold';
                    } else if (isSelected && !opt.isCorrect) {
                      btnClass = 'bg-rose-950/30 border-rose-500 text-rose-300';
                    }
                  } else if (isSelected) {
                    btnClass = 'border-blue-500 bg-blue-950/30 text-white';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showExplanation}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${btnClass}`}
                    >
                      <div className="mt-0.5">
                        {showExplanation && opt.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : showExplanation && isSelected && !opt.isCorrect ? (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-400">
                            {String.fromCharCode(65 + idx)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span>{opt.text}</span>
                        {showExplanation && (
                          <p className={`mt-1 text-[11px] font-normal ${opt.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
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
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer shadow-md"
                  >
                    <span>{currentQuizIdx < ISO_QUIZZES.length - 1 ? 'Pertanyaan Selanjutnya' : 'Lihat Hasil Akhir'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-2 animate-bounce" />
              <h3 className="text-lg font-bold text-white mb-1">
                Kuis Selesai!
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Skor Anda: <strong className="text-emerald-400 text-sm">{quizScore} / {ISO_QUIZZES.length} Benar</strong>
              </p>
              <button
                onClick={handleResetQuiz}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs cursor-pointer hover:bg-blue-500"
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
