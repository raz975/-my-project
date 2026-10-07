<?php
require_once "../config/init.php";

error_log("=== CREATE.PHP ===");
error_log("Session ID: " . session_id());
error_log("Session data: " . print_r($_SESSION, true));

if (!isset($_SESSION["user_id"])) {
    error_log("CREATE.PHP - No user_id in session");
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "error" => "Unauthorized"
    ]);
    exit;
}

$userId = (int)$_SESSION["user_id"];
error_log("CREATE.PHP - User ID: " . $userId);

$data = getJsonInput();

$title = trim(htmlspecialchars(strip_tags($data["title"] ?? ""), ENT_QUOTES, 'UTF-8'));
$content = trim(htmlspecialchars(strip_tags($data["content"] ?? ""), ENT_QUOTES, 'UTF-8'));

if ($title === "" || $content === "") {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Title and content are required"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare(
        "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)"
    );
    $stmt->execute([$title, $content, $userId]);
    
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Post created",
        "id" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    error_log("CREATE.PHP - Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ]);
    exit;
}