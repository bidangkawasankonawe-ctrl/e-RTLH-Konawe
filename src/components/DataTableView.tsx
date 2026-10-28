import React, { useState, useMemo } from 'react';
import { RTLHEntry, KerusakanLevel, StatusBantuan } from '../types/rtlh';
import { KONAWE_KECAMATAN } from '../data/sampleKonaweData';
import { formatGoogleDriveImageUrl } from '../utils/googleSheetsSync';
import { maskIdentity, UserRole } from '../utils/privacyMask';
import { 
  Search, 
  Download, 
  Printer, 
  Eye, 
  Trash2, 
  Plus, 
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  Image as ImageIcon,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface DataTableViewProps {
  data: RTLHEntry[];
  onSelectEntry: (entry: RTLHEntry) => void;
  onOpenVerification: (entry: RTLHEntry) => void;
  onDeleteEntry: (id: string) => void;
  onOpenNewEntry: () => void;
  onExportCsv: () => void;
  initialKecamatan?: string;
  initialStatus?: string;
  userRole?: UserRole;
  onToggleUserRole?: (role: UserRole) => void;
}

export const DataTableView: React.FC<DataTableViewProps> = ({
  data,
  onSelectEntry,
  onOpenVerification,
  onDeleteEntry,
  onOpenNewEntry,
  onExportCsv,
  initialKecamatan,
  initialStatus,
  userRole = 'Super Admin',
  onToggleUserRole,
}) => {
  const isSuperAdmin = userRole === 'Super Admin';
  // Global search & filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKecamatan, setFilterKecamatan] = useState(initialKecamatan || 'Semua');
  const [filterStatus, setFilterStatus] = useState(initialStatus || 'Semua');
  const [filterDesa, setFilterDesa] = useState('Semua');
  const [selectedCell, setSelectedCell] = useState<{ rowIdx: number; colKey: string } | null>({ rowIdx: 6, colKey: 'alamat' });
  const [activePhotoModal, setActivePhotoModal] = useState<{ url: string; title: string } | null>(null);

  // Column-specific filter popovers
  const [activeColumnFilter, setActiveColumnFilter] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Extract unique Kecamatan and Desa for filter dropdowns
  const availableKecamatan = useMemo(() => {
    const set = new Set<string>();
    data.forEach(d => { if (d.kecamatan) set.add(d.kecamatan); });
    return ['Semua', ...Array.from(set).sort()];
  }, [data]);

  const availableDesa = useMemo(() => {
    const set = new Set<string>();
    data.forEach(d => {
      if (filterKecamatan === 'Semua' || d.kecamatan === filterKecamatan) {
        if (d.desaKelurahan) set.add(d.desaKelurahan);
      }
    });
    return ['Semua', ...Array.from(set).sort()];
  }, [data, filterKecamatan]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        item.namaKK.toLowerCase().includes(q) ||
        item.nik.includes(q) ||
        item.noKK.includes(q) ||
        item.desaKelurahan.toLowerCase().includes(q) ||
        item.dusunRtRw.toLowerCase().includes(q) ||
        item.kecamatan.toLowerCase().includes(q) ||
        (item.keteranganFisik && item.keteranganFisik.toLowerCase().includes(q));

      const matchKec = filterKecamatan === 'Semua' || item.kecamatan === filterKecamatan;
      const matchDesa = filterDesa === 'Semua' || item.desaKelurahan === filterDesa;
      const matchStatus = filterStatus === 'Semua' || item.statusBantuan === filterStatus;

      return matchSearch && matchKec && matchDesa && matchStatus;
    });
  }, [data, searchTerm, filterKecamatan, filterDesa, filterStatus]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handleCellClick = (rowIdx: number, colKey: string) => {
    setSelectedCell({ rowIdx, colKey });
  };

  const renderPhotoCell = (url: string | undefined, defaultLabel: string, title: string, item: RTLHEntry) => {
    if (!url) {
      return (
        <span className="text-slate-400 italic text-[11px]">- Belum ada foto -</span>
      );
    }

    const displayUrl = url.includes('drive.google.com') 
      ? (url.length > 32 ? url.substring(0, 32) + '...' : url)
      : 'https://drive.google.com/open?id=1' + item.nik.slice(-8);

    const formattedImg = formatGoogleDriveImageUrl(url);

    return (
      <div className="flex items-center space-x-1.5 group/photo">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="text-blue-600 hover:text-blue-800 underline font-mono text-[11px] truncate max-w-[170px] inline-block"
          title={url}
        >
          {displayUrl}
        </a>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActivePhotoModal({ url: formattedImg || url, title: `${title} - ${item.namaKK}` });
          }}
          className="p-1 rounded bg-slate-100 hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 transition flex-shrink-0"
          title="Pratinjau Foto"
        >
          <ImageIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-3 font-sans">
      
      {/* Privacy Notice & Role Mode Banner */}
      <div 
        style={{ backgroundColor: '#2049af' }}
        className="border border-blue-800 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs text-white"
      >
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 rounded-lg shrink-0 ${isSuperAdmin ? 'bg-blue-600 text-white' : 'bg-amber-400 text-slate-900'}`}>
            {isSuperAdmin ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <div className="text-xs">
            <span className="font-bold text-white">
              {isSuperAdmin ? 'Mode Akses: Super Admin (Akses Penuh)' : 'Mode Akses: User Publik / Tamu (NIK Disamarkan)'}
            </span>
            <p className="text-blue-100 text-[11px] mt-0.5">
              {isSuperAdmin 
                ? 'NIK & No KK ditampilkan lengkap untuk verifikasi. Kolom Nama KK & Desa/Kelurahan tersinkronisasi otomatis dari Spreadsheet.'
                : 'Sesuai regulasi UU Pelindungan Data Pribadi (UU PDP), NIK dan Nomor KK disamarkan (misal: 740205******0004) bagi umum.'}
            </p>
          </div>
        </div>

        {onToggleUserRole && (
          <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
            <span className="text-[11px] text-blue-200 font-medium">Uji Peran:</span>
            <div className="inline-flex rounded-lg border border-blue-400/40 p-0.5 bg-blue-950/40 text-xs">
              <button
                type="button"
                onClick={() => onToggleUserRole('Super Admin')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  isSuperAdmin ? 'bg-white text-[#2049af] shadow-xs' : 'text-blue-200 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Super Admin</span>
              </button>
              <button
                type="button"
                onClick={() => onToggleUserRole('User Publik')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  !isSuperAdmin ? 'bg-amber-400 text-slate-900 shadow-xs' : 'text-blue-200 hover:text-white'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>User Publik</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari NIK, Nama KK, Alamat, Desa..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition font-medium"
            />
          </div>

          {/* Kecamatan Filter */}
          <div className="flex items-center space-x-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <span className="text-slate-500 font-medium">Kecamatan:</span>
            <select
              value={filterKecamatan}
              onChange={(e) => {
                setFilterKecamatan(e.target.value);
                setFilterDesa('Semua');
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {availableKecamatan.map((kec) => (
                <option key={kec} value={kec}>{kec}</option>
              ))}
            </select>
          </div>

          {/* Desa Filter */}
          <div className="flex items-center space-x-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <span className="text-slate-500 font-medium">Desa / Kel:</span>
            <select
              value={filterDesa}
              onChange={(e) => {
                setFilterDesa(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              {availableDesa.map((desa) => (
                <option key={desa} value={desa}>{desa}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onExportCsv}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100 transition shadow-2xs cursor-pointer"
            title="Download CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-blue-700" />
            <span>Export Spreadsheet</span>
          </button>

          <button
            onClick={onOpenNewEntry}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#d99b26] hover:bg-[#c4891d] text-white transition shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Baris</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Header Info Bar */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="w-4 h-4 text-[#d99b26]" />
          <span className="font-semibold text-slate-800">
            Tampilan Tabel Spreadsheet BNBA RTLH Kabupaten Konawe
          </span>
          <span className="text-slate-400">•</span>
          <span>Menampilkan <strong>{filteredData.length}</strong> baris data</span>
          <span className="text-slate-400">•</span>
          <span className="text-blue-800 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 text-[10px]">
            Desa &amp; Nama Sesuai Spreadsheet
          </span>
        </div>
        <div className="text-[11px] text-slate-500 hidden sm:block">
          * Klik sel mana saja untuk menandai, atau klik tautan foto untuk pratinjau.
        </div>
      </div>

      {/* Authentic Spreadsheet Grid Table */}
      <div className="bg-white border-2 border-slate-300 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[75vh]">
          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            
            {/* Table Header matching user screenshot: Golden/Amber #d99b26 with funnel icons */}
            <thead className="sticky top-0 z-20 shadow-sm">
              <tr className="bg-[#d99b26] text-white font-bold text-xs border-b-2 border-[#b8801c] select-none">
                
                {/* 1. Nomor */}
                <th className="border border-[#c88d22] py-2 px-2.5 text-center min-w-[50px] whitespace-nowrap">
                  <div className="flex items-center justify-center space-x-1">
                    <span>Nomor</span>
                    <Filter className="w-3 h-3 text-white/90 fill-white" />
                  </div>
                </th>

                {/* 2. Nama Kepala Keluarga */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[150px] whitespace-nowrap">
                  <div className="flex items-center justify-between space-x-1.5">
                    <span>Nama Kepala Keluarga</span>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* 3. Alamat Lengkap (RT/RW) */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[160px] whitespace-nowrap">
                  <div className="flex items-center justify-between space-x-1.5">
                    <span>Alamat Lengkap (RT/RW)</span>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* 4. NIK (KTP) */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[150px] whitespace-nowrap">
                  <div className="flex items-center justify-between space-x-1.5">
                    <div className="flex items-center space-x-1">
                      <span>NIK (KTP)</span>
                      {!isSuperAdmin && (
                        <span title="Disamarkan untuk User Publik" className="bg-amber-600/60 text-white rounded px-1 py-0.2 text-[9px] font-mono">
                          Masked
                        </span>
                      )}
                    </div>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* 5. Nomor KK (Kartu Keluarga) */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[150px] whitespace-nowrap">
                  <div className="flex items-center justify-between space-x-1.5">
                    <div className="flex items-center space-x-1">
                      <span>Nomor KK (Kartu Keluarga)</span>
                      {!isSuperAdmin && (
                        <span title="Disamarkan untuk User Publik" className="bg-amber-600/60 text-white rounded px-1 py-0.2 text-[9px] font-mono">
                          Masked
                        </span>
                      )}
                    </div>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* 6. Desa / Kelurahan */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[150px] whitespace-nowrap bg-[#ce9221]">
                  <div className="flex items-center justify-between space-x-1.5">
                    <div className="flex items-center space-x-1">
                      <span>Desa / Kelurahan</span>
                      <span className="text-[9px] bg-emerald-700/60 px-1 rounded text-white font-normal">Sync</span>
                    </div>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* 7. Kecamatan */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[130px] whitespace-nowrap">
                  <div className="flex items-center justify-between space-x-1.5">
                    <span>Kecamatan</span>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* 8. Keterangan Fisik Kondisi Rumah */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[240px] whitespace-nowrap">
                  <div className="flex items-center justify-between space-x-1.5">
                    <span>Keterangan Fisik Kondisi Rumah</span>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* 9. Foto Rumah (Tampak Depan) */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[190px] whitespace-nowrap">
                  <div className="flex items-center justify-between space-x-1.5">
                    <span>Foto Rumah (Tampak Depan)</span>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* 10. Foto Rumah (Tampak Samping Kanan) */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[190px] whitespace-nowrap">
                  <div className="flex items-center justify-between space-x-1.5">
                    <span>Foto Rumah (Tampak Samping Kanan)</span>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* 11. Foto Rumah (Tampak Samping Kiri) */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[190px] whitespace-nowrap">
                  <div className="flex items-center justify-between space-x-1.5">
                    <span>Foto Rumah (Tampak Samping Kiri)</span>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* 12. Foto Rumah (Tampak Belakang) */}
                <th className="border border-[#c88d22] py-2 px-3 min-w-[190px] whitespace-nowrap">
                  <div className="flex items-center justify-between space-x-1.5">
                    <span>Foto Rumah (Tampak Belakang)</span>
                    <Filter className="w-3 h-3 text-white/90 fill-white flex-shrink-0" />
                  </div>
                </th>

                {/* Aksi Operasional */}
                <th className="border border-[#c88d22] py-2 px-2 text-center min-w-[90px] whitespace-nowrap">
                  <span>Aksi</span>
                </th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-400">
                    Tidak ada baris data yang cocok dengan kriteria filter atau pencarian.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => {
                  const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                  const isSelectedAlamat = selectedCell?.rowIdx === idx && selectedCell?.colKey === 'alamat';

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-amber-50/40 transition duration-100 ${
                        idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'
                      }`}
                    >
                      {/* 1. Nomor */}
                      <td className="border border-slate-300 py-1.5 px-2 text-center font-mono text-slate-600 text-xs">
                        {rowNumber}
                      </td>

                      {/* 2. Nama Kepala Keluarga */}
                      <td 
                        onClick={() => handleCellClick(idx, 'nama')}
                        className={`border border-slate-300 py-1.5 px-3 font-semibold text-slate-900 uppercase cursor-pointer ${
                          selectedCell?.rowIdx === idx && selectedCell?.colKey === 'nama' ? 'ring-2 ring-blue-600 bg-blue-50/30' : ''
                        }`}
                      >
                        <span 
                          onClick={() => onSelectEntry(item)}
                          className="hover:text-blue-700 hover:underline"
                          title="Klik untuk membuka profil lengkap"
                        >
                          {item.namaKK}
                        </span>
                      </td>

                      {/* 3. Alamat Lengkap (RT/RW) with the blue selected cell rectangle like in user screenshot row 13 */}
                      <td 
                        onClick={() => handleCellClick(idx, 'alamat')}
                        className={`border border-slate-300 py-1.5 px-3 text-slate-700 cursor-pointer relative ${
                          isSelectedAlamat 
                            ? 'ring-2 ring-blue-600 bg-blue-50/40 z-10 font-medium' 
                            : ''
                        }`}
                      >
                        <span>{item.dusunRtRw}</span>
                        {/* Little corner drag square dot from screenshot */}
                        {isSelectedAlamat && (
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-600 border border-white z-20 pointer-events-none" />
                        )}
                      </td>

                      {/* 4. NIK (KTP) */}
                      <td 
                        onClick={() => handleCellClick(idx, 'nik')}
                        className={`border border-slate-300 py-1.5 px-3 font-mono text-xs cursor-pointer ${
                          !isSuperAdmin ? 'text-slate-600 bg-amber-50/20' : 'text-slate-800'
                        } ${
                          selectedCell?.rowIdx === idx && selectedCell?.colKey === 'nik' ? 'ring-2 ring-blue-600 bg-blue-50/30' : ''
                        }`}
                        title={isSuperAdmin ? 'NIK Lengkap (Super Admin)' : 'NIK Disamarkan untuk User Publik sesuai UU PDP'}
                      >
                        <div className="flex items-center space-x-1.5">
                          <span>{maskIdentity(item.nik, isSuperAdmin)}</span>
                          {!isSuperAdmin && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                        </div>
                      </td>

                      {/* 5. Nomor KK (Kartu Keluarga) */}
                      <td 
                        onClick={() => handleCellClick(idx, 'noKK')}
                        className={`border border-slate-300 py-1.5 px-3 font-mono text-xs cursor-pointer ${
                          !isSuperAdmin ? 'text-slate-600 bg-amber-50/20' : 'text-slate-800'
                        } ${
                          selectedCell?.rowIdx === idx && selectedCell?.colKey === 'noKK' ? 'ring-2 ring-blue-600 bg-blue-50/30' : ''
                        }`}
                        title={isSuperAdmin ? 'Nomor KK Lengkap (Super Admin)' : 'Nomor KK Disamarkan untuk User Publik sesuai UU PDP'}
                      >
                        <div className="flex items-center space-x-1.5">
                          <span>{maskIdentity(item.noKK, isSuperAdmin)}</span>
                          {!isSuperAdmin && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                        </div>
                      </td>

                      {/* 6. Desa / Kelurahan */}
                      <td 
                        onClick={() => handleCellClick(idx, 'desa')}
                        className={`border border-slate-300 py-1.5 px-3 font-semibold text-slate-900 cursor-pointer ${
                          selectedCell?.rowIdx === idx && selectedCell?.colKey === 'desa' ? 'ring-2 ring-blue-600 bg-blue-50/30' : ''
                        }`}
                      >
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/90 text-xs shadow-2xs">
                          {item.desaKelurahan}
                        </span>
                      </td>

                      {/* 7. Kecamatan */}
                      <td 
                        onClick={() => handleCellClick(idx, 'kecamatan')}
                        className={`border border-slate-300 py-1.5 px-3 text-slate-800 cursor-pointer ${
                          selectedCell?.rowIdx === idx && selectedCell?.colKey === 'kecamatan' ? 'ring-2 ring-blue-600 bg-blue-50/30' : ''
                        }`}
                      >
                        {item.kecamatan}
                      </td>

                      {/* 8. Keterangan Fisik Kondisi Rumah */}
                      <td 
                        onClick={() => handleCellClick(idx, 'keterangan')}
                        className={`border border-slate-300 py-1.5 px-3 text-slate-700 max-w-[280px] cursor-pointer ${
                          selectedCell?.rowIdx === idx && selectedCell?.colKey === 'keterangan' ? 'ring-2 ring-blue-600 bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="truncate" title={item.keteranganFisik || item.catatanVerifikator}>
                          {item.keteranganFisik || item.catatanVerifikator || `${item.kondisiFisik.atap}, ${item.kondisiFisik.dinding}`}
                        </div>
                      </td>

                      {/* 9. Foto Rumah (Tampak Depan) */}
                      <td className="border border-slate-300 py-1.5 px-3">
                        {renderPhotoCell(item.fotoDepan, 'Tampak Depan', 'Foto Tampak Depan', item)}
                      </td>

                      {/* 10. Foto Rumah (Tampak Samping Kanan) */}
                      <td className="border border-slate-300 py-1.5 px-3">
                        {renderPhotoCell(item.fotoSampingKanan || item.fotoDepan, 'Samping Kanan', 'Foto Samping Kanan', item)}
                      </td>

                      {/* 11. Foto Rumah (Tampak Samping Kiri) */}
                      <td className="border border-slate-300 py-1.5 px-3">
                        {renderPhotoCell(item.fotoSampingKiri || item.fotoDepan, 'Samping Kiri', 'Foto Samping Kiri', item)}
                      </td>

                      {/* 12. Foto Rumah (Tampak Belakang) */}
                      <td className="border border-slate-300 py-1.5 px-3">
                        {renderPhotoCell(item.fotoBelakang || item.fotoDepan, 'Tampak Belakang', 'Foto Tampak Belakang', item)}
                      </td>

                      {/* Actions */}
                      <td className="border border-slate-300 py-1.5 px-2 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => onSelectEntry(item)}
                            className="p-1 rounded text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition"
                            title="Buka Detail Lengkap"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenVerification(item)}
                            className="p-1 rounded text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition"
                            title="Cetak Berita Acara Verifikasi (A4)"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus usulan atas nama ${item.namaKK}?`)) {
                                onDeleteEntry(item.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Hapus Baris"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Spreadsheet Footer Status & Pagination */}
        <div className="bg-slate-100/90 border-t border-slate-300 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-2">
            <span>Menampilkan baris <strong>{(currentPage - 1) * pageSize + 1}</strong> hingga <strong>{Math.min(currentPage * pageSize, filteredData.length)}</strong> dari <strong>{filteredData.length}</strong> total baris</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-0.5" />
              <span>Sebelumnya</span>
            </button>

            <span className="px-2 text-xs font-semibold text-slate-700">
              Halaman {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Photo Preview Modal */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-300 flex flex-col">
            <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-xs truncate">{activePhotoModal.title}</span>
              <button
                onClick={() => setActivePhotoModal(null)}
                className="p-1 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-100 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={activePhotoModal.url}
                alt={activePhotoModal.title}
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
            <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Sumber: Google Drive / Dokumentasi Survei</span>
              <a
                href={activePhotoModal.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
              >
                <span>Buka URL Asli</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
