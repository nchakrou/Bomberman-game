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

const animation = [2, -30, -65];

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

    grid[player.x][player.y] = FLOOR;
    grid[1][1] = PLAYER;
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

document.addEventListener("keydown", (e) => {
    if (player.lives <= 0 || gamePaused || itsOver) return;

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
    if (itsOver) return;
    if (e.key === 'Escape') {
        pauseGame();
        return;
    }
    if (e.key === 'ArrowUp' || e.key === 'w') keys.up = false;
    if (e.key === 'ArrowDown' || e.key === 's') keys.down = false;
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
});