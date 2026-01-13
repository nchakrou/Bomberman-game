// ==== CONFIG ====
const ROWS = 13;
const COLS = 15;

// ==== PLAYER ====
const player = {
    x: 1,
    y: 1,
    top: 40,
    left: 40,
    lives: 3,
    canHit :true,
    invisible : false

};
const playerMovment = {
    isMoving: false,
    top: 40,
    left: 40,
    div: document.getElementById("player"),
    index: 0,
    delay: 5
}
const keys = {
    up: false,
    down: false,
    left: false,
    right: false
};

// ==== GRID ====
let divs = [];
let grid = [];

// ==== TYPES ====
const FLOOR = 0;
const WALL = 1;
const BREAKABLE = 2;
const PLAYER = 3;
let enemies = [];
const animation = [2, -30, -65];

// ==== INITIALISATION DE LA GRID ====
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

// ==== POSITION INITIALE DU JOUEUR ====
function isPlayerStart(i, j) {
    return (i === player.x && j === player.y);
}
function isNearPlayer(x, y) {
    return Math.abs(x - player.x) <= 2 &&
           Math.abs(y - player.y) <= 2
}

function isvalidPosition(x, y, forEnemy = false) {
    const nearPlayerCheck = forEnemy ? !isNearPlayer(x, y) : true;
    return (
        x >= 0 &&
        y >= 0 &&
        x < grid.length &&
        y < grid[x].length &&
        grid[x][y] !== WALL &&
        grid[x][y] !== BREAKABLE &&
        nearPlayerCheck
    )
}
// ==== CREATION DES CASES ====
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

function spawnEnemy(x, y) {
    if (!isvalidPosition(x, y)) return

    const enemy = createEnemy(x, y)
    enemies.push(enemy)
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
    blur.style.filter = "blur(5px)";
    gameover.style.display = "block";

    const restart = document.getElementById("restart");
    restart.addEventListener("click", () => location.reload());
}

// ==== GESTION DES VIES ====
function loseLife() {
    if (!player.canHit) return   

    player.lives--
    document.getElementById("lives").textContent = player.lives;

    player.canHit = false
    player.invincible = true

    playerMovment.div.classList.add("invincible")

    if (player.lives <= 0){
        gameOver()
        return
    }

    player.x = 1
    player.y = 1
    player.left = 40
    player.top = 40
    playerMovment.left = 40
    playerMovment.top = 40
    playerMovment.div.style.transform =
        `translateX(${player.left}px) translateY(${player.top}px)`

    setTimeout(() => {
        player.canHit = true
        player.invisible = false
        playerMovment.div.classList.remove("invincible")
    }, 3000)
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
        console.log("hhh");

        const pauseOverlay = document.getElementById("pause-menu");
        const blur = document.getElementsByTagName("main")[0];
        blur.style.filter = "blur(0px)";
        pauseOverlay.style.display = "none";
        gamePaused = false;
    }
    const resumeButton = document.getElementById("resume");
}
const trothle = trottel(plantBomb, 2000)
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

    // Hna fin kayn taghyir: Update state blast pending
    if (e.key === 'ArrowUp' || e.key === 'w') keys.up = true;
    if (e.key === 'ArrowDown' || e.key === 's') keys.down = true;
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
});

// Zedt had l Listener bach n3rfo imta l button thiyyd
document.addEventListener("keyup", (e) => {
    if (e.key === 'ArrowUp' || e.key === 'w') keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's') keys.down = false;
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
});
function playerAnimation() {
    if (playerMovment.delay >= 10) {
        if (playerMovment.index >= animation.length) {
            playerMovment.index = 0;
        }
        playerMovment.div.style.backgroundPositionX = `${animation[playerMovment.index]}px`;
        playerMovment.index++;
        playerMovment.delay = 0;
    }
    playerMovment.delay++;
}
function movePlayer() {
    if (!playerMovment.isMoving) return;
    playerAnimation();
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
    playerMovment.div.style.transform = `translateX(${player.left}px) translateY(${player.top}px)`
}

// ==== BOMBE ET EXPLOSION ====
function plantBomb() {
    const bombX = player.x;
    const bombY = player.y;
    const cell = divs[bombX][bombY]; // Bomb is a visual element


    const bombDiv = document.createElement('div');
    bombDiv.classList.add('bomb');
    cell.appendChild(bombDiv);

    setTimeout(() => explodeBomb(bombX, bombY), 1750);
}

function explodeBomb(x, y) {
    createFire(x, y);
    createFire(x - 1, y);
    createFire(x + 1, y);
    createFire(x, y - 1);
    createFire(x, y + 1);
}

function createFire(x, y) {
    if (x < 0 || y < 0 || x >= ROWS || y >= COLS) return;

    const cell = divs[x][y];

    // Supprime bombe si présente
    const bombDiv = cell.querySelector('.bomb');
    if (bombDiv) bombDiv.remove();

    // Mur solide bloque explosion
    if (cell.classList.contains(WALL)) return;

    // Mur cassable détruit
    if (grid[x][y] === BREAKABLE) {
        cell.classList.remove("breakable");
        cell.classList.add("floor");
        grid[x][y] = FLOOR
    }

    // Ennemi touché
    if (cell.classList.contains("enemy")) {
        cell.classList.remove("enemy");
        enemies.forEach(enemy => {
            if (enemy.x === x && enemy.y === y && player.canHit) {
                enemy.alive = false;
            }
        });
        let scoreEl = document.getElementById("score");
        scoreEl.textContent = parseInt(scoreEl.textContent) + 10; // +10 points
    }

    // Crée le feu
    const fireDiv = document.createElement('div');
    fireDiv.classList.add('fire');
    cell.appendChild(fireDiv);

    setTimeout(() => fireDiv.remove(), 500);

    if (player.x === x && player.y === y) {
        loseLife();
        grid[player.x][player.y] = FLOOR
        grid[1][1] = PLAYER
        player.x = 1
        player.y = 1
    }
}

// ==== INITIALISATION ====
map();
function spawnMultipleEnemies(count) {
    let spawned = 0;

    while (spawned < count) {
        let x = Math.floor(Math.random() * ROWS);
        let y = Math.floor(Math.random() * COLS);
    if (
    isvalidPosition(x, y, true) && 
    !divs[x][y].classList.contains("enemy")
) {
    spawnEnemy(x, y);
    spawned++;
}
    }
}
function createEnemy(x, y) {
    const div = document.createElement("div")
    div.classList.add("enemy")
    document.getElementById("Grid").appendChild(div)
    div.style.transform = `translate(${y * 40}px, ${x * 40}px)`
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
    }
}

spawnMultipleEnemies(5)
function updateEnemy(enemy) {
    if (!enemy.alive) return

    

    if (!enemy.isMoving ) {
        const directions = [
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 }
        ]

        let valid = directions.filter(d =>
            isvalidPosition(enemy.x + d.dx, enemy.y + d.dy)
        )

        if (valid.length === 0) return

        const dir = valid[Math.floor(Math.random() * valid.length)]

        enemy.x += dir.dx
        enemy.y += dir.dy

        enemy.targetTop = enemy.x * 40
        enemy.targetLeft = enemy.y * 40

        enemy.isMoving = true
    }

    if (enemy.top < enemy.targetTop) enemy.top += 1
    else if (enemy.top > enemy.targetTop) enemy.top -= 1
    else if (enemy.left < enemy.targetLeft) enemy.left += 1
    else if (enemy.left > enemy.targetLeft) enemy.left -= 1
    else enemy.isMoving = false

    enemy.div.style.transform =
        `translate(${enemy.left}px, ${enemy.top}px)`

    if (enemy.x === player.x && enemy.y === player.y && player.canHit) {
        loseLife()
    }
}

function trottel(fn, delay) {
    let timer;
    return function (playerX, playerY) {
        if (!timer) {
            fn(playerX, playerY)
            timer = setTimeout(() => {
                divs[playerX][playerY].classList.remove("bomb")
                timer = null
            }, delay)

        }
    }

}
function gameloop() {

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
    }
    requestAnimationFrame(gameloop);
}
requestAnimationFrame(gameloop)