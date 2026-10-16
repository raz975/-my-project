<?php
require_once "../config/init.php";

try {
    $postId = (int)($_GET["post_id"] ?? 0);

    if ($postId <= 0) {
        jsonError("Invalid post id", 400);
    }

    $currentUserId = isset($_SESSION["user_id"]) ? (int)$_SESSION["user_id"] : 0;

    $sql = "
        SELECT
            c.id,
            c.post_id,
            c.user_id,
            c.content,
            c.created_at,
            c.updated_at,
            u.name AS author,
            (SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id) AS likes,
            " . ($currentUserId > 0
                ? "(SELECT COUNT(*) FROM comment_likes WHERE comment_id = c.id AND user_id = " . $currentUserId . ") AS liked_by_me"
                : "0 AS liked_by_me") . "
        FROM comments c
        JOIN users u ON u.id = c.user_id
        WHERE c.post_id = ?
        ORDER BY c.id DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$postId]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($comments as &$c) {
        $c["id"] = (int)$c["id"];
        $c["post_id"] = (int)$c["post_id"];
        $c["user_id"] = (int)$c["user_id"];
        $c["likes"] = (int)$c["likes"];
        $c["liked_by_me"] = (int)$c["liked_by_me"];
    }
    unset($c);

    echo json_encode([
        "success" => true,
        "comments" => $comments
    ]);

} catch (PDOException $e) {
    error_log("comments/list.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}