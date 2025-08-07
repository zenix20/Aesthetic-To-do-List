let confettiContainer;
// Colors for Confetti
const softColors = [
  '#E52B50', // Amaranth
  '#F88379',   // Coral pink
  '#FFB6C1', // Light pink
  '#D8BFD8', // Thistle
  '#FC6C85', // Watermelon pink
  '#CC8899', // Puce
  '#DA70D6', // Orchid
];
document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const emojis = ["🌸", "🧋", "💫", "🍓", "🐸", "🦋", "🌙", "⭐", "🌺", "🍃"];
  const motivationalMessages = [
    "You got this! 💖",
    "Time to shine bright! 🌟",
    "Let's make magic happen! 🦄",
    "Ready to sparkle? ✨",
    "Conquer the day! ☀️"
  ];

  const categories = [
    { key: "all", label: "All Tasks", icon: "📝" },
    { key: "work", label: "Work", icon: "💼" },
    { key: "personal", label: "Personal", icon: "🏠" },
    { key: "urgent", label: "Urgent", icon: "🚨" }
  ];

  // DOM Elements
  confettiContainer = document.getElementById('confetti-container');
  const currentDateEl = document.getElementById('current-date');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const motivationalMessageEl = document.getElementById('motivational-message');
  const progressTextEl = document.getElementById('progress-text');
  const progressPercentageEl = document.getElementById('progress-percentage');
  const progressBarEl = document.getElementById('progress-bar');
  const newTaskInput = document.getElementById('new-task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const categoryFiltersEl = document.getElementById('category-filters');
  const tasksContainerEl = document.getElementById('tasks-container');
  const clearCompletedContainer = document.getElementById('clear-completed-container');
  const clearCompletedBtn = document.getElementById('clear-completed-btn');
  const emptyStateEl = document.getElementById('empty-state');
  const emptyStateMessageEl = document.getElementById('empty-state-message');

  // State
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let darkMode = localStorage.getItem('darkMode') === 'true';
  let currentFilter = localStorage.getItem('filter') || 'all';

  // Initialize App
  function init() {
    setDarkMode(darkMode);
    updateDate();
    setMotivationalMessage();
    createCategoryFilters();
    renderTasks();
    updateProgress();
    setupEventListeners();
    lucide.createIcons();
  }

  // Update Date
  function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
  }

  // Set Random Motivational Message
  function setMotivationalMessage() {
    const msg = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    motivationalMessageEl.textContent = msg;
  }

  // Toggle Dark Mode
  function setDarkMode(enabled) {
    darkMode = enabled;
    if (darkMode) {
      document.documentElement.classList.add('dark');
      darkModeToggle.innerHTML = '<i data-lucide="sun" class="w-5 h-5"></i>';
    } else {
      document.documentElement.classList.remove('dark');
      darkModeToggle.innerHTML = '<i data-lucide="moon" class="w-5 h-5"></i>';
    }
    localStorage.setItem('darkMode', darkMode);
    lucide.createIcons();
  }

  darkModeToggle.addEventListener('click', () => {
    setDarkMode(!darkMode);
  });

  // Create Category Filters
  function createCategoryFilters() {
    categoryFiltersEl.innerHTML = '';
    categories.forEach(cat => {
      const isActive = currentFilter === cat.key;
      const button = document.createElement('button');
      button.className = `rounded-full px-4 py-2 transition-all duration-300 hover:scale-105 ${
        isActive
          ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white shadow-lg'
          : darkMode
            ? 'border border-pink-400 text-pink-200 hover:bg-purple-800'
            : 'border border-purple-200 text-purple-700 hover:bg-pink-50'
      }`;
      button.innerHTML = `<span class="mr-1">${cat.icon}</span> ${cat.label}`;
      button.addEventListener('click', () => {
        currentFilter = cat.key;
        localStorage.setItem('filter', cat.key);
        createCategoryFilters();
        renderTasks();
      });
      categoryFiltersEl.appendChild(button);
    });
  }

  // Render Tasks
  function renderTasks() {
    tasksContainerEl.innerHTML = '';
    const filteredTasks = currentFilter === 'all'
      ? tasks
      : tasks.filter(t => t.category === currentFilter);

    if (filteredTasks.length === 0) {
      emptyStateEl.classList.remove('hidden');
      emptyStateMessageEl.textContent = currentFilter === 'all'
        ? "No tasks yet! Add one above to get started ✨"
        : `No ${currentFilter} tasks found! Try a different category 💫`;
      clearCompletedContainer.classList.add('hidden');
      return;
    }

    emptyStateEl.classList.add('hidden');

    filteredTasks.forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.className = `task-card p-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        task.completed
          ? darkMode ? 'bg-green-900/30 border-2 border-green-700' : 'bg-green-50 border-2 border-green-200'
          : darkMode ? 'bg-purple-800/50 backdrop-blur-sm border-2 border-pink-400/30' : 'bg-white/90 backdrop-blur-sm border-2 border-purple-100'
      }`;
      taskEl.style.setProperty('--rotation', `${Math.random() * 4 - 2}deg`);

      taskEl.innerHTML = `
        <div class="flex items-start gap-3 mb-3">
          <input type="checkbox" class="task-checkbox mt-1" ${task.completed ? 'checked' : ''}>
          <div class="flex-1">
            <p class="text-sm font-medium ${task.completed ? 'line-through opacity-60' : darkMode ? 'text-white' : 'text-purple-800'}">${task.text}</p>
          </div>
          <span class="text-lg">${task.emoji}</span>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex gap-1">
            <button data-cat="work" class="p-1 rounded-full ${task.category === 'work' ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white' : darkMode ? 'text-pink-200 hover:bg-purple-700' : 'text-purple-600 hover:bg-pink-100'}"><i data-lucide="briefcase" class="w-3 h-3"></i></button>
            <button data-cat="personal" class="p-1 rounded-full ${task.category === 'personal' ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white' : darkMode ? 'text-pink-200 hover:bg-purple-700' : 'text-purple-600 hover:bg-pink-100'}"><i data-lucide="user" class="w-3 h-3"></i></button>
            <button data-cat="urgent" class="p-1 rounded-full ${task.category === 'urgent' ? 'bg-gradient-to-r from-pink-400 to-purple-500 text-white' : darkMode ? 'text-pink-200 hover:bg-purple-700' : 'text-purple-600 hover:bg-pink-100'}"><i data-lucide="alert-circle" class="w-3 h-3"></i></button>
          </div>
          <button class="delete-task-btn p-1 rounded-full hover:scale-110 ${darkMode ? 'text-pink-300 hover:bg-red-900/50' : 'text-red-500 hover:bg-red-50'}"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
        </div>
      `;

      // Delete button event listener
      const deleteBtn = taskEl.querySelector('.delete-task-btn');
      deleteBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
        updateProgress();
      });

      // Checkboxes
      const checkbox = taskEl.querySelector('input[type="checkbox"]');
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
        updateProgress();
      });

      // Category buttons
      taskEl.querySelectorAll('button[data-cat]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const newCat = e.target.closest('button').dataset.cat;
          task.category = newCat;
          saveTasks();
          renderTasks();
        });
      });

      tasksContainerEl.appendChild(taskEl);
    });

    lucide.createIcons();
  }

  // Add New Task
  function addTask() {
    const text = newTaskInput.value.trim();
    if (!text) return;

    const task = {
      id: Date.now().toString(),
      text,
      completed: false,
      category: 'personal',
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    };

    tasks.push(task);
    saveTasks();
    newTaskInput.value = '';
    renderTasks();
    updateProgress();
  }

  addTaskBtn.addEventListener('click', addTask);
  newTaskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
  });

  // Update Progress
  function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    progressTextEl.textContent = `Progress: ${completed}/${total} tasks completed`;
    progressPercentageEl.textContent = `${percent}%`;
    progressBarEl.style.width = `${percent}%`;

    // Show clear completed button
    if (completed > 0) {
      clearCompletedContainer.classList.remove('hidden');
      clearCompletedBtn.textContent = `Clear Completed (${completed}) ✨`;
    } else {
      clearCompletedContainer.classList.add('hidden');
    }

    // Confetti if all done
    if (total > 0 && completed === total) {
      showConfetti();
      setTimeout(hideConfetti, 4000);
    }
  }

  // Clear Completed
  clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
    updateProgress();
  });
  
  // Save to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Initialize
  init();
});

// Confetti Animation
  function showConfetti() {
  confetti({
    particleCount: 200,
    spread: 150,
    origin: { y: 0.2 },
    colors: softColors
  });
}
  
