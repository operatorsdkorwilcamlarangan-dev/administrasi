import React, { useState } from 'react';
import { AlertTriangle, Trash2, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import Swal from 'sweetalert2';

interface DatabaseResetViewProps {
  onDatabaseResetSuccess: () => void;
}

export const DatabaseResetView: React.FC<DatabaseResetViewProps> = ({
  onDatabaseResetSuccess
}) => {
  const [confirmInput, setConfirmInput] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleTriggerReset = () => {
    if (confirmInput !== 'RESET DATA SEKOLAH') {
      Swal.fire({
        icon: 'error',
        title: 'Konfirmasi Teks Tidak Sesuai',
        text: 'Silakan ketik teks "RESET DATA SEKOLAH" persis dengan huruf kapital untuk melanjutkan.',
        background: '#0f172a',
        color: '#f8fafc'
      });
      return;
    }

    Swal.fire({
      title: 'Peringatan Terakhir!',
      text: 'Semua rekaman siswa, presensi, jurnal, nilai, bimbingan, dan arsip dokumen akan dikembalikan ke data awal pabrik. Apakah Anda benar-benar yakin?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Ya, Bersihkan Database!',
      cancelButtonText: 'Batalkan',
      background: '#0f172a',
      color: '#f8fafc'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsResetting(true);
        try {
          const res = await fetch('/api/database/reset', { method: 'POST' });
          if (res.ok) {
            Swal.fire({
              icon: 'success',
              title: 'Database Berhasil Direset!',
              text: 'Sistem telah dibersihkan dan dikembalikan ke template awal.',
              background: '#0f172a',
              color: '#f8fafc',
              timer: 2000,
              showConfirmButton: false
            });
            setConfirmInput('');
            onDatabaseResetSuccess();
          }
        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'Gagal Mereset Database',
            background: '#0f172a',
            color: '#f8fafc'
          });
        } finally {
          setIsResetting(false);
        }
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-rose-400 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <span>Pemeliharaan & Reset Database Sistem (Khusus Administrator)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Tindakan ini ditujukan untuk pembersihan data uji coba dan mengembalikan seluruh struktur ke kondisi default awal tahun ajaran.
        </p>
      </div>

      <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-rose-300">
              Perhatian: Operasi Ini Bersifat Permanen!
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mereset database akan menghapus seluruh data transaksi:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-0.5 pt-1">
              <li>Histori presensi harian & jurnal mengajar guru</li>
              <li>Seluruh nilai formatif, sumatif, dan capaian raport siswa</li>
              <li>Catatan bimbingan wali kelas & observasi karakter KBC</li>
              <li>Seluruh arsip dokumen ajar tersimpan</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-rose-500/20 space-y-3">
          <label className="block text-xs font-semibold text-slate-200">
            Ketik kata <span className="font-mono text-rose-400 font-bold">RESET DATA SEKOLAH</span> di bawah ini untuk konfirmasi:
          </label>

          <input
            type="text"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder="RESET DATA SEKOLAH"
            className="w-full px-4 py-2.5 bg-slate-900 border border-rose-500/40 rounded-xl text-slate-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          <button
            onClick={handleTriggerReset}
            disabled={confirmInput !== 'RESET DATA SEKOLAH' || isResetting}
            className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isResetting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Mulai Proses Reset Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
