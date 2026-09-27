// ============================================
//  PORTFOLIO — MAIN JS (Updated with Admin)
// ============================================

const API = 'php/api.php';

// ---- LOADER ----
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    const fill   = document.querySelector('.loader-fill');
    let pct = 0;
    const iv = setInterval(() => {
        pct += Math.random() * 18;
        if (pct >= 100) { pct = 100; clearInterval(iv); }
        fill.style.width = pct + '%';
        if (pct === 100) setTimeout(() => loader.classList.add('done'), 400);
    }, 60);
});

// ---- CUSTOM CURSOR ----
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (dot) { dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px'; }
});
(function animRing() {
    ringX += (mouseX - ringX) * .14;
    ringY += (mouseY - ringY) * .14;
    if (ring) { ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px'; }
    requestAnimationFrame(animRing);
})();

// ---- PARTICLES ----
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random()*W; this.y = Math.random()*H;
            this.r = Math.random()*1.8+.5;
            this.vx=(Math.random()-.5)*.4; this.vy=(Math.random()-.5)*.4;
            this.a=Math.random()*.6+.2; this.da=(Math.random()-.5)*.005;
        }
        update() {
            this.x+=this.vx; this.y+=this.vy; this.a+=this.da;
            if(this.a<=.1||this.a>=.9) this.da*=-1;
            if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset();
        }
        draw() {
            ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
            ctx.fillStyle=`rgba(99,102,241,${this.a})`; ctx.fill();
        }
    }
    for(let i=0;i<100;i++) particles.push(new Particle());
    function drawLines() {
        for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
            const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
            const d=Math.sqrt(dx*dx+dy*dy);
            if(d<120){ ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y);
                ctx.strokeStyle=`rgba(99,102,241,${.15*(1-d/120)})`; ctx.lineWidth=.5; ctx.stroke(); }
        }
    }
    function loop() { ctx.clearRect(0,0,W,H); particles.forEach(p=>{p.update();p.draw();}); drawLines(); requestAnimationFrame(loop); }
    loop();
})();

// ---- NAV SCROLL ----
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => { if(nav) nav.classList.toggle('scrolled', window.scrollY > 40); });

// ---- TYPING EFFECT ----
const roles = ['Full Stack Developer','UI/UX Designer','PHP Developer','Problem Solver'];
let ri=0,ci=0,deleting=false;
const typeEl = document.getElementById('typing-text');
function typeLoop() {
    if(!typeEl) return;
    const cur = roles[ri];
    typeEl.textContent = deleting ? cur.substring(0,ci--) : cur.substring(0,ci++);
    let d = deleting ? 50 : 90;
    if(!deleting&&ci>cur.length){d=1600;deleting=true;}
    if(deleting&&ci<0){ci=0;deleting=false;ri=(ri+1)%roles.length;d=400;}
    setTimeout(typeLoop,d);
}
typeLoop();

// ---- SCROLL REVEAL ----
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if(e.isIntersecting) {
            e.target.classList.add('visible');
            if(e.target.classList.contains('skill-card')) {
                const fill = e.target.querySelector('.skill-fill');
                if(fill) fill.style.width = fill.dataset.pct + '%';
            }
            observer.unobserve(e.target);
        }
    });
},{threshold:.12});

function observeReveal(el) { observer.observe(el); }
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    let count = 0;
    const step = target / 60;
    const iv = setInterval(() => {
        count += step;
        if(count >= target) { count = target; clearInterval(iv); }
        el.textContent = Math.round(count) + (el.dataset.suffix || '');
    },20);
}
const statsEl = document.querySelector('.hero-stats');
if(statsEl) {
    new IntersectionObserver(entries=>{
        entries.forEach(e=>{ if(e.isIntersecting){ e.target.querySelectorAll('[data-target]').forEach(animateCounter); } });
    },{threshold:.3}).observe(statsEl);
}

// ---- SKILLS FILTER ----
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        document.querySelectorAll('.skill-card').forEach((card,i) => {
            const show = cat==='all' || card.dataset.cat===cat;
            card.style.transition = `opacity .3s ${i*.04}s, transform .3s ${i*.04}s`;
            if(show) { card.style.display=''; setTimeout(()=>{card.style.opacity=1;card.style.transform='';},10); }
            else { card.style.opacity=0; card.style.transform='scale(.9)'; setTimeout(()=>card.style.display='none',320); }
        });
    });
});

// ---- MOBILE NAV ----
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
if(burger&&navLinks) {
    let menuOpen = false;
    burger.addEventListener('click', () => {
        menuOpen = !menuOpen;
        if(menuOpen) {
            Object.assign(navLinks.style,{display:'flex',flexDirection:'column',position:'absolute',
                top:'60px',right:'1.2rem',background:'rgba(10,10,15,.97)',backdropFilter:'blur(16px)',
                padding:'1rem 1.5rem',borderRadius:'12px',border:'1px solid rgba(99,102,241,.2)',gap:'1.2rem',zIndex:200});
        } else { navLinks.style.display=''; }
    });
    navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menuOpen=false;navLinks.style.display='';}));
}

// ============================================
//  DATA LOADERS
// ============================================

async function loadProfil() {
    try {
        const r = await fetch(`${API}?action=profil`);
        const j = await r.json();
        if(j.status!=='ok'||!j.data) return;
        const p = j.data;
        setText('hero-name-text', p.nama);
        setHTML('about-bio', p.bio);
        setHTML('hero-bio', p.bio);
        setText('footer-name', p.nama);
        setText('info-email', p.email);
        setText('info-phone', p.phone);
        setText('info-lokasi', p.lokasi);
        setText('info-email-2', p.email);
        setText('info-phone-2', p.phone);
        setText('info-lokasi-2', p.lokasi);
        if(p.github) document.querySelectorAll('.link-github').forEach(el=>el.href=p.github);
        if(p.linkedin) document.querySelectorAll('.link-linkedin').forEach(el=>el.href=p.linkedin);
        // Tampilkan foto jika ada
        if(p.foto) {
            const av = document.querySelector('.hero-avatar');
            if(av) {
                const sp = av.querySelector('#avatar-emoji');
                if(sp) {
                    const img = document.createElement('img');
                    img.src=p.foto; img.alt='Foto Profil';
                    img.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:50%;position:absolute;top:0;left:0;';
                    av.appendChild(img);
                }
            }
            // about section juga
            const ab = document.querySelector('.about-img');
            if(ab) {
                const img2 = document.createElement('img');
                img2.src=p.foto; img2.alt='Foto';
                img2.style.cssText='width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;border-radius:var(--radius);';
                ab.style.position='relative';
                ab.appendChild(img2);
            }
        }
    } catch(e){ console.warn('profil error',e); }
}

window.loadSkills = async function() {
    try {
        const r = await fetch(`${API}?action=skills`);
        const j = await r.json();
        if(j.status!=='ok') return;
        const grid = document.getElementById('skills-grid');
        if(!grid) return;
        grid.innerHTML='';
        if(!j.data.length) { grid.innerHTML='<div style="text-align:center;color:var(--muted);padding:2rem;grid-column:1/-1">Belum ada skill ditambahkan.</div>'; return; }
        j.data.forEach((s,i)=>{
            const card = document.createElement('div');
            card.className='skill-card reveal'; card.dataset.cat=s.kategori;
            card.style.animationDelay=`${i*.05}s`;
            const isAdmin = document.body.classList.contains('admin-mode');
            card.innerHTML=`
                <div class="skill-top">
                    <span class="skill-name">${esc(s.nama)}</span>
                    <span class="skill-pct">${s.level}%</span>
                </div>
                <div class="skill-bar">
                    <div class="skill-fill" data-pct="${s.level}" style="background:linear-gradient(90deg,${s.warna||'#6366f1'},${lighten(s.warna||'#6366f1')})"></div>
                </div>
                <div class="admin-actions-inline">
                    <button class="inline-btn edit-btn" onclick='editSkill(${s.id},"${esc(s.nama)}","${s.kategori}",${s.level},"${s.warna}")'>✏️ Edit</button>
                    <button class="inline-btn del-btn" onclick='deleteSkill(${s.id},"${esc(s.nama)}")'>🗑️ Hapus</button>
                </div>`;
            grid.appendChild(card);
            observer.observe(card);
        });
    } catch(e){ console.warn('skills error',e); }
};

window.loadProyek = async function() {
    try {
        const r = await fetch(`${API}?action=proyek`);
        const j = await r.json();
        if(j.status!=='ok') return;
        const grid = document.getElementById('projects-grid');
        if(!grid) return;
        const emojis = {'Web App':'🌐','SaaS':'☁️','UI/UX':'🎨','Backend':'⚙️','AI/ML':'🤖','Mobile':'📱'};
        grid.innerHTML='';
        if(!j.data.length) { grid.innerHTML='<div style="text-align:center;color:var(--muted);padding:2rem;grid-column:1/-1">Belum ada proyek.</div>'; return; }
        j.data.forEach((p,i)=>{
            const card = document.createElement('div');
            card.className='project-card reveal'; card.style.transitionDelay=`${i*.07}s`;
            const techs=(p.teknologi||'').split(',').map(t=>`<span class="tech-tag">${esc(t.trim())}</span>`).join('');
            card.innerHTML=`
                <div class="project-thumb">${emojis[p.kategori]||'💻'}<span class="project-badge">${esc(p.kategori)}</span></div>
                <div class="project-body">
                    <h3 class="project-title">${esc(p.judul)}</h3>
                    <p class="project-desc">${esc(p.deskripsi||'')}</p>
                    <div class="project-tech">${techs}</div>
                    <div class="project-links">
                        <a href="${esc(p.link_demo||'#')}" class="project-link demo" target="_blank">🔗 Live Demo</a>
                        <a href="${esc(p.link_github||'#')}" class="project-link github" target="_blank">🐙 GitHub</a>
                    </div>
                    <div class="admin-actions-inline">
                        <button class="inline-btn edit-btn" onclick='editProyek(${JSON.stringify(p).replace(/'/g,"&#39;")})'>✏️ Edit</button>
                        <button class="inline-btn del-btn" onclick='deleteProyek(${p.id},"${esc(p.judul)}")'>🗑️ Hapus</button>
                    </div>
                </div>`;
            grid.appendChild(card);
            observer.observe(card);
        });
    } catch(e){ console.warn('proyek error',e); }
};

window.loadKegiatan = async function() {
    try {
        const r = await fetch(`${API}?action=kegiatan`);
        const j = await r.json();
        if(j.status!=='ok') return;
        const grid = document.getElementById('kegiatan-grid');
        if(!grid) return;
        grid.innerHTML='';
        if(!j.data.length) {
            grid.innerHTML='<div style="text-align:center;color:var(--muted);padding:2rem;grid-column:1/-1">Belum ada kegiatan. <span id="hint-add" style="color:var(--accent);cursor:pointer">+ Tambah Kegiatan</span></div>';
            document.getElementById('hint-add')?.addEventListener('click',()=>document.getElementById('btn-add-kegiatan')?.click());
            return;
        }
        const katEmoji={'Workshop':'🛠️','Kompetisi':'🏆','Sertifikasi':'📜','Mentoring':'👨‍🏫','Konferensi':'🎤','Volunteer':'❤️','Umum':'📌'};
        j.data.forEach((k,i)=>{
            const card = document.createElement('div');
            card.className='kegiatan-card reveal'; card.style.transitionDelay=`${i*.07}s`;
            const tgl = k.tanggal ? new Date(k.tanggal).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : '';
            card.innerHTML=`
                <div class="kegiatan-kat">${katEmoji[k.kategori]||'📌'} ${esc(k.kategori||'Umum')}</div>
                <h3 class="kegiatan-judul">${esc(k.judul)}</h3>
                <p class="kegiatan-desc">${esc(k.deskripsi||'')}</p>
                <div class="kegiatan-meta">
                    ${tgl?`<span>📅 ${tgl}</span>`:''}
                    ${k.lokasi?`<span>📍 ${esc(k.lokasi)}</span>`:''}
                </div>
                <div class="admin-actions-inline" style="margin-top:.8rem">
                    <button class="inline-btn edit-btn" onclick='editKegiatan(${JSON.stringify(k).replace(/'/g,"&#39;")})'>✏️ Edit</button>
                    <button class="inline-btn del-btn" onclick='deleteKegiatan(${k.id},"${esc(k.judul)}")'>🗑️ Hapus</button>
                </div>`;
            grid.appendChild(card);
            observer.observe(card);
        });
    } catch(e){ console.warn('kegiatan error',e); }
};

window.loadPengalaman = async function() {
    try {
        const r = await fetch(`${API}?action=pengalaman`);
        const j = await r.json();
        if(j.status!=='ok') return;
        const tl = document.getElementById('timeline');
        if(!tl) return;
        tl.innerHTML='';
        if(!j.data.length) { tl.innerHTML='<div style="text-align:center;color:var(--muted);padding:2rem">Belum ada pengalaman.</div>'; return; }
        j.data.forEach((p,i)=>{
            const item = document.createElement('div');
            item.className='timeline-item reveal'; item.style.transitionDelay=`${i*.1}s`;
            item.innerHTML=`
                <div class="timeline-content">
                    <h3>${esc(p.posisi)}</h3>
                    <h4>${esc(p.perusahaan)}</h4>
                    <p>${esc(p.deskripsi||'')}</p>
                    <div class="admin-actions-inline">
                        <button class="inline-btn edit-btn" onclick='editPengalaman(${JSON.stringify(p).replace(/'/g,"&#39;")})'>✏️ Edit</button>
                        <button class="inline-btn del-btn" onclick='deletePengalaman(${p.id},"${esc(p.posisi)}")'>🗑️ Hapus</button>
                    </div>
                </div>
                <div class="timeline-dot"></div>
                <div class="timeline-side">
                    <span class="timeline-period">${esc(p.periode_mulai||'')} – ${esc(p.periode_selesai||'')}</span><br>
                    <span class="timeline-type ${p.tipe}">${p.tipe==='kerja'?'💼 Karir':'🎓 Pendidikan'}</span>
                </div>`;
            tl.appendChild(item);
            observer.observe(item);
        });
    } catch(e){ console.warn('pengalaman error',e); }
};

// ---- CONTACT FORM ----
document.getElementById('contact-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const btn    = e.target.querySelector('button[type="submit"]');
    const fd     = new FormData(e.target);
    const body   = { nama:fd.get('nama')?.trim(), email:fd.get('email')?.trim(), subjek:fd.get('subjek')?.trim(), pesan:fd.get('pesan')?.trim() };
    if(!body.nama||!body.email||!body.pesan) { setFormStatus(status,'error','⚠️ Nama, email, dan pesan wajib diisi!'); return; }
    btn.textContent='Mengirim...'; btn.disabled=true;
    setFormStatus(status,'loading','⏳ Mengirim pesan...');
    try {
        const r = await fetch(`${API}?action=kontak`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
        const j = await r.json();
        if(j.status==='ok') { setFormStatus(status,'success','✅ '+j.data.message); e.target.reset(); }
        else setFormStatus(status,'error','❌ '+(j.data?.message||'Gagal mengirim'));
    } catch { setFormStatus(status,'error','❌ Gagal mengirim'); }
    btn.textContent='🚀 Kirim Pesan'; btn.disabled=false;
});

// ---- HELPERS ----
function setText(id,val){const el=document.getElementById(id);if(el&&val)el.textContent=val;}
function setHTML(id,val){const el=document.getElementById(id);if(el&&val)el.innerHTML=val;}
function esc(str){if(!str)return '';return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function lighten(hex){try{const n=parseInt((hex||'#6366f1').slice(1),16);const r=Math.min(255,(n>>16)+60);const g=Math.min(255,((n>>8)&0xff)+60);const b=Math.min(255,(n&0xff)+60);return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');}catch{return '#8b8ff8';}}
function setFormStatus(el,type,msg){if(!el)return;el.className='form-status '+type;el.textContent=msg;}

// ---- INIT ----
document.addEventListener('DOMContentLoaded',()=>{
    loadProfil();
    loadSkills();
    loadProyek();
    loadKegiatan();
    loadPengalaman();
    setTimeout(()=>{
        document.querySelectorAll('.reveal').forEach(el=>{
            if(el.getBoundingClientRect().top<window.innerHeight) el.classList.add('visible');
        });
    },900);
});
