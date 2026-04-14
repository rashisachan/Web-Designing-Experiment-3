let tasks = [], filter = 'all';
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
        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task';
            li.innerHTML = `
                <div class="task-left">
                    <input type="checkbox" class="task-check" ${task.done ? 'checked' : ''} data-id="${task.id}">
                    <span class="task-text ${task.done ? 'completed' : ''}">${task.text}</span>
                </div>
                <button class="delete-btn" data-id="${task.id}">🗑️</button>
            `;
            taskList.appendChild(li);
        });
    }
    
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    stats.textContent = `${total - done} pending • ${done} done • Total ${total}`;

    document.querySelectorAll('.task-check').forEach(checkbox => {
        checkbox.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            const task = tasks.find(t => t.id === id);
            if (task) task.done = e.target.checked;
            save();
            display();
        };
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = parseInt(e.target.dataset.id);
            tasks = tasks.filter(t => t.id !== id);
            save();
            display();
        };
    });
}

addBtn.onclick = () => {
    const text = taskInput.value.trim();
    if (!text) {
        alert('Enter a task');
        return;
    }
    tasks.push({ id: Date.now(), text, done: false });
    taskInput.value = '';
    save();
    display();
};

taskInput.onkeypress = (e) => {
    if (e.key === 'Enter') addBtn.click();
};

clearBtn.onclick = () => {
    tasks = tasks.filter(t => !t.done);
    save();
    display();
};

document.querySelectorAll('.filter').forEach(btn => {
    btn.onclick = function() {
        document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
        this.classList.add('active');
        filter = this.dataset.filter;
        display();
    };
});
display();
