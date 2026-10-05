import React, { useState } from 'react';
import {
  Mail,
  MailOpen,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Send,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { EmailNotification } from '../types';
import { ADMIN_EMAIL } from '../utils/emailService';

interface AdminEmailInboxProps {
  emails: EmailNotification[];
  onMarkAsRead: (emailId: string) => void;
  onDeleteEmail: (emailId: string) => void;
  onSendTestNotification: () => void;
  onNavigateToBooking: (bookingId: string) => void;
}

export const AdminEmailInbox: React.FC<AdminEmailInboxProps> = ({
  emails,
  onMarkAsRead,
  onDeleteEmail,
  onSendTestNotification,
  onNavigateToBooking,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(
    emails.length > 0 ? emails[0].id : ''
  );
  const [copied, setCopied] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'AUTO_APPROVAL' | 'REJECTION_ALERT'>('ALL');

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || (emails.length > 0 ? emails[0] : null);

  const filteredEmails = emails.filter((e) => {
    if (filterType !== 'ALL' && e.type !== filterType) {
      return false;
    }
    return true;
  });

  const handleCopyEmailText = () => {
    if (!selectedEmail) return;
    const textContent = `Subjek: ${selectedEmail.subject}\nKepada: ${selectedEmail.recipient}\nWaktu: ${selectedEmail.timestamp}\n\n${selectedEmail.summary}`;
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectEmail = (email: EmailNotification) => {
    setSelectedEmailId(email.id);
    if (!email.isRead) {
      onMarkAsRead(email.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Sistem Disposisi Elektronik</span>
              <span>·</span>
              <span>Simulasi Notifikasi Email Admin</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Kotak Masuk Notifikasi Email Admin
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Setiap kali permohonan lolos validasi tanpa bentrokan, notifikasi email persetujuan otomatis dikirimkan ke:{' '}
              <span className="font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {ADMIN_EMAIL}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSendTestNotification}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simulasi Kirim Notifikasi Uji</span>
            </button>
          </div>
        </div>

        {/* Filter Segment */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterType === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Pesan ({emails.length})
            </button>
            <button
              onClick={() => setFilterType('AUTO_APPROVAL')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterType === 'AUTO_APPROVAL'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Persetujuan Otomatis ({emails.filter((e) => e.type === 'AUTO_APPROVAL').length})
            </button>
            <button
              onClick={() => setFilterType('REJECTION_ALERT')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                filterType === 'REJECTION_ALERT'
                  ? 'bg-white text-red-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Peringatan Bentrok ({emails.filter((e) => e.type === 'REJECTION_ALERT').length})
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            Penerima Terdaftar: <span className="font-mono text-slate-800">{ADMIN_EMAIL}</span>
          </div>
        </div>
      </div>

      {/* Two-Pane Email Client View */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Mail List Pane (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-200 overflow-y-auto max-h-[620px] divide-y divide-slate-100">
          {filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Mail className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">Kotak masuk kosong</p>
              <p className="text-xs mt-1">Belum ada email notifikasi untuk filter ini.</p>
            </div>
          ) : (
            filteredEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              const isApproval = email.type === 'AUTO_APPROVAL';

              return (
                <div
                  key={email.id}
                  onClick={() => handleSelectEmail(email)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/70 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      {isApproval ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {isApproval ? 'Persetujuan Otomatis' : 'Peringatan Bentrok'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      {new Date(email.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-800 line-clamp-1 leading-snug">
                    {email.subject}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {email.summary}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono">#{email.bookingId}</span>
                    <span>Peminjam: {email.borrowerName}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Email Preview Pane (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50/50 flex flex-col justify-between overflow-y-auto max-h-[620px]">
          {selectedEmail ? (
            <div className="p-6 space-y-4">
              {/* Email Meta Bar */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {selectedEmail.subject}
                    </h2>
                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <div>
                        <span className="text-slate-400">Pengirim:</span>{' '}
                        <span className="font-medium text-slate-800">
                          Sistem Anti-Bentrok SIMRUANG &lt;sarpras@univ.ac.id&gt;
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Kepada (Admin):</span>{' '}
                        <span className="font-mono font-medium text-indigo-700">
                          {selectedEmail.recipient}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">Waktu Terkirim:</span>{' '}
                        <span className="font-mono text-slate-700">
                          {new Date(selectedEmail.timestamp).toLocaleString('id-ID', {
                            dateStyle: 'full',
                            timeStyle: 'medium',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={handleCopyEmailText}
                      title="Salin Rangkuman Email"
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onDeleteEmail(selectedEmail.id)}
                      title="Hapus Pesan Ini"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Nomor Registrasi:</span>
                    <button
                      onClick={() => onNavigateToBooking(selectedEmail.bookingId)}
                      className="font-mono font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{selectedEmail.bookingId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Status: Terkirim Sukses (SMTP OK)
                  </span>
                </div>
              </div>

              {/* Rendered Email Body HTML Preview */}
              <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-2xs">
                <div
                  className="prose prose-sm max-w-none p-2"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.contentHtml }}
                />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 my-auto">
              <MailOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">Pilihlah salah satu email untuk membaca rincian</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
