import React, { useState } from 'react';
import { BookMarked, Plus, Calendar, Clock, BookOpen, Trash2, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { TeachingJournal, SchoolClass, User } from '../types';

interface JournalViewProps {
  journals: TeachingJournal[];
  classes: SchoolClass[];
  currentUser: User;
  onRefreshJournals: () => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  journals,
  classes,
  currentUser,
  onRefreshJournals
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [kelas, setKelas] = useState(classes[0]?.namaKelas || 'Kelas VII-A');
  const [mapel, setMapel] = useState(currentUser.mapel || 'Matematika');
  const [jamKe, setJamKe] = useState('1 - 2 (07.00 - 08.20)');
  const [materiPokok, setMateriPokok] = useState('');
  const [kegiatan, setKegiatan] = useState('');
  const [pencapaianKendala, setPencapaianKendala] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      tanggal,
      guruId: currentUser.id,
      guruNama: currentUser.namaLengkap,
      kelas,
      mapel,
      jamKe,
      materiPokok,
      kegiatan,
      pencapaianKendala,
      tindakLanjut
    };

    try {
      const res = await fetch('/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Jurnal Tersimpan',
          timer: 1500,
          background: '#0f172a',
          color: '#f8fafc',
          showConfirmButton: false
        });
        setShowAdd(false);
        setMateriPokok('');
        setKegiatan('');
        setPencapaianKendala('');
        setTindakLanjut('');
        onRefreshJournals();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal Menyimpan Jurnal', background: '#0f172a', color: '#f8fafc' });
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Hapus Catatan Jurnal?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus',
      background: '#0f172a',
      color: '#f8fafc'
    }).then(async (res) => {
      if (res.isConfirmed) {
        await fetch(`/api/journals/${id}`, { method: 'DELETE' });
        onRefreshJournals();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-amber-400" />
            <span>Agenda & Jurnal Mengajar Harian Guru</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rekam aktivitas pembelajaran, pencapaian kompetensi, refleksi kendala, dan tindak lanjut per pertemuan.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Jurnal Baru</span>
        </button>
      </div>

      {/* Modal / Form Add Journal */}
      {showAdd && (
        <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Formulir Jurnal Mengajar Baru</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Kelas</label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none cursor-pointer"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.namaKelas}>
                      {c.namaKelas}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Jam Ke</label>
                <input
                  type="text"
                  value={jamKe}
                  onChange={(e) => setJamKe(e.target.value)}
                  placeholder="1 - 2 (07.00 - 08.20)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Materi Pokok / Bahasan</label>
              <input
                type="text"
                value={materiPokok}
                onChange={(e) => setMateriPokok(e.target.value)}
                placeholder="Contoh: Operasi Penjumlahan Bilangan Bulat Negatif"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Aktivitas & Model Pembelajaran</label>
                <textarea
                  rows={3}
                  value={kegiatan}
                  onChange={(e) => setKegiatan(e.target.value)}
                  placeholder="Diskusi kelompok, eksplorasi LKPD, ice breaking..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Pencapaian Siswa & Kendala</label>
                <textarea
                  rows={3}
                  value={pencapaianKendala}
                  onChange={(e) => setPencapaianKendala(e.target.value)}
                  placeholder="Sebagian siswa masih ragu saat mengurangkan bilangan negatif..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Rencana Tindak Lanjut / Remedial</label>
                <textarea
                  rows={3}
                  value={tindakLanjut}
                  onChange={(e) => setTindakLanjut(e.target.value)}
                  placeholder="Latihan tambahan analogi garis bilangan pada pertemuan selanjutnya..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold cursor-pointer"
              >
                Simpan Jurnal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Journal List */}
      <div className="space-y-4">
        {journals.map((j) => (
          <div
            key={j.id}
            className="bg-slate-850 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {j.kelas}
                </span>
                <span className="font-semibold text-slate-200">{j.mapel}</span>
                <span className="text-slate-400">Jam: {j.jamKe}</span>
                <span className="text-slate-500">| Tanggal: {j.tanggal}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Guru: {j.guruNama}</span>
                <button
                  onClick={() => handleDelete(j.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                  title="Hapus Jurnal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <div>
                <span className="font-bold text-slate-200">Materi Pokok: </span>
                <span className="text-indigo-300">{j.materiPokok}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="font-bold text-slate-400 block mb-0.5">Aktivitas Pembelajaran:</span>
                  <p className="text-slate-300 leading-relaxed">{j.kegiatan}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block mb-0.5">Pencapaian & Kendala:</span>
                  <p className="text-slate-300 leading-relaxed">{j.pencapaianKendala || '-'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-400 block mb-0.5">Tindak Lanjut Guru:</span>
                  <p className="text-slate-300 leading-relaxed">{j.tindakLanjut || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
