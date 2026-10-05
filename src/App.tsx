import React, { useState, useEffect, useMemo } from 'react';
import {
  Booking,
  EmailNotification,
} from './types';
import {
  loadBookings,
  saveBookings,
  loadEmailLogs,
  saveEmailLogs,
  resetAllData,
} from './utils/storage';
import {
  generateAutoApprovalEmail,
  generateRejectionAlertEmail,
  ADMIN_EMAIL,
} from './utils/emailService';
import { getFormattedDate } from './data/initialBookings';
import { Navbar, AnyTabType } from './components/Navbar';
import { PublicHome } from './components/PublicHome';
import { FacilityCatalog } from './components/FacilityCatalog';
import { BookingForm } from './components/BookingForm';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { BookingList } from './components/BookingList';
import { AdminEmailInbox } from './components/AdminEmailInbox';
import { StatsDashboard } from './components/StatsDashboard';
import { ConflictAlertModal } from './components/ConflictAlertModal';
import { SuccessApprovalModal } from './components/SuccessApprovalModal';
import { PrintTicketModal } from './components/PrintTicketModal';
import { BookingDetailModal } from './components/BookingDetailModal';
import { TrackBookingModal } from './components/TrackBookingModal';
import { ShareWebsiteModal } from './components/ShareWebsiteModal';
import { InstallAppModal } from './components/InstallAppModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CheckCircle2, AlertTriangle, Bell, X, ShieldCheck } from 'lucide-react';
import { getActiveAppUrl, SHARED_APP_URL } from './utils/appUrl';

export default function App() {
  // Public URL state for sharing (auto-detects current active domain)
  const [publicUrl, setPublicUrl] = useState<string>(() => getActiveAppUrl());

  useEffect(() => {
    setPublicUrl(getActiveAppUrl());
  }, []);

  // Main Data States
  const [bookings, setBookings] = useState<Booking[]>(() => loadBookings());
  const [emails, setEmails] = useState<EmailNotification[]>(() => loadEmailLogs());

  // Navigation State - Defaults to public 'home'
  const [activeTab, setActiveTab] = useState<AnyTabType>('home');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Interactive Form Pre-fills
  const [selectedScheduleDate, setSelectedScheduleDate] = useState<string>(getFormattedDate(0));
  const [prefillResource, setPrefillResource] = useState<string | undefined>(undefined);
  const [prefillDate, setPrefillDate] = useState<string | undefined>(undefined);

  // Modals & Active Selections
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [currentConflictReason, setCurrentConflictReason] = useState<string>('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'alert' | 'info';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'alert' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Sync to localStorage
  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    saveEmailLogs(emails);
  }, [emails]);

  // Unread email count
  const unreadEmailCount = useMemo(() => {
    return emails.filter((e) => !e.isRead).length;
  }, [emails]);

  const approvedBookingsCount = useMemo(() => {
    return bookings.filter((b) => b.status === 'APPROVED').length;
  }, [bookings]);

  // Handlers
  const handleSubmitBooking = (
    booking: Booking,
    isConflict: boolean,
    reason?: string
  ) => {
    if (isConflict) {
      // Record rejected booking
      setBookings((prev) => [booking, ...prev]);

      // Generate rejection notification to admin
      const rejectionEmail = generateRejectionAlertEmail(
        booking,
        reason || 'Terjadi bentrokan jadwal dengan permohonan lain.'
      );
      setEmails((prev) => [rejectionEmail, ...prev]);

      setActiveBooking(booking);
      setCurrentConflictReason(reason || 'Terjadi bentrokan jadwal.');
      setConflictModalOpen(true);
      showToast(
        `Pengajuan ditolak otomatis: Jadwal bentrok dengan peminjaman lain.`,
        'alert'
      );
    } else {
      // Record approved booking
      setBookings((prev) => [booking, ...prev]);

      // Generate auto-approval email to admin
      const approvalEmail = generateAutoApprovalEmail(booking);
      setEmails((prev) => [approvalEmail, ...prev]);

      setActiveBooking(booking);
      setSuccessModalOpen(true);
      showToast(
        `Peminjaman disetujui otomatis & email disposisi dikirim ke ${ADMIN_EMAIL}`,
        'success'
      );
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
    );

    // Create cancellation email log
    const cancellationNotice: EmailNotification = {
      id: `EML-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      recipient: ADMIN_EMAIL,
      subject: `[SIMRUANG] Peminjaman Dibatalkan: #${target.id} (${target.borrowerName})`,
      type: 'CANCELLATION',
      bookingId: target.id,
      borrowerName: target.borrowerName,
      borrowerEmail: target.email,
      summary: `Peminjaman #${target.id} telah dibatalkan. Jadwal ${target.date} pukul ${target.startTime} - ${target.endTime} telah dibebaskan kembali.`,
      contentHtml: `<div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #475569;">Pemberitahuan Pembatalan Peminjaman</h2>
        <p>Jadwal untuk <strong>${target.borrowerName}</strong> pada tanggal <strong>${target.date}</strong> (${target.startTime} - ${target.endTime} WIB) telah dibatalkan.</p>
        <p style="color: #16a34a; font-weight: bold;">Sarana tersebut kini telah kembali bebas dan dapat dipinjam oleh pemohon lain.</p>
      </div>`,
      isRead: false,
    };
    setEmails((prev) => [cancellationNotice, ...prev]);

    showToast(`Peminjaman #${bookingId} dibatalkan. Slot jadwal kembali bebas.`, 'info');
  };

  const handleCompleteBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'COMPLETED' } : b))
    );
    showToast(`Peminjaman #${bookingId} ditandai selesai.`, 'success');
  };

  const handlePrintBooking = (booking: Booking) => {
    setActiveBooking(booking);
    setPrintModalOpen(true);
  };

  const handleViewBookingDetail = (booking: Booking) => {
    setActiveBooking(booking);
    setDetailModalOpen(true);
  };

  const handleSelectSlotToBook = (resourceId: string, time?: string) => {
    setPrefillResource(resourceId);
    setPrefillDate(selectedScheduleDate);
    setActiveTab('form');
  };

  const handleMarkEmailAsRead = (emailId: string) => {
    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, isRead: true } : e))
    );
  };

  const handleDeleteEmail = (emailId: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== emailId));
    showToast('Pesan email dihapus dari log.', 'info');
  };

  const handleSendTestNotification = () => {
    const testBooking: Booking = {
      id: `BK-TEST-${Math.floor(100 + Math.random() * 900)}`,
      borrowerName: 'Administrator Sarpras Test',
      institution: 'Bagian Teknologi Informasi',
      email: ADMIN_EMAIL,
      phone: '0812-0000-1111',
      roomId: 'lab-komputer-1',
      equipmentIds: ['proyektor-epson-hd1'],
      date: getFormattedDate(0),
      startTime: '10:00',
      endTime: '11:30',
      purpose: 'Simulasi Pengujian Sistem Notifikasi Email Otomatis',
      attendeesCount: 20,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      adminEmailSent: true,
    };

    const email = generateAutoApprovalEmail(testBooking);
    setEmails((prev) => [email, ...prev]);
    showToast(`Email uji coba berhasil dikirim ke ${ADMIN_EMAIL}!`, 'success');
  };

  const handleResetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh jadwal ke kondisi simulasi awal?')) {
      const { bookings: b, emails: e } = resetAllData();
      setBookings(b);
      setEmails(e);
      showToast('Data demo berhasil di-reset.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        unreadEmailCount={unreadEmailCount}
        totalApprovedCount={approvedBookingsCount}
        onOpenTrackModal={() => setTrackModalOpen(true)}
        onOpenShareModal={() => setShareModalOpen(true)}
        onOpenInstallModal={() => setInstallModalOpen(true)}
      />

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                : toastMessage.type === 'alert'
                ? 'bg-red-900 text-red-100 border-red-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toastMessage.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            {toastMessage.type === 'alert' && (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            {toastMessage.type === 'info' && (
              <Bell className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-1 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area - padded for mobile bottom dock */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 lg:pb-12">
        {/* PUBLIC VIEWS */}
        {activeTab === 'home' && (
          <PublicHome
            existingBookings={bookings}
            onNavigateToForm={(resId, date) => {
              if (resId) setPrefillResource(resId);
              if (date) setPrefillDate(date);
              setActiveTab('form');
            }}
            onNavigateToSchedule={(date) => {
              if (date) setSelectedScheduleDate(date);
              setActiveTab('schedule');
            }}
            onNavigateToCatalog={() => setActiveTab('catalog')}
            onOpenTrackModal={() => setTrackModalOpen(true)}
            onOpenShareModal={() => setShareModalOpen(true)}
            onOpenInstallModal={() => setInstallModalOpen(true)}
          />
        )}

        {activeTab === 'catalog' && (
          <FacilityCatalog
            onSelectResourceToBook={(resId) => {
              setPrefillResource(resId);
              setActiveTab('form');
            }}
            onNavigateToSchedule={() => setActiveTab('schedule')}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleTimeline
            bookings={bookings}
            selectedDate={selectedScheduleDate}
            setSelectedDate={setSelectedScheduleDate}
            onSelectSlotToBook={handleSelectSlotToBook}
            onViewBookingDetail={handleViewBookingDetail}
          />
        )}

        {activeTab === 'form' && (
          <BookingForm
            existingBookings={bookings}
            onSubmitBooking={handleSubmitBooking}
            onNavigateToSchedule={(date) => {
              setSelectedScheduleDate(date);
              setActiveTab('schedule');
            }}
            prefillResource={prefillResource}
            prefillDate={prefillDate}
          />
        )}

        {/* ADMIN VIEWS */}
        {activeTab === 'bookings' && (
          <BookingList
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            onCompleteBooking={handleCompleteBooking}
            onPrintBooking={handlePrintBooking}
            onViewBookingDetail={handleViewBookingDetail}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'admin-emails' && (
          <AdminEmailInbox
            emails={emails}
            onMarkAsRead={handleMarkEmailAsRead}
            onDeleteEmail={handleDeleteEmail}
            onSendTestNotification={handleSendTestNotification}
            onNavigateToBooking={(bookingId) => {
              const found = bookings.find((b) => b.id === bookingId);
              if (found) {
                handleViewBookingDetail(found);
              } else {
                setActiveTab('bookings');
              }
            }}
          />
        )}

        {activeTab === 'stats' && (
          <StatsDashboard
            bookings={bookings}
            onNavigateToSchedule={() => setActiveTab('schedule')}
            onNavigateToForm={() => setActiveTab('form')}
            onNavigateToEmails={() => setActiveTab('admin-emails')}
          />
        )}
      </main>

      {/* Modals */}
      <TrackBookingModal
        isOpen={trackModalOpen}
        onClose={() => setTrackModalOpen(false)}
        bookings={bookings}
        onPrintTicket={handlePrintBooking}
        onNavigateToSchedule={(date) => {
          setSelectedScheduleDate(date);
          setActiveTab('schedule');
        }}
      />

      <ConflictAlertModal
        isOpen={conflictModalOpen}
        onClose={() => setConflictModalOpen(false)}
        booking={activeBooking}
        conflictReason={currentConflictReason}
        onNavigateToSchedule={(date) => {
          setSelectedScheduleDate(date);
          setActiveTab('schedule');
        }}
      />

      <SuccessApprovalModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        booking={activeBooking}
        onPrint={handlePrintBooking}
        onNavigateToSchedule={(date) => {
          setSelectedScheduleDate(date);
          setActiveTab('schedule');
        }}
        onNavigateToAdminEmails={() => {
          setIsAdminMode(true);
          setActiveTab('admin-emails');
        }}
      />

      <PrintTicketModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        booking={activeBooking}
      />

      <BookingDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        booking={activeBooking}
        onCancel={handleCancelBooking}
        onComplete={handleCompleteBooking}
        onPrint={handlePrintBooking}
      />

      <ShareWebsiteModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        publicUrl={publicUrl}
        onOpenInstallModal={() => setInstallModalOpen(true)}
      />

      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        publicUrl={publicUrl}
      />

      {/* Comprehensive Public Website Footer */}
      <footer className="border-t border-slate-200 bg-white pt-12 pb-24 lg:pb-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  S
                </div>
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">
                  SIMRUANG KAMPUS
                </span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Sistem Informasi Manajemen Peminjaman Ruang Laboratorium, Aula Serbaguna, dan Inventaris Multimedia Kampus Bebas Bentrok.
              </p>
              <div className="text-[11px] text-slate-400">
                Layanan Publik Digital Universitas · Versi 2.4
              </div>
            </div>

            {/* Col 2: Navigasi Cepat */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 text-xs block mb-3">
                Layanan Publik
              </span>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => setActiveTab('home')} className="hover:text-indigo-600 transition-colors">
                    Beranda Portal
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('catalog')} className="hover:text-indigo-600 transition-colors">
                    Katalog Fasilitas & Ruangan
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('schedule')} className="hover:text-indigo-600 transition-colors">
                    Kalender Ketersediaan Real-Time
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('form')} className="hover:text-indigo-600 transition-colors">
                    Form Pengajuan Peminjaman
                  </button>
                </li>
                <li>
                  <button onClick={() => setTrackModalOpen(true)} className="hover:text-indigo-600 transition-colors">
                    Lacak Tiket & Unduh Izin
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Sarana Populer */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 text-xs block mb-3">
                Sarana Terdaftar
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-600">
                <li>• Lab Komputer 1 (Pemrograman & Jaringan)</li>
                <li>• Lab Multimedia & Desain Workstation</li>
                <li>• Aula Utama (Graha Serbaguna 300 Org)</li>
                <li>• Ruang Seminar & Aula Mini Perpustakaan</li>
                <li>• Paket Proyektor & Wireless Mic Sarpras</li>
              </ul>
            </div>

            {/* Col 4: Pengelola & Kontak */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 text-xs block mb-3">
                Sekretariat Sarpras
              </span>
              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <div>
                  <span className="text-slate-400">Email Admin:</span>{' '}
                  <span className="font-mono font-medium text-indigo-700">{ADMIN_EMAIL}</span>
                </div>
                <div>
                  <span className="text-slate-400">Jam Layanan:</span> Senin - Jumat 07:30 - 18:00 WIB
                </div>
                <div>
                  <span className="text-slate-400">Lokasi:</span> Pos Layanan Sarpras, Gedung Rektorat Lt. 1
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setIsAdminMode(!isAdminMode);
                    setActiveTab(!isAdminMode ? 'bookings' : 'home');
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{isAdminMode ? 'Keluar Mode Admin' : 'Login Staf / Admin'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <div>
              © 2026 SIMRUANG · Biro Sarana & Prasarana Kampus. Hak Cipta Dilindungi.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>SOP Peminjaman</span>
              <span>·</span>
              <span>Kebijakan Privasi</span>
              <span>·</span>
              <span>Panduan K3 Laboratorium</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Native-like Mobile Bottom Dock Navigation (Phone / Smartphone screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        unreadEmailCount={unreadEmailCount}
        totalApprovedCount={approvedBookingsCount}
        onOpenTrackModal={() => setTrackModalOpen(true)}
        onOpenShareModal={() => setShareModalOpen(true)}
        onOpenInstallModal={() => setInstallModalOpen(true)}
      />
    </div>
  );
}
