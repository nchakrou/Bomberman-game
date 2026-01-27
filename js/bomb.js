let bombPlaced = false;
let bombSize = 1;
let bombDuration = 2000;
let bombRemaining = 0;
let bombStartTime = 0;
let bombTimerId = null;
let bomvDiv = null
let bombX = player.x;
let bombY = player.y;

// ==== BOMBE ET EXPLOSION ====
function plantBomb() {
    bombPlaced = true;
    bombSize = 1;
    bombStartTime = Date.now();
    bombRemaining = bombDuration;
    bombX = player.x;
    bombY = player.y;
    const cell = divs[bombX][bombY];
    bombDiv = document.createElement('div');
    bombDiv.classList.add('bomb');
    cell.appendChild(bombDiv);

    bombTimerId = setTimeout(explodeBombWrapper, bombRemaining);
}

function explodeBombWrapper() {
    explodeBomb(bombX, bombY);

    if (bombDiv) {
        bombDiv.remove();
        bombDiv = null;
    }

    bombPlaced = false;
    bombTimerId = null;
    bombRemaining = 0;
}

function explodeBomb(x, y) {
    createFire(x, y, '', true);
    createFire(x - 1, y, 'left', false);
    createFire(x + 1, y, 'right', false);
    createFire(x, y - 1, 'up', false);
    createFire(x, y + 1, 'down', false);
}

function createFire(x, y, direction, stop) {
    if (x < 0 || y < 0 || x >= ROWS || y >= COLS) return;

    const cell = divs[x][y];

    // Supprime bombe si présente
    const bombDiv = cell.querySelector('.bomb');
    if (bombDiv) bombDiv.remove();

    // Mur solide bloque explosion
    if (grid[x][y] === WALL) {
        return;
    } else if (!stop) {
        if (direction === 'right') {
            createFire(x + 1, y, direction, true);
        } else if (direction === 'left') {
            createFire(x - 1, y, direction, true);
        } else if (direction === 'up') {
            createFire(x, y - 1, direction, true);
        } else if (direction === 'down') {
            createFire(x, y + 1, direction, true);
        }
    }

    // Mur cassable détruit
    if (grid[x][y] === BREAKABLE) {
        cell.classList.remove("breakable");
        cell.classList.add("floor");
        grid[x][y] = FLOOR;
    }

    // Ennemi touché
    enemies.forEach(enemy => {
        if (enemy.x === x && enemy.y === y && enemy.alive) {
            enemy.alive = false;
            let scoreEl = document.getElementById("score");
            scoreEl.textContent = parseInt(scoreEl.textContent) + 10;
        }
    });

    // Crée le feu
    const fireDiv = document.createElement('div');
    fireDiv.classList.add('fire');
    cell.appendChild(fireDiv);

    setTimeout(() => fireDiv.remove(), 500);

    // Player hit by fire
    if (player.x === x && player.y === y && player.canHit) {
        loseLife();


    }
}

// ==== THROTTLE FUNCTION ====
function trottel(fn, delay) {
    let timer;
    return function (playerX, playerY) {
        if (!timer) {
            fn(playerX, playerY);
            timer = setTimeout(() => {
                divs[playerX][playerY].classList.remove("bomb");
                timer = null;
            }, delay);
        }
    };
}

const trothle = trottel(plantBomb, 2000);

let bombAnimation = false

function bombeAnimation() {
    if (bombPlaced) {
        const bomb = document.querySelector('.bomb');
        if (bombSize >= 2) {
            bombAnimation = false
        } else if (bombSize <= 1) {
            bombAnimation = true
        }
        if (bombAnimation) {
            bombSize += 1 / 30
        } else {
            bombSize -= 1 / 30
        }
        if (bomb) {
            bomb.style.scale = `${bombSize}`
        }
    }
}

// ==== INITIALISATION ====

map();
spawnMultipleEnemies(5);
requestAnimationFrame(gameloop);