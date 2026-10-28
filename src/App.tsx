import React, { useState, useEffect, useCallback } from 'react';
import { RTLHEntry, GoogleSheetsConfig } from './types/rtlh';
import { SAMPLE_KONAWE_RTLH } from './data/sampleKonaweData';
import { fetchGoogleSheetData, transformRowsToRTLH, exportRTLHToCsv } from './utils/googleSheetsSync';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { BerandaView } from './components/BerandaView';
import { DataTableView } from './components/DataTableView';
import { DashboardView } from './components/DashboardView';
import { MapView } from './components/MapView';
import { AdminView } from './components/AdminView';
import { VerificationModal } from './components/VerificationModal';
import { DetailModal } from './components/DetailModal';
import { GoogleSyncModal } from './components/GoogleSyncModal';
import { NewEntryModal } from './components/NewEntryModal';
import { GoogleFormEmbedModal } from './components/GoogleFormEmbedModal';
import { GuideModal } from './components/GuideModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { UserRole } from './utils/privacyMask';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY_DATA = 'sim_rtlh_konawe_data_v4';
const STORAGE_KEY_CONFIG = 'sim_rtlh_konawe_config_v4';
const STORAGE_KEY_ROLE = 'sim_rtlh_konawe_user_role_v1';

export default function App() {
  // User role state (Super Admin has full unmasked access; User Publik has masked NIK/KK)
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE);
      if (saved === 'User Publik' || saved === 'Super Admin') return saved;
    } catch {
      // ignore
    }
    return 'Super Admin';
  });

  const handleRoleChange = (role: UserRole) => {
    setCurrentUserRole(role);
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, role);
    } catch {
      // ignore
    }
    showToast(
      role === 'Super Admin' 
        ? 'Beralih ke mode Super Admin: NIK & No KK ditampilkan lengkap.' 
        : 'Beralih ke mode User Publik: NIK & No KK disamarkan sesuai UU PDP.', 
      'success'
    );
  };

  // Config state
  const [config, setConfig] = useState<GoogleSheetsConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading config:', e);
    }
    return {
      sheetUrl: '',
      sheetId: '',
      formUrl: '',
      autoSync: true,
      columnMapping: {},
    };
  });

  // Main dataset
  const [rtlhData, setRtlhData] = useState<RTLHEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
    return SAMPLE_KONAWE_RTLH;
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');

  // Filters passed to DataTableView when navigating from Beranda charts
  const [tableKecamatanFilter, setTableKecamatanFilter] = useState<string | undefined>(undefined);
  const [tableStatusFilter, setTableStatusFilter] = useState<string | undefined>(undefined);

  // Modals state
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedEntryForDetail, setSelectedEntryForDetail] = useState<RTLHEntry | null>(null);
  const [selectedEntryForVerification, setSelectedEntryForVerification] = useState<RTLHEntry | null>(null);

  // Sync state & Toast notification
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save data to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(rtlhData));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [rtlhData]);

  // Save config to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config', e);
    }
  }, [config]);

  // Trigger Google Sheets Sync
  const handleTriggerSync = useCallback(async () => {
    if (!config.sheetUrl) {
      setIsSyncModalOpen(true);
      return;
    }

    setIsSyncing(true);
    try {
      const result = await fetchGoogleSheetData(config.sheetUrl);
      const transformed = transformRowsToRTLH(result.rows, config.columnMapping);
      
      if (transformed.length === 0) {
        showToast('Spreadsheet terbaca namun tidak ada baris data yang valid.', 'error');
      } else {
        setRtlhData(transformed);
        const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setConfig(prev => ({ ...prev, lastSyncedAt: timeNow }));
        showToast(`Berhasil menyinkronkan ${transformed.length} data RTLH dari Google Spreadsheet!`, 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast(msg, 'error');
    } finally {
      setIsSyncing(false);
    }
  }, [config.sheetUrl, config.columnMapping]);

  // Update Config & optionally replace dataset
  const handleSaveConfig = (newConfig: GoogleSheetsConfig, importedData?: RTLHEntry[]) => {
    setConfig(newConfig);
    if (importedData && importedData.length > 0) {
      setRtlhData(importedData);
      showToast(`Berhasil memuat ${importedData.length} data survei dari Spreadsheet.`, 'success');
    } else {
      showToast('Pengaturan integrasi disimpan.', 'success');
    }
  };

  // Reset to Konawe Sample Data
  const handleResetToDemo = () => {
    setRtlhData(SAMPLE_KONAWE_RTLH);
    setConfig({
      sheetUrl: '',
      sheetId: '',
      formUrl: '',
      autoSync: false,
      columnMapping: {},
    });
    setTableKecamatanFilter(undefined);
    setTableStatusFilter(undefined);
    showToast('Data dikembalikan ke 24 data simulasi default Kabupaten Konawe.', 'success');
  };

  // Add new single entry
  const handleAddEntry = (entry: RTLHEntry) => {
    setRtlhData(prev => [entry, ...prev]);
    showToast(`Usulan atas nama ${entry.namaKK} berhasil ditambahkan!`, 'success');
  };

  // Update single entry
  const handleUpdateEntry = (updated: RTLHEntry) => {
    setRtlhData(prev => prev.map(item => item.id === updated.id ? updated : item));
    if (selectedEntryForDetail?.id === updated.id) {
      setSelectedEntryForDetail(updated);
    }
    showToast(`Status data ${updated.namaKK} berhasil diperbarui.`, 'success');
  };

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    setRtlhData(prev => prev.filter(item => item.id !== id));
    showToast('Data usulan berhasil dihapus.', 'success');
  };

  // Export CSV
  const handleExportCsv = () => {
    exportRTLHToCsv(rtlhData);
    showToast('File CSV BNBA Kabupaten Konawe berhasil diunduh.', 'success');
  };

  const isDemo = !config.sheetUrl;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-900 font-sans antialiased">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce no-print">
          <div className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold text-white ${
            toast.type === 'success' ? 'bg-emerald-600 border border-emerald-500' : 'bg-red-600 border border-red-500'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'table') {
            setTableKecamatanFilter(undefined);
            setTableStatusFilter(undefined);
          }
        }}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container Area on the right */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        
        {/* Top Navbar */}
        <TopNavbar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'table') {
              setTableKecamatanFilter(undefined);
              setTableStatusFilter(undefined);
            }
          }}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          onOpenNewEntryModal={() => setIsNewEntryModalOpen(true)}
          onOpenFormModal={() => setIsFormModalOpen(true)}
          onResetToDemo={handleResetToDemo}
          onTriggerSync={handleTriggerSync}
          isSyncing={isSyncing}
          isDemoData={isDemo}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          userRole={currentUserRole}
          onToggleUserRole={handleRoleChange}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activeTab === 'beranda' && (
            <BerandaView
              data={rtlhData}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onSelectKecamatanFilter={(kec) => {
                setTableKecamatanFilter(kec);
                setActiveTab('table');
              }}
              onSelectStatusFilter={(status) => {
                setTableStatusFilter(status);
                setActiveTab('table');
              }}
              isDemoData={isDemo}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
              onTriggerSync={handleTriggerSync}
              isSyncing={isSyncing}
            />
          )}

          {activeTab === 'table' && (
            <DataTableView
              data={rtlhData}
              onSelectEntry={(entry) => setSelectedEntryForDetail(entry)}
              onOpenVerification={(entry) => setSelectedEntryForVerification(entry)}
              onDeleteEntry={handleDeleteEntry}
              onOpenNewEntry={() => setIsNewEntryModalOpen(true)}
              onExportCsv={handleExportCsv}
              initialKecamatan={tableKecamatanFilter}
              initialStatus={tableStatusFilter}
              userRole={currentUserRole}
              onToggleUserRole={handleRoleChange}
            />
          )}

          {activeTab === 'statistik' && (
            <DashboardView
              data={rtlhData}
              onSelectEntry={(entry) => setSelectedEntryForDetail(entry)}
              onOpenVerification={(entry) => setSelectedEntryForVerification(entry)}
              onNavigateToTable={() => setActiveTab('table')}
              onNavigateToMap={() => setActiveTab('map')}
              onExportCsv={handleExportCsv}
            />
          )}

          {activeTab === 'map' && (
            <MapView
              data={rtlhData}
              onSelectEntry={(entry) => setSelectedEntryForDetail(entry)}
              onOpenVerification={(entry) => setSelectedEntryForVerification(entry)}
            />
          )}

          {activeTab === 'admin' && (
            <AdminView
              config={config}
              data={rtlhData}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
              onOpenFormModal={() => setIsFormModalOpen(true)}
              onOpenNewEntryModal={() => setIsNewEntryModalOpen(true)}
              onTriggerSync={handleTriggerSync}
              onResetToDemo={handleResetToDemo}
              onExportCsv={handleExportCsv}
              isSyncing={isSyncing}
            />
          )}
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-slate-200/80 py-3.5 px-6 sm:px-8 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 no-print bg-white/50">
          <div>
            <strong>SI-RTLH Kabupaten Konawe</strong> &copy; {new Date().getFullYear()} Dinas Perumahan dan Kawasan Permukiman.
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span>Standar BSPS KemenPKP</span>
            <span>•</span>
            <span>Integrasi Google Sheets & Form</span>
          </div>
        </footer>

      </div>

      {/* MODALS */}
      {selectedEntryForDetail && (
        <DetailModal
          entry={selectedEntryForDetail}
          onClose={() => setSelectedEntryForDetail(null)}
          onUpdateEntry={handleUpdateEntry}
          onOpenVerification={(entry) => {
            setSelectedEntryForDetail(null);
            setSelectedEntryForVerification(entry);
          }}
          isSuperAdmin={currentUserRole === 'Super Admin'}
        />
      )}

      {selectedEntryForVerification && (
        <VerificationModal
          entry={selectedEntryForVerification}
          onClose={() => setSelectedEntryForVerification(null)}
          isSuperAdmin={currentUserRole === 'Super Admin'}
        />
      )}

      {isSyncModalOpen && (
        <GoogleSyncModal
          config={config}
          onSaveConfig={handleSaveConfig}
          onResetToDemo={handleResetToDemo}
          onClose={() => setIsSyncModalOpen(false)}
        />
      )}

      {isNewEntryModalOpen && (
        <NewEntryModal
          onClose={() => setIsNewEntryModalOpen(false)}
          onAddEntry={handleAddEntry}
        />
      )}

      {isFormModalOpen && (
        <GoogleFormEmbedModal
          formUrl={config.formUrl}
          onUpdateFormUrl={(newUrl) => setConfig(prev => ({ ...prev, formUrl: newUrl }))}
          onTriggerSync={handleTriggerSync}
          onClose={() => setIsFormModalOpen(false)}
        />
      )}

      {isGuideModalOpen && (
        <GuideModal
          onClose={() => setIsGuideModalOpen(false)}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          onOpenFormModal={() => setIsFormModalOpen(true)}
        />
      )}

      {isSearchModalOpen && (
        <GlobalSearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          data={rtlhData}
          onSelectEntry={(entry) => setSelectedEntryForDetail(entry)}
          isSuperAdmin={currentUserRole === 'Super Admin'}
        />
      )}

    </div>
  );
}
