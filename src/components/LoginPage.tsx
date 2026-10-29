import React, { useState } from 'react';
import { 
  Home, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  KeyRound,
  ShieldAlert,
  Info
} from 'lucide-react';
import { AdminCredentials, AdminUser } from '../types/auth';

interface LoginPageProps {
  onLoginSuperAdmin: (user?: AdminUser) => void;
  onLoginPublic: () => void;
  adminCredentials: AdminCredentials;
  adminUsers?: AdminUser[];
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuperAdmin,
  onLoginPublic,
  adminCredentials,
  adminUsers = [],
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setErrorMsg('Mohon masukkan Username dan Password kedinasan.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 1. Check against registered Admin Users list first
      const matchedUser = adminUsers.find(
        (u) => u.username.toLowerCase() === trimmedUser.toLowerCase()
      );

      if (matchedUser) {
        if (!matchedUser.isActive) {
          setIsLoading(false);
          setErrorMsg(`Akun "${matchedUser.fullName}" sedang dinonaktifkan oleh Super Admin. Hubungi pengelola Disperkim Konawe.`);
          return;
        }

        if (matchedUser.password === password) {
          setIsLoading(false);
          onLoginSuperAdmin(matchedUser);
          return;
        }
      }

      // 2. Check against primary Super Admin credentials (from local storage or default)
      const isValidPrimaryAdmin = 
        (trimmedUser.toLowerCase() === adminCredentials.username.toLowerCase()) &&
        (password === adminCredentials.password);

      if (isValidPrimaryAdmin) {
        setIsLoading(false);
        onLoginSuperAdmin();
        return;
      }

      // If neither matched
      setIsLoading(false);
      setErrorMsg('Username atau Password kedinasan tidak valid. Harap periksa kembali atau hubungi Super Admin.');
    }, 450);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-[#081E3D] text-slate-100 overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Background Graphic Asset with Dark PAN Blue Scrim */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img 
          src="/assets/aistudio/Background_Gotong_Royong_Membangun_Rumah_Layak_Huni_adcbf580.png" 
          alt="Latar Belakang E-RTLH Konawe"
          className="w-full h-full object-cover object-center opacity-35"
        />
        {/* Multilayered radial and linear scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#081E3D] via-[#081E3D]/80 to-[#081E3D]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-[#081E3D]/80 to-[#081E3D]" />
      </div>

      {/* Decorative Brand Circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-md bg-[#0B254C]/95 backdrop-blur-xl border border-blue-500/30 rounded-3xl shadow-2xl p-6 sm:p-9 space-y-6">
        
        {/* Card Header & Brand Logo */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-[#0A3981] border border-blue-400/50 shadow-lg shadow-blue-950/60 mx-auto">
            <Home className="w-7 h-7 text-white" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
              <span>PEMKAB KONAWE • DISPERKIM</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              SI-RTLH KONAWE
            </h1>
            <p className="text-xs text-blue-200/80 font-medium mt-0.5">
              Sistem Informasi Pendataan &amp; Verifikasi Rumah Tidak Layak Huni
            </p>
          </div>

          {/* Slogan Dua Baris Proporsional */}
          <div className="pt-1">
            <p 
              className="text-xs sm:text-[13px] italic font-medium text-amber-300 tracking-wide leading-relaxed"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Rumah Layak, Hidup Lebih Baik<br />
              <span className="text-amber-200/90">Untuk Konawe Bersahaja.</span>
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-500/60 text-red-200 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Form Login Admin / Petugas */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-blue-100 font-semibold mb-1.5 flex items-center justify-between">
              <span>Username Kedinasan</span>
              <span className="text-[10px] text-blue-300/70">Wajib Diisi</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-blue-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin / verifikator..."
                autoComplete="username"
                className="w-full bg-[#081E3D]/80 border border-blue-400/40 rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-xs transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-blue-100 font-semibold mb-1.5 flex items-center justify-between">
              <span>Password / Kata Sandi</span>
              <span className="text-[10px] text-blue-300/70">Tersandi</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-blue-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                autoComplete="current-password"
                className="w-full bg-[#081E3D]/80 border border-blue-400/40 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder:text-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-xs transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/70 hover:text-white transition p-0.5 cursor-pointer"
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit Button Admin */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xs shadow-lg shadow-blue-900/50 hover:shadow-blue-800/60 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-blue-400/30"
          >
            {isLoading ? (
              <span>Memverifikasi Akses Kedinasan...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Masuk Portal Administrator</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/80" />
              </>
            )}
          </button>
        </form>

        {/* Separator Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-blue-400/20 w-full" />
          <span className="bg-[#0B254C] px-3 text-[10px] text-blue-200/60 uppercase tracking-widest font-semibold shrink-0">
            Akses Publik
          </span>
          <div className="border-t border-blue-400/20 w-full" />
        </div>

        {/* Guest / Public Login Option */}
        <div>
          <button
            type="button"
            onClick={onLoginPublic}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-blue-100 hover:text-white font-semibold text-xs border border-blue-400/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4 text-blue-300" />
            <span>Masuk sebagai Tamu / User Publik</span>
          </button>
          <p className="text-[10px] text-blue-200/60 text-center mt-2 leading-relaxed">
            * Mode publik menampilkan data usulan dengan perlindungan sensor NIK &amp; No KK (sesuai UU Pelindungan Data Pribadi).
          </p>
        </div>

        {/* Secure Confidential Portal Notice (No Plain-Text Credentials Leaked) */}
        <div className="pt-3 border-t border-blue-500/20">
          <div className="bg-[#081E3D]/90 rounded-2xl p-3 border border-blue-400/20 text-[11px] text-blue-200/80 space-y-1.5">
            <div className="font-semibold text-amber-300 flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Sistem Keamanan Otorisasi Kedinasan</span>
            </div>
            <p className="text-[10px] text-blue-200/70 leading-relaxed">
              Hak akses login dan pendaftaran akun baru dikelola langsung oleh <strong>Super Administrator Dinas Perumahan dan Kawasan Permukiman Kab. Konawe</strong>. Jika membutuhkan akses petugas lapangan, hubungi Tim Verifikator Disperkim.
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-blue-200/50">
          Dinas Perumahan dan Kawasan Permukiman Kab. Konawe &copy; 2026
        </div>

      </div>

    </div>
  );
};
