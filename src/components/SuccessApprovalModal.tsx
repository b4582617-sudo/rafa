import React from 'react';
import {
  CheckCircle2,
  Mail,
  Printer,
  Calendar,
  X,
  ExternalLink,
} from 'lucide-react';
import { Booking } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';
import { ADMIN_EMAIL } from '../utils/emailService';

interface SuccessApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onPrint: (booking: Booking) => void;
  onNavigateToSchedule: (date: string) => void;
  onNavigateToAdminEmails: () => void;
}

export const SuccessApprovalModal: React.FC<SuccessApprovalModalProps> = ({
  isOpen,
  onClose,
  booking,
  onPrint,
  onNavigateToSchedule,
  onNavigateToAdminEmails,
}) => {
  if (!isOpen || !booking) return null;

  const getResourceName = (id: string) => {
    return AVAILABLE_RESOURCES.find((r) => r.id === id)?.name || id;
  };

  const roomName = booking.roomId ? getResourceName(booking.roomId) : 'Tanpa Ruangan';
  const equipmentNames = booking.equipmentIds?.map(getResourceName) || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-emerald-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-emerald-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/80 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200">
                Verifikasi Anti-Bentrok Berhasil
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Peminjaman Disetujui Otomatis!
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Email Notification Dispatch Callout */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900">
                  Notifikasi Email Otomatis Terkirim ke Admin
                </p>
                <p className="text-emerald-700 mt-1 leading-relaxed">
                  Surat pemberitahuan peminjaman telah dikirimkan ke email resmi admin sarpras:{' '}
                  <span className="font-mono font-bold">{ADMIN_EMAIL}</span>. Jadwal telah terkunci di kalender sarana.
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Information */}
          <div className="border border-slate-200 rounded-xl p-4 text-xs divide-y divide-slate-100 space-y-2.5">
            <div className="pt-2 first:pt-0 flex items-center justify-between">
              <span className="text-slate-500">Nomor Registrasi:</span>
              <span className="font-mono font-bold text-indigo-700">{booking.id}</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500">Peminjam:</span>
              <span className="font-medium text-slate-900">{booking.borrowerName}</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500">Instansi / Unit:</span>
              <span className="text-slate-700">{booking.institution}</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500">Ruangan:</span>
              <span className="font-semibold text-slate-900">{roomName}</span>
            </div>
            {equipmentNames.length > 0 && (
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">Alat Inventaris:</span>
                <span className="font-medium text-slate-800">{equipmentNames.join(', ')}</span>
              </div>
            )}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500">Tanggal & Jam:</span>
              <span className="font-mono font-semibold text-slate-900">
                {booking.date} · {booking.startTime} - {booking.endTime} WIB
              </span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500">Keperluan:</span>
              <span className="text-slate-700 italic truncate max-w-[200px]">"{booking.purpose}"</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(booking)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak Surat Izin</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToAdminEmails();
              }}
              className="px-3 py-2 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Lihat Email Admin</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onNavigateToSchedule(booking.date);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Lihat di Jadwal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
