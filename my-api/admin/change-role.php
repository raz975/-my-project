<?php
require_once "../config/init.php";

try {
    $admin = requireAdmin($pdo);
    $data = getJsonInput();

    $userId = (int)($data["user_id"] ?? 0);
    $newRole = trim($data["role"] ?? "");

    if ($userId <= 0) {
        jsonError("Invalid user id", 400);
    }

    if (!in_array($newRole, ["user", "admin"], true)) {
        jsonError("Role must be 'user' or 'admin'", 400);
    }

    if ($userId === (int)$admin["id"]) {
        jsonError("You cannot change your own role", 403);
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$userId]);

    if (!$stmt->fetch()) {
        jsonError("User not found", 404);
    }

    $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
    $stmt->execute([$newRole, $userId]);

    echo json_encode([
        "success" => true,
        "message" => "Role changed to " . $newRole,
        "role" => $newRole
    ]);

} catch (PDOException $e) {
    error_log("admin/change-role.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}