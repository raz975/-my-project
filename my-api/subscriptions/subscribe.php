<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $targetId = (int)($data["user_id"] ?? 0);

    if ($targetId <= 0) {
        jsonError("Invalid user id", 400);
    }
    if ($targetId === (int)$user["id"]) {
        jsonError("Cannot subscribe to yourself", 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$targetId]);
    if (!$stmt->fetch()) {
        jsonError("User not found", 404);
    }

    $stmt = $pdo->prepare("INSERT IGNORE INTO subscriptions (follower_id, following_id) VALUES (?, ?)");
    $stmt->execute([(int)$user["id"], $targetId]);

    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM subscriptions WHERE following_id = ?");
    $stmt->execute([(int)$user["id"]]);
    $followers = (int)$stmt->fetch(PDO::FETCH_ASSOC)["cnt"];

    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM subscriptions WHERE follower_id = ?");
    $stmt->execute([(int)$user["id"]]);
    $following = (int)$stmt->fetch(PDO::FETCH_ASSOC)["cnt"];

    echo json_encode([
        "success" => true,
        "subscribed" => true,
        "followers" => $followers,
        "following" => $following
    ]);

} catch (PDOException $e) {
    error_log("subscribe.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}