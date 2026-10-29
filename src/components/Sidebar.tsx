import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Users, 
  BarChart2, 
  MapPin, 
  Settings, 
  BookOpen, 
  ArrowRight,
  X,
  Lock,
  LogOut,
  ShieldCheck
} from 'lucide-react';

export type NavTab = 'beranda' | 'table' | 'statistik' | 'map' | 'admin';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenGuide: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isSuperAdmin?: boolean;
  onLogout?: () => void;
  onRequestAdminLogin?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenGuide,
  isOpenMobile = false,
  onCloseMobile,
  isSuperAdmin = true,
  onLogout,
  onRequestAdminLogin,
}) => {
  const navItems = [
    { id: 'beranda' as NavTab, label: 'Beranda', icon: LayoutDashboard },
    { id: 'table' as NavTab, label: 'Data BNBA', icon: Users },
    { id: 'statistik' as NavTab, label: 'Statistik', icon: BarChart2 },
    { id: 'map' as NavTab, label: 'Peta Sebaran', icon: MapPin },
  ];

  const adminItems = [
    { id: 'admin' as NavTab, label: 'Admin', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#081E3D] text-white flex flex-col justify-between p-4 transition-transform duration-200 ease-in-out border-r border-[#0D2D59]
        lg:translate-x-0 ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Section */}
        <div className="space-y-6">
          
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('beranda')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-[#0A3981] border border-blue-400/40 flex items-center justify-center text-white shadow-md shadow-blue-950/40">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-wider text-white leading-tight">
                  SI-RTLH
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-blue-200/80 font-bold">
                  KABUPATEN KONAWE
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button 
                onClick={onCloseMobile} 
                className="lg:hidden text-blue-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Groups */}
          <div className="space-y-5">
            {/* Menu Utama */}
            <div>
              <div className="text-[11px] font-bold text-blue-300/70 uppercase tracking-wider px-3 mb-2">
                MENU UTAMA
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`
                        w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer
                        ${isActive 
                          ? 'bg-[#154687] text-white shadow-sm border border-blue-400/30' 
                          : 'text-slate-200 hover:text-white hover:bg-[#0E2C56]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-amber-300' : 'text-blue-300/80 group-hover:text-amber-300'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Pengelolaan */}
            <div>
              <div className="text-[11px] font-bold text-blue-300/70 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
                <span>PENGELOLAAN</span>
                {!isSuperAdmin && (
                  <span className="text-[9px] text-amber-300/80 font-normal">Super Admin Only</span>
                )}
              </div>
              <nav className="space-y-1">
                {adminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (!isSuperAdmin) {
                          if (onRequestAdminLogin) onRequestAdminLogin();
                          return;
                        }
                        setActiveTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      title={!isSuperAdmin ? 'Fitur Pengelolaan ini hanya untuk Super Admin. Klik untuk login.' : 'Menu Pengelolaan Admin'}
                      className={`
                        w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group cursor-pointer
                        ${isActive 
                          ? 'bg-[#154687] text-white shadow-sm border border-blue-400/30' 
                          : !isSuperAdmin
                          ? 'text-slate-300 hover:text-white hover:bg-[#0E2C56] opacity-90'
                          : 'text-slate-200 hover:text-white hover:bg-[#0E2C56]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-amber-300' : 'text-blue-300/80 group-hover:text-amber-300'}`} />
                        <span>{item.label}</span>
                      </div>
                      {isSuperAdmin ? (
                        isActive ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono">
                            Admin
                          </span>
                        )
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20">
                          <Lock className="w-3 h-3" />
                          <span>Terkunci</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="space-y-3 pt-4">
          
          {/* Butuh bantuan? card */}
          <div className="bg-[#0C274E] rounded-2xl p-4 border border-blue-700/30 text-xs text-slate-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-amber-300 flex items-center justify-center mb-2.5 border border-blue-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="font-bold text-white text-sm">
              Butuh bantuan?
            </div>
            <p className="text-blue-100/70 text-xs mt-1 leading-relaxed">
              Panduan operasional sistem informasi RTLH Kabupaten Konawe.
            </p>
            <button
              onClick={onOpenGuide}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition cursor-pointer"
            >
              <span>Lihat panduan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User status & Logout button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-blue-200 hover:text-white bg-[#0A2548] hover:bg-red-950/50 border border-blue-800/40 hover:border-red-500/40 transition group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5 text-blue-300 group-hover:text-red-400 transition-colors" />
                <span>Keluar Akun</span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isSuperAdmin ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {isSuperAdmin ? 'Super Admin' : 'User Publik'}
              </span>
            </button>
          )}

          {/* Institutional footer indicator without AI pulse dot */}
          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-blue-200/60 font-mono">
            <span>Disperkim Kab. Konawe</span>
            <span>v1.0</span>
          </div>

        </div>
      </aside>
    </>
  );
};
