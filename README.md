# Bomberman Web Game

A classic Bomberman clone built with HTML, CSS, and JavaScript.

## 🎮 Gameplay

Navigate the grid, plant bombs to destroy breakable walls, defeat enemies, and survive! You start with 3 lives and 200 seconds on the clock.

### Features

- **Grid-based Movement**: Smooth player and enemy animations.
- **Destructible Environment**: Use bombs to clear breakable walls.
- **Enemies**: Avoid enemies or blow them up to gain points (+10 per enemy).
- **Mechanics**:
  - Bombs explode in a cross pattern (up, down, left, right).
  - Explosions destroy breakable walls and enemies.
  - Player has a temporary invincibility period after losing a life.
- **HUD**: Real-time tracking of Lives, Score, and Time.

## 🕹️ Controls

| Action         | Keys                     |
| :------------- | :----------------------- |
| **Move Up**    | `↑` (Arrow Up) or `W`    |
| **Move Down**  | `↓` (Arrow Down) or `S`  |
| **Move Left**  | `←` (Arrow Left) or `A`  |
| **Move Right** | `→` (Arrow Right) or `D` |
| **Plant Bomb** | `Spacebar`               |
| **Pause Game** | `Escape`                 |

## 🛠️ Setup & Execution

Since the game is built with purely static files (HTML, CSS, JS), no build process or server is strictly required to play it locally, though using a local server is recommended to avoid CORS issues if loading local assets dynamically.

1. **Clone or Download** the repository.
2. **Open** `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

### Project Structure

- `index.html`: The main entry point containing the game structure and HUD.
- `css/style.css`: All styling, including the glassmorphism and neon animations.
- `js/main.js`: Core game loop, grid generation, and game state management (win/loss).
- `js/player.js`: Player movement, input handling, and life management.
- `js/bomb.js`: Bomb planting, explosion logic, fire propagation, and collision with walls/enemies/player.
- `js/enemies.js`: Enemy spawning, movement, and animation handling.
- Visual assets (images) are located in the root directory.
