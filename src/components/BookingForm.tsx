import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  User,
  Building2,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Booking, Resource } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';
import {
  checkScheduleConflict,
  timeToMinutes,
} from '../utils/conflictDetector';
import { getFormattedDate } from '../data/initialBookings';
import { ADMIN_EMAIL } from '../utils/emailService';

interface BookingFormProps {
  existingBookings: Booking[];
  onSubmitBooking: (booking: Booking, isConflict: boolean, reason?: string) => void;
  onNavigateToSchedule: (date: string) => void;
  prefillResource?: string;
  prefillDate?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  existingBookings,
  onSubmitBooking,
  onNavigateToSchedule,
  prefillResource,
  prefillDate,
}) => {
  // Form State
  const [borrowerName, setBorrowerName] = useState('');
  const [institution, setInstitution] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [roomId, setRoomId] = useState<string | null>(
    prefillResource && AVAILABLE_RESOURCES.find((r) => r.id === prefillResource && r.category === 'room')
      ? prefillResource
      : 'lab-komputer-1'
  );
  const [equipmentIds, setEquipmentIds] = useState<string[]>(
    prefillResource && AVAILABLE_RESOURCES.find((r) => r.id === prefillResource && r.category === 'equipment')
      ? [prefillResource]
      : ['proyektor-epson-hd1']
  );
  const [date, setDate] = useState<string>(prefillDate || getFormattedDate(0));
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('11:30');
  const [purpose, setPurpose] = useState('');
  const [attendeesCount, setAttendeesCount] = useState<number>(30);
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Filter resources
  const roomResources = useMemo(
    () => AVAILABLE_RESOURCES.filter((r) => r.category === 'room'),
    []
  );
  const equipmentResources = useMemo(
    () => AVAILABLE_RESOURCES.filter((r) => r.category === 'equipment'),
    []
  );

  // Time validation check
  const isTimeValid = useMemo(() => {
    if (!startTime || !endTime) return false;
    return timeToMinutes(endTime) > timeToMinutes(startTime);
  }, [startTime, endTime]);

  // Real-time Conflict Detection
  const conflictResult = useMemo(() => {
    if (!isTimeValid || (!roomId && equipmentIds.length === 0)) {
      return {
        hasConflict: false,
        conflictingBookings: [],
        conflictingResourceNames: [],
        explanation: '',
      };
    }

    return checkScheduleConflict(
      {
        date,
        startTime,
        endTime,
        roomId,
        equipmentIds,
      },
      existingBookings
    );
  }, [date, startTime, endTime, roomId, equipmentIds, isTimeValid, existingBookings]);

  // Quick Date Selectors
  const quickDates = useMemo(() => [
    { label: 'Hari Ini', value: getFormattedDate(0) },
    { label: 'Besok', value: getFormattedDate(1) },
    { label: 'Lusa', value: getFormattedDate(2) },
  ], []);

  const handleToggleEquipment = (eqId: string) => {
    setEquipmentIds((prev) =>
      prev.includes(eqId) ? prev.filter((id) => id !== eqId) : [...prev, eqId]
    );
  };

  const handleApplyAlternativeTime = (newStart: string, newEnd: string) => {
    setStartTime(newStart);
    setEndTime(newEnd);
  };

  const handleApplyAlternativeResource = (resourceId: string, category: Resource['category']) => {
    if (category === 'room') {
      setRoomId(resourceId);
    } else {
      setEquipmentIds((prev) => [
        ...prev.filter((id) => {
          const res = AVAILABLE_RESOURCES.find((r) => r.id === id);
          return res?.category !== 'equipment';
        }),
        resourceId,
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!borrowerName.trim()) {
      setValidationError('Nama peminjam wajib diisi.');
      return;
    }
    if (!institution.trim()) {
      setValidationError('Instansi / Unit / Kelas wajib diisi.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Email aktif peminjam wajib diisi dengan benar.');
      return;
    }
    if (!phone.trim()) {
      setValidationError('Nomor WhatsApp / Telepon wajib diisi.');
      return;
    }
    if (!roomId && equipmentIds.length === 0) {
      setValidationError('Pilihlah minimal satu ruangan atau satu alat inventaris.');
      return;
    }
    if (!isTimeValid) {
      setValidationError('Jam selesai harus lebih akhir dari jam mulai.');
      return;
    }
    if (!purpose.trim()) {
      setValidationError('Keperluan peminjaman wajib diisi.');
      return;
    }

    const bookingId = `BK-${date.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    // Re-check conflict strictly
    const currentConflict = checkScheduleConflict(
      {
        date,
        startTime,
        endTime,
        roomId,
        equipmentIds,
      },
      existingBookings
    );

    if (currentConflict.hasConflict) {
      // Create rejected record to register attempt
      const rejectedBooking: Booking = {
        id: bookingId,
        borrowerName: borrowerName.trim(),
        institution: institution.trim(),
        email: email.trim(),
        phone: phone.trim(),
        roomId,
        equipmentIds,
        date,
        startTime,
        endTime,
        purpose: purpose.trim(),
        attendeesCount,
        status: 'REJECTED',
        createdAt: new Date().toISOString(),
        conflictReason: currentConflict.explanation,
        conflictingBookingIds: currentConflict.conflictingBookings.map((b) => b.id),
        adminEmailSent: true,
        notes: notes.trim() || undefined,
      };

      onSubmitBooking(rejectedBooking, true, currentConflict.explanation);
      return;
    }

    // Auto-Approved!
    const newBooking: Booking = {
      id: bookingId,
      borrowerName: borrowerName.trim(),
      institution: institution.trim(),
      email: email.trim(),
      phone: phone.trim(),
      roomId,
      equipmentIds,
      date,
      startTime,
      endTime,
      purpose: purpose.trim(),
      attendeesCount,
      status: 'APPROVED',
      createdAt: new Date().toISOString(),
      adminEmailSent: true,
      notes: notes.trim() || undefined,
    };

    onSubmitBooking(newBooking, false);

    // Reset non-contact fields for clean next use
    setPurpose('');
    setNotes('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Formulir Peminjaman Sarpras
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Pengajuan Peminjaman Ruang & Alat
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Sistem otomatis memvalidasi jadwal secara real-time. Jika tidak ada bentrokan,
              jadwal langsung <span className="font-semibold text-emerald-700">disetujui otomatis</span> dan notifikasi resmi dikirim ke admin.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToSchedule(date)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Lihat Kalender Ruang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* Section 1: Identitas Peminjam */}
        <div>
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              1. Identitas Penanggung Jawab
            </h2>
            <p className="text-xs text-slate-500">
              Informasi kontak peminjam untuk koordinasi sarpras dan pengiriman salinan tanda terima.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nama Lengkap Peminjam *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso, M.Kom."
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Instansi / Program Studi / Ormawa *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Teknik Informatika / BEM Kampus"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Alamat Email Peminjam *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="nama@univ.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Nomor WhatsApp / HP *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="0812-3456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Jadwal & Waktu */}
        <div>
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              2. Tanggal dan Rentang Jam Pemakaian
            </h2>
            <p className="text-xs text-slate-500">
              Pilih tanggal serta waktu mulai dan selesai. Mesin anti-bentrok akan otomatis memverifikasi slot ini.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Tanggal Pemakaian *
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {quickDates.map((qd) => (
                  <button
                    key={qd.value}
                    type="button"
                    onClick={() => setDate(qd.value)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      date === qd.value
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {qd.label} ({qd.value})
                  </button>
                ))}
              </div>
              <div className="relative max-w-xs">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Jam Mulai Pemakaian *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Jam Selesai Pemakaian *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {!isTimeValid && (
              <p className="text-xs text-red-600 font-medium">
                Jam selesai harus lebih akhir daripada jam mulai.
              </p>
            )}
          </div>
        </div>

        {/* Section 3: Pemilihan Ruang & Alat */}
        <div>
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              3. Pilih Ruangan & Alat Inventaris
            </h2>
            <p className="text-xs text-slate-500">
              Laboratorium, aula, dan proyektor yang dipilih akan dicek silang secara bersamaan.
            </p>
          </div>

          {/* Ruangan Selection */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              A. Ruangan (Pilih salah satu)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                onClick={() => setRoomId(null)}
                className={`p-3.5 border rounded-lg cursor-pointer transition-all ${
                  roomId === null
                    ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">
                    Tanpa Ruangan
                  </span>
                  {roomId === null && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Hanya meminjam inventaris alat proyektor / audio tanpa memesan ruangan fisik.
                </p>
              </div>

              {roomResources.map((room) => {
                const isSelected = roomId === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => setRoomId(room.id)}
                    className={`p-3.5 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-semibold text-slate-900 leading-snug">
                        {room.name}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="mt-2 text-xs text-slate-500 space-y-0.5">
                      <p>Kapasitas: {room.capacity} orang</p>
                      <p className="truncate">{room.location}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alat / Equipment Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              B. Alat & Inventaris (Dapat dipilih lebih dari satu)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {equipmentResources.map((eq) => {
                const isChecked = equipmentIds.includes(eq.id);
                return (
                  <div
                    key={eq.id}
                    onClick={() => handleToggleEquipment(eq.id)}
                    className={`p-3.5 border rounded-lg cursor-pointer transition-all ${
                      isChecked
                        ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleEquipment(eq.id)}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-semibold text-slate-900">
                          {eq.name}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 pl-6">
                      {eq.description}
                    </p>
                    <div className="mt-1 pl-6 text-[11px] text-slate-400">
                      Lokasi: {eq.location}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-Time Conflict Detector Banner */}
        {isTimeValid && (roomId || equipmentIds.length > 0) && (
          <div className="pt-2">
            {conflictResult.hasConflict ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-red-900">
                      Terdeteksi Bentrokan Jadwal! Peminjaman Akan Ditolak Otomatis
                    </h3>
                    <p className="text-xs text-red-700 mt-1 leading-relaxed">
                      {conflictResult.explanation}
                    </p>
                  </div>
                </div>

                {/* Suggestions for alternative times */}
                {conflictResult.suggestedAlternativeTimes &&
                  conflictResult.suggestedAlternativeTimes.length > 0 && (
                    <div className="bg-white/80 border border-red-100 rounded-lg p-3">
                      <div className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Rekomendasi Waktu Tersedia di Hari yang Sama:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {conflictResult.suggestedAlternativeTimes.map((alt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleApplyAlternativeTime(alt.startTime, alt.endTime)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded cursor-pointer transition-colors"
                          >
                            <span>
                              {alt.startTime} - {alt.endTime} WIB
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Suggestions for alternative resources */}
                {conflictResult.suggestedAlternativeResources &&
                  conflictResult.suggestedAlternativeResources.length > 0 && (
                    <div className="bg-white/80 border border-red-100 rounded-lg p-3">
                      <div className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Alternatif Sarana yang Kosong pada Jam Ini:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {conflictResult.suggestedAlternativeResources.map((alt) => (
                          <button
                            key={alt.id}
                            type="button"
                            onClick={() => handleApplyAlternativeResource(alt.id, alt.category)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded cursor-pointer transition-colors"
                          >
                            <span>Ganti ke {alt.name}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-emerald-900">
                    Jadwal Tersedia & Aman! (Siap Disetujui Otomatis)
                  </h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Ruang dan alat yang dipilih belum memiliki jadwal pada tanggal {date} pukul {startTime} - {endTime} WIB.
                    Sistem akan langsung menerbitkan tiket peminjaman dan mengirim notifikasi email resmi ke admin sarpras (<span className="font-mono text-[11px]">{ADMIN_EMAIL}</span>).
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 4: Keperluan & Estimasi Peserta */}
        <div>
          <div className="border-b border-slate-200 pb-3 mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              4. Keperluan & Deskripsi Kegiatan
            </h2>
            <p className="text-xs text-slate-500">
              Jelaskan tujuan pemakaian sarana untuk arsip dan pencatatan inventaris sarpras.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Keperluan / Agenda Acara *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Contoh: Praktikum Pemrograman Web Kelas TI-2B, memerlukan proyektor untuk presentasi modul 4."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Estimasi Jumlah Peserta (Orang)
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={attendeesCount}
                  onChange={(e) => setAttendeesCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Butuh kabel HDMI panjang 5 meter"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-xs font-medium flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>Sistem Otomasi:</span>{' '}
            <span className="font-semibold text-slate-700">Anti-Bentrok Real-time</span> ·{' '}
            <span>Email Admin:</span>{' '}
            <span className="font-mono text-slate-700">{ADMIN_EMAIL}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              className={`w-full sm:w-auto px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                conflictResult.hasConflict
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {conflictResult.hasConflict ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Kirim (Akan Ditolak Otomatis)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ajukan & Sahkan Otomatis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
