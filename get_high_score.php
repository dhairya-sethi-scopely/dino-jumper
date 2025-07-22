<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
include 'db_config.php';

// Fetch high score from DB
$result = $conn->query("SELECT name, score, created_at FROM high_score WHERE id = 1");

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode($row);
} else {
    echo json_encode(["status" => "error", "message" => "No high score found"]);
}

$conn->close();
?>
