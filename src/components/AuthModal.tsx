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
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Info
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
            ux_mode?: string;
            context?: string;
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
    loginWithGoogleCredential,
    loginWithGoogleDemo, 
    loginWithEmail, 
    registerWithEmail,
    loginWithDemoBps
  } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('Risk Officer / Analis Risiko');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);

  const googleButtonContainerRef = useRef<HTMLDivElement>(null);

  // Initialize official Google Identity Services button
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
            ux_mode: 'popup',
            context: 'signin',
          });

          googleButtonContainerRef.current.innerHTML = '';
          const btnWidth = typeof window !== 'undefined' && window.innerWidth < 380 ? 250 : 300;
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

  const handleDemoGoogleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogleDemo();
    } catch {
      setError('Gagal menghubungkan sesi akun Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleBpsDemoClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginWithDemoBps();
    } catch {
      setError('Gagal menghubungkan sesi akun demo BPS.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailNotFound(false);
    setLoading(true);

    if (tab === 'login') {
      if (!email || !password) {
        setError('Silakan isi alamat email dan kata sandi.');
        setLoading(false);
        return;
      }
      const res = await loginWithEmail(email, password);
      if (!res.success) {
        setError(res.error || 'Login gagal.');
        if (res.error?.includes('belum terdaftar')) {
          setEmailNotFound(true);
        }
      }
    } else {
      if (!name || !email || !password || !institution) {
        setError('Harap lengkapi seluruh field pendaftaran.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Kata sandi minimal 6 karakter demi keamanan akun Anda.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
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

  const switchToRegisterWithCurrentEmail = () => {
    setTab('register');
    setError(null);
    setEmailNotFound(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl border-2 border-stone-300 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-stone-200 bg-gradient-to-b from-stone-50 to-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-700 text-white shadow-sm shadow-blue-700/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {tab === 'login' ? 'Masuk ke Portal Resilia' : 'Pendaftaran Akun Pengguna'}
              </h2>
              <p className="text-xs text-slate-800 font-bold mt-0.5">
                Akses penuh ISO 31000, sertifikat kelulusan &amp; register risiko
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Tab Switcher: Masuk vs Daftar */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl border border-stone-300 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(null); setEmailNotFound(false); }}
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
              onClick={() => { setTab('register'); setError(null); setEmailNotFound(false); }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-blue-900 shadow-xs border border-stone-300 font-black'
                  : 'text-slate-800 hover:text-slate-900'
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {/* Section 1: Google OAuth 2.0 (Clean, No Dev Setup Box) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-stone-50 border-2 border-stone-300 space-y-2.5">
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
                <span>Masuk Cepat dengan Google</span>
              </span>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                ● OAuth 2.0 Aktif
              </span>
            </div>

            {/* Official Google Identity Services Button Container */}
            <div className="flex flex-col items-center justify-center py-1">
              <div ref={googleButtonContainerRef} className="min-h-[40px] flex items-center justify-center w-full" />
              
              <button
                type="button"
                onClick={handleDemoGoogleClick}
                disabled={loading}
                className="mt-2 text-[11px] text-blue-800 hover:text-blue-950 font-bold underline underline-offset-2 cursor-pointer transition-colors"
              >
                Alternatif: Klik di sini untuk masuk instan akun Google
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t-2 border-stone-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-black text-slate-800 uppercase tracking-wider shrink-0">
              atau gunakan email instansi / non-gmail
            </span>
          </div>

          {/* Non-Gmail Guidance Callout */}
          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-2.5 text-xs text-slate-800">
            <Building className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-black text-blue-950">
                Mendukung Semua Email Dinas &amp; Organisasi (100% Aktif)
              </p>
              <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                Anda dapat menggunakan email instansi (<strong className="text-blue-900">@bps.go.id</strong>, <strong className="text-blue-900">@kemenkeu.go.id</strong>, <strong className="text-blue-900">@bumn.id</strong>, dsb), korporasi perusahaan, maupun email publik (Yahoo, Outlook, dsb).
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border-2 border-rose-300 flex flex-col gap-2 text-xs text-rose-950 font-bold">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              {emailNotFound && (
                <button
                  type="button"
                  onClick={switchToRegisterWithCurrentEmail}
                  className="self-start inline-flex items-center gap-1.5 px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Daftarkan email "{email}" sekarang</span>
                </button>
              )}
            </div>
          )}

          {/* Form: Email Login / Register */}
          <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
            {tab === 'register' && (
              <>
                {/* Nama Lengkap */}
                <div>
                  <label className="block font-black text-slate-900 mb-1">
                    Nama Lengkap &amp; Gelar <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Contoh: Budi Raharja, S.Si, M.Stat"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-700 shadow-2xs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-600 font-semibold mt-0.5 block">
                    Nama ini akan tercetak secara resmi pada Sertifikat Kelulusan ISO 31000 Anda.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Instansi / Organisasi */}
                  <div>
                    <label className="block font-black text-slate-900 mb-1">
                      Instansi / Lembaga <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                      <input
                        type="text"
                        required
                        value={institution}
                        onChange={e => setInstitution(e.target.value)}
                        placeholder="Contoh: Badan Pusat Statistik"
                        className="w-full pl-9 pr-3 py-2 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-700 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Peran / Jabatan */}
                  <div>
                    <label className="block font-black text-slate-900 mb-1">
                      Peran / Jabatan
                    </label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-blue-700 shadow-2xs cursor-pointer"
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
                </div>
              </>
            )}

            {/* Alamat Email */}
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
                  placeholder="Contoh: budi@bps.go.id atau nama@kantor.co.id"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-700 shadow-2xs"
                />
              </div>
            </div>

            {/* Kata Sandi with Visibility Toggle */}
            <div>
              <label className="block font-black text-slate-900 mb-1">
                Kata Sandi <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={tab === 'register' ? 'Minimal 6 karakter' : 'Masukkan kata sandi'}
                  className="w-full pl-9 pr-10 py-2.5 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-700 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 cursor-pointer"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Kata Sandi (Register Only) */}
            {tab === 'register' && (
              <div>
                <label className="block font-black text-slate-900 mb-1">
                  Ulangi Kata Sandi <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-700" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi yang sama"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border-2 border-stone-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-500 focus:outline-none focus:border-blue-700 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 cursor-pointer"
                    title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-black text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-700/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 text-xs sm:text-sm"
            >
              <span>{tab === 'login' ? 'Masuk ke Akun Resilia' : 'Daftar Akun & Dapatkan Sertifikat'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Quick Demo BPS Account Button */}
          {tab === 'login' && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleBpsDemoClick}
                disabled={loading}
                className="w-full py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-98"
              >
                <Zap className="w-4 h-4 text-emerald-700 fill-emerald-600" />
                <span>Uji Coba 1-Klik: Akun Demo BPS (analis.risiko@bps.go.id)</span>
              </button>
            </div>
          )}

          {/* Footer Navigation Links */}
          <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-700 font-medium">
            {tab === 'login' ? (
              <p>
                Belum memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(null); setEmailNotFound(false); }}
                  className="font-black text-blue-800 hover:underline cursor-pointer"
                >
                  Daftar di sini
                </button>
              </p>
            ) : (
              <p>
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => { setTab('login'); setError(null); setEmailNotFound(false); }}
                  className="font-black text-blue-800 hover:underline cursor-pointer"
                >
                  Masuk di sini
                </button>
              </p>
            )}

            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privat &amp; Terenkripsi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
