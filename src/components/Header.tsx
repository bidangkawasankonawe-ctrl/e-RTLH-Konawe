import React from 'react';
import { Home, RefreshCw, FileSpreadsheet, ExternalLink, PlusCircle, Settings, CheckCircle2, ShieldAlert } from 'lucide-react';
import { GoogleSheetsConfig } from '../types/rtlh';

interface HeaderProps {
  activeTab: 'portal' | 'dashboard' | 'table' | 'map';
  setActiveTab: (tab: 'portal' | 'dashboard' | 'table' | 'map') => void;
  config: GoogleSheetsConfig;
  onOpenSyncModal: () => void;
  onOpenNewEntryModal: () => void;
  onOpenFormModal: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  totalRecords: number;
  isDemoData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  config,
  onOpenSyncModal,
  onOpenNewEntryModal,
  onOpenFormModal,
  onTriggerSync,
  isSyncing,
  totalRecords,
  isDemoData,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xl sticky top-0 z-40 no-print">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Logo & Agency Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                  Kabupaten Konawe
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  Dinas Perumahan & Kawasan Permukiman
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                E-RTLH <span className="text-slate-400 font-normal text-sm hidden md:inline">| Sistem Informasi Verifikasi & Pemetaan RTLH</span>
              </h1>
            </div>
          </div>

          {/* Integration Status & Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sync Status Badge */}
            <div 
              onClick={onOpenSyncModal}
              role="button"
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 hover:border-slate-600 cursor-pointer text-xs transition"
              title="Klik untuk konfigurasi Google Spreadsheet & Google Form"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${config.sheetUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <div className="flex flex-col text-left">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  {config.sheetUrl ? 'Google Sheet Terhubung' : 'Demo Kab. Konawe'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {totalRecords} Data {config.lastSyncedAt ? `• Sync: ${config.lastSyncedAt}` : ''}
                </span>
              </div>
            </div>

            {/* Sync Button */}
            {config.sheetUrl && (
              <button
                onClick={onTriggerSync}
                disabled={isSyncing}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm disabled:opacity-50"
                title="Tarik pembaruan data terbaru dari Google Sheets"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan'}</span>
              </button>
            )}

            {/* Google Form Button */}
            <button
              onClick={onOpenFormModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/90 hover:bg-indigo-600 text-white transition shadow-sm"
              title="Buka atau isi Google Form survei RTLH"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Form</span>
            </button>

            {/* New Entry Button */}
            <button
              onClick={onOpenNewEntryModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition font-bold shadow-md shadow-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Input Survey Baru</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSyncModal}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Pengaturan Google Spreadsheet & Integrasi"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Demo Data Notice if user hasn't connected their own sheet yet */}
        {isDemoData && (
          <div className="mt-3 px-3 py-2 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 rounded-r-lg flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Mode Tinjauan Aktif:</strong> Menampilkan data simulasi Kabupaten Konawe (Unaaha, Wawotobi, Tongauna, dll). Sambungkan link Google Spreadsheet Anda untuk memuat data survei riil.
              </span>
            </div>
            <button
              onClick={onOpenSyncModal}
              className="ml-3 underline font-semibold hover:text-white whitespace-nowrap"
            >
              Hubungkan Spreadsheet Sekarang →
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('portal')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'portal'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🌐 Beranda Portal & Cek NIK</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>📊 Ringkasan & Statistik</span>
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'table'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>📋 Data Penerima (BNBA)</span>
            <span className="text-[11px] bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-300 font-mono">
              {totalRecords}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <span>🗺️ Peta Sebaran GIS Konawe</span>
          </button>
        </div>
      </div>
    </header>
  );
};
