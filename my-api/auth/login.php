<?php
require_once "../config/init.php";

try {
    $data = getJsonInput();

    $email = trim($data["email"] ?? "");
    $password = $data["password"] ?? "";

    if ($email === "" || $password === "") {
        jsonError("Email and password are required", 400);
    }

    $stmt = $pdo->prepare(
        "SELECT id, name, email, password, role, is_blocked
         FROM users
         WHERE email = ?"
    );

    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password"])) {
        jsonError("Invalid email or password", 401);
    }

    if ((int)$user["is_blocked"] === 1) {
        jsonError("Your account has been blocked by administrator", 403);
    }

    $_SESSION["user_id"] = (int)$user["id"];
    $_SESSION["role"] = $user["role"];

    unset($user["password"]);

    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "user" => $user
    ]);

} catch (PDOException $e) {
    error_log("login.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}