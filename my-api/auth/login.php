<?php
require_once "../config/init.php";

try {
    $data = getJsonInput();

    $email = trim($data["email"] ?? "");
    $password = $data["password"] ?? "";

    if ($email === "" || $password === "") {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => "Email and password are required"
        ]);
        exit;
    }

    $stmt = $pdo->prepare(
        "SELECT id, name, email, password, role
         FROM users
         WHERE email = ?"
    );

    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "error" => "Invalid email or password"
        ]);
        exit;
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
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error occurred"
    ]);
    exit;
}