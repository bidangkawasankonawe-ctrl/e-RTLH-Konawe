import Papa from 'papaparse';
import { RTLHEntry, KerusakanLevel, StatusBantuan, SumberDana } from '../types/rtlh';

export interface ColumnDetection {
  key: keyof RTLHEntry | 'koordinat' | 'atap' | 'dinding' | 'lantai' | 'pondasi' | 'sanitasi' | 'air';
  label: string;
  matchedHeader?: string;
  confidence: number;
}

export const KNOWN_COLUMN_MAPPINGS: { key: string; label: string; keywords: string[] }[] = [
  { key: 'namaKK', label: 'Nama KK (Kepala Keluarga)', keywords: ['nama kepala keluarga', 'nama kk', 'nama lengkap', 'nama penerima', 'nama calon', 'calon penerima', 'nama'] },
  { key: 'dusunRtRw', label: 'RT / RW / Dusun', keywords: ['rt / rw', 'rt/rw', 'rt. / rw', 'rt', 'rw', 'dusun', 'alamat lengkap (rt/rw)', 'alamat lengkap', 'alamat', 'lingkungan', 'jalan'] },
  { key: 'nik', label: 'NIK (KTP)', keywords: ['nik (ktp)', 'nik', 'nomor induk', 'no ktp', 'ktp', 'nik ktp'] },
  { key: 'noKK', label: 'Nomor KK (Kartu Keluarga)', keywords: ['nomor kk (kartu keluarga)', 'nomor kk', 'no kk', 'kartu keluarga', 'nomor kartu', 'no. kk'] },
  { key: 'desaKelurahan', label: 'Desa / Kelurahan', keywords: ['desa / kelurahan', 'desa/kelurahan', 'desa', 'kelurahan', 'kampung', 'desa/kel'] },
  { key: 'kecamatan', label: 'Kecamatan', keywords: ['kecamatan', 'distrik', 'wilayah'] },
  { key: 'keteranganFisik', label: 'Keterangan Fisik Kondisi Rumah', keywords: ['keterangan fisik kondisi rumah', 'keterangan fisik', 'kondisi fisik', 'kondisi rumah', 'keterangan', 'deskripsi kerusakan', 'kondisi bangunan'] },
  { key: 'fotoDepan', label: 'Foto Rumah (Tampak Depan)', keywords: ['foto rumah (tampak depan)', 'tampak depan', 'foto depan', 'foto rumah', 'foto tampak depan', 'depan'] },
  { key: 'fotoSampingKiri', label: 'Foto Rumah (Tampak Samping Kiri)', keywords: ['foto rumah (tampak samping kiri)', 'tampak samping kiri', 'samping kiri', 'foto samping kiri', 'foto tampak samping kiri', 'foto tampak kiri', 'tampak kiri', 'kiri'] },
  { key: 'fotoSampingKanan', label: 'Foto Rumah (Tampak Samping Kanan)', keywords: ['foto rumah (tampak samping kanan)', 'tampak samping kanan', 'samping kanan', 'foto samping kanan', 'foto tampak samping kanan', 'foto tampak kanan', 'tampak kanan', 'kanan'] },
  { key: 'fotoBelakang', label: 'Foto Rumah (Tampak Belakang)', keywords: ['foto rumah (tampak belakang)', 'tampak belakang', 'foto belakang', 'foto tampak belakang', 'belakang'] },
  { key: 'timestamp', label: 'Waktu / Timestamp', keywords: ['timestamp', 'waktu', 'tanggal', 'date', 'recorded'] },
  { key: 'surveyorName', label: 'Nama Surveyor / Petugas', keywords: ['surveyor', 'petugas', 'pencatat', 'nama verifikator', 'fasilitator', 'email'] },
  { key: 'pekerjaan', label: 'Pekerjaan', keywords: ['pekerjaan', 'profesi', 'mata pencaharian'] },
  { key: 'penghasilanBulanan', label: 'Penghasilan Bulanan', keywords: ['penghasilan', 'pendapatan', 'gaji', 'upah'] },
  { key: 'koordinat', label: 'Titik Koordinat / GPS', keywords: ['koordinat', 'gps', 'latitude', 'lat/long', 'lat, long', 'titik lokasi', 'map'] },
  { key: 'tingkatKerusakan', label: 'Tingkat Kerusakan', keywords: ['tingkat kerusakan', 'kategori kerusakan', 'kategori rtlh', 'kelayakan', 'rusak'] },
  { key: 'statusBantuan', label: 'Status Bantuan / Verifikasi', keywords: ['status bantuan', 'status', 'verifikasi', 'tahap bantuan'] },
];

/**
 * Parses Google Sheets URL into downloadable CSV URL or ID
 */
export function extractGoogleSheetInfo(rawUrl: string): { sheetId: string; exportCsvUrl: string; valid: boolean } {
  const trimmed = rawUrl.trim();
  if (!trimmed) return { sheetId: '', exportCsvUrl: '', valid: false };

  // If already a CSV url
  if (trimmed.includes('format=csv') || trimmed.includes('output=csv')) {
    return { sheetId: 'direct-csv', exportCsvUrl: trimmed, valid: true };
  }

  // Extract /d/{sheetId}/
  const matches = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (matches && matches[1]) {
    const sheetId = matches[1];
    // Check if there is gid (sheet tab)
    const gidMatch = trimmed.match(/[?&#]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '0';
    
    // Construct Google Visualization query CSV export or export?format=csv
    const exportCsvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    return { sheetId, exportCsvUrl, valid: true };
  }

  // Published web format: /d/e/{publishId}/pub?output=csv
  const pubMatch = trimmed.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
  if (pubMatch && pubMatch[1]) {
    const sheetId = pubMatch[1];
    let exportCsvUrl = trimmed;
    if (trimmed.includes('/pubhtml') || trimmed.includes('/pub')) {
      exportCsvUrl = trimmed.replace(/\/pubhtml.*/, '/pub?output=csv').replace(/\/pub$/, '/pub?output=csv');
      if (!exportCsvUrl.includes('output=csv')) {
        exportCsvUrl += '?output=csv';
      }
    }
    return { sheetId, exportCsvUrl, valid: true };
  }

  return { sheetId: '', exportCsvUrl: trimmed, valid: false };
}

/**
 * Parse coordinates string into latitude & longitude numbers
 * Handles:
 * - "-3.9054, 122.1287"
 * - "-3.9054 122.1287"
 * - "Lat: -3.9054 Long: 122.1287"
 * - Google Maps URL or coordinates
 */
export function parseCoordinates(val: string | undefined): { lat: number; lng: number } {
  // Default center around Unaaha, Konawe (-3.95, 122.08)
  const defaultCenter = { lat: -3.94 + (Math.random() * 0.08 - 0.04), lng: 122.08 + (Math.random() * 0.08 - 0.04) };
  if (!val || typeof val !== 'string') return defaultCenter;

  const clean = val.replace(/[^0-9.,\- ]/g, ' ').trim();
  const parts = clean.split(/[,\s]+/).map(p => parseFloat(p)).filter(p => !isNaN(p));
  
  if (parts.length >= 2) {
    let lat = parts[0];
    let lng = parts[1];
    
    // In Southeast Sulawesi / Konawe, latitude is negative (~ -3.5 to -4.5), longitude is ~ 121.5 to 123.0
    if (lat > 100 && lng < 0) {
      // Swapped
      const temp = lat;
      lat = lng;
      lng = temp;
    }
    
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  return defaultCenter;
}

/**
 * Calculate RTLH score and category based on PUPR guidelines
 */
export function calculatePUPRScore(komponen: {
  atap?: string;
  dinding?: string;
  lantai?: string;
  pondasi?: string;
  sanitasi?: string;
  air?: string;
}): { score: number; level: KerusakanLevel } {
  let score = 0;
  
  const textAtap = (komponen.atap || '').toLowerCase();
  const textDinding = (komponen.dinding || '').toLowerCase();
  const textLantai = (komponen.lantai || '').toLowerCase();
  const textPondasi = (komponen.pondasi || '').toLowerCase();
  const textSanitasi = (komponen.sanitasi || '').toLowerCase();
  const textAir = (komponen.air || '').toLowerCase();

  // Atap (Weight: 25)
  if (textAtap.includes('rumbia') || textAtap.includes('daun') || textAtap.includes('karat parah') || textAtap.includes('bocor parah') || textAtap.includes('roboh') || textAtap.includes('lapuk')) {
    score += 25;
  } else if (textAtap.includes('karat') || textAtap.includes('bocor') || textAtap.includes('retak') || textAtap.includes('renggang')) {
    score += 15;
  } else if (textAtap.includes('seng bekas') || textAtap.includes('asbes')) {
    score += 8;
  }

  // Dinding (Weight: 25)
  if (textDinding.includes('gedek') || textDinding.includes('anyaman') || textDinding.includes('bambu bolong') || textDinding.includes('papan lapuk') || textDinding.includes('terpal') || textDinding.includes('kulit kayu')) {
    score += 25;
  } else if (textDinding.includes('batako tanpa plester') || textDinding.includes('kalsiboard retak') || textDinding.includes('papan renggang')) {
    score += 15;
  } else if (textDinding.includes('papan kayu') || textDinding.includes('belum diaci')) {
    score += 8;
  }

  // Lantai (Weight: 20)
  if (textLantai.includes('tanah') || textLantai.includes('bambu patah') || textLantai.includes('papan patah')) {
    score += 20;
  } else if (textLantai.includes('semen retak') || textLantai.includes('semen kasar') || textLantai.includes('papan lapuk') || textLantai.includes('hancur')) {
    score += 12;
  } else if (textLantai.includes('semen biasa')) {
    score += 5;
  }

  // Pondasi / Balok (Weight: 15)
  if (textPondasi.includes('tidak ada') || textPondasi.includes('amblas') || textPondasi.includes('patah') || textPondasi.includes('tiang lapuk') || textPondasi.includes('miring')) {
    score += 15;
  } else if (textPondasi.includes('kayu') || textPondasi.includes('batu kosong') || textPondasi.includes('tanpa sloof')) {
    score += 8;
  }

  // Sanitasi (Weight: 10)
  if (textSanitasi.includes('tidak ada') || textSanitasi.includes('sungai') || textSanitasi.includes('kali') || textSanitasi.includes('kebun') || textSanitasi.includes('menumpang')) {
    score += 10;
  } else if (textSanitasi.includes('cemplung') || textSanitasi.includes('cubluk') || textSanitasi.includes('tanpa septictank')) {
    score += 6;
  }

  // Air Bersih (Weight: 5)
  if (textAir.includes('sungai') || textAir.includes('tadahan hujan') || textAir.includes('tidak terlindung')) {
    score += 5;
  } else if (textAir.includes('sumur gali') || textAir.includes('membeli')) {
    score += 2;
  }

  // Cap at 100
  score = Math.min(100, Math.max(5, score));

  let level: KerusakanLevel = 'Layak Huni';
  if (score >= 70) level = 'Rusak Berat';
  else if (score >= 45) level = 'Rusak Sedang';
  else if (score >= 25) level = 'Rusak Ringan';

  return { score, level };
}

/**
 * Guess best matching headers from raw spreadsheet headers
 */
export function autoDetectColumns(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};

  for (const def of KNOWN_COLUMN_MAPPINGS) {
    let bestMatch = '';
    let highestScore = 0;

    for (const h of headers) {
      const lower = h.toLowerCase().trim();
      for (const kw of def.keywords) {
        if (lower === kw) {
          highestScore = 10;
          bestMatch = h;
          break;
        } else if (lower.includes(kw)) {
          if (highestScore < 8) {
            highestScore = 8;
            bestMatch = h;
          }
        }
      }
      if (highestScore === 10) break;
    }

    if (bestMatch) {
      mapping[def.key] = bestMatch;
    }
  }

  // Positional fallback for standard Konawe Disperkim spreadsheet structure
  // Col 0: Nama KK, Col 1: RT/RW, Col 2: NIK, Col 3: No KK, Col 4: Desa, Col 5: Kecamatan,
  // Col 6: Keterangan, Col 7: Foto Depan, Col 8: Tampak Kiri, Col 9: Tampak Kanan, Col 10: Tampak Belakang
  const positionalKeys = [
    'namaKK',
    'dusunRtRw',
    'nik',
    'noKK',
    'desaKelurahan',
    'kecamatan',
    'keteranganFisik',
    'fotoDepan',
    'fotoSampingKiri',
    'fotoSampingKanan',
    'fotoBelakang'
  ];

  positionalKeys.forEach((key, idx) => {
    if (!mapping[key] && headers[idx]) {
      mapping[key] = headers[idx];
    }
  });

  return mapping;
}

/**
 * Transforms raw CSV parsed rows into structured RTLHEntry array
 */
export function transformRowsToRTLH(
  rows: Record<string, string>[],
  columnMap: Record<string, string>
): RTLHEntry[] {
  return rows.map((row, index) => {
    // Intelligent extractor that checks explicit column mapping, exact keys, and synonyms
    const getValue = (key: string, synonyms: string[] = []): string => {
      // 1. Check explicit column mapping
      const colHeader = columnMap[key];
      if (colHeader && row[colHeader] !== undefined && String(row[colHeader]).trim() !== '') {
        return String(row[colHeader]).trim();
      }

      // 2. Check exact direct property
      if (row[key] !== undefined && String(row[key]).trim() !== '') {
        return String(row[key]).trim();
      }

      const rowKeys = Object.keys(row);
      const allSearchKeywords = [...synonyms];
      const knownDef = KNOWN_COLUMN_MAPPINGS.find(m => m.key === key);
      if (knownDef) {
        allSearchKeywords.push(...knownDef.keywords);
        allSearchKeywords.push(knownDef.label.toLowerCase());
      }

      // 3. Case-insensitive exact match with headers
      for (const kw of allSearchKeywords) {
        const foundKey = rowKeys.find(k => k.trim().toLowerCase() === kw.toLowerCase());
        if (foundKey && row[foundKey] !== undefined && String(row[foundKey]).trim() !== '') {
          return String(row[foundKey]).trim();
        }
      }

      // 4. Case-insensitive substring match
      for (const kw of allSearchKeywords) {
        if (kw.length < 3) continue;
        const foundKey = rowKeys.find(k => k.trim().toLowerCase().includes(kw.toLowerCase()));
        if (foundKey && row[foundKey] !== undefined && String(row[foundKey]).trim() !== '') {
          return String(row[foundKey]).trim();
        }
      }

      return '';
    };

    const id = `RTLH-${String(index + 1).padStart(4, '0')}`;
    const timestamp = getValue('timestamp', ['waktu', 'tanggal', 'date', 'recorded']) || new Date().toISOString().slice(0, 16).replace('T', ' ');
    const surveyorName = getValue('surveyorName', ['petugas', 'surveyor', 'fasilitator']) || 'Tim Fasilitator Disperkim';
    
    // Exact Nama Kepala Keluarga according to Spreadsheet
    const rawNamaKK = getValue('namaKK', ['nama kepala keluarga', 'nama kk', 'nama lengkap', 'nama penerima', 'nama calon', 'calon penerima', 'nama']);
    const namaKK = rawNamaKK || `Penerima Usulan ${index + 1}`;

    // NIK & No KK - strip leading apostrophe if exported from excel/sheets
    const rawNik = getValue('nik', ['nik (ktp)', 'nik', 'nomor induk', 'no ktp', 'ktp']) || `740201${String(1000000000 + index).slice(1)}`;
    const nik = rawNik.replace(/['"\s]/g, '');

    const rawNoKK = getValue('noKK', ['nomor kk (kartu keluarga)', 'nomor kk', 'no kk', 'kartu keluarga']) || `740201${String(2000000000 + index).slice(1)}`;
    const noKK = rawNoKK.replace(/['"\s]/g, '');

    const pekerjaan = getValue('pekerjaan', ['profesi', 'mata pencaharian']) || 'Buruh Harian / Tani';
    const rawGaji = getValue('penghasilanBulanan', ['penghasilan', 'pendapatan', 'gaji']).replace(/[^0-9]/g, '');
    const penghasilanBulanan = rawGaji ? parseInt(rawGaji, 10) : 1200000;

    // Exact Desa / Kelurahan & Kecamatan according to Spreadsheet
    const kecamatan = getValue('kecamatan', ['kecamatan', 'wilayah kecamatan', 'distrik']) || 'Unaaha';
    const desaKelurahan = getValue('desaKelurahan', [
      'desa / kelurahan', 
      'desa/kelurahan', 
      'desa / kel', 
      'desa/kel', 
      'kelurahan / desa', 
      'kelurahan/desa', 
      'nama desa', 
      'nama kelurahan', 
      'desa', 
      'kelurahan', 
      'kampung'
    ]) || 'Desa Percontohan';

    const dusunRtRw = getValue('dusunRtRw', ['alamat lengkap (rt/rw)', 'alamat lengkap', 'rt/rw', 'alamat', 'dusun', 'rt / rw']) || 'RT 01 / RW 01';

    // Coordinates
    const coordString = getValue('koordinat');
    const { lat, lng } = parseCoordinates(coordString);

    // Physical components
    const atap = getValue('atap') || 'Seng berkarat bocor';
    const dinding = getValue('dinding') || 'Papan lapuk belum diplester';
    const lantai = getValue('lantai') || 'Tanah liat / Semen retak';
    const pondasi = getValue('pondasi') || 'Pondasi batu kali sederhana';
    const sanitasi = getValue('sanitasi') || 'Jamban cemplung';
    const air = getValue('air') || 'Sumur gali';

    // Scoring
    const { score, level } = calculatePUPRScore({ atap, dinding, lantai, pondasi, sanitasi, air });

    // Explicit overrides if column provided in spreadsheet
    const explicitLevel = getValue('tingkatKerusakan');
    const matchedLevel: KerusakanLevel = 
      explicitLevel.toLowerCase().includes('berat') ? 'Rusak Berat' :
      explicitLevel.toLowerCase().includes('sedang') ? 'Rusak Sedang' :
      explicitLevel.toLowerCase().includes('ringan') ? 'Rusak Ringan' :
      explicitLevel.toLowerCase().includes('layak') ? 'Layak Huni' : level;

    // Photos & Physical Descriptions
    const keteranganFisik = getValue('keteranganFisik') || `${atap}, ${dinding}, ${lantai}`;
    const fotoDepan = getValue('fotoDepan') || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80';
    const fotoSampingKanan = getValue('fotoSampingKanan') || undefined;
    const fotoSampingKiri = getValue('fotoSampingKiri') || undefined;
    const fotoBelakang = getValue('fotoBelakang') || undefined;
    const fotoDalam = getValue('fotoDalam') || undefined;

    // Status
    const explicitStatus = getValue('statusBantuan');
    let statusBantuan: StatusBantuan = 'Usulan Baru';
    if (explicitStatus) {
      const s = explicitStatus.toLowerCase();
      if (s.includes('selesai')) statusBantuan = 'Bantuan Selesai';
      else if (s.includes('proses') || s.includes('bangun')) statusBantuan = 'Proses Pembangunan';
      else if (s.includes('sk') || s.includes('calon')) statusBantuan = 'Calon Penerima (Masuk SK)';
      else if (s.includes('verif') || s.includes('valid')) statusBantuan = 'Terverifikasi Lapangan';
      else if (s.includes('tolak')) statusBantuan = 'Ditolak / Tidak Memenuhi Syarat';
    } else {
      if (score >= 80 || keteranganFisik.toLowerCase().includes('rusak berat')) statusBantuan = 'Terverifikasi Lapangan';
    }

    let sumberDana: SumberDana = 'Belum Ditentukan';
    if (matchedLevel === 'Rusak Berat' || keteranganFisik.toLowerCase().includes('rusak berat')) sumberDana = 'BSPS KemenPKP';
    else if (matchedLevel === 'Rusak Sedang' || keteranganFisik.toLowerCase().includes('rusak sedang')) sumberDana = 'APBD Kab. Konawe';

    return {
      id,
      timestamp,
      surveyorName,
      namaKK,
      nik,
      noKK,
      pekerjaan,
      penghasilanBulanan,
      statusKepemilikanRumah: 'Milik Sendiri',
      statusKepemilikanTanah: 'Surat Keterangan Tanah (SKT)',
      provinsi: 'Sulawesi Tenggara',
      kabupaten: 'Konawe',
      kecamatan,
      desaKelurahan,
      dusunRtRw,
      latitude: lat,
      longitude: lng,
      kondisiFisik: {
        pondasi,
        kolomBalok: 'Kayu hutan kelas menengah',
        rangkaAtap: 'Kayu usuk renggang',
        atap,
        dinding,
        lantai,
        ventilasiPencahayaan: 'Pencahayaan alami sedang',
        sanitasiJamban: sanitasi,
        sumberAir: air,
        luasRumahM2: 36,
        jumlahPenghuni: 4,
      },
      skorKerusakan: score,
      tingkatKerusakan: matchedLevel,
      keteranganFisik,
      fotoDepan,
      fotoSampingKanan,
      fotoSampingKiri,
      fotoBelakang,
      fotoDalam,
      statusBantuan,
      sumberDana,
      tahunAnggaran: 2026,
      catatanVerifikator: keteranganFisik ? `Keterangan Fisik: ${keteranganFisik}` : `Hasil import otomatis dari Google Spreadsheet.`
    };
  });
}

/**
 * Transforms Google Drive share links into direct viewable image URLs
 */
export function formatGoogleDriveImageUrl(rawUrl: string | undefined): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // Extract ID from Google Drive URL
  const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9-_]+)/) || trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (matchId && matchId[1]) {
    return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
  }

  return trimmed;
}

/**
 * Fetch and parse CSV directly from Google Sheet Link
 */
export async function fetchGoogleSheetData(sheetUrl: string): Promise<{
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
}> {
  const { exportCsvUrl, valid } = extractGoogleSheetInfo(sheetUrl);
  if (!valid && !sheetUrl.startsWith('http')) {
    throw new Error('Link Google Sheets tidak valid. Mohon masukkan URL lengkap Google Spreadsheet Anda.');
  }

  const targetUrl = exportCsvUrl || sheetUrl;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`Gagal mengunduh spreadsheet (Status ${response.status}: ${response.statusText}). Pastikan izin berbagi Google Sheet Anda adalah 'Siapa saja yang memiliki link dapat melihat' (Anyone with the link can view).`);
    }

    const csvText = await response.text();
    if (!csvText || csvText.trim().length === 0) {
      throw new Error('Spreadsheet kosong atau tidak memiliki data.');
    }

    if (csvText.includes('<!DOCTYPE html>') && csvText.includes('ServiceLogin')) {
      throw new Error('Spreadsheet memerlukan login Google (Privat). Mohon ubah akses file Google Sheet Anda: Klik Bagikan (Share) -> Ubah menjadi "Siapa saja yang memiliki tautan" (Anyone with link).');
    }

    return parseCsvString(csvText);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Provide actionable instructions
    throw new Error(errorMsg);
  }
}

/**
 * Parses raw CSV string
 */
export function parseCsvString(csvText: string): {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
} {
  // Parse raw matrix first to detect if row 1 is header or data
  const rawParsed = Papa.parse<string[]>(csvText, {
    header: false,
    skipEmptyLines: 'greedy',
  });

  if (rawParsed.errors && rawParsed.errors.length > 0 && rawParsed.data.length === 0) {
    throw new Error(`Format CSV tidak valid: ${rawParsed.errors[0]?.message}`);
  }

  const rawRows = rawParsed.data.filter(r => r && r.some(c => String(c).trim().length > 0));
  if (rawRows.length === 0) {
    return { headers: [], rows: [], totalRows: 0 };
  }

  const firstRow = rawRows[0].map(c => String(c || '').trim());

  // Check if first row is actually data (e.g. contains 16-digit NIK/KK, RT/RW pattern, or URL)
  const isDataRow = firstRow.some(val => 
    /^\d{15,16}$/.test(val.replace(/['"\s]/g, '')) || 
    val.startsWith('http://') || 
    val.startsWith('https://') ||
    /^rt[\s.]*\d+/i.test(val) ||
    /^\d{3}\/\d{3}/i.test(val)
  );

  const standardKonaweHeaders = [
    'Nama Kepala Keluarga',
    'Alamat Lengkap (RT/RW)',
    'NIK (KTP)',
    'Nomor KK (Kartu Keluarga)',
    'Desa / Kelurahan',
    'Kecamatan',
    'Keterangan Fisik Kondisi Rumah',
    'Foto Rumah (Tampak Depan)',
    'Foto Rumah (Tampak Samping Kiri)',
    'Foto Rumah (Tampak Samping Kanan)',
    'Foto Rumah (Tampak Belakang)',
  ];

  if (isDataRow) {
    // Row 1 is data! Use standard Konawe Disperkim column headers
    const headers = standardKonaweHeaders.slice(0, Math.max(firstRow.length, standardKonaweHeaders.length));
    const rows = rawRows.map(r => {
      const rowObj: Record<string, string> = {};
      headers.forEach((h, i) => {
        rowObj[h] = r[i] !== undefined ? String(r[i]).trim() : '';
      });
      return rowObj;
    });

    return {
      headers,
      rows,
      totalRows: rows.length
    };
  }

  // Row 1 is actual headers
  const headers = firstRow;
  const dataRows = rawRows.slice(1);
  const rows = dataRows.map(r => {
    const rowObj: Record<string, string> = {};
    headers.forEach((h, i) => {
      rowObj[h] = r[i] !== undefined ? String(r[i]).trim() : '';
    });
    return rowObj;
  });

  return {
    headers,
    rows,
    totalRows: rows.length
  };
}

/**
 * Convert RTLH dataset into downloadable CSV
 */
export function exportRTLHToCsv(data: RTLHEntry[]): void {
  const exportRows = data.map((item, idx) => ({
    'Nomor': idx + 1,
    'Nama Kepala Keluarga': item.namaKK,
    'Alamat Lengkap (RT/RW)': item.dusunRtRw,
    'NIK (KTP)': `'${item.nik}`,
    'Nomor KK (Kartu Keluarga)': `'${item.noKK}`,
    'Desa / Kelurahan': item.desaKelurahan,
    'Kecamatan': item.kecamatan,
    'Keterangan Fisik Kondisi Rumah': item.keteranganFisik || item.catatanVerifikator || `${item.kondisiFisik.atap}, ${item.kondisiFisik.dinding}`,
    'Foto Rumah (Tampak Depan)': item.fotoDepan || '',
    'Foto Rumah (Tampak Samping Kiri)': item.fotoSampingKiri || item.fotoDepan || '',
    'Foto Rumah (Tampak Samping Kanan)': item.fotoSampingKanan || item.fotoDepan || '',
    'Foto Rumah (Tampak Belakang)': item.fotoBelakang || item.fotoDepan || '',
    'Tingkat Kerusakan': item.tingkatKerusakan,
    'Skor Kerusakan (0-100)': item.skorKerusakan,
    'Status Bantuan': item.statusBantuan,
    'Sumber Dana': item.sumberDana,
    'Tahun Anggaran': item.tahunAnggaran,
  }));

  const csv = Papa.unparse(exportRows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `BNBA_RTLH_KONAWE_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
