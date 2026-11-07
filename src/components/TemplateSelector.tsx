import React from 'react';
import { INDUSTRY_TEMPLATES } from '../data/initialData';
import { IndustryTemplate } from '../types/risk';
import { Sparkles, X, Building2, Stethoscope, Truck, ArrowRight } from 'lucide-react';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: IndustryTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  const getTemplateIcon = (id: string) => {
    switch (id) {
      case 'tpl-hospital':
        return <Stethoscope className="w-5 h-5 text-emerald-600" />;
      case 'tpl-logistics':
        return <Truck className="w-5 h-5 text-amber-600" />;
      case 'tpl-fintech':
      default:
        return <Building2 className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#131b26] w-full max-w-xl rounded-2xl border border-stone-300 dark:border-slate-700 p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-300">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Pilih Template Profil Risiko Industri
              </h3>
              <p className="text-[11px] text-slate-800 dark:text-slate-700">
                Mulai instan dengan kumpulan register RCSA dan indikator KRI standar industri riil.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-700 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Templates List */}
        <div className="space-y-3 mb-5">
          {INDUSTRY_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => {
                onSelectTemplate(tpl);
                onClose();
              }}
              className="p-4 rounded-xl bg-slate-50/70 hover:bg-blue-50/60 border border-stone-300 hover:border-blue-400 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white border border-stone-300 shadow-2xs shrink-0">
                    {getTemplateIcon(tpl.id)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {tpl.name}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {tpl.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-800 font-medium">
                      <span>{tpl.risks.length} Risiko Terdaftar</span>
                      <span>•</span>
                      <span>{tpl.kris.length} Indikator KRI</span>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-slate-800 text-center font-medium">
          💡 Memilih template akan memuat data profil risiko contoh ke dalam lembar kerja Anda.
        </div>

      </div>
    </div>
  );
};
