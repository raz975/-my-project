<?php
require_once '../config/init.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);

    exit;
}

$userId = (int)$_SESSION['user_id'];

$adminStmt = $pdo->prepare("
    SELECT email
    FROM users
    WHERE id = ?
");

$adminStmt->execute([$userId]);

$currentUser = $adminStmt->fetch(PDO::FETCH_ASSOC);

if (!$currentUser || $currentUser['email'] !== 'admin@gmail.com') {
    http_response_code(403);

    echo json_encode([
        "success" => false,
        "message" => "Only administrator can manage menu"
    ]);

    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

$data = json_decode(
    file_get_contents("php://input"),
    true
);

try {
    switch ($method) {

        case 'POST':

            if (empty($data['name'])) {
                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "Name is required"
                ]);

                break;
            }

            $parentId = !empty($data['parent_id'])
                ? (int)$data['parent_id']
                : null;

            $url = !empty($data['url'])
                ? $data['url']
                : null;

            if ($parentId !== null) {
                $checkParent = $pdo->prepare("
                    SELECT id
                    FROM menu_items
                    WHERE id = ?
                ");

                $checkParent->execute([
                    $parentId
                ]);

                if (!$checkParent->fetch()) {
                    http_response_code(400);

                    echo json_encode([
                        "success" => false,
                        "message" => "Parent menu item not found"
                    ]);

                    break;
                }
            }

            $stmt = $pdo->prepare("
                INSERT INTO menu_items
                (
                    name,
                    parent_id,
                    url,
                    user_id
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?
                )
            ");

            $stmt->execute([
                $data['name'],
                $parentId,
                $url,
                $userId
            ]);

            echo json_encode([
                "success" => true,
                "message" => "Item created successfully",
                "id" => $pdo->lastInsertId()
            ]);

            break;

        case 'PUT':

            if (
                empty($data['id']) ||
                empty($data['name'])
            ) {
                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "Missing required fields"
                ]);

                break;
            }

            $id = (int)$data['id'];

            $parentId = !empty($data['parent_id'])
                ? (int)$data['parent_id']
                : null;

            $url = !empty($data['url'])
                ? $data['url']
                : null;

            if ($parentId !== null && $parentId === $id) {
                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "Item cannot be its own parent"
                ]);

                break;
            }

            if ($parentId !== null) {
                $checkParent = $pdo->prepare("
                    SELECT id
                    FROM menu_items
                    WHERE id = ?
                ");

                $checkParent->execute([
                    $parentId
                ]);

                if (!$checkParent->fetch()) {
                    http_response_code(400);

                    echo json_encode([
                        "success" => false,
                        "message" => "Parent menu item not found"
                    ]);

                    break;
                }
            }

            $stmt = $pdo->prepare("
                UPDATE menu_items
                SET
                    name = ?,
                    parent_id = ?,
                    url = ?
                WHERE id = ?
            ");

            $stmt->execute([
                $data['name'],
                $parentId,
                $url,
                $id
            ]);

            if ($stmt->rowCount() === 0) {
                $check = $pdo->prepare("
                    SELECT id
                    FROM menu_items
                    WHERE id = ?
                ");

                $check->execute([$id]);

                if (!$check->fetch()) {
                    http_response_code(404);

                    echo json_encode([
                        "success" => false,
                        "message" => "Menu item not found"
                    ]);

                    break;
                }
            }

            echo json_encode([
                "success" => true,
                "message" => "Item updated successfully"
            ]);

            break;

        case 'DELETE':

            if (empty($data['id'])) {
                http_response_code(400);

                echo json_encode([
                    "success" => false,
                    "message" => "Missing ID"
                ]);

                break;
            }

            $id = (int)$data['id'];

            $stmt = $pdo->prepare("
                DELETE FROM menu_items
                WHERE id = ?
            ");

            $stmt->execute([
                $id
            ]);

            if ($stmt->rowCount() === 0) {
                http_response_code(404);

                echo json_encode([
                    "success" => false,
                    "message" => "Menu item not found"
                ]);

                break;
            }

            echo json_encode([
                "success" => true,
                "message" => "Item deleted successfully"
            ]);

            break;

        default:

            http_response_code(405);

            echo json_encode([
                "success" => false,
                "message" => "Method not allowed"
            ]);

            break;
    }

} catch (PDOException $e) {
    error_log(
        "manageMenu.php: " .
        $e->getMessage()
    );

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}