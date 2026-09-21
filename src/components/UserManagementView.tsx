import React, { useState } from 'react';
import { Users, UserPlus, Shield, GraduationCap, Trash2, Edit2, Key, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import { User, SchoolClass, UserRole } from '../types';

interface UserManagementViewProps {
  users: User[];
  classes: SchoolClass[];
  onRefreshUsers: () => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  classes,
  onRefreshUsers
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nip, setNip] = useState('');
  const [role, setRole] = useState<UserRole>('guru');
  const [mapel, setMapel] = useState('Matematika');
  const [kelasBinaan, setKelasBinaan] = useState('');

  const handleOpenAdd = () => {
    setEditingUser(null);
    setUsername('');
    setPassword('');
    setNamaLengkap('');
    setNip('-');
    setRole('guru');
    setMapel('Matematika');
    setKelasBinaan(classes[0]?.namaKelas || '');
    setShowModal(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingUser(u);
    setUsername(u.username);
    setPassword(''); // leave blank if no change
    setNamaLengkap(u.namaLengkap);
    setNip(u.nip || '-');
    setRole(u.role);
    setMapel(u.mapel);
    setKelasBinaan(u.kelasBinaan || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      username,
      namaLengkap,
      nip,
      role,
      mapel,
      kelasBinaan: role === 'wali_kelas' ? kelasBinaan : undefined
    };
    if (password.trim()) {
      payload.password = password;
    }

    try {
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: editingUser ? 'User Diperbarui' : 'User Berhasil Ditambahkan',
          timer: 1500,
          background: '#0f172a',
          color: '#f8fafc',
          showConfirmButton: false
        });
        setShowModal(false);
        onRefreshUsers();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: data.message || 'Terjadi kesalahan saat menyimpan user.',
          background: '#0f172a',
          color: '#f8fafc'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Gagal',
        text: 'Tidak dapat menghubungi server.',
        background: '#0f172a',
        color: '#f8fafc'
      });
    }
  };

  const handleDelete = (u: User) => {
    Swal.fire({
      title: 'Hapus Pengguna?',
      text: `Apakah Anda yakin ingin menghapus akun ${u.namaLengkap} (${u.username})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus Akun',
      cancelButtonText: 'Batal',
      background: '#0f172a',
      color: '#f8fafc'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/users/${u.id}`, { method: 'DELETE' });
          const data = await res.json();
          if (res.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Akun Dihapus',
              timer: 1500,
              background: '#0f172a',
              color: '#f8fafc',
              showConfirmButton: false
            });
            onRefreshUsers();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Gagal Menghapus',
              text: data.message || 'Terjadi kendala.',
              background: '#0f172a',
              color: '#f8fafc'
            });
          }
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Kesalahan Sistem', background: '#0f172a', color: '#f8fafc' });
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
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Kelola Akun Guru & Pengguna Sistem (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Atur hak akses Administrator, Guru Mata Pelajaran, dan Wali Kelas.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer self-start"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna Baru</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
              <tr>
                <th className="px-4 py-3">Nama Lengkap & NIP</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Peran (Role)</th>
                <th className="px-4 py-3">Mata Pelajaran / Penugasan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-100">{u.namaLengkap}</div>
                    <div className="text-[11px] text-slate-500">NIP. {u.nip || '-'}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-indigo-300">{u.username}</td>
                  <td className="px-4 py-3">
                    {u.role === 'admin' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        ADMIN
                      </span>
                    )}
                    {u.role === 'wali_kelas' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        WALI KELAS ({u.kelasBinaan || 'Semua'})
                      </span>
                    )}
                    {u.role === 'guru' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                        GURU MAPEL
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{u.mapel}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                        title="Edit Data User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer"
                        title="Hapus User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Pengguna Baru'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Username Akun</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="misal: guru_ipa"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    {editingUser ? 'Ganti Password (Opsional)' : 'Kata Sandi'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={editingUser ? 'Biarkan kosong jika tidak diubah' : 'Minimal 6 karakter'}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required={!editingUser}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: Siti Rahmawati, S.Pd., M.Pd."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="19850101 201001 1 001 atau -"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Peran (Role RBAC)</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="guru">Guru Mata Pelajaran</option>
                    <option value="wali_kelas">Wali Kelas</option>
                    <option value="admin">Administrator Sekolah</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Mata Pelajaran Diampu</label>
                  <input
                    type="text"
                    value={mapel}
                    onChange={(e) => setMapel(e.target.value)}
                    placeholder="Matematika / IPA / dll"
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                {role === 'wali_kelas' && (
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Kelas Binaan</label>
                    <select
                      value={kelasBinaan}
                      onChange={(e) => setKelasBinaan(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                      required
                    >
                      <option value="">-- Pilih Kelas Binaan --</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.namaKelas}>
                          {c.namaKelas}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-md cursor-pointer"
                >
                  {editingUser ? 'Simpan Pembaruan' : 'Tambah User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
