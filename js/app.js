/* ============================================================
   PERSONAL DASHBOARD — app.js
   Sections:
   1. DOM Element References
   2. Dark Mode
   3. Clock & Greeting
   4. Custom Name Modal
   5. Focus Timer
   6. To-Do List
   7. Quick Links
   8. Initialization
   ============================================================ */


/* ============================================================
   1. DOM ELEMENT REFERENCES
   ============================================================ */

// Header
const darkModeToggle     = document.getElementById('dark-mode-toggle');

// Greeting
const timeDisplay        = document.getElementById('time-display');
const dateDisplay        = document.getElementById('date-display');
const greetingPhrase     = document.getElementById('greeting-phrase');
const greetingName       = document.getElementById('greeting-name');
const editNameBtn        = document.getElementById('edit-name-btn');

// Name Modal
const nameModal          = document.getElementById('name-modal');
const modalNameInput     = document.getElementById('modal-name-input');
const modalSubmitBtn     = document.getElementById('modal-submit-btn');

// Timer
const timerDisplay       = document.getElementById('timer-display');
const timerStartBtn      = document.getElementById('timer-start-btn');
const timerStopBtn       = document.getElementById('timer-stop-btn');
const timerResetBtn      = document.getElementById('timer-reset-btn');
const customTimerInput   = document.getElementById('custom-timer-input');
const setTimerBtn        = document.getElementById('set-timer-btn');

// Todo
const taskInput          = document.getElementById('task-input');
const addTaskBtn         = document.getElementById('add-task-btn');
const taskError          = document.getElementById('task-error');
const taskCount          = document.getElementById('task-count');
const taskList           = document.getElementById('task-list');
const sortTasksBtn       = document.getElementById('sort-tasks-btn');

// Links
const linksGrid          = document.getElementById('links-grid');
const linkLabelInput     = document.getElementById('link-label-input');
const linkUrlInput       = document.getElementById('link-url-input');
const addLinkBtn         = document.getElementById('add-link-btn');


/* ============================================================
   2. DARK MODE
   ============================================================ */

const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
</svg>`;

const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
</svg>`;

function applyDarkModeIcon() {
  const isDark = document.body.classList.contains('dark-mode');
  // When dark mode is ON, show sun so user can switch back to light
  darkModeToggle.innerHTML = isDark ? SUN_SVG : MOON_SVG;
  darkModeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

function initDarkMode() {
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true') {
    document.body.classList.add('dark-mode');
  }
  applyDarkModeIcon();
}

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  applyDarkModeIcon();
});


/* ============================================================
   3. CLOCK & GREETING
   ============================================================ */

function updateClock() {
  const now   = new Date();
  const hh    = String(now.getHours()).padStart(2, '0');
  const mm    = String(now.getMinutes()).padStart(2, '0');
  const ss    = String(now.getSeconds()).padStart(2, '0');

  timeDisplay.textContent = `${hh}:${mm}:${ss}`;

  dateDisplay.textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });

  const hour = now.getHours();
  let phrase;
  if (hour >= 5 && hour < 12) {
    phrase = 'Good Morning';
  } else if (hour >= 12 && hour < 18) {
    phrase = 'Good Afternoon';
  } else {
    phrase = 'Good Evening';
  }
  greetingPhrase.textContent = phrase;

  const name = localStorage.getItem('userName');
  greetingName.textContent = name ? name : '';
}


/* ============================================================
   4. CUSTOM NAME MODAL
   ============================================================ */

function showNameModal() {
  const current = localStorage.getItem('userName');
  if (current) {
    modalNameInput.value = current;
  } else {
    modalNameInput.value = '';
  }
  nameModal.classList.add('visible');
  // Focus the input after the modal is visible
  setTimeout(() => modalNameInput.focus(), 50);
}

function hideNameModal() {
  nameModal.classList.remove('visible');
}

function submitName() {
  const name = modalNameInput.value.trim();
  if (!name) {
    modalNameInput.focus();
    return;
  }
  localStorage.setItem('userName', name);
  hideNameModal();
  updateClock();
}

function initNameModal() {
  const savedName = localStorage.getItem('userName');
  if (!savedName) {
    showNameModal();
  } else {
    updateClock();
  }
}

modalSubmitBtn.addEventListener('click', submitName);

modalNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    submitName();
  }
});

editNameBtn.addEventListener('click', () => {
  showNameModal();
});


/* ============================================================
   5. FOCUS TIMER
   ============================================================ */

let timerMinutes   = 25;
let timerSeconds   = 0;
let timerInterval  = null;
let isRunning      = false;
let defaultMinutes = 25; // tracks custom-set duration for reset

function updateTimerDisplay() {
  const m = String(timerMinutes).padStart(2, '0');
  const s = String(timerSeconds).padStart(2, '0');
  timerDisplay.textContent = `${m}:${s}`;
}

function updateTimerButtons() {
  if (isRunning) {
    timerStartBtn.disabled = true;
    timerStopBtn.disabled  = false;
    timerDisplay.classList.add('running');
    timerStartBtn.textContent = 'Running…';
  } else {
    timerStartBtn.disabled = false;
    timerStopBtn.disabled  = true;
    timerDisplay.classList.remove('running');
    timerStartBtn.textContent = 'Start';
  }
}

function timerEndAlert() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1);
  } catch (_e) {
    // AudioContext not available in some environments — silently skip
  }
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  updateTimerButtons();

  timerInterval = setInterval(() => {
    if (timerSeconds === 0) {
      if (timerMinutes === 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        updateTimerDisplay();
        updateTimerButtons();
        timerEndAlert();
        return;
      }
      timerMinutes -= 1;
      timerSeconds  = 59;
    } else {
      timerSeconds -= 1;
    }
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
  updateTimerButtons();
}

function resetTimer() {
  stopTimer();
  timerMinutes = defaultMinutes;
  timerSeconds = 0;
  updateTimerDisplay();
  updateTimerButtons();
}

function setCustomTimer() {
  const val = parseInt(customTimerInput.value, 10);
  if (!val || val < 1 || val > 120) return;
  stopTimer();
  timerMinutes   = val;
  timerSeconds   = 0;
  defaultMinutes = val;
  customTimerInput.value = '';
  updateTimerDisplay();
  updateTimerButtons();
}

timerStartBtn.addEventListener('click', startTimer);
timerStopBtn.addEventListener('click', stopTimer);
timerResetBtn.addEventListener('click', resetTimer);
setTimerBtn.addEventListener('click', setCustomTimer);
customTimerInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') setCustomTimer();
});


/* ============================================================
   6. TO-DO LIST
   ============================================================ */

let tasks       = [];
let sortedAZ    = false; // tracks current sort state

function loadTasks() {
  try {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  } catch (_e) {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  const displayTasks = sortedAZ
    ? [...tasks].sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))
    : tasks;

  displayTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item${task.done ? ' done' : ''}`;
    li.dataset.id = task.id;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type      = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked   = task.done;
    checkbox.setAttribute('aria-label', `Mark "${task.text}" as ${task.done ? 'not done' : 'done'}`);
    checkbox.addEventListener('change', () => toggleTask(task.id));

    // Text span
    const textSpan = document.createElement('span');
    textSpan.className   = 'task-text';
    textSpan.textContent = task.text;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.type      = 'button';
    editBtn.className = 'task-btn task-btn-edit';
    editBtn.setAttribute('aria-label', `Edit task: ${task.text}`);
    editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>`;
    editBtn.addEventListener('click', () => editTask(task.id));

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type      = 'button';
    deleteBtn.className = 'task-btn task-btn-delete';
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>`;
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  const remaining = tasks.filter((t) => !t.done).length;
  taskCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;
}

function showTaskError(message) {
  taskError.textContent = message;
  taskError.classList.add('visible');
}

function hideTaskError() {
  taskError.textContent = '';
  taskError.classList.remove('visible');
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  // Duplicate check (case-insensitive)
  const duplicate = tasks.some((t) => t.text.toLowerCase() === text.toLowerCase());
  if (duplicate) {
    showTaskError('Task already exists!');
    return;
  }

  hideTaskError();
  tasks.push({ id: Date.now(), text, done: false });
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const li = taskList.querySelector(`[data-id="${id}"]`);
  if (!li) return;

  const task     = tasks.find((t) => t.id === id);
  const textSpan = li.querySelector('.task-text');
  const editBtn  = li.querySelector('.task-btn-edit');

  if (!task || !textSpan) return;

  // Replace text span with input
  const editInput = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'task-edit-input';
  editInput.value     = task.text;
  editInput.maxLength = 100;
  editInput.setAttribute('aria-label', 'Edit task text');

  textSpan.replaceWith(editInput);
  if (editBtn) editBtn.style.display = 'none';
  editInput.focus();
  editInput.select();

  function saveEdit() {
    const newText = editInput.value.trim();
    if (!newText) {
      renderTasks();
      return;
    }
    // Duplicate check excluding current task
    const duplicate = tasks.some(
      (t) => t.id !== id && t.text.toLowerCase() === newText.toLowerCase()
    );
    if (duplicate) {
      showTaskError('Task already exists!');
      editInput.focus();
      return;
    }
    hideTaskError();
    task.text = newText;
    saveTasks();
    renderTasks();
  }

  editInput.addEventListener('blur', saveEdit);

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      editInput.removeEventListener('blur', saveEdit);
      saveEdit();
    } else if (e.key === 'Escape') {
      editInput.removeEventListener('blur', saveEdit);
      renderTasks();
    }
  });
}

function toggleSort() {
  sortedAZ = !sortedAZ;
  sortTasksBtn.textContent = sortedAZ ? 'Sort: Original' : 'Sort A–Z';
  renderTasks();
}

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

sortTasksBtn.addEventListener('click', toggleSort);


/* ============================================================
   7. QUICK LINKS
   ============================================================ */

const DEFAULT_LINKS = [
  { id: 1, label: 'Google',  url: 'https://www.google.com'    },
  { id: 2, label: 'YouTube', url: 'https://www.youtube.com'   },
  { id: 3, label: 'GitHub',  url: 'https://www.github.com'    },
  { id: 4, label: 'Gmail',   url: 'https://mail.google.com'   },
];

let links = [];

function loadLinks() {
  try {
    const stored = JSON.parse(localStorage.getItem('links'));
    if (stored && stored.length > 0) {
      links = stored;
    } else {
      links = DEFAULT_LINKS.map((l) => ({ ...l }));
      saveLinks();
    }
  } catch (_e) {
    links = DEFAULT_LINKS.map((l) => ({ ...l }));
    saveLinks();
  }
}

function saveLinks() {
  localStorage.setItem('links', JSON.stringify(links));
}

function getFaviconUrl(url) {
  try {
    const origin = new URL(url).origin;
    return `${origin}/favicon.ico`;
  } catch (_e) {
    return null;
  }
}

function renderLinks() {
  linksGrid.innerHTML = '';

  links.forEach((link) => {
    const card = document.createElement('div');
    card.className = 'link-card';

    // Anchor
    const anchor = document.createElement('a');
    anchor.href   = link.url;
    anchor.target = '_blank';
    anchor.rel    = 'noopener noreferrer';
    anchor.setAttribute('aria-label', `Open ${link.label}`);

    // Favicon image with fallback to initial placeholder
    const faviconUrl = getFaviconUrl(link.url);
    if (faviconUrl) {
      const img = document.createElement('img');
      img.src       = faviconUrl;
      img.className = 'link-favicon';
      img.alt       = '';
      img.width     = 28;
      img.height    = 28;
      img.addEventListener('error', () => {
        const placeholder = document.createElement('div');
        placeholder.className   = 'link-favicon-placeholder';
        placeholder.textContent = link.label.charAt(0).toUpperCase();
        img.replaceWith(placeholder);
      });
      anchor.appendChild(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className   = 'link-favicon-placeholder';
      placeholder.textContent = link.label.charAt(0).toUpperCase();
      anchor.appendChild(placeholder);
    }

    const labelEl = document.createElement('span');
    labelEl.className   = 'link-label';
    labelEl.textContent = link.label;
    anchor.appendChild(labelEl);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.type      = 'button';
    deleteBtn.className = 'link-delete-btn';
    deleteBtn.setAttribute('aria-label', `Delete link: ${link.label}`);
    deleteBtn.textContent = '×';
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteLink(link.id);
    });

    card.appendChild(anchor);
    card.appendChild(deleteBtn);
    linksGrid.appendChild(card);
  });
}

function addLink() {
  const label = linkLabelInput.value.trim();
  let   url   = linkUrlInput.value.trim();

  if (!label || !url) return;

  // Prepend https:// if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  links.push({ id: Date.now(), label, url });
  saveLinks();
  renderLinks();
  linkLabelInput.value = '';
  linkUrlInput.value   = '';
  linkLabelInput.focus();
}

function deleteLink(id) {
  links = links.filter((l) => l.id !== id);
  saveLinks();
  renderLinks();
}

addLinkBtn.addEventListener('click', addLink);

linkUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addLink();
});


/* ============================================================
   8. INITIALIZATION
   ============================================================ */

function init() {
  // 1. Dark mode
  initDarkMode();

  // 2. Tasks
  loadTasks();
  renderTasks();

  // 3. Links
  loadLinks();
  renderLinks();

  // 4. Name / Greeting
  initNameModal();

  // 5. Clock interval (runs every second)
  setInterval(updateClock, 1000);
  updateClock(); // immediate first call

  // 6. Timer initial display
  updateTimerDisplay();
  updateTimerButtons();
}

init();
