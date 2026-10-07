<?php
require_once "../config/init.php";

error_log("=== ME.PHP CALLED ===");
error_log("Session ID: " . session_id());
error_log("Session data: " . print_r($_SESSION, true));

try {
    if (!isset($_SESSION["user_id"])) {
        error_log("ME.PHP - No user_id in session");
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "error" => "Unauthorized"
        ]);
        exit;
    }
    
    $userId = (int)$_SESSION["user_id"];
    error_log("ME.PHP - User ID: " . $userId);
    
    $stmt = $pdo->prepare(
        "SELECT id, name, email
         FROM users
         WHERE id = ?"
    );
    
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "error" => "User not found"
        ]);
        exit;
    }
    
    echo json_encode([
        "success" => true,
        "user" => $user
    ]);
    
} catch (Exception $e) {
    error_log("me.php error: " . $e->getMessage());
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "error" => "Unauthorized"
    ]);
    exit;
}