import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initial Gemini AI setup
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// Database directory & path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const initialSeedData = {
  config: {
    namaPemerintah: 'PEMERINTAH KABUPATEN GROBOGAN\nDINAS PENDIDIKAN',
    namaSekolah: 'UPTD SPF SDN 1 PURWODADI',
    alamatSekolah: 'Jl. R.A. Kartini No. 45, Purwodadi, Kab. Grobogan, Jawa Tengah 58111 | Telp: (0292) 421234',
    tempatTanggalTtd: 'Purwodadi, 15 Juli 2024',
    namaKepalaSekolah: 'Drs. H. Ahmad Sudrajat, M.Pd.',
    nipKepalaSekolah: '19720515 199803 1 004',
    tahunPelajaran: '2024/2025',
    semesterAktif: 'Ganjil',
    logoKiri: '',
    logoKanan: ''
  },
  users: [
    {
      id: 'u-admin-1',
      username: 'admin',
      password: 'admin123',
      namaLengkap: 'Rusnoto, M.Pd.',
      nip: '19800101 200501 1 012',
      role: 'admin',
      mapel: 'Semua Mata Pelajaran / Administrator',
      createdAt: '2024-07-01'
    },
    {
      id: 'u-guru-1',
      username: 'guru1',
      password: 'guru123',
      namaLengkap: 'Budi Santoso, S.Pd., Gr.',
      nip: '19850312 201001 1 015',
      role: 'guru',
      mapel: 'Matematika',
      createdAt: '2024-07-01'
    },
    {
      id: 'u-guru-2',
      username: 'guru2',
      password: 'guru123',
      namaLengkap: 'Siti Rahmawati, S.Pd.',
      nip: '19890620 201502 2 008',
      role: 'guru',
      mapel: 'Bahasa Indonesia',
      createdAt: '2024-07-01'
    },
    {
      id: 'u-wali-1',
      username: 'wali1',
      password: 'wali123',
      namaLengkap: 'Ahmad Fauzi, S.Pd.I., M.Pd.',
      nip: '19820718 200801 1 009',
      role: 'wali_kelas',
      mapel: 'Pendidikan Agama & Budi Pekerti',
      kelasBinaan: 'Kelas VII-A',
      createdAt: '2024-07-01'
    }
  ],
  classes: [
    { id: 'c-1', namaKelas: 'Kelas VII-A', fase: 'Fase D (Kelas 7-9)', tingkat: '7', waliKelasId: 'u-wali-1', waliKelasNama: 'Ahmad Fauzi, S.Pd.I., M.Pd.', tahunPelajaran: '2024/2025' },
    { id: 'c-2', namaKelas: 'Kelas VII-B', fase: 'Fase D (Kelas 7-9)', tingkat: '7', waliKelasId: 'u-guru-1', waliKelasNama: 'Budi Santoso, S.Pd., Gr.', tahunPelajaran: '2024/2025' },
    { id: 'c-3', namaKelas: 'Kelas VIII-A', fase: 'Fase D (Kelas 7-9)', tingkat: '8', waliKelasId: 'u-guru-2', waliKelasNama: 'Siti Rahmawati, S.Pd.', tahunPelajaran: '2024/2025' },
    { id: 'c-4', namaKelas: 'Kelas IX-A', fase: 'Fase D (Kelas 7-9)', tingkat: '9', waliKelasId: 'u-admin-1', waliKelasNama: 'Rusnoto, M.Pd.', tahunPelajaran: '2024/2025' }
  ],
  students: [
    { id: 's-1', nisn: '0081234001', nama: 'Aditya Pratama Putra', kelas: 'Kelas VII-A', jenisKelamin: 'L', agama: 'Islam', namaOrangTua: 'Bambang Pratama', alamat: 'Purwodadi' },
    { id: 's-2', nisn: '0081234002', nama: 'Aisyah Nur Salsabila', kelas: 'Kelas VII-A', jenisKelamin: 'P', agama: 'Islam', namaOrangTua: 'Supriyanto', alamat: 'Grobogan' },
    { id: 's-3', nisn: '0081234003', nama: 'Bagas Wahyu Hidayat', kelas: 'Kelas VII-A', jenisKelamin: 'L', agama: 'Islam', namaOrangTua: 'Hidayatullah', alamat: 'Purwodadi' },
    { id: 's-4', nisn: '0081234004', nama: 'Cantika Dewi Anggraini', kelas: 'Kelas VII-A', jenisKelamin: 'P', agama: 'Islam', namaOrangTua: 'Joko Susilo', alamat: 'Toroh' },
    { id: 's-5', nisn: '0081234005', nama: 'Daniel Christianto', kelas: 'Kelas VII-A', jenisKelamin: 'L', agama: 'Kristen', namaOrangTua: 'Yohanes Tan', alamat: 'Purwodadi' },
    { id: 's-6', nisn: '0081234006', nama: 'Dinda Ayu Lestari', kelas: 'Kelas VII-A', jenisKelamin: 'P', agama: 'Islam', namaOrangTua: 'Agus Lestari', alamat: 'Grobogan' },
    { id: 's-7', nisn: '0081234007', nama: 'Farhan Rizki Ramadhan', kelas: 'Kelas VII-A', jenisKelamin: 'L', agama: 'Islam', namaOrangTua: 'Ramadhan Tri', alamat: 'Purwodadi' },
    { id: 's-8', nisn: '0081234008', nama: 'Gita Maharani Putri', kelas: 'Kelas VII-A', jenisKelamin: 'P', agama: 'Islam', namaOrangTua: 'Mahar Suparno', alamat: 'Pulokulon' },
    { id: 's-9', nisn: '0081234009', nama: 'Haikal Zikri Pratama', kelas: 'Kelas VII-B', jenisKelamin: 'L', agama: 'Islam', namaOrangTua: 'Zainul Zikri', alamat: 'Purwodadi' },
    { id: 's-10', nisn: '0081234010', nama: 'Intan Permatasari', kelas: 'Kelas VII-B', jenisKelamin: 'P', agama: 'Islam', namaOrangTua: 'Sukardi', alamat: 'Purwodadi' }
  ],
  attendance: [
    {
      id: 'att-1',
      tanggal: '2024-07-22',
      kelas: 'Kelas VII-A',
      mapel: 'Matematika',
      jamKe: '1 - 2',
      materi: 'Bilangan Bulat dan Operasi Hitung',
      catatanKejadian: 'Seluruh peserta didik aktif mengikuti ice breaking Mindful Learning.',
      guruId: 'u-guru-1',
      guruNama: 'Budi Santoso, S.Pd., Gr.',
      dataSiswa: [
        { siswaId: 's-1', siswaNama: 'Aditya Pratama Putra', nisn: '0081234001', status: 'Hadir' },
        { siswaId: 's-2', siswaNama: 'Aisyah Nur Salsabila', nisn: '0081234002', status: 'Hadir' },
        { siswaId: 's-3', siswaNama: 'Bagas Wahyu Hidayat', nisn: '0081234003', status: 'Sakit', catatan: 'Demam' },
        { siswaId: 's-4', siswaNama: 'Cantika Dewi Anggraini', nisn: '0081234004', status: 'Hadir' },
        { siswaId: 's-5', siswaNama: 'Daniel Christianto', nisn: '0081234005', status: 'Hadir' },
        { siswaId: 's-6', siswaNama: 'Dinda Ayu Lestari', nisn: '0081234006', status: 'Izin', catatan: 'Ada acara keluarga' },
        { siswaId: 's-7', siswaNama: 'Farhan Rizki Ramadhan', nisn: '0081234007', status: 'Hadir' },
        { siswaId: 's-8', siswaNama: 'Gita Maharani Putri', nisn: '0081234008', status: 'Hadir' }
      ],
      createdAt: '2024-07-22T08:00:00.000Z'
    }
  ],
  journals: [
    {
      id: 'j-1',
      tanggal: '2024-07-22',
      guruId: 'u-guru-1',
      guruNama: 'Budi Santoso, S.Pd., Gr.',
      kelas: 'Kelas VII-A',
      mapel: 'Matematika',
      jamKe: '1 - 2 (07.00 - 08.20)',
      materiPokok: 'Operasi Penjumlahan dan Pengurangan Bilangan Bulat Negatif',
      kegiatan: 'Model Problem-Based Learning dengan kartu garis bilangan warna-warni dan refleksi Meaningful Learning.',
      pencapaianKendala: 'Sebagian siswa masih ragu ketika mengurangkan dengan bilangan negatif.',
      tindakLanjut: 'Diberikan latihan analogi lift gedung bertingkat pada pertemuan berikutnya.',
      createdAt: '2024-07-22T08:30:00.000Z'
    }
  ],
  grades: [
    {
      id: 'g-1',
      siswaId: 's-1',
      siswaNama: 'Aditya Pratama Putra',
      nisn: '0081234001',
      kelas: 'Kelas VII-A',
      mapel: 'Matematika',
      semester: 'Ganjil',
      tahunPelajaran: '2024/2025',
      daftarNilaiTP: [
        { tpKode: 'TP 7.1', tpDeskripsi: 'Memahami konsep bilangan bulat dan urutannya', nilaiFormatif: 85, nilaiSumatifMateri: 88 },
        { tpKode: 'TP 7.2', tpDeskripsi: 'Menyelesaikan operasi hitung aritmatika bilangan bulat', nilaiFormatif: 82, nilaiSumatifMateri: 86 }
      ],
      nilaiSAS: 87,
      nilaiAkhir: 86.5,
      catatanCapaianKompetensi: 'Sangat menguasai konsep bilangan bulat dan terampil menyelesaikan masalah aritmatika.',
      updatedAt: '2024-07-25T10:00:00.000Z'
    },
    {
      id: 'g-2',
      siswaId: 's-2',
      siswaNama: 'Aisyah Nur Salsabila',
      nisn: '0081234002',
      kelas: 'Kelas VII-A',
      mapel: 'Matematika',
      semester: 'Ganjil',
      tahunPelajaran: '2024/2025',
      daftarNilaiTP: [
        { tpKode: 'TP 7.1', tpDeskripsi: 'Memahami konsep bilangan bulat dan urutannya', nilaiFormatif: 92, nilaiSumatifMateri: 95 },
        { tpKode: 'TP 7.2', tpDeskripsi: 'Menyelesaikan operasi hitung aritmatika bilangan bulat', nilaiFormatif: 90, nilaiSumatifMateri: 94 }
      ],
      nilaiSAS: 93,
      nilaiAkhir: 93.2,
      catatanCapaianKompetensi: 'Memiliki pemahaman istimewa pada operasi bilangan bulat dan penalaran aljabar.',
      updatedAt: '2024-07-25T10:00:00.000Z'
    }
  ],
  guidance: [
    {
      id: 'guid-1',
      tanggal: '2024-07-23',
      kelas: 'Kelas VII-A',
      siswaId: 's-3',
      siswaNama: 'Bagas Wahyu Hidayat',
      kategori: 'Akademik',
      kasusMasalah: 'Sering ragu bertanya saat belum memahami materi pelajaran matematika.',
      tindakLanjutSolusi: 'Diberikan bimbingan personal dan dipasangkan dengan teman sebaya (peer-tutoring).',
      hasilKonseling: 'Bagas merasa lebih nyaman bertanya dan menunjukkan peningkatan antusiasme.',
      status: 'Dalam Pantauan',
      waliKelasNama: 'Ahmad Fauzi, S.Pd.I., M.Pd.',
      createdAt: '2024-07-23T11:00:00.000Z'
    }
  ],
  attitudes: [
    {
      id: 'attd-1',
      siswaId: 's-1',
      siswaNama: 'Aditya Pratama Putra',
      kelas: 'Kelas VII-A',
      catatanSikap: 'Menunjukkan kepedulian tinggi dengan membantu merapikan alat belajar teman saat praktikum kelompok.',
      dimensiProfil: 'Gotong Royong & Cinta Sesama (KBC)',
      predikat: 'Sangat Baik',
      tanggal: '2024-07-24',
      waliKelasNama: 'Ahmad Fauzi, S.Pd.I., M.Pd.'
    }
  ],
  documents: []
};

// Database helper
function loadDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeedData, null, 2), 'utf-8');
      return initialSeedData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, using memory seed:', err);
    return initialSeedData;
  }
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// ---------------- REST API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Auth login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = loadDb();
  const user = db.users.find((u: any) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Username atau password tidak cocok!' });
  }
  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// Config API
app.get('/api/config', (req, res) => {
  const db = loadDb();
  res.json(db.config);
});

app.put('/api/config', (req, res) => {
  const db = loadDb();
  db.config = { ...db.config, ...req.body };
  saveDb(db);
  res.json({ success: true, config: db.config });
});

// Users API
app.get('/api/users', (req, res) => {
  const db = loadDb();
  const safeUsers = db.users.map(({ password, ...u }: any) => u);
  res.json(safeUsers);
});

app.post('/api/users', (req, res) => {
  const db = loadDb();
  const newUser = {
    id: `u-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString().split('T')[0]
  };
  db.users.push(newUser);
  saveDb(db);
  const { password, ...safeUser } = newUser;
  res.json({ success: true, user: safeUser });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  const idx = db.users.findIndex((u: any) => u.id === id);
  if (idx === -1) return res.status(404).json({ message: 'User tidak ditemukan' });

  // Retain existing password if not provided
  const existing = db.users[idx];
  const updated = {
    ...existing,
    ...req.body,
    password: req.body.password || existing.password
  };
  db.users[idx] = updated;
  saveDb(db);
  const { password, ...safeUser } = updated;
  res.json({ success: true, user: safeUser });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  if (db.users.length <= 1) {
    return res.status(400).json({ success: false, message: 'Tidak dapat menghapus user terakhir!' });
  }
  db.users = db.users.filter((u: any) => u.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Classes API
app.get('/api/classes', (req, res) => {
  const db = loadDb();
  res.json(db.classes);
});

app.post('/api/classes', (req, res) => {
  const db = loadDb();
  const newClass = { id: `c-${Date.now()}`, ...req.body };
  db.classes.push(newClass);
  saveDb(db);
  res.json({ success: true, item: newClass });
});

app.put('/api/classes/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  const idx = db.classes.findIndex((c: any) => c.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Kelas tidak ditemukan' });
  db.classes[idx] = { ...db.classes[idx], ...req.body };
  saveDb(db);
  res.json({ success: true, item: db.classes[idx] });
});

app.delete('/api/classes/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  db.classes = db.classes.filter((c: any) => c.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Students API
app.get('/api/students', (req, res) => {
  const db = loadDb();
  res.json(db.students);
});

app.post('/api/students', (req, res) => {
  const db = loadDb();
  const newStudent = { id: `s-${Date.now()}`, ...req.body };
  db.students.push(newStudent);
  saveDb(db);
  res.json({ success: true, item: newStudent });
});

app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  const idx = db.students.findIndex((s: any) => s.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
  db.students[idx] = { ...db.students[idx], ...req.body };
  saveDb(db);
  res.json({ success: true, item: db.students[idx] });
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  db.students = db.students.filter((s: any) => s.id !== id);
  saveDb(db);
  res.json({ success: true });
});

app.post('/api/students/import', (req, res) => {
  const { studentsList } = req.body;
  if (!Array.isArray(studentsList) || studentsList.length === 0) {
    return res.status(400).json({ success: false, message: 'Format data siswa tidak valid' });
  }
  const db = loadDb();
  const added = studentsList.map((item: any, idx: number) => ({
    id: `s-${Date.now()}-${idx}`,
    nisn: String(item.nisn || `008${Date.now().toString().slice(-7)}`),
    nama: item.nama || 'Siswa Baru',
    kelas: item.kelas || 'Kelas VII-A',
    jenisKelamin: item.jenisKelamin === 'P' ? 'P' : 'L',
    agama: item.agama || 'Islam',
    namaOrangTua: item.namaOrangTua || '-',
    alamat: item.alamat || '-'
  }));

  db.students = [...db.students, ...added];
  saveDb(db);
  res.json({ success: true, count: added.length, students: db.students });
});

// Attendance API
app.get('/api/attendance', (req, res) => {
  const db = loadDb();
  res.json(db.attendance);
});

app.post('/api/attendance', (req, res) => {
  const db = loadDb();
  const record = { id: `att-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  db.attendance.unshift(record);
  saveDb(db);
  res.json({ success: true, item: record });
});

app.delete('/api/attendance/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  db.attendance = db.attendance.filter((a: any) => a.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Teaching Journals API
app.get('/api/journals', (req, res) => {
  const db = loadDb();
  res.json(db.journals);
});

app.post('/api/journals', (req, res) => {
  const db = loadDb();
  const record = { id: `j-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  db.journals.unshift(record);
  saveDb(db);
  res.json({ success: true, item: record });
});

app.delete('/api/journals/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  db.journals = db.journals.filter((j: any) => j.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Grades API
app.get('/api/grades', (req, res) => {
  const db = loadDb();
  res.json(db.grades);
});

app.post('/api/grades', (req, res) => {
  const { gradesList } = req.body;
  const db = loadDb();
  if (Array.isArray(gradesList)) {
    gradesList.forEach((gItem: any) => {
      const idx = db.grades.findIndex((g: any) => g.siswaId === gItem.siswaId && g.mapel === gItem.mapel);
      if (idx >= 0) {
        db.grades[idx] = { ...db.grades[idx], ...gItem, updatedAt: new Date().toISOString() };
      } else {
        db.grades.push({ id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ...gItem, updatedAt: new Date().toISOString() });
      }
    });
  } else if (req.body.siswaId) {
    const gItem = req.body;
    const idx = db.grades.findIndex((g: any) => g.siswaId === gItem.siswaId && g.mapel === gItem.mapel);
    if (idx >= 0) {
      db.grades[idx] = { ...db.grades[idx], ...gItem, updatedAt: new Date().toISOString() };
    } else {
      db.grades.push({ id: `g-${Date.now()}`, ...gItem, updatedAt: new Date().toISOString() });
    }
  }
  saveDb(db);
  res.json({ success: true, grades: db.grades });
});

// Guidance & Attitude API (Wali Kelas)
app.get('/api/guidance', (req, res) => {
  const db = loadDb();
  res.json(db.guidance || []);
});

app.post('/api/guidance', (req, res) => {
  const db = loadDb();
  const item = { id: `guid-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  db.guidance = db.guidance || [];
  db.guidance.unshift(item);
  saveDb(db);
  res.json({ success: true, item });
});

app.put('/api/guidance/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  db.guidance = db.guidance || [];
  const idx = db.guidance.findIndex((g: any) => g.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Data bimbingan tidak ditemukan' });
  db.guidance[idx] = { ...db.guidance[idx], ...req.body };
  saveDb(db);
  res.json({ success: true, item: db.guidance[idx] });
});

app.delete('/api/guidance/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  db.guidance = (db.guidance || []).filter((g: any) => g.id !== id);
  saveDb(db);
  res.json({ success: true });
});

app.get('/api/attitudes', (req, res) => {
  const db = loadDb();
  res.json(db.attitudes || []);
});

app.post('/api/attitudes', (req, res) => {
  const db = loadDb();
  const item = { id: `attd-${Date.now()}`, ...req.body };
  db.attitudes = db.attitudes || [];
  db.attitudes.unshift(item);
  saveDb(db);
  res.json({ success: true, item });
});

app.delete('/api/attitudes/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  db.attitudes = (db.attitudes || []).filter((a: any) => a.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Saved Documents API
app.get('/api/documents', (req, res) => {
  const db = loadDb();
  res.json(db.documents || []);
});

app.post('/api/documents', (req, res) => {
  const db = loadDb();
  const doc = { id: `doc-${Date.now()}`, ...req.body, createdAt: new Date().toISOString() };
  db.documents = db.documents || [];
  db.documents.unshift(doc);
  saveDb(db);
  res.json({ success: true, doc });
});

app.delete('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDb();
  db.documents = (db.documents || []).filter((d: any) => d.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// Reset Database API
app.post('/api/reset-database', (req, res) => {
  saveDb(initialSeedData);
  res.json({ success: true, message: 'Database berhasil direset ke data bawaan awal.' });
});

// ---------------- GEMINI AI GENERATOR API ----------------

app.post('/api/gemini/generate', async (req, res) => {
  const { docCategory, docType, mapel, kelas, fase, topik, alokasiJp, modelPembelajaran, additionalNotes } = req.body;
  const db = loadDb();
  const config = db.config;

  const prompt = `
Anda adalah Pakar Kurikulum Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi Republik Indonesia serta Ahli Kurikulum Berbasis Cinta (KBC).
Tugas Anda adalah menghasilkan dokumen administrasi pembelajaran resmi yang LENGKAP, OTENTIK, BERKUALITAS TINGGI, dan SIAP CETAK.

DATA DOKUMEN:
- Kategori: ${docCategory}
- Jenis Dokumen: ${docType}
- Satuan Pendidikan: ${config.namaSekolah}
- Mata Pelajaran: ${mapel || 'Matematika'}
- Kelas / Fase: ${kelas || 'Kelas VII'} / ${fase || 'Fase D'}
- Materi / Topik / TP: ${topik || 'Materi Pokok Semester'}
- Alokasi Waktu: ${alokasiJp || '2 JP (2 x 40 Menit)'}
- Model Pembelajaran: ${modelPembelajaran || 'Problem-Based Learning / Deep Learning'}
- Catatan Tambahan: ${additionalNotes || '-'}

ATURAN STRUKTUR & TATA LETAK MUTLAK:
1. Kembalikan HANYA potongan HTML murni (tanpa Markdown tag seperti \`\`\`html atau \`\`\`).
2. JANGAN gunakan tag logo/gambar apapun pada Kop Surat! Kop surat menggunakan teks terpusat (Center Bold) dengan garis pembatas ganda hitam/navy.
3. Gunakan tabel HTML terstruktur dengan class "data-table" untuk semua data matriks, rubrik, dan tabel kalender.
4. PADA BAGIAN PALING BAWAH DOKUMEN, WAJIB MENYERTAKAN TABEL TANDA TANGAN 2 KOLOM SEJAJAR:
   <table class="signature-table" style="width: 100%; border: none !important; border-collapse: collapse; margin-top: 35px;">
     <tbody>
       <tr style="border: none !important;">
         <td style="width: 50%; vertical-align: top; text-align: left; padding: 0 20px; border: none !important;">
           <p style="margin: 0; font-size: 11pt;">Mengetahui,</p>
           <p style="margin: 0; font-size: 11pt; font-weight: bold;">Kepala Sekolah</p>
           <div style="height: 70px;"></div>
           <p style="margin: 0; font-size: 11pt; font-weight: bold; text-decoration: underline;">${config.namaKepalaSekolah}</p>
           <p style="margin: 0; font-size: 10pt;">NIP. ${config.nipKepalaSekolah}</p>
         </td>
         <td style="width: 50%; vertical-align: top; text-align: left; padding: 0 20px; border: none !important;">
           <p style="margin: 0; font-size: 11pt;">${config.tempatTanggalTtd}</p>
           <p style="margin: 0; font-size: 11pt; font-weight: bold;">Guru Mata Pelajaran</p>
           <div style="height: 70px;"></div>
           <p style="margin: 0; font-size: 11pt; font-weight: bold; text-decoration: underline;">[Nama Guru Pengampu]</p>
           <p style="margin: 0; font-size: 10pt;">NIP. -</p>
         </td>
       </tr>
     </tbody>
   </table>

SPESIFIKASI KHUSUS PER DOKUMEN:
- Jika ADM-CP: Muat Rasional, Tujuan Mapel, Karakteristik & Elemen CP, CP Fase, Penjabaran KKO Bloom, Pemetaan 8 Dimensi Profil Lulusan.
- Jika ADM-TP: Muat Panduan Kode TP, Tabel TP per Elemen (KKO C2-C5 + ABCD), Aspek Kompetensi, Alokasi JP, dan Rekap JP.
- Jika ADM-ATP: Format Landscape, Diagram visual alur TP, Tabel 8 Kolom (Kode, Elemen, TP, Materi Pokok, Level Bloom, 8 Dimensi, JP, Semester), Rekapitulasi.
- Jika ADM-PROTA: Tabel Minggu Efektif (Kalender - Tidak Efektif = Efektif x JP), Subtotal Sem 1 & 2, Tabel Rencana Prota per Semester + Baris Jam Cadangan.
- Jika ADM-PROSEM: Format Landscape, Matriks JP per Minggu kode warna (Biru: JP Belajar, Merah: Libur, Kuning: PTS, Hijau: PAS, Abu: Cadangan), Model Belajar, Legenda Warna.
- Jika ADM-KKTP: Format Landscape, Dasar Permendikbudristek No. 21/2022, 4 Level Capaian (Mulai Berkembang, Layak ✓ KKTP, Cakap, Mahir), Rubrik 9 Kolom.
- Jika Modul Ajar: Kurikulum Merdeka berbasis Deep Learning (Mindful, Meaningful, Joyful Learning), Kegiatan Pendahuluan, Inti berurutan, Penutup, Asesmen, Pengayaan/Remedial.
- Jika Asesmen Sumatif: Kisi-kisi, Bank Soal (Pilihan Ganda 5 opsi, Isian Singkat, Uraian HOTS), Kunci Jawaban, Pedoman Penskoran.
- Jika Dokumen KBC (1 s.d 10): Integrasikan Panca Cinta (Cinta Allah & Rasul, Cinta Diri & Sesama, Cinta Ilmu, Cinta Bangsa, Cinta Alam) & 10 Nilai PPRA (Ta'addub, Qudwah, Muwatanah, Tawassut, Tawazun, I'tidal, Musawah, Syura, Tasamuh, Tatawwur wa Ibtikar). Berikan tag jelas seperti (PC: Cinta Sesama | PPRA: Tasamuh).
`;

  try {
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      let rawHtml = response.text || '';
      // Strip markdown code fences if model returned them
      rawHtml = rawHtml.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

      if (rawHtml && rawHtml.includes('<table')) {
        return res.json({ success: true, html: rawHtml });
      }
    }
  } catch (error) {
    console.error('Gemini generation error, using fallback high-grade template:', error);
  }

  // High quality fallback generator if Gemini API key is unset or rate limited
  const fallbackHtml = generateFallbackDocumentHtml(docCategory, docType, mapel, kelas, fase, topik, alokasiJp, config);
  res.json({ success: true, html: fallbackHtml });
});

// Fallback HTML Builder for all 16 requested documents
function generateFallbackDocumentHtml(
  category: string,
  docType: string,
  mapel: string,
  kelas: string,
  fase: string,
  topik: string,
  alokasiJp: string,
  config: any
): string {
  const isKbc = category === 'KBC';
  const kopHtml = `
    <div style="text-align: center; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 3px double #0f172a; font-family: 'Times New Roman', Times, serif;">
      <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; line-height: 1.2;">
        ${config.namaPemerintah}
      </div>
      <div style="font-size: 15pt; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #0f172a; margin: 4px 0;">
        ${config.namaSekolah}
      </div>
      <div style="font-size: 10pt; font-style: italic; color: #334155;">
        ${config.alamatSekolah}
      </div>
    </div>
    <div style="text-align: center; margin-bottom: 20px; font-family: 'Times New Roman', Times, serif;">
      <div style="font-size: 14pt; font-weight: bold; text-transform: uppercase; text-decoration: underline; color: #0f172a;">
        ${docType}
      </div>
      <div style="font-size: 11pt; font-weight: 600; color: #1e293b; margin-top: 4px;">
        Mata Pelajaran: ${mapel || 'Pendidikan Pancasila'} | ${kelas || 'Kelas VII'} (${fase || 'Fase D'}) - Tahun Pelajaran ${config.tahunPelajaran}
      </div>
    </div>
  `;

  const sigHtml = `
    <table class="signature-table" style="width: 100%; border: none !important; border-collapse: collapse; margin-top: 35px; font-family: 'Times New Roman', Times, serif;">
      <tbody>
        <tr style="border: none !important;">
          <td style="width: 50%; vertical-align: top; text-align: left; padding: 0 20px; border: none !important;">
            <p style="margin: 0; font-size: 11pt;">Mengetahui,</p>
            <p style="margin: 0; font-size: 11pt; font-weight: bold;">Kepala Sekolah</p>
            <div style="height: 70px;"></div>
            <p style="margin: 0; font-size: 11pt; font-weight: bold; text-decoration: underline;">${config.namaKepalaSekolah}</p>
            <p style="margin: 0; font-size: 10pt; color: #334155;">NIP. ${config.nipKepalaSekolah}</p>
          </td>
          <td style="width: 50%; vertical-align: top; text-align: left; padding: 0 20px; border: none !important;">
            <p style="margin: 0; font-size: 11pt;">${config.tempatTanggalTtd}</p>
            <p style="margin: 0; font-size: 11pt; font-weight: bold;">Guru Mata Pelajaran ${mapel || ''}</p>
            <div style="height: 70px;"></div>
            <p style="margin: 0; font-size: 11pt; font-weight: bold; text-decoration: underline;">Guru Pengampu, S.Pd.</p>
            <p style="margin: 0; font-size: 10pt; color: #334155;">NIP. 19850312 201001 1 015</p>
          </td>
        </tr>
      </tbody>
    </table>
  `;

  // Specific high fidelity template based on document type
  let bodyContent = '';

  if (docType.includes('CP')) {
    bodyContent = `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5;">
        <h3>I. IDENTITAS MATA PELAJARAN</h3>
        <table style="width: 100%; margin-bottom: 15px; border: none;">
          <tr><td style="width: 25%; font-weight: bold;">Satuan Pendidikan</td><td>: ${config.namaSekolah}</td></tr>
          <tr><td style="font-weight: bold;">Mata Pelajaran</td><td>: ${mapel}</td></tr>
          <tr><td style="font-weight: bold;">Fase / Kelas</td><td>: ${fase} / ${kelas}</td></tr>
          <tr><td style="font-weight: bold;">Tahun Pelajaran</td><td>: ${config.tahunPelajaran}</td></tr>
        </table>

        <h3>II. RASIONAL MATA PELAJARAN</h3>
        <p>Mata pelajaran ${mapel} pada ${fase} dirancang untuk menumbuhkan nalar kritis, empati kemanusiaan, serta kemampuan pemecahan masalah kontekstual. Pembelajaran mengintegrasikan nilai-nilai luhur Profil Pelajar Pancasila${isKbc ? ' serta Kurikulum Berbasis Cinta (KBC) dengan sentuhan Panca Cinta dan Nilai PPRA' : ''}.</p>

        <h3>III. TUJUAN MATA PELAJARAN</h3>
        <ol>
          <li>Mengembangkan pemahaman konseptual yang kokoh mengenai ${topik || 'materi pokok'}.</li>
          <li>Mengasah keterampilan bernalar tingkat tinggi (HOTS) melalui penyelidikan mandiri dan kolaboratif.</li>
          <li>Menanamkan integritas moral, sikap saling menghargai, dan karakter pembelajar sepanjang hayat.</li>
        </ol>

        <h3>IV. KARAKTERISTIK & ELEMEN CAPAIAN PEMBELAJARAN</h3>
        <table class="data-table" style="width: 100%; border-collapse: collapse; margin: 12px 0;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #000; padding: 6px;">Elemen</th>
              <th style="border: 1px solid #000; padding: 6px;">Deskripsi Capaian Pembelajaran (CP)</th>
              <th style="border: 1px solid #000; padding: 6px;">Penjabaran KKO Bloom</th>
              <th style="border: 1px solid #000; padding: 6px;">8 Dimensi Profil Lulusan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; padding: 6px; font-weight: bold;">Pemahaman Konsep</td>
              <td style="border: 1px solid #000; padding: 6px;">Peserta didik mampu memahami, mengidentifikasi, dan menganalisis relasi konsep dalam ${topik || 'kehidupan sehari-hari'}.</td>
              <td style="border: 1px solid #000; padding: 6px;">Mengidentifikasi (C2), Menerapkan (C3), Menganalisis (C4)</td>
              <td style="border: 1px solid #000; padding: 6px;">Bernalar Kritis, Mandiri${isKbc ? ', Cinta Ilmu Pengetahuan' : ''}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; padding: 6px; font-weight: bold;">Keterampilan Proses</td>
              <td style="border: 1px solid #000; padding: 6px;">Peserta didik terampil melakukan pengamatan, merumuskan solusi alternatif, dan mengomunikasikan simpulan.</td>
              <td style="border: 1px solid #000; padding: 6px;">Mendemonstrasikan (P2), Memodifikasi (P3), Menyajikan (P4)</td>
              <td style="border: 1px solid #000; padding: 6px;">Kreatif, Gotong Royong${isKbc ? ', Cinta Sesama & Lingkungan' : ''}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (docType.includes('PROTA')) {
    bodyContent = `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5;">
        <h3>A. ANALISIS ALOKASI WAKTU MINGGU EFEKTIF</h3>
        <table class="data-table" style="width: 100%; border-collapse: collapse; margin: 12px 0;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #000; padding: 6px;">No</th>
              <th style="border: 1px solid #000; padding: 6px;">Bulan</th>
              <th style="border: 1px solid #000; padding: 6px;">Jumlah Minggu Kalender</th>
              <th style="border: 1px solid #000; padding: 6px;">Minggu Tidak Efektif</th>
              <th style="border: 1px solid #000; padding: 6px;">Minggu Efektif</th>
              <th style="border: 1px solid #000; padding: 6px;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="border: 1px solid #000; text-align: center;">1</td><td style="border: 1px solid #000;">Juli 2024</td><td style="border: 1px solid #000; text-align: center;">5</td><td style="border: 1px solid #000; text-align: center;">2</td><td style="border: 1px solid #000; text-align: center;">3</td><td style="border: 1px solid #000;">MPLS & Libur Semester</td></tr>
            <tr><td style="border: 1px solid #000; text-align: center;">2</td><td style="border: 1px solid #000;">Agustus 2024</td><td style="border: 1px solid #000; text-align: center;">4</td><td style="border: 1px solid #000; text-align: center;">0</td><td style="border: 1px solid #000; text-align: center;">4</td><td style="border: 1px solid #000;">HUT RI</td></tr>
            <tr><td style="border: 1px solid #000; text-align: center;">3</td><td style="border: 1px solid #000;">September 2024</td><td style="border: 1px solid #000; text-align: center;">4</td><td style="border: 1px solid #000; text-align: center;">1</td><td style="border: 1px solid #000; text-align: center;">3</td><td style="border: 1px solid #000;">Asesmen Tengah Semester</td></tr>
            <tr><td style="border: 1px solid #000; text-align: center;">4</td><td style="border: 1px solid #000;">Oktober 2024</td><td style="border: 1px solid #000; text-align: center;">5</td><td style="border: 1px solid #000; text-align: center;">0</td><td style="border: 1px solid #000; text-align: center;">5</td><td style="border: 1px solid #000;">Efektif Penuh</td></tr>
            <tr><td style="border: 1px solid #000; text-align: center;">5</td><td style="border: 1px solid #000;">November 2024</td><td style="border: 1px solid #000; text-align: center;">4</td><td style="border: 1px solid #000; text-align: center;">0</td><td style="border: 1px solid #000; text-align: center;">4</td><td style="border: 1px solid #000;">Efektif Penuh</td></tr>
            <tr><td style="border: 1px solid #000; text-align: center;">6</td><td style="border: 1px solid #000;">Desember 2024</td><td style="border: 1px solid #000; text-align: center;">4</td><td style="border: 1px solid #000; text-align: center;">2</td><td style="border: 1px solid #000; text-align: center;">2</td><td style="border: 1px solid #000;">SAS & Pembagian Raport</td></tr>
            <tr style="font-weight: bold; background-color: #f8fafc;">
              <td colspan="2" style="border: 1px solid #000; text-align: center;">SUBTOTAL SEMESTER GANJIL</td>
              <td style="border: 1px solid #000; text-align: center;">26</td>
              <td style="border: 1px solid #000; text-align: center;">5</td>
              <td style="border: 1px solid #000; text-align: center;">21</td>
              <td style="border: 1px solid #000;">Total JP = 21 x 3 JP = 63 JP</td>
            </tr>
          </tbody>
        </table>

        <h3>B. PROGRAM TAHUNAN DISTRIBUSI MATERI</h3>
        <table class="data-table" style="width: 100%; border-collapse: collapse; margin: 12px 0;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #000; padding: 6px;">Semester</th>
              <th style="border: 1px solid #000; padding: 6px;">Kode TP</th>
              <th style="border: 1px solid #000; padding: 6px;">Materi Pokok / Lingkup Materi</th>
              <th style="border: 1px solid #000; padding: 6px;">Alokasi Waktu (JP)</th>
              <th style="border: 1px solid #000; padding: 6px;">Keterangan / KBC</th>
            </tr>
          </thead>
          <tbody>
            <tr><td rowspan="4" style="border: 1px solid #000; text-align: center; font-weight: bold;">1 (Ganjil)</td><td style="border: 1px solid #000;">TP 7.1</td><td style="border: 1px solid #000;">Konsep Dasar dan Karakteristik ${topik || 'Materi'}</td><td style="border: 1px solid #000; text-align: center;">15 JP</td><td style="border: 1px solid #000;">Mindful Learning</td></tr>
            <tr><td style="border: 1px solid #000;">TP 7.2</td><td style="border: 1px solid #000;">Aplikasi dan Eksplorasi Kontekstual</td><td style="border: 1px solid #000; text-align: center;">18 JP</td><td style="border: 1px solid #000;">Meaningful Learning</td></tr>
            <tr><td style="border: 1px solid #000;">TP 7.3</td><td style="border: 1px solid #000;">Proyek Kolaboratif Pemecahan Masalah</td><td style="border: 1px solid #000; text-align: center;">24 JP</td><td style="border: 1px solid #000;">Joyful Learning</td></tr>
            <tr style="background-color: #fef08a;"><td style="border: 1px solid #000; font-weight: bold;">CADANGAN</td><td style="border: 1px solid #000; font-weight: bold;">ALOKASI JAM CADANGAN / REMEDIAL</td><td style="border: 1px solid #000; text-align: center; font-weight: bold;">6 JP</td><td style="border: 1px solid #000;">Penyesuaian Kegiatan</td></tr>
            <tr style="font-weight: bold; background-color: #e2e8f0;"><td colspan="3" style="border: 1px solid #000; text-align: center;">TOTAL ALOKASI JP SEMESTER GANJIL</td><td style="border: 1px solid #000; text-align: center;">63 JP</td><td style="border: 1px solid #000;">21 Minggu x 3 JP</td></tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (docType.includes('PROSEM')) {
    bodyContent = `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.4;">
        <p><strong>PETUNJUK DISTRIBUSI MATRIKS MINGGUAN (A4 LANDSCAPE):</strong></p>
        <div style="margin-bottom: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
          <span style="background: #3b82f6; color: white; padding: 2px 8px; font-weight: bold; border-radius: 3px;">Biru: JP Pembelajaran</span>
          <span style="background: #ef4444; color: white; padding: 2px 8px; font-weight: bold; border-radius: 3px;">Merah: Libur Semester/Nasional</span>
          <span style="background: #eab308; color: black; padding: 2px 8px; font-weight: bold; border-radius: 3px;">Kuning: Penilaian Tengah Semester</span>
          <span style="background: #22c55e; color: white; padding: 2px 8px; font-weight: bold; border-radius: 3px;">Hijau: Asesmen Akhir Semester</span>
          <span style="background: #94a3b8; color: white; padding: 2px 8px; font-weight: bold; border-radius: 3px;">Abu: Cadangan</span>
        </div>

        <table class="data-table" style="width: 100%; border-collapse: collapse; font-size: 9pt;">
          <thead>
            <tr style="background: #e2e8f0; text-align: center;">
              <th rowspan="2" style="border: 1px solid #000;">Kode TP</th>
              <th rowspan="2" style="border: 1px solid #000;">Materi Pokok</th>
              <th rowspan="2" style="border: 1px solid #000;">JP</th>
              <th colspan="4" style="border: 1px solid #000;">Juli</th>
              <th colspan="4" style="border: 1px solid #000;">Agustus</th>
              <th colspan="4" style="border: 1px solid #000;">September</th>
              <th colspan="4" style="border: 1px solid #000;">Oktober</th>
              <th colspan="4" style="border: 1px solid #000;">November</th>
              <th colspan="4" style="border: 1px solid #000;">Desember</th>
              <th rowspan="2" style="border: 1px solid #000;">Model Pembelajaran</th>
            </tr>
            <tr style="background: #f1f5f9; text-align: center; font-size: 8pt;">
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
              <th>1</th><th>2</th><th>3</th><th>4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; font-weight: bold;">TP 7.1</td>
              <td style="border: 1px solid #000;">Pondasi & Karakteristik ${topik || 'Materi'}</td>
              <td style="border: 1px solid #000; text-align: center;">15</td>
              <td style="background: #ef4444; text-align: center; color: white;">L</td>
              <td style="background: #ef4444; text-align: center; color: white;">M</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
              <td style="border: 1px solid #000;">Discovery Learning / Mindful</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; font-weight: bold;">TP 7.2</td>
              <td style="border: 1px solid #000;">Eksplorasi Konsep & Analisis Masalah</td>
              <td style="border: 1px solid #000; text-align: center;">18</td>
              <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #eab308; text-align: center; font-weight: bold;">PTS</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
              <td style="border: 1px solid #000;">Problem-Based Learning / Meaningful</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; font-weight: bold;">TP 7.3</td>
              <td style="border: 1px solid #000;">Penerapan Kreatif & Refleksi Solutif</td>
              <td style="border: 1px solid #000; text-align: center;">24</td>
              <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
              <td></td><td></td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #3b82f6; text-align: center; color: white;">3</td>
              <td style="background: #22c55e; text-align: center; color: white; font-weight: bold;">SAS</td>
              <td style="background: #94a3b8; text-align: center; color: white;">Rem</td>
              <td style="background: #ef4444; text-align: center; color: white;">Rap</td>
              <td style="border: 1px solid #000;">Project-Based Learning / Joyful</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (docType.includes('KKTP')) {
    bodyContent = `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5;">
        <p><strong>DASAR HUKUM:</strong> Permendikbudristek No. 21 Tahun 2022 tentang Standar Penilaian pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah.</p>
        <p><strong>DESKRIPSI 4 TINGKAT PENCAPAIAN:</strong></p>
        <ul>
          <li><strong>Mulai Berkembang (0 - 65%):</strong> Peserta didik belum mencapai kriteria ketuntasan minimal dan membutuhkan bimbingan intensif personal.</li>
          <li><strong>Layak [✓ KKTP Tuntas] (66 - 79%):</strong> Peserta didik telah mencapai kriteria ketuntasan minimal dan siap melanjutkan ke materi berikutnya.</li>
          <li><strong>Cakap (80 - 89%):</strong> Peserta didik mencapai ketuntasan dengan pemahaman mandiri yang baik tanpa banyak asistensi guru.</li>
          <li><strong>Mahir (90 - 100%):</strong> Peserta didik melampaui capaian dengan kemampuan bernalar kritis, inovatif, dan menjadi tutor sebaya.</li>
        </ul>

        <h3>RUBRIK KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)</h3>
        <table class="data-table" style="width: 100%; border-collapse: collapse; margin: 12px 0;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #000; padding: 6px;">Kode TP</th>
              <th style="border: 1px solid #000; padding: 6px;">Tujuan Pembelajaran (TP)</th>
              <th style="border: 1px solid #000; padding: 6px;">Indikator Ketercapaian TP (IKTP)</th>
              <th style="border: 1px solid #000; padding: 6px; background-color: #fee2e2;">Mulai Berkembang</th>
              <th style="border: 1px solid #000; padding: 6px; background-color: #dbeafe;">Layak (✓ KKTP)</th>
              <th style="border: 1px solid #000; padding: 6px; background-color: #dcfce7;">Cakap</th>
              <th style="border: 1px solid #000; padding: 6px; background-color: #fef08a;">Mahir</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; font-weight: bold;">TP 7.1</td>
              <td style="border: 1px solid #000;">Menganalisis karakteristik dan keterkaitan ${topik || 'konsep'}</td>
              <td style="border: 1px solid #000;">1. Mengidentifikasi komponen esensial<br/>2. Membandingkan fenomena serupa</td>
              <td style="border: 1px solid #000;">Mampu menyebutkan sebagian kecil komponen dengan bantuan penuh guru.</td>
              <td style="border: 1px solid #000; font-weight: bold;">Mampu mengidentifikasi komponen pokok secara mandiri dan benar.</td>
              <td style="border: 1px solid #000;">Mampu menganalisis perbandingan serta memberi contoh nyata dengan tepat.</td>
              <td style="border: 1px solid #000;">Mampu mensintesis konsep baru dan menjelaskan penalaran logis secara sistematis.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  } else if (docType.includes('Modul Ajar') || docType.includes('MODUL')) {
    bodyContent = `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5;">
        <h3>A. IDENTITAS UMUM</h3>
        <table style="width: 100%; margin-bottom: 12px; border: none;">
          <tr><td style="width: 30%; font-weight: bold;">Penyusun / Guru</td><td>: Guru Pengampu, S.Pd.</td></tr>
          <tr><td style="font-weight: bold;">Satuan Pendidikan</td><td>: ${config.namaSekolah}</td></tr>
          <tr><td style="font-weight: bold;">Mata Pelajaran</td><td>: ${mapel}</td></tr>
          <tr><td style="font-weight: bold;">Fase / Kelas / Semester</td><td>: ${fase} / ${kelas} / ${config.semesterAktif}</td></tr>
          <tr><td style="font-weight: bold;">Alokasi Waktu</td><td>: ${alokasiJp || '2 x 40 Menit (1 Pertemuan)'}</td></tr>
          <tr><td style="font-weight: bold;">Model Pembelajaran</td><td>: Deep Learning (${isKbc ? 'Mindful, Meaningful, Joyful Learning terintegrasi KBC' : 'Mindful, Meaningful, Joyful Learning'})</td></tr>
        </table>

        ${isKbc ? `
          <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 12px; border-radius: 6px; margin-bottom: 14px;">
            <p style="margin: 0; font-weight: bold; color: #1e40af;">INTEGRASI KURIKULUM BERBASIS CINTA (KBC) & NILAI PPRA:</p>
            <p style="margin: 4px 0 0 0; font-size: 10pt; color: #1e3a8a;">
              <strong>Panca Cinta:</strong> Cinta Allah & Rasul, Cinta Diri & Sesama, Cinta Ilmu Pengetahuan.<br/>
              <strong>Nilai PPRA:</strong> Ta'addub (Berkeadaban), Qudwah (Keteladanan), Tasamuh (Toleransi & Kasih Sayang).
            </p>
          </div>
        ` : ''}

        <h3>B. KOMPONEN INTI</h3>
        <p><strong>1. Tujuan Pembelajaran (TP):</strong> Peserta didik mampu menganalisis dan menerapkan konsep ${topik || 'materi pokok'} dalam penyelesaian masalah nyata dengan penuh tanggung jawab${isKbc ? ' dan rasa kasih sayang (Cinta Sesama)' : ''}.</p>
        <p><strong>2. Pemahaman Bermakna:</strong> Pemahaman terhadap ${topik || 'materi ini'} memungkinkan manusia mengambil keputusan yang bijaksana, adil, dan bermanfaat bagi lingkungan.</p>
        <p><strong>3. Pertanyaan Pemantik:</strong> "Pernahkah kalian memikirkan bagaimana keputusan kecil yang kita ambil dengan rasa cinta dapat mengubah masa depan komunitas kita?"</p>

        <h3>C. KEGIATAN PEMBELAJARAN (DEEP LEARNING)</h3>
        <table class="data-table" style="width: 100%; border-collapse: collapse; margin: 12px 0;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #000; padding: 6px; width: 20%;">Tahapan</th>
              <th style="border: 1px solid #000; padding: 6px;">Aktivitas Pembelajaran (Sintak & Refleksi)</th>
              <th style="border: 1px solid #000; padding: 6px; width: 15%;">Waktu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; font-weight: bold;">I. Pendahuluan (Mindful Learning)</td>
              <td style="border: 1px solid #000;">
                1. Guru menyapa dengan salam hangat, doa bersama, dan presensi ramah ${isKbc ? '<em>(PC: Cinta Allah | PPRA: Ta\'addub)</em>' : ''}.<br/>
                2. Latihan kesadaran penuh (STOP - Stop, Take a breath, Observe, Proceed) untuk menenangkan pikiran.<br/>
                3. Apersepsi menghubungkan pengalaman harian dengan materi baru serta menyampaikan tujuan belajar.
              </td>
              <td style="border: 1px solid #000; text-align: center;">10 Menit</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; font-weight: bold;">II. Kegiatan Inti (Meaningful & Joyful Learning)</td>
              <td style="border: 1px solid #000;">
                1. <strong>Orientasi Masalah:</strong> Peserta didik mencermati stimulus kontekstual berupa studi kasus otentik.<br/>
                2. <strong>Organisasi Belajar:</strong> Membentuk kelompok heterogen dengan pembagian peran suportif ${isKbc ? '<em>(PC: Cinta Sesama | PPRA: Tasamuh)</em>' : ''}.<br/>
                3. <strong>Penyelidikan Bermakna:</strong> Mengumpulkan data, mendiskusikan alternatif solusi di LKPD dengan bimbingan scaffold guru.<br/>
                4. <strong>Karya & Presentasi:</strong> Menyajikan hasil penalaran kelompok dengan antusias, saling memberikan umpan balik apresiatif (Joyful Learning).
              </td>
              <td style="border: 1px solid #000; text-align: center;">60 Menit</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; font-weight: bold;">III. Penutup (Refleksi Personal)</td>
              <td style="border: 1px solid #000;">
                1. Guru dan siswa merangkum poin esensial materi.<br/>
                2. Siswa menuliskan 1 kalimat refleksi pada secarik kertas tentang hal paling bermakna yang dipelajari hari ini.<br/>
                3. Doa syukur dan penutup pembelajaran.
              </td>
              <td style="border: 1px solid #000; text-align: center;">10 Menit</td>
            </tr>
          </tbody>
        </table>

        <h3>D. ASESMEN PEMBELAJARAN</h3>
        <p>1. <strong>Asesmen Formatif (Awal):</strong> Pertanyaan lisan diagnostik kesiapan belajar peserta didik.</p>
        <p>2. <strong>Asesmen Formatif (Proses):</strong> Lembar observasi keaktifan diskusi dan ketepatan penyelesaian LKPD.</p>
        <p>3. <strong>Asesmen Sumatif (Akhir):</strong> Tes tertulis pilihan ganda dan uraian penalaran analitis.</p>
      </div>
    `;
  } else if (docType.includes('LKPD')) {
    bodyContent = `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5;">
        <div style="border: 2px solid #0f172a; padding: 12px; border-radius: 6px; margin-bottom: 15px;">
          <p style="margin: 0; font-weight: bold;">IDENTITAS KELOMPOK / PESERTA DIDIK:</p>
          <p style="margin: 4px 0 0 0;">Nama Kelompok / Anggota: .........................................................................................................</p>
          <p style="margin: 4px 0 0 0;">Kelas / No. Absen: ........................................................... | Tanggal: ...............................................</p>
        </div>

        <p><strong>PETUNJUK BELAJAR BERBASIS CINTA & EMPATI:</strong></p>
        <p><em>"Kerjakanlah lembar aktivitas ini dengan hati yang riang dan saling mendengarkan rekan kelompokmu. Setiap ide adalah berharga, dan kolaborasi yang dilandasi cinta akan melahirkan pemahaman yang mendalam."</em></p>

        <h3>TAHAP 1: EKSPLORASI STIMULUS (🔍 AMATI DENGAN HATI)</h3>
        <p>Perhatikan studi kasus kontekstual terkait <strong>${topik || 'fenomena materi pokok'}</strong> di bawah ini, lalu diskusikan pertanyaan penuntun bersama rekanmu.</p>
        <div style="border: 1px dashed #475569; padding: 10px; background: #f8fafc; margin-bottom: 12px;">
          <p style="margin: 0;"><em>"Dalam kehidupan sehari-hari, bagaimana kita dapat memanfaatkan pengetahuan mengenai ${topik || 'materi ini'} untuk membantu menyelesaikan permasalahan nyata teman atau lingkungan sekitar kita?"</em></p>
        </div>

        <h3>TAHAP 2: LEMBAR PENGERJAAN & SOLUSI (✍️ RUANG JAWABAN)</h3>
        <p>Tuliskan langkah-langkah penalaran dan kesimpulan kelompokmu pada garis-garis berikut:</p>
        <div style="margin: 15px 0;">
          <div style="border-bottom: 1px solid #94a3b8; height: 28px;"></div>
          <div style="border-bottom: 1px solid #94a3b8; height: 28px;"></div>
          <div style="border-bottom: 1px solid #94a3b8; height: 28px;"></div>
          <div style="border-bottom: 1px solid #94a3b8; height: 28px;"></div>
          <div style="border-bottom: 1px solid #94a3b8; height: 28px;"></div>
        </div>

        <h3>TAHAP 3: REFLEKSI PERSONAL KBC (❤️ DARI HATI KE HATI)</h3>
        <p>Apa satu kebaikan atau hikmah yang kamu rasakan setelah belajar bersama hari ini?</p>
        <div style="border: 1px solid #cbd5e1; padding: 12px; background: #fafafa; border-radius: 4px; min-height: 50px;">
          <em>Tuliskan kesan tulusmu di sini...</em>
        </div>
      </div>
    `;
  } else if (docType.includes('Asesmen') || docType.includes('ASESMEN') || docType.includes('Rubrik')) {
    bodyContent = `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5;">
        <h3>I. KISI-KISI ASESMEN SUMATIF</h3>
        <table class="data-table" style="width: 100%; border-collapse: collapse; margin: 12px 0;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #000; padding: 6px;">No</th>
              <th style="border: 1px solid #000; padding: 6px;">Tujuan Pembelajaran (TP)</th>
              <th style="border: 1px solid #000; padding: 6px;">Indikator Soal</th>
              <th style="border: 1px solid #000; padding: 6px;">Bentuk Soal</th>
              <th style="border: 1px solid #000; padding: 6px;">Level Kognitif</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; text-align: center;">1</td>
              <td style="border: 1px solid #000;">Menjelaskan konsep esensial ${topik || 'materi'}</td>
              <td style="border: 1px solid #000;">Disajikan ilustrasi, peserta didik mampu mengidentifikasi solusi yang tepat.</td>
              <td style="border: 1px solid #000; text-align: center;">Pilihan Ganda</td>
              <td style="border: 1px solid #000; text-align: center;">C3 (Penerapan)</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; text-align: center;">2</td>
              <td style="border: 1px solid #000;">Menganalisis hubungan sebab-akibat kontekstual</td>
              <td style="border: 1px solid #000;">Disajikan data masalah nyata, peserta didik mampu merumuskan alternatif solusi berkeadilan.</td>
              <td style="border: 1px solid #000; text-align: center;">Uraian HOTS</td>
              <td style="border: 1px solid #000; text-align: center;">C4 (Analisis)</td>
            </tr>
          </tbody>
        </table>

        <h3>II. BANK INSTRUMEN SOAL SUMATIF</h3>
        <p><strong>Bagian A: Pilihan Ganda (Pilihlah salah satu jawaban yang paling tepat)</strong></p>
        <p>1. Dalam penerapan ${topik || 'konsep pembelajaran'}, langkah pertama yang paling bijaksana ketika menghadapi perbedaan pandangan dalam kelompok adalah...<br/>
           A. Memaksakan pendapat pribadi agar tugas cepat selesai<br/>
           B. Melakukan musyawarah dengan saling menghargai dan mencari titik temu yang adil [Kunci: B]<br/>
           C. Mengabaikan pendapat anggota lain yang berbeda suku atau agama<br/>
           D. Menyerahkan seluruh pekerjaan kepada ketua kelompok<br/>
           E. Membatalkan tugas bersama
        </p>

        <p><strong>Bagian B: Uraian HOTS (Bernalar Kritis)</strong></p>
        <p>1. Jelaskan secara sistematis bagaimana penguasaan konsep <em>${topik || 'materi pokok'}</em> dapat membantu masyarakat mewujudkan keharmonisan sosial dan pelestarian lingkungan!</p>

        <h3>III. PEDOMAN PENSKORAN & RUBRIK EVALUASI</h3>
        <table class="data-table" style="width: 100%; border-collapse: collapse; margin: 12px 0;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #000; padding: 6px;">Kriteria / Indikator</th>
              <th style="border: 1px solid #000; padding: 6px;">Skor 4 (Mahir / Qudwah)</th>
              <th style="border: 1px solid #000; padding: 6px;">Skor 3 (Cakap)</th>
              <th style="border: 1px solid #000; padding: 6px;">Skor 2 (Layak)</th>
              <th style="border: 1px solid #000; padding: 6px;">Skor 1 (Berkembang)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; font-weight: bold;">Kedalaman Penalaran Konseptual</td>
              <td style="border: 1px solid #000;">Analisis sangat komprehensif, menghubungkan konsep teori dengan aplikasi nyata secara akurat.</td>
              <td style="border: 1px solid #000;">Analisis jelas dan logis dengan sebagian besar argumen didukung fakta relevan.</td>
              <td style="border: 1px solid #000;">Menjawab secara tepat namun uraian masih bersifat umum.</td>
              <td style="border: 1px solid #000;">Penjelasan kurang relevan atau belum menyentuh inti permasalahan.</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  } else {
    // Default complete document fallback
    bodyContent = `
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5;">
        <h3>I. DESKRIPSI DAN ALUR TUJUAN PEMBELAJARAN (ATP)</h3>
        <p>Dokumen administrasi ini disusun secara terpadu mengacu pada Capaian Pembelajaran Kurikulum Merdeka${isKbc ? ' dan Terintegrasi Kurikulum Berbasis Cinta (KBC) serta 10 Nilai Profil Pelajar Rahmatan Lil Alamin (PPRA)' : ''}.</p>
        <table class="data-table" style="width: 100%; border-collapse: collapse; margin: 12px 0;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="border: 1px solid #000; padding: 6px;">Kode</th>
              <th style="border: 1px solid #000; padding: 6px;">Elemen</th>
              <th style="border: 1px solid #000; padding: 6px;">Tujuan Pembelajaran</th>
              <th style="border: 1px solid #000; padding: 6px;">Materi Pokok</th>
              <th style="border: 1px solid #000; padding: 6px;">Bloom</th>
              <th style="border: 1px solid #000; padding: 6px;">8 Dimensi / KBC</th>
              <th style="border: 1px solid #000; padding: 6px;">JP</th>
              <th style="border: 1px solid #000; padding: 6px;">Sem</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #000; font-weight: bold;">TP 7.1</td>
              <td style="border: 1px solid #000;">Pemahaman Konsep</td>
              <td style="border: 1px solid #000;">Memahami dan menganalisis relasi ${topik || 'konsep dasar'}</td>
              <td style="border: 1px solid #000;">Pengenalan Esensial</td>
              <td style="border: 1px solid #000; text-align: center;">C3</td>
              <td style="border: 1px solid #000;">Bernalar Kritis${isKbc ? ' & Cinta Ilmu' : ''}</td>
              <td style="border: 1px solid #000; text-align: center;">18</td>
              <td style="border: 1px solid #000; text-align: center;">1</td>
            </tr>
            <tr>
              <td style="border: 1px solid #000; font-weight: bold;">TP 7.2</td>
              <td style="border: 1px solid #000;">Keterampilan Proses</td>
              <td style="border: 1px solid #000;">Menyelesaikan masalah kontekstual secara kolaboratif</td>
              <td style="border: 1px solid #000;">Penerapan Nyata</td>
              <td style="border: 1px solid #000; text-align: center;">C4</td>
              <td style="border: 1px solid #000;">Gotong Royong${isKbc ? ' & Cinta Sesama' : ''}</td>
              <td style="border: 1px solid #000; text-align: center;">24</td>
              <td style="border: 1px solid #000; text-align: center;">1</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  return `${kopHtml}${bodyContent}${sigHtml}`;
}

// ---------------- VITE MIDDLEWARE / PRODUCTION STATIC ----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
