import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  LogOut, 
  Award, 
  Shield, 
  ChevronDown, 
  CheckCircle2, 
  Edit3, 
  Building, 
  X, 
  Save,
  Briefcase
} from 'lucide-react';

interface UserProfileMenuProps {
  onOpenCertificate?: () => void;
  onOpenAcademy?: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ onOpenCertificate, onOpenAcademy }) => {
  const { user, logout, openAuthModal, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit profile form state
  const [editName, setEditName] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editRole, setEditRole] = useState('');

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openEditProfile = () => {
    if (!user) return;
    setEditName(user.name);
    setEditInstitution(user.institution);
    setEditRole(user.role);
    setIsEditModalOpen(true);
    setIsOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editInstitution.trim()) return;

    updateProfile({
      name: editName.trim(),
      institution: editInstitution.trim(),
      role: editRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(editName.trim())}&backgroundColor=${user?.provider === 'google' ? '1d4ed8' : '047857'}`,
    });
    setIsEditModalOpen(false);
  };

  if (!user) {
    return (
      <button
        onClick={openAuthModal}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-blue-700 hover:bg-blue-800 shadow-sm shadow-blue-700/25 transition-all cursor-pointer active:scale-95 group"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
          <path
            fill="#ffffff"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#ffffff"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#ffffff"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#ffffff"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Masuk / Daftar</span>
      </button>
    );
  }

  const isGovDomain = user.email.toLowerCase().includes('.go.id') || user.email.toLowerCase().includes('bps.go.id');

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-stone-300 hover:border-blue-400 text-slate-900 transition-all cursor-pointer shadow-2xs"
        >
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="w-6 h-6 rounded-lg object-cover border border-stone-200"
          />
          <div className="hidden lg:block text-left text-xs">
            <p className="font-bold text-slate-900 leading-tight max-w-[130px] truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-blue-800 font-semibold leading-tight truncate max-w-[130px]">
              {user.institution || user.role}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-300 p-2 z-50 text-xs animate-in fade-in duration-100">
            {/* User Profile Card */}
            <div className="p-3 border-b border-stone-200 bg-stone-50 rounded-xl mb-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="font-black text-slate-900 text-sm truncate">{user.name}</p>
                {isGovDomain && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300">
                    Kedinasan RI
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-700 font-medium truncate">{user.email}</p>
              
              <div className="pt-1 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold border border-blue-200 truncate max-w-[160px]">
                  {user.institution}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-200 text-slate-800 font-semibold truncate max-w-[90px]">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {/* Edit Profil Button */}
              <button
                onClick={openEditProfile}
                className="w-full flex items-center justify-between p-2 rounded-lg text-slate-800 hover:bg-stone-100 font-bold cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-slate-700" />
                  <span>Edit Profil &amp; Instansi</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Ubah</span>
              </button>

              {/* Progress Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenAcademy) onOpenAcademy();
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg text-slate-800 hover:bg-stone-100 font-bold cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-700" />
                  <span>Progres Belajar MR</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold">
                  {user.progress.completedModules.length} Modul
                </span>
              </button>

              {/* Certificate Button */}
              {user.progress.certificateEarned ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenCertificate) onOpenCertificate();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 font-black cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700" />
                    <span>Lihat Sertifikat ISO 31000</span>
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (onOpenAcademy) onOpenAcademy();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-700 hover:bg-stone-100 font-medium cursor-pointer transition-colors"
                >
                  <Award className="w-4 h-4 text-slate-500" />
                  <span>Klaim Sertifikat (Ambil Ujian)</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg text-rose-700 hover:bg-rose-50 font-bold cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div 
            className="bg-white max-w-md w-full rounded-2xl sm:rounded-3xl border-2 border-stone-300 shadow-2xl overflow-hidden animate-in fade-in duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-700" />
                <h3 className="font-black text-slate-900 text-sm">
                  Perbarui Profil &amp; Instansi
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-black text-slate-900 mb-1">
                  Nama Lengkap &amp; Gelar
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Contoh: Budi Raharja, S.Si, M.Stat"
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-700"
                  />
                </div>
                <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">
                  Nama ini akan langsung diperbarui pada Sertifikat ISO 31000 Anda.
                </span>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">
                  Instansi / Organisasi
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                  <input
                    type="text"
                    required
                    value={editInstitution}
                    onChange={e => setEditInstitution(e.target.value)}
                    placeholder="Contoh: Badan Pusat Statistik RI"
                    className="w-full pl-9 pr-3 py-2 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">
                  Peran / Jabatan
                </label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-700 cursor-pointer"
                >
                  <option value="Risk Officer / Analis Risiko">Risk Officer / Analis Risiko</option>
                  <option value="Auditor Internal / SPI">Auditor Internal / Inspektorat</option>
                  <option value="Compliance &amp; Legal">Compliance &amp; Kepatuhan</option>
                  <option value="Kepala Satuan Kerja / Manager">Kepala Satuan Kerja / Manager</option>
                  <option value="Direksi / Pimpinan Tinggi">Direksi / Pimpinan Tinggi</option>
                  <option value="Pranata Komputer / IT Lead">Pranata Komputer / IT Lead</option>
                  <option value="Mahasiswa / Peneliti">Mahasiswa / Peneliti</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-slate-700 font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black cursor-pointer shadow-sm active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
