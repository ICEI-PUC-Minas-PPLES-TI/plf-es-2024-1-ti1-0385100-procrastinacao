let timer;
let isRunning = false;
let currentMode = "pomodoro";
let time = 25 * 60;

const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const pomodoroButton = document.getElementById("pomodoro");
const shortBreakButton = document.getElementById("shortBreak");
const longBreakButton = document.getElementById("longBreak");

startButton.addEventListener("click", () => {
    if (isRunning) {
        clearInterval(timer);
        startButton.textContent = "Start";
    } else {
        timer = setInterval(updateTimer, 1000);
        startButton.textContent = "Pause";
    }
    isRunning = !isRunning;
});

resetButton.addEventListener("click", resetTimer);

pomodoroButton.addEventListener("click", () => switchMode("pomodoro", 25));
shortBreakButton.addEventListener("click", () => switchMode("shortBreak", 5));
longBreakButton.addEventListener("click", () => switchMode("longBreak", 15));

function updateTimer() {
    if (time > 0) {
        time--;
        displayTime();
    } else {
        clearInterval(timer);
        isRunning = false;
        startButton.textContent = "Start";
        alert("Tempo acabou!");
    }
}

function displayTime() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById("minutes").textContent = minutes < 10 ? `0${minutes}` : minutes;
    document.getElementById("seconds").textContent = seconds < 10 ? `0${seconds}` : seconds;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    startButton.textContent = "Start";
    switchMode(currentMode, getModeTime(currentMode));
}

function switchMode(mode, duration) {
    currentMode = mode;
    time = duration * 60;
    document.querySelectorAll(".modes button").forEach(btn => btn.classList.remove("active"));
    document.getElementById(mode).classList.add("active");
    displayTime();
}

function getModeTime(mode) {
    switch (mode) {
        case "pomodoro": return 25;
        case "shortBreak": return 5;
        case "longBreak": return 15;
    }
}
