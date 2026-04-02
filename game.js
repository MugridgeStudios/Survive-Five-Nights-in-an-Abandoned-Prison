let night = 1;
let health = 100;
let eventText = "All quiet...";

const nightEl = document.getElementById('night');
const healthEl = document.getElementById('health');
const eventEl = document.getElementById('event');
const messageEl = document.getElementById('message');

const events = [
    "You hear chains rattling...",
    "A shadow moves across the hallway...",
    "Footsteps echo in the distance...",
    "A cell door slams shut!",
    "You hear whispers around you...",
];

function randomEvent() {
    return events[Math.floor(Math.random() * events.length)];
}

function endNight() {
    if(night < 5) {
        night++;
        nightEl.textContent = night;
        messageEl.textContent = `Night ${night} begins... Stay alert!`;
        health = Math.min(health + 10, 100);
        healthEl.textContent = health;
    } else {
        messageEl.textContent = "Congratulations! You survived all 5 nights!";
        disableControls();
    }
}

function disableControls() {
    document.getElementById('checkDoor').disabled = true;
    document.getElementById('checkCamera').disabled = true;
    document.getElementById('useLight').disabled = true;
}

document.getElementById('checkDoor').addEventListener('click', () => {
    eventText = randomEvent();
    eventEl.textContent = eventText;
    health -= Math.floor(Math.random() * 20);
    healthEl.textContent = health;
    if(health <= 0) {
        messageEl.textContent = "You were caught! Game Over!";
        disableControls();
    }
});

document.getElementById('checkCamera').addEventListener('click', () => {
    eventText = randomEvent();
    eventEl.textContent = "Camera shows: " + eventText;
    health -= Math.floor(Math.random() * 10);
    healthEl.textContent = health;
    if(health <= 0) {
        messageEl.textContent = "You were caught! Game Over!";
        disableControls();
    }
});

document.getElementById('useLight').addEventListener('click', () => {
    eventText = randomEvent();
    eventEl.textContent = "Light reveals: " + eventText;
    health -= Math.floor(Math.random() * 5);
    healthEl.textContent = health;
    if(health <= 0) {
        messageEl.textContent = "You were caught! Game Over!";
        disableControls();
    }
});

// Auto end night every 30 seconds
setInterval(endNight, 30000);
