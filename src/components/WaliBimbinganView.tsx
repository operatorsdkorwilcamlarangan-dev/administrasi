import React, { useState } from 'react';
import { HeartHandshake, Plus, Award, Heart, CheckCircle2, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';
import { StudentGuidance, StudentAttitude, Student, SchoolClass, User } from '../types';

interface WaliBimbinganViewProps {
  guidance: StudentGuidance[];
  attitudes: StudentAttitude[];
  students: Student[];
  classes: SchoolClass[];
  currentUser: User;
  onRefresh: () => void;
}

export const WaliBimbinganView: React.FC<WaliBimbinganViewProps> = ({
  guidance,
  attitudes,
  students,
  classes,
  currentUser,
  onRefresh
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'guidance' | 'attitude'>('guidance');
  const [selectedClass, setSelectedClass] = useState<string>(
    currentUser.kelasBinaan || classes[0]?.namaKelas || 'Kelas VII-A'
  );

  // Form guidance
  const [showGuidanceModal, setShowGuidanceModal] = useState(false);
  const [guidanceDate, setGuidanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [guidanceSiswaId, setGuidanceSiswaId] = useState('');
  const [guidanceKategori, setGuidanceKategori] = useState<'Akademik' | 'Kedisiplinan' | 'Sosial/Emosional' | 'Keluarga'>('Akademik');
  const [kasusMasalah, setKasusMasalah] = useState('');
  const [tindakLanjutSolusi, setTindakLanjutSolusi] = useState('');
  const [hasilKonseling, setHasilKonseling] = useState('');
  const [statusBimbingan, setStatusBimbingan] = useState<'Selesai' | 'Dalam Pantauan' | 'Perlu Rujukan'>('Dalam Pantauan');

  // Form attitude
  const [showAttitudeModal, setShowAttitudeModal] = useState(false);
  const [attitudeSiswaId, setAttitudeSiswaId] = useState('');
  const [catatanSikap, setCatatanSikap] = useState('');
  const [dimensiProfil, setDimensiProfil] = useState('Gotong Royong & Cinta Sesama (KBC)');
  const [predikat, setPredikat] = useState<'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan'>('Sangat Baik');

  const classStudents = students.filter((s) => s.kelas === selectedClass);

  const handleSaveGuidance = async (e: React.FormEvent) => {
    e.preventDefault();
    const siswa = students.find((s) => s.id === guidanceSiswaId);
    if (!siswa) return;

    const payload = {
      tanggal: guidanceDate,
      kelas: selectedClass,
      siswaId: siswa.id,
      siswaNama: siswa.nama,
      kategori: guidanceKategori,
      kasusMasalah,
      tindakLanjutSolusi,
      hasilKonseling,
      status: statusBimbingan,
      waliKelasNama: currentUser.namaLengkap
    };

    try {
      const res = await fetch('/api/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Bimbingan Dicatat',
          timer: 1500,
          background: '#0f172a',
          color: '#f8fafc',
          showConfirmButton: false
        });
        setShowGuidanceModal(false);
        setKasusMasalah('');
        setTindakLanjutSolusi('');
        setHasilKonseling('');
        onRefresh();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', background: '#0f172a', color: '#f8fafc' });
    }
  };

  const handleSaveAttitude = async (e: React.FormEvent) => {
    e.preventDefault();
    const siswa = students.find((s) => s.id === attitudeSiswaId);
    if (!siswa) return;

    const payload = {
      siswaId: siswa.id,
      siswaNama: siswa.nama,
      kelas: selectedClass,
      catatanSikap,
      dimensiProfil,
      predikat,
      tanggal: new Date().toISOString().slice(0, 10),
      waliKelasNama: currentUser.namaLengkap
    };

    try {
      const res = await fetch('/api/attitudes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Catatan Sikap Disimpan',
          timer: 1500,
          background: '#0f172a',
          color: '#f8fafc',
          showConfirmButton: false
        });
        setShowAttitudeModal(false);
        setCatatanSikap('');
        onRefresh();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', background: '#0f172a', color: '#f8fafc' });
    }
  };

  const handleDeleteGuidance = async (id: string) => {
    await fetch(`/api/guidance/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  const handleDeleteAttitude = async (id: string) => {
    await fetch(`/api/attitudes/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-400" />
            <span>Bimbingan & Pemantauan Karakter Siswa (Wali Kelas)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Penanganan bimbingan konseling, pantauan emosional, dan rekaman karakter Kurikulum Berbasis Cinta (KBC).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.namaKelas}>
                {c.namaKelas}
              </option>
            ))}
          </select>

          {activeSubTab === 'guidance' ? (
            <button
              onClick={() => {
                setGuidanceSiswaId(classStudents[0]?.id || '');
                setShowGuidanceModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Kasus Bimbingan</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setAttitudeSiswaId(classStudents[0]?.id || '');
                setShowAttitudeModal(true);
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jurnal Sikap KBC</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveSubTab('guidance')}
          className={`pb-3 text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'guidance'
              ? 'text-emerald-400 border-b-2 border-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Bimbingan Konseling & Kasus Siswa ({guidance.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('attitude')}
          className={`pb-3 text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'attitude'
              ? 'text-rose-400 border-b-2 border-rose-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Observasi Sikap & Karakter KBC ({attitudes.length})</span>
        </button>
      </div>

      {/* Guidance Tab Content */}
      {activeSubTab === 'guidance' && (
        <div className="space-y-3">
          {guidance.length === 0 ? (
            <div className="p-8 text-center bg-slate-850 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              Belum ada catatan bimbingan konseling untuk rombel ini.
            </div>
          ) : (
            guidance.map((g) => (
              <div
                key={g.id}
                className="bg-slate-850 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-100 text-sm">{g.siswaNama}</span>
                    <span className="text-slate-400">({g.kelas})</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      {g.kategori}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        g.status === 'Selesai'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : g.status === 'Dalam Pantauan'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">{g.tanggal}</span>
                    <button
                      onClick={() => handleDeleteGuidance(g.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
                    <span className="font-bold text-slate-400 block mb-1">Kasus / Masalah:</span>
                    <p className="text-slate-200">{g.kasusMasalah}</p>
                  </div>
                  <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
                    <span className="font-bold text-slate-400 block mb-1">Tindak Lanjut & Pendekatan:</span>
                    <p className="text-slate-200">{g.tindakLanjutSolusi}</p>
                  </div>
                  <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
                    <span className="font-bold text-slate-400 block mb-1">Hasil Bimbingan:</span>
                    <p className="text-slate-200">{g.hasilKonseling || '-'}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Attitude Tab Content */}
      {activeSubTab === 'attitude' && (
        <div className="space-y-3">
          {attitudes.length === 0 ? (
            <div className="p-8 text-center bg-slate-850 border border-slate-800 rounded-2xl text-slate-500 text-xs">
              Belum ada observasi sikap dan karakter KBC.
            </div>
          ) : (
            attitudes.map((a) => (
              <div
                key={a.id}
                className="bg-slate-850 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition shadow-sm space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{a.siswaNama}</span>
                    <span className="text-slate-400">({a.kelas})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                      {a.dimensiProfil}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {a.predikat}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">{a.tanggal}</span>
                    <button
                      onClick={() => handleDeleteAttitude(a.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-300 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                  {a.catatanSikap}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Add Guidance */}
      {showGuidanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>Catat Kasus Bimbingan Konseling Siswa</span>
            </h3>

            <form onSubmit={handleSaveGuidance} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Pilih Siswa</label>
                  <select
                    value={guidanceSiswaId}
                    onChange={(e) => setGuidanceSiswaId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    required
                  >
                    {classStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama} ({s.nisn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={guidanceDate}
                    onChange={(e) => setGuidanceDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Kategori Masalah</label>
                  <select
                    value={guidanceKategori}
                    onChange={(e) => setGuidanceKategori(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Kedisiplinan">Kedisiplinan</option>
                    <option value="Sosial/Emosional">Sosial / Emosional</option>
                    <option value="Keluarga">Keluarga</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Status Penanganan</label>
                  <select
                    value={statusBimbingan}
                    onChange={(e) => setStatusBimbingan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Dalam Pantauan">Dalam Pantauan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Perlu Rujukan">Perlu Rujukan ke Ahli/BP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Uraian Kasus / Kejadian</label>
                <textarea
                  rows={2}
                  value={kasusMasalah}
                  onChange={(e) => setKasusMasalah(e.target.value)}
                  placeholder="Ceritakan kejadian atau permasalahan yang dihadapi siswa..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Tindak Lanjut & Pendekatan Wali Kelas</label>
                <textarea
                  rows={2}
                  value={tindakLanjutSolusi}
                  onChange={(e) => setTindakLanjutSolusi(e.target.value)}
                  placeholder="Pendekatan kasih sayang (KBC), pembinaan personal, atau komunikasi orang tua..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Hasil Konseling Sementara</label>
                <input
                  type="text"
                  value={hasilKonseling}
                  onChange={(e) => setHasilKonseling(e.target.value)}
                  placeholder="Siswa berkomitmen memperbaiki perilaku..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGuidanceModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Bimbingan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Attitude KBC */}
      {showAttitudeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Tambah Catatan Karakter & Sikap KBC</span>
            </h3>

            <form onSubmit={handleSaveAttitude} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Pilih Siswa</label>
                  <select
                    value={attitudeSiswaId}
                    onChange={(e) => setAttitudeSiswaId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
                    required
                  >
                    {classStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Predikat Penilaian</label>
                  <select
                    value={predikat}
                    onChange={(e) => setPredikat(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Sangat Baik">Sangat Baik (SB)</option>
                    <option value="Baik">Baik (B)</option>
                    <option value="Cukup">Cukup (C)</option>
                    <option value="Perlu Bimbingan">Perlu Bimbingan (PB)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Dimensi Profil & Panca Cinta KBC</label>
                <select
                  value={dimensiProfil}
                  onChange={(e) => setDimensiProfil(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
                >
                  <option value="Cinta Allah & Rasul (Beriman & Bertakwa)">Cinta Allah & Rasul (Beriman & Bertakwa)</option>
                  <option value="Cinta Diri & Sesama (Gotong Royong & Empati)">Cinta Diri & Sesama (Gotong Royong & Empati)</option>
                  <option value="Cinta Ilmu Pengetahuan (Bernalar Kritis & Mandiri)">Cinta Ilmu Pengetahuan (Bernalar Kritis & Mandiri)</option>
                  <option value="Cinta Bangsa & Tanah Air (Berkebinekaan Global)">Cinta Bangsa & Tanah Air (Berkebinekaan Global)</option>
                  <option value="Cinta Lingkungan & Alam Semesta">Cinta Lingkungan & Alam Semesta</option>
                  <option value="PPRA: Ta'addub & Qudwah (Keteladanan Luhur)">PPRA: Ta'addub & Qudwah (Keteladanan Luhur)</option>
                  <option value="PPRA: Tasamuh (Toleransi & Saling Menyayangi)">PPRA: Tasamuh (Toleransi & Saling Menyayangi)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Catatan Observasi Perilaku Otentik</label>
                <textarea
                  rows={3}
                  value={catatanSikap}
                  onChange={(e) => setCatatanSikap(e.target.value)}
                  placeholder="Menunjukkan inisiatif membantu kawan yang sedang berduka, santun dalam tutur kata..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAttitudeModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan Karakter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
