<?php
require_once '../config/init.php';

try {
    $user = requireAdmin($pdo);
    $method = $_SERVER['REQUEST_METHOD'];
    $data = getJsonInput();

    switch ($method) {

        case 'POST':
            if (empty($data['name'])) {
                jsonError("Name is required", 400);
            }

            $parentId = !empty($data['parent_id']) ? (int)$data['parent_id'] : null;
            $url = !empty($data['url']) ? $data['url'] : null;
            $name = trim($data['name']);

            if ($parentId !== null) {
                $check = $pdo->prepare("SELECT id FROM menu_items WHERE id = ?");
                $check->execute([$parentId]);
                if (!$check->fetch()) {
                    jsonError("Parent menu item not found", 400);
                }
            }

            $stmt = $pdo->query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM menu_items");
            $sortOrder = (int)$stmt->fetch(PDO::FETCH_ASSOC)["next_order"];

            $stmt = $pdo->prepare(
                "INSERT INTO menu_items (name, parent_id, url, user_id, sort_order)
                 VALUES (?, ?, ?, ?, ?)"
            );
            $stmt->execute([$name, $parentId, $url, (int)$user["id"], $sortOrder]);

            $newId = (int)$pdo->lastInsertId();

            if (!empty($data["translations"]) && is_array($data["translations"])) {
                $stmtTrans = $pdo->prepare(
                    "INSERT INTO menu_item_translations (menu_item_id, language_id, name)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE name = VALUES(name)"
                );
                foreach ($data["translations"] as $langId => $transName) {
                    if ($transName !== "") {
                        $stmtTrans->execute([$newId, (int)$langId, trim($transName)]);
                    }
                }
            }

            echo json_encode([
                "success" => true,
                "message" => "Item created",
                "id" => $newId
            ]);
            break;

        case 'PUT':
            $id = (int)($data['id'] ?? 0);
            $name = trim($data['name'] ?? "");

            if ($id <= 0 || $name === "") {
                jsonError("Missing required fields", 400);
            }

            $parentId = !empty($data['parent_id']) ? (int)$data['parent_id'] : null;
            $url = !empty($data['url']) ? $data['url'] : null;

            if ($parentId !== null && $parentId === $id) {
                jsonError("Item cannot be its own parent", 400);
            }

            if ($parentId !== null) {
                $check = $pdo->prepare("SELECT id FROM menu_items WHERE id = ?");
                $check->execute([$parentId]);
                if (!$check->fetch()) {
                    jsonError("Parent menu item not found", 400);
                }
            }

            $stmt = $pdo->prepare(
                "UPDATE menu_items SET name = ?, parent_id = ?, url = ? WHERE id = ?"
            );
            $stmt->execute([$name, $parentId, $url, $id]);

            if (!empty($data["translations"]) && is_array($data["translations"])) {
                $stmtTrans = $pdo->prepare(
                    "INSERT INTO menu_item_translations (menu_item_id, language_id, name)
                     VALUES (?, ?, ?)
                     ON DUPLICATE KEY UPDATE name = VALUES(name)"
                );
                foreach ($data["translations"] as $langId => $transName) {
                    if ($transName !== "") {
                        $stmtTrans->execute([$id, (int)$langId, trim($transName)]);
                    }
                }
            }

            echo json_encode([
                "success" => true,
                "message" => "Item updated"
            ]);
            break;

        case 'DELETE':
            $id = (int)($data['id'] ?? 0);

            if ($id <= 0) {
                jsonError("Missing ID", 400);
            }

            $stmt = $pdo->prepare("DELETE FROM menu_items WHERE id = ?");
            $stmt->execute([$id]);

            if ($stmt->rowCount() === 0) {
                jsonError("Menu item not found", 404);
            }

            echo json_encode([
                "success" => true,
                "message" => "Item deleted"
            ]);
            break;

        default:
            jsonError("Method not allowed", 405);
    }

} catch (PDOException $e) {
    error_log("manageMenu.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}