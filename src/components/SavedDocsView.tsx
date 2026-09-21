import React, { useState } from 'react';
import { Archive, Eye, Trash2, Printer, Download, Search, Filter, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { SavedDocument } from '../types';
import { printDocument, exportToWord } from '../utils/documentTemplates';

interface SavedDocsViewProps {
  documents: SavedDocument[];
  onRefreshDocs: () => void;
  onOpenDocModal: (docData: {
    title: string;
    category: any;
    docType: string;
    mapel: string;
    kelas: string;
    fase: string;
    htmlContent: string;
    isLandscape: boolean;
  }) => void;
}

export const SavedDocsView: React.FC<SavedDocsViewProps> = ({
  documents,
  onRefreshDocs,
  onOpenDocModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredDocs = documents.filter((doc) => {
    const titleText = doc.judul || '';
    const matchesSearch =
      titleText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.mapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.kelas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'ALL' || doc.kategori === filterCategory;
    return matchesSearch && matchesCat;
  });

  const handleDelete = (id: string, title: string) => {
    Swal.fire({
      title: 'Hapus Dokumen?',
      text: `Hapus "${title}" dari arsip perangkat?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus',
      background: '#0f172a',
      color: '#f8fafc'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
          if (res.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Dokumen Dihapus',
              timer: 1500,
              background: '#0f172a',
              color: '#f8fafc',
              showConfirmButton: false
            });
            onRefreshDocs();
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
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Archive className="w-5 h-5 text-indigo-400" />
          <span>Arsip & Manajemen Berkas Administrasi Tersimpan</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Daftar seluruh modul ajar, dokumen Kurikulum Merdeka, dan instrumen KBC yang telah disimpan.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan judul, mapel, atau rombel..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer w-full sm:w-auto"
          >
            <option value="ALL">Semua Kategori ({documents.length})</option>
            <option value="MERDEKA">Kurikulum Merdeka</option>
            <option value="MODUL_AJAR">Modul Ajar Deep Learning</option>
            <option value="ASESMEN">Asesmen Sumatif</option>
            <option value="KBC">Kurikulum Berbasis Cinta (KBC)</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-2 p-12 text-center bg-slate-850 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            Tidak ada dokumen tersimpan yang sesuai.
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isLandscape = doc.isLandscape ?? false;
            return (
              <div
                key={doc.id}
                className="bg-slate-850 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.kategori === 'KBC'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : doc.kategori === 'MODUL_AJAR'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {doc.kategori}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(doc.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 line-clamp-2">{doc.judul}</h3>
                  <div className="text-xs text-slate-400 mt-2 space-y-0.5">
                    <div>Mata Pelajaran: <span className="text-slate-200 font-medium">{doc.mapel}</span></div>
                    <div>Kelas / Fase: <span className="text-slate-200 font-medium">{doc.kelas} ({doc.fase})</span></div>
                    <div>Penyusun: <span className="text-slate-400">{doc.authorNama}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {isLandscape ? 'A4 Landscape' : 'A4 Portrait'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        onOpenDocModal({
                          title: doc.judul,
                          category: doc.kategori,
                          docType: doc.jenisDokumen,
                          mapel: doc.mapel,
                          kelas: doc.kelas,
                          fase: doc.fase,
                          htmlContent: doc.htmlContent,
                          isLandscape
                        })
                      }
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="Lihat Dokumen"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Buka</span>
                    </button>

                    <button
                      onClick={() => printDocument(doc.htmlContent, isLandscape)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition cursor-pointer"
                      title="Cetak Langsung"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    </button>

                    <button
                      onClick={() => exportToWord(doc.htmlContent, doc.judul)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition cursor-pointer"
                      title="Unduh Microsoft Word (.doc)"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-400" />
                    </button>

                    <button
                      onClick={() => handleDelete(doc.id, doc.judul)}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs transition cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
