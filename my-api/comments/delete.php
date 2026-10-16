<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $id = (int)($data["id"] ?? 0);

    if ($id <= 0) {
        jsonError("Invalid id", 400);
    }

    $stmt = $pdo->prepare("
        SELECT c.id, c.user_id, p.user_id AS post_owner_id
        FROM comments c
        JOIN posts p ON p.id = c.post_id
        WHERE c.id = ?
    ");
    $stmt->execute([$id]);
    $comment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$comment) {
        jsonError("Comment not found", 404);
    }

    $isAuthor = (int)$comment["user_id"] === (int)$user["id"];
    $isPostOwner = (int)$comment["post_owner_id"] === (int)$user["id"];
    $isAdmin = $user["role"] === "admin";

    if (!$isAuthor && !$isPostOwner && !$isAdmin) {
        jsonError("You cannot delete this comment", 403);
    }

    $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        "success" => true,
        "message" => "Comment deleted"
    ]);

} catch (PDOException $e) {
    error_log("comments/delete.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}