export interface QuizQuestion {
  id: string;
  scenario: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface IsoPrinciple {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  practicalExample: string;
}

export interface BaselCategory {
  code: string;
  name: string;
  nameId: string;
  definition: string;
  examples: string[];
  preventiveControl: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  summary: string;
  rootCause: string;
  riskEvent: string;
  initialImpact: string;
  initialInherentScore: number;
  options: {
    id: string;
    action: string;
    strategyType: 'TREAT' | 'TRANSFER' | 'TERMINATE' | 'TOLERATE';
    residualScore: number;
    financialCost: string;
    outcomeVerdict: 'Optimal' | 'Sub-optimal' | 'Kritis';
    explanation: string;
  }[];
}

export const ISO_PRINCIPLES: IsoPrinciple[] = [
  {
    number: '01',
    title: 'Terintegrasi (Integrated)',
    subtitle: 'Menyatu dalam seluruh aktivitas organisasi',
    description: 'Manajemen risiko bukan lampiran atau tugas tambahan terpisah, melainkan bagian tak terpisahkan dari tata kelola, perencanaan strategis, dan operasional harian.',
    practicalExample: 'Setiap pengadaan IT, peluncuran produk baru, atau kontrak vendor wajib melampirkan lembar RCSA sebelum disetujui direksi.'
  },
  {
    number: '02',
    title: 'Terstruktur & Komprehensif',
    subtitle: 'Konsisten dan dapat diperbandingkan',
    description: 'Pendekatan terstruktur memastikan hasil evaluasi risiko antar unit kerja (misal: Keuangan vs IT vs Operasi Lapangan) dapat diperbandingkan secara setara (apel-ke-apel).',
    practicalExample: 'Seluruh divisi memakai skala Likelihood & Impact 5x5 standar ISO 31000 sehingga kriteria "Tinggi" atau "Ekstrem" memiliki definisi sama.'
  },
  {
    number: '03',
    title: 'Disesuaikan (Customized)',
    subtitle: 'Sesuai konteks internal dan eksternal organisasi',
    description: 'Kerangka manajemen risiko diselaraskan dengan batas toleransi selera risiko (Risk Appetite), tujuan organisasi, regulasi, dan kapasitas sumber daya.',
    practicalExample: 'Risk appetite fintech untuk fitur eksperimen produk lebih terbuka, tetapi kepatuhan terhadap regulasi privasi data nasabah bertoleransi nol (zero tolerance).'
  },
  {
    number: '04',
    title: 'Inklusif (Inclusive)',
    subtitle: 'Melibatkan seluruh pemangku kepentingan',
    description: 'Pelibatan aktif pemangku kepentingan secara tepat waktu memungkinkan pengetahuan dan sudut pandang mereka dipertimbangkan sehingga asesmen risiko tetap relevan.',
    practicalExample: 'Workshop RCSA mengikutsertakan operator lini depan dan customer service yang paling mengetahui friksi dan keluhan nyata pelanggan.'
  },
  {
    number: '05',
    title: 'Dinamis (Dynamic)',
    subtitle: 'Responsif terhadap perubahan kondisi',
    description: 'Risiko dapat muncul, bermutasi, atau hilang seiring pergeseran konteks internal dan eksternal. Manajemen risiko harus lincah mendeteksi perubahan lingkungan.',
    practicalExample: 'Begitu regulasi UU Perlindungan Data Pribadi berlaku, matriks risiko kepatuhan hukum dan sanksi denda langsung dimutakhirkan dalam 7 hari.'
  },
  {
    number: '06',
    title: 'Informasi Terbaik (Best Available Information)',
    subtitle: 'Berdasarkan data historis dan proyeksi masa depan',
    description: 'Masukan manajemen risiko didasarkan pada data historis, pengalaman praktisi, observasi pasar, serta batasan keterbatasan informasi yang transparan.',
    practicalExample: 'Mengombinasikan riwayat uptime server tahun lalu dengan data lonjakan volume transaksi saat momentum promo Harbolnas.'
  },
  {
    number: '07',
    title: 'Faktor Manusia & Budaya',
    subtitle: 'Pengaruh perilaku, kompetensi, dan komunikasi',
    description: 'Perilaku manusia dan budaya perusahaan sangat memengaruhi setiap aspek manajemen risiko pada setiap tingkatan dan tahap pengambilan keputusan.',
    practicalExample: 'Menerapkan budaya "No-Blame Culture" agar staf lapangan berani melaporkan insiden kegagalan sistem tanpa takut diskors sepihak.'
  },
  {
    number: '08',
    title: 'Perbaikan Berkelanjutan (Continual Improvement)',
    subtitle: 'Peningkatan berkelanjutan melalui pembelajaran',
    description: 'Kerangka kerja manajemen risiko senantiasa ditingkatkan melalui audit berkala, benchmarking industri, dan pembelajaran atas insiden yang pernah terjadi.',
    practicalExample: 'Melakukan Post-Incident Review (PIR) wajib dalam 48 jam pasca insiden untuk memperbarui mitigasi preventif di masa mendatang.'
  }
];

export const THREE_LINES_MODEL = [
  {
    line: 'Lini Pertama (1st Line)',
    owner: 'Manajemen Operasional & Pemilik Proses Bisnis',
    role: 'Pemilik Risiko & Pelaksana Kontrol',
    duty: 'Mengidentifikasi risiko secara mandiri, merancang serta menjalankan kontrol operasional harian, dan memperbarui kertas kerja RCSA berkala.',
    color: '#1d4ed8'
  },
  {
    line: 'Lini Kedua (2nd Line)',
    owner: 'Divisi Manajemen Risiko & Kepatuhan (Compliance)',
    role: 'Fasilitator, Pengawas & Standarisasi',
    duty: 'Menyusun kerangka kerja/framework risiko, memantau indikator KRI, menantang validitas RCSA lini pertama, dan melaporkan profil risiko agregat ke Direksi.',
    color: '#b45309'
  },
  {
    line: 'Lini Ketiga (3rd Line)',
    owner: 'Internal Audit (SKAI)',
    role: 'Asurans Independen & Objektif',
    duty: 'Memberikan asurans independen kepada Dewan Komisaris dan Komite Audit terkait keandalan tata kelola serta efektivitas kontrol lini pertama dan lini kedua.',
    color: '#047857'
  }
];

export const BASEL_CATEGORIES: BaselCategory[] = [
  {
    code: 'B-01',
    name: 'Internal Fraud',
    nameId: 'Kecurangan Internal',
    definition: 'Kerugian akibat tindakan kesengajaan penggelapan, manipulasi dokumen, suap, atau pelanggaran kewenangan oleh karyawan internal.',
    examples: ['Kasir memalsukan tanda tangan pencairan cek', 'Pegawai IT membocorkan data nasabah ke pihak ketiga'],
    preventiveControl: 'Dual control (Maker-Checker), rotasi tugas berkala (mandatory leave), audit log akses tak terhapus.'
  },
  {
    code: 'B-02',
    name: 'External Fraud',
    nameId: 'Kecurangan Eksternal',
    definition: 'Kerugian akibat tindakan penipuan, peretasan, pemalsuan, atau pencurian yang dilakukan oleh pihak luar organisasi.',
    examples: ['Serangan phishing email merebut kredensial admin', 'Pemalsuan kartu pembayaran (card skimming)'],
    preventiveControl: 'Multi-Factor Authentication (MFA), Web Application Firewall (WAF), pelatihan keamanan siber.'
  },
  {
    code: 'B-03',
    name: 'Employment Practices & Workplace Safety',
    nameId: 'Ketenagakerjaan & K3',
    definition: 'Kerugian akibat ketidakpatuhan terhadap undang-undang ketenagakerjaan, diskriminasi, kecelakaan kerja, atau tuntutan kompensasi.',
    examples: ['Pekerja gudang tertimpa palet karena ketiadaan APD', 'Tuntutan hukum perselisihan PHK tidak sesuai SOP'],
    preventiveControl: 'Sertifikasi K3 wajib, inspeksi keselamatan rutin, SOP ketenagakerjaan selaras regulasi Disnaker.'
  },
  {
    code: 'B-04',
    name: 'Clients, Products & Business Practices',
    nameId: 'Praktik Bisnis, Produk & Klien',
    definition: 'Kerugian akibat kelalaian kewajiban profesional terhadap klien, penjualan produk yang keliru (mis-selling), atau pelanggaran antitrust.',
    examples: ['Menjual produk investasi berisiko tinggi tanpa persetujuan klien', 'Pelanggaran ketentuan kerahasiaan data nasabah UU PDP'],
    preventiveControl: 'Klausul kontrak standar, penilaian kesesuaian produk (suitability test), audit kepatuhan legal.'
  },
  {
    code: 'B-05',
    name: 'Damage to Physical Assets',
    nameId: 'Kerusakan Aset Fisik',
    definition: 'Kerugian akibat kerusakan aset fisik kantor, pabrik, atau pusat data akibat bencana alam, kebakaran, kerusuhan, atau vandalisme.',
    examples: ['Ruang server terendam banjir bandang', 'Gudang logistik terbakar akibat sambaran petir'],
    preventiveControl: 'Sistem proteksi pemadam otomatis (FM200), penangkal petir teruji, asuransi property all-risk.'
  },
  {
    code: 'B-06',
    name: 'Business Disruption & System Failures',
    nameId: 'Gangguan Usaha & Kegagalan Sistem',
    definition: 'Kerugian akibat downtime sistem IT, kegagalan software inti, pemadaman listrik berkepanjangan, atau gangguan jaringan komunikasi.',
    examples: ['Core banking down saat hari gajian selama 6 jam', 'Database crash akibat lonjakan transaksi tiba-tiba'],
    preventiveControl: 'High Availability Multi-AZ, Disaster Recovery Center (DRC) RTO < 15 menit, redundant UPS.'
  },
  {
    code: 'B-07',
    name: 'Execution, Delivery & Process Management',
    nameId: 'Eksekusi, Pengiriman & Proses',
    definition: 'Kerugian akibat kesalahan pemrosesan transaksi, kekeliruan pembukuan, kelalaian dokumentasi, atau sengketa dengan vendor pendukung.',
    examples: ['Salah input nominal transfer nasabah (fat-finger error)', 'Vendor kurir gagal mengantarkan pesanan sesuai SLA'],
    preventiveControl: 'Sistem validasi form otomatis, rekonsiliasi harian otomatis, SLA monitoring ketat.'
  }
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-01',
    title: 'Serangan DDoS & Downtime Core Banking Saat Gajian',
    industry: 'Perbankan & Financial Technology',
    summary: 'Pada tanggal 25 jam 09.00 pagi, layanan mobile banking mengalami lonjakan koneksi 1500% akibat kombinasi hari gajian dan serangan bot DDoS volumetrik. Nasabah gagal transfer, antrean ATM membludak, dan keluhan viral di Twitter/X.',
    rootCause: 'Kapasitas bandwidth edge tidak memiliki proteksi scrub DDoS otomatis dan server database belum menerapkan rate limiting.',
    riskEvent: 'Layanan core digital banking lumpuh total selama 4 jam pada jam sibuk transaksi.',
    initialImpact: 'Estimasi kerugian transaksi fee Rp 450 Juta, reputasi anjlok, potensi teguran regulator OJK/BI.',
    initialInherentScore: 20, // L: 4, I: 5
    options: [
      {
        id: 'opt-1a',
        action: 'Mitigasi komprehensif: Pasang Cloud DDoS Protection Otomatis (Cloudflare Magic Transit/AWS Shield Advanced) + Auto-scaling server database & Circuit Breaker.',
        strategyType: 'TREAT',
        residualScore: 4, // L: 1, I: 4
        financialCost: 'Rp 65 Juta/bulan',
        outcomeVerdict: 'Optimal',
        explanation: 'Sangat Tepat! Pendekatan Preventif dan Detektif ini secara drastis memangkas kemungkinan (Likelihood dari 4 menjadi 1) dan menjaga SLA ketersediaan 99.99%.'
      },
      {
        id: 'opt-1b',
        action: 'Hanya menambah kapasitas bandwidth server manual saat terjadi lonjakan dan meminta maaf di media sosial.',
        strategyType: 'TOLERATE',
        residualScore: 16, // L: 4, I: 4
        financialCost: 'Rp 10 Juta/bulan',
        outcomeVerdict: 'Kritis',
        explanation: 'Keliru! Pendekatan reaktif ini membiarkan risiko tetap di level Ekstrem/Tinggi. Serangan berikutnya pasti melumpuhkan sistem kembali.'
      },
      {
        id: 'opt-1c',
        action: 'Membeli polis asuransi cyber insurance tanpa memperbaiki arsitektur teknis jaringan.',
        strategyType: 'TRANSFER',
        residualScore: 12, // L: 4, I: 3
        financialCost: 'Rp 120 Juta/tahun',
        outcomeVerdict: 'Sub-optimal',
        explanation: 'Asuransi hanya mengganti kerugian klaim setelah kejadian, tetapi tidak menyelamatkan hilangnya kepercayaan nasabah dan sanksi dari otoritas keuangan.'
      }
    ]
  },
  {
    id: 'cs-02',
    title: 'Insiden Salah Pemberian Obat di Rumah Sakit',
    industry: 'Kesehatan & Rumah Sakit',
    summary: 'Pasien rawat inap menerima obat antibiotik dengan dosis 10x lipat dari instruksi karena tulisan dokter pada lembar resep kertas manual sulit dibaca oleh apoteker instalasi farmasi.',
    rootCause: 'Proses penulisan resep dan dispensing masih menggunakan kertas manual tanpa verifikasi digital berbasis barcode.',
    riskEvent: 'Pemberian overdosis obat antibiotik kepada pasien anak di ruang rawat inap.',
    initialImpact: 'Kondisi pasien memburuk, masuk ruang ICU, potensi gugatan malpraktik senilai Rp 2 Miliar dan pencabutan izin akreditasi.',
    initialInherentScore: 20, // L: 4, I: 5
    options: [
      {
        id: 'opt-2a',
        action: 'Implementasi Electronic Prescribing (CPOE) terintegrasi sistem barcode gelang pasien + Verifikasi ganda farmasi (Independent Double Check).',
        strategyType: 'TREAT',
        residualScore: 3, // L: 1, I: 3
        financialCost: 'Rp 150 Juta (Investasi Sistem)',
        outcomeVerdict: 'Optimal',
        explanation: 'Solusi teruji standar akreditasi JCI/KARS. Mengeliminasi kesalahan pembacaan manual (human error) dan memastikan pasien yang tepat menerima dosis yang tepat.'
      },
      {
        id: 'opt-2b',
        action: 'Memberikan surat teguran kepada dokter yang bersangkutan dan meminta dokter menulis lebih rapi.',
        strategyType: 'TOLERATE',
        residualScore: 16, // L: 4, I: 4
        financialCost: 'Rp 0',
        outcomeVerdict: 'Kritis',
        explanation: 'Menyalahkan individu tanpa membenahi sistem kerja yang rentan adalah kegagalan tata kelola risiko yang fatal.'
      }
    ]
  },
  {
    id: 'cs-03',
    title: 'Korsleting Listrik & Ketiadaan Sensor di Gudang Logistik',
    industry: 'Logistik & E-Commerce',
    summary: 'Gudang distribusi regional seluas 5.000 m2 mengalami kebakaran tengah malam akibat korsleting panel genset. Api baru terdeteksi 45 menit kemudian oleh satpam karena sensor asap tidak terkoneksi ke Dinas Damkar.',
    rootCause: 'Tidak adanya sistem pemadam otomatis (sprinkler gas) dan perawatan instalasi kelistrikan yang melewati masa uji kelayakan.',
    riskEvent: 'Kebakaran melalap 60% stok barang siap kirim konsumen senilai Rp 8,5 Miliar.',
    initialImpact: 'Kerugian aset fisik, terhentinya pengiriman 12.000 paket pelanggan, klaim penalti vendor e-commerce mitra.',
    initialInherentScore: 20, // L: 4, I: 5
    options: [
      {
        id: 'opt-3a',
        action: 'Instalasi Fire Suppression System otomatis + Sensor panas IoT dengan alarm langsung ke dinas damkar + Polis asuransi All Risk Gudang.',
        strategyType: 'TREAT',
        residualScore: 4, // L: 1, I: 4
        financialCost: 'Rp 280 Juta',
        outcomeVerdict: 'Optimal',
        explanation: 'Kombinasi mitigasi preventif (sensor & sprinkler) dengan mitigasi transfer risiko (asuransi) menurunkan level risiko ke zona aman.'
      },
      {
        id: 'opt-3b',
        action: 'Menambah shift patroli satpam dari 2 jam sekali menjadi 1 jam sekali menggunakan senter.',
        strategyType: 'TOLERATE',
        residualScore: 15, // L: 3, I: 5
        financialCost: 'Rp 3 Juta/bulan',
        outcomeVerdict: 'Kritis',
        explanation: 'Pengendalian manual sangat rentan terhadap kelalaian manusia saat larut malam dan tidak dapat memadamkan api yang sudah menyala cepat.'
      }
    ]
  }
];

export const ISO_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    scenario: 'Staf kasir salah menginput nominal transfer nasabah sebesar Rp 100.000.000 karena tombol angka di keyboard rusak dan sedang terburu-buru antrean panjang.',
    question: 'Berdasarkan anatomi risiko (Cause - Event - Impact), manakah yang merupakan "PERISTIWA RISIKO (Risk Event)"?',
    options: [
      {
        text: 'Tombol keyboard rusak dan antrean panjang',
        isCorrect: false,
        explanation: 'Ini adalah AKAR PENYEBAB (Root Cause), bukan kejadian risiko utamanya.'
      },
      {
        text: 'Salah input nominal transfer nasabah sebesar Rp 100 Juta',
        isCorrect: true,
        explanation: 'Tepat! Peristiwa Risiko (Risk Event) adalah kejadian operasional aktual yang terjadi atau berpotensi terjadi.'
      },
      {
        text: 'Uang nasabah tertahan dan timbul komplain',
        isCorrect: false,
        explanation: 'Ini adalah DAMPAK (Impact / Consequence) yang dirasakan organisasi.'
      }
    ]
  },
  {
    id: 'q2',
    scenario: 'Perusahaan Anda menerapkan sistem Maker-Checker di mana setiap transfer dana di atas Rp 20 Juta harus diverifikasi oleh supervisor sebelum uang terkirim keluar.',
    question: 'Termasuk dalam jenis pengendalian (Control Type) apakah mekanisme Maker-Checker tersebut?',
    options: [
      {
        text: 'Pengendalian Preventif (Preventive Control)',
        isCorrect: true,
        explanation: 'Tepat! Maker-Checker dirancang untuk MENCEGAH terjadinya kesalahan sebelum transaksi dieksekusi.'
      },
      {
        text: 'Pengendalian Detektif (Detective Control)',
        isCorrect: false,
        explanation: 'Detektif mendeteksi setelah kejadian (misal: rekonsiliasi kas akhir hari), bukan mencegah sebelum uang keluar.'
      },
      {
        text: 'Pengendalian Korektif (Corrective Control)',
        isCorrect: false,
        explanation: 'Korektif bertujuan memulihkan dampak setelah insiden terjadi (misal: klaim pembatalan dana).'
      }
    ]
  },
  {
    id: 'q3',
    scenario: 'Sebuah server pusat data rentan terhadap gempa bumi di zona patahan aktif. Perusahaan memutuskan membeli polis asuransi Business Interruption & Data Recovery senilai Rp 5 Miliar.',
    question: 'Strategi perlakuan risiko (Risk Treatment - 4T) apakah yang sedang dijalankan perusahaan?',
    options: [
      {
        text: 'Tolerate (Menerima Risiko)',
        isCorrect: false,
        explanation: 'Tolerate berarti menerima dampak finansial sepenuhnya tanpa langkah pemindahan beban.'
      },
      {
        text: 'Transfer (Memindahkan Beban Risiko)',
        isCorrect: true,
        explanation: 'Tepat! Membeli asuransi atau mengalihdayakan risiko ke pihak ketiga adalah bentuk strategi Transfer (Risk Financing).'
      },
      {
        text: 'Terminate (Menghindari / Menghentikan Risiko)',
        isCorrect: false,
        explanation: 'Terminate berarti menutup pusat data dan menghentikan seluruh aktivitas di lokasi tersebut.'
      }
    ]
  },
  {
    id: 'q4',
    scenario: 'Berdasarkan standar The IIA Three Lines Model, unit kerja mana yang bertindak sebagai Pemilik Risiko (Risk Owner) utama?',
    question: 'Siapakah yang memegang peran kepemilikan risiko pada Lini Pertama (First Line)?',
    options: [
      {
        text: 'Manajemen Operasional & Pemilik Proses Bisnis harian',
        isCorrect: true,
        explanation: 'Benar! Lini pertama adalah unit bisnis operasional yang langsung mengelola proses harian dan pemilik risiko sesungguhnya.'
      },
      {
        text: 'Divisi Manajemen Risiko & Kepatuhan',
        isCorrect: false,
        explanation: 'Divisi Manajemen Risiko berada di Lini Kedua sebagai fasilitator, pengawas, dan penyedia kerangka kerja.'
      },
      {
        text: 'Internal Audit (SKAI)',
        isCorrect: false,
        explanation: 'Internal Audit berada di Lini Ketiga dan wajib independen dari kepemilikan risiko sehari-hari.'
      }
    ]
  },
  {
    id: 'q5',
    scenario: 'Suatu risiko memiliki Kemungkinan (Likelihood) = 4 (Sering Terjadi) dan Dampak (Impact) = 5 (Bencana). Setelah dipasang kontrol preventif yang efektif, kemungkinan turun menjadi 2 dan dampak turun menjadi 3.',
    question: 'Berapakah penurunan skor risiko dari Inheren menuju Residual?',
    options: [
      {
        text: 'Dari Skor 20 turun menjadi Skor 6 (Penurunan 70%)',
        isCorrect: true,
        explanation: 'Tepat! Skor Inheren = 4 x 5 = 20 (Ekstrem). Skor Residual = 2 x 3 = 6 (Sedang). Penurunan efektivitas kontrol = (20 - 6) / 20 = 70%!'
      },
      {
        text: 'Dari Skor 9 turun menjadi Skor 5',
        isCorrect: false,
        explanation: 'Perhitungan salah. Skala ISO 31000 menggunakan perkalian Likelihood x Impact (4x5=20, 2x3=6).'
      },
      {
        text: 'Dari Skor 15 turun menjadi Skor 8',
        isCorrect: false,
        explanation: 'Perhitungan salah.'
      }
    ]
  },
  {
    id: 'q6',
    scenario: 'Tim manajemen risiko menetapkan Key Risk Indicator (KRI) untuk memantau "Turnover Karyawan Kunci IT". Batas aman < 5%, batas waspada 5% - 10%, batas bahaya > 10%.',
    question: 'Jika pada bulan ini turnover karyawan IT mencapai 12%, apa status warna KRI dan tindakan yang harus diambil?',
    options: [
      {
        text: 'Status Merah (RED) - Memerlukan eskalasi segera ke Direksi dan rencana mitigasi darurat',
        isCorrect: true,
        explanation: 'Tepat! Angka 12% melewati ambang batas bahaya (> 10%), sehingga KRI menyala Merah dan memicu eskalasi mitigasi darurat.'
      },
      {
        text: 'Status Kuning (AMBER) - Cukup dimonitor berkala tanpa eskalasi',
        isCorrect: false,
        explanation: 'Kuning hanya berlaku jika angka turnover berada di antara 5% dan 10%.'
      },
      {
        text: 'Status Hijau (GREEN) - Masih dalam batas toleransi normal',
        isCorrect: false,
        explanation: 'Kondisi 12% sudah melampaui batas aman < 5%.'
      }
    ]
  },
  {
    id: 'q7',
    scenario: 'Sesuai Taksonomi Basel II, seorang pegawai bagian treasury memalsukan dokumen transaksi obligasi fiktif demi mengejar target bonus pribadi.',
    question: 'Termasuk dalam kategori risiko operasional Basel II manakah insiden tersebut?',
    options: [
      {
        text: 'Internal Fraud (Kecurangan Internal)',
        isCorrect: true,
        explanation: 'Benar! Tindakan manipulasi yang disengaja oleh pegawai internal demi keuntungan pribadi digolongkan sebagai Internal Fraud.'
      },
      {
        text: 'Execution, Delivery & Process Management',
        isCorrect: false,
        explanation: 'Kategori ini ditujukan untuk kekeliruan pemrosesan yang tidak disengaja (unintentional process error).'
      },
      {
        text: 'Business Disruption & System Failures',
        isCorrect: false,
        explanation: 'Kategori ini menyangkut kegagalan sistem IT atau utilitas, bukan fraud pegawai.'
      }
    ]
  },
  {
    id: 'q8',
    scenario: 'Sebuah organisasi meluncurkan produk fintech pinjaman online baru. Namun pimpinan memutuskan untuk membatalkan rencana ekspansi ke luar negeri karena ketidakpastian regulasi hukum setempat yang sangat tinggi.',
    question: 'Strategi 4T perlakuan risiko apakah yang diambil pimpinan tersebut?',
    options: [
      {
        text: 'Terminate (Menghindari Risiko dengan Membatalkan Rencana)',
        isCorrect: true,
        explanation: 'Tepat! Terminate berarti tidak memasuki atau menghentikan aktivitas yang menimbulkan risiko yang tidak dapat ditolerir.'
      },
      {
        text: 'Treat (Mengurangi Risiko)',
        isCorrect: false,
        explanation: 'Treat berarti tetap melakukan aktivitas tersebut namun memasang kontrol tambahan.'
      },
      {
        text: 'Tolerate (Menerima Risiko)',
        isCorrect: false,
        explanation: 'Tolerate berarti tetap mengekspansi tanpa tindakan pencegahan.'
      }
    ]
  },
  {
    id: 'q9',
    scenario: 'Apakah perbedaan mendasar antara Key Performance Indicator (KPI) dengan Key Risk Indicator (KRI)?',
    question: 'Pernyataan manakah yang paling akurat membedakan KPI dan KRI?',
    options: [
      {
        text: 'KPI mengukur pencapaian target masa lalu/sekarang, sedangkan KRI memberikan sinyal peringatan dini atas potensi kegagalan pencapaian target di masa depan.',
        isCorrect: true,
        explanation: 'Tepat sekali! KPI berorientasi pada hasil (performance outcome), sedangkan KRI adalah sensor peringatan dini (early warning system).'
      },
      {
        text: 'KPI hanya untuk divisi keuangan, sedangkan KRI hanya untuk divisi hukum.',
        isCorrect: false,
        explanation: 'Salah, KPI dan KRI berlaku untuk seluruh divisi operasional dalam organisasi.'
      },
      {
        text: 'KPI tidak memiliki target angka, sedangkan KRI selalu memiliki angka.',
        isCorrect: false,
        explanation: 'Keduanya menggunakan metrik numerik kuantitatif.'
      }
    ]
  },
  {
    id: 'q10',
    scenario: 'Dalam ISO 31000:2018, prinsip "Faktor Manusia dan Budaya" menekankan bahwa secanggih apapun sistem IT manajemen risiko yang dibeli...',
    question: 'Faktor kunci keberhasilan implementasi manajemen risiko adalah...',
    options: [
      {
        text: 'Budaya keterbukaan (Risk-Aware Culture) dan kepemimpinan yang memberi teladan (Tone at the Top)',
        isCorrect: true,
        explanation: 'Benar! Manajemen risiko gagal jika staf takut melapor atau pimpinan mengabaikan peringatan risiko (Tone at the Top).'
      },
      {
        text: 'Menghukum setiap staf yang menemukan risiko operasional',
        isCorrect: false,
        explanation: 'Ini bertentangan dengan prinsip ISO 31000 dan menciptakan budaya penyembunyian masalah.'
      },
      {
        text: 'Membeli lisensi software paling mahal tanpa pelatihan staf',
        isCorrect: false,
        explanation: 'Software hanyalah alat bantu, budaya manusialah yang menjadi penentu utama efektivitas mitigasi risiko.'
      }
    ]
  }
];
