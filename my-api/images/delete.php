<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $postId = (int)($data["post_id"] ?? 0);

    if ($postId <= 0) {
        jsonError("Invalid post id", 400);
    }

    $stmt = $pdo->prepare("SELECT id, user_id FROM posts WHERE id = ?");
    $stmt->execute([$postId]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        jsonError("Post not found", 404);
    }

    $isOwner = (int)$post["user_id"] === (int)$user["id"];
    $isAdmin = $user["role"] === "admin";

    if (!$isOwner && !$isAdmin) {
        jsonError("You can only delete your own post images", 403);
    }

    $stmt = $pdo->prepare("SELECT id, file_name FROM post_images WHERE post_id = ?");
    $stmt->execute([$postId]);
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $uploadDir = __DIR__ . "/../uploads/";

    foreach ($images as $img) {
        $path = $uploadDir . $img["file_name"];
        if (is_file($path)) {
            @unlink($path);
        }
    }

    $stmt = $pdo->prepare("DELETE FROM post_images WHERE post_id = ?");
    $stmt->execute([$postId]);

    echo json_encode([
        "success" => true,
        "message" => "Image(s) deleted"
    ]);

} catch (PDOException $e) {
    error_log("images/delete.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}