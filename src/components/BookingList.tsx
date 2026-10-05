import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Ban,
  Eye,
  Calendar,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';

interface BookingListProps {
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => void;
  onCompleteBooking: (bookingId: string) => void;
  onPrintBooking: (booking: Booking) => void;
  onViewBookingDetail: (booking: Booking) => void;
  onResetData: () => void;
}

export const BookingList: React.FC<BookingListProps> = ({
  bookings,
  onCancelBooking,
  onCompleteBooking,
  onPrintBooking,
  onViewBookingDetail,
  onResetData,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | BookingStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const getResourceName = (id: string) => {
    return AVAILABLE_RESOURCES.find((r) => r.id === id)?.name || id;
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Status filter
      if (statusFilter !== 'ALL' && b.status !== statusFilter) {
        return false;
      }
      // Date filter
      if (dateFilter && b.date !== dateFilter) {
        return false;
      }
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesBorrower = b.borrowerName.toLowerCase().includes(query);
        const matchesInstitution = b.institution.toLowerCase().includes(query);
        const matchesPurpose = b.purpose.toLowerCase().includes(query);
        const matchesId = b.id.toLowerCase().includes(query);
        const matchesRoom = b.roomId ? getResourceName(b.roomId).toLowerCase().includes(query) : false;
        return matchesBorrower || matchesInstitution || matchesPurpose || matchesId || matchesRoom;
      }
      return true;
    });
  }, [bookings, statusFilter, dateFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Manajemen Peminjaman Sarpras</span>
              <span>·</span>
              <span>Arsip Persetujuan & Penolakan Bentrok</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Daftar Riwayat Peminjaman Ruang & Alat
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Kelola seluruh pengajuan yang telah disetujui otomatis maupun dicegah akibat bentrokan jadwal.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetData}
              title="Reset data ke simulasi awal"
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data Demo</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Segmented Filter */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({bookings.length})
            </button>
            <button
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'APPROVED'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Disetujui ({bookings.filter((b) => b.status === 'APPROVED').length})
            </button>
            <button
              onClick={() => setStatusFilter('REJECTED')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'REJECTED'
                  ? 'bg-white text-red-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ditolak ({bookings.filter((b) => b.status === 'REJECTED').length})
            </button>
            <button
              onClick={() => setStatusFilter('COMPLETED')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'COMPLETED'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Selesai ({bookings.filter((b) => b.status === 'COMPLETED').length})
            </button>
            <button
              onClick={() => setStatusFilter('CANCELLED')}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'CANCELLED'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dibatalkan ({bookings.filter((b) => b.status === 'CANCELLED').length})
            </button>
          </div>

          {/* Search & Date Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari peminjam / agenda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-700"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="absolute right-2 top-2 text-[10px] text-slate-400 hover:text-slate-700"
                  title="Hapus filter tanggal"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ADAPTIVE LIST: Responsive Card layout on smartphones */}
      <div className="md:hidden space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
            <p className="text-sm font-medium">Tidak ada data peminjaman yang cocok.</p>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const roomName = b.roomId ? getResourceName(b.roomId) : null;
            const equipmentNames = b.equipmentIds?.map(getResourceName) || [];

            return (
              <div
                key={b.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900 block">
                      #{b.id}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
                      {b.borrowerName}
                    </h3>
                    <p className="text-[11px] text-slate-500">{b.institution}</p>
                  </div>

                  <div>
                    {b.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Disetujui</span>
                      </span>
                    )}
                    {b.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>Bentrok</span>
                      </span>
                    )}
                    {b.status === 'COMPLETED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <Clock className="w-3 h-3" />
                        <span>Selesai</span>
                      </span>
                    )}
                    {b.status === 'CANCELLED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        <XCircle className="w-3 h-3" />
                        <span>Batal</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1 text-slate-600">
                  <div>
                    <span className="text-slate-400">Waktu:</span>{' '}
                    <span className="font-mono font-semibold text-slate-800">
                      {b.date} · {b.startTime} - {b.endTime} WIB
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Sarana:</span>{' '}
                    <span className="font-semibold text-indigo-700">{roomName || 'Tanpa ruang'}</span>
                    {equipmentNames.length > 0 && <span> (+{equipmentNames.join(', ')})</span>}
                  </div>
                  <div>
                    <span className="text-slate-400">Agenda:</span>{' '}
                    <span className="italic text-slate-700">"{b.purpose}"</span>
                  </div>
                </div>

                {/* Mobile action bar */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewBookingDetail(b)}
                    className="flex-1 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center"
                  >
                    Rincian
                  </button>

                  {b.status === 'APPROVED' && (
                    <>
                      <button
                        onClick={() => onPrintBooking(b)}
                        className="flex-1 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-center flex items-center justify-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Izin</span>
                      </button>
                      <button
                        onClick={() => onCompleteBooking(b.id)}
                        className="py-1.5 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg text-center"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => onCancelBooking(b.id)}
                        className="py-1.5 px-3 text-xs font-semibold text-red-600 bg-red-50 rounded-lg text-center"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Bookings Table Card */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto touch-pan-x">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">No. Tiket</th>
                <th className="py-3 px-4">Tanggal & Waktu</th>
                <th className="py-3 px-4">Peminjam & Unit</th>
                <th className="py-3 px-4">Sarana (Ruang & Alat)</th>
                <th className="py-3 px-4">Keperluan / Agenda</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">Tidak ada data peminjaman yang cocok.</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter status.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const roomName = b.roomId ? getResourceName(b.roomId) : null;
                  const equipmentNames = b.equipmentIds?.map(getResourceName) || [];

                  return (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* ID Tiket */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">
                        {b.id}
                      </td>

                      {/* Tanggal & Waktu */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{b.date}</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          {b.startTime} - {b.endTime} WIB
                        </div>
                      </td>

                      {/* Peminjam & Unit */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {b.borrowerName}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">
                          {b.institution}
                        </div>
                      </td>

                      {/* Sarana */}
                      <td className="py-3.5 px-4 max-w-[240px]">
                        {roomName && (
                          <div className="font-medium text-indigo-700 truncate">
                            {roomName}
                          </div>
                        )}
                        {equipmentNames.length > 0 && (
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            + {equipmentNames.join(', ')}
                          </div>
                        )}
                        {!roomName && equipmentNames.length === 0 && (
                          <span className="text-slate-400 italic">Tanpa sarana</span>
                        )}
                      </td>

                      {/* Keperluan */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <p className="text-slate-700 line-clamp-2 leading-relaxed">
                          {b.purpose}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {b.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Disetujui Otomatis</span>
                          </span>
                        )}
                        {b.status === 'REJECTED' && (
                          <span
                            title={b.conflictReason}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 cursor-help"
                          >
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            <span>Ditolak (Bentrok)</span>
                          </span>
                        )}
                        {b.status === 'COMPLETED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>Selesai</span>
                          </span>
                        )}
                        {b.status === 'CANCELLED' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Dibatalkan</span>
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewBookingDetail(b)}
                            title="Lihat Detail Peminjaman"
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {b.status === 'APPROVED' && (
                            <>
                              <button
                                onClick={() => onPrintBooking(b)}
                                title="Cetak Surat Izin Peminjaman"
                                className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onCompleteBooking(b.id)}
                                title="Tandai Selesai"
                                className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => onCancelBooking(b.id)}
                                title="Batalkan Peminjaman (Bebaskan Jadwal)"
                                className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
