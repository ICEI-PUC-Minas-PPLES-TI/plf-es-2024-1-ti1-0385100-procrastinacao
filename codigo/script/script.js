const list = document.getElementById("list");
const input = document.getElementById("input");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const addButton = document.getElementById("add");
let tasksHistory = JSON.parse(localStorage.getItem("tasksHistory")) || [];
const historyButton = document.getElementById("history");
const historyModal = document.getElementById("historyModal");
const historyTable = document.getElementById("historyTable");
const removeButton = document.getElementById("remove");

function addTask() {
    if (input.value.trim()) {
        const task = {
            text: input.value,
            done: false,
            date: new Date(),
        };
        tasks.push(task);
        input.value ="";
        renderTasks();
        saveTasks();
    }
}

function removeTasks() {
    tasks = tasks.filter((task) => !task.done);
    renderTasks();
    saveTasks();
}

function toggleTaskDone(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
    saveTasks();
    addToHistory(tasks[index]);
}

function addToHistory(task) {
    const date = new Date();
    const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    tasksHistory.push({
        text: task.text,
        date: dateString,
    });
    saveTasksHistory();
}

function clearHistory() {
    tasksHistory.length = 0;
    saveTasksHistory();
    renderHistory();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveTasksHistory() {
    localStorage.setItem("tasksHistory", JSON.stringify(tasksHistory));
}

function renderTasks() {
    list.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox" ${task.done ? "checked" : ""} onclick="toggleTaskDone(${index})">
            <span>${task.text}</span>
            <button type="button" class="btn btn-success complete-task-button" onclick="completeTask(${index})">Complete Task</button>
        `;
        list.appendChild(li);
    });
}

function renderHistory() {
    historyTable.innerHTML = "";
    tasksHistory.forEach((task) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${task.text}</td>
            <td>${task.date}</td>
        `;
        historyTable.appendChild(tr);
    });
}

function openModal() {
    historyModal.style.display = "block";
    renderHistory();
}

function closeModal() {
    historyModal.style.display = "none";
}

addButton.addEventListener("click", addTask);
historyButton.addEventListener("click", openModal);
removeButton.addEventListener("click", removeTasks);

function completeTask(index) {
    tasks[index].done = true;
    renderTasks();
    saveTasks();
    addToHistory(tasks[index]);
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const digitalClock = document.getElementById("digital-clock");
    digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();
