let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const completedTasksByPeriod = JSON.parse(localStorage.getItem('completedTasksByPeriod')) || { month: {}, week: {}, day: {} };
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

const ctx = document.getElementById('taskChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Tarefas Concluídas',
            data: [],
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

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateChart();
    loadCompletedTasks();
    loadPomodoro();
});

function addTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const timestamp = new Date().toISOString();
    
    if (title.trim() !== '') {
        tasks.push({ title, description, done: false, timestamp });
        saveTasks();
        loadTasks();
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
    }
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    const taskTimestamp = new Date(tasks[index].timestamp);
    const dateKey = taskTimestamp.toISOString().split('T')[0];

    if (tasks[index].done) {
        completedTasks.push(tasks[index]);
        
        if (!completedTasksByPeriod.day[dateKey]) {
            completedTasksByPeriod.day[dateKey] = 0;
        }
        completedTasksByPeriod.day[dateKey]++;
        
        const weekKey = `${taskTimestamp.getFullYear()}-W${getWeekNumber(taskTimestamp)}`;
        if (!completedTasksByPeriod.week[weekKey]) {
            completedTasksByPeriod.week[weekKey] = 0;
        }
        completedTasksByPeriod.week[weekKey]++;
        
        const monthKey = `${taskTimestamp.getFullYear()}-${taskTimestamp.getMonth() + 1}`;
        if (!completedTasksByPeriod.month[monthKey]) {
            completedTasksByPeriod.month[monthKey] = 0;
        }
        completedTasksByPeriod.month[monthKey]++;
    } else {
        completedTasks = completedTasks.filter(task => task !== tasks[index]);
        
        if (completedTasksByPeriod.day[dateKey]) {
            completedTasksByPeriod.day[dateKey]--;
        }
        
        const weekKey = `${taskTimestamp.getFullYear()}-W${getWeekNumber(taskTimestamp)}`;
        if (completedTasksByPeriod.week[weekKey]) {
            completedTasksByPeriod.week[weekKey]--;
        }
        
        const monthKey = `${taskTimestamp.getFullYear()}-${taskTimestamp.getMonth() + 1}`;
        if (completedTasksByPeriod.month[monthKey]) {
            completedTasksByPeriod.month[monthKey]--;
        }
    }

    saveTasks();
    saveCompletedTasksByPeriod();
    loadTasks();
    updateChart();
}

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.done);
    saveTasks();
    loadTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveCompletedTasksByPeriod() {
    localStorage.setItem('completedTasksByPeriod', JSON.stringify(completedTasksByPeriod));
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        if (task.done) {
            li.classList.add('done');
        }
        
        li.innerHTML = `
            <div>
                <h5>${task.title}</h5>
                <p>${task.description}</p>
            </div>
            <button class="btn btn-custom" onclick="toggleTask(${index})">${task.done ? 'Desfazer' : 'Concluir'}</button>
        `;
        taskList.appendChild(li);
    });
}

function updateChart() {
    const filter = document.getElementById('chartFilter').value;
    let labels = [];
    let data = [];

    switch (filter) {
        case 'month':
            labels = Object.keys(completedTasksByPeriod.month);
            data = Object.values(completedTasksByPeriod.month);
            break;
        case 'week':
            labels = Object.keys(completedTasksByPeriod.week);
            data = Object.values(completedTasksByPeriod.week);
            break;
        case 'day':
            labels = Object.keys(completedTasksByPeriod.day);
            data = Object.values(completedTasksByPeriod.day);
            break;
    }

    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

function getWeekNumber(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
}

function loadCompletedTasks() {
    const taskHistoryList = document.getElementById('taskHistoryList');
    taskHistoryList.innerHTML = '';

    completedTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `<div><h5>${task.title}</h5><p>${task.description}</p></div>`;
        taskHistoryList.appendChild(li);
    });
}

function loadPomodoro() {
    const modal = document.getElementById("pomodoroModal");
    const openModalBtn = document.getElementById("openPomodoroModal");
    const closeModalBtn = modal.querySelector(".close");
    const pomodoroBtn = document.getElementById("pomodoro");
    const shortBreakBtn = document.getElementById("shortBreak");
    const longBreakBtn = document.getElementById("longBreak");
    const startBtn = document.getElementById("start");
    const resetBtn = document.getElementById("reset");
    const minutesDisplay = document.getElementById("minutes");
    const secondsDisplay = document.getElementById("seconds");

    let interval;
    let timeLeft = 25 * 60;
    let isRunning = false;
    let mode = "pomodoro";

    openModalBtn.onclick = function() {
        modal.style.display = "block";
    }

    closeModalBtn.onclick = function() {
        modal.style.display = "none";
        resetTimer();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            resetTimer();
        }
    }

    pomodoroBtn.onclick = function() {
        switchMode("pomodoro");
    }

    shortBreakBtn.onclick = function() {
        switchMode("shortBreak");
    }

    longBreakBtn.onclick = function() {
        switchMode("longBreak");
    }

    startBtn.onclick = function() {
        if (isRunning) {
            clearInterval(interval);
            startBtn.textContent = "Start";
        } else {
            interval = setInterval(updateTimer, 1000);
            startBtn.textContent = "Pause";
        }
        isRunning = !isRunning;
    }

    resetBtn.onclick = function() {
        resetTimer();
    }

    function switchMode(newMode) {
        mode = newMode;
        resetTimer();
        if (mode === "pomodoro") {
            timeLeft = 25 * 60;
        } else if (mode === "shortBreak") {
            timeLeft = 5 * 60;
        } else if (mode === "longBreak") {
            timeLeft = 15 * 60;
        }
        updateDisplay();
    }

    function updateTimer() {
        if (timeLeft <= 0) {
            clearInterval(interval);
            isRunning = false;
            startBtn.textContent = "Start";
        } else {
            timeLeft--;
            updateDisplay();
        }
    }

    function resetTimer() {
        clearInterval(interval);
        isRunning = false;
        startBtn.textContent = "Start";
        switchMode(mode);
    }

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        minutesDisplay.textContent = minutes.toString().padStart(2, "0");
        secondsDisplay.textContent = seconds.toString().padStart(2, "0");
    }
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
}

