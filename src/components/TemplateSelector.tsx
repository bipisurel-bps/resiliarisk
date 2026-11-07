import React from 'react';
import { INDUSTRY_TEMPLATES } from '../data/initialData';
import { IndustryTemplate, RiskItem, KRIItem } from '../types/risk';
import { Sparkles, X, Check, Building2, Stethoscope, Truck, ArrowRight } from 'lucide-react';

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
        return <Stethoscope className="w-5 h-5 text-emerald-400" />;
      case 'tpl-logistics':
        return <Truck className="w-5 h-5 text-amber-400" />;
      case 'tpl-fintech':
      default:
        return <Building2 className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-xl rounded-2xl border border-slate-700 p-5 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Pilih Template Profil Risiko Industri
              </h3>
              <p className="text-[11px] text-slate-400">
                Mulai instan dengan kumpulan register RCSA dan indikator KRI standar industri riil.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
              className="p-3.5 rounded-xl bg-[#101723] border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/40 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 shrink-0">
                    {getTemplateIcon(tpl.id)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      {tpl.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {tpl.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
                      <span>{tpl.risks.length} Risiko Terdaftar</span>
                      <span>•</span>
                      <span>{tpl.kris.length} Indikator KRI</span>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 text-center">
          💡 Memilih template akan memuat data profil risiko contoh ke dalam lembar kerja Anda.
        </div>

      </div>
    </div>
  );
};
