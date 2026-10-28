/**
 * Utility for Data Privacy Protection (UU Pelindungan Data Pribadi / UU PDP)
 * Digunakan untuk menyamarkan NIK dan No KK bagi user selain Super Admin.
 */

export type UserRole = 'Super Admin' | 'User Publik';

/**
 * Menyamarkan NIK (Nomor Induk Kependudukan) atau No KK (Nomor Kartu Keluarga)
 * - Super Admin: Menampilkan nomor lengkap (misal: 7402111504780001)
 * - User Selain Super Admin: Menyamarkan 6 digit tengah dengan tanda bintang (misal: 740211******0001)
 */
export function maskIdentity(value: string | undefined | null, isSuperAdmin: boolean): string {
  if (!value) return '-';
  const clean = String(value).trim();
  if (!clean) return '-';
  
  // Super Admin mendapatkan akses penuh
  if (isSuperAdmin) {
    return clean;
  }

  // Jika string sudah memiliki tanda bintang
  if (clean.includes('*')) return clean;

  const len = clean.length;
  if (len <= 6) {
    return '******';
  }

  // Standar NIK / No KK Indonesia (16 digit): 6 digit awal (wilayah), 6 bintang, 4 digit akhir
  if (len >= 12) {
    const prefix = clean.slice(0, 6);
    const suffix = clean.slice(-4);
    const maskCount = Math.max(4, len - 10);
    return `${prefix}${'*'.repeat(maskCount)}${suffix}`;
  }

  // Untuk format pendek
  const prefix = clean.slice(0, 2);
  const suffix = clean.slice(-2);
  return `${prefix}****${suffix}`;
}
