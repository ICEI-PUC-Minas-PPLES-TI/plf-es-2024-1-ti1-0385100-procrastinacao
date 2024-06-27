let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const completedTasksByMonth = JSON.parse(localStorage.getItem('completedTasksByMonth')) || {};
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

const ctx = document.getElementById('taskChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Object.keys(completedTasksByMonth),
        datasets: [{
            label: 'Tarefas Concluídas',
            data: Object.values(completedTasksByMonth),
            backgroundColor: 'rgba(111, 66, 193, 0.2)',
            borderColor: 'rgba(111, 66, 193, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function addTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    if (title && description) {
        const task = {
            title,
            description,
            completed: false,
            date: new Date()
        };
        tasks.push(task);
        saveTasks();
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        renderTasks();
    }
}

function toggleTask(index) {
    const task = tasks[index];
    task.completed = !task.completed;
    updateCompletedTasks(task);
    saveTasks();
    renderTasks();
    updateChart();
    renderCompletedTasks();
}

function updateCompletedTasks(task) {
    const monthYear = `${task.date.getMonth() + 1}/${task.date.getFullYear()}`;
    if (task.completed) {
        if (completedTasksByMonth[monthYear]) {
            completedTasksByMonth[monthYear]++;
        } else {
            completedTasksByMonth[monthYear] = 1;
        }
        completedTasks.push(task);
    } else {
        completedTasksByMonth[monthYear]--;
        completedTasks = completedTasks.filter(t => t !== task);
    }
    localStorage.setItem('completedTasksByMonth', JSON.stringify(completedTasksByMonth));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `list-group-item ${task.completed ? 'done' : ''}`;
        li.innerHTML = `
            <div>
                <strong>${task.title}</strong><br>
                <span>${task.description}</span>
            </div>
            <button class="btn btn-sm btn-custom" onclick="toggleTask(${index})">
                ${task.completed ? 'Desfazer' : 'Feito'}
            </button>
        `;
        taskList.appendChild(li);
    });
}

function renderCompletedTasks() {
    const taskHistoryList = document.getElementById('taskHistoryList');
    taskHistoryList.innerHTML = '';
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div>
                <strong>${task.title}</strong><br>
                <span>${task.description}</span><br>
                <small>${new Date(task.date).toLocaleString()}</small>
            </div>
        `;
        taskHistoryList.appendChild(li);
    });
}

function updateChart() {
    chart.data.labels = Object.keys(completedTasksByMonth);
    chart.data.datasets[0].data = Object.values(completedTasksByMonth);
    chart.update();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadDarkMode() {
    const darkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.add('light-mode');
    }
}

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Pomodoro Timer Modal Logic
document.getElementById('openPomodoroModal').addEventListener('click', function() {
    document.getElementById('pomodoroModal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('pomodoroModal').style.display = 'none';
});

window.onclick = function(event) {
    if (event.target == document.getElementById('pomodoroModal')) {
        document.getElementById('pomodoroModal').style.display = 'none';
    }
};
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


window.onload = function() {
    renderTasks();
    updateChart();
    loadDarkMode();
    renderCompletedTasks();
};
