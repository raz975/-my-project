<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $commentId = (int)($data["comment_id"] ?? 0);

    if ($commentId <= 0) {
        jsonError("Invalid comment id", 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM comments WHERE id = ?");
    $stmt->execute([$commentId]);
    if (!$stmt->fetch()) {
        jsonError("Comment not found", 404);
    }

    $userId = (int)$user["id"];

    $stmt = $pdo->prepare("SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?");
    $stmt->execute([$commentId, $userId]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        $stmt = $pdo->prepare("DELETE FROM comment_likes WHERE id = ?");
        $stmt->execute([(int)$existing["id"]]);
        $liked = false;
    } else {
        $stmt = $pdo->prepare("INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)");
        $stmt->execute([$commentId, $userId]);
        $liked = true;
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM comment_likes WHERE comment_id = ?");
    $stmt->execute([$commentId]);
    $count = (int)$stmt->fetch(PDO::FETCH_ASSOC)["cnt"];

    echo json_encode([
        "success" => true,
        "liked" => $liked,
        "likes" => $count
    ]);

} catch (PDOException $e) {
    error_log("comments/like.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}