import React from 'react';
import {
  LayoutDashboard,
  Settings,
  Users,
  GraduationCap,
  School,
  CalendarCheck,
  BookMarked,
  Award,
  HeartHandshake,
  FileText,
  Sparkles,
  Heart,
  FolderArchive,
  DatabaseZap,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { UserRole } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'config'
  | 'users'
  | 'classes'
  | 'students'
  | 'attendance'
  | 'journals'
  | 'grades'
  | 'wali_guidance'
  | 'wali_recap'
  | 'merdeka_ai'
  | 'modul_ajar_ai'
  | 'kbc_ai'
  | 'saved_docs'
  | 'database_reset';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  role: UserRole;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  role,
  isOpenMobile,
  onCloseMobile
}) => {
  const isAdmin = role === 'admin';
  const isWaliKelas = role === 'wali_kelas' || role === 'admin';

  const navItem = (tab: ActiveTab, label: string, icon: React.ReactNode, badge?: string) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => {
          onSelectTab(tab);
          onCloseMobile();
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
          isActive
            ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700 text-white shadow-md shadow-indigo-700/25 font-semibold'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={isActive ? 'text-white' : 'text-slate-400'}>{icon}</span>
          <span className="truncate">{label}</span>
        </div>
        {badge && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold tracking-wider text-sm">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              ADMINISTRASI GURU
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            v2.5
          </span>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {/* Menu Utama */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Menu Utama
            </p>
            <div className="space-y-1">
              {navItem('dashboard', 'Dashboard Terpadu', <LayoutDashboard className="w-4 h-4" />)}
            </div>
          </div>

          {/* Konfigurasi & Master Data (Admin / Wali) */}
          {(isAdmin || isWaliKelas) && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Manajemen Sekolah
              </p>
              <div className="space-y-1">
                {isAdmin && navItem('config', 'Konfigurasi Sistem', <Settings className="w-4 h-4" />, 'Admin')}
                {isAdmin && navItem('users', 'Kelola Pengguna', <Users className="w-4 h-4" />, 'Admin')}
                {isAdmin && navItem('classes', 'Kelola Kelas & Wali', <School className="w-4 h-4" />, 'Admin')}
                {navItem('students', 'Import & Data Siswa', <GraduationCap className="w-4 h-4" />)}
              </div>
            </div>
          )}

          {/* Pembelajaran Harian (Semua Role) */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Pembelajaran Harian
            </p>
            <div className="space-y-1">
              {navItem('attendance', 'Absensi & Presensi', <CalendarCheck className="w-4 h-4" />)}
              {navItem('journals', 'Agenda & Jurnal Guru', <BookMarked className="w-4 h-4" />)}
              {navItem('grades', 'Input Nilai & Asesmen', <Award className="w-4 h-4" />)}
            </div>
          </div>

          {/* Menu Khusus Wali Kelas */}
          {isWaliKelas && (
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1">
                <HeartHandshake className="w-3 h-3 text-emerald-400" />
                Khusus Wali Kelas
              </p>
              <div className="space-y-1">
                {navItem('wali_guidance', 'Bimbingan & Konseling', <HeartHandshake className="w-4 h-4 text-emerald-400" />, 'Wali')}
                {navItem('wali_recap', 'Rekapitulasi Kelas', <ClipboardList className="w-4 h-4 text-emerald-400" />, 'Wali')}
              </div>
            </div>
          )}

          {/* Generator AI Kurikulum Merdeka */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              Perangkat Ajar AI
            </p>
            <div className="space-y-1">
              {navItem('merdeka_ai', '6 Dokumen Standar', <FileText className="w-4 h-4 text-sky-400" />, 'Merdeka')}
              {navItem('modul_ajar_ai', 'Modul Ajar & Asesmen', <Sparkles className="w-4 h-4 text-amber-400" />, 'Deep')}
            </div>
          </div>

          {/* Generator AI Kurikulum Berbasis Cinta (KBC) */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-400" />
              Perangkat Ajar KBC
            </p>
            <div className="space-y-1">
              {navItem('kbc_ai', '10 Dokumen KBC & PPRA', <Heart className="w-4 h-4 text-rose-400" />, '10 Paket')}
            </div>
          </div>

          {/* Arsip Dokumen & Database */}
          <div>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Penyimpanan & Sistem
            </p>
            <div className="space-y-1">
              {navItem('saved_docs', 'Arsip Dokumen Cetak', <FolderArchive className="w-4 h-4 text-indigo-300" />)}
              {isAdmin && navItem('database_reset', 'Manajemen Database', <DatabaseZap className="w-4 h-4 text-rose-400" />, 'Reset')}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-[11px] text-slate-400 text-center">
          Powered by <span className="text-indigo-400 font-semibold">Gemini 3.8 Flash</span> & Firestore
        </div>
      </aside>
    </>
  );
};
