<?php
// ============================================
//  Konfigurasi Database Laragon
// ============================================
session_start();

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'portfolio_db');
define('DB_PORT', 3306);
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_URL', 'uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4;port=".DB_PORT;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['status'=>'error','message'=>'DB error: '.$e->getMessage()]));
        }
    }
    return $pdo;
}

function setHeaders() {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Session-Token');
}

function respond($data, $status = 'ok', $code = 200) {
    http_response_code($code);
    echo json_encode(['status'=>$status,'data'=>$data], JSON_UNESCAPED_UNICODE);
    exit;
}

function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        respond(['message'=>'Silakan login terlebih dahulu'], 'error', 401);
    }
}

function getCurrentUser() {
    if (!isLoggedIn()) return null;
    $db = getDB();
    $stmt = $db->prepare("SELECT id, username, email, nama_lengkap, role, avatar FROM users WHERE id=?");
    $stmt->execute([$_SESSION['user_id']]);
    return $stmt->fetch();
}

function saveUploadedImage($fileInput, $subdir = 'foto') {
    if (!isset($_FILES[$fileInput]) || $_FILES[$fileInput]['error'] !== UPLOAD_ERR_OK) return null;
    $file = $_FILES[$fileInput];
    $allowed = ['image/jpeg','image/png','image/gif','image/webp'];
    if (!in_array($file['type'], $allowed)) return null;
    if ($file['size'] > MAX_FILE_SIZE) return null;
    $ext  = pathinfo($file['name'], PATHINFO_EXTENSION);
    $name = $subdir.'_'.time().'_'.uniqid().'.'.$ext;
    $dir  = UPLOAD_DIR . $subdir . '/';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $path = $dir . $name;
    if (move_uploaded_file($file['tmp_name'], $path)) {
        return UPLOAD_URL . $subdir . '/' . $name;
    }
    return null;
}
