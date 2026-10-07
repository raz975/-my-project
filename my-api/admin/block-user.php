<?php
require_once "../config/init.php";

try {
    $admin = requireAdmin($pdo);
    $data = getJsonInput();

    $userId = (int)($data["user_id"] ?? 0);
    $isBlocked = (int)($data["is_blocked"] ?? 0);

    if ($userId <= 0) {
        jsonError("Invalid user id", 400);
    }

    if ($userId === (int)$admin["id"]) {
        jsonError("You cannot block yourself", 403);
    }

    $stmt = $pdo->prepare(
        "SELECT id, role FROM users WHERE id = ?"
    );
    $stmt->execute([$userId]);
    $target = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$target) {
        jsonError("User not found", 404);
    }

    $newValue = $isBlocked === 1 ? 1 : 0;

    $stmt = $pdo->prepare(
        "UPDATE users SET is_blocked = ? WHERE id = ?"
    );
    $stmt->execute([$newValue, $userId]);

    echo json_encode([
        "success" => true,
        "message" => $newValue === 1 ? "User blocked" : "User unblocked",
        "is_blocked" => $newValue
    ]);

} catch (PDOException $e) {
    error_log("admin/block-user.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}