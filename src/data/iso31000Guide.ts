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

export const ISO_PRINCIPLES: IsoPrinciple[] = [
  {
    number: '01',
    title: 'Terintegrasi (Integrated)',
    subtitle: 'Menyatu dalam seluruh aktivitas organisasi',
    description: 'Manajemen risiko bukan lampiran atau tugas tambahan, melainkan bagian tak terpisahkan dari seluruh tata kelola dan pengambilan keputusan strategis.',
    practicalExample: 'Setiap pengadaan server baru atau peluncuran fitur app harus menyertakan lembar RCSA sebelum disetujui direksi.'
  },
  {
    number: '02',
    title: 'Terstruktur & Komprehensif',
    subtitle: 'Konsisten dan dapat diperbandingkan',
    description: 'Pendekatan terstruktur memastikan hasil evaluasi risiko antar divisi (misal: IT vs Keuangan) dapat dibandingkan secara setara (apel-ke-apel).',
    practicalExample: 'Seluruh divisi menggunakan matriks dampak & kemungkinan 5x5 yang sama sehingga skala risiko ekstrem memiliki arti seragam.'
  },
  {
    number: '03',
    title: 'Disesuaikan (Customized)',
    subtitle: 'Sesuai konteks internal dan eksternal',
    description: 'Kerangka manajemen risiko diselaraskan dengan profil industri, batas toleransi risiko (Risk Appetite), dan kapasitas sumber daya organisasi.',
    practicalExample: 'Risk appetite startup fintech untuk eksperimen fitur lebih tinggi dibanding kepatuhan regulasi data nasabah yang bertoleransi nol (zero tolerance).'
  },
  {
    number: '04',
    title: 'Inklusif (Inclusive)',
    subtitle: 'Melibatkan seluruh pemangku kepentingan',
    description: 'Keterlibatan aktif staf operasional hingga komite audit memastikan seluruh sudut pandang risiko teridentifikasi secara akurat.',
    practicalExample: 'Workshop RCSA diadakan bersama staf lapangan / customer support yang paling tahu keluhan nyata konsumen.'
  },
  {
    number: '05',
    title: 'Dinamis (Dynamic)',
    subtitle: 'Responsif terhadap perubahan',
    description: 'Risiko dapat muncul, berubah, atau hilang saat konteks internal maupun eksternal berubah. Manajemen risiko harus lincah mengantisipasinya.',
    practicalExample: 'Ketika regulator menerbitkan aturan UU PDP baru, register risiko privasi data langsung diperbarui dalam tempo 14 hari.'
  },
  {
    number: '06',
    title: 'Informasi Terbaik (Best Available Information)',
    subtitle: 'Berdasarkan data historis dan ekspektasi masa depan',
    description: 'Masukan manajemen risiko didasarkan pada data historis, tren masa depan, serta batasan ketidakpastian yang transparan.',
    practicalExample: 'Menghitung kemungkinan server down berdasarkan log uptime tahun lalu digabung dengan proyeksi lonjakan traffic flash sale.'
  },
  {
    number: '07',
    title: 'Faktor Manusia & Budaya',
    subtitle: 'Pengaruh perilaku dan komunikasi',
    description: 'Perilaku manusia dan budaya perusahaan sangat memengaruhi keberhasilan manajemen risiko di setiap level organisasi.',
    practicalExample: 'Membangun "No-Blame Culture" agar staf berani segera melaporkan insiden salah transfer tanpa takut dihukum sepihak.'
  },
  {
    number: '08',
    title: 'Perbaikan Berkelanjutan (Continual Improvement)',
    subtitle: 'Pembelajaran dan peningkatan tiada henti',
    description: 'Kerangka kerja manajemen risiko senantiasa dievaluasi efektivitasnya melalui audit dan pembelajaran pasca-insiden (post-mortem).',
    practicalExample: 'Setiap selesai insiden major, tim wajib menyusun Post-Incident Review (PIR) untuk memperkuat kontrol preventif.'
  }
];

export const THREE_LINES_MODEL = [
  {
    line: 'Lini Pertama (1st Line)',
    owner: 'Manajemen Operasional & Pemilik Proses Bisnis',
    role: 'Pemilik Risiko & Pelaksana Kontrol',
    duty: 'Mengidentifikasi risiko harian, merancang dan menjalankan kontrol internal langsung, serta mengisi lembar RCSA berkala.',
    color: '#3b82f6'
  },
  {
    line: 'Lini Kedua (2nd Line)',
    owner: 'Divisi Manajemen Risiko & Kepatuhan (Compliance)',
    role: 'Fasilitator, Pengawas & Standarisasi',
    duty: 'Menyediakan framework, memonitor kepatuhan kebijakan, memvalidasi penilaian RCSA lini pertama, dan melaporkan ke Komite Risiko.',
    color: '#f59e0b'
  },
  {
    line: 'Lini Ketiga (3rd Line)',
    owner: 'Internal Audit (SKAI)',
    role: 'Asurans Independen & Objektif',
    duty: 'Memberikan kepastian independen kepada Dewan Komisaris dan Direksi mengenai efektivitas tata kelola dan kontrol internal 1st & 2nd line.',
    color: '#10b981'
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
    scenario: 'Perusahaan Anda menerapkan sistem Maker-Checker di mana setiap transfer dana di atas Rp 20 Juta harus diverifikasi oleh supervisor sebelum uang terkirim.',
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
        explanation: 'Detektif mendeteksi setelah kejadian (misal: rekonsiliasi akhir hari), bukan mencegah sebelum uang keluar.'
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
        text: 'Terminate (Menghindari Risiko)',
        isCorrect: false,
        explanation: 'Terminate berarti menutup pusat data dan menghentikan seluruh operasi di lokasi tersebut.'
      }
    ]
  }
];
