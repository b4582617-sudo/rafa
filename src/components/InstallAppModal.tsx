import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Download,
  CheckCircle2,
  X,
  Share2,
  ExternalLink,
  QrCode,
  Copy,
  Check,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { copyTextToClipboard } from '../utils/appUrl';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicUrl: string;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  publicUrl,
}) => {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'ios' | 'desktop'>('mobile');
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Detect device on mount
    const ua = navigator.userAgent || '';
    if (/iPad|iPhone|iPod/.test(ua)) {
      setActiveDevice('ios');
    } else if (/Android|Mobile/.test(ua)) {
      setActiveDevice('mobile');
    } else {
      setActiveDevice('desktop');
    }

    // Capture beforeinstallprompt event for Chromium browsers
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyTextToClipboard(publicUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Multi-Device & PWA Ready
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Akses Website di Semua Perangkat
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
            SIMRUANG dapat diakses langsung melalui browser maupun diinstal sebagai aplikasi mandiri di HP Android, iPhone, iPad, Tablet, Laptop, dan Komputer PC.
          </p>

          {/* Device Tabs */}
          <div className="grid grid-cols-3 gap-1.5 mt-5 bg-white/10 p-1 rounded-xl">
            <button
              onClick={() => setActiveDevice('mobile')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                activeDevice === 'mobile'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>HP Android</span>
            </button>

            <button
              onClick={() => setActiveDevice('ios')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                activeDevice === 'ios'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Tablet className="w-4 h-4 text-sky-500" />
              <span>iPhone & iPad</span>
            </button>

            <button
              onClick={() => setActiveDevice('desktop')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
                activeDevice === 'desktop'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Laptop className="w-4 h-4 text-indigo-400" />
              <span>Laptop / PC</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Active Device Instructions */}
          {activeDevice === 'mobile' && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                  <h4 className="text-sm font-bold text-emerald-950">
                    Panduan Smartphone Android (Chrome / Samsung Browser)
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Instalasi Instan
                </span>
              </div>

              {isInstallable && !installSuccess && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Pasang Aplikasi SIMRUANG Sekarang (1-Klik)</span>
                </button>
              )}

              {installSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Aplikasi berhasil ditambahkan ke layar utama smartphone Anda!</span>
                </div>
              )}

              <ol className="text-xs text-emerald-900 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Buka link website resmi di browser Google Chrome / Samsung Internet.</li>
                <li>Tap ikon titik tiga (<strong>⋮</strong>) di pojok kanan atas browser.</li>
                <li>Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Instal Aplikasi"</strong>.</li>
                <li>Ikon SIMRUANG akan muncul di menu aplikasi HP Anda seperti aplikasi native tanpa perlu Play Store!</li>
              </ol>
            </div>
          )}

          {activeDevice === 'ios' && (
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tablet className="w-5 h-5 text-sky-700" />
                  <h4 className="text-sm font-bold text-sky-950">
                    Panduan Apple iOS (iPhone & iPad Safari)
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                  Home Screen App
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-sky-200/80 text-xs text-sky-950 space-y-2 leading-relaxed">
                <p className="font-semibold text-slate-800">Cara memasang di iPhone atau iPad:</p>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px] shrink-0">1</div>
                  <p>Buka tautan website menggunakan browser <strong>Safari</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px] shrink-0">2</div>
                  <p>Tap tombol <strong>Bagikan / Share</strong> (ikon kotak dengan panah ke atas ⎋ di bagian bawah layar).</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px] shrink-0">3</div>
                  <p>Scroll ke bawah dan pilih <strong>"Add to Home Screen" (Tambah ke Layar Utama)</strong>.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-[10px] shrink-0">4</div>
                  <p>Tap <strong>"Add" (Tambah)</strong> di pojok kanan atas. Selesai!</p>
                </div>
              </div>
            </div>
          )}

          {activeDevice === 'desktop' && (
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-indigo-700" />
                  <h4 className="text-sm font-bold text-indigo-950">
                    Panduan Laptop & Komputer PC (Windows / Mac / Linux)
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                  Chrome & Edge PWA
                </span>
              </div>

              {isInstallable && !installSuccess && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Instal SIMRUANG Desktop App (Chrome / Edge)</span>
                </button>
              )}

              <ul className="text-xs text-indigo-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Buka di Google Chrome atau Microsoft Edge pada PC/Laptop Anda.</li>
                <li>Perhatikan ikon <strong>Instal (komputer dengan tanda panah ke bawah)</strong> di bilah alamat URL (Omnibox).</li>
                <li>Atau klik tombol <strong>Bookmark (Bintang) / Ctrl+D</strong> untuk menyimpan website di bilah favorit.</li>
                <li>Dapat dibuka secara langsung kapan pun tanpa batas perangkat.</li>
              </ul>
            </div>
          )}

          {/* Tautan URL & QR Code */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>Buka Cepat Lewat Scan Kamera HP</span>
              </label>
              <span className="text-[10px] text-slate-400">Scan QR Code dengan kamera smartphone</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(publicUrl)}`}
                  alt="QR Code Website SIMRUANG"
                  className="w-24 h-24"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Arahkan kamera smartphone Android atau iPhone Anda ke QR Code ini untuk langsung membuka portal tanpa perlu mengetik alamat URL.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Buka website di tab baru"
                    className="flex-1 font-mono text-[11px] text-indigo-700 hover:text-indigo-900 bg-white hover:bg-indigo-50/50 px-2.5 py-1.5 rounded-lg border border-slate-200 truncate select-all flex items-center justify-between gap-1 transition-colors group"
                  >
                    <span className="truncate">{publicUrl}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                  </a>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka</span>
                    </a>
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
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
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Responsif 100% di semua ukuran layar</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
