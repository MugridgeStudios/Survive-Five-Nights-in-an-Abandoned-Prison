const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let night = 1;
let health = 100;
let eventText = "All quiet...";
let doorClosed = false;
let lightOn = true;

const nightEl = document.getElementById('night');
const healthEl = document.getElementById('health');
const eventEl = document.getElementById('event');

const events = [
    "Chains rattling in the hallway...",
    "Shadow moves near the cell...",
    "Footsteps echo...",
    "A cell door slams!",
    "Whispers surround you..."
];

// Player and monster
const player = {x: 50, y: 300, size: 20};
const monster = {x: 500, y: 50, size: 20};

// Draw map
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rooms
    ctx.fillStyle = "#333";
    ctx.fillRect(100, 50, 400, 300);

    // Player
    ctx.fillStyle = "lime";
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Monster (hidden if door is closed)
    if (!doorClosed) {
        ctx.fillStyle = "red";
        ctx.fillRect(monster.x, monster.y, monster.size, monster.size);
    }

    // Door indicator
    ctx.fillStyle = doorClosed ? "gray" : "yellow";
    ctx.fillRect(480, 200, 20, 60);
}

// Move monster randomly
function moveMonster() {
    const dx = Math.random() * 4 - 2;
    const dy = Math.random() * 4 - 2;
    monster.x = Math.min(Math.max(monster.x + dx, 100), 480);
    monster.y = Math.min(Math.max(monster.y + dy, 50), 330);
}

// Event handler
function randomEvent() {
    return events[Math.floor(Math.random() * events.length)];
}

// Check if monster catches player
function checkCollision() {
    const dx = player.x - monster.x;
    const dy = player.y - monster.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    if (distance < 20 && !doorClosed) {
        health -= 20;
        healthEl.textContent = health;
        eventEl.textContent = "Monster caught you!";
        if (health <= 0) {
            alert("Game Over! You were caught!");
            resetGame();
        }
    }
}

// Reset game
function resetGame() {
    health = 100;
    night = 1;
    nightEl.textContent = night;
    healthEl.textContent = health;
    player.x = 50;
    player.y = 300;
    monster.x = 500;
    monster.y = 50;
}

// Control player
document.addEventListener('keydown', (e) => {
    const speed = 5;
    if (e.key === "ArrowUp") player.y -= speed;
    if (e.key === "ArrowDown") player.y += speed;
    if (e.key === "ArrowLeft") player.x -= speed;
    if (e.key === "ArrowRight") player.x += speed;

    player.x = Math.max(100, Math.min(player.x, 480));
    player.y = Math.max(50, Math.min(player.y, 330));
});

// Buttons
document.getElementById('toggleDoor').addEventListener('click', () => {
    doorClosed = !doorClosed;
    eventEl.textContent = doorClosed ? "Door closed!" : "Door opened!";
});

document.getElementById('toggleLight').addEventListener('click', () => {
    lightOn = !lightOn;
    canvas.style.backgroundColor = lightOn ? "#111" : "#000";
});

// Night progression
function nextNight() {
    if (night < 5) {
        night++;
        nightEl.textContent = night;
        eventEl.textContent = `Night ${night} begins!`;
        health = Math.min(health + 20, 100);
        healthEl.textContent = health;
    } else {
        alert("Congratulations! You survived all 5 nights!");
        resetGame();
    }
}

// Game loop
function gameLoop() {
    drawMap();
    moveMonster();
    checkCollision();
    requestAnimationFrame(gameLoop);
}

// Auto end night every 40 seconds
setInterval(nextNight, 40000);

gameLoop();
