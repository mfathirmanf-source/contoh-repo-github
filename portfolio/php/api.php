<?php
require_once 'config.php';
setHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

switch ($action) {

    // ============================
    //  PUBLIC ENDPOINTS
    // ============================
    case 'profil':
        $stmt = $db->query("SELECT * FROM profil LIMIT 1");
        respond($stmt->fetch());

    case 'skills':
        $stmt = $db->query("SELECT * FROM skills ORDER BY urutan ASC");
        respond($stmt->fetchAll());

    case 'proyek':
        $stmt = $db->query("SELECT * FROM proyek ORDER BY id DESC");
        respond($stmt->fetchAll());

    case 'pengalaman':
        $stmt = $db->query("SELECT * FROM pengalaman ORDER BY id DESC");
        respond($stmt->fetchAll());

    case 'kegiatan':
        $stmt = $db->query("SELECT * FROM kegiatan WHERE status='aktif' ORDER BY tanggal DESC");
        respond($stmt->fetchAll());

    case 'kontak':
        if ($method !== 'POST') respond(['message'=>'Method tidak diizinkan'], 'error', 405);
        $input  = json_decode(file_get_contents('php://input'), true);
        $nama   = trim($input['nama']   ?? '');
        $email  = trim($input['email']  ?? '');
        $subjek = trim($input['subjek'] ?? '');
        $pesan  = trim($input['pesan']  ?? '');
        if (!$nama || !$email || !$pesan) respond(['message'=>'Nama, email, dan pesan wajib diisi'], 'error', 400);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(['message'=>'Format email tidak valid'], 'error', 400);
        $stmt = $db->prepare("INSERT INTO pesan_kontak (nama, email, subjek, pesan) VALUES (?,?,?,?)");
        $stmt->execute([$nama, $email, $subjek, $pesan]);
        respond(['message'=>'Pesan berhasil dikirim!']);

    // ============================
    //  ADMIN — PROFIL
    // ============================
    case 'update_profil':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $fields = ['nama','jabatan','bio','email','phone','lokasi','github','linkedin'];
        $sets = []; $vals = [];
        foreach ($fields as $f) {
            if (isset($input[$f])) { $sets[] = "$f=?"; $vals[] = $input[$f]; }
        }
        if (empty($sets)) respond(['message'=>'Tidak ada data untuk diupdate'], 'error', 400);
        $vals[] = 1;
        $db->prepare("UPDATE profil SET ".implode(',',$sets)." WHERE id=?")->execute($vals);
        respond(['message'=>'Profil berhasil diperbarui']);

    case 'upload_foto':
        requireLogin();
        if ($method !== 'POST') respond(['message'=>'POST only'], 'error', 405);
        if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK)
            respond(['message'=>'File tidak ditemukan atau error upload'], 'error', 400);

        $file    = $_FILES['foto'];
        $allowed = ['image/jpeg','image/png','image/gif','image/webp'];
        if (!in_array($file['type'], $allowed))
            respond(['message'=>'Format file harus JPG, PNG, GIF, atau WebP'], 'error', 400);
        if ($file['size'] > MAX_FILE_SIZE)
            respond(['message'=>'Ukuran file maksimal 5MB'], 'error', 400);

        $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $name = 'profil_'.time().'.'.$ext;
        $dir  = UPLOAD_DIR . 'profil/';
        if (!is_dir($dir)) mkdir($dir, 0755, true);
        $path = $dir . $name;

        if (!move_uploaded_file($file['tmp_name'], $path))
            respond(['message'=>'Gagal menyimpan file'], 'error', 500);

        $url = UPLOAD_URL . 'profil/' . $name;
        $db->prepare("UPDATE profil SET foto=? WHERE id=1")->execute([$url]);
        respond(['message'=>'Foto berhasil diupload', 'url'=>$url]);

    // ============================
    //  ADMIN — SKILLS CRUD
    // ============================
    case 'add_skill':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $nama = trim($input['nama'] ?? ''); $kat = trim($input['kategori'] ?? 'tools');
        $lvl  = intval($input['level'] ?? 80); $warna = $input['warna'] ?? '#6366f1';
        if (!$nama) respond(['message'=>'Nama skill wajib diisi'], 'error', 400);
        $stmt = $db->prepare("INSERT INTO skills (nama,kategori,level,warna,urutan) VALUES (?,?,?,?,(SELECT IFNULL(MAX(urutan),0)+1 FROM skills s2))");
        $stmt->execute([$nama, $kat, $lvl, $warna]);
        respond(['message'=>'Skill berhasil ditambahkan', 'id'=>$db->lastInsertId()]);

    case 'edit_skill':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id'] ?? 0);
        if (!$id) respond(['message'=>'ID tidak valid'], 'error', 400);
        $db->prepare("UPDATE skills SET nama=?,kategori=?,level=?,warna=? WHERE id=?")
           ->execute([$input['nama'],$input['kategori'],$input['level'],$input['warna'],$id]);
        respond(['message'=>'Skill berhasil diperbarui']);

    case 'delete_skill':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id'] ?? 0);
        if (!$id) respond(['message'=>'ID tidak valid'], 'error', 400);
        $db->prepare("DELETE FROM skills WHERE id=?")->execute([$id]);
        respond(['message'=>'Skill berhasil dihapus']);

    // ============================
    //  ADMIN — PROYEK CRUD
    // ============================
    case 'add_proyek':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $judul = trim($input['judul'] ?? '');
        if (!$judul) respond(['message'=>'Judul proyek wajib diisi'], 'error', 400);
        $stmt = $db->prepare("INSERT INTO proyek (judul,deskripsi,teknologi,link_demo,link_github,kategori,featured) VALUES (?,?,?,?,?,?,?)");
        $stmt->execute([$judul,$input['deskripsi']??'',$input['teknologi']??'',$input['link_demo']??'',$input['link_github']??'',$input['kategori']??'Web App',intval($input['featured']??0)]);
        respond(['message'=>'Proyek berhasil ditambahkan', 'id'=>$db->lastInsertId()]);

    case 'edit_proyek':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id'] ?? 0);
        if (!$id) respond(['message'=>'ID tidak valid'], 'error', 400);
        $db->prepare("UPDATE proyek SET judul=?,deskripsi=?,teknologi=?,link_demo=?,link_github=?,kategori=?,featured=? WHERE id=?")
           ->execute([$input['judul'],$input['deskripsi'],$input['teknologi'],$input['link_demo'],$input['link_github'],$input['kategori'],intval($input['featured']),$id]);
        respond(['message'=>'Proyek berhasil diperbarui']);

    case 'delete_proyek':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id'] ?? 0);
        $db->prepare("DELETE FROM proyek WHERE id=?")->execute([$id]);
        respond(['message'=>'Proyek berhasil dihapus']);

    // ============================
    //  ADMIN — KEGIATAN CRUD
    // ============================
    case 'add_kegiatan':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $judul = trim($input['judul'] ?? '');
        if (!$judul) respond(['message'=>'Judul kegiatan wajib diisi'], 'error', 400);
        $stmt = $db->prepare("INSERT INTO kegiatan (judul,deskripsi,kategori,tanggal,lokasi,status) VALUES (?,?,?,?,?,'aktif')");
        $stmt->execute([$judul,$input['deskripsi']??'',$input['kategori']??'Umum',$input['tanggal']??null,$input['lokasi']??'']);
        respond(['message'=>'Kegiatan berhasil ditambahkan', 'id'=>$db->lastInsertId()]);

    case 'edit_kegiatan':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id'] ?? 0);
        if (!$id) respond(['message'=>'ID tidak valid'], 'error', 400);
        $db->prepare("UPDATE kegiatan SET judul=?,deskripsi=?,kategori=?,tanggal=?,lokasi=? WHERE id=?")
           ->execute([$input['judul'],$input['deskripsi'],$input['kategori'],$input['tanggal'],$input['lokasi'],$id]);
        respond(['message'=>'Kegiatan berhasil diperbarui']);

    case 'delete_kegiatan':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id'] ?? 0);
        $db->prepare("DELETE FROM kegiatan WHERE id=?")->execute([$id]);
        respond(['message'=>'Kegiatan berhasil dihapus']);

    // ============================
    //  ADMIN — PENGALAMAN CRUD
    // ============================
    case 'add_pengalaman':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $posisi = trim($input['posisi'] ?? '');
        if (!$posisi) respond(['message'=>'Posisi wajib diisi'], 'error', 400);
        $stmt = $db->prepare("INSERT INTO pengalaman (posisi,perusahaan,periode_mulai,periode_selesai,deskripsi,tipe) VALUES (?,?,?,?,?,?)");
        $stmt->execute([$posisi,$input['perusahaan']??'',$input['periode_mulai']??'',$input['periode_selesai']??'Sekarang',$input['deskripsi']??'',$input['tipe']??'kerja']);
        respond(['message'=>'Pengalaman berhasil ditambahkan', 'id'=>$db->lastInsertId()]);

    case 'edit_pengalaman':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id'] ?? 0);
        if (!$id) respond(['message'=>'ID tidak valid'], 'error', 400);
        $db->prepare("UPDATE pengalaman SET posisi=?,perusahaan=?,periode_mulai=?,periode_selesai=?,deskripsi=?,tipe=? WHERE id=?")
           ->execute([$input['posisi'],$input['perusahaan'],$input['periode_mulai'],$input['periode_selesai'],$input['deskripsi'],$input['tipe'],$id]);
        respond(['message'=>'Pengalaman berhasil diperbarui']);

    case 'delete_pengalaman':
        requireLogin();
        $input = json_decode(file_get_contents('php://input'), true);
        $id = intval($input['id'] ?? 0);
        $db->prepare("DELETE FROM pengalaman WHERE id=?")->execute([$id]);
        respond(['message'=>'Pengalaman berhasil dihapus']);

    default:
        respond(['message'=>'Action tidak ditemukan'], 'error', 404);
}
