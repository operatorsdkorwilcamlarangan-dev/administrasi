import React, { useState } from 'react';
import { Sparkles, FileText, Send, CheckCircle2, Sliders, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import { SchoolClass, User, SchoolConfig } from '../types';

interface MerdekaGeneratorViewProps {
  classes: SchoolClass[];
  currentUser: User;
  config: SchoolConfig;
  onOpenDocModal: (docData: {
    title: string;
    category: 'MERDEKA';
    docType: string;
    mapel: string;
    kelas: string;
    fase: string;
    htmlContent: string;
    isLandscape: boolean;
  }) => void;
}

export const MERDEKA_DOCS = [
  {
    id: 'ADM-CP',
    name: 'ADM-CP: Analisis Capaian Pembelajaran',
    desc: 'Rasional, Tujuan Mapel, Karakteristik & Elemen CP, CP Fase, Penjabaran KKO Bloom, dan Pemetaan 8 Dimensi Profil Lulusan.',
    isLandscape: false
  },
  {
    id: 'ADM-TP',
    name: 'ADM-TP: Tujuan Pembelajaran (ABCD)',
    desc: 'Panduan Kode TP, Tabel TP per Elemen (KKO C2-C5 + Formula ABCD), Aspek Kompetensi, Alokasi JP, dan Rekap JP.',
    isLandscape: false
  },
  {
    id: 'ADM-ATP',
    name: 'ADM-ATP: Alur Tujuan Pembelajaran',
    desc: 'Format A4 Landscape, Diagram visual alur TP, Tabel 8 Kolom (Kode, Elemen, TP, Materi Pokok, Level Bloom, 8 Dimensi, JP, Semester), dan Rekapitulasi.',
    isLandscape: true
  },
  {
    id: 'ADM-PROTA',
    name: 'ADM-PROTA: Program Tahunan Efektif',
    desc: 'Tabel Minggu Efektif (Kalender - Tidak Efektif = Efektif x JP), Subtotal Sem 1 & 2, Rencana Prota per Semester + Baris Jam Cadangan.',
    isLandscape: false
  },
  {
    id: 'ADM-PROSEM',
    name: 'ADM-PROSEM: Program Semester Matriks Warna',
    desc: 'Format A4 Landscape, Matriks JP per Minggu kode warna (Biru: JP Belajar, Merah: Libur, Kuning: PTS, Hijau: PAS, Abu: Cadangan), Model Belajar, Legenda Warna.',
    isLandscape: true
  },
  {
    id: 'ADM-KKTP',
    name: 'ADM-KKTP: Kriteria Ketercapaian TP',
    desc: 'Format A4 Landscape, Dasar Permendikbudristek No. 21/2022, 4 Level Capaian (Mulai Berkembang, Layak ✓ KKTP, Cakap, Mahir), Rubrik 9 Kolom.',
    isLandscape: true
  }
];

export const MerdekaGeneratorView: React.FC<MerdekaGeneratorViewProps> = ({
  classes,
  currentUser,
  config,
  onOpenDocModal
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>('ADM-CP');
  const [mapel, setMapel] = useState<string>(currentUser.mapel || 'Matematika');
  const [kelas, setKelas] = useState<string>(classes[0]?.namaKelas || 'Kelas VII-A');
  const [fase, setFase] = useState<string>(classes[0]?.fase || 'Fase D (Kelas 7-9 SMP)');
  const [topik, setTopik] = useState<string>('Bilangan Bulat dan Aljabar');
  const [alokasiJp, setAlokasiJp] = useState<string>('3 JP (3 x 40 Menit) per Minggu');
  const [modelPembelajaran, setModelPembelajaran] = useState<string>('Problem-Based Learning / Deep Learning');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Auto-sync fase when class changes
  const handleClassChange = (className: string) => {
    setKelas(className);
    const found = classes.find((c) => c.namaKelas === className);
    if (found) {
      setFase(found.fase);
    }
  };

  const selectedDocMeta = MERDEKA_DOCS.find((d) => d.id === selectedDocId) || MERDEKA_DOCS[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docCategory: 'Kurikulum Merdeka',
          docType: selectedDocMeta.name,
          mapel,
          kelas,
          fase,
          topik,
          alokasiJp,
          modelPembelajaran,
          additionalNotes
        })
      });

      const data = await res.json();
      if (res.ok && data.html) {
        onOpenDocModal({
          title: selectedDocMeta.name,
          category: 'MERDEKA',
          docType: selectedDocMeta.id,
          mapel,
          kelas,
          fase,
          htmlContent: data.html,
          isLandscape: selectedDocMeta.isLandscape
        });
      } else {
        throw new Error(data.message || 'Gagal menghasilkan dokumen');
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Generator Mengalami Kendala',
        text: err.message || 'Terjadi kesalahan sistem saat menyusun dokumen.',
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
          <Sparkles className="w-5 h-5 text-sky-400" />
          <span>Generator AI: 6 Dokumen Standar Kurikulum Merdeka</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hasilkan berkas administrasi siap cetak dengan tata letak resmi: Kop teks tanpa logo, tabel data matriks terstruktur, dan tabel tanda tangan 2 kolom sejajar.
        </p>
      </div>

      {/* Grid: Document Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {MERDEKA_DOCS.map((doc) => {
          const isSelected = selectedDocId === doc.id;
          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {doc.id}
                  </span>
                  {doc.isLandscape && (
                    <span className="text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                      Landscape
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-100">{doc.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {doc.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className={isSelected ? 'text-indigo-300 font-semibold' : 'text-slate-500'}>
                  {isSelected ? '✓ Terpilih' : 'Klik untuk memilih'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generator Configuration Form */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Parameter Penyusunan Dokumen: <span className="text-indigo-400">{selectedDocMeta.name}</span></span>
        </h3>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Mata Pelajaran</label>
              <input
                type="text"
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                placeholder="Matematika / IPA / dll"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Rombel / Kelas</label>
              <select
                value={kelas}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.namaKelas}>
                    {c.namaKelas}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Fase Pembelajaran</label>
              <input
                type="text"
                value={fase}
                onChange={(e) => setFase(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Alokasi Waktu</label>
              <input
                type="text"
                value={alokasiJp}
                onChange={(e) => setAlokasiJp(e.target.value)}
                placeholder="3 JP (3 x 40 Menit)"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Lingkup Materi / Topik / TP Spesifik</label>
              <input
                type="text"
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                placeholder="Contoh: Operasi Hitung Bilangan Bulat dan Aljabar"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Model Pembelajaran</label>
              <input
                type="text"
                value={modelPembelajaran}
                onChange={(e) => setModelPembelajaran(e.target.value)}
                placeholder="Problem-Based Learning, Discovery, PJBL, Deep Learning"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Catatan Tambahan / Instruksi Khusus (Opsional)</label>
            <input
              type="text"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Contoh: Tekankan pada diferensiasi konten dan penalaran numerasi konteks lokal"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <span className="text-[11px] text-slate-500">
              Dokumen otomatis memuat tanda tangan Kepala Sekolah ({config.namaKepalaSekolah}) & Guru Pengampu.
            </span>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemini AI Sedang Menyusun Dokumen...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate {selectedDocMeta.id} Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
