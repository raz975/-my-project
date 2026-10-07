<?php
require_once "../config/init.php";

try {
    requireAdmin($pdo);
    $data = getJsonInput();

    $code = trim($data["code"] ?? "");
    $name = trim($data["name"] ?? "");

    if ($code === "" || $name === "") {
        jsonError("Code and name are required", 400);
    }

    if (!preg_match('/^[a-z]{2,5}$/', $code)) {
        jsonError("Code must be 2-5 lowercase letters", 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM languages WHERE code = ?");
    $stmt->execute([$code]);

    if ($stmt->fetch()) {
        jsonError("Language with this code already exists", 409);
    }

    $stmt = $pdo->prepare(
        "INSERT INTO languages (code, name, is_active) VALUES (?, ?, 0)"
    );
    $stmt->execute([$code, $name]);

    echo json_encode([
        "success" => true,
        "message" => "Language created",
        "id" => (int)$pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    error_log("admin/create-language.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}