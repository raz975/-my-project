<?php
require_once "../config/init.php";

try {
    $id = (int)($_GET["id"] ?? 0);

    if ($id <= 0) {
        jsonError("Invalid post id", 400);
    }

    $stmt = $pdo->prepare(
        "SELECT 
            posts.id,
            posts.title,
            posts.content,
            posts.user_id,
            posts.created_at,
            users.name AS author
        FROM posts
        JOIN users ON users.id = posts.user_id
        WHERE posts.id = ?"
    );
    $stmt->execute([$id]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        jsonError("Post not found", 404);
    }

    echo json_encode([
        "success" => true,
        "post" => $post
    ]);

} catch (PDOException $e) {
    error_log("getOne.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}