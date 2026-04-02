const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let night = 1;
let health = 100;
let doorClosed = false;
let lightOn = true;

const nightEl = document.getElementById('night');
const healthEl = document.getElementById('health');
const eventEl = document.getElementById('event');
const jumpscareSound = document.getElementById('jumpscareSound');

// Load images
const playerImg = new Image();
playerImg.src = 'player.png'; // Player sprite
const monsterImg = new Image();
monsterImg.src = 'monster.png'; // Monster sprite
const doorImg = new Image();
doorImg.src = 'door.png'; // Door sprite
const lightOnImg = new Image();
lightOnImg.src = 'light_on.png';
const lightOffImg = new Image();
lightOffImg.src = 'light_off.png';

// Player and monster
const player = {x: 50, y: 300, size: 30};
const monster = {x: 500, y: 50, size: 30};

// Random creepy events
const events = [
    "Chains rattling...",
    "Shadow moves near the cell...",
    "Footsteps echo...",
    "Cell door slams!",
    "Whispers surround you..."
];

// Draw map
function drawMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Door
    ctx.drawImage(doorImg, 480, 200, 40, 80);

    // Player
    ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);

    // Monster (hidden if door closed)
    if (!doorClosed) ctx.drawImage(monsterImg, monster.x, monster.y, monster.size, monster.size);

    // Lights overlay
    if (!lightOn) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
}

// Move monster randomly
function moveMonster() {
    const dx = Math.random() * 4 - 2;
    const dy = Math.random() * 4 - 2;
    monster.x = Math.min(Math.max(monster.x + dx, 100), 480);
    monster.y = Math.min(Math.max(monster.y + dy, 50), 330);
}

// Check if monster catches player
function checkCollision() {
    const dx = player.x - monster.x;
    const dy = player.y - monster.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    if (distance < 30 && !doorClosed) {
        health -= 50;
        healthEl.textContent = health;
        eventEl.textContent = "Monster caught you!";

        // Play jumpscare sound
        jumpscareSound.play();

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
