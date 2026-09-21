import React, { useState } from 'react';
import { School, Plus, Edit2, Trash2, Users } from 'lucide-react';
import Swal from 'sweetalert2';
import { SchoolClass, User } from '../types';

interface ClassManagementViewProps {
  classes: SchoolClass[];
  users: User[];
  onRefreshClasses: () => void;
}

export const ClassManagementView: React.FC<ClassManagementViewProps> = ({
  classes,
  users,
  onRefreshClasses
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);

  const [namaKelas, setNamaKelas] = useState('');
  const [fase, setFase] = useState('Fase D (Kelas 7-9)');
  const [tingkat, setTingkat] = useState('7');
  const [waliKelasId, setWaliKelasId] = useState('');

  const handleOpenAdd = () => {
    setEditingClass(null);
    setNamaKelas('');
    setFase('Fase D (Kelas 7-9)');
    setTingkat('7');
    setWaliKelasId(users.find((u) => u.role === 'wali_kelas')?.id || '');
    setShowModal(true);
  };

  const handleOpenEdit = (c: SchoolClass) => {
    setEditingClass(c);
    setNamaKelas(c.namaKelas);
    setFase(c.fase);
    setTingkat(c.tingkat);
    setWaliKelasId(c.waliKelasId || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const assignedWali = users.find((u) => u.id === waliKelasId);

    const payload = {
      namaKelas,
      fase,
      tingkat,
      waliKelasId,
      waliKelasNama: assignedWali ? assignedWali.namaLengkap : '-'
    };

    try {
      const url = editingClass ? `/api/classes/${editingClass.id}` : '/api/classes';
      const method = editingClass ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: editingClass ? 'Kelas Diperbarui' : 'Kelas Ditambahkan',
          timer: 1500,
          background: '#0f172a',
          color: '#f8fafc',
          showConfirmButton: false
        });
        setShowModal(false);
        onRefreshClasses();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', background: '#0f172a', color: '#f8fafc' });
    }
  };

  const handleDelete = (c: SchoolClass) => {
    Swal.fire({
      title: 'Hapus Rombel Kelas?',
      text: `Apakah Anda yakin ingin menghapus rombel ${c.namaKelas}?`,
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
          const res = await fetch(`/api/classes/${c.id}`, { method: 'DELETE' });
          if (res.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Kelas Dihapus',
              timer: 1500,
              background: '#0f172a',
              color: '#f8fafc',
              showConfirmButton: false
            });
            onRefreshClasses();
          }
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Gagal Menghapus', background: '#0f172a', color: '#f8fafc' });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <School className="w-5 h-5 text-indigo-400" />
            <span>Kelola Rombongan Belajar (Rombel) & Wali Kelas</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengelompokan Fase Kurikulum Merdeka (Fase A-F) dan penetapan Wali Kelas resmi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rombel Kelas</span>
        </button>
      </div>

      {/* Grid of classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c) => (
          <div
            key={c.id}
            className="bg-slate-850 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Tingkat {c.tingkat}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c)}
                  className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white">{c.namaKelas}</h3>
              <p className="text-xs text-indigo-400 font-medium">{c.fase}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-300">
              <Users className="w-4 h-4 text-emerald-400" />
              <div className="line-clamp-1">
                <span className="text-slate-400">Wali: </span>
                <span className="font-semibold">{c.waliKelasNama || 'Belum Ditentukan'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Class */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <School className="w-4 h-4 text-indigo-400" />
              <span>{editingClass ? 'Edit Rombel Kelas' : 'Tambah Rombel Baru'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Nama Rombel / Kelas</label>
                <input
                  type="text"
                  value={namaKelas}
                  onChange={(e) => setNamaKelas(e.target.value)}
                  placeholder="Contoh: Kelas VII-A / Kelas 1"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Fase Kurikulum Merdeka</label>
                <select
                  value={fase}
                  onChange={(e) => setFase(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="Fase A (Kelas 1-2 SD)">Fase A (Kelas 1-2 SD)</option>
                  <option value="Fase B (Kelas 3-4 SD)">Fase B (Kelas 3-4 SD)</option>
                  <option value="Fase C (Kelas 5-6 SD)">Fase C (Kelas 5-6 SD)</option>
                  <option value="Fase D (Kelas 7-9 SMP)">Fase D (Kelas 7-9 SMP)</option>
                  <option value="Fase E (Kelas 10 SMA/SMK)">Fase E (Kelas 10 SMA/SMK)</option>
                  <option value="Fase F (Kelas 11-12 SMA/SMK)">Fase F (Kelas 11-12 SMA/SMK)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Tingkat Jenjang</label>
                <input
                  type="text"
                  value={tingkat}
                  onChange={(e) => setTingkat(e.target.value)}
                  placeholder="7"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Wali Kelas Pengampu</label>
                <select
                  value={waliKelasId}
                  onChange={(e) => setWaliKelasId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="">-- Pilih Guru / Wali Kelas --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.namaLengkap} ({u.role.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
    </div>
  );
};
