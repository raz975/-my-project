<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $name = trim($data["name"] ?? "");
    $email = trim($data["email"] ?? "");

    if ($name === "" || $email === "") {
        jsonError("Name and email are required", 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonError("Invalid email format", 400);
    }

    if (strlen($name) < 2) {
        jsonError("Name must be at least 2 characters", 400);
    }

    $stmt = $pdo->prepare(
        "SELECT id FROM users WHERE email = ? AND id != ?"
    );
    $stmt->execute([$email, (int)$user["id"]]);

    if ($stmt->fetch()) {
        jsonError("Email already exists", 409);
    }

    $stmt = $pdo->prepare(
        "UPDATE users SET name = ?, email = ? WHERE id = ?"
    );
    $stmt->execute([$name, $email, (int)$user["id"]]);

    echo json_encode([
        "success" => true,
        "message" => "Profile updated",
        "user" => [
            "id" => (int)$user["id"],
            "name" => $name,
            "email" => $email,
            "role" => $user["role"],
            "is_blocked" => (int)$user["is_blocked"]
        ]
    ]);

} catch (PDOException $e) {
    error_log("update-profile.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}