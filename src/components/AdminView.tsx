import React from 'react';
import { GoogleSheetsConfig, RTLHEntry } from '../types/rtlh';
import { 
  Database, 
  RefreshCw, 
  FileSpreadsheet, 
  ExternalLink, 
  PlusCircle, 
  Download, 
  Upload, 
  ShieldAlert, 
  CheckCircle2, 
  Link as LinkIcon, 
  Settings,
  HelpCircle
} from 'lucide-react';

interface AdminViewProps {
  config: GoogleSheetsConfig;
  data: RTLHEntry[];
  onOpenSyncModal: () => void;
  onOpenFormModal: () => void;
  onOpenNewEntryModal: () => void;
  onTriggerSync: () => void;
  onResetToDemo: () => void;
  onExportCsv: () => void;
  isSyncing: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({
  config,
  data,
  onOpenSyncModal,
  onOpenFormModal,
  onOpenNewEntryModal,
  onTriggerSync,
  onResetToDemo,
  onExportCsv,
  isSyncing,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/60 shadow-2xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Pusat Pengelolaan &amp; Integrasi Data E-RTLH
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola sinkronisasi Google Spreadsheet, formulir Google Form, dan ekspor data BNBA Kab. Konawe.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewEntryModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Usulan</span>
          </button>
        </div>
      </div>

      {/* Grid of Admin Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: Google Spreadsheet Sync */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Google Spreadsheet</h3>
                  <span className="text-[11px] text-slate-400">Database BNBA Utama</span>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                config.sheetUrl 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {config.sheetUrl ? 'Terhubung' : 'Mode Demo Fiktif'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              {config.sheetUrl 
                ? `Terhubung ke Google Spreadsheet dengan ${data.length} baris data.` 
                : 'Saat ini website menggunakan 24 data simulasi fiktif Kabupaten Konawe. Anda dapat menautkan URL Google Spreadsheet untuk menampilkan data asli.'}
            </p>

            {config.lastSyncedAt && (
              <div className="text-[11px] text-slate-400 mt-2">
                Sinkronisasi terakhir: {config.lastSyncedAt}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-5 border-t border-slate-100 mt-5">
            <button
              onClick={onOpenSyncModal}
              className="flex-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-center"
            >
              Konfigurasi Link Sheet
            </button>
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Google Form Survey */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Google Form Survei</h3>
                  <span className="text-[11px] text-slate-400">Instrumen Input Lapangan</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                Formulir Online
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Masyarakat dan fasilitator desa dapat mengisi form usulan survei lengkap dengan unggah foto tampak 4 sisi melalui tautan Google Form resmi.
            </p>

            <div className="text-[11px] text-slate-400 mt-2 truncate">
              {config.formUrl || 'Link Google Form belum disetel'}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-5 border-t border-slate-100 mt-5">
            <button
              onClick={onOpenFormModal}
              className="flex-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-2xs cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka / Atur Google Form</span>
            </button>
          </div>
        </div>

        {/* Card 3: Ekspor & Unduh CSV */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Ekspor Rekapitulasi Data</h3>
                <span className="text-[11px] text-slate-400">Unduh Format CSV / Excel</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Unduh seluruh {data.length} data By Name By Address (BNBA) dalam format CSV lengkap dengan NIK, alamat, koordinat GIS, skor kerusakan, dan link 4 sudut foto.
            </p>
          </div>

          <div className="pt-5 border-t border-slate-100 mt-5">
            <button
              onClick={onExportCsv}
              className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh CSV Data BNBA ({data.length} Baris)</span>
            </button>
          </div>
        </div>

        {/* Card 4: Reset Data Simulasi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Reset ke Data Demo</h3>
                <span className="text-[11px] text-slate-400">Pemulihan Sampel Konawe</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Kembalikan database ke 24 data sampel resmi Kabupaten Konawe di 12 kecamatan untuk keperluan demonstrasi atau pengujian.
            </p>
          </div>

          <div className="pt-5 border-t border-slate-100 mt-5">
            <button
              onClick={onResetToDemo}
              className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Reset ke 24 Data Demo</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
