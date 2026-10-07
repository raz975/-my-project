<?php
require_once '../config/init.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError("Method not allowed", 405);
}

try {
    if (!isset($_SESSION['user_id'])) {
        jsonError("Unauthorized", 401);
    }

    // Определяем активный язык
    $langCode = $_GET['lang'] ?? null;

    $activeLang = null;
    if ($langCode) {
        $stmt = $pdo->prepare("SELECT id, code FROM languages WHERE code = ? LIMIT 1");
        $stmt->execute([$langCode]);
        $activeLang = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if (!$activeLang) {
        $stmt = $pdo->query("SELECT id, code FROM languages WHERE is_active = 1 LIMIT 1");
        $activeLang = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    $langId = $activeLang ? (int)$activeLang["id"] : 0;

    // Получаем все пункты меню
    $stmt = $pdo->prepare("
        SELECT id, name, url, parent_id, user_id, sort_order, is_active
        FROM menu_items
        WHERE is_active = 1
        ORDER BY sort_order ASC, id ASC
    ");
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Подгружаем переводы
    if ($langId > 0) {
        $stmt = $pdo->prepare("
            SELECT menu_item_id, name
            FROM menu_item_translations
            WHERE language_id = ?
        ");
        $stmt->execute([$langId]);
        $translations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $translationsByItem = [];
        foreach ($translations as $t) {
            $translationsByItem[(int)$t["menu_item_id"]] = $t["name"];
        }

        foreach ($items as &$item) {
            $itemId = (int)$item["id"];
            $item["display_name"] = $translationsByItem[$itemId] ?? $item["name"];
        }
        unset($item);
    } else {
        foreach ($items as &$item) {
            $item["display_name"] = $item["name"];
        }
        unset($item);
    }

    // Строим дерево (через замыкание — безопаснее, чем function)
    $byParent = [];
    foreach ($items as $it) {
        $p = $it["parent_id"];
        if ($p === null) $p = 0;
        $byParent[$p][] = $it;
    }

    $buildTree = function($parentId) use (&$buildTree, &$byParent) {
        $branch = [];
        if (isset($byParent[$parentId])) {
            foreach ($byParent[$parentId] as $el) {
                $el["children"] = $buildTree((int)$el["id"]);
                $branch[] = $el;
            }
        }
        return $branch;
    };

    $menuTree = $buildTree(0);

    echo json_encode([
        "success" => true,
        "menu" => $menuTree,
        "language" => $activeLang ? $activeLang["code"] : "ru"
    ]);

} catch (PDOException $e) {
    error_log("getMenu.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}