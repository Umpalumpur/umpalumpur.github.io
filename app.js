const STORAGE_KEY = 'linux-quest-progress-v3';

const missions = Array.isArray(window.linuxQuestMissions) ? window.linuxQuestMissions : [];

const sandbox = typeof window.createSandbox === 'function' ? window.createSandbox() : null;
const hintLibrary = window.linuxQuestHints || {};


const state = {
    levelIndex: 0,
    taskIndex: 0,
    attempts: 0,
    log: [],
    unlockedChapters: new Set(),
    unlockedRewards: new Set(),
    npcStates: {}
};

const levelsContainer = document.getElementById('levels');
const missionTitle = document.getElementById('mission-title');
const missionDescription = document.getElementById('mission-description');
const terminalOutput = document.getElementById('terminal-output');
const terminalForm = document.getElementById('terminal-form');
const commandInput = document.getElementById('command');
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
const promptLabel = document.getElementById('prompt-label');
const mobileTabs = Array.from(document.querySelectorAll('.mobile-tab'));
const storyChapterTitle = document.getElementById('story-chapter-title');
const storyChapterText = document.getElementById('story-chapter-text');
const storyBeatText = document.getElementById('story-beat-text');
const rewardList = document.getElementById('reward-list');
const npcStatus = document.getElementById('npc-status');
const mobileLevelSelect = document.getElementById('mobile-level-select');
const mobileTaskSelect = document.getElementById('mobile-task-select');
const panelsMap = {
    'levels-panel': document.getElementById('levels-panel'),
    'terminal-panel': document.getElementById('terminal-panel'),
    'status-panel': document.getElementById('status-panel')
};
const compactQuery = window.matchMedia('(max-width: 900px)');
let activeMobilePanelId = 'terminal-panel';

missions.forEach(mission => {
    mission.tasks.forEach(task => {
        task.completed = Boolean(task.completed);
    });
});

function isCompactLayout() {
    return compactQuery.matches;
}

function updateMobileTabs(targetId) {
    mobileTabs.forEach(tab => {
        const isActive = tab.dataset.target === targetId;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });
}

function setActiveMobilePanel(targetId, options = {}) {
    if (!panelsMap[targetId]) {
        return;
    }
    activeMobilePanelId = targetId;
    updateMobileTabs(targetId);

    const shouldScroll = Boolean(options.scroll);
    const scrollBehavior = options.instant ? 'auto' : 'smooth';

    if (isCompactLayout()) {
        Object.entries(panelsMap).forEach(([id, panel]) => {
            if (!panel) return;
            panel.hidden = id !== targetId;
        });
        if (shouldScroll) {
            requestAnimationFrame(() => {
                const panel = panelsMap[targetId];
                if (panel) {
                    panel.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
                }
            });
        }
    } else {
        Object.values(panelsMap).forEach(panel => {
            if (panel) {
                panel.hidden = false;
            }
        });
    }
}

function syncPanelVisibility() {
    if (isCompactLayout()) {
        setActiveMobilePanel(activeMobilePanelId, { scroll: false, instant: true });
    } else {
        Object.values(panelsMap).forEach(panel => {
            if (panel) {
                panel.hidden = false;
            }
        });
        updateMobileTabs(activeMobilePanelId);
    }
}

function ensureTerminalPanel(options = {}) {
    setActiveMobilePanel('terminal-panel', options);
}

function scrollCommandInputIntoView() {
    if (!commandInput) return;
    if (!isCompactLayout()) return;
    requestAnimationFrame(() => {
        commandInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function normalizeCommand(value) {
    return value.replace(/\s+/g, ' ').trim();
}

function deriveHintKey(task) {
    if (!task) return '';
    if (task.hintKey) return task.hintKey;
    const base = normalizeCommand(task.command || '');
    if (!base) return '';
    const parts = base.split(' ');
    if (parts[0] === 'sudo') {
        parts.shift();
    }
    if (parts[0] === 'git' && parts[1]) {
        return `git ${parts[1]}`;
    }
    if (parts[0] === 'docker' && parts[1] === 'compose' && parts[2]) {
        return `docker compose ${parts[2]}`;
    }
    if (parts[0] === 'docker' && parts[1]) {
        return `docker ${parts[1]}`;
    }
    if (parts[0] === 'systemctl' && parts[1]) {
        return `systemctl ${parts[1]}`;
    }
    if (parts[0] === 'ufw' && parts[1]) {
        return `ufw ${parts[1]}`;
    }
    if (parts[0] === 'grep') {
        if (parts.includes('-n')) return 'grep -n';
        if (parts.includes('-c')) return 'grep -c';
        if (parts.includes('-i')) return 'grep -i';
        if (parts.includes('-R')) return 'grep -R';
        return 'grep';
    }
    if (parts[0] === 'find') {
        if (parts.includes('-maxdepth')) return 'find markdown';
        return 'find log';
    }
    if (parts[0] === 'ls') {
        if (parts.some(part => part.includes('-l'))) return 'ls -l';
        if (parts.some(part => part.includes('-a'))) return 'ls -a';
        if (parts.length > 1) return 'ls dir';
        return 'ls';
    }
    if (parts[0] === 'cd') {
        if (parts[1] === '..') return 'cd up';
        return 'cd into';
    }
    if (parts[0] === 'echo') {
        if (base.includes('>>')) return 'echo >>';
        return 'echo';
    }
    if (parts[0] === 'ps') {
        return 'ps grep';
    }
    if (parts[0] === 'wc') {
        return 'wc -l';
    }
    if (parts[0] === 'sort') {
        return parts.includes('-u') ? 'sort -u' : 'sort';
    }
    if (parts[0] === 'journalctl') {
        return 'journalctl';
    }
    if (parts[0] === 'ansible-playbook') {
        return 'ansible-playbook';
    }
    if (parts[0] === 'ssh-keygen') {
        return 'ssh-keygen';
    }
    return parts[0];
}

function getHint(task) {
    const key = deriveHintKey(task);
    if (key && hintLibrary[key]) {
        return hintLibrary[key];
    }
    if (task?.learning) {
        return `Подумайте, какая команда подходит: ${task.learning.toLowerCase()}`;
    }
    return 'Внимательно перечитайте условие и попробуйте применить знакомые команды.';
}

function matchesCommand(value, task) {
    const normalized = normalizeCommand(value);
    const variants = [];
    if (task.command) {
        variants.push(task.command);
    }
    if (Array.isArray(task.alternatives)) {
        variants.push(...task.alternatives);
    }
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
        return task.validate(value, normalized);
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
                mission.tasks.forEach((task, index) => {
                    const saved = data.completed[mission.id];
                    task.completed = Array.isArray(saved) ? Boolean(saved[index]) : false;
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
        if (Array.isArray(data?.story)) {
            state.unlockedChapters = new Set(data.story);
        }
        if (Array.isArray(data?.rewards)) {
            state.unlockedRewards = new Set(data.rewards);
        }
        if (data?.npcStates && typeof data.npcStates === 'object') {
            state.npcStates = { ...data.npcStates };
        }
        missions.forEach(mission => {
            const complete = mission.tasks.every(task => task.completed);
            if (complete) {
                if (mission.story) {
                    state.unlockedChapters.add(mission.id);
                }
                if (mission.reward) {
                    state.unlockedRewards.add(mission.reward.id);
                }
            }
        });
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
            taskIndex: state.taskIndex,
            story: Array.from(state.unlockedChapters),
            rewards: Array.from(state.unlockedRewards),
            npcStates: state.npcStates
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
        console.warn('Не удалось сохранить прогресс', error);
    }
}

function persistState() {
    saveProgress();
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
    state.unlockedChapters = new Set();
    state.unlockedRewards = new Set();
    state.npcStates = {};
    terminalOutput.textContent = '';
    logContainer.innerHTML = '';
    if (sandbox && typeof sandbox.resetAll === 'function') {
        sandbox.resetAll();
        updatePrompt();
    }
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn('Не удалось очистить прогресс', error);
    }
    renderLevels();
    renderTask();
    updateOverallProgress();
    updateRewardsPanel();
    updateStoryPanel();
    updateNpcPanel();
    log('Прогресс сброшен. Начинаем заново!');
}

function ensureActiveTask() {
    const mission = missions[state.levelIndex];
    if (!mission || mission.tasks.length === 0) {
        state.taskIndex = 0;
        return;
    }
    if (mission.tasks[state.taskIndex] && !mission.tasks[state.taskIndex].completed) {
        return;
    }
    const nextIndex = mission.tasks.findIndex(task => !task.completed);
    state.taskIndex = nextIndex === -1 ? mission.tasks.length - 1 : nextIndex;
}

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildTaskDescription(task) {
    const parts = [];
    if (task.description) {
        parts.push(`<p>${task.description}</p>`);
    }
    if (task.learning) {
        parts.push(`<p><strong>Практика:</strong> ${task.learning}</p>`);
    }
    if (task.context) {
        parts.push(`<p class="muted">${task.context}</p>`);
    }
    if (task.storyBeat) {
        parts.push(`<p class="muted">${task.storyBeat}</p>`);
    }
    return parts.join('');
}

function renderLevels() {
    levelsContainer.innerHTML = '';
    missions.forEach((mission, index) => {
        const completedTasks = mission.tasks.filter(task => task.completed).length;
        const totalTasks = mission.tasks.length;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'level' + (index === state.levelIndex ? ' active' : '');
        button.innerHTML = `
            <span>
                <strong>${mission.title}</strong><br>
                <small class="muted">${mission.summary}</small>
            </span>
            <span class="level-meta">
                <span class="badge badge-small">${mission.difficulty}</span>
                <span style="color: var(--accent); font-weight: 600;">${completedTasks}/${totalTasks}</span>
            </span>
        `;
        button.addEventListener('click', () => {
            state.levelIndex = index;
            ensureActiveTask();
            state.attempts = 0;
            renderLevels();
            renderTask();
            log(`Переключение на уровень «${mission.title}».`);
            persistState();
        });
        levelsContainer.appendChild(button);
    });
    renderMobileSelectors();
}

function renderTask() {
    ensureActiveTask();
    const mission = missions[state.levelIndex];
    if (!mission) return;
    if (sandbox) {
        sandbox.useScenario(mission.id);
        updatePrompt();
    }
    const task = mission.tasks[state.taskIndex];
    if (!task) return;
    missionTitle.textContent = `${mission.title}: ${task.title}`;
    missionDescription.innerHTML = buildTaskDescription(task);
    terminalOutput.textContent = '';
    commandInput.value = '';
    ensureTerminalPanel({ scroll: false, instant: true });
    if (!isCompactLayout()) {
        commandInput.focus();
    }
    scrollCommandInputIntoView();
    updateMissionMeta();
    updateStoryPanel();
    updateRewardsPanel();
    updateNpcPanel();
    renderTasksList();
    renderMobileSelectors();
    updateMissionProgress();
    updateOverallProgress();
    updateAttempts();
    persistState();
}

function updateMissionMeta() {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    levelSummaryText.textContent = mission.summary;
    difficultyBadge.textContent = mission.difficulty;
    skillsContainer.innerHTML = mission.skills.map(skill => `<span class="chip">${skill}</span>`).join('');
    objectivesList.innerHTML = mission.objectives.map(item => `<li>${item}</li>`).join('');
    resourcesList.innerHTML = mission.resources.map(resource => `
        <li>
            <a href="${resource.url}" target="_blank" rel="noopener">${resource.label}</a>
            ${resource.description ? `<span>— ${resource.description}</span>` : ''}
        </li>
    `).join('');
}

function renderTasksList() {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    tasksContainer.innerHTML = mission.tasks.map((task, index) => {
        const classes = ['task'];
        if (task.completed) classes.push('completed');
        if (index === state.taskIndex) classes.push('active');
        const summary = task.learning || task.description;
        return `
            <button class="${classes.join(' ')}" type="button" data-index="${index}">
                <div>
                    <strong>${task.title}</strong>
                    <span>${summary}</span>
                </div>
                <div class="task-meta">
                    <span>${task.explanation ? 'Разбор' : 'Практика'}</span>
                    <span>${task.completed ? 'завершено' : `шаг ${index + 1}/${mission.tasks.length}`}</span>
                </div>
            </button>
        `;
    }).join('');
}

function renderMobileSelectors() {
    if (!mobileLevelSelect || !mobileTaskSelect) return;
    const levelOptions = missions.map((mission, index) => {
        const completedTasks = mission.tasks.filter(task => task.completed).length;
        const totalTasks = mission.tasks.length;
        const labelSuffix = totalTasks > 0 ? ` (${completedTasks}/${totalTasks})` : '';
        const label = `${mission.title}${labelSuffix}`;
        const selected = index === state.levelIndex ? ' selected' : '';
        return `<option value="${index}"${selected}>${escapeHtml(label)}</option>`;
    });
    if (levelOptions.length === 0) {
        mobileLevelSelect.innerHTML = '<option value="">Нет глав</option>';
        mobileLevelSelect.disabled = true;
    } else {
        mobileLevelSelect.innerHTML = levelOptions.join('');
        mobileLevelSelect.disabled = false;
    }

    const mission = missions[state.levelIndex];
    if (!mission || mission.tasks.length === 0) {
        mobileTaskSelect.innerHTML = '<option value="">Нет заданий</option>';
        mobileTaskSelect.disabled = true;
        return;
    }

    const taskOptions = mission.tasks.map((task, index) => {
        const prefix = `${index + 1}. ${task.title}`;
        const suffix = task.completed ? ' ✓' : '';
        const selected = index === state.taskIndex ? ' selected' : '';
        return `<option value="${index}"${selected}>${escapeHtml(prefix + suffix)}</option>`;
    });
    mobileTaskSelect.innerHTML = taskOptions.join('');
    mobileTaskSelect.disabled = false;
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

function updateStoryPanel() {
    if (!storyChapterTitle || !storyChapterText || !storyBeatText) return;
    const mission = missions[state.levelIndex];
    if (!mission || !mission.story) {
        storyChapterTitle.textContent = 'История кампании';
        storyChapterText.textContent = 'Следуйте заданиям, чтобы открыть главы сюжета и получить награды наставников.';
        storyBeatText.textContent = '';
        return;
    }
    const story = mission.story;
    storyChapterTitle.textContent = story.chapter;
    const completed = mission.tasks.every(task => task.completed);
    const unlocked = completed || state.unlockedChapters.has(mission.id);
    storyChapterText.textContent = unlocked ? (story.outro || story.intro) : story.intro;
    const task = mission.tasks[state.taskIndex];
    storyBeatText.textContent = task?.storyBeat || '';
}

function updateRewardsPanel() {
    if (!rewardList) return;
    const entries = missions
        .filter(mission => mission.reward)
        .map(mission => {
            const unlocked = state.unlockedRewards.has(mission.reward.id);
            const classes = ['reward'];
            if (unlocked) classes.push('reward--earned');
            const description = unlocked
                ? mission.reward.description
                : (mission.reward.hint || 'Пройдите главу, чтобы открыть награду.');
            return `
                <li class="${classes.join(' ')}">
                    <strong>${mission.reward.title}</strong>
                    <small>${description}</small>
                </li>
            `;
        });
    if (entries.length === 0) {
        rewardList.innerHTML = '<li class="reward"><small>Награды появятся после первых миссий.</small></li>';
    } else {
        rewardList.innerHTML = entries.join('');
    }
}

function updateNpcPanel() {
    if (!npcStatus) return;
    const mission = missions[state.levelIndex];
    const lines = [];
    if (mission?.npc) {
        const record = state.npcStates[mission.npc.id];
        if (record) {
            lines.push(`${mission.npc.name}: ${record.status}`);
            if (record.description) {
                lines.push(record.description);
            }
        } else {
            lines.push(`${mission.npc.name}: ${mission.npc.intro}`);
        }
    }
    Object.values(state.npcStates).forEach(entry => {
        if (mission?.npc && entry.id === mission.npc.id) return;
        lines.push(`${entry.name}: ${entry.status}`);
        if (entry.description) {
            lines.push(entry.description);
        }
    });
    if (lines.length === 0) {
        lines.push('Сеть спокойна. Выполняйте задания, чтобы встретить союзников и противников.');
    }
    npcStatus.textContent = lines.join('\n');
}

function handleSandboxEvent(event) {
    if (!event) return;
    const events = Array.isArray(event) ? event : [event];
    let changed = false;
    events.forEach(item => {
        if (item.type === 'npc' && item.id) {
            state.npcStates[item.id] = {
                id: item.id,
                name: item.name || 'Неизвестный NPC',
                status: item.status || 'Обновление',
                description: item.description || ''
            };
            if (item.log) {
                log(item.log);
            }
            changed = true;
        }
    });
    if (changed) {
        updateNpcPanel();
        persistState();
    }
}

function updateAttempts() {
    if (state.attempts > 0) {
        attemptsText.textContent = `Попыток: ${state.attempts}`;
    } else {
        attemptsText.textContent = '';
    }
}

function log(message) {
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    state.log.push(`[${time}] ${message}`);
    if (state.log.length > 20) state.log.shift();
    logContainer.innerHTML = state.log.map(entry => `<div class="log-entry">${entry}</div>`).join('');
    logContainer.scrollTop = logContainer.scrollHeight;
}

function appendTerminal(text, type = 'system') {
    const prompt = type === 'input' ? 'user@linuxquest:~$ ' : '';
    const formatted = text.endsWith('\\n') ? text : `${text}\\n`;
    terminalOutput.textContent += `${prompt}${formatted}`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const mission = missions[state.levelIndex];
    if (!mission) return;
    const task = mission.tasks[state.taskIndex];
    if (!task) return;
    const value = commandInput.value.trim();
    if (!value) return;

    ensureTerminalPanel({ scroll: false });
    appendTerminal(value, 'input');
    const execution = sandbox ? sandbox.execute(value) : { output: '' };
    if (execution && execution.output) {
        appendTerminal(execution.output);
    }
    if (execution && execution.note) {
        appendTerminal(execution.note);
    }
    if (execution?.event || execution?.events) {
        handleSandboxEvent(execution.events || execution.event);
    }
    updatePrompt();

    state.attempts += 1;
    updateAttempts();

    if (matchesCommand(value, task)) {
        if (task.response) {
            appendTerminal(task.response);
        }
        appendTerminal(task.success);
        if (task.explanation) {
            appendTerminal(`Разбор: ${task.explanation}`);
        }
        task.completed = true;
        log(`Задание «${task.title}» завершено.`);
        state.attempts = 0;
        updateAttempts();
        persistState();
        updateMissionProgress();
        updateOverallProgress();

        const nextIndex = mission.tasks.findIndex(t => !t.completed);
        if (nextIndex !== -1) {
            state.taskIndex = nextIndex;
            setTimeout(renderTask, 600);
        } else {
            appendTerminal(`Уровень «${mission.title}» завершён!`);
            const firstCompletion = !state.unlockedChapters.has(mission.id);
            state.unlockedChapters.add(mission.id);
            if (firstCompletion && mission.story && mission.story.outro) {
                appendTerminal(mission.story.outro);
            }
            if (mission.reward) {
                const unlockedBefore = state.unlockedRewards.has(mission.reward.id);
                state.unlockedRewards.add(mission.reward.id);
                if (!unlockedBefore) {
                    appendTerminal(`Получена награда: ${mission.reward.title}!`);
                    log(`Открыт трофей «${mission.reward.title}».`);
                }
            }
            updateStoryPanel();
            updateRewardsPanel();
            persistState();
            const nextMissionIndex = missions.findIndex((m, idx) => idx > state.levelIndex && m.tasks.some(t => !t.completed));
            if (nextMissionIndex !== -1) {
                state.levelIndex = nextMissionIndex;
                ensureActiveTask();
                setTimeout(() => {
                    renderLevels();
                    renderTask();
                    log(`Открыт следующий уровень «${missions[state.levelIndex].title}».`);
                }, 1200);
            }
        }
    } else {
        const failure = task.failure || 'Цель задания пока не выполнена. Перечитайте условие или попросите подсказку.';
        appendTerminal(failure);
        log(`Команда "${value}" не закрыла задание «${task.title}».`);
    }

    commandInput.value = '';
    commandInput.focus();
    scrollCommandInputIntoView();
});

hintBtn.addEventListener('click', () => {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    const task = mission.tasks[state.taskIndex];
    if (!task) return;
    appendTerminal(`Подсказка: ${getHint(task)}`);
    log(`Выдана подсказка для «${task.title}».`);
});

skipBtn.addEventListener('click', () => {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    if (mission.tasks.length === 0) return;
    const allCompleted = mission.tasks.every(task => task.completed);
    let nextIndex = (state.taskIndex + 1) % mission.tasks.length;
    if (!allCompleted) {
        for (let step = 1; step <= mission.tasks.length; step += 1) {
            const candidate = (state.taskIndex + step) % mission.tasks.length;
            if (!mission.tasks[candidate].completed) {
                nextIndex = candidate;
                break;
            }
        }
    }
    state.taskIndex = nextIndex;
    state.attempts = 0;
    renderTask();
    log('Задание пропущено. Вы можете вернуться к нему позже.');
    persistState();
});

if (tasksContainer) {
    tasksContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.task');
        if (!button) return;
        const index = Number(button.dataset.index);
        if (Number.isNaN(index)) return;
        state.taskIndex = index;
        state.attempts = 0;
        renderTask();
        log(`Открыто задание «${missions[state.levelIndex].tasks[index].title}».`);
        ensureTerminalPanel({ scroll: true });
    });
}

if (mobileLevelSelect) {
    mobileLevelSelect.addEventListener('change', (event) => {
        const { value } = event.target;
        if (value === '') {
            return;
        }
        const nextLevel = Number(value);
        if (Number.isNaN(nextLevel) || !missions[nextLevel]) {
            return;
        }
        state.levelIndex = nextLevel;
        ensureActiveTask();
        state.attempts = 0;
        renderLevels();
        renderTask();
        log(`Переключение на уровень «${missions[state.levelIndex].title}» (мобильный выбор).`);
        persistState();
    });
}

if (mobileTaskSelect) {
    mobileTaskSelect.addEventListener('change', (event) => {
        const { value } = event.target;
        if (value === '') {
            return;
        }
        const nextTask = Number(value);
        if (Number.isNaN(nextTask)) {
            return;
        }
        state.taskIndex = nextTask;
        state.attempts = 0;
        renderTask();
        log(`Открыто задание «${missions[state.levelIndex].tasks[nextTask].title}» (мобильный выбор).`);
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', resetProgress);
}

mobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.dataset.target;
        setActiveMobilePanel(targetId, { scroll: true });
    });
    tab.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const targetId = tab.dataset.target;
            setActiveMobilePanel(targetId, { scroll: true });
        }
    });
});

if (compactQuery.addEventListener) {
    compactQuery.addEventListener('change', syncPanelVisibility);
} else if (compactQuery.addListener) {
    compactQuery.addListener(syncPanelVisibility);
}

if (commandInput) {
    commandInput.addEventListener('focus', () => {
        ensureTerminalPanel({ scroll: false });
        scrollCommandInputIntoView();
    });
}

syncPanelVisibility();

loadProgress();
renderLevels();
renderTask();
updateOverallProgress();
log('Добро пожаловать в Linux Quest! Выберите задание и начинайте практику.');
