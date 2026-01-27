let enemies = [];
const enemyanimation = [0, -40, -80];

// ===== ENEMY CONFIG =====
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

// ===== ENEMY ANIMATION (FOV) =====
function enemyAnimation(enemy) {
    if (enemy.animDelay >= 8) {
        if (enemy.animIndex >= enemyanimation.length) {
            enemy.animIndex = 0;
        }
        enemy.div.style.backgroundPositionX = `${enemyanimation[enemy.animIndex]}px`;

        let posY = 0;
        switch (enemy.direction) {
            case 'down': posY = 0; break;
            case 'left': posY = -40; break;
            case 'right': posY = -80; break;
            case 'up': posY = -120; break;
        }
        enemy.div.style.backgroundPositionY = `${posY}px`;

        enemy.animIndex++;
        enemy.animDelay = 0;
    }
    enemy.animDelay++;
}

// ===== ENEMY MVT =====
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


function cleanupEnemies() {
    enemies = enemies.filter(enemy => enemy.alive);
}