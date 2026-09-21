import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
  User,
  SchoolConfig,
  SchoolClass,
  Student,
  AttendanceRecord,
  TeachingJournal,
  StudentGrade,
  WaliGuidance,
  AttitudeRecord,
  SavedDocument,
  ActiveTab
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { DashboardView } from './components/DashboardView';
import { ConfigView } from './components/ConfigView';
import { UserManagementView } from './components/UserManagementView';
import { ClassManagementView } from './components/ClassManagementView';
import { StudentManagementView } from './components/StudentManagementView';
import { AttendanceView } from './components/AttendanceView';
import { JournalView } from './components/JournalView';
import { GradeView } from './components/GradeView';
import { WaliBimbinganView } from './components/WaliBimbinganView';
import { WaliRecapView } from './components/WaliRecapView';
import { MerdekaGeneratorView } from './components/MerdekaGeneratorView';
import { ModulAjarView } from './components/ModulAjarView';
import { KbcGeneratorView } from './components/KbcGeneratorView';
import { SavedDocsView } from './components/SavedDocsView';
import { DatabaseResetView } from './components/DatabaseResetView';
import { DocumentModal } from './components/DocumentModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sikur_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Core Data States
  const [config, setConfig] = useState<SchoolConfig>({
    namaPemerintah: 'PEMERINTAH KABUPATEN GROBOGAN / DINAS PENDIDIKAN',
    namaSekolah: 'SMP NEGERI 1 PURWODADI',
    alamatSekolah: 'Jl. R. Suprapto No. 110, Grobogan, Jawa Tengah',
    tempatTanggalTtd: 'Purwodadi, 15 Juli 2025',
    namaKepalaSekolah: 'Budi Santoso, M.Pd.',
    nipKepalaSekolah: '19750512 200003 1 004',
    tahunPelajaran: '2025/2026',
    semesterAktif: 'Ganjil'
  });
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [journals, setJournals] = useState<TeachingJournal[]>([]);
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [guidance, setGuidance] = useState<WaliGuidance[]>([]);
  const [attitudes, setAttitudes] = useState<AttitudeRecord[]>([]);
  const [documents, setDocuments] = useState<SavedDocument[]>([]);

  // Document Modal Preview State
  const [docModalData, setDocModalData] = useState<{
    title: string;
    category: 'MERDEKA' | 'MODUL_AJAR' | 'ASESMEN' | 'KBC';
    docType: string;
    mapel: string;
    kelas: string;
    fase: string;
    htmlContent: string;
    isLandscape?: boolean;
  } | null>(null);

  // Fetch all data from API
  const fetchAllData = async () => {
    try {
      const [
        resConfig,
        resUsers,
        resClasses,
        resStudents,
        resAtt,
        resJournals,
        resGrades,
        resGuidance,
        resAttitudes,
        resDocs
      ] = await Promise.all([
        fetch('/api/config').then((r) => r.json()),
        fetch('/api/users').then((r) => r.json()),
        fetch('/api/classes').then((r) => r.json()),
        fetch('/api/students').then((r) => r.json()),
        fetch('/api/attendance').then((r) => r.json()),
        fetch('/api/journals').then((r) => r.json()),
        fetch('/api/grades').then((r) => r.json()),
        fetch('/api/guidance').then((r) => r.json()),
        fetch('/api/attitudes').then((r) => r.json()),
        fetch('/api/documents').then((r) => r.json())
      ]);

      if (resConfig) setConfig(resConfig);
      if (Array.isArray(resUsers)) setUsers(resUsers);
      if (Array.isArray(resClasses)) setClasses(resClasses);
      if (Array.isArray(resStudents)) setStudents(resStudents);
      if (Array.isArray(resAtt)) setAttendance(resAtt);
      if (Array.isArray(resJournals)) setJournals(resJournals);
      if (Array.isArray(resGrades)) setGrades(resGrades);
      if (Array.isArray(resGuidance)) setGuidance(resGuidance);
      if (Array.isArray(resAttitudes)) setAttitudes(resAttitudes);
      if (Array.isArray(resDocs)) setDocuments(resDocs);
    } catch (error) {
      console.error('Failed to load initial application state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('sikur_user', JSON.stringify(user));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar Sistem?',
      text: 'Anda akan keluar dari sesi aplikasi manajemen.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      background: '#0f172a',
      color: '#f8fafc'
    }).then((res) => {
      if (res.isConfirmed) {
        setCurrentUser(null);
        localStorage.removeItem('sikur_user');
      }
    });
  };

  // If user is not authenticated, show LoginPage
  if (!currentUser) {
    return <LoginPage config={config} onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        config={config}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsMobileOpen((prev) => !prev)}
        onOpenConfig={() => setActiveTab('config')}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab: ActiveTab) => {
            setActiveTab(tab);
            setIsMobileOpen(false);
          }}
          role={currentUser.role}
          isOpenMobile={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              config={config}
              classes={classes}
              students={students}
              attendance={attendance}
              journals={journals}
              savedDocs={documents}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'config' && (
            <ConfigView config={config} onUpdateConfig={setConfig} />
          )}

          {activeTab === 'users' && (
            <UserManagementView
              users={users}
              classes={classes}
              onRefreshUsers={fetchAllData}
            />
          )}

          {activeTab === 'classes' && (
            <ClassManagementView
              classes={classes}
              users={users}
              onRefreshClasses={fetchAllData}
            />
          )}

          {activeTab === 'students' && (
            <StudentManagementView
              students={students}
              classes={classes}
              onRefreshStudents={fetchAllData}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              attendance={attendance}
              students={students}
              classes={classes}
              currentUser={currentUser}
              onRefreshAttendance={fetchAllData}
            />
          )}

          {activeTab === 'journals' && (
            <JournalView
              journals={journals}
              classes={classes}
              currentUser={currentUser}
              onRefreshJournals={fetchAllData}
            />
          )}

          {activeTab === 'grades' && (
            <GradeView
              students={students}
              classes={classes}
              grades={grades}
              config={config}
              onRefreshGrades={fetchAllData}
            />
          )}

          {activeTab === 'wali_guidance' && (
            <WaliBimbinganView
              guidance={guidance}
              attitudes={attitudes}
              students={students}
              classes={classes}
              currentUser={currentUser}
              onRefresh={fetchAllData}
            />
          )}

          {activeTab === 'wali_recap' && (
            <WaliRecapView
              students={students}
              classes={classes}
              attendance={attendance}
              grades={grades}
              config={config}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'merdeka_ai' && (
            <MerdekaGeneratorView
              classes={classes}
              currentUser={currentUser}
              config={config}
              onOpenDocModal={(modalData) => setDocModalData(modalData)}
            />
          )}

          {activeTab === 'modul_ajar_ai' && (
            <ModulAjarView
              classes={classes}
              currentUser={currentUser}
              config={config}
              onOpenDocModal={(modalData) => setDocModalData(modalData)}
            />
          )}

          {activeTab === 'kbc_ai' && (
            <KbcGeneratorView
              classes={classes}
              currentUser={currentUser}
              config={config}
              onOpenDocModal={(modalData) => setDocModalData(modalData)}
            />
          )}

          {activeTab === 'saved_docs' && (
            <SavedDocsView
              documents={documents}
              onRefreshDocs={fetchAllData}
              onOpenDocModal={(modalData) => setDocModalData(modalData)}
            />
          )}

          {activeTab === 'database_reset' && (
            <DatabaseResetView onDatabaseResetSuccess={fetchAllData} />
          )}
        </main>
      </div>

      {/* Document Modal Preview */}
      {docModalData && (
        <DocumentModal
          isOpen={!!docModalData}
          onClose={() => setDocModalData(null)}
          title={docModalData.title}
          category={docModalData.category}
          docType={docModalData.docType}
          mapel={docModalData.mapel}
          kelas={docModalData.kelas}
          fase={docModalData.fase}
          htmlContent={docModalData.htmlContent}
          authorNama={currentUser.namaLengkap}
          isLandscape={docModalData.isLandscape}
          onSaved={fetchAllData}
        />
      )}
    </div>
  );
}
