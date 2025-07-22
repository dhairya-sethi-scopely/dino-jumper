const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over");
const finalScoreText = document.getElementById("final-score");

let score = 0;
let highScore = 0;
let highScoreName = "System";
let isGameOver = false;
let timer;

// Start the game
startGame();
fetchHighScore();

// Handle jump
document.body.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isGameOver) jump();
});

function jump() {
  if (!player.classList.contains("jump")) {
    player.classList.add("jump");
    setTimeout(() => player.classList.remove("jump"), 500);
  }
}

function checkCollision() {
  const playerBox = player.getBoundingClientRect();
  const obstacleBox = obstacle.getBoundingClientRect();

  const isColliding = !(
    playerBox.top > obstacleBox.bottom ||
    playerBox.bottom < obstacleBox.top ||
    playerBox.right < obstacleBox.left ||
    playerBox.left > obstacleBox.right
  );

  if (isColliding) {
    endGame();
  }
}

function updateScore() {
  if (!isGameOver) {
    score++;
    scoreText.innerText = "Score: " + score;
  }
}

function endGame() {
  isGameOver = true;
  clearInterval(timer);
  obstacle.style.animationPlayState = "paused";

  finalScoreText.innerText = `You survived for ${score} seconds.`;

  // If player beat high score, submit it
  if (score > highScore) {
    console.log("score ---", score);
    console.log("highScore ---", highScore);
    const name = prompt("🎉 New High Score! Enter your name:");
    if (name) {
      console.log("name ---", name);
      submitScore(name);
    }
  }

  // Refresh high score display
  fetchHighScore();

  gameOverScreen.classList.remove("hidden");
}

function startGame() {
  setInterval(() => {
    checkCollision();
  }, 10);

  timer = setInterval(() => {
    updateScore();
  }, 1000);
}

function fetchHighScore() {
  return fetch("get_high_score.php")
    .then(res => res.json())
    .then(data => {
      highScore = data.score;
      highScoreName = data.name;
      highScoreText.innerText = `High Score: ${highScoreName} - ${highScore}s`;
    });
}

function submitScore(name) {
  console.log("score submit 1");
  return fetch("submit_score.php", {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `name=${encodeURIComponent(name)}&score=${score}`
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      console.log("Response received from submit_score.php");
      return res.json();
    })
    .then(data => {
      console.log("Data returned from server:", data);
      if (data.status === "ok") {
        alert("✅ Score submitted!");
        location.reload();
      } else {
        console.log("Score not stored. Server response:", data);
        alert("❌ Failed to submit score.");
      }
    })
    .catch(err => {
      console.error("Error submitting score:", err);
      alert("❌ Error submitting score.");
    });
}

fetchHighScore().then(() => {
  startGame();
});
