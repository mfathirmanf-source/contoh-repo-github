// ============================================
//  PORTFOLIO ADMIN JS
//  Login, Register, CRUD, Upload Foto
// ============================================

const AUTH_API    = './php/auth.php';
const ADMIN_API   = './php/api.php';
let   currentUser = null;

// ============================================
//  TOAST
// ============================================
function showToast(msg, type = 'success') {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast'; t.className = 'toast';
        t.innerHTML = '<span class="toast-icon"></span><span class="toast-msg"></span>';
        document.body.appendChild(t);
    }
    t.querySelector('.toast-icon').textContent = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    t.querySelector('.toast-msg').textContent  = msg;
    t.className = `toast ${type} show`;
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => t.classList.remove('show'), 3500);
}

// ============================================
//  AUTH
// ============================================
async function checkLogin() {
    try {
        const r = await fetch(`${AUTH_API}?action=check`);
        const j = await r.json();
        if (j.status === 'ok' && j.data) {
            setLoggedIn(j.data);
        }
    } catch(e) {}
}

function applyLoggedUserToPage(user) {
    if (!user) return;

    const name = user.nama_lengkap || user.username || 'User';
    const email = user.email || '';

    const heroName = document.getElementById('hero-name-text');
    if (heroName) heroName.textContent = name;

    const footerName = document.getElementById('footer-name');
    if (footerName) footerName.textContent = name;

    const emailEls = document.querySelectorAll('#info-email, #info-email-2');
    emailEls.forEach(el => {
        if (el && email) el.textContent = email;
    });
}

function setLoggedIn(user) {
    currentUser = user;
    document.body.classList.add('admin-mode');
    const bar  = document.getElementById('admin-nav-bar');
    const chip = document.getElementById('admin-user-chip');
    const init = (user.nama_lengkap || user.username).charAt(0).toUpperCase();
    if (bar)  bar.classList.add('visible');
    if (chip) chip.innerHTML = `
        <div class="admin-avatar-sm">${init}</div>
        <span>Halo, <strong>${user.nama_lengkap || user.username}</strong></span>`;

    applyLoggedUserToPage(user);

    const nav = document.querySelector('.nav');
    if (nav) nav.style.top = '48px';
    closeAuth();
}

function setLoggedOut() {
    currentUser = null;
    document.body.classList.remove('admin-mode');
    const bar = document.getElementById('admin-nav-bar');
    if (bar) bar.classList.remove('visible');
    const nav = document.querySelector('.nav');
    if (nav) nav.style.top = '';

    if (typeof window.loadProfil === 'function') {
        window.loadProfil();
    }
}

// ---- LOGIN ----
document.getElementById('login-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('login-status');
    const btn    = e.target.querySelector('.auth-btn');
    const body   = {
        username: document.getElementById('login-username').value.trim(),
        password: document.getElementById('login-password').value
    };
    if (!body.username || !body.password) {
        setStatus(status, 'error', '⚠️ Semua field wajib diisi'); return;
    }
    btn.disabled = true; btn.textContent = 'Masuk...';
    setStatus(status, 'loading', '⏳ Sedang memverifikasi...');
    try {
        const r = await fetch(`${AUTH_API}?action=login`, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify(body)
        });

        const text = await r.text();
        let j = {};
        try { j = text ? JSON.parse(text) : {}; } catch (err) {
            console.error('Login parse error:', text, err);
            setStatus(status, 'error', '❌ Respon server tidak valid');
            return;
        }

        if (j.status === 'ok') {
            setStatus(status, 'success', '✅ ' + (j.data?.message || 'Login berhasil'));
            setTimeout(() => setLoggedIn(j.data), 700);
        } else {
            setStatus(status, 'error', '❌ ' + (j.data?.message || 'Login gagal'));
        }
    } catch(e) {
        console.error('Login request error:', e);
        setStatus(status, 'error', '❌ Koneksi gagal / server error');
    }
    btn.disabled = false; btn.textContent = 'Masuk';
});

// ---- REGISTER ----
document.getElementById('register-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('register-status');
    const btn    = e.target.querySelector('.auth-btn');
    const pw  = document.getElementById('reg-password').value;
    const pw2 = document.getElementById('reg-password2').value;
    if (pw !== pw2) { setStatus(status, 'error', '❌ Password tidak cocok'); return; }
    if (pw.length < 6) { setStatus(status, 'error', '❌ Password minimal 6 karakter'); return; }
    const body = {
        nama:     document.getElementById('reg-nama').value.trim(),
        username: document.getElementById('reg-username').value.trim(),
        email:    document.getElementById('reg-email').value.trim(),
        password: pw
    };
    btn.disabled = true; btn.textContent = 'Mendaftar...';
    setStatus(status, 'loading', '⏳ Membuat akun...');
    try {
        const r = await fetch(`${AUTH_API}?action=register`, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify(body)
        });
        const j = await r.json();
        if (j.status === 'ok') {
            setStatus(status, 'success', '✅ ' + j.data.message);
            setTimeout(async () => {
                const chk = await fetch(`${AUTH_API}?action=check`);
                const cj  = await chk.json();
                if (cj.status === 'ok') setLoggedIn(cj.data);
            }, 800);
        } else {
            setStatus(status, 'error', '❌ ' + (j.data?.message || 'Registrasi gagal'));
        }
    } catch(e) { setStatus(status, 'error', '❌ Koneksi gagal'); }
    btn.disabled = false; btn.textContent = 'Buat Akun';
});

// ---- LOGOUT ----
document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await fetch(`${AUTH_API}?action=logout`);
    setLoggedOut();
    showToast('Logout berhasil', 'success');
});

// ---- AUTH UI ----
function openAuth(tab = 'login') {
    const overlay = document.getElementById('auth-overlay');
    overlay.classList.add('open');
    switchAuthTab(tab);
}
function closeAuth() {
    document.getElementById('auth-overlay')?.classList.remove('open');
}
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.auth-panel').forEach(p => p.classList.toggle('active', p.id === tab + '-panel'));
}
document.querySelectorAll('.auth-tab').forEach(t => t.addEventListener('click', () => switchAuthTab(t.dataset.tab)));
function initializeAuthUI() {
    checkLogin();
    document.getElementById('btn-login')?.addEventListener('click', () => openAuth('login'));
    document.getElementById('auth-overlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeAuth(); });
    document.getElementById('auth-close')?.addEventListener('click', closeAuth);
    if (new URLSearchParams(window.location.search).get('login') === '1') openAuth('login');
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuthUI, { once: true });
} else {
    initializeAuthUI();
}

// Toggle password visibility
document.querySelectorAll('.auth-toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
        const inp = btn.previousElementSibling;
        inp.type = inp.type === 'password' ? 'text' : 'password';
        btn.textContent = inp.type === 'password' ? '👁️' : '🙈';
    });
});

// ============================================
//  UPLOAD FOTO PROFIL
// ============================================
document.getElementById('foto-input')?.addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!currentUser) { showToast('Login dulu untuk mengubah foto', 'error'); return; }

    showToast('Mengupload foto...', 'info');
    const fd = new FormData();
    fd.append('foto', file);

    try {
        const r = await fetch(`${ADMIN_API}?action=upload_foto`, { method: 'POST', body: fd });
        const j = await r.json();
        if (j.status === 'ok') {
            // preview langsung
            const avatar = document.querySelector('.hero-avatar');
            if (avatar) {
                const img = document.createElement('img');
                img.src = j.data.url; img.alt = 'Foto Profil';
                img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
                avatar.innerHTML = '';
                avatar.appendChild(img);
            }
            showToast('✅ Foto berhasil diperbarui!', 'success');
        } else {
            showToast('❌ ' + (j.data?.message || 'Upload gagal'), 'error');
        }
    } catch(err) { showToast('❌ Upload gagal', 'error'); }
    e.target.value = '';
});

// Klik area avatar untuk upload (hanya saat admin)
document.querySelector('.foto-upload-overlay')?.addEventListener('click', () => {
    if (currentUser) document.getElementById('foto-input')?.click();
});

// ============================================
//  MODAL UNIVERSAL
// ============================================
function openModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}
document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) closeModal(m.id); });
});
document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.closest('.modal-overlay').id));
});

// ============================================
//  RANGE SLIDER LIVE VALUE
// ============================================
document.querySelectorAll('input[type="range"]').forEach(r => {
    r.addEventListener('input', () => {
        const disp = r.closest('.form-group')?.querySelector('.range-val');
        if (disp) disp.textContent = r.value + '%';
    });
});

// ============================================
//  COLOR SWATCHES
// ============================================
const SWATCHES = ['#6366f1','#a855f7','#06b6d4','#10b981','#f59e0b','#ef4444','#e34c26','#f7df1e','#61dafb','#339933','#4479a1','#ff2d20'];
document.querySelectorAll('.color-swatches').forEach(container => {
    const input = container.previousElementSibling;
    SWATCHES.forEach(c => {
        const s = document.createElement('div');
        s.className = 'swatch'; s.style.background = c; s.title = c;
        s.addEventListener('click', () => {
            container.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
            s.classList.add('active');
            if (input && input.type === 'color') input.value = c;
        });
        container.appendChild(s);
    });
});

// ============================================
//  CRUD — SKILLS
// ============================================
let editSkillId = null;
document.getElementById('btn-add-skill')?.addEventListener('click', () => {
    editSkillId = null;
    document.getElementById('modal-skill-title').textContent = '➕ Tambah Skill';
    document.getElementById('skill-form').reset();
    document.getElementById('skill-level-val').textContent = '80%';
    document.getElementById('modal-skill-status').className = 'modal-status';
    openModal('modal-skill');
});

document.getElementById('skill-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('modal-skill-status');
    const body = {
        id:       editSkillId,
        nama:     document.getElementById('skill-nama').value.trim(),
        kategori: document.getElementById('skill-kategori').value,
        level:    document.getElementById('skill-level').value,
        warna:    document.getElementById('skill-warna').value
    };
    if (!body.nama) { setStatus(status, 'error', '⚠️ Nama skill wajib diisi'); return; }
    setStatus(status, 'loading', '⏳ Menyimpan...');
    const action = editSkillId ? 'edit_skill' : 'add_skill';
    try {
        const r = await fetch(`${ADMIN_API}?action=${action}`, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
        });
        const j = await r.json();
        if (j.status === 'ok') {
            showToast('✅ ' + j.data.message);
            closeModal('modal-skill');
            if (typeof loadSkills === 'function') loadSkills();
        } else { setStatus(status, 'error', '❌ ' + j.data?.message); }
    } catch { setStatus(status, 'error', '❌ Gagal menyimpan'); }
});

window.editSkill = function(id, nama, kat, level, warna) {
    editSkillId = id;
    document.getElementById('modal-skill-title').textContent = '✏️ Edit Skill';
    document.getElementById('skill-nama').value     = nama;
    document.getElementById('skill-kategori').value = kat;
    document.getElementById('skill-level').value    = level;
    document.getElementById('skill-level-val').textContent = level + '%';
    document.getElementById('skill-warna').value    = warna;
    document.getElementById('modal-skill-status').className = 'modal-status';
    openModal('modal-skill');
};

window.deleteSkill = async function(id, nama) {
    if (!confirm(`Hapus skill "${nama}"?`)) return;
    try {
        const r = await fetch(`${ADMIN_API}?action=delete_skill`, {
            method: 'POST', headers: {'Content-Type':'application/json'},
            body: JSON.stringify({id})
        });
        const j = await r.json();
        if (j.status === 'ok') { showToast('✅ Skill dihapus'); if (typeof loadSkills === 'function') loadSkills(); }
        else showToast('❌ ' + j.data?.message, 'error');
    } catch { showToast('❌ Gagal menghapus', 'error'); }
};

// ============================================
//  CRUD — PROYEK
// ============================================
let editProyekId = null;
document.getElementById('btn-add-proyek')?.addEventListener('click', () => {
    editProyekId = null;
    document.getElementById('modal-proyek-title').textContent = '➕ Tambah Proyek';
    document.getElementById('proyek-form').reset();
    document.getElementById('modal-proyek-status').className = 'modal-status';
    openModal('modal-proyek');
});

document.getElementById('proyek-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('modal-proyek-status');
    const body = {
        id:          editProyekId,
        judul:       document.getElementById('p-judul').value.trim(),
        deskripsi:   document.getElementById('p-deskripsi').value.trim(),
        teknologi:   document.getElementById('p-teknologi').value.trim(),
        link_demo:   document.getElementById('p-demo').value.trim(),
        link_github: document.getElementById('p-github').value.trim(),
        kategori:    document.getElementById('p-kategori').value,
        featured:    document.getElementById('p-featured').checked ? 1 : 0
    };
    if (!body.judul) { setStatus(status, 'error', '⚠️ Judul wajib diisi'); return; }
    setStatus(status, 'loading', '⏳ Menyimpan...');
    const action = editProyekId ? 'edit_proyek' : 'add_proyek';
    try {
        const r = await fetch(`${ADMIN_API}?action=${action}`, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
        });
        const j = await r.json();
        if (j.status === 'ok') {
            showToast('✅ ' + j.data.message);
            closeModal('modal-proyek');
            if (typeof loadProyek === 'function') loadProyek();
        } else { setStatus(status, 'error', '❌ ' + j.data?.message); }
    } catch { setStatus(status, 'error', '❌ Gagal menyimpan'); }
});

window.editProyek = function(p) {
    editProyekId = p.id;
    document.getElementById('modal-proyek-title').textContent = '✏️ Edit Proyek';
    document.getElementById('p-judul').value    = p.judul;
    document.getElementById('p-deskripsi').value= p.deskripsi;
    document.getElementById('p-teknologi').value= p.teknologi;
    document.getElementById('p-demo').value     = p.link_demo;
    document.getElementById('p-github').value   = p.link_github;
    document.getElementById('p-kategori').value = p.kategori;
    document.getElementById('p-featured').checked = p.featured == 1;
    document.getElementById('modal-proyek-status').className = 'modal-status';
    openModal('modal-proyek');
};

window.deleteProyek = async function(id, judul) {
    if (!confirm(`Hapus proyek "${judul}"?`)) return;
    try {
        const r = await fetch(`${ADMIN_API}?action=delete_proyek`, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id})
        });
        const j = await r.json();
        if (j.status === 'ok') { showToast('✅ Proyek dihapus'); if (typeof loadProyek === 'function') loadProyek(); }
        else showToast('❌ ' + j.data?.message, 'error');
    } catch { showToast('❌ Gagal', 'error'); }
};

// ============================================
//  CRUD — KEGIATAN
// ============================================
let editKegiatanId = null;
document.getElementById('btn-add-kegiatan')?.addEventListener('click', () => {
    editKegiatanId = null;
    document.getElementById('modal-kegiatan-title').textContent = '➕ Tambah Kegiatan';
    document.getElementById('kegiatan-form').reset();
    document.getElementById('modal-kegiatan-status').className = 'modal-status';
    openModal('modal-kegiatan');
});

document.getElementById('kegiatan-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('modal-kegiatan-status');
    const body = {
        id:        editKegiatanId,
        judul:     document.getElementById('k-judul').value.trim(),
        deskripsi: document.getElementById('k-deskripsi').value.trim(),
        kategori:  document.getElementById('k-kategori').value.trim(),
        tanggal:   document.getElementById('k-tanggal').value,
        lokasi:    document.getElementById('k-lokasi').value.trim()
    };
    if (!body.judul) { setStatus(status, 'error', '⚠️ Judul wajib diisi'); return; }
    setStatus(status, 'loading', '⏳ Menyimpan...');
    const action = editKegiatanId ? 'edit_kegiatan' : 'add_kegiatan';
    try {
        const r = await fetch(`${ADMIN_API}?action=${action}`, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
        });
        const j = await r.json();
        if (j.status === 'ok') {
            showToast('✅ ' + j.data.message);
            closeModal('modal-kegiatan');
            if (typeof loadKegiatan === 'function') loadKegiatan();
        } else { setStatus(status, 'error', '❌ ' + j.data?.message); }
    } catch { setStatus(status, 'error', '❌ Gagal menyimpan'); }
});

window.editKegiatan = function(k) {
    editKegiatanId = k.id;
    document.getElementById('modal-kegiatan-title').textContent = '✏️ Edit Kegiatan';
    document.getElementById('k-judul').value     = k.judul;
    document.getElementById('k-deskripsi').value = k.deskripsi;
    document.getElementById('k-kategori').value  = k.kategori;
    document.getElementById('k-tanggal').value   = k.tanggal || '';
    document.getElementById('k-lokasi').value    = k.lokasi;
    document.getElementById('modal-kegiatan-status').className = 'modal-status';
    openModal('modal-kegiatan');
};

window.deleteKegiatan = async function(id, judul) {
    if (!confirm(`Hapus kegiatan "${judul}"?`)) return;
    try {
        const r = await fetch(`${ADMIN_API}?action=delete_kegiatan`, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id})
        });
        const j = await r.json();
        if (j.status === 'ok') { showToast('✅ Kegiatan dihapus'); if (typeof loadKegiatan === 'function') loadKegiatan(); }
        else showToast('❌ ' + j.data?.message, 'error');
    } catch { showToast('❌ Gagal', 'error'); }
};

// ============================================
//  CRUD — PENGALAMAN
// ============================================
let editPengalamanId = null;
document.getElementById('btn-add-pengalaman')?.addEventListener('click', () => {
    editPengalamanId = null;
    document.getElementById('modal-pengalaman-title').textContent = '➕ Tambah Pengalaman';
    document.getElementById('pengalaman-form').reset();
    document.getElementById('modal-pengalaman-status').className = 'modal-status';
    openModal('modal-pengalaman');
});

document.getElementById('pengalaman-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('modal-pengalaman-status');
    const body = {
        id:              editPengalamanId,
        posisi:          document.getElementById('pe-posisi').value.trim(),
        perusahaan:      document.getElementById('pe-perusahaan').value.trim(),
        periode_mulai:   document.getElementById('pe-mulai').value.trim(),
        periode_selesai: document.getElementById('pe-selesai').value.trim(),
        deskripsi:       document.getElementById('pe-deskripsi').value.trim(),
        tipe:            document.getElementById('pe-tipe').value
    };
    if (!body.posisi || !body.perusahaan) { setStatus(status, 'error', '⚠️ Posisi & perusahaan wajib diisi'); return; }
    setStatus(status, 'loading', '⏳ Menyimpan...');
    const action = editPengalamanId ? 'edit_pengalaman' : 'add_pengalaman';
    try {
        const r = await fetch(`${ADMIN_API}?action=${action}`, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
        });
        const j = await r.json();
        if (j.status === 'ok') {
            showToast('✅ ' + j.data.message);
            closeModal('modal-pengalaman');
            if (typeof loadPengalaman === 'function') loadPengalaman();
        } else { setStatus(status, 'error', '❌ ' + j.data?.message); }
    } catch { setStatus(status, 'error', '❌ Gagal menyimpan'); }
});

window.editPengalaman = function(p) {
    editPengalamanId = p.id;
    document.getElementById('modal-pengalaman-title').textContent = '✏️ Edit Pengalaman';
    document.getElementById('pe-posisi').value     = p.posisi;
    document.getElementById('pe-perusahaan').value = p.perusahaan;
    document.getElementById('pe-mulai').value      = p.periode_mulai;
    document.getElementById('pe-selesai').value    = p.periode_selesai;
    document.getElementById('pe-deskripsi').value  = p.deskripsi;
    document.getElementById('pe-tipe').value       = p.tipe;
    document.getElementById('modal-pengalaman-status').className = 'modal-status';
    openModal('modal-pengalaman');
};

window.deletePengalaman = async function(id, posisi) {
    if (!confirm(`Hapus "${posisi}"?`)) return;
    try {
        const r = await fetch(`${ADMIN_API}?action=delete_pengalaman`, {
            method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id})
        });
        const j = await r.json();
        if (j.status === 'ok') { showToast('✅ Pengalaman dihapus'); if (typeof loadPengalaman === 'function') loadPengalaman(); }
        else showToast('❌ ' + j.data?.message, 'error');
    } catch { showToast('❌ Gagal', 'error'); }
};

// ============================================
//  HELPERS
// ============================================
function setStatus(el, type, msg) {
    if (!el) return;
    el.className = 'modal-status ' + type;
    el.textContent = msg;
    if (el.classList.contains('auth-status')) {
        el.className = 'auth-status ' + type;
    }
}

// ---- INIT ----
