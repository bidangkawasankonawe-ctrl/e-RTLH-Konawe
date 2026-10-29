import React, { useState } from 'react';
import { GoogleSheetsConfig, RTLHEntry } from '../types/rtlh';
import { AdminCredentials, AdminUser, AdminRole } from '../types/auth';
import { 
  Database, 
  RefreshCw, 
  FileSpreadsheet, 
  ExternalLink, 
  PlusCircle, 
  Download, 
  Upload, 
  ShieldAlert, 
  CheckCircle2, 
  Link as LinkIcon, 
  Settings,
  HelpCircle,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  Lock,
  Check,
  X,
  UserPlus,
  Users,
  Shield,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Mail,
  Phone,
  Building,
  Key,
  Edit3
} from 'lucide-react';

interface AdminViewProps {
  config: GoogleSheetsConfig;
  data: RTLHEntry[];
  onOpenSyncModal: () => void;
  onOpenFormModal: () => void;
  onOpenNewEntryModal: () => void;
  onTriggerSync: () => void;
  onResetToDemo: () => void;
  onExportCsv: () => void;
  isSyncing: boolean;
  adminCredentials?: AdminCredentials;
  onUpdateCredentials?: (newCreds: AdminCredentials) => void;
  adminUsers?: AdminUser[];
  onAddUser?: (user: AdminUser) => void;
  onToggleUserStatus?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onResetUserPassword?: (userId: string, newPass: string) => void;
  onEditUser?: (updatedUser: AdminUser) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  config,
  data,
  onOpenSyncModal,
  onOpenFormModal,
  onOpenNewEntryModal,
  onTriggerSync,
  onResetToDemo,
  onExportCsv,
  isSyncing,
  adminCredentials,
  onUpdateCredentials,
  adminUsers = [],
  onAddUser,
  onToggleUserStatus,
  onDeleteUser,
  onResetUserPassword,
  onEditUser,
}) => {
  // Super Admin primary credential modal state
  const [isCredsModalOpen, setIsCredsModalOpen] = useState(false);
  const [formData, setFormData] = useState<AdminCredentials>(() => ({
    username: adminCredentials?.username || 'superadmin',
    password: adminCredentials?.password || 'konawe2026',
    adminName: adminCredentials?.adminName || 'Super Admin Disperkim',
    email: adminCredentials?.email || 'admin.disperkim@konawekab.go.id',
    lastUpdated: adminCredentials?.lastUpdated || '12 Maret 2026'
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Register New Admin User Modal State
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState<AdminRole>('Tim Verifikator Lapangan');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserAgency, setNewUserAgency] = useState('Tim Satgas Verifikasi Lapangan RTLH');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserConfirmPassword, setNewUserConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newUserIsActive, setNewUserIsActive] = useState(true);
  const [newUserError, setNewUserError] = useState('');
  const [newUserSuccess, setNewUserSuccess] = useState('');

  // Reset Password Modal State for a specific user
  const [selectedUserForReset, setSelectedUserForReset] = useState<AdminUser | null>(null);
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Edit Admin User Modal State (Khusus Super Admin)
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<AdminUser | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editRole, setEditRole] = useState<AdminRole>('Tim Verifikator Lapangan');
  const [editAgency, setEditAgency] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');

  const handleOpenCredsModal = () => {
    if (adminCredentials) {
      setFormData(adminCredentials);
    }
    setFormError('');
    setSaveSuccess(false);
    setIsCredsModalOpen(true);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setFormError('Username tidak boleh kosong.');
      return;
    }
    if (formData.password.length < 6) {
      setFormError('Password minimal 6 karakter.');
      return;
    }

    const updated: AdminCredentials = {
      ...formData,
      lastUpdated: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };

    if (onUpdateCredentials) {
      onUpdateCredentials(updated);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsCredsModalOpen(false);
    }, 1200);
  };

  const handleOpenNewUserModal = () => {
    setNewUserFullName('');
    setNewUsername('');
    setNewUserRole('Tim Verifikator Lapangan');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserAgency('Tim Satgas Verifikasi Lapangan RTLH');
    setNewUserPassword('');
    setNewUserConfirmPassword('');
    setNewUserIsActive(true);
    setNewUserError('');
    setNewUserSuccess('');
    setIsNewUserModalOpen(true);
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    setNewUserError('');

    if (!newUsername.trim()) {
      setNewUserError('Username wajib diisi.');
      return;
    }

    // Check duplicate username across registered users & primary super admin
    const cleanUsername = newUsername.trim().toLowerCase();
    const isDuplicate = adminUsers.some(u => u.username.toLowerCase() === cleanUsername) || 
      (adminCredentials?.username.toLowerCase() === cleanUsername);

    if (isDuplicate) {
      setNewUserError(`Username "${newUsername}" sudah terdaftar dalam sistem. Gunakan username lain.`);
      return;
    }

    if (!newUserFullName.trim()) {
      setNewUserError('Nama lengkap petugas wajib diisi.');
      return;
    }

    if (newUserPassword.length < 6) {
      setNewUserError('Password minimal 6 karakter demi keamanan akun kedinasan.');
      return;
    }

    if (newUserPassword !== newUserConfirmPassword) {
      setNewUserError('Konfirmasi password tidak cocok.');
      return;
    }

    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      username: newUsername.trim(),
      password: newUserPassword,
      fullName: newUserFullName.trim(),
      role: newUserRole,
      email: newUserEmail.trim() || `${cleanUsername}@konawekab.go.id`,
      phone: newUserPhone.trim() || '-',
      agency: newUserAgency.trim() || 'Dinas Perumahan & Kawasan Permukiman Kab. Konawe',
      isActive: newUserIsActive,
      createdAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      lastLogin: 'Belum pernah login'
    };

    if (onAddUser) {
      onAddUser(newUser);
    }

    setNewUserSuccess(`Akun "${newUser.fullName}" dengan peran [${newUser.role}] berhasil didaftarkan!`);
    setTimeout(() => {
      setIsNewUserModalOpen(false);
      setNewUserSuccess('');
    }, 1500);
  };

  const handleExecuteResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (!selectedUserForReset) return;

    if (resetNewPass.length < 6) {
      setResetError('Password baru minimal 6 karakter.');
      return;
    }

    if (resetNewPass !== resetConfirmPass) {
      setResetError('Konfirmasi password baru tidak cocok.');
      return;
    }

    if (onResetUserPassword) {
      onResetUserPassword(selectedUserForReset.id, resetNewPass);
    }

    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setSelectedUserForReset(null);
      setResetNewPass('');
      setResetConfirmPass('');
    }, 1400);
  };

  const handleOpenEditModal = (user: AdminUser) => {
    setSelectedUserForEdit(user);
    setEditFullName(user.fullName);
    setEditUsername(user.username);
    setEditRole(user.role);
    setEditAgency(user.agency);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditIsActive(user.isActive);
    setEditPassword(user.password);
    setShowEditPassword(false);
    setEditError('');
    setEditSuccess('');
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');

    if (!selectedUserForEdit) return;

    if (!editFullName.trim()) {
      setEditError('Nama lengkap petugas tidak boleh kosong.');
      return;
    }

    const cleanUsername = editUsername.trim().toLowerCase();
    if (!cleanUsername) {
      setEditError('Username tidak boleh kosong.');
      return;
    }

    // Check duplicate username against other registered users
    const isDuplicate = adminUsers.some(
      u => u.id !== selectedUserForEdit.id && u.username.toLowerCase() === cleanUsername
    );
    if (isDuplicate) {
      setEditError(`Username "${editUsername}" sudah dipakai oleh admin/pengguna lain.`);
      return;
    }

    if (editPassword && editPassword.length < 6) {
      setEditError('Password minimal 6 karakter.');
      return;
    }

    const updatedUser: AdminUser = {
      ...selectedUserForEdit,
      fullName: editFullName.trim(),
      username: editUsername.trim(),
      role: editRole,
      agency: editAgency.trim() || 'Dinas Perumahan & Kawasan Permukiman Kab. Konawe',
      email: editEmail.trim(),
      phone: editPhone.trim() || '-',
      isActive: editIsActive,
      password: editPassword || selectedUserForEdit.password,
    };

    if (onEditUser) {
      onEditUser(updatedUser);
    }

    setEditSuccess('Data admin berhasil diperbarui dan disimpan!');
    setTimeout(() => {
      setEditSuccess('');
      setSelectedUserForEdit(null);
    }, 1200);
  };

  // Helper badge color for roles
  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Tim Verifikator Lapangan':
        return 'bg-blue-100 text-blue-900 border-blue-300 font-bold';
      case 'Operator Disperkim':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300 font-semibold';
      case 'Sub-Admin Kecamatan':
        return 'bg-purple-100 text-purple-900 border-purple-300 font-semibold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/60 shadow-2xs">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Pusat Pengelolaan &amp; Administrasi E-RTLH
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Portal kendali khusus Super Admin: Manajemen pengguna/petugas, integrasi data, dan keamanan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenNewUserModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#0A3981] hover:bg-[#081E3D] text-white transition shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>Tambah Admin Baru</span>
          </button>
          <button
            onClick={onOpenNewEntryModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Usulan</span>
          </button>
        </div>
      </div>

      {/* FEATURE KHUSUS SUPER ADMIN: DAFTAR & MANAJEMEN PENGGUNA (ADMIN BARU) */}
      <div className="bg-white rounded-2xl border border-blue-200/80 shadow-2xs overflow-hidden">
        {/* Banner Section Header */}
        <div className="bg-gradient-to-r from-[#081E3D] via-[#0B254C] to-[#0A3981] p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md shrink-0">
              <Users className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base tracking-tight text-white">
                  Manajemen Pengguna &amp; Pendaftaran Akun Admin
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 border border-amber-300">
                  Khusus Super Admin
                </span>
              </div>
              <p className="text-xs text-blue-200/90 mt-1 max-w-2xl leading-relaxed">
                Kelola hak akses kedinasan: Daftarkan akun baru untuk Tim Verifikator Lapangan, Operator Disperkim, atau Sub-Admin Kecamatan. Atur status aktif/nonaktif dan reset kata sandi petugas secara mandiri.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenNewUserModal}
            className="px-4 py-2.5 rounded-xl text-xs font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 transition shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Daftarkan Admin / Petugas</span>
          </button>
        </div>

        {/* Quick Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/80 border-b border-slate-200 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">Total Akun Terdaftar</span>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">{adminUsers.length} Petugas</div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">Tim Verifikator Lapangan</span>
            <div className="text-lg font-extrabold text-blue-700 mt-0.5">
              {adminUsers.filter(u => u.role === 'Tim Verifikator Lapangan').length} Petugas
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">Operator &amp; Sub-Admin</span>
            <div className="text-lg font-extrabold text-cyan-700 mt-0.5">
              {adminUsers.filter(u => u.role === 'Operator Disperkim' || u.role === 'Sub-Admin Kecamatan').length} Staf
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium">Status Akun Aktif</span>
            <div className="text-lg font-extrabold text-emerald-600 mt-0.5">
              {adminUsers.filter(u => u.isActive).length} Aktif
            </div>
          </div>
        </div>

        {/* Table of Registered Users */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100/80 text-[11px] uppercase tracking-wider text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Petugas &amp; Instansi</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Hak Akses / Peran</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4 text-center">Status Akun</th>
                <th className="py-3 px-4">Terdaftar</th>
                <th className="py-3 px-4 text-right">Aksi Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminUsers.map((user) => {
                const isSuperAdminAccount = user.role === 'Super Admin';
                return (
                  <tr key={user.id} className="hover:bg-blue-50/40 transition">
                    {/* Nama & Instansi */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                          isSuperAdminAccount ? 'bg-[#081E3D] text-amber-300' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{user.fullName}</span>
                            {isSuperAdminAccount && (
                              <span title="Super Admin Otoritas Penuh">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs">
                            {user.agency}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {user.username}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] border ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Kontak */}
                    <td className="py-3.5 px-4 text-[11px] text-slate-600 space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-500">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[140px]">{user.email}</span>
                      </div>
                      {user.phone && user.phone !== '-' && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.isActive 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-600' : 'bg-red-600'}`} />
                          {user.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        
                        {!isSuperAdminAccount && onToggleUserStatus && (
                          <button
                            type="button"
                            onClick={() => onToggleUserStatus(user.id)}
                            className="mt-1 text-[10px] text-blue-600 hover:text-blue-800 underline cursor-pointer"
                            title={user.isActive ? 'Klik untuk menonaktifkan akun' : 'Klik untuk mengaktifkan akun'}
                          >
                            {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Tanggal Terdaftar */}
                    <td className="py-3.5 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                      {user.createdAt}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Tombol Edit Data Admin (Khusus Super Admin) */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(user)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-[#0A3981] border border-blue-200/80 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Edit Data Admin / Petugas (Khusus Super Admin)"
                        >
                          <Edit3 className="w-3 h-3 text-[#0A3981]" />
                          <span>Edit Data</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUserForReset(user);
                            setResetNewPass('');
                            setResetConfirmPass('');
                            setResetError('');
                            setResetSuccess(false);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1 cursor-pointer"
                          title="Reset / Ubah Password Petugas"
                        >
                          <Key className="w-3 h-3 text-amber-600" />
                          <span>Reset Sandi</span>
                        </button>

                        {!isSuperAdminAccount && onDeleteUser && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus akun "${user.fullName}" (${user.username})?`)) {
                                onDeleteUser(user.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Hapus akun petugas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-3.5 bg-blue-50/50 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Kredensial seluruh akun tersimpan secara aman dan terenkripsi pada sistem lokal instansi.</span>
          </div>
          <span className="font-semibold text-slate-700 text-[10px]">
            SI-RTLH Kab. Konawe v2.6
          </span>
        </div>
      </div>

      {/* Grid of Admin Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Card 0: Kredensial Super Admin Utama */}
        <div className="bg-gradient-to-br from-white to-blue-50/40 rounded-2xl p-5 border border-blue-200/80 shadow-2xs flex flex-col justify-between md:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#081E3D] text-amber-400 flex items-center justify-center shadow-xs shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">Akun Otoritas Utama (Root Super Admin)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#081E3D] border border-blue-200/60 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    Otoritas Tertinggi
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Kelola username dan kata sandi akun induk Super Admin. Akun ini memiliki wewenang penuh membuka enkripsi NIK/No KK, sinkronisasi Google Sheets, dan verifikasi lapangan.
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Username Super Admin:</span>
                    <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {adminCredentials?.username || formData.username}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Penanggung Jawab:</span>
                    <span className="font-semibold text-slate-700">
                      {adminCredentials?.adminName || formData.adminName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Pembaruan:</span>
                    <span className="text-slate-600">
                      {adminCredentials?.lastUpdated || formData.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenCredsModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#081E3D] hover:bg-blue-900 text-white transition shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Ubah Sandi Super Admin</span>
            </button>
          </div>
        </div>

        {/* Card 1: Google Spreadsheet Sync */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Google Spreadsheet</h3>
                  <span className="text-[11px] text-slate-400">Database BNBA Utama</span>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                config.sheetUrl 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {config.sheetUrl ? 'Terhubung' : 'Mode Demo Fiktif'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              {config.sheetUrl 
                ? `Terhubung ke Google Spreadsheet dengan ${data.length} baris data.` 
                : 'Saat ini website menggunakan 24 data simulasi fiktif Kabupaten Konawe. Anda dapat menautkan URL Google Spreadsheet untuk menampilkan data asli.'}
            </p>

            {config.lastSyncedAt && (
              <div className="text-[11px] text-slate-400 mt-2">
                Sinkronisasi terakhir: {config.lastSyncedAt}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-5 border-t border-slate-100 mt-5">
            <button
              onClick={onOpenSyncModal}
              className="flex-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-center"
            >
              Konfigurasi Link Sheet
            </button>
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Google Form Survey */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Google Form Survei</h3>
                  <span className="text-[11px] text-slate-400">Instrumen Input Lapangan</span>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                Formulir Online
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Masyarakat dan fasilitator desa dapat mengisi form usulan survei lengkap dengan unggah foto tampak 4 sisi melalui tautan Google Form resmi.
            </p>

            <div className="text-[11px] text-slate-400 mt-2 truncate">
              {config.formUrl || 'Link Google Form belum disetel'}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-5 border-t border-slate-100 mt-5">
            <button
              onClick={onOpenFormModal}
              className="flex-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-2xs cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka / Atur Google Form</span>
            </button>
          </div>
        </div>

        {/* Card 3: Ekspor & Unduh CSV */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Ekspor Rekapitulasi Data</h3>
                <span className="text-[11px] text-slate-400">Unduh Format CSV / Excel</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Unduh seluruh {data.length} data By Name By Address (BNBA) dalam format CSV lengkap dengan NIK, alamat, koordinat GIS, skor kerusakan, dan link foto.
            </p>
          </div>

          <div className="pt-5 border-t border-slate-100 mt-5">
            <button
              onClick={onExportCsv}
              className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh CSV Data BNBA ({data.length} Baris)</span>
            </button>
          </div>
        </div>

        {/* Card 4: Reset Data Simulasi */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Reset ke Data Demo</h3>
                <span className="text-[11px] text-slate-400">Pemulihan Sampel Konawe</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Kembalikan database ke 24 data sampel resmi Kabupaten Konawe di 12 kecamatan untuk keperluan demonstrasi atau pengujian.
            </p>
          </div>

          <div className="pt-5 border-t border-slate-100 mt-5">
            <button
              onClick={onResetToDemo}
              className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Reset ke 24 Data Demo</span>
            </button>
          </div>
        </div>

      </div>

      {/* MODAL 1: DAFTARKAN ADMIN / PENGGUNA BARU */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#081E3D] px-6 py-4.5 text-white flex items-center justify-between border-b border-blue-900/50">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">Pendaftaran Pengguna / Admin Baru</h3>
                  <p className="text-xs text-blue-200 mt-0.5">Berikan akses kedinasan kepada petugas atau tim verifikasi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewUserModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateNewUser} className="p-6 space-y-4">
              {newUserError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{newUserError}</span>
                </div>
              )}

              {newUserSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{newUserSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap Petugas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUserFullName}
                    onChange={(e) => setNewUserFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Contoh: Ir. Muhammad Yusuf, S.T."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Peran / Hak Akses <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => {
                      const role = e.target.value as AdminRole;
                      setNewUserRole(role);
                      if (role === 'Tim Verifikator Lapangan') {
                        setNewUserAgency('Tim Satgas Verifikasi Lapangan RTLH');
                      } else if (role === 'Operator Disperkim') {
                        setNewUserAgency('Seksi Pendataan Disperkim Konawe');
                      } else if (role === 'Sub-Admin Kecamatan') {
                        setNewUserAgency('Kantor Kecamatan Kab. Konawe');
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  >
                    <option value="Tim Verifikator Lapangan">Tim Verifikator Lapangan</option>
                    <option value="Operator Disperkim">Operator Disperkim</option>
                    <option value="Sub-Admin Kecamatan">Sub-Admin Kecamatan</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Username Login <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50"
                    placeholder="misal: verifikator.unaaha"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Huruf kecil, tanpa spasi</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Instansi / Unit Penugasan
                  </label>
                  <input
                    type="text"
                    value={newUserAgency}
                    onChange={(e) => setNewUserAgency(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Tim Satgas Verifikasi Lapangan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Kedinasan
                  </label>
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="petugas@konawekab.go.id"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    No WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="0812-xxxx-xxxx"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password Login <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                        placeholder="Minimal 6 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Konfirmasi Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newUserConfirmPassword}
                      onChange={(e) => setNewUserConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                      placeholder="Ulangi password"
                    />
                  </div>
                </div>
              </div>

              {/* Status Aktif Switch */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={newUserIsActive}
                  onChange={(e) => setNewUserIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isActiveCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Aktifkan akun ini secara langsung untuk login ke sistem
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold bg-[#0A3981] hover:bg-[#081E3D] text-white rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4 text-amber-300" />
                  <span>Daftarkan Pengguna</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET PASSWORD PETUGAS */}
      {selectedUserForReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#081E3D] px-6 py-4.5 text-white flex items-center justify-between border-b border-blue-900/50">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">Reset Password Petugas</h3>
                  <p className="text-xs text-blue-200 mt-0.5">{selectedUserForReset.fullName} ({selectedUserForReset.username})</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForReset(null)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteResetPassword} className="p-6 space-y-4">
              {resetError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {resetSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password baru untuk {selectedUserForReset.username} berhasil disimpan!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Minimal 6 karakter"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ulangi Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={resetConfirmPass}
                  onChange={(e) => setResetConfirmPass(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Ketik ulang password baru"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedUserForReset(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={resetSuccess}
                  className="px-5 py-2 text-xs font-extrabold bg-[#0A3981] hover:bg-[#081E3D] text-white rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simpan Password Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2.5: EDIT DATA PENGGUNA ADMIN (KHUSUS SUPER ADMIN) */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-[#081E3D] px-6 py-4.5 text-white flex items-center justify-between border-b border-blue-900/50">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">Edit Data Pengguna Admin</h3>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Khusus Super Admin: Kelola profil, peran kedinasan, dan status akun
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForEdit(null)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditUser} className="p-6 space-y-4">
              {editError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{editError}</span>
                </div>
              )}

              {editSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{editSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap Petugas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Peran / Hak Akses <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                  >
                    <option value="Tim Verifikator Lapangan">Tim Verifikator Lapangan</option>
                    <option value="Operator Disperkim">Operator Disperkim</option>
                    <option value="Sub-Admin Kecamatan">Sub-Admin Kecamatan</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Username Login <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50"
                    placeholder="username"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Instansi / Unit Penugasan
                  </label>
                  <input
                    type="text"
                    value={editAgency}
                    onChange={(e) => setEditAgency(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Unit penugasan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Kedinasan
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="email@konawekab.go.id"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    No WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="0812-xxxx-xxxx"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ganti Password (Opsional)
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Biarkan jika tidak ingin mengubah password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Minimal 6 karakter jika ingin mengganti kata sandi</p>
              </div>

              {/* Status Akun Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsActiveCheck"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="editIsActiveCheck" className="text-xs text-slate-700 font-semibold cursor-pointer">
                  Status Akun Aktif (Dapat login dan mengakses portal sistem)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-extrabold bg-[#0A3981] hover:bg-[#081E3D] text-white rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-amber-300" />
                  <span>Simpan Perubahan Data</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: UBAH KREDENSIAL SUPER ADMIN UTAMA */}
      {isCredsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-[#081E3D] px-6 py-4.5 text-white flex items-center justify-between border-b border-blue-900/50">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shadow-xs">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Pengaturan Akun Super Admin Induk</h3>
                  <p className="text-xs text-blue-200 mt-0.5">Kelola data otorisasi login dan hak akses penuh</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCredsModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCredentials} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kredensial Super Admin berhasil diperbarui & disimpan!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Penanggung Jawab
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.adminName}
                    onChange={(e) => setFormData(prev => ({ ...prev, adminName: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Contoh: Administrator Bidang PKP"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Kedinasan
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="admin.disperkim@konawekab.go.id"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Username Login
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-slate-50/50"
                    placeholder="superadmin"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Digunakan untuk login ke panel kontrol Super Admin</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi Baru (Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-3 pr-10 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Gunakan kombinasi yang kuat dan simpan dengan aman</p>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                <strong>Catatan Keamanan:</strong> Perubahan kredensial ini tersimpan secara lokal dan langsung aktif pada formulir Login. Harap catat username dan password baru Anda.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCredsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveSuccess}
                  className="px-5 py-2 text-xs font-bold bg-[#081E3D] hover:bg-blue-900 text-white rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Tersimpan!</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Simpan Perubahan Kredensial</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
