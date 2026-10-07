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
header("Access-Control-Allow-Origin: http://my-api:5173");
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

function requireAuth()
{
    if (!isset($_SESSION["user_id"])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "error" => "Unauthorized"
        ]);
        exit;
    }
    return (int) $_SESSION["user_id"];
}