<?php
require_once "../config/init.php";

try {
    $postId = (int)($_GET["post_id"] ?? 0);

    if ($postId <= 0) {
        jsonError("Invalid post id", 400);
    }

    $stmt = $pdo->prepare(
        "SELECT id, file_name, original_name, mime_type, file_size
         FROM post_images
         WHERE post_id = ?
         ORDER BY id DESC
         LIMIT 1"
    );
    $stmt->execute([$postId]);
    $img = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$img) {
        echo json_encode([
            "success" => true,
            "image" => null
        ]);
        exit;
    }

    echo json_encode([
        "success" => true,
        "image" => [
            "id" => (int)$img["id"],
            "file_name" => $img["file_name"],
            "url" => "/uploads/" . $img["file_name"],
            "mime_type" => $img["mime_type"],
            "file_size" => (int)$img["file_size"]
        ]
    ]);

} catch (PDOException $e) {
    error_log("images/get.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}