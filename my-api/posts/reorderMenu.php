<?php
require_once "../config/init.php";

try {
    requireAdmin($pdo);
    $data = getJsonInput();

    $items = $data["items"] ?? [];

    if (!is_array($items) || count($items) === 0) {
        jsonError("Items array is required", 400);
    }

    $stmt = $pdo->prepare("UPDATE menu_items SET sort_order = ? WHERE id = ?");

    foreach ($items as $item) {
        $id = (int)($item["id"] ?? 0);
        $sort = (int)($item["sort_order"] ?? 0);
        if ($id > 0) {
            $stmt->execute([$sort, $id]);
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Order saved"
    ]);

} catch (PDOException $e) {
    error_log("reorderMenu.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}