import { Resource } from '../types';

export const AVAILABLE_RESOURCES: Resource[] = [
  // --- RUANGAN (ROOMS) ---
  {
    id: 'lab-komputer-1',
    name: 'Lab Komputer 1 (Pemrograman & Jaringan)',
    category: 'room',
    capacity: 40,
    location: 'Gedung Rektorat Lt. 2, Ruang 204',
    description: 'Laboratorium komputer dengan 40 PC Core i7, koneksi LAN Gigabit, server simulasi, dan pendingin ruangan sentral.',
    facilities: ['40 PC Desktop i7', 'AC Dual Unit', 'Whiteboard Glass', 'Koneksi LAN 1Gbps', 'UPS Backup'],
    color: '#0284c7', // Sky
    image: '/src/assets/images/facility_campus_hub_1790561146575.jpg',
    rules: ['Wajib melepas alas kaki luar', 'Dilarang membawa makanan dan minuman manis', 'Harap shutdown PC setelah selesai'],
  },
  {
    id: 'lab-multimedia',
    name: 'Lab Komputer 2 (Multimedia & Desain)',
    category: 'room',
    capacity: 35,
    location: 'Gedung Rektorat Lt. 2, Ruang 208',
    description: 'Laboratorium desain grafis & multimedia dengan GPU RTX, pen tablet display, dan sound monitoring.',
    facilities: ['35 PC Workstation RTX', 'Drawing Tablets', 'Layar Display 75"', 'Peredam Suara', 'AC Sentral'],
    color: '#6366f1', // Indigo
    image: '/src/assets/images/facility_campus_hub_1790561146575.jpg',
    rules: ['Simpan file pekerjaan pada cloud / flashdisk pribadi', 'Kembalikan pen stylus ke docking'],
  },
  {
    id: 'lab-sains',
    name: 'Laboratorium Sains & Robotika',
    category: 'room',
    capacity: 30,
    location: 'Gedung Laboratorium Terpadu Lt. 1',
    description: 'Ruang praktikum riset terapan, mikrokontroler, IoT, dan perakitan instrumen elektronika.',
    facilities: ['Meja Kerja ESD', 'Oscilloscope', '3D Printer', 'Exhaust Fan', 'Kotak P3K Lengkap'],
    color: '#0d9488', // Teal
    image: '/src/assets/images/facility_campus_hub_1790561146575.jpg',
    rules: ['Wajib mengenakan jas lab / perlengkapan K3 saat praktikum solder', 'Pastikan kabel daya tercabut sebelum pulang'],
  },
  {
    id: 'aula-utama',
    name: 'Aula Utama (Graha Serbaguna)',
    category: 'room',
    capacity: 300,
    location: 'Gedung Utama Kampus, Lantai Dasar',
    description: 'Auditorium megah berkapasitas besar untuk wisuda, seminar nasional, pameran inovasi, dan perhelatan akbar kampus.',
    facilities: ['Kapasitas 300 Kursi', 'Panggung Presentasi', 'Lighting Panggung DMX', 'AC Central 10 PK', 'Ruang Transit VIP'],
    color: '#d97706', // Amber
    image: '/src/assets/images/aula_auditorium_hall_1790562670131.jpg',
    rules: ['Konfirmasi tata panggung H-1 ke sarpras', 'Dilarang menempelkan selotip langsung pada dinding kayu peredam'],
  },
  {
    id: 'aula-mini-seminar',
    name: 'Ruang Seminar & Aula Mini',
    category: 'room',
    capacity: 75,
    location: 'Gedung Perpustakaan Lt. 3',
    description: 'Ruang pertemuan semi-amfiteater ideal untuk lokakarya, sidang terbuka skripsi/tesis, dan kuliah umum tingkat prodi.',
    facilities: ['Kursi Bioskop Meja Lipat', 'Panggung Dosen', 'Kamera Zoom PTZ Hybrid', 'Akustik Ruang'],
    color: '#4f46e5', // Deep Indigo
    image: '/src/assets/images/aula_auditorium_hall_1790562670131.jpg',
    rules: ['Kembalikan tata kursi ke posisi rapi', 'Matikan lampu dan pendingin ruangan sebelum mengunci pintu'],
  },

  // --- ALAT & INVENTARIS (EQUIPMENT) ---
  {
    id: 'proyektor-epson-hd1',
    name: 'Proyektor Epson HD-1 (Lumen Tinggi)',
    category: 'equipment',
    quantity: 1,
    location: 'Ruang Inventaris Sarpras, Lemari A-1',
    description: 'Proyektor 4000 Lumens HDMI/VGA, kontras tajam untuk ruang kelas besar atau lab komputer.',
    facilities: ['HDMI & VGA Input', '4000 ANSI Lumens', 'Kabel Power 5m & HDMI', 'Remote Control', 'Tas Pelindung'],
    color: '#2563eb', // Blue
    image: '/src/assets/images/projector_equipment_campus_1790562684996.jpg',
    rules: ['Ambil dan kembalikan di pos sarpras tepat waktu', 'Tunggu kipas pendingin mati sebelum mencabut kabel stopkontak'],
  },
  {
    id: 'proyektor-benq-portable',
    name: 'Proyektor BenQ Portable-2 (Ringkas)',
    category: 'equipment',
    quantity: 1,
    location: 'Ruang Inventaris Sarpras, Lemari A-2',
    description: 'Proyektor portabel ringan dengan wireless casting adaptor, mudah dibawa antar ruang kuliah.',
    facilities: ['Wireless Dongle Display', '3500 Lumens', 'Tas Jinjing Tahan Benturan', 'Tripod Stand Ringan'],
    color: '#0891b2', // Cyan
    image: '/src/assets/images/projector_equipment_campus_1790562684996.jpg',
    rules: ['Pastikan dongle nirkabel tidak tertinggal pada port proyektor saat pengembalian'],
  },
  {
    id: 'proyektor-laser-aula',
    name: 'Proyektor Laser 4K Aula Utama',
    category: 'equipment',
    quantity: 1,
    location: 'Control Booth Aula Utama',
    description: 'Proyektor laser beresolusi tinggi 7000 Lumens untuk proyeksi layar raksasa gedung aula utama.',
    facilities: ['7000 Lumens Laser Engine', 'Motorized Lens Shift', 'Support Resolusi 4K', 'Dual HDMI/Optical'],
    color: '#ea580c', // Orange
    image: '/src/assets/images/projector_equipment_campus_1790562684996.jpg',
    rules: ['Hanya boleh dioperasikan oleh teknisi sarpras atau operator tersertifikasi'],
  },
  {
    id: 'sound-mic-wireless',
    name: 'Sound System & 4 Mic Wireless',
    category: 'equipment',
    quantity: 1,
    location: 'Ruang Audio Gedung Pusat',
    description: 'Paket sound system aktif portable, mixer 8 channel, dan 4 mikrofon UHF wireless anti-interferensi.',
    facilities: ['Mixer 8-Ch Bluetooth', '4 Mic Wireless UHF', '2 Speaker Aktif 12"', 'Kabel Stand & Box Hardcase'],
    color: '#7c3aed', // Purple
    image: '/src/assets/images/projector_equipment_campus_1790562684996.jpg',
    rules: ['Periksa daya baterai mic sebelum acara dimulai', 'Matikan switch mic saat jeda istirahat'],
  },
];
