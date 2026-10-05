import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
  Monitor,
  Users,
  Search,
  FileText,
  Mail,
  HelpCircle,
  Sparkles,
  Phone,
  ChevronDown,
  Globe,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Laptop,
  Download,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { Booking } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';
import { checkScheduleConflict } from '../utils/conflictDetector';
import { getFormattedDate } from '../data/initialBookings';
import { ADMIN_EMAIL } from '../utils/emailService';
import { getActiveAppUrl, SHARED_APP_URL, copyTextToClipboard } from '../utils/appUrl';

interface PublicHomeProps {
  existingBookings: Booking[];
  onNavigateToForm: (resourceId?: string, date?: string) => void;
  onNavigateToSchedule: (date?: string) => void;
  onNavigateToCatalog: () => void;
  onOpenTrackModal: () => void;
  onOpenShareModal: () => void;
  onOpenInstallModal?: () => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({
  existingBookings,
  onNavigateToForm,
  onNavigateToSchedule,
  onNavigateToCatalog,
  onOpenTrackModal,
  onOpenShareModal,
  onOpenInstallModal,
}) => {
  // Quick Checker State
  const [checkResourceId, setCheckResourceId] = useState<string>('lab-komputer-1');
  const [checkDate, setCheckDate] = useState<string>(getFormattedDate(0));
  const [checkStartTime, setCheckStartTime] = useState<string>('09:00');
  const [checkEndTime, setCheckEndTime] = useState<string>('11:00');

  // Accordion FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const [appUrl, setAppUrl] = useState<string>(SHARED_APP_URL);

  useEffect(() => {
    setAppUrl(getActiveAppUrl());
  }, []);

  const handleCopyLink = async () => {
    const success = await copyTextToClipboard(appUrl);
    if (success) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  // Quick Conflict Check Result
  const selectedResource = useMemo(
    () => AVAILABLE_RESOURCES.find((r) => r.id === checkResourceId),
    [checkResourceId]
  );

  const checkResult = useMemo(() => {
    const isRoom = selectedResource?.category === 'room';
    return checkScheduleConflict(
      {
        date: checkDate,
        startTime: checkStartTime,
        endTime: checkEndTime,
        roomId: isRoom ? checkResourceId : null,
        equipmentIds: !isRoom ? [checkResourceId] : [],
      },
      existingBookings
    );
  }, [checkDate, checkStartTime, checkEndTime, checkResourceId, selectedResource, existingBookings]);

  const faqs = [
    {
      q: 'Bagaimana jika jadwal yang saya ajukan berbentrokan dengan pihak lain?',
      a: 'Sistem SIMRUANG memiliki mesin deteksi bentrok otomatis real-time. Jika jam atau sarana yang Anda pilih sudah terisi, sistem akan seketika menolak pengajuan tersebut dan memberikan rekomendasi slot jam kosong lain di hari yang sama agar tidak terjadi tumpang tindih.',
    },
    {
      q: 'Berapa lama proses persetujuan peminjaman sarana?',
      a: 'Persetujuan dilakukan secara otomatis (Auto-Approval) dalam hitungan detik setelah Anda mengirim formulir, asalkan jadwal tersedia tanpa bentrokan. Notifikasi resmi langsung diteruskan ke email admin sarpras (yulie234999@gmail.com).',
    },
    {
      q: 'Kapan dan di mana kunci ruangan atau proyektor dapat diambil?',
      a: 'Peminjam dapat menunjukkan bukti Surat Izin Peminjaman Digital (atau QR Tiket) ke Pos Layanan Sarpras di Gedung Rektorat Lt. 1 paling cepat 15 menit sebelum jam pemakaian dimulai.',
    },
    {
      q: 'Apakah pihak luar atau ormawa dapat meminjam sarana?',
      a: 'Ya, seluruh dosen, mahasiswa, organisasi kemahasiswaan (BEM/HIMA/UKM), maupun mitra eksternal universitas dapat mengajukan peminjaman secara mandiri melalui website publik ini.',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 text-white min-h-[480px] sm:min-h-[520px] flex flex-col justify-center px-6 sm:px-12 py-12 sm:py-16 shadow-lg">
        {/* Background Image with layered gradient scrim */}
        <img
          src="/src/assets/images/aula_auditorium_hall_1790562670131.jpg"
          alt="Aula dan Fasilitas Kampus"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-sky-300 bg-sky-950/80 border border-sky-800/80 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Portal Layanan Publik Sarpras Kampus 24/7</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Peminjaman Ruang Lab, Aula, & Alat Inventaris
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Layanan mandiri terpadu dengan <strong className="text-white">sistem anti-bentrok cerdas</strong>. Jadwal tervalidasi seketika, disetujui otomatis, dan notifikasi resmi langsung terbit ke email admin sarpras tanpa birokrasi manual yang rumit.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToForm()}
              className="px-6 py-3 text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
            >
              <span>+ Ajukan Peminjaman Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateToSchedule()}
              className="px-5 py-3 text-sm font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Lihat Kalender Ketersediaan</span>
            </button>

            {onOpenInstallModal && (
              <button
                onClick={onOpenInstallModal}
                className="px-4 py-3 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/80 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bisa Diakses di Semua HP & PC</span>
              </button>
            )}

            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 text-xs font-bold text-sky-300 hover:text-white bg-sky-950/70 hover:bg-sky-900/90 border border-sky-600/80 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Buka website SIMRUANG langsung di tab peramban baru"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Buka Website (Tab Baru)</span>
            </a>

            <button
              onClick={onOpenShareModal}
              className="px-4 py-3 text-xs font-semibold text-indigo-200 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/80 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bagikan Link & QR</span>
            </button>

            <button
              onClick={onOpenTrackModal}
              className="px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Lacak Status Tiket Anda</span>
            </button>
          </div>

          {/* Live Trust Metrics */}
          <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-400">
            <div>
              <div className="text-xl font-bold font-mono text-white">0 Menit</div>
              <div>Persetujuan Instan</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-emerald-400">100% Bebas</div>
              <div>Bentrokan Jadwal</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-sky-400">9 Fasilitas</div>
              <div>Lab, Aula & Proyektor</div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Share & Direct URL Bar */}
      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  Tautan Website Resmi Aktif
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                Portal Peminjaman Ruang & Alat Online
              </h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-indigo-500/30 lg:max-w-xl w-full">
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Klik untuk membuka website di tab baru"
              className="flex-1 px-3 py-2 text-xs font-mono text-sky-300 hover:text-white hover:bg-white/5 rounded-lg select-all truncate flex items-center justify-between gap-1.5 transition-colors group"
            >
              <span className="truncate">{appUrl}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-300 shrink-0" />
            </a>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                title="Buka langsung di tab browser baru"
              >
                <ExternalLink className="w-3 h-3 text-sky-400" />
                <span>Buka</span>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  linkCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {linkCopied ? (
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

              <button
                type="button"
                onClick={onOpenShareModal}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                Opsi Bagikan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Real-Time Quick Checker Widget */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Alat Pengecekan Cepat
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Cek Ketersediaan Sarana Sebelum Mengajukan
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pilih ruang atau proyektor serta tentukan rentang waktu untuk memeriksa apakah jadwal masih kosong.
            </p>
          </div>

          <button
            onClick={() => onNavigateToSchedule(checkDate)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1 self-start md:self-auto"
          >
            <span>Buka Matriks Kalender Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Checker Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Ruangan / Alat
            </label>
            <select
              value={checkResourceId}
              onChange={(e) => setCheckResourceId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              <optgroup label="Ruangan (Lab & Aula)">
                {AVAILABLE_RESOURCES.filter((r) => r.category === 'room').map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Alat & Inventaris">
                {AVAILABLE_RESOURCES.filter((r) => r.category === 'equipment').map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tanggal Pemakaian
            </label>
            <input
              type="date"
              value={checkDate}
              onChange={(e) => setCheckDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jam Mulai
            </label>
            <input
              type="time"
              value={checkStartTime}
              onChange={(e) => setCheckStartTime(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jam Selesai
            </label>
            <input
              type="time"
              value={checkEndTime}
              onChange={(e) => setCheckEndTime(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Checker Live Status Result Banner */}
        <div className="mt-5 p-4 rounded-xl border transition-all">
          {checkResult.hasConflict ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-red-50/60 p-2 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-red-900">
                    Jadwal Terisi (Terjadi Bentrokan)
                  </div>
                  <p className="text-red-700 mt-0.5 leading-relaxed">
                    {checkResult.explanation}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateToSchedule(checkDate)}
                className="px-4 py-2 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 border border-red-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap self-end sm:self-center"
              >
                Cari Jam Kosong Lain
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50/60 p-2 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-emerald-900">
                    Jadwal Kosong & Tersedia! (Bisa Langsung Disetujui Otomatis)
                  </div>
                  <p className="text-emerald-700 mt-0.5">
                    "{selectedResource?.name}" belum memiliki agenda pada {checkDate} pukul {checkStartTime} - {checkEndTime} WIB.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateToForm(checkResourceId, checkDate)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer whitespace-nowrap self-end sm:self-center flex items-center gap-1.5 shadow-2xs"
              >
                <span>Pinjam Slot Ini Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Alur Peminjaman 3 Langkah (SOP Mandiri) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Prosedur Mudah & Transparan
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Alur Peminjaman Sarpras Mandiri
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Cukup 3 tahapan digital tanpa perlu formulir kertas atau tanda tangan manual berulang kali.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold font-mono text-base mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Pilih Sarana & Jadwal
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Tentukan laboratorium, aula, atau proyektor yang Anda butuhkan serta tentukan jam mulai dan selesai kegiatan.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold font-mono text-base mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Validasi Otomatis Anti-Bentrok
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Mesin sistem langsung memeriksa bentrokan secara instan. Jika bertabrakan, sistem otomatis menolak dan menyarankan jam lain.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold font-mono text-base mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Persetujuan & Surat Izin Terbit
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Jadwal disetujui otomatis, notifikasi email resmi terkirim ke admin sarpras ({ADMIN_EMAIL}), dan surat izin siap diunduh/cetak.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Highlight Fasilitas Unggulan */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Fasilitas Kampus Unggulan
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">
              Sarana Favorit Perkuliahan & Kegiatan
            </h2>
          </div>

          <button
            onClick={onNavigateToCatalog}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer flex items-center gap-1"
          >
            <span>Lihat Semua ({AVAILABLE_RESOURCES.length} Sarana)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {AVAILABLE_RESOURCES.slice(0, 4).map((res) => (
            <div
              key={res.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  {res.image && (
                    <img
                      src={res.image}
                      alt={res.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  {res.capacity && (
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded bg-white/90 text-slate-800 shadow-2xs">
                        <Users className="w-3 h-3 text-indigo-600" />
                        <span>{res.capacity} Org</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {res.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => onNavigateToForm(res.id)}
                  className="w-full py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Pinjam Sarana Ini</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Device & Cross-Platform Compatibility Section */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-indigo-900/50 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full inline-flex items-center gap-1.5 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                100% Responsif & Siap Diakses di Mana Saja
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Bisa Diakses Secara Mulus dari Semua Perangkat
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Portal SIMRUANG dirancang dengan arsitektur <em>Mobile-First & Progressive Web App (PWA)</em>. Anda dapat membuka jadwal, mengajukan peminjaman, dan mengunduh surat izin langsung dari ponsel pintar tanpa perlu install dari Play Store / App Store, maupun dari laptop dan PC kantor.
              </p>
            </div>

            {onOpenInstallModal && (
              <button
                type="button"
                onClick={onOpenInstallModal}
                className="px-5 py-3 text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2 shrink-0 self-start md:self-auto"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Panduan & Pasang Aplikasi</span>
              </button>
            )}
          </div>

          {/* Device Support Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Android Smartphone */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 hover:border-emerald-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Smartphone Android</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Google Chrome, Samsung Internet, Firefox. Mendukung instalasi 1-klik PWA ke layar beranda HP.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Navigasi jempol bawah otomatis</span>
              </div>
            </div>

            {/* 2. Apple iOS (iPhone) */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 hover:border-sky-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">iPhone (Apple iOS)</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Safari iOS. Kompatibel dengan fitur <em>"Add to Home Screen"</em> dengan tampilan layar penuh seperti aplikasi App Store.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-[10px] text-sky-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Optimasi layar Safe-Area & Notch</span>
              </div>
            </div>

            {/* 3. iPad & Android Tablet */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 hover:border-indigo-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Tablet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Tablet & iPad</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Orientasi portrait & landscape. Matriks kalender sentuh yang responsif dan navigasi multi-kolom yang leluasa.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-[10px] text-indigo-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Touch gestures & split-screen</span>
              </div>
            </div>

            {/* 4. Laptop & Desktop PC */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 hover:border-purple-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Laptop & Komputer PC</h3>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Windows, macOS, Linux (Chrome, Edge, Safari). Cetak tiket PDF resolusi tinggi dan dashboard admin lengkap.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center gap-1.5 text-[10px] text-purple-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Keyboard shortcut & print ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Bantuan & Panduan
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Informasi penting seputar tata tertib peminjaman, pengambilan kunci, dan pembatalan.
          </p>
        </div>

        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed pl-1 pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Public Contact & Sarpras Information Card */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
              Layanan Pelanggan & Pengelola
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Biro Sarana, Prasarana & Laboratorium
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Membutuhkan asistensi teknis, penyesuaian tata panggung aula khusus, atau bantuan koordinasi kegiatan akbar? Hubungi langsung sekretariat sarpras kampus.
            </p>

            <div className="mt-6 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  Email Admin Pengelola:{' '}
                  <strong className="font-mono text-white">{ADMIN_EMAIL}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Jam Layanan Pos Sarpras: Senin - Jumat, 07:30 - 18:00 WIB</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Lokasi: Gedung Pelayanan Terpadu Kampus Lt. 1, Meja Layanan Sarpras</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Komitmen Bebas Bentrokan</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Setiap peminjaman yang diajukan langsung melalui portal ini dijamin tercatat di database sentral. Sistem menjamin tidak ada dua agenda yang dapat menempati ruangan atau alat yang sama pada jam yang sama.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateToForm()}
                className="w-full py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Mulai Pengajuan Peminjaman Mandiri
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
