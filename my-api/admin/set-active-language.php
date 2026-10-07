<?php
require_once "../config/init.php";

try {
    requireAdmin($pdo);
    $data = getJsonInput();

    $id = (int)($data["id"] ?? 0);

    if ($id <= 0) {
        jsonError("Invalid language id", 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM languages WHERE id = ?");
    $stmt->execute([$id]);

    if (!$stmt->fetch()) {
        jsonError("Language not found", 404);
    }

    $pdo->exec("UPDATE languages SET is_active = 0");

    $stmt = $pdo->prepare("UPDATE languages SET is_active = 1 WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        "success" => true,
        "message" => "Active language set"
    ]);

} catch (PDOException $e) {
    error_log("admin/set-active-language.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}