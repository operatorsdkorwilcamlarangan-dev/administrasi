import React, { useState } from 'react';
import { School, Lock, User as UserIcon, ShieldCheck, BookOpen, Heart, Sparkles } from 'lucide-react';
import Swal from 'sweetalert2';
import { User, SchoolConfig } from '../types';

interface LoginPageProps {
  config: SchoolConfig;
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ config, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Input Belum Lengkap',
        text: 'Silakan masukkan username dan password Anda.',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Selamat Datang!',
          text: `Berhasil masuk sebagai ${data.user.namaLengkap} (${data.user.role.toUpperCase()})`,
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: '#10b981',
          timer: 1800,
          showConfirmButton: false
        });
        onLoginSuccess(data.user);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Masuk',
          text: data.message || 'Username atau password tidak valid.',
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Bermasalah',
        text: 'Tidak dapat terhubung ke server autentikasi.',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoUser = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden bg-slate-950 font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-indigo-600/20 via-sky-500/15 to-rose-500/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-pink-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Login Card with Glassmorphism */}
      <div className="w-full max-w-md z-10">
        <div className="backdrop-blur-xl bg-slate-900/80 border border-slate-800/80 shadow-2xl shadow-indigo-950/50 rounded-2xl p-7 md:p-9 text-slate-100 transition-all">
          
          {/* Header */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-500/30 mb-4 ring-4 ring-indigo-500/20">
              {config.logoKiri ? (
                <img src={config.logoKiri} alt="Logo Sekolah" className="w-12 h-12 object-contain" />
              ) : (
                <School className="w-8 h-8" />
              )}
            </div>

            <p className="text-xs uppercase tracking-widest font-semibold text-indigo-400">
              SISTEM ADMINISTRASI TERPADU
            </p>
            
            {/* Dynamic School Name from Config */}
            <h1 className="text-xl md:text-2xl font-bold mt-1 text-slate-100 tracking-tight leading-tight">
              {config.namaSekolah || 'SISTEM MANAJEMEN SEKOLAH'}
            </h1>
            
            <p className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
              <span>Kurikulum Merdeka & Kurikulum Berbasis Cinta (KBC)</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username Akun
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masuk ke Sistem</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider mb-2.5">
              Akses Cepat Pengujian (Role-Based Access):
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoUser('admin', 'admin123')}
                className="py-2 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-center transition group cursor-pointer"
              >
                <div className="font-semibold text-indigo-300 group-hover:text-indigo-200">Admin</div>
                <div className="text-[10px] text-slate-400">admin / admin123</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoUser('guru1', 'guru123')}
                className="py-2 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-center transition group cursor-pointer"
              >
                <div className="font-semibold text-sky-300 group-hover:text-sky-200">Guru Mapel</div>
                <div className="text-[10px] text-slate-400">guru1 / guru123</div>
              </button>

              <button
                type="button"
                onClick={() => setDemoUser('wali1', 'wali123')}
                className="py-2 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-center transition group cursor-pointer"
              >
                <div className="font-semibold text-emerald-300 group-hover:text-emerald-200">Wali Kelas</div>
                <div className="text-[10px] text-slate-400">wali1 / wali123</div>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-[11px] text-slate-500">
            Tahun Pelajaran: {config.tahunPelajaran} • Semester {config.semesterAktif}
          </div>
        </div>
      </div>
    </div>
  );
};
