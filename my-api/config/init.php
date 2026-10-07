<?php

error_reporting(0);
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);

ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

$sessionPath = __DIR__ . '/../sessions';
if (!is_dir($sessionPath)) {
    mkdir($sessionPath, 0777, true);
}
session_save_path($sessionPath);

header("Content-Type: application/json; charset=UTF-8");
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    "http://my-api:5173",
    "http://my-api:5174",
    "http://localhost:5173",
    "http://localhost:5174"
];
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

ini_set('session.cookie_path', '/');
ini_set('session.cookie_domain', 'my-api');
ini_set('session.cookie_secure', 0);
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_samesite', 'Lax');
ini_set('session.gc_maxlifetime', 86400);
ini_set('session.save_path', $sessionPath);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . "/database.php";

function getJsonInput()
{
    $data = json_decode(file_get_contents("php://input"), true);
    return is_array($data) ? $data : [];
}

function jsonResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function jsonError($message, $code = 400)
{
    http_response_code($code);
    echo json_encode([
        "success" => false,
        "error" => $message
    ]);
    exit;
}

function getCurrentUser($pdo)
{
    if (!isset($_SESSION["user_id"])) {
        return null;
    }

    $stmt = $pdo->prepare(
        "SELECT id, name, email, role, is_blocked
         FROM users
         WHERE id = ?"
    );
    $stmt->execute([(int)$_SESSION["user_id"]]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        return null;
    }

    if ((int)$user["is_blocked"] === 1) {
        $_SESSION = [];
        session_destroy();
        return null;
    }

    return $user;
}

function requireAuth($pdo)
{
    $user = getCurrentUser($pdo);

    if (!$user) {
        jsonError("Unauthorized", 401);
    }

    return $user;
}

function requireAdmin($pdo)
{
    $user = requireAuth($pdo);

    if ($user["role"] !== "admin") {
        jsonError("Forbidden: admin only", 403);
    }

    return $user;
}

function requireNotBlocked($pdo)
{
    $user = requireAuth($pdo);

    if ((int)$user["is_blocked"] === 1) {
        jsonError("Your account is blocked", 403);
    }

    return $user;
}