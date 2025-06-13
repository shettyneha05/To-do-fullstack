// Helper: Get JWT token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Helper: Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const dueDateInput = document.getElementById('dueDate');
const list = document.getElementById('list');
const submitBtn = todoForm?.querySelector('button[type="submit"]');

let tasks = [];

// On page load, check authentication and fetch tasks
document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) {
    alert('Please login first!');
    window.location.href = "index.html";
    return;
  }
  fetchTasks();
});

// Fetch all tasks for the logged-in user
async function fetchTasks() {
  try {
    const res = await fetch('/api/tasks', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (res.status === 401) {
      logout();
      return;
    }

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch tasks');
    }

    tasks = await res.json();
    displayTasks();
  } catch (err) {
    alert(err.message || 'Network error');
  }
}

// Add a new task
todoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!text) return;

  if (dueDate && isNaN(new Date(dueDate).getTime())) {
    alert('Invalid date format');
    return;
  }

  if (submitBtn) submitBtn.disabled = true;

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ text, dueDate })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to add task');
    }

    todoInput.value = '';
    dueDateInput.value = '';
    await fetchTasks();
  } catch (err) {
    alert(err.message || 'Failed to add task');
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});

// Delete a task
async function deleteTask(id) {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (res.status === 401) {
      logout();
      return;
    }
    fetchTasks();
  } catch (err) {
    alert('Failed to delete task');
  }
}

// Update a task (e.g., toggle completed)
async function updateTask(id, { text, completed, dueDate }) {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ text, completed, dueDate })
    });
    if (res.status === 401) {
      logout();
      return;
    }
    fetchTasks();
  } catch (err) {
    alert('Failed to update task');
  }
}

// Display tasks in the list
function displayTasks() {
  list.innerHTML = '';

  // Sort by due date (earliest first, undated last)
  tasks.sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate) : Infinity;
    const dateB = b.dueDate ? new Date(b.dueDate) : Infinity;
    return dateA - dateB;
  });

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-x-4 mb-4';

    // Checkbox for completed
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!task.completed;
    checkbox.className = 'w-6 h-6 accent-green-600 cursor-pointer align-middle mr-3';

    checkbox.addEventListener('change', async function() {
      await updateTask(task._id, {
        text: task.text,
        completed: checkbox.checked,
        dueDate: task.dueDate
      });
    });

    // Task text
    const spanText = document.createElement('span');
    spanText.textContent = task.text;
    spanText.className = 'text-2xl';
    if (task.completed) {
      spanText.classList.add('line-through', 'text-gray-400');
    }

    // Due date
    const dueSpan = document.createElement('span');
    dueSpan.className = 'text-sm text-gray-500 ml-4';
    dueSpan.textContent = task.dueDate
      ? new Date(task.dueDate).toLocaleDateString()
      : 'No date';

    // Remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'ml-4 px-3 py-2 bg-red-300 text-white rounded hover:bg-red-700 transition cursor-pointer';

    removeBtn.addEventListener('click', async function() {
      await deleteTask(task._id);
    });

    // Assemble row
    li.appendChild(checkbox);
    li.appendChild(spanText);
    li.appendChild(dueSpan);
    li.appendChild(removeBtn);
    list.appendChild(li);
  });
}

// Optional: Add a logout button handler if you have one in your HTML
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
