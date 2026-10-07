<?php
require_once "../config/init.php";

try {
    $stmt = $pdo->prepare(
        "SELECT id, code, name
         FROM languages
         WHERE is_active = 1
         LIMIT 1"
    );
    $stmt->execute();
    $lang = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$lang) {
        echo json_encode([
            "success" => true,
            "language" => ["id" => 1, "code" => "ru", "name" => "Русский"]
        ]);
        exit;
    }

    $lang["id"] = (int)$lang["id"];

    echo json_encode([
        "success" => true,
        "language" => $lang
    ]);

} catch (PDOException $e) {
    error_log("languages/active.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}