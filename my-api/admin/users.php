<?php
require_once "../config/init.php";

try {
    $admin = requireAdmin($pdo);

    $stmt = $pdo->prepare(
        "SELECT id, name, email, role, is_blocked
         FROM users
         ORDER BY id ASC"
    );
    $stmt->execute();

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($users as &$u) {
        $u["id"] = (int)$u["id"];
        $u["is_blocked"] = (int)$u["is_blocked"];
    }

    echo json_encode([
        "success" => true,
        "users" => $users,
        "current_admin_id" => (int)$admin["id"]
    ]);

} catch (PDOException $e) {
    error_log("admin/users.php error: " . $e->getMessage());
    jsonError("Database error occurred", 500);
}