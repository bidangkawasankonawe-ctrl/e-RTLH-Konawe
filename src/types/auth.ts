export type AdminRole = 
  | 'Super Admin'
  | 'Tim Verifikator Lapangan'
  | 'Operator Disperkim'
  | 'Sub-Admin Kecamatan';

export interface AdminUser {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: AdminRole;
  email: string;
  phone?: string;
  agency: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
  adminName?: string;
  email?: string;
  lastChangedAt?: string;
  lastUpdated?: string;
}

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'superadmin',
  password: 'konawe2026',
  adminName: 'Super Admin Disperkim Konawe',
  email: 'bidangkawasankonawe@gmail.com',
  lastChangedAt: '28 Oktober 2026',
  lastUpdated: '28 Oktober 2026',
};

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-1',
    username: 'superadmin',
    password: 'konawe2026',
    fullName: 'Super Administrator Disperkim',
    role: 'Super Admin',
    email: 'bidangkawasankonawe@gmail.com',
    phone: '0812-4211-9988',
    agency: 'Dinas Perumahan & Kawasan Permukiman Kab. Konawe',
    isActive: true,
    createdAt: '12 Januari 2026',
    lastLogin: 'Hari ini'
  },
  {
    id: 'usr-2',
    username: 'verifikator.konawe',
    password: 'konawe2026',
    fullName: 'Ir. Ahmad Hidayat, S.T.',
    role: 'Tim Verifikator Lapangan',
    email: 'verifikasi.rtlh@konawekab.go.id',
    phone: '0852-9988-1234',
    agency: 'Tim Satgas Verifikasi Lapangan RTLH',
    isActive: true,
    createdAt: '01 Februari 2026',
    lastLogin: 'Kemarin'
  },
  {
    id: 'usr-3',
    username: 'operator.disperkim',
    password: 'konawe2026',
    fullName: 'Siti Rahmawati, S.Kom',
    role: 'Operator Disperkim',
    email: 'operator.rtlh@konawekab.go.id',
    phone: '0821-7788-3344',
    agency: 'Seksi Pendataan & Perencanaan Perumahan',
    isActive: true,
    createdAt: '15 Februari 2026',
    lastLogin: '3 hari lalu'
  }
];
