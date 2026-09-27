<?php
// Mulai session untuk cek login status di server side
if (session_status() === PHP_SESSION_NONE) session_start();
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Portfolio — M.Fathirman</title>
    <meta name="description" content="Full Stack Developer & UI/UX Designer dari Mataram, NTB">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💻</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/admin.css">
</head>
<body>

<!-- LOADER -->
<div id="loader">
    <div class="loader-logo">MF.</div>
    <div class="loader-bar"><div class="loader-fill"></div></div>
</div>

<!-- CURSOR -->
<div class="cursor-dot"></div>
<div class="cursor-ring"></div>

<!-- PARTICLES -->
<canvas id="particle-canvas"></canvas>

<!-- INPUT FOTO TERSEMBUNYI -->
<input type="file" id="foto-input" accept="image/*" style="display:none">

<!-- ====================================================
     ADMIN NAV BAR (muncul saat login)
===================================================== -->
<div id="admin-nav-bar" class="admin-nav-bar">
    <span class="admin-label">⚙️ Mode Admin</span>
    <div id="admin-user-chip" class="admin-user-chip"></div>
    <div class="admin-nav-actions">
        <button class="admin-nav-btn primary" id="btn-add-skill">
            ✨ <span class="label-text">Skill</span>
        </button>
        <button class="admin-nav-btn primary" id="btn-add-proyek">
            🚀 <span class="label-text">Proyek</span>
        </button>
        <button class="admin-nav-btn primary" id="btn-add-kegiatan">
            📅 <span class="label-text">Kegiatan</span>
        </button>
        <button class="admin-nav-btn primary" id="btn-add-pengalaman">
            💼 <span class="label-text">Pengalaman</span>
        </button>
        <button class="admin-nav-btn danger" id="btn-logout">
            🔓 <span class="label-text">Logout</span>
        </button>
    </div>
</div>

<!-- ====================================================
     NAV
===================================================== -->
<nav class="nav">
    <a href="#hero" class="nav-logo">AR.</a>
    <ul class="nav-links">
        <li><a href="#about">Tentang</a></li>
        <li><a href="#skills">Keahlian</a></li>
        <li><a href="#projects">Proyek</a></li>
        <li><a href="#experience">Pengalaman</a></li>
        <li><a href="#kegiatan">Kegiatan</a></li>
        <li><a href="#contact">Kontak</a></li>
    </ul>
    <div style="display:flex;align-items:center;gap:.7rem">
        <button id="btn-login" class="btn btn-outline" style="padding:.45rem 1rem;border-radius:8px;font-size:.82rem">
            🔐 Login Admin
        </button>
        <button class="nav-burger" aria-label="Menu">
            <span></span><span></span><span></span>
        </button>
    </div>
</nav>

<!-- ====================================================
     HERO
===================================================== -->
<section id="hero" class="hero">
    <div class="hero-bg-glow g1"></div>
    <div class="hero-bg-glow g2"></div>
    <div class="hero-inner">
        <div class="hero-text">
            <div class="hero-eyebrow">
                <span></span> Tersedia untuk proyek baru
            </div>
            <h1 class="hero-name">
                Halo, Saya<br>
                <span class="highlight" id="hero-name-text">M.Fathirman</span>
            </h1>
            <p class="hero-role"><span id="typing-text"></span><span style="color:var(--accent);animation:blink 1s infinite">|</span></p>
            <p class="hero-desc" id="hero-bio">
                Membangun pengalaman web yang indah, cepat, dan bermakna — dari desain hingga deployment.
            </p>
            <div class="hero-actions">
                <a href="#projects" class="btn btn-primary">🚀 Lihat Proyek</a>
                <a href="#contact" class="btn btn-outline">💬 Hubungi Saya</a>
            </div>
            <div class="hero-stats">
                <div class="hero-stat">
                    <strong data-target="4" data-suffix="+">0+</strong>
                    <span>Tahun Pengalaman</span>
                </div>
                <div class="hero-stat">
                    <strong data-target="30" data-suffix="+">0+</strong>
                    <span>Proyek Selesai</span>
                </div>
                <div class="hero-stat">
                    <strong data-target="20" data-suffix="+">0+</strong>
                    <span>Klien Puas</span>
                </div>
            </div>
        </div>
        <div class="hero-avatar-wrap">
            <div class="hero-avatar-ring">
                <!-- Avatar + overlay upload foto (hanya tampil saat admin hover) -->
                <div class="hero-avatar" style="position:relative;overflow:hidden;cursor:pointer" onclick="if(document.body.classList.contains('admin-mode')) document.getElementById('foto-input').click()">
                    <span id="avatar-emoji">👨‍💻</span>
                    <div class="foto-upload-overlay">
                        <span style="font-size:1.5rem">📷</span>
                        <span>Ganti Foto</span>
                    </div>
                </div>
            </div>
            <div class="floating-badge b1">⚡ Network Expert</div>
            <div class="floating-badge b2">🎨 UI/UX Design</div>
        </div>
    </div>
</section>
<div class="section-divider"></div>

<!-- ====================================================
     ABOUT
===================================================== -->
<section id="about" class="about">
    <div class="section-wrap">
        <div class="section-header reveal">
            <span class="section-tag">Tentang Saya</span>
            <h2 class="section-title">Siapa <em>Saya</em> Sebenarnya?</h2>
            <p class="section-desc">Developer yang gemar mengubah ide kompleks menjadi produk digital yang elegan</p>
        </div>
        <div class="about-grid">
            <div class="about-img-wrap reveal">
                <div class="about-img"><span id="about-emoji">👨‍💻</span></div>
                <div class="about-img-badge">
                    <strong>4+</strong><span>Tahun<br>Pengalaman</span>
                </div>
            </div>
            <div class="about-content reveal">
                <p class="about-text" id="about-bio">Saya seorang developer dengan passion di web development dan desain antarmuka.</p>
                <div class="about-info-grid">
                    <div class="about-info-item">
                        <span class="label">📧 Email</span>
                        <span class="value" id="info-email">-</span>
                    </div>
                    <div class="about-info-item">
                        <span class="label">📱 Telepon</span>
                        <span class="value" id="info-phone">-</span>
                    </div>
                    <div class="about-info-item">
                        <span class="label">📍 Lokasi</span>
                        <span class="value" id="info-lokasi">-</span>
                    </div>
                    <div class="about-info-item">
                        <span class="label">✅ Status</span>
                        <span class="value" style="color:#10b981">Tersedia</span>
                    </div>
                </div>
                <div style="display:flex;gap:.75rem;flex-wrap:wrap">
                    <a href="#" class="btn btn-primary link-github">🐙 GitHub</a>
                    <a href="#" class="btn btn-outline link-linkedin">💼 LinkedIn</a>
                </div>
            </div>
        </div>
    </div>
</section>
<div class="section-divider"></div>

<!-- ====================================================
     SKILLS
===================================================== -->
<section id="skills">
    <div class="section-wrap">
        <div class="section-header reveal">
            <span class="section-tag">Keahlian</span>
            <h2 class="section-title">Stack &amp; <em>Teknologi</em></h2>
            <p class="section-desc">Teknologi yang saya kuasai dan gunakan sehari-hari</p>
        </div>
        <div class="skills-filter">
            <button class="filter-btn active" data-cat="all">Semua</button>
            <button class="filter-btn" data-cat="frontend">Frontend</button>
            <button class="filter-btn" data-cat="backend">Backend</button>
            <button class="filter-btn" data-cat="database">Database</button>
            <button class="filter-btn" data-cat="tools">Tools</button>
        </div>
        <div class="skills-grid" id="skills-grid">
            <div style="text-align:center;color:var(--muted);padding:2rem;grid-column:1/-1">⏳ Memuat data keahlian...</div>
        </div>
    </div>
</section>
<div class="section-divider"></div>

<!-- ====================================================
     PROJECTS
===================================================== -->
<section id="projects" class="projects">
    <div class="section-wrap">
        <div class="section-header reveal">
            <span class="section-tag">Portofolio</span>
            <h2 class="section-title">Proyek <em>Pilihan</em></h2>
            <p class="section-desc">Koleksi proyek yang pernah saya kerjakan</p>
        </div>
        <div class="projects-grid" id="projects-grid">
            <div style="text-align:center;color:var(--muted);padding:2rem;grid-column:1/-1">⏳ Memuat proyek...</div>
        </div>
    </div>
</section>
<div class="section-divider"></div>

<!-- ====================================================
     PENGALAMAN
===================================================== -->
<section id="experience">
    <div class="section-wrap">
        <div class="section-header reveal">
            <span class="section-tag">Perjalanan</span>
            <h2 class="section-title">Karir &amp; <em>Pendidikan</em></h2>
            <p class="section-desc">Rekam jejak profesional dan akademik</p>
        </div>
        <div class="timeline" id="timeline">
            <div style="text-align:center;color:var(--muted);padding:2rem">⏳ Memuat pengalaman...</div>
        </div>
    </div>
</section>
<div class="section-divider"></div>

<!-- ====================================================
     KEGIATAN
===================================================== -->
<section id="kegiatan" class="projects">
    <div class="section-wrap">
        <div class="section-header reveal">
            <span class="section-tag">Aktivitas</span>
            <h2 class="section-title">Kegiatan &amp; <em>Pencapaian</em></h2>
            <p class="section-desc">Workshop, sertifikasi, kompetisi, dan kegiatan lainnya</p>
        </div>
        <div class="kegiatan-grid" id="kegiatan-grid">
            <div style="text-align:center;color:var(--muted);padding:2rem;grid-column:1/-1">⏳ Memuat kegiatan...</div>
        </div>
    </div>
</section>
<div class="section-divider"></div>

<!-- ====================================================
     CONTACT
===================================================== -->
<section id="contact" class="contact">
    <div class="section-wrap">
        <div class="section-header reveal">
            <span class="section-tag">Kontak</span>
            <h2 class="section-title">Mari <em>Berkolaborasi</em></h2>
            <p class="section-desc">Punya proyek menarik? Saya selalu terbuka untuk diskusi</p>
        </div>
        <div class="contact-grid">
            <div class="reveal">
                <h3 class="contact-info-title">Hubungi Saya</h3>
                <p class="contact-info-desc">Saya terbuka untuk proyek freelance, kolaborasi, maupun posisi full-time.</p>
                <div class="contact-item"><div class="contact-icon">📧</div><div><span class="contact-item-label">Email</span><span class="contact-item-val" id="info-email-2">-</span></div></div>
                <div class="contact-item"><div class="contact-icon">📱</div><div><span class="contact-item-label">WhatsApp</span><span class="contact-item-val" id="info-phone-2">-</span></div></div>
                <div class="contact-item"><div class="contact-icon">📍</div><div><span class="contact-item-label">Lokasi</span><span class="contact-item-val" id="info-lokasi-2">-</span></div></div>
            </div>
            <div class="reveal">
                <form id="contact-form" class="contact-form" novalidate>
                    <div id="form-status" class="form-status"></div>
                    <div class="form-row">
                        <div class="form-group"><label>Nama Lengkap *</label><input type="text" name="nama" placeholder="John Doe" required></div>
                        <div class="form-group"><label>Email *</label><input type="email" name="email" placeholder="john@email.com" required></div>
                    </div>
                    <div class="form-group"><label>Subjek</label><input type="text" name="subjek" placeholder="Diskusi Proyek..."></div>
                    <div class="form-group"><label>Pesan *</label><textarea name="pesan" placeholder="Halo, saya ingin mendiskusikan..." required></textarea></div>
                    <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;border-radius:var(--r-sm)">🚀 Kirim Pesan</button>
                </form>
            </div>
        </div>
    </div>
</section>

<!-- ====================================================
     FOOTER
===================================================== -->
<footer>
    <div class="footer-socials">
        <a href="#" class="footer-social link-github" title="GitHub">🐙</a>
        <a href="#" class="footer-social link-linkedin" title="LinkedIn">💼</a>
        <a href="#" class="footer-social" title="Twitter">🐦</a>
        <a href="#" class="footer-social" title="Instagram">📸</a>
    </div>
    <p>© <?= date('Y') ?> <strong id="footer-name">M.fathirman</strong> — PHP + MySQL (Laragon)</p>
</footer>

<!-- ====================================================
     AUTH OVERLAY (Login + Register)
===================================================== -->
<div id="auth-overlay" class="auth-overlay">
    <div class="auth-box">
        <button id="auth-close" class="auth-close" title="Tutup">✕</button>
        <div class="auth-logo">MF.</div>
        <p class="auth-subtitle">Panel Admin Portofolio</p>
        <div class="auth-tabs">
            <button class="auth-tab active" data-tab="login">🔐 Masuk</button>
            <button class="auth-tab" data-tab="register">📝 Daftar</button>
        </div>

        <!-- LOGIN PANEL -->
        <div id="login-panel" class="auth-panel active">
            <form id="login-form" novalidate>
                <div class="auth-input-group">
                    <label>Username / Email</label>
                    <div class="auth-input-wrap">
                        <span class="input-icon">👤</span>
                        <input type="text" id="login-username" placeholder="admin atau email@kamu.com" autocomplete="username">
                    </div>
                </div>
                <div class="auth-input-group">
                    <label>Password</label>
                    <div class="auth-input-wrap">
                        <span class="input-icon">🔒</span>
                        <input type="password" id="login-password" placeholder="Masukkan password" autocomplete="current-password">
                        <button type="button" class="auth-toggle-pw">👁️</button>
                    </div>
                </div>
                <div id="login-status" class="auth-status"></div>
                <button type="submit" class="auth-btn">Masuk ke Panel Admin</button>
            </form>
            <p style="text-align:center;margin-top:1rem;font-size:.8rem;color:var(--muted)">
                Default: <code style="color:var(--accent)">admin</code> / <code style="color:var(--accent)">password</code>
            </p>
        </div>

        <!-- REGISTER PANEL -->
        <div id="register-panel" class="auth-panel">
            <form id="register-form" novalidate>
                <div class="auth-input-group">
                    <label>Nama Lengkap</label>
                    <div class="auth-input-wrap">
                        <span class="input-icon">✍️</span>
                        <input type="text" id="reg-nama" placeholder="Nama Lengkap Anda">
                    </div>
                </div>
                <div class="auth-input-group">
                    <label>Username</label>
                    <div class="auth-input-wrap">
                        <span class="input-icon">👤</span>
                        <input type="text" id="reg-username" placeholder="username_unik">
                    </div>
                </div>
                <div class="auth-input-group">
                    <label>Email</label>
                    <div class="auth-input-wrap">
                        <span class="input-icon">📧</span>
                        <input type="email" id="reg-email" placeholder="email@kamu.com">
                    </div>
                </div>
                <div class="auth-input-group">
                    <label>Password</label>
                    <div class="auth-input-wrap">
                        <span class="input-icon">🔒</span>
                        <input type="password" id="reg-password" placeholder="Min. 6 karakter">
                        <button type="button" class="auth-toggle-pw">👁️</button>
                    </div>
                </div>
                <div class="auth-input-group">
                    <label>Konfirmasi Password</label>
                    <div class="auth-input-wrap">
                        <span class="input-icon">🔒</span>
                        <input type="password" id="reg-password2" placeholder="Ulangi password">
                        <button type="button" class="auth-toggle-pw">👁️</button>
                    </div>
                </div>
                <div id="register-status" class="auth-status"></div>
                <button type="submit" class="auth-btn">Buat Akun Admin</button>
            </form>
        </div>
    </div>
</div>

<!-- ====================================================
     MODAL — SKILL
===================================================== -->
<div id="modal-skill" class="modal-overlay">
    <div class="modal-box">
        <div class="modal-header">
            <h2 class="modal-title" id="modal-skill-title">➕ Tambah Skill</h2>
            <button class="modal-close">✕</button>
        </div>
        <div id="modal-skill-status" class="modal-status"></div>
        <form id="skill-form" class="modal-form" novalidate>
            <div class="form-group">
                <label>Nama Skill *</label>
                <input type="text" id="skill-nama" placeholder="cth: React.js, Laravel, MySQL...">
            </div>
            <div class="row2">
                <div class="form-group">
                    <label>Kategori</label>
                    <select id="skill-kategori">
                        <option value="frontend">Frontend</option>
                        <option value="backend">Backend</option>
                        <option value="database">Database</option>
                        <option value="tools">Tools</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Warna</label>
                    <input type="color" id="skill-warna" value="#6366f1">
                    <div class="color-swatches"></div>
                </div>
            </div>
            <div class="form-group">
                <label>Level Keahlian: <span id="skill-level-val" class="range-val">80%</span></label>
                <input type="range" id="skill-level" min="0" max="100" value="80"
                    oninput="document.getElementById('skill-level-val').textContent=this.value+'%'">
            </div>
            <div class="modal-actions">
                <button type="button" class="modal-btn cancel modal-cancel">Batal</button>
                <button type="submit" class="modal-btn save">💾 Simpan Skill</button>
            </div>
        </form>
    </div>
</div>

<!-- ====================================================
     MODAL — PROYEK
===================================================== -->
<div id="modal-proyek" class="modal-overlay">
    <div class="modal-box wide">
        <div class="modal-header">
            <h2 class="modal-title" id="modal-proyek-title">➕ Tambah Proyek</h2>
            <button class="modal-close">✕</button>
        </div>
        <div id="modal-proyek-status" class="modal-status"></div>
        <form id="proyek-form" class="modal-form" novalidate>
            <div class="form-group">
                <label>Judul Proyek *</label>
                <input type="text" id="p-judul" placeholder="Nama proyek Anda">
            </div>
            <div class="form-group">
                <label>Deskripsi</label>
                <textarea id="p-deskripsi" placeholder="Jelaskan proyek ini secara singkat..."></textarea>
            </div>
            <div class="form-group">
                <label>Teknologi (pisahkan dengan koma)</label>
                <input type="text" id="p-teknologi" placeholder="PHP, Laravel, MySQL, Vue.js">
            </div>
            <div class="row2">
                <div class="form-group">
                    <label>Link Demo</label>
                    <input type="url" id="p-demo" placeholder="https://demo.com">
                </div>
                <div class="form-group">
                    <label>Link GitHub</label>
                    <input type="url" id="p-github" placeholder="https://github.com/...">
                </div>
            </div>
            <div class="row2">
                <div class="form-group">
                    <label>Kategori</label>
                    <select id="p-kategori">
                        <option>Web App</option><option>SaaS</option>
                        <option>UI/UX</option><option>Backend</option>
                        <option>AI/ML</option><option>Mobile</option>
                    </select>
                </div>
                <div class="form-group" style="display:flex;align-items:center;gap:.5rem;padding-top:1.5rem">
                    <input type="checkbox" id="p-featured" style="width:auto;accent-color:var(--accent)">
                    <label for="p-featured" style="margin:0;cursor:pointer">⭐ Featured (tampilkan utama)</label>
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" class="modal-btn cancel modal-cancel">Batal</button>
                <button type="submit" class="modal-btn save">💾 Simpan Proyek</button>
            </div>
        </form>
    </div>
</div>

<!-- ====================================================
     MODAL — KEGIATAN
===================================================== -->
<div id="modal-kegiatan" class="modal-overlay">
    <div class="modal-box">
        <div class="modal-header">
            <h2 class="modal-title" id="modal-kegiatan-title">➕ Tambah Kegiatan</h2>
            <button class="modal-close">✕</button>
        </div>
        <div id="modal-kegiatan-status" class="modal-status"></div>
        <form id="kegiatan-form" class="modal-form" novalidate>
            <div class="form-group">
                <label>Judul Kegiatan *</label>
                <input type="text" id="k-judul" placeholder="cth: Workshop Laravel, Hackathon Nasional...">
            </div>
            <div class="form-group">
                <label>Deskripsi</label>
                <textarea id="k-deskripsi" placeholder="Ceritakan tentang kegiatan ini..."></textarea>
            </div>
            <div class="row2">
                <div class="form-group">
                    <label>Kategori</label>
                    <input type="text" id="k-kategori" placeholder="Workshop / Kompetisi / Sertifikasi..." list="kat-list">
                    <datalist id="kat-list">
                        <option value="Workshop"><option value="Kompetisi">
                        <option value="Sertifikasi"><option value="Mentoring">
                        <option value="Konferensi"><option value="Volunteer">
                        <option value="Umum">
                    </datalist>
                </div>
                <div class="form-group">
                    <label>Tanggal</label>
                    <input type="date" id="k-tanggal">
                </div>
            </div>
            <div class="form-group">
                <label>Lokasi</label>
                <input type="text" id="k-lokasi" placeholder="Jakarta / Online / Mataram, NTB">
            </div>
            <div class="modal-actions">
                <button type="button" class="modal-btn cancel modal-cancel">Batal</button>
                <button type="submit" class="modal-btn save">💾 Simpan Kegiatan</button>
            </div>
        </form>
    </div>
</div>

<!-- ====================================================
     MODAL — PENGALAMAN
===================================================== -->
<div id="modal-pengalaman" class="modal-overlay">
    <div class="modal-box">
        <div class="modal-header">
            <h2 class="modal-title" id="modal-pengalaman-title">➕ Tambah Pengalaman</h2>
            <button class="modal-close">✕</button>
        </div>
        <div id="modal-pengalaman-status" class="modal-status"></div>
        <form id="pengalaman-form" class="modal-form" novalidate>
            <div class="form-group">
                <label>Posisi / Jabatan *</label>
                <input type="text" id="pe-posisi" placeholder="Full Stack Developer, UI/UX Designer...">
            </div>
            <div class="form-group">
                <label>Perusahaan / Institusi *</label>
                <input type="text" id="pe-perusahaan" placeholder="PT. Contoh Teknologi / Universitas...">
            </div>
            <div class="row2">
                <div class="form-group">
                    <label>Mulai</label>
                    <input type="text" id="pe-mulai" placeholder="2022">
                </div>
                <div class="form-group">
                    <label>Selesai</label>
                    <input type="text" id="pe-selesai" placeholder="Sekarang">
                </div>
            </div>
            <div class="form-group">
                <label>Tipe</label>
                <select id="pe-tipe">
                    <option value="kerja">💼 Karir / Pekerjaan</option>
                    <option value="pendidikan">🎓 Pendidikan</option>
                </select>
            </div>
            <div class="form-group">
                <label>Deskripsi</label>
                <textarea id="pe-deskripsi" placeholder="Ceritakan pengalaman dan pencapaian Anda..."></textarea>
            </div>
            <div class="modal-actions">
                <button type="button" class="modal-btn cancel modal-cancel">Batal</button>
                <button type="submit" class="modal-btn save">💾 Simpan Pengalaman</button>
            </div>
        </form>
    </div>
</div>

<!-- Scripts -->
<script src="js/main.js"></script>
<script src="js/admin.js"></script>
</body>
</html>
