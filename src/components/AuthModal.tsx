import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  ExternalLink,
  HelpCircle,
  KeyRound
} from 'lucide-react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              type?: string;
              text?: string;
              shape?: string;
              logo_alignment?: string;
              width?: number;
            }
          ) => void;
          prompt?: () => void;
        };
      };
    };
  }
}

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    googleClientId,
    setGoogleClientId,
    loginWithGoogleCredential,
    loginWithGoogleDemo, 
    loginWithEmail, 
    registerWithEmail 
  } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('Risk Officer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Google Config Drawer state
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [tempClientId, setTempClientId] = useState(googleClientId);
  const [clientIdSavedNotice, setClientIdSavedNotice] = useState(false);

  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  // Initialize official Google Identity Services button if Client ID exists
  useEffect(() => {
    if (!isAuthModalOpen) return;

    let retryTimer: any = null;

    const renderGoogleBtn = () => {
      if (window.google?.accounts?.id && googleClientId && googleButtonContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response: { credential: string }) => {
              setLoading(true);
              loginWithGoogleCredential(response.credential)
                .catch((err) => {
                  setError(err.message || 'Gagal autentikasi Google.');
                })
                .finally(() => setLoading(false));
            },
            auto_select: false,
          });

          googleButtonContainerRef.current.innerHTML = '';
          const btnWidth = typeof window !== 'undefined' && window.innerWidth < 380 ? 260 : 320;
          window.google.accounts.id.renderButton(googleButtonContainerRef.current, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: btnWidth,
          });
          return true;
        } catch (err) {
          console.warn('Google Identity Services render error:', err);
        }
      }
      return false;
    };

    if (!renderGoogleBtn()) {
      let attempts = 0;
      retryTimer = setInterval(() => {
        attempts++;
        if (renderGoogleBtn() || attempts >= 15) {
          clearInterval(retryTimer);
        }
      }, 200);
    }

    return () => {
      if (retryTimer) clearInterval(retryTimer);
    };
  }, [isAuthModalOpen, googleClientId]);

  if (!isAuthModalOpen) return null;

  const handleSaveClientId = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleClientId(tempClientId);
    setClientIdSavedNotice(true);
    setTimeout(() => setClientIdSavedNotice(false), 3000);
  };

  const handleDemoGoogleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogleDemo();
    } catch {
      setError('Gagal menghubungkan sesi simulasi Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tab === 'login') {
      if (!email || !password) {
        setError('Silakan isi email dan kata sandi.');
        setLoading(false);
        return;
      }
      const res = await loginWithEmail(email, password);
      if (!res.success) {
        setError(res.error || 'Login gagal.');
      }
    } else {
      if (!name || !email || !password || !institution) {
        setError('Harap lengkapi seluruh field pendaftaran.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Kata sandi minimal 6 karakter.');
        setLoading(false);
        return;
      }
      const res = await registerWithEmail({
        name,
        email,
        password,
        role,
        institution,
      });
      if (!res.success) {
        setError(res.error || 'Pendaftaran gagal.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl border-2 border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-700 text-white shadow-sm shadow-blue-700/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {tab === 'login' ? 'Masuk ke Portal Resilia' : 'Daftar Akun Baru'}
              </h2>
              <p className="text-xs text-slate-800 font-bold mt-0.5">
                Simpan sertifikat kelulusan ISO 31000 &amp; profil risiko Anda
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Tabs: Masuk vs Daftar */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-blue-900 shadow-xs border border-stone-300 font-black'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              Masuk (Login)
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(null); }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-blue-900 shadow-xs border border-stone-300 font-black'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* Section: Google OAuth (Real GIS vs Client ID Configuration) */}
          <div className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google OAuth 2.0</span>
              </span>

              {googleClientId ? (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                  ● Real GIS Live
                </span>
              ) : (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
                  Mode Simulasi / Demo
                </span>
              )}
            </div>

            {/* If Google Client ID is configured, render official Google Identity Services Button */}
            {googleClientId ? (
              <div className="flex flex-col items-center justify-center pt-1 pb-1">
                <div ref={googleButtonContainerRef} className="min-h-[40px] flex items-center justify-center" />
                <p className="text-[11px] text-slate-700 font-semibold mt-2">
                  Terhubung langsung dengan server Google Identity Services (<code className="font-mono text-blue-900">accounts.google.com</code>)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDemoGoogleClick}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border-2 border-stone-300 bg-white hover:bg-stone-50 hover:border-slate-400 text-slate-900 font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Masuk Cepat dengan Akun Google (Demo)</span>
                </button>

                <p className="text-[11px] text-slate-800 font-medium leading-relaxed">
                  💡 <em>Google OAuth asli membutuhkan <strong>Google Client ID</strong> yang terdaftar di Google Cloud Console untuk domain <code className="font-mono text-blue-900 font-bold">resiliarisk.web.id</code>.</em>
                </p>
              </div>
            )}

            {/* Toggle Configuration Drawer */}
            <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowConfigDrawer(!showConfigDrawer)}
                className="inline-flex items-center gap-1.5 text-xs text-blue-800 hover:text-blue-950 font-bold underline underline-offset-2 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{showConfigDrawer ? 'Tutup Pengaturan Google Client ID' : '⚙️ Pasang Google Client ID Riil'}</span>
              </button>

              {googleClientId && (
                <button
                  type="button"
                  onClick={() => setGoogleClientId('')}
                  className="text-[11px] text-rose-700 hover:underline cursor-pointer font-bold"
                >
                  Reset Client ID
                </button>
              )}
            </div>

            {/* Config Drawer for Live Google OAuth */}
            {showConfigDrawer && (
              <form onSubmit={handleSaveClientId} className="p-3 bg-white border border-stone-300 rounded-xl space-y-2.5 text-xs">
                <div>
                  <label className="block font-black text-slate-900 mb-1">
                    Google OAuth Client ID:
                  </label>
                  <input
                    type="text"
                    required
                    value={tempClientId}
                    onChange={(e) => setTempClientId(e.target.value)}
                    placeholder="Contoh: 123456789-abcdefg.apps.googleusercontent.com"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-slate-900 font-mono text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-slate-800 space-y-1 font-medium">
                  <p className="font-black text-blue-950">Cara mendapatkan Client ID resmi (Gratis):</p>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    <li>Buka <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-bold">Google Cloud Console Credentials <ExternalLink className="w-3 h-3 inline" /></a></li>
                    <li>Klik <strong>Create Credentials</strong> ➔ <strong>OAuth client ID</strong> (Web application)</li>
                    <li>Tambahkan <em>Authorized JavaScript origins</em>: <code className="bg-white px-1 py-0.2 rounded border font-mono text-blue-900 font-bold">https://resiliarisk.web.id</code></li>
                    <li>Salin Client ID dan tempelkan pada kolom di atas, lalu klik Simpan.</li>
                  </ol>
                </div>

                <div className="flex items-center justify-between pt-1">
                  {clientIdSavedNotice ? (
                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Tersimpan!
                    </span>
                  ) : <span />}

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black cursor-pointer shadow-xs"
                  >
                    Simpan Client ID
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t-2 border-stone-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-black text-slate-800 uppercase tracking-wider shrink-0">
              atau gunakan pendaftaran email (100% Aktif)
            </span>
          </div>

          {/* Error notification */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-300 flex items-start gap-2.5 text-xs text-rose-950 font-bold">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields: Real Email/Password Auth */}
          <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-xs">
            {tab === 'register' && (
              <>
                <div>
                  <label className="block font-black text-slate-900 mb-1">
                    Nama Lengkap <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full pl-9 pr-3 py-2 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-700 shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black text-slate-900 mb-1">
                      Instansi / Organisasi <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                      <input
                        type="text"
                        required
                        value={institution}
                        onChange={e => setInstitution(e.target.value)}
                        placeholder="Contoh: BPS / Bank Mandiri"
                        className="w-full pl-9 pr-3 py-2 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-700 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-black text-slate-900 mb-1">
                      Peran / Posisi
                    </label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-700 shadow-2xs cursor-pointer"
                    >
                      <option value="Risk Officer">Risk Officer / Analis Risiko</option>
                      <option value="Internal Auditor">Auditor Internal / SPI</option>
                      <option value="Compliance Officer">Compliance &amp; Legal</option>
                      <option value="Unit Head">Kepala Satuan Kerja / Manager</option>
                      <option value="Direksi">Direksi / Board Level</option>
                      <option value="Mahasiswa">Mahasiswa / Peneliti</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-black text-slate-900 mb-1">
                Alamat Email <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nama@organisasi.id atau nama@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-700 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-black text-slate-900 mb-1">
                Kata Sandi <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={tab === 'register' ? 'Minimal 6 karakter' : 'Masukkan kata sandi'}
                  className="w-full pl-9 pr-3 py-2 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-700 shadow-2xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-black text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 text-xs sm:text-sm"
            >
              <span>{tab === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Resilia'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Feature Highlights */}
          <div className="pt-3 border-t border-stone-200 grid grid-cols-2 gap-2 text-[11px] text-slate-800 font-bold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Sertifikat Terverifikasi QR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Data Privat di Browser</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
