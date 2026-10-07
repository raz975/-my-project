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

    echo json_encode([
        "success" => true,
        "message" => "Post created",
        "id" => (int)$pdo->lastInsertId()
    ]);

} catch (PDOException $e) {
    error_log("create.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}