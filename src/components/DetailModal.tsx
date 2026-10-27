import React, { useState } from 'react';
import { RTLHEntry, StatusBantuan, SumberDana } from '../types/rtlh';
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
  Image as ImageIcon
} from 'lucide-react';

interface DetailModalProps {
  entry: RTLHEntry | null;
  onClose: () => void;
  onUpdateEntry: (updated: RTLHEntry) => void;
  onOpenVerification: (entry: RTLHEntry) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  entry,
  onClose,
  onUpdateEntry,
  onOpenVerification,
}) => {
  if (!entry) return null;

  const [statusBantuan, setStatusBantuan] = useState<StatusBantuan>(entry.statusBantuan);
  const [sumberDana, setSumberDana] = useState<SumberDana>(entry.sumberDana);
  const [catatan, setCatatan] = useState(entry.catatanVerifikator || '');
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSave = () => {
    onUpdateEntry({
      ...entry,
      statusBantuan,
      sumberDana,
      catatanVerifikator: catatan,
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${entry.latitude},${entry.longitude}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">{entry.namaKK}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  entry.tingkatKerusakan === 'Rusak Berat' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                  entry.tingkatKerusakan === 'Rusak Sedang' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {entry.tingkatKerusakan} (Skor: {entry.skorKerusakan})
                </span>
              </div>
              <p className="text-xs text-slate-400">
                NIK: {entry.nik} • ID: {entry.id}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenVerification(entry)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-sm"
              title="Cetak Berita Acara Lapangan"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Berita Acara</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
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

          {/* Profil KK & Wilayah */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Kartu Profil KK */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-600" />
                <span>Identitas Kepala Keluarga</span>
              </h5>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Nama Lengkap:</span>
                  <span className="font-bold text-slate-800">{entry.namaKK}</span>
                </div>
                <div className="flex justify-between">
                  <span>NIK (KTP):</span>
                  <span className="font-mono text-slate-800">{entry.nik}</span>
                </div>
                <div className="flex justify-between">
                  <span>No Kartu Keluarga:</span>
                  <span className="font-mono text-slate-800">{entry.noKK}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pekerjaan:</span>
                  <span className="text-slate-800">{entry.pekerjaan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Penghasilan:</span>
                  <span className="font-semibold text-slate-800">Rp {(entry.penghasilanBulanan || 0).toLocaleString('id-ID')}/bln</span>
                </div>
                <div className="flex justify-between">
                  <span>Jumlah Penghuni:</span>
                  <span className="text-slate-800">{entry.kondisiFisik.jumlahPenghuni} Jiwa</span>
                </div>
                <div className="flex justify-between">
                  <span>Legalitas Tanah:</span>
                  <span className="text-slate-800">{entry.statusKepemilikanTanah}</span>
                </div>
              </div>
            </div>

            {/* Kartu Lokasi */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lokasi Geospasial</span>
              </h5>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Kecamatan:</span>
                  <span className="font-bold text-slate-800">{entry.kecamatan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Desa / Kelurahan:</span>
                  <span className="font-bold text-slate-800">{entry.desaKelurahan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dusun / RT / RW:</span>
                  <span className="text-slate-800">{entry.dusunRtRw}</span>
                </div>
                <div className="flex justify-between">
                  <span>Titik GPS:</span>
                  <span className="font-mono text-slate-800">{entry.latitude.toFixed(5)}, {entry.longitude.toFixed(5)}</span>
                </div>
              </div>
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-semibold transition"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          {/* Rincian Komponen Teknis PUPR */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              <span>Rincian Kerusakan Fisik Bangunan (Standar PUPR)</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <span className="text-slate-500 font-medium">Kondisi Atap:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{entry.kondisiFisik.atap}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Kondisi Dinding:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{entry.kondisiFisik.dinding}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Kondisi Lantai:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{entry.kondisiFisik.lantai}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Struktur Pondasi & Tiang:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{entry.kondisiFisik.pondasi}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Sanitasi & Jamban:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{entry.kondisiFisik.sanitasiJamban}</p>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Akses Air Bersih:</span>
                <p className="font-semibold text-slate-800 mt-0.5">{entry.kondisiFisik.sumberAir}</p>
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
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
