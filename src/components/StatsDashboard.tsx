import React, { useMemo } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Layers,
  Building,
  Monitor,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Booking } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';
import { ADMIN_EMAIL } from '../utils/emailService';

interface StatsDashboardProps {
  bookings: Booking[];
  onNavigateToSchedule: () => void;
  onNavigateToForm: () => void;
  onNavigateToEmails: () => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  bookings,
  onNavigateToSchedule,
  onNavigateToForm,
  onNavigateToEmails,
}) => {
  const stats = useMemo(() => {
    const total = bookings.length;
    const approved = bookings.filter((b) => b.status === 'APPROVED');
    const rejected = bookings.filter((b) => b.status === 'REJECTED');
    const completed = bookings.filter((b) => b.status === 'COMPLETED');

    // Count usage per resource
    const resourceUsage: Record<string, number> = {};
    for (const b of [...approved, ...completed]) {
      if (b.roomId) {
        resourceUsage[b.roomId] = (resourceUsage[b.roomId] || 0) + 1;
      }
      for (const eqId of b.equipmentIds || []) {
        resourceUsage[eqId] = (resourceUsage[eqId] || 0) + 1;
      }
    }

    // Sort top resources
    const sortedResources = Object.entries(resourceUsage)
      .map(([id, count]) => {
        const res = AVAILABLE_RESOURCES.find((r) => r.id === id);
        return {
          id,
          name: res?.name || id,
          category: res?.category || 'room',
          count,
        };
      })
      .sort((a, b) => b.count - a.count);

    return {
      total,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      completedCount: completed.length,
      conflictPreventionRate: total > 0 ? Math.round((rejected.length / total) * 100) : 0,
      sortedResources,
    };
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* Header Hero Card with Generated Facility Image Scrim */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white min-h-[220px] flex flex-col justify-end p-6 sm:p-8">
        <img
          src="/src/assets/images/facility_campus_hub_1790561146575.jpg"
          alt="Laboratorium dan Fasilitas Kampus"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-2">
            <span>SISTEM INFORMASI MANAJEMEN SARPRAS</span>
            <span>·</span>
            <span>EFISIENSI ANTI-BENTROK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Statistik & Kinerja Pemakaian Fasilitas
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Mesin anti-bentrok secara otomatis menyaring permohonan beririsan dan langsung menerbitkan
            persetujuan serta notifikasi ke admin (<span className="font-mono text-sky-300">{ADMIN_EMAIL}</span>)
            tanpa hambatan birokrasi manual.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onNavigateToForm}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              + Ajukan Peminjaman Baru
            </button>
            <button
              onClick={onNavigateToSchedule}
              className="px-4 py-2 text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded-lg transition-colors cursor-pointer"
            >
              Lihat Kalender Terpadu
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Approved */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Peminjaman Terjadwal</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {stats.approvedCount}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">Disetujui Otomatis</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1">
            Status: Bebas bentrokan jadwal
          </p>
        </div>

        {/* Metric 2: Conflicts Prevented */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Bentrokan Dicegah</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {stats.rejectedCount}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">Insiden Ditolak</span>
          </div>
          <p className="text-[11px] text-red-600 mt-1">
            Mencegah pemakaian tumpang tindih
          </p>
        </div>

        {/* Metric 3: Total Sarana Terpantau */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Sarana Terdaftar</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {AVAILABLE_RESOURCES.length}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">Ruang & Inventaris</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            5 Ruang (Lab & Aula) + 4 Alat
          </p>
        </div>

        {/* Metric 4: Admin Notifications Sent */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs cursor-pointer hover:border-slate-300 transition-colors" onClick={onNavigateToEmails}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Disposisi Email Admin</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {stats.approvedCount + stats.rejectedCount}
            </span>
            <span className="text-xs text-slate-500 ml-1.5">Email Dikirim</span>
          </div>
          <p className="text-[11px] text-indigo-600 mt-1 hover:underline">
            Terkirim ke {ADMIN_EMAIL} →
          </p>
        </div>
      </div>

      {/* Resource Utilization Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-1">
          Frekuensi Peminjaman per Sarana
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Pemantauan pemakaian fasilitas untuk membantu analisis alokasi inventaris sarpras.
        </p>

        <div className="space-y-3">
          {stats.sortedResources.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">Belum ada aktivitas peminjaman sarana.</p>
          ) : (
            stats.sortedResources.map((res) => {
              const maxCount = stats.sortedResources[0]?.count || 1;
              const percent = Math.round((res.count / maxCount) * 100);

              return (
                <div key={res.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {res.category === 'room' ? (
                        <Building className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5 text-sky-600" />
                      )}
                      <span className="font-semibold text-slate-800">{res.name}</span>
                    </div>
                    <span className="font-mono text-slate-600 tabular-nums font-medium">
                      {res.count} kali dipinjam
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        res.category === 'room' ? 'bg-indigo-600' : 'bg-sky-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
