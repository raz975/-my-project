<?php
require_once "../config/init.php";

try {
    requireAdmin($pdo);
    $data = getJsonInput();

    $id = (int)($data["id"] ?? 0);
    $name = trim($data["name"] ?? "");

    if ($id <= 0 || $name === "") {
        jsonError("ID and name are required", 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM languages WHERE id = ?");
    $stmt->execute([$id]);

    if (!$stmt->fetch()) {
        jsonError("Language not found", 404);
    }

    $stmt = $pdo->prepare("UPDATE languages SET name = ? WHERE id = ?");
    $stmt->execute([$name, $id]);

    echo json_encode([
        "success" => true,
        "message" => "Language updated"
    ]);

} catch (PDOException $e) {
    error_log("admin/update-language.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}