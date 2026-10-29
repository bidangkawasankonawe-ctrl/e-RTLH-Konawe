import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Clock,
  Bell, 
  ChevronDown, 
  Menu, 
  CheckCircle2, 
  RefreshCw, 
  PlusCircle, 
  ExternalLink, 
  Sliders, 
  Database,
  ShieldCheck,
  ChevronRight,
  Lock,
  Unlock,
  LogOut
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { UserRole } from '../utils/privacyMask';

interface TopNavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSearch: () => void;
  onOpenSyncModal: () => void;
  onOpenNewEntryModal: () => void;
  onOpenFormModal: () => void;
  onResetToDemo: () => void;
  onTriggerSync: () => void;
  isSyncing: boolean;
  isDemoData: boolean;
  onToggleMobileSidebar: () => void;
  userRole?: UserRole;
  onToggleUserRole?: (role: UserRole) => void;
  onLogout?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenSyncModal,
  onOpenNewEntryModal,
  onOpenFormModal,
  onResetToDemo,
  onTriggerSync,
  isSyncing,
  isDemoData,
  onToggleMobileSidebar,
  userRole = 'Super Admin',
  onToggleUserRole,
  onLogout,
}) => {
  const isSuperAdmin = userRole === 'Super Admin';
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const tabLabels: Record<NavTab, string> = {
    beranda: 'Beranda',
    table: 'Data BNBA',
    statistik: 'Statistik',
    map: 'Peta Sebaran',
    admin: 'Admin',
  };

  // Waktu & Tanggal Otomatis (Default sistem / client realtime)
  const [currentDateTime, setCurrentDateTime] = useState<Date>(() => new Date());

  useEffect(() => {
    // Sinkronisasi waktu otomatis secara realtime
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format tanggal Indonesia lengkap (Hari, Tanggal Bulan Tahun)
  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentDateTime);

  // Format jam otomatis (HH:mm:ss)
  const timeFormatted = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(currentDateTime);

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between no-print shadow-xs">
      
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-sm">
          <span 
            onClick={() => setActiveTab('beranda')}
            className="text-slate-400 hover:text-slate-700 cursor-pointer font-medium"
          >
            SI-RTLH
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-bold text-slate-800">
            {tabLabels[activeTab]}
          </span>
        </div>
      </div>

      {/* Right: Search, Date, Notifications, and Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        
        {/* Search Input Bar */}
        <div 
          onClick={onOpenSearch}
          className="hidden md:flex items-center space-x-2.5 bg-slate-100/90 hover:bg-slate-100 text-slate-400 hover:text-slate-600 px-3.5 py-1.5 rounded-xl border border-slate-200/80 cursor-pointer transition w-60 lg:w-72"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 select-none flex-1 truncate">
            Cari data penerima...
          </span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
          title="Cari Data"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Date Display */}
        <div 
          title="Waktu & Tanggal Otomatis Terkini"
          className="hidden sm:flex items-center space-x-2.5 text-xs font-medium text-slate-700 bg-slate-50/90 hover:bg-slate-100/80 border border-slate-200/90 px-3 py-1.5 rounded-xl transition shadow-2xs cursor-default select-none"
        >
          <div className="flex items-center space-x-1.5 text-blue-600">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-800">{todayFormatted}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1 font-mono text-[11px] font-semibold text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-200/60">
            <Clock className="w-3 h-3 text-blue-500 animate-pulse" />
            <span>{timeFormatted}</span>
          </div>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileOpen(false);
            }}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition relative"
            title="Notifikasi Aktivitas"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Notifikasi Sistem</span>
                <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  Real-time
                </span>
              </div>
              <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto text-xs">
                <div className="p-3 hover:bg-slate-50 transition">
                  <div className="font-semibold text-slate-800">Sinkronisasi Spreadsheet Aktif</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Database RTLH 24 penerima di 12 kecamatan telah dimuat.</div>
                  <div className="text-[10px] text-slate-400 mt-1">Baru saja</div>
                </div>
                <div className="p-3 hover:bg-slate-50 transition">
                  <div className="font-semibold text-slate-800">Instrumen KemenPKP</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">Format standar BSPS KemenPKP 2026 diterapkan untuk seluruh usulan.</div>
                  <div className="text-[10px] text-slate-400 mt-1">Hari ini</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationOpen(false);
            }}
            className="flex items-center space-x-2.5 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 cursor-pointer transition select-none"
          >
            <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center border shadow-2xs ${
              isSuperAdmin 
                ? 'bg-blue-100 border-blue-300 text-blue-800' 
                : 'bg-amber-100 border-amber-300 text-amber-800'
            }`}>
              {isSuperAdmin ? 'S' : 'P'}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>{isSuperAdmin ? 'Super Admin' : 'User Publik'}</span>
                {!isSuperAdmin && <Lock className="w-2.5 h-2.5 text-amber-600" />}
              </div>
              <div className="text-[10px] text-slate-400">
                {isSuperAdmin ? 'Akses Penuh NIK' : 'NIK Disamarkan'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Profile Menu Popup */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>{isSuperAdmin ? 'Super Admin Disperkim' : 'Tamu / User Publik'}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSuperAdmin ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isSuperAdmin ? 'Admin' : 'Publik'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">bidangkawasankonawe@gmail.com</div>
              </div>

              {/* Role Switcher in Menu */}
              {onToggleUserRole && (
                <div className="p-3 bg-slate-50 border-b border-slate-100">
                  <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                    <span>Ganti Peran Hak Akses:</span>
                    <span className="text-[10px] text-slate-400 font-normal">UU PDP</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        onToggleUserRole('Super Admin');
                        setIsProfileOpen(false);
                      }}
                      className={`p-1.5 rounded-lg border text-left text-[11px] font-semibold transition cursor-pointer ${
                        isSuperAdmin 
                          ? 'bg-blue-700 text-white border-blue-700 shadow-2xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1 font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Super Admin</span>
                      </div>
                      <div className={`text-[9px] mt-0.5 ${isSuperAdmin ? 'text-blue-100' : 'text-slate-400'}`}>
                        NIK &amp; KK Penuh
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onToggleUserRole('User Publik');
                        setIsProfileOpen(false);
                      }}
                      className={`p-1.5 rounded-lg border text-left text-[11px] font-semibold transition cursor-pointer ${
                        !isSuperAdmin 
                          ? 'bg-amber-600 text-white border-amber-600 shadow-2xs' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1 font-bold">
                        <Lock className="w-3 h-3" />
                        <span>User Publik</span>
                      </div>
                      <div className={`text-[9px] mt-0.5 ${!isSuperAdmin ? 'text-amber-100' : 'text-slate-400'}`}>
                        NIK Disamarkan
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenNewEntryModal();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-blue-700" />
                  <span>Tambah Data Usulan Baru</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenFormModal();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-indigo-600" />
                  <span>Input via Google Form</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onTriggerSync();
                  }}
                  disabled={isSyncing}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Google Sheets'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenSyncModal();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                >
                  <Database className="w-4 h-4 text-slate-500" />
                  <span>Pengaturan Integrasi Database</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1 space-y-0.5">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onResetToDemo();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-amber-50 text-amber-800 font-medium flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Reset ke Data Demo Kab. Konawe</span>
                </button>

                {onLogout && (
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Keluar ke Halaman Login</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
