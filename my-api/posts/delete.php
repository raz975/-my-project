<?php
require_once "../config/init.php";

try {
    $userId = requireAuth();
    $data = getJsonInput();
    $id = (int)($data["id"] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid post id"]);
        exit;
    }

    $stmt = $pdo->prepare(
        "DELETE FROM posts WHERE id = ? AND user_id = ?"
    );
    $stmt->execute([$id, $userId]);

    if ($stmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode(["error" => "You can delete only your own posts"]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "message" => "Post deleted"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error occurred"]);
    exit;
}