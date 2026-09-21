import React from 'react';
import { LogOut, User as UserIcon, Shield, GraduationCap, Users, Menu, Sparkles, Building } from 'lucide-react';
import Swal from 'sweetalert2';
import { User, SchoolConfig } from '../types';

interface NavbarProps {
  currentUser: User;
  config: SchoolConfig;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onOpenConfig?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  config,
  onLogout,
  onToggleSidebar,
  onOpenConfig
}) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Shield className="w-3 h-3" />
            ADMINISTRATOR
          </span>
        );
      case 'wali_kelas':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Users className="w-3 h-3" />
            WALI KELAS {currentUser.kelasBinaan ? `(${currentUser.kelasBinaan})` : ''}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <GraduationCap className="w-3 h-3" />
            GURU MAPEL
          </span>
        );
    }
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: 'Konfirmasi Keluar',
      text: 'Apakah Anda yakin ingin keluar dari sesi aplikasi ini?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout();
      }
    });
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Left section: mobile toggle & school identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-slate-100 tracking-tight leading-tight line-clamp-1">
              {config.namaSekolah || 'Sistem Sekolah Terpadu'}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>TP: {config.tahunPelajaran}</span>
              <span>•</span>
              <span className="text-indigo-400 font-medium">Sem: {config.semesterAktif}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right section: user profile & actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-200">{currentUser.namaLengkap}</span>
            {getRoleBadge(currentUser.role)}
          </div>
          <span className="text-[11px] text-slate-400">
            {currentUser.mapel} {currentUser.nip !== '-' ? `• NIP: ${currentUser.nip}` : ''}
          </span>
        </div>

        <button
          onClick={handleLogoutClick}
          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          title="Keluar dari Akun"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};
