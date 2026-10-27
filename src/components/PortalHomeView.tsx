import React, { useState } from 'react';
import { RTLHEntry } from '../types/rtlh';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Building2, 
  Users, 
  Layers, 
  ArrowRight,
  HelpCircle,
  Phone,
  Mail,
  Home
} from 'lucide-react';

interface PortalHomeViewProps {
  data: RTLHEntry[];
  onSelectEntry: (entry: RTLHEntry) => void;
  onOpenFormModal: () => void;
  onNavigateToTable: () => void;
  onNavigateToMap: () => void;
  onNavigateToDashboard: () => void;
}

export const PortalHomeView: React.FC<PortalHomeViewProps> = ({
  data,
  onSelectEntry,
  onOpenFormModal,
  onNavigateToTable,
  onNavigateToMap,
  onNavigateToDashboard,
}) => {
  const [nikSearch, setNikSearch] = useState('');
  const [searchResult, setSearchResult] = useState<RTLHEntry | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchNik = (e: React.FormEvent) => {
    e.preventDefault();
    const query = nikSearch.trim().toLowerCase();
    if (!query) return;

    const found = data.find(
      (item) => item.nik.toLowerCase() === query || item.namaKK.toLowerCase().includes(query)
    );
    setSearchResult(found || null);
    setHasSearched(true);
  };

  const totalUsulan = data.length;
  const totalTerbantu = data.filter(d => d.statusBantuan === 'Bantuan Selesai').length;
  const totalMasukSK = data.filter(d => d.statusBantuan === 'Calon Penerima (Masuk SK)' || d.statusBantuan === 'Proses Pembangunan').length;

  return (
    <div className="space-y-10">
      
      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-2xl border border-emerald-800/40 p-6 sm:p-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Portal Resmi Pemkab Konawe • Dinas Perumahan & Kawasan Permukiman</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Sistem Informasi <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              E-RTLH Kabupaten Konawe
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Layanan digital terpadu pendataan, verifikasi faktual lapangan, pemetaan geospasial (GIS), dan transparansi penyaluran bantuan Rumah Tidak Layak Huni (BSPS KemenPKP & APBD) bagi masyarakat berpenghasilan rendah di Kabupaten Konawe.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenFormModal}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Isi Google Form Survei Usulan</span>
            </button>

            <button
              onClick={onNavigateToDashboard}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition"
            >
              <span>Buka Dashboard Analitik</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>

        {/* Floating Quick Stats on Hero */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/60">
            <div className="text-xs text-slate-400">Total Terdata (BNBA)</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">{totalUsulan} <span className="text-xs font-normal text-emerald-400">Unit</span></div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/60">
            <div className="text-xs text-slate-400">Masuk SK / Proses</div>
            <div className="text-2xl font-black text-purple-400 mt-1 font-mono">{totalMasukSK} <span className="text-xs font-normal text-slate-300">Calon</span></div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-700/60 col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-400">Realisasi Selesai Dibantu</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">{totalTerbantu} <span className="text-xs font-normal text-slate-300">Unit Layak</span></div>
          </div>
        </div>
      </div>

      {/* Feature 1: Cek Status Usulan Mandiri (Pencarian NIK Publik) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>Layanan Transparansi Publik</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Cek Status Usulan Calon Penerima Bantuan RTLH
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Masyarakat atau aparat desa dapat memeriksa status usulan dan verifikasi lapangan secara mandiri dengan memasukkan NIK atau Nama Kepala Keluarga.
          </p>
        </div>

        <form onSubmit={handleSearchNik} className="flex flex-col sm:flex-row gap-2.5 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ketik 16 Digit NIK KTP atau Nama Lengkap Calon Penerima..."
              value={nikSearch}
              onChange={(e) => setNikSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            <span>Cek Status Sekarang</span>
          </button>
        </form>

        {/* Search Result Box */}
        {hasSearched && (
          <div className="pt-2">
            {searchResult ? (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-500/40 max-w-2xl space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                        Data Ditemukan
                      </span>
                      <span className="text-xs font-mono text-slate-500">ID: {searchResult.id}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1">{searchResult.namaKK}</h3>
                    <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{searchResult.desaKelurahan}, Kec. {searchResult.kecamatan}</span>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                    searchResult.tingkatKerusakan === 'Rusak Berat' ? 'bg-red-100 text-red-800 border-red-300' :
                    searchResult.tingkatKerusakan === 'Rusak Sedang' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {searchResult.tingkatKerusakan}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-white p-3.5 rounded-xl border border-emerald-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status Usulan:</span>
                    <span className="font-bold text-emerald-800">{searchResult.statusBantuan}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Rencana Sumber Dana:</span>
                    <span className="font-semibold text-slate-800">{searchResult.sumberDana || 'Belum Ditentukan'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Skor Kerusakan:</span>
                    <span className="font-mono font-bold text-slate-900">{searchResult.skorKerusakan} / 100</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onSelectEntry(searchResult)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    Lihat Rincian Teknis & Lembar Berita Acara →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 max-w-2xl text-xs flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <strong>Data tidak ditemukan:</strong> NIK atau Nama yang dicari belum terdaftar dalam sistem E-RTLH. Silakan ajukan usulan baru melalui Google Form atau koordinasikan dengan Pemerintah Desa setempat.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feature 2: Alur & Prosedur Pengusulan RTLH */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Tahapan Resmi</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Alur Penanganan Bantuan RTLH Kab. Konawe
          </h2>
          <p className="text-xs text-slate-500">
            Proses verifikasi dan penetapan bantuan perumahan swadaya sesuai petunjuk teknis Kementerian PUPR
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {/* Step 1 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
              01
            </div>
            <h3 className="font-bold text-xs text-slate-900">Pendataan & Usulan</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Pengusulan data melalui Musrenbangdes atau formulir digital Google Form E-RTLH oleh petugas/desa.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
              02
            </div>
            <h3 className="font-bold text-xs text-slate-900">Verifikasi Faktual</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tim Fasilitator Lapangan (TFL) Disperkim memeriksa kondisi fisik atap, dinding, lantai, dan sanitasi.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
              03
            </div>
            <h3 className="font-bold text-xs text-slate-900">Penetapan SK Calon</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Penerbitan Surat Keputusan (SK) Calon Penerima Bantuan oleh Bupati Konawe / Kementerian PUPR.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
              04
            </div>
            <h3 className="font-bold text-xs text-slate-900">Penyaluran Bantuan</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Penyaluran bahan material bangunan dan stimulan upah kerja secara swadaya dengan pendampingan teknis.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
              05
            </div>
            <h3 className="font-bold text-xs text-slate-900">Serah Terima RLH</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Evaluasi akhir fisik rumah memenuhi kriteria Rumah Layak Huni (keselamatan, kesehatan, dan luas ruang).
            </p>
          </div>
        </div>
      </div>

      {/* Feature 3: Kriteria Syarat Calon Penerima */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-5">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Dasar Regulasi</span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
            Kriteria Utama Calon Penerima Bantuan RTLH
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Berdasarkan Regulasi Kementerian Perumahan dan Kawasan Permukiman (KemenPKP) tentang Bantuan Stimulan Perumahan Swadaya (BSPS).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Warga Negara Indonesia</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Berstatus sudah berkeluarga dan memiliki e-KTP serta Kartu Keluarga berdomisili di Kabupaten Konawe.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Masyarakat Berpenghasilan Rendah</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Penghasilan di bawah Upah Minimum Kabupaten (UMK) Konawe / masuk dalam data Pensasaran Percepatan Penghapusan Kemiskinan Ekstrem (P3KE).
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Satu-Satunya Rumah</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Memiliki dan menempati satu-satunya rumah yang dalam kondisi tidak layak huni dan belum pernah menerima bantuan serupa dalam 5 tahun terakhir.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tanah Hak Milik Sah</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Tanah dikuasai secara sah dan bersertifikat hak milik (SHM) atau Surat Keterangan Tanah (SKT) dari Kepala Desa/Lurah tanpa sengketa.
            </p>
          </div>
        </div>
      </div>

      {/* Feature 4: Kontak & Informasi Pelayanan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500">
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Pusat Informasi & Pengaduan RTLH</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Dinas Perumahan dan Kawasan Permukiman Kab. Konawe
          </h3>
          <p className="text-xs text-slate-500 max-w-xl">
            Jl. Inolobunggadue No. 1, Kompleks Perkantoran Pemerintah Daerah Kab. Konawe, Unaaha, Sulawesi Tenggara 93411.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateToMap}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Lihat Peta Sebaran Wilayah</span>
          </button>

          <button
            onClick={onNavigateToTable}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <span>Daftar Penerima BNBA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
