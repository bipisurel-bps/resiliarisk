import React, { useState } from 'react';
import { KRIItem, RiskCategory, KRIStatus } from '../types/risk';
import { getCategoryBadge } from '../utils/riskCalculations';
import { Plus, AlertCircle, CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

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
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-8">
      
      {/* KRI Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Pemantauan KRI (Key Risk Indicators)
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold">
              Early Warning System
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Indikator peringatan dini kuantitatif untuk mendeteksi perubahan profil risiko operasional sebelum terjadi kerugian besar.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Indikator KRI</span>
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
              className={`p-5 rounded-2xl border transition-all shadow-xs ${
                isRed
                  ? 'bg-rose-50/40 border-rose-300 dark:bg-rose-950/20 dark:border-rose-500/40'
                  : isAmber
                  ? 'bg-amber-50/40 border-amber-300 dark:bg-amber-950/20 dark:border-amber-500/40'
                  : 'bg-white border-stone-200 dark:bg-[#101723]/80 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                      {kri.code}
                    </span>
                    <span 
                      className="text-[9px] px-2 py-0.5 rounded-md font-bold border"
                      style={{ color: catBadge.color, backgroundColor: catBadge.bg, borderColor: `${catBadge.color}30` }}
                    >
                      {catBadge.label.split(' (')[0]}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                    {kri.name}
                  </h3>
                </div>

                {/* Status Badge */}
                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border shadow-2xs ${
                  isRed
                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                    : isAmber
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}>
                  {isRed && <AlertCircle className="w-3 h-3 text-rose-600" />}
                  {isAmber && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                  {isGreen && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  <span>{kri.status}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                {kri.description}
              </p>

              {/* Value and Threshold Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-stone-200/80 dark:border-slate-800 mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Nilai Saat Ini:</span>
                  {editingId === kri.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        step="any"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-24 bg-white border border-blue-500 rounded px-2 py-1 text-xs text-slate-900 font-mono"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(kri.id)}
                        className="px-2.5 py-1 rounded bg-blue-600 text-white text-[10px] font-bold cursor-pointer"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className={`text-2xl font-black font-rank ${
                        isRed ? 'text-rose-600' : isAmber ? 'text-amber-600' : 'text-emerald-700'
                      }`}>
                        {kri.currentValue}
                      </span>
                      <span className="text-xs text-slate-500 font-mono font-medium">
                        {kri.metricUnit}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleStartEdit(kri)}
                  className="text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-stone-200 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs font-semibold"
                  title="Update Nilai KRI"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Update</span>
                </button>
              </div>

              {/* Threshold Indicators bar */}
              <div className="text-[11px] space-y-1">
                <div className="flex justify-between text-slate-500 text-[10px] font-semibold">
                  <span className="text-emerald-700">Aman: {kri.comparator} {kri.greenThreshold}</span>
                  <span className="text-amber-700">Waspada: {kri.amberThreshold}</span>
                  <span className="text-rose-700">Bahaya: {kri.comparator === '>' ? `< ${kri.redThreshold}` : `> ${kri.redThreshold}`}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="h-full bg-emerald-500 w-1/3" />
                  <div className="h-full bg-amber-500 w-1/3" />
                  <div className="h-full bg-rose-500 w-1/3" />
                </div>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2.5 border-t border-stone-200/80 dark:border-slate-800">
                <div className="flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Update: {kri.lastUpdated}</span>
                </div>
                {kri.targetRiskCode && (
                  <span className="text-blue-700 dark:text-blue-400 font-mono font-bold">
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
          <div className="bg-white dark:bg-[#131b26] w-full max-w-lg rounded-2xl border border-stone-200 dark:border-slate-700 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Tambah Key Risk Indicator (KRI) Baru
            </h3>
            <form onSubmit={handleCreateKri} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold mb-1 block">Kode KRI</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-slate-50 border border-stone-300 rounded-lg p-2 text-slate-900 font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold mb-1 block">Kategori</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as RiskCategory)}
                    className="w-full bg-slate-50 border border-stone-300 rounded-lg p-2 text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="SYSTEM">Sistem &amp; IT / Cyber</option>
                    <option value="PROCESS">Proses &amp; Prosedur</option>
                    <option value="PEOPLE">Manusia (People)</option>
                    <option value="EXTERNAL">Kejadian Eksternal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold mb-1 block">Nama Indikator KRI</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rasio Kegagalan Transaksi Pembayaran Harian"
                  className="w-full bg-slate-50 border border-stone-300 rounded-lg p-2 text-slate-900 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold mb-1 block">Satuan (Unit)</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="%, Jam, Kejadian"
                    className="w-full bg-slate-50 border border-stone-300 rounded-lg p-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold mb-1 block">Nilai Awal</label>
                  <input
                    type="number"
                    step="any"
                    value={newVal}
                    onChange={(e) => setNewVal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-stone-300 rounded-lg p-2 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold mb-1 block">Kaidah Baik</label>
                  <select
                    value={newComp}
                    onChange={(e) => setNewComp(e.target.value as '<' | '>')}
                    className="w-full bg-slate-50 border border-stone-300 rounded-lg p-2 text-slate-900 cursor-pointer font-medium"
                  >
                    <option value=">">Makin Tinggi Makin Baik</option>
                    <option value="<">Makin Rendah Makin Baik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-stone-200">
                <div>
                  <label className="text-emerald-700 font-bold block mb-1">Ambang Aman</label>
                  <input
                    type="number"
                    step="any"
                    value={newGreen}
                    onChange={(e) => setNewGreen(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-stone-300 rounded p-1.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-amber-700 font-bold block mb-1">Ambang Waspada</label>
                  <input
                    type="number"
                    step="any"
                    value={newAmber}
                    onChange={(e) => setNewAmber(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-stone-300 rounded p-1.5 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-rose-700 font-bold block mb-1">Ambang Bahaya</label>
                  <input
                    type="number"
                    step="any"
                    value={newRed}
                    onChange={(e) => setNewRed(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-stone-300 rounded p-1.5 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-sm"
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
