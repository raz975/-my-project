<?php
require_once "../config/init.php";

try {
    requireAdmin($pdo);

    $stmt = $pdo->prepare(
        "SELECT id, code, name, is_active
         FROM languages
         ORDER BY id ASC"
    );
    $stmt->execute();
    $languages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($languages as &$l) {
        $l["id"] = (int)$l["id"];
        $l["is_active"] = (int)$l["is_active"];
    }

    echo json_encode([
        "success" => true,
        "languages" => $languages
    ]);

} catch (PDOException $e) {
    error_log("admin/languages.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}