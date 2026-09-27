# 🚀 Portfolio Pribadi — Panduan Setup Laragon

## Struktur File
```
portfolio/
├── index.php          ← Halaman utama (buka di browser)
├── database_FINAL.sql ← Script database MySQL
├── css/
│   └── style.css      ← Semua styling + animasi
├── js/
│   └── main.js        ← Logic + animasi + fetch API
├── php/
│   ├── config.php     ← Konfigurasi database PDO
│   └── api.php        ← REST API endpoint
└── assets/            ← Taruh foto/CV di sini
```

## ⚙️ Cara Setup di Laragon

### 1. Copy ke folder www
Salin folder `portfolio` ke:
```
C:\laragon\www\portfolio\
```

### 2. Buat Database
Buka **phpMyAdmin** di Laragon → buka tab **SQL** → paste isi `database_FINAL.sql` → klik **Go**

Atau via terminal Laragon:
```bash
mysql -u root < database_FINAL.sql
```

### 3. Sesuaikan Config (jika perlu)
Edit `php/config.php` jika password MySQL berbeda:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');           // ← isi jika ada password
define('DB_NAME', 'portfolio_db');
```

### 4. Buka di Browser
Akses: **http://localhost/portfolio**

---

## 🎨 Cara Kustomisasi

### Ubah Data Pribadi
Update tabel `profil` di database:
```sql
USE portfolio_db;
UPDATE profil SET
  nama = 'Nama Kamu',
  jabatan = 'Jabatan Kamu',
  email = 'email@kamu.com',
  lokasi = 'Kota, Provinsi'
WHERE id = 1;
```

### Tambah Skill Baru
```sql
INSERT INTO skills (nama, kategori, level, warna, urutan)
VALUES ('Python', 'backend', 75, '#3776ab', 13);
```

### Tambah Proyek
```sql
INSERT INTO proyek (judul, deskripsi, teknologi, link_demo, link_github, kategori, featured)
VALUES ('Proyek Baru', 'Deskripsi proyek', 'PHP, Laravel, MySQL', 'https://demo.com', 'https://github.com', 'Web App', 1);
```

---

## ✨ Fitur Animasi
- 🌌 Particle canvas background dengan garis koneksi
- ✍️ Typing effect pada hero (multi-role)
- 🔢 Counter animation untuk statistik
- 📊 Progress bar skill yang animasi saat terlihat
- 🔍 Scroll reveal pada semua section
- 🌀 Rotating gradient ring pada avatar
- 🎯 Custom cursor dengan lag effect
- 💫 Floating badge animation
- ⚡ Loading screen dengan progress bar
- 🎠 Glow pulse background effect

## 🗄️ API Endpoints
| Endpoint | Method | Keterangan |
|----------|--------|------------|
| `php/api.php?action=profil` | GET | Data profil |
| `php/api.php?action=skills` | GET | Semua skill |
| `php/api.php?action=proyek` | GET | Semua proyek |
| `php/api.php?action=pengalaman` | GET | Riwayat karir |
| `php/api.php?action=kontak` | POST | Kirim pesan |
