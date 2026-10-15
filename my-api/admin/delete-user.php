<?php
require_once "../config/init.php";

try {
    $admin = requireAdmin($pdo);
    $data = getJsonInput();

    $userId = (int)($data["user_id"] ?? 0);

    if ($userId <= 0) {
        jsonError("Invalid user id", 400);
    }

    if ($userId === (int)$admin["id"]) {
        jsonError("You cannot delete yourself", 403);
    }

    $stmt = $pdo->prepare("SELECT id, name FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $target = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$target) {
        jsonError("User not found", 404);
    }

    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$userId]);

    echo json_encode([
        "success" => true,
        "message" => "User deleted"
    ]);

} catch (PDOException $e) {
    error_log("admin/delete-user.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}