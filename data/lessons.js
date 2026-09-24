window.LESSONS = [

/* ================= 1. ВВЕДЕНИЕ ================= */
{
  id: 1,
  title: { ru: "Введение. Установка и запуск", en: "Introduction. Setup and running" },
  subtitle: {
    ru: "Что такое Python, как установить и запустить первую программу.",
    en: "What Python is, how to install it and run your first program."
  },
  duration: "15 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Python — это язык программирования, который читается почти как обычный английский. Он один из самых популярных в мире: его используют в вебе, науке о данных, автоматизации, играх и разработке нейросетей.",
      en: "Python is a programming language that reads almost like plain English. It is one of the most popular languages in the world: used in web, data science, automation, games and AI development."
    }},
    { type: "h3", text: { ru: "Установка", en: "Installation" } },
    { type: "list", items: [
      { ru: "Скачай Python с официального сайта python.org (последняя версия).", en: "Download Python from the official site python.org (latest version)." },
      { ru: "При установке на Windows обязательно поставь галочку «Add Python to PATH».", en: "When installing on Windows, be sure to tick 'Add Python to PATH'." },
      { ru: "Проверь установку в терминале: python --version", en: "Verify the install in your terminal: python --version" }
    ]},
    { type: "code", code: "python --version\n# Python 3.12.4" },
    { type: "h3", text: { ru: "Запуск кода", en: "Running code" } },
    { type: "p", text: {
      ru: "Есть два способа: интерактивный режим (REPL), где команды выполняются сразу после ввода, и запуск файла с кодом.",
      en: "There are two ways: the interactive mode (REPL), where commands run right after you type them, and running a source file."
    }},
    { type: "code", code: "python\n>>> 2 + 2\n4\n>>> print(\"Привет!\")\nПривет!" },
    { type: "code", title: { ru: "Создай файл hello.py и запусти", en: "Create hello.py and run it" },
      code: 'print("Привет, мир!")\nprint("Hello, world!")'
    },
    { type: "h3", text: { ru: "Что печатает print()", en: "What print() does" } },
    { type: "p", text: {
      ru: "Функция print() выводит текст в консоль. Это главный способ увидеть результат работы программы.",
      en: "The print() function outputs text to the console. This is the main way to see what your program does."
    }},
    { type: "code", code: "print(1)\nprint(2, 3)          # несколько значений через запятую\nprint(\"A\", \"B\", sep=\"-\")  # разделитель\nprint(\"no newline\", end=\" \")  # без перевода строки\nprint(\"done\")" },
    { type: "h3", text: { ru: "Комментарии", en: "Comments" } },
    { type: "p", text: {
      ru: "Комментарии начинаются с # и игнорируются Python. Они нужны, чтобы объяснить код себе и другим.",
      en: "Comments start with # and are ignored by Python. They help explain the code to yourself and others."
    }},
    { type: "code", code: "# это комментарий\nprint(\"работает\")  # комментарий после кода" },
    { type: "tip", text: {
      ru: "Совет: попробуй все примеры прямо в «Песочнице» этого сайта — там уже работает настоящий Python.",
      en: "Tip: try all examples right in this site's 'Playground' — real Python is already running there."
    }}
  ]
},

/* ================= 2. ПЕРЕМЕННЫЕ И ТИПЫ ================= */
{
  id: 2,
  title: { ru: "Переменные и типы данных", en: "Variables and data types" },
  subtitle: {
    ru: "Как хранить данные и какие основные типы есть в Python.",
    en: "How to store data and the main types in Python."
  },
  duration: "15 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Переменная — это имя, под которым хранится значение. В Python не нужно объявлять тип — он определится сам.",
      en: "A variable is a name that holds a value. In Python you don't declare a type — it is inferred automatically."
    }},
    { type: "code", code: "age = 25          # целое число\ntemperature = 36.6# дробное\nname = \"Макс\"    # строка\nis_student = True  # логическое\nprint(age, temperature)\nprint(name, is_student)" },
    { type: "p", text: {
      ru: "Правила имён: можно использовать буквы, цифры и _, но имя не может начинаться с цифры. Имена пишут в нижнем регистре, а слова разделяют подчёркиванием.",
      en: "Naming rules: letters, digits and _ are allowed, but a name can't start with a digit. Use lowercase and underscores between words."
    }},
    { type: "code", code: "user_name = \"Аня\"     # так хорошо\n# 1user = 5           # так нельзя!\nuser1 = 5            # а так можно\nprint(user_name)" },
    { type: "h3", text: { ru: "Основные типы", en: "Main types" } },
    { type: "table",
      header: [{ ru: "Тип", en: "Type" }, { ru: "Назначение", en: "Purpose" }, { ru: "Пример", en: "Example" }],
      rows: [
        [ { ru: "int", en: "int" }, { ru: "целые числа", en: "integers" }, "42, -7, 10" ],
        [ { ru: "float", en: "float" }, { ru: "дробные числа", en: "decimal numbers" }, "3.14, -0.5" ],
        [ { ru: "str", en: "str" }, { ru: "строки (текст)", en: "strings (text)" }, "\"hi\", 'text'" ],
        [ { ru: "bool", en: "bool" }, { ru: "истина/ложь", en: "true/false" }, "True, False" ],
        [ { ru: "NoneType", en: "NoneType" }, { ru: "отсутствие значения", en: "no value" }, "None" ]
      ]},
    { type: "p", text: {
      ru: "Узнать тип значения можно функцией type(), а проверить соответствие типу — isinstance().",
      en: "Use type() to learn the type of a value, and isinstance() to check it."
    }},
    { type: "code", code: "print(type(42))\nprint(type(\"hello\"))\nprint(isinstance(3.14, float))" },
    { type: "h3", text: { ru: "Приведение типов", en: "Type conversion" } },
    { type: "p", text: {
      ru: "Функции int(), float(), str(), bool() превращают значение из одного типа в другой.",
      en: "The functions int(), float(), str(), bool() convert a value from one type to another."
    }},
    { type: "code", code: 'n = int("42")       # строка -> int\nx = float("3.5")   # строка -> float\ns = str(100)       # int -> строка\nprint(n + 8, x, s)' },
    { type: "tip", text: {
      ru: "Помни: строку с текстом в число превратить нельзя (int(\"abc\") вызовет ошибку).",
      en: "Remember: you can't turn non-numeric text into a number (int(\"abc\") raises an error)."
    }}
  ]
},

/* ================= 3. СТРОКИ ================= */
{
  id: 3,
  title: { ru: "Строки", en: "Strings" },
  subtitle: {
    ru: "Работа с текстом: кавычки, индексы, срезы и f-строки.",
    en: "Working with text: quotes, indexes, slices and f-strings."
  },
  duration: "20 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Строка — это текст в кавычках: одинарных, двойных или тройных (для многострочного).",
      en: "A string is text in quotes: single, double or triple (for multi-line text)."
    }},
    { type: "code", code: "a = 'single'\nb = \"double\"\nc = '''строка\nна несколько\nстрок'''\nprint(a, b)\nprint(c)" },
    { type: "h3", text: { ru: "Конкатенация и повторение", en: "Concatenation and repetition" } },
    { type: "code", code: "first = \"Py\"\nsecond = \"thon\"\nprint(first + second)   # склейка\nprint(\"ha\" * 3)         # повторение\nprint(\"ab\" + \"cd\" + \"e\")" },
    { type: "h3", text: { ru: "Индексы и срезы", en: "Indexes and slices" } },
    { type: "p", text: {
      ru: "Каждый символ строки имеет индекс: первый — 0, отрицательные индексы считают с конца. Срез [start:end] берёт часть строки (end не включается).",
      en: "Every character has an index: the first one is 0; negative indexes count from the end. A slice [start:end] takes a part of the string (end excluded)."
    }},
    { type: "code", code: "s = \"Python\"\nprint(s[0])     # P\nprint(s[-1])    # n\nprint(s[0:3])   # Pyt\nprint(s[2:])    # thon\nprint(s[::-1])  # nohtyP (разворот)" },
    { type: "p", text: {
      ru: "len() возвращает длину строки.",
      en: "len() returns the length of the string."
    }},
    { type: "code", code: "s = \"Python\"\nprint(len(s))" },
    { type: "h3", text: { ru: "f-строки — подстановка значений", en: "f-strings — value interpolation" } },
    { type: "p", text: {
      ru: "Перед кавычками пиши f, а выражения бери в фигурные скобки. Самый удобный способ собрать строку из данных.",
      en: "Put f before the quotes and wrap expressions in curly braces. The most convenient way to build a string from data."
    }},
    { type: "code", code: 'name = "Соня"\nage = 20\nprint(f"Меня зовут {name}, мне {age} лет.")\nprint(f"Через год будет {age + 1}")' },
    { type: "p", text: {
      ru: "В f-строках можно задавать форматирование чисел: :.2f — два знака после запятой.",
      en: "In f-strings you can format numbers: :.2f means two decimal places."
    }},
    { type: "code", code: 'price = 19.954\nprint(f"Цена: {price:.2f} ₽")\nprint(f"Доля: {price > 10}")' },
    { type: "tip", text: {
      ru: "Подстановка f\"{выражение}\" работает даже с функциями и арифметикой внутри скобок.",
      en: "Interpolation f\"{expression}\" works even with functions and arithmetic inside the braces."
    }}
  ]
},

/* ================= 4. ЧИСЛА И АРИФМЕТИКА ================= */
{
  id: 4,
  title: { ru: "Числа и арифметика", en: "Numbers and arithmetic" },
  subtitle: {
    ru: "Операторы, особое деление, встроенные функции для чисел.",
    en: "Operators, the tricky division and built-in functions for numbers."
  },
  duration: "15 мин / min",
  sections: [
    { type: "table",
      header: [{ ru: "Оператор", en: "Operator" }, { ru: "Действие", en: "Operation" }, { ru: "Пример", en: "Example" }],
      rows: [
        [ "+", { ru: "сложение", en: "addition" }, "3 + 2  →  5" ],
        [ "-", { ru: "вычитание", en: "subtraction" }, "7 - 10  →  -3" ],
        [ "*", { ru: "умножение", en: "multiplication" }, "4 * 2.5  →  10.0" ],
        [ "/", { ru: "деление (всегда float)", en: "division (always float)" }, "7 / 2  →  3.5" ],
        [ "//", { ru: "целочисленное деление", en: "floor division" }, "7 // 2  →  3" ],
        [ "%", { ru: "остаток от деления", en: "modulo (remainder)" }, "7 % 2  →  1" ],
        [ "**", { ru: "возведение в степень", en: "exponent" }, "2 ** 10  →  1024" ]
      ]},
    { type: "code", code: "print(7 / 2, 7 // 2, 7 % 2)\nprint(2 ** 10)\nprint(10 % 3)   # 1: 10 делится на 3 трижды, остаток 1" },
    { type: "p", text: {
      ru: "Скобки работают как в математике. Приоритет операторов тоже обычный: * и / раньше, чем + и -.",
      en: "Parentheses work as in math. Operator precedence is standard: * and / before + and -."
    }},
    { type: "code", code: "print(2 + 3 * 4)    # 14\nprint((2 + 3) * 4)  # 20\nprint(15 - 5 / 2)   # 12.5" },
    { type: "h3", text: { ru: "Округление", en: "Rounding" } },
    { type: "p", text: {
      ru: "round(x, n) округляет до n знаков, int() отбрасывает дробную часть, abs() — модуль числа.",
      en: "round(x, n) rounds to n decimal places, int() truncates the fractional part, abs() is the absolute value."
    }},
    { type: "code", code: "print(round(3.14159, 2))  # 3.14\nprint(int(9.99))          # 9\nprint(abs(-5))            # 5" },
    { type: "h3", text: { ru: "Встроенные функции", en: "Built-in functions" } },
    { type: "code", code: "print(min(3, 7, 1))  # 1\nprint(max(3, 7, 1))  # 7\nprint(sum([1, 2, 3]))  # 6\nprint(pow(2, 3))       # 8" },
    { type: "p", text: {
      ru: "Деление на ноль вызывает ошибку ZeroDivisionError. Будь внимателен.",
      en: "Division by zero raises ZeroDivisionError. Be careful."
    }},
    { type: "tip", text: {
      ru: "Остаток % отлично проверяет делимость: n % 2 == 0 значит, что n чётное.",
      en: "The modulo % is great for divisibility checks: n % 2 == 0 means n is even."
    }}
  ]
},

/* ================= 5. УСЛОВИЯ ================= */
{
  id: 5,
  title: { ru: "Условия: if / elif / else", en: "Conditionals: if / elif / else" },
  subtitle: {
    ru: "Как программа принимает решения по логическим значениям.",
    en: "How a program makes decisions based on boolean values."
  },
  duration: "20 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Оператор if выполняет блок кода, только если условие истинно. Блок выделяется отступом в 4 пробела.",
      en: "The if statement runs a block of code only if the condition is true. The block is indented by 4 spaces."
    }},
    { type: "code", code: "temp = 30\nif temp > 25:\n    print(\"Жарко!\")\nprint(\"Программа продолжается\")" },
    { type: "h3", text: { ru: "Ветвления", en: "Branches" } },
    { type: "p", text: {
      ru: "elif — ещё одна проверка, если первая не сработала. else — что делать, если не сработало ничего.",
      en: "elif adds another check if the first one failed. else is what happens when nothing matched."
    }},
    { type: "code", code: "mark = 75\nif mark >= 90:\n    print(\"A\")\nelif mark >= 70:\n    print(\"B\")\nelif mark >= 50:\n    print(\"C\")\nelse:\n    print(\"F\")\n# Выведет: B" },
    { type: "h3", text: { ru: "Операторы сравнения", en: "Comparison operators" } },
    { type: "table",
      header: [{ ru: "Оператор", en: "Operator" }, { ru: "Значение", en: "Meaning" }],
      rows: [
        [ "==", { ru: "равно", en: "equal to" } ],
        [ "!=", { ru: "не равно", en: "not equal to" } ],
        [ ">", { ru: "больше", en: "greater than" } ],
        [ "<", { ru: "меньше", en: "less than" } ],
        [ ">=", { ru: "больше или равно", en: "greater than or equal" } ],
        [ "<=", { ru: "меньше или равно", en: "less than or equal" } ]
      ]},
    { type: "h3", text: { ru: "Логические операторы", en: "Logical operators" } },
    { type: "p", text: {
      ru: "and — «и то, и другое», or — «хотя бы одно», not — «не».",
      en: "and — 'both', or — 'at least one', not — 'negation'."
    }},
    { type: "code", code: "age = 20\nhas_money = True\nif age >= 18 and has_money:\n    print(\"Можно брать кредит\")\n\nif not has_money:\n    print(\"Карман пуст\")" },
    { type: "h3", text: { ru: "Правдивость (truthiness)", en: "Truthiness" } },
    { type: "p", text: {
      ru: "Пустые строки, 0, [], {}, None считаются «ложными». Остальное — «истинным».",
      en: "Empty strings, 0, [], {} and None count as 'falsy'. Everything else is 'truthy'."
    }},
    { type: "code", code: "name = \"\"\nif name:\n    print(\"Есть имя\")\nelse:\n    print(\"Имя пустое\")\n\nx = 0\nif x:\n    print(\"не ноль\")\nelse:\n    print(\"ноль\")" },
    { type: "h3", text: { ru: "Тернарный оператор", en: "Ternary operator" } },
    { type: "code", code: "age = 17\ntext = \"взрослый\" if age >= 18 else \"несовершеннолетний\"\nprint(text)" },
    { type: "tip", text: {
      ru: "Поставь `print(True)` чтобы всегда печаталось — так удобно проверять, что код вообще выполняется.",
      en: "Add print(True) to always print something — a handy way to check that code actually runs."
    }}
  ]
},

/* ================= 6. СПИСКИ ================= */
{
  id: 6,
  title: { ru: "Списки", en: "Lists" },
  subtitle: {
    ru: "Упорядоченные коллекции значений: создание, доступ, методы.",
    en: "Ordered collections of values: creating, accessing, methods."
  },
  duration: "20 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Список — упорядоченный набор элементов в квадратных скобках. Элемменты могут быть разных типов.",
      en: "A list is an ordered collection of items in square brackets. Items can be of different types."
    }},
    { type: "code", code: 'nums = [1, 2, 3, 4]\nmixed = [1, "текст", True, 3.14]\nempty = []\nprint(nums)\nprint(mixed[1])\nprint(len(nums))' },
    { type: "h3", text: { ru: "Индексы и срезы", en: "Indexes and slices" } },
    { type: "code", code: "lst = [10, 20, 30, 40, 50]\nprint(lst[0])     # 10\nprint(lst[-1])    # 50\nprint(lst[1:4])   # [20, 30, 40]\nprint(lst[::-1])  # [50, 40, 30, 20, 10]" },
    { type: "p", text: {
      ru: "Оператор in проверяет, есть ли элемент в списке.",
      en: "The in operator checks whether an item is in the list."
    }},
    { type: "code", code: "fruits = [\"apple\", \"banana\", \"cherry\"]\nif \"banana\" in fruits:\n    print(\"Есть банан!\")" },
    { type: "h3", text: { ru: "Изменение списков", en: "Changing lists" } },
    { type: "code", code: "nums = [1, 2, 3]\nnums.append(4)      # добавить в конец\nnums.insert(0, 0)  # вставить по индексу\nnums[1] = 99       # заменить\nprint(nums)\nremoved = nums.pop()  # забрать с конца\nprint(nums, removed)" },
    { type: "p", text: {
      ru: "Списки — изменяемые: в отличие от строк, их элементы можно менять на месте.",
      en: "Lists are mutable: unlike strings, you can change items in place."
    }},
    { type: "h3", text: { ru: "Методы сортировки и поиска", en: "Sort and search methods" } },
    { type: "code", code: "nums = [5, 2, 7, 1]\nnums.sort()             # сортировка на месте\nprint(nums)\nprint(nums.index(7))    # индекс элемента\nprint(sum(nums), min(nums), max(nums))" },
    { type: "h3", text: { ru: "Создание через генератор", en: "List comprehension" } },
    { type: "code", code: "squares = [x * x for x in range(1, 6)]\nevens = [x for x in range(10) if x % 2 == 0]\nprint(squares)\nprint(evens)" },
    { type: "tip", text: {
      ru: "Генератор списков читается как: «элемент → выражение для него → условие». Практика приходит быстро.",
      en: "Read a comprehension like: 'item → expression for it → condition'. You'll get used to it fast."
    }}
  ]
},

/* ================= 7. СЛОВАРИ ================= */
{
  id: 7,
  title: { ru: "Словари", en: "Dictionaries" },
  subtitle: {
    ru: "Хранение данных по ключу: создание, доступ, методы.",
    en: "Storing data by key: creating, accessing, methods."
  },
  duration: "20 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Словарь хранит пары «ключ: значение». Похож на настоящий словарь: ищешь по слову, получаешь определение.",
      en: "A dictionary stores 'key: value' pairs. Like a real dictionary: look up a word, get the definition."
    }},
    { type: "code", code: 'user = {\n    "name": "Аня",\n    "age": 20,\n    "city": "Москва"\n}\nprint(user["name"])  # Аня\nprint(user.get("age"))\nprint(user.get("phone", "нет номера"))' },
    { type: "p", text: {
      ru: "Обращаться user[\"ключ\"]. Если ключа нет — будет ошибка KeyError. Метод .get() безопаснее: вернёт None или значение по умолчанию.",
      en: "Access with user[\"key\"]. A missing key raises KeyError. The .get() method is safer: returns None or a default value."
    }},
    { type: "code", code: 'words = {"cat": "кот"}\nprint(words["cat"])\nprint(words.get("dog", "не найдено"))' },
    { type: "h3", text: { ru: "Добавление и изменение", en: "Adding and changing" } },
    { type: "code", code: 'h = {"a": 1}\nh["b"] = 2      # добавить\nh["a"] = 100   # изменить\nprint(h)       # {\'a\': 100, \'b\': 2}' },
    { type: "h3", text: { ru: "Ключи, значения, пары", en: "Keys, values, items" } },
    { type: "p", text: {
      ru: "Методы .keys(), .values() и .items() — как обойти весь словарь, посмотрим в уроке про циклы.",
      en: "Methods .keys(), .values() and .items() — how to iterate a dictionary, we'll see in the loops lesson."
    }},
    { type: "code", code: 'd = {"name": "Лиза", "age": 22}\nprint(list(d.keys()))    # [\'name\', \'age\']\nprint(list(d.values()))  # [\'Лиза\', 22]\nprint(list(d.items()))   # [(\'name\', \'Лиза\'), (\'age\', 22)]\nprint("name" in d)   # True' },
    { type: "p", text: {
      ru: "Проверка наличия ключа — через in: работает быстро даже для больших словарей.",
      en: "Check key presence with in: it's fast even for large dictionaries."
    }},
    { type: "h3", text: { ru: "Удаление", en: "Deleting" } },
    { type: "code", code: "d = {\"a\": 1, \"b\": 2, \"c\": 3}\ndel d[\"b\"]\nprint(d)\nremoved = d.pop(\"a\")\nprint(d, removed)" },
    { type: "tip", text: {
      ru: "Словари сохраняют порядок вставки (это официальная гарантия с Python 3.7).",
      en: "Dictionaries keep insertion order (officially guaranteed since Python 3.7)."
    }}
  ]
},

/* ================= 8. ЦИКЛЫ ================= */
{
  id: 8,
  title: { ru: "Циклы: for и while", en: "Loops: for and while" },
  subtitle: {
    ru: "Повторяй действия: перебор с for и условие с while.",
    en: "Repeat actions: iteration with for and conditions with while."
  },
  duration: "25 мин / min",
  sections: [
    { type: "p", text: {
      ru: "for перебирает элементы коллекции (список, строку, словарь), а while повторяет, пока условие истинно.",
      en: "for iterates over a collection's items (list, string, dictionary), while repeats as long as a condition holds."
    }},
    { type: "h3", text: { ru: "Цикл for", en: "The for loop" } },
    { type: "code", code: "for fruit in [\"яблоко\", \"банан\", \"вишня\"]:\n    print(\"Люблю:\", fruit)\n\nfor ch in \"Python\":\n    print(ch, end=\".\")\nprint()" },
    { type: "h3", text: { ru: "range()", en: "range()" } },
    { type: "p", text: {
      ru: "range(n) — числа от 0 до n-1. range(a, b) — от a до b-1. range(a, b, s) — с шагом s.",
      en: "range(n) is numbers from 0 to n-1. range(a, b) is a to b-1. range(a, b, s) steps by s."
    }},
    { type: "code", code: "for i in range(3):\n    print(i, end=\" \")\nprint()\nfor i in range(2, 10, 2):\n    print(i, end=\" \")\nprint()" },
    { type: "h3", text: { ru: "enumerate — индекс и значение", en: "enumerate — index and value" } },
    { type: "code", code: "fruits = [\"яблоко\", \"банан\"]\nfor i, f in enumerate(fruits):\n    print(i, f)" },
    { type: "h3", text: { ru: "Цикл по словарю", en: "Looping over a dictionary" } },
    { type: "code", code: 'scores = {"матч 1": 3, "матч 2": 1}\nfor name, score in scores.items():\n    print(name, "→", score)' },
    { type: "h3", text: { ru: "Цикл while", en: "The while loop" } },
    { type: "code", code: "n = 5\nwhile n > 0:\n    print(n, end=\" \")\n    n -= 1\nprint(\"Старт!\")" },
    { type: "p", text: {
      ru: "Важно: внутри while что-то должно менять условие, иначе цикл никогда не закончится (бесконечный цикл).",
      en: "Important: inside while something must change the condition, otherwise the loop never ends (infinite loop)."
    }},
    { type: "h3", text: { ru: "break и continue", en: "break and continue" } },
    { type: "p", text: {
      ru: "break — немедленно выйти из цикла, continue — перейти к следующей итерации.",
      en: "break exits the loop immediately, continue jumps to the next iteration."
    }},
    { type: "code", code: "for i in range(1, 20):\n    if i % 5 == 0:\n        break      # теряемся на первой пятёрке\n    print(i, end=\" \")\nprint()\nfor i in range(10):\n    if i % 2 == 0:\n        continue   # пропускаем чётные\n    print(i, end=\" \")\nprint()" },
    { type: "tip", text: {
      ru: "Проверь себя: сколько раз выполнится for i in range(3, 10, 2): ...?  (ответ: 4 раза)",
      en: "Check yourself: how many times does for i in range(3, 10, 2): run? (answer: 4)"
    }}
  ]
},

/* ================= 9. ФУНКЦИИ ================= */
{
  id: 9,
  title: { ru: "Функции", en: "Functions" },
  subtitle: {
    ru: "Создавай переиспользуемый код с def, параметрами и return.",
    en: "Create reusable code with def, parameters and return."
  },
  duration: "25 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Функция — именованный блок кода, который можно вызывать много раз. def имя(параметры): ...",
      en: "A function is a named block of code you can call many times. def name(parameters): ..."
    }},
    { type: "code", code: "def greet(name):\n    print(f\"Привет, {name}!\")\n\ngreet(\"Макс\")\ngreet(\"Аня\")" },
    { type: "h3", text: { ru: "return — возврат значения", en: "return — a value out" } },
    { type: "p", text: {
      ru: "return передаёт результат тому, кто вызвал функцию. Без return функция возвращает None.",
      en: "return hands the result back to the caller. Without return a function returns None."
    }},
    { type: "code", code: "def add(a, b):\n    return a + b\n\nx = add(3, 4)\nprint(x)   # 7\nprint(add(10, 20))" },
    { type: "h3", text: { ru: "Значения по умолчанию", en: "Default values" } },
    { type: "code", code: "def power(base, exp=2):\n    return base ** exp\n\nprint(power(5))      # 25\nprint(power(5, 3))   # 125" },
    { type: "h3", text: { ru: "Именованные аргументы", en: "Keyword arguments" } },
    { type: "code", code: "def info(name, age, city):\n    print(f\"{name}, {age} лет, из {city}\")\n\ninfo(\"Лиза\", 22, \"Москва\")\ninfo(city=\"Казань\", name=\"Тимур\", age=25)" },
    { type: "p", text: {
      ru: "Порядок именованных аргументов не важен — важно, чтобы их имена совпадали с параметрами.",
      en: "The order of keyword arguments doesn't matter — their names must match the parameters."
    }},
    { type: "h3", text: { ru: "Локальные и глобальные переменные", en: "Local vs global variables" } },
    { type: "p", text: {
      ru: "Переменные, созданные внутри функции, существуют только внутри неё. Для чтения глобальной внутри функции обычно используют параметры.",
      en: "Variables created inside a function live only inside it. To read a global inside a function, pass it as a parameter."
    }},
    { type: "code", code: "def calc(x):\n    total = x * 2   # локальная\n    return total\n\nprint(calc(5))\n# print(total) -> Ошибка: переменной нет снаружи" },
    { type: "h3", text: { ru: "Документирование (docstring)", en: "Docstrings" } },
    { type: "code", code: "def area(w, h):\n    \"\"\"Возвращает площадь прямоугольника.\"\"\"\n    return w * h\n\nprint(area(3, 4))\nprint(area.__doc__)" },
    { type: "tip", text: {
      ru: "Именуй функции глаголом: get_price(), calc_total(), is_valid() — так код читается как предложение.",
      en: "Name functions with a verb: get_price(), calc_total(), is_valid() — the code then reads like a sentence."
    }}
  ]
},

/* ================= 10. МЕТОДЫ СТРОК И СПИСКОВ ================= */
{
  id: 10,
  title: { ru: "Методы строк и списков", en: "String and list methods" },
  subtitle: {
    ru: "Главные методы для работы с текстом и коллекциями.",
    en: "The main methods for working with text and collections."
  },
  duration: "25 мин / min",
  sections: [
    { type: "h3", text: { ru: "Регистр и пробелы", en: "Case and whitespace" } },
    { type: "code", code: 's = "  Hello, World!  "\nprint(s.upper())\nprint(s.lower())\nprint(s.strip())        # убрать пробелы по краям\nprint(s.replace("World", "Python"))' },
    { type: "h3", text: { ru: "Поиск и проверки", en: "Search and checks" } },
    { type: "code", code: 'email = "user@example.com"\nprint(email.startswith("user"))\nprint(email.endswith(".com"))\nprint(email.find("@"))        # индекс или -1\nprint(email.isdigit())        # все ли символы цифры\nprint("42".isdigit())' },
    { type: "h3", text: { ru: "split и join", en: "split and join" } },
    { type: "p", text: {
      ru: "split() разбивает строку на список, join() склеивает список в строку. Это пара — они «дружат».",
      en: "split() splits a string into a list, join() joins a list into a string. They're a pair — they 'get along'."
    }},
    { type: "code", code: 'words = "кот, собака, попугай".split(", ")\nprint(words)\nprint(" — ".join(words))' },
    { type: "h3", text: { ru: "Счётчики", en: "Counters" } },
    { type: "code", code: 's = "banana"\nprint(s.count("a"))\nprint(s.count("na"))' },
    { type: "h3", text: { ru: "Методы списков", en: "List methods" } },
    { type: "table",
      header: [{ ru: "Метод", en: "Method" }, { ru: "Что делает", en: "What it does" }],
      rows: [
        [ "append(x)", { ru: "добавить в конец", en: "add to the end" } ],
        [ "extend([...])", { ru: "добавить все элементы из другого списка", en: "add all items from another list" } ],
        [ "insert(i, x)", { ru: "вставить по индексу", en: "insert at index" } ],
        [ "remove(x)", { ru: "удалить первый такой элемент", en: "remove the first matching item" } ],
        [ "pop(i)", { ru: "забрать и вернуть элемент", en: "remove and return an item" } ],
        [ "sort()", { ru: "отсортировать на месте", en: "sort in place" } ],
        [ "reverse()", { ru: "развернуть на месте", en: "reverse in place" } ],
        [ "index(x)", { ru: "индекс первого вхождения", en: "index of the first match" } ],
        [ "count(x)", { ru: "сколько раз встречается", en: "how many times it occurs" } ],
        [ "copy()", { ru: "копия списка", en: "a copy of the list" } ]
      ]},
    { type: "code", code: "nums = [3, 1, 2]\nnums.extend([4, 5])\nnums.sort()\nprint(nums)\nnums.reverse()\nprint(nums)\nprint(nums.copy())" },
    { type: "tip", text: {
      ru: "Методы строк не меняют исходную строку (строки неизменяемы), методы списков меняют список на месте.",
      en: "String methods return a new string (strings are immutable); list methods change the list in place."
    }}
  ]
},

/* ================= 11. ИСКЛЮЧЕНИЯ ================= */
{
  id: 11,
  title: { ru: "Исключения: try / except", en: "Exceptions: try / except" },
  subtitle: {
    ru: "Обрабатывай ошибки, не давая программе упасть.",
    en: "Handle errors without crashing your program."
  },
  duration: "20 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Исключение — сигнал, что что-то пошло не так (деление на ноль, нет файла, неверный тип). Обрабатывать их можно, не давая программе упасть.",
      en: "An exception is a signal that something went wrong (division by zero, missing file, wrong type). You can handle them, so your program doesn't crash."
    }},
    { type: "code", code: 'try:\n    n = int("abc")\nexcept ValueError:\n    print("Не удалось преобразовать в число")\nprint("Программа жива!")' },
    { type: "h3", text: { ru: "Частые исключения", en: "Common exceptions" } },
    { type: "table",
      header: [{ ru: "Исключение", en: "Exception" }, { ru: "Когда возникает", en: "When it happens" }],
      rows: [
        [ "ValueError", { ru: "неверное значение", en: "invalid value" } ],
        [ "TypeError", { ru: "операция с неподходящим типом", en: "operation with wrong type" } ],
        [ "KeyError", { ru: "нет ключа в словаре", en: "missing key in a dict" } ],
        [ "IndexError", { ru: "индекс за пределами списка", en: "index out of range" } ],
        [ "ZeroDivisionError", { ru: "деление на ноль", en: "division by zero" } ],
        [ "FileNotFoundError", { ru: "файл не найден", en: "file not found" } ]
      ]},
    { type: "h3", text: { ru: "Несколько except и else/finally", en: "Multiple except and else/finally" } },
    { type: "code", code: "vals = [10, 0]\nfor v in vals:\n    try:\n        print(100 / v)\n    except ZeroDivisionError:\n        print(\"Деление на ноль!\")\n    else:\n        print(\"— успешно\")\n    # finally выполнится всегда\n    finally:\n        print(\"— попытка завершена\")" },
    { type: "h3", text: { ru: "Перехват всех ошибок", en: "Catching all errors" } },
    { type: "code", code: "try:\n    print(1 / 0)\nexcept Exception as e:\n    print(\"Ошибка:\", e)" },
    { type: "p", text: {
      ru: "Широко перехватывать Exception — удобно, но для продакшен-кода лучше ловить конкретные типы.",
      en: "Catching broad Exception is handy, but in production code it's better to catch specific types."
    }},
    { type: "h3", text: { ru: "raise — бросить свою ошибку", en: "raise — throw your own error" } },
    { type: "code", code: "def set_age(age):\n    if age < 0:\n        raise ValueError(\"Возраст не может быть отрицательным\")\n    print(\"Возраст OK\")\n\ntry:\n    set_age(-5)\nexcept ValueError as e:\n    print(\"Поймано:\", e)" },
    { type: "tip", text: {
      ru: "Используй try/except там, где может быть ошибка ввода или файла, — программа станет гораздо надёжнее.",
      en: "Use try/except where input or file errors can happen — the program becomes much more reliable."
    }}
  ]
},

/* ================= 12. ООП ================= */
{
  id: 12,
  title: { ru: "ООП: классы", en: "OOP: classes" },
  subtitle: {
    ru: "Объекты, классы, методы и атрибуты.",
    en: "Objects, classes, methods and attributes."
  },
  duration: "30 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Класс — это «чертёж», по которому создаются объекты. Объект — конкретный экземпляр класса со своими данными.",
      en: "A class is a 'blueprint' for creating objects. An object is a concrete instance of a class with its own data."
    }},
    { type: "code", code: "class Dog:\n    # __init__ вызывается при создании объекта\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def bark(self):\n        print(f\"{self.name} говорит: Гав!\")\n\nrex = Dog(\"Рекс\", 3)\nprint(rex.name, rex.age)\nrex.bark()" },
    { type: "p", text: {
      ru: "self — ссылка на сам объект. Через self хранятся и читаются атрибуты объекта.",
      en: "self refers to the object itself. Attributes are stored and read through self."
    }},
    { type: "h3", text: { ru: "__str__ — как напечатать объект", en: "__str__ — how to print an object" } },
    { type: "code", code: "class Point:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n\n    def __str__(self):\n        return f\"({self.x}, {self.y})\"\n\n    def distance_to_origin(self):\n        return (self.x ** 2 + self.y ** 2) ** 0.5\n\np = Point(3, 4)\nprint(p)\nprint(p.distance_to_origin())" },
    { type: "h3", text: { ru: "Наследование", en: "Inheritance" } },
    { type: "p", text: {
      ru: "Класс может унаследовать методы другого класса и добавить свои. Это позволяет не дублировать код.",
      en: "A class can inherit methods of another class and add its own. This avoids code duplication."
    }},
    { type: "code", code: "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        print(f\"{self.name} издаёт звук\")\n\nclass Cat(Animal):\n    def speak(self):\n        print(f\"{self.name}: Мяу!\")\n\nkitty = Cat(\"Барсик\")\nkitty.speak()" },
    { type: "p", text: {
      ru: "Cat наследует __init__ у Animal, а speak переопределяет. Такое переопределение называется полиморфизмом.",
      en: "Cat inherits __init__ from Animal and overrides speak. Overriding like this is called polymorphism."
    }},
    { type: "tip", text: {
      ru: "ООП мощно, но начинай просто: один класс с атрибутами и 2–3 методами — и решай реальные задачи.",
      en: "OOP is powerful, but start small: one class with a few attributes and 2–3 methods — and solve real tasks."
    }}
  ]
},

/* ================= 13. ФАЙЛЫ ================= */
{
  id: 13,
  title: { ru: "Работа с файлами", en: "Working with files" },
  subtitle: {
    ru: "Чтение, запись и контекстный менеджер with.",
    en: "Reading, writing and the with context manager."
  },
  duration: "20 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Файлы в этом ролике: всё, что программа читает и пишет на диск. Самый безопасный способ — with open(...) as f: ...",
      en: "Files: everything a program reads from and writes to the disk. The safest way is with open(...) as f: ..."
    }},
    { type: "p", text: {
      ru: "(В песочнице сайта файлы писать нельзя — Pyodide работает в изолированной памяти. Примеры ниже запусти у себя, сохранив файл lesson13_data.txt.)",
      en: "(In the playground you can't write files — Pyodide runs in a sandboxed memory. Run the examples below locally, having created lesson13_data.txt.)"
    }},
    { type: "code", code: "# урок.txt: Строка один\n# Строка два\nwith open(\"lesson13_data.txt\", \"r\", encoding=\"utf-8\") as f:\n    content = f.read()\nprint(content)\n\nwith open(\"lesson13_data.txt\", \"r\", encoding=\"utf-8\") as f:\n    for line in f:\n        print(line.strip())" },
    { type: "h3", text: { ru: "Запись", en: "Writing" } },
    { type: "code", code: 'with open("output.txt", "w", encoding="utf-8") as f:\n    f.write("Первая строка\\n")\n    f.write("Вторая строка\\n")\n\nwith open("output.txt", "a", encoding="utf-8") as f:\n    f.writelines(["Ещё\\n", "Добавка\\n"])' },
    { type: "table",
      header: [{ ru: "Режим", en: "Mode" }, { ru: "Что делает", en: "What it does" }],
      rows: [
        [ "\"r\"", { ru: "чтение (по умолчанию)", en: "read (default)" } ],
        [ "\"w\"", { ru: "запись (перезапишет файл)", en: "write (overwrites)" } ],
        [ "\"a\"", { ru: "добавление в конец", en: "append to the end" } ],
        [ "\"r+\"", { ru: "чтение и запись", en: "read and write" } ],
        [ "\"wb\"", { ru: "запись в двоичном режиме", en: "binary write" } ]
      ]},
    { type: "p", text: {
      ru: "with сам закрывает файл — даже если внутри случилась ошибка. Ручной способ open() / f.close() легче забыть.",
      en: "with closes the file automatically — even if an error occurs inside. The manual open() / f.close() is easy to forget."
    }},
    { type: "tip", text: {
      ru: "Всегда указывай encoding=\"utf-8\" для текстовых файлов — иначе кириллица может прочитаться «кракозябрами» на Windows.",
      en: "Always specify encoding=\"utf-8\" for text files — otherwise Cyrillic may be read as garbage on Windows."
    }}
  ]
},

/* ================= 14. МОДУЛИ ================= */
{
  id: 14,
  title: { ru: "Модули и стандартная библиотека", en: "Modules and the standard library" },
  subtitle: {
    ru: "import, math, random, datetime — встроенные возможности Python.",
    en: "import, math, random, datetime — Python's built-in powers."
  },
  duration: "20 мин / min",
  sections: [
    { type: "p", text: {
      ru: "Модуль — файл с Python-кодом, который можно подключить через import. Стандартная библиотека — десятки готовых модулей.",
      en: "A module is a Python file you can pull in with import. The standard library ships dozens of ready-to-use modules."
    }},
    { type: "code", code: "import math\nimport random\nimport datetime as dt\n\nprint(math.pi)\nprint(math.sqrt(16))\nprint(random.randint(1, 6))\nprint(dt.date.today())" },
    { type: "h3", text: { ru: "Способы импорта", en: "Import styles" } },
    { type: "code", code: "import math            # math.sqrt(9)\nfrom math import sqrt  # sqrt(9)\nfrom math import sqrt as kv # kv(9)\n\nprint(math.sqrt(9))\nprint(sqrt(9))\nprint(kv(9))" },
    { type: "p", text: {
      ru: "from ... import берёт только нужное, а as задаёт псевдоним. Не злоупотребляй импортом звёздочкой (from x import *).",
      en: "from ... import takes only what you need, as sets an alias. Don't overuse star imports (from x import *)."
    }},
    { type: "h3", text: { ru: "math и random", en: "math and random" } },
    { type: "code", code: 'import math, random\n\nprint(math.floor(3.7))   # 3\nprint(math.ceil(3.2))    # 4\nprint(math.fabs(-4))     # 4.0\nprint(random.random())   # число из [0,1)\nprint(random.choice(["камень", "ножницы", "бумага"]))' },
    { type: "h3", text: { ru: "datetime", en: "datetime" } },
    { type: "code", code: "import datetime\n\nnow = datetime.datetime.now()\nprint(now)\nprint(now.year, now.month, now.day)\ntoday = datetime.date.today()\nprint(today + datetime.timedelta(days=7))" },
    { type: "h3", text: { ru: "Свой модуль", en: "Your own module" } },
    { type: "p", text: {
      ru: "Любой .py файл — это модуль. Создай utils.py с функциями и подключи его: from utils import double.",
      en: "Any .py file is a module. Create utils.py with some functions and import it: from utils import double."
    }},
    { type: "code", code: "# utils.py\n\ndef double(x):\n    return x * 2\n\n\n# main.py   (в той же папке)\nfrom utils import double\nprint(double(21))" },
    { type: "tip", text: {
      ru: "Не называй файлы random.py, math.py и т.п. — это перекроет стандартные модули.",
      en: "Don't name files random.py, math.py etc. — that shadows the standard modules."
    }}
  ]
}
];