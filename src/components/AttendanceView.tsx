import React, { useState } from 'react';
import { CalendarCheck, CheckCircle2, Clock, Users, Plus, Trash2, Printer, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import { AttendanceRecord, Student, SchoolClass, User } from '../types';

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  students: Student[];
  classes: SchoolClass[];
  currentUser: User;
  onRefreshAttendance: () => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  attendance,
  students,
  classes,
  currentUser,
  onRefreshAttendance
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.namaKelas || 'Kelas VII-A');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [mapel, setMapel] = useState<string>(currentUser.mapel || 'Matematika');
  const [jamKe, setJamKe] = useState<string>('1 - 2 (07.00 - 08.20)');
  const [materi, setMateri] = useState<string>('');
  const [catatanKejadian, setCatatanKejadian] = useState<string>('Proses belajar berlangsung tertib dan kondusif.');

  // Students in selected class
  const classStudents = students.filter((s) => s.kelas === selectedClass);

  // Student status tracker
  const [statuses, setStatuses] = useState<Record<string, { status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa'; catatan?: string }>>({});

  // Initialize or update statuses when class changes
  React.useEffect(() => {
    const init: Record<string, { status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa'; catatan?: string }> = {};
    classStudents.forEach((s) => {
      init[s.id] = statuses[s.id] || { status: 'Hadir', catatan: '' };
    });
    setStatuses(init);
  }, [selectedClass, students]);

  const setAllStatus = (status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    const updated: Record<string, { status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa'; catatan?: string }> = {};
    classStudents.forEach((s) => {
      updated[s.id] = { status, catatan: '' };
    });
    setStatuses(updated);
  };

  const handleStatusChange = (siswaId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    setStatuses((prev) => ({
      ...prev,
      [siswaId]: { ...prev[siswaId], status }
    }));
  };

  const handleSaveAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (classStudents.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Tidak Ada Siswa',
        text: 'Belum ada siswa terdaftar pada kelas ini.',
        background: '#0f172a',
        color: '#f8fafc'
      });
      return;
    }

    const dataSiswa = classStudents.map((s) => ({
      siswaId: s.id,
      siswaNama: s.nama,
      nisn: s.nisn,
      status: statuses[s.id]?.status || 'Hadir',
      catatan: statuses[s.id]?.catatan || ''
    }));

    const payload = {
      tanggal: selectedDate,
      kelas: selectedClass,
      mapel,
      jamKe,
      materi: materi || 'Materi Pembelajaran Harian',
      catatanKejadian,
      guruId: currentUser.id,
      guruNama: currentUser.namaLengkap,
      dataSiswa
    };

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Presensi Disimpan!',
          text: `Presensi ${selectedClass} tanggal ${selectedDate} berhasil direkam.`,
          timer: 1800,
          background: '#0f172a',
          color: '#f8fafc',
          showConfirmButton: false
        });
        onRefreshAttendance();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal Menyimpan', background: '#0f172a', color: '#f8fafc' });
    }
  };

  const handleDeleteRecord = async (id: string) => {
    Swal.fire({
      title: 'Hapus Rekaman Presensi?',
      text: 'Data presensi ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus',
      background: '#0f172a',
      color: '#f8fafc'
    }).then(async (res) => {
      if (res.isConfirmed) {
        await fetch(`/api/attendance/${id}`, { method: 'DELETE' });
        onRefreshAttendance();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-emerald-400" />
          <span>Absensi & Presensi Pembelajaran Harian</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Catat kehadiran peserta didik per jam mata pelajaran secara real-time dan terintegrasi dengan jurnal guru.
        </p>
      </div>

      {/* Input Attendance Card */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <form onSubmit={handleSaveAttendance} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Rombel / Kelas</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.namaKelas}>
                    {c.namaKelas}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Tanggal Pertemuan</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Mata Pelajaran</label>
              <input
                type="text"
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                placeholder="Matematika / IPA / dll"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Jam Pelajaran</label>
              <input
                type="text"
                value={jamKe}
                onChange={(e) => setJamKe(e.target.value)}
                placeholder="1 - 2 (07.00 - 08.20)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Topik / Materi Pembelajaran Hari Ini</label>
              <input
                type="text"
                value={materi}
                onChange={(e) => setMateri(e.target.value)}
                placeholder="Contoh: Operasi Penjumlahan & Pengurangan Bilangan Bulat"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Catatan Kejadian / Observasi Kelas</label>
              <input
                type="text"
                value={catatanKejadian}
                onChange={(e) => setCatatanKejadian(e.target.value)}
                placeholder="Catatan keaktifan siswa atau kendala kelas"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick status bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300">
              Daftar Siswa {selectedClass} ({classStudents.length} Siswa)
            </span>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 mr-1">Set Semua:</span>
              <button
                type="button"
                onClick={() => setAllStatus('Hadir')}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 transition font-medium cursor-pointer"
              >
                Hadir
              </button>
              <button
                type="button"
                onClick={() => setAllStatus('Sakit')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30 transition font-medium cursor-pointer"
              >
                Sakit
              </button>
              <button
                type="button"
                onClick={() => setAllStatus('Izin')}
                className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 border border-blue-500/30 transition font-medium cursor-pointer"
              >
                Izin
              </button>
            </div>
          </div>

          {/* Student checklist grid */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="px-3 py-2.5">No</th>
                  <th className="px-3 py-2.5">Nama Siswa</th>
                  <th className="px-3 py-2.5 text-center">Status Kehadiran</th>
                  <th className="px-3 py-2.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {classStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                      Belum ada siswa dalam kelas ini. Silakan tambahkan siswa di menu Kelola Siswa.
                    </td>
                  </tr>
                ) : (
                  classStudents.map((s, idx) => {
                    const currentStatus = statuses[s.id]?.status || 'Hadir';
                    return (
                      <tr key={s.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-3 py-2 text-slate-500 w-10 text-center">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium text-slate-100">
                          {s.nama}
                          <span className="text-[10px] text-slate-500 ml-2 font-mono">({s.nisn})</span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="inline-flex items-center gap-1">
                            {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as const).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleStatusChange(s.id, st)}
                                className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                                  currentStatus === st
                                    ? st === 'Hadir'
                                      ? 'bg-emerald-600 text-white shadow-sm'
                                      : st === 'Sakit'
                                      ? 'bg-amber-600 text-white'
                                      : st === 'Izin'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-rose-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-2 w-48">
                          <input
                            type="text"
                            value={statuses[s.id]?.catatan || ''}
                            onChange={(e) =>
                              setStatuses((prev) => ({
                                ...prev,
                                [s.id]: { ...prev[s.id], catatan: e.target.value }
                              }))
                            }
                            placeholder="Alasan / catatan..."
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={classStudents.length === 0}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Rekam Presensi</span>
            </button>
          </div>
        </form>
      </div>

      {/* Attendance History */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Rekap Histori Presensi Sebelumnya</span>
        </h3>

        <div className="space-y-3">
          {attendance.map((att) => {
            const hadir = att.dataSiswa.filter((s) => s.status === 'Hadir').length;
            const sakit = att.dataSiswa.filter((s) => s.status === 'Sakit').length;
            const izin = att.dataSiswa.filter((s) => s.status === 'Izin').length;
            const alpa = att.dataSiswa.filter((s) => s.status === 'Alpa').length;

            return (
              <div
                key={att.id}
                className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-slate-100 text-sm">
                    {att.kelas} • {att.mapel}
                  </div>
                  <div className="text-slate-400">
                    Tanggal: <span className="text-slate-200 font-medium">{att.tanggal}</span> | Jam ke: {att.jamKe} | Pengampu: {att.guruNama}
                  </div>
                  <div className="text-slate-500 italic">Materi: {att.materi}</div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 text-[11px]">
                    Hadir: {hadir}
                  </span>
                  {sakit > 0 && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30 text-[11px]">
                      Sakit: {sakit}
                    </span>
                  )}
                  {izin > 0 && (
                    <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 font-bold border border-blue-500/30 text-[11px]">
                      Izin: {izin}
                    </span>
                  )}
                  {alpa > 0 && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 font-bold border border-rose-500/30 text-[11px]">
                      Alpa: {alpa}
                    </span>
                  )}

                  <button
                    onClick={() => handleDeleteRecord(att.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition ml-2 cursor-pointer"
                    title="Hapus Sesi Presensi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
