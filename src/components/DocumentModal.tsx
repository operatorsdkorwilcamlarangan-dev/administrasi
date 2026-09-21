import React, { useState } from 'react';
import { Printer, Download, Copy, Save, X, Code, Eye, FileText, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { printDocument, exportToWord, copyHtmlCode, DOCUMENT_STYLES } from '../utils/documentTemplates';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: 'MERDEKA' | 'KBC' | 'MODUL_AJAR' | 'ASESMEN';
  docType: string;
  mapel: string;
  kelas: string;
  fase: string;
  htmlContent: string;
  authorNama: string;
  isLandscape?: boolean;
  onSaved?: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  docType,
  mapel,
  kelas,
  fase,
  htmlContent,
  authorNama,
  isLandscape = false,
  onSaved
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    printDocument(htmlContent, isLandscape);
  };

  const handleDownloadWord = () => {
    const filename = `${docType}_${mapel}_${kelas}_${new Date().toISOString().slice(0, 10)}`;
    exportToWord(htmlContent, filename, isLandscape);
  };

  const handleCopyHtml = () => {
    copyHtmlCode(htmlContent);
  };

  const handleSaveToArchive = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul: `${docType} - ${mapel} (${kelas})`,
          kategori: category,
          jenisDokumen: docType,
          mapel,
          kelas,
          fase,
          htmlContent,
          authorNama
        })
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Tersimpan ke Arsip!',
          text: 'Dokumen berhasil disimpan ke arsip sekolah dan dapat diakses kembali kapanpun.',
          background: '#0f172a',
          color: '#f8fafc',
          confirmButtonColor: '#10b981',
          timer: 2000,
          showConfirmButton: false
        });
        if (onSaved) onSaved();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: 'Terjadi gangguan jaringan saat menyimpan dokumen.',
        background: '#0f172a',
        color: '#f8fafc',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Toolbar Header */}
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{title}</span>
                {isLandscape && (
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Format Landscape
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                {mapel} • {kelas} ({fase}) • Disusun oleh: {authorNama}
              </p>
            </div>
          </div>

          {/* Action Buttons (Mandatory: Print PDF, Word .doc, Copy HTML) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition flex items-center gap-1 cursor-pointer ${
                  viewMode === 'preview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau</span>
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition flex items-center gap-1 cursor-pointer ${
                  viewMode === 'code' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Kode HTML</span>
              </button>
            </div>

            {/* Print button */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Cetak atau Simpan sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Cetak / PDF</span>
            </button>

            {/* Word .doc export button */}
            <button
              onClick={handleDownloadWord}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Unduh File Microsoft Word .doc"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Word (.doc)</span>
            </button>

            {/* Copy HTML button */}
            <button
              onClick={handleCopyHtml}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              title="Salin Kode HTML"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin HTML</span>
            </button>

            {/* Save to archive button */}
            <button
              onClick={handleSaveToArchive}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              title="Simpan ke Arsip Sekolah"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan Arsip'}</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Document Preview Paper */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 flex justify-center">
          {viewMode === 'preview' ? (
            <div
              className={`bg-white text-black shadow-2xl rounded-sm p-8 md:p-12 transition-all my-auto ${
                isLandscape ? 'w-full max-w-4xl min-h-[500px]' : 'w-full max-w-3xl min-h-[650px]'
              }`}
            >
              {/* Inject standard document styles into preview container */}
              <div
                dangerouslySetInnerHTML={{
                  __html: `${DOCUMENT_STYLES}<div>${htmlContent}</div>`
                }}
              />
            </div>
          ) : (
            <div className="w-full max-w-4xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-mono">HTML Source Code</span>
                <button
                  onClick={handleCopyHtml}
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Salin Semua
                </button>
              </div>
              <pre className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap max-h-[70vh]">
                {htmlContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
