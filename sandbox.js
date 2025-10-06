(function () {
    const HOME = '/home/cadet';
    const HOST = 'linuxquest';
    const encoder = new TextEncoder();

    const missionOrder = ['foundation', 'navigator', 'explorer', 'operator', 'devops', 'security'];

    const missionNote = 'Чтобы открыть портал, изучи конфигурацию сервиса.\n';
    const dataList = ['alex', 'irina', 'alex', 'pavel', 'sofia', 'irina', 'mario', 'sofia'];
    const reportLines = [
        '1. Отчёт по сервису',
        '2. Метрика SLA',
        '3. Ошибки за неделю',
        '4. Итоги поддержки',
        '5. Повторные обращения',
        '6. План улучшений',
        '7. Аналитика нагрузки',
        '8. Метрики отклика',
        '9. Отладка очередей',
        '10. Настройка кешей',
        '11. Запуск миграций',
        '12. 2023-09-15 Ошибка авторизации',
        '13. 2023-09-15 Повторный запуск',
        '14. 2023-09-15 Статус ок',
        '15. 2023-09-15 Ожидание проверки',
        '16. 2023-09-15 Завершено успешно'
    ];
    const syslogLines = [
        'Sep 15 10:12:01 app CRON[1204]: (cadet) CMD (run-pipeline)',
        'Sep 15 10:13:42 app kernel: ERROR: disk quota exceeded',
        'Sep 15 10:14:33 app nginx[2145]: error while loading module cache',
        'Sep 15 10:15:22 app systemd[1]: Started Daily backup job',
        'Sep 15 10:16:05 app nginx[2145]: Warning: worker_connections are low'
    ];
    const authLog = 'Sep 15 09:58:01 app sshd[980]: Accepted publickey for admin from 10.0.0.5 port 60234 ssh2\n';
    const nginxAccess = '10.0.0.5 - - [15/Sep/2023:10:18:25 +0000] "GET /health HTTP/1.1" 200 42 "-" "curl/7.81.0"\n';

    function generateResultsCsv() {
        const lines = ['name,group,score'];
        for (let i = 1; i <= 127; i += 1) {
            const name = `student${String(i).padStart(3, '0')}`;
            const group = `team-${((i - 1) % 5) + 1}`;
            const score = 60 + (i % 40);
            lines.push(`${name},${group},${score}`);
        }
        return `${lines.join('\\n')}\\n`;
    }

    function buildPlanScript() {
        const lines = [
            '#!/bin/bash',
            '# План деплоя версии 2',
            'echo "Подготовка окружения"',
            'echo "Проверка зависимостей"',
            'echo "Запуск тестов"',
            'echo "Сборка контейнеров"',
            'echo "Прогон smoke-тестов"',
            'echo "Готовим релизную заметку"'
        ];
        while (lines.length < 60) {
            lines.push(`# step ${lines.length + 1}: выполнить проверку`);
        }
        lines[41] = 'TODO: обновить инструкции по деплою';
        lines[55] = 'echo "Релиз завершён"';
        return `${lines.join('\\n')}\\n`;
    }

    function createBaseState() {
        return {
            user: 'cadet',
            host: HOST,
            cwd: HOME,
            nodes: new Map(),
            docker: { up: false },
            services: { nginxRunning: true, nginxEnabled: true },
            ufwRules: new Set(),
            ufwEnabled: false,
            gitBranch: 'main'
        };
    }

    function normalizePath(path) {
        if (!path || path === '/') return '/';
        const parts = path.split('/').filter(Boolean);
        return `/${parts.join('/')}`;
    }

    function parentPath(path) {
        if (!path || path === '/') return '/';
        const parts = path.split('/').filter(Boolean);
        parts.pop();
        return parts.length ? `/${parts.join('/')}` : '/';
    }

    function addDir(state, path, meta = {}) {
        const normalized = normalizePath(path);
        if (state.nodes.has(normalized)) {
            return state.nodes.get(normalized);
        }
        const node = {
            type: 'dir',
            name: normalized === '/' ? '/' : normalized.split('/').pop(),
            mode: meta.mode || '755',
            owner: meta.owner || (normalized.startsWith(HOME) ? state.user : 'root'),
            group: meta.group || (normalized.startsWith(HOME) ? state.user : 'root'),
            modified: Date.now(),
            children: new Set()
        };
        state.nodes.set(normalized, node);
        if (normalized !== '/') {
            const parent = addDir(state, parentPath(normalized));
            parent.children.add(node.name);
        }
        return node;
    }

    function addFile(state, path, content = '', meta = {}) {
        const normalized = normalizePath(path);
        const parent = addDir(state, parentPath(normalized));
        const node = {
            type: 'file',
            name: normalized.split('/').pop(),
            mode: meta.mode || '644',
            owner: meta.owner || (normalized.startsWith(HOME) ? state.user : 'root'),
            group: meta.group || (normalized.startsWith(HOME) ? state.user : 'root'),
            modified: Date.now(),
            content
        };
        state.nodes.set(normalized, node);
        parent.children.add(node.name);
        return node;
    }

    function getNode(state, path) {
        return state.nodes.get(normalizePath(path));
    }

    function setFileContent(state, path, content) {
        const node = getNode(state, path);
        if (node && node.type === 'file') {
            node.content = content;
            node.modified = Date.now();
        }
    }

    function appendFileContent(state, path, content) {
        const node = getNode(state, path);
        if (node && node.type === 'file') {
            node.content = `${node.content || ''}${content}`;
            node.modified = Date.now();
        }
    }

    function removeNode(state, path) {
        const normalized = normalizePath(path);
        const node = state.nodes.get(normalized);
        if (!node) return false;
        if (node.type === 'dir' && node.children.size > 0) return false;
        const parent = getNode(state, parentPath(normalized));
        if (parent && parent.type === 'dir') {
            parent.children.delete(node.name);
        }
        state.nodes.delete(normalized);
        return true;
    }

    function renameFile(state, source, destination) {
        const srcPath = normalizePath(source);
        const dstPath = normalizePath(destination);
        const node = state.nodes.get(srcPath);
        if (!node || node.type !== 'file') return false;
        const srcParent = getNode(state, parentPath(srcPath));
        if (srcParent && srcParent.type === 'dir') {
            srcParent.children.delete(node.name);
        }
        const dstParentPath = parentPath(dstPath);
        const dstParent = addDir(state, dstParentPath);
        node.name = dstPath.split('/').pop();
        node.modified = Date.now();
        state.nodes.delete(srcPath);
        state.nodes.set(dstPath, node);
        dstParent.children.add(node.name);
        return true;
    }

    function listDirectory(state, path) {
        const dir = getNode(state, path);
        if (!dir || dir.type !== 'dir') return [];
        return Array.from(dir.children).sort((a, b) => a.localeCompare(b));
    }

    function formatMode(mode, type) {
        const types = type === 'dir' ? 'd' : '-';
        const symbols = { 0: '---', 1: '--x', 2: '-w-', 3: '-wx', 4: 'r--', 5: 'r-x', 6: 'rw-', 7: 'rwx' };
        const digits = mode.split('').map(d => symbols[d] || '---').join('');
        return `${types}${digits}`;
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[date.getMonth()]} ${String(date.getDate()).padStart(2, ' ')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }

    function getSize(node) {
        if (node.type === 'dir') return 4096;
        return encoder.encode(node.content || '').length;
    }

    function buildBaseFilesystem(state) {
        addDir(state, '/');
        addDir(state, '/home');
        addDir(state, HOME, { owner: state.user, group: state.user });
        addDir(state, `${HOME}/Документы`, { owner: state.user, group: state.user });
        addDir(state, `${HOME}/Загрузки`, { owner: state.user, group: state.user });
        addDir(state, `${HOME}/архив`, { owner: state.user, group: state.user });
        addDir(state, `${HOME}/.ssh`, { owner: state.user, group: state.user, mode: '700' });

        addFile(state, `${HOME}/миссия.txt`, missionNote, { owner: state.user, group: state.user });
        addFile(state, `${HOME}/.bashrc`, '# ~/.bashrc\n', { owner: state.user, group: state.user });
        addFile(state, `${HOME}/backup.tar.gz`, 'ARCHIVE\n', { owner: state.user, group: state.user, mode: '600' });
        addFile(state, `${HOME}/данные.txt`, `${dataList.join('\n')}\n`, { owner: state.user, group: state.user });
        addFile(state, `${HOME}/отчёт.log`, `${reportLines.join('\n')}\n`, { owner: state.user, group: state.user });
        addFile(state, `${HOME}/Документы/результаты.csv`, generateResultsCsv(), { owner: state.user, group: state.user });
        addFile(state, `${HOME}/deploy.yml`, '---\n- hosts: staging\n  tasks:\n    - debug: msg="Deploy application"\n', { owner: state.user, group: state.user });
        addFile(state, `${HOME}/docker-compose.yml`, 'services:\n  web:\n    image: app:latest\n    ports:\n      - "8080:80"\n  db:\n    image: postgres:14\n', { owner: state.user, group: state.user });
        addFile(state, `${HOME}/.ssh/id_rsa`, '-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n', { owner: state.user, group: state.user, mode: '644' });

        addDir(state, '/var');
        addDir(state, '/var/log');
        addDir(state, '/var/log/nginx');
        addFile(state, '/var/log/syslog', `${syslogLines.join('\n')}\n`, { owner: 'root', group: 'adm', mode: '640' });
        addFile(state, '/var/log/auth.log', authLog, { owner: 'root', group: 'adm', mode: '640' });
        addFile(state, '/var/log/nginx/access.log', nginxAccess, { owner: 'www-data', group: 'adm', mode: '640' });

        addDir(state, '/srv');
        addDir(state, '/srv/data', { owner: 'root', group: 'root' });
        addFile(state, '/srv/data/metrics.json', '{"requests":1240,"errors":3}\n', { owner: 'root', group: 'root', mode: '644' });

        addDir(state, '/etc');
        addDir(state, '/etc/ssh');
        addFile(state, '/etc/ssh/sshd_config', 'Port 22\nPermitRootLogin no\nPasswordAuthentication no\n', { owner: 'root', group: 'root', mode: '644' });
    }
    function applyFoundationProgress(state) {
        addDir(state, `${HOME}/проекты`, { owner: state.user, group: state.user });
        addFile(state, `${HOME}/проекты/дневник.md`, 'День первый: стартую\n', { owner: state.user, group: state.user });
        addFile(state, `${HOME}/проекты/план.sh`, buildPlanScript(), { owner: state.user, group: state.user, mode: '644' });
        addFile(state, `${HOME}/проекты/заметки.txt`, 'Наброски идей и команд для практики.\n', { owner: state.user, group: state.user });
        addFile(state, `${HOME}/проекты/чеклист.md`, '## Чек-лист подготовки\n- [ ] Проверить логи\n- [ ] Обновить TODO\n', { owner: state.user, group: state.user });
        addDir(state, `${HOME}/проекты/архив`, { owner: state.user, group: state.user });
        addFile(state, `${HOME}/проекты/архив/история.md`, '# История изменений\n', { owner: state.user, group: state.user });
    }

    function applyNavigatorProgress(state) {
        const diary = getNode(state, `${HOME}/проекты/дневник.md`);
        if (diary && diary.type === 'file' && !diary.content.includes('День первый: стартую')) {
            diary.content = `${diary.content}День первый: стартую\n`;
        }
        if (getNode(state, `${HOME}/проекты/план.sh`)) {
            renameFile(state, `${HOME}/проекты/план.sh`, `${HOME}/проекты/план_v2.sh`);
        }
        addFile(state, `${HOME}/архив/проекты.tar.gz`, 'ARCHIVE OF PROJECTS\n', { owner: state.user, group: state.user, mode: '644' });
        removeNode(state, `${HOME}/архив/дневник.md`);
    }

    function applyExplorerProgress(state) {
        // Дополнительных изменений не требуется — окружение уже подготовлено.
    }

    function applyOperatorProgress(state) {
        state.services.nginxRunning = true;
    }

    function applyDevopsProgress(state) {
        state.gitBranch = 'release/v1.2';
        state.docker.up = false;
    }

    function applySecurityProgress(state) {
        // Сохраняем состояние после предыдущих миссий.
    }

    const progressMap = {
        foundation: applyFoundationProgress,
        navigator: applyNavigatorProgress,
        explorer: applyExplorerProgress,
        operator: applyOperatorProgress,
        devops: applyDevopsProgress,
        security: applySecurityProgress
    };

    function buildScenarioState(id) {
        const state = createBaseState();
        buildBaseFilesystem(state);
        const index = missionOrder.indexOf(id);
        const limit = index === -1 ? 0 : index;
        for (let i = 0; i < limit; i += 1) {
            const key = missionOrder[i];
            const apply = progressMap[key];
            if (typeof apply === 'function') {
                apply(state);
            }
        }
        return state;
    }

    function tokenize(input) {
        const tokens = [];
        let current = '';
        let quote = null;
        for (let i = 0; i < input.length; i += 1) {
            const ch = input[i];
            if (quote) {
                if (ch === quote) {
                    quote = null;
                } else if (ch === '\\' && i + 1 < input.length) {
                    i += 1;
                    current += input[i];
                } else {
                    current += ch;
                }
                continue;
            }
            if (ch === '"' || ch === '\'') {
                quote = ch;
                continue;
            }
            if (ch === ' ' || ch === '\t') {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
                continue;
            }
            if (ch === '>') {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
                if (input[i + 1] === '>') {
                    tokens.push('>>');
                    i += 1;
                } else {
                    tokens.push('>');
                }
                continue;
            }
            tokens.push(ch);
        }
        if (current) {
            tokens.push(current);
        }
        const merged = [];
        for (let i = 0; i < tokens.length; i += 1) {
            const token = tokens[i];
            if (token.length === 1 && token !== '>' && token !== '>>') {
                let buffer = token;
                while (i + 1 < tokens.length && tokens[i + 1].length === 1 && tokens[i + 1] !== '>' && tokens[i + 1] !== '>>') {
                    buffer += tokens[i + 1];
                    i += 1;
                }
                merged.push(buffer);
            } else {
                merged.push(token);
            }
        }
        return merged;
    }
    function resolvePath(state, target) {
        if (!target || target === '~') return HOME;
        let path = target;
        if (path.startsWith('~')) {
            path = `${HOME}${path.slice(1)}`;
        }
        const absolute = path.startsWith('/');
        const segments = absolute ? [] : state.cwd.split('/').filter(Boolean);
        path.split('/').forEach(segment => {
            if (!segment || segment === '.') return;
            if (segment === '..') {
                segments.pop();
            } else {
                segments.push(segment);
            }
        });
        return `/${segments.join('/')}` || '/';
    }

    function matchPattern(name, pattern) {
        const escaped = pattern.replace(/[.+^${}()|[\\]\\]/g, '\\$&').replace(/\\\*/g, '.*').replace(/\\\?/g, '.');
        const regex = new RegExp(`^${escaped}$`);
        return regex.test(name);
    }

    function collectFiles(state, startPath) {
        const node = getNode(state, startPath);
        if (!node) return [];
        if (node.type === 'file') return [normalizePath(startPath)];
        const results = [];
        node.children.forEach(name => {
            const childPath = startPath === '/' ? `/${name}` : `${startPath}/${name}`;
            const child = getNode(state, childPath);
            if (!child) return;
            if (child.type === 'file') {
                results.push(childPath);
            } else {
                results.push(...collectFiles(state, childPath));
            }
        });
        return results;
    }

    function handleLs(state, args) {
        const options = args.filter(arg => arg.startsWith('-'));
        const paths = args.filter(arg => !arg.startsWith('-'));
        const showAll = options.some(opt => opt.includes('a'));
        const longFormat = options.some(opt => opt.includes('l'));
        const target = paths[0] ? resolvePath(state, paths[0]) : state.cwd;
        const node = getNode(state, target);
        if (!node) {
            return { output: `ls: cannot access '${paths[0]}': No such file or directory\n`, error: true };
        }
        if (node.type === 'file') {
            if (longFormat) {
                const line = `${formatMode(node.mode, 'file')} 1 ${node.owner} ${node.group} ${String(getSize(node)).padStart(6, ' ')} ${formatTimestamp(node.modified)} ${node.name}`;
                return { output: `${line}\n` };
            }
            return { output: `${node.name}\n` };
        }
        const entries = listDirectory(state, target);
        const items = [];
        if (showAll) {
            items.push('.');
            items.push('..');
        }
        items.push(...entries);
        if (longFormat) {
            const lines = items.map(name => {
                const childPath = target === '/' ? `/${name}` : `${target}/${name}`;
                const child = getNode(state, childPath);
                if (!child) return '';
                return `${formatMode(child.mode, child.type)} 1 ${child.owner} ${child.group} ${String(getSize(child)).padStart(6, ' ')} ${formatTimestamp(child.modified)} ${name}`;
            }).filter(Boolean);
            return { output: `${lines.join('\n')}\n` };
        }
        return { output: `${items.join('  ')}\n` };
    }

    function handleCd(state, args) {
        const target = args[0] ? resolvePath(state, args[0]) : HOME;
        const node = getNode(state, target);
        if (!node || node.type !== 'dir') {
            return { output: `bash: cd: ${args[0] || target}: Нет такого файла или каталога\n`, error: true };
        }
        state.cwd = target;
        return { output: '' };
    }

    function handleMkdir(state, args) {
        const allowParents = args.includes('-p');
        const targets = args.filter(arg => !arg.startsWith('-'));
        const messages = [];
        targets.forEach(target => {
            const path = resolvePath(state, target);
            if (getNode(state, path)) {
                if (!allowParents) {
                    messages.push(`mkdir: cannot create directory '${target}': File exists`);
                }
            } else {
                addDir(state, path, { owner: state.user, group: state.user });
            }
        });
        return { output: messages.length ? `${messages.join('\n')}\n` : '' };
    }

    function handleTouch(state, args) {
        args.forEach(arg => {
            const path = resolvePath(state, arg);
            const node = getNode(state, path);
            if (node && node.type === 'file') {
                node.modified = Date.now();
            } else {
                addFile(state, path, '', { owner: state.user, group: state.user });
            }
        });
        return { output: '' };
    }

    function handleEcho(state, tokens) {
        let redirect = null;
        let target = null;
        const parts = [];
        for (let i = 1; i < tokens.length; i += 1) {
            const token = tokens[i];
            if (token === '>' || token === '>>') {
                redirect = token;
                target = tokens[i + 1];
                break;
            }
            parts.push(token);
        }
        const text = parts.join(' ');
        if (redirect && target) {
            const path = resolvePath(state, target);
            if (!getNode(state, path)) {
                addFile(state, path, '', { owner: state.user, group: state.user });
            }
            if (redirect === '>>') {
                appendFileContent(state, path, `${text}\n`);
            } else {
                setFileContent(state, path, `${text}\n`);
            }
            return { output: '' };
        }
        return { output: `${text}\n` };
    }

    function handleCat(state, args) {
        const outputs = [];
        args.forEach(arg => {
            const path = resolvePath(state, arg);
            const node = getNode(state, path);
            if (!node || node.type !== 'file') {
                outputs.push(`cat: ${arg}: No such file or directory`);
            } else {
                outputs.push(node.content || '');
            }
        });
        return { output: outputs.join('') };
    }

    function handleMan(args) {
        const topic = args[0] || '';
        if (topic === 'ls') {
            return { output: 'LS(1)\nNAME\n    ls - list directory contents\nSYNOPSIS\n    ls [OPTION]... [FILE]...\n' };
        }
        return { output: `No manual entry for ${topic}\n` };
    }

    function handleCp(state, args) {
        if (args.length < 2) return { output: '' };
        const sourcePath = resolvePath(state, args[0]);
        const destinationRaw = args[1];
        const source = getNode(state, sourcePath);
        if (!source || source.type !== 'file') {
            return { output: `cp: cannot stat '${args[0]}': No such file or directory\n`, error: true };
        }
        let destPath = resolvePath(state, destinationRaw);
        const destNode = getNode(state, destPath);
        if (destNode && destNode.type === 'dir') {
            destPath = destPath === '/' ? `/${source.name}` : `${destPath}/${source.name}`;
        }
        addFile(state, destPath, source.content, { owner: source.owner, group: source.group, mode: source.mode });
        return { output: '' };
    }

    function handleMv(state, args) {
        if (args.length < 2) return { output: '' };
        const sourcePath = resolvePath(state, args[0]);
        let destPath = resolvePath(state, args[1]);
        const source = getNode(state, sourcePath);
        if (!source) {
            return { output: `mv: cannot stat '${args[0]}': No such file or directory\n`, error: true };
        }
        const destNode = getNode(state, destPath);
        if (destNode && destNode.type === 'dir') {
            destPath = destPath === '/' ? `/${source.name}` : `${destPath}/${source.name}`;
        }
        if (source.type === 'file') {
            renameFile(state, sourcePath, destPath);
        }
        return { output: '' };
    }

    function handleRm(state, args) {
        args.forEach(arg => {
            const path = resolvePath(state, arg);
            const node = getNode(state, path);
            if (!node) return;
            if (node.type === 'dir') return;
            removeNode(state, path);
        });
        return { output: '' };
    }

    function handleHead(state, args) {
        if (args.length === 0) return { output: '' };
        let count = 10;
        let fileArg = args[0];
        if (args[0] === '-n' && args[1]) {
            count = Number.parseInt(args[1], 10);
            fileArg = args[2];
        }
        const path = resolvePath(state, fileArg);
        const node = getNode(state, path);
        if (!node || node.type !== 'file') {
            return { output: `head: cannot open '${fileArg}' for reading\n`, error: true };
        }
        const lines = (node.content || '').split('\n');
        const slice = lines.slice(0, count).join('\n');
        return { output: `${slice}\n` };
    }

    function handleTail(state, args) {
        if (args.length === 0) return { output: '' };
        let count = 10;
        let fileArg = args[0];
        if (args[0] === '-n' && args[1]) {
            count = Number.parseInt(args[1], 10);
            fileArg = args[2];
        }
        const path = resolvePath(state, fileArg);
        const node = getNode(state, path);
        if (!node || node.type !== 'file') {
            return { output: `tail: cannot open '${fileArg}' for reading\n`, error: true };
        }
        const lines = (node.content || '').split('\n');
        const slice = lines.slice(-count).join('\n');
        return { output: `${slice}\n` };
    }

    function handleGrep(state, args) {
        const flags = [];
        const targets = [];
        let pattern = null;
        args.forEach(arg => {
            if (arg.startsWith('-')) {
                flags.push(arg);
            } else if (pattern === null) {
                pattern = arg;
            } else {
                targets.push(arg);
            }
        });
        if (!pattern) return { output: '' };
        const ignoreCase = flags.some(flag => flag.includes('i'));
        const countOnly = flags.some(flag => flag.includes('c'));
        const withNumbers = flags.some(flag => flag.includes('n'));
        const recursive = flags.some(flag => flag.includes('R'));
        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), ignoreCase ? 'i' : '');
        const files = [];
        if (recursive) {
            const root = targets[0] ? resolvePath(state, targets[0]) : state.cwd;
            files.push(...collectFiles(state, root));
        } else if (targets.length > 0) {
            targets.forEach(target => {
                const path = resolvePath(state, target);
                const node = getNode(state, path);
                if (node && node.type === 'file') {
                    files.push(path);
                }
            });
        }
        if (files.length === 0) return { output: '' };
        const lines = [];
        files.forEach(filePath => {
            const node = getNode(state, filePath);
            if (!node || node.type !== 'file') return;
            const contentLines = (node.content || '').split('\n');
            let matches = 0;
            contentLines.forEach((line, index) => {
                if (regex.test(line)) {
                    matches += 1;
                    if (!countOnly) {
                        const prefix = (recursive || files.length > 1) ? `${filePath}:` : '';
                        const number = withNumbers ? `${index + 1}:` : '';
                        lines.push(`${prefix}${number}${line}`);
                    }
                }
            });
            if (countOnly) {
                if (recursive || files.length > 1) {
                    lines.push(`${filePath}:${matches}`);
                } else {
                    lines.push(`${matches}`);
                }
            }
        });
        return { output: lines.length ? `${lines.join('\n')}\n` : '' };
    }

    function handleFind(state, args) {
        if (args.length === 0) return { output: '' };
        const start = resolvePath(state, args[0]);
        let maxDepth = Infinity;
        let type = 'f';
        let pattern = '*';
        for (let i = 1; i < args.length; i += 1) {
            const token = args[i];
            if (token === '-maxdepth' && args[i + 1]) {
                maxDepth = Number.parseInt(args[i + 1], 10);
                i += 1;
            } else if (token === '-type' && args[i + 1]) {
                type = args[i + 1];
                i += 1;
            } else if (token === '-name' && args[i + 1]) {
                pattern = args[i + 1];
                i += 1;
            }
        }
        const node = getNode(state, start);
        if (!node) {
            return { output: `find: '${args[0]}': Нет такого файла или каталога\n`, error: true };
        }
        const results = [];
        if (node.type === 'file' && type === 'f' && matchPattern(node.name, pattern)) {
            results.push(start);
        }
        const queue = [{ path: start, depth: 0 }];
        while (queue.length > 0) {
            const current = queue.shift();
            const currentNode = getNode(state, current.path);
            if (!currentNode || currentNode.type !== 'dir' || current.depth >= maxDepth) continue;
            currentNode.children.forEach(name => {
                const childPath = current.path === '/' ? `/${name}` : `${current.path}/${name}`;
                const child = getNode(state, childPath);
                if (!child) return;
                if (child.type === 'file' && type === 'f' && matchPattern(child.name, pattern)) {
                    results.push(childPath);
                }
                if (child.type === 'dir') {
                    queue.push({ path: childPath, depth: current.depth + 1 });
                }
            });
        }
        results.sort((a, b) => a.localeCompare(b));
        return { output: results.length ? `${results.join('\n')}\n` : '' };
    }

    function handleWc(state, args) {
        if (args[0] !== '-l') return { output: '' };
        const fileArg = args[1];
        const path = resolvePath(state, fileArg);
        const node = getNode(state, path);
        if (!node || node.type !== 'file') {
            return { output: `wc: ${fileArg}: No such file or directory\n`, error: true };
        }
        const lines = (node.content || '').split('\n');
        const count = lines.filter(line => line.length > 0).length;
        return { output: `${count} ${fileArg}\n` };
    }

    function handleDu(state, args) {
        const target = args.length > 0 ? resolvePath(state, args[args.length - 1]) : state.cwd;
        if (target === '/srv/data') {
            return { output: '1.5G\t/srv/data\n' };
        }
        if (!getNode(state, target)) {
            return { output: `du: cannot access '${args[args.length - 1]}': No such file or directory\n`, error: true };
        }
        return { output: `8.0K\t${target}\n` };
    }

    function handleDf() {
        return {
            output: 'Файловая система Размер Использовано Дост Дост% Смонтировано в\n'
                + '/dev/sda1        40G     22G   17G  57% /\n'
                + 'tmpfs            2G      0    2G   0% /run\n'
                + '/dev/sdb1       100G     63G   32G  67% /srv/data\n'
        };
    }

    function handleSort(state, args) {
        const unique = args.includes('-u');
        const targets = args.filter(arg => !arg.startsWith('-'));
        const path = resolvePath(state, targets[0]);
        const node = getNode(state, path);
        if (!node || node.type !== 'file') {
            return { output: `sort: open failed: ${targets[0]}: No such file or directory\n`, error: true };
        }
        let lines = (node.content || '').split('\n').filter(line => line.length > 0);
        lines.sort((a, b) => a.localeCompare(b));
        if (unique) {
            lines = lines.filter((line, index) => index === 0 || line !== lines[index - 1]);
        }
        return { output: `${lines.join('\n')}\n` };
    }

    function handleCut(state, args) {
        let delimiter = '\t';
        let fields = [];
        const targets = [];
        for (let i = 0; i < args.length; i += 1) {
            const token = args[i];
            if (token === '-d' && args[i + 1]) {
                delimiter = args[i + 1];
                i += 1;
            } else if (token === '-f' && args[i + 1]) {
                fields = args[i + 1].split(',').map(value => Number.parseInt(value, 10));
                i += 1;
            } else if (token.startsWith('-f')) {
                fields = token.slice(2).split(',').map(value => Number.parseInt(value, 10));
            } else {
                targets.push(token);
            }
        }
        const path = resolvePath(state, targets[0]);
        const node = getNode(state, path);
        if (!node || node.type !== 'file') {
            return { output: `cut: ${targets[0]}: No such file or directory\n`, error: true };
        }
        const lines = (node.content || '').trimEnd().split('\n');
        const outputLines = lines.map(line => {
            const parts = line.split(delimiter);
            if (fields.length === 0) return line;
            return fields.map(index => parts[index - 1] || '').join(delimiter);
        });
        return { output: `${outputLines.join('\n')}\n` };
    }

    function handleTar(state, args) {
        if (args.length < 3) return { output: '' };
        const destination = resolvePath(state, args[1]);
        const source = resolvePath(state, args[2]);
        addFile(state, destination, `archive:${source}\n`, { owner: state.user, group: state.user, mode: '644' });
        return { output: '' };
    }
    function handlePs(state, args) {
        const header = 'USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\n';
        const nginxLine = 'www-data   2145  0.2  1.3  85632  4236 ?        Ss   10:20   0:00 nginx: master process\n';
        const otherLine = 'root          1  0.0  0.1  16916  1128 ?        Ss   09:00   0:03 /sbin/init\n';
        if (args.length && args[0] === 'aux') {
            return { output: `${header}${otherLine}${nginxLine}` };
        }
        return { output: `${header}${otherLine}${nginxLine}` };
    }

    function handleSystemctl(state, args) {
        const subcommand = args[0];
        const service = args[1];
        if (subcommand === 'status' && service === 'nginx') {
            return {
                output: '● nginx.service - A high performance web server and a reverse proxy server\n'
                    + '   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n'
                    + '   Active: active (running)\n   Docs: man:nginx(8)\n'
            };
        }
        if (subcommand === 'restart' && service === 'nginx') {
            state.services.nginxRunning = true;
            return { output: 'Процесс перезапуска инициирован.\n' };
        }
        if (subcommand === 'enable' && service === 'nginx') {
            state.services.nginxEnabled = true;
            return { output: 'Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /lib/systemd/system/nginx.service.\n' };
        }
        if (subcommand === 'reload' && service === 'nginx') {
            return { output: 'Служба перечитала конфигурацию.\n' };
        }
        return { output: '' };
    }

    function handleJournalctl(state, args) {
        return {
            output: '-- Logs begin at Fri 2023-09-15 08:00:00 UTC, end at Fri 2023-09-15 10:22:11 UTC. --\n'
                + 'Sep 15 10:21:50 server systemd[1]: Reloading A high performance web server.\n'
                + 'Sep 15 10:22:11 server systemd[1]: Reloaded A high performance web server.\n'
        };
    }

    function handleApt(state, args) {
        const sub = args[0];
        if (sub === 'update') {
            return {
                output: 'Получено:1 http://archive.ubuntu.com jammy InRelease\nЧтение списков пакетов... Готово\n'
            };
        }
        if (sub === 'install' && args[1]) {
            return {
                output: 'Чтение списков пакетов... Готово\nПостроение дерева зависимостей... Готово\n'
            };
        }
        return { output: '' };
    }

    function handleGit(state, args) {
        const sub = args[0];
        if (sub === 'status') {
            return {
                output: `On branch ${state.gitBranch}\nnothing to commit, working tree clean\n`
            };
        }
        if (sub === 'pull') {
            return {
                output: 'From github.com:linuxquest/app\n * branch            main       -> FETCH_HEAD\nУже обновлено.\n'
            };
        }
        if (sub === 'checkout' && args[1] === '-b' && args[2]) {
            state.gitBranch = args[2];
            return { output: `Switched to a new branch '${args[2]}'\n` };
        }
        if (sub === 'log') {
            return {
                output: 'fe12c3b Docs update pipeline\n3c4a56 Merge branch feature/login\n1ab23c Initial commit\n'
            };
        }
        if (sub === 'push' && args[1] === 'origin' && args[2]) {
            return {
                output: `Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nTo github.com:linuxquest/app\n * [new branch]      ${args[2]} -> ${args[2]}\n`
            };
        }
        return { output: '' };
    }

    function handleDocker(state, args) {
        if (args[0] === 'ps') {
            if (state.docker.up) {
                return {
                    output: 'CONTAINER ID   IMAGE          COMMAND                  STATUS          NAMES\n'
                        + '4c3b1c2d9f1e   app:latest    "./start.sh"             Up 2 hours      app_web_1\n'
                };
            }
            return {
                output: 'CONTAINER ID   IMAGE          COMMAND                  STATUS          NAMES\n'
            };
        }
        if (args[0] === 'compose' && args[1] === 'up') {
            state.docker.up = true;
            return {
                output: '[+] Running 3/3\n ✔ Network app_default      Created\n ✔ Container app_db_1       Started\n ✔ Container app_web_1      Started\n'
            };
        }
        if (args[0] === 'compose' && args[1] === 'down') {
            state.docker.up = false;
            return {
                output: '[+] Running 3/3\n ✔ Container app_web_1      Stopped\n ✔ Container app_db_1       Stopped\n ✔ Network app_default      Removed\n'
            };
        }
        if (args[0] === 'logs') {
            if (!state.docker.up) {
                return { output: 'Error: No such container: app_web_1\n', error: true };
            }
            return {
                output: 'app_web_1  | 2023-09-15T10:20:01Z Started worker\napp_web_1  | 2023-09-15T10:21:15Z GET /health 200\n'
            };
        }
        return { output: '' };
    }

    function handleAnsible(state, args) {
        if (!args[0]) return { output: '' };
        return {
            output: 'PLAY [Deploy application] ************************************************\n'
                + 'TASK [Gathering Facts] ***************************************************\nok: [staging]\n'
        };
    }

    function handleSsh(args) {
        return {
            output: 'Welcome to Ubuntu 22.04.2 LTS (GNU/Linux 5.15.0-71-generic x86_64)\n'
        };
    }

    function handleScp(args) {
        return {
            output: 'backup.tar.gz                                100%  256MB  12MB/s   00:21\n'
        };
    }

    function handleUfw(state, args) {
        const sub = args[0];
        if (sub === 'allow' && args[1]) {
            state.ufwRules.add(args[1]);
            return { output: 'Правило добавлено\nПравило добавлено (v6)\n' };
        }
        if (sub === 'enable') {
            state.ufwEnabled = true;
            return { output: 'Команда может нарушить существующие ssh-подключения. Продолжить выполнение операции (y|n)? y\nФайрвол активирован и будет запускаться при загрузке системы.\n' };
        }
        return { output: '' };
    }

    function handleFail2ban() {
        return {
            output: 'Status for the jail: sshd\n|- Filter\n|  |- Currently failed: 0\n|  `- Total failed: 5\n`- Actions\n   |- Currently banned: 1\n   `- Total banned: 3\n'
        };
    }

    function handleChmod(state, args) {
        const mode = args[0];
        const target = resolvePath(state, args[1]);
        const node = getNode(state, target);
        if (!node || node.type !== 'file') {
            return { output: `chmod: cannot access '${args[1]}': No such file or directory\n`, error: true };
        }
        node.mode = mode;
        node.modified = Date.now();
        return { output: '' };
    }

    function handleSshKeygen(state, args) {
        const fileIndex = args.indexOf('-f');
        const filePath = fileIndex !== -1 && args[fileIndex + 1] ? resolvePath(state, args[fileIndex + 1]) : `${HOME}/.ssh/id_ed25519`;
        addFile(state, filePath, '-----BEGIN OPENSSH PRIVATE KEY-----\n...\n-----END OPENSSH PRIVATE KEY-----\n', { owner: state.user, group: state.user, mode: '600' });
        addFile(state, `${filePath}.pub`, 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExample linuxquest@training\n', { owner: state.user, group: state.user, mode: '644' });
        return {
            output: `Generating public/private ed25519 key pair.\nYour identification has been saved in ${filePath}.\nYour public key has been saved in ${filePath}.pub.\n`
        };
    }

    function handleChown(state, args) {
        const spec = args[0];
        const target = resolvePath(state, args[1]);
        const node = getNode(state, target);
        if (!node) {
            return { output: `chown: cannot access '${args[1]}': No such file or directory\n`, error: true };
        }
        const [owner, group] = spec.split(':');
        node.owner = owner || node.owner;
        node.group = group || node.group;
        node.modified = Date.now();
        return { output: '' };
    }

    function handlePipeline(state, raw) {
        if (/^ps\s+aux\s*\|\s*grep\s+nginx$/.test(raw)) {
            return { output: 'www-data   2145  0.2  1.3  85632  4236 ?        Ss   10:20   0:00 nginx: master process\n' };
        }
        return null;
    }
    function executeCommand(state, raw) {
        const trimmed = (raw || '').trim();
        if (!trimmed) return { output: '' };
        const piped = handlePipeline(state, trimmed);
        if (piped) return piped;
        const tokens = tokenize(trimmed);
        if (tokens.length === 0) return { output: '' };
        let command = tokens[0];
        let args = tokens.slice(1);
        if (command === 'sudo') {
            if (args.length === 0) return { output: '' };
            command = args[0];
            args = args.slice(1);
        }
        if (command === 'docker-compose') {
            command = 'docker';
            args = ['compose', ...args];
        }
        switch (command) {
            case 'whoami':
                return { output: `${state.user}\n` };
            case 'pwd':
                return { output: `${state.cwd}\n` };
            case 'ls':
                return handleLs(state, args);
            case 'cd':
                return handleCd(state, args);
            case 'mkdir':
                return handleMkdir(state, args);
            case 'touch':
                return handleTouch(state, args);
            case 'echo':
                return handleEcho(state, tokens);
            case 'cat':
                return handleCat(state, args);
            case 'man':
                return handleMan(args);
            case 'cp':
                return handleCp(state, args);
            case 'mv':
                return handleMv(state, args);
            case 'rm':
                return handleRm(state, args);
            case 'head':
                return handleHead(state, args);
            case 'tail':
                return handleTail(state, args);
            case 'grep':
                return handleGrep(state, args);
            case 'find':
                return handleFind(state, args);
            case 'wc':
                return handleWc(state, args);
            case 'du':
                return handleDu(state, args);
            case 'df':
                return handleDf();
            case 'sort':
                return handleSort(state, args);
            case 'cut':
                return handleCut(state, args);
            case 'tar':
                return handleTar(state, args);
            case 'ps':
                return handlePs(state, args);
            case 'systemctl':
                return handleSystemctl(state, args);
            case 'journalctl':
                return handleJournalctl(state, args);
            case 'apt':
                return handleApt(state, args);
            case 'git':
                return handleGit(state, args);
            case 'docker':
                return handleDocker(state, args);
            case 'ansible-playbook':
                return handleAnsible(state, args);
            case 'ssh':
                return handleSsh(args);
            case 'scp':
                return handleScp(args);
            case 'ufw':
                return handleUfw(state, args);
            case 'fail2ban-client':
                return handleFail2ban();
            case 'chmod':
                return handleChmod(state, args);
            case 'ssh-keygen':
                return handleSshKeygen(state, args);
            case 'chown':
                return handleChown(state, args);
            default:
                return { output: `bash: ${command}: command not found\n`, error: true };
        }
    }

    function createSandbox() {
        const states = new Map();
        let activeId = null;

        function ensureState(id) {
            const key = id || 'default';
            if (!states.has(key)) {
                const missionId = missionOrder.includes(key) ? key : key === 'default' ? null : key;
                states.set(key, buildScenarioState(missionId));
            }
            return states.get(key);
        }

        return {
            useScenario(id) {
                activeId = id || 'default';
                ensureState(activeId);
            },
            execute(raw) {
                const state = ensureState(activeId || 'default');
                return executeCommand(state, raw);
            },
            getPrompt() {
                const state = ensureState(activeId || 'default');
                return `${state.user}@${state.host}:${state.cwd}$`;
            },
            resetAll() {
                states.clear();
                activeId = null;
            }
        };
    }

    window.createSandbox = createSandbox;
})();
