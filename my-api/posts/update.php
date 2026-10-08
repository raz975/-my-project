<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $id = (int)($data["id"] ?? 0);
    $title = trim($data["title"] ?? "");
    $content = trim($data["content"] ?? "");

    if ($id <= 0 || $title === "" || $content === "") {
        jsonError("Invalid data", 400);
    }

    $stmt = $pdo->prepare("SELECT id, user_id FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        jsonError("Post not found", 404);
    }

    $isOwner = (int)$post["user_id"] === (int)$user["id"];
    $isAdmin = $user["role"] === "admin";

    if (!$isOwner && !$isAdmin) {
        jsonError("You can edit only your own posts", 403);
    }

    $stmt = $pdo->prepare("UPDATE posts SET title = ?, content = ? WHERE id = ?");
    $stmt->execute([$title, $content, $id]);

    if (!empty($data["translations"]) && is_array($data["translations"])) {
        $stmtTrans = $pdo->prepare("
            INSERT INTO post_translations (post_id, language_id, title, content)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)
        ");

        $langMap = [];
        $stmtLang = $pdo->query("SELECT id, code FROM languages");
        foreach ($stmtLang->fetchAll(PDO::FETCH_ASSOC) as $l) {
            $langMap[$l["code"]] = (int)$l["id"];
        }

        foreach ($data["translations"] as $code => $tr) {
            if (!isset($langMap[$code])) continue;

            $tTitle = trim($tr["title"] ?? "");
            $tContent = trim($tr["content"] ?? "");
            if ($tTitle === "" || $tContent === "") continue;

            $stmtTrans->execute([$id, $langMap[$code], $tTitle, $tContent]);
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Post updated"
    ]);

} catch (PDOException $e) {
    error_log("update.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}