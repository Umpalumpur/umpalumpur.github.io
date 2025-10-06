window.linuxQuestMissions = [
    {
        id: 'foundation',
        title: 'Новичок',
        difficulty: 'Лёгкий',
        summary: 'Освойте навигацию, работу с файлами и первую документацию.',
        skills: ['Навигация', 'Файлы', 'Документация'],
        objectives: [
            'Уверенно перемещаться по файловой системе.',
            'Создавать и наполнять рабочие файлы.',
            'Читать справку и фиксировать подсказки наставника.'
        ],
        resources: [
            {
                label: 'Linux Journey — Навигация',
                url: 'https://linuxjourney.com/lesson/navigation',
                description: 'Раздел с базовыми командами перемещения.'
            },
            {
                label: 'ExplainShell — базовые команды',
                url: 'https://explainshell.com/',
                description: 'Разбор синтаксиса команд и ключей.'
            },
            {
                label: 'GNU Coreutils',
                url: 'https://www.gnu.org/software/coreutils/manual/',
                description: 'Полная документация по утилитам оболочки.'
            }
        ],
        tasks: [
            {
                title: 'Кто у пульта?',
                description: 'Узнайте, под каким пользователем вы вошли в систему.',
                learning: 'Команда whoami печатает имя текущего пользователя.',
                context: 'Наставник просит убедиться, что вы работаете не из-под root.',
                command: 'whoami',
                response: 'Подтверждение личности получено.',
                success: 'Отлично, работаем под обычным пользователем — так безопаснее.',
                explanation: 'Команда whoami удобна перед выполнением действий, требующих повышенных прав.',
                hintKey: 'whoami'
            },
            {
                title: 'Где ты стоишь?',
                description: 'Определите текущий абсолютный путь рабочего каталога.',
                learning: 'pwd показывает полный путь от корня файловой системы.',
                context: 'Перед тем как строить папки, нужно знать отправную точку.',
                command: 'pwd',
                response: 'Ориентиры совпали с журналом наставника.',
                success: 'Вы определили точку старта — можно строить маршрут.',
                explanation: 'pwd помогает не потеряться даже в глубоко вложенных каталогах.',
                hintKey: 'pwd'
            },
            {
                title: 'Раскрыть спрятанные вещи',
                description: 'Выведите список видимых и скрытых файлов в домашнем каталоге.',
                learning: 'ls -a показывает элементы, начинающиеся с точки.',
                context: 'Некоторые подсказки наставник прячет в скрытых файлах.',
                command: 'ls -a',
                response: 'Домашняя директория обследована от корня до точки.',
                success: 'Вы видите полный состав каталога — даже спрятанные конфиги.',
                explanation: 'Флаг -a добавляет в вывод . и .. и показывает конфигурационные файлы.',
                hintKey: 'ls -a'
            },
            {
                title: 'Построить мастерскую',
                description: 'Создайте каталог «проекты» для будущих упражнений.',
                learning: 'mkdir создаёт директории по указанному пути.',
                context: 'Нужно подготовить площадку для учебных файлов.',
                command: 'mkdir проекты',
                alternatives: ['mkdir ./проекты'],
                response: 'Каркас мастерской готов.',
                success: 'Каталог создан — можно наполнять его материалами.',
                explanation: 'При необходимости создавайте сразу несколько уровней через mkdir -p.',
                hintKey: 'mkdir'
            },
            {
                title: 'Открыть дневник',
                description: 'Создайте пустой файл дневника в каталоге проекты.',
                learning: 'touch создаёт файл или обновляет время последнего изменения.',
                context: 'Вы будете фиксировать прогресс обучения.',
                command: 'touch проекты/дневник.md',
                alternatives: ['touch ./проекты/дневник.md'],
                response: 'Чистый лист для заметок появился.',
                success: 'Дневник создан — можно делать первые записи.',
                explanation: 'touch незаменим, когда нужно быстро подготовить файл.',
                hintKey: 'touch'
            },
            {
                title: 'Записать первую мысль',
                description: 'Добавьте строку «День первый: стартую» в дневник.',
                learning: 'echo с перенаправлением >> дописывает текст в конец файла.',
                context: 'Наставник просил фиксировать каждый шаг обучения.',
                command: 'echo "День первый: стартую" >> проекты/дневник.md',
                alternatives: ['echo "День первый: стартую" >> ./проекты/дневник.md'],
                response: 'Фраза о начале пути занесена в дневник.',
                success: 'Отлично! Первая запись закрепила привычку вести заметки.',
                explanation: 'Перенаправление >> добавляет данные, не стирая существующее содержимое.',
                hintKey: 'echo >>'
            },
            {
                title: 'Проверить запасы',
                description: 'Убедитесь, что в каталоге проекты лежат нужные файлы.',
                learning: 'ls с указанием пути показывает содержимое каталога.',
                context: 'Перед переходом внутрь оценим, что уже создано.',
                command: 'ls проекты',
                alternatives: ['ls ./проекты'],
                response: 'Инвентаризация завершена.',
                success: 'Файлы на месте — можно продолжать настройку.',
                explanation: 'ls путь полезно использовать перед cd, чтобы не заходить вслепую.',
                hintKey: 'ls dir'
            },
            {
                title: 'Шаг внутрь мастерской',
                description: 'Перейдите в каталог проекты.',
                learning: 'cd меняет текущий рабочий каталог.',
                context: 'Чтобы продолжить работу с файлами, нужно оказаться внутри.',
                command: 'cd проекты',
                response: 'Вы сделали шаг внутрь мастерской.',
                success: 'Теперь терминал смотрит прямо на содержимое проектов.',
                explanation: 'Команда cd без аргументов вернёт домой, а cd - к предыдущему каталогу.',
                hintKey: 'cd into'
            },
            {
                title: 'Изучить детали',
                description: 'Посмотрите длинный список файлов внутри проектов.',
                learning: 'ls -l показывает права, владельца и размер.',
                context: 'Нужно оценить права доступа и свежесть файлов.',
                command: 'ls -l',
                response: 'Права и размеры файлов зафиксированы.',
                success: 'Хорошо: вы видите владельцев и даты изменения.',
                explanation: 'Флаг -l полезен, когда важно проверить права и размеры.',
                hintKey: 'ls -l'
            },
            {
                title: 'Вернуться домой',
                description: 'Поднимитесь на уровень вверх в домашний каталог.',
                learning: 'cd .. перемещает в родительскую директорию.',
                context: 'После настройки проекта нужно вернуться к заданиям наставника.',
                command: 'cd ..',
                response: 'Вы вернулись в лагерь кадетов.',
                success: 'Домашний каталог снова активен.',
                explanation: 'Комбинируйте cd .., чтобы быстро выйти из глубоко вложенных директорий.',
                hintKey: 'cd up'
            },
            {
                title: 'Прочитать миссию',
                description: 'Откройте файл миссия.txt в домашней директории.',
                learning: 'cat выводит содержимое текстового файла.',
                context: 'В записке наставник спрятал дальнейшие указания.',
                command: 'cat миссия.txt',
                response: 'Записка наставника прочитана.',
                success: 'Вы получили инструкцию к следующему этапу.',
                explanation: 'cat полезен для небольших файлов, когда не нужен полноценный редактор.',
                hintKey: 'cat'
            },
            {
                title: 'Заглянуть в справочник',
                description: 'Откройте страницу руководства для команды ls.',
                learning: 'man показывает документацию по командам.',
                context: 'Справочник пригодится, когда ключи начнут путаться.',
                command: 'man ls',
                response: 'Справочник раскрыт и под рукой.',
                success: 'Вы умеете открывать встроенную документацию — важный навык профессионала.',
                explanation: 'Из man можно выйти клавишей q. Справочник подсказывает все ключи команды.',
                hintKey: 'man'
            }
        ]
    },
    {
        id: 'navigator',
        title: 'Файловый мастер',
        difficulty: 'Средний',
        summary: 'Учимся уверенно копировать, архивировать и анализировать тексты.',
        skills: ['Копирование', 'Поиск', 'Фильтрация'],
        objectives: [
            'Практиковать копирование и переименование.',
            'Анализировать логи и сценарии разработки.',
            'Подготавливать архивы и отчёты из данных.'
        ],
        resources: [
            {
                label: 'man cp',
                url: 'https://man7.org/linux/man-pages/man1/cp.1.html',
                description: 'Подробности о копировании файлов и каталогов.'
            },
            {
                label: 'Linuxize — tar',
                url: 'https://linuxize.com/post/how-to-create-tar-gz-file/',
                description: 'Создание и распаковка архивов tar.gz.'
            },
            {
                label: 'ExplainShell — grep',
                url: 'https://explainshell.com/explain?cmd=grep+-n+TODO+file',
                description: 'Как искать текстовые совпадения и номера строк.'
            }
        ],
        tasks: [
            {
                title: 'Сделать резервную копию',
                description: 'Скопируйте дневник в каталог архив.',
                learning: 'cp принимает путь источника и назначения.',
                context: 'Перед редактированием всегда делайте резервную копию.',
                command: 'cp проекты/дневник.md архив/дневник.md',
                alternatives: ['cp ./проекты/дневник.md ./архив/дневник.md'],
                response: 'Резервная копия лежит в архиве.',
                success: 'Запасной экземпляр дневника сохранён.',
                explanation: 'Ключи -i или -n помогут избежать случайной перезаписи.',
                hintKey: 'cp'
            },
            {
                title: 'Переименовать план',
                description: 'Переименуйте план.sh в план_v2.sh.',
                learning: 'mv переименовывает и перемещает файлы.',
                context: 'Обновлённый план должен отличаться от черновика.',
                command: 'mv проекты/план.sh проекты/план_v2.sh',
                response: 'Имя файла обновлено до версии v2.',
                success: 'План теперь отражает актуальную версию.',
                explanation: 'mv без параметров заменяет файл назначения, если тот существует.',
                hintKey: 'mv'
            },
            {
                title: 'Посмотреть начало отчёта',
                description: 'Выведите первые три строки файла отчёт.log.',
                learning: 'head -n NUM показывает начало файла.',
                context: 'Нужно сверить формат заголовка.',
                command: 'head -n 3 отчёт.log',
                response: 'Заголовок отчёта изучен.',
                success: 'Первые строки проверены — формат в порядке.',
                explanation: 'head без параметров покажет первые 10 строк, но лучше задавать точное число.',
                hintKey: 'head'
            },
            {
                title: 'Проверить хвост лога',
                description: 'Покажите последние пять строк файла отчёт.log.',
                learning: 'tail -n NUM выводит конец файла.',
                context: 'Актуальные ошибки всегда в хвосте.',
                command: 'tail -n 5 отчёт.log',
                response: 'Последние записи получены.',
                success: 'Теперь видно, чем завершился отчёт.',
                explanation: 'tail -f позволяет следить за логом в реальном времени.',
                hintKey: 'tail'
            },
            {
                title: 'Найти TODO в скрипте',
                description: 'Отобразите строки с TODO и их номера в план_v2.sh.',
                learning: 'grep -n выводит совпадения с номерами строк.',
                context: 'Перед релизом надо проверить незакрытые задачи.',
                command: 'grep -n "TODO" проекты/план_v2.sh',
                response: 'Незакрытые пункты подсвечены.',
                success: 'TODO найдено — можно брать его в работу.',
                explanation: 'Используйте ключ -n, чтобы сразу перейти к нужной строке в редакторе.',
                hintKey: 'grep -n'
            },
            {
                title: 'Посчитать TODO',
                description: 'Подсчитайте количество TODO в файле план_v2.sh.',
                learning: 'grep -c считает число совпадений.',
                context: 'Важно знать, сколько задач осталось несделанными.',
                command: 'grep -c "TODO" проекты/план_v2.sh',
                response: 'Количество незакрытых задач зафиксировано.',
                success: 'Теперь ясно, сколько пунктов требует внимания.',
                explanation: 'С флагом -i команда ищет без учёта регистра.',
                hintKey: 'grep -c'
            },
            {
                title: 'Запаковать проекты',
                description: 'Создайте архив проектов в формате tar.gz.',
                learning: 'tar -czf упаковывает каталог и сжимает его.',
                context: 'Нужно подготовить архив для отправки наставнику.',
                command: 'tar -czf архив/проекты.tar.gz проекты',
                response: 'Архив с проектами готов.',
                success: 'Каталог упакован и ждёт переноса.',
                explanation: 'Ключ -c создаёт архив, -z сжимает через gzip, -f задаёт имя файла.',
                hintKey: 'tar'
            },
            {
                title: 'Извлечь имена студентов',
                description: 'Выведите первый столбец из результатов CSV.',
                learning: 'cut -d задаёт разделитель, -f — номер поля.',
                context: 'Нужно составить список участников без лишних данных.',
                command: 'cut -d, -f1 Документы/результаты.csv',
                response: 'Список имён собран.',
                success: 'Получили чистый перечень студентов.',
                explanation: 'Символ разделителя должен совпадать с используемым в файле.',
                hintKey: 'cut'
            },
            {
                title: 'Очистить архив',
                description: 'Удалите временную копию дневника из архива.',
                learning: 'rm удаляет файлы без перемещения в корзину.',
                context: 'После упаковки лишняя копия больше не нужна.',
                command: 'rm архив/дневник.md',
                response: 'Архив освобождён от временного файла.',
                success: 'Хранилище приведено в порядок.',
                explanation: 'Используйте rm -i, если хотите подтверждать удаление.',
                hintKey: 'rm'
            }
        ]
    },
    {
        id: 'explorer',
        title: 'Системный исследователь',
        difficulty: 'Средний+',
        summary: 'Диагностируем журналы, считаем объёмы и ищем закономерности.',
        skills: ['Диагностика', 'Поиск', 'Оптимизация'],
        objectives: [
            'Находить нужные файлы в глубине системы.',
            'Извлекать ключевые события из логов.',
            'Оценивать объём данных и очищать дубликаты.'
        ],
        resources: [
            {
                label: 'man find',
                url: 'https://man7.org/linux/man-pages/man1/find.1.html',
                description: 'Руководство по мощному поиску файлов.'
            },
            {
                label: 'Linuxize — du',
                url: 'https://linuxize.com/post/du-command-in-linux/',
                description: 'Подсчёт размера каталогов в человеко-читаемом виде.'
            },
            {
                label: 'The Linux Documentation Project — Text Utilities',
                url: 'https://tldp.org/LDP/abs/html/textproc.html',
                description: 'Обзор текстовых инструментов: grep, sort, uniq и другие.'
            }
        ],
        tasks: [
            {
                title: 'Найти журналы',
                description: 'Найдите все файлы с расширением .log в /var/log.',
                learning: 'find -type f -name ищет файлы по маске.',
                context: 'Нужно собрать список журналов для анализа.',
                command: 'find /var/log -type f -name "*.log"',
                response: 'Список логов собран.',
                success: 'Вы быстро нашли все логи для проверки.',
                explanation: 'find рекурсивно обходит каталоги и фильтрует по маске.',
                hintKey: 'find log'
            },
            {
                title: 'Отфильтровать ошибки',
                description: 'Выведите строки с error в syslog без учёта регистра.',
                learning: 'grep -i игнорирует регистр символов.',
                context: 'Ошибки могут быть записаны в разном регистре — важно не пропустить.',
                command: 'grep -i "error" /var/log/syslog',
                response: 'Ошибки из syslog собраны.',
                success: 'Нужные сообщения выделены, можно разбирать инцидент.',
                explanation: 'Флаг -i находит совпадения независимо от регистра.',
                hintKey: 'grep -i'
            },
            {
                title: 'Сосчитать записи',
                description: 'Подсчитайте количество строк в файле результаты.csv.',
                learning: 'wc -l возвращает число строк.',
                context: 'Нужно оценить объём отчёта перед обработкой.',
                command: 'wc -l Документы/результаты.csv',
                response: 'Количество строк занесено в журнал.',
                success: 'Вы знаете точный объём данных.',
                explanation: 'wc пригодится для проверки результатов конвейеров.',
                hintKey: 'wc -l'
            },
            {
                title: 'Измерить каталог',
                description: 'Покажите размер /srv/data в удобочитаемом формате.',
                learning: 'du -h оценивает объём каталога.',
                context: 'Перед переносом нужно понимать, сколько места потребуется.',
                command: 'du -h /srv/data',
                response: 'Объём каталога измерен.',
                success: 'Размер данных известен — можно планировать миграцию.',
                explanation: 'С флагом -s команда покажет только суммарный размер.',
                hintKey: 'du'
            },
            {
                title: 'Проверить диски',
                description: 'Выведите сводку свободного места на дисках.',
                learning: 'df -h показывает использование файловых систем.',
                context: 'Перед обновлением убедитесь, что хватит места.',
                command: 'df -h',
                response: 'Сводка по дискам отображена.',
                success: 'Вы знаете, какие разделы заполнены больше всего.',
                explanation: 'df -h помогает вовремя заметить переполнение.',
                hintKey: 'df'
            },
            {
                title: 'Упорядочить данные',
                description: 'Отсортируйте файл данные.txt и удалите дубликаты.',
                learning: 'sort -u сортирует и оставляет только уникальные строки.',
                context: 'Готовим чистый список пользователей.',
                command: 'sort -u данные.txt',
                response: 'Список очищен от повторов.',
                success: 'Уникальные значения отсортированы.',
                explanation: 'sort -u объединяет сортировку и удаление дубликатов.',
                hintKey: 'sort -u'
            },
            {
                title: 'Поиск Markdown заметок',
                description: 'Найдите все markdown-файлы в каталоге проектов на один уровень глубины.',
                learning: 'find с -maxdepth ограничивает глубину поиска.',
                context: 'Нужно собрать только заметки верхнего уровня.',
                command: 'find ~/проекты -maxdepth 1 -type f -name "*.md"',
                response: 'Markdown-файлы отмечены в списке.',
                success: 'Вы выделили все заметки для обзора.',
                explanation: 'Символ ~ раскрывается в домашний каталог пользователя.',
                hintKey: 'find markdown'
            },
            {
                title: 'Распознать TODO во всех подпапках',
                description: 'Найдите строки с TODO во всех файлах проекта рекурсивно.',
                learning: 'grep -R обходит каталог рекурсивно.',
                context: 'Важно убедиться, что не осталось незакрытых задач.',
                command: 'grep -R "TODO" проекты',
                response: 'Все TODO подсвечены.',
                success: 'Список незавершённых пунктов собран со всех файлов.',
                explanation: 'Сочетайте -n и -R, чтобы знать и файл, и номер строки.',
                hintKey: 'grep -R'
            }
        ]
    },
    {
        id: 'operator',
        title: 'Оператор сервисов',
        difficulty: 'Продвинутый',
        summary: 'Управляем процессами, сервисами и пакетами на сервере.',
        skills: ['Процессы', 'Сервисы', 'Пакеты'],
        objectives: [
            'Находить и анализировать процессы.',
            'Управлять службами systemd и журналами.',
            'Обслуживать систему пакетным менеджером.'
        ],
        resources: [
            {
                label: 'systemd Cheatsheet',
                url: 'https://access.redhat.com/articles/754933',
                description: 'Быстрая шпаргалка по systemctl.'
            },
            {
                label: 'Ubuntu Server Guide — APT',
                url: 'https://help.ubuntu.com/lts/serverguide/apt.html',
                description: 'Основы работы с пакетным менеджером APT.'
            },
            {
                label: 'ps, top, htop — сравнение',
                url: 'https://linoxide.com/linux-command-ps-top-htop/',
                description: 'Когда какой инструмент пригодится.'
            }
        ],
        tasks: [
            {
                title: 'Найти процесс nginx',
                description: 'Выведите строку из списка процессов, содержащую nginx.',
                learning: 'ps aux показывает все процессы, grep фильтрует результат.',
                context: 'Нужно убедиться, что веб-сервер активен.',
                command: 'ps aux | grep nginx',
                response: 'Строка с процессом найдена.',
                success: 'Вы нашли нужный процесс и его PID.',
                explanation: 'Добавьте | grep -v grep, чтобы убрать сам процесс grep из выдачи.',
                hintKey: 'ps grep'
            },
            {
                title: 'Проверить статус сервиса',
                description: 'Посмотрите текущее состояние службы nginx.',
                learning: 'systemctl status показывает статус и последние журналы.',
                context: 'Перед изменениями нужно удостовериться в состоянии сервиса.',
                command: 'systemctl status nginx',
                response: 'Статус службы просмотрен.',
                success: 'Служба проверена — можно принимать решение.',
                explanation: 'systemctl status показывает логи последних запусков и текущий статус.',
                hintKey: 'systemctl status'
            },
            {
                title: 'Перезапустить nginx',
                description: 'Перезапустите сервис nginx с правами администратора.',
                learning: 'sudo systemctl restart пересоздаёт процесс службы.',
                context: 'После изменения конфигурации требуется перезапуск.',
                command: 'sudo systemctl restart nginx',
                response: 'Команда перезапуска отправлена.',
                success: 'Сервис перезапущен — новая конфигурация применена.',
                explanation: 'restart сочетает остановку и запуск без длительного простоя.',
                hintKey: 'systemctl restart'
            },
            {
                title: 'Просмотреть свежий журнал',
                description: 'Выведите журнал службы nginx за последние 10 минут.',
                learning: 'journalctl фильтрует по юниту и времени.',
                context: 'После перезапуска важно проверить отсутствие ошибок.',
                command: 'journalctl -u nginx --since "10 minutes ago"',
                response: 'Фрагмент журнала собран.',
                success: 'Последние записи журнала перед глазами.',
                explanation: 'Опция --since принимает читабельные значения времени.',
                hintKey: 'journalctl'
            },
            {
                title: 'Обновить индексы пакетов',
                description: 'Обновите локальный кэш пакетов APT.',
                learning: 'sudo apt update скачивает свежие списки.',
                context: 'Перед установкой пакетов убедитесь, что индексы актуальны.',
                command: 'sudo apt update',
                response: 'Списки пакетов синхронизированы.',
                success: 'APT знает о последних версиях пакетов.',
                explanation: 'Комбинируйте с apt list --upgradable, чтобы увидеть доступные обновления.',
                hintKey: 'apt update'
            },
            {
                title: 'Установить веб-сервер',
                description: 'Установите пакет nginx через APT.',
                learning: 'sudo apt install устанавливает пакет и зависимости.',
                context: 'Готовим сервер к приёму трафика.',
                command: 'sudo apt install nginx',
                response: 'Пакет подготовлен к установке.',
                success: 'Пакет установлен вместе с зависимостями.',
                explanation: 'Флаг -y подтвердит установку без вопросов.',
                hintKey: 'apt install'
            },
            {
                title: 'Включить автозапуск',
                description: 'Настройте автоматический запуск nginx при загрузке.',
                learning: 'systemctl enable добавляет юнит в автозагрузку.',
                context: 'Сервис должен запускаться при перезагрузке сервера.',
                command: 'sudo systemctl enable nginx',
                response: 'Автозапуск для nginx включён.',
                success: 'Служба будет подниматься автоматически.',
                explanation: 'enable создаёт симлинк в каталог systemd, обеспечивая старт на boot.',
                hintKey: 'systemctl enable'
            },
            {
                title: 'Перечитать конфигурацию',
                description: 'Примените изменения конфигурации nginx без простоя.',
                learning: 'systemctl reload перечитывает конфигурацию без остановки службы.',
                context: 'После правок в nginx.conf лучше выполнить мягкую перезагрузку.',
                command: 'sudo systemctl reload nginx',
                response: 'Служба перечитала конфигурацию.',
                success: 'Reload завершён — соединения не прервались.',
                explanation: 'reload полезен для обновления без полной перезагрузки процесса.',
                hintKey: 'systemctl reload'
            }
        ]
    },
    {
        id: 'devops',
        title: 'DevOps-инженер',
        difficulty: 'Эксперт',
        summary: 'Работаем с Git, контейнерами и автоматизацией деплоя.',
        skills: ['Git', 'Контейнеры', 'Автоматизация'],
        objectives: [
            'Контролировать состояние репозитория и веток.',
            'Работать с контейнерами Docker и docker compose.',
            'Запускать инфраструктурные плейбуки.'
        ],
        resources: [
            {
                label: 'Pro Git — Основы',
                url: 'https://git-scm.com/book/ru/v2',
                description: 'Полный справочник по Git.'
            },
            {
                label: 'Docker Docs — docker compose',
                url: 'https://docs.docker.com/compose/',
                description: 'Создание и управление мультиконтейнерными приложениями.'
            },
            {
                label: 'Ansible Documentation — Playbooks',
                url: 'https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html',
                description: 'Организация инфраструктуры кодом.'
            }
        ],
        tasks: [
            {
                title: 'Проверить репозиторий',
                description: 'Убедитесь, что рабочее дерево чистое.',
                learning: 'git status показывает состояние ветки и изменения.',
                context: 'Перед релизом важно знать, нет ли незакоммиченных файлов.',
                command: 'git status',
                response: 'Статус репозитория проверен.',
                success: 'Рабочее дерево в порядке.',
                explanation: 'git status помогает быстро оценить текущие изменения.',
                hintKey: 'git status'
            },
            {
                title: 'Подтянуть изменения',
                description: 'Синхронизируйте ветку main с origin.',
                learning: 'git pull объединяет fetch и merge.',
                context: 'Нужно получить свежие коммиты коллег.',
                command: 'git pull origin main',
                response: 'Обновления загружены.',
                success: 'Локальная ветка в актуальном состоянии.',
                explanation: 'Используйте --rebase, чтобы история оставалась линейной.',
                hintKey: 'git pull'
            },
            {
                title: 'Создать релизную ветку',
                description: 'Создайте ветку release/v1.2 и переключитесь на неё.',
                learning: 'git checkout -b создаёт ветку и сразу переключается.',
                context: 'Готовим отдельную линию для релиза.',
                command: 'git checkout -b release/v1.2',
                response: 'Релизная ветка создана.',
                success: 'Ветка готова — можно фиксировать изменения релиза.',
                explanation: 'В Git 2.23+ можно использовать git switch -c для тех же целей.',
                hintKey: 'git checkout'
            },
            {
                title: 'Посмотреть историю',
                description: 'Покажите последние пять коммитов в компактном виде.',
                learning: 'git log --oneline сокращает запись истории.',
                context: 'Нужно быстро напомнить себе, что уже сделано.',
                command: 'git log --oneline -5',
                response: 'История изменений выведена.',
                success: 'Вы видите краткую ленту последних коммитов.',
                explanation: 'Флаг -n ограничивает число записей, --graph добавит ASCII-ветвление.',
                hintKey: 'git log'
            },
            {
                title: 'Проверить контейнеры',
                description: 'Выведите список запущенных контейнеров.',
                learning: 'docker ps показывает активные контейнеры.',
                context: 'Нужно убедиться, что сервисы работают.',
                command: 'docker ps',
                response: 'Состояние контейнеров просмотрено.',
                success: 'Контейнеры в нужном состоянии.',
                explanation: 'Добавьте -a, чтобы увидеть остановленные контейнеры.',
                hintKey: 'docker ps'
            },
            {
                title: 'Запустить стек',
                description: 'Поднимите сервисы в фоне через docker compose.',
                learning: 'docker compose up -d запускает сервисы без блокировки терминала.',
                context: 'Нужно поднять окружение разработчика.',
                command: 'docker compose up -d',
                alternatives: ['docker-compose up -d'],
                response: 'Стек запущен и работает в фоне.',
                success: 'Сервисы стартовали успешно.',
                explanation: 'В новых версиях Docker используется встроенная команда docker compose.',
                hintKey: 'docker compose up'
            },
            {
                title: 'Собрать логи контейнера',
                description: 'Покажите последние строки логов контейнера app_web_1.',
                learning: 'docker logs --tail выводит хвост журнала контейнера.',
                context: 'После деплоя нужно убедиться, что нет ошибок.',
                command: 'docker logs app_web_1 --tail 5',
                response: 'Хвост логов собран.',
                success: 'Последние записи контейнера проверены.',
                explanation: 'Добавьте -f, чтобы следить за логом в реальном времени.',
                hintKey: 'docker logs'
            },
            {
                title: 'Остановить стек',
                description: 'Остановите сервисы и освободите ресурсы.',
                learning: 'docker compose down останавливает и удаляет контейнеры.',
                context: 'После проверки окружение нужно аккуратно выключить.',
                command: 'docker compose down',
                alternatives: ['docker-compose down'],
                response: 'Стек остановлен и очищен.',
                success: 'Инфраструктура выключена корректно.',
                explanation: 'Ключ --volumes дополнительно удалит именованные тома.',
                hintKey: 'docker compose down'
            },
            {
                title: 'Запустить плейбук',
                description: 'Выполните ansible-плейбук deploy.yml.',
                learning: 'ansible-playbook выполняет задачи на удалённых хостах.',
                context: 'Нужно задеплоить свежую версию приложения.',
                command: 'ansible-playbook deploy.yml',
                response: 'Плейбук прошёл успешно.',
                success: 'Инфраструктура обновлена через Ansible.',
                explanation: 'Добавьте --check, чтобы посмотреть, какие изменения будут внесены.',
                hintKey: 'ansible-playbook'
            },
            {
                title: 'Отправить ветку в origin',
                description: 'Запушьте релизную ветку на удалённый репозиторий.',
                learning: 'git push отправляет локальные изменения на сервер.',
                context: 'Команда ожидает ветку release/v1.2 в origin.',
                command: 'git push origin release/v1.2',
                response: 'Ветка отправлена на сервер.',
                success: 'Изменения доступны команде.',
                explanation: 'Флаг -u запомнит ветку и позволит делать короткий git push.',
                hintKey: 'git push'
            }
        ]
    },
    {
        id: 'security',
        title: 'Безопасность и доступ',
        difficulty: 'Эксперт+',
        summary: 'Защищаем соединения, файервол и журналы доступа.',
        skills: ['SSH', 'Firewall', 'Мониторинг'],
        objectives: [
            'Настраивать безопасный удалённый доступ.',
            'Ограничивать трафик через UFW.',
            'Контролировать попытки взлома и права файлов.'
        ],
        resources: [
            {
                label: 'OpenSSH Manual',
                url: 'https://man.openbsd.org/ssh',
                description: 'Детальная документация по клиенту и серверу SSH.'
            },
            {
                label: 'Ubuntu Docs — UFW',
                url: 'https://help.ubuntu.com/community/UFW',
                description: 'Настройка встроенного файервола.'
            },
            {
                label: 'Fail2ban Wiki',
                url: 'https://github.com/fail2ban/fail2ban/wiki',
                description: 'Мониторинг и блокировка подозрительных IP.'
            }
        ],
        tasks: [
            {
                title: 'Подключиться по SSH',
                description: 'Установите SSH-сессию к серверу 10.0.0.5 под пользователем admin.',
                learning: 'ssh user@host инициирует удалённое подключение.',
                context: 'Нужно получить доступ к серверу мониторинга.',
                command: 'ssh admin@10.0.0.5',
                response: 'Соединение установлено.',
                success: 'Вы подключились к удалённому серверу.',
                explanation: 'При первом подключении SSH попросит подтвердить ключ хоста.',
                hintKey: 'ssh'
            },
            {
                title: 'Передать архив',
                description: 'Скопируйте файл backup.tar.gz на сервер в /backups/.',
                learning: 'scp копирует файлы поверх SSH.',
                context: 'Резервная копия должна храниться на удалённом узле.',
                command: 'scp backup.tar.gz admin@10.0.0.5:/backups/',
                response: 'Архив отправлен.',
                success: 'Файл надёжно скопирован.',
                explanation: 'Для каталогов используйте scp -r или rsync.',
                hintKey: 'scp'
            },
            {
                title: 'Разрешить SSH в UFW',
                description: 'Откройте порт для SSH в файерволе.',
                learning: 'sudo ufw allow ssh добавляет правило по имени сервиса.',
                context: 'Перед включением UFW нужно разрешить удалённый доступ.',
                command: 'sudo ufw allow ssh',
                response: 'Правило разрешения SSH создано.',
                success: 'Доступ по SSH не будет заблокирован файерволом.',
                explanation: 'Можно указать номер порта вручную, например 2222/tcp.',
                hintKey: 'ufw allow'
            },
            {
                title: 'Включить файервол',
                description: 'Активируйте UFW для применения правил.',
                learning: 'sudo ufw enable включает файервол и запускает его при старте.',
                context: 'После настройки правил важно включить защиту.',
                command: 'sudo ufw enable',
                response: 'Файервол активирован.',
                success: 'UFW работает и защищает сервер.',
                explanation: 'Перед включением убедитесь, что есть разрешённый SSH.',
                hintKey: 'ufw enable'
            },
            {
                title: 'Проверить Fail2ban',
                description: 'Посмотрите статус тюрьмы sshd.',
                learning: 'fail2ban-client status показывает статистику блокировок.',
                context: 'Важно убедиться, что защита от перебора паролей активна.',
                command: 'sudo fail2ban-client status sshd',
                response: 'Статус fail2ban получен.',
                success: 'Вы видите количество заблокированных адресов.',
                explanation: 'Fail2ban реагирует на повторные ошибки входа и блокирует IP.',
                hintKey: 'fail2ban'
            },
            {
                title: 'Защитить приватный ключ',
                description: 'Выставьте права 600 для ~/.ssh/id_rsa.',
                learning: 'chmod 600 оставляет доступ только владельцу.',
                context: 'SSH откажется использовать ключ с лишними правами.',
                command: 'chmod 600 ~/.ssh/id_rsa',
                response: 'Права на ключ ужесточены.',
                success: 'Ключ защищён — только вы можете его читать.',
                explanation: 'Числовой режим 600 означает rw-------.',
                hintKey: 'chmod'
            },
            {
                title: 'Создать новую пару ключей',
                description: 'Сгенерируйте ключ ed25519 без пароля и сохраните в ~/.ssh/id_ed25519.',
                learning: 'ssh-keygen создаёт пару открытый/закрытый ключ.',
                context: 'Для доступа к новому серверу нужен отдельный ключ.',
                command: 'ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""',
                response: 'Новая ключевая пара создана.',
                success: 'Ключ готов — добавьте его на сервер.',
                explanation: 'Ключи ed25519 компактные и безопасные по умолчанию.',
                hintKey: 'ssh-keygen'
            },
            {
                title: 'Передать владение конфигом',
                description: 'Сделайте владельцем файла /etc/ssh/sshd_config пользователя root.',
                learning: 'chown меняет владельца и группу файла.',
                context: 'Конфигурация SSH должна принадлежать root для безопасности.',
                command: 'sudo chown root:root /etc/ssh/sshd_config',
                response: 'Права владения возвращены root.',
                success: 'Конфигурация находится под контролем администратора.',
                explanation: 'Следите, чтобы системные файлы оставались под root — это снижает риски.',
                hintKey: 'chown'
            }
        ]
    }
];
