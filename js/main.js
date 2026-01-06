// ==== CONFIG ====
const ROWS = 11;
const COLS = 13;

// ==== PLAYER ====
const player = {
    x: 1,
    y: 1,
    lives: 3
};

// ==== GRID ====
let grid = [];

// ==== TYPES ====
const WALL = "wall";
const BREAKABLE = "breakable";
const FLOOR = "floor";

// ==== INITIALISATION DE LA GRID ====
function map() {
    const gridd = document.getElementById("Grid");
    for (let i = 0; i < ROWS; i++) {
        grid[i] = [];
        for (let j = 0; j < COLS; j++) {
            const div = document.createElement('div');

            // Joueur
            if (isPlayerStart(i, j)) {
                div.classList.add(FLOOR, "player");
            } else {
                generateCell(div, i, j);
            }

            grid[i].push(div);
            gridd.appendChild(div);
        }
    }
}

// ==== POSITION INITIALE DU JOUEUR ====
function isPlayerStart(i, j) {
    return (i === player.x && j === player.y);
}

// ==== CREATION DES CASES ====
function generateCell(div, i, j) {
    if (i === 0 || i === ROWS - 1 || j === 0 || j === COLS - 1) {
        div.classList.add(WALL);
    } else if (i % 2 === 0 && j % 2 === 0) {
        div.classList.add(WALL);
    } else if (Math.random() < 0.4) {
        div.classList.add(BREAKABLE);
    } else {
        div.classList.add(FLOOR);
        if (Math.random() < 0.1) div.classList.add("enimies");
    }
}

// ==== TIMER ====
let timer = setInterval(() => {
    const timeEl = document.getElementById("time");
    timeEl.textContent = parseInt(timeEl.textContent) - 1;
    if (timeEl.textContent <= 0) {
        clearInterval(timer);
        gameOver();
    }
}, 1000);

// ==== GAME OVER ====
function gameOver() {
    player.lives = 0;
    const gameover = document.querySelector(".game-over");
    const blur = document.getElementsByTagName("main")[0];
    const p = document.getElementsByClassName("player")[0];
    if (p) p.classList.remove("player");
    blur.style.filter = "blur(5px)";
    gameover.style.display = "block";

    const restart = document.getElementById("restart");
    restart.addEventListener("click", () => location.reload());
}

// ==== GESTION DES VIES ====
function loseLife() {
    player.lives--;
    document.getElementById("lives").textContent = player.lives;
    if (player.lives <= 0) gameOver();
}

// ==== MOUVEMENT DU JOUEUR ====
document.addEventListener("keydown", (e) => {
    if (player.lives <= 0) return;

    if (e.key === ' ') {
        plantBomb();
        return;
    }

    let x = player.x;
    let y = player.y;

    if (e.key === 'ArrowUp' || e.key === 'w') x--;
    if (e.key === 'ArrowDown' || e.key === 's') x++;
    if (e.key === 'ArrowLeft' || e.key === 'a') y--;
    if (e.key === 'ArrowRight' || e.key === 'd') y++;

    movePlayer(x, y);
});

function movePlayer(x, y) {
    if (x < 0 || y < 0 || x >= ROWS || y >= COLS) return;

    const target = grid[x][y];
    if (target.classList.contains(WALL) || target.classList.contains(BREAKABLE) || target.querySelector(".bomb")) return;

    grid[player.x][player.y].classList.remove("player");
    target.classList.add("player");

    player.x = x;
    player.y = y;
}

// ==== BOMBE ET EXPLOSION ====
function plantBomb() {
    const bombX = player.x;
    const bombY = player.y;
    const cell = grid[bombX][bombY];

    if (cell.querySelector('.bomb')) return;

    const bombDiv = document.createElement('div');
    bombDiv.classList.add('bomb');
    cell.appendChild(bombDiv);

    // Explosion après 3 secondes avec coordonnées fixes
    setTimeout(() => explodeBomb(bombX, bombY), 3000);
}

function explodeBomb(x, y) {
    // Explosion centrale + croix
    createFire(x, y);
    createFire(x - 1, y);
    createFire(x + 1, y);
    createFire(x, y - 1);
    createFire(x, y + 1);
}

function createFire(x, y) {
    if (x < 0 || y < 0 || x >= ROWS || y >= COLS) return;

    const cell = grid[x][y];

    // Supprime bombe si présente
    const bombDiv = cell.querySelector('.bomb');
    if (bombDiv) bombDiv.remove();

    // Mur solide bloque explosion
    if (cell.classList.contains(WALL)) return;

    // Mur cassable détruit
    if (cell.classList.contains(BREAKABLE)) {
        cell.classList.remove(BREAKABLE);
        cell.classList.add(FLOOR);
    }

    // Ennemi touché
    if (cell.classList.contains("enimies")) {
        cell.classList.remove("enimies");
        let scoreEl = document.getElementById("score");
        scoreEl.textContent = parseInt(scoreEl.textContent) + 10; // +10 points
    }

    // Crée le feu
    const fireDiv = document.createElement('div');
    fireDiv.classList.add('fire');
    cell.appendChild(fireDiv);

    setTimeout(() => fireDiv.remove(), 500);

    // Vérifie si le joueur est touché
    if (player.x === x && player.y === y) loseLife();
}

// ==== INITIALISATION ====
map();
