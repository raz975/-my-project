<?php
require_once "../config/init.php";

try {
    $langCode = $_GET["lang"] ?? null;

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

    $search = trim($_GET["search"] ?? "");

    $sql = "
        SELECT
            posts.id,
            posts.title AS original_title,
            posts.content AS original_content,
            posts.user_id,
            posts.created_at,
            users.name AS author
        FROM posts
        JOIN users ON users.id = posts.user_id
    ";

    $params = [];

    if ($search !== "") {
        $sql .= " WHERE posts.title LIKE ? OR posts.content LIKE ? ";
        $searchParam = "%" . $search . "%";
        $params[] = $searchParam;
        $params[] = $searchParam;
    }

    $sql .= " ORDER BY posts.id DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Подгружаем переводы активного языка
    if ($langId > 0 && count($posts) > 0) {
        $ids = array_map(fn($p) => (int)$p["id"], $posts);
        $placeholders = implode(",", array_fill(0, count($ids), "?"));

        $stmt = $pdo->prepare("
            SELECT post_id, title, content
            FROM post_translations
            WHERE language_id = ? AND post_id IN ($placeholders)
        ");
        $stmt->execute(array_merge([$langId], $ids));
        $translations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $translationsByPost = [];
        foreach ($translations as $t) {
            $translationsByPost[(int)$t["post_id"]] = [
                "title" => $t["title"],
                "content" => $t["content"]
            ];
        }

        foreach ($posts as &$post) {
            $pid = (int)$post["id"];
            if (isset($translationsByPost[$pid])) {
                $post["title"] = $translationsByPost[$pid]["title"];
                $post["content"] = $translationsByPost[$pid]["content"];
            } else {
                $post["title"] = $post["original_title"];
                $post["content"] = $post["original_content"];
            }
            unset($post["original_title"], $post["original_content"]);
        }
        unset($post);
    } else {
        foreach ($posts as &$post) {
            $post["title"] = $post["original_title"];
            $post["content"] = $post["original_content"];
            unset($post["original_title"], $post["original_content"]);
        }
        unset($post);
    }

    echo json_encode([
        "success" => true,
        "posts" => $posts,
        "language" => $activeLang ? $activeLang["code"] : "ru"
    ]);

} catch (PDOException $e) {
    error_log("getAll.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}