(function () {
    function foundationScenario() {
        return {
            cwd: '/home/cadet',
            home: '/home/cadet',
            tree: {
                home: createDir({
                    cadet: createDir({
                        '.ключ': createFile('Скрытые заметки становятся видимыми тем, кто не боится точек.\n'),
                        'README.txt': createFile('Добро пожаловать в Академию Linux Quest!\n\n1. Запомни координаты своего входа.\n2. Невидимое часто прячется под точкой.\n3. Встреча ждёт тебя в каталоге проекты.\n4. Шёпот наставника записан в файле миссия.txt.\n'),
                        'миссия.txt': createFile('Чтобы открыть портал знаний, создай в проектах тайник, оставь в нём послание и вернись домой.\n'),
                        проекты: createDir({
                            'roadmap.md': createFile('# План изучения\n- Навигация\n- Файловые операции\n- Автоматизация\n'),
                            'README.md': createFile('Каталог проектов. Создайте здесь черновики, дневники и скрипты.\n'),
                        }),
                        заметки: createDir({
                            'черновик.txt': createFile('Старый черновик наставника. Удали меня, когда освоишь rm.\n')
                        }),
                        архив: createDir({
                            'памятка.txt': createFile('Архив пока пуст. Сюда попадут твои резервные копии.\n')
                        })
                    })
                }),
                etc: createDir({
                    'motd': createFile('Каждый путь начинается с pwd.\n')
                })
            },
            commands: [
                { matcher: /^man\s+pwd$/, output: 'PWD(1)\nNAME\n    pwd - print name of current/working directory\n' },
                { matcher: /^man\s+ls$/, output: 'LS(1)\nNAME\n    ls - list directory contents\n' },
                { matcher: /^man\s+cat$/, output: 'CAT(1)\nNAME\n    cat - concatenate files and print on the standard output\n' }
            ]
        };
    }

    function artisanScenario() {
        return {
            cwd: '/home/cadet',
            home: '/home/cadet',
            tree: {
                home: createDir({
                    cadet: createDir({
                        проекты: createDir({
                            отчёты: createDir({
                                'неделя1.md': createFile('Статистика по сервису A\n'),
                                'неделя2.md': createFile('Статистика по сервису B\n'),
                            }),
                            исследования: createDir({
                                'traffic.log': createFile('10:00 OK\n10:05 WARN\n10:10 ERROR\n10:15 OK\n'),
                                'errors.log': createFile('2023-09-15 Ошибка авторизации\n2023-09-15 Ошибка доступа\n')
                            }),
                            'roadmap.md': createFile('# План работ\nTODO: обновить скрипт бэкапа\nTODO: проверить резервный cron\n')
                        }),
                        архив: createDir({
                            'старый_отчёт.txt': createFile('Устаревшие данные, можно удалить.\n')
                        }),
                        журналы: createDir({
                            'nginx.log': createFile('172.16.1.10 - - [15/Sep/2023:10:00:00 +0300] "GET /health" 200\n172.16.1.11 - - [15/Sep/2023:10:01:12 +0300] "GET /admin" 403\n172.16.1.12 - - [15/Sep/2023:10:02:47 +0300] "POST /login" 500\n'),
                            'syslog': createFile('Sep 15 10:00:01 server sshd[1200]: Accepted password for cadet\nSep 15 10:02:41 server sshd[1205]: Failed password for root\nSep 15 10:05:11 server CRON[1210]: (cadet) CMD (/usr/local/bin/backup.sh)\n')
                        }),
                        данные: createDir({
                            'raw.csv': createFile('id,name\n1,alex\n2,alex\n3,sofia\n4,marina\n'),
                            'team.txt': createFile('alex\nsofia\nmarina\nalex\n')
                        }),
                        сценарии: createDir({
                            'deploy.sh': createFile('#!/bin/bash\necho "Deploy"\n'),
                            'cleanup.sh': createFile('#!/bin/bash\necho "Cleanup"\n')
                        })
                    })
                })
            },
            commands: [
                { matcher: /^man\s+grep$/, output: 'GREP(1)\nNAME\n    grep - print lines matching a pattern\n' },
                { matcher: /^man\s+find$/, output: 'FIND(1)\nNAME\n    find - search for files in a directory hierarchy\n' }
            ]
        };
    }

    function analystScenario() {
        return {
            cwd: '/home/cadet',
            home: '/home/cadet',
            tree: {
                home: createDir({
                    cadet: createDir({
                        'README.txt': createFile('Логи сервиса подлежат анализу. Используй конвейеры и фильтры.\n'),
                        логи: createDir({
                            'app.log': createFile('INFO: start worker\nWARN: cache miss\nERROR: db timeout\nERROR: retry failed\nINFO: job finished\n'),
                            'auth.log': createFile('Sep 15 11:00:01 Accepted password for dev\nSep 15 11:01:02 Failed password for root from 10.0.0.12\nSep 15 11:02:33 Failed password for root from 10.0.0.12\n'),
                            'metrics.csv': createFile('time,cpu,ram\n10:00,25,40\n10:05,80,70\n10:10,60,68\n10:15,90,80\n')
                        }),
                        отчеты: createDir({
                            'summary.md': createFile('Сводка формируется автоматически.\n')
                        })
                    })
                }),
                var: createDir({
                    log: createDir({
                        'syslog': createFile('Sep 15 11:03:00 systemd[1]: Starting backup.service\nSep 15 11:03:01 backup[1400]: Backup completed\nSep 15 11:03:05 kernel: cpu temperature warning\n'),
                        nginx: createDir({
                            'access.log': createFile('10.0.0.1 - - [15/Sep/2023:11:00:00 +0300] "GET /" 200\n10.0.0.2 - - [15/Sep/2023:11:00:03 +0300] "GET /dashboard" 200\n10.0.0.3 - - [15/Sep/2023:11:00:09 +0300] "POST /login" 500\n10.0.0.4 - - [15/Sep/2023:11:00:11 +0300] "POST /login" 500\n')
                        })
                    })
                })
            },
            commands: [
                { matcher: /^man\s+head$/, output: 'HEAD(1)\nNAME\n    head - output the first part of files\n' },
                { matcher: /^man\s+tail$/, output: 'TAIL(1)\nNAME\n    tail - output the last part of files\n' }
            ],
            env: {
                df: [
                    'Файловая система Размер Использовано Доступно Использовано% Смонтировано в',
                    '/dev/sda1         60G         42G       18G           70% /',
                    'tmpfs             4G          8M        4G             1% /run'
                ]
            }
        };
    }

    function operatorScenario() {
        return {
            cwd: '/home/cadet',
            home: '/home/cadet',
            tree: {
                home: createDir({
                    cadet: createDir({
                        '.ssh': createDir({
                            'id_rsa': createFile('-----BEGIN PRIVATE KEY-----\nFAKE\n-----END PRIVATE KEY-----\n', { mode: '0600' })
                        }, { mode: '0700' }),
                        сервисы: createDir({
                            nginx: createDir({
                                'nginx.conf': createFile('server { listen 80; }\n')
                            })
                        }),
                        деплой: createDir({
                            'inventory.ini': createFile('[staging]\n192.168.1.10\n'),
                            'deploy.yml': createFile('---\n- hosts: staging\n  tasks:\n    - debug: msg="deploy"\n')
                        })
                    })
                })
            },
            commands: [
                { matcher: /^systemctl\s+status\s+nginx$/, output: '● nginx.service - A high performance web server\n   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n   Active: active (running)\n' },
                { matcher: /^journalctl\s+-u\s+nginx\s+--since\s+"?10\s+minutes\s+ago"?$/, output: '-- Logs begin at ... --\nSep 15 10:22:11 server systemd[1]: Reloading nginx\nSep 15 10:22:12 server nginx[2134]: Reload successful\n' }
            ],
            env: {
                processes: [
                    'root         1  0.0  0.1 167668  1108 ?        Ss   09:00   0:01 /sbin/init',
                    'www-data  2134  0.2  1.3  85632  4236 ?        Ss   10:20   0:00 nginx: master process',
                    'cadet     4142  1.5  2.0 253000 15240 pts/0  S+   11:05   0:02 node server.js'
                ],
                top: [
                    'top - 11:10:00 up 20 days,  2:03,  3 users,  load average: 0.44, 0.52, 0.40',
                    'Tasks: 198 total,   1 running, 197 sleeping,   0 stopped,   0 zombie',
                    '%Cpu(s):  5.3 us,  2.0 sy,  0.0 ni, 91.0 id,  1.3 wa,  0.0 hi,  0.4 si,  0.0 st',
                    'MiB Mem :  32000 total,  18000 free,   6000 used,   8000 buff/cache'
                ],
                systemctl: {
                    nginx: '● nginx.service - A high performance web server\n   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n   Active: active (running)\n'
                }
            }
        };
    }

    function devopsScenario() {
        return {
            cwd: '/home/cadet/devops',
            home: '/home/cadet',
            tree: {
                home: createDir({
                    cadet: createDir({
                        devops: createDir({
                            'docker-compose.yml': createFile('version: "3"\nservices:\n  web:\n    build: .\n    ports: ["80:80"]\n'),
                            'deploy.yml': createFile('---\n- hosts: staging\n  tasks:\n    - name: Deploy\n      shell: ./deploy.sh\n'),
                            'README.md': createFile('DevOps лаборатория. Проверяйте git, docker и ansible.\n')
                        }),
                        '.git': createDir({
                            'HEAD': createFile('ref: refs/heads/main\n')
                        })
                    })
                })
            },
            commands: [
                { matcher: /^git\s+status$/, output: 'On branch main\nnothing to commit, working tree clean\n' },
                { matcher: /^git\s+log\s+-1\s+--oneline$/, output: 'a1b2c3d feat: добавить мониторинг\n' },
                { matcher: /^docker\s+ps$/, output: 'CONTAINER ID   IMAGE        COMMAND                  STATUS          NAMES\n4c3b1c2d9f1e   app:latest  "./start.sh"             Up 2 hours      app_web_1\n' },
                { matcher: /^docker\s+compose\s+up\s+-d$/, output: '[+] Running 3/3\n ✔ Network app_default      Created\n ✔ Container app_db_1       Started\n ✔ Container app_web_1      Started\n' },
                { matcher: /^ansible-playbook\s+deploy\.yml$/, output: 'PLAY [Deploy] *******************************************************************\nTASK [Gathering Facts] *********************************************************\nok: [staging]\nTASK [Deploy application] ******************************************************\nok: [staging]\nPLAY RECAP *********************************************************************\nstaging                   : ok=2    changed=1    unreachable=0    failed=0\n' }
            ],
            env: {
                processes: [
                    'root         1  0.0  0.1 167668  1108 ?        Ss   09:00   0:01 /sbin/init',
                    'cadet     5142  0.6  1.4 210000 11240 pts/0  S+   11:15   0:03 python orchestrator.py'
                ]
            }
        };
    }

    const missions = [
        {
            id: 'foundation',
            title: 'Первые шаги',
            difficulty: 'Новичок',
            summary: 'Научитесь ориентироваться в терминале, создавать файлы и читать подсказки наставника.',
            skills: ['Навигация', 'Файлы', 'Простые утилиты'],
            objectives: [
                'Выяснить, где вы находитесь и что лежит рядом.',
                'Научиться переходить между каталогами и создавать структуру проекта.',
                'Оставить первую запись в тренировочном дневнике и вернуться домой.'
            ],
            resources: [
                { label: 'Linux Journey — Navigation', url: 'https://linuxjourney.com/lesson/navigation', description: 'Основы навигации по файловой системе.' },
                { label: 'ExplainShell — ls -a', url: 'https://explainshell.com/explain?cmd=ls+-a', description: 'Разбор ключей команды ls.' },
                { label: 'GNU Coreutils — cat', url: 'https://www.gnu.org/software/coreutils/manual/html_node/cat-invocation.html', description: 'Официальное описание cat.' }
            ],
            scenario: foundationScenario,
            tasks: [
                {
                    title: 'Отметить точку входа',
                    description: 'Определите текущий путь, чтобы не потеряться в катакомбах файловой системы.',
                    learning: 'pwd показывает абсолютный путь текущего каталога.',
                    context: 'Наставник требует доклада о координатах перед началом миссии.',
                    command: 'pwd',
                    hint: 'Вспомните трёхбуквенную аббревиатуру, переводящуюся как «напечатать рабочий каталог».',
                    intel: 'Подсказка в /etc/motd шепчет, что путь начинается с команды pwd.',
                    success: 'Координаты зафиксированы. Теперь можно исследовать окружение.',
                    explanation: 'pwd (print working directory) выводит абсолютный путь независимо от того, где вы находитесь.'
                },
                {
                    title: 'Раскрыть тайники',
                    description: 'Убедитесь, что видите не только обычные файлы, но и скрытые подсказки.',
                    learning: 'Флаг -a у ls показывает элементы, начинающиеся с точки.',
                    context: 'Наставник спрятал ключ в каталоге, его имя начинается с точки.',
                    command: 'ls -a',
                    alternatives: ['ls --all'],
                    hint: 'Добавьте к команде перечисления тот флаг, который звучит как «all».',
                    intel: 'Скрытая запись .ключ появится только если включить «ночное зрение».',
                    success: 'Список обновлён. Скрытые файлы теперь на виду.',
                    explanation: 'ls -a показывает скрытые файлы вроде .ключ и .ssh, которые обычно не отображаются.'
                },
                {
                    title: 'Прочитать послание',
                    description: 'Ознакомьтесь с инструкцией наставника в файле README.txt.',
                    learning: 'cat мгновенно выводит содержимое небольших текстовых файлов.',
                    context: 'Перед выполнением миссии прочитайте свиток с инструкциями.',
                    command: 'cat README.txt',
                    alternatives: ['cat ./README.txt'],
                    hint: 'Команда из трёх букв «как кот» покажет текст без открытия редактора.',
                    intel: 'В README спрятан маршрут: координаты, тайник и финальная точка.',
                    success: 'Послание прочитано. Теперь вы знаете, что делать дальше.',
                    explanation: 'cat удобно применять для быстрых заметок и инструкций. Для больших файлов лучше использовать less.'
                },
                {
                    title: 'Следовать указанию',
                    description: 'Перейдите в каталог проекты, чтобы подготовить рабочую площадку.',
                    learning: 'cd меняет текущий каталог. Путь можно указывать относительный.',
                    context: 'Секретная встреча назначена именно там.',
                    command: 'cd проекты',
                    alternatives: ['cd ./проекты'],
                    hint: 'В README упомянуто место встречи — нужно «change directory» туда.',
                    intel: 'После успеха приглашение в README перестаёт быть загадкой.',
                    success: 'Вы внутри лаборатории проектов.',
                    explanation: 'cd проекты перемещает вас внутрь каталога проектов. Относительные пути считаются от текущей позиции.'
                },
                {
                    title: 'Соорудить тайник',
                    description: 'Создайте в проектах каталог черновики для будущих записей.',
                    learning: 'mkdir создаёт каталоги. Флаг -p помогает создавать вложенные структуры.',
                    context: 'Наставник просил построить тайник перед передачей сообщения.',
                    command: 'mkdir черновики',
                    alternatives: ['mkdir ./черновики', 'mkdir -p черновики'],
                    hint: 'Команда звучит как «make directory». Ей нравится ключ -p, но он необязателен.',
                    intel: 'Без тайника вы не сможете спрятать дневник.',
                    success: 'Тайник готов. Можно переходить к записи сообщений.',
                    explanation: 'mkdir создаёт каталог. Если нужно несколько уровней, используют mkdir -p path/to/dir.'
                },
                {
                    title: 'Завести дневник',
                    description: 'Создайте файл дневник.txt внутри каталога черновики.',
                    learning: 'touch создаёт пустые файлы или обновляет временную метку существующих.',
                    context: 'Дневник понадобится, чтобы фиксировать находки.',
                    command: 'touch черновики/дневник.txt',
                    alternatives: ['touch ./черновики/дневник.txt'],
                    hint: 'Команда, которая «касается» файла, создаёт его, если тот отсутствует.',
                    intel: 'Файл появится внутри созданного тайника.',
                    success: 'Дневник создан и ждёт записи.',
                    explanation: 'touch используется для быстрого создания файлов без открытия редактора.'
                },
                {
                    title: 'Оставить пароль-фразу',
                    description: 'Добавьте в дневник строку «Первые шаги сделаны».',
                    learning: 'echo выводит текст, а с перенаправлением >> добавляет его в конец файла.',
                    context: 'Наставник проверит, заметили ли вы лазейку в инструкции.',
                    command: 'echo "Первые шаги сделаны" >> черновики/дневник.txt',
                    matchers: [/^echo\s+"?Первые\s+шаги\s+сделаны"?\s*>>\s*черновики\/дневник\.txt$/],
                    hint: 'Скажите «echo», а двойная стрелка направит фразу в дневник.',
                    intel: 'Подсказка из миссия.txt намекала на послание.',
                    success: 'Фраза сохранена. Тайный пароль готов.',
                    explanation: 'Перенаправление >> добавляет текст в конец файла, не затирая уже записанное.'
                },
                {
                    title: 'Проверить запись',
                    description: 'Выведите содержимое дневника, чтобы убедиться, что фраза на месте.',
                    learning: 'cat позволяет быстро проверить небольшие файлы.',
                    context: 'Убедитесь, что пароль-фраза записана корректно.',
                    command: 'cat черновики/дневник.txt',
                    hint: 'Снова используйте команду «кота» для чтения.',
                    intel: 'Если фраза отсутствует, попробуйте ещё раз с перенаправлением.',
                    success: 'Запись прочитана — дневник содержит секретную фразу.',
                    explanation: 'cat отображает содержимое файла построчно. Можно сверить результат.'
                },
                {
                    title: 'Убрать старый черновик',
                    description: 'Удалите файл заметки/черновик.txt — он больше не нужен.',
                    learning: 'rm удаляет файлы. Без ключей работает только с файлами.',
                    context: 'Наставник просил очистить старые заметки.',
                    command: 'rm ../заметки/черновик.txt',
                    alternatives: ['rm /home/cadet/заметки/черновик.txt'],
                    hint: 'Команда rm словно «remove». Укажите путь к файлу.',
                    intel: 'Черновик мешает навести порядок перед сдачей миссии.',
                    success: 'Лишний файл удалён.',
                    explanation: 'rm без параметров удаляет файлы. Для каталогов нужен флаг -r.'
                },
                {
                    title: 'Вернуться домой',
                    description: 'Перейдите обратно в домашний каталог.',
                    learning: 'cd .. поднимает на уровень вверх, а cd без аргументов переносит домой.',
                    context: 'Портал знаний активируется только из домашнего каталога.',
                    command: 'cd ..',
                    alternatives: ['cd ~', 'cd /home/cadet'],
                    hint: 'Две точки означают шаг назад. Можно воспользоваться и волнистой линией.',
                    intel: 'Проверьте prompt — он должен показать ~.',
                    success: 'Вы вернулись в базовый лагерь.',
                    explanation: 'Команда cd .. возвращает в родительский каталог, а cd без аргументов — в домашний.'
                }
            ]
        },
        {
            id: 'artisan',
            title: 'Файловый мастер',
            difficulty: 'Средний',
            summary: 'Работа с файлами, логами и поиском. Научитесь копировать, перемещать и фильтровать данные.',
            skills: ['Копирование', 'Логи', 'Поиск'],
            objectives: [
                'Освоить копирование и перемещение файлов между каталогами.',
                'Анализировать журналы и подсчитывать строки.',
                'Использовать find и grep для точечных поисков.'
            ],
            resources: [
                { label: 'man cp', url: 'https://man7.org/linux/man-pages/man1/cp.1.html', description: 'Документация по копированию файлов.' },
                { label: 'Grep pocket guide', url: 'https://www.gnu.org/software/grep/manual/grep.html', description: 'Руководство по grep.' },
                { label: 'Find command tutorial', url: 'https://linuxize.com/post/find-command-in-linux/', description: 'Примеры использования find.' }
            ],
            scenario: artisanScenario,
            tasks: [
                {
                    title: 'Создать резервную копию',
                    description: 'Скопируйте отчёт неделя1.md в каталог архив под именем неделя1.md.',
                    learning: 'cp принимает исходный файл и путь назначения.',
                    context: 'Перед переработкой отчёт нужно сохранить.',
                    command: 'cp проекты/отчёты/неделя1.md архив/неделя1.md',
                    alternatives: ['cp ./проекты/отчёты/неделя1.md ./архив/неделя1.md'],
                    hint: 'Команда копирования похожа на слово «copy». Сначала источник, потом цель.',
                    intel: 'Архив пустует — пора занести туда свежий отчёт.',
                    success: 'Резервная копия создана.',
                    explanation: 'cp без флагов копирует файлы один к одному. Если файл существует, его содержимое перезаписывается.'
                },
                {
                    title: 'Убрать устаревшие данные',
                    description: 'Удалите файл архив/старый_отчёт.txt.',
                    learning: 'rm удаляет ненужные файлы.',
                    context: 'Старые отчёты мешают видеть актуальные копии.',
                    command: 'rm архив/старый_отчёт.txt',
                    hint: 'Удаление по имени файла. Помни, что rm безвозвратен.',
                    intel: 'Старый отчёт отмечен в архиве как мусор.',
                    success: 'Архив очищен от устаревшего файла.',
                    explanation: 'rm удаляет файл. На проде перед rm полезно использовать ls, чтобы убедиться в пути.'
                },
                {
                    title: 'Переименовать черновик',
                    description: 'Переместите отчёты/неделя2.md в отчёты/неделя2_исправленный.md.',
                    learning: 'mv меняет имя файла или переносит его в другой каталог.',
                    context: 'После правок файл нужно переименовать.',
                    command: 'mv проекты/отчёты/неделя2.md проекты/отчёты/неделя2_исправленный.md',
                    hint: 'Сначала укажите старое имя, затем новое. Команда напоминает «move».',
                    intel: 'Переименованный файл останется в том же каталоге.',
                    success: 'Файл получил новое имя.',
                    explanation: 'mv переименовывает файл. Если указать каталог в конце, файл переместится внутрь него.'
                },
                {
                    title: 'Проанализировать начало лога',
                    description: 'Выведите первые три строки файла проекты/исследования/traffic.log.',
                    learning: 'head -n NUM показывает начало файла.',
                    context: 'Нужно быстро понять, что происходило в начале записи.',
                    command: 'head -n 3 проекты/исследования/traffic.log',
                    alternatives: ['head -3 проекты/исследования/traffic.log'],
                    hint: 'Слово head и число строк — и вот вы уже читаете стартовые записи.',
                    intel: 'Внимание на отметки WARN и ERROR.',
                    success: 'Первые строки лога выведены.',
                    explanation: 'head полезен для проверки структуры файла и корректности заголовков.'
                },
                {
                    title: 'Проверить хвост ошибок',
                    description: 'Посмотрите последние две строки файла проекты/исследования/errors.log.',
                    learning: 'tail -n NUM показывает конец файла.',
                    context: 'Интересует свежая ошибка авторизации.',
                    command: 'tail -n 2 проекты/исследования/errors.log',
                    alternatives: ['tail -2 проекты/исследования/errors.log'],
                    hint: 'Если head смотрит вперёд, то tail — в хвост.',
                    intel: 'Сравните даты ошибок с задачей наставника.',
                    success: 'Свежие записи ошибок на экране.',
                    explanation: 'tail помогает отследить последние события без прокрутки всего файла.'
                },
                {
                    title: 'Найти TODO',
                    description: 'Найдите строки с TODO в файле проекты/roadmap.md и покажите номера.',
                    learning: 'grep -n выводит совпадения с номерами строк.',
                    context: 'Перед релизом нужно закрыть все TODO.',
                    command: 'grep -n "TODO" проекты/roadmap.md',
                    matchers: [/^grep\s+-n\s+"?TODO"?\s+проекты\/roadmap\.md$/],
                    hint: 'grep ищет совпадения. Добавьте -n, чтобы увидеть номер.',
                    intel: 'Два TODO ждут своего часа.',
                    success: 'TODO помечены и готовы к исполнению.',
                    explanation: 'grep помогает быстро отыскать нужные участки кода или документации.'
                },
                {
                    title: 'Отобрать скрипты',
                    description: 'Найдите все файлы .sh в каталоге сценарии.',
                    learning: 'find ищет файлы по маске имени.',
                    context: 'Нужно убедиться, что все скрипты попали в репозиторий.',
                    command: 'find сценарии -type f -name "*.sh"',
                    hint: 'Команда поиска обходит каталог рекурсивно. Укажите тип f и маску *.sh.',
                    intel: 'В каталоге сценарии спрятаны два скрипта.',
                    success: 'Скрипты найдены. Можно добавить их в задачи.',
                    explanation: 'find сценарии -type f -name "*.sh" выведет все shell-скрипты внутри каталога.'
                },
                {
                    title: 'Подсчитать строки данных',
                    description: 'Определите количество строк в файле данные/raw.csv.',
                    learning: 'wc -l подсчитывает строки.',
                    context: 'Проверяем объём данных перед очисткой.',
                    command: 'wc -l данные/raw.csv',
                    hint: 'Команда «word count» с ключом -l отвечает за строки.',
                    intel: 'В файле повторяются некоторые записи.',
                    success: 'Количество строк подсчитано.',
                    explanation: 'wc -l удобно использовать перед обработкой CSV и логов.'
                },
                {
                    title: 'Очистить список от дублей',
                    description: 'Отсортируйте team.txt и оставьте только уникальные имена.',
                    learning: 'sort -u сортирует и убирает повторы.',
                    context: 'Список команды нужен без повторов.',
                    command: 'sort -u данные/team.txt',
                    hint: 'Добавьте к sort флаг -u — unique.',
                    intel: 'В результате останутся alex, marina, sofia.',
                    success: 'Список очищен от повторов.',
                    explanation: 'sort -u совмещает сортировку и deduplication в одной команде.'
                }
            ]
        },
        {
            id: 'analyst',
            title: 'Аналитик логов',
            difficulty: 'Продвинутый',
            summary: 'Используйте конвейеры, фильтрацию и диагностику ресурсов для выявления проблем.',
            skills: ['Конвейеры', 'Логи', 'Мониторинг'],
            objectives: [
                'Фильтровать журналы по условиям и быстро находить ошибки.',
                'Комбинировать команды через pipe для подсчётов и анализа.',
                'Оценивать состояние системы по ресурсам.'
            ],
            resources: [
                { label: 'Linux pipes', url: 'https://linuxjourney.com/lesson/pipes-and-redirection', description: 'Как соединять команды через |.' },
                { label: 'Journalctl basics', url: 'https://www.digitalocean.com/community/tutorials/how-to-use-journalctl-to-view-and-manipulate-systemd-logs', description: 'Работа с системным журналом.' },
                { label: 'Monitoring cheat sheet', url: 'https://linuxopsys.com/topics/linux-monitoring-commands', description: 'Команды мониторинга ресурсов.' }
            ],
            scenario: analystScenario,
            tasks: [
                {
                    title: 'Извлечь ошибки приложения',
                    description: 'Найдите строки с ERROR в файле home/cadet/логи/app.log.',
                    learning: 'grep -i ищет без учёта регистра.',
                    context: 'Нужно понять, почему приложение падало.',
                    command: 'grep -i "error" логи/app.log',
                    hint: 'Флаг -i поможет не пропустить варианты с разным регистром.',
                    intel: 'В журнале две строки с ERROR.',
                    success: 'Ошибки найдены.',
                    explanation: 'grep -i ищет совпадения независимо от регистра символов.'
                },
                {
                    title: 'Подсчитать количество ошибок',
                    description: 'Подсчитайте, сколько раз в app.log встречается ERROR.',
                    learning: 'Комбинация grep и wc -l быстро считает совпадения.',
                    context: 'Нужно доложить число повторений.',
                    command: 'grep -i "error" логи/app.log | wc -l',
                    hint: 'Соедините grep и wc -l через символ |.',
                    intel: 'Результат должен показать 2.',
                    success: 'Количество ошибок посчитано.',
                    explanation: 'Конвейер позволяет передавать вывод одной команды на вход другой.'
                },
                {
                    title: 'Отфильтровать неудачные логины',
                    description: 'Выведите строки с Failed password из auth.log.',
                    learning: 'grep может искать фразы с пробелами, если заключить их в кавычки.',
                    context: 'Проверяем попытки взлома.',
                    command: 'grep "Failed password" логи/auth.log',
                    hint: 'Возьмите фразу в кавычки, чтобы grep не разделил её.',
                    intel: 'Есть две повторяющиеся записи от 10.0.0.12.',
                    success: 'Неудачные попытки авторизации найдены.',
                    explanation: 'grep "Failed password" показывает строки, содержащие фразу целиком.'
                },
                {
                    title: 'Выявить ошибки входа',
                    description: 'Покажите последние две строки access.log со статусом 500.',
                    learning: 'tail и grep вместе помогают искать свежие ошибки.',
                    context: 'Система выдаёт 500 при логине, нужно найти примеры.',
                    command: 'tail -n 20 /var/log/nginx/access.log | grep " 500 "',
                    hint: 'Сначала возьмите хвост, затем фильтруйте по коду 500.',
                    intel: 'Ошибки повторяются дважды.',
                    success: 'Ошибки входа отфильтрованы.',
                    explanation: 'Комбинация tail + grep отбирает последние записи с нужным статусом.'
                },
                {
                    title: 'Посчитать горячие ядра',
                    description: 'Из metrics.csv выведите строки, где CPU больше 80.',
                    learning: 'Можно использовать grep с регулярным выражением или awk.',
                    context: 'Нужно найти пики нагрузки.',
                    command: 'grep ",8[0-9]," логи/metrics.csv',
                    matchers: [/^grep\s+",8[0-9],"\s+логи\/metrics\.csv$/, /^awk\s+-F,\s+'\$2>=80'\s+логи\/metrics\.csv$/i],
                    hint: 'Подумайте о шаблоне, который ловит значения 80 и выше.',
                    intel: 'В CSV есть две строки с нагрузкой выше 80.',
                    success: 'Строки с высоким CPU найдены.',
                    explanation: 'grep с шаблоном ,8[0-9], ловит значения от 80 до 89. Можно также использовать awk по столбцам.'
                },
                {
                    title: 'Проверить свободное место',
                    description: 'Выведите сводку по дискам в удобочитаемом формате.',
                    learning: 'df -h показывает заполненность файловых систем.',
                    context: 'Перед обновлением нужно убедиться в свободном месте.',
                    command: 'df -h',
                    hint: 'Команда начинается с буквы d и показывает «disk free».',
                    intel: 'Обратите внимание на 70% занятости корневого раздела.',
                    success: 'Сводка по дискам получена.',
                    explanation: 'df -h выводит размеры и заполненность файловых систем в человеко-читаемом формате.'
                },
                {
                    title: 'Оценить память',
                    description: 'Выведите статистику памяти в формате, удобном для чтения человеком.',
                    learning: 'free -h показывает RAM и swap.',
                    context: 'Проверяем, хватает ли памяти приложению.',
                    command: 'free -h',
                    hint: 'Команда звучит как «free» — свободная память.',
                    intel: 'Система показывает около 11Gi доступной памяти.',
                    success: 'Память проанализирована.',
                    explanation: 'free -h показывает общую, используемую и свободную память.'
                },
                {
                    title: 'Создать архив логов',
                    description: 'Упакуйте каталог логи в архив logs.tar.gz.',
                    learning: 'tar -czf создаёт сжатый архив.',
                    context: 'Нужно отправить логи команде безопасности.',
                    command: 'tar -czf logs.tar.gz логи',
                    hint: 'Вспомните три буквы: c (create), z (gzip), f (file).',
                    intel: 'Архив должен появиться в текущем каталоге.',
                    success: 'Архив создан.',
                    explanation: 'tar -czf создаёт gzip-архив и записывает список файлов внутрь.'
                }
            ]
        },
        {
            id: 'operator',
            title: 'Оператор сервисов',
            difficulty: 'Профи',
            summary: 'Управляйте сервисами, анализируйте процессы и готовьте инфраструктуру к деплою.',
            skills: ['Процессы', 'Сервисы', 'Автоматизация'],
            objectives: [
                'Научиться искать процессы и проверять их состояние.',
                'Использовать systemctl и journalctl для управления службами.',
                'Подготовить ключи и инструменты для деплоя.'
            ],
            resources: [
                { label: 'systemd cheat sheet', url: 'https://access.redhat.com/articles/754933', description: 'Основы управления сервисами.' },
                { label: 'SSH hardening', url: 'https://www.ssh.com/academy/ssh/keygen#protecting-private-keys', description: 'Почему важны права 600 на ключи.' },
                { label: 'Ansible playbooks', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html', description: 'Как работать с плейбуками.' }
            ],
            scenario: operatorScenario,
            tasks: [
                {
                    title: 'Найти процесс nginx',
                    description: 'Выведите процессы, связанные с nginx.',
                    learning: 'ps aux | grep позволяет отфильтровать нужный процесс.',
                    context: 'Проверяем, запущен ли веб-сервер.',
                    command: 'ps aux | grep nginx',
                    matchers: [/^ps\s+aux\s*\|\s*grep\s+nginx$/],
                    hint: 'Используйте ps aux и фильтр по слову nginx.',
                    intel: 'В списке процессов должен появиться master process nginx.',
                    success: 'Процесс найден.',
                    explanation: 'ps aux выводит все процессы, grep оставляет только нужные.'
                },
                {
                    title: 'Проверить статус nginx',
                    description: 'Убедитесь, что служба nginx активна.',
                    learning: 'systemctl status показывает состояние службы.',
                    context: 'Перед изменениями нужно убедиться, что сервис работает.',
                    command: 'systemctl status nginx',
                    hint: 'Команда systemctl управляет сервисами. Подкоманда status покажет состояние.',
                    intel: 'Вы увидите Active: active (running).',
                    success: 'Статус изучен.',
                    explanation: 'systemctl status nginx покажет состояние, PID и последние логи.'
                },
                {
                    title: 'Перезапустить nginx',
                    description: 'Перезапустите службу nginx, чтобы применить конфигурацию.',
                    learning: 'systemctl restart перезапускает сервис.',
                    context: 'После правок нужно перезапустить веб-сервер.',
                    command: 'sudo systemctl restart nginx',
                    hint: 'Не забудьте о sudo, иначе прав может не хватить.',
                    intel: 'После перезапуска можно снова проверить статус.',
                    success: 'Команда перезапуска выполнена.',
                    explanation: 'sudo systemctl restart nginx перезапускает сервис с правами администратора.'
                },
                {
                    title: 'Изучить журнал службы',
                    description: 'Посмотрите последние строки журнала nginx за 10 минут.',
                    learning: 'journalctl -u <unit> --since задаёт отбор по времени.',
                    context: 'Ищем свежие ошибки после перезапуска.',
                    command: 'journalctl -u nginx --since "10 minutes ago"',
                    hint: 'journalctl умеет понимать фразы вроде "10 minutes ago".',
                    intel: 'Записи покажут успешную перезагрузку.',
                    success: 'Журнал просмотрен.',
                    explanation: 'journalctl -u nginx --since "10 minutes ago" покажет последние строки именно по этой службе.'
                },
                {
                    title: 'Подготовить ключ',
                    description: 'Проверьте, что у приватного ключа ~/.ssh/id_rsa правильные права.',
                    learning: 'chmod 600 делает ключ доступным только владельцу.',
                    context: 'SSH откажется работать с более широкими правами.',
                    command: 'chmod 600 ~/.ssh/id_rsa',
                    hint: 'Шестёрка — rw для владельца, остальным запрещено.',
                    intel: 'Права 600 успокоят ssh.',
                    success: 'Права обновлены.',
                    explanation: 'chmod 600 файл устанавливает rw------- — требование ssh для приватных ключей.'
                },
                {
                    title: 'Проверить загрузку системы',
                    description: 'Выведите первые четыре строки top в пакетном режиме.',
                    learning: 'top -b -n 1 даёт снимок состояния CPU и памяти.',
                    context: 'Нужно оценить нагрузку перед деплоем.',
                    command: 'top -b -n 1 | head -n 4',
                    hint: 'Снимок top в batch-режиме можно передать head для обрезки.',
                    intel: 'Убедитесь, что idle около 91%.',
                    success: 'Снимок top получен.',
                    explanation: 'top -b -n 1 выводит отчёт, head -n 4 оставляет только шапку.'
                },
                {
                    title: 'Проверить инвентарь Ansible',
                    description: 'Просмотрите файл деплой/inventory.ini.',
                    learning: 'cat и less помогают проверить параметры деплоя.',
                    context: 'Нужно убедиться, что в инвентаре указан staging.',
                    command: 'cat деплой/inventory.ini',
                    hint: 'Каталог деплой содержит inventory.ini — воспользуйтесь cat.',
                    intel: 'Файл должен содержать секцию [staging].',
                    success: 'Инвентарь прочитан.',
                    explanation: 'cat inventory.ini позволяет убедиться в корректности хостов перед запуском плейбука.'
                },
                {
                    title: 'Запустить проверочный пинг',
                    description: 'Проверьте доступность staging при помощи ansible модуля ping.',
                    learning: 'ansible -m ping -i inventory.ini staging.',
                    context: 'Перед деплоем убедитесь, что узел отвечает.',
                    command: 'ansible -i деплой/inventory.ini staging -m ping',
                    matchers: [/^ansible\s+-i\s+деплой\/inventory\.ini\s+staging\s+-m\s+ping$/],
                    hint: 'Укажите инвентарь через -i и модуль ping.',
                    intel: 'Ответ должен быть pong.',
                    success: 'Staging отвечает pong.',
                    explanation: 'ansible -m ping проверяет связь с хостами без запуска задач.'
                }
            ]
        },
        {
            id: 'devops',
            title: 'DevOps-мастер',
            difficulty: 'Эксперт',
            summary: 'Контролируйте репозиторий, контейнеры и автоматизацию деплоя.',
            skills: ['Git', 'Контейнеры', 'Автоматизация'],
            objectives: [
                'Проверить состояние git-репозитория и создать ветку.',
                'Убедиться в работе контейнеров и поднять стек.',
                'Запустить плейбук и проверить доступность сервисов.'
            ],
            resources: [
                { label: 'Pro Git', url: 'https://git-scm.com/book/ru/v2', description: 'Глубокое изучение Git.' },
                { label: 'Docker docs', url: 'https://docs.docker.com/engine/reference/commandline/cli/', description: 'Справочник по командам Docker.' },
                { label: 'Ansible docs', url: 'https://docs.ansible.com/', description: 'Документация по автоматизации.' }
            ],
            scenario: devopsScenario,
            tasks: [
                {
                    title: 'Проверить чистоту репозитория',
                    description: 'Убедитесь, что рабочее дерево чистое.',
                    learning: 'git status показывает незакоммиченные изменения.',
                    context: 'Перед созданием ветки нужно убедиться в чистоте.',
                    command: 'git status',
                    hint: 'Команда начинается со слова git и заканчивается status.',
                    intel: 'Вы должны увидеть «working tree clean».',
                    success: 'Репозиторий чист.',
                    explanation: 'git status показывает активную ветку и статус файлов.'
                },
                {
                    title: 'Посмотреть последний коммит',
                    description: 'Выведите краткую информацию о последнем коммите.',
                    learning: 'git log -1 --oneline показывает один коммит.',
                    context: 'Нужно удостовериться, что последние изменения внедрены.',
                    command: 'git log -1 --oneline',
                    hint: 'Сочетание -1 и --oneline выдаёт компактный результат.',
                    intel: 'Коммит feat: добавить мониторинг — именно его мы искали.',
                    success: 'Информация о последнем коммите получена.',
                    explanation: 'git log -1 --oneline выводит только последний коммит в одну строку.'
                },
                {
                    title: 'Создать релизную ветку',
                    description: 'Создайте ветку release/v1.2.',
                    learning: 'git checkout -b создаёт новую ветку и переключает на неё.',
                    context: 'Готовим релизную ветку перед деплоем.',
                    command: 'git checkout -b release/v1.2',
                    hint: 'checkout -b <ветка> — быстрый способ создать ветку.',
                    intel: 'После выполнения ветка станет активной.',
                    success: 'Новая ветка создана.',
                    explanation: 'git checkout -b создаёт ветку от текущего состояния и сразу переключает на неё.'
                },
                {
                    title: 'Проверить контейнеры',
                    description: 'Посмотрите список запущенных контейнеров.',
                    learning: 'docker ps показывает текущие контейнеры.',
                    context: 'Нужно убедиться, что сервисы работают.',
                    command: 'docker ps',
                    hint: 'Команда состоит из двух слов: docker и ps.',
                    intel: 'Контейнер app_web_1 должен быть в статусе Up.',
                    success: 'Контейнеры отображены.',
                    explanation: 'docker ps выводит ID, образ, команду и статус контейнеров.'
                },
                {
                    title: 'Поднять docker compose',
                    description: 'Запустите сервисы в фоне.',
                    learning: 'docker compose up -d запускает стек.',
                    context: 'Готовим окружение разработчика.',
                    command: 'docker compose up -d',
                    alternatives: ['docker-compose up -d'],
                    hint: 'Используйте современный синтаксис docker compose.',
                    intel: 'Вы увидите отчёт о запуске трёх сервисов.',
                    success: 'Стек поднят.',
                    explanation: 'Флаг -d запускает контейнеры в фоне, не блокируя терминал.'
                },
                {
                    title: 'Проверить HTTP-заголовки',
                    description: 'Получите только заголовки ответа от http://example.com.',
                    learning: 'curl -I делает HTTP HEAD запрос.',
                    context: 'Нужно убедиться, что сервис отвечает 200.',
                    command: 'curl -I http://example.com',
                    hint: 'Воспользуйтесь curl с флагом, означающим «headers only».',
                    intel: 'В заголовках должен быть статус 200 OK.',
                    success: 'Заголовки получены.',
                    explanation: 'curl -I отправляет HEAD-запрос и выводит только заголовки.'
                },
                {
                    title: 'Запустить плейбук',
                    description: 'Выполните ansible-playbook deploy.yml.',
                    learning: 'ansible-playbook применяет инструкции на хостах.',
                    context: 'Настало время задеплоить обновление.',
                    command: 'ansible-playbook deploy.yml',
                    hint: 'Команда начинается со слова ansible и содержит дефис.',
                    intel: 'PLAY RECAP покажет успех.',
                    success: 'Плейбук выполнен.',
                    explanation: 'ansible-playbook читает YAML-файл с задачами и запускает их на выбранных узлах.'
                },
                {
                    title: 'Проверить соединение с хостом',
                    description: 'Отправьте две ICMP-проверки на staging.example.com.',
                    learning: 'ping -c COUNT host посылает указанное число пакетов.',
                    context: 'Контрольная проверка перед сдачей миссии.',
                    command: 'ping -c 2 staging.example.com',
                    hint: 'Флаг -c задаёт количество пакетов.',
                    intel: 'Должно прийти два ответа с потерями 0%.',
                    success: 'Связь с хостом подтверждена.',
                    explanation: 'ping -c 2 отправляет два пакета и показывает статистику доступности.'
                }
            ]
        }
    ];

    window.missions = missions;
})();
