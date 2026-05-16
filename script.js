const WEEKLY_GOAL = 100;
const TASKS_KEY = "miSistemaPersonal.tasks";
const THEME_KEY = "miSistemaPersonal.theme";
const REMINDERS_KEY = "miSistemaPersonal.universityReminders";
const REDEMPTIONS_KEY = "miSistemaPersonal.rewardRedemptions";
const ACTIVITY_KEY = "miSistemaPersonal.activityLog";
const CUSTOM_REWARDS_KEY = "miSistemaPersonal.customRewards";
const QUICK_NOTES_KEY = "miSistemaPersonal.quickNotes";
const NOTIFICATION_ALERTS_KEY = "miSistemaPersonal.notificationAlertsSent";
const ACTIVE_TAB_KEY = "miSistemaPersonal.activeTab";

const reminderTypes = ["Cuestionario", "Tarea", "Examen", "Exposición", "Proyecto"];
const courses = [
  "POO",
  "Cálculo III",
  "Costeo de Operaciones",
  "Arquitectura de Computadoras",
  "Estadística y Probabilidad",
  "Competencias Gerenciales"
];
const priorities = ["Baja", "Media", "Alta"];
const notificationOffsets = [1440, 60, 15];
const rewards = [
  {
    id: "steam-10",
    name: "Steam Wallet S/ 10",
    description: "Un pequeño impulso para tu biblioteca.",
    cost: 100
  },
  {
    id: "steam-15",
    name: "Steam Wallet S/ 15",
    description: "Crédito extra para tu próximo juego.",
    cost: 150
  },
  {
    id: "free-game-hour",
    name: "1 hora de juego libre",
    description: "Una pausa ganada sin pendientes encima.",
    cost: 80
  },
  {
    id: "favorite-snack",
    name: "Snack favorito",
    description: "Algo rico para celebrar el avance.",
    cost: 60
  },
  {
    id: "movie-no-guilt",
    name: "Ver una película sin culpa",
    description: "Tiempo de descanso bien merecido.",
    cost: 70
  }
];

const defaultTasks = [
  {
    id: "task-limpiar-habitacion",
    title: "Limpiar mi habitación",
    category: "Personal",
    stars: 10,
    completed: false
  },
  {
    id: "task-cuestionario-programacion",
    title: "Cuestionario de Programación",
    category: "Universidad",
    stars: 15,
    completed: false
  },
  {
    id: "task-hacer-ejercicio",
    title: "Hacer ejercicio",
    category: "Personal",
    stars: 10,
    completed: false
  },
  {
    id: "task-apuntes-fisica",
    title: "Revisar apuntes de Física",
    category: "Universidad",
    stars: 15,
    completed: false
  }
];

let tasks = loadTasks();
let universityReminders = loadReminders();
let rewardRedemptions = loadRedemptions();
let activityLog = loadActivityLog();
let customRewards = loadCustomRewards();
let quickNotes = loadQuickNotes();
let notificationAlertsSent = loadNotificationAlerts();
let calendarVisibleDate = new Date();
let selectedCalendarDate = formatDateKey(new Date());
let toastTimer;
let notificationCheckTimer;

const taskList = document.querySelector("#taskList");
const weeklyStars = document.querySelector("#weeklyStars");
const weeklyProgress = document.querySelector("#weeklyProgress");
const taskCount = document.querySelector("#taskCount");
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector("#themeIcon");
const openTaskModal = document.querySelector("#openTaskModal");
const taskModal = document.querySelector("#taskModal");
const closeTaskModal = document.querySelector("#closeTaskModal");
const cancelTask = document.querySelector("#cancelTask");
const taskForm = document.querySelector("#taskForm");
const taskName = document.querySelector("#taskName");
const taskCategory = document.querySelector("#taskCategory");
const taskDate = document.querySelector("#taskDate");
const taskStars = document.querySelector("#taskStars");
const taskPriority = document.querySelector("#taskPriority");
const formError = document.querySelector("#formError");
const tabButtons = document.querySelectorAll(".tab-button");
const tabViews = document.querySelectorAll(".tab-view");
const quickChips = document.querySelectorAll(".quick-chip");
const reminderList = document.querySelector("#reminderList");
const reminderCount = document.querySelector("#reminderCount");
const nextEventTitle = document.querySelector("#nextEventTitle");
const nextEventTime = document.querySelector("#nextEventTime");
const reminderModal = document.querySelector("#reminderModal");
const reminderForm = document.querySelector("#reminderForm");
const reminderModalTitle = document.querySelector("#reminderModalTitle");
const closeReminderModal = document.querySelector("#closeReminderModal");
const cancelReminder = document.querySelector("#cancelReminder");
const reminderId = document.querySelector("#reminderId");
const reminderType = document.querySelector("#reminderType");
const reminderCourse = document.querySelector("#reminderCourse");
const reminderDate = document.querySelector("#reminderDate");
const reminderTime = document.querySelector("#reminderTime");
const reminderPriority = document.querySelector("#reminderPriority");
const reminderDescription = document.querySelector("#reminderDescription");
const reminderError = document.querySelector("#reminderError");
const rewardBalance = document.querySelector("#rewardBalance");
const rewardGrid = document.querySelector("#rewardGrid");
const rewardHistory = document.querySelector("#rewardHistory");
const rewardHistoryCount = document.querySelector("#rewardHistoryCount");
const goalBanner = document.querySelector("#goalBanner");
const toast = document.querySelector("#toast");
const statCompletedTasks = document.querySelector("#statCompletedTasks");
const statEarnedStars = document.querySelector("#statEarnedStars");
const statActiveReminders = document.querySelector("#statActiveReminders");
const statRedeemedRewards = document.querySelector("#statRedeemedRewards");
const weeklyStarsChart = document.querySelector("#weeklyStarsChart");
const categoryTasksChart = document.querySelector("#categoryTasksChart");
const statsProgressPercent = document.querySelector("#statsProgressPercent");
const statsProgressValue = document.querySelector("#statsProgressValue");
const statsProgressFill = document.querySelector("#statsProgressFill");
const statsProgressMessage = document.querySelector("#statsProgressMessage");
const activityCount = document.querySelector("#activityCount");
const activityList = document.querySelector("#activityList");
const quickActionBackdrop = document.querySelector("#quickActionBackdrop");
const quickActionMenu = document.querySelector("#quickActionMenu");
const quickActionCards = document.querySelectorAll(".quick-action-card");
const customRewardModal = document.querySelector("#customRewardModal");
const customRewardForm = document.querySelector("#customRewardForm");
const closeCustomRewardModal = document.querySelector("#closeCustomRewardModal");
const cancelCustomReward = document.querySelector("#cancelCustomReward");
const customRewardName = document.querySelector("#customRewardName");
const customRewardDescription = document.querySelector("#customRewardDescription");
const customRewardCost = document.querySelector("#customRewardCost");
const customRewardError = document.querySelector("#customRewardError");
const quickNoteModal = document.querySelector("#quickNoteModal");
const quickNoteForm = document.querySelector("#quickNoteForm");
const closeQuickNoteModal = document.querySelector("#closeQuickNoteModal");
const cancelQuickNote = document.querySelector("#cancelQuickNote");
const quickNoteText = document.querySelector("#quickNoteText");
const quickNoteError = document.querySelector("#quickNoteError");
const quickNoteList = document.querySelector("#quickNoteList");
const quickNoteCount = document.querySelector("#quickNoteCount");
const enableNotifications = document.querySelector("#enableNotifications");
const notificationStatus = document.querySelector("#notificationStatus");
const notificationMessage = document.querySelector("#notificationMessage");
const calendarMonthLabel = document.querySelector("#calendarMonthLabel");
const calendarGrid = document.querySelector("#calendarGrid");
const previousMonth = document.querySelector("#previousMonth");
const nextMonth = document.querySelector("#nextMonth");
const goToToday = document.querySelector("#goToToday");
const selectedDayLabel = document.querySelector("#selectedDayLabel");
const dayDetails = document.querySelector("#dayDetails");

applySavedTheme();
applySavedTab();
render();
updateNotificationStatus();
checkReminderNotifications();
notificationCheckTimer = window.setInterval(checkReminderNotifications, 60000);

themeToggle.addEventListener("click", toggleTheme);
openTaskModal.addEventListener("click", toggleQuickActionMenu);
closeTaskModal.addEventListener("click", hideTaskModal);
cancelTask.addEventListener("click", hideTaskModal);
taskForm.addEventListener("submit", addTask);
closeReminderModal.addEventListener("click", hideReminderModal);
cancelReminder.addEventListener("click", hideReminderModal);
reminderForm.addEventListener("submit", saveReminder);
quickActionBackdrop.addEventListener("click", closeQuickActionMenu);
closeCustomRewardModal.addEventListener("click", hideCustomRewardModal);
cancelCustomReward.addEventListener("click", hideCustomRewardModal);
customRewardForm.addEventListener("submit", saveCustomReward);
closeQuickNoteModal.addEventListener("click", hideQuickNoteModal);
cancelQuickNote.addEventListener("click", hideQuickNoteModal);
quickNoteForm.addEventListener("submit", saveQuickNote);
enableNotifications.addEventListener("click", requestNotificationPermission);
previousMonth.addEventListener("click", () => changeCalendarMonth(-1));
nextMonth.addEventListener("click", () => changeCalendarMonth(1));
goToToday.addEventListener("click", showTodayInCalendar);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

quickChips.forEach((chip) => {
  chip.addEventListener("click", () => showReminderModal(chip.dataset.reminderType));
});

quickActionCards.forEach((card) => {
  card.addEventListener("click", () => handleQuickAction(card.dataset.action));
});

taskModal.addEventListener("click", (event) => {
  if (event.target === taskModal) {
    hideTaskModal();
  }
});

reminderModal.addEventListener("click", (event) => {
  if (event.target === reminderModal) {
    hideReminderModal();
  }
});

customRewardModal.addEventListener("click", (event) => {
  if (event.target === customRewardModal) {
    hideCustomRewardModal();
  }
});

quickNoteModal.addEventListener("click", (event) => {
  if (event.target === quickNoteModal) {
    hideQuickNoteModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (taskModal.classList.contains("open")) {
    hideTaskModal();
  }

  if (reminderModal.classList.contains("open")) {
    hideReminderModal();
  }

  if (customRewardModal.classList.contains("open")) {
    hideCustomRewardModal();
  }

  if (quickNoteModal.classList.contains("open")) {
    hideQuickNoteModal();
  }

  if (quickActionMenu.classList.contains("open")) {
    closeQuickActionMenu();
  }
});

function loadTasks() {
  const savedTasks = localStorage.getItem(TASKS_KEY);
  const today = formatDateKey(new Date());

  if (!savedTasks) {
    return defaultTasks.map((task) => normalizeTask(task, today));
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return defaultTasks.map((task) => normalizeTask(task, today));
    }

    const validTasks = parsedTasks
      .filter(isValidTask)
      .map((task) => normalizeTask(task, today));

    return validTasks.length ? validTasks : defaultTasks.map((task) => normalizeTask(task, today));
  } catch {
    return defaultTasks.map((task) => normalizeTask(task, today));
  }
}

// Mantiene compatibilidad con datos guardados y descarta registros incompletos.
function loadReminders() {
  const savedReminders = localStorage.getItem(REMINDERS_KEY);

  if (!savedReminders) {
    return [];
  }

  try {
    const parsedReminders = JSON.parse(savedReminders);

    if (!Array.isArray(parsedReminders)) {
      return [];
    }

    return parsedReminders.filter(isValidReminder).map(normalizeReminder).sort(compareReminders);
  } catch {
    return [];
  }
}

function loadRedemptions() {
  const savedRedemptions = localStorage.getItem(REDEMPTIONS_KEY);

  if (!savedRedemptions) {
    return [];
  }

  try {
    const parsedRedemptions = JSON.parse(savedRedemptions);

    if (!Array.isArray(parsedRedemptions)) {
      return [];
    }

    return parsedRedemptions.filter(isValidRedemption);
  } catch {
    return [];
  }
}

function loadActivityLog() {
  const savedActivity = localStorage.getItem(ACTIVITY_KEY);

  if (!savedActivity) {
    return [];
  }

  try {
    const parsedActivity = JSON.parse(savedActivity);

    if (!Array.isArray(parsedActivity)) {
      return [];
    }

    return parsedActivity.filter(isValidActivity).slice(0, 20);
  } catch {
    return [];
  }
}

function loadCustomRewards() {
  const savedRewards = localStorage.getItem(CUSTOM_REWARDS_KEY);

  if (!savedRewards) {
    return [];
  }

  try {
    const parsedRewards = JSON.parse(savedRewards);

    if (!Array.isArray(parsedRewards)) {
      return [];
    }

    return parsedRewards.filter(isValidReward).map(normalizeReward);
  } catch {
    return [];
  }
}

function loadQuickNotes() {
  const savedNotes = localStorage.getItem(QUICK_NOTES_KEY);

  if (!savedNotes) {
    return [];
  }

  try {
    const parsedNotes = JSON.parse(savedNotes);

    if (!Array.isArray(parsedNotes)) {
      return [];
    }

    return parsedNotes.filter(isValidNote);
  } catch {
    return [];
  }
}

function loadNotificationAlerts() {
  const savedAlerts = localStorage.getItem(NOTIFICATION_ALERTS_KEY);

  if (!savedAlerts) {
    return [];
  }

  try {
    const parsedAlerts = JSON.parse(savedAlerts);
    return Array.isArray(parsedAlerts) ? parsedAlerts.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function isValidTask(task) {
  return (
    task &&
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    task.title.trim() &&
    ["Personal", "Universidad"].includes(task.category) &&
    Number.isFinite(Number(task.stars)) &&
    Number(task.stars) > 0
  );
}

function normalizeTask(task, fallbackDate = formatDateKey(new Date())) {
  return {
    id: task.id,
    title: task.title.trim(),
    category: task.category,
    stars: Number(task.stars),
    completed: Boolean(task.completed),
    completedAt: typeof task.completedAt === "string" ? task.completedAt : "",
    priority: priorities.includes(task.priority) ? task.priority : "Media",
    date: isValidDate(task.date) ? task.date : fallbackDate
  };
}

function isValidReminder(reminder) {
  return (
    reminder &&
    typeof reminder.id === "string" &&
    reminderTypes.includes(reminder.type) &&
    courses.includes(reminder.course) &&
    isValidDate(reminder.date) &&
    isValidTime(reminder.time) &&
    priorities.includes(reminder.priority)
  );
}

function isValidRedemption(redemption) {
  return (
    redemption &&
    typeof redemption.id === "string" &&
    typeof redemption.rewardId === "string" &&
    typeof redemption.name === "string" &&
    Number.isFinite(Number(redemption.cost)) &&
    Number(redemption.cost) > 0 &&
    typeof redemption.redeemedAt === "string"
  );
}

function isValidReward(reward) {
  return (
    reward &&
    typeof reward.id === "string" &&
    typeof reward.name === "string" &&
    reward.name.trim() &&
    typeof reward.description === "string" &&
    Number.isFinite(Number(reward.cost)) &&
    Number(reward.cost) > 0
  );
}

function normalizeReward(reward) {
  return {
    id: reward.id,
    name: reward.name.trim(),
    description: reward.description.trim(),
    cost: Number(reward.cost),
    custom: Boolean(reward.custom)
  };
}

function isValidNote(note) {
  return (
    note &&
    typeof note.id === "string" &&
    typeof note.text === "string" &&
    note.text.trim() &&
    typeof note.createdAt === "string"
  );
}

function isValidActivity(activity) {
  return (
    activity &&
    typeof activity.id === "string" &&
    typeof activity.message === "string" &&
    typeof activity.createdAt === "string"
  );
}

function normalizeReminder(reminder) {
  return {
    id: reminder.id,
    type: reminder.type,
    course: reminder.course,
    date: reminder.date,
    time: reminder.time,
    description: typeof reminder.description === "string" ? reminder.description.trim() : "",
    priority: reminder.priority
  };
}

function saveTasks() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function saveReminders() {
  universityReminders.sort(compareReminders);
  localStorage.setItem(REMINDERS_KEY, JSON.stringify(universityReminders));
}

function saveRedemptions() {
  localStorage.setItem(REDEMPTIONS_KEY, JSON.stringify(rewardRedemptions));
}

function saveActivityLog() {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activityLog));
}

function saveCustomRewards() {
  localStorage.setItem(CUSTOM_REWARDS_KEY, JSON.stringify(customRewards));
}

function saveQuickNotes() {
  localStorage.setItem(QUICK_NOTES_KEY, JSON.stringify(quickNotes));
}

function saveNotificationAlerts() {
  localStorage.setItem(NOTIFICATION_ALERTS_KEY, JSON.stringify(notificationAlertsSent));
}

function render() {
  renderTasks();
  renderReminders();
  renderRewards();
  renderRewardHistory();
  renderQuickNotes();
  renderStatistics();
  renderCalendar();
  updateStats();
  updateNextEvent();
}

// Las tareas siguen alimentando estrellas, progreso y pendientes.
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("article");
    taskItem.className = `task-item${task.completed ? " completed" : ""}`;

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "task-toggle";
    toggleButton.setAttribute("aria-pressed", String(task.completed));
    toggleButton.setAttribute("aria-label", `${task.completed ? "Desmarcar" : "Completar"} ${task.title}`);
    toggleButton.innerHTML = '<span class="task-check" aria-hidden="true">✓</span>';
    toggleButton.addEventListener("click", () => toggleTask(task.id));

    const taskContent = document.createElement("div");
    taskContent.className = "task-content";

    const taskTitle = document.createElement("span");
    taskTitle.className = "task-title";
    taskTitle.textContent = task.title;

    const taskMeta = document.createElement("span");
    taskMeta.className = "task-meta";
    const priorityClass = getPriorityClass(task.priority || "Media");
    taskMeta.innerHTML = `
      <span class="pill"></span>
      <span class="pill">${formatDate(task.date)}</span>
      <span class="pill stars">+${task.stars} estrellas</span>
      <span class="pill priority-${priorityClass}">${task.priority || "Media"}</span>
    `;
    taskMeta.querySelector(".pill").textContent = task.category;

    taskContent.append(taskTitle, taskMeta);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-task";
    deleteButton.setAttribute("aria-label", `Eliminar ${task.title}`);
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    taskItem.append(toggleButton, taskContent, deleteButton);
    taskList.appendChild(taskItem);
  });
}

// Los recordatorios académicos viven separados de las tareas y se ordenan por fecha.
function renderReminders() {
  universityReminders.sort(compareReminders);
  reminderList.innerHTML = "";
  reminderCount.textContent = universityReminders.length === 1 ? "1 activo" : `${universityReminders.length} activos`;

  if (!universityReminders.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "Aún no tienes recordatorios. Usa una viñeta rápida para crear el primero.";
    reminderList.appendChild(emptyState);
    return;
  }

  universityReminders.forEach((reminder) => {
    const card = document.createElement("article");
    card.className = "reminder-card";

    const top = document.createElement("div");
    top.className = "reminder-top";

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("span");
    title.className = "reminder-title";
    title.textContent = `${reminder.type} · ${reminder.course}`;

    const meta = document.createElement("span");
    meta.className = "reminder-meta";
    meta.innerHTML = `
      <span class="pill">${formatDate(reminder.date)}</span>
      <span class="pill">${formatTime(reminder.time)}</span>
      <span class="priority-badge ${getPriorityClass(reminder.priority)}">${reminder.priority}</span>
    `;

    content.append(title, meta);

    if (reminder.description) {
      const description = document.createElement("p");
      description.className = "reminder-description";
      description.textContent = reminder.description;
      content.appendChild(description);
    }

    const actions = document.createElement("div");
    actions.className = "reminder-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "reminder-action";
    editButton.textContent = "Editar";
    editButton.setAttribute("aria-label", `Editar ${reminder.type} de ${reminder.course}`);
    editButton.addEventListener("click", () => editReminder(reminder.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "reminder-action danger";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Eliminar ${reminder.type} de ${reminder.course}`);
    deleteButton.addEventListener("click", () => deleteReminder(reminder.id));

    actions.append(editButton, deleteButton);
    top.append(content, actions);
    card.appendChild(top);
    reminderList.appendChild(card);
  });
}

function renderRewards() {
  const balance = getStarBalance();

  rewardGrid.innerHTML = "";
  rewardBalance.textContent = `${balance.available} estrellas`;
  goalBanner.classList.toggle("visible", balance.available >= WEEKLY_GOAL);

  getAllRewards().forEach((reward) => {
    const canRedeem = balance.available >= reward.cost;
    const card = document.createElement("article");
    card.className = `reward-card${canRedeem ? "" : " locked"}`;

    const top = document.createElement("div");
    top.className = "reward-top";

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("span");
    title.className = "reward-title";
    title.textContent = reward.name;

    const description = document.createElement("p");
    description.className = "reward-description";
    description.textContent = reward.description;

    const cost = document.createElement("span");
    cost.className = "reward-cost";
    cost.textContent = `${reward.cost} estrellas`;

    top.append(content, cost);
    content.append(title, description);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "redeem-button";
    button.textContent = canRedeem ? "Canjear" : "Bloqueada";
    button.disabled = !canRedeem;
    button.addEventListener("click", () => redeemReward(reward.id));

    card.append(top, button);
    rewardGrid.appendChild(card);
  });
}

function renderQuickNotes() {
  quickNoteList.innerHTML = "";
  quickNoteCount.textContent = quickNotes.length === 1 ? "1 nota" : `${quickNotes.length} notas`;

  if (!quickNotes.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "Aún no tienes notas rápidas";
    quickNoteList.appendChild(emptyState);
    return;
  }

  quickNotes.forEach((note) => {
    const item = document.createElement("article");
    item.className = "quick-note-item";

    const content = document.createElement("div");
    const text = document.createElement("p");
    text.className = "quick-note-text";
    text.textContent = note.text;

    const date = document.createElement("span");
    date.className = "quick-note-date";
    date.textContent = formatDateTime(note.createdAt);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-task";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", "Eliminar nota rápida");
    deleteButton.addEventListener("click", () => deleteQuickNote(note.id));

    content.append(text, date);
    item.append(content, deleteButton);
    quickNoteList.appendChild(item);
  });
}

function renderRewardHistory() {
  rewardHistory.innerHTML = "";
  rewardHistoryCount.textContent = rewardRedemptions.length === 1 ? "1 canje" : `${rewardRedemptions.length} canjes`;

  if (!rewardRedemptions.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "Aún no has canjeado recompensas";
    rewardHistory.appendChild(emptyState);
    return;
  }

  [...rewardRedemptions].reverse().forEach((redemption) => {
    const item = document.createElement("article");
    item.className = "history-item";

    const top = document.createElement("div");
    top.className = "history-top";

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("span");
    title.className = "history-title";
    title.textContent = redemption.name;

    const meta = document.createElement("p");
    meta.className = "history-meta";
    meta.textContent = `${formatDateTime(redemption.redeemedAt)} · ${redemption.cost} estrellas`;

    content.append(title, meta);
    top.appendChild(content);
    item.appendChild(top);
    rewardHistory.appendChild(item);
  });
}

function renderStatistics() {
  const balance = getStarBalance();
  const completedTasks = tasks.filter((task) => task.completed);

  statCompletedTasks.textContent = completedTasks.length;
  statEarnedStars.textContent = balance.earned;
  statActiveReminders.textContent = universityReminders.length;
  statRedeemedRewards.textContent = rewardRedemptions.length;

  renderWeeklyStarsChart(completedTasks);
  renderCategoryChart(completedTasks);
  renderStatsProgress(balance.available);
  renderActivityLog();
}

function renderWeeklyStarsChart(completedTasks) {
  const days = getLastSevenDays();
  const maxStars = Math.max(
    1,
    ...days.map((day) => {
      return completedTasks.reduce((total, task) => {
        return task.completedAt && task.completedAt.slice(0, 10) === day.key ? total + task.stars : total;
      }, 0);
    })
  );

  weeklyStarsChart.innerHTML = "";

  days.forEach((day) => {
    const stars = completedTasks.reduce((total, task) => {
      return task.completedAt && task.completedAt.slice(0, 10) === day.key ? total + task.stars : total;
    }, 0);
    const height = Math.max((stars / maxStars) * 100, stars > 0 ? 8 : 0);
    const bar = document.createElement("div");
    bar.className = "day-bar";
    bar.innerHTML = `
      <span class="bar-value">${stars}</span>
      <span class="bar-track"><span class="bar-fill" style="height: ${height}%"></span></span>
      <span class="bar-label">${day.label}</span>
    `;
    weeklyStarsChart.appendChild(bar);
  });
}

function renderCategoryChart(completedTasks) {
  const totals = {
    Personal: completedTasks.filter((task) => task.category === "Personal").length,
    Universidad: completedTasks.filter((task) => task.category === "Universidad").length
  };
  const maxTotal = Math.max(1, totals.Personal, totals.Universidad);

  categoryTasksChart.innerHTML = "";

  Object.entries(totals).forEach(([category, total]) => {
    const row = document.createElement("div");
    row.className = "category-row";
    row.innerHTML = `
      <span class="category-label">${category}</span>
      <span class="category-track"><span class="category-fill" style="width: ${(total / maxTotal) * 100}%"></span></span>
      <span class="category-value">${total}</span>
    `;
    categoryTasksChart.appendChild(row);
  });
}

function renderStatsProgress(availableStars) {
  const percent = Math.min(Math.round((availableStars / WEEKLY_GOAL) * 100), 100);

  statsProgressValue.textContent = `${availableStars} / ${WEEKLY_GOAL}`;
  statsProgressPercent.textContent = `${percent}%`;
  statsProgressFill.style.width = `${percent}%`;

  if (percent >= 100) {
    statsProgressMessage.textContent = "Meta semanal alcanzada";
  } else if (percent >= 50) {
    statsProgressMessage.textContent = "Vas por buen camino";
  } else {
    statsProgressMessage.textContent = "Aún puedes avanzar más";
  }
}

function renderActivityLog() {
  activityList.innerHTML = "";
  activityCount.textContent = activityLog.length === 1 ? "1 evento" : `${activityLog.length} eventos`;

  if (!activityLog.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "Aún no hay actividad reciente";
    activityList.appendChild(emptyState);
    return;
  }

  activityLog.forEach((activity) => {
    const item = document.createElement("article");
    item.className = "activity-item";
    item.innerHTML = `
      <span class="activity-title"></span>
      <span class="activity-time">${formatDateTime(activity.createdAt)}</span>
    `;
    item.querySelector(".activity-title").textContent = activity.message;
    activityList.appendChild(item);
  });
}

function renderCalendar() {
  const visibleYear = calendarVisibleDate.getFullYear();
  const visibleMonth = calendarVisibleDate.getMonth();
  const todayKey = formatDateKey(new Date());
  const firstDay = new Date(visibleYear, visibleMonth, 1);
  const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7;

  calendarMonthLabel.textContent = formatMonthYear(calendarVisibleDate);
  calendarGrid.innerHTML = "";

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    const emptyCell = document.createElement("span");
    emptyCell.className = "calendar-day calendar-day-empty";
    calendarGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(visibleYear, visibleMonth, day);
    const dateKey = formatDateKey(date);
    const dayItems = getCalendarItemsForDate(dateKey);
    const priorityClass = getHighestPriorityClass(dayItems);
    const hasActivities = dayItems.tasks.length || dayItems.reminders.length;
    const dayButton = document.createElement("button");

    dayButton.type = "button";
    dayButton.className = [
      "calendar-day",
      dateKey === todayKey ? "today" : "",
      dateKey === selectedCalendarDate ? "selected" : "",
      hasActivities ? "has-activities" : "",
      priorityClass ? `priority-${priorityClass}` : ""
    ].filter(Boolean).join(" ");
    dayButton.setAttribute("aria-pressed", String(dateKey === selectedCalendarDate));
    dayButton.setAttribute("aria-label", `${formatLongDate(dateKey)}, ${getCalendarActivityLabel(dayItems)}`);
    dayButton.addEventListener("click", () => selectCalendarDate(dateKey));

    const dayNumber = document.createElement("span");
    dayNumber.className = "calendar-day-number";
    dayNumber.textContent = String(day);
    dayButton.appendChild(dayNumber);

    if (hasActivities) {
      const indicators = document.createElement("span");
      indicators.className = "calendar-indicators";

      if (dayItems.tasks.length) {
        const taskIndicator = document.createElement("span");
        taskIndicator.className = "calendar-indicator task-indicator";
        taskIndicator.textContent = String(dayItems.tasks.length);
        taskIndicator.setAttribute("aria-label", `${dayItems.tasks.length} tareas`);
        indicators.appendChild(taskIndicator);
      }

      if (dayItems.reminders.length) {
        const reminderIndicator = document.createElement("span");
        reminderIndicator.className = "calendar-indicator reminder-indicator";
        reminderIndicator.textContent = String(dayItems.reminders.length);
        reminderIndicator.setAttribute("aria-label", `${dayItems.reminders.length} recordatorios`);
        indicators.appendChild(reminderIndicator);
      }

      dayButton.appendChild(indicators);
    }

    calendarGrid.appendChild(dayButton);
  }

  renderDayDetails();
}

function renderDayDetails() {
  const dayItems = getCalendarItemsForDate(selectedCalendarDate);
  selectedDayLabel.textContent = formatLongDate(selectedCalendarDate);
  dayDetails.innerHTML = "";

  if (!dayItems.tasks.length && !dayItems.reminders.length) {
    const emptyState = document.createElement("p");
    emptyState.className = "empty-state";
    emptyState.textContent = "No tienes actividades para este día.";
    dayDetails.appendChild(emptyState);
    return;
  }

  dayItems.tasks.forEach((task) => {
    const item = document.createElement("article");
    item.className = `day-detail-item${task.completed ? " completed" : ""}`;

    const title = document.createElement("span");
    title.className = "day-detail-title";
    title.textContent = task.title;

    const meta = document.createElement("span");
    meta.className = "task-meta";
    meta.innerHTML = `
      <span class="pill">Tarea ${task.category}</span>
      <span class="pill">${task.completed ? "Completada" : "Pendiente"}</span>
      <span class="priority-badge ${getPriorityClass(task.priority || "Media")}">${task.priority || "Media"}</span>
    `;

    item.append(title, meta);
    dayDetails.appendChild(item);
  });

  dayItems.reminders.forEach((reminder) => {
    const item = document.createElement("article");
    item.className = "day-detail-item";

    const title = document.createElement("span");
    title.className = "day-detail-title";
    title.textContent = `${reminder.type} de ${reminder.course}`;

    const meta = document.createElement("span");
    meta.className = "task-meta";
    meta.innerHTML = `
      <span class="pill">Recordatorio</span>
      <span class="pill">${formatTime(reminder.time)}</span>
      <span class="priority-badge ${getPriorityClass(reminder.priority)}">${reminder.priority}</span>
    `;

    item.append(title, meta);

    if (reminder.description) {
      const description = document.createElement("p");
      description.className = "reminder-description";
      description.textContent = reminder.description;
      item.appendChild(description);
    }

    dayDetails.appendChild(item);
  });
}

function changeCalendarMonth(offset) {
  calendarVisibleDate = new Date(calendarVisibleDate.getFullYear(), calendarVisibleDate.getMonth() + offset, 1);
  selectedCalendarDate = formatDateKey(new Date(calendarVisibleDate.getFullYear(), calendarVisibleDate.getMonth(), 1));
  renderCalendar();
}

function showTodayInCalendar() {
  const today = new Date();
  calendarVisibleDate = new Date(today.getFullYear(), today.getMonth(), 1);
  selectedCalendarDate = formatDateKey(today);
  renderCalendar();
}

function selectCalendarDate(dateKey) {
  selectedCalendarDate = dateKey;
  renderCalendar();
}

function getCalendarItemsForDate(dateKey) {
  return {
    tasks: tasks.filter((task) => task.date === dateKey),
    reminders: universityReminders.filter((reminder) => reminder.date === dateKey)
  };
}

function getCalendarActivityLabel(dayItems) {
  const labels = [];

  if (dayItems.tasks.length) {
    labels.push(`${dayItems.tasks.length} tareas`);
  }

  if (dayItems.reminders.length) {
    labels.push(`${dayItems.reminders.length} recordatorios`);
  }

  return labels.length ? labels.join(", ") : "sin actividades";
}

function getHighestPriorityClass(dayItems) {
  const dayPriorities = [
    ...dayItems.reminders.map((reminder) => reminder.priority),
    ...dayItems.tasks.map((task) => task.priority || "Media")
  ];

  if (dayPriorities.includes("Alta")) {
    return "high";
  }

  if (dayPriorities.includes("Media")) {
    return "medium";
  }

  if (dayPriorities.includes("Baja")) {
    return "low";
  }

  return "";
}

function toggleTask(taskId) {
  const currentTask = tasks.find((task) => task.id === taskId);
  const willComplete = currentTask ? !currentTask.completed : false;

  tasks = tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return {
      ...task,
      completed: willComplete,
      completedAt: willComplete ? new Date().toISOString() : ""
    };
  });

  if (currentTask) {
    addActivity(willComplete ? `Tarea completada: ${currentTask.title}` : `Tarea desmarcada: ${currentTask.title}`);
  }

  saveTasks();
  render();
}

function deleteTask(taskId) {
  const deletedTask = tasks.find((task) => task.id === taskId);
  tasks = tasks.filter((task) => task.id !== taskId);
  if (deletedTask) {
    addActivity(`Tarea eliminada: ${deletedTask.title}`);
  }
  saveTasks();
  render();
}

function addTask(event) {
  event.preventDefault();

  const title = taskName.value.trim();
  const category = taskCategory.value;
  const date = taskDate.value;
  const stars = Number(taskStars.value);
  const priority = taskPriority.value;

  if (!title) {
    showFormError(formError, "Escribe el nombre de la tarea.");
    return;
  }

  if (!["Personal", "Universidad"].includes(category)) {
    showFormError(formError, "Elige una categoría válida.");
    return;
  }

  if (!isValidDate(date)) {
    showFormError(formError, "Elige una fecha válida.");
    return;
  }

  if (!Number.isFinite(stars) || stars <= 0) {
    showFormError(formError, "Escribe una cantidad de estrellas mayor a 0.");
    return;
  }

  if (!priorities.includes(priority)) {
    showFormError(formError, "Elige una prioridad válida.");
    return;
  }

  tasks = [
    ...tasks,
    {
      id: createId("task"),
      title,
      category,
      date,
      stars: Math.round(stars),
      completed: false,
      completedAt: "",
      priority
    }
  ];

  addActivity(`Tarea creada: ${title}`);
  saveTasks();
  render();
  hideTaskModal();
}

function saveReminder(event) {
  event.preventDefault();

  const reminderData = {
    id: reminderId.value || createId("reminder"),
    type: reminderType.value,
    course: reminderCourse.value,
    date: reminderDate.value,
    time: reminderTime.value,
    description: reminderDescription.value.trim(),
    priority: reminderPriority.value
  };

  if (!isValidReminder(reminderData)) {
    showFormError(reminderError, "Completa tipo, curso, fecha, hora y prioridad correctamente.");
    return;
  }

  const isEditing = Boolean(reminderId.value);

  if (isEditing) {
    universityReminders = universityReminders.map((reminder) => {
      return reminder.id === reminderData.id ? reminderData : reminder;
    });
  } else {
    universityReminders = [...universityReminders, reminderData];
    addActivity(`Recordatorio creado: ${reminderData.type} de ${reminderData.course}`);
  }

  saveReminders();
  render();
  hideReminderModal();
}

function editReminder(id) {
  const reminder = universityReminders.find((item) => item.id === id);

  if (!reminder) {
    return;
  }

  showReminderModal(reminder.type, reminder);
}

function deleteReminder(id) {
  const deletedReminder = universityReminders.find((reminder) => reminder.id === id);
  universityReminders = universityReminders.filter((reminder) => reminder.id !== id);
  if (deletedReminder) {
    addActivity(`Recordatorio eliminado: ${deletedReminder.type} de ${deletedReminder.course}`);
  }
  saveReminders();
  render();
}

function redeemReward(rewardId) {
  const reward = getAllRewards().find((item) => item.id === rewardId);

  if (!reward) {
    return;
  }

  if (getStarBalance().available < reward.cost) {
    showToast("Aún no tienes suficientes estrellas");
    return;
  }

  rewardRedemptions = [
    ...rewardRedemptions,
    {
      id: createId("redemption"),
      rewardId: reward.id,
      name: reward.name,
      cost: reward.cost,
      redeemedAt: new Date().toISOString()
    }
  ];

  saveRedemptions();
  addActivity(`Recompensa canjeada: ${reward.name}`);
  render();
  showToast("Recompensa canjeada");
}

function saveCustomReward(event) {
  event.preventDefault();

  const name = customRewardName.value.trim();
  const description = customRewardDescription.value.trim();
  const cost = Number(customRewardCost.value);

  if (!name) {
    showFormError(customRewardError, "Escribe el nombre de la recompensa.");
    return;
  }

  if (!description) {
    showFormError(customRewardError, "Escribe una descripción breve.");
    return;
  }

  if (!Number.isFinite(cost) || cost <= 0) {
    showFormError(customRewardError, "Escribe un costo mayor a 0.");
    return;
  }

  customRewards = [
    ...customRewards,
    {
      id: createId("custom-reward"),
      name,
      description,
      cost: Math.round(cost),
      custom: true
    }
  ];

  saveCustomRewards();
  addActivity(`Recompensa personalizada creada: ${name}`);
  render();
  hideCustomRewardModal();
  setActiveTab("rewards");
  showToast("Recompensa creada");
}

function saveQuickNote(event) {
  event.preventDefault();

  const text = quickNoteText.value.trim();

  if (!text) {
    showFormError(quickNoteError, "Escribe una nota corta.");
    return;
  }

  quickNotes = [
    {
      id: createId("note"),
      text,
      createdAt: new Date().toISOString()
    },
    ...quickNotes
  ];

  saveQuickNotes();
  addActivity("Nota rápida creada");
  render();
  hideQuickNoteModal();
  setActiveTab("home");
  showToast("Nota guardada");
}

function deleteQuickNote(id) {
  quickNotes = quickNotes.filter((note) => note.id !== id);
  saveQuickNotes();
  addActivity("Nota rápida eliminada");
  render();
}

async function requestNotificationPermission() {
  if (!supportsNotifications()) {
    updateNotificationStatus();
    return;
  }

  try {
    await window.Notification.requestPermission();
    updateNotificationStatus();
    checkReminderNotifications();
  } catch {
    updateNotificationStatus();
  }
}

function updateNotificationStatus() {
  if (!supportsNotifications()) {
    notificationStatus.textContent = "No soportadas";
    notificationStatus.className = "notification-status blocked";
    notificationMessage.textContent = "Tu navegador no soporta notificaciones.";
    enableNotifications.disabled = true;
    return;
  }

  const permission = window.Notification.permission;
  notificationStatus.classList.remove("enabled", "blocked");
  enableNotifications.disabled = permission === "granted" || permission === "denied";

  if (permission === "granted") {
    notificationStatus.textContent = "Activadas";
    notificationStatus.classList.add("enabled");
    notificationMessage.textContent = "Te avisaré mientras la app esté abierta.";
    return;
  }

  if (permission === "denied") {
    notificationStatus.textContent = "Bloqueadas";
    notificationStatus.classList.add("blocked");
    notificationMessage.textContent = "Las notificaciones están bloqueadas en el navegador.";
    return;
  }

  notificationStatus.textContent = "Pendientes";
  notificationMessage.textContent = "Activa los avisos para tus recordatorios universitarios.";
}

function checkReminderNotifications(now = new Date()) {
  updateNotificationStatus();

  if (!supportsNotifications() || window.Notification.permission !== "granted") {
    return;
  }

  universityReminders.forEach((reminder) => {
    const reminderTime = getReminderTimestamp(reminder);

    if (!Number.isFinite(reminderTime) || reminderTime <= now.getTime()) {
      return;
    }

    notificationOffsets.forEach((offsetMinutes) => {
      const alertTime = reminderTime - offsetMinutes * 60000;
      const elapsed = now.getTime() - alertTime;
      const alertId = `${reminder.id}:${offsetMinutes}`;

      if (elapsed < 0 || elapsed > 60000 || notificationAlertsSent.includes(alertId)) {
        return;
      }

      sendReminderNotification(reminder);
      notificationAlertsSent = [...notificationAlertsSent, alertId];
      saveNotificationAlerts();
    });
  });
}

function sendReminderNotification(reminder) {
  const title = `${reminder.type} — ${reminder.course}`;
  const body = `${getRelativeReminderDay(reminder.date)} a las ${formatTime(reminder.time)} · Prioridad ${reminder.priority}`;

  try {
    new window.Notification(title, { body });
  } catch {
    // Algunos navegadores pueden bloquear la instancia aunque el permiso exista.
  }

  showToast(`${title}: ${body}`);
}

function supportsNotifications() {
  return "Notification" in window;
}

function getRelativeReminderDay(value) {
  const today = formatDateKey(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (value === today) {
    return "Hoy";
  }

  if (value === formatDateKey(tomorrow)) {
    return "Mañana";
  }

  return formatDate(value);
}

function updateStats() {
  const balance = getStarBalance();
  const pendingTasks = tasks.filter((task) => !task.completed).length;
  const progress = Math.min((balance.available / WEEKLY_GOAL) * 100, 100);

  weeklyStars.textContent = `${balance.available} / ${WEEKLY_GOAL}`;
  weeklyProgress.style.width = `${progress}%`;
  taskCount.textContent = pendingTasks === 1 ? "1 pendiente" : `${pendingTasks} pendientes`;
}

// La tarjeta principal siempre refleja el recordatorio académico más cercano.
function updateNextEvent() {
  const nextReminder = [...universityReminders].sort(compareReminders)[0];

  if (!nextReminder) {
    nextEventTitle.textContent = "Sin eventos próximos";
    nextEventTime.textContent = "Agrega uno desde Universidad";
    return;
  }

  nextEventTitle.textContent = `${nextReminder.type} de ${nextReminder.course}`;
  nextEventTime.textContent = `${formatDate(nextReminder.date)} · ${formatTime(nextReminder.time)}`;
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
  setTheme(nextTheme);
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  setTheme(savedTheme);
}

function setTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark-mode", isDark);
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}

function applySavedTab() {
  const savedTab = localStorage.getItem(ACTIVE_TAB_KEY) || "home";
  setActiveTab(savedTab);
}

function setActiveTab(tabName) {
  const safeTab = ["home", "university", "rewards", "statistics", "calendar"].includes(tabName) ? tabName : "home";

  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === safeTab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  tabViews.forEach((view) => {
    view.classList.toggle("active", view.dataset.view === safeTab);
  });

  localStorage.setItem(ACTIVE_TAB_KEY, safeTab);
}

function showTaskModal(defaultCategory = "Personal") {
  taskModal.classList.add("open");
  taskModal.setAttribute("aria-hidden", "false");
  clearTaskForm();
  taskCategory.value = ["Personal", "Universidad"].includes(defaultCategory) ? defaultCategory : "Personal";
  taskName.focus();
}

function hideTaskModal() {
  taskModal.classList.remove("open");
  taskModal.setAttribute("aria-hidden", "true");
  clearTaskForm();
  openTaskModal.focus();
}

function toggleQuickActionMenu() {
  if (quickActionMenu.classList.contains("open")) {
    closeQuickActionMenu();
    return;
  }

  openQuickActionMenu();
}

function openQuickActionMenu() {
  quickActionMenu.classList.add("open");
  quickActionBackdrop.classList.add("open");
  quickActionMenu.setAttribute("aria-hidden", "false");
  quickActionBackdrop.setAttribute("aria-hidden", "false");
  openTaskModal.classList.add("open");
  openTaskModal.setAttribute("aria-expanded", "true");
}

function closeQuickActionMenu() {
  quickActionMenu.classList.remove("open");
  quickActionBackdrop.classList.remove("open");
  quickActionMenu.setAttribute("aria-hidden", "true");
  quickActionBackdrop.setAttribute("aria-hidden", "true");
  openTaskModal.classList.remove("open");
  openTaskModal.setAttribute("aria-expanded", "false");
}

function handleQuickAction(action) {
  closeQuickActionMenu();

  if (action === "task") {
    showTaskModal("Personal");
    return;
  }

  if (action === "reminder") {
    showReminderModal("Tarea");
    return;
  }

  if (action === "reward") {
    showCustomRewardModal();
    return;
  }

  if (action === "note") {
    showQuickNoteModal();
  }
}

function showReminderModal(type, reminder = null) {
  const isEditing = Boolean(reminder);
  const selectedType = reminderTypes.includes(type) ? type : reminderTypes[0];

  reminderModalTitle.textContent = isEditing ? "Editar recordatorio" : "Crear recordatorio";
  reminderId.value = isEditing ? reminder.id : "";
  reminderType.value = isEditing ? reminder.type : selectedType;
  reminderCourse.value = isEditing ? reminder.course : courses[0];
  reminderDate.value = isEditing ? reminder.date : "";
  reminderTime.value = isEditing ? reminder.time : "";
  reminderPriority.value = isEditing ? reminder.priority : "Media";
  reminderDescription.value = isEditing ? reminder.description : "";
  reminderError.textContent = "";

  reminderModal.classList.add("open");
  reminderModal.setAttribute("aria-hidden", "false");
  reminderType.focus();
}

function hideReminderModal() {
  reminderModal.classList.remove("open");
  reminderModal.setAttribute("aria-hidden", "true");
  clearReminderForm();
}

function showCustomRewardModal() {
  customRewardModal.classList.add("open");
  customRewardModal.setAttribute("aria-hidden", "false");
  clearCustomRewardForm();
  customRewardName.focus();
}

function hideCustomRewardModal() {
  customRewardModal.classList.remove("open");
  customRewardModal.setAttribute("aria-hidden", "true");
  clearCustomRewardForm();
}

function showQuickNoteModal() {
  quickNoteModal.classList.add("open");
  quickNoteModal.setAttribute("aria-hidden", "false");
  clearQuickNoteForm();
  quickNoteText.focus();
}

function hideQuickNoteModal() {
  quickNoteModal.classList.remove("open");
  quickNoteModal.setAttribute("aria-hidden", "true");
  clearQuickNoteForm();
}

function clearTaskForm() {
  taskForm.reset();
  taskCategory.value = "Personal";
  taskDate.value = formatDateKey(new Date());
  taskPriority.value = "Media";
  formError.textContent = "";
}

function clearReminderForm() {
  reminderForm.reset();
  reminderId.value = "";
  reminderType.value = "Cuestionario";
  reminderCourse.value = courses[0];
  reminderPriority.value = "Media";
  reminderError.textContent = "";
}

function clearCustomRewardForm() {
  customRewardForm.reset();
  customRewardError.textContent = "";
}

function clearQuickNoteForm() {
  quickNoteForm.reset();
  quickNoteError.textContent = "";
}

function showFormError(target, message) {
  target.textContent = message;
}

function compareReminders(a, b) {
  return getReminderTimestamp(a) - getReminderTimestamp(b);
}

function getReminderTimestamp(reminder) {
  return new Date(`${reminder.date}T${reminder.time}`).getTime();
}

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short"
  }).format(date);
}

function formatMonthYear(date) {
  return new Intl.DateTimeFormat("es-PE", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatLongDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  }).format(date);
}

function formatTime(value) {
  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("es-PE", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function getStarBalance() {
  const earned = tasks.reduce((total, task) => {
    return task.completed ? total + task.stars : total;
  }, 0);
  const spent = rewardRedemptions.reduce((total, redemption) => {
    return total + Number(redemption.cost);
  }, 0);

  return {
    earned,
    spent,
    available: Math.max(earned - spent, 0)
  };
}

function getAllRewards() {
  return [...rewards, ...customRewards];
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2400);
}

function addActivity(message) {
  activityLog = [
    {
      id: createId("activity"),
      message,
      createdAt: new Date().toISOString()
    },
    ...activityLog
  ].slice(0, 20);

  saveActivityLog();
}

function getLastSevenDays() {
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      key: formatDateKey(date),
      label: new Intl.DateTimeFormat("es-PE", { weekday: "short" }).format(date).replace(".", "")
    };
  });
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getPriorityClass(priority) {
  if (priority === "Baja") {
    return "low";
  }

  if (priority === "Alta") {
    return "high";
  }

  return "medium";
}

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00`).getTime());
}

function isValidTime(value) {
  return /^\d{2}:\d{2}$/.test(value);
}

function createId(prefix) {
  if (window.crypto && window.crypto.randomUUID) {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      // La app sigue funcionando aunque el navegador bloquee el registro.
    });
  });
}

registerServiceWorker();
