const STORAGE_KEY = 'linux-quest-progress-v3';

if (!Array.isArray(window.missions) || window.missions.length === 0) {
    throw new Error('Не удалось загрузить учебные миссии. Проверьте missions.js.');
}

const shell = new VirtualShell();

const state = {
    levelIndex: 0,
    taskIndex: 0,
    attempts: 0,
    log: []
};

const levelsContainer = document.getElementById('levels');
const missionTitle = document.getElementById('mission-title');
const missionDescription = document.getElementById('mission-description');
const terminalOutput = document.getElementById('terminal-output');
const terminalForm = document.getElementById('terminal-form');
const commandInput = document.getElementById('command');
const promptLabel = document.getElementById('prompt-label');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const progressLabel = document.getElementById('progress-label');
const logContainer = document.getElementById('log');
const hintBtn = document.getElementById('hint-btn');
const skipBtn = document.getElementById('skip-btn');
const attemptsText = document.getElementById('attempts');
const tasksContainer = document.getElementById('tasks');
const difficultyBadge = document.getElementById('difficulty-badge');
const levelSummaryText = document.getElementById('level-summary-text');
const skillsContainer = document.getElementById('skills');
const objectivesList = document.getElementById('objectives');
const resourcesList = document.getElementById('resources');
const overallProgressBar = document.getElementById('overall-progress-bar');
const overallProgressText = document.getElementById('overall-progress-text');
const resetBtn = document.getElementById('reset-btn');
const resetEnvBtn = document.getElementById('reset-env-btn');
const taskCounter = document.getElementById('task-counter');
const taskTags = document.getElementById('task-tags');
const taskIntel = document.getElementById('task-intel');

missions.forEach(mission => {
    mission.tasks.forEach(task => {
        task.completed = Boolean(task.completed);
    });
});

let activeMissionId = null;

function normalizeCommand(value) {
    return value.replace(/\s+/g, ' ').trim();
}

function matchesCommand(value, task) {
    const normalized = normalizeCommand(value);
    const variants = [];
    if (task.command) variants.push(task.command);
    if (Array.isArray(task.alternatives)) variants.push(...task.alternatives);
    if (variants.some(cmd => normalizeCommand(cmd) === normalized)) {
        return true;
    }
    if (Array.isArray(task.matchers)) {
        return task.matchers.some(pattern => {
            if (pattern instanceof RegExp) {
                return pattern.test(value);
            }
            if (typeof pattern === 'string') {
                try {
                    return new RegExp(pattern).test(value);
                } catch (error) {
                    return false;
                }
            }
            return false;
        });
    }
    if (typeof task.validate === 'function') {
        return task.validate(value, normalized, shell);
    }
    return false;
}

function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data?.completed) {
            missions.forEach(mission => {
                const stored = data.completed[mission.id];
                mission.tasks.forEach((task, index) => {
                    task.completed = Array.isArray(stored) ? Boolean(stored[index]) : false;
                });
            });
        }
        if (Number.isInteger(data?.levelIndex)) {
            state.levelIndex = Math.min(Math.max(data.levelIndex, 0), missions.length - 1);
        }
        if (Number.isInteger(data?.taskIndex)) {
            const mission = missions[state.levelIndex];
            if (mission) {
                state.taskIndex = Math.min(Math.max(data.taskIndex, 0), mission.tasks.length - 1);
            }
        }
    } catch (error) {
        console.warn('Не удалось загрузить прогресс', error);
    }
}

function saveProgress() {
    try {
        const completed = missions.reduce((acc, mission) => {
            acc[mission.id] = mission.tasks.map(task => Boolean(task.completed));
            return acc;
        }, {});
        const payload = {
            completed,
            levelIndex: state.levelIndex,
            taskIndex: state.taskIndex
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
        console.warn('Не удалось сохранить прогресс', error);
    }
}

function persistState() {
    saveProgress();
    updateMissionProgress();
    updateOverallProgress();
    renderLevels();
    renderTasksList();
}

function resetProgress() {
    missions.forEach(mission => {
        mission.tasks.forEach(task => {
            task.completed = false;
        });
    });
    state.levelIndex = 0;
    state.taskIndex = 0;
    state.attempts = 0;
    state.log = [];
    terminalOutput.textContent = '';
    logContainer.innerHTML = '';
    saveProgress();
    loadMissionEnvironment(missions[0], true);
    ensureActiveTask();
    renderLevels();
    renderTask();
    updateMissionProgress();
    updateOverallProgress();
    updateAttempts();
    logEvent('Прогресс кампании сброшен.');
}

function ensureActiveTask() {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    if (state.taskIndex >= mission.tasks.length) {
        state.taskIndex = mission.tasks.findIndex(task => !task.completed);
        if (state.taskIndex === -1) state.taskIndex = mission.tasks.length - 1;
    }
    if (state.taskIndex < 0) state.taskIndex = 0;
}

function loadMissionEnvironment(mission, force = false) {
    if (!mission) return;
    if (force || mission.id !== activeMissionId) {
        const scenario = mission.scenario();
        shell.loadScenario(scenario);
        activeMissionId = mission.id;
        updatePrompt();
        terminalOutput.textContent = '';
        logEvent(`Окружение уровня «${mission.title}» готово.`);
    }
}

function updatePrompt() {
    promptLabel.textContent = `${shell.prompt()} `;
}

function renderLevels() {
    levelsContainer.innerHTML = missions.map((mission, index) => {
        const completed = mission.tasks.filter(task => task.completed).length;
        const total = mission.tasks.length || 1;
        const percent = Math.round((completed / total) * 100);
        const active = index === state.levelIndex ? 'active' : '';
        return `
            <button class="level ${active}" data-index="${index}">
                <div>
                    <strong>${mission.title}</strong>
                    <span class="muted">${mission.summary}</span>
                </div>
                <div class="level-meta">
                    <span class="badge badge-small">${mission.difficulty}</span>
                    <span class="muted">${completed}/${total}</span>
                    <span class="muted">${percent}%</span>
                </div>
            </button>
        `;
    }).join('');
}

function renderTasksList() {
    const mission = missions[state.levelIndex];
    if (!mission) {
        tasksContainer.innerHTML = '';
        return;
    }
    tasksContainer.innerHTML = mission.tasks.map((task, index) => {
        const classes = [task.completed ? 'completed' : '', index === state.taskIndex ? 'active' : ''].join(' ').trim();
        return `
            <button class="task ${classes}" data-task-index="${index}">
                <strong>${task.title}</strong>
                <span>${task.description}</span>
                <div class="task-meta">
                    <span>${task.completed ? 'завершено' : `шаг ${index + 1}/${mission.tasks.length}`}</span>
                    <span>${task.learning}</span>
                </div>
            </button>
        `;
    }).join('');
}

function updateMissionMeta() {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    missionTitle.textContent = mission.title;
    difficultyBadge.textContent = mission.difficulty;
    levelSummaryText.textContent = mission.summary;
    skillsContainer.innerHTML = mission.skills.map(skill => `<span class="chip">${skill}</span>`).join('');
    objectivesList.innerHTML = mission.objectives.map(item => `<li>${item}</li>`).join('');
    resourcesList.innerHTML = mission.resources.map(resource => `
        <li><a href="${resource.url}" target="_blank" rel="noopener">${resource.label}</a><span>${resource.description}</span></li>
    `).join('');
}

function renderTask() {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    const task = mission.tasks[state.taskIndex];
    if (!task) return;

    missionDescription.innerHTML = `
        <p>${mission.summary}</p>
        <p><strong>Задача:</strong> ${task.description}</p>
        <p><strong>Контекст:</strong> ${task.context || 'Практикум'}</p>
        <p><strong>Учимся:</strong> ${task.learning}</p>
    `;
    taskCounter.textContent = `Шаг ${state.taskIndex + 1} из ${mission.tasks.length}`;
    taskTags.textContent = `Навык: ${task.learning}`;
    if (task.intel) {
        taskIntel.hidden = false;
        taskIntel.textContent = task.intel;
    } else {
        taskIntel.hidden = true;
        taskIntel.textContent = '';
    }
    renderTasksList();
    updatePrompt();
    updateAttempts();
}

function updateMissionProgress() {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    const completedTasks = mission.tasks.filter(task => task.completed).length;
    const totalTasks = mission.tasks.length || 1;
    const progress = Math.round((completedTasks / totalTasks) * 100);
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Заданий выполнено: ${completedTasks} из ${totalTasks} (${progress}%)`;
    progressLabel.textContent = `Прогресс уровня «${mission.title}»`;
}

function updateOverallProgress() {
    const totalTasks = missions.reduce((total, mission) => total + mission.tasks.length, 0) || 1;
    const completed = missions.reduce((total, mission) => total + mission.tasks.filter(task => task.completed).length, 0);
    const progress = Math.round((completed / totalTasks) * 100);
    overallProgressBar.style.width = `${progress}%`;
    overallProgressText.textContent = `Выполнено ${completed} из ${totalTasks} заданий (${progress}%)`;
}

function updateAttempts() {
    if (state.attempts > 0) {
        attemptsText.textContent = `Попыток: ${state.attempts}`;
    } else {
        attemptsText.textContent = '';
    }
}

function logEvent(message) {
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    state.log.push(`[${time}] ${message}`);
    if (state.log.length > 30) state.log.shift();
    logContainer.innerHTML = state.log.map(entry => `<div class="log-entry">${entry}</div>`).join('');
    logContainer.scrollTop = logContainer.scrollHeight;
}

function appendTerminal(text, { type = 'output' } = {}) {
    if (type === 'clear') {
        terminalOutput.textContent = '';
        return;
    }
    const prompt = type === 'input' ? `${shell.prompt()} ` : '';
    const formatted = text.endsWith('\n') ? text : `${text}\n`;
    terminalOutput.textContent += `${prompt}${formatted}`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function getNextTaskIndex(mission) {
    const next = mission.tasks.findIndex(task => !task.completed);
    if (next === -1) {
        return mission.tasks.length - 1;
    }
    return next;
}

function advanceToNextTask() {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    const next = mission.tasks.findIndex(task => !task.completed);
    if (next !== -1) {
        state.taskIndex = next;
        renderTask();
        return;
    }
    logEvent(`Уровень «${mission.title}» завершён.`);
    appendTerminal(`Уровень «${mission.title}» завершён!`);
    const nextMissionIndex = missions.findIndex((candidate, idx) => idx > state.levelIndex && candidate.tasks.some(task => !task.completed));
    if (nextMissionIndex !== -1) {
        state.levelIndex = nextMissionIndex;
        state.taskIndex = getNextTaskIndex(missions[state.levelIndex]);
        loadMissionEnvironment(missions[state.levelIndex], true);
        renderLevels();
        renderTask();
        updateMissionMeta();
        updateMissionProgress();
        logEvent(`Открыт следующий уровень «${missions[state.levelIndex].title}».`);
    }
}

terminalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const mission = missions[state.levelIndex];
    if (!mission) return;
    const task = mission.tasks[state.taskIndex];
    if (!task) return;
    const value = commandInput.value.trim();
    if (!value) return;

    appendTerminal(value, { type: 'input' });
    const execution = shell.run(value);

    if (execution.clear) {
        appendTerminal('', { type: 'clear' });
    }
    if (execution.stdout) {
        appendTerminal(execution.stdout, { type: 'output' });
    }
    if (execution.stderr) {
        appendTerminal(execution.stderr, { type: 'output' });
    }

    state.attempts += 1;
    updateAttempts();

    if (matchesCommand(value, task)) {
        task.completed = true;
        state.attempts = 0;
        updateAttempts();
        appendTerminal(task.success || 'Задание выполнено!', { type: 'output' });
        if (task.explanation) {
            appendTerminal(`Разбор: ${task.explanation}`, { type: 'output' });
        }
        logEvent(`Задание «${task.title}» завершено.`);
        persistState();
        advanceToNextTask();
    } else {
        appendTerminal('Результат команды не привёл к выполнению цели. Проанализируйте вывод и попробуйте снова.', { type: 'output' });
        logEvent(`Команда «${value}» не решила задачу «${task.title}».`);
    }

    commandInput.value = '';
    commandInput.focus();
});

hintBtn.addEventListener('click', () => {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    const task = mission.tasks[state.taskIndex];
    if (!task) return;
    appendTerminal(`Подсказка: ${task.hint}`, { type: 'output' });
    logEvent(`Выдана подсказка для «${task.title}».`);
});

skipBtn.addEventListener('click', () => {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    if (mission.tasks.length === 0) return;
    let nextIndex = (state.taskIndex + 1) % mission.tasks.length;
    for (let i = 0; i < mission.tasks.length; i += 1) {
        const candidate = (state.taskIndex + 1 + i) % mission.tasks.length;
        if (!mission.tasks[candidate].completed) {
            nextIndex = candidate;
            break;
        }
    }
    state.taskIndex = nextIndex;
    logEvent(`Переход к заданию «${mission.tasks[state.taskIndex].title}».`);
    renderTask();
});

resetEnvBtn.addEventListener('click', () => {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    loadMissionEnvironment(mission, true);
    state.attempts = 0;
    updateAttempts();
});

resetBtn.addEventListener('click', () => {
    resetProgress();
});

levelsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-index]');
    if (!button) return;
    const index = Number(button.dataset.index);
    if (Number.isNaN(index)) return;
    state.levelIndex = index;
    state.taskIndex = getNextTaskIndex(missions[state.levelIndex]);
    loadMissionEnvironment(missions[state.levelIndex], missions[state.levelIndex].id !== activeMissionId);
    renderLevels();
    updateMissionMeta();
    renderTask();
    updateMissionProgress();
});

tasksContainer.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-task-index]');
    if (!button) return;
    const index = Number(button.dataset['taskIndex'] || button.dataset.taskIndex);
    if (Number.isNaN(index)) return;
    state.taskIndex = index;
    renderTask();
});

function initialize() {
    loadProgress();
    ensureActiveTask();
    loadMissionEnvironment(missions[state.levelIndex], true);
    updateMissionMeta();
    renderLevels();
    renderTask();
    updateMissionProgress();
    updateOverallProgress();
    updateAttempts();
    commandInput.focus();
}

initialize();
