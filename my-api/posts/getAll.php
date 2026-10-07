<?php
require_once "../config/init.php";

try {
    $stmt = $pdo->query(
        "SELECT 
            posts.id,
            posts.title,
            posts.content,
            posts.user_id,
            posts.created_at,
            users.name AS author
        FROM posts
        JOIN users ON users.id = posts.user_id
        ORDER BY posts.id DESC"
    );

    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($posts as &$post) {
        $post['title'] = htmlspecialchars($post['title'], ENT_QUOTES, 'UTF-8');
        $post['content'] = htmlspecialchars($post['content'], ENT_QUOTES, 'UTF-8');
        $post['author'] = htmlspecialchars($post['author'], ENT_QUOTES, 'UTF-8');
    }

    echo json_encode([
        "success" => true,
        "posts" => $posts
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error occurred"]);
    exit;
}