import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  Info,
  Building,
  Monitor,
  Volume2,
  LayoutGrid,
  List,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { Booking, Resource } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';
import { timeToMinutes } from '../utils/conflictDetector';
import { getFormattedDate } from '../data/initialBookings';

interface ScheduleTimelineProps {
  bookings: Booking[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onSelectSlotToBook: (resourceId: string, time: string) => void;
  onViewBookingDetail: (booking: Booking) => void;
}

const HOURS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  bookings,
  selectedDate,
  setSelectedDate,
  onSelectSlotToBook,
  onViewBookingDetail,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'room' | 'equipment'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileViewMode, setMobileViewMode] = useState<'card' | 'matrix'>('card');

  // Date Shift Helpers
  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(getFormattedDate(0));
  };

  // Filter resources based on category and search
  const filteredResources = useMemo(() => {
    return AVAILABLE_RESOURCES.filter((res) => {
      if (categoryFilter !== 'all' && res.category !== categoryFilter) {
        return false;
      }
      if (searchTerm) {
        return (
          res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    });
  }, [categoryFilter, searchTerm]);

  // Bookings active for the selected date
  const dayBookings = useMemo(() => {
    return bookings.filter(
      (b) => b.status === 'APPROVED' && b.date === selectedDate
    );
  }, [bookings, selectedDate]);

  // Calculation for timeline positioning: 07:00 (420 mins) to 18:00 (1080 mins) => 660 mins total
  const timelineStartMinutes = 7 * 60; // 420
  const timelineTotalMinutes = 11 * 60; // 660

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Sistem Pemantauan Sarpras</span>
              <span>·</span>
              <span>Laboratorium, Aula & Inventaris</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Matriks Jadwal & Ketersediaan Ruang/Alat
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Pantau jadwal pemakaian harian untuk mencegah bentrokan secara visual.
              Slot biru menandakan terisi, slot abu-abu muda siap dipinjam.
            </p>
          </div>

          {/* Date Picker Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Hari Ini
            </button>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={handlePrevDay}
                aria-label="Hari sebelumnya"
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-2 py-1 text-xs font-mono font-medium text-slate-900 bg-transparent border-0 focus:outline-none cursor-pointer"
              />
              <button
                onClick={handleNextDay}
                aria-label="Hari berikutnya"
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters, View Switcher & Search Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Control Filter */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg overflow-x-auto">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({AVAILABLE_RESOURCES.length})
            </button>
            <button
              onClick={() => setCategoryFilter('room')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'room'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ruangan (Lab & Aula)
            </button>
            <button
              onClick={() => setCategoryFilter('equipment')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'equipment'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alat (Proyektor & Audio)
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile View Toggle: Card vs Matrix */}
            <div className="flex md:hidden items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setMobileViewMode('card')}
                className={`p-1.5 text-xs rounded transition-colors cursor-pointer flex items-center gap-1 ${
                  mobileViewMode === 'card'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Kartu</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileViewMode('matrix')}
                className={`p-1.5 text-xs rounded transition-colors cursor-pointer flex items-center gap-1 ${
                  mobileViewMode === 'matrix'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Matriks</span>
              </button>
            </div>

            <div className="relative flex-1 sm:w-60">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari ruang / alat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ADAPTIVE VIEW: Responsive Cards for smartphones */}
      <div className={`md:hidden space-y-3 ${mobileViewMode === 'card' ? 'block' : 'hidden'}`}>
        <div className="text-xs text-slate-500 px-1 font-medium flex items-center justify-between">
          <span>Daftar Ketersediaan ({filteredResources.length} Sarana)</span>
          <span>{selectedDate}</span>
        </div>

        {filteredResources.map((resource) => {
          const resBookings = dayBookings.filter((b) => {
            if (resource.category === 'room') return b.roomId === resource.id;
            return b.equipmentIds?.includes(resource.id);
          });

          return (
            <div
              key={resource.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-lg shrink-0 mt-0.5">
                    {resource.category === 'room' ? (
                      <Building className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Monitor className="w-4 h-4 text-sky-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {resource.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {resource.location}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectSlotToBook(resource.id, '09:00')}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg cursor-pointer shrink-0"
                >
                  + Pinjam
                </button>
              </div>

              {/* Status & Bookings for today */}
              <div className="pt-2 border-t border-slate-100">
                {resBookings.length === 0 ? (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kosong sepanjang hari (Siap dipinjam 07:00 - 18:00 WIB)</span>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold text-slate-700">
                      Jadwal Terisi Hari Ini ({resBookings.length}):
                    </div>
                    {resBookings.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => onViewBookingDetail(b)}
                        className="bg-indigo-50 border border-indigo-200 rounded-lg p-2.5 text-xs cursor-pointer hover:bg-indigo-100 transition-colors flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-indigo-950">
                            {b.borrowerName}
                          </div>
                          <div className="text-[11px] text-indigo-700 italic truncate max-w-[200px]">
                            "{b.purpose}"
                          </div>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-indigo-800 bg-white px-2 py-0.5 rounded shadow-2xs whitespace-nowrap">
                          {b.startTime} - {b.endTime} WIB
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Schedule Timeline Table (Desktop & Scrollable Matrix Mode) */}
      <div className={`bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs ${
        mobileViewMode === 'card' ? 'hidden md:block' : 'block'
      }`}>
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-4 text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
              <span>Terisi (Disetujui Otomatis)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 inline-block"></span>
              <span>Kosong / Tersedia</span>
            </div>
          </div>
          <div className="text-slate-500 font-medium">
            Tanggal:{' '}
            <span className="font-semibold text-slate-900">
              {new Date(selectedDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Timeline Grid Container with Smooth Horizontal Scroll */}
        <div className="overflow-x-auto touch-pan-x">
          <div className="min-w-[950px]">
            {/* Hour Header Row */}
            <div className="grid grid-cols-[260px_1fr] border-b border-slate-200 bg-slate-100/60 text-xs font-semibold text-slate-600">
              <div className="p-3 border-r border-slate-200">
                Nama Sarana & Fasilitas
              </div>
              <div className="grid grid-cols-11 text-center font-mono">
                {HOURS.slice(0, 11).map((h) => (
                  <div
                    key={h}
                    className="py-2.5 border-r border-slate-200 last:border-r-0 text-[11px] text-slate-500"
                  >
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Rows */}
            <div className="divide-y divide-slate-100">
              {filteredResources.map((resource) => {
                // Find all bookings for this resource on this day
                const resourceBookings = dayBookings.filter((b) => {
                  if (resource.category === 'room') {
                    return b.roomId === resource.id;
                  } else {
                    return b.equipmentIds?.includes(resource.id);
                  }
                });

                return (
                  <div
                    key={resource.id}
                    className="grid grid-cols-[260px_1fr] hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* Resource Info Column */}
                    <div className="p-3.5 border-r border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          {resource.category === 'room' ? (
                            <Building className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          ) : resource.id.includes('sound') ? (
                            <Volume2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          ) : (
                            <Monitor className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-slate-900 leading-snug">
                            {resource.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {resource.location}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {resource.category === 'room'
                            ? `Kapasitas: ${resource.capacity} org`
                            : 'Status: Tersedia'}
                        </span>
                        <button
                          onClick={() => onSelectSlotToBook(resource.id, '09:00')}
                          className="opacity-90 md:opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Pinjam</span>
                        </button>
                      </div>
                    </div>

                    {/* Timeline Canvas Column */}
                    <div className="relative h-20 bg-white">
                      {/* Vertical Hour Guidelines */}
                      <div className="absolute inset-0 grid grid-cols-11 pointer-events-none">
                        {HOURS.slice(0, 11).map((_, idx) => (
                          <div
                            key={idx}
                            className="border-r border-slate-100 last:border-r-0 h-full"
                          />
                        ))}
                      </div>

                      {/* Render Booked Interval Bars */}
                      {resourceBookings.map((b) => {
                        const startMin = Math.max(
                          timeToMinutes(b.startTime),
                          timelineStartMinutes
                        );
                        const endMin = Math.min(
                          timeToMinutes(b.endTime),
                          timelineStartMinutes + timelineTotalMinutes
                        );
                        const duration = Math.max(endMin - startMin, 20);

                        const leftPercent =
                          ((startMin - timelineStartMinutes) / timelineTotalMinutes) * 100;
                        const widthPercent = (duration / timelineTotalMinutes) * 100;

                        return (
                          <div
                            key={b.id}
                            onClick={() => onViewBookingDetail(b)}
                            title={`${b.borrowerName} (${b.institution})\n${b.purpose}\nPukul ${b.startTime} - ${b.endTime}`}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                            className="absolute top-2 bottom-2 rounded-md bg-indigo-600/90 hover:bg-indigo-700 text-white p-2 shadow-xs cursor-pointer transition-all overflow-hidden flex flex-col justify-center border border-indigo-700 group/bar z-10"
                          >
                            <div className="text-[11px] font-bold truncate leading-tight">
                              {b.borrowerName}
                            </div>
                            <div className="text-[10px] text-indigo-100 truncate font-mono mt-0.5">
                              {b.startTime} - {b.endTime} WIB
                            </div>
                          </div>
                        );
                      })}

                      {/* If no booking, show subtle empty indicator */}
                      {resourceBookings.length === 0 && (
                        <div
                          onClick={() => onSelectSlotToBook(resource.id, '09:00')}
                          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-slate-50/80 transition-opacity cursor-pointer text-xs text-indigo-600 font-medium"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          <span>Klik untuk pinjam slot kosong</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Waktu operasional sarana: 07:00 - 18:00 WIB. Klik pada kartu peminjaman untuk melihat rincian lengkap atau membatalkan.
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-600 whitespace-nowrap">
            Total {dayBookings.length} jadwal terdaftar hari ini
          </div>
        </div>
      </div>
    </div>
  );
};
