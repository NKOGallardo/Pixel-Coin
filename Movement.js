
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const scoreDisplay = document.getElementById("score");
    const livesDisplay = document.getElementById("lives");
    const timerDisplay = document.getElementById("timer");
    const endScreen = document.getElementById("end-screen");
    const finalScoreDisplay = document.getElementById("final-score");
    const bestScoreDisplay = document.getElementById("best-score");

    const tileSize = 8;
    const gridSize = canvas.width / tileSize;

    let score = 0;
    let lives = 3;
    let timeLeft = 60;
    let paused = false;

    const player = { x: 4, y: 4, color: "red" };
    let coin = spawnCoin();
    const enemies = [spawnEnemy()];

    function spawnCoin() {
      let x, y;
      do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
      } while (x === player.x && y === player.y);
      return { x, y, color: "yellow" };
    }

    function spawnEnemy() {
      let x, y;
      do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
      } while ((x === player.x && y === player.y) || (x === coin.x && y === coin.y));
      return { x, y, color: "lime" };
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = player.color;
      ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
      ctx.fillStyle = coin.color;
      ctx.fillRect(coin.x * tileSize, coin.y * tileSize, tileSize, tileSize);
      enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x * tileSize, e.y * tileSize, tileSize, tileSize);
      });
    }

    function updateHearts() {
      livesDisplay.textContent = "❤️".repeat(lives);
    }

    function movePlayer(dir) {
      if (paused || lives <= 0 || timeLeft <= 0) return;
      if (dir === "up" && player.y > 0) player.y--;
      if (dir === "down" && player.y < gridSize - 1) player.y++;
      if (dir === "left" && player.x > 0) player.x--;
      if (dir === "right" && player.x < gridSize - 1) player.x++;
      checkCoin(); checkEnemy(); draw();
    }

    function move(dir) { movePlayer(dir); }

    function checkCoin() {
      if (player.x === coin.x && player.y === coin.y) {
        score++;
        scoreDisplay.textContent = score;
        coin = spawnCoin();
        if (score % 3 === 0) enemies.push(spawnEnemy());
      }
    }

    function checkEnemy() {
      for (const e of enemies) {
        if (player.x === e.x && player.y === e.y) {
          lives--;
          updateHearts();
          if (lives <= 0) endGame("Game Over!");
        }
      }
    }

    function moveEnemies() {
      if (paused || lives <= 0 || timeLeft <= 0) return;
      enemies.forEach(e => {
        const dirs = ["up", "down", "left", "right"];
        const d = dirs[Math.floor(Math.random() * dirs.length)];
        if (d === "up" && e.y > 0) e.y--;
        if (d === "down" && e.y < gridSize - 1) e.y++;
        if (d === "left" && e.x > 0) e.x--;
        if (d === "right" && e.x < gridSize - 1) e.x++;
      });
      checkEnemy(); draw();
    }

    function countdown() {
      if (paused || lives <= 0 || timeLeft <= 0) return;
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      if (timeLeft <= 0) endGame("⏱ Time's up!");
    }

    function togglePause() {
      paused = !paused;
      document.querySelector(".pause-btn").textContent = paused ? "▶ Resume" : "⏸ Pause";
    }

    function endGame(message) {
      clearInterval(enemyInterval);
      clearInterval(timerInterval);

      finalScoreDisplay.textContent = score;

      const best = localStorage.getItem("highscore") || 0;
      if (score > best) {
        localStorage.setItem("highscore", score);
      }
      bestScoreDisplay.textContent = localStorage.getItem("highscore");
      document.getElementById("end-message").textContent = message;
      endScreen.style.display = "flex";
    }

    function restartGame() {
      location.reload();
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") move("up");
      if (e.key === "ArrowDown") move("down");
      if (e.key === "ArrowLeft") move("left");
      if (e.key === "ArrowRight") move("right");
    });

    // Init
    draw(); updateHearts();
    const enemyInterval = setInterval(moveEnemies, 1000);
    const timerInterval = setInterval(countdown, 1000);