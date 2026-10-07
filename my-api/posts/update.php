<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $id = (int)($data["id"] ?? 0);
    $title = trim($data["title"] ?? "");
    $content = trim($data["content"] ?? "");

    if ($id <= 0 || $title === "" || $content === "") {
        jsonError("Invalid data", 400);
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
        jsonError("You can edit only your own posts", 403);
    }

    $stmt = $pdo->prepare("UPDATE posts SET title = ?, content = ? WHERE id = ?");
    $stmt->execute([$title, $content, $id]);

    echo json_encode([
        "success" => true,
        "message" => "Post updated"
    ]);

} catch (PDOException $e) {
    error_log("update.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}