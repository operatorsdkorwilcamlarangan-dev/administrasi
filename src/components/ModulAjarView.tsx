import React, { useState } from 'react';
import { Sparkles, BookOpen, Layers, CheckSquare, Send } from 'lucide-react';
import Swal from 'sweetalert2';
import { SchoolClass, User, SchoolConfig } from '../types';

interface ModulAjarViewProps {
  classes: SchoolClass[];
  currentUser: User;
  config: SchoolConfig;
  onOpenDocModal: (docData: {
    title: string;
    category: 'MODUL_AJAR' | 'ASESMEN';
    docType: string;
    mapel: string;
    kelas: string;
    fase: string;
    htmlContent: string;
    isLandscape: boolean;
  }) => void;
}

export const ModulAjarView: React.FC<ModulAjarViewProps> = ({
  classes,
  currentUser,
  config,
  onOpenDocModal
}) => {
  const [activeType, setActiveType] = useState<'MODUL' | 'ASESMEN'>('MODUL');
  const [mapel, setMapel] = useState<string>(currentUser.mapel || 'Matematika');
  const [kelas, setKelas] = useState<string>(classes[0]?.namaKelas || 'Kelas VII-A');
  const [fase, setFase] = useState<string>(classes[0]?.fase || 'Fase D (Kelas 7-9 SMP)');
  const [topik, setTopik] = useState<string>('Operasi Hitung Pecahan dalam Kehidupan Sehari-hari');
  const [alokasiJp, setAlokasiJp] = useState<string>('2 x 40 Menit (1 Pertemuan)');
  const [pendekatan, setPendekatan] = useState<string>('Deep Learning (Mindful, Meaningful, Joyful)');
  const [jumlahSoal, setJumlahSoal] = useState<string>('5 Soal Pilihan Ganda & 2 Soal Uraian HOTS');
  const [catatan, setCatatan] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const docName =
      activeType === 'MODUL'
        ? 'Modul Ajar Deep Learning (Mindful, Meaningful, Joyful)'
        : 'Asesmen Sumatif & Bank Soal HOTS Terstruktur';

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docCategory: 'Kurikulum Merdeka',
          docType: docName,
          mapel,
          kelas,
          fase,
          topik,
          alokasiJp,
          modelPembelajaran: pendekatan,
          additionalNotes: `Format: ${jumlahSoal}. ${catatan}`
        })
      });

      const data = await res.json();
      if (res.ok && data.html) {
        onOpenDocModal({
          title: docName,
          category: activeType === 'MODUL' ? 'MODUL_AJAR' : 'ASESMEN',
          docType: activeType === 'MODUL' ? 'MODUL-AJAR' : 'ASESMEN-SUMATIF',
          mapel,
          kelas,
          fase,
          htmlContent: data.html,
          isLandscape: false
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menghasilkan Dokumen',
        text: err.message || 'Terjadi gangguan.',
        background: '#0f172a',
        color: '#f8fafc'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>Generator Modul Ajar Deep Learning & Asesmen Sumatif AI</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Rancang modul ajar berdiferensiasi dengan pendekatan Deep Learning (Mindful, Meaningful, Joyful) serta bank soal asesmen sumatif HOTS.
        </p>
      </div>

      {/* Switcher: Modul Ajar vs Asesmen */}
      <div className="flex rounded-2xl bg-slate-850 p-1.5 border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveType('MODUL')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            activeType === 'MODUL'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Modul Ajar Deep Learning</span>
        </button>
        <button
          onClick={() => setActiveType('ASESMEN')}
          className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
            activeType === 'ASESMEN'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Asesmen Sumatif & Bank Soal</span>
        </button>
      </div>

      {/* Form Setup */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white">
          {activeType === 'MODUL'
            ? 'Parameter Modul Ajar Deep Learning'
            : 'Parameter Instrumen Kisi-Kisi & Bank Soal Sumatif'}
        </h3>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
              <label className="block font-medium text-slate-300 mb-1">Rombel / Kelas</label>
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
              <label className="block font-medium text-slate-300 mb-1">Fase</label>
              <input
                type="text"
                value={fase}
                onChange={(e) => setFase(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Topik Pembelajaran / TP</label>
              <input
                type="text"
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                placeholder="Contoh: Operasi Hitung Pecahan & Penerapan Nyata"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            {activeType === 'MODUL' ? (
              <div>
                <label className="block font-medium text-slate-300 mb-1">Alokasi Waktu Pertemuan</label>
                <input
                  type="text"
                  value={alokasiJp}
                  onChange={(e) => setAlokasiJp(e.target.value)}
                  placeholder="2 x 40 Menit (1 Pertemuan)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <label className="block font-medium text-slate-300 mb-1">Format & Komposisi Soal</label>
                <input
                  type="text"
                  value={jumlahSoal}
                  onChange={(e) => setJumlahSoal(e.target.value)}
                  placeholder="5 Pilihan Ganda (A-E) dan 2 Soal Uraian HOTS"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Petunjuk Khusus & Kebutuhan Tambahan (Opsional)</label>
            <input
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Sertakan lembar refleksi emosi STOP dan asesmen awal diagnostik"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end border-t border-slate-800">
            <button
              type="submit"
              disabled={isGenerating}
              className={`px-6 py-2.5 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                activeType === 'MODUL'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sedang Menghasilkan Dokumen...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate {activeType === 'MODUL' ? 'Modul Ajar Deep Learning' : 'Asesmen Sumatif'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
