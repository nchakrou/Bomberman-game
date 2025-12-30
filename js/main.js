let grid = []
let player = {
    x: 0,
    y: 0,
    lives: 3
}
map()
function map() {
    const gridd = document.getElementById("Grid")
    for (let i = 0; i < 11; i++) {
        grid[i] = [];
        for (let j = 0; j < 13; j++) {
            const div = document.createElement('div')
            div.className = 'cell'
            div.classList.add('floor')
            if (i == 0 && j == 0) {
                div.classList.add('player')
            }
            grid[i].push(div)
            gridd.append(div)
        }

    }
}

let timer = setInterval(() => {
    const time = document.getElementById("time")
    time.textContent = time.textContent - 10
    if (time.textContent <= 0) {
        clearInterval(timer)
        gameOver()
    }
}, 1000)

function gameOver() {

}

function plantBomb() {
    grid[player.x][player.y].classList.add("bomb")
}
const bombe = trottel(plantBomb, 3000)
document.addEventListener("keydown", (move) => {
    if (move.key === ' ') {
        bombe(player.x, player.y)
        return
    }
    let x = player.x;
    let y = player.y;

    if (move.key === 'ArrowUp' || move.key === 'w') x--;
    if (move.key === 'ArrowDown' || move.key === 's') x++;
    if (move.key === 'ArrowLeft' || move.key === 'a') y--;
    if (move.key === 'ArrowRight' || move.key === 'd') y++;
    renderPlayer(x, y)
})
function renderPlayer(x, y) {
    if ((x < 0 || y < 0) || (x >= grid.length || y >= grid[x].length)) {
        return
    }

    console.log(x, y);
    if (grid[x][y].classList.contains("bomb")) {
        return
    }
    grid[player.x][player.y].classList.remove("player")
    grid[x][y].classList.add("player")
    player.x = x
    player.y = y
}
function trottel(fn, delay) {
    let timer;
    return function (playerX, playerY) {
        if (!timer) {
            fn(playerX, playerY)
            timer = setTimeout(() => {
                grid[playerX][playerY].classList.remove("bomb")
                timer = null
            }, delay)

        }
    }

}
