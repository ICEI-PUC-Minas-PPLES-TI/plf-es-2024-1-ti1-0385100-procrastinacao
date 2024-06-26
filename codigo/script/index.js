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

window.onload = function() {
    renderTasks();
    updateChart();
    loadDarkMode();
    renderCompletedTasks();
};