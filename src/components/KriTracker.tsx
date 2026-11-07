import React, { useState } from 'react';
import { KRIItem, RiskCategory, KRIStatus } from '../types/risk';
import { getCategoryBadge } from '../utils/riskCalculations';
import { Plus, AlertCircle, CheckCircle2, AlertTriangle, Clock, RefreshCw, X } from 'lucide-react';

interface KriTrackerProps {
  kris: KRIItem[];
  onUpdateKriValue: (id: string, newValue: number) => void;
  onAddNewKri: (kri: Omit<KRIItem, 'id' | 'lastUpdated'>) => void;
}

export const KriTracker: React.FC<KriTrackerProps> = ({
  kris,
  onUpdateKriValue,
  onAddNewKri,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New KRI form states
  const [newCode, setNewCode] = useState(`KRI-OPS-0${kris.length + 1}`);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<RiskCategory>('SYSTEM');
  const [newUnit, setNewUnit] = useState('%');
  const [newVal, setNewVal] = useState<number>(0);
  const [newGreen, setNewGreen] = useState<number>(99.5);
  const [newAmber, setNewAmber] = useState<number>(98.0);
  const [newRed, setNewRed] = useState<number>(95.0);
  const [newComp, setNewComp] = useState<'<' | '>'>('>');
  const [newDesc, setNewDesc] = useState('');

  const handleStartEdit = (kri: KRIItem) => {
    setEditingId(kri.id);
    setInputValue(String(kri.currentValue));
  };

  const handleSaveEdit = (id: string) => {
    const val = parseFloat(inputValue);
    if (!isNaN(val)) {
      onUpdateKriValue(id, val);
    }
    setEditingId(null);
  };

  const handleCreateKri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    let initialStatus: KRIStatus = 'GREEN';
    if (newComp === '>') {
      if (newVal < newRed) initialStatus = 'RED';
      else if (newVal < newAmber) initialStatus = 'AMBER';
    } else {
      if (newVal > newRed) initialStatus = 'RED';
      else if (newVal > newAmber) initialStatus = 'AMBER';
    }

    onAddNewKri({
      code: newCode,
      name: newName,
      category: newCat,
      metricUnit: newUnit,
      currentValue: newVal,
      greenThreshold: newGreen,
      amberThreshold: newAmber,
      redThreshold: newRed,
      comparator: newComp,
      status: initialStatus,
      description: newDesc || newName,
    });

    setShowAddModal(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-8 border border-stone-300 shadow-md">
      
      {/* KRI Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-sans">
              Pemantauan KRI (Key Risk Indicators)
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-black">
              Early Warning Radar
            </span>
          </div>
          <p className="text-xs text-slate-800 font-bold mt-1">
            Indikator kuantitatif peringatan dini untuk mendeteksi deviasi operasional sebelum menjadi krisis kerugian.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 shadow-sm shadow-blue-700/25 transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Tambah Indikator KRI</span>
        </button>
      </div>

      {/* KRI Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kris.map((kri) => {
          const catBadge = getCategoryBadge(kri.category);
          const isRed = kri.status === 'RED';
          const isAmber = kri.status === 'AMBER';
          const isGreen = kri.status === 'GREEN';

          return (
            <div
              key={kri.id}
              className={`p-5 rounded-2xl border-2 transition-all shadow-xs ${
                isRed
                  ? 'bg-rose-50/60 border-rose-400'
                  : isAmber
                  ? 'bg-amber-50/60 border-amber-400'
                  : 'bg-white border-stone-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-900">
                      {kri.code}
                    </span>
                    <span 
                      className="text-[9px] px-2 py-0.5 rounded-md font-black border"
                      style={{ color: catBadge.color, backgroundColor: catBadge.bg, borderColor: `${catBadge.color}40` }}
                    >
                      {catBadge.label.split(' (')[0]}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-1.5">
                    {kri.name}
                  </h3>
                </div>

                {/* Status Badge */}
                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 border shadow-2xs ${
                  isRed
                    ? 'bg-rose-100 text-rose-950 border-rose-400'
                    : isAmber
                    ? 'bg-amber-100 text-amber-950 border-amber-400'
                    : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                }`}>
                  {isRed && <AlertCircle className="w-3.5 h-3.5 text-rose-700" />}
                  {isAmber && <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />}
                  {isGreen && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                  <span>{kri.status}</span>
                </div>
              </div>

              <p className="text-xs text-slate-800 font-medium leading-relaxed mb-3">
                {kri.description}
              </p>

              {/* Value and Threshold Box */}
              <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-300 mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-800 font-black block uppercase">Nilai Terkini:</span>
                  {editingId === kri.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        step="any"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-24 bg-white border-2 border-blue-600 rounded px-2 py-1 text-xs text-slate-900 font-black font-mono"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(kri.id)}
                        className="px-2.5 py-1 rounded bg-blue-700 text-white text-xs font-black cursor-pointer"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className={`text-2xl font-black font-rank ${
                        isRed ? 'text-rose-700' : isAmber ? 'text-amber-800' : 'text-emerald-800'
                      }`}>
                        {kri.currentValue}
                      </span>
                      <span className="text-xs text-slate-800 font-mono font-bold">
                        {kri.metricUnit}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleStartEdit(kri)}
                  className="text-xs text-slate-900 hover:text-blue-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer shadow-2xs font-bold"
                  title="Update Nilai KRI"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Ubah Nilai</span>
                </button>
              </div>

              {/* Threshold Indicators bar */}
              <div className="text-[11px] space-y-1.5">
                <div className="flex justify-between text-slate-900 text-[10px] font-black">
                  <span className="text-emerald-800">Aman: {kri.comparator} {kri.greenThreshold}</span>
                  <span className="text-amber-800">Waspada: {kri.amberThreshold}</span>
                  <span className="text-rose-800">Bahaya: {kri.comparator === '>' ? `< ${kri.redThreshold}` : `> ${kri.redThreshold}`}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-300 overflow-hidden flex border border-stone-300">
                  <div className="h-full bg-emerald-600 w-1/3" />
                  <div className="h-full bg-amber-500 w-1/3" />
                  <div className="h-full bg-rose-600 w-1/3" />
                </div>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between text-[10px] text-slate-800 mt-3 pt-2.5 border-t border-stone-300 font-bold">
                <div className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span>Update: {kri.lastUpdated}</span>
                </div>
                {kri.targetRiskCode && (
                  <span className="text-blue-900 font-mono font-black">
                    Terkait: {kri.targetRiskCode}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add KRI Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl border border-stone-300 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900">
                Tambah Key Risk Indicator (KRI) Baru
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-slate-600 hover:bg-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateKri} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-900 font-bold mb-1 block">Kode KRI</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl font-mono text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-900 font-bold mb-1 block">Satuan Metrik</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="%, Jam, Hari, Kasus"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-900 font-bold mb-1 block">Nama Indikator KRI</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Server Uptime SLA Bulanan"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-emerald-800 font-bold mb-1 block">Batas Aman (Hijau)</label>
                  <input
                    type="number"
                    step="any"
                    value={newGreen}
                    onChange={(e) => setNewGreen(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-amber-800 font-bold mb-1 block">Waspada (Kuning)</label>
                  <input
                    type="number"
                    step="any"
                    value={newAmber}
                    onChange={(e) => setNewAmber(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-rose-800 font-bold mb-1 block">Bahaya (Merah)</label>
                  <input
                    type="number"
                    step="any"
                    value={newRed}
                    onChange={(e) => setNewRed(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-700 hover:bg-stone-100 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black cursor-pointer shadow-sm"
                >
                  Simpan KRI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
