<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $postId = (int)($data["post_id"] ?? 0);
    $content = trim($data["content"] ?? "");

    if ($postId <= 0) {
        jsonError("Invalid post id", 400);
    }
    if ($content === "") {
        jsonError("Comment cannot be empty", 400);
    }
    if (strlen($content) > 1000) {
        jsonError("Comment too long (max 1000)", 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM posts WHERE id = ?");
    $stmt->execute([$postId]);
    if (!$stmt->fetch()) {
        jsonError("Post not found", 404);
    }

    $stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)");
    $stmt->execute([$postId, (int)$user["id"], $content]);

    echo json_encode([
        "success" => true,
        "message" => "Comment created",
        "id" => (int)$pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    error_log("comments/create.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}