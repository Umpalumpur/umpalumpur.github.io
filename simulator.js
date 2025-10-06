(function () {
    const DEFAULT_OWNER = 'cadet';
    const DEFAULT_GROUP = 'cadet';

    function file(content = '', meta = {}) {
        return {
            __kind: 'file',
            content,
            mode: meta.mode ?? '0644',
            owner: meta.owner ?? DEFAULT_OWNER,
            group: meta.group ?? DEFAULT_GROUP,
            executable: Boolean(meta.executable),
        };
    }

    function dir(children = {}, meta = {}) {
        return {
            __kind: 'dir',
            children,
            mode: meta.mode ?? '0755',
            owner: meta.owner ?? DEFAULT_OWNER,
            group: meta.group ?? DEFAULT_GROUP,
        };
    }

    function symlink(target, meta = {}) {
        return {
            __kind: 'link',
            target,
            mode: meta.mode ?? '0777',
            owner: meta.owner ?? DEFAULT_OWNER,
            group: meta.group ?? DEFAULT_GROUP,
        };
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function formatMode(node) {
        const typeChar = node.type === 'dir' ? 'd' : node.type === 'link' ? 'l' : node.executable ? '-' : '-';
        const mode = node.mode || '0644';
        const digits = typeof mode === 'number' ? mode.toString(8).padStart(4, '0') : String(mode).padStart(4, '0');
        const perms = digits.slice(-3).split('').map(d => parseInt(d, 10)).map(num => {
            return `${num & 4 ? 'r' : '-'}${num & 2 ? 'w' : '-'}${num & 1 ? 'x' : '-'}`;
        }).join('');
        return `${typeChar}${perms}`;
    }

    function tokenize(command) {
        const tokens = [];
        let current = '';
        let quote = null;
        for (let i = 0; i < command.length; i += 1) {
            const char = command[i];
            if (quote) {
                if (char === quote) {
                    quote = null;
                } else if (char === '\\' && quote === '"' && i + 1 < command.length) {
                    i += 1;
                    current += command[i];
                } else {
                    current += char;
                }
            } else if (char === '"' || char === "'") {
                quote = char;
            } else if (/\s/.test(char)) {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
            } else if (char === '>' || char === '<' || char === '|') {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
                if ((char === '>' || char === '<') && command[i + 1] === char) {
                    tokens.push(char + char);
                    i += 1;
                } else {
                    tokens.push(char);
                }
            } else {
                current += char;
            }
        }
        if (current) tokens.push(current);
        return tokens;
    }

    function toSegments(path) {
        const parts = path.split('/').filter(Boolean);
        const segments = [];
        parts.forEach(part => {
            if (part === '.') return;
            if (part === '..') {
                if (segments.length) segments.pop();
                return;
            }
            segments.push(part);
        });
        return segments;
    }

    function joinSegments(segments) {
        if (!segments || segments.length === 0) {
            return '/';
        }
        return `/${segments.join('/')}`.replace(/\/+/g, '/');
    }

    class VirtualShell {
        constructor() {
            this.cwd = '/';
            this.home = '/home/cadet';
            this.root = this.createDirNode();
            this.customCommands = [];
            this.history = [];
            this.env = {};
        }

        createDirNode(meta = {}) {
            return {
                type: 'dir',
                mode: meta.mode ?? '0755',
                owner: meta.owner ?? DEFAULT_OWNER,
                group: meta.group ?? DEFAULT_GROUP,
                children: new Map(),
            };
        }

        createFileNode(content = '', meta = {}) {
            return {
                type: 'file',
                mode: meta.mode ?? '0644',
                owner: meta.owner ?? DEFAULT_OWNER,
                group: meta.group ?? DEFAULT_GROUP,
                executable: Boolean(meta.executable),
                content,
                metadata: meta.metadata ? clone(meta.metadata) : {},
            };
        }

        createLinkNode(target, meta = {}) {
            return {
                type: 'link',
                mode: meta.mode ?? '0777',
                owner: meta.owner ?? DEFAULT_OWNER,
                group: meta.group ?? DEFAULT_GROUP,
                target,
            };
        }

        normalizeDescriptor(descriptor) {
            if (!descriptor) {
                return this.createDirNode();
            }
            if (descriptor.__kind === 'file') {
                return this.createFileNode(descriptor.content, descriptor);
            }
            if (descriptor.__kind === 'link') {
                return this.createLinkNode(descriptor.target, descriptor);
            }
            if (descriptor.__kind === 'dir') {
                const node = this.createDirNode(descriptor);
                const entries = descriptor.children || {};
                Object.entries(entries).forEach(([name, value]) => {
                    node.children.set(name, this.normalizeDescriptor(value));
                });
                return node;
            }
            if (typeof descriptor === 'string') {
                return this.createFileNode(descriptor, {});
            }
            if (typeof descriptor === 'object' && !Array.isArray(descriptor)) {
                const node = this.createDirNode(descriptor);
                Object.entries(descriptor).forEach(([name, value]) => {
                    if (name.startsWith('__')) return;
                    node.children.set(name, this.normalizeDescriptor(value));
                });
                return node;
            }
            return this.createFileNode(String(descriptor), {});
        }

        loadScenario(scenario) {
            if (!scenario) return;
            this.root = this.createDirNode();
            const tree = scenario.tree || {};
            Object.entries(tree).forEach(([name, value]) => {
                this.root.children.set(name, this.normalizeDescriptor(value));
            });
            this.cwd = scenario.cwd || '/';
            this.home = scenario.home || '/home/cadet';
            this.env = scenario.env ? clone(scenario.env) : {};
            this.customCommands = (scenario.commands || []).map(entry => {
                if (typeof entry === 'string') {
                    return { matcher: new RegExp(`^${entry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), output: '' };
                }
                if (entry instanceof RegExp) {
                    return { matcher: entry, output: '' };
                }
                const matcher = entry.matcher instanceof RegExp
                    ? entry.matcher
                    : new RegExp(entry.matcher.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                return { matcher, output: entry.output ?? '', handler: entry.handler || null };
            });
            this.history = scenario.history ? clone(scenario.history) : [];
        }

        pathSegments(path) {
            if (!path || path === '.') {
                return toSegments(this.cwd);
            }
            const absolute = path.startsWith('/');
            const base = absolute ? [] : toSegments(this.cwd);
            const segments = toSegments(path);
            return absolute ? segments : base.concat(segments);
        }

        getNode(path) {
            const segments = Array.isArray(path) ? path : this.pathSegments(path);
            let current = this.root;
            if (segments.length === 0) return current;
            for (const segment of segments) {
                if (!current || current.type !== 'dir') return null;
                current = current.children.get(segment);
            }
            return current || null;
        }

        ensureParent(path) {
            const segments = Array.isArray(path) ? path.slice() : this.pathSegments(path);
            const name = segments.pop();
            const parent = this.getNode(segments);
            return { parent, name, segments };
        }

        listDirectory(pathSegments, includeHidden) {
            const node = this.getNode(pathSegments);
            if (!node) {
                return { error: `ls: не удалось получить доступ к '${joinSegments(pathSegments)}': Нет такого файла или каталога` };
            }
            if (node.type !== 'dir') {
                return { entries: [[pathSegments[pathSegments.length - 1] || '/', node]] };
            }
            const entries = [];
            if (includeHidden) {
                entries.push(['.', node]);
                const parentSegments = pathSegments.slice(0, -1);
                entries.push(['..', this.getNode(parentSegments) || this.root]);
            }
            node.children.forEach((value, key) => {
                if (!includeHidden && key.startsWith('.')) return;
                entries.push([key, value]);
            });
            return { entries };
        }

        run(command) {
            const trimmed = command.trim();
            if (!trimmed) {
                return { stdout: '', stderr: '', exitCode: 0 };
            }
            this.history.push(trimmed);
            const pipelineParts = trimmed.split('|').map(part => part.trim()).filter(Boolean);
            let input = '';
            let stderrCombined = '';
            let exitCode = 0;
            let clear = false;

            for (const part of pipelineParts) {
                const result = this.executeSingle(part, input);
                input = result.stdout;
                if (result.stderr) stderrCombined += result.stderr;
                exitCode = result.exitCode;
                if (result.clear) clear = true;
            }

            return { stdout: input, stderr: stderrCombined, exitCode, clear };
        }

        executeSingle(command, stdin = '') {
            const tokens = tokenize(command);
            if (tokens.length === 0) {
                return { stdout: stdin, stderr: '', exitCode: 0 };
            }
            const redirects = { overwrite: null, append: null };
            const filtered = [];
            for (let i = 0; i < tokens.length; i += 1) {
                const token = tokens[i];
                if (token === '>' || token === '>>') {
                    const target = tokens[i + 1];
                    if (!target) {
                        return { stdout: '', stderr: 'bash: синтаксическая ошибка перенаправления\n', exitCode: 2 };
                    }
                    redirects[token === '>' ? 'overwrite' : 'append'] = target;
                    i += 1;
                } else if (token === '<') {
                    // тренажёр не реализует ввод из файла
                    i += 1;
                } else if (token === '||' || token === '&&') {
                    // игнорируем условные операторы
                } else {
                    filtered.push(token);
                }
            }
            const cmd = filtered[0];
            const args = filtered.slice(1);
            const original = filtered.join(' ');

            const custom = this.customCommands.find(entry => entry.matcher.test(original));
            if (custom) {
                const output = typeof custom.handler === 'function' ? custom.handler({ shell: this, args, stdin }) : custom.output;
                return this.applyRedirects(output || '', '', redirects);
            }

            const handlerName = `cmd_${cmd.replace(/-/g, '_')}`;
            const method = this[handlerName];
            if (typeof method === 'function') {
                const result = method.call(this, args, stdin);
                return this.applyRedirects(result.stdout ?? '', result.stderr ?? '', redirects, result.exitCode ?? 0, result.clear);
            }

            if (cmd === 'history') {
                const lines = this.history.map((item, index) => `${index + 1}  ${item}`).join('\n');
                return this.applyRedirects(lines ? `${lines}\n` : '', '', redirects);
            }

            return this.applyRedirects('', `bash: ${cmd}: команда не найдена\n`, redirects, 127);
        }

        applyRedirects(stdout, stderr, redirects, exitCode = 0, clear = false) {
            if (redirects.overwrite || redirects.append) {
                const target = redirects.overwrite || redirects.append;
                const { parent, name } = this.ensureParent(target);
                if (!parent || parent.type !== 'dir') {
                    stderr += `bash: ${target}: Невозможно записать выходной поток\n`;
                    return { stdout: '', stderr, exitCode: exitCode || 1, clear };
                }
                const node = parent.children.get(name) || this.createFileNode('', {});
                if (node.type !== 'file') {
                    stderr += `bash: ${target}: не файл\n`;
                    return { stdout: '', stderr, exitCode: exitCode || 1, clear };
                }
                node.content = redirects.append ? (node.content + stdout) : stdout;
                parent.children.set(name, node);
                return { stdout: '', stderr, exitCode, clear };
            }
            return { stdout, stderr, exitCode, clear };
        }

        cmd_clear() {
            return { stdout: '', stderr: '', exitCode: 0, clear: true };
        }

        cmd_pwd() {
            return { stdout: `${this.cwd}\n` };
        }

        cmd_cd(args) {
            const target = args[0] || this.home;
            const segments = this.pathSegments(target);
            const node = this.getNode(segments);
            if (!node) {
                return { stdout: '', stderr: `bash: cd: ${target}: Нет такого файла или каталога\n`, exitCode: 1 };
            }
            if (node.type !== 'dir') {
                return { stdout: '', stderr: `bash: cd: ${target}: Не каталог\n`, exitCode: 1 };
            }
            this.cwd = joinSegments(segments);
            return { stdout: '' };
        }

        cmd_ls(args) {
            let showAll = false;
            let longFormat = false;
            const targets = [];
            args.forEach(arg => {
                if (arg.startsWith('-')) {
                    showAll = showAll || arg.includes('a');
                    longFormat = longFormat || arg.includes('l');
                } else {
                    targets.push(arg);
                }
            });
            const listings = [];
            const selected = targets.length ? targets : ['.'];
            selected.forEach(target => {
                const segments = this.pathSegments(target);
                const { entries, error } = this.listDirectory(segments, showAll);
                if (error) {
                    listings.push(error);
                    return;
                }
                if (!entries) return;
                if (targets.length > 1) {
                    listings.push(`${joinSegments(segments)}:`);
                }
                if (longFormat) {
                    const lines = entries.map(([name, node]) => {
                        const mode = formatMode(node);
                        const owner = node.owner || DEFAULT_OWNER;
                        const group = node.group || DEFAULT_GROUP;
                        const size = node.type === 'file' ? node.content.length : 0;
                        return `${mode} 1 ${owner} ${group} ${size.toString().padStart(4, ' ')} ${name}`;
                    });
                    listings.push(lines.join('\n'));
                } else {
                    listings.push(entries.map(([name]) => name).join('  '));
                }
            });
            return { stdout: `${listings.filter(Boolean).join('\n')}`.replace(/\n{2,}/g, '\n') + '\n' };
        }

        cmd_mkdir(args) {
            if (args.length === 0) {
                return { stdout: '', stderr: 'mkdir: отсутствует операнд\n', exitCode: 1 };
            }
            const recursive = args.some(arg => arg === '-p');
            const targets = recursive ? args.filter(arg => arg !== '-p') : args;
            const errors = [];
            targets.forEach(target => {
                const segments = this.pathSegments(target);
                const name = segments.pop();
                let parent = this.getNode(segments);
                if (!parent) {
                    if (recursive) {
                        this.createPath(segments);
                        parent = this.getNode(segments);
                    } else {
                        errors.push(`mkdir: не удаётся создать каталог «${target}»: Нет такого файла или каталога`);
                        return;
                    }
                }
                if (parent.type !== 'dir') {
                    errors.push(`mkdir: не удаётся создать каталог «${target}»: Не каталог`);
                    return;
                }
                if (parent.children.has(name)) {
                    if (!recursive) {
                        errors.push(`mkdir: не удаётся создать каталог «${target}»: Файл существует`);
                    }
                    return;
                }
                parent.children.set(name, this.createDirNode());
            });
            return { stdout: '', stderr: errors.length ? `${errors.join('\n')}\n` : '', exitCode: errors.length ? 1 : 0 };
        }

        createPath(segments) {
            let current = this.root;
            segments.forEach(segment => {
                let next = current.children.get(segment);
                if (!next) {
                    next = this.createDirNode();
                    current.children.set(segment, next);
                }
                current = next;
            });
        }

        cmd_touch(args) {
            if (args.length === 0) {
                return { stdout: '', stderr: 'touch: отсутствует операнд\n', exitCode: 1 };
            }
            args.forEach(target => {
                const { parent, name } = this.ensureParent(target);
                if (!parent || parent.type !== 'dir') return;
                const existing = parent.children.get(name);
                if (existing && existing.type !== 'file') return;
                parent.children.set(name, existing || this.createFileNode(''));
            });
            return { stdout: '' };
        }

        cmd_cat(args, stdin = '') {
            if (args.length === 0 && !stdin) {
                return { stdout: '', stderr: 'cat: отсутствует файл для чтения\n', exitCode: 1 };
            }
            const outputs = [];
            if (args.length === 0 && stdin) {
                outputs.push(stdin.endsWith('\n') ? stdin : `${stdin}\n`);
            }
            for (const target of args) {
                const node = this.getNode(target);
                if (!node) {
                    outputs.push(`cat: ${target}: Нет такого файла или каталога`);
                    continue;
                }
                if (node.type === 'dir') {
                    outputs.push(`cat: ${target}: Это каталог`);
                    continue;
                }
                outputs.push(node.content);
            }
            return { stdout: outputs.map(line => line.endsWith('\n') ? line : `${line}\n`).join('') };
        }

        cmd_echo(args) {
            let text = args.join(' ');
            text = text.replace(/^['"]|['"]$/g, '');
            return { stdout: `${text}\n` };
        }

        cmd_rm(args) {
            if (args.length === 0) {
                return { stdout: '', stderr: 'rm: отсутствует операнд\n', exitCode: 1 };
            }
            const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-fr');
            const force = args.includes('-f') || args.includes('-rf') || args.includes('-fr');
            const targets = args.filter(arg => !arg.startsWith('-'));
            const errors = [];
            targets.forEach(target => {
                const { parent, name } = this.ensureParent(target);
                if (!parent || !parent.children.has(name)) {
                    if (!force) errors.push(`rm: невозможно удалить '${target}': Нет такого файла или каталога`);
                    return;
                }
                const node = parent.children.get(name);
                if (node.type === 'dir' && !recursive) {
                    errors.push(`rm: невозможно удалить '${target}': Это каталог`);
                    return;
                }
                parent.children.delete(name);
            });
            return { stdout: '', stderr: errors.length ? `${errors.join('\n')}\n` : '', exitCode: errors.length ? 1 : 0 };
        }

        cmd_cp(args) {
            const recursive = args.includes('-r') || args.includes('-R');
            const filtered = args.filter(arg => !arg.startsWith('-'));
            if (filtered.length < 2) {
                return { stdout: '', stderr: 'cp: недостаточно аргументов\n', exitCode: 1 };
            }
            const destPath = filtered.pop();
            const destNode = this.getNode(destPath);
            const destIsDir = destNode && destNode.type === 'dir';
            const copyNode = (sourceNode) => {
                if (sourceNode.type === 'file') {
                    return this.createFileNode(sourceNode.content, sourceNode);
                }
                if (sourceNode.type === 'dir') {
                    const dirNode = this.createDirNode(sourceNode);
                    sourceNode.children.forEach((child, key) => {
                        dirNode.children.set(key, copyNode(child));
                    });
                    return dirNode;
                }
                if (sourceNode.type === 'link') {
                    return this.createLinkNode(sourceNode.target, sourceNode);
                }
                return null;
            };
            const errors = [];
            filtered.forEach(source => {
                const node = this.getNode(source);
                if (!node) {
                    errors.push(`cp: не удалось выполнить '${source}': Нет такого файла или каталога`);
                    return;
                }
                if (node.type === 'dir' && !recursive) {
                    errors.push(`cp: пропуск каталога '${source}'`);
                    return;
                }
                const baseName = source.split('/').filter(Boolean).pop();
                if (destIsDir) {
                    destNode.children.set(baseName, copyNode(node));
                } else {
                    const { parent, name } = this.ensureParent(destPath);
                    if (!parent || parent.type !== 'dir') {
                        errors.push(`cp: не удалось создать '${destPath}'`);
                        return;
                    }
                    parent.children.set(name, copyNode(node));
                }
            });
            return { stdout: '', stderr: errors.length ? `${errors.join('\n')}\n` : '', exitCode: errors.length ? 1 : 0 };
        }

        cmd_mv(args) {
            if (args.length < 2) {
                return { stdout: '', stderr: 'mv: недостаточно аргументов\n', exitCode: 1 };
            }
            const dest = args[args.length - 1];
            const sources = args.slice(0, -1);
            const destNode = this.getNode(dest);
            const destIsDir = destNode && destNode.type === 'dir';
            const errors = [];
            sources.forEach(source => {
                const { parent, name } = this.ensureParent(source);
                if (!parent || !parent.children.has(name)) {
                    errors.push(`mv: невозможно выполнить '${source}': Нет такого файла или каталога`);
                    return;
                }
                const node = parent.children.get(name);
                parent.children.delete(name);
                if (destIsDir) {
                    destNode.children.set(name, node);
                } else {
                    const { parent: destParent, name: destName } = this.ensureParent(dest);
                    if (!destParent || destParent.type !== 'dir') {
                        errors.push(`mv: невозможно переместить в '${dest}'`);
                        return;
                    }
                    destParent.children.set(destName, node);
                }
            });
            return { stdout: '', stderr: errors.length ? `${errors.join('\n')}\n` : '', exitCode: errors.length ? 1 : 0 };
        }

        cmd_head(args, stdin = '') {
            let count = 10;
            const files = [];
            args.forEach((arg, index) => {
                if ((arg === '-n' || arg === '--lines') && args[index + 1]) {
                    count = parseInt(args[index + 1], 10) || 10;
                } else if (!arg.startsWith('-') || arg === '-') {
                    files.push(arg);
                }
            });
            if (files.length === 0 && stdin) {
                return { stdout: stdin.split('\n').slice(0, count).join('\n') + '\n' };
            }
            const outputs = files.map(file => {
                const node = this.getNode(file);
                if (!node || node.type !== 'file') {
                    return `head: ${file}: Нет такого файла или каталога`;
                }
                return node.content.split('\n').slice(0, count).join('\n');
            });
            return { stdout: outputs.map(line => line.endsWith('\n') ? line : `${line}\n`).join('') };
        }

        cmd_tail(args, stdin = '') {
            let count = 10;
            const files = [];
            args.forEach((arg, index) => {
                if ((arg === '-n' || arg === '--lines') && args[index + 1]) {
                    count = parseInt(args[index + 1], 10) || 10;
                } else if (!arg.startsWith('-') || arg === '-') {
                    files.push(arg);
                }
            });
            if (files.length === 0 && stdin) {
                const lines = stdin.trim().split('\n');
                return { stdout: `${lines.slice(-count).join('\n')}\n` };
            }
            const outputs = files.map(file => {
                const node = this.getNode(file);
                if (!node || node.type !== 'file') {
                    return `tail: ${file}: Нет такого файла или каталога`;
                }
                const lines = node.content.trim().split('\n');
                return lines.slice(-count).join('\n');
            });
            return { stdout: outputs.map(line => line.endsWith('\n') ? line : `${line}\n`).join('') };
        }

        cmd_wc(args, stdin = '') {
            const showLines = args.includes('-l') || args.includes('--lines');
            const targets = args.filter(arg => !arg.startsWith('-'));
            if (targets.length === 0 && stdin) {
                const lines = stdin.trim().split('\n').filter(Boolean).length;
                return { stdout: `${lines}\n` };
            }
            const outputs = targets.map(target => {
                const node = this.getNode(target);
                if (!node || node.type !== 'file') {
                    return `wc: ${target}: Нет такого файла или каталога`;
                }
                const lines = node.content.split('\n').filter(Boolean).length;
                const words = node.content.split(/\s+/).filter(Boolean).length;
                const bytes = node.content.length;
                if (showLines) {
                    return `${lines} ${target}`;
                }
                return `${lines} ${words} ${bytes} ${target}`;
            });
            return { stdout: outputs.map(line => `${line}\n`).join('') };
        }

        cmd_sort(args, stdin = '') {
            const unique = args.includes('-u');
            const files = args.filter(arg => !arg.startsWith('-'));
            const source = files.length ? this.getNode(files[0]) : null;
            const text = source && source.type === 'file' ? source.content : stdin;
            if (!text) return { stdout: '' };
            const lines = text.split('\n').filter(Boolean).sort();
            const final = unique ? Array.from(new Set(lines)) : lines;
            return { stdout: final.join('\n') + '\n' };
        }

        cmd_grep(args, stdin = '') {
            const flags = args.filter(arg => arg.startsWith('-'));
            const inputs = args.filter(arg => !arg.startsWith('-'));
            if (inputs.length === 0 && !stdin) {
                return { stdout: '', stderr: 'grep: отсутствует шаблон\n', exitCode: 2 };
            }
            const pattern = inputs[0];
            const sources = inputs.slice(1);
            const regexFlags = flags.includes('-i') ? 'i' : '';
            const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), regexFlags);
            const withNumbers = flags.includes('-n');
            const outputs = [];
            const search = (text, label) => {
                return text.split('\n').map((line, index) => {
                    if (regex.test(line)) {
                        const base = withNumbers ? `${index + 1}:${line}` : line;
                        return label ? `${label}:${base}` : base;
                    }
                    return null;
                }).filter(Boolean);
            };
            if (sources.length === 0) {
                outputs.push(...search(stdin, sources.length > 1 ? '' : null));
            } else {
                sources.forEach(source => {
                    const node = this.getNode(source);
                    if (!node || node.type !== 'file') {
                        outputs.push(`grep: ${source}: Нет такого файла или каталога`);
                        return;
                    }
                    const matches = search(node.content, sources.length > 1 ? source : null);
                    outputs.push(...matches);
                });
            }
            return { stdout: outputs.map(line => `${line}\n`).join('') };
        }

        cmd_find(args) {
            if (args.length === 0) {
                return { stdout: '', stderr: 'find: отсутствует путь\n', exitCode: 1 };
            }
            const path = args[0];
            let namePattern = null;
            args.forEach((arg, index) => {
                if (arg === '-name' && args[index + 1]) {
                    namePattern = new RegExp(args[index + 1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '.*'));
                }
            });
            const segments = this.pathSegments(path);
            const start = this.getNode(segments);
            if (!start) {
                return { stdout: '', stderr: `find: «${path}»: Нет такого файла или каталога\n`, exitCode: 1 };
            }
            const results = [];
            const walk = (node, currentSegments) => {
                const fullPath = joinSegments(currentSegments);
                if (!namePattern || namePattern.test(currentSegments[currentSegments.length - 1] || '/')) {
                    results.push(fullPath);
                }
                if (node.type === 'dir') {
                    node.children.forEach((child, name) => {
                        walk(child, currentSegments.concat(name));
                    });
                }
            };
            walk(start, segments);
            return { stdout: results.map(line => `${line}\n`).join('') };
        }

        cmd_chmod(args) {
            if (args.length < 2) {
                return { stdout: '', stderr: 'chmod: отсутствует MODE или файл\n', exitCode: 1 };
            }
            const mode = args[0];
            const targets = args.slice(1);
            targets.forEach(target => {
                const node = this.getNode(target);
                if (node) {
                    node.mode = mode;
                }
            });
            return { stdout: '' };
        }

        cmd_chown(args) {
            if (args.length < 2) {
                return { stdout: '', stderr: 'chown: недостаточно аргументов\n', exitCode: 1 };
            }
            const ownership = args[0].split(':');
            const owner = ownership[0];
            const group = ownership[1] || ownership[0];
            args.slice(1).forEach(target => {
                const node = this.getNode(target);
                if (node) {
                    node.owner = owner;
                    node.group = group;
                }
            });
            return { stdout: '' };
        }

        cmd_tar(args) {
            if (args.length < 2) {
                return { stdout: '', stderr: 'tar: недостаточно аргументов\n', exitCode: 1 };
            }
            const flags = args[0];
            if (flags.includes('t')) {
                const archive = this.getNode(args[1]);
                if (!archive || archive.type !== 'file') {
                    return { stdout: '', stderr: `tar: ${args[1]}: невозможно открыть\n`, exitCode: 1 };
                }
                const list = archive.metadata?.entries || [];
                return { stdout: list.map(item => `${item}\n`).join('') };
            }
            if (flags.includes('c')) {
                const archiveName = args[1];
                const sources = args.slice(2);
                const entries = [];
                sources.forEach(source => {
                    const segments = this.pathSegments(source);
                    const node = this.getNode(segments);
                    if (node) {
                        entries.push(joinSegments(segments).slice(1));
                    }
                });
                const { parent, name } = this.ensureParent(archiveName);
                if (!parent || parent.type !== 'dir') {
                    return { stdout: '', stderr: `tar: не удаётся создать архив ${archiveName}\n`, exitCode: 1 };
                }
                const archive = this.createFileNode(`Архив содержит: ${entries.join(', ')}`, { metadata: { entries } });
                parent.children.set(name, archive);
                return { stdout: '' };
            }
            return { stdout: '', stderr: 'tar: неподдерживаемая операция\n', exitCode: 1 };
        }

        cmd_less(args) {
            if (args.length === 0) {
                return { stdout: '', stderr: 'less: отсутствует файл\n', exitCode: 1 };
            }
            const node = this.getNode(args[0]);
            if (!node || node.type !== 'file') {
                return { stdout: '', stderr: `less: ${args[0]}: невозможно открыть\n`, exitCode: 1 };
            }
            return { stdout: `${node.content}\n--Конец файла--\n` };
        }

        cmd_nano(args) {
            if (args.length === 0) {
                return { stdout: '', stderr: 'nano: отсутствует имя файла\n', exitCode: 1 };
            }
            return { stdout: `GNU nano симулятор открыл ${args[0]}. Изменения не сохраняются в учебном режиме.\n` };
        }

        cmd_ps() {
            const processes = this.env.processes || [
                'root         1  0.0  0.1 167668  1108 ?        Ss   09:00   0:01 /sbin/init',
                'www-data  2134  0.2  1.3  85632  4236 ?        Ss   10:20   0:00 nginx: master process'
            ];
            return { stdout: processes.map(line => `${line}\n`).join('') };
        }

        cmd_top(args, stdin = '') {
            const batch = args.includes('-b');
            if (batch) {
                const lines = this.env.top || [
                    'top - 10:42:31 up 10 days,  4:15,  2 users,  load average: 0.14, 0.22, 0.21',
                    'Tasks: 164 total,   1 running, 163 sleeping,   0 stopped,   0 zombie',
                    '%Cpu(s):  3.0 us,  1.0 sy,  0.0 ni, 95.5 id,  0.2 wa,  0.0 hi,  0.3 si,  0.0 st',
                    'MiB Mem :   7979.6 total,   2136.4 free,   1890.8 used,   3952.4 buff/cache'
                ];
                const countIndex = args.indexOf('-n');
                const limit = countIndex !== -1 ? parseInt(args[countIndex + 1], 10) : 5;
                return { stdout: lines.slice(0, limit).map(line => `${line}\n`).join('') };
            }
            return { stdout: stdin };
        }

        cmd_kill(args) {
            if (args.length === 0) {
                return { stdout: '', stderr: 'kill: отсутствует PID\n', exitCode: 1 };
            }
            return { stdout: '' };
        }

        cmd_df(args) {
            if (args.includes('-h')) {
                const lines = this.env.df || [
                    'Файловая система Размер Использовано Доступно Использовано% Смонтировано в',
                    '/dev/sda1         40G         22G       17G           57% /',
                    'tmpfs            3.9G        2.0M      3.9G            1% /run'
                ];
                return { stdout: lines.map(line => `${line}\n`).join('') };
            }
            return { stdout: '' };
        }

        cmd_du(args) {
            if (args.includes('-h')) {
                const target = args.find(arg => !arg.startsWith('-')) || '.';
                const segments = this.pathSegments(target);
                return { stdout: `1.5G\t${joinSegments(segments)}\n` };
            }
            return { stdout: '' };
        }

        cmd_free(args) {
            if (args.includes('-h')) {
                return { stdout: '              total        used        free      shared  buff/cache   available\nMem:           15Gi       4.0Gi       7.0Gi       1.0Gi       4.0Gi        11Gi\n' };
            }
            return { stdout: '' };
        }

        cmd_ssh(args) {
            if (args.length === 0) {
                return { stdout: '', stderr: 'ssh: отсутствует хост\n', exitCode: 1 };
            }
            return { stdout: `Подключение к ${args[0]}... (эмуляция)\n` };
        }

        cmd_scp(args) {
            if (args.length < 2) {
                return { stdout: '', stderr: 'scp: требуется источник и пункт назначения\n', exitCode: 1 };
            }
            return { stdout: `Передача ${args[0]} -> ${args[1]} завершена (эмуляция).\n` };
        }

        cmd_git(args) {
            const sub = args[0];
            if (sub === 'status') {
                return { stdout: 'On branch main\nnothing to commit, working tree clean\n' };
            }
            if (sub === 'log' && args.includes('-1')) {
                return { stdout: 'a1b2c3d feat: добавить мониторинг\n' };
            }
            if (sub === 'checkout' && args[1] === '-b' && args[2]) {
                return { stdout: `Switched to a new branch '${args[2]}'\n` };
            }
            if (sub === 'pull') {
                return { stdout: 'Already up to date.\n' };
            }
            if (sub === 'branch') {
                return { stdout: '* main\n  release/v1.1\n' };
            }
            return { stdout: '', stderr: `git: команда ${sub || ''} недоступна в тренажёре\n`, exitCode: 1 };
        }

        cmd_docker(args) {
            const sub = args[0];
            if (sub === 'ps') {
                return { stdout: 'CONTAINER ID   IMAGE        COMMAND                  STATUS          NAMES\n4c3b1c2d9f1e   app:latest  "./start.sh"             Up 2 hours      app_web_1\n' };
            }
            if (sub === 'compose' && args[1] === 'up') {
                return { stdout: '[+] Running 3/3\n ✔ Network app_default      Created\n ✔ Container app_db_1       Started\n ✔ Container app_web_1      Started\n' };
            }
            if (sub === 'logs') {
                return { stdout: 'app_web_1  | Application booted\n' };
            }
            return { stdout: '', stderr: `docker: команда ${args.slice(0, 2).join(' ')} недоступна\n`, exitCode: 1 };
        }

        cmd_kubectl(args) {
            const sub = args[0];
            if (sub === 'get' && args[1] === 'pods') {
                return { stdout: 'NAME                         READY   STATUS    RESTARTS   AGE\nweb-6d4cf56dc8-wq7s2         1/1     Running   0          12d\n' };
            }
            return { stdout: '', stderr: 'kubectl: команда не поддерживается полностью\n', exitCode: 1 };
        }

        cmd_ansible(args) {
            if (args[0] === '-m' && args[1] === 'ping') {
                return { stdout: 'staging | SUCCESS => {"changed": false, "ping": "pong"}\n' };
            }
            return { stdout: '', stderr: 'ansible: команда недоступна\n', exitCode: 1 };
        }

        cmd_ansible_playbook(args) {
            const playbook = args[0] || 'deploy.yml';
            return { stdout: `PLAY [Deploy] *******************************************************************\nTASK [Gathering Facts] *********************************************************\nok: [staging]\nTASK [Deploy application] ******************************************************\nok: [staging]\nPLAY RECAP *********************************************************************\nstaging                   : ok=2    changed=1    unreachable=0    failed=0\n` };
        }

        cmd_curl(args) {
            if (args.includes('-I')) {
                const url = args[args.length - 1];
                return { stdout: `HTTP/1.1 200 OK\nServer: nginx\nContent-Type: text/html\nRequested-URL: ${url}\n` };
            }
            return { stdout: 'curl: тренажёр выводит только заголовки. Добавьте -I.\n' };
        }

        cmd_ping(args) {
            const host = args[args.length - 1];
            return { stdout: `PING ${host} (93.184.216.34) 56(84) bytes of data.\n64 bytes from example.com: icmp_seq=1 ttl=56 time=22.5 ms\n64 bytes from example.com: icmp_seq=2 ttl=56 time=22.4 ms\n\n--- ${host} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss, time 1001ms\n` };
        }

        cmd_systemctl(args) {
            const sub = args[0];
            const service = args[args.length - 1];
            if (sub === 'status') {
                const status = (this.env.systemctl && this.env.systemctl[service]) || '● nginx.service - A high performance web server\n   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n   Active: active (running)\n';
                return { stdout: `${status}\n` };
            }
            if (sub === 'restart') {
                return { stdout: `Перезапуск ${service}... Готово.\n` };
            }
            return { stdout: '', stderr: `systemctl: команда ${sub} не поддерживается\n`, exitCode: 1 };
        }

        cmd_journalctl(args) {
            const unitIndex = args.indexOf('-u');
            const unit = unitIndex !== -1 ? args[unitIndex + 1] : 'nginx';
            return { stdout: `-- Logs for ${unit} --\nSep 15 10:20:11 server systemd[1]: Started ${unit}.\nSep 15 10:22:11 server ${unit}[2134]: Reloading configuration\n` };
        }

        cmd_apt(args) {
            const sub = args[0];
            if (sub === 'update') {
                return { stdout: 'Получение:1 http://archive.ubuntu.com jammy InRelease\nЧтение списков пакетов... Готово\n' };
            }
            if (sub === 'install') {
                return { stdout: `Чтение списков пакетов... Готово\nПостроение дерева зависимостей... Готово\nПакет ${args[1]} уже установлен.\n` };
            }
            return { stdout: '', stderr: 'apt: команда не поддерживается\n', exitCode: 1 };
        }

        prompt() {
            const homeSegments = toSegments(this.home);
            const cwdSegments = toSegments(this.cwd);
            let display = this.cwd;
            if (cwdSegments.length >= homeSegments.length && homeSegments.every((seg, index) => seg === cwdSegments[index])) {
                const rest = cwdSegments.slice(homeSegments.length);
                display = `~${rest.length ? `/${rest.join('/')}` : ''}`;
            }
            return `cadet@linuxquest:${display}$`;
        }
    }

    window.VirtualShell = VirtualShell;
    window.createFile = file;
    window.createDir = dir;
    window.createSymlink = symlink;
})();
