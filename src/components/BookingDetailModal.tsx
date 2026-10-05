import React from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Ban,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  Layers,
} from 'lucide-react';
import { Booking } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onCancel: (bookingId: string) => void;
  onComplete: (bookingId: string) => void;
  onPrint: (booking: Booking) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
  onCancel,
  onComplete,
  onPrint,
}) => {
  if (!isOpen || !booking) return null;

  const getResourceName = (id: string) => {
    return AVAILABLE_RESOURCES.find((r) => r.id === id)?.name || id;
  };

  const roomName = booking.roomId ? getResourceName(booking.roomId) : 'Tanpa Ruangan';
  const equipmentNames = booking.equipmentIds?.map(getResourceName) || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-700">
              #{booking.id}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-900">
              Rincian Peminjaman
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Status Badge Banner */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 border-slate-200">
            <span className="text-slate-500 font-medium">Status Peminjaman:</span>
            {booking.status === 'APPROVED' && (
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Disetujui Otomatis & Terjadwal</span>
              </span>
            )}
            {booking.status === 'REJECTED' && (
              <span className="font-semibold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Ditolak Karena Bentrok</span>
              </span>
            )}
            {booking.status === 'COMPLETED' && (
              <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Pemakaian Selesai</span>
              </span>
            )}
            {booking.status === 'CANCELLED' && (
              <span className="font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                Dibatalkan
              </span>
            )}
          </div>

          {booking.conflictReason && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-700">
              <span className="font-semibold block mb-1">Catatan Bentrokan Sistem:</span>
              <p>{booking.conflictReason}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="space-y-3 border border-slate-200 p-4 rounded-xl divide-y divide-slate-100">
            <div className="pt-2 first:pt-0">
              <span className="text-slate-400 block mb-0.5">Penanggung Jawab</span>
              <div className="font-bold text-slate-900 text-sm">{booking.borrowerName}</div>
              <div className="text-slate-600 mt-0.5">{booking.institution}</div>
              <div className="text-slate-500 mt-0.5">
                {booking.email} · {booking.phone}
              </div>
            </div>

            <div className="pt-2.5">
              <span className="text-slate-400 block mb-0.5">Fasilitas yang Dipinjam</span>
              <div className="font-semibold text-indigo-700">{roomName}</div>
              {equipmentNames.length > 0 && (
                <div className="text-slate-700 mt-0.5">
                  Alat: {equipmentNames.join(', ')}
                </div>
              )}
            </div>

            <div className="pt-2.5">
              <span className="text-slate-400 block mb-0.5">Waktu Pelaksanaan</span>
              <div className="font-mono font-semibold text-slate-900">
                {booking.date} · {booking.startTime} - {booking.endTime} WIB
              </div>
            </div>

            <div className="pt-2.5">
              <span className="text-slate-400 block mb-0.5">Keperluan Acara</span>
              <p className="text-slate-800 italic leading-relaxed">"{booking.purpose}"</p>
              <div className="text-slate-500 mt-1 font-mono">
                Estimasi Peserta: {booking.attendeesCount} Orang
              </div>
            </div>

            {booking.notes && (
              <div className="pt-2.5">
                <span className="text-slate-400 block mb-0.5">Catatan Tambahan</span>
                <p className="text-slate-700">{booking.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          {booking.status === 'APPROVED' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onPrint(booking);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Cetak Izin</span>
              </button>
              <button
                onClick={() => {
                  onComplete(booking.id);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              >
                Tandai Selesai
              </button>
              <button
                onClick={() => {
                  onCancel(booking.id);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Batalkan</span>
              </button>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Tidak ada aksi aktif</span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-200/80 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
