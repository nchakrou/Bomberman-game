// length
const ROWS = 13;
const COLS = 15;


const player = {
    x: 1,
    y: 1,
    top: 40,
    left: 40,
    lives: 3,
    canHit: true,
};

const playerMovment = {
    isMoving: false,
    top: 40,
    left: 40,
    div: document.getElementById("player"),
    index: 0,
    delay: 5
};

const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// grid
let divs = [];
let grid = [];

// types of squares
const FLOOR = 0;
const WALL = 1;
const BREAKABLE = 2;
const PLAYER = 3;
let enemies = [];

// animations things
const animation = [2, -30, -65];
const enemyanimation = [0, -40, -80];

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

// checkpoint
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

// randomly creation of wall and floor
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


function createEnemy(x, y) {
    const div = document.createElement("div");
    div.classList.add("enemy");
    document.getElementById("Grid").appendChild(div);
    div.style.transform = `translate(${y * 40}px, ${x * 40}px)`;

    return {
        x,
        y,
        top: x * 40,
        left: y * 40,
        targetTop: x * 40,
        targetLeft: y * 40,
        isMoving: false,
        div,
        alive: true,
        direction: 'down',
        animIndex: 0,
        animDelay: 0,
    };
}

function spawnEnemy(x, y) {
    if (!isvalidPosition(x, y)) return;
    const enemy = createEnemy(x, y);
    enemies.push(enemy);
}

function spawnMultipleEnemies(count) {
    let spawned = 0;

    while (spawned < count) {
        let x = Math.floor(Math.random() * ROWS);
        let y = Math.floor(Math.random() * COLS);

        if (isvalidPosition(x, y, true) && !divs[x][y].classList.contains("enemy")) {
            spawnEnemy(x, y);
            spawned++;
        }
    }
}

function enemyAnimation(enemy) {
    if (enemy.animDelay >= 8) {
        if (enemy.animIndex >= enemyanimation.length) {
            enemy.animIndex = 0;
        }
        enemy.div.style.backgroundPositionX = `${enemyanimation[enemy.animIndex]}px`;

        let posY = 0;
        switch (enemy.direction) {
            case 'down':
                posY = 0;
                break;
            case 'left':
                posY = -40;
                break;
            case 'right':
                posY = -80;
                break;
            case 'up':
                posY = -120;
                break;
        }
        enemy.div.style.backgroundPositionY = `${posY}px`;

        enemy.animIndex++;
        enemy.animDelay = 0;
    }
    enemy.animDelay++;
}

// the new enemie
function updateEnemy(enemy) {
    if (!enemy.alive) {
        enemy.div.remove();
        return;
    }

    if (!enemy.isMoving) {
        const directions = [
            { dx: -1, dy: 0, dir: 'up' },
            { dx: 1, dy: 0, dir: 'down' },
            { dx: 0, dy: -1, dir: 'left' },
            { dx: 0, dy: 1, dir: 'right' }
        ];

        let valid = directions.filter(d =>
            isvalidPosition(enemy.x + d.dx, enemy.y + d.dy)
        );

        if (valid.length === 0) return;

        const dir = valid[Math.floor(Math.random() * valid.length)];

        enemy.x += dir.dx;
        enemy.y += dir.dy;
        enemy.direction = dir.dir;

        enemy.targetTop = enemy.x * 40;
        enemy.targetLeft = enemy.y * 40;

        enemy.isMoving = true;
    }

    if (enemy.top < enemy.targetTop) {
        enemy.top += 1;
        enemy.direction = 'down';
    } else if (enemy.top > enemy.targetTop) {
        enemy.top -= 1;
        enemy.direction = 'up';
    } else if (enemy.left < enemy.targetLeft) {
        enemy.left += 1;
        enemy.direction = 'right';
    } else if (enemy.left > enemy.targetLeft) {
        enemy.left -= 1;
        enemy.direction = 'left';
    } else {
        enemy.isMoving = false;
    }

    if (enemy.isMoving) {
        enemyAnimation(enemy);
    }

    enemy.div.style.transform = `translate(${enemy.left}px, ${enemy.top}px)`;

    if (enemy.x === player.x && enemy.y === player.y && player.canHit) {
        loseLife();
    }
}

let timer = setInterval(() => {
    const timeEl = document.getElementById("time");
    timeEl.textContent = parseInt(timeEl.textContent) - 1;
    if (timeEl.textContent <= 0) {
        clearInterval(timer);
        gameOver();
    }
}, 1000);

function gameOver() {
    player.lives = 0;
    const gameover = document.querySelector(".game-over");
    const blur = document.getElementsByTagName("main")[0];
    blur.style.filter = "blur(5px)";
    gameover.style.display = "block";

    const restart = document.getElementById("restart");
    restart.addEventListener("click", () => location.reload());
}

function loseLife() {
    if (!player.canHit) return;

    player.lives--;
    document.getElementById("lives").textContent = player.lives;

    player.canHit = false;

    playerMovment.div.classList.add("invincible");

    if (player.lives <= 0) {
        gameOver();
        return;
    }

    player.x = 1;
    player.y = 1;
    player.left = 40;
    player.top = 40;
    playerMovment.left = 40;
    playerMovment.top = 40;
    playerMovment.div.style.transform =
        `translateX(${player.left}px) translateY(${player.top}px)`;

    setTimeout(() => {
        player.canHit = true;
        playerMovment.div.classList.remove("invincible");
    }, 3000);
}

let gamePaused = false;

function pauseGame() {
    if (!gamePaused) {
        const pauseOverlay = document.getElementById("pause-menu");
        const blur = document.getElementsByTagName("main")[0];
        blur.style.filter = "blur(5px)";
        pauseOverlay.style.display = "block";
        gamePaused = true;
    } else {
        const pauseOverlay = document.getElementById("pause-menu");
        const blur = document.getElementsByTagName("main")[0];
        blur.style.filter = "blur(0px)";
        pauseOverlay.style.display = "none";
        gamePaused = false;
    }
}

const trothle = trottel(plantBomb, 2000);

function handleinput() {
    if (playerMovment.isMoving) return;

    if (keys.up) {
        if (isvalidPosition(player.x - 1, player.y)) {
            player.x--;
            playerMovment.top -= 40;
            playerMovment.isMoving = true;
        }
    } else if (keys.down) {
        if (isvalidPosition(player.x + 1, player.y)) {
            player.x++;
            playerMovment.top += 40;
            playerMovment.isMoving = true;
        }
    } else if (keys.left) {
        if (isvalidPosition(player.x, player.y - 1)) {
            player.y--;
            playerMovment.left -= 40;
            playerMovment.isMoving = true;
        }
    } else if (keys.right) {
        if (isvalidPosition(player.x, player.y + 1)) {
            player.y++;
            playerMovment.left += 40;
            playerMovment.isMoving = true;
        }
    }
}

document.addEventListener("keydown", (e) => {
    if (player.lives <= 0) return;

    if (e.key === 'Escape') {
        pauseGame();
        return;
    }
    if (e.key === ' ') {
        trothle(player.x, player.y);
        return;
    }

    if (e.key === 'ArrowUp' || e.key === 'w') keys.up = true;
    if (e.key === 'ArrowDown' || e.key === 's') keys.down = true;
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's') keys.down = false;
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
});

// ==== PLAYER ANIMATION ====
function playerAnimation(pla) {
    if (playerMovment.delay >= 10) {
        if (playerMovment.index >= pla.length) {
            playerMovment.index = 0;
        }
        playerMovment.div.style.backgroundPositionX = `${pla[playerMovment.index]}px`;
        playerMovment.index++;
        playerMovment.delay = 0;
    }
    playerMovment.delay++;
}

function movePlayer() {
    if (!playerMovment.isMoving) return;

    playerAnimation(animation);

    if (player.top < playerMovment.top) {
        playerMovment.div.style.backgroundPositionY = `0px`;
        player.top += 2;
    } else if (player.top > playerMovment.top) {
        playerMovment.div.style.backgroundPositionY = `-120px`;
        player.top -= 2;
    } else if (player.left < playerMovment.left) {
        playerMovment.div.style.backgroundPositionY = `-80px`;
        player.left += 2;
    } else if (player.left > playerMovment.left) {
        playerMovment.div.style.backgroundPositionY = `-40px`;
        player.left -= 2;
    } else {
        playerMovment.isMoving = false;
    }

    playerMovment.div.style.transform = `translateX(${player.left}px) translateY(${player.top}px)`;
}

let bombPlaced = false;
let bombSize = 1;
// ==== BOMBE ET EXPLOSION ====
function plantBomb() {
    bombPlaced = true;
 bombSize = 1;
    setTimeout(() => { bombPlaced = false; }, 2000);
    const bombX = player.x;
    const bombY = player.y;
    const cell = divs[bombX][bombY];

    const bombDiv = document.createElement('div');
    bombDiv.classList.add('bomb');
    cell.appendChild(bombDiv);

    setTimeout(() => explodeBomb(bombX, bombY), 2000);
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
    if (cell.classList.contains("wall")) {
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
    if (player.x === x && player.y === y) {
        loseLife();
        grid[player.x][player.y] = FLOOR;
        grid[1][1] = PLAYER;
        player.x = 1;
        player.y = 1;
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

// ==== CLEAN UP DEAD ENEMIES ====
function cleanupEnemies() {
    enemies = enemies.filter(enemy => enemy.alive);
}
let bombAnimation = false
// ==== GAME LOOP ====
function gameloop() {
    const bomb = document.querySelector('.bomb');
    if (bombPlaced) {
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

    if (!gamePaused) {
        handleinput();
        movePlayer();

        if (!playerMovment.isMoving) {
            handleinput();
            if (playerMovment.isMoving) {
                movePlayer();
            }
        }

        enemies.forEach(enemy => updateEnemy(enemy));
        cleanupEnemies();
    }

    requestAnimationFrame(gameloop);
}

// ==== INITIALISATION ====
map();
spawnMultipleEnemies(5);
requestAnimationFrame(gameloop);