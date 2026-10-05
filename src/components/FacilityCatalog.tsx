import React, { useState } from 'react';
import {
  Building,
  Monitor,
  Volume2,
  Users,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Filter,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Resource } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';

interface FacilityCatalogProps {
  onSelectResourceToBook: (resourceId: string) => void;
  onNavigateToSchedule: () => void;
}

export const FacilityCatalog: React.FC<FacilityCatalogProps> = ({
  onSelectResourceToBook,
  onNavigateToSchedule,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'ROOM' | 'EQUIPMENT'>('ALL');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const filtered = AVAILABLE_RESOURCES.filter((r) => {
    if (filter === 'ROOM') return r.category === 'room';
    if (filter === 'EQUIPMENT') return r.category === 'equipment';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Catalog Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Katalog Fasilitas & Inventaris Publik
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Daftar Laboratorium, Aula, & Perangkat Kampus
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Seluruh fasilitas terawat dan dilengkapi sarana pendukung modern untuk menunjang perkuliahan, praktikum, seminar akademik, maupun kegiatan organisasi kemahasiswaan.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Sarana ({AVAILABLE_RESOURCES.length})
            </button>
            <button
              onClick={() => setFilter('ROOM')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'ROOM'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ruangan (Lab & Aula)
            </button>
            <button
              onClick={() => setFilter('EQUIPMENT')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                filter === 'EQUIPMENT'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alat (Proyektor & Audio)
            </button>
          </div>

          <button
            onClick={onNavigateToSchedule}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Lihat Kalender Ketersediaan Lengkap</span>
          </button>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((res) => {
          return (
            <div
              key={res.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {res.image ? (
                    <img
                      src={res.image}
                      alt={res.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                      <Building className="w-10 h-10" />
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md backdrop-blur-md bg-slate-900/80 text-white shadow-xs">
                      {res.category === 'room' ? (
                        <>
                          <Building className="w-3 h-3 text-indigo-400" />
                          <span>Ruang Lab / Aula</span>
                        </>
                      ) : (
                        <>
                          <Monitor className="w-3 h-3 text-sky-400" />
                          <span>Alat Inventaris</span>
                        </>
                      )}
                    </span>
                  </div>

                  {res.capacity && (
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-white/95 text-slate-800 shadow-xs">
                        <Users className="w-3 h-3 text-indigo-600" />
                        <span>Kapasitas {res.capacity} Org</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {res.name}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{res.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>

                  {/* Facilities Chips */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {res.facilities.slice(0, 3).map((f, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {f}
                      </span>
                    ))}
                    {res.facilities.length > 3 && (
                      <span className="text-[11px] text-slate-400 font-mono self-center">
                        +{res.facilities.length - 3} lagi
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedResource(res)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Detail & SOP
                </button>

                <button
                  type="button"
                  onClick={() => onSelectResourceToBook(res.id)}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span>Pinjam Sarana</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Facility Detail & SOP Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Photo */}
            <div className="relative h-48 bg-slate-900">
              {selectedResource.image && (
                <img
                  src={selectedResource.image}
                  alt={selectedResource.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-85"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400">
                  {selectedResource.category === 'room' ? 'Laboratorium / Aula' : 'Peralatan Inventaris'}
                </span>
                <h2 className="text-lg font-bold text-white leading-snug">
                  {selectedResource.name}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Deskripsi & Penempatan
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedResource.description}
                </p>
                <div className="mt-2 text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{selectedResource.location}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider block mb-1.5">
                  Fasilitas & Kelengkapan
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {selectedResource.facilities.map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedResource.rules && selectedResource.rules.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
                  <span className="text-amber-900 font-semibold block mb-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Tata Tertib & Ketentuan Penggunaan (SOP):</span>
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-amber-800">
                    {selectedResource.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Tutup
              </button>

              <button
                onClick={() => {
                  const id = selectedResource.id;
                  setSelectedResource(null);
                  onSelectResourceToBook(id);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Ajukan Peminjaman Sarana Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
