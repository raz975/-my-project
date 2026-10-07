<?php
require_once "../config/init.php";

try {
    $user = requireAuth($pdo);

    if (!isset($_FILES["image"])) {
        jsonError("No file uploaded", 400);
    }

    $file = $_FILES["image"];
    $postId = (int)($_POST["post_id"] ?? 0);

    if ($postId <= 0) {
        jsonError("Invalid post id", 400);
    }

    $stmt = $pdo->prepare("SELECT id, user_id FROM posts WHERE id = ?");
    $stmt->execute([$postId]);
    $post = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$post) {
        jsonError("Post not found", 404);
    }

    $isOwner = (int)$post["user_id"] === (int)$user["id"];
    $isAdmin = $user["role"] === "admin";

    if (!$isOwner && !$isAdmin) {
        jsonError("You can only add images to your own posts", 403);
    }

    if ($file["error"] !== UPLOAD_ERR_OK) {
        jsonError("Upload error code: " . $file["error"], 400);
    }

    $maxSize = 5 * 1024 * 1024;
    if ($file["size"] > $maxSize) {
        jsonError("File too large (max 5 MB)", 400);
    }

    $allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file["tmp_name"]);
    finfo_close($finfo);

    if (!in_array($mime, $allowedTypes, true)) {
        jsonError("Only JPEG, PNG, GIF, WEBP allowed", 400);
    }

    $ext = pathinfo($file["name"], PATHINFO_EXTENSION);
    if ($ext === "") {
        $ext = "jpg";
    }
    $ext = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $ext));
    $fileName = "post_{$postId}_" . time() . "_" . bin2hex(random_bytes(4)) . "." . $ext;

    $uploadDir = __DIR__ . "/../uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $targetPath = $uploadDir . $fileName;

    if (!move_uploaded_file($file["tmp_name"], $targetPath)) {
        jsonError("Failed to save file", 500);
    }

    $stmt = $pdo->prepare("SELECT id, file_name FROM post_images WHERE post_id = ?");
    $stmt->execute([$postId]);
    $oldImages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($oldImages as $old) {
        $oldPath = $uploadDir . $old["file_name"];
        if (is_file($oldPath)) {
            @unlink($oldPath);
        }
    }

    $stmt = $pdo->prepare("DELETE FROM post_images WHERE post_id = ?");
    $stmt->execute([$postId]);

    $stmt = $pdo->prepare(
        "INSERT INTO post_images (post_id, file_name, original_name, mime_type, file_size)
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([
        $postId,
        $fileName,
        $file["name"],
        $mime,
        (int)$file["size"]
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Image uploaded",
        "image" => [
            "id" => (int)$pdo->lastInsertId(),
            "file_name" => $fileName,
            "url" => "/uploads/" . $fileName
        ]
    ]);

} catch (PDOException $e) {
    error_log("images/upload.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}