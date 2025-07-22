<?php
include 'db_config.php';

$name = htmlspecialchars($_POST['name']);
$score = (int)$_POST['score'];

if ($name && $score > 0) {
  // Save to scores table
  $stmt = $conn->prepare("INSERT INTO scores (name, score) VALUES (?, ?)");
  $stmt->bind_param("si", $name, $score);
  $stmt->execute();
  $stmt->close();

  // Check if new high score
  $result = $conn->query("SELECT score FROM high_score WHERE id = 1");
  $row = $result->fetch_assoc();
  $currentHigh = (int)$row['score'];

  if ($score > $currentHigh) {
    $stmt = $conn->prepare("UPDATE high_score SET name = ?, score = ?, created_at = NOW() WHERE id = 1");
    $stmt->bind_param("si", $name, $score);
    $stmt->execute();
    $stmt->close();
  }

  echo json_encode(["status" => "ok"]);
} else {
  echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();
?>
