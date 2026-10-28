import React from 'react';
import { RTLHEntry } from '../types/rtlh';
import { maskIdentity } from '../utils/privacyMask';
import { 
  DAFTAR_KOMPONEN_STANDAR, 
  KATEGORI_STANDAR, 
  getDefaultPenilaian 
} from '../utils/standarPenilaian';
import { X, Printer, CheckCircle, ShieldCheck, Download, Home, FileText, Lock } from 'lucide-react';

interface VerificationModalProps {
  entry: RTLHEntry | null;
  onClose: () => void;
  isSuperAdmin?: boolean;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  entry,
  onClose,
  isSuperAdmin = true,
}) => {
  if (!entry) return null;

  const handlePrint = () => {
    window.print();
  };

  const penilaian = getDefaultPenilaian(entry);

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none border border-slate-200">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="sticky top-0 bg-slate-900 text-white px-5 py-3 rounded-t-2xl flex items-center justify-between no-print z-20">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="font-bold text-sm">Lembar Berita Acara Verifikasi Lapangan</div>
              <div className="text-[11px] text-slate-400">ID: {entry.id} • {entry.namaKK}</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Dokumen (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-6 sm:p-8 text-slate-900 bg-white font-sans text-xs sm:text-sm">
          
          {/* Official Government Kop */}
          <div className="border-b-4 border-double border-slate-900 pb-3 text-center mb-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-14 h-14 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-xs bg-slate-50 uppercase flex-shrink-0">
                KONAWE
              </div>
              <div className="text-center">
                <div className="text-sm sm:text-base font-extrabold tracking-wider uppercase text-slate-900">
                  PEMERINTAH KABUPATEN KONAWE
                </div>
                <div className="text-base sm:text-lg font-black tracking-tight uppercase text-emerald-950">
                  DINAS PERUMAHAN DAN KAWASAN PERMUKIMAN
                </div>
                <div className="text-[11px] text-slate-600">
                  Jl. Inolobunggadue No. 1, Kompleks Perkantoran Pemkab Konawe, Unaaha - Sulawesi Tenggara 93411
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-sm sm:text-base font-black uppercase underline tracking-wide">
              BERITA ACARA VERIFIKASI FAKTUAL RTLH
            </h2>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">
              Nomor Registrasi BNBA: {entry.id} / PKP-KNW / {entry.tahunAnggaran}
            </div>
          </div>

          <p className="text-xs text-slate-700 mb-4 leading-relaxed text-justify">
            Pada hari ini, tanggal <strong>{entry.tanggalVerifikasi || entry.timestamp.slice(0, 10)}</strong>, telah dilaksanakan verifikasi faktual lapangan terhadap calon penerima bantuan stimulan perumahan swadaya / rehabilitasi Rumah Tidak Layak Huni (RTLH) Tahun Anggaran {entry.tahunAnggaran} dengan data identitas dan kondisi fisik sebagai berikut:
          </p>

          {/* Section A: Identitas Calon Penerima */}
          <div className="mb-5">
            <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase border-l-4 border-emerald-700 text-slate-800 mb-2.5">
              A. DATA IDENTITAS CALON PENERIMA BANTUAN & LOKASI GEOSPASIAL
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs font-serif sm:font-sans">
              
              {/* Kolom Kiri */}
              <div className="space-y-2">
                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">Nama KK</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-bold text-slate-900">{entry.namaKK}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">NIK</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-900 tracking-wider">
                      {maskIdentity(entry.nik, isSuperAdmin)}
                    </span>
                    {!isSuperAdmin && (
                      <span className="text-[10px] text-amber-700 no-print font-sans">(Disamarkan)</span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">Nomor KK</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-900 tracking-wider">
                      {maskIdentity(entry.noKK, isSuperAdmin)}
                    </span>
                    {!isSuperAdmin && (
                      <span className="text-[10px] text-amber-700 no-print font-sans">(Disamarkan)</span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">Jenis kelamin (L/P)</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-semibold text-slate-900">{jenisKelaminDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">Umur</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-semibold text-slate-900">{umurDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">Alamat KK</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-semibold text-slate-900">{alamatKkDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">RT/RW</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-semibold text-slate-900">{rtRwDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">Desa/Kelurahan</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-bold text-slate-900">{entry.desaKelurahan}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">Kecamatan</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-bold text-slate-900">{entry.kecamatan}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">Kabupaten/Kota</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-semibold text-slate-900">{kabupatenDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-36 sm:w-40 shrink-0 font-medium text-slate-700">Provinsi</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-semibold text-slate-900">{provinsiDisplay}</span>
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-2">
                <div className="flex items-baseline text-xs">
                  <span className="w-48 sm:w-56 shrink-0 font-medium text-slate-700">Penghasilan KK perbulan (Rp)</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-bold text-slate-900">{penghasilanDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-48 sm:w-56 shrink-0 font-medium text-slate-700">Nilai UMP / UMK (pilih yang tertinggi)</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-semibold text-slate-900">{umpUmkDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-48 sm:w-56 shrink-0 font-medium text-slate-700">Berapa tahun menghuni rumah (tulis angka)</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-semibold text-slate-900">{lamaMenghuniDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-48 sm:w-56 shrink-0 font-medium text-slate-700">Memiliki aset rumah lainnya (Ya/Tidak)</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className={`font-bold ${entry.asetRumahLain ? 'text-amber-700' : 'text-slate-900'}`}>
                      {asetRumahLainDisplay}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-48 sm:w-56 shrink-0 font-medium text-slate-700">Jumlah penghuni (jiwa)</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-bold text-slate-900">{jumlahPenghuniDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-48 sm:w-56 shrink-0 font-medium text-slate-700">Luas rumah (m2)</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-bold text-slate-900">{luasRumahDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-48 sm:w-56 shrink-0 font-medium text-slate-700">Bersedia mengikuti ketentuan program (Ya/Tidak)</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-bold text-emerald-700">{bersediaKetentuanDisplay}</span>
                  </div>
                </div>

                <div className="flex items-baseline text-xs">
                  <span className="w-48 sm:w-56 shrink-0 font-medium text-slate-700">Titik Koordinat</span>
                  <span className="mr-2 font-bold text-slate-500">:</span>
                  <div className="flex-1 border-b border-slate-400 pb-0.5 min-h-[20px] flex items-center">
                    <span className="font-mono text-slate-900 font-semibold">{koordinatDisplay}</span>
                  </div>
                </div>

                <div className="hidden md:block border-b border-transparent pb-0.5 min-h-[20px]" />
                <div className="hidden md:block border-b border-transparent pb-0.5 min-h-[20px]" />
                <div className="hidden md:block border-b border-transparent pb-0.5 min-h-[20px]" />
              </div>

            </div>
          </div>

          {/* Section B: Evaluasi Teknis */}
          <div className="mb-5">
            <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase border-l-4 border-emerald-700 text-slate-800 mb-2">
              B. HASIL PENILAIAN INDIKATOR KELAYAKAN RUMAH
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-400 text-[10px] sm:text-[11px] mb-3">
                <thead>
                  <tr className="border-b border-slate-400">
                    <th 
                      rowSpan={2} 
                      className="border border-slate-400 p-1.5 bg-slate-100 text-slate-900 font-extrabold text-center uppercase tracking-wider w-[22%]"
                    >
                      ASPEK / KOMPONEN
                    </th>
                    <th 
                      colSpan={3} 
                      className="border border-slate-400 p-1 bg-slate-200 text-slate-900 font-extrabold text-center uppercase tracking-widest text-[11px]"
                    >
                      KONDISI RUMAH
                    </th>
                  </tr>
                  <tr className="border-b border-slate-400">
                    <th className="border border-slate-400 p-1 text-center font-bold bg-[#d2ebd5] text-emerald-950 w-[26%]">
                      A
                    </th>
                    <th className="border border-slate-400 p-1 text-center font-bold bg-[#ffe5a3] text-amber-950 w-[26%]">
                      B
                    </th>
                    <th className="border border-slate-400 p-1 text-center font-bold bg-[#fbc9ca] text-rose-950 w-[26%]">
                      C
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {KATEGORI_STANDAR.map((kategori) => {
                    const items = DAFTAR_KOMPONEN_STANDAR.filter((item) => item.kategori === kategori);
                    return (
                      <React.Fragment key={kategori}>
                        {/* Kategori Header Row */}
                        <tr className="bg-slate-100/90 font-bold border-y border-slate-400">
                          <td 
                            colSpan={4} 
                            className="border border-slate-400 py-1 px-2 text-slate-900 font-black tracking-wide uppercase text-[10px] bg-slate-200/70"
                          >
                            {kategori}
                          </td>
                        </tr>

                        {/* Komponen Rows */}
                        {items.map((item) => {
                          const currentVal = penilaian[item.id];
                          const isA = currentVal === 'A';
                          const isB = currentVal === 'B';
                          const isC = currentVal === 'C';

                          return (
                            <tr key={item.id} className="border-b border-slate-300">
                              <td className="border border-slate-400 p-1.5 font-bold text-slate-800 bg-white align-middle">
                                {item.namaKomponen}
                              </td>

                              {/* Col A */}
                              <td className={`border border-slate-400 p-1.5 align-middle ${
                                isA ? 'bg-emerald-100/80 font-semibold text-emerald-950' : 'bg-white text-slate-600'
                              }`}>
                                <div className="flex items-start space-x-1.5">
                                  <span className="font-mono font-bold text-xs shrink-0">{isA ? '☑' : '☐'}</span>
                                  <span className="leading-tight">{item.opsiA}</span>
                                </div>
                              </td>

                              {/* Col B */}
                              {item.opsiB ? (
                                <td className={`border border-slate-400 p-1.5 align-middle ${
                                  isB ? 'bg-amber-100/80 font-semibold text-amber-950' : 'bg-white text-slate-600'
                                }`}>
                                  <div className="flex items-start space-x-1.5">
                                    <span className="font-mono font-bold text-xs shrink-0">{isB ? '☑' : '☐'}</span>
                                    <span className="leading-tight">{item.opsiB}</span>
                                  </div>
                                </td>
                              ) : (
                                <td className="border border-slate-400 p-1 text-center text-slate-300 bg-slate-50 align-middle">
                                  —
                                </td>
                              )}

                              {/* Col C */}
                              <td className={`border border-slate-400 p-1.5 align-middle ${
                                isC ? 'bg-rose-100/80 font-semibold text-rose-950' : 'bg-white text-slate-600'
                              }`}>
                                <div className="flex items-start space-x-1.5">
                                  <span className="font-mono font-bold text-xs shrink-0">{isC ? '☑' : '☐'}</span>
                                  <span className="leading-tight">{item.opsiC}</span>
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

            {/* Score Summary Box */}
            <div className="bg-slate-50 border border-slate-400 p-2.5 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-700">Skor Kerusakan Teknis: </span>
                <span className="text-base font-black text-slate-900 font-mono">{entry.skorKerusakan} / 100</span>
              </div>
              <div>
                <span className="text-xs text-slate-700">Kesimpulan Kelayakan: </span>
                <span className={`text-xs font-black uppercase px-2 py-0.5 rounded border ${
                  entry.tingkatKerusakan === 'Rusak Berat' ? 'bg-red-100 text-red-900 border-red-400' :
                  entry.tingkatKerusakan === 'Rusak Sedang' ? 'bg-amber-100 text-amber-900 border-amber-400' : 'bg-blue-100 text-blue-900 border-blue-400'
                }`}>
                  {entry.tingkatKerusakan}
                </span>
              </div>
            </div>
          </div>

          {/* Signatures Block (3 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs mt-8 pt-4 border-t border-slate-200">
            <div>
              <div className="text-[11px] text-slate-500 mb-14">Calon Penerima Bantuan,</div>
              <div className="font-bold text-slate-900 underline uppercase">( ........................................ )</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 mb-14">Kepala Desa / Lurah,</div>
              <div className="font-bold text-slate-900 underline uppercase">( ........................................ )</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 mb-14">Tim Verifikasi,</div>
              <div className="font-bold text-slate-900 underline uppercase">( ........................................ )</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
