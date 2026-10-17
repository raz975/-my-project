<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $userId = (int)$user["id"];

    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM subscriptions WHERE following_id = ?");
    $stmt->execute([$userId]);
    $followers = (int)$stmt->fetch(PDO::FETCH_ASSOC)["cnt"];

    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM subscriptions WHERE follower_id = ?");
    $stmt->execute([$userId]);
    $following = (int)$stmt->fetch(PDO::FETCH_ASSOC)["cnt"];

    $stmt = $pdo->prepare("
        SELECT COUNT(*) AS cnt FROM post_likes pl
        JOIN posts p ON p.id = pl.post_id
        WHERE p.user_id = ?
    ");
    $stmt->execute([$userId]);
    $likesReceived = (int)$stmt->fetch(PDO::FETCH_ASSOC)["cnt"];

    $stmt = $pdo->prepare("
        SELECT
            p.id,
            p.title,
            p.content,
            p.created_at,
            (SELECT file_name FROM post_images WHERE post_id = p.id ORDER BY id DESC LIMIT 1) AS image_file
        FROM posts p
        WHERE p.user_id = ?
        ORDER BY p.id DESC
    ");
    $stmt->execute([$userId]);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($posts as &$post) {
        $post["id"] = (int)$post["id"];
        $post["image_url"] = $post["image_file"] ? "/uploads/" . $post["image_file"] : null;
        unset($post["image_file"]);
    }
    unset($post);

    echo json_encode([
        "success" => true,
        "profile" => [
            "id" => $userId,
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"],
            "followers" => $followers,
            "following" => $following,
            "likes_received" => $likesReceived,
            "posts" => $posts
        ]
    ]);

} catch (PDOException $e) {
    error_log("getMyProfile.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}