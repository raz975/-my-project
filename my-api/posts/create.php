<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);
    $data = getJsonInput();

    $title = trim($data["title"] ?? "");
    $content = trim($data["content"] ?? "");

    if ($title === "" || $content === "") {
        jsonError("Title and content are required", 400);
    }

    $stmt = $pdo->prepare(
        "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)"
    );
    $stmt->execute([$title, $content, (int)$user["id"]]);

    $postId = (int)$pdo->lastInsertId();

    if (!empty($data["translations"]) && is_array($data["translations"])) {
        $stmt = $pdo->prepare("
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

            $stmt->execute([$postId, $langMap[$code], $tTitle, $tContent]);
        }
    }

    echo json_encode([
        "success" => true,
        "message" => "Post created",
        "id" => $postId
    ]);

} catch (PDOException $e) {
    error_log("create.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}