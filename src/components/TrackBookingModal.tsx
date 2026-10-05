import React, { useState } from 'react';
import {
  Search,
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Calendar,
  Building,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Booking } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';

interface TrackBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onPrintTicket: (booking: Booking) => void;
  onNavigateToSchedule: (date: string) => void;
}

export const TrackBookingModal: React.FC<TrackBookingModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onPrintTicket,
  onNavigateToSchedule,
}) => {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const searchResults = bookings.filter((b) => {
    if (!cleanQuery) return false;
    return (
      b.id.toLowerCase().includes(cleanQuery) ||
      b.email.toLowerCase().includes(cleanQuery) ||
      b.borrowerName.toLowerCase().includes(cleanQuery) ||
      b.phone.includes(cleanQuery)
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const getResourceName = (id: string) => {
    return AVAILABLE_RESOURCES.find((r) => r.id === id)?.name || id;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Search className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Layanan Publik Mandiri
              </span>
              <h2 className="text-base font-bold text-white">
                Lacak Status Peminjaman & Unduh Surat Izin
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-800">
              Masukkan Nomor Tiket (ID) atau Email Peminjam
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Contoh: BK-20260928-101 atau email anda"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!e.target.value) setHasSearched(false);
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
              >
                Cari Status
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Tips: Nomor tiket tercantum saat pengajuan formulir peminjaman berhasil disahkan.
            </p>
          </form>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="font-semibold text-slate-800">
                  Hasil Pencarian ({searchResults.length})
                </span>
                <span className="text-slate-400 text-[11px]">
                  Kata Kunci: "{query}"
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center text-slate-500 space-y-2">
                  <p className="font-semibold text-slate-700">Data Peminjaman Tidak Ditemukan</p>
                  <p className="text-[11px] text-slate-500">
                    Pastikan nomor tiket atau alamat email yang Anda masukkan sudah sesuai.
                  </p>
                </div>
              ) : (
                searchResults.map((b) => {
                  const roomName = b.roomId ? getResourceName(b.roomId) : 'Tanpa Ruangan';
                  const eqNames = b.equipmentIds?.map(getResourceName) || [];

                  return (
                    <div
                      key={b.id}
                      className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs hover:border-slate-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              #{b.id}
                            </span>
                            {b.status === 'APPROVED' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Disetujui Otomatis</span>
                              </span>
                            )}
                            {b.status === 'REJECTED' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                <AlertTriangle className="w-3 h-3 text-red-600" />
                                <span>Ditolak (Bentrok)</span>
                              </span>
                            )}
                            {b.status === 'COMPLETED' && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3" />
                                <span>Selesai</span>
                              </span>
                            )}
                          </div>
                          <div className="text-slate-600 font-medium mt-1">
                            {b.borrowerName} · {b.institution}
                          </div>
                        </div>

                        {b.status === 'APPROVED' && (
                          <button
                            onClick={() => onPrintTicket(b)}
                            className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Cetak Surat Izin</span>
                          </button>
                        )}
                      </div>

                      {/* Details row */}
                      <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] space-y-1 text-slate-600">
                        <div>
                          <span className="text-slate-400">Sarana:</span>{' '}
                          <span className="font-semibold text-slate-800">{roomName}</span>
                          {eqNames.length > 0 && <span> (+ {eqNames.join(', ')})</span>}
                        </div>
                        <div>
                          <span className="text-slate-400">Jadwal:</span>{' '}
                          <span className="font-mono font-medium text-slate-800">
                            {b.date} · Pukul {b.startTime} - {b.endTime} WIB
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Keperluan:</span>{' '}
                          <span className="italic text-slate-700">"{b.purpose}"</span>
                        </div>
                        {b.conflictReason && (
                          <div className="text-red-600 font-medium pt-1 border-t border-red-100 mt-1">
                            Alasan Penolakan: {b.conflictReason}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Quick Examples */}
          {!hasSearched && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="font-semibold text-slate-800 block">
                Coba Cari Contoh Nomor Tiket Demo:
              </span>
              <div className="flex flex-wrap gap-2">
                {bookings.slice(0, 3).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setQuery(b.id);
                      setHasSearched(true);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-300 rounded cursor-pointer transition-colors"
                  >
                    #{b.id} ({b.borrowerName.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Sistem Arsip Terpadu · SIMRUANG Kampus
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
