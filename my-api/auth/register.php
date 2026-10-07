<?php
require_once "../config/init.php";

try {
    $data = getJsonInput();

    $name = trim($data["name"] ?? "");
    $email = trim($data["email"] ?? "");
    $password = $data["password"] ?? "";

    if ($name === "" || $email === "" || $password === "") {
        jsonError("All fields are required", 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonError("Invalid email format", 400);
    }

    if (strlen($password) < 6) {
        jsonError("Password must be at least 6 characters", 400);
    }

    if (strlen($name) < 2) {
        jsonError("Name must be at least 2 characters", 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        jsonError("Email already exists", 409);
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM users");
    $stmt->execute();
    $userCount = (int)$stmt->fetch(PDO::FETCH_ASSOC)["cnt"];

    $role = $userCount === 0 ? "admin" : "user";

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare(
        "INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$name, $email, $hash, $role]);

    echo json_encode([
        "success" => true,
        "message" => "Registration successful",
        "role" => $role
    ]);

} catch (PDOException $e) {
    error_log("register.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}