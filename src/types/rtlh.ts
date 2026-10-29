export type KerusakanLevel = 'Rusak Berat' | 'Rusak Sedang' | 'Rusak Ringan' | 'Layak Huni';

export type StatusBantuan = 
  | 'Usulan Baru'
  | 'Terverifikasi Lapangan'
  | 'Calon Penerima (Masuk SK)'
  | 'Proses Pembangunan'
  | 'Bantuan Selesai'
  | 'Ditolak / Tidak Memenuhi Syarat';

export type SumberDana = 
  | 'BSPS KemenPKP' 
  | 'APBD Kab. Konawe' 
  | 'APBD Provinsi' 
  | 'Baznas' 
  | 'Dana Desa' 
  | 'CSR Perusahaan' 
  | 'Swadaya / Mandiri' 
  | 'Belum Ditentukan'
  | 'DAU APBD Konawe';

export type RatingKondisi = 'A' | 'B' | 'C';

export interface StandarPenilaianRTLH {
  // 1. STRUKTUR
  fondasi: RatingKondisi;
  sloof: RatingKondisi;
  kolom: RatingKondisi;
  ringBalok: RatingKondisi;
  rangkaAtap: RatingKondisi;

  // 2. NON-STRUKTUR
  dinding: RatingKondisi;
  lantai: RatingKondisi;
  penutupAtap: RatingKondisi;

  // 3. KESEHATAN & KECUKUPAN LUAS
  aksesAirMinum: 'A' | 'C';
  aksesSanitasi: 'A' | 'C';
  pencahayaan: RatingKondisi;
  penghawaan: RatingKondisi;
  kecukupanLuasRuang: 'A' | 'C';

  // 4. STATUS LAHAN
  statusPenguasaanLahan: RatingKondisi;
}

export interface KomponenFisik {
  pondasi: string; // e.g. "Batu kali retak parah", "Tidak ada pondasi"
  kolomBalok: string; // "Kayu lapuk", "Retak struktural"
  rangkaAtap: string; // "Kayu lapuk keropos", "Reng renggang"
  atap: string; // "Seng berkarat bocor", "Rumbia lapuk"
  dinding: string; // "Papan lapuk berlubang", "Gedek bambu", "Batako tanpa plester"
  lantai: string; // "Tanah liat", "Semen pecah-pecah", "Papan panggung lapuk"
  ventilasiPencahayaan: string; // "Kurang / Gelap", "Cukup"
  sanitasiJamban: string; // "Tidak ada / Sungai", "Jamban cemplung", "Jamban leher angsa"
  sumberAir: string; // "Sumur gali tidak terlindung", "Mata air / sungai", "PDAM", "Sumur bor"
  luasRumahM2: number;
  jumlahPenghuni: number;
}

export interface RTLHEntry {
  id: string;
  timestamp: string; // Tanggal survey
  surveyorName: string;
  
  // Data Kepala Keluarga
  namaKK: string;
  nik: string;
  noKK: string;
  jenisKelamin?: 'L' | 'P' | string;
  umur?: number;
  pekerjaan: string;
  penghasilanBulanan: number;
  nilaiUmpUmk?: number;
  lamaMenghuniTahun?: number;
  asetRumahLain?: boolean;
  bersediaKetentuan?: boolean;
  statusKepemilikanRumah: 'Milik Sendiri' | 'Menumpang' | 'Sewa' | 'Tanah Adat / Hibah';
  statusKepemilikanTanah: 'SHM' | 'Surat Keterangan Tanah (SKT)' | 'Bukan Milik Sendiri' | 'Warisan Belum Bagi' | 'Tanah Adat / Hibah';
  
  // Lokasi
  alamatKK?: string;
  rtRw?: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  desaKelurahan: string;
  dusunRtRw: string;
  latitude: number;
  longitude: number;
  
  // Kondisi Teknis
  kondisiFisik: KomponenFisik;
  skorKerusakan: number; // 0 - 100
  tingkatKerusakan: KerusakanLevel;
  penilaianStandar?: StandarPenilaianRTLH;
  
  // Dokumentasi 4 Sisi (Standar Google Form Disperkim Konawe)
  keteranganFisik?: string;
  fotoDepan?: string;
  fotoSampingKanan?: string;
  fotoSampingKiri?: string;
  fotoBelakang?: string;
  fotoDalam?: string;
  fotoDinding?: string;
  fotoLantai?: string;
  fotoAtap?: string;
  fotoSanitasi?: string;
  
  // Administrasi Bantuan
  statusBantuan: StatusBantuan;
  sumberDana: SumberDana;
  tahunAnggaran: number;
  catatanVerifikator?: string;
  diverifikasiOleh?: string;
  tanggalVerifikasi?: string;
}

export interface GoogleSheetsConfig {
  sheetUrl: string;
  sheetId: string;
  formUrl: string;
  lastSyncedAt?: string;
  autoSync: boolean;
  columnMapping: Record<string, string>; // internalKey -> spreadsheetHeader
}

export interface RTLHFilter {
  search: string;
  kecamatan: string;
  desa: string;
  tingkatKerusakan: string;
  statusBantuan: string;
  sumberDana: string;
  minSkor?: number;
}
