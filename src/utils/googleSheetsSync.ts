import Papa from 'papaparse';
import { RTLHEntry, KerusakanLevel, StatusBantuan, SumberDana } from '../types/rtlh';

export interface ColumnDetection {
  key: keyof RTLHEntry | 'koordinat' | 'atap' | 'dinding' | 'lantai' | 'pondasi' | 'sanitasi' | 'air';
  label: string;
  matchedHeader?: string;
  confidence: number;
}

export const KNOWN_COLUMN_MAPPINGS: { key: string; label: string; keywords: string[] }[] = [
  { key: 'timestamp', label: 'Waktu / Timestamp', keywords: ['timestamp', 'waktu', 'tanggal', 'date', 'recorded'] },
  { key: 'namaKK', label: 'Nama Kepala Keluarga', keywords: ['nama kepala keluarga', 'nama kk', 'nama lengkap', 'nama penerima', 'nama calon', 'calon penerima', 'nama'] },
  { key: 'dusunRtRw', label: 'Alamat Lengkap (RT/RW)', keywords: ['alamat lengkap (rt/rw)', 'alamat lengkap', 'rt/rw', 'alamat', 'dusun', 'rt', 'rw', 'lingkungan', 'jalan'] },
  { key: 'nik', label: 'NIK (KTP)', keywords: ['nik (ktp)', 'nik', 'nomor induk', 'no ktp', 'ktp'] },
  { key: 'noKK', label: 'Nomor KK (Kartu Keluarga)', keywords: ['nomor kk (kartu keluarga)', 'nomor kk', 'no kk', 'kartu keluarga', 'nomor kartu'] },
  { key: 'desaKelurahan', label: 'Desa / Kelurahan', keywords: ['desa / kelurahan', 'desa/kelurahan', 'desa', 'kelurahan', 'kampung'] },
  { key: 'kecamatan', label: 'Kecamatan', keywords: ['kecamatan', 'distrik'] },
  { key: 'keteranganFisik', label: 'Keterangan Fisik Kondisi Rumah', keywords: ['keterangan fisik kondisi rumah', 'keterangan fisik', 'kondisi fisik', 'kondisi rumah', 'keterangan'] },
  { key: 'fotoDepan', label: 'Foto Rumah (Tampak Depan)', keywords: ['foto rumah (tampak depan)', 'tampak depan', 'foto depan', 'foto rumah', 'foto tampak depan'] },
  { key: 'fotoSampingKanan', label: 'Foto Rumah (Tampak Samping Kanan)', keywords: ['foto rumah (tampak samping kanan)', 'tampak samping kanan', 'samping kanan'] },
  { key: 'fotoSampingKiri', label: 'Foto Rumah (Tampak Samping Kiri)', keywords: ['foto rumah (tampak samping kiri)', 'tampak samping kiri', 'samping kiri'] },
  { key: 'fotoBelakang', label: 'Foto Rumah (Tampak Belakang)', keywords: ['foto rumah (tampak belakang)', 'tampak belakang', 'foto belakang'] },
  { key: 'surveyorName', label: 'Nama Surveyor / Petugas', keywords: ['surveyor', 'petugas', 'pencatat', 'nama verifikator', 'fasilitator', 'email'] },
  { key: 'pekerjaan', label: 'Pekerjaan', keywords: ['pekerjaan', 'profesi', 'mata pencaharian'] },
  { key: 'penghasilanBulanan', label: 'Penghasilan Bulanan', keywords: ['penghasilan', 'pendapatan', 'gaji', 'upah'] },
  { key: 'koordinat', label: 'Titik Koordinat / GPS', keywords: ['koordinat', 'gps', 'latitude', 'lat/long', 'lat, long', 'titik lokasi', 'map'] },
  { key: 'atap', label: 'Kondisi Atap', keywords: ['atap', 'kondisi atap', 'bahan penutup atap', 'rangka atap'] },
  { key: 'dinding', label: 'Kondisi Dinding', keywords: ['dinding', 'kondisi dinding', 'bahan dinding', 'material dinding'] },
  { key: 'lantai', label: 'Kondisi Lantai', keywords: ['lantai', 'kondisi lantai', 'bahan lantai', 'alas rumah'] },
  { key: 'pondasi', label: 'Pondasi / Struktur', keywords: ['pondasi', 'tiang', 'struktur', 'kolom', 'balok'] },
  { key: 'sanitasi', label: 'Sanitasi / Jamban', keywords: ['sanitasi', 'jamban', 'wc', 'kloset', 'mck', 'bab'] },
  { key: 'air', label: 'Sumber Air Bersih', keywords: ['air', 'air bersih', 'sumber air', 'air minum'] },
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
    const getValue = (key: string): string => {
      const colHeader = columnMap[key];
      if (colHeader && row[colHeader] !== undefined) {
        return String(row[colHeader]).trim();
      }
      // fallback check direct property
      if (row[key] !== undefined) return String(row[key]).trim();
      return '';
    };

    const id = `RTLH-${String(index + 1).padStart(4, '0')}`;
    const timestamp = getValue('timestamp') || new Date().toISOString().slice(0, 16).replace('T', ' ');
    const surveyorName = getValue('surveyorName') || 'Tim Fasilitator Disperkim';
    const namaKK = getValue('namaKK') || `Warga ${index + 1}`;
    const rawNik = getValue('nik') || `740201${String(1000000000 + index).slice(1)}`;
    const nik = rawNik.replace(/[^0-9]/g, '');
    const noKK = getValue('noKK') || `740201${String(2000000000 + index).slice(1)}`;
    const pekerjaan = getValue('pekerjaan') || 'Buruh Harian / Tani';
    const rawGaji = getValue('penghasilanBulanan').replace(/[^0-9]/g, '');
    const penghasilanBulanan = rawGaji ? parseInt(rawGaji, 10) : 1200000;

    const kecamatan = getValue('kecamatan') || 'Unaaha';
    const desaKelurahan = getValue('desaKelurahan') || 'Desa Percontohan';
    const dusunRtRw = getValue('dusunRtRw') || 'RT 01 / RW 01';

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
    else if (matchedLevel === 'Rusak Sedang' || keteranganFisik.toLowerCase().includes('rusak sedang')) sumberDana = 'DAU APBD Konawe';

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
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors && parsed.errors.length > 0 && parsed.data.length === 0) {
    throw new Error(`Format CSV tidak valid: ${parsed.errors[0]?.message}`);
  }

  const headers = parsed.meta.fields || [];
  const rows = parsed.data.filter(r => Object.values(r).some(v => String(v).trim().length > 0));

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
    'Foto Rumah (Tampak Samping Kanan)': item.fotoSampingKanan || item.fotoDepan || '',
    'Foto Rumah (Tampak Samping Kiri)': item.fotoSampingKiri || item.fotoDepan || '',
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
