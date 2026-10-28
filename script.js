
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progressText");
const progressTrack = document.getElementById("progressTrack");
const progressBar = document.getElementById("progressBar");
const emptyMessage = document.getElementById("emptyMessage");

const STORAGE_KEY = "studySprintTasks";

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(saved || "[]");

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(task =>
      task &&
      typeof task.id === "string" &&
      typeof task.text === "string" &&
      typeof task.done === "boolean"
    );
  } catch {
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    alert("Unable to save tasks. Check your browser storage settings.");
  }
}

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach(task => {
    const item = document.createElement("li");
    const checkbox = document.createElement("input");
    const text = document.createElement("span");
    const deleteButton = document.createElement("button");

    item.className = task.done
      ? "task-item done"
      : "task-item";

    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute(
      "aria-label",
      `Mark ${task.text} as completed`
    );

    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    text.className = "task-text";
    text.textContent = task.text;

    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute(
      "aria-label",
      `Delete ${task.text}`
    );

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, deleteButton);
    taskList.appendChild(item);
  });

  const completed = tasks.filter(task => task.done).length;
  const total = tasks.length;
  const percentage = total
    ? Math.round((completed / total) * 100)
    : 0;

  progressText.textContent =
    `${completed} of ${total} tasks completed (${percentage}%)`;

  progressBar.style.width = `${percentage}%`;
  progressTrack.setAttribute("aria-valuenow", percentage);
  emptyMessage.hidden = total > 0;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    return;
  }

  if (typeof crypto.randomUUID !== "function") {
    alert("Your browser does not support task IDs. Try an updated browser.");
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    text: text,
    done: false
  });

  saveTasks();
  renderTasks();

  input.value = "";
  input.focus();
});

renderTasks();
  
