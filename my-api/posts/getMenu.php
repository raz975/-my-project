<?php
require_once '../config/init.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);

    echo json_encode([
        "success" => false,
        "message" => "Method not allowed"
    ]);

    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Unauthorized"
    ]);

    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT
            id,
            name,
            url,
            parent_id,
            user_id,
            sort_order,
            is_active
        FROM menu_items
        WHERE is_active = 1
        ORDER BY sort_order ASC, id ASC
    ");

    $stmt->execute();

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    function buildTree(array $elements, $parentId = null)
    {
        $branch = [];

        foreach ($elements as $element) {
            if ($element['parent_id'] == $parentId) {
                $element['children'] = buildTree(
                    $elements,
                    $element['id']
                );

                $branch[] = $element;
            }
        }

        return $branch;
    }

    $menuTree = buildTree($items);

    echo json_encode([
        "success" => true,
        "menu" => $menuTree
    ]);

} catch (PDOException $e) {
    error_log(
        "getMenu.php: " .
        $e->getMessage()
    );

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "message" => "Database error"
    ]);
}