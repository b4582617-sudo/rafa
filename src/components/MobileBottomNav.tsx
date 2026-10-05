import React, { useState } from 'react';
import {
  Home,
  Building,
  Calendar,
  PlusCircle,
  Menu,
  X,
  Search,
  Share2,
  ShieldCheck,
  Download,
  Smartphone,
  Laptop
} from 'lucide-react';
import { AnyTabType } from './Navbar';

interface MobileBottomNavProps {
  activeTab: AnyTabType;
  setActiveTab: (tab: AnyTabType) => void;
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  unreadEmailCount: number;
  totalApprovedCount: number;
  onOpenTrackModal: () => void;
  onOpenShareModal: () => void;
  onOpenInstallModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  isAdminMode,
  setIsAdminMode,
  unreadEmailCount,
  onOpenTrackModal,
  onOpenShareModal,
  onOpenInstallModal,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMoreMenuOpen && (
        <div
          onClick={() => setIsMoreMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Mobile "More" Drawer Sheet */}
      {isMoreMenuOpen && (
        <div className="fixed bottom-16 inset-x-0 mx-auto max-w-lg z-50 bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 p-4 lg:hidden animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Menu & Akses Perangkat
              </span>
            </div>
            <button
              onClick={() => setIsMoreMenuOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3">
            {/* Lacak Tiket */}
            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                onOpenTrackModal();
              }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Lacak Tiket</p>
                <p className="text-[10px] text-slate-500">Cek status izin pinjam</p>
              </div>
            </button>

            {/* Bagikan Link */}
            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                onOpenShareModal();
              }}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Bagikan Link</p>
                <p className="text-[10px] text-slate-500">Kirim URL / QR Code</p>
              </div>
            </button>

            {/* Pasang Aplikasi PWA */}
            {onOpenInstallModal && (
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenInstallModal();
                }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 text-left transition-colors col-span-2"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-indigo-950">Pasang di HP / Tablet / PC</p>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-600 text-white rounded">PWA</span>
                  </div>
                  <p className="text-[10px] text-indigo-700">Instal cepat tanpa lewat app store</p>
                </div>
              </button>
            )}

            {/* Admin Switch */}
            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                const nextMode = !isAdminMode;
                setIsAdminMode(nextMode);
                setActiveTab(nextMode ? 'bookings' : 'home');
              }}
              className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-colors col-span-2 ${
                isAdminMode
                  ? 'bg-amber-100 border-amber-300 text-amber-950 font-medium'
                  : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                isAdminMode ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-400'
              }`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold">
                    {isAdminMode ? 'Mode Admin Aktif (Keluar)' : 'Akses Pengelola Sarpras (Admin)'}
                  </p>
                  {unreadEmailCount > 0 && !isAdminMode && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black bg-amber-400 text-slate-950 rounded-full">
                      {unreadEmailCount} baru
                    </span>
                  )}
                </div>
                <p className={`text-[10px] ${isAdminMode ? 'text-amber-800' : 'text-slate-400'}`}>
                  {isAdminMode ? 'Klik untuk kembali ke publik' : 'Notifikasi email & persetujuan yulie234999@gmail.com'}
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Fixed Native-like Bottom Navigation Dock for Mobile / Smartphone */}
      <nav
        aria-label="Navigasi Seluler"
        className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] lg:hidden pb-safe"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
          {/* 1. Beranda */}
          <button
            onClick={() => {
              setIsMoreMenuOpen(false);
              setActiveTab('home');
            }}
            className={`flex flex-col items-center justify-center h-full transition-all active:scale-95 ${
              activeTab === 'home'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'home' ? 'bg-indigo-50' : ''}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Beranda</span>
          </button>

          {/* 2. Katalog */}
          <button
            onClick={() => {
              setIsMoreMenuOpen(false);
              setActiveTab('catalog');
            }}
            className={`flex flex-col items-center justify-center h-full transition-all active:scale-95 ${
              activeTab === 'catalog'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'catalog' ? 'bg-indigo-50' : ''}`}>
              <Building className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Katalog</span>
          </button>

          {/* 3. Center Highlight: Pinjam (+) */}
          <button
            onClick={() => {
              setIsMoreMenuOpen(false);
              setActiveTab('form');
            }}
            className="flex flex-col items-center justify-center -mt-4 transition-all active:scale-90 group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
              activeTab === 'form'
                ? 'bg-indigo-700 text-white ring-4 ring-indigo-100 shadow-indigo-500/30'
                : 'bg-indigo-600 text-white shadow-indigo-500/25'
            }`}>
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-bold tracking-tight mt-1 ${
              activeTab === 'form' ? 'text-indigo-700' : 'text-slate-700'
            }`}>
              Pinjam
            </span>
          </button>

          {/* 4. Jadwal */}
          <button
            onClick={() => {
              setIsMoreMenuOpen(false);
              setActiveTab('schedule');
            }}
            className={`flex flex-col items-center justify-center h-full transition-all active:scale-95 ${
              activeTab === 'schedule'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-full ${activeTab === 'schedule' ? 'bg-indigo-50' : ''}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">Jadwal</span>
          </button>

          {/* 5. Menu / Lebih Banyak */}
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center h-full transition-all active:scale-95 relative ${
              isMoreMenuOpen || isAdminMode
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-full ${isMoreMenuOpen ? 'bg-indigo-50' : ''}`}>
              {isMoreMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">
              {isAdminMode ? 'Admin' : 'Menu'}
            </span>
            {unreadEmailCount > 0 && !isAdminMode && (
              <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
