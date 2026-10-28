import { StandarPenilaianRTLH, RatingKondisi, RTLHEntry, KerusakanLevel } from '../types/rtlh';

export interface KomponenStandarItem {
  id: keyof StandarPenilaianRTLH;
  kategori: string;
  namaKomponen: string;
  opsiA: string;
  opsiB: string | null;
  opsiC: string;
}

export const DAFTAR_KOMPONEN_STANDAR: KomponenStandarItem[] = [
  // 1. STRUKTUR
  {
    id: 'fondasi',
    kategori: '1. STRUKTUR',
    namaKomponen: 'Fondasi',
    opsiA: 'ada, kondisi baik, kokoh',
    opsiB: 'ada, sebagian rapuh, tidak kokoh',
    opsiC: 'tidak ada, seluruhnya rapuh',
  },
  {
    id: 'sloof',
    kategori: '1. STRUKTUR',
    namaKomponen: 'Sloof',
    opsiA: 'ada, kondisi baik, kokoh',
    opsiB: 'ada, sebagian rapuh, tidak kokoh',
    opsiC: 'tidak ada, seluruhnya rapuh',
  },
  {
    id: 'kolom',
    kategori: '1. STRUKTUR',
    namaKomponen: 'Kolom',
    opsiA: 'ada, kondisi baik, kokoh',
    opsiB: 'ada, sebagian rapuh, tidak kokoh',
    opsiC: 'tidak ada, seluruhnya rapuh',
  },
  {
    id: 'ringBalok',
    kategori: '1. STRUKTUR',
    namaKomponen: 'Ring Balok',
    opsiA: 'ada, kondisi baik, kokoh',
    opsiB: 'ada, sebagian rapuh, tidak kokoh',
    opsiC: 'tidak ada, seluruhnya rapuh',
  },
  {
    id: 'rangkaAtap',
    kategori: '1. STRUKTUR',
    namaKomponen: 'Rangka Atap',
    opsiA: 'ada, kondisi baik, kokoh',
    opsiB: 'ada, sebagian rapuh, tidak kokoh',
    opsiC: 'tidak ada, seluruhnya rapuh',
  },

  // 2. NON-STRUKTUR
  {
    id: 'dinding',
    kategori: '2. NON-STRUKTUR',
    namaKomponen: 'Dinding',
    opsiA: 'Tembok/setengah tembok diplester, papan kayu berkualitas, bahan dinding dengan kondisi kokoh dan kedap air',
    opsiB: 'tembok kondisi sebagian besar retak, papan atau bahan lain yang kurang kokoh dan tidak kedap air',
    opsiC: 'anyaman bambu tipis, triplek, papan, tembok, atau bahan lain yang rapuh dan tidak kedap air',
  },
  {
    id: 'lantai',
    kategori: '2. NON-STRUKTUR',
    namaKomponen: 'Lantai',
    opsiA: 'Plester/ubin/keramik/papan/bahan lain kondisi baik, kedap air',
    opsiB: 'papan atau bahan lain dengan kondisi rusak, plester sebagian besar pecah',
    opsiC: 'tanah, papan atau bahan lain yang rapuh dan tidak kedap air',
  },
  {
    id: 'penutupAtap',
    kategori: '2. NON-STRUKTUR',
    namaKomponen: 'Penutup Atap',
    opsiA: 'genteng/seng/spandek, bahan tradisional (ijuk/rumbia)/bahan lain kondisi baik, tidak bocor',
    opsiB: 'genteng/seng/spandek, bahan tradisional (ijuk/rumbia)/bahan lain, kondisi rusak sebagian, bocor jika terjadi hujan lebat',
    opsiC: 'asbes, bahan non asbes dengan kondisi rusak berat, sering bocor jika hujan, rawan ambruk',
  },

  // 3. KESEHATAN & KECUKUPAN LUAS
  {
    id: 'aksesAirMinum',
    kategori: '3. KESEHATAN & KECUKUPAN LUAS',
    namaKomponen: 'Akses Air Minum',
    opsiA: 'Ada',
    opsiB: null,
    opsiC: 'Tidak Ada',
  },
  {
    id: 'aksesSanitasi',
    kategori: '3. KESEHATAN & KECUKUPAN LUAS',
    namaKomponen: 'Akses Sanitasi',
    opsiA: 'Ada',
    opsiB: null,
    opsiC: 'Tidak Ada',
  },
  {
    id: 'pencahayaan',
    kategori: '3. KESEHATAN & KECUKUPAN LUAS',
    namaKomponen: 'Pencahayaan',
    opsiA: 'Terang, dapat digunakan membaca dengan normal tanpa pencahayaan buatan pada siang hari',
    opsiB: 'kurang terang sehingga kurang jelas untuk membaca dengan normal, memerlukan pencahayaan buatan pada siang hari',
    opsiC: 'gelap, tidak dapat digunakan untuk membaca tanpa pencahayaan buatan pada siang hari',
  },
  {
    id: 'penghawaan',
    kategori: '3. KESEHATAN & KECUKUPAN LUAS',
    namaKomponen: 'Penghawaan',
    opsiA: 'cukup ventilasi, sirkulasi udara baik',
    opsiB: 'ventilasi kurang, agak pengap',
    opsiC: 'tidak ada ventilasi, pengap, lembab',
  },
  {
    id: 'kecukupanLuasRuang',
    kategori: '3. KESEHATAN & KECUKUPAN LUAS',
    namaKomponen: 'Kecukupan luas ruang',
    opsiA: 'luas rumah dibagi jumlah penghuni, lebih atau sama dengan 7,2 m2',
    opsiB: null,
    opsiC: 'luas rumah dibagi jumlah penghuni, kurang dari 7,2 m2',
  },

  // 4. STATUS LAHAN
  {
    id: 'statusPenguasaanLahan',
    kategori: '4. STATUS LAHAN',
    namaKomponen: 'Status penguasaan lahan',
    opsiA: 'milik sendiri, ada bukti sah',
    opsiB: 'sewa/pinjam pakai/izin tinggal/menumpang, ada bukti sah',
    opsiC: 'tanpa bukti sah/ilegal',
  },
];

export const KATEGORI_STANDAR = [
  '1. STRUKTUR',
  '2. NON-STRUKTUR',
  '3. KESEHATAN & KECUKUPAN LUAS',
  '4. STATUS LAHAN',
];

/**
 * Returns default or existing standard assessment for an entry.
 */
export function getDefaultPenilaian(entry: Partial<RTLHEntry>): StandarPenilaianRTLH {
  if (entry.penilaianStandar) {
    return { ...entry.penilaianStandar };
  }

  const level = entry.tingkatKerusakan || 'Rusak Sedang';
  const kf = entry.kondisiFisik;

  // Struktur default
  const defaultStruktur: RatingKondisi = 
    level === 'Rusak Berat' ? 'C' :
    level === 'Rusak Sedang' ? 'B' : 'A';

  // Luas per jiwa check
  const luasPerJiwa = (kf && kf.jumlahPenghuni && kf.jumlahPenghuni > 0)
    ? (kf.luasRumahM2 / kf.jumlahPenghuni)
    : 8;
  const luasRating = luasPerJiwa >= 7.2 ? 'A' : 'C';

  // Sanitasi check
  const sanitasiAda = kf?.sanitasiJamban && !kf.sanitasiJamban.toLowerCase().includes('tidak ada');
  const airAda = kf?.sumberAir && !kf.sumberAir.toLowerCase().includes('tidak ada');

  // Status lahan check
  const isMilikSendiri = entry.statusKepemilikanTanah === 'SHM' || entry.statusKepemilikanRumah === 'Milik Sendiri';
  const isMenumpang = entry.statusKepemilikanRumah === 'Menumpang' || entry.statusKepemilikanRumah === 'Sewa';
  const lahanRating: RatingKondisi = isMilikSendiri ? 'A' : isMenumpang ? 'B' : 'C';

  return {
    fondasi: defaultStruktur,
    sloof: defaultStruktur,
    kolom: defaultStruktur,
    ringBalok: defaultStruktur,
    rangkaAtap: defaultStruktur,
    dinding: level === 'Rusak Berat' ? 'C' : level === 'Rusak Sedang' ? 'B' : 'A',
    lantai: level === 'Rusak Berat' ? 'C' : level === 'Rusak Sedang' ? 'B' : 'A',
    penutupAtap: level === 'Rusak Berat' ? 'C' : level === 'Rusak Sedang' ? 'B' : 'A',
    aksesAirMinum: airAda ? 'A' : 'C',
    aksesSanitasi: sanitasiAda ? 'A' : 'C',
    pencahayaan: level === 'Rusak Berat' ? 'C' : level === 'Rusak Sedang' ? 'B' : 'A',
    penghawaan: level === 'Rusak Berat' ? 'C' : level === 'Rusak Sedang' ? 'B' : 'A',
    kecukupanLuasRuang: luasRating,
    statusPenguasaanLahan: lahanRating,
  };
}

/**
 * Calculates numeric score (0 - 100) and KerusakanLevel from ticked standard items.
 * A = 0 points (Baik / Memenuhi)
 * B = 50 points (Rusak Sedang / Kurang Memenuhi)
 * C = 100 points (Rusak Berat / Tidak Memenuhi)
 * Weights:
 * - Struktur: 50%
 * - Non-Struktur: 30%
 * - Kesehatan & Luas: 15%
 * - Status Lahan: 5%
 */
export function calculateScoreFromPenilaian(penilaian: StandarPenilaianRTLH): {
  skor: number;
  tingkat: KerusakanLevel;
} {
  const scoreValue = (val: RatingKondisi): number => {
    if (val === 'C') return 100;
    if (val === 'B') return 50;
    return 0;
  };

  // Struktur (5 items)
  const strukturScores = [
    scoreValue(penilaian.fondasi),
    scoreValue(penilaian.sloof),
    scoreValue(penilaian.kolom),
    scoreValue(penilaian.ringBalok),
    scoreValue(penilaian.rangkaAtap),
  ];
  const avgStruktur = strukturScores.reduce((a, b) => a + b, 0) / strukturScores.length;

  // Non-struktur (3 items)
  const nonStrukturScores = [
    scoreValue(penilaian.dinding),
    scoreValue(penilaian.lantai),
    scoreValue(penilaian.penutupAtap),
  ];
  const avgNonStruktur = nonStrukturScores.reduce((a, b) => a + b, 0) / nonStrukturScores.length;

  // Kesehatan & Luas (5 items)
  const kesehatanScores = [
    scoreValue(penilaian.aksesAirMinum),
    scoreValue(penilaian.aksesSanitasi),
    scoreValue(penilaian.pencahayaan),
    scoreValue(penilaian.penghawaan),
    scoreValue(penilaian.kecukupanLuasRuang),
  ];
  const avgKesehatan = kesehatanScores.reduce((a, b) => a + b, 0) / kesehatanScores.length;

  // Status Lahan (1 item)
  const avgLahan = scoreValue(penilaian.statusPenguasaanLahan);

  // Total weighted score (0 - 100)
  const totalSkor = Math.round(
    (avgStruktur * 0.50) +
    (avgNonStruktur * 0.30) +
    (avgKesehatan * 0.15) +
    (avgLahan * 0.05)
  );

  let tingkat: KerusakanLevel = 'Layak Huni';
  if (totalSkor >= 70 || avgStruktur >= 60) {
    tingkat = 'Rusak Berat';
  } else if (totalSkor >= 40) {
    tingkat = 'Rusak Sedang';
  } else if (totalSkor >= 20) {
    tingkat = 'Rusak Ringan';
  }

  return { skor: totalSkor, tingkat };
}
