import React, { useState } from 'react';
import { Heart, Sparkles, Send, Sliders, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { SchoolClass, User, SchoolConfig } from '../types';

interface KbcGeneratorViewProps {
  classes: SchoolClass[];
  currentUser: User;
  config: SchoolConfig;
  onOpenDocModal: (docData: {
    title: string;
    category: 'KBC';
    docType: string;
    mapel: string;
    kelas: string;
    fase: string;
    htmlContent: string;
    isLandscape: boolean;
  }) => void;
}

export const KBC_DOCS = [
  {
    id: 'KBC-1',
    name: '1. Panduan Implementasi Kurikulum Berbasis Cinta',
    desc: 'Filosofi panca cinta, strategi pembiasaan sekolah, serta integrasi nilai kasih sayang dalam pembelajaran intrakurikuler dan kokurikuler.',
    isLandscape: false
  },
  {
    id: 'KBC-2',
    name: '2. Pemetaan Nilai Cinta & Rahmatan Lil Alamin (PPRA)',
    desc: 'Format A4 Landscape, Matriks 10 Nilai PPRA (Taaddub, Qudwah, Muwatanah, Tawassut, Tasamuh, dll) dipadukan dengan Panca Cinta KBC.',
    isLandscape: true
  },
  {
    id: 'KBC-3',
    name: '3. Modul Kokurikuler Penguatan Karakter Berbasis Cinta',
    desc: 'Modul proyek tematik berbasis empati dan kepedulian sosial untuk membangun karakter kasih sayang peserta didik.',
    isLandscape: false
  },
  {
    id: 'KBC-4',
    name: '4. Rubrik Asesmen Otentik Sikap & Karakter Kasih Sayang',
    desc: 'Format A4 Landscape, 4 tingkat perkembangan (Mulai Berkembang, Berkembang, Cakap, Membudaya) beserta indikator perilaku teramati.',
    isLandscape: true
  },
  {
    id: 'KBC-5',
    name: '5. Program Pembiasaan Adab, Empati, & Keheningan Batin',
    desc: 'Jadwal dan SOP pembiasaan pagi (senyum sapa salam, refleksi hening, doa bersama, saling memaafkan, dan empati kawan).',
    isLandscape: false
  },
  {
    id: 'KBC-6',
    name: '6. Lembar Kerja Refleksi Diri (Jurnal Muhasabah Cinta)',
    desc: 'Format refleksi diri siswa untuk introspeksi emosi, kebaikan yang telah dilakukan, dan tekad perbaikan hubungan dengan sesama.',
    isLandscape: false
  },
  {
    id: 'KBC-7',
    name: '7. Lembar Observasi Interaksi Teman Sebaya (Peer Love)',
    desc: 'Format A4 Landscape, instrumen sosiometri positif antar siswa untuk mendeteksi potensi perundungan (bullying) dan memperkuat ikatan persaudaraan.',
    isLandscape: true
  },
  {
    id: 'KBC-8',
    name: '8. Portofolio Aksi Nyata Cinta Lingkungan & Sesama',
    desc: 'Panduan proyek bakti sosial, pelestarian lingkungan hidup sekolah, dan sedekah sampah berbasis kasih sayang.',
    isLandscape: false
  },
  {
    id: 'KBC-9',
    name: '9. Panduan Bimbingan Konseling Berbasis Pendekatan Kasih',
    desc: 'Protokol penanganan siswa bermasalah tanpa hukuman fisik, menggunakan pendekatan restorative justice dan pelukan empati guru.',
    isLandscape: false
  },
  {
    id: 'KBC-10',
    name: '10. Laporan Perkembangan Karakter KBC untuk Orang Tua',
    desc: 'Lembar narasi laporan ke orang tua mengenai perkembangan kelembutan hati, kepedulian, dan etika santun anak di sekolah.',
    isLandscape: false
  }
];

export const KbcGeneratorView: React.FC<KbcGeneratorViewProps> = ({
  classes,
  currentUser,
  config,
  onOpenDocModal
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>('KBC-1');
  const [mapel, setMapel] = useState<string>(currentUser.mapel || 'Pendidikan Agama & Budi Pekerti');
  const [kelas, setKelas] = useState<string>(classes[0]?.namaKelas || 'Kelas VII-A');
  const [fase, setFase] = useState<string>(classes[0]?.fase || 'Fase D (Kelas 7-9 SMP)');
  const [topik, setTopik] = useState<string>('Menumbuhkan Empati dan Kasih Sayang Antar Teman');
  const [notes, setNotes] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const selectedDocMeta = KBC_DOCS.find((d) => d.id === selectedDocId) || KBC_DOCS[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docCategory: 'Kurikulum Berbasis Cinta (KBC)',
          docType: selectedDocMeta.name,
          mapel,
          kelas,
          fase,
          topik,
          alokasiJp: '2 JP per Pekan',
          modelPembelajaran: 'Pendekatan Kasih Sayang, Keteladanan, & Refleksi Qalbiah',
          additionalNotes: notes
        })
      });

      const data = await res.json();
      if (res.ok && data.html) {
        onOpenDocModal({
          title: selectedDocMeta.name,
          category: 'KBC',
          docType: selectedDocMeta.id,
          mapel,
          kelas,
          fase,
          htmlContent: data.html,
          isLandscape: selectedDocMeta.isLandscape
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Generator Mengalami Kendala',
        text: err.message || 'Terjadi kesalahan sistem.',
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
          <Heart className="w-5 h-5 text-rose-400" />
          <span>Generator AI: 10 Perangkat Kurikulum Berbasis Cinta (KBC & PPRA)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hasilkan 10 instrumen panduan, pemetaan nilai PPRA, modul kokurikuler, rubrik karakter kasih sayang, dan jurnal muhasabah siap cetak.
        </p>
      </div>

      {/* Grid: 10 Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {KBC_DOCS.map((doc) => {
          const isSelected = selectedDocId === doc.id;
          return (
            <div
              key={doc.id}
              onClick={() => setSelectedDocId(doc.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-500/10'
                  : 'bg-slate-850 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                    isSelected ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {doc.id}
                  </span>
                  {doc.isLandscape && (
                    <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
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
                <span className={isSelected ? 'text-rose-300 font-semibold' : 'text-slate-500'}>
                  {isSelected ? '✓ Terpilih' : 'Klik untuk memilih'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Generator Form */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-rose-400" />
          <span>Parameter Dokumen KBC: <span className="text-rose-400">{selectedDocMeta.name}</span></span>
        </h3>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Mata Pelajaran / Bidang</label>
              <input
                type="text"
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Kelas Sasaran</label>
              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
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
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Fokus Nilai Karakter / Tema Spesifik</label>
            <input
              type="text"
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              placeholder="Contoh: Menumbuhkan Budaya Saling Menyayangi dan Menolak Bullying"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Catatan Tambahan (Opsional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Sertakan panduan doa bersama dan teknik relaksasi pernapasan hening..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end border-t border-slate-800">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menyusun Dokumen KBC...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Dokumen KBC</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
