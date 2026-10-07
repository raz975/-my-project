<?php
require_once "../config/init.php";

try {
    requireAdmin($pdo);
    $data = getJsonInput();

    $id = (int)($data["id"] ?? 0);

    if ($id <= 0) {
        jsonError("Invalid language id", 400);
    }

    $stmt = $pdo->prepare("SELECT id, is_active FROM languages WHERE id = ?");
    $stmt->execute([$id]);
    $lang = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$lang) {
        jsonError("Language not found", 404);
    }

    if ((int)$lang["is_active"] === 1) {
        jsonError("Cannot delete active language. Set another as active first.", 403);
    }

    $stmt = $pdo->prepare("SELECT COUNT(*) AS cnt FROM languages");
    $stmt->execute();
    $count = (int)$stmt->fetch(PDO::FETCH_ASSOC)["cnt"];

    if ($count <= 1) {
        jsonError("Cannot delete the last language", 403);
    }

    $stmt = $pdo->prepare("DELETE FROM languages WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        "success" => true,
        "message" => "Language deleted"
    ]);

} catch (PDOException $e) {
    error_log("admin/delete-language.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}