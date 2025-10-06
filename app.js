const STORAGE_KEY = 'linux-quest-progress-v2';

const missions = [
    {
        id: 'foundation',
        title: 'Новичок',
        difficulty: 'Лёгкий',
        summary: 'Освойте базовые команды навигации и работы с файлами.',
        skills: ['Навигация', 'Файлы', 'Терминал'],
        objectives: [
            'Находить текущий путь и изучать содержимое каталога.',
            'Создавать структуры папок и файлов для проектов.',
            'Читать подсказки и системные сообщения в терминале.'
        ],
        resources: [
            { label: 'Linux Journey — Навигация', url: 'https://linuxjourney.com/lesson/navigation', description: 'Обзор перемещения по файловой системе.' },
            { label: 'ExplainShell — pwd', url: 'https://explainshell.com/explain?cmd=pwd', description: 'Разбор команды pwd.' },
            { label: 'GNU Coreutils — ls', url: 'https://www.gnu.org/software/coreutils/manual/html_node/ls-invocation.html', description: 'Документация по ls и ключам.' }
        ],
        tasks: [
            {
                title: 'Где я нахожусь?',
                description: 'Определите текущий абсолютный путь рабочего каталога.',
                learning: 'Команда pwd показывает путь от корня файловой системы.',
                context: 'Представьте, что вы подключились к новой машине и сначала проверяете, где находитесь.',
                command: 'pwd',
                alternatives: ['echo $PWD'],
                response: '/home/cadet\\n',
                hint: 'Воспользуйтесь командой print working directory.',
                success: 'Отлично! Теперь вы знаете свою точку отсчёта.',
                explanation: 'pwd печатает полный путь каталога, где открыт терминал, что помогает не потеряться при работе.'
            },
            {
                title: 'Посмотреть содержимое',
                description: 'Выведите список файлов и скрытых объектов в текущем каталоге.',
                learning: 'Флаг -a показывает также скрытые файлы, начинающиеся с точки.',
                context: 'Нужно быстро оценить, какие конфигурации и документы доступны.',
                command: 'ls -a',
                alternatives: ['ls -la', 'ls -al', 'ls --all'],
                response: '.  ..  Документы  Загрузки  миссия.txt  .ssh  .bashrc\\n',
                hint: 'Дополните ls ключом, который выводит скрытые файлы.',
                success: 'Список получен, вы видите даже скрытые элементы.',
                explanation: 'ls с параметром -a помогает обнаружить конфигурационные файлы и каталоги, которые обычно не отображаются.'
            },
            {
                title: 'Создать рабочую папку',
                description: 'Создайте каталог «проекты» в текущей директории.',
                learning: 'mkdir создаёт каталоги. При необходимости используйте относительные пути.',
                context: 'Вы готовите структуру для хранения учебных файлов.',
                command: 'mkdir проекты',
                alternatives: ['mkdir ./проекты'],
                response: 'Каталог «проекты» создан.\\n',
                hint: 'Используйте make directory с именем папки.',
                success: 'Готово! Можно складывать сюда учебные материалы.',
                explanation: 'mkdir создаёт новый каталог. Если нужно создать несколько уровней сразу, добавляют параметр -p.'
            },
            {
                title: 'Завести заметку',
                description: 'Создайте пустой файл дневника в каталоге проекты.',
                learning: 'touch обновляет временные метки или создаёт файл, если его не существовало.',
                context: 'Вы будете фиксировать прогресс обучения в дневнике.',
                command: 'touch проекты/дневник.md',
                alternatives: ['touch ./проекты/дневник.md'],
                response: 'Пустой файл «дневник.md» создан.\\n',
                hint: 'Используйте touch с относительным путём к каталогу.',
                success: 'Файл появился. Можно начинать вести записи.',
                explanation: 'touch удобно использовать для заготовки файлов. Он не открывает редактор, а лишь создаёт файл.'
            },
            {
                title: 'Проверить содержимое папки',
                description: 'Убедитесь, что в каталоге проекты есть нужные файлы.',
                learning: 'Можно вызывать ls с указанием относительного пути.',
                context: 'Проверяем, создался ли дневник и какие ещё файлы в папке.',
                command: 'ls проекты',
                alternatives: ['ls ./проекты'],
                response: 'дневник.md  план.sh  заметки.txt\\n',
                hint: 'Вызовите ls с именем каталога.',
                success: 'Каталог просмотрен, файлы на месте.',
                explanation: 'Перед переходом в каталог часто удобно просмотреть его содержимое через ls <путь>.'
            },
            {
                title: 'Прочитать миссию',
                description: 'Откройте текстовый файл миссия.txt в текущем каталоге.',
                learning: 'cat выводит содержимое файла прямо в терминал.',
                context: 'В файле лежат подсказки наставника по дальнейшим действиям.',
                command: 'cat миссия.txt',
                response: 'Чтобы открыть портал, изучи конфигурацию сервиса.\\n',
                hint: 'Подходит команда из coreutils для вывода текстовых файлов.',
                success: 'Подсказка получена. Вы готовы двигаться дальше.',
                explanation: 'cat полезно использовать для просмотра небольших файлов без запуска редактора.'
            }
        ]
    },
    {
        id: 'navigator',
        title: 'Файловый мастер',
        difficulty: 'Средний',
        summary: 'Научитесь уверенно копировать, перемещать и анализировать файлы.',
        skills: ['Копирование', 'Поиск', 'Чтение логов'],
        objectives: [
            'Практиковать копирование и перемещение между каталогами.',
            'Освоить анализ текстовых файлов с помощью head, tail и grep.',
            'Поддерживать порядок в рабочем окружении.'
        ],
        resources: [
            { label: 'man cp', url: 'https://man7.org/linux/man-pages/man1/cp.1.html', description: 'Параметры копирования файлов и каталогов.' },
            { label: 'The Linux Documentation Project — Text Utilities', url: 'https://tldp.org/LDP/abs/html/textproc.html', description: 'Обзор инструментов head, tail и прочих.' },
            { label: 'ExplainShell — grep', url: 'https://explainshell.com/explain?cmd=grep+-n+TODO+file', description: 'Пример поиска строк с номерами.' }
        ],
        tasks: [
            {
                title: 'Сделать резервную копию',
                description: 'Скопируйте файл дневника из каталога проекты в архив.',
                learning: 'cp принимает источник и путь назначения.',
                context: 'Перед изменениями стоит сохранить копию важных заметок.',
                command: 'cp проекты/дневник.md архив/дневник.md',
                alternatives: ['cp ./проекты/дневник.md ./архив/дневник.md'],
                response: 'Файл скопирован в каталог «архив».\\n',
                hint: 'Укажите путь к исходному файлу и папке назначения.',
                success: 'Резервная копия сохранена.',
                explanation: 'cp по умолчанию перезапишет файл назначения. Чтобы получать предупреждения, используйте ключ -i.'
            },
            {
                title: 'Обновить имя файла',
                description: 'Переименуйте план.sh в план_v2.sh внутри каталога проекты.',
                learning: 'mv перемещает и переименовывает файлы.',
                context: 'Новая версия плана требует обновить название.',
                command: 'mv проекты/план.sh проекты/план_v2.sh',
                response: 'Файл переименован на «план_v2.sh».\\n',
                hint: 'Используйте mv с исходным и новым путём.',
                success: 'Имя обновлено, легко отличить версию файла.',
                explanation: 'mv не создаёт копию, а переносит файл. С ключом -i можно предотвратить случайное перезаписывание.'
            },
            {
                title: 'Удалить лишнее',
                description: 'Удалите копию дневника из каталога архив.',
                learning: 'rm удаляет файлы. Будьте внимательны.',
                context: 'Архив занят, и ненужную копию можно убрать.',
                command: 'rm архив/дневник.md',
                response: 'Файл архив/дневник.md удалён.\\n',
                hint: 'Используйте rm с путём к файлу.',
                success: 'Каталог архив очищен от лишних копий.',
                explanation: 'Для каталогов используется rm -r, а для безопасного удаления можно добавить -i для подтверждения.'
            },
            {
                title: 'Оценить начало отчёта',
                description: 'Выведите первые три строки файла отчёт.log.',
                learning: 'head показывает начало файла, количество строк задаётся параметром -n.',
                context: 'Нужно быстро проверить заголовок отчёта.',
                command: 'head -n 3 отчёт.log',
                alternatives: ['head -3 отчёт.log'],
                response: '==> отчёт.log <==\\n1. Отчёт по сервису\\n2. Метрика SLA\\n3. Ошибки за неделю\\n',
                hint: 'Используйте head и передайте нужное количество строк.',
                success: 'Первые строки получены, можно сверить формат.',
                explanation: 'head -n NUM позволяет быстро просматривать начало больших логов без открытия всего файла.'
            },
            {
                title: 'Проверить хвост лога',
                description: 'Покажите последние пять строк файла отчёт.log.',
                learning: 'tail -n NUM отображает конец файла.',
                context: 'Нужно увидеть свежие записи ошибок.',
                command: 'tail -n 5 отчёт.log',
                alternatives: ['tail -5 отчёт.log'],
                response: '12. 2023-09-15 Ошибка авторизации\\n13. 2023-09-15 Повторный запуск\\n14. 2023-09-15 Статус ок\\n15. 2023-09-15 Ожидание проверки\\n16. 2023-09-15 Завершено успешно\\n',
                hint: 'Используйте tail и укажите количество строк.',
                success: 'Последние записи получены, можно анализировать инциденты.',
                explanation: 'tail полезен для мониторинга логов в реальном времени, особенно с опцией -f.'
            },
            {
                title: 'Найти TODO в скрипте',
                description: 'Найдите строки с пометкой TODO в файле план_v2.sh и покажите их номера.',
                learning: 'grep -n выводит номер строки вместе с совпадением.',
                context: 'Перед релизом нужно убедиться, что не осталось незакрытых задач.',
                matchers: [/^grep\s+-n\s+["']?TODO["']?\s+проекты\/план_v2\.sh$/],
                command: 'grep -n "TODO" проекты/план_v2.sh',
                response: '42:TODO: обновить инструкции по деплою\\n',
                hint: 'Используйте grep с ключом для отображения номеров строк.',
                success: 'TODO найдены, можно взять их в работу.',
                explanation: 'grep поддерживает регулярные выражения, а флаг -n добавляет номера строк для быстрого перехода к нужному месту.'
            }
        ]
    },
    {
        id: 'explorer',
        title: 'Системный исследователь',
        difficulty: 'Средний+',
        summary: 'Работаем с журналами, анализируем дисковое пространство и статистику.',
        skills: ['Поиск', 'Анализ логов', 'Диагностика'],
        objectives: [
            'Находить нужные файлы в глубине файловой системы.',
            'Отбирать сообщения об ошибках из журналов.',
            'Оценивать использование ресурсов сервера.'
        ],
        resources: [
            { label: 'man find', url: 'https://man7.org/linux/man-pages/man1/find.1.html', description: 'Гибкий поиск файлов по маскам и атрибутам.' },
            { label: 'Journalctl Cheatsheet', url: 'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/system_administrators_guide/ch-viewing_and_managing_log_files_with_journalctl', description: 'Работа с системными журналами.' },
            { label: 'Linuxize — du Command', url: 'https://linuxize.com/post/du-command-in-linux/', description: 'Как анализировать размер каталогов.' }
        ],
        tasks: [
            {
                title: 'Найти лог-файлы',
                description: 'Найдите все файлы с расширением .log в каталоге /var/log.',
                learning: 'find позволяет искать по имени и типу файла.',
                context: 'Нужно собрать список логов для дальнейшего анализа.',
                command: 'find /var/log -type f -name "*.log"',
                response: '/var/log/auth.log\\n/var/log/syslog\\n/var/log/nginx/access.log\\n...',
                hint: 'Используйте find с типом файла f и маской имени.',
                success: 'Список логов готов, можно фильтровать нужные файлы.',
                explanation: 'Команда find обходила каталоги рекурсивно, отбирая только файлы с расширением .log.'
            },
            {
                title: 'Вытянуть ошибки',
                description: 'Отфильтруйте строки с текстом error в файле /var/log/syslog без учёта регистра.',
                learning: 'grep -i ищет без учёта регистра.',
                context: 'Ищем ошибки приложения в системном журнале.',
                command: 'grep -i "error" /var/log/syslog',
                response: 'Sep 15 12:20:10 app kernel: ERROR: disk quota exceeded\\n...',
                hint: 'Воспользуйтесь grep с ключом для игнорирования регистра.',
                success: 'Ошибки найдены, можно приступать к разбору.',
                explanation: 'Флаг -i особенно полезен, когда в журнале встречаются варианты Error/ERROR/err.'
            },
            {
                title: 'Подсчитать строки',
                description: 'Подсчитайте количество строк в файле Документы/результаты.csv.',
                learning: 'wc -l выводит число строк.',
                context: 'Нужно узнать, сколько записей в отчётном файле.',
                command: 'wc -l Документы/результаты.csv',
                response: '128 Документы/результаты.csv\\n',
                hint: 'Используйте word count с ключом для строк.',
                success: 'Количество строк подсчитано.',
                explanation: 'wc полезно применять для оценки размера данных перед обработкой.'
            },
            {
                title: 'Оценить размер каталога',
                description: 'Покажите суммарный размер каталога /srv/data в удобочитаемом формате.',
                learning: 'du -h подсчитывает размер каталога и выводит его в удобных единицах.',
                context: 'Перед переносом данных нужно понимать объём хранилища.',
                command: 'du -h /srv/data',
                response: '1.5G\\t/srv/data\\n',
                hint: 'Используйте du и добавьте флаг human readable.',
                success: 'Размер посчитан, можно планировать перенос.',
                explanation: 'Флаг -h автоматически подбирает единицы измерения (K, M, G).'
            },
            {
                title: 'Проверить свободное место',
                description: 'Выведите сводку по свободному месту на дисках в человеко-читаемом виде.',
                learning: 'df -h показывает использование файловых систем.',
                context: 'Перед обновлением нужно убедиться, что есть место.',
                command: 'df -h',
                response: 'Файловая система Размер Использовано Дост Дост% Смонтировано в\\n/dev/sda1        40G     22G   17G    57% /\\n...',
                hint: 'Используйте df с флагом human readable.',
                success: 'Отчёт по дискам получен.',
                explanation: 'df -h помогает отслеживать заполненность дисков и предотвращать простои из-за нехватки места.'
            },
            {
                title: 'Отсортировать данные',
                description: 'Отсортируйте файл данные.txt и оставьте только уникальные строки.',
                learning: 'sort -u сортирует и удаляет дубликаты.',
                context: 'Готовим чистый список пользователей без повторов.',
                command: 'sort -u данные.txt',
                response: 'alex\\nirina\\npavel\\nsofia\\n',
                hint: 'Используйте sort с параметром unique.',
                success: 'Дубликаты убраны, список очищен.',
                explanation: 'sort -u совмещает сортировку и удаление повторов, что экономит время по сравнению с двумя командами.'
            }
        ]
    },
    {
        id: 'operator',
        title: 'Оператор сервисов',
        difficulty: 'Продвинутый',
        summary: 'Управляйте процессами, сервисами и пакетами на рабочем сервере.',
        skills: ['Процессы', 'Сервисы', 'Пакетный менеджер'],
        objectives: [
            'Научиться находить нужные процессы и анализировать их состояние.',
            'Управлять сервисами systemd и просматривать журналы.',
            'Обслуживать систему через пакетный менеджер.'
        ],
        resources: [
            { label: 'systemd Cheatsheet', url: 'https://access.redhat.com/articles/754933', description: 'Основные команды управления сервисами.' },
            { label: 'Ubuntu Packages — Руководство', url: 'https://help.ubuntu.com/lts/serverguide/apt.html', description: 'Работа с apt и обновлениями.' },
            { label: 'ps, top, htop — сравнение', url: 'https://linoxide.com/linux-command-ps-top-htop/', description: 'Когда использовать ps aux и интерактивные утилиты.' }
        ],
        tasks: [
            {
                title: 'Найти процесс nginx',
                description: 'Выведите строку из списка процессов, содержащую nginx.',
                learning: 'Команда ps aux показывает процессы, grep отбирает нужные.',
                context: 'Нужно убедиться, что сервис веб-сервера запущен.',
                matchers: [/^ps\s+aux\s*\|\s*grep\s+nginx$/],
                command: 'ps aux | grep nginx',
                response: 'www-data  2145  0.2  1.3  85632  4236 ?  Ss  10:20   0:00 nginx: master process\\n',
                hint: 'Скомбинируйте ps aux с фильтрацией по имени процесса.',
                success: 'Процесс найден. Можно проверить его статус подробнее.',
                explanation: 'Комбинация ps aux | grep <имя> — быстрый способ найти PID. Чтобы исключить сам grep, добавляют | grep -v grep.'
            },
            {
                title: 'Проверить статус сервиса',
                description: 'Посмотрите текущее состояние службы nginx через systemd.',
                learning: 'systemctl status отображает логи и активность сервиса.',
                context: 'Убедитесь, что сервис активен перед обновлением конфигураций.',
                command: 'systemctl status nginx',
                response: '● nginx.service - A high performance web server and a reverse proxy server\\n   Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\\n   Active: active (running)\\n...',
                hint: 'Используйте systemctl с подкомандой status.',
                success: 'Статус изучен, сервис в рабочем состоянии.',
                explanation: 'systemctl status отображает последние строки журнала и текущее состояние (active, failed и т.д.).'
            },
            {
                title: 'Перезапустить nginx',
                description: 'Перезапустите сервис nginx с правами администратора.',
                learning: 'Для управления системными службами часто требуется sudo.',
                context: 'Применяем новую конфигурацию, нужно перезапустить сервис.',
                command: 'sudo systemctl restart nginx',
                response: 'Процесс перезапуска инициирован.\\n',
                hint: 'Используйте systemctl restart с повышенными правами.',
                success: 'nginx перезапущен, изменения вступили в силу.',
                explanation: 'restart перезапускает службу, не дожидаясь полного остановки, что полезно после обновления конфигурации.'
            },
            {
                title: 'Просмотреть недавний журнал',
                description: 'Выведите журнал сервиса nginx за последние 10 минут.',
                learning: 'journalctl позволяет фильтровать логи по времени и юниту.',
                context: 'Нужно найти ошибки при последнем перезапуске.',
                command: 'journalctl -u nginx --since "10 minutes ago"',
                alternatives: ['journalctl -u nginx --since "10 minutes ago"'],
                response: '-- Logs begin at ... --\\nSep 15 10:22:11 server systemd[1]: Reloading A high performance web server...\\n...',
                hint: 'Используйте journalctl с фильтрацией по юниту и времени.',
                success: 'Журнал собран, можно анализировать ошибки.',
                explanation: 'Параметр --since принимает читаемые значения времени, например "1 hour ago".'
            },
            {
                title: 'Обновить индексы пакетов',
                description: 'Обновите локальный кэш пакетов APT.',
                learning: 'sudo apt update скачивает свежие списки пакетов.',
                context: 'Перед установкой обновлений нужно освежить индекс.',
                command: 'sudo apt update',
                response: 'Получено:1 http://archive.ubuntu.com jammy InRelease\\nЧтение списков пакетов... Готово\\n',
                hint: 'Запустите apt с подкомандой update от имени администратора.',
                success: 'Индексы обновлены.',
                explanation: 'Без свежего индекса apt может не найти последнюю версию пакета.'
            },
            {
                title: 'Установить веб-сервер',
                description: 'Установите пакет nginx через APT.',
                learning: 'sudo apt install <пакет> устанавливает и подтягивает зависимости.',
                context: 'Готовим тестовый сервер для деплоя приложения.',
                command: 'sudo apt install nginx',
                response: 'Чтение списков пакетов... Готово\\nПостроение дерева зависимостей... Готово\\n',
                hint: 'Используйте apt install с именем пакета.',
                success: 'Пакет установлен. Сервис готов к настройке.',
                explanation: 'apt установит пакет и при необходимости попросит подтверждение. Можно добавить -y для автоматического согласия.'
            }
        ]
    },
    {
        id: 'devops',
        title: 'DevOps-инженер',
        difficulty: 'Эксперт',
        summary: 'Погружаемся в инструменты доставки: Git, контейнеры и автоматизация.',
        skills: ['Git', 'Контейнеры', 'Автоматизация'],
        objectives: [
            'Контролировать состояние репозитория и веток.',
            'Работать с контейнерами Docker и docker compose.',
            'Запускать инфраструктурные плейбуки.'
        ],
        resources: [
            { label: 'Pro Git — Основы', url: 'https://git-scm.com/book/ru/v2', description: 'Официальная книга по Git.' },
            { label: 'Docker Docs — docker compose', url: 'https://docs.docker.com/compose/', description: 'Запуск многоконтейнерных приложений.' },
            { label: 'Ansible Documentation — Playbooks', url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html', description: 'Создание и запуск Ansible-плейбуков.' }
        ],
        tasks: [
            {
                title: 'Проверить репозиторий',
                description: 'Убедитесь, что в рабочем каталоге нет незакоммиченных изменений.',
                learning: 'git status показывает текущее состояние и активную ветку.',
                context: 'Перед деплоем важно убедиться в чистоте репозитория.',
                command: 'git status',
                response: 'On branch main\\nnothing to commit, working tree clean\\n',
                hint: 'Вызовите git с подкомандой status.',
                success: 'Рабочее дерево чистое, можно продолжать.',
                explanation: 'git status помогает быстро понять, есть ли изменения, требующие внимания.'
            },
            {
                title: 'Подтянуть изменения',
                description: 'Синхронизируйте локальную ветку main с удалённой origin/main.',
                learning: 'git pull origin main скачает и смержит изменения.',
                context: 'Нужно получить последние коммиты коллег перед сборкой.',
                command: 'git pull origin main',
                response: 'From github.com:linuxquest/app\\n * branch            main       -> FETCH_HEAD\\nУже обновлено.\\n',
                hint: 'Используйте git pull и укажите удалённый репозиторий и ветку.',
                success: 'Репозиторий синхронизирован.',
                explanation: 'git pull объединяет fetch и merge. На проде часто используют rebase (--rebase) для линейной истории.'
            },
            {
                title: 'Создать новую ветку',
                description: 'Создайте ветку release/v1.2 на основе текущей ветки.',
                learning: 'git checkout -b создаёт и переключается на новую ветку.',
                context: 'Готовим релизную ветку для выпуска версии 1.2.',
                command: 'git checkout -b release/v1.2',
                response: 'Switched to a new branch \\'release/v1.2\\'\\n',
                hint: 'Используйте checkout с ключом -b и именем ветки.',
                success: 'Новая ветка создана и активна.',
                explanation: 'checkout -b создаёт ветку от текущего состояния. В Git 2.23+ можно использовать git switch -c.'
            },
            {
                title: 'Проверить контейнеры',
                description: 'Выведите список запущенных Docker-контейнеров.',
                learning: 'docker ps показывает активные контейнеры.',
                context: 'Нужно убедиться, что сервисы кластера работают.',
                command: 'docker ps',
                response: 'CONTAINER ID   IMAGE          COMMAND                  STATUS          NAMES\\n4c3b1c2d9f1e   app:latest    "./start.sh"             Up 2 hours      app_web_1\\n',
                hint: 'Используйте docker с подкомандой ps.',
                success: 'Контейнеры проверены, сервисы активны.',
                explanation: 'Без параметров docker ps показывает только запущенные контейнеры. Добавьте -a, чтобы увидеть остановленные.'
            },
            {
                title: 'Запустить стек compose',
                description: 'Поднимите сервисы в фоне с помощью docker compose.',
                learning: 'docker compose up -d собирает и запускает сервисы без блокировки терминала.',
                context: 'Готовим окружение разработчика.',
                command: 'docker compose up -d',
                alternatives: ['docker-compose up -d'],
                response: '[+] Running 3/3\\n ✔ Network app_default      Created\\n ✔ Container app_db_1       Started\\n ✔ Container app_web_1      Started\\n',
                hint: 'Используйте современный синтаксис docker compose с флагом фонового запуска.',
                success: 'Стек запущен, окружение готово.',
                explanation: 'В новых версиях Docker используется команда docker compose, а не отдельный бинарник docker-compose.'
            },
            {
                title: 'Выполнить плейбук',
                description: 'Запустите Ansible-плейбук deploy.yml.',
                learning: 'ansible-playbook выполняет описанные задачи на выбранных хостах.',
                context: 'Нужно задеплоить обновление на staging.',
                command: 'ansible-playbook deploy.yml',
                response: 'PLAY [Deploy application] ************************************************\\nTASK [Gathering Facts] ***************************************************\\nok: [staging]\\n...',
                hint: 'Используйте ansible-playbook и укажите файл плейбука.',
                success: 'Плейбук выполнен, инфраструктура обновлена.',
                explanation: 'ansible-playbook читает инвентарь и задачи из YAML. Добавьте --check для прогона без изменений.'
            }
        ]
    },
    {
        id: 'security',
        title: 'Безопасность и доступ',
        difficulty: 'Эксперт+',
        summary: 'Защитите инфраструктуру: SSH, firewall и мониторинг вторжений.',
        skills: ['SSH', 'Firewall', 'Мониторинг'],
        objectives: [
            'Настраивать безопасный удалённый доступ.',
            'Ограничивать порты и сервисы через UFW.',
            'Контролировать попытки взлома и защищать ключи.'
        ],
        resources: [
            { label: 'OpenSSH Manual', url: 'https://man.openbsd.org/ssh', description: 'Описание параметров клиента SSH.' },
            { label: 'Ubuntu Docs — UFW', url: 'https://help.ubuntu.com/community/UFW', description: 'Настройка встроенного файервола.' },
            { label: 'Fail2ban Wiki', url: 'https://github.com/fail2ban/fail2ban/wiki', description: 'Мониторинг и блокировка подозрительных подключений.' }
        ],
        tasks: [
            {
                title: 'Подключиться по SSH',
                description: 'Установите SSH-сессию к серверу по адресу 10.0.0.5 под пользователем admin.',
                learning: 'ssh user@host устанавливает удалённое соединение.',
                context: 'Вам нужно подключиться к серверу мониторинга.',
                command: 'ssh admin@10.0.0.5',
                response: 'Welcome to Ubuntu 22.04.2 LTS (GNU/Linux 5.15.0-71-generic x86_64)\\n',
                hint: 'Используйте ssh и укажите пользователя вместе с адресом.',
                success: 'Подключение установлено.',
                explanation: 'SSH шифрует соединение и проверяет ключи хоста. При первом подключении появится предупреждение о доверии.'
            },
            {
                title: 'Передать архив',
                description: 'Скопируйте файл backup.tar.gz на сервер в каталог /backups/.',
                learning: 'scp user@host:path копирует файлы по SSH.',
                context: 'Нужно загрузить резервную копию на удалённый сервер.',
                command: 'scp backup.tar.gz admin@10.0.0.5:/backups/',
                response: 'backup.tar.gz                                100%  256MB  12MB/s   00:21\\n',
                hint: 'Используйте scp с указанием локального файла и удалённого пути.',
                success: 'Архив передан безопасно.',
                explanation: 'scp использует тот же канал SSH, что и ssh. Для директорий применяют scp -r или rsync.'
            },
            {
                title: 'Разрешить SSH в файерволе',
                description: 'Откройте порт для SSH в UFW.',
                learning: 'sudo ufw allow ssh добавляет правило для порта 22.',
                context: 'Готовим сервер к удалённому администрированию.',
                command: 'sudo ufw allow ssh',
                response: 'Правило добавлено\\nПравило добавлено (v6)\\n',
                hint: 'Используйте ufw allow с именем сервиса.',
                success: 'Правило добавлено, SSH доступен.',
                explanation: 'UFW понимает имена служб из /etc/services. Можно указывать и номера портов.'
            },
            {
                title: 'Включить UFW',
                description: 'Активируйте UFW, чтобы правила начали действовать.',
                learning: 'sudo ufw enable включает файервол и подтверждает действие.',
                context: 'После настройки правил нужно активировать защиту.',
                command: 'sudo ufw enable',
                response: 'Команда может нарушить существующие ssh-подключения. Продолжить выполнение операции (y|n)? y\\nФайрвол активирован и будет запускаться при загрузке системы.\\n',
                hint: 'Запустите ufw enable с правами администратора.',
                success: 'Файервол активирован.',
                explanation: 'Перед включением UFW важно убедиться, что есть правило для SSH, иначе соединение оборвётся.'
            },
            {
                title: 'Проверить Fail2ban',
                description: 'Посмотрите статус jail sshd в Fail2ban.',
                learning: 'fail2ban-client status <jail> показывает статистику блокировок.',
                context: 'Нужно убедиться, что защита от брутфорса активна.',
                command: 'sudo fail2ban-client status sshd',
                response: 'Status for the jail: sshd\\n|- Filter\\n|  |- Currently failed: 0\\n|  `- Total failed: 5\\n`- Actions\\n   |- Currently banned: 1\\n   `- Total banned: 3\\n',
                hint: 'Используйте fail2ban-client с подкомандой status и именем jail.',
                success: 'Fail2ban работает и отслеживает попытки входа.',
                explanation: 'Fail2ban блокирует IP-адреса с множественными ошибками входа, уменьшая риск брутфорса.'
            },
            {
                title: 'Защитить приватный ключ',
                description: 'Установите на приватный SSH-ключ права только для владельца.',
                learning: 'chmod 600 закрывает доступ к файлу для группы и других пользователей.',
                context: 'SSH-клиент требует строгих прав на приватный ключ.',
                command: 'chmod 600 ~/.ssh/id_rsa',
                response: 'Права доступа к ~/.ssh/id_rsa обновлены.\\n',
                hint: 'Используйте chmod с числовым режимом для владельца.',
                success: 'Ключ защищён, SSH не будет ругаться на права.',
                explanation: 'chmod 600 означает rw-------. Без этого ssh может отказать в использовании ключа.'
            }
        ]
    }
];

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

missions.forEach(mission => {
    mission.tasks.forEach(task => {
        task.completed = Boolean(task.completed);
    });
});

function normalizeCommand(value) {
    return value.replace(/\s+/g, ' ').trim();
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
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn('Не удалось очистить прогресс', error);
    }
    renderLevels();
    renderTask();
    updateOverallProgress();
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
}

function renderTask() {
    ensureActiveTask();
    const mission = missions[state.levelIndex];
    if (!mission) return;
    const task = mission.tasks[state.taskIndex];
    if (!task) return;
    missionTitle.textContent = `${mission.title}: ${task.title}`;
    missionDescription.innerHTML = buildTaskDescription(task);
    terminalOutput.textContent = '';
    commandInput.value = '';
    commandInput.focus();
    updateMissionMeta();
    renderTasksList();
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

    appendTerminal(value, 'input');
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
        persistState();
        updateMissionProgress();
        updateOverallProgress();

        const nextIndex = mission.tasks.findIndex(t => !t.completed);
        if (nextIndex !== -1) {
            state.taskIndex = nextIndex;
            setTimeout(renderTask, 600);
        } else {
            appendTerminal(`Уровень «${mission.title}» завершён!`);
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
        appendTerminal(`Команда «${value}» не подходит. Попробуйте ещё раз.`);
        log(`Ошибка команды для задания «${task.title}».`);
    }

    commandInput.value = '';
    commandInput.focus();
});

hintBtn.addEventListener('click', () => {
    const mission = missions[state.levelIndex];
    if (!mission) return;
    const task = mission.tasks[state.taskIndex];
    if (!task) return;
    appendTerminal(`Подсказка: ${task.hint}`);
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
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', resetProgress);
}

loadProgress();
renderLevels();
renderTask();
updateOverallProgress();
log('Добро пожаловать в Linux Quest! Выберите задание и начинайте практику.');
