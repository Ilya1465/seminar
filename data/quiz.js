window.QUIZ = [
 {
   id: 1,
   question: {
     ru: "Какой тип у значения 3.14?",
     en: "What type is the value 3.14?"
   },
   options: [
     { ru: "int", en: "int" },
     { ru: "float", en: "float" },
     { ru: "str", en: "str" },
     { ru: "decimal", en: "decimal" }
   ],
   answer: 1,
   explanation: {
     ru: "Значения с дробной частью — тип float (числа с плавающей точкой).",
     en: "Values with a fractional part are of type float (floating-point numbers)."
   }
 },
 {
   id: 2,
   question: {
     ru: "Что выведет print(2 ** 3)?",
     en: "What does print(2 ** 3) output?"
   },
   options: [ "6", "8", "9", "2.3" ],
   answer: 1,
   explanation: {
     ru: "** — возведение в степень, 2 ** 3 = 2·2·2 = 8.",
     en: "** means 'to the power of', 2 ** 3 = 2·2·2 = 8."
   }
 },
 {
   id: 3,
   question: {
     ru: "Что выведет print(10 // 3)?",
     en: "What does print(10 // 3) output?"
   },
   options: [ "3.33", "3.0", "3", "1" ],
   answer: 2,
   explanation: {
     ru: "// — целочисленное деление: 10 // 3 = 3 (дробная часть отбрасывается, тип int).",
     en: "// is floor division: 10 // 3 = 3 (the fractional part is dropped, type int)."
   }
 },
 {
   id: 4,
   question: {
     ru: "Что выведет print(\"Py\" + \"thon\")?",
     en: "What does print(\"Py\" + \"thon\") output?"
   },
   options: [ "Py thon", "Python", "Ошибка", "Pyton" ],
   answer: 1,
   explanation: {
     ru: "+ для строк — конкатенация (склейка): \"Py\" + \"thon\" = \"Python\".",
     en: "+ on strings is concatenation: \"Py\" + \"thon\" = \"Python\"."
   }
 },
 {
   id: 5,
   question: {
     ru: "Что выведет print(f\"{3 + 4}\")?",
     en: "What does print(f\"{3 + 4}\") output?"
   },
   options: [ "3 + 4", "{3 + 4}", "7", "'7'" ],
   answer: 2,
   explanation: {
     ru: "В f-строке фигурные скобки заменяются значением выражения: {3+4} → 7.",
     en: "In an f-string, braces are replaced with the value of the expression: {3+4} → 7."
   }
 },
 {
   id: 6,
   question: {
     ru: "Что выведет print(\"Программирование\"[0:4])?",
     en: "What does print(\"Программирование\"[0:4]) output?"
   },
   options: [ "Програм", "Прог", "горам", "Пгрм" ],
   answer: 1,
   explanation: {
     ru: "Срез [0:4] берёт символы с индекса 0 по 3 включительно (4-й не включается): «Прог».",
     en: "The slice [0:4] takes indexes 0 through 3 (4 excluded): 'Прог'."
   }
 },
 {
   id: 7,
   question: {
     ru: "Что выведет этот код?\n\nx = 5\nif x > 3:\n    print(\"большой\")\nelse:\n    print(\"малый\")",
     en: "What does this code output?\n\nx = 5\nif x > 3:\n    print(\"big\")\nelse:\n    print(\"small\")"
   },
   options: [ "малый / small", "большой / big", "малый, большой / small, big", "ничего / nothing" ],
   answer: 1,
   explanation: {
     ru: "5 > 3 — истина, значит выполняется блок if и печатается «большой».",
     en: "5 > 3 is true, so the if block runs and prints 'big'."
   }
 },
 {
   id: 8,
   question: {
     ru: "Чему равно not True?",
     en: "What is not True?"
   },
   options: [ "True", "False", "None", "0" ],
   answer: 1,
   explanation: {
     ru: "not инвертирует логическое значение: not True = False.",
     en: "not negates a boolean value: not True = False."
   }
 },
 {
   id: 9,
   question: {
     ru: "Чему равно True and False?",
     en: "What is True and False?"
   },
   options: [ "True", "False", "Ошибка / Error", "None" ],
   answer: 1,
   explanation: {
     ru: "and требует, чтобы оба были истинными: True and False = False.",
     en: "and requires both to be true: True and False = False."
   }
 },
 {
   id: 10,
   question: {
     ru: "Что выведет print([10, 20, 30][-1])?",
     en: "What does print([10, 20, 30][-1]) output?"
   },
   options: [ "10", "20", "30", "Ошибка / Error" ],
   answer: 2,
   explanation: {
     ru: "Отрицательный индекс -1 — это последний элемент списка: 30.",
     en: "The negative index -1 refers to the last list item: 30."
   }
 },
 {
   id: 11,
   question: {
     ru: "Что делает метод append() у списка?",
     en: "What does the list method append() do?"
   },
   options: [
     { ru: "удаляет последний элемент", en: "removes the last item" },
     { ru: "добавляет элемент в конец", en: "adds an item to the end" },
     { ru: "вставляет элемент в начало", en: "inserts an item at the beginning" },
     { ru: "сортирует список", en: "sorts the list" }
   ],
   answer: 1,
   explanation: {
     ru: "list.append(x) добавляет x в конец списка (изменяет список на месте).",
     en: "list.append(x) adds x to the end of the list (modifies the list in place)."
   }
 },
 {
   id: 12,
   question: {
     ru: "Что вернёт len([1, 2, 3])?",
     en: "What does len([1, 2, 3]) return?"
   },
   options: [ "3", "2", "4", "[1, 2, 3]" ],
   answer: 0,
   explanation: {
     ru: "len() возвращает количество элементов: 3.",
     en: "len() returns the number of items: 3."
   }
 },
 {
   id: 13,
   question: {
     ru: "Что выведет код?\n\nd = {\"a\": 1}\nprint(d[\"a\"])",
     en: "What does this code output?\n\nd = {\"a\": 1}\nprint(d[\"a\"])"
   },
   options: [ "a", "1", "{\"a\": 1}", "None" ],
   answer: 1,
   explanation: {
     ru: "d[\"a\"] — обращение к словарю по ключу, возвращает значение 1.",
     en: "d[\"a\"] accesses the dict by key and returns the value 1."
   }
 },
 {
   id: 14,
   question: {
     ru: "Что вернёт {\"a\": 1}.get(\"x\", 0)?",
     en: "What does {\"a\": 1}.get(\"x\", 0) return?"
   },
   options: [ "None", "1", "0", "Ошибка / Error" ],
   answer: 2,
   explanation: {
     ru: "Если ключа нет, .get() возвращает значение по умолчанию — в данном случае 0.",
     en: "If the key is missing, .get() returns the default value — here 0."
   }
 },
 {
   id: 15,
   question: {
     ru: "Сколько раз выполнится тело цикла?\n\nfor i in range(3):\n    print(i)",
     en: "How many times does the loop body run?\n\nfor i in range(3):\n    print(i)"
   },
   options: [ "2", "3", "4", "бесконечно / forever" ],
   answer: 1,
   explanation: {
     ru: "range(3) даёт числа 0, 1, 2 — три итерации.",
     en: "range(3) yields 0, 1, 2 — three iterations."
   }
 },
 {
   id: 16,
   question: {
     ru: "Какие числа выведет for i in range(2, 10, 3)?",
     en: "Which numbers does for i in range(2, 10, 3) print?"
   },
   options: [ "2, 3, 4", "2, 5, 8", "2, 5, 8, 11", "3, 6, 9" ],
   answer: 1,
   explanation: {
     ru: "range(2, 10, 3) — от 2 до 9 с шагом 3: 2, 5, 8.",
     en: "range(2, 10, 3) is from 2 up to 9 with step 3: 2, 5, 8."
   }
 },
 {
   id: 17,
   question: {
     ru: "Что возвращает функция, в которой нет return?",
     en: "What does a function without a return statement return?"
   },
   options: [ "0", "False", "None", "Ошибка / Error" ],
   answer: 2,
   explanation: {
     ru: "Если функция не доходит до return, она возвращает None (неявно).",
     en: "If a function never reaches a return statement, it returns None implicitly."
   }
 },
 {
   id: 18,
   question: {
     ru: "Что выведет код?\n\ndef mul(a, b=2):\n    return a * b\n\nprint(mul(3))",
     en: "What does this code output?\n\ndef mul(a, b=2):\n    return a * b\n\nprint(mul(3))"
   },
   options: [ "3", "5", "6", "Ошибка / Error" ],
   answer: 2,
   explanation: {
     ru: "b не передан, поэтому используется значение по умолчанию b=2: 3·2 = 6.",
     en: "b is not passed, so the default b=2 is used: 3·2 = 6."
   }
 },
 {
   id: 19,
   question: {
     ru: "Какое исключение возникнет при int(\"abc\")?",
     en: "Which exception is raised by int(\"abc\")?"
   },
   options: [ "TypeError", "ValueError", "KeyError", "IndexError" ],
   answer: 1,
   explanation: {
     ru: "Строка не является числом — возникает ValueError (неверное значение).",
     en: "The string is not a number — ValueError (invalid value) is raised."
   }
 },
 {
   id: 20,
   question: {
     ru: "Какой метод вызывается автоматически при создании объекта?",
     en: "Which method runs automatically when an object is created?"
   },
   options: [ "__str__", "__init__", "__main__", "new_object" ],
   answer: 1,
   explanation: {
     ru: "Метод __init__ (конструктор) автоматически вызывается при создании экземпляра класса.",
     en: "__init__ (the constructor) is automatically called when an instance of a class is created."
   }
 }
];