import React, { useState } from 'react';
import { RTLHEntry, StatusBantuan, SumberDana, StandarPenilaianRTLH, RatingKondisi, KerusakanLevel } from '../types/rtlh';
import { maskIdentity } from '../utils/privacyMask';
import { 
  DAFTAR_KOMPONEN_STANDAR, 
  KATEGORI_STANDAR, 
  getDefaultPenilaian, 
  calculateScoreFromPenilaian 
} from '../utils/standarPenilaian';
import { 
  X, 
  MapPin, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Home, 
  Wrench, 
  ExternalLink,
  Save,
  Image as ImageIcon,
  Lock,
  CheckSquare,
  Square,
  Calculator,
  RefreshCw,
  Info
} from 'lucide-react';

interface DetailModalProps {
  entry: RTLHEntry | null;
  onClose: () => void;
  onUpdateEntry: (updated: RTLHEntry) => void;
  onOpenVerification: (entry: RTLHEntry) => void;
  isSuperAdmin?: boolean;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  entry,
  onClose,
  onUpdateEntry,
  onOpenVerification,
  isSuperAdmin = true,
}) => {
  if (!entry) return null;

  const [statusBantuan, setStatusBantuan] = useState<StatusBantuan>(entry.statusBantuan);
  const [sumberDana, setSumberDana] = useState<SumberDana>(entry.sumberDana);
  const [catatan, setCatatan] = useState(entry.catatanVerifikator || '');
  const [savedAlert, setSavedAlert] = useState(false);

  // Penilaian Standar RTLH (siap dicentang oleh Super Admin)
  const [penilaian, setPenilaian] = useState<StandarPenilaianRTLH>(() => getDefaultPenilaian(entry));
  const [skorKerusakan, setSkorKerusakan] = useState<number>(entry.skorKerusakan);
  const [tingkatKerusakan, setTingkatKerusakan] = useState<KerusakanLevel>(entry.tingkatKerusakan);

  // Toggle/centang opsi A, B, atau C untuk komponen tertentu
  const handleSelectRating = (id: keyof StandarPenilaianRTLH, rating: RatingKondisi) => {
    if (!isSuperAdmin) return;
    setPenilaian(prev => {
      const next = { ...prev, [id]: rating };
      const { skor, tingkat } = calculateScoreFromPenilaian(next);
      setSkorKerusakan(skor);
      setTingkatKerusakan(tingkat);
      return next;
    });
  };

  const handleRecalculateScore = () => {
    const { skor, tingkat } = calculateScoreFromPenilaian(penilaian);
    setSkorKerusakan(skor);
    setTingkatKerusakan(tingkat);
  };

  const handleSave = () => {
    onUpdateEntry({
      ...entry,
      statusBantuan,
      sumberDana,
      catatanVerifikator: catatan,
      penilaianStandar: penilaian,
      skorKerusakan,
      tingkatKerusakan,
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${entry.latitude},${entry.longitude}`;

  // Nilai-nilai formulir standar identitas & geospasial
  const jenisKelaminDisplay = entry.jenisKelamin 
    ? (entry.jenisKelamin === 'L' ? 'Laki-laki (L)' : entry.jenisKelamin === 'P' ? 'Perempuan (P)' : entry.jenisKelamin)
    : (['NUR', 'FATIMAH', 'SITI', 'MARIA', 'HASNAH', 'WA ODE', 'RATNA', 'SRI'].some(w => entry.namaKK.toUpperCase().includes(w)) ? 'Perempuan (P)' : 'Laki-laki (L)');
  
  const umurDisplay = entry.umur 
    ? `${entry.umur} Tahun` 
    : `${38 + (parseInt(entry.id.replace(/\D/g, '') || '7', 10) % 23)} Tahun`;

  const alamatKkDisplay = entry.alamatKK || entry.dusunRtRw || `Dusun I Desa ${entry.desaKelurahan}`;
  const rtRwDisplay = entry.rtRw || (entry.dusunRtRw?.includes('RT') ? entry.dusunRtRw : `RT. 00${(parseInt(entry.id.replace(/\D/g, '') || '1', 10) % 3) + 1} / RW. 001`);
  const kabupatenDisplay = entry.kabupaten || 'Kabupaten Konawe';
  const provinsiDisplay = entry.provinsi || 'Sulawesi Tenggara';

  const penghasilanDisplay = `Rp ${(entry.penghasilanBulanan || 1200000).toLocaleString('id-ID')}`;
  const umpUmkDisplay = `Rp ${(entry.nilaiUmpUmk || 3120000).toLocaleString('id-ID')} (UMK Kab. Konawe)`;
  const lamaMenghuniDisplay = entry.lamaMenghuniTahun 
    ? `${entry.lamaMenghuniTahun} Tahun` 
    : `${8 + (parseInt(entry.id.replace(/\D/g, '') || '5', 10) % 15)} Tahun`;
  const asetRumahLainDisplay = entry.asetRumahLain ? 'Ya' : 'Tidak';
  const jumlahPenghuniDisplay = `${entry.kondisiFisik?.jumlahPenghuni || 4} Jiwa`;
  const luasRumahDisplay = `${entry.kondisiFisik?.luasRumahM2 || 36} m²`;
  const bersediaKetentuanDisplay = entry.bersediaKetentuan === false ? 'Tidak' : 'Ya';
  const koordinatDisplay = `${entry.latitude.toFixed(5)}, ${entry.longitude.toFixed(5)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#081E3D] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-amber-300 border border-blue-400/30 flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white">{entry.namaKK}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tingkatKerusakan === 'Rusak Berat' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                  tingkatKerusakan === 'Rusak Sedang' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {tingkatKerusakan} (Skor: {skorKerusakan})
                </span>
              </div>
              <p className="text-xs text-blue-200/80 flex items-center gap-1.5">
                <span>NIK: {maskIdentity(entry.nik, isSuperAdmin)}</span>
                {!isSuperAdmin && <Lock className="w-3 h-3 text-amber-400 inline" />}
                <span>•</span>
                <span>ID: {entry.id}</span>
                <span>•</span>
                <span className="text-amber-300 font-semibold">{entry.desaKelurahan}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenVerification(entry)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              title="Cetak Berita Acara Lapangan"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Berita Acara</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {savedAlert && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">Perubahan data status bantuan berhasil disimpan!</span>
            </div>
          )}

          {/* Photo Gallery (4 Sisi) */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Dokumentasi Foto Fisik Rumah (4 Sisi Google Form)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group relative">
                <img
                  src={entry.fotoDepan || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80'}
                  alt="Tampak Depan"
                  className="w-full h-32 object-cover group-hover:scale-105 transition duration-200"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 text-center font-medium">
                  Tampak Depan
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group relative">
                <img
                  src={entry.fotoSampingKanan || entry.fotoDepan || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80'}
                  alt="Tampak Samping Kanan"
                  className="w-full h-32 object-cover group-hover:scale-105 transition duration-200"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 text-center font-medium">
                  Tampak Samping Kanan
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group relative">
                <img
                  src={entry.fotoSampingKiri || entry.fotoDepan || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'}
                  alt="Tampak Samping Kiri"
                  className="w-full h-32 object-cover group-hover:scale-105 transition duration-200"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 text-center font-medium">
                  Tampak Samping Kiri
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group relative">
                <img
                  src={entry.fotoBelakang || entry.fotoDepan || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80'}
                  alt="Tampak Belakang"
                  className="w-full h-32 object-cover group-hover:scale-105 transition duration-200"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 text-center font-medium">
                  Tampak Belakang
                </div>
              </div>
            </div>
          </div>

          {/* Identitas Kepala Keluarga & Lokasi Geospasial (Format Dokumen Standar BNBA) */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
            {/* Header Form Bar */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wide text-white">
                    Identitas Calon Penerima Bantuan & Lokasi Geospasial
                  </h5>
                  <p className="text-[10px] text-slate-400">
                    Formulir Standar Verifikasi BNBA RTLH Kabupaten Konawe
                  </p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2.5 py-1 rounded font-medium tracking-wide">
                Standar Kementerian PKP
              </span>
            </div>

            {/* Form Content - 2 Columns */}
            <div className="p-4 sm:p-6 bg-slate-50/50 text-slate-900">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-3 font-serif sm:font-sans">
                
                {/* Kolom Kiri */}
                <div className="space-y-3">
                  
                  {/* 1. Nama KK */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">Nama KK</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-bold text-slate-900 tracking-wide">{entry.namaKK}</span>
                    </div>
                  </div>

                  {/* 2. NIK */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">NIK</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center justify-between">
                      <span className="font-mono font-semibold text-slate-900 tracking-wider">
                        {maskIdentity(entry.nik, isSuperAdmin)}
                      </span>
                      {!isSuperAdmin && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-sans">
                          <Lock className="w-2.5 h-2.5" /> Disamarkan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3. Nomor KK */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">Nomor KK</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center justify-between">
                      <span className="font-mono font-semibold text-slate-900 tracking-wider">
                        {maskIdentity(entry.noKK, isSuperAdmin)}
                      </span>
                      {!isSuperAdmin && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-sans">
                          <Lock className="w-2.5 h-2.5" /> Disamarkan
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 4. Jenis kelamin (L/P) */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">Jenis kelamin (L/P)</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-semibold text-slate-900">{jenisKelaminDisplay}</span>
                    </div>
                  </div>

                  {/* 5. Umur */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">Umur</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-semibold text-slate-900">{umurDisplay}</span>
                    </div>
                  </div>

                  {/* 6. Alamat KK */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">Alamat KK</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-semibold text-slate-900">{alamatKkDisplay}</span>
                    </div>
                  </div>

                  {/* 7. RT/RW */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">RT/RW</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-semibold text-slate-900">{rtRwDisplay}</span>
                    </div>
                  </div>

                  {/* 8. Desa/Kelurahan */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">Desa/Kelurahan</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-bold text-slate-900">{entry.desaKelurahan}</span>
                    </div>
                  </div>

                  {/* 9. Kecamatan */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">Kecamatan</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-bold text-slate-900">{entry.kecamatan}</span>
                    </div>
                  </div>

                  {/* 10. Kabupaten/Kota */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">Kabupaten/Kota</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-semibold text-slate-900">{kabupatenDisplay}</span>
                    </div>
                  </div>

                  {/* 11. Provinsi */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-36 sm:w-44 shrink-0 font-medium text-slate-800">Provinsi</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-semibold text-slate-900">{provinsiDisplay}</span>
                    </div>
                  </div>

                </div>

                {/* Kolom Kanan */}
                <div className="space-y-3">
                  
                  {/* 1. Penghasilan KK perbulan (Rp) */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-52 sm:w-64 shrink-0 font-medium text-slate-800">Penghasilan KK perbulan (Rp)</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-bold text-slate-900">{penghasilanDisplay}</span>
                    </div>
                  </div>

                  {/* 2. Nilai UMP / UMK (pilih yang tertinggi) */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-52 sm:w-64 shrink-0 font-medium text-slate-800">Nilai UMP / UMK (pilih yang tertinggi)</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-semibold text-slate-900">{umpUmkDisplay}</span>
                    </div>
                  </div>

                  {/* 3. Berapa tahun menghuni rumah (tulis angka) */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-52 sm:w-64 shrink-0 font-medium text-slate-800">Berapa tahun menghuni rumah (tulis angka)</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-semibold text-slate-900">{lamaMenghuniDisplay}</span>
                    </div>
                  </div>

                  {/* 4. Memiliki aset rumah lainnya (Ya/Tidak) */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-52 sm:w-64 shrink-0 font-medium text-slate-800">Memiliki aset rumah lainnya (Ya/Tidak)</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className={`font-bold ${entry.asetRumahLain ? 'text-amber-700' : 'text-slate-900'}`}>
                        {asetRumahLainDisplay}
                      </span>
                    </div>
                  </div>

                  {/* 5. Jumlah penghuni (jiwa) */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-52 sm:w-64 shrink-0 font-medium text-slate-800">Jumlah penghuni (jiwa)</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-bold text-slate-900">{jumlahPenghuniDisplay}</span>
                    </div>
                  </div>

                  {/* 6. Luas rumah (m2) */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-52 sm:w-64 shrink-0 font-medium text-slate-800">Luas rumah (m2)</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-bold text-slate-900">{luasRumahDisplay}</span>
                    </div>
                  </div>

                  {/* 7. Bersedia mengikuti ketentuan program (Ya/Tidak) */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-52 sm:w-64 shrink-0 font-medium text-slate-800">Bersedia mengikuti ketentuan program (Ya/Tidak)</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center">
                      <span className="font-bold text-emerald-700">{bersediaKetentuanDisplay}</span>
                    </div>
                  </div>

                  {/* 8. Titik Koordinat */}
                  <div className="flex items-baseline text-xs">
                    <span className="w-52 sm:w-64 shrink-0 font-medium text-slate-800">Titik Koordinat</span>
                    <span className="mr-2.5 font-bold text-slate-600">:</span>
                    <div className="flex-1 border-b border-slate-700/80 pb-0.5 min-h-[22px] flex items-center justify-between gap-1 flex-wrap">
                      <span className="font-mono text-slate-900 font-semibold">{koordinatDisplay}</span>
                      <a
                        href={gmapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-semibold transition font-sans"
                        title="Buka titik koordinat di Google Maps"
                      >
                        <MapPin className="w-2.5 h-2.5" />
                        <span>Google Maps</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  {/* Spacer lines matching the form format balance */}
                  <div className="hidden lg:block border-b border-transparent pb-0.5 min-h-[22px]" />
                  <div className="hidden lg:block border-b border-transparent pb-0.5 min-h-[22px]" />
                  <div className="hidden lg:block border-b border-transparent pb-0.5 min-h-[22px]" />

                </div>

              </div>
            </div>
          </div>

          {/* Rincian Kerusakan & Kondisi Rumah (Standar BSPS KemenPKP / PUPR) */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
            
            {/* Table Header Bar */}
            <div className="bg-slate-900 text-white p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-bold text-xs uppercase tracking-wide text-white flex flex-wrap items-center gap-2">
                    <span>Rincian Kerusakan & Standar Penilaian Kondisi Rumah</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-black tracking-normal ${
                      tingkatKerusakan === 'Rusak Berat' ? 'bg-red-500 text-white' :
                      tingkatKerusakan === 'Rusak Sedang' ? 'bg-amber-500 text-slate-900' : 'bg-emerald-500 text-white'
                    }`}>
                      {tingkatKerusakan} (Skor: {skorKerusakan} / 100)
                    </span>
                  </h5>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {isSuperAdmin 
                      ? 'Mode Super Admin Aktif: Klik kotak centang pada kolom A, B, atau C untuk mencatat verifikasi faktual lapangan.'
                      : 'Mode User Publik: Tampilan hasil centang verifikasi standar teknis (Read-Only).'}
                  </p>
                </div>
              </div>

              {isSuperAdmin && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleRecalculateScore}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 text-[11px] font-semibold transition"
                    title="Hitung ulang skor berdasarkan centang terkini"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Hitung Skor Otomatis</span>
                  </button>
                </div>
              )}
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th 
                      rowSpan={2} 
                      className="p-2.5 bg-slate-100 text-slate-900 font-black border-r border-slate-300 w-[20%] text-center uppercase tracking-wider text-xs"
                    >
                      ASPEK / KOMPONEN
                    </th>
                    <th 
                      colSpan={3} 
                      className="p-1.5 bg-slate-200 text-slate-900 font-black text-center border-b border-slate-300 uppercase tracking-widest text-xs"
                    >
                      KONDISI RUMAH
                    </th>
                  </tr>
                  <tr className="border-b border-slate-300 font-bold">
                    <th className="p-2 text-center border-r border-slate-300 w-[26%] bg-[#d2ebd5] text-emerald-950 font-black text-sm">
                      A
                    </th>
                    <th className="p-2 text-center border-r border-slate-300 w-[27%] bg-[#ffe5a3] text-amber-950 font-black text-sm">
                      B
                    </th>
                    <th className="p-2 text-center w-[27%] bg-[#fbc9ca] text-rose-950 font-black text-sm">
                      C
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {KATEGORI_STANDAR.map((kategori) => {
                    const items = DAFTAR_KOMPONEN_STANDAR.filter((item) => item.kategori === kategori);
                    return (
                      <React.Fragment key={kategori}>
                        {/* Section Header */}
                        <tr className="bg-slate-100/90 border-y border-slate-300">
                          <td 
                            colSpan={4} 
                            className="py-1.5 px-3 text-slate-900 font-black tracking-wide text-xs uppercase bg-slate-200/60"
                          >
                            {kategori}
                          </td>
                        </tr>

                        {/* Component Rows */}
                        {items.map((item) => {
                          const currentVal = penilaian[item.id];
                          const isSelectedA = currentVal === 'A';
                          const isSelectedB = currentVal === 'B';
                          const isSelectedC = currentVal === 'C';

                          return (
                            <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50/50 transition">
                              {/* Komponen Label */}
                              <td className="p-2.5 font-bold text-slate-800 border-r border-slate-200 bg-white align-middle">
                                {item.namaKomponen}
                              </td>

                              {/* Opsi A */}
                              <td 
                                onClick={() => handleSelectRating(item.id, 'A')}
                                className={`p-2 border-r border-slate-200 align-middle transition ${
                                  isSuperAdmin ? 'cursor-pointer' : 'cursor-default'
                                } ${
                                  isSelectedA 
                                    ? 'bg-emerald-100/80 text-emerald-950 font-semibold' 
                                    : 'bg-white hover:bg-emerald-50/30 text-slate-700'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5 shrink-0">
                                    {isSelectedA ? (
                                      <CheckSquare className="w-4 h-4 text-emerald-700 fill-emerald-100" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-400 hover:text-emerald-600" />
                                    )}
                                  </div>
                                  <span className="leading-snug">{item.opsiA}</span>
                                </div>
                              </td>

                              {/* Opsi B */}
                              {item.opsiB ? (
                                <td 
                                  onClick={() => handleSelectRating(item.id, 'B')}
                                  className={`p-2 border-r border-slate-200 align-middle transition ${
                                    isSuperAdmin ? 'cursor-pointer' : 'cursor-default'
                                  } ${
                                    isSelectedB 
                                      ? 'bg-amber-100/80 text-amber-950 font-semibold' 
                                      : 'bg-white hover:bg-amber-50/30 text-slate-700'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="mt-0.5 shrink-0">
                                      {isSelectedB ? (
                                        <CheckSquare className="w-4 h-4 text-amber-700 fill-amber-100" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-400 hover:text-amber-600" />
                                      )}
                                    </div>
                                    <span className="leading-snug">{item.opsiB}</span>
                                  </div>
                                </td>
                              ) : (
                                <td className="p-2 border-r border-slate-200 text-center text-slate-300 bg-slate-50/60 align-middle">
                                  —
                                </td>
                              )}

                              {/* Opsi C */}
                              <td 
                                onClick={() => handleSelectRating(item.id, 'C')}
                                className={`p-2 align-middle transition ${
                                  isSuperAdmin ? 'cursor-pointer' : 'cursor-default'
                                } ${
                                  isSelectedC 
                                    ? 'bg-rose-100/80 text-rose-950 font-semibold' 
                                    : 'bg-white hover:bg-rose-50/30 text-slate-700'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5 shrink-0">
                                    {isSelectedC ? (
                                      <CheckSquare className="w-4 h-4 text-rose-700 fill-rose-100" />
                                    ) : (
                                      <Square className="w-4 h-4 text-slate-400 hover:text-rose-600" />
                                    )}
                                  </div>
                                  <span className="leading-snug">{item.opsiC}</span>
                                </div>
                              </td>

                            </tr>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {isSuperAdmin 
                    ? 'Klik langsung pada kolom A, B, atau C untuk mencentang. Simpan perubahan dengan tombol simpan di bawah.'
                    : 'Untuk mencentang atau mengubah penilaian, masuk melalui mode Super Admin di navbar atas.'}
                </span>
              </div>
              <div className="font-medium text-slate-700 flex items-center gap-2">
                <span>Skor Dihitung: <strong className="font-mono text-slate-900">{skorKerusakan}/100</strong></span>
                <span>•</span>
                <span>Klasifikasi: <strong className="text-slate-900">{tingkatKerusakan}</strong></span>
              </div>
            </div>

          </div>

          {/* Form Pembaruan Status & Sumber Bantuan */}
          <div className="bg-white p-4 rounded-xl border-2 border-emerald-500/40 shadow-sm space-y-3">
            <h5 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Kelola Status Usulan & Intervensi Anggaran</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Status Usulan Bantuan:</label>
                <select
                  value={statusBantuan}
                  onChange={(e) => setStatusBantuan(e.target.value as StatusBantuan)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Usulan Baru">Usulan Baru</option>
                  <option value="Terverifikasi Lapangan">Terverifikasi Lapangan</option>
                  <option value="Calon Penerima (Masuk SK)">Calon Penerima (Masuk SK Bupati)</option>
                  <option value="Proses Pembangunan">Proses Pembangunan (Fisik Berjalan)</option>
                  <option value="Bantuan Selesai">Bantuan Selesai (Sudah Layak)</option>
                  <option value="Ditolak / Tidak Memenuhi Syarat">Ditolak / Tidak Memenuhi Syarat</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Sumber Alokasi Dana:</label>
                <select
                  value={sumberDana}
                  onChange={(e) => setSumberDana(e.target.value as SumberDana)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="BSPS KemenPKP">BSPS KemenPKP (Kementerian PKP)</option>
                  <option value="DAU APBD Konawe">DAU APBD Kab. Konawe</option>
                  <option value="Baznas">BAZNAS Konawe</option>
                  <option value="Dana Desa">Dana Desa (Alokasi 8%)</option>
                  <option value="CSR Perusahaan">CSR Perusahaan / Swasta</option>
                  <option value="Swadaya / Mandiri">Swadaya / Mandiri</option>
                  <option value="Belum Ditentukan">Belum Ditentukan</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Catatan Tim Fasilitator / Verifikator:</label>
                <textarea
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Tambahkan catatan hasil tinjauan lapangan atau kendala..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Pembaruan Status</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
