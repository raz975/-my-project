<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $postId = (int)($data["post_id"] ?? 0);

    if ($postId <= 0) {
        jsonError("Invalid post id", 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM posts WHERE id = ?");
    $stmt->execute([$postId]);
    if (!$stmt->fetch()) {
        jsonError("Post not found", 404);
    }

    $userId = (int)$user["id"];

    $stmt = $pdo->prepare("SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?");
    $stmt->execute([$postId, $userId]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        $stmt = $pdo->prepare("DELETE FROM post_likes WHERE id = ?");
        $stmt->execute([(int)$existing["id"]]);
        $liked = false;
    } else {
        $stmt = $pdo->prepare("INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)");
        $stmt->execute([$postId, $userId]);
        $liked = true;
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM post_likes WHERE post_id = ?");
    $stmt->execute([$postId]);
    $count = (int)$stmt->fetch(PDO::FETCH_ASSOC)["cnt"];

    echo json_encode([
        "success" => true,
        "liked" => $liked,
        "likes" => $count
    ]);

} catch (PDOException $e) {
    error_log("like.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}