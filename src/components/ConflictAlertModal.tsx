import React from 'react';
import { AlertTriangle, Clock, X, ArrowRight, ShieldAlert } from 'lucide-react';
import { Booking } from '../types';
import { ADMIN_EMAIL } from '../utils/emailService';

interface ConflictAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  conflictReason: string;
  onNavigateToSchedule: (date: string) => void;
}

export const ConflictAlertModal: React.FC<ConflictAlertModalProps> = ({
  isOpen,
  onClose,
  booking,
  conflictReason,
  onNavigateToSchedule,
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-red-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Banner */}
        <div className="bg-red-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-red-200 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-700/80 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-200">
                Pemberitahuan Sistem Otomatis
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Peminjaman Ditolak Otomatis
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-start gap-2 text-red-800 font-semibold">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>Alasan Penolakan: Terjadi Bentrokan Jadwal Pemakaian</span>
            </div>
            <p className="text-red-700 leading-relaxed pl-6">
              {conflictReason || 'Sarana yang Anda pilih (laboratorium, aula, atau proyektor) telah terisi pada jam yang diminta.'}
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 text-xs divide-y divide-slate-100 space-y-2.5">
            <div className="pt-2 first:pt-0 flex items-center justify-between">
              <span className="text-slate-500">ID Pengajuan:</span>
              <span className="font-mono font-bold text-slate-800">{booking.id}</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500">Peminjam:</span>
              <span className="font-medium text-slate-900">{booking.borrowerName}</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500">Tanggal yang Diminta:</span>
              <span className="font-medium text-slate-900">{booking.date}</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500">Jam yang Diminta:</span>
              <span className="font-mono font-medium text-red-600">
                {booking.startTime} - {booking.endTime} WIB
              </span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-slate-500">Notifikasi Log Admin:</span>
              <span className="font-mono text-slate-700">{ADMIN_EMAIL}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-600">
            <p className="font-semibold text-slate-800 mb-1">
              Solusi yang Dapat Dilakukan:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Pilih jam lain yang tidak beririsan di hari yang sama.</li>
              <li>Gunakan proyektor portable alternatif atau ruangan lain yang kosong.</li>
              <li>Buka matriks kalender untuk melihat jam kosong yang masih tersedia.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup & Ubah Form
          </button>

          <button
            onClick={() => {
              onClose();
              onNavigateToSchedule(booking.date);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Cek Matriks Kalender</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
