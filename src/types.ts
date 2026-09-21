export type UserRole = 'admin' | 'guru' | 'wali_kelas';

export interface User {
  id: string;
  username: string;
  password?: string;
  namaLengkap: string;
  nip: string;
  role: UserRole;
  mapel: string;
  kelasBinaan?: string; // Khusus wali kelas (e.g. "Kelas 7-A")
  createdAt?: string;
}

export interface SchoolConfig {
  namaPemerintah: string;
  namaSekolah: string;
  alamatSekolah: string;
  tempatTanggalTtd: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  tahunPelajaran: string;
  semesterAktif: 'Ganjil' | 'Genap';
  logoKiri?: string;
  logoKanan?: string;
}

export interface Student {
  id: string;
  nisn: string;
  nama: string;
  kelas: string;
  jenisKelamin: 'L' | 'P';
  agama: string;
  namaOrangTua: string;
  alamat?: string;
  teleponOrtu?: string;
}

export interface SchoolClass {
  id: string;
  namaKelas: string;
  fase: 'Fase A (Kelas 1-2)' | 'Fase B (Kelas 3-4)' | 'Fase C (Kelas 5-6)' | 'Fase D (Kelas 7-9)' | 'Fase E (Kelas 10)' | 'Fase F (Kelas 11-12)';
  tingkat: string;
  waliKelasId?: string;
  waliKelasNama?: string;
  tahunPelajaran: string;
}

export type KehadiranStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export interface AttendanceRecord {
  id: string;
  tanggal: string; // YYYY-MM-DD
  kelas: string;
  mapel: string;
  jamKe: string; // e.g. "1 - 2"
  materi: string;
  catatanKejadian?: string;
  guruId: string;
  guruNama: string;
  dataSiswa: {
    siswaId: string;
    siswaNama: string;
    nisn: string;
    status: KehadiranStatus;
    catatan?: string;
  }[];
  createdAt: string;
}

export interface TeachingJournal {
  id: string;
  tanggal: string;
  guruId: string;
  guruNama: string;
  kelas: string;
  mapel: string;
  jamKe: string;
  materiPokok: string;
  kegiatan: string;
  pencapaianKendala: string;
  tindakLanjut: string;
  createdAt: string;
}

export interface GradeItem {
  tpKode: string; // e.g. "TP 1.1"
  tpDeskripsi: string;
  nilaiFormatif: number;
  nilaiSumatifMateri: number;
}

export interface StudentGrade {
  id: string;
  siswaId: string;
  siswaNama: string;
  nisn: string;
  kelas: string;
  mapel: string;
  semester: 'Ganjil' | 'Genap';
  tahunPelajaran: string;
  daftarNilaiTP: GradeItem[];
  nilaiSAS: number; // Sumatif Akhir Semester
  nilaiAkhir: number;
  catatanCapaianKompetensi: string;
  updatedAt: string;
}

export interface WaliGuidance {
  id: string;
  tanggal: string;
  kelas: string;
  siswaId: string;
  siswaNama: string;
  kategori: 'Akademik' | 'Disiplin / Perilaku' | 'Sosial / Emosional' | 'Pencegahan Bullying' | 'Lainnya';
  kasusMasalah: string;
  tindakLanjutSolusi: string;
  hasilKonseling: string;
  status: 'Dalam Pantauan' | 'Selesai' | 'Diteruskan ke BK/Kepsek';
  waliKelasNama: string;
  createdAt: string;
}

export interface AttitudeRecord {
  id: string;
  siswaId: string;
  siswaNama: string;
  kelas: string;
  catatanSikap: string;
  dimensiProfil: string; // e.g. "Beriman & Bertakwa", "Gotong Royong", "Mandiri", "Cinta Sesama (KBC)"
  predikat: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan';
  tanggal: string;
  waliKelasNama: string;
}

export interface SavedDocument {
  id: string;
  judul: string;
  kategori: 'MERDEKA' | 'KBC' | 'MODUL_AJAR' | 'ASESMEN';
  jenisDokumen: string; // e.g. "ADM-CP", "Modul Ajar KBC", dll.
  mapel: string;
  kelas: string;
  fase: string;
  htmlContent: string;
  authorNama: string;
  isLandscape?: boolean;
  createdAt: string;
}

export type StudentGuidance = WaliGuidance;
export type StudentAttitude = AttitudeRecord;

export type ActiveTab =
  | 'dashboard'
  | 'config'
  | 'users'
  | 'classes'
  | 'students'
  | 'attendance'
  | 'journals'
  | 'grades'
  | 'wali_guidance'
  | 'wali_recap'
  | 'merdeka_ai'
  | 'modul_ajar_ai'
  | 'kbc_ai'
  | 'saved_docs'
  | 'database_reset';

export type NavTab = ActiveTab;

