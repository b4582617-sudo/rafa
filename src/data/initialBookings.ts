import { Booking, EmailNotification } from '../types';
import { generateAutoApprovalEmail } from '../utils/emailService';

// Format Date to YYYY-MM-DD
export function getFormattedDate(offsetDays: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getInitialBookings(): Booking[] {
  const today = getFormattedDate(0);
  const tomorrow = getFormattedDate(1);
  const dayAfter = getFormattedDate(2);

  const initialBookings: Booking[] = [
    {
      id: 'BK-20260928-101',
      borrowerName: 'Dr. Ir. Hendra Gunawan, M.Kom.',
      institution: 'Program Studi Teknik Informatika',
      email: 'hendra.gunawan@univ.ac.id',
      phone: '0812-3456-7890',
      roomId: 'lab-komputer-1',
      equipmentIds: ['proyektor-epson-hd1'],
      date: today,
      startTime: '08:30',
      endTime: '11:30',
      purpose: 'Ujian Praktikum Sertifikasi Cloud Computing & Jaringan Komputer',
      attendeesCount: 38,
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      adminEmailSent: true,
      notes: 'Memerlukan koneksi internet stabil & akun pengawas lab.',
    },
    {
      id: 'BK-20260928-102',
      borrowerName: 'Dewi Sartika (Ketua BEM)',
      institution: 'Badan Eksekutif Mahasiswa (BEM)',
      email: 'bem.universitas@univ.ac.id',
      phone: '0821-9876-5432',
      roomId: 'aula-utama',
      equipmentIds: ['proyektor-laser-aula', 'sound-mic-wireless'],
      date: today,
      startTime: '09:00',
      endTime: '14:30',
      purpose: 'Seminar Nasional Kewirausahaan & Pelantikan Ormawa Kampus',
      attendeesCount: 250,
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      adminEmailSent: true,
      notes: 'Panggung butuh 4 mic wireless dan podium utama.',
    },
    {
      id: 'BK-20260928-103',
      borrowerName: 'Ahmad Fauzi, S.Kom., M.T.',
      institution: 'Laboratorium Desain & Multimedia',
      email: 'ahmad.fauzi@univ.ac.id',
      phone: '0857-1122-3344',
      roomId: 'lab-multimedia',
      equipmentIds: [],
      date: today,
      startTime: '13:00',
      endTime: '16:00',
      purpose: 'Pelatihan Intensif 3D Animation & Blender untuk Mahasiswa Semester 5',
      attendeesCount: 30,
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      adminEmailSent: true,
      notes: 'Software Blender 4.2 sudah terinstal di setiap workstation.',
    },
    {
      id: 'BK-20260928-104',
      borrowerName: 'Rian Pratama',
      institution: 'Himpunan Mahasiswa Informatika (HIMAIF)',
      email: 'rian.pratama@mhs.univ.ac.id',
      phone: '0896-5544-3322',
      roomId: 'lab-komputer-1',
      equipmentIds: [],
      date: today,
      startTime: '09:30',
      endTime: '12:00',
      purpose: 'Lomba Cepat Coding Internal Antar Angkatan',
      attendeesCount: 25,
      status: 'REJECTED',
      conflictReason: 'Terjadi bentrokan jadwal pada "Lab Komputer 1" dengan peminjaman oleh Dr. Ir. Hendra Gunawan (08:30 - 11:30 WIB).',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      adminEmailSent: true,
      notes: 'Ditolak otomatis oleh mesin anti-bentrok SIMRUANG.',
    },
    {
      id: 'BK-20260929-201',
      borrowerName: 'Prof. Dr. Ratna Juwita',
      institution: 'Fakultas Sains & Teknologi',
      email: 'ratna.juwita@univ.ac.id',
      phone: '0813-8899-7766',
      roomId: 'aula-mini-seminar',
      equipmentIds: ['proyektor-benq-portable'],
      date: tomorrow,
      startTime: '09:00',
      endTime: '12:00',
      purpose: 'Sidang Terbuka Disertasi Doktor Bidang Kecerdasan Buatan',
      attendeesCount: 60,
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      adminEmailSent: true,
    },
    {
      id: 'BK-20260929-202',
      borrowerName: 'Bayu Wicaksono, M.Eng.',
      institution: 'Divisi Robotika & Otomasi',
      email: 'bayu.robotika@univ.ac.id',
      phone: '0878-3322-1100',
      roomId: 'lab-sains',
      equipmentIds: ['proyektor-benq-portable'],
      date: tomorrow,
      startTime: '13:30',
      endTime: '16:30',
      purpose: 'Uji Coba Lintas Medan Robot SAR & Sensor Lingkungan',
      attendeesCount: 18,
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      adminEmailSent: true,
    },
    {
      id: 'BK-20260930-301',
      borrowerName: 'Siti Nurhaliza',
      institution: 'Unit Kegiatan Mahasiswa Bahasa Asing',
      email: 'siti.ukm@univ.ac.id',
      phone: '0822-4455-6677',
      roomId: 'aula-mini-seminar',
      equipmentIds: ['proyektor-epson-hd1', 'sound-mic-wireless'],
      date: dayAfter,
      startTime: '14:00',
      endTime: '17:00',
      purpose: 'Debat Bahasa Inggris Mahasiswa Tingkat Regional',
      attendeesCount: 45,
      status: 'APPROVED',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      adminEmailSent: true,
    },
  ];

  return initialBookings;
}

export function getInitialEmailLogs(bookings: Booking[]): EmailNotification[] {
  const approved = bookings.filter((b) => b.status === 'APPROVED');
  const logs: EmailNotification[] = [];

  for (const b of approved) {
    logs.push(generateAutoApprovalEmail(b));
  }

  return logs;
}
