import React, { useState } from 'react';
import { Settings, Save, School, CheckCircle2, ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';
import { SchoolConfig } from '../types';

interface ConfigViewProps {
  config: SchoolConfig;
  onUpdateConfig: (updated: SchoolConfig) => void;
}

export const ConfigView: React.FC<ConfigViewProps> = ({ config, onUpdateConfig }) => {
  const [formData, setFormData] = useState<SchoolConfig>({ ...config });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Konfigurasi Diperbarui',
          text: 'Data identitas sekolah dan tanda tangan resmi berhasil disimpan ke server.',
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: '#10b981',
          timer: 2000,
          showConfirmButton: false
        });
        onUpdateConfig(data.config);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: 'Terjadi kesalahan jaringan saat menyimpan konfigurasi.',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <span>Pengaturan & Konfigurasi Identitas Sekolah</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Data ini digunakan secara otomatis pada seluruh Kop Dokumen, Tanda Tangan Resmi, dan Lembar Asesmen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Settings (2 Cols) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-slate-850 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-indigo-300 pb-2 border-b border-slate-800 flex items-center gap-2">
              <School className="w-4 h-4" /> Identitas Instansi & Satuan Pendidikan
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instansi Pemerintah / Yayasan Pengampu
              </label>
              <textarea
                name="namaPemerintah"
                rows={2}
                value={formData.namaPemerintah}
                onChange={handleChange}
                placeholder="Contoh: PEMERINTAH KABUPATEN GROBOGAN&#10;DINAS PENDIDIKAN"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              <span className="text-[10px] text-slate-500">Gunakan baris baru (enter) untuk pemisahan baris kop.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Satuan Pendidikan / Sekolah
                </label>
                <input
                  type="text"
                  name="namaSekolah"
                  value={formData.namaSekolah}
                  onChange={handleChange}
                  placeholder="Contoh: UPTD SPF SDN 1 PURWODADI"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tahun Pelajaran & Semester
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="tahunPelajaran"
                    value={formData.tahunPelajaran}
                    onChange={handleChange}
                    placeholder="2024/2025"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                  <select
                    name="semesterAktif"
                    value={formData.semesterAktif}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Alamat Lengkap & Kontak Satuan Pendidikan
              </label>
              <input
                type="text"
                name="alamatSekolah"
                value={formData.alamatSekolah}
                onChange={handleChange}
                placeholder="Jl. R.A. Kartini No. 45, Purwodadi, Kab. Grobogan | Telp: (0292) 421234"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <h3 className="text-sm font-bold text-indigo-300 pt-3 pb-2 border-b border-slate-800">
              Legitimasi & Tanda Tangan Resmi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tempat & Tanggal TTD
                </label>
                <input
                  type="text"
                  name="tempatTanggalTtd"
                  value={formData.tempatTanggalTtd}
                  onChange={handleChange}
                  placeholder="Purwodadi, 15 Juli 2024"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Kepala Sekolah
                </label>
                <input
                  type="text"
                  name="namaKepalaSekolah"
                  value={formData.namaKepalaSekolah}
                  onChange={handleChange}
                  placeholder="Drs. H. Ahmad Sudrajat, M.Pd."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  NIP Kepala Sekolah
                </label>
                <input
                  type="text"
                  name="nipKepalaSekolah"
                  value={formData.nipKepalaSekolah}
                  onChange={handleChange}
                  placeholder="19720515 199803 1 004"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Menyimpan Perubahan...' : 'Simpan Konfigurasi Sekolah'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Kop & Signature (1 Col) */}
        <div className="space-y-4">
          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Pratinjau Kop Standar Resmi
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Kop dokumen didesain bersih, center-bold, tanpa logo, bergaris ganda sesuai regulasi resmi kearsipan:
            </p>

            <div className="bg-white text-black p-5 rounded-lg border border-slate-300 text-center font-serif shadow-sm">
              <div className="text-[11px] font-bold uppercase leading-tight text-slate-900 whitespace-pre-line">
                {formData.namaPemerintah}
              </div>
              <div className="text-[13px] font-extrabold uppercase my-1 text-slate-900 tracking-wider">
                {formData.namaSekolah}
              </div>
              <div className="text-[9px] italic text-slate-600 leading-tight">
                {formData.alamatSekolah}
              </div>
              <div className="border-b-2 border-double border-slate-900 mt-2 mb-3"></div>
              
              <div className="text-[11px] font-bold underline uppercase">
                DOKUMEN PERANGKAT AJAR
              </div>
              <div className="text-[9px] text-slate-700 mt-0.5">
                Tahun Pelajaran: {formData.tahunPelajaran} | Semester {formData.semesterAktif}
              </div>
            </div>
          </div>

          <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Format Tanda Tangan 2 Kolom Sejajar
            </h3>
            <div className="bg-white text-black p-4 rounded-lg border border-slate-300 font-serif text-[9px]">
              <div className="grid grid-cols-2 gap-2 text-left">
                <div>
                  <p className="m-0">Mengetahui,</p>
                  <p className="m-0 font-bold">Kepala Sekolah</p>
                  <div className="h-10"></div>
                  <p className="m-0 font-bold underline">{formData.namaKepalaSekolah}</p>
                  <p className="m-0 text-slate-600">NIP. {formData.nipKepalaSekolah}</p>
                </div>
                <div>
                  <p className="m-0">{formData.tempatTanggalTtd}</p>
                  <p className="m-0 font-bold">Guru Pengampu</p>
                  <div className="h-10"></div>
                  <p className="m-0 font-bold underline">[Nama Guru]</p>
                  <p className="m-0 text-slate-600">NIP. [NIP Guru]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
