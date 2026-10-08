<?php
require_once "../config/init.php";

try {
    $id = (int)($_GET["id"] ?? 0);

    if ($id <= 0) {
        jsonError("Invalid post id", 400);
    }

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

    $stmt = $pdo->prepare("
        SELECT
            posts.id,
            posts.title AS original_title,
            posts.content AS original_content,
            posts.user_id,
            posts.created_at,
            users.name AS author
        FROM posts
        JOIN users ON users.id = posts.user_id
        WHERE posts.id = ?
    ");
    $stmt->execute([$id]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        jsonError("Post not found", 404);
    }

    $title = $post["original_title"];
    $content = $post["original_content"];

    if ($langId > 0) {
        $stmt = $pdo->prepare("
            SELECT title, content
            FROM post_translations
            WHERE post_id = ? AND language_id = ?
            LIMIT 1
        ");
        $stmt->execute([$id, $langId]);
        $trans = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($trans) {
            $title = $trans["title"];
            $content = $trans["content"];
        }
    }

    echo json_encode([
        "success" => true,
        "post" => [
            "id" => (int)$post["id"],
            "title" => $title,
            "content" => $content,
            "user_id" => (int)$post["user_id"],
            "created_at" => $post["created_at"],
            "author" => $post["author"]
        ],
        "language" => $activeLang ? $activeLang["code"] : "ru"
    ]);

} catch (PDOException $e) {
    error_log("getOne.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}