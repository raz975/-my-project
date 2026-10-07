<?php
require_once "../config/init.php";

try {
    $data = getJsonInput();

    $name = trim($data["name"] ?? "");
    $email = trim($data["email"] ?? "");
    $password = $data["password"] ?? "";

    if ($name === "" || $email === "" || $password === "") {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => "All fields are required"
        ]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => "Invalid email format"
        ]);
        exit;
    }

    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => "Password must be at least 6 characters"
        ]);
        exit;
    }

    if (strlen($name) < 2) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "error" => "Name must be at least 2 characters"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "error" => "Email already exists"
        ]);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare(
        "INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, 'user')"
    );

    $stmt->execute([$name, $email, $hash]);

    echo json_encode([
        "success" => true,
        "message" => "Registration successful"
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database error occurred"
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Server error occurred"
    ]);
    exit;
}