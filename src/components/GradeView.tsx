import React, { useState } from 'react';
import { Award, Save, CheckCircle2, Calculator, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import { Student, SchoolClass, StudentGrade, SchoolConfig } from '../types';

interface GradeViewProps {
  students: Student[];
  classes: SchoolClass[];
  grades: StudentGrade[];
  config: SchoolConfig;
  onRefreshGrades: () => void;
}

export const GradeView: React.FC<GradeViewProps> = ({
  students,
  classes,
  grades,
  config,
  onRefreshGrades
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.namaKelas || 'Kelas VII-A');
  const [mapel, setMapel] = useState<string>('Matematika');
  const [tp1Desc, setTp1Desc] = useState('Memahami konsep bilangan bulat dan operasi hitung');
  const [tp2Desc, setTp2Desc] = useState('Menyelesaikan masalah aljabar linear sederhana');

  // Filter students
  const classStudents = students.filter((s) => s.kelas === selectedClass);

  // Local state for editable grades keyed by student id
  const [localGrades, setLocalGrades] = useState<Record<string, {
    formatif1: number;
    sumatif1: number;
    formatif2: number;
    sumatif2: number;
    sas: number;
    catatan: string;
  }>>({});

  // Populate local grades from DB when class / mapel changes
  React.useEffect(() => {
    const stateObj: Record<string, any> = {};
    classStudents.forEach((s) => {
      const existing = grades.find((g) => g.siswaId === s.id && g.mapel === mapel);
      if (existing) {
        stateObj[s.id] = {
          formatif1: existing.daftarNilaiTP[0]?.nilaiFormatif || 80,
          sumatif1: existing.daftarNilaiTP[0]?.nilaiSumatifMateri || 85,
          formatif2: existing.daftarNilaiTP[1]?.nilaiFormatif || 78,
          sumatif2: existing.daftarNilaiTP[1]?.nilaiSumatifMateri || 82,
          sas: existing.nilaiSAS || 85,
          catatan: existing.catatanCapaianKompetensi || ''
        };
      } else {
        stateObj[s.id] = {
          formatif1: 80,
          sumatif1: 82,
          formatif2: 80,
          sumatif2: 82,
          sas: 80,
          catatan: 'Menunjukkan pemahaman baik pada tujuan pembelajaran utama.'
        };
      }
    });
    setLocalGrades(stateObj);
  }, [selectedClass, mapel, students, grades]);

  const updateStudentScore = (siswaId: string, field: string, val: any) => {
    setLocalGrades((prev) => {
      const updated = { ...prev[siswaId], [field]: val };
      // auto update descriptive notes if empty or standard
      const avgSumatif = (Number(updated.sumatif1) + Number(updated.sumatif2)) / 2;
      const finalScore = Math.round((avgSumatif * 0.6 + Number(updated.sas) * 0.4) * 10) / 10;
      
      let note = '';
      if (finalScore >= 90) {
        note = `Sangat mahir dan menguasai seluruh TP dengan capaian istimewa pada ${mapel}.`;
      } else if (finalScore >= 80) {
        note = `Mencapai ketuntasan kompetensi dengan baik pada ${mapel}.`;
      } else if (finalScore >= 70) {
        note = `Cukup kompeten, perlu bimbingan mandiri pada penerapan soal analisis.`;
      } else {
        note = `Perlu pendampingan intensif untuk mencapai Kriteria Ketuntasan Minimal.`;
      }
      updated.catatan = note;

      return { ...prev, [siswaId]: updated };
    });
  };

  const handleSaveAllGrades = async () => {
    const listToSave = classStudents.map((s) => {
      const g = localGrades[s.id] || { formatif1: 80, sumatif1: 80, formatif2: 80, sumatif2: 80, sas: 80, catatan: '' };
      const avgSumatif = (Number(g.sumatif1) + Number(g.sumatif2)) / 2;
      const nilaiAkhir = Math.round((avgSumatif * 0.6 + Number(g.sas) * 0.4) * 10) / 10;

      return {
        siswaId: s.id,
        siswaNama: s.nama,
        nisn: s.nisn,
        kelas: selectedClass,
        mapel,
        semester: config.semesterAktif,
        tahunPelajaran: config.tahunPelajaran,
        daftarNilaiTP: [
          { tpKode: 'TP 1', tpDeskripsi: tp1Desc, nilaiFormatif: Number(g.formatif1), nilaiSumatifMateri: Number(g.sumatif1) },
          { tpKode: 'TP 2', tpDeskripsi: tp2Desc, nilaiFormatif: Number(g.formatif2), nilaiSumatifMateri: Number(g.sumatif2) }
        ],
        nilaiSAS: Number(g.sas),
        nilaiAkhir,
        catatanCapaianKompetensi: g.catatan
      };
    });

    try {
      const res = await fetch('/api/grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gradesList: listToSave })
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Nilai Berhasil Disimpan!',
          text: `Rekap nilai ${mapel} kelas ${selectedClass} tersimpan rapi.`,
          timer: 1800,
          background: '#0f172a',
          color: '#f8fafc',
          showConfirmButton: false
        });
        onRefreshGrades();
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal Menyimpan', background: '#0f172a', color: '#f8fafc' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span>Pengolahan Nilai & Asesmen Kurikulum Merdeka</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Penilaian Formatif, Sumatif Lingkup Materi per TP, Sumatif Akhir Semester (SAS), dan deskripsi capaian raport.
          </p>
        </div>

        <button
          onClick={handleSaveAllGrades}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer self-start"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Semua Nilai Rombel</span>
        </button>
      </div>

      {/* Control bar: Class, Mapel, TP Setup */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-300 mb-1">Pilih Rombel / Kelas</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
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
            <label className="block font-medium text-slate-300 mb-1">Mata Pelajaran</label>
            <input
              type="text"
              value={mapel}
              onChange={(e) => setMapel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800">
          <div>
            <label className="block font-medium text-slate-400 mb-1">Deskripsi TP 1 (Lingkup Materi 1)</label>
            <input
              type="text"
              value={tp1Desc}
              onChange={(e) => setTp1Desc(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-400 mb-1">Deskripsi TP 2 (Lingkup Materi 2)</label>
            <input
              type="text"
              value={tp2Desc}
              onChange={(e) => setTp2Desc(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold text-center">
              <tr>
                <th rowSpan={2} className="px-3 py-2.5 text-left">Nama Siswa & NISN</th>
                <th colSpan={2} className="px-3 py-1.5 border-l border-slate-800 bg-slate-800/40">TP 1</th>
                <th colSpan={2} className="px-3 py-1.5 border-l border-slate-800 bg-slate-800/40">TP 2</th>
                <th rowSpan={2} className="px-3 py-2.5 border-l border-slate-800 w-20">SAS (Ujian)</th>
                <th rowSpan={2} className="px-3 py-2.5 border-l border-slate-800 w-20 bg-indigo-900/30 text-indigo-300">Nilai Akhir</th>
                <th rowSpan={2} className="px-3 py-2.5 border-l border-slate-800 text-left min-w-[220px]">Deskripsi Capaian Raport</th>
              </tr>
              <tr className="bg-slate-900/90 text-[10px] text-slate-400 border-t border-slate-800">
                <th className="px-2 py-1 border-l border-slate-800">Formatif</th>
                <th className="px-2 py-1">Sumatif</th>
                <th className="px-2 py-1 border-l border-slate-800">Formatif</th>
                <th className="px-2 py-1">Sumatif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {classStudents.map((s) => {
                const row = localGrades[s.id] || { formatif1: 80, sumatif1: 80, formatif2: 80, sumatif2: 80, sas: 80, catatan: '' };
                const avgSumatif = (Number(row.sumatif1) + Number(row.sumatif2)) / 2;
                const finalScore = Math.round((avgSumatif * 0.6 + Number(row.sas) * 0.4) * 10) / 10;

                return (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-3 py-2 text-left">
                      <div className="font-semibold text-slate-100">{s.nama}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{s.nisn}</div>
                    </td>

                    {/* TP 1 */}
                    <td className="px-2 py-2 text-center border-l border-slate-800 w-16">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.formatif1}
                        onChange={(e) => updateStudentScore(s.id, 'formatif1', e.target.value)}
                        className="w-14 px-1.5 py-1 text-center bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-2 text-center w-16">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.sumatif1}
                        onChange={(e) => updateStudentScore(s.id, 'sumatif1', e.target.value)}
                        className="w-14 px-1.5 py-1 text-center bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold text-amber-300"
                      />
                    </td>

                    {/* TP 2 */}
                    <td className="px-2 py-2 text-center border-l border-slate-800 w-16">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.formatif2}
                        onChange={(e) => updateStudentScore(s.id, 'formatif2', e.target.value)}
                        className="w-14 px-1.5 py-1 text-center bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-2 py-2 text-center w-16">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.sumatif2}
                        onChange={(e) => updateStudentScore(s.id, 'sumatif2', e.target.value)}
                        className="w-14 px-1.5 py-1 text-center bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold text-amber-300"
                      />
                    </td>

                    {/* SAS */}
                    <td className="px-2 py-2 text-center border-l border-slate-800 w-20">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={row.sas}
                        onChange={(e) => updateStudentScore(s.id, 'sas', e.target.value)}
                        className="w-16 px-1.5 py-1 text-center bg-slate-900 border border-slate-700 rounded text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-bold text-sky-400"
                      />
                    </td>

                    {/* Final Score */}
                    <td className="px-3 py-2 text-center border-l border-slate-800 bg-indigo-950/20 font-extrabold text-sm text-indigo-300">
                      {finalScore}
                    </td>

                    {/* Notes */}
                    <td className="px-3 py-2 border-l border-slate-800 text-left">
                      <input
                        type="text"
                        value={row.catatan}
                        onChange={(e) => updateStudentScore(s.id, 'catatan', e.target.value)}
                        className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
