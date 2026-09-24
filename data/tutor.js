(function () {
  "use strict";

  window.MENTOR_RNG = function (seed) {
    var s = (seed >>> 0) || 1;
    return function () {
      s ^= (s << 13) >>> 0;
      s ^= s >>> 17;
      s ^= (s << 5) >>> 0;
      s >>>= 0;
      return s / 4294967296;
    };
  };

  window.MENTOR_RINT = function (rng, lo, hi) {
    if (hi < lo) {
      var t = lo;
      lo = hi;
      hi = t;
    }
    return lo + Math.floor(rng() * (hi - lo + 1));
  };

  window.MENTOR_PICK = function (rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
  };

  function mentOp(a, b, op) {
    if (op === "+") { return a + b; }
    if (op === "-") { return a - b; }
    if (op === "*") { return a * b; }
    if (op === "%") { return a % b; }
    return Math.floor(a / b);
  }

  function mentLit(v) {
    if (typeof v === "string") {
      return "\"" + v + "\"";
    }
    return String(v);
  }

  window.MENTOR_UI = {
    ru: {
      navHome: "Главная",
      navTrain: "Тренажёр",
      navPlayground: "Песочница",
      navQuiz: "Квиз",
      navTeam: "Команда",
      brand: "AI Наставник",
      brandSub: "офлайн-тренер по программированию",
      homeHello: "Привет! Я твой офлайн-наставник по программированию. Начнём?",
      homeFeature1: "Пошаговые тренировки с проверкой кода",
      homeFeature2: "Песочница для экспериментов без интернета",
      homeFeature3: "Квизы для закрепления теории",
      homeFeature4: "Всё хранится локально — ничего не уходит в сеть",
      homePickLang: "Выбери язык, чтобы начать",
      langPython: "Python",
      langPythonDesc: "Лаконичный синтаксис — лучший выбор для старта.",
      langJavaScript: "JavaScript",
      langJavaScriptDesc: "Язык браузеров и Node.js: сайты, скрипты, игры.",
      langMore: "Больше языков",
      langMoreDesc: "Java, C#, Go и другие — в будущих обновлениях.",
      trainTitle: "Тренажёр",
      trainPickTopic: "Выбери тему",
      trainGenNew: "Новая задача",
      trainHint: "Подсказка",
      trainHideHint: "Скрыть подсказку",
      trainRun: "Выполнить",
      trainCheck: "Проверить",
      trainSpin: "Думаю...",
      trainGood: "Отлично! +{xp} XP",
      trainBad: "Пока неверно. Попробуй ещё раз.",
      trainYouOut: "Твой вывод:",
      trainExpectedOut: "Ожидалось:",
      trainLevelTitle: "Уровень:",
      tries: "попыток",
      streak: "подряд",
      playTitle: "Песочница",
      playSub: "Пиши код и запускай его прямо здесь.",
      playPlaceholder: "# Твой код...",
      playRun: "Выполнить",
      playOut: "Вывод:",
      playHint: "Совет: песочница работает полностью офлайн.",
      quizTitle: "Квиз",
      quizPick: "Выбери тему квиза",
      quizOk: "Верно!",
      quizNo: "Неверно.",
      quizResult: "Итог: {g} из {n} ({pct}%).",
      quizAgain: "Пройти ещё раз",
      teamTitle: "Наша команда",
      teamSub: "Агенты, которые помогают собирать этого наставника.",
      teamYourTeam: "Твои агенты",
      teamAgent: "Агент",
      teamTask: "Задача",
      teamStatus: "Статус",
      teamDone: "Готово",
      teamLog: "Журнал"
    },
    en: {
      navHome: "Home",
      navTrain: "Practice",
      navPlayground: "Playground",
      navQuiz: "Quiz",
      navTeam: "Team",
      brand: "AI Mentor",
      brandSub: "offline programming coach",
      homeHello: "Hi! I am your offline coding mentor. Shall we start?",
      homeFeature1: "Step-by-step practice with code checking",
      homeFeature2: "A playground for experiments with no internet",
      homeFeature3: "Quizzes to lock in the theory",
      homeFeature4: "Everything stays local, nothing goes to the network",
      homePickLang: "Pick a language to start",
      langPython: "Python",
      langPythonDesc: "Concise syntax — the best choice to begin.",
      langJavaScript: "JavaScript",
      langJavaScriptDesc: "The language of browsers and Node.js: sites, scripts, games.",
      langMore: "More languages",
      langMoreDesc: "Java, C#, Go and others — in future updates.",
      trainTitle: "Practice",
      trainPickTopic: "Pick a topic",
      trainGenNew: "New task",
      trainHint: "Hint",
      trainHideHint: "Hide hint",
      trainRun: "Run",
      trainCheck: "Check",
      trainSpin: "Thinking...",
      trainGood: "Great! +{xp} XP",
      trainBad: "Not quite. Try again.",
      trainYouOut: "Your output:",
      trainExpectedOut: "Expected:",
      trainLevelTitle: "Level:",
      tries: "attempts",
      streak: "in a row",
      playTitle: "Playground",
      playSub: "Write code and run it right here.",
      playPlaceholder: "# Your code...",
      playRun: "Run",
      playOut: "Output:",
      playHint: "Tip: the playground works fully offline.",
      quizTitle: "Quiz",
      quizPick: "Pick a quiz topic",
      quizOk: "Correct!",
      quizNo: "Wrong.",
      quizResult: "Score: {g} of {n} ({pct}%).",
      quizAgain: "Take again",
      teamTitle: "Our team",
      teamSub: "Agents that help build this mentor.",
      teamYourTeam: "Your agents",
      teamAgent: "Agent",
      teamTask: "Task",
      teamStatus: "Status",
      teamDone: "Done",
      teamLog: "Log"
    }
  };

  window.MENTOR_LANGS = [
    {
      id: "python",
      logo: "🐍",
      color: "#3fb950",
      monoName: "Python",
      topics: [
        {
          key: "py_vars",
          name: { ru: "Переменные и арифметика", en: "Variables & math" },
          level: 1,
          gen: function (rng, level) {
            var names = ["a", "b", "c", "x", "y", "total", "value"];
            var ops = ["+", "-", "*", "//"];
            var mode = window.MENTOR_RINT(rng, 1, 3);
            var lo = 1 + (level - 1) * 3;
            var hi = 9 + (level - 1) * 10;
            var name = window.MENTOR_PICK(rng, names);
            var name2;
            var n1 = window.MENTOR_RINT(rng, lo, hi);
            var n2 = window.MENTOR_RINT(rng, lo, hi);
            var op = window.MENTOR_PICK(rng, ops);
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              expected = mentOp(n1, n2, op);
              title = "Арифметика и print";
              descRu = "Выведи на экран результат выражения " + n1 + " " + op + " " + n2 + ". Оператор \"//\" — это целочисленное деление.";
              descEn = "Print the result of the expression " + n1 + " " + op + " " + n2 + ". Note: \"//\" means integer division.";
              solution = "print(" + n1 + " " + op + " " + n2 + ")";
              starterRu = "# TODO: выведи результат вычисления";
              starterJs = "# TODO: print the computed value";
              hintRu = "Готовая строка: print(" + n1 + " " + op + " " + n2 + ")";
              hintEn = "Ready line: print(" + n1 + " " + op + " " + n2 + ")";
            } else if (mode === 2) {
              do { name2 = window.MENTOR_PICK(rng, names); } while (name2 === name);
              expected = n1 + n2;
              title = "Сумма в переменных";
              descRu = "Запиши " + n1 + " в переменную " + name + ", а " + n2 + " — в " + name2 + ". Выведи их сумму через print().";
              descEn = "Store " + n1 + " in variable " + name + " and " + n2 + " in " + name2 + ". Print their sum with print().";
              solution = name + " = " + n1 + "\n" + name2 + " = " + n2 + "\nprint(" + name + " + " + name2 + ")";
              starterRu = "# TODO: создай переменные и сложи их";
              starterJs = "# TODO: create the variables and add them";
              hintRu = "Запиши числа в обе переменные, затем: print(" + name + " + " + name2 + ")";
              hintEn = "Store the numbers, then: print(" + name + " + " + name2 + ")";
            } else {
              op = "%";
              expected = mentOp(n1, n2, "%");
              title = "Остаток от деления";
              descRu = "Выведи остаток от деления " + n1 + " на " + n2 + " — в Python это оператор %.";
              descEn = "Print the remainder of " + n1 + " divided by " + n2 + " using the % operator.";
              solution = "print(" + n1 + " % " + n2 + ")";
              starterRu = "# TODO: выведи остаток от деления";
              starterJs = "# TODO: print the remainder";
              hintRu = "Готовая строка: print(" + n1 + " % " + n2 + ")";
              hintEn = "Ready line: print(" + n1 + " % " + n2 + ")";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "py_str",
          name: { ru: "Строки", en: "Strings" },
          level: 1,
          gen: function (rng, level) {
            var words = ["world", "friend", "master", "coder", "class", "mentor", "team", "error", "hello", "python"];
            var mode = window.MENTOR_RINT(rng, 1, 3);
            var w1 = window.MENTOR_PICK(rng, words);
            var w2 = window.MENTOR_PICK(rng, words);
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              expected = "Hello, " + w1 + "!";
              title = "Сборка строки";
              descRu = "Собери строку из трёх частей: \"Hello, \" + слово \"" + w1 + "\" + \"!\". Сохрани её в переменную text и выведи через print().";
              descEn = "Build a string from three parts: \"Hello, \" plus the word \"" + w1 + "\" plus \"!\". Store it in a variable text and print it.";
              solution = "text = \"Hello, \" + \"" + w1 + "\" + \"!\"\nprint(text)";
              starterRu = "# TODO: собери строку в переменную text";
              starterJs = "# TODO: build the string into a variable text";
              hintRu = "Склеивай части оператором +: text = \"Hello, \" + \"" + w1 + "\" + \"!\"";
              hintEn = "Join the parts with +: text = \"Hello, \" + \"" + w1 + "\" + \"!\"";
            } else if (mode === 2) {
              expected = String(w2.length);
              title = "Длина строки";
              descRu = "Сколько символов в слове \"" + w2 + "\"? Сохрани его в переменную word и выведи len(word).";
              descEn = "How many characters are in the word \"" + w2 + "\"? Store it in a variable word and print len(word).";
              solution = "word = \"" + w2 + "\"\nprint(len(word))";
              starterRu = "# TODO: сохрани слово в word и выведи его длину";
              starterJs = "# TODO: store the word in word and print its length";
              hintRu = "Сначала word = \"" + w2 + "\", затем готовая строка: print(len(word))";
              hintEn = "First word = \"" + w2 + "\", then the ready line: print(len(word))";
            } else {
              expected = w1.toUpperCase();
              title = "Верхний регистр";
              descRu = "Выведи слово \"" + w1 + "\" в верхнем регистре. Метод строк в Python — .upper().";
              descEn = "Print the word \"" + w1 + "\" in uppercase. The Python string method is .upper().";
              solution = "word = \"" + w1 + "\"\nprint(word.upper())";
              starterRu = "# TODO: сохрани слово в word и выведи word.upper()";
              starterJs = "# TODO: store the word in word and print word.upper()";
              hintRu = "Сначала word = \"" + w1 + "\", затем готовая строка: print(word.upper())";
              hintEn = "First word = \"" + w1 + "\", then the ready line: print(word.upper())";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "py_if",
          name: { ru: "Условия", en: "Conditions" },
          level: 1,
          gen: function (rng, level) {
            var mode = window.MENTOR_RINT(rng, 1, 3);
            var lo = 1 + (level - 1) * 4;
            var hi = 10 + (level - 1) * 20;
            var n = window.MENTOR_RINT(rng, lo, hi);
            var t = window.MENTOR_RINT(rng, lo, hi);
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              expected = (n % 2 === 0) ? "Even" : "Odd";
              title = "Чёт или нечет";
              descRu = "Проверь число " + n + ": если оно чётное, выведи \"Even\", иначе выведи \"Odd\". Проверку делай через % 2.";
              descEn = "Check " + n + ": if it is even, print \"Even\", otherwise print \"Odd\". Use the % 2 check.";
              solution = "n = " + n + "\nif n % 2 == 0:\n    print(\"Even\")\nelse:\n    print(\"Odd\")";
              starterRu = "# TODO: напиши условие if/else";
              starterJs = "# TODO: write the if/else condition";
              hintRu = "Условие n % 2 == 0 укажи в if.";
              hintEn = "Put the condition n % 2 == 0 into the if.";
            } else if (mode === 2) {
              expected = (n > t) ? "True" : "False";
              title = "Сравнение чисел";
              descRu = "Выведи True, если " + n + " больше " + t + ", иначе выведи False. Используй if и else.";
              descEn = "Print True if " + n + " is greater than " + t + ", otherwise print False. Use if and else.";
              solution = "n = " + n + "\nt = " + t + "\nif n > t:\n    print(\"True\")\nelse:\n    print(\"False\")";
              starterRu = "# TODO: напиши условие сравнения";
              starterJs = "# TODO: write the comparison";
              hintRu = "Сравни n и t оператором >.";
              hintEn = "Compare n and t with >.";
            } else {
              n = window.MENTOR_RINT(rng, -hi, hi);
              if (n === 0) { n = 1; }
              expected = (n > 0) ? "positive" : "negative";
              title = "Знак числа";
              descRu = "Выведи \"positive\", если число " + n + " положительное, и \"negative\", если отрицательное.";
              descEn = "Print \"positive\" if the number " + n + " is positive and \"negative\" if it is negative.";
              solution = "n = " + n + "\nif n > 0:\n    print(\"positive\")\nelse:\n    print(\"negative\")";
              starterRu = "# TODO: определи знак числа";
              starterJs = "# TODO: determine the sign of the number";
              hintRu = "Достаточно условия n > 0.";
              hintEn = "The condition n > 0 is enough.";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "py_loop",
          name: { ru: "Циклы", en: "Loops" },
          level: 2,
          gen: function (rng, level) {
            var mode = window.MENTOR_RINT(rng, 1, 3);
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              var n = window.MENTOR_RINT(rng, 4, 6 + level * 3);
              expected = n * (n + 1) / 2;
              title = "Сумма диапазона";
              descRu = "Посчитай сумму всех целых чисел от 1 до " + n + " включительно и выведи её. Используй цикл for и переменную-сумматор.";
              descEn = "Sum all integers from 1 to " + n + " inclusive and print it. Use a for loop and an accumulator.";
              solution = "s = 0\nfor i in range(1, " + (n + 1) + "):\n    s += i\nprint(s)";
              starterRu = "s = 0\n# TODO: напиши цикл, который прибавляет i к s\nprint(s)";
              starterJs = "s = 0\n# TODO: write a loop that adds i to s\nprint(s)";
              hintRu = "Цикл range(1, " + (n + 1) + ") перебирает нужные числа, внутри делай s += i.";
              hintEn = "A loop range(1, " + (n + 1) + ") iterates the numbers; inside do s += i.";
            } else if (mode === 2) {
              var f = window.MENTOR_RINT(rng, 3, 4 + level);
              expected = 1;
              var i;
              for (i = 2; i <= f; i++) { expected = expected * i; }
              title = "Факториал";
              descRu = "Вычисли факториал числа " + f + " — произведение всех целых чисел от 1 до " + f + " — и выведи результат.";
              descEn = "Compute the factorial of " + f + " — the product of all integers from 1 to " + f + " — and print it.";
              solution = "f = 1\nfor i in range(1, " + (f + 1) + "):\n    f *= i\nprint(f)";
              starterRu = "f = 1\n# TODO: перемножь в цикле f на каждое i\nprint(f)";
              starterJs = "f = 1\n# TODO: multiply f by each i in a loop\nprint(f)";
              hintRu = "В цикле нужно f *= i, а range(1, " + (f + 1) + ") даст все множители.";
              hintEn = "Inside the loop do f *= i; range(1, " + (f + 1) + ") yields all factors.";
            } else {
              var m = window.MENTOR_RINT(rng, 5, 7 + level * 3);
              expected = 0;
              var k;
              for (k = 0; k < m; k++) {
                if (k % 2 === 0) { expected += k; }
              }
              title = "Сумма чётных";
              descRu = "Найди сумму всех чётных чисел в диапазоне range(0, " + m + ") (числа 0.." + (m - 1) + ") и выведи её.";
              descEn = "Find the sum of all even numbers in range(0, " + m + ") (numbers 0.." + (m - 1) + ") and print it.";
              solution = "s = 0\nfor i in range(0, " + m + "):\n    if i % 2 == 0:\n        s += i\nprint(s)";
              starterRu = "s = 0\n# TODO: пройдись по range(0, " + m + ") и прибавь только чётные\nprint(s)";
              starterJs = "s = 0\n# TODO: iterate range(0, " + m + ") and add only even numbers\nprint(s)";
              hintRu = "Внутри цикла проверяй if i % 2 == 0 и тогда делай s += i.";
              hintEn = "Inside the loop check if i % 2 == 0 and then do s += i.";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "py_list",
          name: { ru: "Списки", en: "Lists" },
          level: 2,
          gen: function (rng, level) {
            var len = 3 + level;
            var nums = [];
            var sum = 0;
            var mx = 0;
            var i;
            var mode = window.MENTOR_RINT(rng, 1, 3);
            for (i = 0; i < len; i++) {
              nums[i] = window.MENTOR_RINT(rng, 1, 15 + level * 8);
              sum += nums[i];
              if (nums[i] > mx) { mx = nums[i]; }
            }
            var lit = "[" + nums.join(", ") + "]";
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              expected = sum;
              title = "Сумма списка";
              descRu = "Дан список: " + lit + ". Посчитай сумму всех его элементов циклом for и выведи её через print().";
              descEn = "Given the list: " + lit + " — sum all its elements with a for loop and print it.";
              starterRu = "arr = " + lit + "\ns = 0\n# TODO: прибавь к s каждый элемент arr\nprint(s)";
              starterJs = "arr = " + lit + "\ns = 0\n# TODO: add every element of arr to s\nprint(s)";
              hintRu = "Цикл for v in arr:, внутри тело s += v.";
              hintEn = "Loop: for v in arr:, inside do s += v.";
              solution = "for v in arr:\n    s += v\nprint(s)";
            } else if (mode === 2) {
              expected = mx;
              title = "Максимум списка";
              descRu = "Дан список: " + lit + ". Найди его максимальный элемент циклом for (начни с mx = arr[0]) и выведи его.";
              descEn = "Given the list: " + lit + " — find its maximum with a for loop (start with mx = arr[0]) and print it.";
              starterRu = "arr = " + lit + "\nmx = arr[0]\n# TODO: найди максимальный элемент\nprint(mx)";
              starterJs = "arr = " + lit + "\nmx = arr[0]\n# TODO: find the maximum element\nprint(mx)";
              hintRu = "Иди по списку: if v > mx: mx = v.";
              hintEn = "Iterate the list: if v > mx then mx = v.";
              solution = "for v in arr:\n    if v > mx:\n        mx = v\nprint(mx)";
            } else {
              expected = nums[0] + nums[len - 1];
              title = "Первый и последний";
              descRu = "Дан список: " + lit + ". Выведи сумму его первого и последнего элементов через arr[0] и arr[len(arr) - 1].";
              descEn = "Given the list: " + lit + " — print the sum of its first and last items via arr[0] and arr[len(arr) - 1].";
              starterRu = "arr = " + lit + "\n# TODO: выведи сумму первого и последнего элементов";
              starterJs = "arr = " + lit + "\n# TODO: print the sum of the first and last items";
              hintRu = "Готовая строка: print(arr[0] + arr[len(arr) - 1]).";
              hintEn = "Ready line: print(arr[0] + arr[len(arr) - 1]).";
              solution = "print(arr[0] + arr[len(arr) - 1])";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "py_func",
          name: { ru: "Функции", en: "Functions" },
          level: 2,
          gen: function (rng, level) {
            var mode = window.MENTOR_RINT(rng, 1, 3);
            var lo = 1 + (level - 1) * 3;
            var hi = 8 + (level - 1) * 10;
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              var a = window.MENTOR_RINT(rng, lo, hi);
              expected = a * 2;
              title = "Функция-удвоитель";
              descRu = "Определи функцию twice(n), которая возвращает n * 2. Затем выведи результат вызова twice(" + a + ").";
              descEn = "Define a function twice(n) that returns n * 2. Then print the result of twice(" + a + ").";
              solution = "def twice(n):\n    return n * 2\n\nprint(twice(" + a + "))";
              starterRu = "def twice(n):\n    # TODO: верни n * 2\n\nprint(twice(" + a + "))";
              starterJs = "def twice(n):\n    # TODO: return n * 2\n\nprint(twice(" + a + "))";
              hintRu = "Внутри функции достаточно одной строки: return n * 2.";
              hintEn = "Inside the function one line is enough: return n * 2.";
            } else if (mode === 2) {
              var x = window.MENTOR_RINT(rng, lo, hi);
              var y = window.MENTOR_RINT(rng, lo, hi);
              expected = x * y;
              title = "Функция-умножитель";
              descRu = "Определи функцию mul(a, b), которая возвращает a * b. Затем выведи результат вызова mul(" + x + ", " + y + ").";
              descEn = "Define a function mul(a, b) that returns a * b. Then print the result of mul(" + x + ", " + y + ").";
              solution = "def mul(a, b):\n    return a * b\n\nprint(mul(" + x + ", " + y + "))";
              starterRu = "def mul(a, b):\n    # TODO: верни a * b\n\nprint(mul(" + x + ", " + y + "))";
              starterJs = "def mul(a, b):\n    # TODO: return a * b\n\nprint(mul(" + x + ", " + y + "))";
              hintRu = "Внутри функции пиши return a * b.";
              hintEn = "Inside the function write return a * b.";
            } else {
              var v = window.MENTOR_RINT(rng, lo, hi);
              expected = (v % 2 === 0) ? "Even" : "Odd";
              title = "Функция чётности";
              descRu = "Определи функцию even(n): если n чётное, она возвращает \"Even\", иначе \"Odd\". Выведи результат even(" + v + ").";
              descEn = "Define even(n): if n is even it returns \"Even\", otherwise \"Odd\". Print the result of even(" + v + ").";
              solution = "def even(n):\n    if n % 2 == 0:\n        return \"Even\"\n    return \"Odd\"\n\nprint(even(" + v + "))";
              starterRu = "def even(n):\n    # TODO: верни \"Even\" или \"Odd\"\n\nprint(even(" + v + "))";
              starterJs = "def even(n):\n    # TODO: return \"Even\" or \"Odd\"\n\nprint(even(" + v + "))";
              hintRu = "Если n % 2 == 0 верни \"Even\", иначе \"Odd\".";
              hintEn = "If n % 2 == 0 return \"Even\", otherwise \"Odd\".";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "py_dict",
          name: { ru: "Словари", en: "Dictionaries" },
          level: 3,
          gen: function (rng, level) {
            var pool = ["name", "age", "score", "level", "power"];
            var kc = 2 + window.MENTOR_RINT(rng, 0, 2);
            var used = [];
            var avail = pool.slice(0);
            var vals = {};
            var pairs = [];
            var j;
            var mode = window.MENTOR_RINT(rng, 1, 3);
            for (j = 0; j < kc; j++) {
              var pick = Math.floor(rng() * avail.length);
              var key = avail[pick];
              avail.splice(pick, 1);
              used.push(key);
              if (key === "name") {
                vals[key] = window.MENTOR_PICK(rng, ["Ada", "Bob", "Max", "Zoe"]);
              } else {
                vals[key] = window.MENTOR_RINT(rng, 1, 20 + level * 10);
              }
              pairs.push("\"" + key + "\": " + mentLit(vals[key]));
            }
            var lit = "{ " + pairs.join(", ") + " }";
            var target = window.MENTOR_PICK(rng, used);
            var numeric = [];
            for (j = 0; j < used.length; j++) {
              if (used[j] !== "name") { numeric.push(used[j]); }
            }
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              expected = String(vals[target]);
              title = "Чтение из словаря";
              descRu = "Дан словарь: " + lit + ". Выведи значение ключа \"" + target + "\" через print(d[\"" + target + "\"]).";
              descEn = "Given the dictionary: " + lit + " — print the value of the key \"" + target + "\" via print(d[\"" + target + "\"]).";
              solution = "print(d[\"" + target + "\"])";
              starterRu = "d = " + lit + "\n# TODO: выведи значение ключа \"" + target + "\"";
              starterJs = "d = " + lit + "\n# TODO: print the value of key \"" + target + "\"";
              hintRu = "Готовая строка: print(d[\"" + target + "\"]).";
              hintEn = "Ready line: print(d[\"" + target + "\"]).";
            } else if (mode === 2) {
              var newVal = window.MENTOR_RINT(rng, 1, 30 + level * 15);
              var tgt = numeric[Math.floor(rng() * numeric.length)];
              expected = String(newVal);
              title = "Обновление значения";
              descRu = "Дан словарь: " + lit + ". Запиши в ключ \"" + tgt + "\" число " + newVal + " и выведи его через print().";
              descEn = "Given the dictionary: " + lit + " — set the key \"" + tgt + "\" to " + newVal + " and print it.";
              solution = "d[\"" + tgt + "\"] = " + newVal + "\nprint(d[\"" + tgt + "\"])";
              starterRu = "d = " + lit + "\n# TODO: обнови ключ \"" + tgt + "\" и выведи его";
              starterJs = "d = " + lit + "\n# TODO: update the key \"" + tgt + "\" and print it";
              hintRu = "Присвой новое значение: d[\"" + tgt + "\"] = " + newVal + ".";
              hintEn = "Assign the new value: d[\"" + tgt + "\"] = " + newVal + ".";
            } else {
              expected = String(kc);
              title = "Число ключей";
              descRu = "Дан словарь: " + lit + ". Выведи, сколько в нём ключей, через len(d).";
              descEn = "Given the dictionary: " + lit + " — print how many keys it has using len(d).";
              solution = "print(len(d))";
              starterRu = "d = " + lit + "\n# TODO: выведи число ключей в d";
              starterJs = "d = " + lit + "\n# TODO: print the number of keys in d";
              hintRu = "Готовая строка: print(len(d)).";
              hintEn = "Ready line: print(len(d)).";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: expected
            };
          }
        }
      ]
    },
    {
      id: "javascript",
      logo: "🌐",
      color: "#e8b93d",
      monoName: "JavaScript",
      topics: [
        {
          key: "js_vars",
          name: { ru: "Переменные и арифметика", en: "Variables & math" },
          level: 1,
          gen: function (rng, level) {
            var names = ["a", "b", "c", "x", "y", "res", "value"];
            var ops = ["+", "-", "*", "%"];
            var mode = window.MENTOR_RINT(rng, 1, 3);
            var lo = 1 + (level - 1) * 3;
            var hi = 9 + (level - 1) * 10;
            var name = window.MENTOR_PICK(rng, names);
            var name2;
            var n1 = window.MENTOR_RINT(rng, lo, hi);
            var n2 = window.MENTOR_RINT(rng, lo, hi);
            var op = window.MENTOR_PICK(rng, ops);
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              expected = mentOp(n1, n2, op);
              title = "Вывод вычисления";
              descRu = "Выведи результат выражения " + n1 + " " + op + " " + n2 + " через console.log().";
              descEn = "Print the result of the expression " + n1 + " " + op + " " + n2 + " via console.log().";
              solution = "console.log(" + n1 + " " + op + " " + n2 + ");";
              starterRu = "// TODO: выведи результат вычисления";
              starterJs = "// TODO: print the computed value";
              hintRu = "Готовая строка: console.log(" + n1 + " " + op + " " + n2 + ");";
              hintEn = "Ready line: console.log(" + n1 + " " + op + " " + n2 + ");";
            } else if (mode === 2) {
              do { name2 = window.MENTOR_PICK(rng, names); } while (name2 === name);
              expected = n1 + n2;
              title = "Сумма переменных";
              descRu = "Запиши " + n1 + " в переменную " + name + ", а " + n2 + " — в " + name2 + ". Выведи их сумму через console.log().";
              descEn = "Store " + n1 + " in " + name + " and " + n2 + " in " + name2 + ". Print their sum with console.log().";
              solution = "let " + name + " = " + n1 + ";\nlet " + name2 + " = " + n2 + ";\nconsole.log(" + name + " + " + name2 + ");";
              starterRu = "// TODO: объяви две переменные и сложи их";
              starterJs = "// TODO: declare two variables and add them";
              hintRu = "После объявления переменных: console.log(" + name + " + " + name2 + ").";
              hintEn = "After declaring the variables: console.log(" + name + " + " + name2 + ").";
            } else {
              op = "%";
              expected = mentOp(n1, n2, "%");
              title = "Остаток от деления";
              descRu = "Выведи остаток от деления " + n1 + " на " + n2 + " — в JavaScript это оператор %.";
              descEn = "Print the remainder of " + n1 + " divided by " + n2 + " using the % operator.";
              solution = "console.log(" + n1 + " % " + n2 + ");";
              starterRu = "// TODO: выведи остаток от деления";
              starterJs = "// TODO: print the remainder";
              hintRu = "Готовая строка: console.log(" + n1 + " % " + n2 + ");";
              hintEn = "Ready line: console.log(" + n1 + " % " + n2 + ");";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "js_str",
          name: { ru: "Строки", en: "Strings" },
          level: 1,
          gen: function (rng, level) {
            var words = ["world", "friend", "master", "coder", "class", "mentor", "team", "hello", "geek", "code"];
            var mode = window.MENTOR_RINT(rng, 1, 3);
            var w1 = window.MENTOR_PICK(rng, words);
            var w2 = window.MENTOR_PICK(rng, words);
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              expected = "Hello, " + w1 + "!";
              title = "Сборка строки";
              descRu = "Собери строку из трёх частей: \"Hello, \" + слово \"" + w1 + "\" + \"!\". Сохрани её в переменную text и выведи через console.log().";
              descEn = "Build a string from three parts: \"Hello, \" plus the word \"" + w1 + "\" plus \"!\". Store it in a variable text and print it.";
              solution = "let text = \"Hello, \" + \"" + w1 + "\" + \"!\";\nconsole.log(text);";
              starterRu = "// TODO: собери строку в переменную text и выведи её";
              starterJs = "// TODO: build the string into a variable text and print it";
              hintRu = "Склеивай части оператором + и заверши console.log(text).";
              hintEn = "Join the parts with + and finish with console.log(text).";
            } else if (mode === 2) {
              expected = String(w2.length);
              title = "Длина строки";
              descRu = "Сколько символов в слове \"" + w2 + "\"? Сохрани его в переменную word и выведи word.length.";
              descEn = "How many characters are in the word \"" + w2 + "\"? Store it in word and print word.length.";
              solution = "const word = \"" + w2 + "\";\nconsole.log(word.length);";
              starterRu = "// TODO: сохрани слово в word и выведи его длину";
              starterJs = "// TODO: store the word in word and print its length";
              hintRu = "Готовая строка: console.log(word.length).";
              hintEn = "Ready line: console.log(word.length).";
            } else {
              expected = w1.toUpperCase();
              title = "Верхний регистр";
              descRu = "Выведи слово \"" + w1 + "\" в верхнем регистре. Метод строк в JavaScript — .toUpperCase().";
              descEn = "Print the word \"" + w1 + "\" in uppercase. The JavaScript string method is .toUpperCase().";
              solution = "const word = \"" + w1 + "\";\nconsole.log(word.toUpperCase());";
              starterRu = "// TODO: сохрани слово в word и выведи word.toUpperCase()";
              starterJs = "// TODO: store the word in word and print word.toUpperCase()";
              hintRu = "Сначала const word = \"" + w1 + "\", затем готовая строка: console.log(word.toUpperCase()).";
              hintEn = "First const word = \"" + w1 + "\", then the ready line: console.log(word.toUpperCase()).";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "js_cond",
          name: { ru: "Условия", en: "Conditions" },
          level: 2,
          gen: function (rng, level) {
            var mode = window.MENTOR_RINT(rng, 1, 3);
            var lo = 1 + (level - 1) * 4;
            var hi = 10 + (level - 1) * 20;
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              var n = window.MENTOR_RINT(rng, lo, hi);
              expected = (n % 2 === 0) ? "Even" : "Odd";
              title = "Чёт или нечет";
              descRu = "Проверь число " + n + ": если оно чётное, выведи \"Even\", иначе — \"Odd\" через console.log().";
              descEn = "Check " + n + ": if it is even, print \"Even\", otherwise print \"Odd\", via console.log().";
              solution = "if (n % 2 === 0) {\n  console.log(\"Even\");\n} else {\n  console.log(\"Odd\");\n}";
              starterRu = "const n = " + n + ";\n// TODO: напиши if/else с console.log";
              starterJs = "const n = " + n + ";\n// TODO: write the if/else with console.log";
              hintRu = "Условие n % 2 === 0 укажи в if.";
              hintEn = "Put the condition n % 2 === 0 into the if.";
            } else if (mode === 2) {
              var a = window.MENTOR_RINT(rng, lo, hi);
              var b = window.MENTOR_RINT(rng, lo, hi);
              expected = (a > b) ? "true" : "false";
              title = "Сравнение чисел";
              descRu = "Выведи результат сравнения " + a + " > " + b + " через console.log().";
              descEn = "Print the result of the comparison " + a + " > " + b + " via console.log().";
              solution = "console.log(a > b);";
              starterRu = "const a = " + a + ";\nconst b = " + b + ";\n// TODO: выведи a > b";
              starterJs = "const a = " + a + ";\nconst b = " + b + ";\n// TODO: print a > b";
              hintRu = "Готовая строка: console.log(a > b).";
              hintEn = "Ready line: console.log(a > b).";
            } else {
              var v = window.MENTOR_RINT(rng, -hi, hi);
              if (v === 0) { v = 1; }
              expected = (v > 0) ? "positive" : "negative";
              title = "Знак числа";
              descRu = "Выведи \"positive\", если число " + v + " положительное, и \"negative\", если отрицательное.";
              descEn = "Print \"positive\" if the number " + v + " is positive and \"negative\" if it is negative.";
              solution = "if (n > 0) {\n  console.log(\"positive\");\n} else {\n  console.log(\"negative\");\n}";
              starterRu = "const n = " + v + ";\n// TODO: проверь знак числа";
              starterJs = "const n = " + v + ";\n// TODO: check the sign of the number";
              hintRu = "Достаточно условия n > 0.";
              hintEn = "The condition n > 0 is enough.";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "js_arrloop",
          name: { ru: "Массивы и циклы", en: "Arrays & loops" },
          level: 2,
          gen: function (rng, level) {
            var len = 3 + level;
            var nums = [];
            var sum = 0;
            var mx = 0;
            var evens = 0;
            var i;
            var mode = window.MENTOR_RINT(rng, 1, 3);
            for (i = 0; i < len; i++) {
              nums[i] = window.MENTOR_RINT(rng, 1, 15 + level * 8);
              sum += nums[i];
              if (nums[i] > mx) { mx = nums[i]; }
              if (nums[i] % 2 === 0) { evens++; }
            }
            var lit = "[" + nums.join(", ") + "]";
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              expected = sum;
              title = "Сумма массива";
              descRu = "Дан массив: " + lit + ". Посчитай сумму его элементов циклом for и выведи её через console.log().";
              descEn = "Given the array: " + lit + " — sum its elements with a for loop and print it via console.log().";
              solution = "for (let i = 0; i < arr.length; i++) {\n  s += arr[i];\n}";
              starterRu = "const arr = " + lit + ";\nlet s = 0;\n// TODO: пройдись по массиву и прибавь каждый элемент\nconsole.log(s);";
              starterJs = "const arr = " + lit + ";\nlet s = 0;\n// TODO: iterate the array and add each element\nconsole.log(s);";
              hintRu = "Цикл: for (let i = 0; i < arr.length; i++) { s += arr[i]; }";
              hintEn = "Loop: for (let i = 0; i < arr.length; i++) { s += arr[i]; }";
            } else if (mode === 2) {
              expected = mx;
              title = "Максимум массива";
              descRu = "Дан массив: " + lit + ". Найди его максимальный элемент циклом for (начни с mx = arr[0]) и выведи его.";
              descEn = "Given the array: " + lit + " — find its maximum with a for loop (start with mx = arr[0]) and print it.";
              solution = "for (let i = 0; i < arr.length; i++) {\n  if (arr[i] > mx) {\n    mx = arr[i];\n  }\n}";
              starterRu = "const arr = " + lit + ";\nlet mx = arr[0];\n// TODO: найди максимальный элемент\nconsole.log(mx);";
              starterJs = "const arr = " + lit + ";\nlet mx = arr[0];\n// TODO: find the maximum element\nconsole.log(mx);";
              hintRu = "Проверяй в цикле: if (arr[i] > mx) mx = arr[i];";
              hintEn = "In the loop check: if (arr[i] > mx) mx = arr[i];";
            } else {
              expected = evens;
              title = "Чётные элементы";
              descRu = "Дан массив: " + lit + ". Посчитай, сколько в нём чётных элементов, и выведи количество.";
              descEn = "Given the array: " + lit + " — count how many elements are even and print the count.";
              solution = "for (let i = 0; i < arr.length; i++) {\n  if (arr[i] % 2 === 0) {\n    c++;\n  }\n}";
              starterRu = "const arr = " + lit + ";\nlet c = 0;\n// TODO: посчитай чётные элементы\nconsole.log(c);";
              starterJs = "const arr = " + lit + ";\nlet c = 0;\n// TODO: count the even elements\nconsole.log(c);";
              hintRu = "Прибавляй к счётчику только, когда arr[i] % 2 === 0.";
              hintEn = "Increment the counter only when arr[i] % 2 === 0.";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "js_func",
          name: { ru: "Функции", en: "Functions" },
          level: 2,
          gen: function (rng, level) {
            var mode = window.MENTOR_RINT(rng, 1, 3);
            var lo = 1 + (level - 1) * 3;
            var hi = 8 + (level - 1) * 10;
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              var a = window.MENTOR_RINT(rng, lo, hi);
              expected = a * 2;
              title = "Функция-удвоитель";
              descRu = "Определи функцию twice(n), которая возвращает n * 2. Затем выведи результат вызова twice(" + a + ").";
              descEn = "Define a function twice(n) that returns n * 2. Then print the result of twice(" + a + ").";
              solution = "function twice(n) {\n  return n * 2;\n}\nconsole.log(twice(" + a + "));";
              starterRu = "function twice(n) {\n  // TODO: верни n * 2\n}\nconsole.log(twice(" + a + "));";
              starterJs = "function twice(n) {\n  // TODO: return n * 2\n}\nconsole.log(twice(" + a + "));";
              hintRu = "Внутри функции достаточно одной строки: return n * 2;";
              hintEn = "Inside the function one line is enough: return n * 2;";
            } else if (mode === 2) {
              var x = window.MENTOR_RINT(rng, lo, hi);
              var y = window.MENTOR_RINT(rng, lo, hi);
              expected = x * y;
              title = "Функция-умножитель";
              descRu = "Определи функцию mul(a, b), которая возвращает a * b. Затем выведи результат вызова mul(" + x + ", " + y + ").";
              descEn = "Define a function mul(a, b) that returns a * b. Then print the result of mul(" + x + ", " + y + ").";
              solution = "function mul(a, b) {\n  return a * b;\n}\nconsole.log(mul(" + x + ", " + y + "));";
              starterRu = "function mul(a, b) {\n  // TODO: верни a * b\n}\nconsole.log(mul(" + x + ", " + y + "));";
              starterJs = "function mul(a, b) {\n  // TODO: return a * b\n}\nconsole.log(mul(" + x + ", " + y + "));";
              hintRu = "Внутри функции пиши return a * b;";
              hintEn = "Inside the function write return a * b;";
            } else {
              var v = window.MENTOR_RINT(rng, lo, hi);
              expected = (v % 2 === 0) ? "Even" : "Odd";
              title = "Функция чётности";
              descRu = "Определи функцию even(n): если n чётное, она возвращает \"Even\", иначе \"Odd\". Выведи результат even(" + v + ").";
              descEn = "Define even(n): if n is even it returns \"Even\", otherwise \"Odd\". Print the result of even(" + v + ").";
              solution = "function even(n) {\n  if (n % 2 === 0) {\n    return \"Even\";\n  }\n  return \"Odd\";\n}\nconsole.log(even(" + v + "));";
              starterRu = "function even(n) {\n  // TODO: верни \"Even\" или \"Odd\"\n}\nconsole.log(even(" + v + "));";
              starterJs = "function even(n) {\n  // TODO: return \"Even\" or \"Odd\"\n}\nconsole.log(even(" + v + "));";
              hintRu = "Если n % 2 === 0 верни \"Even\", иначе \"Odd\".";
              hintEn = "If n % 2 === 0 return \"Even\", otherwise \"Odd\".";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: String(expected)
            };
          }
        },
        {
          key: "js_obj",
          name: { ru: "Объекты", en: "Objects" },
          level: 3,
          gen: function (rng, level) {
            var pool = ["name", "age", "score", "level", "power"];
            var kc = 2 + window.MENTOR_RINT(rng, 0, 2);
            var used = [];
            var avail = pool.slice(0);
            var vals = {};
            var pairs = [];
            var j;
            var mode = window.MENTOR_RINT(rng, 1, 3);
            for (j = 0; j < kc; j++) {
              var pick = Math.floor(rng() * avail.length);
              var key = avail[pick];
              avail.splice(pick, 1);
              used.push(key);
              if (key === "name") {
                vals[key] = window.MENTOR_PICK(rng, ["Ada", "Bob", "Max", "Zoe"]);
              } else {
                vals[key] = window.MENTOR_RINT(rng, 1, 20 + level * 10);
              }
              pairs.push(key + ": " + mentLit(vals[key]));
            }
            var lit = "{ " + pairs.join(", ") + " }";
            var target = window.MENTOR_PICK(rng, used);
            var numeric = [];
            for (j = 0; j < used.length; j++) {
              if (used[j] !== "name") { numeric.push(used[j]); }
            }
            var title, descRu, descEn, starterRu, starterJs, hintRu, hintEn, solution, expected;

            if (mode === 1) {
              expected = String(vals[target]);
              title = "Чтение свойства";
              descRu = "Дан объект: " + lit + ". Выведи значение свойства \"" + target + "\" через console.log(obj." + target + ").";
              descEn = "Given the object: " + lit + " — print the value of the property \"" + target + "\" via console.log(obj." + target + ").";
              solution = "console.log(obj." + target + ");";
              starterRu = "const obj = " + lit + ";\n// TODO: выведи значение obj." + target;
              starterJs = "const obj = " + lit + ";\n// TODO: print the value of obj." + target;
              hintRu = "Готовая строка: console.log(obj." + target + ");";
              hintEn = "Ready line: console.log(obj." + target + ");";
            } else if (mode === 2) {
              var newVal = window.MENTOR_RINT(rng, 1, 30 + level * 15);
              var tgt = numeric[Math.floor(rng() * numeric.length)];
              expected = String(newVal);
              title = "Обновление свойства";
              descRu = "Дан объект: " + lit + ". Запиши в свойство \"" + tgt + "\" число " + newVal + " и выведи его.";
              descEn = "Given the object: " + lit + " — set the property \"" + tgt + "\" to " + newVal + " and print it.";
              solution = "obj." + tgt + " = " + newVal + ";\nconsole.log(obj." + tgt + ");";
              starterRu = "const obj = " + lit + ";\n// TODO: обнови obj." + tgt + " и выведи его";
              starterJs = "const obj = " + lit + ";\n// TODO: update obj." + tgt + " and print it";
              hintRu = "Присвой новое значение: obj." + tgt + " = " + newVal + ";";
              hintEn = "Assign the new value: obj." + tgt + " = " + newVal + ";";
            } else {
              expected = String(kc);
              title = "Число свойств";
              descRu = "Дан объект: " + lit + ". Выведи, сколько в нём свойств, через Object.keys(obj).length.";
              descEn = "Given the object: " + lit + " — print how many properties it has using Object.keys(obj).length.";
              solution = "console.log(Object.keys(obj).length);";
              starterRu = "const obj = " + lit + ";\n// TODO: выведи число свойств объекта";
              starterJs = "const obj = " + lit + ";\n// TODO: print the number of properties";
              hintRu = "Готовая строка: console.log(Object.keys(obj).length);";
              hintEn = "Ready line: console.log(Object.keys(obj).length);";
            }

            return {
              title: title,
              descRu: descRu,
              descEn: descEn,
              starterRu: starterRu,
              starterJs: starterJs,
              hintRu: hintRu,
              hintEn: hintEn,
              expected: expected
            };
          }
        }
      ]
    }
  ];
})();