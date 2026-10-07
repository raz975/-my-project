<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();
    $id = (int)($data["id"] ?? 0);

    if ($id <= 0) {
        jsonError("Invalid post id", 400);
    }

    $stmt = $pdo->prepare("SELECT id, user_id FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        jsonError("Post not found", 404);
    }

    $isOwner = (int)$post["user_id"] === (int)$user["id"];
    $isAdmin = $user["role"] === "admin";

    if (!$isOwner && !$isAdmin) {
        jsonError("You can delete only your own posts", 403);
    }

    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        "success" => true,
        "message" => "Post deleted"
    ]);

} catch (PDOException $e) {
    error_log("delete.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}