import React from 'react';
import { RTLHEntry } from '../types/rtlh';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Home, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Wrench, 
  Droplets,
  Printer,
  Download,
  ArrowRight,
  Flame
} from 'lucide-react';

interface DashboardViewProps {
  data: RTLHEntry[];
  onSelectEntry: (entry: RTLHEntry) => void;
  onOpenVerification: (entry: RTLHEntry) => void;
  onNavigateToTable: () => void;
  onNavigateToMap: () => void;
  onExportCsv: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  onSelectEntry,
  onOpenVerification,
  onNavigateToTable,
  onNavigateToMap,
  onExportCsv,
}) => {
  // Compute Key Metrics
  const total = data.length;
  const rusakBerat = data.filter(d => d.tingkatKerusakan === 'Rusak Berat').length;
  const rusakSedang = data.filter(d => d.tingkatKerusakan === 'Rusak Sedang').length;
  const rusakRingan = data.filter(d => d.tingkatKerusakan === 'Rusak Ringan').length;
  const layakHuni = data.filter(d => d.tingkatKerusakan === 'Layak Huni').length;

  const masukSK = data.filter(d => d.statusBantuan === 'Calon Penerima (Masuk SK)').length;
  const prosesPembangunan = data.filter(d => d.statusBantuan === 'Proses Pembangunan').length;
  const selesaiDibantu = data.filter(d => d.statusBantuan === 'Bantuan Selesai').length;

  // Total Estimasi Jiwa Terdampak
  const totalPenghuni = data.reduce((acc, curr) => acc + (curr.kondisiFisik.jumlahPenghuni || 4), 0);

  // Critical Components Breakdown
  const atapBocor = data.filter(d => {
    const a = d.kondisiFisik.atap.toLowerCase();
    return a.includes('bocor') || a.includes('karat') || a.includes('rumbia') || a.includes('lapuk');
  }).length;

  const dindingLapuk = data.filter(d => {
    const w = d.kondisiFisik.dinding.toLowerCase();
    return w.includes('gedek') || w.includes('bambu') || w.includes('lapuk') || w.includes('tanpa plester');
  }).length;

  const lantaiTanah = data.filter(d => {
    const l = d.kondisiFisik.lantai.toLowerCase();
    return l.includes('tanah') || l.includes('patah') || l.includes('hancur');
  }).length;

  const sanitasiBuruk = data.filter(d => {
    const s = d.kondisiFisik.sanitasiJamban.toLowerCase();
    return s.includes('tidak ada') || s.includes('sungai') || s.includes('cemplung') || s.includes('kali');
  }).length;

  // Breakdown by District (Kecamatan)
  const kecamatanCounts: Record<string, number> = {};
  data.forEach(d => {
    const kec = d.kecamatan || 'Lainnya';
    kecamatanCounts[kec] = (kecamatanCounts[kec] || 0) + 1;
  });
  const sortedKecamatan = Object.entries(kecamatanCounts).sort((a, b) => b[1] - a[1]);

  // Breakdown by Funding Source
  const sumberDanaCounts: Record<string, number> = {};
  data.forEach(d => {
    const dana = d.sumberDana || 'Belum Ditentukan';
    sumberDanaCounts[dana] = (sumberDanaCounts[dana] || 0) + 1;
  });

  // Top Priority List (Highest score first, filter out already completed or rejected)
  const priorityQueue = [...data]
    .filter(d => d.statusBantuan !== 'Bantuan Selesai' && d.statusBantuan !== 'Ditolak / Tidak Memenuhi Syarat')
    .sort((a, b) => b.skorKerusakan - a.skorKerusakan)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-emerald-900/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-emerald-500/30">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dashboard Eksekutif Bidang Kawasan Permukiman</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Monitoring Pendataan & Penanganan RTLH Kab. Konawe
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Sistem agregasi data berbasis By Name By Address (BNBA) terintegrasi instrumen survei lapangan standar Kementerian PUPR.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportCsv}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unduh CSV Rekap</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Data */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Usulan</span>
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{total}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            ± {totalPenghuni} Jiwa Penerima
          </div>
        </div>

        {/* Rusak Berat */}
        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm hover:shadow transition relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-red-500" />
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-red-700">Rusak Berat (P1)</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600">{rusakBerat}</div>
          <div className="text-[11px] text-red-600/80 mt-1 font-medium">
            {total > 0 ? `${Math.round((rusakBerat / total) * 100)}% dari total usulan` : '0%'}
          </div>
        </div>

        {/* Rusak Sedang */}
        <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm hover:shadow transition relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-amber-700">Rusak Sedang</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{rusakSedang}</div>
          <div className="text-[11px] text-amber-600/80 mt-1 font-medium">
            {total > 0 ? `${Math.round((rusakSedang / total) * 100)}% dari total usulan` : '0%'}
          </div>
        </div>

        {/* Rusak Ringan */}
        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-blue-700">Rusak Ringan</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">{rusakRingan}</div>
          <div className="text-[11px] text-blue-600/80 mt-1">Stimulan Swadaya</div>
        </div>

        {/* Masuk SK Bupati */}
        <div className="bg-white rounded-xl p-4 border border-purple-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-purple-700">Masuk SK Calon</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">{masukSK}</div>
          <div className="text-[11px] text-purple-600/80 mt-1">Siap Intervensi</div>
        </div>

        {/* Bantuan Selesai */}
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-700">Realisasi Selesai</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{selesaiDibantu}</div>
          <div className="text-[11px] text-emerald-600/80 mt-1 font-medium">Sudah Layak Huni</div>
        </div>

      </div>

      {/* Middle Analytical Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sebaran Wilayah Kecamatan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Sebaran RTLH per Kecamatan
              </h3>
              <span className="text-xs text-slate-400">Total {sortedKecamatan.length} Kecamatan</span>
            </div>

            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {sortedKecamatan.map(([kec, count]) => {
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={kec} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{kec}</span>
                      <span className="text-slate-500 font-mono">{count} unit ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onNavigateToMap}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition"
          >
            <span>Lihat Pemetaan GIS Geospasial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Kerusakan Komponen Kritis (PUPR) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                Kondisi Komponen Bangunan (PUPR)
              </h3>
              <span className="text-xs text-slate-400">Indikator Kerusakan</span>
            </div>

            <div className="space-y-3.5">
              {/* Atap */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Atap Bocor / Lapuk / Rumbia</span>
                  <span className="font-mono font-semibold text-slate-800">{atapBocor} ({total > 0 ? Math.round((atapBocor/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${total > 0 ? (atapBocor/total)*100 : 0}%` }} />
                </div>
              </div>

              {/* Dinding */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Dinding Bambu / Papan Lapuk</span>
                  <span className="font-mono font-semibold text-slate-800">{dindingLapuk} ({total > 0 ? Math.round((dindingLapuk/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${total > 0 ? (dindingLapuk/total)*100 : 0}%` }} />
                </div>
              </div>

              {/* Lantai */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Lantai Tanah / Papan Rusak</span>
                  <span className="font-mono font-semibold text-slate-800">{lantaiTanah} ({total > 0 ? Math.round((lantaiTanah/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${total > 0 ? (lantaiTanah/total)*100 : 0}%` }} />
                </div>
              </div>

              {/* Sanitasi */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">Tidak Ada Jamban / Buang di Sungai</span>
                  <span className="font-mono font-semibold text-slate-800">{sanitasiBuruk} ({total > 0 ? Math.round((sanitasiBuruk/total)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${total > 0 ? (sanitasiBuruk/total)*100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>Fokus intervensi prioritas: Atap, Dinding, Lantai (ADL) dan Sanitasi Jamban.</span>
          </div>
        </div>

        {/* Alokasi Program Bantuan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                Alokasi Sumber Bantuan
              </h3>
              <span className="text-xs text-slate-400">APBN / APBD / Mitra</span>
            </div>

            <div className="space-y-3">
              {Object.entries(sumberDanaCounts).map(([sumber, count]) => (
                <div key={sumber} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <span className="text-xs font-semibold text-slate-800">{sumber}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {count} Unit
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={onNavigateToTable}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span>Kelola Daftar BNBA Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Priority 1 (Rusak Berat) Action Queue */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                Antrean Kasus Paling Mendesak (Skor Kerusakan Kritis)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar calon penerima dengan indeks kerusakan tertinggi dan kondisi fisik berbahaya yang memerlukan verifikasi cepat.
            </p>
          </div>

          <button
            onClick={onNavigateToTable}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            Lihat Semua Usulan →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {priorityQueue.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-xl border border-slate-200/90 hover:border-emerald-500 transition group p-3.5 flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-28 rounded-lg overflow-hidden mb-2.5 bg-slate-200">
                  <img
                    src={item.fotoDepan || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80'}
                    alt={item.namaKK}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                    Skor: {item.skorKerusakan}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-900 truncate" title={item.namaKK}>
                  {item.namaKK}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{item.desaKelurahan}, Kec. {item.kecamatan}</span>
                </div>

                <div className="mt-2 text-[11px] text-slate-600 line-clamp-2 bg-white p-2 rounded-lg border border-slate-100">
                  {item.kondisiFisik.atap} • {item.kondisiFisik.dinding}
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center gap-1.5">
                <button
                  onClick={() => onSelectEntry(item)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold text-center transition"
                >
                  Detail
                </button>
                <button
                  onClick={() => onOpenVerification(item)}
                  className="py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition"
                  title="Cetak Berita Acara Verifikasi Lapangan"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
