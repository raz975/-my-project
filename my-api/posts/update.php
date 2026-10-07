<?php
require_once "../config/init.php";

try {
    $userId = requireAuth();
    $data = getJsonInput();

    $id = (int)($data["id"] ?? 0);
    $title = trim(htmlspecialchars(strip_tags($data["title"] ?? ""), ENT_QUOTES, 'UTF-8'));
    $content = trim(htmlspecialchars(strip_tags($data["content"] ?? ""), ENT_QUOTES, 'UTF-8'));

    if ($id <= 0 || $title === "" || $content === "") {
        http_response_code(400);
        echo json_encode(["error" => "Invalid data"]);
        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT id FROM posts WHERE id = ? AND user_id = ?"
    );
    $stmt->execute([$id, $userId]);

    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(["error" => "You can edit only your own posts"]);
        exit;
    }

    $stmt = $pdo->prepare(
        "UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?"
    );
    $stmt->execute([$title, $content, $id, $userId]);

    echo json_encode([
        "success" => true,
        "message" => "Post updated"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error occurred"]);
    exit;
}