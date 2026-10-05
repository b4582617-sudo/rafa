import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Booking } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';
import { ADMIN_EMAIL } from '../utils/emailService';

interface PrintTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
}

export const PrintTicketModal: React.FC<PrintTicketModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  if (!isOpen || !booking) return null;

  const getResourceName = (id: string) => {
    return AVAILABLE_RESOURCES.find((r) => r.id === id)?.name || id;
  };

  const roomName = booking.roomId ? getResourceName(booking.roomId) : 'Tidak Meminjam Ruangan';
  const equipmentNames = booking.equipmentIds?.map(getResourceName) || [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="print:hidden p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">
              Pratinjau Surat Izin Peminjaman Sarpras
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-8 sm:p-10 overflow-y-auto text-slate-900 space-y-6 bg-white">
          {/* Official Letterhead */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h1 className="text-sm font-bold tracking-widest uppercase text-slate-700">
              UNIVERSITAS KAMPUS DIGITAL · BIRO SARANA & PRASARANA
            </h1>
            <h2 className="text-lg font-black tracking-tight text-slate-900 mt-1 uppercase">
              Surat Izin Pemakaian Ruangan & Inventaris
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Diterbitkan Otomatis Berdasarkan Validasi Bebas Bentrokan SIMRUANG
            </p>
          </div>

          {/* Ticket Metadata Bar */}
          <div className="flex items-center justify-between text-xs border border-slate-200 bg-slate-50 p-3 rounded-lg">
            <div>
              <span className="text-slate-500">Nomor Registrasi:</span>{' '}
              <span className="font-mono font-bold text-slate-900">{booking.id}</span>
            </div>
            <div>
              <span className="text-slate-500">Tanggal Terbit:</span>{' '}
              <span className="font-mono text-slate-900">
                {new Date(booking.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>STATUS: RESMI TERJADWAL</span>
            </div>
          </div>

          {/* Main Booking Details Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              A. Rincian Peminjam & Agenda
            </h3>
            <table className="w-full text-xs border border-slate-200 border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-40 p-2.5 bg-slate-50 font-medium text-slate-600">Nama Peminjam</td>
                  <td className="p-2.5 font-bold text-slate-900">{booking.borrowerName}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 bg-slate-50 font-medium text-slate-600">Instansi / Unit Kerja</td>
                  <td className="p-2.5 text-slate-900">{booking.institution}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 bg-slate-50 font-medium text-slate-600">Kontak Person</td>
                  <td className="p-2.5 text-slate-900">{booking.email} · {booking.phone}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 bg-slate-50 font-medium text-slate-600">Keperluan Pemakaian</td>
                  <td className="p-2.5 text-slate-900 italic font-serif">"{booking.purpose}"</td>
                </tr>
                <tr>
                  <td className="p-2.5 bg-slate-50 font-medium text-slate-600">Estimasi Peserta</td>
                  <td className="p-2.5 text-slate-900 font-mono">{booking.attendeesCount} Orang</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              B. Rincian Sarana & Jadwal Waktu
            </h3>
            <table className="w-full text-xs border border-slate-200 border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-40 p-2.5 bg-slate-50 font-medium text-slate-600">Ruangan Terjadwal</td>
                  <td className="p-2.5 font-bold text-indigo-900">{roomName}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 bg-slate-50 font-medium text-slate-600">Alat & Inventaris</td>
                  <td className="p-2.5 text-slate-900">
                    {equipmentNames.length > 0 ? equipmentNames.join(', ') : 'Tidak ada alat tambahan'}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 bg-slate-50 font-medium text-slate-600">Tanggal Pelaksanaan</td>
                  <td className="p-2.5 font-bold text-slate-900 font-mono">{booking.date}</td>
                </tr>
                <tr>
                  <td className="p-2.5 bg-slate-50 font-medium text-slate-600">Jam Operasional</td>
                  <td className="p-2.5 font-bold font-mono text-slate-900">
                    {booking.startTime} s.d. {booking.endTime} WIB
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Ketentuan Pemakaian */}
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1 leading-relaxed">
            <div className="font-semibold text-slate-900 mb-1">Ketentuan Penggunaan Sarpras:</div>
            <p>1. Surat izin ini sah tanpa tanda tangan basah karena telah diverifikasi melalui sistem validasi digital SIMRUANG.</p>
            <p>2. Peminjam bertanggung jawab penuh atas keamanan, kebersihan, dan keutuhan fasilitas selama masa peminjaman.</p>
            <p>3. Matikan proyektor, pendingin ruangan (AC), serta rapikan kabel sebelum meninggalkan ruangan.</p>
            <p>4. Notifikasi salinan telah diarsipkan secara otomatis pada email admin: {ADMIN_EMAIL}.</p>
          </div>

          {/* Signatures & QR Simulation */}
          <div className="pt-4 flex items-end justify-between text-xs">
            <div className="text-center w-48">
              <p className="text-slate-500 mb-12">Peminjam / Penanggung Jawab,</p>
              <p className="font-bold underline text-slate-900">{booking.borrowerName}</p>
              <p className="text-[10px] text-slate-400 font-mono">{booking.institution}</p>
            </div>

            {/* QR Simulation Box */}
            <div className="border border-slate-300 p-2 rounded-lg text-center flex flex-col items-center bg-slate-50">
              <div className="w-16 h-16 bg-slate-900 flex items-center justify-center text-white text-[9px] font-mono text-center p-1 rounded">
                SIMRUANG QR VERIFIED
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1">
                {booking.id}
              </span>
            </div>

            <div className="text-center w-48">
              <p className="text-slate-500 mb-12">Kepala Bagian Sarpras & Lab,</p>
              <p className="font-bold underline text-slate-900">Bagian Sarana Prasarana</p>
              <p className="text-[10px] text-slate-400 font-mono">Disahkan Otomatis (SIMRUANG)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
