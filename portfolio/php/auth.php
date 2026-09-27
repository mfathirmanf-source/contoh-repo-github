<?php
require_once 'config.php';
setHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$action = $_GET['action'] ?? '';
$db = getDB();

switch ($action) {

    // ---- CEK STATUS LOGIN ----
    case 'check':
        if (isLoggedIn()) {
            respond(getCurrentUser());
        } else {
            respond(null, 'error', 401);
        }

    // ---- LOGIN ----
    case 'login':
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);
        if (!is_array($input)) {
            $input = $_POST;
        }

        $username = trim((string)($input['username'] ?? ''));
        $password = trim((string)($input['password'] ?? ''));
        if (!$username || !$password) respond(['message'=>'Username dan password wajib diisi'], 'error', 400);

        $stmt = $db->prepare("SELECT * FROM users WHERE username=? OR email=? LIMIT 1");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();

        if (!$user) {
            respond(['message'=>'Username atau password salah'], 'error', 401);
        }

        $passwordOk = password_verify($password, $user['password']) || ($user['password'] === $password);
        if (!$passwordOk) {
            respond(['message'=>'Username atau password salah'], 'error', 401);
        }

        $_SESSION['user_id']   = (int)$user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['user']      = [
            'id' => (int)$user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'nama_lengkap' => $user['nama_lengkap'],
            'role' => $user['role']
        ];

        respond([
            'id'          => (int)$user['id'],
            'username'    => $user['username'],
            'nama_lengkap'=> $user['nama_lengkap'],
            'email'       => $user['email'],
            'role'        => $user['role'],
            'avatar'      => $user['avatar'],
            'message'     => 'Login berhasil! Selamat datang, '.$user['nama_lengkap']
        ]);

    // ---- REGISTER ----
    case 'register':
        $input    = json_decode(file_get_contents('php://input'), true);
        $username = trim($input['username'] ?? '');
        $email    = trim($input['email']    ?? '');
        $password = trim($input['password'] ?? '');
        $nama     = trim($input['nama']     ?? '');

        if (!$username || !$email || !$password || !$nama)
            respond(['message'=>'Semua field wajib diisi'], 'error', 400);
        if (strlen($password) < 6)
            respond(['message'=>'Password minimal 6 karakter'], 'error', 400);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL))
            respond(['message'=>'Format email tidak valid'], 'error', 400);

        // cek duplikat
        $stmt = $db->prepare("SELECT id FROM users WHERE username=? OR email=?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) respond(['message'=>'Username atau email sudah digunakan'], 'error', 409);

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $db->prepare("INSERT INTO users (username, email, password, nama_lengkap, role) VALUES (?,?,?,?,'admin')");
        $stmt->execute([$username, $email, $hash, $nama]);
        $newId = $db->lastInsertId();

        $_SESSION['user_id']   = $newId;
        $_SESSION['user_role'] = 'admin';
        respond(['message'=>'Akun berhasil dibuat! Selamat datang, '.$nama, 'id'=>$newId]);

    // ---- LOGOUT ----
    case 'logout':
        session_destroy();
        respond(['message'=>'Logout berhasil']);

    default:
        respond(['message'=>'Action tidak ditemukan'], 'error', 404);
}
