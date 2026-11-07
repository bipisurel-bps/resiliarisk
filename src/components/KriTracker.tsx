import React, { useState } from 'react';
import { KRIItem, RiskCategory, KRIStatus } from '../types/risk';
import { getCategoryBadge } from '../utils/riskCalculations';
import { Activity, Plus, AlertCircle, CheckCircle2, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

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
    <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6">
      
      {/* KRI Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Pemantauan KRI (Key Risk Indicators)
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Early Warning System
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Indikator peringatan dini kuantitatif untuk mendeteksi perubahan profil risiko operasional sebelum terjadi kerugian besar.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer"
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
              className={`p-4 rounded-xl border transition-all ${
                isRed
                  ? 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/30'
                  : isAmber
                  ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/30'
                  : 'bg-[#101723]/80 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      {kri.code}
                    </span>
                    <span 
                      className="text-[9px] px-1.5 py-0.2 rounded font-medium"
                      style={{ color: catBadge.color, backgroundColor: catBadge.bg }}
                    >
                      {catBadge.label.split(' (')[0]}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-100 mt-1">
                    {kri.name}
                  </h3>
                </div>

                {/* Status Badge */}
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                  isRed
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : isAmber
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {isRed && <AlertCircle className="w-3 h-3 text-rose-400" />}
                  {isAmber && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                  {isGreen && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  <span>{kri.status}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mb-3">
                {kri.description}
              </p>

              {/* Value and Threshold Box */}
              <div className="p-3 rounded-lg bg-black/40 border border-slate-800/80 mb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Nilai Saat Ini:</span>
                  {editingId === kri.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="number"
                        step="any"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-24 bg-[#101723] border border-blue-500 rounded px-2 py-1 text-xs text-white font-mono"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(kri.id)}
                        className="px-2 py-1 rounded bg-blue-600 text-white text-[10px] font-bold cursor-pointer"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className={`text-xl font-extrabold font-mono ${
                        isRed ? 'text-rose-400' : isAmber ? 'text-amber-300' : 'text-emerald-400'
                      }`}>
                        {kri.currentValue}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {kri.metricUnit}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleStartEdit(kri)}
                  className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1 p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Update Nilai KRI"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Update</span>
                </button>
              </div>

              {/* Threshold Indicators bar */}
              <div className="text-[11px] space-y-1">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span className="text-emerald-400 font-medium">Aman: {kri.comparator} {kri.greenThreshold}</span>
                  <span className="text-amber-400 font-medium">Waspada: {kri.amberThreshold}</span>
                  <span className="text-rose-400 font-medium">Bahaya: {kri.comparator === '>' ? `< ${kri.redThreshold}` : `> ${kri.redThreshold}`}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
                  <div className="h-full bg-emerald-500 w-1/3" />
                  <div className="h-full bg-amber-500 w-1/3" />
                  <div className="h-full bg-rose-500 w-1/3" />
                </div>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Update: {kri.lastUpdated}</span>
                </div>
                {kri.targetRiskCode && (
                  <span className="text-blue-400 font-mono">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg rounded-2xl border border-slate-700 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-3">
              Tambah Key Risk Indicator (KRI) Baru
            </h3>
            <form onSubmit={handleCreateKri} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium mb-1 block">Kode KRI</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-[#101723] border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium mb-1 block">Kategori</label>
                  <select
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value as RiskCategory)}
                    className="w-full bg-[#101723] border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value="SYSTEM">Sistem &amp; IT / Cyber</option>
                    <option value="PROCESS">Proses &amp; Prosedur</option>
                    <option value="PEOPLE">Manusia (People)</option>
                    <option value="EXTERNAL">Kejadian Eksternal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium mb-1 block">Nama Indikator KRI</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rasio Kegagalan Transaksi Pembayaran Harian"
                  className="w-full bg-[#101723] border border-slate-800 rounded-lg p-2 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-300 font-medium mb-1 block">Satuan (Unit)</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="%, Jam, Kejadian"
                    className="w-full bg-[#101723] border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium mb-1 block">Nilai Awal</label>
                  <input
                    type="number"
                    step="any"
                    value={newVal}
                    onChange={(e) => setNewVal(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#101723] border border-slate-800 rounded-lg p-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium mb-1 block">Kaidah Baik</label>
                  <select
                    value={newComp}
                    onChange={(e) => setNewComp(e.target.value as '<' | '>')}
                    className="w-full bg-[#101723] border border-slate-800 rounded-lg p-2 text-slate-200"
                  >
                    <option value=">">Makin Tinggi Makin Baik</option>
                    <option value="<">Makin Rendah Makin Baik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-black/40 border border-slate-800">
                <div>
                  <label className="text-emerald-400 font-bold block mb-1">Ambang Aman</label>
                  <input
                    type="number"
                    step="any"
                    value={newGreen}
                    onChange={(e) => setNewGreen(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#101723] border border-slate-800 rounded p-1 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-amber-400 font-bold block mb-1">Ambang Waspada</label>
                  <input
                    type="number"
                    step="any"
                    value={newAmber}
                    onChange={(e) => setNewAmber(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#101723] border border-slate-800 rounded p-1 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-rose-400 font-bold block mb-1">Ambang Bahaya</label>
                  <input
                    type="number"
                    step="any"
                    value={newRed}
                    onChange={(e) => setNewRed(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#101723] border border-slate-800 rounded p-1 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
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
