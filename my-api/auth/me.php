<?php
require_once "../config/init.php";

try {
    if (!isset($_SESSION["user_id"])) {
        jsonError("Unauthorized", 401);
    }

    $user = getCurrentUser($pdo);

    if (!$user) {
        jsonError("Unauthorized", 401);
    }

    echo json_encode([
        "success" => true,
        "user" => [
            "id" => (int)$user["id"],
            "name" => $user["name"],
            "email" => $user["email"],
            "role" => $user["role"],
            "is_blocked" => (int)$user["is_blocked"]
        ]
    ]);

} catch (Exception $e) {
    error_log("me.php error: " . $e->getMessage());
    jsonError("Unauthorized", 401);
}