import { Booking, EmailNotification } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';

export const ADMIN_EMAIL = 'yulie234999@gmail.com';

function getResourceName(id: string): string {
  const found = AVAILABLE_RESOURCES.find((r) => r.id === id);
  return found ? found.name : id;
}

export function generateAutoApprovalEmail(booking: Booking): EmailNotification {
  const roomName = booking.roomId ? getResourceName(booking.roomId) : 'Tidak Meminjam Ruang';
  const equipmentNames =
    booking.equipmentIds && booking.equipmentIds.length > 0
      ? booking.equipmentIds.map(getResourceName).join(', ')
      : 'Tidak Meminjam Alat Tambahan';

  const subject = `[SIMRUANG] Persetujuan Otomatis: ${roomName} - ${booking.borrowerName} (${booking.date})`;
  const summary = `Peminjaman ID #${booking.id} telah disetujui otomatis oleh sistem anti-bentrok untuk tanggal ${booking.date} pukul ${booking.startTime} - ${booking.endTime} WIB.`;

  const contentHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; color: #1e293b;">
      <div style="background: #0f172a; padding: 24px; color: #ffffff;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #38bdf8; font-weight: 600; margin-bottom: 6px;">
          SISTEM INFORMASI MANAJEMEN SARPRAS & LABORATORIUM
        </div>
        <h1 style="font-size: 20px; margin: 0; font-weight: 700; color: #ffffff;">
          Persetujuan Otomatis: Peminjaman Terjadwal
        </h1>
        <p style="font-size: 13px; color: #94a3b8; margin: 6px 0 0 0;">
          Status: DISAHKAN OTOMATIS OLEH MESIN ANTI-BENTROK JADWAL
        </p>
      </div>

      <div style="padding: 24px;">
        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 14px 16px; margin-bottom: 20px; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #15803d;">
            Pemberitahuan kepada Admin Sarana & Prasarana
          </p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #166534;">
            Permohonan peminjaman dari <strong>${booking.borrowerName}</strong> telah divalidasi sistem. Tidak ditemukan bentrokan jadwal pada ruang maupun inventaris yang dipilih.
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; width: 140px;">Nomor Tiket</td>
              <td style="padding: 8px 0; font-weight: 600; font-family: monospace; color: #0f172a;">${booking.id}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Nama Peminjam</td>
              <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${booking.borrowerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Instansi / Unit</td>
              <td style="padding: 8px 0; color: #0f172a;">${booking.institution}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Kontak</td>
              <td style="padding: 8px 0; color: #0f172a;">${booking.email} · ${booking.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Ruangan Dipinjam</td>
              <td style="padding: 8px 0; font-weight: 600; color: #0284c7;">${roomName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Alat / Inventaris</td>
              <td style="padding: 8px 0; font-weight: 600; color: #6366f1;">${equipmentNames}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Tanggal & Waktu</td>
              <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">
                ${booking.date} · Pukul ${booking.startTime} - ${booking.endTime} WIB
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Keperluan / Agenda</td>
              <td style="padding: 8px 0; color: #0f172a; font-style: italic;">"${booking.purpose}"</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;">Perkiraan Peserta</td>
              <td style="padding: 8px 0; color: #0f172a;">${booking.attendeesCount} Orang</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px; font-size: 12px; color: #64748b; line-height: 1.6;">
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #334155;">Catatan Operasional Sarpras:</p>
          <ul style="margin: 0; padding-left: 18px;">
            <li>Kunci ruang dan inventaris dapat diambil di Pos Sarpras 15 menit sebelum waktu peminjaman.</li>
            <li>Peminjam diwajibkan menjaga kebersihan, kerapian perangkat, serta mematikan pendingin udara dan proyektor setelah selesai.</li>
            <li>Admin dapat membatalkan atau menyesuaikan jadwal sewaktu-waktu jika ada urgensi lembaga melalui dashboard SIMRUANG.</li>
          </ul>
        </div>
      </div>

      <div style="background: #f1f5f9; padding: 16px 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
        Email otomatis dikirimkan ke Admin: <strong>${ADMIN_EMAIL}</strong> · SIMRUANG Universitas AI Studio
      </div>
    </div>
  `;

  return {
    id: `EML-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    recipient: ADMIN_EMAIL,
    subject,
    type: 'AUTO_APPROVAL',
    bookingId: booking.id,
    borrowerName: booking.borrowerName,
    borrowerEmail: booking.email,
    summary,
    contentHtml,
    isRead: false,
  };
}

export function generateRejectionAlertEmail(
  booking: Booking,
  reason: string
): EmailNotification {
  const roomName = booking.roomId ? getResourceName(booking.roomId) : 'Ruang';

  const subject = `[SIMRUANG - PERINGATAN] Peminjaman Ditolak Otomatis (Bentrok): ${booking.borrowerName} (${booking.date})`;
  const summary = `Permohonan #${booking.id} ditolak otomatis oleh sistem karena jadwal bentrok dengan peminjaman lain pada ${booking.date}.`;

  const contentHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; color: #1e293b;">
      <div style="background: #7f1d1d; padding: 24px; color: #ffffff;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #fca5a5; font-weight: 600; margin-bottom: 6px;">
          PERINGATAN KONFLIK JADWAL · SISTEM ANTI-BENTROK
        </div>
        <h1 style="font-size: 20px; margin: 0; font-weight: 700; color: #ffffff;">
          Peminjaman Ditolak Otomatis: Terjadi Bentrokan
        </h1>
        <p style="font-size: 13px; color: #fecaca; margin: 6px 0 0 0;">
          Status: REJECTED (Jadwal Tidak Tersedia)
        </p>
      </div>

      <div style="padding: 24px;">
        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 16px; margin-bottom: 20px; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #b91c1c;">
            Detail Bentrokan Terdeteksi:
          </p>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #991b1b; line-height: 1.5;">
            ${reason}
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
          <tbody>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; width: 140px;">Peminjam Diajukan</td>
              <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${booking.borrowerName} (${booking.institution})</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Permintaan Waktu</td>
              <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${booking.date} · ${booking.startTime} - ${booking.endTime} WIB</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b;">Tindakan Sistem</td>
              <td style="padding: 8px 0; color: #b91c1c; font-weight: 600;">Otomatis ditolak tanpa mengganggu jadwal yang sudah terverifikasi.</td>
            </tr>
          </tbody>
        </table>

        <p style="font-size: 12px; color: #64748b; margin: 0;">
          Peminjam telah menerima notifikasi penolakan instan di layar dan disarankan memilih slot jam kosong alternatif yang direkomendasikan sistem.
        </p>
      </div>

      <div style="background: #f1f5f9; padding: 16px 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
        Notifikasi Log Admin: <strong>${ADMIN_EMAIL}</strong> · SIMRUANG Anti-Bentrok
      </div>
    </div>
  `;

  return {
    id: `EML-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    recipient: ADMIN_EMAIL,
    subject,
    type: 'REJECTION_ALERT',
    bookingId: booking.id,
    borrowerName: booking.borrowerName,
    borrowerEmail: booking.email,
    summary,
    contentHtml,
    isRead: false,
  };
}
