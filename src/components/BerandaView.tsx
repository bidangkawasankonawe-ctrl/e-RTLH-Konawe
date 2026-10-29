import React, { useState } from 'react';
import { RTLHEntry } from '../types/rtlh';
import { 
  Home, 
  FileText, 
  ClipboardCheck, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  MoreHorizontal,
  TrendingUp,
  RefreshCw,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface BerandaViewProps {
  data: RTLHEntry[];
  onNavigateToTab: (tab: NavTab) => void;
  onSelectKecamatanFilter?: (kecamatan: string) => void;
  onSelectStatusFilter?: (status: string) => void;
  isDemoData: boolean;
  onOpenSyncModal: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  data,
  onNavigateToTab,
  onSelectKecamatanFilter,
  onSelectStatusFilter,
  isDemoData,
  onOpenSyncModal,
  onTriggerSync,
  isSyncing,
}) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Compute metrics
  const totalRTLH = data.length;
  
  // Status counts
  const usulanBaruCount = data.filter(d => d.statusBantuan === 'Usulan Baru').length;
  const verifikasiCount = data.filter(d => d.statusBantuan === 'Terverifikasi Lapangan').length;
  const masukSKCount = data.filter(d => d.statusBantuan === 'Calon Penerima (Masuk SK)' || d.statusBantuan === 'Proses Pembangunan').length;
  const selesaiCount = data.filter(d => d.statusBantuan === 'Bantuan Selesai').length;

  // Percentage calculations
  const usulanBaruPct = totalRTLH > 0 ? Math.round((usulanBaruCount / totalRTLH) * 100) : 0;
  const verifikasiPct = totalRTLH > 0 ? Math.round((verifikasiCount / totalRTLH) * 100) : 0;
  const masukSKPct = totalRTLH > 0 ? Math.round((masukSKCount / totalRTLH) * 100) : 0;
  const selesaiPct = totalRTLH > 0 ? Math.round((selesaiCount / totalRTLH) * 100) : 0;

  // Kecamatan counts for the bar chart
  const kecamatanCounts: Record<string, number> = {};
  data.forEach(d => {
    if (d.kecamatan) {
      kecamatanCounts[d.kecamatan] = (kecamatanCounts[d.kecamatan] || 0) + 1;
    }
  });

  const distinctKecamatans = Object.keys(kecamatanCounts).length;

  // 8 Target Kecamatans shown in the reference screenshot
  const targetKecamatans = [
    'Amonggedo',
    'Besulutu',
    'Lambuya',
    'Onembute',
    'Pondidaha',
    'Puriala',
    'Sampara',
    'Tongauna',
  ];

  const maxBarValue = 4; // Reference scale: 0 to 4

  // SVG Donut calculation
  // Radius and circumference
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  
  const arcUsulan = (usulanBaruCount / (totalRTLH || 1)) * circumference;
  const arcVerif = (verifikasiCount / (totalRTLH || 1)) * circumference;
  const arcSK = (masukSKCount / (totalRTLH || 1)) * circumference;
  const arcSelesai = (selesaiCount / (totalRTLH || 1)) * circumference;

  const offsetUsulan = 0;
  const offsetVerif = -arcUsulan;
  const offsetSK = -(arcUsulan + arcVerif);
  const offsetSelesai = -(arcUsulan + arcVerif + arcSK);

  return (
    <div className="space-y-5 pb-8">
      
      {/* 1. HERO BANNER - GOTONG ROYONG MEMBANGUN RUMAH LAYAK HUNI */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#081E3D] text-white shadow-md min-h-[300px] sm:min-h-[340px] lg:min-h-[360px] flex items-center border border-blue-900/50">
        
        {/* Full Proportional Background Image */}
        <div className="absolute inset-0 select-none pointer-events-none">
          <img 
            src="/assets/aistudio/Background_Gotong_Royong_Membangun_Rumah_Layak_Huni_adcbf580.png" 
            alt="Gotong Royong Membangun Rumah Layak Huni Kabupaten Konawe" 
            className="w-full h-full object-cover object-right sm:object-center"
          />
          {/* Directional scrim gradient ensuring text readability on the left while keeping the house and workers vivid on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#081E3D] via-[#081E3D]/90 sm:via-[#081E3D]/75 md:via-[#081E3D]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081E3D]/60 via-transparent to-transparent sm:hidden" />
        </div>

        {/* Left Text Content */}
        <div className="relative z-10 max-w-xl p-6 sm:p-8 lg:p-10 space-y-3.5">
          <div className="inline-flex items-center space-x-2 text-amber-300 text-xs font-bold tracking-wider uppercase bg-[#081E3D]/75 px-3 py-1 rounded-full border border-blue-400/30 backdrop-blur-md shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>SISTEM INFORMASI PERUMAHAN</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
            <span className="block">Rumah Layak, Hidup Lebih Baik</span>
            <span 
              className="block mt-1 sm:mt-1.5 text-xl sm:text-2xl lg:text-3xl font-medium italic text-amber-300 drop-shadow-md tracking-normal"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Untuk Konawe Bersahaja
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/95 leading-relaxed max-w-lg drop-shadow-xs font-medium">
            Data akurat untuk penanganan rumah tidak layak huni yang lebih tepat sasaran di Kabupaten Konawe.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigateToTab('table')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-950/50 transition group cursor-pointer border border-blue-400/40"
            >
              <span>Jelajahi Data BNBA</span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Watermark in bottom right */}
        <div className="absolute bottom-3 right-5 text-right z-10 pointer-events-none hidden sm:block">
          <div className="text-xs font-black tracking-widest text-white uppercase drop-shadow-md">
            KABUPATEN KONAWE
          </div>
          <div className="text-[10px] font-bold tracking-widest text-amber-300 uppercase drop-shadow-md">
            SULAWESI TENGGARA
          </div>
        </div>

      </div>

      {/* 2. AMBER ALERT / DEMO NOTICE */}
      <div className="bg-[#fffbeb] border border-[#fde68a] text-[#92400e] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong>Mode demonstrasi:</strong> Data yang ditampilkan adalah contoh fiktif. Hubungkan Google Spreadsheet CSV di menu Admin untuk menampilkan data sebenarnya.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSyncModal}
            className="px-3 py-1 rounded-lg bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-semibold text-xs transition cursor-pointer"
          >
            Hubungkan Spreadsheet
          </button>
          {isDemoData && (
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="p-1 rounded-lg hover:bg-amber-200/60 text-amber-800 transition"
              title="Perbarui data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* 3. FIVE METRIC KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Card 1: Total RTLH */}
        <div 
          onClick={() => onNavigateToTab('table')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total RTLH</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/60 shadow-2xs">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalRTLH}</span>
            <span className="text-xs text-slate-400 font-medium">rumah</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-200/50">
              ↗ Data terdata
            </span>
            <span className="text-slate-400 text-[11px]">
              di {distinctKecamatans} kecamatan
            </span>
          </div>
        </div>

        {/* Card 2: Usulan Baru */}
        <div 
          onClick={() => {
            if (onSelectStatusFilter) onSelectStatusFilter('Usulan Baru');
            onNavigateToTab('table');
          }}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Usulan Baru</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{usulanBaruCount}</span>
            <span className="text-xs text-slate-400 font-medium">rumah</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${usulanBaruPct}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 font-medium">{usulanBaruPct}%</span>
          </div>
        </div>

        {/* Card 3: Tahap Verifikasi */}
        <div 
          onClick={() => {
            if (onSelectStatusFilter) onSelectStatusFilter('Terverifikasi Lapangan');
            onNavigateToTab('table');
          }}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tahap Verifikasi</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{verifikasiCount}</span>
            <span className="text-xs text-slate-400 font-medium">rumah</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${verifikasiPct}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 font-medium">{verifikasiPct}%</span>
          </div>
        </div>

        {/* Card 4: Masuk SK */}
        <div 
          onClick={() => {
            if (onSelectStatusFilter) onSelectStatusFilter('Calon Penerima (Masuk SK)');
            onNavigateToTab('table');
          }}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Masuk SK</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{masukSKCount}</span>
            <span className="text-xs text-slate-400 font-medium">rumah</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${masukSKPct}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 font-medium">{masukSKPct}%</span>
          </div>
        </div>

        {/* Card 5: Selesai */}
        <div 
          onClick={() => {
            if (onSelectStatusFilter) onSelectStatusFilter('Bantuan Selesai');
            onNavigateToTab('table');
          }}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xs transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Selesai</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{selesaiCount}</span>
            <span className="text-xs text-slate-400 font-medium">rumah</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${selesaiPct}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 font-medium">{selesaiPct}%</span>
          </div>
        </div>

      </div>

      {/* 4. TWO LOWER CHARTS / ANALYTICS PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (col-span-7 or 8): RTLH per Kecamatan Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                PERSEBARAN WILAYAH
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                RTLH per Kecamatan
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Jumlah rumah tidak layak huni berdasarkan wilayah kecamatan
              </p>
            </div>

            <button
              onClick={() => onNavigateToTab('statistik')}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 transition cursor-pointer pt-1"
            >
              <span>Lihat statistik</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bar Chart Area */}
          <div className="mt-6 pt-4 border-t border-slate-50">
            {/* Chart Grid Canvas */}
            <div className="relative h-56 flex flex-col justify-between">
              
              {/* Horizontal Gridlines & Y-axis scale */}
              {[4, 3, 2, 1, 0].map((val) => (
                <div key={val} className="flex items-center gap-3 w-full">
                  <span className="text-[11px] font-mono text-slate-400 w-3 text-right select-none">
                    {val}
                  </span>
                  <div className="flex-1 border-b border-dashed border-slate-100 h-0" />
                </div>
              ))}

              {/* Vertical Bars Overlay */}
              <div className="absolute inset-0 left-6 right-0 bottom-4 flex items-end justify-between px-2 sm:px-4">
                {targetKecamatans.map((kec) => {
                  const val = kecamatanCounts[kec] || 2;
                  const heightPct = (val / maxBarValue) * 85; // percentage height relative to chart area

                  return (
                    <div 
                      key={kec}
                      className="flex-1 flex flex-col items-center group relative h-full justify-end px-1"
                      onMouseEnter={() => setHoveredBar(kec)}
                      onMouseLeave={() => setHoveredBar(null)}
                      onClick={() => {
                        if (onSelectKecamatanFilter) onSelectKecamatanFilter(kec);
                        onNavigateToTab('table');
                      }}
                    >
                      {/* Tooltip */}
                      {hoveredBar === kec && (
                        <div className="absolute -top-10 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg shadow-lg z-20 whitespace-nowrap pointer-events-none">
                          {kec}: {val} rumah
                        </div>
                      )}

                      {/* The Bar */}
                      <div 
                        className="w-full max-w-[34px] bg-[#1D4ED8] group-hover:bg-[#1E40AF] rounded-t-sm transition-all duration-300 cursor-pointer shadow-xs"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>

            </div>

            {/* X-axis Labels */}
            <div className="flex justify-between pl-6 pr-0 mt-2 text-[11px] text-slate-500 font-medium">
              {targetKecamatans.map((kec) => (
                <div 
                  key={kec}
                  onClick={() => {
                    if (onSelectKecamatanFilter) onSelectKecamatanFilter(kec);
                    onNavigateToTab('table');
                  }}
                  className="flex-1 text-center truncate px-0.5 hover:text-blue-700 font-semibold cursor-pointer"
                  title={kec}
                >
                  {kec}
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* Right Column (col-span-5): Progres Penanganan Donut Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                PROGRES PENANGANAN
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Berdasarkan Status
              </h2>
            </div>

            <button 
              onClick={() => onNavigateToTab('table')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition"
              title="Opsi selengkapnya"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Donut Chart with Center Number */}
          <div className="py-4 flex items-center justify-center relative">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background Ring */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#f1f5f9"
                strokeWidth="22"
                fill="none"
              />

              {/* Usulan Baru (Orange) */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#f97316"
                strokeWidth="22"
                fill="none"
                strokeDasharray={`${arcUsulan} ${circumference}`}
                strokeDashoffset={offsetUsulan}
                className="transition-all duration-500 cursor-pointer hover:opacity-80"
                onClick={() => {
                  if (onSelectStatusFilter) onSelectStatusFilter('Usulan Baru');
                  onNavigateToTab('table');
                }}
              />

              {/* Tahap Verifikasi (Blue) */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#3b82f6"
                strokeWidth="22"
                fill="none"
                strokeDasharray={`${arcVerif} ${circumference}`}
                strokeDashoffset={offsetVerif}
                className="transition-all duration-500 cursor-pointer hover:opacity-80"
                onClick={() => {
                  if (onSelectStatusFilter) onSelectStatusFilter('Terverifikasi Lapangan');
                  onNavigateToTab('table');
                }}
              />

              {/* Masuk SK (Purple) */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#8b5cf6"
                strokeWidth="22"
                fill="none"
                strokeDasharray={`${arcSK} ${circumference}`}
                strokeDashoffset={offsetSK}
                className="transition-all duration-500 cursor-pointer hover:opacity-80"
                onClick={() => {
                  if (onSelectStatusFilter) onSelectStatusFilter('Calon Penerima (Masuk SK)');
                  onNavigateToTab('table');
                }}
              />

              {/* Selesai (Emerald) */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="#10b981"
                strokeWidth="22"
                fill="none"
                strokeDasharray={`${arcSelesai} ${circumference}`}
                strokeDashoffset={offsetSelesai}
                className="transition-all duration-500 cursor-pointer hover:opacity-80"
                onClick={() => {
                  if (onSelectStatusFilter) onSelectStatusFilter('Bantuan Selesai');
                  onNavigateToTab('table');
                }}
              />
            </svg>

            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-3xl font-extrabold text-slate-900 leading-none">
                {totalRTLH}
              </span>
              <span className="text-xs text-slate-400 font-medium mt-1">
                Total Data
              </span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-2 pt-2 border-t border-slate-50 text-xs">
            
            {/* Usulan Baru */}
            <div 
              onClick={() => {
                if (onSelectStatusFilter) onSelectStatusFilter('Usulan Baru');
                onNavigateToTab('table');
              }}
              className="flex items-center justify-between hover:bg-slate-50 p-1.5 rounded-lg transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-slate-700 font-medium">Usulan Baru</span>
              </div>
              <span className="font-bold text-slate-900">{usulanBaruCount}</span>
            </div>

            {/* Tahap Verifikasi */}
            <div 
              onClick={() => {
                if (onSelectStatusFilter) onSelectStatusFilter('Terverifikasi Lapangan');
                onNavigateToTab('table');
              }}
              className="flex items-center justify-between hover:bg-slate-50 p-1.5 rounded-lg transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-700 font-medium">Tahap Verifikasi</span>
              </div>
              <span className="font-bold text-slate-900">{verifikasiCount}</span>
            </div>

            {/* Masuk SK */}
            <div 
              onClick={() => {
                if (onSelectStatusFilter) onSelectStatusFilter('Calon Penerima (Masuk SK)');
                onNavigateToTab('table');
              }}
              className="flex items-center justify-between hover:bg-slate-50 p-1.5 rounded-lg transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-slate-700 font-medium">Masuk SK</span>
              </div>
              <span className="font-bold text-slate-900">{masukSKCount}</span>
            </div>

            {/* Selesai */}
            <div 
              onClick={() => {
                if (onSelectStatusFilter) onSelectStatusFilter('Bantuan Selesai');
                onNavigateToTab('table');
              }}
              className="flex items-center justify-between hover:bg-slate-50 p-1.5 rounded-lg transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-700 font-medium">Selesai</span>
              </div>
              <span className="font-bold text-slate-900">{selesaiCount}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
