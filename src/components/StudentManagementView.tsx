import React, { useState } from 'react';
import { GraduationCap, UserPlus, Upload, Search, Filter, Trash2, Edit2, Download, FileSpreadsheet } from 'lucide-react';
import Swal from 'sweetalert2';
import { Student, SchoolClass } from '../types';

interface StudentManagementViewProps {
  students: Student[];
  classes: SchoolClass[];
  onRefreshStudents: () => void;
}

export const StudentManagementView: React.FC<StudentManagementViewProps> = ({
  students,
  classes,
  onRefreshStudents
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form states
  const [nisn, setNisn] = useState('');
  const [nama, setNama] = useState('');
  const [kelas, setKelas] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');
  const [agama, setAgama] = useState('Islam');
  const [namaOrangTua, setNamaOrangTua] = useState('');
  const [alamat, setAlamat] = useState('');

  // Import raw text state
  const [importText, setImportText] = useState('');

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nisn.includes(searchTerm);
    const matchesClass = selectedClass === 'all' || s.kelas === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setNisn(`008${Date.now().toString().slice(-7)}`);
    setNama('');
    setKelas(classes[0]?.namaKelas || 'Kelas VII-A');
    setJenisKelamin('L');
    setAgama('Islam');
    setNamaOrangTua('');
    setAlamat('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setNisn(s.nisn);
    setNama(s.nama);
    setKelas(s.kelas);
    setJenisKelamin(s.jenisKelamin);
    setAgama(s.agama || 'Islam');
    setNamaOrangTua(s.namaOrangTua || '');
    setAlamat(s.alamat || '');
    setShowAddModal(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nisn,
      nama,
      kelas,
      jenisKelamin,
      agama,
      namaOrangTua,
      alamat
    };

    try {
      const url = editingStudent ? `/api/students/${editingStudent.id}` : '/api/students';
      const method = editingStudent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: editingStudent ? 'Data Siswa Diperbarui' : 'Siswa Berhasil Ditambahkan',
          timer: 1500,
          background: '#0f172a',
          color: '#f8fafc',
          showConfirmButton: false
        });
        setShowAddModal(false);
        onRefreshStudents();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', background: '#0f172a', color: '#f8fafc' });
    }
  };

  const handleDelete = (s: Student) => {
    Swal.fire({
      title: 'Hapus Data Siswa?',
      text: `Hapus ${s.nama} (${s.nisn}) dari rombel ${s.kelas}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      background: '#0f172a',
      color: '#f8fafc'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/students/${s.id}`, { method: 'DELETE' });
          if (res.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Data Siswa Dihapus',
              timer: 1500,
              background: '#0f172a',
              color: '#f8fafc',
              showConfirmButton: false
            });
            onRefreshStudents();
          }
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Gagal Menghapus', background: '#0f172a', color: '#f8fafc' });
        }
      }
    });
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    // Parse lines: format: NISN, Nama, Kelas, JK (L/P), Agama, OrangTua, Alamat
    const lines = importText.split('\n').filter((l) => l.trim().length > 0);
    const parsedList: any[] = [];

    lines.forEach((line) => {
      const cols = line.split(/[,\t;]/).map((c) => c.trim());
      if (cols.length >= 2) {
        parsedList.push({
          nisn: cols[0],
          nama: cols[1],
          kelas: cols[2] || (selectedClass !== 'all' ? selectedClass : 'Kelas VII-A'),
          jenisKelamin: cols[3]?.toUpperCase() === 'P' ? 'P' : 'L',
          agama: cols[4] || 'Islam',
          namaOrangTua: cols[5] || '-',
          alamat: cols[6] || '-'
        });
      }
    });

    if (parsedList.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Format Tidak Terbaca',
        text: 'Pastikan data memuat minimal kolom: NISN, Nama Siswa.',
        background: '#0f172a',
        color: '#f8fafc'
      });
      return;
    }

    try {
      const res = await fetch('/api/students/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentsList: parsedList })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Import Sukses!',
          text: `Sebanyak ${data.count} siswa berhasil dimasukkan ke sistem.`,
          background: '#0f172a',
          color: '#f8fafc',
          timer: 2000,
          showConfirmButton: false
        });
        setShowImportModal(false);
        setImportText('');
        onRefreshStudents();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal Mengimpor', background: '#0f172a', color: '#f8fafc' });
    }
  };

  const loadSampleCsv = () => {
    const sample = `0081234021, Muhammad Raihan, Kelas VII-A, L, Islam, Ahmad, Purwodadi
0081234022, Nabila Zahra, Kelas VII-A, P, Islam, Subagio, Grobogan
0081234023, Samuel Christian, Kelas VII-A, L, Kristen, Hendra, Purwodadi
0081234024, Tiara Lestari, Kelas VII-B, P, Islam, Bambang, Toroh`;
    setImportText(sample);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Manajemen & Impor Data Peserta Didik</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Total {students.length} siswa aktif terdaftar dalam sistem akademik.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Import CSV / Excel</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan Nama Siswa atau NISN..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="all">Semua Rombel ({students.length} Siswa)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.namaKelas}>
                {c.namaKelas}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="px-4 py-3">NISN</th>
                <th className="px-4 py-3">Nama Lengkap Siswa</th>
                <th className="px-4 py-3">Rombel / Kelas</th>
                <th className="px-4 py-3">L/P</th>
                <th className="px-4 py-3">Agama</th>
                <th className="px-4 py-3">Nama Orang Tua</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    Tidak ada siswa ditemukan yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3 font-mono text-indigo-300">{s.nisn}</td>
                    <td className="px-4 py-3 font-semibold text-slate-100">{s.nama}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-200">
                        {s.kelas}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.jenisKelamin === 'L'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{s.agama || 'Islam'}</td>
                    <td className="px-4 py-3 text-slate-400">{s.namaOrangTua || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                          title="Edit Siswa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(s)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                          title="Hapus Siswa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>{editingStudent ? 'Edit Data Peserta Didik' : 'Tambah Peserta Didik Baru'}</span>
            </h3>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">NISN Siswa</label>
                  <input
                    type="text"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    placeholder="008xxxxxxx"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Rombel / Kelas</label>
                  <select
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.namaKelas}>
                        {c.namaKelas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Aditya Pratama Putra"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Jenis Kelamin</label>
                  <select
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Agama</label>
                  <select
                    value={agama}
                    onChange={(e) => setAgama(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Khonghucu">Khonghucu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={namaOrangTua}
                    onChange={(e) => setNamaOrangTua(e.target.value)}
                    placeholder="Nama ayah / ibu"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Alamat Tinggal</label>
                  <input
                    type="text"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    placeholder="Desa / Kelurahan"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Batch Import CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span>Impor Batch Data Siswa (CSV / Excel Copy-Paste)</span>
              </h3>
              <button
                onClick={loadSampleCsv}
                className="text-xs text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Muat Format Contoh
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Salin dan tempel daftar siswa dari Excel atau CSV. Format per baris:
              <br />
              <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-[11px]">
                NISN, Nama Siswa, Kelas, L/P, Agama, Nama Orang Tua, Alamat
              </code>
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
              <textarea
                rows={8}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="0081234021, Muhammad Raihan, Kelas VII-A, L, Islam, Ahmad, Purwodadi"
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />

              <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Proses & Simpan Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
