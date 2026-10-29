import React, { useState, useEffect } from 'react';
import { RTLHEntry, KerusakanLevel, StatusBantuan, SumberDana } from '../types/rtlh';
import { KONAWE_KECAMATAN } from '../data/sampleKonaweData';
import { calculatePUPRScore } from '../utils/googleSheetsSync';
import { getDefaultPenilaian } from '../utils/standarPenilaian';
import { X, Plus, MapPin, Calculator, Camera, Save, Navigation } from 'lucide-react';

interface NewEntryModalProps {
  onClose: () => void;
  onAddEntry: (entry: RTLHEntry) => void;
}

export const NewEntryModal: React.FC<NewEntryModalProps> = ({
  onClose,
  onAddEntry,
}) => {
  // Personal Data
  const [namaKK, setNamaKK] = useState('');
  const [nik, setNik] = useState('');
  const [noKK, setNoKK] = useState('');
  const [pekerjaan, setPekerjaan] = useState('Petani / Buruh Harian');
  const [penghasilanBulanan, setPenghasilanBulanan] = useState(1200000);
  const [jumlahPenghuni, setJumlahPenghuni] = useState(4);
  const [luasRumahM2, setLuasRumahM2] = useState(36);
  const [statusKepemilikanTanah, setStatusKepemilikanTanah] = useState<'SHM' | 'Surat Keterangan Tanah (SKT)' | 'Bukan Milik Sendiri' | 'Warisan Belum Bagi'>('Surat Keterangan Tanah (SKT)');

  // Location
  const [kecamatan, setKecamatan] = useState('Unaaha');
  const [desaKelurahan, setDesaKelurahan] = useState('');
  const [dusunRtRw, setDusunRtRw] = useState('');
  const [latitude, setLatitude] = useState(-3.945);
  const [longitude, setLongitude] = useState(122.085);

  // Physical Components
  const [atap, setAtap] = useState('Seng berkarat parah dan bocor di banyak titik');
  const [dinding, setDinding] = useState('Gedek bambu bolong-bolong & tambalan papan lapuk');
  const [lantai, setLantai] = useState('Tanah liat tanpa pelapis');
  const [pondasi, setPondasi] = useState('Tidak ada pondasi, tiang kayu terbenam tanah');
  const [sanitasi, setSanitasi] = useState('Tidak ada jamban (Buang air besar di kali / kebun)');
  const [air, setAir] = useState('Sumur gali terbuka tidak terlindung');

  // Photos (4 Sisi) & Keterangan
  const [keteranganFisik, setKeteranganFisik] = useState('Dinding papan lapuk, atap seng bocor parah');
  const [fotoDepan, setFotoDepan] = useState('https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80');
  const [fotoSampingKanan, setFotoSampingKanan] = useState('https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80');
  const [fotoSampingKiri, setFotoSampingKiri] = useState('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80');
  const [fotoBelakang, setFotoBelakang] = useState('https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80');

  // Live Score
  const [liveScore, setLiveScore] = useState(85);
  const [liveLevel, setLiveLevel] = useState<KerusakanLevel>('Rusak Berat');

  useEffect(() => {
    const res = calculatePUPRScore({
      atap,
      dinding,
      lantai,
      pondasi,
      sanitasi,
      air,
    });
    setLiveScore(res.score);
    setLiveLevel(res.level);
  }, [atap, dinding, lantai, pondasi, sanitasi, air]);

  // Geolocation trigger
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(parseFloat(pos.coords.latitude.toFixed(5)));
          setLongitude(parseFloat(pos.coords.longitude.toFixed(5)));
        },
        () => {
          alert('Tidak dapat mengakses GPS browser. Pastikan izin lokasi diberikan.');
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKK.trim() || !nik.trim()) {
      alert('Nama Kepala Keluarga dan NIK wajib diisi.');
      return;
    }

    const newId = `RTLH-KNW-${Date.now().toString().slice(-4)}`;

    const newEntry: RTLHEntry = {
      id: newId,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      surveyorName: 'Fasilitator Lapangan Disperkim Konawe',
      namaKK,
      nik,
      noKK: noKK || '7402010000000000',
      pekerjaan,
      penghasilanBulanan,
      statusKepemilikanRumah: 'Milik Sendiri',
      statusKepemilikanTanah,
      provinsi: 'Sulawesi Tenggara',
      kabupaten: 'Konawe',
      kecamatan,
      desaKelurahan: desaKelurahan || 'Desa Baru',
      dusunRtRw: dusunRtRw || 'RT 01',
      latitude,
      longitude,
      kondisiFisik: {
        pondasi,
        kolomBalok: 'Kayu lokal kelas menengah',
        rangkaAtap: 'Rangka kayu lapuk',
        atap,
        dinding,
        lantai,
        ventilasiPencahayaan: 'Minim pencahayaan alami',
        sanitasiJamban: sanitasi,
        sumberAir: air,
        luasRumahM2,
        jumlahPenghuni,
      },
      skorKerusakan: liveScore,
      tingkatKerusakan: liveLevel,
      keteranganFisik,
      fotoDepan,
      fotoSampingKanan,
      fotoSampingKiri,
      fotoBelakang,
      statusBantuan: liveScore >= 70 ? 'Terverifikasi Lapangan' : 'Usulan Baru',
      sumberDana: liveScore >= 70 ? 'BSPS KemenPKP' : 'APBD Kab. Konawe',
      tahunAnggaran: 2026,
      catatanVerifikator: keteranganFisik,
    };

    newEntry.penilaianStandar = getDefaultPenilaian(newEntry);

    onAddEntry(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#081E3D] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-amber-300 border border-blue-400/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Input Survei Faktual RTLH Baru
              </h3>
              <p className="text-xs text-blue-200/80">
                Instrumen pendataan calon penerima bantuan dengan kalkulasi skor PUPR otomatis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Live PUPR Calculator Bar */}
          <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2.5">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[11px] text-slate-400 block">Kalkulasi Otomatis Tingkat Kerusakan (PUPR):</span>
                <span className="text-sm font-extrabold text-white">
                  Skor: <span className="text-emerald-400 font-mono">{liveScore}</span> / 100
                </span>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
              liveLevel === 'Rusak Berat' ? 'bg-red-500 text-white' :
              liveLevel === 'Rusak Sedang' ? 'bg-amber-500 text-white' :
              liveLevel === 'Rusak Ringan' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              {liveLevel}
            </span>
          </div>

          {/* Section 1: Data Kepala Keluarga */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wider text-emerald-700">
              1. Identitas Kepala Keluarga (Calon Penerima)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Lengkap KK *:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: La Ode Hasim"
                  value={namaKK}
                  onChange={(e) => setNamaKK(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">NIK (16 Digit) *:</label>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="740201..."
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nomor Kartu Keluarga (No KK):</label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="7402..."
                  value={noKK}
                  onChange={(e) => setNoKK(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pekerjaan:</label>
                <input
                  type="text"
                  value={pekerjaan}
                  onChange={(e) => setPekerjaan(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Penghasilan Bulanan (Rp):</label>
                <input
                  type="number"
                  value={penghasilanBulanan}
                  onChange={(e) => setPenghasilanBulanan(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Jumlah Anggota Keluarga (Jiwa):</label>
                <input
                  type="number"
                  min={1}
                  value={jumlahPenghuni}
                  onChange={(e) => setJumlahPenghuni(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Lokasi & Titik GPS */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wider text-emerald-700">
              2. Lokasi Administratif & Koordinat Geospasial
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Kecamatan:</label>
                <select
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {KONAWE_KECAMATAN.filter(k => k !== 'Semua Kecamatan').map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Desa / Kelurahan:</label>
                <input
                  type="text"
                  placeholder="Nama Desa / Kelurahan"
                  value={desaKelurahan}
                  onChange={(e) => setDesaKelurahan(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Dusun / RT / RW:</label>
                <input
                  type="text"
                  placeholder="Dusun II RT 03"
                  value={dusunRtRw}
                  onChange={(e) => setDusunRtRw(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Latitude:</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Longitude:</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ambil GPS Sekarang</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Komponen Kerusakan PUPR */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wider text-emerald-700">
              3. Penilaian Komponen Fisik Rumah (Skoring PUPR)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Kondisi Penutup & Rangka Atap:</label>
                <select
                  value={atap}
                  onChange={(e) => setAtap(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Seng berkarat parah dan bocor di banyak titik">Seng berkarat parah & bocor banyak (Kritis)</option>
                  <option value="Atap daun rumbia lapuk dan berlubang">Daun rumbia lapuk & bolong (Kritis)</option>
                  <option value="Seng bekas karat ringan ada bocor kecil">Seng bekas / karat ringan</option>
                  <option value="Atap genteng / metal baik tidak bocor">Atap baik dan kokoh</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Kondisi Dinding:</label>
                <select
                  value={dinding}
                  onChange={(e) => setDinding(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Gedek bambu bolong-bolong & tambalan papan lapuk">Gedek bambu bolong / papan lapuk (Kritis)</option>
                  <option value="Batako mentah belum diplester retak">Batako belum diplester</option>
                  <option value="Papan kayu renggang">Papan kayu renggang</option>
                  <option value="Dinding tembok plester rapi kokoh">Dinding plester kokoh dan rapi</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Kondisi Lantai:</label>
                <select
                  value={lantai}
                  onChange={(e) => setLantai(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Tanah liat tanpa pelapis">Tanah liat / becek (Kritis)</option>
                  <option value="Papan panggung patah & lapuk">Papan kayu panggung patah</option>
                  <option value="Plester semen kasar retak mengelupas">Semen retak mengelupas</option>
                  <option value="Keramik / plesteran semen halus">Keramik / Semen halus baik</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pondasi & Struktur:</label>
                <select
                  value={pondasi}
                  onChange={(e) => setPondasi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Tidak ada pondasi, tiang kayu terbenam tanah">Tidak ada pondasi / tiang lapuk (Kritis)</option>
                  <option value="Pondasi batu kali retak atau miring">Pondasi batu miring / retak</option>
                  <option value="Pondasi batu kali kokoh dengan sloof bertulang">Pondasi batu kali kokoh bertulang</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Sanitasi & Jamban:</label>
                <select
                  value={sanitasi}
                  onChange={(e) => setSanitasi(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Tidak ada jamban (Buang air besar di kali / kebun)">Tidak ada jamban / Buang di sungai</option>
                  <option value="Jamban cemplung tanpa tangki septik">Jamban cemplung / cubluk</option>
                  <option value="Kloset leher angsa dengan tangki septik aman">Kloset leher angsa septictank aman</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Akses Air Minum:</label>
                <select
                  value={air}
                  onChange={(e) => setAir(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-1.5 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Sungai / mata air terbuka tidak terlindung">Sungai / Air terbuka tidak terlindung</option>
                  <option value="Tadahan air hujan">Tadahan air hujan</option>
                  <option value="Sumur gali">Sumur gali</option>
                  <option value="Sumur bor terlindung / PDAM">Sumur bor terlindung / PDAM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Keterangan Fisik & 4 Dokumentasi Foto Google Form */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wider text-emerald-700">
              4. Keterangan Fisik & 4 Sudut Foto Rumah
            </h4>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Keterangan Fisik Kondisi Rumah:</label>
              <textarea
                rows={2}
                placeholder="Contoh: Dinding papan sudah lapuk sangat parah, atap bocor di banyak titik..."
                value={keteranganFisik}
                onChange={(e) => setKeteranganFisik(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Foto Rumah (Tampak Depan):</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  value={fotoDepan}
                  onChange={(e) => setFotoDepan(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Foto Rumah (Tampak Samping Kanan):</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  value={fotoSampingKanan}
                  onChange={(e) => setFotoSampingKanan(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Foto Rumah (Tampak Samping Kiri):</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  value={fotoSampingKiri}
                  onChange={(e) => setFotoSampingKiri(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Foto Rumah (Tampak Belakang):</label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/..."
                  value={fotoBelakang}
                  onChange={(e) => setFotoBelakang(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Usulan Faktual</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
