import React, { useState, useEffect, useCallback } from 'react';
import { RTLHEntry, GoogleSheetsConfig } from './types/rtlh';
import { SAMPLE_KONAWE_RTLH } from './data/sampleKonaweData';
import { fetchGoogleSheetData, transformRowsToRTLH, exportRTLHToCsv } from './utils/googleSheetsSync';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DataTableView } from './components/DataTableView';
import { MapView } from './components/MapView';
import { VerificationModal } from './components/VerificationModal';
import { DetailModal } from './components/DetailModal';
import { GoogleSyncModal } from './components/GoogleSyncModal';
import { NewEntryModal } from './components/NewEntryModal';
import { GoogleFormEmbedModal } from './components/GoogleFormEmbedModal';
import { PortalHomeView } from './components/PortalHomeView';
import { CheckCircle2, AlertCircle, FileSpreadsheet, RefreshCw } from 'lucide-react';

const STORAGE_KEY_DATA = 'sim_rtlh_konawe_data_v3';
const STORAGE_KEY_CONFIG = 'sim_rtlh_konawe_config_v3';

export default function App() {
  // Load initial config from localStorage
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

  // Load initial dataset
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
  const [activeTab, setActiveTab] = useState<'portal' | 'dashboard' | 'table' | 'map'>('portal');

  // Modals state
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedEntryForDetail, setSelectedEntryForDetail] = useState<RTLHEntry | null>(null);
  const [selectedEntryForVerification, setSelectedEntryForVerification] = useState<RTLHEntry | null>(null);

  // Sync state & Toast notification
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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
    showToast('Data dikembalikan ke data simulasi default Kabupaten Konawe.', 'success');
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
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      
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

      {/* Main Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenNewEntryModal={() => setIsNewEntryModalOpen(true)}
        onOpenFormModal={() => setIsFormModalOpen(true)}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        totalRecords={rtlhData.length}
        isDemoData={isDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'portal' && (
          <PortalHomeView
            data={rtlhData}
            onSelectEntry={(entry) => setSelectedEntryForDetail(entry)}
            onOpenFormModal={() => setIsFormModalOpen(true)}
            onNavigateToTable={() => setActiveTab('table')}
            onNavigateToMap={() => setActiveTab('map')}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            data={rtlhData}
            onSelectEntry={(entry) => setSelectedEntryForDetail(entry)}
            onOpenVerification={(entry) => setSelectedEntryForVerification(entry)}
            onNavigateToTable={() => setActiveTab('table')}
            onNavigateToMap={() => setActiveTab('map')}
            onExportCsv={handleExportCsv}
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
          />
        )}

        {activeTab === 'map' && (
          <MapView
            data={rtlhData}
            onSelectEntry={(entry) => setSelectedEntryForDetail(entry)}
            onOpenVerification={(entry) => setSelectedEntryForVerification(entry)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>E-RTLH Kabupaten Konawe</strong> &copy; {new Date().getFullYear()} Bidang Kawasan Permukiman, Dinas Perumahan dan Kawasan Permukiman.
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-3">
            <span>Standar KemenPKP (BSPS)</span>
            <span>•</span>
            <span>Terintegrasi Google Form & Spreadsheet</span>
          </div>
        </div>
      </footer>

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
        />
      )}

      {selectedEntryForVerification && (
        <VerificationModal
          entry={selectedEntryForVerification}
          onClose={() => setSelectedEntryForVerification(null)}
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

    </div>
  );
}
