import React from 'react';
import { RTLHEntry } from '../types/rtlh';
import { X, Printer, CheckCircle, ShieldCheck, Download, Home, FileText } from 'lucide-react';

interface VerificationModalProps {
  entry: RTLHEntry | null;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  entry,
  onClose,
}) => {
  if (!entry) return null;

  const handlePrint = () => {
    window.print();
  };

  const luasPerJiwa = entry.kondisiFisik.jumlahPenghuni > 0
    ? (entry.kondisiFisik.luasRumahM2 / entry.kondisiFisik.jumlahPenghuni).toFixed(1)
    : '0';

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
            <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase border-l-4 border-emerald-700 text-slate-800 mb-2">
              A. DATA IDENTITAS CALON PENERIMA BANTUAN
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Nama Kepala Keluarga:</span>
                <span className="font-bold text-slate-900">{entry.namaKK}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Nomor Induk Kependudukan (NIK):</span>
                <span className="font-mono font-bold text-slate-900">{entry.nik}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Nomor Kartu Keluarga (No KK):</span>
                <span className="font-mono text-slate-800">{entry.noKK}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Pekerjaan / Mata Pencaharian:</span>
                <span className="font-medium text-slate-800">{entry.pekerjaan}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Penghasilan Bulanan:</span>
                <span className="font-semibold text-slate-800">Rp {(entry.penghasilanBulanan || 0).toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Jumlah Anggota Keluarga:</span>
                <span className="font-semibold text-slate-800">{entry.kondisiFisik.jumlahPenghuni} Jiwa</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Desa / Kelurahan:</span>
                <span className="font-bold text-slate-900">{entry.desaKelurahan}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Kecamatan:</span>
                <span className="font-bold text-slate-900">{entry.kecamatan}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1 sm:col-span-2">
                <span className="text-slate-500">Alamat Lengkap / Dusun:</span>
                <span className="font-medium text-slate-800">{entry.dusunRtRw}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1 sm:col-span-2">
                <span className="text-slate-500">Titik Koordinat Geospasial (GPS):</span>
                <span className="font-mono text-slate-800">Latitude: {entry.latitude}, Longitude: {entry.longitude}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Status Kepemilikan Rumah:</span>
                <span className="font-semibold text-slate-800">{entry.statusKepemilikanRumah}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-1">
                <span className="text-slate-500">Legalitas Tanah:</span>
                <span className="font-semibold text-slate-800">{entry.statusKepemilikanTanah}</span>
              </div>
            </div>
          </div>

          {/* Section B: Evaluasi Teknis PUPR */}
          <div className="mb-5">
            <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase border-l-4 border-emerald-700 text-slate-800 mb-2">
              B. HASIL PENILAIAN INDIKATOR KELAYAKAN RUMAH (STANDAR KEMEN PUPR)
            </div>
            
            <table className="w-full border-collapse border border-slate-300 text-xs mb-3">
              <thead>
                <tr className="bg-slate-200 text-slate-800">
                  <th className="border border-slate-300 p-2 text-left w-1/4">Komponen Penilaian</th>
                  <th className="border border-slate-300 p-2 text-left w-1/2">Kondisi Faktual di Lapangan</th>
                  <th className="border border-slate-300 p-2 text-center w-1/4">Status Kelayakan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">1. Struktur Pondasi</td>
                  <td className="border border-slate-300 p-2">{entry.kondisiFisik.pondasi}</td>
                  <td className="border border-slate-300 p-2 text-center text-red-600 font-bold">Tidak Memenuhi</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">2. Kolom & Balok</td>
                  <td className="border border-slate-300 p-2">{entry.kondisiFisik.kolomBalok}</td>
                  <td className="border border-slate-300 p-2 text-center text-red-600 font-bold">Tidak Memenuhi</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">3. Rangka & Penutup Atap</td>
                  <td className="border border-slate-300 p-2">{entry.kondisiFisik.atap} ({entry.kondisiFisik.rangkaAtap})</td>
                  <td className="border border-slate-300 p-2 text-center text-red-600 font-bold">Rusak Kritis</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">4. Dinding Pengisi</td>
                  <td className="border border-slate-300 p-2">{entry.kondisiFisik.dinding}</td>
                  <td className="border border-slate-300 p-2 text-center text-red-600 font-bold">Tidak Memenuhi</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">5. Lantai Bangunan</td>
                  <td className="border border-slate-300 p-2">{entry.kondisiFisik.lantai}</td>
                  <td className="border border-slate-300 p-2 text-center text-red-600 font-bold">Tidak Memenuhi</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">6. Sanitasi & Jamban</td>
                  <td className="border border-slate-300 p-2">{entry.kondisiFisik.sanitasiJamban}</td>
                  <td className="border border-slate-300 p-2 text-center text-red-600 font-bold">Kurang / Tidak Sehat</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">7. Sumber Air Minum</td>
                  <td className="border border-slate-300 p-2">{entry.kondisiFisik.sumberAir}</td>
                  <td className="border border-slate-300 p-2 text-center text-amber-700 font-medium">Perlu Peningkatan</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">8. Kecukupan Ruang</td>
                  <td className="border border-slate-300 p-2">Luas {entry.kondisiFisik.luasRumahM2} m² untuk {entry.kondisiFisik.jumlahPenghuni} jiwa ({luasPerJiwa} m²/jiwa)</td>
                  <td className="border border-slate-300 p-2 text-center text-slate-700">
                    {parseFloat(luasPerJiwa) < 7.2 ? 'Padat / Kurang (< 7.2m²)' : 'Cukup'}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Score Summary Box */}
            <div className="bg-slate-50 border border-slate-300 p-3 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-600">Skor Kerusakan Teknis: </span>
                <span className="text-base font-black text-slate-900 font-mono">{entry.skorKerusakan} / 100</span>
              </div>
              <div>
                <span className="text-xs text-slate-600">Kesimpulan Kelayakan: </span>
                <span className={`text-xs font-black uppercase px-2 py-0.5 rounded ${
                  entry.tingkatKerusakan === 'Rusak Berat' ? 'bg-red-200 text-red-900' :
                  entry.tingkatKerusakan === 'Rusak Sedang' ? 'bg-amber-200 text-amber-900' : 'bg-blue-200 text-blue-900'
                }`}>
                  {entry.tingkatKerusakan}
                </span>
              </div>
            </div>
          </div>

          {/* Section C: Foto Fisik */}
          <div className="mb-5">
            <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase border-l-4 border-emerald-700 text-slate-800 mb-2">
              C. DOKUMENTASI FOTO HASIL SURVEI LAPANGAN (4 SISI)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="border border-slate-300 rounded p-1 text-center bg-slate-50">
                <img
                  src={entry.fotoDepan || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80'}
                  alt="Tampak Depan"
                  className="w-full h-24 object-cover rounded mb-1"
                />
                <span className="text-[10px] font-semibold text-slate-700">Tampak Depan</span>
              </div>

              <div className="border border-slate-300 rounded p-1 text-center bg-slate-50">
                <img
                  src={entry.fotoSampingKanan || entry.fotoDepan || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=400&q=80'}
                  alt="Tampak Samping Kanan"
                  className="w-full h-24 object-cover rounded mb-1"
                />
                <span className="text-[10px] font-semibold text-slate-700">Tampak Samping Kanan</span>
              </div>

              <div className="border border-slate-300 rounded p-1 text-center bg-slate-50">
                <img
                  src={entry.fotoSampingKiri || entry.fotoDepan || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80'}
                  alt="Tampak Samping Kiri"
                  className="w-full h-24 object-cover rounded mb-1"
                />
                <span className="text-[10px] font-semibold text-slate-700">Tampak Samping Kiri</span>
              </div>

              <div className="border border-slate-300 rounded p-1 text-center bg-slate-50">
                <img
                  src={entry.fotoBelakang || entry.fotoDepan || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=400&q=80'}
                  alt="Tampak Belakang"
                  className="w-full h-24 object-cover rounded mb-1"
                />
                <span className="text-[10px] font-semibold text-slate-700">Tampak Belakang</span>
              </div>
            </div>
          </div>

          {/* Section D: Rekomendasi Verifikator */}
          <div className="mb-6 p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs">
            <span className="font-bold text-slate-800">Catatan & Rekomendasi Tim Teknis Lapangan:</span>
            <p className="mt-1 text-slate-700 italic">
              "{entry.catatanVerifikator || 'Memenuhi syarat kriteria penerima bantuan stimulan perumahan swadaya / RTLH Kabupaten Konawe. Diusulkan prioritas pengalokasian anggaran.'}"
            </p>
            <div className="mt-2 flex items-center justify-between text-slate-600 font-medium">
              <span>Rekomendasi Skema: <strong>{entry.sumberDana || 'BSPS KemenPKP / DAU APBD'}</strong></span>
              <span>Status Administrasi: <strong>{entry.statusBantuan}</strong></span>
            </div>
          </div>

          {/* Signatures Block (4 columns) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs mt-8 pt-4 border-t border-slate-200">
            <div>
              <div className="text-[11px] text-slate-500 mb-14">Calon Penerima Bantuan,</div>
              <div className="font-bold text-slate-900 underline uppercase">{entry.namaKK}</div>
              <div className="text-[10px] text-slate-500">NIK: {entry.nik}</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 mb-14">Kepala Desa / Lurah,</div>
              <div className="font-bold text-slate-900 underline uppercase">( ........................................ )</div>
              <div className="text-[10px] text-slate-500">Cap & Tanda Tangan</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 mb-14">Tim Fasilitator Lapangan (TFL),</div>
              <div className="font-bold text-slate-900 underline uppercase">
                {entry.diverifikasiOleh || entry.surveyorName || 'Ahmad Faisal, S.P.'}
              </div>
              <div className="text-[10px] text-slate-500">Verifikator Teknis</div>
            </div>

            <div>
              <div className="text-[11px] text-slate-500 mb-14">Mengetahui,<br/>Kepala Bidang Perumahan,</div>
              <div className="font-bold text-slate-900 underline uppercase">Ir. Ruslan Hadinata, M.T.</div>
              <div className="text-[10px] text-slate-500">NIP. 19780512 200501 1 008</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
