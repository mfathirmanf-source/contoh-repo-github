-- ============================================================
--  PORTFOLIO DATABASE — FINAL & BERSIH
--  ✅ MySQL 5.7 & 8.0 Compatible (Laragon)
--  ✅ Tidak ada ALTER TABLE IF NOT EXISTS
--  ✅ Semua tabel lengkap dalam satu file
--
--  Cara pakai:
--  1. Buka phpMyAdmin → http://localhost/phpmyadmin
--  2. Klik tab SQL
--  3. Hapus teks yang ada, paste semua isi file ini
--  4. Klik GO
--
--  Login setelah berhasil: admin / password
-- ============================================================
UPDATE profil SET nama = 'M.Fathirman' WHERE id = 1;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = '';

CREATE DATABASE IF NOT EXISTS portfolio_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ============================================================
--  HAPUS TABEL LAMA (aman untuk re-run berkali-kali)
-- ============================================================
DROP TABLE IF EXISTS pesan_kontak;
DROP TABLE IF EXISTS kegiatan;
DROP TABLE IF EXISTS pengalaman;
DROP TABLE IF EXISTS proyek;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS profil;
DROP TABLE IF EXISTS users;

-- ============================================================
--  BUAT SEMUA TABEL BARU
-- ============================================================

-- 1. Profil (sudah include kolom foto)
CREATE TABLE profil (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    nama        VARCHAR(100)  NOT NULL,
    jabatan     VARCHAR(150)  NOT NULL,
    bio         TEXT,
    email       VARCHAR(100),
    phone       VARCHAR(20),
    lokasi      VARCHAR(100),
    github      VARCHAR(200),
    linkedin    VARCHAR(200),
    foto        VARCHAR(500)  DEFAULT NULL,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Skills
CREATE TABLE skills (
    id        INT           AUTO_INCREMENT PRIMARY KEY,
    nama      VARCHAR(100)  NOT NULL,
    kategori  VARCHAR(50)   NOT NULL DEFAULT 'tools',
    level     INT           NOT NULL DEFAULT 80,
    ikon      VARCHAR(100),
    warna     VARCHAR(20)   DEFAULT '#6366f1',
    urutan    INT           DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Proyek
CREATE TABLE proyek (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    judul       VARCHAR(200)  NOT NULL,
    deskripsi   TEXT,
    teknologi   VARCHAR(300),
    link_demo   VARCHAR(300),
    link_github VARCHAR(300),
    gambar      VARCHAR(300),
    kategori    VARCHAR(100),
    featured    TINYINT(1)    DEFAULT 0,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Pengalaman
CREATE TABLE pengalaman (
    id              INT           AUTO_INCREMENT PRIMARY KEY,
    posisi          VARCHAR(200)  NOT NULL,
    perusahaan      VARCHAR(200)  NOT NULL,
    periode_mulai   VARCHAR(20),
    periode_selesai VARCHAR(20)   DEFAULT 'Sekarang',
    deskripsi       TEXT,
    tipe            VARCHAR(20)   DEFAULT 'kerja'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Pesan Kontak
CREATE TABLE pesan_kontak (
    id         INT           AUTO_INCREMENT PRIMARY KEY,
    nama       VARCHAR(100)  NOT NULL,
    email      VARCHAR(100)  NOT NULL,
    subjek     VARCHAR(200),
    pesan      TEXT          NOT NULL,
    dibaca     TINYINT(1)    DEFAULT 0,
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Users (login/register admin)
CREATE TABLE users (
    id           INT           AUTO_INCREMENT PRIMARY KEY,
    username     VARCHAR(80)   NOT NULL,
    email        VARCHAR(150)  NOT NULL,
    password     VARCHAR(255)  NOT NULL,
    nama_lengkap VARCHAR(150),
    role         VARCHAR(20)   DEFAULT 'admin',
    avatar       VARCHAR(300)  DEFAULT NULL,
    created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_username (username),
    UNIQUE KEY uk_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_users_username_email ON users (username, email);

-- 7. Kegiatan
CREATE TABLE kegiatan (
    id          INT           AUTO_INCREMENT PRIMARY KEY,
    judul       VARCHAR(200)  NOT NULL,
    deskripsi   TEXT,
    kategori    VARCHAR(100)  DEFAULT 'Umum',
    tanggal     DATE,
    lokasi      VARCHAR(200),
    gambar_path VARCHAR(500),
    status      VARCHAR(10)   DEFAULT 'aktif',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_kegiatan_status_tanggal ON kegiatan (status, tanggal);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  ISI DATA SAMPLE
-- ============================================================

INSERT INTO profil (nama, jabatan, bio, email, phone, lokasi, github, linkedin, foto) VALUES
(
    'M.Fathirman',
    'Full Stack Developer & UI/UX Designer',
    'Saya seorang developer dengan passion di web development dan desain antarmuka. Berpengalaman membangun aplikasi web modern yang berfokus pada performa dan pengalaman pengguna.',
    'fathir@email.com',
    '+62 812-3456-7890',
    'Mataram, NTB, Indonesia',
    'https://github.com/fathir',
    'https://linkedin.com/in/fathir',
    NULL
);

INSERT INTO skills (nama, kategori, level, warna, urutan) VALUES
('HTML5 & CSS3',    'frontend', 95, '#e34c26', 1),
('JavaScript ES6+', 'frontend', 90, '#f7df1e', 2),
('React.js',        'frontend', 85, '#61dafb', 3),
('Tailwind CSS',    'frontend', 88, '#06b6d4', 4),
('PHP 8',           'backend',  88, '#777bb4', 5),
('Laravel',         'backend',  82, '#ff2d20', 6),
('Node.js',         'backend',  75, '#339933', 7),
('MySQL',           'database', 85, '#4479a1', 8),
('PostgreSQL',      'database', 70, '#336791', 9),
('Git & GitHub',    'tools',    90, '#f05032', 10),
('Figma',           'tools',    80, '#f24e1e', 11),
('Docker',          'tools',    65, '#2496ed', 12);

INSERT INTO proyek (judul, deskripsi, teknologi, link_demo, link_github, kategori, featured) VALUES
('E-Commerce Platform',
 'Platform belanja online lengkap dengan fitur cart, payment gateway Midtrans, manajemen produk, dan dashboard admin real-time.',
 'PHP, Laravel, MySQL, Vue.js, Tailwind', '#', '#', 'Web App', 1),
('Sistem Manajemen Sekolah',
 'Aplikasi manajemen sekolah mencakup absensi digital, nilai siswa, laporan guru, dan komunikasi orang tua.',
 'PHP, MySQL, Bootstrap, jQuery', '#', '#', 'Web App', 1),
('Portfolio Generator',
 'Tool berbasis AI untuk generate portofolio profesional dari data LinkedIn dan GitHub secara otomatis.',
 'React.js, Node.js, OpenAI API', '#', '#', 'SaaS', 1),
('Mobile Banking UI',
 'Desain antarmuka aplikasi mobile banking modern dengan dark mode dan alur UX yang intuitif.',
 'Figma, Prototyping', '#', '#', 'UI/UX', 0),
('REST API Inventory',
 'RESTful API untuk sistem manajemen inventori gudang dengan autentikasi JWT dan dokumentasi Swagger.',
 'Node.js, Express, MongoDB', '#', '#', 'Backend', 0),
('Chatbot Customer Service',
 'Chatbot untuk layanan pelanggan terintegrasi WhatsApp Business API dengan dashboard analitik.',
 'Python, FastAPI, MySQL', '#', '#', 'AI/ML', 0);

INSERT INTO pengalaman (posisi, perusahaan, periode_mulai, periode_selesai, deskripsi, tipe) VALUES
('Full Stack Developer',  'PT. Teknologi Nusantara', '2022', 'Sekarang',
 'Memimpin pengembangan 3 produk SaaS, meningkatkan performa 40%, dan mentoring 5 developer junior.', 'kerja'),
('Frontend Developer',    'CV. Digital Kreatif',     '2020', '2022',
 'Membangun antarmuka responsif untuk klien e-commerce dan meningkatkan kecepatan loading 60%.', 'kerja'),
('Web Developer Intern',  'Startup Inovatif ID',     '2019', '2020',
 'Mengembangkan fitur pada platform edukasi online menggunakan Laravel dan Vue.js dalam tim agile.', 'kerja'),
('S1 Teknik Informatika', 'Universitas Mataram',     '2016', '2020',
 'Lulus IPK 3.78, aktif UKM Programming Club, juara 1 Hackathon Nasional 2019.', 'pendidikan');

-- ============================================================
--  USERS — password default: "password"
-- ============================================================
INSERT INTO users (username, email, password, nama_lengkap, role, avatar) VALUES
(
    'FathirNetwork',
    'fathir@email.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'M.Fathirman',
    'FathirNetwork',
    NULL
);

-- ============================================================
--  KEGIATAN SAMPLE
-- ============================================================
INSERT INTO kegiatan (judul, deskripsi, kategori, tanggal, lokasi, status) VALUES
('Workshop Laravel & Vue.js',
 'Workshop intensif pengembangan web modern dengan Laravel 10 dan Vue 3 selama 2 hari penuh.',
 'Workshop', '2024-03-15', 'Mataram, NTB', 'aktif'),
('Hackathon Nasional 2024',
 'Berpartisipasi sebagai team leader. Tim berhasil masuk final 10 besar nasional.',
 'Kompetisi', '2024-02-20', 'Jakarta', 'aktif'),
('Sertifikasi AWS Cloud Practitioner',
 'Berhasil meraih sertifikasi AWS setelah 3 bulan persiapan belajar mandiri.',
 'Sertifikasi', '2024-01-10', 'Online', 'aktif'),
('Mentoring Junior Developer',
 'Membimbing 5 junior developer selama 3 bulan, fokus pada PHP dan JavaScript.',
 'Mentoring', '2023-12-01', 'Remote', 'aktif');

-- ============================================================
--  SELESAI ✅
--  7 tabel berhasil dibuat
--  Login: username=admin | password=password
-- ============================================================
