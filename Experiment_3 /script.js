let tasks = [];
let filter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const stats = document.getElementById('stats');
const clearBtn = document.getElementById('clearBtn');

const saved = localStorage.getItem('tasks');
if (saved) {
    tasks = JSON.parse(saved);
} else {
    tasks = [
        { id: 1, text: 'Learn JavaScript', done: false },
        { id: 2, text: 'Build to-do app', done: true },
        { id: 3, text: 'Submit lab', done: false }
    ];
}

function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function display() {
    let filtered = tasks;
    if (filter === 'pending') filtered = tasks.filter(t => !t.done);
    if (filter === 'completed') filtered = tasks.filter(t => t.done);

    if (filtered.length === 0) {
        taskList.innerHTML = '<li class="empty">No tasks</li>';
    } else {
        taskList.innerHTML = '';
        for (let i = 0; i < filtered.length; i++) {
            let task = filtered[i];
            let li = document.createElement('li');
            li.className = 'task';
            li.innerHTML = `
                <div class="task-left">
                    <input type="checkbox" class="task-check" ${task.done ? 'checked' : ''} data-id="${task.id}">
                    <span class="task-text ${task.done ? 'completed' : ''}">${task.text}</span>
                </div>
                <button class="delete-btn" data-id="${task.id}">🗑️</button>
            `;
            taskList.appendChild(li);
        }
    }
   
    let total = tasks.length;
    let done = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].done) done++;
    }
    stats.textContent = `${total - done} pending · ${done} done · Total ${total}`;

    let checks = document.querySelectorAll('.task-check');
    for (let i = 0; i < checks.length; i++) {
        checks[i].onclick = function(e) {
            let id = parseInt(e.target.dataset.id);
            for (let j = 0; j < tasks.length; j++) {
                if (tasks[j].id === id) {
                    tasks[j].done = e.target.checked;
                    break;
                }
            }
            save();
            display();
        };
    }

    let deletes = document.querySelectorAll('.delete-btn');
    for (let i = 0; i < deletes.length; i++) {
        deletes[i].onclick = function(e) {
            let id = parseInt(e.target.dataset.id);
            let newTasks = [];
            for (let j = 0; j < tasks.length; j++) {
                if (tasks[j].id !== id) newTasks.push(tasks[j]);
            }
            tasks = newTasks;
            save();
            display();
        };
    }
}

addBtn.onclick = function() {
    let text = taskInput.value.trim();
    if (text === '') {
        alert('Enter a task');
        return;
    }
    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });
    taskInput.value = '';
    save();
    display();
};

taskInput.onkeypress = function(e) {
    if (e.key === 'Enter') addBtn.click();
};

clearBtn.onclick = function() {
    let remaining = [];
    for (let i = 0; i < tasks.length; i++) {
        if (!tasks[i].done) remaining.push(tasks[i]);
    }
    tasks = remaining;
    save();
    display();
};

let filters = document.querySelectorAll('.filter');
for (let i = 0; i < filters.length; i++) {
    filters[i].onclick = function() {
        for (let j = 0; j < filters.length; j++) {
            filters[j].classList.remove('active');
        }
        this.classList.add('active');
        filter = this.dataset.filter;
        display();
    };
}

display();
