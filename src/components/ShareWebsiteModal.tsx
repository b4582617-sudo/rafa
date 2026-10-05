import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Globe,
  QrCode,
  X,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Code
} from 'lucide-react';
import { SHARED_APP_URL, DEV_APP_URL, copyTextToClipboard } from '../utils/appUrl';

interface ShareWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicUrl?: string;
  onOpenInstallModal?: () => void;
}

export const ShareWebsiteModal: React.FC<ShareWebsiteModalProps> = ({
  isOpen,
  onClose,
  publicUrl = SHARED_APP_URL,
  onOpenInstallModal,
}) => {
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedDev, setCopiedDev] = useState(false);
  const [activeTab, setActiveTab] = useState<'public' | 'dev'>('public');

  if (!isOpen) return null;

  const currentDisplayUrl = activeTab === 'public' ? publicUrl : DEV_APP_URL;

  const handleCopy = async (text: string, isDev = false) => {
    const success = await copyTextToClipboard(text);
    if (success) {
      if (isDev) {
        setCopiedDev(true);
        setTimeout(() => setCopiedDev(false), 2500);
      } else {
        setCopiedMain(true);
        setTimeout(() => setCopiedMain(false), 2500);
      }
    }
  };

  const whatsappShareText = encodeURIComponent(
    `Halo! Berikut tautan resmi Portal SIMRUANG untuk peminjaman ruang lab, aula, dan proyektor kampus bebas bentrok:\n${currentDisplayUrl}`
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappShareText}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-slate-900 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-indigo-200 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Akses Website Publik Online
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Tautan Website SIMRUANG
              </h2>
            </div>
          </div>

          {/* Quick tab switcher between Production and Dev */}
          <div className="flex items-center gap-2 mt-4 bg-black/20 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('public')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'public'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Link Publik (Utama)</span>
            </button>
            <button
              onClick={() => setActiveTab('dev')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'dev'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Link Preview Dev</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Klik tombol <strong>Buka Website</strong> di bawah untuk membuka langsung di peramban browser baru, atau klik <strong>Salin Link</strong> untuk membagikannya ke civitas akademika kampus.
          </p>

          {/* URL Box & Actions for Active Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                {activeTab === 'public' ? (
                  <>
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Link Website Resmi (Bisa Diakses Publik & Semua Perangkat)</span>
                  </>
                ) : (
                  <>
                    <Code className="w-3.5 h-3.5 text-amber-600" />
                    <span>Link Lingkungan Pengembangan (Development Preview)</span>
                  </>
                )}
              </label>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                HTTPS Aktif
              </span>
            </div>

            {/* Clickable URL Container */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-slate-50 border border-slate-300 rounded-xl">
              <a
                href={currentDisplayUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Klik untuk membuka link website ini langsung di tab baru"
                className="flex-1 bg-white hover:bg-indigo-50/50 text-indigo-700 hover:text-indigo-900 font-mono text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 truncate flex items-center gap-1.5 transition-colors group"
              >
                <span className="truncate">{currentDisplayUrl}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-indigo-600 ml-auto" />
              </a>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(currentDisplayUrl, activeTab === 'dev')}
                  className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5 ${
                    (activeTab === 'public' ? copiedMain : copiedDev)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  {(activeTab === 'public' ? copiedMain : copiedDev) ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Primary Quick Open & Share Buttons (Reliable <a> tags instead of blocked window.open) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href={currentDisplayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 text-xs font-bold text-slate-900 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-300 hover:border-indigo-300 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs text-center"
            >
              <ExternalLink className="w-4 h-4 text-indigo-600" />
              <span>Buka Website di Tab Baru</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs text-center"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan ke WhatsApp</span>
            </a>
          </div>

          {/* QR Code Quick Scan for Mobile Phones */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(currentDisplayUrl)}`}
                alt="QR Code Website"
                className="w-20 h-20"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 space-y-1.5 text-center sm:text-left">
              <span className="font-bold text-slate-800 text-xs flex items-center justify-center sm:justify-start gap-1">
                <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                <span>Scan QR Code dari HP Smartphone</span>
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Arahkan kamera smartphone Android atau iPhone Anda ke gambar QR Code ini untuk membuka website secara langsung tanpa mengetik URL.
              </p>
            </div>
          </div>

          {/* Info Banner & Multi-Device guidance */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 space-y-2 text-indigo-950">
            <div className="flex items-center justify-between">
              <div className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Dapat Diakses di Semua Perangkat</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                PWA Ready
              </span>
            </div>
            <p className="text-indigo-900 text-[11px] leading-relaxed">
              Website ini telah dioptimalkan dengan navigasi responsif, ramah sentuhan, dan dapat dipasang sebagai aplikasi beranda (*Add to Home Screen*) di HP Android, iPhone iOS, tablet, dan laptop PC.
            </p>
            {onOpenInstallModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInstallModal();
                }}
                className="w-full mt-1 py-2 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-100/50 border border-indigo-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Lihat Panduan Pasang di HP Android / iOS / PC</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Validasi SSL & Enkripsi Aktif</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
