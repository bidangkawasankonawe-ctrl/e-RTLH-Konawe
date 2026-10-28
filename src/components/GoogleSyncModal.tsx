import React, { useState } from 'react';
import { GoogleSheetsConfig, RTLHEntry } from '../types/rtlh';
import { 
  extractGoogleSheetInfo, 
  fetchGoogleSheetData, 
  parseCsvString, 
  autoDetectColumns, 
  transformRowsToRTLH,
  KNOWN_COLUMN_MAPPINGS
} from '../utils/googleSheetsSync';
import { 
  X, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Upload, 
  HelpCircle, 
  ExternalLink,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';

interface GoogleSyncModalProps {
  config: GoogleSheetsConfig;
  onSaveConfig: (newConfig: GoogleSheetsConfig, importedData?: RTLHEntry[]) => void;
  onResetToDemo: () => void;
  onClose: () => void;
}

export const GoogleSyncModal: React.FC<GoogleSyncModalProps> = ({
  config,
  onSaveConfig,
  onResetToDemo,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'mapping' | 'upload'>('url');
  
  const [sheetUrl, setSheetUrl] = useState(config.sheetUrl || '');
  const [formUrl, setFormUrl] = useState(config.formUrl || '');
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>(config.columnMapping || {});
  
  // Inspection & Parsing State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [csvText, setCsvText] = useState('');

  // Handle Testing & Fetching from Google Sheets URL
  const handleFetchSheet = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!sheetUrl.trim()) {
      setErrorMsg('Mohon masukkan URL Google Spreadsheet Anda terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchGoogleSheetData(sheetUrl);
      setDetectedHeaders(result.headers);
      setParsedRows(result.rows);

      // Auto-detect mappings
      const autoMap = autoDetectColumns(result.headers);
      setColumnMapping(autoMap);

      setSuccessMsg(`Berhasil terhubung! Ditemukan ${result.totalRows} baris data dan ${result.headers.length} kolom spreadsheet.`);
      setActiveTab('mapping');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Direct CSV Text / File Upload
  const handleParseCsvText = () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!csvText.trim()) {
      setErrorMsg('Mohon masukkan teks atau unggah file CSV terlebih dahulu.');
      return;
    }

    try {
      const result = parseCsvString(csvText);
      setDetectedHeaders(result.headers);
      setParsedRows(result.rows);

      const autoMap = autoDetectColumns(result.headers);
      setColumnMapping(autoMap);

      setSuccessMsg(`Berhasil memproses CSV! Ditemukan ${result.totalRows} baris data.`);
      setActiveTab('mapping');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text);
    };
    reader.readAsText(file);
  };

  // Final Apply & Import
  const handleApplyImport = () => {
    if (parsedRows.length === 0) {
      // Just saving configuration
      onSaveConfig({
        ...config,
        sheetUrl,
        formUrl,
        columnMapping,
        lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      });
      onClose();
      return;
    }

    const transformed = transformRowsToRTLH(parsedRows, columnMapping);
    const { sheetId } = extractGoogleSheetInfo(sheetUrl);

    onSaveConfig(
      {
        sheetUrl,
        sheetId,
        formUrl,
        columnMapping,
        lastSyncedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        autoSync: true,
      },
      transformed
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#081E3D] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-amber-300 border border-blue-400/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Hubungkan Google Spreadsheet &amp; Google Form
              </h3>
              <p className="text-xs text-blue-200/80">
                Sinkronisasi otomatis basis data survei RTLH yang telah terisi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside Modal */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 text-xs font-semibold gap-4">
          <button
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'url'
                ? 'border-blue-700 text-blue-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>1. Link Spreadsheet &amp; Form</span>
          </button>

          <button
            onClick={() => setActiveTab('mapping')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'mapping'
                ? 'border-blue-700 text-blue-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>2. Pemetaan Kolom ({detectedHeaders.length > 0 ? `${detectedHeaders.length} Kolom` : 'Otomatis'})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'upload'
                ? 'border-blue-700 text-blue-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>3. Upload CSV / Tempel Manual</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Status Alert Banner */}
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold">Gagal Menghubungkan Spreadsheet:</div>
                <div>{errorMsg}</div>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* TAB 1: URL Inputs */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              
              {/* Google Sheets URL */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                  <span>URL Google Spreadsheet Anda:</span>
                  <span className="text-[11px] font-normal text-emerald-600">Terisi dari respon Google Form</span>
                </label>
                <input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5.../edit"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Masukkan link Google Sheet tempat jawaban survei tersimpan.
                </p>
              </div>

              {/* Google Form URL */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                  <span>URL Google Form Survei (Opsional):</span>
                  <span className="text-[11px] font-normal text-slate-500">Untuk tombol survei langsung</span>
                </label>
                <input
                  type="text"
                  placeholder="https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Memungkinkan tim lapangan membuka dan mengisi kuesioner Google Form langsung dari website.
                </p>
              </div>

              {/* Step by step guide */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-600" />
                  <span>Petunjuk Akses Spreadsheet:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 text-[11px] leading-relaxed">
                  <li>Buka file Google Spreadsheet Anda.</li>
                  <li>Klik tombol biru <strong>Bagikan (Share)</strong> di pojok kanan atas.</li>
                  <li>Pada bagian <em>Akses umum</em>, ubah dari "Dibatasi" menjadi <strong>"Siapa saja yang memiliki link"</strong> (Viewer / Pelihat).</li>
                  <li>Klik <strong>Salin Link</strong> lalu tempelkan pada kolom di atas.</li>
                  <li>(Atau alternatif): Buka menu <em>File → Bagikan → Publikasikan ke web → Pilih format CSV</em>.</li>
                </ol>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFetchSheet}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Menghubungkan ke Google Sheets...' : 'Uji & Tarik Data Spreadsheet Sekarang'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Column Mapping */}
          {activeTab === 'mapping' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    Pemetaan Kolom Spreadsheet ke Sistem RTLH
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Sistem mendeteksi kolom secara otomatis. Anda dapat menyesuaikannya bila ada judul kolom khusus.
                  </p>
                </div>
                {detectedHeaders.length > 0 && (
                  <button
                    onClick={() => {
                      const detected = autoDetectColumns(detectedHeaders);
                      setColumnMapping(detected);
                    }}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
                  >
                    Deteksi Ulang Otomatis
                  </button>
                )}
              </div>

              {detectedHeaders.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-2">
                  <Database className="w-8 h-8 mx-auto text-slate-400" />
                  <p>Belum ada data spreadsheet yang terbaca.</p>
                  <button
                    onClick={() => setActiveTab('url')}
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    ← Kembali dan masukkan link Google Sheets Anda
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {KNOWN_COLUMN_MAPPINGS.map((field) => (
                    <div
                      key={field.key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs gap-2"
                    >
                      <div className="sm:w-1/3">
                        <span className="font-bold text-slate-800">{field.label}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">ID: {field.key}</span>
                      </div>

                      <div className="sm:w-2/3">
                        <select
                          value={columnMapping[field.key] || ''}
                          onChange={(e) => {
                            setColumnMapping({
                              ...columnMapping,
                              [field.key]: e.target.value,
                            });
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        >
                          <option value="">-- Tidak Dipetakan / Lewati --</option>
                          {detectedHeaders.map((header) => (
                            <option key={header} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {parsedRows.length > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                  <span>Siap mengimpor <strong>{parsedRows.length}</strong> data survei.</span>
                  <button
                    onClick={handleApplyImport}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition"
                  >
                    Terapkan & Muat ke Dashboard
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CSV Upload / Paste */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Upload File CSV (Export dari Google Sheets):
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:border-emerald-500 transition bg-slate-50">
                  <Upload className="w-7 h-7 mx-auto text-slate-400 mb-2" />
                  <div className="text-xs text-slate-600 mb-1">
                    Pilih file <strong>.csv</strong> dari komputer Anda
                  </div>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Atau Tempelkan Teks CSV Langsung:
                </label>
                <textarea
                  rows={4}
                  placeholder={`Timestamp,Nama Lengkap,NIK,Kecamatan,Desa,Kondisi Atap,Kondisi Dinding,Kondisi Lantai\n2026-03-01,Warga Satu,7402010001,Unaaha,Tuoy,Seng bocor,Gedek bambu,Tanah`}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={handleParseCsvText}
                className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <span>Proses CSV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              if (confirm('Kembalikan data ke contoh simulasi default Kabupaten Konawe?')) {
                onResetToDemo();
                onClose();
              }
            }}
            className="text-slate-500 hover:text-red-600 transition underline"
          >
            Reset ke Data Demo Konawe
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleApplyImport}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-sm cursor-pointer"
            >
              Simpan &amp; Sinkronkan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
