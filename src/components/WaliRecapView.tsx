import React, { useState } from 'react';
import { ClipboardList, Printer, Download, Users, TrendingUp, Award, CalendarCheck } from 'lucide-react';
import { Student, SchoolClass, AttendanceRecord, StudentGrade, SchoolConfig, User } from '../types';
import { printDocument, generateKopHtml, generateSignatureTable } from '../utils/documentTemplates';

interface WaliRecapViewProps {
  students: Student[];
  classes: SchoolClass[];
  attendance: AttendanceRecord[];
  grades: StudentGrade[];
  config: SchoolConfig;
  currentUser: User;
}

export const WaliRecapView: React.FC<WaliRecapViewProps> = ({
  students,
  classes,
  attendance,
  grades,
  config,
  currentUser
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(
    currentUser.kelasBinaan || classes[0]?.namaKelas || 'Kelas VII-A'
  );

  const classStudents = students.filter((s) => s.kelas === selectedClass);

  // Compute attendance stats per student
  const studentStats = classStudents.map((s) => {
    let hadir = 0;
    let sakit = 0;
    let izin = 0;
    let alpa = 0;

    attendance
      .filter((a) => a.kelas === selectedClass)
      .forEach((a) => {
        const found = a.dataSiswa.find((ds) => ds.siswaId === s.id || ds.nisn === s.nisn);
        if (found) {
          if (found.status === 'Hadir') hadir++;
          else if (found.status === 'Sakit') sakit++;
          else if (found.status === 'Izin') izin++;
          else if (found.status === 'Alpa') alpa++;
        }
      });

    // Compute grades for this student
    const studentGrades = grades.filter((g) => g.siswaId === s.id);
    const avgScore =
      studentGrades.length > 0
        ? Math.round(
            (studentGrades.reduce((acc, curr) => acc + (curr.nilaiAkhir || 80), 0) /
              studentGrades.length) *
              10
          ) / 10
        : 82;

    return {
      ...s,
      hadir,
      sakit,
      izin,
      alpa,
      avgScore
    };
  });

  const handlePrintRecap = () => {
    const kop = generateKopHtml(
      config,
      `LEMBAR REKAPITULASI WALI KELAS - ${selectedClass}`,
      `Tahun Pelajaran ${config.tahunPelajaran} • Semester ${config.semesterAktif}`
    );

    let rowsHtml = '';
    studentStats.forEach((s, idx) => {
      rowsHtml += `
        <tr>
          <td style="border: 1px solid #000; text-align: center;">${idx + 1}</td>
          <td style="border: 1px solid #000; text-align: center; font-family: monospace;">${s.nisn}</td>
          <td style="border: 1px solid #000; padding: 5px; font-weight: bold;">${s.nama}</td>
          <td style="border: 1px solid #000; text-align: center;">${s.jenisKelamin}</td>
          <td style="border: 1px solid #000; text-align: center;">${s.hadir}</td>
          <td style="border: 1px solid #000; text-align: center;">${s.sakit}</td>
          <td style="border: 1px solid #000; text-align: center;">${s.izin}</td>
          <td style="border: 1px solid #000; text-align: center;">${s.alpa}</td>
          <td style="border: 1px solid #000; text-align: center; font-weight: bold;">${s.avgScore}</td>
          <td style="border: 1px solid #000; padding: 5px; font-size: 9pt;">${s.avgScore >= 80 ? 'Sangat Baik' : 'Baik'}</td>
        </tr>
      `;
    });

    const body = `
      <table class="data-table" style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 10pt;">
        <thead>
          <tr style="background-color: #f1f5f9; text-align: center;">
            <th rowspan="2" style="border: 1px solid #000; padding: 5px;">No</th>
            <th rowspan="2" style="border: 1px solid #000; padding: 5px;">NISN</th>
            <th rowspan="2" style="border: 1px solid #000; padding: 5px;">Nama Siswa</th>
            <th rowspan="2" style="border: 1px solid #000; padding: 5px;">L/P</th>
            <th colspan="4" style="border: 1px solid #000; padding: 5px;">Kehadiran (Presensi)</th>
            <th rowspan="2" style="border: 1px solid #000; padding: 5px;">Rata-rata Nilai</th>
            <th rowspan="2" style="border: 1px solid #000; padding: 5px;">Predikat Raport</th>
          </tr>
          <tr style="background-color: #f8fafc; text-align: center; font-size: 9pt;">
            <th style="border: 1px solid #000; padding: 3px;">H</th>
            <th style="border: 1px solid #000; padding: 3px;">S</th>
            <th style="border: 1px solid #000; padding: 3px;">I</th>
            <th style="border: 1px solid #000; padding: 3px;">A</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;

    const sig = generateSignatureTable(
      config,
      `Wali Kelas ${selectedClass}`,
      currentUser.namaLengkap,
      currentUser.nip
    );

    printDocument(`${kop}${body}${sig}`, true); // landscape mode
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-400" />
            <span>Rekapitulasi Wali Kelas & Leger Nilai Terpadu</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rekapitulasi komprehensif kehadiran, nilai rata-rata, dan status capaian akademik rombongan belajar.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.namaKelas}>
                {c.namaKelas}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrintRecap}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Leger Rekap (A4 Landscape)</span>
          </button>
        </div>
      </div>

      {/* Recap Table */}
      <div className="bg-slate-850 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold text-center">
              <tr>
                <th rowSpan={2} className="px-3 py-3 text-left">Nama Siswa</th>
                <th rowSpan={2} className="px-3 py-3">NISN</th>
                <th rowSpan={2} className="px-3 py-3">L/P</th>
                <th colSpan={4} className="px-3 py-1.5 border-l border-slate-800 bg-slate-800/40">Presensi Sesi</th>
                <th rowSpan={2} className="px-3 py-3 border-l border-slate-800">Rata-rata Nilai</th>
                <th rowSpan={2} className="px-3 py-3 border-l border-slate-800">Capaian Karakter</th>
              </tr>
              <tr className="bg-slate-900/90 text-[10px] text-slate-400 border-t border-slate-800">
                <th className="px-2 py-1 text-emerald-400 border-l border-slate-800">Hadir</th>
                <th className="px-2 py-1 text-amber-400">Sakit</th>
                <th className="px-2 py-1 text-blue-400">Izin</th>
                <th className="px-2 py-1 text-rose-400">Alpa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {studentStats.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-3 py-2.5 font-medium text-slate-100">{s.nama}</td>
                  <td className="px-3 py-2.5 font-mono text-center text-slate-400">{s.nisn}</td>
                  <td className="px-3 py-2.5 text-center font-bold text-slate-300">{s.jenisKelamin}</td>
                  <td className="px-3 py-2.5 text-center border-l border-slate-800 text-emerald-400 font-bold">{s.hadir}</td>
                  <td className="px-3 py-2.5 text-center text-amber-400 font-bold">{s.sakit}</td>
                  <td className="px-3 py-2.5 text-center text-blue-400 font-bold">{s.izin}</td>
                  <td className="px-3 py-2.5 text-center text-rose-400 font-bold">{s.alpa}</td>
                  <td className="px-3 py-2.5 text-center border-l border-slate-800 font-extrabold text-indigo-300">
                    {s.avgScore}
                  </td>
                  <td className="px-3 py-2.5 border-l border-slate-800 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Aktif & Berkarakter
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
