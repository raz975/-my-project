<?php
require_once "../config/init.php";

try {
    $id = (int)($_GET["id"] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid post id"]);
        exit;
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
        http_response_code(404);
        echo json_encode(["error" => "Post not found"]);
        exit;
    }

    $post['title'] = htmlspecialchars($post['title'], ENT_QUOTES, 'UTF-8');
    $post['content'] = htmlspecialchars($post['content'], ENT_QUOTES, 'UTF-8');
    $post['author'] = htmlspecialchars($post['author'], ENT_QUOTES, 'UTF-8');

    echo json_encode([
        "success" => true,
        "post" => $post
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error occurred"]);
    exit;
}