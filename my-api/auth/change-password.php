<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $oldPassword = $data["old_password"] ?? "";
    $newPassword = $data["new_password"] ?? "";

    if ($oldPassword === "" || $newPassword === "") {
        jsonError("Old and new passwords are required", 400);
    }

    if (strlen($newPassword) < 6) {
        jsonError("New password must be at least 6 characters", 400);
    }

    $stmt = $pdo->prepare(
        "SELECT password FROM users WHERE id = ?"
    );
    $stmt->execute([(int)$user["id"]]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || !password_verify($oldPassword, $row["password"])) {
        jsonError("Old password is incorrect", 401);
    }

    $hash = password_hash($newPassword, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare(
        "UPDATE users SET password = ? WHERE id = ?"
    );
    $stmt->execute([$hash, (int)$user["id"]]);

    echo json_encode([
        "success" => true,
        "message" => "Password changed successfully"
    ]);

} catch (PDOException $e) {
    error_log("change-password.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}