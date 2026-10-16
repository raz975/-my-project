<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $id = (int)($data["id"] ?? 0);
    $content = trim($data["content"] ?? "");

    if ($id <= 0 || $content === "") {
        jsonError("Invalid data", 400);
    }
    if (strlen($content) > 1000) {
        jsonError("Comment too long (max 1000)", 400);
    }

    $stmt = $pdo->prepare("SELECT id, user_id FROM comments WHERE id = ?");
    $stmt->execute([$id]);
    $comment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$comment) {
        jsonError("Comment not found", 404);
    }

    // Редактировать может только автор
    if ((int)$comment["user_id"] !== (int)$user["id"]) {
        jsonError("You can edit only your own comments", 403);
    }

    $stmt = $pdo->prepare("UPDATE comments SET content = ? WHERE id = ?");
    $stmt->execute([$content, $id]);

    echo json_encode([
        "success" => true,
        "message" => "Comment updated"
    ]);

} catch (PDOException $e) {
    error_log("comments/update.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}