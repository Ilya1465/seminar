window.CHEAT_SHEET = [
  {
    title: { ru: "Основы синтаксиса", en: "Basic syntax" },
    headers: [ "Код / Code", { ru: "Назначение", en: "Meaning" } ],
    rows: [
      ['print("текст")', { ru: "вывести текст/значение", en: "print text/value" }],
      ["# комментарий", { ru: "комментарий (не исполняется)", en: "comment (not executed)" }],
      ["name = \"Аня\"", { ru: "создать переменную", en: "create a variable" }],
      ["a, b = 1, 2", { ru: "множественное присваивание", en: "parallel assignment" }],
      ["x += 1", { ru: "то же, что x = x + 1", en: "same as x = x + 1" }],
      ["_", { ru: "переменная-заглушка, значение не важно", en: "throwaway variable, value not needed" }],
      ["\\", { ru: "перенос длинной строки", en: "line continuation" }]
    ]
  },
  {
    title: { ru: "Типы данных", en: "Data types" },
    headers: [ "Код / Code", { ru: "Назначение", en: "Meaning" } ],
    rows: [
      ["int", { ru: "целое число: 42, -7", en: "integer: 42, -7" }],
      ["float", { ru: "дробное число: 3.14", en: "decimal number: 3.14" }],
      ["str", { ru: "строка: \"текст\"", en: "string: \"text\"" }],
      ["bool", { ru: "логическое: True / False", en: "boolean: True / False" }],
      ["None", { ru: "«нет значения»", en: "'no value'" }],
      ["list", { ru: "список: [1, 2, 3]", en: "list: [1, 2, 3]" }],
      ["dict", { ru: "словарь: {\"a\": 1}", en: "dictionary: {\"a\": 1}" }],
      ["tuple", { ru: "кортеж: (1, 2) — неизменяемый список", en: "tuple: (1, 2) — immutable list" }],
      ["set", { ru: "множество: {1, 2} — уникальные значения", en: "set: {1, 2} — unique values" }],
      ["type(x)", { ru: "узнать тип x", en: "get the type of x" }],
      ["isinstance(x, int)", { ru: "True, если x — int", en: "True if x is an int" }],
      ["int(\"42\")", { ru: "преобразовать в число", en: "convert to int" }],
      ["str(42)", { ru: "преобразовать в строку", en: "convert to string" }]
    ]
  },
  {
    title: { ru: "Операторы", en: "Operators" },
    headers: [ "Оператор / Operator", { ru: "Назначение", en: "Meaning" } ],
    rows: [
      ["+", { ru: "сложение / конкатенация", en: "addition / concatenation" }],
      ["-", { ru: "вычитание", en: "subtraction" }],
      ["*", { ru: "умножение / повторение", en: "multiplication / repetition" }],
      ["/", { ru: "деление (результат всегда float)", en: "division (always float)" }],
      ["//", { ru: "целочисленное деление", en: "floor division" }],
      ["%", { ru: "остаток от деления", en: "modulo (remainder)" }],
      ["**", { ru: "возведение в степень", en: "exponent" }],
      ["==", { ru: "равно", en: "equal to" }],
      ["!=", { ru: "не равно", en: "not equal" }],
      [">", { ru: "больше", en: "greater" }],
      ["<", { ru: "меньше", en: "less" }],
      [">=", { ru: "больше или равно", en: "greater or equal" }],
      ["<=", { ru: "меньше или равно", en: "less or equal" }],
      ["and / or / not", { ru: "логические «и», «или», «не»", en: "logical and / or / not" }],
      ["x in lst", { ru: "есть ли элемент в коллекции", en: "is x in the collection" }],
      ["x is y", { ru: "один и тот же объект", en: "the same object" }]
    ]
  },
  {
    title: { ru: "Строки: методы", en: "Strings: methods" },
    headers: [ "Метод / Method", { ru: "Назначение", en: "Meaning" }, { ru: "Пример", en: "Example" } ],
    rows: [
      ["s.upper() / s.lower()", { ru: "верхний / нижний регистр", en: "uppercase / lowercase" }, 's = "hi" → "HI"'],
      ["s.strip()", { ru: "убрать пробелы по краям", en: "strip edge whitespace" }, 's = "  x  " → "x"'],
      ["s.split(sep)", { ru: "разбить на список", en: "split into a list" }, '"a b".split() → ["a", "b"]'],
      ["glue.join(list)", { ru: "склеить список в строку", en: "join a list into a string" }, '"-".join(["a","b"]) → "a-b"'],
      ["s.replace(old, new)", { ru: "заменить подстроку", en: "replace a substring" }, '"abc".replace("b","B") → "aBc"'],
      ["s.find(sub)", { ru: "индекс подстроки или -1", en: "index of a substring or -1" }, '"abc".find("b") → 1'],
      ["s.count(sub)", { ru: "сколько раз встречается", en: "occurrence count" }, '"aaa".count("a") → 3'],
      ["s.startswith(p)", { ru: "начинается ли с p", en: "starts with p" }, '"py.py".endswith(".py") → True'],
      ["len(s)", { ru: "длина строки", en: "string length" }, "len('kitten') → 6"],
      ["f\"{x:.2f}\"", { ru: "форматирование числа", en: "number formatting" }, "f\"{3.14159:.2f}\" → '3.14'"],
      ["s[::-1]", { ru: "разворот строки", en: "reverse the string" }, '"ab" → "ba"']
    ]
  },
  {
    title: { ru: "Списки: методы", en: "Lists: methods" },
    headers: [ "Метод / Method", { ru: "Назначение", en: "Meaning" }, { ru: "Пример", en: "Example" } ],
    rows: [
      ["lst.append(x)", { ru: "добавить в конец", en: "append to the end" }, "[1].append(2) → [1, 2]"],
      ["lst.insert(i, x)", { ru: "вставить по индексу", en: "insert at index" }, "[1,3].insert(1,2) → [1,2,3]"],
      ["lst.extend(it)", { ru: "добавить все элементы", en: "add all items" }, "[1].extend([2,3]) → [1,2,3]"],
      ["lst.remove(x)", { ru: "удалить первый такой элемент", en: "remove first match" }, "[1,2,1].remove(1) → [2,1]"],
      ["lst.pop(i)", { ru: "забрать и вернуть элемент", en: "remove and return item" }, "[1,2,3].pop() → 3"],
      ["lst.sort()", { ru: "отсортировать на месте", en: "sort in place" }, "[3,1,2].sort() → [1,2,3]"],
      ["sorted(lst)", { ru: "вернуть отсортированную копию", en: "return a sorted copy" }, "sorted([3,1]) → [1,3]"],
      ["lst.reverse()", { ru: "развернуть на месте", en: "reverse in place" }, "[1,2,3].reverse() → [3,2,1]"],
      ["lst.index(x)", { ru: "индекс первого вхождения", en: "index of first match" }, "[2,5].index(5) → 1"],
      ["lst.count(x)", { ru: "сколько раз встречается", en: "occurrence count" }, "[1,1].count(1) → 2"],
      ["[x for x in it if c]", { ru: "генератор списка", en: "list comprehension" }, "[n*n for n in range(3)] → [0,1,4]"]
    ]
  },
  {
    title: { ru: "Словари: методы", en: "Dictionaries: methods" },
    headers: [ "Метод / Method", { ru: "Назначение", en: "Meaning" }, { ru: "Пример", en: "Example" } ],
    rows: [
      ['d = {"k": v}', { ru: "создать словарь", en: "create a dict" }, 'd = {"name": "Аня"}'],
      ['d["k"]', { ru: "получить значение (или KeyError)", en: "get value (or KeyError)" }, 'd["name"] → "Аня"'],
      ["d.get(k, dflt)", { ru: "значение или default", en: "value or default" }, 'd.get("age", 0) → 0'],
      ["k in d", { ru: "проверить наличие ключа", en: "check key presence" }, '"name" in d → True'],
      ["d.keys() / d.values()", { ru: "ключи / значения", en: "keys / values" }, "list(d.keys())"],
      ["d.items()", { ru: "пары (ключ, значение)", en: "(key, value) pairs" }, "for k, v in d.items()"],
      ["d.update(d2)", { ru: "добавить пары из другого словаря", en: "merge pairs from another dict" }, "d.update({\"x\": 1})"],
      ["del d[\"k\"]", { ru: "удалить ключ", en: "delete a key" }, "del d[\"x\"]"],
      ["d.pop(\"k\")", { ru: "удалить и вернуть значение", en: "remove and return value" }, "d.pop(\"x\")"]
    ]
  },
  {
    title: { ru: "Циклы", en: "Loops" },
    headers: [ "Код / Code", { ru: "Назначение", en: "Meaning" } ],
    rows: [
      ["for x in seq:", { ru: "перебрать элементы", en: "iterate items" }],
      ["for i in range(a, b, s):", { ru: "числа от a до b-1 с шагом s", en: "numbers a..b-1 step s" }],
      ["for i, v in enumerate(seq):", { ru: "перебрать с индексами", en: "iterate with indexes" }],
      ["for k, v in d.items():", { ru: "перебрать словарь", en: "iterate a dict" }],
      ["while cond:", { ru: "повторять, пока cond истинно", en: "repeat while cond is true" }],
      ["break", { ru: "немедленно выйти из цикла", en: "exit the loop now" }],
      ["continue", { ru: "перейти к следующей итерации", en: "jump to next iteration" }],
      ["else", { ru: "после цикла (если не было break)", en: "after the loop (if no break)" }]
    ]
  },
  {
    title: { ru: "Функции", en: "Functions" },
    headers: [ "Код / Code", { ru: "Назначение", en: "Meaning" } ],
    rows: [
      ["def name(a, b=1):", { ru: "определить функцию с параметром по умолчанию", en: "define a function with a default parameter" }],
      ["return value", { ru: "вернуть результат", en: "return a value" }],
      ["lambda x: x * 2", { ru: "анонимная функция (однострочная)", en: "anonymous one-line function" }],
      ["*args", { ru: "любое число позиционных аргументов", en: "any number of positional args" }],
      ["**kwargs", { ru: "любое число именованных аргументов", en: "any number of keyword args" }],
      ["\"\"\"docstring\"\"\"", { ru: "документация функции", en: "function documentation" }]
    ]
  },
  {
    title: { ru: "Файлы", en: "Files" },
    headers: [ "Код / Code", { ru: "Назначение", en: "Meaning" } ],
    rows: [
      ['f = open("x.txt", "r")', { ru: "открыть для чтения (подробнее с with)", en: "open for reading (see with)" }],
      ["with open(...) as f:", { ru: "контекстный менеджер — сам закроет файл", en: "context manager — closes the file for you" }],
      ["f.read()", { ru: "весь текст одним куском", en: "whole text at once" }],
      ["for line in f:", { ru: "построчно прочитать файл", en: "read the file line by line" }],
      ["f.write(s)", { ru: "записать строку", en: "write a string" }],
      ['"w"', { ru: "режим записи (перезапишет)", en: "write mode (overwrites)" }],
      ['"a"', { ru: "добавление в конец", en: "append to the end" }],
      ['"r+"', { ru: "чтение и запись", en: "read and write" }],
      ["encoding=\"utf-8\"", { ru: "кодировка — критично для кириллицы", en: "encoding — critical for Cyrillic" }]
    ]
  },
  {
    title: { ru: "Полезные функции и модули", en: "Handy functions and modules" },
    headers: [ "Код / Code", { ru: "Назначение", en: "Meaning" } ],
    rows: [
      ["range(a, b, s)", { ru: "последовательность чисел", en: "number sequence" }],
      ["len / sum / min / max", { ru: "длина, сумма, минимум, максимум", en: "length, sum, min, max" }],
      ["abs / round / pow", { ru: "модуль, округление, степень", en: "absolute, round, power" }],
      ["sorted / reversed", { ru: "сортировка и разворот копии", en: "sorted copy and reversal" }],
      ["zip(a, b)", { ru: "склеить пары элементов", en: "pair up elements" }],
      ["enumerate(seq)", { ru: "(индекс, элемент) пары", en: "(index, item) pairs" }],
      ["map(f, seq)", { ru: "применить f ко всем элементам", en: "apply f to every item" }],
      ["filter(pred, seq)", { ru: "оставить элементы по условию", en: "keep items matching pred" }],
      ["import math", { ru: "sqrt, floor, ceil, pi, fabs", en: "sqrt, floor, ceil, pi, fabs" }],
      ["import random", { ru: "randint, choice, shuffle, choice", en: "randint, choice, shuffle, sample" }],
      ["import datetime", { ru: "date.today(), datetime.now(), timedelta", en: "date.today(), datetime.now(), timedelta" }]
    ]
  },
  {
    title: { ru: "PEP 8: быстрые правила стиля", en: "PEP 8: quick style rules" },
    headers: [ "Правило / Rule", { ru: "Пример", en: "Example" } ],
    plainFirst: true,
    rows: [
      [ { ru: "отступ — 4 пробела (не табуляция)", en: "indent with 4 spaces (not tabs)" }, "if x:\n    print(x)" ],
      [ { ru: "переменные в нижнем регистре с _", en: "variables in lowercase with _" }, "user_age = 20" ],
      [ { ru: "имена классов — с большой буквы", en: "classes are CapitalizedWords" }, "class Dog:" ],
      [ { ru: "константы — капсом", en: "constants in UPPER_CASE" }, "MAX_SIZE = 100" ],
      [ { ru: "пробелы вокруг операторов", en: "spaces around operators" }, "a = b + c" ],
      [ { ru: "после запятой — пробел", en: "space after commas" }, 'f(1, 2, 3)' ],
      [ { ru: "импорты в начале файла", en: "imports at the top of the file" }, "import os" ],
      [ { ru: "две пустые строки между функциями/классами", en: "two blank lines between functions/classes" }, "def a():\n    pass\n\n\ndef b():\n    pass" ],
      [ { ru: "длина строки — до 79 символов", en: "lines up to 79 characters" }, "long_line = something_short(...)" ]
    ]
  }
];