// ===== CONSTANTS =====
const ROWS = 14;
const COLS = 16;
let itsOver = false;

// Types of squares
const FLOOR = 0;
const WALL = 1;
const BREAKABLE = 2;
const PLAYER = 3;

// Grid
let divs = [];
let grid = [];

let gamePaused = false;

// ===== MAP GENERATION =====
function map() {
    const gameGrid = document.getElementById("Grid");
    for (let i = 0; i < ROWS; i++) {
        grid[i] = [];
        divs[i] = [];
        for (let j = 0; j < COLS; j++) {
            const div = document.createElement('div');

            if (isPlayerStart(i, j)) {
                div.classList.add("floor");
                grid[i].push(3);
            } else {
                generateCell(div, i, j);
            }
            divs[i].push(div);
            gameGrid.append(div);
        }
    }
}

function isPlayerStart(i, j) {
    return (i === player.x && j === player.y);
}

function isvalidPosition(x, y, forEnemy = false) {
    return (
        x >= 0 &&
        y >= 0 &&
        x < grid.length &&
        y < grid[x].length &&
        grid[x][y] !== WALL &&
        grid[x][y] !== BREAKABLE &&
        (!forEnemy || Math.abs(x - player.x) > 2 || Math.abs(y - player.y) > 2)
    );
}

function generateCell(div, i, j) {
    if (i === 0 || i === ROWS - 1 || j === 0 || j === COLS - 1) {
        div.classList.add("wall");
        grid[i].push(1);
    } else if (i % 2 === 0 && j % 2 === 0) {
        div.classList.add("wall");
        grid[i].push(1);
    } else if (Math.random() < 0.4 && !(
        (i === player.x && j === player.y + 1) ||
        (i === player.x + 1 && j === player.y) ||
        (i === player.x + 1 && j === player.y + 1)
    )) {
        div.classList.add("breakable");
        grid[i].push(2);
    } else {
        div.classList.add("floor");
        grid[i].push(0);
    }
}

// ===== WIN / GAME OVER =====
function winGame() {
    itsOver = true;
    gamePaused = true;

    const winScreen = document.querySelector(".you-won");
    const blur = document.getElementsByTagName("main")[0];

    blur.style.filter = "blur(5px)";
    winScreen.style.display = "block";

    document
        .getElementById("restart-win")
        .addEventListener("click", () => location.reload());
}

function gameOver() {
    player.lives = 0;
    const gameover = document.querySelector(".game-over");
    const blur = document.getElementsByTagName("main")[0];
    blur.style.filter = "blur(5px)";
    gameover.style.display = "block";
    itsOver = true;
    const restart = document.getElementById("restart");
    restart.addEventListener("click", () => location.reload());
}

// ===== TIMER =====
const clock = {
    div: document.getElementById("time"),
    time: 200,
    interval: null
};

clock.interval = setInterval(() => {
    if (!gamePaused && !itsOver) {
        clock.time--;
        clock.div.textContent = clock.time;
        if (clock.time <= 0) {
            clearInterval(clock.interval);
            gameOver();
        }
    }
}, 1000);

function pauseGame() {
    if (!gamePaused) {
        const pauseOverlay = document.getElementById("pause-menu");
        const blur = document.getElementsByTagName("main")[0];
        blur.style.filter = "blur(5px)";
        pauseOverlay.style.display = "block";
        gamePaused = true;
        if (bombPlaced && bombTimerId !== null) {
            const elapsed = Date.now() - bombStartTime;
            bombRemaining -= elapsed;
            clearTimeout(bombTimerId);
            bombTimerId = null;
        }
        document.getElementById("restart-pause").addEventListener("click", () => location.reload());
        document.getElementById("resume").addEventListener("click", () => pauseGame());
    } else {
        const pauseOverlay = document.getElementById("pause-menu");
        const blur = document.getElementsByTagName("main")[0];
        blur.style.filter = "blur(0px)";
        pauseOverlay.style.display = "none";
        gamePaused = false;
        if (bombPlaced && bombRemaining > 0) {
            bombStartTime = Date.now();
            bombTimerId = setTimeout(explodeBombWrapper, bombRemaining);
        }
    }
}

// ===== GAME LOOP =====
function gameloop() {
    if (!gamePaused && !itsOver) {
        bombeAnimation();
        handleinput();
        movePlayer();
        enemies.forEach(enemy => updateEnemy(enemy));
        cleanupEnemies();
        if (enemies.length === 0) {
            winGame();
            return;
        }
    }
    requestAnimationFrame(gameloop);
}

 
    map();
    spawnMultipleEnemies(5);
    requestAnimationFrame(gameloop);
