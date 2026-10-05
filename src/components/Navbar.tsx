import React from 'react';
import {
  Calendar,
  PlusCircle,
  ListChecks,
  Mail,
  BarChart3,
  Search,
  Building,
  Home,
  ShieldCheck,
  UserCheck,
  Layers,
  ArrowRight,
  Smartphone,
  Share2,
  Download,
} from 'lucide-react';
import { ADMIN_EMAIL } from '../utils/emailService';

export type PublicTabType = 'home' | 'catalog' | 'schedule' | 'form';
export type AdminTabType = 'bookings' | 'admin-emails' | 'stats';
export type AnyTabType = PublicTabType | AdminTabType;

interface NavbarProps {
  activeTab: AnyTabType;
  setActiveTab: (tab: AnyTabType) => void;
  isAdminMode: boolean;
  setIsAdminMode: (val: boolean) => void;
  unreadEmailCount: number;
  totalApprovedCount: number;
  onOpenTrackModal: () => void;
  onOpenShareModal: () => void;
  onOpenInstallModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode,
  unreadEmailCount,
  totalApprovedCount,
  onOpenTrackModal,
  onOpenShareModal,
  onOpenInstallModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Notice for Institutional Website */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-medium text-white">PORTAL RESMI SARPRAS KAMPUS</span>
            <span className="hidden sm:inline text-slate-400">· Sistem Mandiri Validasi Jadwal 24/7 Bebas Bentrok</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Buka panduan instalasi di HP Android, iPhone, Tablet & Laptop"
              >
                <Smartphone className="w-3 h-3 text-emerald-400" />
                <span className="hidden xs:inline">Semua Perangkat</span>
              </button>
            )}
            <span className="text-slate-600 hidden xs:inline">|</span>
            <button
              onClick={onOpenShareModal}
              className="text-sky-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowRight className="w-3 h-3 text-sky-400" />
              <span>Link Website</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <button
              onClick={onOpenTrackModal}
              className="text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Search className="w-3 h-3 text-indigo-400" />
              <span>Lacak Tiket</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <button
              onClick={() => {
                const nextMode = !isAdminMode;
                setIsAdminMode(nextMode);
                if (nextMode) {
                  setActiveTab('bookings');
                } else {
                  setActiveTab('home');
                }
              }}
              className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                isAdminMode
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdminMode ? 'Kembali ke Tampilan Publik' : 'Akses Pengelola Sarpras'}</span>
              {unreadEmailCount > 0 && !isAdminMode && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                S
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors block leading-tight">
                  SIMRUANG
                </span>
                <span className="text-[10px] text-slate-500 font-medium block leading-tight">
                  Peminjaman Ruang & Alat
                </span>
              </div>
            </button>

            {isAdminMode && (
              <span className="ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 rounded">
                Mode Admin
              </span>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1">
            {!isAdminMode ? (
              // Public Navigation Links
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'home'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Beranda</span>
                </button>

                <button
                  onClick={() => setActiveTab('catalog')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'catalog'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  <span>Katalog Sarana</span>
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'schedule'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Jadwal Ketersediaan</span>
                </button>

                <button
                  onClick={() => setActiveTab('form')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'form'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Form Peminjaman</span>
                </button>
              </>
            ) : (
              // Staff / Admin Management Links
              <>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'bookings'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ListChecks className="w-3.5 h-3.5" />
                  <span>Kelola Peminjaman</span>
                  <span className="font-mono text-[11px] px-1.5 py-0.2 rounded bg-slate-200">
                    {totalApprovedCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('admin-emails')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'admin-emails'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Notifikasi Admin</span>
                  {unreadEmailCount > 0 && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                      {unreadEmailCount} baru
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'stats'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Statistik & Analisis</span>
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'schedule'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Matriks Kalender</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                title="Buka panduan instalasi di HP Android, iPhone, Tablet & Laptop (PWA)"
                className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Instal di HP/PC</span>
              </button>
            )}

            <button
              onClick={onOpenShareModal}
              title="Salin dan buka tautan website resmi"
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Link Website</span>
            </button>

            <button
              onClick={onOpenTrackModal}
              title="Lacak status tiket peminjaman anda"
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lacak Tiket</span>
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">+ Pinjam</span>
              <span className="xs:hidden">+</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
