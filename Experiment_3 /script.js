let tasks = [];
let filter = 'all';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const stats = document.getElementById('stats');
const clearBtn = document.getElementById('clearBtn');

// Load tasks
const saved = localStorage.getItem('tasks');
if (saved) tasks = JSON.parse(saved);
else tasks = [
    { id: 1, text: 'Complete JavaScript assignment', done: false },
    { id: 2, text: 'Review DOM manipulation', done: true },
    { id: 3, text: 'Build to-do list app', done: false }
];

function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function display() {
    let filtered = tasks;
    if (filter === 'pending') filtered = tasks.filter(t => !t.done);
    if (filter === 'completed') filtered = tasks.filter(t => t.done);
    
    if (filtered.length === 0) {
        taskList.innerHTML = '<li class="empty">No tasks to show </li>';
    } else {
        taskList.innerHTML = filtered.map(task => `
            <li class="task">
                <div class="task-left">
                    <input type="checkbox" class="task-check" ${task.done ? 'checked' : ''} data-id="${task.id}">
                    <span class="task-text ${task.done ? 'completed' : ''}">${escapeHtml(task.text)}</span>
                </div>
                <button class="delete-btn" data-id="${task.id}">🗑️</button>
            </li>
        `).join('');
    }
    
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    stats.textContent = `📌 ${total - done} pending · ✅ ${done} completed · Total: ${total}`;
    
    // Event listeners
    document.querySelectorAll('.task-check').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const task = tasks.find(t => t.id === id);
            if (task) task.done = e.target.checked;
            save();
            display();
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            tasks = tasks.filter(t => t.id !== id);
            save();
            display();
        });
    });
}

// Helper function to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add task
addBtn.onclick = () => {
    const text = taskInput.value.trim();
    if (!text) {
        taskInput.placeholder = 'Please enter a task!';
        taskInput.style.borderColor = '#c96b7e';
        setTimeout(() => {
            taskInput.placeholder = 'What needs to be done?';
            taskInput.style.borderColor = '#e2d4e8';
        }, 1500);
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

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter = btn.dataset.filter;
        display();
    };
});

display();
