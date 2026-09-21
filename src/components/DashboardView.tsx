import React from 'react';
import {
  Users,
  GraduationCap,
  School,
  CalendarCheck,
  BookMarked,
  Sparkles,
  Heart,
  Award,
  ArrowRight,
  TrendingUp,
  FileCheck2
} from 'lucide-react';
import { User, SchoolConfig, Student, SchoolClass, AttendanceRecord, TeachingJournal, SavedDocument } from '../types';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  currentUser: User;
  config: SchoolConfig;
  students: Student[];
  classes: SchoolClass[];
  attendance: AttendanceRecord[];
  journals: TeachingJournal[];
  savedDocs: SavedDocument[];
  onNavigate: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  config,
  students,
  classes,
  attendance,
  journals,
  savedDocs,
  onNavigate
}) => {
  // Compute metrics
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const totalJournals = journals.length;
  const totalDocs = savedDocs.length;

  // Attendance summary
  const recentAttendance = attendance.slice(0, 5);
  let totalPresent = 0;
  let totalAbsences = 0;
  attendance.forEach((rec) => {
    rec.dataSiswa.forEach((s) => {
      if (s.status === 'Hadir') totalPresent++;
      else totalAbsences++;
    });
  });
  const attendanceRate = totalPresent + totalAbsences > 0
    ? Math.round((totalPresent / (totalPresent + totalAbsences)) * 100)
    : 100;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/80 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Sistem Administrasi Guru & Sekolah Terpadu</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
            Selamat Datang, {currentUser.namaLengkap}
          </h1>
          <p className="text-sm md:text-base text-slate-300 mt-2 leading-relaxed">
            Kelola perencanaan pembelajaran, perangkat ajar AI Kurikulum Merdeka & Kurikulum Berbasis Cinta (KBC), rekapitulasi nilai, serta bimbingan siswa secara terpadu dan efisien.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={() => onNavigate('merdeka_ai')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buat Perangkat Merdeka AI</span>
            </button>
            <button
              onClick={() => onNavigate('kbc_ai')}
              className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-semibold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              <span>Perangkat Ajar KBC (10 Paket)</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>Input Presensi Hari Ini</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Siswa */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-slate-850 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-5 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Siswa Terdata</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{totalStudents}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Terdistribusi di {totalClasses} Rombel</span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        {/* Card 2: Kehadiran */}
        <div
          onClick={() => onNavigate('attendance')}
          className="bg-slate-850 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-5 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tingkat Kehadiran</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-400">{attendanceRate}%</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {attendance.length} sesi pertemuan tercatat
            </div>
          </div>
        </div>

        {/* Card 3: Jurnal Mengajar */}
        <div
          onClick={() => onNavigate('journals')}
          className="bg-slate-850 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-5 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Agenda & Jurnal Guru</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <BookMarked className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{totalJournals}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Aktivitas mengajar terdata</span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>

        {/* Card 4: Dokumen Perangkat AI */}
        <div
          onClick={() => onNavigate('saved_docs')}
          className="bg-slate-850 hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-5 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Arsip Perangkat AI</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{totalDocs}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Dokumen siap cetak / Word</span>
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Attendance & Quick Generators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Attendance & Activities */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <span>Riwayat Presensi Terbaru</span>
              </h3>
              <button
                onClick={() => onNavigate('attendance')}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                Lihat Semua <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {recentAttendance.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Belum ada catatan presensi.</p>
            ) : (
              <div className="space-y-3">
                {recentAttendance.map((rec) => {
                  const hadirCount = rec.dataSiswa.filter((s) => s.status === 'Hadir').length;
                  const total = rec.dataSiswa.length;
                  return (
                    <div
                      key={rec.id}
                      className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">
                          {rec.kelas} • {rec.mapel} (Jam: {rec.jamKe})
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {rec.tanggal} • Guru: {rec.guruNama}
                        </div>
                        <div className="text-[11px] text-slate-500 italic mt-1 line-clamp-1">
                          Materi: {rec.materi}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                          {hadirCount} / {total} Hadir
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Agenda Jurnal */}
          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-amber-400" />
                <span>Agenda & Jurnal Guru Terkini</span>
              </h3>
              <button
                onClick={() => onNavigate('journals')}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
              >
                Tulis Jurnal <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {journals.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Belum ada catatan agenda mengajar.</p>
            ) : (
              <div className="space-y-3">
                {journals.slice(0, 3).map((j) => (
                  <div
                    key={j.id}
                    className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{j.kelas} • {j.mapel}</span>
                      <span className="text-[11px] text-slate-400">{j.tanggal} ({j.jamKe})</span>
                    </div>
                    <p className="text-slate-300 line-clamp-1 font-medium">Materi: {j.materiPokok}</p>
                    <p className="text-slate-400 text-[11px] line-clamp-2">Kegiatan: {j.kegiatan}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: AI Generator Shortcuts */}
        <div className="space-y-6">
          {/* Kurikulum Merdeka AI Card */}
          <div className="bg-gradient-to-br from-indigo-950/70 via-slate-850 to-slate-850 border border-indigo-500/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Kurikulum Merdeka (6 Dokumen)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generator standar Kurikulum Merdeka siap cetak dan export ke Microsoft Word:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">✓ ADM-CP (Analisis Capaian Pembelajaran)</li>
              <li className="flex items-center gap-1.5">✓ ADM-TP (Tujuan Pembelajaran ABCD)</li>
              <li className="flex items-center gap-1.5">✓ ADM-ATP (Alur TP Visual Landscape)</li>
              <li className="flex items-center gap-1.5">✓ ADM-PROTA (Program Tahunan Efektif)</li>
              <li className="flex items-center gap-1.5">✓ ADM-PROSEM (Matriks Warna Landscape)</li>
              <li className="flex items-center gap-1.5">✓ ADM-KKTP (Rubrik 4 Level Permendikbud)</li>
            </ul>
            <button
              onClick={() => onNavigate('merdeka_ai')}
              className="w-full mt-4 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Buka Generator Merdeka</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Kurikulum Berbasis Cinta (KBC) Card */}
          <div className="bg-gradient-to-br from-rose-950/70 via-slate-850 to-slate-850 border border-rose-500/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
              <Heart className="w-4 h-4" />
              <span>Kurikulum Berbasis Cinta (KBC)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              10 Dokumen Terpadu Panca Cinta (Allah, Sesama, Ilmu, Bangsa, Alam) & 10 Nilai Profil PPRA:
            </p>
            <ul className="mt-3 space-y-1 text-xs text-slate-400">
              <li>• ACP, TP, ATP, PROTA, PROSEM KBC</li>
              <li>• KKTP KBC & Modul Ajar Deep Learning KBC</li>
              <li>• LKPD KBC Berempati & Refleksi Hati</li>
              <li>• Rubrik Formatif & Sumatif Qudwah 100%</li>
            </ul>
            <button
              onClick={() => onNavigate('kbc_ai')}
              className="w-full mt-4 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Buka 10 Paket KBC AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
