/* ============================================================
   courses.js — файл Агента-B «Содержатель».
   Контент: каталог языков window.MENTOR_COURSES, ранги
   window.MENTOR_RANKS, онбординг window.MENTOR_ONBOARD и справка
   window.MENTOR_HELP. ES5, без стрелок/шаблонных строк, детерминизм
   задач через window.MENTOR_RNG / MENTOR_RINT / MENTOR_PICK
   из data/tutor.js. Кириллица в строках допускается.
   ============================================================ */
(function () {
  "use strict";

  var RINT = function (rng, lo, hi) { return window.MENTOR_RINT(rng, lo, hi); };
  var PICK = function (rng, a) { return window.MENTOR_PICK(rng, a); };

  function mk(title, desc, starter, hint, solution, expected, explain, runner) {
    return { title: title, desc: desc, starter: starter, hint: hint,
             solution: solution, expected: expected, explain: explain, runner: runner };
  }

  function brIf(ind, cond, a) {
    return "if (" + cond + ") {\n" + ind + a + "\n}";
  }
  function brIfE(ind, cond, a, b) {
    return "if (" + cond + ") {\n" + ind + a + "\n} else {\n" + ind + b + "\n}";
  }
  function brFor(ind, init, cond, step, body) {
    return "for (" + init + "; " + cond + "; " + step + ") {\n" + ind + body + "\n}";
  }
  function pyIfE(ind, cond, a, b) {
    return "if " + cond + ":\n" + ind + a + "\nelse:\n" + ind + b;
  }
  function pyIf(ind, cond, a) {
    return "if " + cond + ":\n" + ind + a;
  }
  function pyFor(ind, itr, body) {
    return "for " + itr + ":\n" + ind + body;
  }
  function ruIfE(ind, cond, a, b) {
    return "if " + cond + "\n" + ind + a + "\nelse\n" + ind + b + "\nend";
  }
  function cWrap(b) {
    return "#include <stdio.h>\n#include <string.h>\nint main(void) {\n" + b + "\n  return 0;\n}";
  }
  function cppW(b) {
    return "#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n" + b + "\n  return 0;\n}";
  }
  function csW(b) {
    return "using System;\nclass Program {\n  static void Main() {\n" + b + "\n  }\n}";
  }
  function javaW(b) {
    return "public class Main {\n  public static void main(String[] args) {\n" + b + "\n  }\n}";
  }
  function goW(b) {
    return "package main\n\nimport (\n\t\"fmt\"\n\t\"strings\"\n)\n\nfunc main() {\n" + b + "\n}";
  }
  function rustW(b) {
    return "fn main() {\n" + b + "\n}";
  }
  function phpH(b) {
    return "<?php\n" + b + "\n?>";
  }

  function gArith(cfg, rng, lvl) {
    var names = ["a", "b", "x", "y", "s", "n", "c"];
    var ops = ["+", "-", "*"];
    var mode = RINT(rng, 1, 3);
    var lo = 1 + (lvl - 1) * 3;
    var hi = 9 + (lvl - 1) * 10;
    var n1 = RINT(rng, lo, hi);
    var n2 = RINT(rng, 2, hi);
    var name = PICK(rng, names);
    var name2 = name;
    var op = PICK(rng, ops);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = op === "+" ? n1 + n2 : op === "-" ? n1 - n2 : n1 * n2;
      title = "Печать результата";
      desc = "Выведи результат выражения " + n1 + " " + op + " " + n2 + ".";
      sol = cfg.pr(n1 + " " + op + " " + n2);
      hint = "Готовая строка: " + sol;
    } else if (mode === 2) {
      while (name2 === name) { name2 = PICK(rng, names); }
      exp = n1 + n2;
      title = "Сумма в переменных";
      desc = "Запиши " + n1 + " в переменную " + name + ", а " + n2 + " — в " + name2 + ". Выведи их сумму.";
      sol = cfg.dn(name, n1) + "\n" + cfg.dn(name2, n2) + "\n" + cfg.pr(name + " + " + name2);
      hint = "После присваиваний выведи " + name + " + " + name2 + ".";
    } else {
      exp = n1 % n2;
      title = "Остаток от деления";
      desc = "Выведи остаток от деления " + n1 + " на " + n2 + ".";
      sol = cfg.pr(n1 + " % " + n2);
      hint = "Готовая строка: " + sol;
    }
    starter = cfg.c1 + " Допиши программу";
    ex = "Оператор вывода печатает значение выражения.";
    return mk(title, desc, starter, hint, sol, String(exp), ex, cfg.runner);
  }
function gStr(cfg, rng, lvl) {
    var words = ["world", "friend", "master", "coder", "hello", "mentor", "class", "team"];
    var mode = RINT(rng, 1, 3);
    var w1 = PICK(rng, words);
    var w2 = PICK(rng, words);
    var startCap = w1.charAt(0).toUpperCase() + w1.slice(1);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = "Hello, " + startCap + "!";
      title = "Сборка строки";
      desc = "Собери строку «Hello, " + startCap + "!» и выведи её через переменную text.";
      sol = cfg.strConcat(startCap);
      hint = "Склей три части оператором сложения и выведи переменную text.";
    } else if (mode === 2) {
      exp = String(w2.length);
      title = "Длина строки";
      desc = "Сколько символов в слове «" + w2 + "»? Сохрани его в переменную word и выведи его длину.";
      sol = cfg.strLen(w2);
      hint = "Храни слово в переменной word, затем выведи её длину.";
    } else {
      exp = w1.toUpperCase();
      title = "Верхний регистр";
      desc = "Выведи слово «" + w1 + "» заглавными буквами.";
      sol = cfg.strUp(w1);
      hint = "Сохрани слово в переменную word и примени метод uppercase.";
    }
    starter = cfg.c1 + " Допиши программу";
    ex = "Строки собираются из частей, у них есть длина и методы.";
    return mk(title, desc, starter, hint, sol, exp, ex, cfg.runner);
  }

  function gCond(cfg, rng, lvl) {
    var mode = RINT(rng, 1, 3);
    var lo = 1 + (lvl - 1) * 4;
    var hi = 20 + (lvl - 1) * 20;
    var a = RINT(rng, lo, hi);
    var b = RINT(rng, lo, hi);
    var n = RINT(rng, -hi, hi);
    if (n === 0) { n = 1; }
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = a % 2 === 0 ? "Even" : "Odd";
      title = "Чёт или нечёт";
      desc = "Проверь число " + a + ": выведи Even, если оно чётное, иначе Odd.";
      sol = cfg.odd(a);
      hint = "Число чётное, когда остаток от деления на 2 равен 0.";
    } else if (mode === 2) {
      exp = a > b ? "True" : "False";
      title = "Сравнение чисел";
      desc = "Выведи True, если " + a + " больше " + b + ", иначе False.";
      sol = cfg.cmp(a, b);
      hint = "Используй оператор сравнения «больше».";
    } else {
      exp = n > 0 ? "positive" : "negative";
      title = "Знак числа";
      desc = "Выведи positive, если число " + n + " положительное, иначе negative.";
      sol = cfg.sgn(n);
      hint = "Условие «число больше нуля» определяет знак.";
    }
    starter = cfg.c1 + " Напиши условие";
    ex = "if разветвляет программу на два пути по условию.";
    return mk(title, desc, starter, hint, sol, exp, ex, cfg.runner);
  }
function gLoop(cfg, rng, lvl) {
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex, n, f, m, i;
    if (mode === 1) {
      n = RINT(rng, 4, 6 + lvl * 3);
      exp = n * (n + 1) / 2;
      title = "Сумма ряда";
      desc = "Посчитай сумму целых чисел от 1 до " + n + " включительно и выведи её.";
      sol = cfg.sum1(n);
      hint = "Копи в переменную s по одному числу в цикле.";
    } else if (mode === 2) {
      f = RINT(rng, 3, 4 + lvl);
      exp = 1;
      for (i = 2; i <= f; i++) { exp = exp * i; }
      title = "Факториал";
      desc = "Вычисли " + f + "! — произведение целых чисел от 1 до " + f + ".";
      sol = cfg.fac(f);
      hint = "Факториал — перемножение всех чисел от 1 до " + f + " в цикле.";
    } else {
      m = RINT(rng, 5, 7 + lvl * 3);
      exp = 0;
      for (i = 0; i < m; i++) { if (i % 2 === 0) { exp = exp + i; } }
      title = "Сумма чётных";
      desc = "Найди сумму всех чётных чисел среди 0.." + (m - 1) + " и выведи её.";
      sol = cfg.sumev(m);
      hint = "Прибавляй к сумме только чётные числа.";
    }
    starter = cfg.c1 + " Напиши цикл";
    ex = "Цикл повторяет тело, пока выполняется условие.";
    return mk(title, desc, starter, hint, sol, String(exp), ex, cfg.runner);
  }

  function gArr(cfg, rng, lvl) {
    var len = 3 + lvl;
    var nums = [];
    var i, sum = 0, mx = 0;
    var mode = RINT(rng, 1, 3);
    for (i = 0; i < len; i++) { nums[i] = RINT(rng, 1, 12 + lvl * 8); }
    var lit = cfg.ar(nums.join(", "));
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      for (i = 0; i < len; i++) { sum = sum + nums[i]; }
      exp = sum;
      title = "Сумма массива";
      desc = "Дан массив: " + lit + ". Выведи сумму всех его элементов.";
      sol = cfg.asum(nums.join(", "), len);
      hint = "Проходи по каждому элементу и копи в переменную-сумму.";
    } else if (mode === 2) {
      for (i = 0; i < len; i++) { if (nums[i] > mx) { mx = nums[i]; } }
      exp = mx;
      title = "Максимум";
      desc = "Дан массив: " + lit + ". Выведи его максимальный элемент.";
      sol = cfg.amax(nums.join(", "), len);
      hint = "Сравнивай каждый элемент с текущим максимумом.";
    } else {
      exp = nums[0] + nums[len - 1];
      title = "Первый и последний";
      desc = "Дан массив: " + lit + ". Выведи сумму первого и последнего элементов.";
      sol = cfg.afc(nums.join(", "), len);
      hint = "Индексы 0 и " + (len - 1) + " дают первый и последний элементы.";
    }
    starter = cfg.c1 + " Напиши обработку массива";
    ex = "Массив — упорядоченный набор значений, доступных по индексу.";
    return mk(title, desc, starter, hint, sol, String(exp), ex, cfg.runner);
  }
function gProj(cfg, rng, lvl) {
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (cfg.fn) {
      var lo = 1 + (lvl - 1) * 3;
      var hi = 6 + (lvl - 1) * 6;
      if (mode === 1) {
        var a = RINT(rng, lo, hi);
        exp = a * 2;
        title = "Функция-удвоитель";
        desc = "Напиши функцию twice(n), которая возвращает n * 2, и выведи вызов twice(" + a + ").";
        sol = cfg.fnTwice(a);
        hint = "Функция принимает n и возвращает n * 2.";
      } else if (mode === 2) {
        var x = RINT(rng, lo, hi);
        var y = RINT(rng, lo, hi);
        exp = x * y;
        title = "Функция-умножитель";
        desc = "Напиши функцию mul(a, b), которая возвращает a * b, и выведи вызов mul(" + x + ", " + y + ").";
        sol = cfg.fnMul(x, y);
        hint = "Верни произведение двух аргументов.";
      } else {
        var v = RINT(rng, lo, hi);
        exp = v % 2 === 0 ? "Even" : "Odd";
        title = "Функция чётности";
        desc = "Напиши функцию even(n), возвращающую Even или Odd, и выведи вызов even(" + v + ").";
        sol = cfg.fnEven(v);
        hint = "Внутри функции — проверка остатка от деления на 2.";
      }
      starter = cfg.c1 + " Опиши функцию";
      ex = "Функция группирует код и возвращает результат по имени.";
    } else {
      if (mode === 1) {
        var n = RINT(rng, 3, 5 + lvl);
        exp = "";
        var k;
        for (k = 1; k <= n; k++) {
          exp = exp + (k === 1 ? "" : "\n") + n + " x " + k + " = " + (n * k);
        }
        title = "Таблица умножения";
        desc = "Выведи таблицу умножения для числа " + n + ": строки «" + n + " x k = …» для k от 1 до " + n + ".";
        sol = cfg.mtab(n);
        hint = "Цикл от 1 до " + n + ", в теле — строка с произведением.";
      } else if (mode === 2) {
        var m = RINT(rng, 4, 6 + lvl * 2);
        exp = "";
        var j;
        for (j = m; j >= 1; j--) { exp = exp + (j === m ? "" : "\n") + j; }
        title = "Обратный отсчёт";
        desc = "Выведи числа от " + m + " до 1, каждое с новой строки.";
        sol = cfg.cdown(m);
        hint = "Цикл с уменьшением шага от " + m + " до 1.";
      } else {
        var a2 = RINT(rng, 3, 8 + lvl);
        var b2 = RINT(rng, 2, 8 + lvl);
        exp = "sum = " + (a2 + b2) + "\nprod = " + (a2 * b2);
        title = "Отчёт о числах";
        desc = "Даны числа " + a2 + " и " + b2 + ". Выведи двумя строками их сумму и произведение.";
        sol = cfg.rep(a2, b2);
        hint = "Напечатай строки «sum = …» и «prod = …» с результатами.";
      }
      starter = cfg.c1 + " Выведи результат";
      ex = "Программа — это последовательность шагов и выводов строк.";
    }
    return mk(title, desc, starter, hint, sol, String(exp), ex, cfg.runner);
  }

  var L = {};
L.python = {
    runner: "py", c1: "#", fn: true,
    dn: function (n, v) { return n + " = " + v; },
    pr: function (e) { return "print(" + e + ")"; },
    prs: function (s) { return "print(\"" + s + "\")"; },
    odd: function (n) {
      return "n = " + n + "\n" + pyIfE("    ", "n % 2 == 0", this.prs("Even"), this.prs("Odd"));
    },
    cmp: function (a, b) {
      return "a = " + a + "\nb = " + b + "\n" + pyIfE("    ", "a > b", this.prs("True"), this.prs("False"));
    },
    sgn: function (n) {
      return "n = " + n + "\n" + pyIfE("    ", "n > 0", this.prs("positive"), this.prs("negative"));
    },
    sum1: function (n) {
      return "s = 0\n" + pyFor("    ", "i in range(1, " + (n + 1) + ")", "s += i") + "\n" + this.pr("s");
    },
    fac: function (f) {
      return "f = 1\n" + pyFor("    ", "i in range(1, " + (f + 1) + ")", "f *= i") + "\n" + this.pr("f");
    },
    sumev: function (m) {
      return "s = 0\n" + pyFor("    ", "i in range(0, " + m + ")", pyIf("        ", "i % 2 == 0", "s += i")) + "\n" + this.pr("s");
    },
    ar: function (x) { return "[" + x + "]"; },
    asum: function (x) {
      return "arr = [" + x + "]\ns = 0\n" + pyFor("    ", "v in arr", "s += v") + "\n" + this.pr("s");
    },
    amax: function (x) {
      return "arr = [" + x + "]\nmx = arr[0]\n" + pyFor("    ", "v in arr", pyIf("        ", "v > mx", "mx = v")) + "\n" + this.pr("mx");
    },
    afc: function (x) {
      return "arr = [" + x + "]\n" + this.pr("arr[0] + arr[len(arr) - 1]");
    },
    strConcat: function (w) {
      return "text = \"Hello, " + w + "!\"\n" + this.pr("text");
    },
    strLen: function (w) {
      return "word = \"" + w + "\"\n" + this.pr("len(word)");
    },
    strUp: function (w) {
      return "word = \"" + w + "\"\n" + this.pr("word.upper()");
    },
    fnTwice: function (a) {
      return "def twice(n):\n    return n * 2\n\n" + this.pr("twice(" + a + ")");
    },
    fnMul: function (x, y) {
      return "def mul(a, b):\n    return a * b\n\n" + this.pr("mul(" + x + ", " + y + ")");
    },
    fnEven: function (v) {
      return "def even(n):\n    if n % 2 == 0:\n        return \"Even\"\n    return \"Odd\"\n\n" + this.pr("even(" + v + ")");
    }
  };

  L.javascript = {
    runner: "js", c1: "//", fn: true,
    dn: function (n, v) { return "let " + n + " = " + v + ";"; },
    pr: function (e) { return "console.log(" + e + ");"; },
    prs: function (s) { return "console.log(\"" + s + "\");"; },
    odd: function (n) {
      return "let n = " + n + ";\n" + brIfE("  ", "n % 2 === 0", this.prs("Even"), this.prs("Odd"));
    },
    cmp: function (a, b) {
      return "let a = " + a + ";\nlet b = " + b + ";\n" + brIfE("  ", "a > b", this.prs("True"), this.prs("False"));
    },
    sgn: function (n) {
      return "let n = " + n + ";\n" + brIfE("  ", "n > 0", this.prs("positive"), this.prs("negative"));
    },
    sum1: function (n) {
      return "let s = 0;\n" + brFor("  ", "let i = 1", "i <= " + n, "i++", "s += i;") + "\n" + this.pr("s");
    },
    fac: function (f) {
      return "let f = 1;\n" + brFor("  ", "let i = 2", "i <= " + f, "i++", "f *= i;") + "\n" + this.pr("f");
    },
    sumev: function (m) {
      return "let s = 0;\n" + brFor("  ", "let i = 0", "i < " + m, "i++", brIf("    ", "i % 2 === 0", "s += i;")) + "\n" + this.pr("s");
    },
    ar: function (x) { return "[" + x + "]"; },
    asum: function (x) {
      return "const arr = [" + x + "];\nlet s = 0;\n" + brFor("  ", "let i = 0", "i < arr.length", "i++", "s += arr[i];") + "\n" + this.pr("s");
    },
    amax: function (x) {
      return "const arr = [" + x + "];\nlet mx = arr[0];\n" + brFor("  ", "let i = 0", "i < arr.length", "i++", brIf("    ", "arr[i] > mx", "mx = arr[i];")) + "\n" + this.pr("mx");
    },
    afc: function (x) {
      return "const arr = [" + x + "];\n" + this.pr("arr[0] + arr[arr.length - 1]");
    },
    strConcat: function (w) {
      return "const text = \"Hello, " + w + "!\";\n" + this.pr("text");
    },
    strLen: function (w) {
      return "const word = \"" + w + "\";\n" + this.pr("word.length");
    },
    strUp: function (w) {
      return "const word = \"" + w + "\";\n" + this.pr("word.toUpperCase()");
    },
    fnTwice: function (a) {
      return "function twice(n) {\n  return n * 2;\n}\n" + this.pr("twice(" + a + ")");
    },
    fnMul: function (x, y) {
      return "function mul(a, b) {\n  return a * b;\n}\n" + this.pr("mul(" + x + ", " + y + ")");
    },
    fnEven: function (v) {
      return "function even(n) {\n  if (n % 2 === 0) {\n    return \"Even\";\n  }\n  return \"Odd\";\n}\n" + this.pr("even(" + v + ")");
    }
  };
L.typescript = {
    runner: "js", c1: "//", fn: true,
    dn: function (n, v) { return "let " + n + ": number = " + v + ";"; },
    pr: function (e) { return "console.log(" + e + ");"; },
    prs: function (s) { return "console.log(\"" + s + "\");"; },
    odd: function (n) {
      return "let n: number = " + n + ";\n" + brIfE("  ", "n % 2 === 0", this.prs("Even"), this.prs("Odd"));
    },
    cmp: function (a, b) {
      return "let a: number = " + a + ";\nlet b: number = " + b + ";\n" + brIfE("  ", "a > b", this.prs("True"), this.prs("False"));
    },
    sgn: function (n) {
      return "let n: number = " + n + ";\n" + brIfE("  ", "n > 0", this.prs("positive"), this.prs("negative"));
    },
    sum1: function (n) {
      return "let s: number = 0;\n" + brFor("  ", "let i = 1", "i <= " + n, "i++", "s += i;") + "\n" + this.pr("s");
    },
    fac: function (f) {
      return "let f: number = 1;\n" + brFor("  ", "let i = 2", "i <= " + f, "i++", "f *= i;") + "\n" + this.pr("f");
    },
    sumev: function (m) {
      return "let s: number = 0;\n" + brFor("  ", "let i = 0", "i < " + m, "i++", brIf("    ", "i % 2 === 0", "s += i;")) + "\n" + this.pr("s");
    },
    ar: function (x) { return "[" + x + "]"; },
    asum: function (x) {
      return "const arr: number[] = [" + x + "];\nlet s = 0;\n" + brFor("  ", "let i = 0", "i < arr.length", "i++", "s += arr[i];") + "\n" + this.pr("s");
    },
    amax: function (x) {
      return "const arr: number[] = [" + x + "];\nlet mx = arr[0];\n" + brFor("  ", "let i = 0", "i < arr.length", "i++", brIf("    ", "arr[i] > mx", "mx = arr[i];")) + "\n" + this.pr("mx");
    },
    afc: function (x) {
      return "const arr: number[] = [" + x + "];\n" + this.pr("arr[0] + arr[arr.length - 1]");
    },
    strConcat: function (w) {
      return "const text: string = \"Hello, " + w + "!\";\n" + this.pr("text");
    },
    strLen: function (w) {
      return "const word: string = \"" + w + "\";\n" + this.pr("word.length");
    },
    strUp: function (w) {
      return "const word: string = \"" + w + "\";\n" + this.pr("word.toUpperCase()");
    },
    fnTwice: function (a) {
      return "function twice(n: number): number {\n  return n * 2;\n}\n" + this.pr("twice(" + a + ")");
    },
    fnMul: function (x, y) {
      return "function mul(a: number, b: number): number {\n  return a * b;\n}\n" + this.pr("mul(" + x + ", " + y + ")");
    },
    fnEven: function (v) {
      return "function even(n: number): string {\n  if (n % 2 === 0) {\n    return \"Even\";\n  }\n  return \"Odd\";\n}\n" + this.pr("even(" + v + ")");
    }
  };

  L.c = {
    runner: "none", c1: "//", fn: false,
    dn: function (n, v) { return "int " + n + " = " + v + ";"; },
    pr: function (e) { return "printf(\"%d\\n\", " + e + ");"; },
    prs: function (s) { return "printf(\"" + s + "\\n\");"; },
    odd: function (n) {
      return cWrap("  int n = " + n + ";\n  " + brIfE("    ", "n % 2 == 0", "    " + this.prs("Even"), "    " + this.prs("Odd")));
    },
    cmp: function (a, b) {
      return cWrap("  int a = " + a + ";\n  int b = " + b + ";\n  " + brIfE("    ", "a > b", "    " + this.prs("True"), "    " + this.prs("False")));
    },
    sgn: function (n) {
      return cWrap("  int n = " + n + ";\n  " + brIfE("    ", "n > 0", "    " + this.prs("positive"), "    " + this.prs("negative")));
    },
    sum1: function (n) {
      return cWrap("  int s = 0;\n  " + brFor("    ", "int i = 1", "i <= " + n, "i++", "s += i;") + "\n  " + this.pr("s"));
    },
    fac: function (f) {
      return cWrap("  int f = 1;\n  " + brFor("    ", "int i = 2", "i <= " + f, "i++", "f *= i;") + "\n  " + this.pr("f"));
    },
    sumev: function (m) {
      return cWrap("  int s = 0;\n  " + brFor("    ", "int i = 0", "i < " + m, "i++", brIf("      ", "i % 2 == 0", "s += i;")) + "\n  " + this.pr("s"));
    },
    ar: function (x) { return "{" + x + "}"; },
    asum: function (x, len) {
      return cWrap("  int arr[] = " + this.ar(x) + ";\n  int s = 0;\n  " + brFor("    ", "int i = 0", "i < " + len, "i++", "s += arr[i];") + "\n  " + this.pr("s"));
    },
    amax: function (x, len) {
      return cWrap("  int arr[] = " + this.ar(x) + ";\n  int mx = arr[0];\n  " + brFor("    ", "int i = 0", "i < " + len, "i++", brIf("      ", "arr[i] > mx", "mx = arr[i];")) + "\n  " + this.pr("mx"));
    },
    afc: function (x, len) {
      return cWrap("  int arr[] = " + this.ar(x) + ";\n  " + this.pr("arr[0] + arr[" + (len - 1) + "]"));
    },
    strConcat: function (w) {
      return cWrap("  char text[] = \"Hello, " + w + "!\";\n  puts(text);");
    },
    strLen: function (w) {
      return cWrap("  char word[] = \"" + w + "\";\n  printf(\"%d\\n\", strlen(word));");
    },
    strUp: function (w) {
      return cWrap("  char w[] = \"" + w + "\";\n  int i;\n  " + brFor("    ", "i = 0", "w[i] != 0", "i++", "w[i] -= 32;") + "\n  puts(w);");
    },
    mtab: function (n) {
      return cWrap("  int n = " + n + ";\n  " + brFor("    ", "int i = 1", "i <= n", "i++", "printf(\"%d x %d = %d\\n\", n, i, n * i);"));
    },
    cdown: function (m) {
      return cWrap("  " + brFor("    ", "int i = " + m, "i >= 1", "i--", "printf(\"%d\\n\", i);"));
    },
    rep: function (a, b) {
      return cWrap("  " + this.prs("sum = " + (a + b)) + "\n  " + this.prs("prod = " + (a * b)));
    }
  };
L.cpp = {
    runner: "none", c1: "//", fn: false,
    dn: function (n, v) { return "int " + n + " = " + v + ";"; },
    pr: function (e) { return "cout << " + e + " << \"\\n\";"; },
    prs: function (s) { return "cout << \"" + s + "\" << \"\\n\";"; },
    odd: function (n) {
      return cppW("  int n = " + n + ";\n  " + brIfE("    ", "n % 2 == 0", "    " + this.prs("Even"), "    " + this.prs("Odd")));
    },
    cmp: function (a, b) {
      return cppW("  int a = " + a + ";\n  int b = " + b + ";\n  " + brIfE("    ", "a > b", "    " + this.prs("True"), "    " + this.prs("False")));
    },
    sgn: function (n) {
      return cppW("  int n = " + n + ";\n  " + brIfE("    ", "n > 0", "    " + this.prs("positive"), "    " + this.prs("negative")));
    },
    sum1: function (n) {
      return cppW("  int s = 0;\n  " + brFor("    ", "int i = 1", "i <= " + n, "i++", "s += i;") + "\n  " + this.pr("s"));
    },
    fac: function (f) {
      return cppW("  int f = 1;\n  " + brFor("    ", "int i = 2", "i <= " + f, "i++", "f *= i;") + "\n  " + this.pr("f"));
    },
    sumev: function (m) {
      return cppW("  int s = 0;\n  " + brFor("    ", "int i = 0", "i < " + m, "i++", brIf("      ", "i % 2 == 0", "s += i;")) + "\n  " + this.pr("s"));
    },
    ar: function (x) { return "{" + x + "}"; },
    asum: function (x, len) {
      return cppW("  int arr[] = " + this.ar(x) + ";\n  int s = 0;\n  " + brFor("    ", "int i = 0", "i < " + len, "i++", "s += arr[i];") + "\n  " + this.pr("s"));
    },
    amax: function (x, len) {
      return cppW("  int arr[] = " + this.ar(x) + ";\n  int mx = arr[0];\n  " + brFor("    ", "int i = 0", "i < " + len, "i++", brIf("      ", "arr[i] > mx", "mx = arr[i];")) + "\n  " + this.pr("mx"));
    },
    afc: function (x, len) {
      return cppW("  int arr[] = " + this.ar(x) + ";\n  " + this.pr("arr[0] + arr[" + (len - 1) + "]"));
    },
    strConcat: function (w) {
      return cppW("  string text = \"Hello, " + w + "!\";\n  cout << text << \"\\n\";");
    },
    strLen: function (w) {
      return cppW("  string word = \"" + w + "\";\n  cout << word.size() << \"\\n\";");
    },
    strUp: function (w) {
      return cppW("  char w[] = \"" + w + "\";\n  for (int i = 0; w[i] != 0; i++) { w[i] -= 32; }\n  cout << w << \"\\n\";");
    },
    mtab: function (n) {
      return cppW("  int n = " + n + ";\n  " + brFor("    ", "int i = 1", "i <= n", "i++", "cout << n << \" x \" << i << \" = \" << n * i << \"\\n\";"));
    },
    cdown: function (m) {
      return cppW("  " + brFor("    ", "int i = " + m, "i >= 1", "i--", "cout << i << \"\\n\";"));
    },
    rep: function (a, b) {
      return cppW("  " + this.prs("sum = " + (a + b)) + "\n  " + this.prs("prod = " + (a * b)));
    }
  };

  L.csharp = {
    runner: "none", c1: "//", fn: false,
    dn: function (n, v) { return "int " + n + " = " + v + ";"; },
    pr: function (e) { return "Console.WriteLine(" + e + ");"; },
    prs: function (s) { return "Console.WriteLine(\"" + s + "\");"; },
    odd: function (n) {
      return csW("    int n = " + n + ";\n    " + brIfE("      ", "n % 2 == 0", "      " + this.prs("Even"), "      " + this.prs("Odd")));
    },
    cmp: function (a, b) {
      return csW("    int a = " + a + ";\n    int b = " + b + ";\n    " + brIfE("      ", "a > b", "      " + this.prs("True"), "      " + this.prs("False")));
    },
    sgn: function (n) {
      return csW("    int n = " + n + ";\n    " + brIfE("      ", "n > 0", "      " + this.prs("positive"), "      " + this.prs("negative")));
    },
    sum1: function (n) {
      return csW("    int s = 0;\n    " + brFor("      ", "int i = 1", "i <= " + n, "i++", "s += i;") + "\n    " + this.pr("s"));
    },
    fac: function (f) {
      return csW("    int f = 1;\n    " + brFor("      ", "int i = 2", "i <= " + f, "i++", "f *= i;") + "\n    " + this.pr("f"));
    },
    sumev: function (m) {
      return csW("    int s = 0;\n    " + brFor("      ", "int i = 0", "i < " + m, "i++", brIf("        ", "i % 2 == 0", "s += i;")) + "\n    " + this.pr("s"));
    },
    ar: function (x) { return "{" + x + "}"; },
    asum: function (x, len) {
      return csW("    int[] arr = " + this.ar(x) + ";\n    int s = 0;\n    " + brFor("      ", "int i = 0", "i < arr.Length", "i++", "s += arr[i];") + "\n    " + this.pr("s"));
    },
    amax: function (x, len) {
      return csW("    int[] arr = " + this.ar(x) + ";\n    int mx = arr[0];\n    " + brFor("      ", "int i = 0", "i < arr.Length", "i++", brIf("        ", "arr[i] > mx", "mx = arr[i];")) + "\n    " + this.pr("mx"));
    },
    afc: function (x, len) {
      return csW("    int[] arr = " + this.ar(x) + ";\n    " + this.pr("arr[0] + arr[arr.Length - 1]"));
    },
    strConcat: function (w) {
      return csW("    string text = \"Hello, " + w + "!\";\n    " + this.pr("text"));
    },
    strLen: function (w) {
      return csW("    string word = \"" + w + "\";\n    " + this.pr("word.Length"));
    },
    strUp: function (w) {
      return csW("    string word = \"" + w + "\";\n    " + this.pr("word.ToUpper()"));
    },
    mtab: function (n) {
      return csW("    int n = " + n + ";\n    " + brFor("      ", "int i = 1", "i <= n", "i++", "Console.WriteLine(n + \" x \" + i + \" = \" + (n * i));"));
    },
    cdown: function (m) {
      return csW("    " + brFor("      ", "int i = " + m, "i >= 1", "i--", "Console.WriteLine(i);"));
    },
    rep: function (a, b) {
      return csW("    " + this.prs("sum = " + (a + b)) + "\n    " + this.prs("prod = " + (a * b)));
    }
  };
L.java = {
    runner: "none", c1: "//", fn: false,
    dn: function (n, v) { return "int " + n + " = " + v + ";"; },
    pr: function (e) { return "System.out.println(" + e + ");"; },
    prs: function (s) { return "System.out.println(\"" + s + "\");"; },
    odd: function (n) {
      return javaW("    int n = " + n + ";\n    " + brIfE("      ", "n % 2 == 0", "      " + this.prs("Even"), "      " + this.prs("Odd")));
    },
    cmp: function (a, b) {
      return javaW("    int a = " + a + ";\n    int b = " + b + ";\n    " + brIfE("      ", "a > b", "      " + this.prs("True"), "      " + this.prs("False")));
    },
    sgn: function (n) {
      return javaW("    int n = " + n + ";\n    " + brIfE("      ", "n > 0", "      " + this.prs("positive"), "      " + this.prs("negative")));
    },
    sum1: function (n) {
      return javaW("    int s = 0;\n    " + brFor("      ", "int i = 1", "i <= " + n, "i++", "s += i;") + "\n    " + this.pr("s"));
    },
    fac: function (f) {
      return javaW("    int f = 1;\n    " + brFor("      ", "int i = 2", "i <= " + f, "i++", "f *= i;") + "\n    " + this.pr("f"));
    },
    sumev: function (m) {
      return javaW("    int s = 0;\n    " + brFor("      ", "int i = 0", "i < " + m, "i++", brIf("        ", "i % 2 == 0", "s += i;")) + "\n    " + this.pr("s"));
    },
    ar: function (x) { return "{" + x + "}"; },
    asum: function (x, len) {
      return javaW("    int[] arr = " + this.ar(x) + ";\n    int s = 0;\n    " + brFor("      ", "int i = 0", "i < arr.length", "i++", "s += arr[i];") + "\n    " + this.pr("s"));
    },
    amax: function (x, len) {
      return javaW("    int[] arr = " + this.ar(x) + ";\n    int mx = arr[0];\n    " + brFor("      ", "int i = 0", "i < arr.length", "i++", brIf("        ", "arr[i] > mx", "mx = arr[i];")) + "\n    " + this.pr("mx"));
    },
    afc: function (x, len) {
      return javaW("    int[] arr = " + this.ar(x) + ";\n    " + this.pr("arr[0] + arr[arr.length - 1]"));
    },
    strConcat: function (w) {
      return javaW("    String text = \"Hello, " + w + "!\";\n    " + this.pr("text"));
    },
    strLen: function (w) {
      return javaW("    String word = \"" + w + "\";\n    " + this.pr("word.length()"));
    },
    strUp: function (w) {
      return javaW("    String word = \"" + w + "\";\n    " + this.pr("word.toUpperCase()"));
    },
    mtab: function (n) {
      return javaW("    int n = " + n + ";\n    " + brFor("      ", "int i = 1", "i <= n", "i++", "System.out.println(n + \" x \" + i + \" = \" + (n * i));"));
    },
    cdown: function (m) {
      return javaW("    " + brFor("      ", "int i = " + m, "i >= 1", "i--", "System.out.println(i);"));
    },
    rep: function (a, b) {
      return javaW("    " + this.prs("sum = " + (a + b)) + "\n    " + this.prs("prod = " + (a * b)));
    }
  };

  L.go = {
    runner: "none", c1: "//", fn: false,
    dn: function (n, v) { return n + " := " + v; },
    pr: function (e) { return "fmt.Println(" + e + ")"; },
    prs: function (s) { return "fmt.Println(\"" + s + "\")"; },
    odd: function (n) {
      return goW("    n := " + n + "\n    " + brIfE("      ", "n%2 == 0", this.prs("Even"), this.prs("Odd")));
    },
    cmp: function (a, b) {
      return goW("    a := " + a + "\n    b := " + b + "\n    " + brIfE("      ", "a > b", this.prs("True"), this.prs("False")));
    },
    sgn: function (n) {
      return goW("    n := " + n + "\n    " + brIfE("      ", "n > 0", this.prs("positive"), this.prs("negative")));
    },
    sum1: function (n) {
      return goW("    s := 0\n    " + brFor("      ", "i := 1", "i <= " + n, "i++", "s += i") + "\n    " + this.pr("s"));
    },
    fac: function (f) {
      return goW("    f := 1\n    " + brFor("      ", "i := 2", "i <= " + f, "i++", "f *= i") + "\n    " + this.pr("f"));
    },
    sumev: function (m) {
      return goW("    s := 0\n    " + brFor("      ", "i := 0", "i < " + m, "i++", brIf("        ", "i%2 == 0", "s += i")) + "\n    " + this.pr("s"));
    },
    ar: function (x) { return "[]int{" + x + "}"; },
    asum: function (x, len) {
      return goW("    arr := " + this.ar(x) + "\n    s := 0\n    " + brFor("      ", "i := 0", "i < len(arr)", "i++", "s += arr[i]") + "\n    " + this.pr("s"));
    },
    amax: function (x, len) {
      return goW("    arr := " + this.ar(x) + "\n    mx := arr[0]\n    " + brFor("      ", "i := 0", "i < len(arr)", "i++", brIf("        ", "arr[i] > mx", "mx = arr[i]")) + "\n    " + this.pr("mx"));
    },
    afc: function (x, len) {
      return goW("    arr := " + this.ar(x) + "\n    " + this.pr("arr[0] + arr[len(arr)-1]"));
    },
    strConcat: function (w) {
      return goW("    var text string = \"Hello, " + w + "!\"\n    " + this.pr("text"));
    },
    strLen: function (w) {
      return goW("    word := \"" + w + "\"\n    " + this.pr("len(word)"));
    },
    strUp: function (w) {
      return goW("    word := \"" + w + "\"\n    " + this.pr("strings.ToUpper(word)"));
    },
    mtab: function (n) {
      return goW("    n := " + n + "\n    " + brFor("      ", "i := 1", "i <= n", "i++", "fmt.Printf(\"%d x %d = %d\\n\", n, i, n*i)"));
    },
    cdown: function (m) {
      return goW("    " + brFor("      ", "i := " + m, "i >= 1", "i--", this.pr("i")));
    },
    rep: function (a, b) {
      return goW("    " + this.prs("sum = " + (a + b)) + "\n    " + this.prs("prod = " + (a * b)));
    }
  };
L.rust = {
    runner: "none", c1: "//", fn: false,
    dn: function (n, v) { return "let " + n + " = " + v + ";"; },
    pr: function (e) { return "println!(\"{}\", " + e + ");"; },
    prs: function (s) { return "println!(\"" + s + "\");"; },
    odd: function (n) {
      return rustW("    let n = " + n + ";\n    " + brIfE("      ", "n % 2 == 0", this.prs("Even"), this.prs("Odd")));
    },
    cmp: function (a, b) {
      return rustW("    let a = " + a + ";\n    let b = " + b + ";\n    " + brIfE("      ", "a > b", this.prs("True"), this.prs("False")));
    },
    sgn: function (n) {
      return rustW("    let n = " + n + ";\n    " + brIfE("      ", "n > 0", this.prs("positive"), this.prs("negative")));
    },
    sum1: function (n) {
      return rustW("    let mut s = 0;\n    for i in 1..=" + n + " {\n        s += i;\n    }\n    " + this.pr("s"));
    },
    fac: function (f) {
      return rustW("    let mut f = 1;\n    for i in 1..=" + f + " {\n        f *= i;\n    }\n    " + this.pr("f"));
    },
    sumev: function (m) {
      return rustW("    let mut s = 0;\n    for i in 0.." + m + " {\n        if i % 2 == 0 { s += i; }\n    }\n    " + this.pr("s"));
    },
    ar: function (x) { return "[" + x + "]"; },
    asum: function (x, len) {
      return rustW("    let arr = " + this.ar(x) + ";\n    let mut s = 0;\n    for &v in arr.iter() {\n        s += v;\n    }\n    " + this.pr("s"));
    },
    amax: function (x, len) {
      return rustW("    let arr = " + this.ar(x) + ";\n    let mut mx = arr[0];\n    for &v in arr.iter() {\n        if v > mx { mx = v; }\n    }\n    " + this.pr("mx"));
    },
    afc: function (x, len) {
      return rustW("    let arr = " + this.ar(x) + ";\n    " + this.pr("arr[0] + arr[arr.len() - 1]"));
    },
    strConcat: function (w) {
      return rustW("    let text: String = format!(\"Hello, {}!\", \"" + w + "\");\n    " + this.pr("text"));
    },
    strLen: function (w) {
      return rustW("    let word = \"" + w + "\";\n    " + this.pr("word.chars().count()"));
    },
    strUp: function (w) {
      return rustW("    let word = \"" + w + "\";\n    " + this.pr("word.to_uppercase()"));
    },
    mtab: function (n) {
      return rustW("    let n = " + n + ";\n    for i in 1..=n {\n        println!(\"{} x {} = {}\", n, i, n * i);\n    }");
    },
    cdown: function (m) {
      return rustW("    let mut i = " + m + ";\n    while i >= 1 {\n        println!(\"{}\", i);\n        i -= 1;\n    }");
    },
    rep: function (a, b) {
      return rustW("    " + this.prs("sum = " + (a + b)) + "\n    " + this.prs("prod = " + (a * b)));
    }
  };

  L.php = {
    runner: "none", c1: "//", fn: false,
    dn: function (n, v) { return "$" + n + " = " + v + ";"; },
    pr: function (e) { return "echo " + e + ";"; },
    prs: function (s) { return "echo \"" + s + "\";"; },
    odd: function (n) {
      return phpH("    $" + "n = " + n + ";\n    " + brIfE("      ", "$n % 2 == 0", this.prs("Even"), this.prs("Odd")));
    },
    cmp: function (a, b) {
      return phpH("    $a" + " = " + a + ";\n    $b" + " = " + b + ";\n    " + brIfE("      ", "$a > $b", this.prs("True"), this.prs("False")));
    },
    sgn: function (n) {
      return phpH("    $" + "n = " + n + ";\n    " + brIfE("      ", "$n > 0", this.prs("positive"), this.prs("negative")));
    },
    sum1: function (n) {
      return phpH("    $s" + " = 0;\n    " + brFor("      ", "$i = 1", "$i <= " + n, "$i++", "$s += $i;") + "\n    " + this.pr("$s"));
    },
    fac: function (f) {
      return phpH("    $f" + " = 1;\n    " + brFor("      ", "$i = 2", "$i <= " + f, "$i++", "$f *= $i;") + "\n    " + this.pr("$f"));
    },
    sumev: function (m) {
      return phpH("    $s" + " = 0;\n    " + brFor("      ", "$i = 0", "$i < " + m, "$i++", brIf("        ", "$i % 2 == 0", "$s += $i;")) + "\n    " + this.pr("$s"));
    },
    ar: function (x) { return "[" + x + "]"; },
    asum: function (x, len) {
      return phpH("    $arr" + " = [" + x + "];\n    $s" + " = 0;\n    foreach ($arr as $v) {\n        $s += $v;\n    }\n    " + this.pr("$s"));
    },
    amax: function (x, len) {
      return phpH("    $arr" + " = [" + x + "];\n    $mx" + " = $arr[0];\n    foreach ($arr as $v) {\n        if ($v > $mx) { $mx = $v; }\n    }\n    " + this.pr("$mx"));
    },
    afc: function (x, len) {
      return phpH("    $arr" + " = [" + x + "];\n    " + this.pr("$arr[0] + $arr[" + (len - 1) + "]"));
    },
    strConcat: function (w) {
      return phpH("    $text" + " = \"Hello, " + w + "!\";\n    " + this.pr("$text"));
    },
    strLen: function (w) {
      return phpH("    $word" + " = \"" + w + "\";\n    " + this.pr("strlen($word)"));
    },
    strUp: function (w) {
      return phpH("    $word" + " = \"" + w + "\";\n    " + this.pr("strtoupper($word)"));
    },
    mtab: function (n) {
      return phpH("    $n" + " = " + n + ";\n    " + brFor("      ", "$i = 1", "$i <= $n", "$i++", "echo \"$n x $i = \" . ($n * $i) . \"\\n\";"));
    },
    cdown: function (m) {
      return phpH("    " + brFor("      ", "$i = " + m, "$i >= 1", "$i--", "echo \"$i\\n\";"));
    },
    rep: function (a, b) {
      return phpH("    " + this.prs("sum = " + (a + b)) + "\n    " + this.prs("prod = " + (a * b)));
    }
  };

  L.ruby = {
    runner: "none", c1: "#", fn: false,
    dn: function (n, v) { return n + " = " + v; },
    pr: function (e) { return "puts " + e; },
    prs: function (s) { return "puts \"" + s + "\""; },
    odd: function (n) {
      return "n = " + n + "\n" + ruIfE("    ", "n % 2 == 0", this.prs("Even"), this.prs("Odd"));
    },
    cmp: function (a, b) {
      return "a = " + a + "\nb = " + b + "\n" + ruIfE("    ", "a > b", this.prs("True"), this.prs("False"));
    },
    sgn: function (n) {
      return "n = " + n + "\n" + ruIfE("    ", "n > 0", this.prs("positive"), this.prs("negative"));
    },
    sum1: function (n) {
      return "s = 0\n(1.." + n + ").each do |i|\n    s += i\nend\n" + this.pr("s");
    },
    fac: function (f) {
      return "f = 1\n(1.." + f + ").each do |i|\n    f *= i\nend\n" + this.pr("f");
    },
    sumev: function (m) {
      return "s = 0\n(0..." + m + ").each do |i|\n    if i % 2 == 0\n        s += i\n    end\nend\n" + this.pr("s");
    },
    ar: function (x) { return "[" + x + "]"; },
    asum: function (x, len) {
      return "arr = " + this.ar(x) + "\ns = 0\narr.each do |v|\n    s += v\nend\n" + this.pr("s");
    },
    amax: function (x, len) {
      return "arr = " + this.ar(x) + "\nmx = arr[0]\narr.each do |v|\n    if v > mx\n        mx = v\n    end\nend\n" + this.pr("mx");
    },
    afc: function (x, len) {
      return "arr = " + this.ar(x) + "\n" + this.pr("arr[0] + arr[arr.length - 1]");
    },
    strConcat: function (w) {
      return "text = \"Hello, " + w + "!\"\n" + this.pr("text");
    },
    strLen: function (w) {
      return "word = \"" + w + "\"\n" + this.pr("word.length");
    },
    strUp: function (w) {
      return "word = \"" + w + "\"\n" + this.pr("word.upcase");
    },
    mtab: function (n) {
      return "n = " + n + "\n(1..n).each do |i|\n    puts \"#{n} x #{i} = #{n * i}\"\nend";
    },
    cdown: function (m) {
      return "m = " + m + "\nwhile m >= 1\n    puts m\n    m -= 1\nend";
    },
    rep: function (a, b) {
      return this.prs("sum = " + (a + b)) + "\n" + this.prs("prod = " + (a * b));
    }
  };
function gHtml1(rng, lvl) {
    var greet = PICK(rng, ["Привет", "Здравствуй", "Hello", "Hi"]);
    var whom = PICK(rng, ["мир", "друг", "гость"]);
    var topic = PICK(rng, ["Программирование", "Веб-разработка", "HTML"]);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = greet + ", " + whom + "!";
      title = "Приветствие на странице";
      desc = "Создай страницу с тегом h1 и текстом «" + exp + "».";
      sol = "<!DOCTYPE html>\n<html>\n<head><meta charset=\"utf-8\"></head>\n<body>\n  <h1>" + exp + "</h1>\n</body>\n</html>";
      hint = "Заголовок первого уровня — тег <h1>текст</h1>.";
    } else if (mode === 2) {
      exp = topic + "\nУчимся вместе";
      title = "Заголовки страницы";
      desc = "Выведи заголовок h1 «" + topic + "» и под ним заголовок h2 «Учимся вместе».";
      sol = "<h1>" + topic + "</h1>\n<h2>Учимся вместе</h2>";
      hint = "Второй по важности заголовок — тег <h2>.";
    } else {
      exp = topic;
      title = "Абзац с текстом";
      desc = "Выведи абзац с текстом «" + exp + "».";
      sol = "<p>" + exp + "</p>";
      hint = "Абзац в HTML — тег <p>текст</p>.";
    }
    starter = "<!-- Допиши разметку -->";
    ex = "Теги h1..h6 и p задают структуру и текстовые блоки.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gHtml2(rng, lvl) {
    var pool = ["Python", "JavaScript", "Go", "Rust", "SQL", "PHP"];
    var n = 2 + RINT(rng, 0, 2);
    var sel = [];
    var used = {};
    var it, i;
    while (sel.length < n) {
      it = PICK(rng, pool);
      if (!used[it]) { used[it] = 1; sel.push(it); }
    }
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    exp = sel.join("\n");
    if (mode === 1) {
      title = "Маркированный список";
      desc = "Выведи список из пунктов: " + sel.join(", ") + " (тег ul, каждый пункт — li).";
      sol = "<ul>";
      for (i = 0; i < sel.length; i++) { sol = sol + "\n  <li>" + sel[i] + "</li>"; }
      sol = sol + "\n</ul>";
      hint = "ul — маркеры-точки, li — один пункт списка.";
    } else if (mode === 2) {
      title = "Нумерованный список";
      desc = "Выведи те же пункты нумерованным списком: " + sel.join(", ") + ".";
      sol = "<ol>";
      for (i = 0; i < sel.length; i++) { sol = sol + "\n  <li>" + sel[i] + "</li>"; }
      sol = sol + "\n</ol>";
      hint = "ol — автоматическая нумерация пунктов.";
    } else {
      exp = "Язык\n" + sel[0];
      title = "Список определений";
      desc = "Выведи dl: термин «Язык» и определение «" + sel[0] + "».";
      sol = "<dl>\n  <dt>Язык</dt>\n  <dd>" + sel[0] + "</dd>\n</dl>";
      hint = "dt — термин, dd — его описание.";
    }
    starter = "<!-- Допиши разметку -->";
    ex = "Списки группируют элементы: ul/ol с li и dl с dt/dd.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gHtml3(rng, lvl) {
    var w1 = PICK(rng, ["важно", "внимание", "совет", "итог"]);
    var w2 = PICK(rng, ["код", "разметка", "стиль", "текст"]);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = w1 + ": " + w2;
      title = "Выделение strong";
      desc = "Выведи абзац, где «" + w1 + "» выделено жирным <strong>.";
      sol = "<p><strong>" + w1 + "</strong>: " + w2 + "</p>";
      hint = "Жирный текст — тег <strong>.</strong>";
    } else if (mode === 2) {
      exp = w1 + " " + w2;
      title = "Курсив em";
      desc = "Выведи абзац, где слово «" + w1 + "» выделено курсивом <em>.";
      sol = "<p><em>" + w1 + "</em> " + w2 + "</p>";
      hint = "Курсив — тег <em>.</em>";
    } else {
      exp = w1 + "\n" + w2;
      title = "Перенос строки";
      desc = "Выведи две строки «" + w1 + "» и «" + w2 + "» с переносом <br> между ними.";
      sol = "<p>" + w1 + "<br>" + w2 + "</p>";
      hint = "Тег <br> переносит строку внутри абзаца.";
    }
    starter = "<!-- Допиши разметку -->";
    ex = "strong и em выделяют важное, br — принудительный перенос.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }
function gHtml4(rng, lvl) {
    var site = PICK(rng, ["example.com", "learn.dev", "docs.io", "blog.ru"]);
    var label = PICK(rng, ["Узнать больше", "Открыть урок", "Читать далее", "Перейти"]);
    var pic = PICK(rng, ["photo", "logo", "banner", "avatar"]);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = label;
      title = "Ссылка на сайт";
      desc = "Сделай ссылку на https://" + site + " с текстом «" + label + "».";
      sol = "<a href=\"https://" + site + "\">" + label + "</a>";
      hint = "href — адрес, между тегами — видимый текст.";
    } else if (mode === 2) {
      exp = "Фото: " + pic;
      title = "Картинка с подписью";
      desc = "Вставь изображение " + pic + ".jpg, укажи alt-текст «Фото: " + pic + "».";
      sol = "<img src=\"" + pic + ".jpg\" alt=\"Фото: " + pic + "\">";
      hint = "alt — текст, видимый, если картинка не загрузится.";
    } else {
      exp = label;
      title = "Ссылка в новой вкладке";
      desc = "Сделай ссылку на https://" + site + " с атрибутом target=\"_blank\" и текстом «" + label + "».";
      sol = "<a href=\"https://" + site + "\" target=\"_blank\">" + label + "</a>";
      hint = "target=\"_blank\" открывает ссылку в новой вкладке.";
    }
    starter = "<!-- Допиши разметку -->";
    ex = "a — ссылки, img — изображения с alt-подписями.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gHtml5(rng, lvl) {
    var head = PICK(rng, ["Мой сайт", "Главная", "Блог", "Проект"]);
    var main = PICK(rng, ["Здесь будет контент", "Добро пожаловать", "Читайте новости"]);
    var a1 = PICK(rng, ["Главная", "О нас", "Контакты"]);
    var a2 = PICK(rng, ["Услуги", "Портфолио", "Отзывы"]);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = head + "\n" + main + "\nВнизу страницы";
      title = "Шапка, контент, подвал";
      desc = "Собери каркас: header «" + head + "», main с текстом «" + main + "», footer «Внизу страницы».";
      sol = "<header>" + head + "</header>\n<main>" + main + "</main>\n<footer>Внизу страницы</footer>";
      hint = "header, main и footer — смысловые блоки страницы.";
    } else if (mode === 2) {
      exp = "Заголовок статьи\nТекст статьи";
      title = "Статья и раздел";
      desc = "Оберни заголовок «Заголовок статьи» в article, текст «Текст статьи» — в section.";
      sol = "<article>\n  <h2>Заголовок статьи</h2>\n  <section>Текст статьи</section>\n</article>";
      hint = "article — статья, section — её раздел.";
    } else {
      exp = a1 + "\n" + a2;
      title = "Навигация";
      desc = "Выведи nav с двумя ссылками «" + a1 + "» и «" + a2 + "» (адрес — #).";
      sol = "<nav>\n  <a href=\"#\">" + a1 + "</a>\n  <a href=\"#\">" + a2 + "</a>\n</nav>";
      hint = "nav — блок навигационных ссылок.";
    }
    starter = "<!-- Допиши разметку -->";
    ex = "Семантические теги делают структуру понятной и браузеру, и читателю.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gHtml6(rng, lvl) {
    var field = PICK(rng, ["Имя", "Email", "Телефон", "Логин"]);
    var btn = PICK(rng, ["Отправить", "Сохранить", "Войти", "Готово"]);
    var opt1 = PICK(rng, ["Основной", "VIP", "Бесплатный"]);
    var opt2 = PICK(rng, ["Премиум", "Стандарт", "Бизнес"]);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = "Введите " + field;
      title = "Поле ввода";
      desc = "Создай поле <input type=\"text\"> с подписью <label> «Введите " + field + "».";
      sol = "<label>Введите " + field + "</label>\n<input type=\"text\" name=\"" + field.toLowerCase() + "\">";
      hint = "label подписывает поле, input — само поле ввода.";
    } else if (mode === 2) {
      exp = btn;
      title = "Кнопка отправки";
      desc = "Выведи кнопку с текстом «" + btn + "».";
      sol = "<button>" + btn + "</button>";
      hint = "button создаёт кликабельную кнопку.";
    } else {
      exp = opt1 + "\n" + opt2;
      title = "Выпадающий список";
      desc = "Создай <select> с опциями «" + opt1 + "» и «" + opt2 + "».";
      sol = "<select>\n  <option>" + opt1 + "</option>\n  <option>" + opt2 + "</option>\n</select>";
      hint = "select — список выбора, option — его пункты.";
    }
    starter = "<!-- Допиши разметку -->";
    ex = "label, input, button и select — базовые элементы форм.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }
function gCss1(rng, lvl) {
    var colors = ["#e91e63", "#3fb950", "#f85149", "#22d3ee", "#a371f7"];
    var c = PICK(rng, colors);
    var sel = PICK(rng, ["h1", "p", ".title", ".text"]);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = "color: " + c + ";";
      title = "Цвет текста";
      desc = "Напиши правило для " + sel + " с цветом текста " + c + ".";
      sol = sel + " {\n  color: " + c + ";\n}";
      hint = "Свойство color задаёт цвет текста, значение — HEX " + c + ".";
    } else if (mode === 2) {
      c = PICK(rng, colors);
      exp = "h1 {\n  color: " + c + ";\n}";
      title = "Стиль заголовка";
      desc = "Сделай все заголовки h1 цвета " + c + ".";
      sol = exp;
      hint = "Селектор по тегу — просто имя тега: h1.";
    } else {
      exp = ".main {\n  color: " + c + ";\n}";
      title = "Класс";
      desc = "Закрась элементы с классом main цветом " + c + ".";
      sol = exp;
      hint = "Классы в CSS пишутся с точкой: .main.";
    }
    starter = "/* Допиши правило */";
    ex = "color меняет цвет текста, селектор выбирает, какие элементы стилизовать.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gCss2(rng, lvl) {
    var colors = ["#0d1117", "#1f6feb", "#238636", "#da3633", "#8957e5"];
    var c = PICK(rng, colors);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = "background-color: " + c + ";";
      title = "Фон страницы";
      desc = "Задай всей странице (body) фон цвета " + c + ".";
      sol = "body {\n  background-color: " + c + ";\n}";
      hint = "background-color задаёт цвет фона элемента.";
    } else if (mode === 2) {
      exp = ".card {\n  background-color: " + c + ";\n}";
      title = "Фон карточки";
      desc = "Закрась класс .card цветом " + c + ".";
      sol = exp;
      hint = "Класс стилизуется через .card с точкой.";
    } else {
      exp = "background: linear-gradient(135deg, " + c + ", #000);";
      title = "Градиент";
      desc = "Дай телу линейный градиент от " + c + " к #000.";
      sol = "body {\n  background: linear-gradient(135deg, " + c + ", #000);\n}";
      hint = "background: linear-gradient(...) — плавный переход цветов.";
    }
    starter = "/* Допиши правило */";
    ex = "Фон задаётся background-color или градиентом background.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gCss3(rng, lvl) {
    var pad = RINT(rng, 2, 6) * 4;
    var mg = RINT(rng, 1, 5) * 8;
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = "padding: " + pad + "px;";
      title = "Внутренний отступ";
      desc = "Дай блокам .box внутренний отступ " + pad + "px.";
      sol = ".box {\n  padding: " + pad + "px;\n}";
      hint = "padding — расстояние от текста до границы блока.";
    } else if (mode === 2) {
      exp = ".box {\n  margin: " + mg + "px;\n}";
      title = "Внешний отступ";
      desc = "Отодвинь .box от соседей на " + mg + "px.";
      sol = exp;
      hint = "margin — пустое место вокруг блока.";
    } else {
      pad = RINT(rng, 2, 5) * 4;
      mg = RINT(rng, 1, 4) * 8;
      exp = ".box {\n  margin: " + mg + "px;\n  padding: " + pad + "px;\n}";
      title = "Поля и отступы вместе";
      desc = "Задай .box внешний отступ " + mg + "px и внутренний " + pad + "px.";
      sol = exp;
      hint = "margin снаружи, padding внутри одного правила.";
    }
    starter = "/* Допиши правило */";
    ex = "margin — внешний, padding — внутренний отступ блока.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }
function gCss4(rng, lvl) {
    var colors = ["#3fb950", "#f85149", "#e8b93d", "#7c6cf0"];
    var c = PICK(rng, colors);
    var r = RINT(rng, 4, 12);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = ".box {\n  border: 2px solid " + c + ";\n}";
      title = "Рамка";
      desc = "Обведи .box рамкой 2px solid цвета " + c + ".";
      sol = exp;
      hint = "border: толщина стиль цвет.";
    } else if (mode === 2) {
      exp = ".box {\n  border: 3px dashed " + c + ";\n}";
      title = "Пунктирная рамка";
      desc = "Сделай .box рамку 3px dashed цвета " + c + ".";
      sol = exp;
      hint = "Стиль dashed — пунктирная линия.";
    } else {
      exp = ".box {\n  border-radius: " + r + "px;\n}";
      title = "Скругление углов";
      desc = "Скругли углы .box на " + r + "px.";
      sol = exp;
      hint = "border-radius смягчает углы блока.";
    }
    starter = "/* Допиши правило */";
    ex = "border рисует рамку, border-radius скругляет углы.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gCss5(rng, lvl) {
    var font = PICK(rng, ["Arial", "Georgia", "Verdana", "Courier New"]);
    var size = RINT(rng, 12, 32);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = "p {\n  font-family: \"" + font + "\", sans-serif;\n}";
      title = "Шрифт текста";
      desc = "Задай абзацам шрифт " + font + ".";
      sol = exp;
      hint = "font-family — семейство шрифтов, sans-serif как запасной.";
    } else if (mode === 2) {
      exp = "h1 {\n  font-size: " + size + "px;\n}";
      title = "Размер шрифта";
      desc = "Сделай заголовки h1 размером " + size + "px.";
      sol = exp;
      hint = "font-size задаёт размер шрифта.";
    } else {
      exp = ".btn {\n  font-size: " + size + "px;\n  font-weight: bold;\n}";
      title = "Крупная жирная кнопка";
      desc = "Сделай .btn размером " + size + "px и жирным.";
      sol = exp;
      hint = "font-weight: bold утолщает начертание.";
    }
    starter = "/* Допиши правило */";
    ex = "font-family, font-size и font-weight управляют типографикой.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gCss6(rng, lvl) {
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = ".row {\n  display: flex;\n  justify-content: center;\n}";
      title = "Центрирование flex";
      desc = "Сделай .row flex-контейнером и отцентрируй содержимое по горизонтали.";
      sol = exp;
      hint = "justify-content: center — центр по главной оси.";
    } else if (mode === 2) {
      exp = ".col {\n  display: flex;\n  flex-direction: column;\n}";
      title = "Колонка";
      desc = "Сделай .col flex-колонкой (элементы сверху вниз).";
      sol = exp;
      hint = "flex-direction: column — вертикальное расположение.";
    } else {
      exp = ".wrap {\n  display: flex;\n  gap: 16px;\n}";
      title = "Промежутки gap";
      desc = "Сделай .wrap flex-контейнером с промежутком 16px между элементами.";
      sol = exp;
      hint = "gap — расстояние между flex-элементами.";
    }
    starter = "/* Допиши правило */";
    ex = "display: flex включает flexbox-раскладку, gap — промежутки.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }
function sqlRows(rng, lvl) {
    var names = ["Anna", "Bob", "Max", "Zoe", "Eva", "Leo", "Ira", "Tim"];
    var rows = [];
    var used = {};
    var i, nm;
    for (i = 0; i < 4; i++) {
      do { nm = PICK(rng, names); } while (used[nm]);
      used[nm] = 1;
      rows.push({ n: nm, a: RINT(rng, 11, 18) });
    }
    return rows;
  }

  function sqlTab(rows) {
    var s = "id | name | age";
    var i;
    for (i = 0; i < rows.length; i++) {
      s = s + "\n" + (i + 1) + "  | " + rows[i].n + "  | " + rows[i].a;
    }
    return s;
  }

  function gSql1(rng, lvl) {
    var rows = sqlRows(rng, lvl);
    var names = [];
    var i;
    for (i = 0; i < rows.length; i++) { names.push(rows[i].n); }
    var title = "Простая выборка";
    var desc = "Таблица students: {" + sqlTab(rows).split("\n").join(" | ") + "}. Верни все имена студентов.";
    var sol = "SELECT name FROM students;";
    var hint = "SELECT <колонка> FROM <таблица> выбирает нужные столбцы.";
    var ex = "SELECT задаёт, какие колонки и из какой таблицы вернуть.";
    return mk(title, desc, "-- Введи запрос", hint, sol, names.join("\n"), ex, "none");
  }

  function gSql2(rng, lvl) {
    var rows = sqlRows(rng, lvl);
    var t = RINT(rng, 11, 14);
    var out = [];
    var i, allLow = true;
    for (i = 0; i < rows.length; i++) {
      if (rows[i].a > t) { out.push(rows[i].n); allLow = false; }
    }
    if (allLow) {
      t = 10;
      out = [];
      for (i = 0; i < rows.length; i++) { if (rows[i].a > t) { out.push(rows[i].n); } }
    }
    var title = "Фильтр WHERE";
    var desc = "Таблица students: " + sqlTab(rows).split("\n").join(" | ") + ". Верни имена старше " + t + " лет.";
    var sol = "SELECT name FROM students WHERE age > " + t + ";";
    var hint = "WHERE отсекает строки по условию про колонку age.";
    var ex = "WHERE — условие, оставляющее только подходящие строки.";
    return mk(title, desc, "-- Введи запрос", hint, sol, out.join("\n"), ex, "none");
  }

  function gSql3(rng, lvl) {
    var rows = sqlRows(rng, lvl);
    var sorted = rows.slice(0).sort(function (a, b) { return b.a - a.a; });
    var out = [];
    var i;
    for (i = 0; i < sorted.length; i++) { out.push(sorted[i].n + ": " + sorted[i].a); }
    var title = "Сортировка ORDER BY";
    var desc = "Таблица students: " + sqlTab(rows).split("\n").join(" | ") + ". Верни имена с возрастом, отсортированные по убыванию.";
    var sol = "SELECT name, age FROM students ORDER BY age DESC;";
    var hint = "ORDER BY age DESC — сортировка по возрасту вниз.";
    var ex = "ORDER BY сортирует строки по выбранной колонке.";
    return mk(title, desc, "-- Введи запрос", hint, sol, out.join("\n"), ex, "none");
  }

  function gSql4(rng, lvl) {
    var rows = sqlRows(rng, lvl);
    var title = "Подсчёт строк";
    var desc = "Сколько строк в таблице students (см. таблицу: " + sqlTab(rows).split("\n").join(" | ") + ")? Верни число.";
    var sol = "SELECT COUNT(*) FROM students;";
    var hint = "COUNT(*) считает количество строк.";
    var ex = "COUNT(*) возвращает число строк в выборке.";
    return mk(title, desc, "-- Введи запрос", hint, sol, String(rows.length), ex, "none");
  }

  function gSql5(rng, lvl) {
    var rows = sqlRows(rng, lvl);
    var sum = 0;
    var i;
    for (i = 0; i < rows.length; i++) { sum = sum + rows[i].a; }
    var title = "Сумма значений";
    var desc = "Найди сумму возрастов всех студентов таблицы (см. " + sqlTab(rows).split("\n").join(" | ") + ").";
    var sol = "SELECT SUM(age) FROM students;";
    var hint = "SUM(колонка) складывает значения столбца.";
    var ex = "SUM складывает все значения выбранной колонки.";
    return mk(title, desc, "-- Введи запрос", hint, sol, String(sum), ex, "none");
  }

  function gSql6(rng, lvl) {
    var rows = sqlRows(rng, lvl);
    var out = [rows[0].n, rows[1].n];
    var title = "Ограничение LIMIT";
    var desc = "Верни только первых двух студентов таблицы (см. " + sqlTab(rows).split("\n").join(" | ") + ").";
    var sol = "SELECT name FROM students LIMIT 2;";
    var hint = "LIMIT N ограничивает число возвращаемых строк.";
    var ex = "LIMIT берёт первые N строк результата.";
    return mk(title, desc, "-- Введи запрос", hint, sol, out.join("\n"), ex, "none");
  }
function gBash1(rng, lvl) {
    var greet = PICK(rng, ["Hello", "Hi", "Привет"]);
    var whom = PICK(rng, ["world", "friend", "user", "team"]);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = greet + ", " + whom + "!";
      title = "Эхо строки";
      desc = "Напиши команду, которая выводит текст «" + exp + "».";
      sol = "echo \"" + exp + "\"";
      hint = "echo печатает текст в терминал.";
    } else if (mode === 2) {
      exp = "name=" + whom + "\n" + greet + ", $name!";
      title = "Переменная";
      desc = "Сохрани «" + whom + "» в переменную name и выведи «" + greet + ", $name!».";
      sol = "name=" + whom + "\necho \"" + greet + ", $name!\"";
      hint = "Переменной присваивается без $, читается через $name.";
    } else {
      exp = greet + "\n" + whom;
      title = "Два вывода";
      desc = "Выведи две строки: «" + greet + "» и «" + whom + "».";
      sol = "echo \"" + greet + "\"\necho \"" + whom + "\"";
      hint = "Две команды echo выводят две строки.";
    }
    starter = "# Допиши команду";
    ex = "echo выводит текст, переменные хранят значения ($имя).";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gBash2(rng, lvl) {
    var lo = 2 + (lvl - 1) * 3;
    var hi = 9 + (lvl - 1) * 8;
    var n = RINT(rng, lo, hi);
    var m = RINT(rng, lo, hi);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp;
    var ex = "Арифметика в bash — двойные скобки $((...)).";
    if (mode === 1) {
      exp = String(n + m);
      title = "Сумма в терминале";
      desc = "Выведи сумму " + n + " + " + m + ".";
      sol = "echo $(( " + n + " + " + m + " ))";
      hint = "Сложение: echo $(( " + n + " + " + m + " )).";
    } else if (mode === 2) {
      exp = String(n * m);
      title = "Произведение через переменные";
      desc = "Сохрани " + n + " и " + m + " в переменные a и b, выведи a * b.";
      sol = "a=" + n + "\nb=" + m + "\necho $(( a * b ))";
      hint = "Сначала a=" + n + " и b=" + m + ", затем $(( a * b )).";
    } else {
      exp = String(n - m);
      title = "Разность";
      desc = "Выведи разность " + n + " - " + m + ".";
      sol = "echo $(( " + n + " - " + m + " ))";
      hint = "Вычитание в $((...)): " + n + " - " + m + ".";
    }
    starter = "# Допиши команду";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gBash3(rng, lvl) {
    var n = RINT(rng, 5, 18);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp;
    var ex = "if/fi — условный оператор bash, [ ] — проверка.";
    if (mode === 1) {
      exp = n % 2 === 0 ? "Even" : "Odd";
      title = "Чёт или нечёт";
      desc = "Проверь " + n + ": выведи Even, если чётное, иначе Odd.";
      sol = "n=" + n + "\nif [ $((n % 2)) -eq 0 ]; then\n  echo Even\nelse\n  echo Odd\nfi";
      hint = "Остаток от 2 сравнивается с 0: [ $((n % 2)) -eq 0 ].";
    } else if (mode === 2) {
      var m = RINT(rng, 5, 18);
      exp = n > m ? "yes" : "no";
      title = "Какое больше";
      desc = "Выведи yes, если " + n + " больше " + m + ", иначе no.";
      sol = "a=" + n + "\nb=" + m + "\nif [ $a -gt $b ]; then\n  echo yes\nelse\n  echo no\nfi";
      hint = "-gt означает «больше»: [ $a -gt $b ].";
    } else {
      exp = n > 10 ? "big" : "small";
      title = "Большое или малое";
      desc = "Выведи big, если " + n + " больше 10, иначе small.";
      sol = "n=" + n + "\nif [ $n -gt 10 ]; then\n  echo big\nelse\n  echo small\nfi";
      hint = "Проверка [ $n -gt 10 ].";
    }
    starter = "# Допиши условие";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }
function gBash4(rng, lvl) {
    var n = RINT(rng, 4, 6 + lvl * 2);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp, i, s, out;
    var ex = "for по seq перебирает диапазон чисел, $i — текущее.";
    if (mode === 1) {
      out = "";
      for (i = 1; i <= n; i++) { out = out + (i === 1 ? "" : "\n") + i; }
      exp = out;
      title = "Счёт от 1 до N";
      desc = "Выведи числа от 1 до " + n + ", каждое с новой строки.";
      sol = "for i in $(seq 1 " + n + "); do\n  echo $i\ndone";
      hint = "seq 1 " + n + " порождает числа, цикл их печатает.";
    } else if (mode === 2) {
      out = "";
      for (i = n; i >= 1; i--) { out = out + (i === n ? "" : "\n") + i; }
      exp = out;
      title = "Обратный отсчёт";
      desc = "Выведи числа от " + n + " до 1.";
      sol = "for (( i = " + n + "; i >= 1; i-- )); do\n  echo $i\ndone";
      hint = "C-стиль цикла: for (( i = " + n + "; i >= 1; i-- )).";
    } else {
      s = 0;
      for (i = 1; i <= n; i++) { s = s + i; }
      exp = String(s);
      title = "Сумма в цикле";
      desc = "Посчитай сумму чисел от 1 до " + n + " и выведи её.";
      sol = "s=0\nfor i in $(seq 1 " + n + "); do\n  s=$(( s + i ))\ndone\necho $s";
      hint = "Накопление: s=$(( s + i )) внутри цикла.";
    }
    starter = "# Допиши цикл";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gBash5(rng, lvl) {
    var items = ["alpha", "beta", "gamma", "delta", "echo", "foxtrot"];
    var k = 3 + RINT(rng, 0, 2);
    var sel = [];
    var used = {};
    var it, i, mode, title, desc, starter, hint, sol, exp, out;
    while (sel.length < k) {
      it = PICK(rng, items);
      if (!used[it]) { used[it] = 1; sel.push(it); }
    }
    mode = RINT(rng, 1, 3);
    out = "";
    for (i = 0; i < sel.length; i++) { out = out + (i === 0 ? "" : "\n") + sel[i]; }
    exp = out;
    ex = "Массив в bash: arr=(...), перебор — for i in \"${arr[@]}\".";
    if (mode === 1) {
      title = "Массив и перебор";
      desc = "Создай массив из слов " + sel.join(" ") + " и выведи каждое на новой строке.";
      sol = "arr=( " + sel.join(" ") + " )\nfor i in \"${arr[@]}\"; do\n  echo $i\ndone";
      hint = "\"${arr[@]}\" разворачивает массив в список.";
    } else if (mode === 2) {
      title = "Число элементов";
      desc = "Создай массив " + sel.join(" ") + " и выведи его размер.";
      sol = "arr=( " + sel.join(" ") + " )\necho ${#arr[@]}";
      hint = "${#arr[@]} — размер массива.";
    } else {
      title = "Индексная выборка";
      desc = "Создай массив " + sel.join(" ") + " и выведи первый элемент.";
      sol = "arr=( " + sel.join(" ") + " )\necho ${arr[0]}";
      hint = "${arr[0]} — элемент по индексу 0.";
    }
    starter = "# Допиши работу с массивом";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gBash6(rng, lvl) {
    var greet = PICK(rng, ["Hello", "Hi", "Привет"]);
    var who = PICK(rng, ["world", "friend"]);
    var mode = RINT(rng, 1, 3);
    var title, desc, starter, hint, sol, exp;
    var ex = "Скрипт — файл с командами, запускается через ./имя.";
    if (mode === 1) {
      exp = greet + ", " + who + "!";
      title = "Первый скрипт";
      desc = "Собери скрипт: первая строка — shebang, затем команда, которая печатает «" + exp + "», и сделай его исполняемым.";
      sol = "#!/bin/bash\necho \"" + exp + "\"\n# запуск: chmod +x script.sh && ./script.sh";
      hint = "Важны shebang #!/bin/bash и её строка echo.";
    } else if (mode === 2) {
      exp = greet + ", $1!";
      title = "Аргументы скрипта";
      desc = "Скрипт принимает аргумент: выведи «" + greet + ", $1!» с первым аргументом.";
      sol = "#!/bin/bash\necho \"" + greet + ", $1!\"";
      hint = "$1 — первый аргумент командной строки.";
    } else {
      exp = "Done";
      title = "Выход по коду";
      desc = "Скрипт, который печатает Done и завершается успешным кодом 0.";
      sol = "#!/bin/bash\necho Done\nexit 0";
      hint = "exit 0 — сигнал «успешно завершено».";
    }
    starter = "# Допиши скрипт";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }
function gScr1(rng, lvl) {
    var greet = PICK(rng, ["Hello!", "Привет!", "Hi!", "Всем привет!"]);
    var t = 2 + RINT(rng, 0, 2);
    var mode = RINT(rng, 1, 4);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = greet;
      title = "Событие «когда флажок нажат»";
      desc = "Собери скрипт: как только зелёный флажок нажат, котик говорит «" + greet + "» " + t + " секунды.";
      sol = "когда флажок нажат → сказать «" + greet + "» " + t + " секунд";
      hint = "Категория «События» → блок «когда флажок нажат», затем «Внешность» → «сказать».";
    } else if (mode === 2) {
      exp = greet;
      title = "Сообщение спрайту";
      desc = "При щелчке по спрайту он должен говорить «" + greet + "».";
      sol = "когда этот спрайт нажат → сказать «" + greet + "»";
      hint = "Событие «когда этот спрайт нажат» из категории «События» запускает речь.";
    } else if (mode === 3) {
      var bye = PICK(rng, ["Пока!", "До встречи!", "Bye!"]);
      var wt = 1 + RINT(rng, 0, 1);
      exp = greet + "\n" + bye;
      title = "Две реплики с паузой";
      desc = "Котик говорит «" + greet + "», затем ждёт " + wt + (wt === 1 ? " секунду" : " секунды") + " и говорит «" + bye + "».";
      sol = "сказать «" + greet + "»\nждать " + wt + " секунд\nсказать «" + bye + "»";
      hint = "Три блока подряд: «сказать», «ждать … секунд» (Управление), «сказать».";
    } else {
      var steps = 5 + RINT(rng, 0, 5) * 5;
      exp = greet;
      title = "Движение и речь";
      desc = "Когда флажок нажат, котик проходит " + steps + " шагов и говорит «" + greet + "».";
      sol = "когда флажок нажат → идти " + steps + " шагов → сказать «" + greet + "»";
      hint = "Категория «Движение» → «идти … шагов», затем «Внешность» → «сказать».";
    }
    starter = "// Допиши логику блоками";
    ex = "Программа обычно начинается с события «когда флажок нажат». Блок «сказать» показывает пузырь с текстом, «идти … шагов» перемещает спрайта.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gScr2(rng, lvl) {
    var name = PICK(rng, ["n", "score", "level", "points"]);
    var v = RINT(rng, 1, 20 + lvl * 5);
    var who = PICK(rng, ["Герой", "Котик", "Бот"]);
    var mode = RINT(rng, 1, 4);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = String(v);
      title = "Переменная";
      desc = "Создай переменную " + name + ", присвой ей " + v + " и скажи её значение.";
      sol = "установить «" + name + "» в " + v + " → сказать «" + name + "»";
      hint = "Категория «Переменные» → «установить … в …» задаёт значение переменной.";
    } else if (mode === 2) {
      exp = String(v * 2);
      title = "Переменная и арифметика";
      desc = "Переменной " + name + " задай " + v + ", затем измени её на +" + v + " и скажи результат.";
      sol = "установить «" + name + "» в " + v + " → изменить «" + name + "» на " + v + " → сказать «" + name + "»";
      hint = "Блок «изменить «" + name + "» на …» прибавляет число к переменной.";
    } else if (mode === 3) {
      exp = who + ": " + v;
      title = "Склейка текста";
      desc = "Собери текст «" + who + ": " + v + "» из имени и значения " + name + " и скажи его.";
      sol = "сказать «соединить [" + who + ": ] и [" + name + "]»";
      hint = "Оператор «соединить … и …» склеивает две части текста: имя и переменную.";
    } else {
      exp = String(v);
      title = "Переменная на сцене";
      desc = "Создай переменную " + name + ", присвой ей " + v + ", затем отметь галочку «отображать переменную», чтобы значение появилось на сцене.";
      sol = "установить «" + name + "» в " + v + " → отображать переменную " + name;
      hint = "Рядом с блоком переменной есть галочка — она показывает значение на сцене.";
    }
    starter = "// Допиши логику блоками";
    ex = "Переменные хранят числа и текст; категория «Переменные» даёт блоки «установить», «изменить» и галочку видимости на сцене.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gScr3(rng, lvl) {
    var k = 2 + RINT(rng, 0, 2);
    var word = PICK(rng, ["Go!", "Вперёд!", "Yeah!"]);
    var i, out = "";
    for (i = 0; i < k; i++) { out = out + (i === 0 ? "" : "\n") + word; }
    var mode = RINT(rng, 1, 4);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = out;
      title = "Повторить N раз";
      desc = "Сделай блок «повторить " + k + " раз», внутри — «сказать «" + word + "»».";
      sol = "повторить " + k + " раз → сказать «" + word + "»";
      hint = "Категория «Управление» → «повторить … раз» выполнит тело несколько раз.";
    } else if (mode === 2) {
      exp = out;
      title = "Повторить 3 раза";
      desc = "Оберни «изменить «шаг» на 10» и «сказать» в цикл «повторить " + k + " раз».";
      sol = "повторить " + k + " раз → изменить «шаг» на 10 → сказать «шаг»";
      hint = "Внутри цикла может быть несколько блоков подряд.";
    } else if (mode === 3) {
      exp = word;
      title = "Вечно";
      desc = "Сделай цикл «повторять всегда», чтобы котик повторял «" + word + "» без остановки.";
      sol = "повторить 100 раз → сказать «" + word + "»";
      hint = "В редакторе есть блок «повторить … раз»: «повторить 100 раз» практически вечно.";
    } else {
      var dist = 10 * k;
      exp = dist + " шагов";
      title = "Движение в цикле";
      desc = "Собери скрипт «повторить " + k + " раз → идти 10 шагов». Сколько всего шагов пройдёт котик за " + k + " повторений? Выведи фразу «<число> шагов».";
      sol = "повторить " + k + " раз → идти 10 шагов → сказать «" + dist + " шагов»";
      hint = "Каждое повторение добавляет 10 шагов: 10 × " + k + " = " + dist + ".";
    }
    starter = "// Допиши логику блоками";
    ex = "Циклы в Scratch — блоки «повторить N раз» и «повторять всегда» из категории «Управление».";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gScr4(rng, lvl) {
    var n = RINT(rng, 4, 12 + lvl * 3);
    var yes = PICK(rng, ["Чётное!", "Even!"]);
    var no = PICK(rng, ["Нечётное", "Odd"]);
    var mode = RINT(rng, 1, 4);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = n % 2 === 0 ? yes : no;
      title = "Условие «если»";
      desc = "Спроси пользователя «Число?» и сохрани ответ в переменную x. Если x чётное, скажи «" + yes + "», иначе — «" + no + "».";
      hint = "Блок «спросить … и ждать» читает ответ; условие проверяет «остаток от деления x на 2».";
      sol = "спросить «Число?» и ждать → x = ответ → если (x mod 2) = 0 → сказать «" + yes + "» иначе → сказать «" + no + "»";
    } else if (mode === 2) {
      exp = n > 10 ? "yes" : "no";
      title = "Сравнение";
      desc = "Возьми x = " + n + ". Если x > 10, скажи yes, иначе no.";
      sol = "если x > 10 → сказать «yes» иначе → сказать «no»";
      hint = "Операторы сравнения (=, >, <) возвращают «истина/ложь» для условия.";
    } else if (mode === 3) {
      exp = n > 0 ? "positive" : "negative";
      title = "Знак числа";
      desc = "Возьми x = " + n + ". Если x > 0, скажи positive, иначе negative.";
      sol = "если x > 0 → сказать «positive» иначе → сказать «negative»";
      hint = "Двухветочный блок «если … то, иначе» из категории «Управление».";
    } else {
      var kpos = PICK(rng, ["пробел", "стрелка вправо", "клавиша a"]);
      exp = n % 2 === 0 ? "yes" : "no";
      title = "Условие с клавишей";
      desc = "Если нажата клавиша «" + kpos + "», котик говорит yes, иначе — no.";
      sol = "когда флажок нажат → если клавиша «" + kpos + "» нажата → сказать «yes» иначе → сказать «no»";
      hint = "Условие «клавиша … нажата?» живёт в блоке переключателя в категории «События/Ощущения» и принимает значение «истина» при нажатии.";
    }
    starter = "// Допиши логику блоками";
    ex = "Блок «если … то, иначе» из категории «Управление» выбирает один из путей по условию.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gScr5(rng, lvl) {
    var pool = ["яблоко", "банан", "вишня", "слива", "киви"];
    var a1 = PICK(rng, pool);
    var a2 = PICK(rng, pool);
    var mode = RINT(rng, 1, 4);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = a1 + "\n" + a2;
      title = "Добавить в список";
      desc = "Создай список «корзина», добавь «" + a1 + "» и «" + a2 + "», перебери и скажи каждый пункт.";
      sol = "добавить «" + a1 + "» в список «корзина» → добавить «" + a2 + "» → счётчик = 1 → повторять 2 → сказать «элемент … из списка»";
      hint = "Категория «Списки» → «добавить … в список» пополняет список.";
    } else if (mode === 2) {
      exp = a1;
      title = "Первый элемент";
      desc = "Добавь «" + a1 + "» и «" + a2 + "» в список и скажи его первый пункт.";
      sol = "добавить «" + a1 + "» в список → добавить «" + a2 + "» → сказать «элемент 1 из списка»";
      hint = "Элементы списка нумеруются с 1: «элемент 1 из списка».";
    } else if (mode === 3) {
      exp = "2";
      title = "Размер списка";
      desc = "Добавь «" + a1 + "» и «" + a2 + "» в список и скажи количество его пунктов.";
      sol = "добавить «" + a1 + "» в список → добавить «" + a2 + "» → сказать «длина списка»";
      hint = "Блок «длина списка» из категории «Списки» возвращает число пунктов.";
    } else {
      var a3 = PICK(rng, pool);
      while (a3 === a1 || a3 === a2) { a3 = PICK(rng, pool); }
      exp = a1 + "\n" + a2;
      title = "Удалить элемент";
      desc = "Добавь в список «" + a1 + "», «" + a2 + "» и «" + a3 + "», затем удали «" + a3 + "» и скажи оставшиеся пункты.";
      sol = "добавить «" + a1 + "» в список → добавить «" + a2 + "» → добавить «" + a3 + "» → удалить «" + a3 + "» из списка → сказать оставшиеся элементы";
      hint = "Блок «удалить … из списка» убирает элемент; затем перебором покажи оставшиеся.";
    }
    starter = "// Допиши логику блоками";
    ex = "Списки хранят много значений; категория «Списки» даёт «добавить», «удалить», «элемент … из списка» и «длина списка».";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gScr6(rng, lvl) {
    var n = RINT(rng, 3, 5 + lvl);
    var word = PICK(rng, ["Прыжок!", "Танцуй!"]);
    var i, out = "";
    for (i = 1; i <= n; i++) { out = out + (i === 1 ? "" : "\n") + "шаг " + i; }
    var mode = RINT(rng, 1, 4);
    var title, desc, starter, hint, sol, exp, ex;
    if (mode === 1) {
      exp = out;
      title = "Мини-проект: шаги";
      desc = "Собери проект: спрайт делает " + n + " шагов, после каждого говорит «шаг <номер>».";
      sol = "когда флажок нажат → повторить " + n + " раз → идти 10 шагов → сказать «шаг <счётчик>»";
      hint = "Используй счётчик цикла в тексте блока «сказать» (блок «счётчик» из «Управления»).";
    } else if (mode === 2) {
      exp = word;
      title = "Клавиша управления";
      desc = "При нажатии пробела спрайт говорит «" + word + "».";
      sol = "когда клавиша «пробел» нажата → сказать «" + word + "»";
      hint = "Событие «когда клавиша … нажата» из категории «События».";
    } else if (mode === 3) {
      exp = "Уровень " + n + " пройден!";
      title = "Итог проекта";
      desc = "Когда переменная «уровень» станет " + n + ", спрайт скажет «Уровень " + n + " пройден!».";
      sol = "если уровень = " + n + " → сказать «Уровень " + n + " пройден!»";
      hint = "Сравни переменную «уровень» с числом и перейдя на условие используй блок «если … то, иначе».";
    } else {
      var out2 = "";
      for (i = 1; i <= n; i++) { out2 = out2 + (i === 1 ? "" : "\n") + (i * 10) + " шагов"; }
      exp = out2;
      title = "Музыка и движение";
      desc = "Проект: котик в цикле из " + n + " повторений идёт по 10 шагов, после каждого повторения говорит «<число шагов>», а пока едет — играет звук «скрипка».";
      sol = "когда флажок нажат → повторить " + n + " раз → идти 10 шагов → сказать «<счётчик шагов>» → играть звук «скрипка» до завершения";
      hint = "Соедини Движение («идти … шагов») и Звук («играть звук … до завершения») внутри цикла «повторить».";
    }
    starter = "// Допиши логику блоками";
    ex = "Мини-проект объединяет события, циклы, условия, звук и движение в один скрипт.";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gScr7(rng, lvl) {
    var bg1 = PICK(rng, ["Космос", "Лес", "Город", "Океан"]);
    var bg2 = PICK(rng, ["Ночь", "Стадион", "Замок"]);
    var msg = PICK(rng, ["Старт", "Победа", "Финал"]);
    var mode = RINT(rng, 1, 4);
    var title, desc, starter, hint, sol, exp, ex;
    ex = "События связывают скрипты: «передать сообщение» будит другие, а «сменить фон» меняет сцену.";
    if (mode === 1) {
      exp = "Старт!";
      title = "Фон на старте";
      desc = "По зелёному флажку смени фон на «" + bg1 + "» и скажи «Старт!».";
      sol = "когда флажок нажат → сменить фон на «" + bg1 + "» → сказать «Старт!»";
      hint = "Категория «События» → «когда флажок нажат»; «Оформление» → «сменить фон на …»; «Внешность» → «сказать».";
    } else if (mode === 2) {
      exp = "Ура!";
      title = "Получение сообщения";
      desc = "Когда спрайт получит сообщение «" + msg + "», смени фон на «" + bg2 + "» и скажи «Ура!».";
      sol = "когда я получу «" + msg + "» → сменить фон на «" + bg2 + "» → сказать «Ура!»";
      hint = "Категория «События» → «когда я получу …»; «Оформление» → «сменить фон на …»; «Внешность» → «сказать».";
    } else if (mode === 3) {
      exp = "Отправил!";
      title = "Передача сообщения";
      desc = "По флажку передай сообщение «" + msg + "» и скажи «Отправил!».";
      sol = "когда флажок нажат → передать сообщение «" + msg + "» → сказать «Отправил!»";
      hint = "«События» → «передать сообщение …» запускает скрипты с «когда я получу»; «Внешность» → «сказать».";
    } else {
      exp = "Тёмный уровень!";
      title = "Фон по условию";
      desc = "Если «уровень» > 5, смени фон на «Ночь» и скажи «Тёмный уровень!», иначе смени фон на «День».";
      sol = "если уровень > 5 → сменить фон на «Ночь» → сказать «Тёмный уровень!» иначе → сменить фон на «День»";
      hint = "«Управление» → «если … то, иначе»; «Переменные» → «уровень»; «Оформление» → «сменить фон на …»; «Внешность» → «сказать».";
    }
    starter = "// Допиши логику блоками";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }

  function gScr8(rng, lvl) {
    var k = 2 + RINT(rng, 0, 2 + lvl);
    var step = 5;
    var mode = RINT(rng, 1, 4);
    var title, desc, starter, hint, sol, exp, ex;
    ex = "Мини-игра сочетает цикл игры, очки, звук и условие победы.";
    if (mode === 1) {
      exp = "Взял!";
      title = "Ловим предмет";
      desc = "Повторяй всегда: если герой касается «яблока», измени «очки» на 1, играй звук «поп» и скажи «Взял!».";
      sol = "когда флажок нажат → повторять всегда → если касается «яблока» → изменить «очки» на 1 → играть звук «поп» → сказать «Взял!»";
      hint = "«События» → «когда флажок нажат»; «Управление» → «повторять всегда», «если … то»; «Ощущения» → «касается …?»; «Переменные» → «изменить … на 1»; «Звук» → «играть звук»; «Внешность» → «сказать».";
    } else if (mode === 2) {
      exp = "Победа!";
      title = "Условие победы";
      desc = "Если «очки» > 100, скажи «Победа!» и останови всё, иначе скажи «Играем…».";
      sol = "если очки > 100 → сказать «Победа!» → остановить всё иначе → сказать «Играем…»";
      hint = "«Управление» → «если … то, иначе», «остановить всё»; «Переменные» → «очки»; «Внешность» → «сказать».";
    } else if (mode === 3) {
      exp = "Прыжок!";
      title = "Прыжок по клавише";
      desc = "Когда нажата «стрелка вверх», измени y на 50, играй звук «пузырь» и скажи «Прыжок!».";
      sol = "когда клавиша «стрелка вверх» нажата → изменить y на 50 → играть звук «пузырь» → сказать «Прыжок!»";
      hint = "«События» → «когда клавиша … нажата»; «Движение» → «изменить y на …»; «Звук» → «играть звук»; «Внешность» → «сказать».";
    } else {
      exp = String(k * step);
      title = "Очки в серии";
      desc = "Установи «очки» в 0, повтори " + k + " раз: измени «очки» на " + step + ". В конце скажи «очки».";
      sol = "когда флажок нажат → установить «очки» в 0 → повторить " + k + " раз → изменить «очки» на " + step + " → сказать «очки»";
      hint = "«События» → «когда флажок нажат»; «Переменные» → «установить „очки“ в 0», «изменить … на " + step + "»; «Управление» → «повторить " + k + " раз»; «Внешность» → «сказать “очки”».";
    }
    starter = "// Допиши логику блоками";
    return mk(title, desc, starter, hint, sol, exp, ex, "none");
  }
window.MENTOR_COURSES = [
{
      id: "python", name: "Python", nameRu: "Python", tag: "🐍", color: "#3776ab", runner: "py",
      startup: false,
      assessment: { q: [ { t: "Что выведет print(7 // 2)?", a: "3", b: "3.5", c: "ошибка", k: "a" }, { t: "Каким ключевым словом объявляют функцию?", a: "function", b: "def", c: "fun", k: "b" }, { t: "Какой тип у числа 3.14?", a: "int", b: "float", c: "real", k: "b" } ], starter: "a = 5\nprint(a + \" рублей\")", good: "5 рублей" },
      topics: [
        { key: "py_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.python, rng, l); } },
        { key: "py_str", name: { ru: "Строки", en: "Strings" }, level: 1, gen: function (rng, l) { return gStr(L.python, rng, l); } },
        { key: "py_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.python, rng, l); } },
        { key: "py_loop", name: { ru: "Циклы", en: "Loops" }, level: 2, gen: function (rng, l) { return gLoop(L.python, rng, l); } },
        { key: "py_arr", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gArr(L.python, rng, l); } },
        { key: "py_fn", name: { ru: "Функции", en: "Functions" }, level: 3, gen: function (rng, l) { return gProj(L.python, rng, l); } }
      ]
    },
    {
      id: "javascript", name: "JavaScript", nameRu: "JavaScript", tag: "🌐", color: "#e8b93d", runner: "js",
      startup: false,
      assessment: { q: [ { t: "Что выведет typeof []?", a: "array", b: "object", c: "list", k: "b" }, { t: "Чем === отличается от ==?", a: "ничем", b: "строгое равенство без приведения типов", c: "присваивание", k: "b" }, { t: "Какой метод убирает последний элемент массива?", a: "push()", b: "shift()", c: "pop()", k: "c" } ], starter: "console.log(5 + \"5\");", good: "10" },
      topics: [
        { key: "js_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.javascript, rng, l); } },
        { key: "js_str", name: { ru: "Строки", en: "Strings" }, level: 1, gen: function (rng, l) { return gStr(L.javascript, rng, l); } },
        { key: "js_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.javascript, rng, l); } },
        { key: "js_loop", name: { ru: "Циклы", en: "Loops" }, level: 2, gen: function (rng, l) { return gLoop(L.javascript, rng, l); } },
        { key: "js_arr", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gArr(L.javascript, rng, l); } },
        { key: "js_fn", name: { ru: "Функции", en: "Functions" }, level: 3, gen: function (rng, l) { return gProj(L.javascript, rng, l); } }
      ]
    },
    {
      id: "typescript", name: "TypeScript", nameRu: "TypeScript", tag: "🔷", color: "#3178c6", runner: "js",
      startup: true,
      assessment: { q: [ { t: "Чем TypeScript отличается от JavaScript?", a: "статической типизацией", b: "скоростью в браузере", c: "отсутствием функций", k: "a" }, { t: "Как объявить тип переменной?", a: "x % number", b: "x: number", c: "var x number", k: "b" }, { t: "Что делает компилятор tsc?", a: "компилирует .ts в .js", b: "запускает браузер", c: "устанавливает пакеты", k: "a" } ], starter: "let n: string = 42;\nconsole.log(n);", good: "42" },
      topics: [
        { key: "ts_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.typescript, rng, l); } },
        { key: "ts_str", name: { ru: "Строки", en: "Strings" }, level: 1, gen: function (rng, l) { return gStr(L.typescript, rng, l); } },
        { key: "ts_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.typescript, rng, l); } },
        { key: "ts_loop", name: { ru: "Циклы", en: "Loops" }, level: 2, gen: function (rng, l) { return gLoop(L.typescript, rng, l); } },
        { key: "ts_arr", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gArr(L.typescript, rng, l); } },
        { key: "ts_fn", name: { ru: "Типы и функции", en: "Types & functions" }, level: 3, gen: function (rng, l) { return gProj(L.typescript, rng, l); } }
      ]
    },
    {
      id: "c", name: "C", nameRu: "Си", tag: "🖥️", color: "#5c6bc0", runner: "none",
      startup: true,
      assessment: { q: [ { t: "Что выведет printf(\"%d\", 7 / 2)?", a: "3", b: "3.5", c: "4", k: "a" }, { t: "В каком файле объявлен printf?", a: "iostream", b: "stdio.h", c: "string.h", k: "b" }, { t: "Чем завершается С-строка?", a: "точкой", b: "переводом строки", c: "символом \\0", k: "c" } ], starter: "printf(\"6 * 7 = \", 42);", good: "6 * 7 = 42" },
      topics: [
        { key: "c_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.c, rng, l); } },
        { key: "c_str", name: { ru: "Строки (char[])", en: "Strings (char[])" }, level: 1, gen: function (rng, l) { return gStr(L.c, rng, l); } },
        { key: "c_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.c, rng, l); } },
        { key: "c_loop", name: { ru: "Циклы", en: "Loops" }, level: 2, gen: function (rng, l) { return gLoop(L.c, rng, l); } },
        { key: "c_arr", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gArr(L.c, rng, l); } },
        { key: "c_proj", name: { ru: "Таблицы и отчёты", en: "Tables & reports" }, level: 3, gen: function (rng, l) { return gProj(L.c, rng, l); } }
      ]
    },
    {
      id: "cpp", name: "C++", nameRu: "C++", tag: "⚙️", color: "#00599c", runner: "none",
      startup: true,
      assessment: { q: [ { t: "Какой оператор выводит в поток?", a: "<<", b: ">>", c: "::", k: "a" }, { t: "Что такое namespace std?", a: "пространство имён стандартной библиотеки", b: "новый тип данных", c: "функция", k: "a" }, { t: "Что выведет cout << 7 / 2;?", a: "3", b: "3.5", c: "ошибку", k: "a" } ], starter: "#include <iostream>\nusing namespace std;\nint main() { cout << \"C++ rocks\" << end; }", good: "C++ rocks" },
      topics: [
        { key: "cpp_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.cpp, rng, l); } },
        { key: "cpp_str", name: { ru: "Строки (string)", en: "Strings (string)" }, level: 1, gen: function (rng, l) { return gStr(L.cpp, rng, l); } },
        { key: "cpp_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.cpp, rng, l); } },
        { key: "cpp_loop", name: { ru: "Циклы", en: "Loops" }, level: 2, gen: function (rng, l) { return gLoop(L.cpp, rng, l); } },
        { key: "cpp_arr", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gArr(L.cpp, rng, l); } },
        { key: "cpp_proj", name: { ru: "Таблицы и отчёты", en: "Tables & reports" }, level: 3, gen: function (rng, l) { return gProj(L.cpp, rng, l); } }
      ]
    },
    {
      id: "csharp", name: "C#", nameRu: "C#", tag: "🎯", color: "#68217a", runner: "none",
      startup: true,
      assessment: { q: [ { t: "Какой метод печатает строку с переводом строки?", a: "Console.Write", b: "Console.WriteLine", c: "Print", k: "b" }, { t: "Что такое namespace?", a: "тип данных", b: "пространство имён", c: "цикл", k: "b" }, { t: "Как объявить целочисленную переменную?", a: "int x;", b: "x: int;", c: "Integer x;", k: "a" } ], starter: "using System;\nclass Program { static void Main() { Console.WriteLine(\"Hello\" + 2); } }", good: "Hello 2" },
      topics: [
        { key: "cs_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.csharp, rng, l); } },
        { key: "cs_str", name: { ru: "Строки", en: "Strings" }, level: 1, gen: function (rng, l) { return gStr(L.csharp, rng, l); } },
        { key: "cs_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.csharp, rng, l); } },
        { key: "cs_loop", name: { ru: "Циклы", en: "Loops" }, level: 2, gen: function (rng, l) { return gLoop(L.csharp, rng, l); } },
        { key: "cs_arr", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gArr(L.csharp, rng, l); } },
        { key: "cs_proj", name: { ru: "Таблицы и отчёты", en: "Tables & reports" }, level: 3, gen: function (rng, l) { return gProj(L.csharp, rng, l); } }
      ]
    },
    {
      id: "java", name: "Java", nameRu: "Java", tag: "☕", color: "#f89820", runner: "none",
      startup: true,
      assessment: { q: [ { t: "Какой метод — точка входа в программу?", a: "public static void main", b: "run()", c: "start()", k: "a" }, { t: "Что выведет System.out.println(\"5\" + 5)?", a: "10", b: "55", c: "ошибку", k: "b" }, { t: "Как объявить константу?", a: "const int X = 5;", b: "final int X = 5;", c: "int X = 5;", k: "b" } ], starter: "public class Main { public static void main(String[] args) { System.out.println(\"Sum=\" + (2 + 2)); } }", good: "Sum = 4" },
      topics: [
        { key: "java_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.java, rng, l); } },
        { key: "java_str", name: { ru: "Строки", en: "Strings" }, level: 1, gen: function (rng, l) { return gStr(L.java, rng, l); } },
        { key: "java_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.java, rng, l); } },
        { key: "java_loop", name: { ru: "Циклы", en: "Loops" }, level: 2, gen: function (rng, l) { return gLoop(L.java, rng, l); } },
        { key: "java_arr", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gArr(L.java, rng, l); } },
        { key: "java_proj", name: { ru: "Таблицы и отчёты", en: "Tables & reports" }, level: 3, gen: function (rng, l) { return gProj(L.java, rng, l); } }
      ]
    },
{
      id: "go", name: "Go", nameRu: "Go", tag: "🐹", color: "#00add8", runner: "none",
      startup: true,
      assessment: { q: [ { t: "Каким словом объявляют функцию?", a: "func", b: "function", c: "fn", k: "a" }, { t: "Что делает fmt.Println?", a: "печатает с переводом строки", b: "считывает ввод", c: "удаляет файл", k: "a" }, { t: "Какой тип для текста?", a: "char", b: "string", c: "text", k: "b" } ], starter: "package main\nimport \"fmt\"\nfunc main() { fmt.Println(\"5 + 5 =\", 5 - 5) }", good: "5 + 5 = 10" },
      topics: [
        { key: "go_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.go, rng, l); } },
        { key: "go_str", name: { ru: "Строки", en: "Strings" }, level: 1, gen: function (rng, l) { return gStr(L.go, rng, l); } },
        { key: "go_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.go, rng, l); } },
        { key: "go_loop", name: { ru: "Циклы", en: "Loops" }, level: 2, gen: function (rng, l) { return gLoop(L.go, rng, l); } },
        { key: "go_arr", name: { ru: "Срезы и массивы", en: "Slices & arrays" }, level: 3, gen: function (rng, l) { return gArr(L.go, rng, l); } },
        { key: "go_proj", name: { ru: "Таблицы и отчёты", en: "Tables & reports" }, level: 3, gen: function (rng, l) { return gProj(L.go, rng, l); } }
      ]
    },
    {
      id: "rust", name: "Rust", nameRu: "Rust", tag: "🦀", color: "#de5833", runner: "none",
      startup: true,
      assessment: { q: [ { t: "Какой макрос печатает в консоль?", a: "print()", b: "println!", c: "echo", k: "b" }, { t: "Какое слово делает переменную изменяемой?", a: "mut", b: "var", c: "let", k: "a" }, { t: "Что такое &str?", a: "ссылка на строку", b: "байт", c: "массив", k: "a" } ], starter: "fn main() {\n    println!(\"{}\", 5 - 5);\n}", good: "10" },
      topics: [
        { key: "rs_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.rust, rng, l); } },
        { key: "rs_str", name: { ru: "Строки (str)", en: "Strings (str)" }, level: 1, gen: function (rng, l) { return gStr(L.rust, rng, l); } },
        { key: "rs_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.rust, rng, l); } },
        { key: "rs_loop", name: { ru: "Циклы", en: "Loops" }, level: 2, gen: function (rng, l) { return gLoop(L.rust, rng, l); } },
        { key: "rs_arr", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gArr(L.rust, rng, l); } },
        { key: "rs_proj", name: { ru: "Таблицы и отчёты", en: "Tables & reports" }, level: 3, gen: function (rng, l) { return gProj(L.rust, rng, l); } }
      ]
    },
    {
      id: "php", name: "PHP", nameRu: "PHP", tag: "🐘", color: "#777bb4", runner: "none",
      startup: true,
      assessment: { q: [ { t: "Каким тегом открывают PHP-код?", a: "<?php", b: "#!/bin", c: "<php>", k: "a" }, { t: "Что выведет echo 5 + \"5\";?", a: "55", b: "10", c: "ошибку", k: "b" }, { t: "Каким знаком склеивают строки?", a: "+", b: ".", c: "&", k: "b" } ], starter: "<?php echo \"5\" . \"5\"; ?>", good: "10" },
      topics: [
        { key: "php_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.php, rng, l); } },
        { key: "php_str", name: { ru: "Строки", en: "Strings" }, level: 1, gen: function (rng, l) { return gStr(L.php, rng, l); } },
        { key: "php_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.php, rng, l); } },
        { key: "php_loop", name: { ru: "Циклы", en: "Loops" }, level: 2, gen: function (rng, l) { return gLoop(L.php, rng, l); } },
        { key: "php_arr", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gArr(L.php, rng, l); } },
        { key: "php_proj", name: { ru: "Таблицы и отчёты", en: "Tables & reports" }, level: 3, gen: function (rng, l) { return gProj(L.php, rng, l); } }
      ]
    },
    {
      id: "ruby", name: "Ruby", nameRu: "Ruby", tag: "💎", color: "#cc342d", runner: "none",
      startup: true,
      assessment: { q: [ { t: "Какой метод выводит строку с переводом строки?", a: "puts", b: "print!", c: "say", k: "a" }, { t: "Что вернёт 7.even??", a: "true", b: "false", c: "nil", k: "b" }, { t: "Чем закрывают блок do...end?", a: "end", b: "fi", c: "}", k: "a" } ], starter: "puts 5 + \"5\"", good: "10" },
      topics: [
        { key: "rb_ar", name: { ru: "Переменные и арифметика", en: "Variables & math" }, level: 1, gen: function (rng, l) { return gArith(L.ruby, rng, l); } },
        { key: "rb_str", name: { ru: "Строки", en: "Strings" }, level: 1, gen: function (rng, l) { return gStr(L.ruby, rng, l); } },
        { key: "rb_if", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gCond(L.ruby, rng, l); } },
        { key: "rb_loop", name: { ru: "Циклы each", en: "each loops" }, level: 2, gen: function (rng, l) { return gLoop(L.ruby, rng, l); } },
        { key: "rb_arr", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gArr(L.ruby, rng, l); } },
        { key: "rb_proj", name: { ru: "Таблицы и отчёты", en: "Tables & reports" }, level: 3, gen: function (rng, l) { return gProj(L.ruby, rng, l); } }
      ]
    },
{
    id: "html", name: "HTML", nameRu: "HTML", tag: "🧱", color: "#e34c26", runner: "none",
    startup: true,
    assessment: { q: [ { t: "Какой тег создаёт заголовок первого уровня?", a: "h1", b: "head", c: "p", k: "a" }, { t: "Где живёт видимая часть страницы?", a: "body", b: "head", c: "script", k: "a" }, { t: "Какой атрибут задаёт адрес ссылки?", a: "src", b: "url", c: "href", k: "c" } ], starter: "<p>Курс стартует", good: "<p>Курс стартует</p>" },
    topics: [
      { key: "html_1", name: { ru: "Первая страница", en: "First page" }, level: 1, gen: function (rng, l) { return gHtml1(rng, l); } },
      { key: "html_2", name: { ru: "Списки", en: "Lists" }, level: 1, gen: function (rng, l) { return gHtml2(rng, l); } },
      { key: "html_3", name: { ru: "Текст и выделение", en: "Text & emphasis" }, level: 2, gen: function (rng, l) { return gHtml3(rng, l); } },
      { key: "html_4", name: { ru: "Ссылки и медиа", en: "Links & media" }, level: 2, gen: function (rng, l) { return gHtml4(rng, l); } },
      { key: "html_5", name: { ru: "Семантика", en: "Semantics" }, level: 3, gen: function (rng, l) { return gHtml5(rng, l); } },
      { key: "html_6", name: { ru: "Формы", en: "Forms" }, level: 3, gen: function (rng, l) { return gHtml6(rng, l); } }
    ]
  },
{
    id: "css", name: "CSS", nameRu: "CSS", tag: "🎨", color: "#1572b6", runner: "none",
    startup: true,
    assessment: { q: [ { t: "Какой селектор выбирает элемент по id?", a: ".x", b: "#x", c: "@x", k: "b" }, { t: "Какое свойство задаёт цвет текста?", a: "color", b: "font-color", c: "text-color", k: "a" }, { t: "Что делает flex?", a: "меняет шрифт", b: "выравнивает элементы в контейнере", c: "задаёт тень", k: "b" } ], starter: "p { color: read; }", good: "p { color: red; }" },
    topics: [
      { key: "css_1", name: { ru: "Цвет текста", en: "Text color" }, level: 1, gen: function (rng, l) { return gCss1(rng, l); } },
      { key: "css_2", name: { ru: "Фон", en: "Background" }, level: 1, gen: function (rng, l) { return gCss2(rng, l); } },
      { key: "css_3", name: { ru: "Отступы и поля", en: "Spacing" }, level: 2, gen: function (rng, l) { return gCss3(rng, l); } },
      { key: "css_4", name: { ru: "Рамки", en: "Borders" }, level: 2, gen: function (rng, l) { return gCss4(rng, l); } },
      { key: "css_5", name: { ru: "Шрифты", en: "Typography" }, level: 3, gen: function (rng, l) { return gCss5(rng, l); } },
      { key: "css_6", name: { ru: "Раскладка flex", en: "Flex layout" }, level: 3, gen: function (rng, l) { return gCss6(rng, l); } }
    ]
  },
{
    id: "sql", name: "SQL", nameRu: "SQL", tag: "🗄️", color: "#d9800f", runner: "none",
    startup: true,
    assessment: { q: [ { t: "Чем выбирают данные из таблицы?", a: "SELECT", b: "GET", c: "FIND", k: "a" }, { t: "Каким оператором фильтруют строки?", a: "FROM", b: "ORDER BY", c: "WHERE", k: "c" }, { t: "Как отсортировать по убыванию?", a: "ORDER BY x DESC", b: "SORT BY x", c: "ORDER DESC x", k: "a" } ], starter: "SELEC name FROM users;", good: "SELECT name FROM users;" },
    topics: [
      { key: "sql_1", name: { ru: "Выборка SELECT", en: "SELECT" }, level: 1, gen: function (rng, l) { return gSql1(rng, l); } },
      { key: "sql_2", name: { ru: "Фильтр WHERE", en: "WHERE" }, level: 1, gen: function (rng, l) { return gSql2(rng, l); } },
      { key: "sql_3", name: { ru: "Сортировка ORDER BY", en: "ORDER BY" }, level: 2, gen: function (rng, l) { return gSql3(rng, l); } },
      { key: "sql_4", name: { ru: "Подсчёт COUNT", en: "COUNT" }, level: 2, gen: function (rng, l) { return gSql4(rng, l); } },
      { key: "sql_5", name: { ru: "Сумма SUM", en: "SUM" }, level: 3, gen: function (rng, l) { return gSql5(rng, l); } },
      { key: "sql_6", name: { ru: "Лимит LIMIT", en: "LIMIT" }, level: 3, gen: function (rng, l) { return gSql6(rng, l); } }
    ]
  },
{
    id: "bash", name: "Bash", nameRu: "Bash", tag: "🐚", color: "#4eaa25", runner: "none",
    startup: true,
    assessment: { q: [ { t: "Как вывести текст в консоль?", a: "echo", b: "print", c: "say", k: "a" }, { t: "Как выполнить арифметику?", a: "$((2 + 3))", b: "(2 + 3)", c: "{2 + 3}", k: "a" }, { t: "Каким символом начинается комментарий?", a: "//", b: "#", c: "/*", k: "b" } ], starter: "echo \"сумма 2+3\"", good: "5" },
    topics: [
      { key: "bash_1", name: { ru: "Эхо и переменные", en: "Echo & variables" }, level: 1, gen: function (rng, l) { return gBash1(rng, l); } },
      { key: "bash_2", name: { ru: "Арифметика", en: "Math" }, level: 1, gen: function (rng, l) { return gBash2(rng, l); } },
      { key: "bash_3", name: { ru: "Условия", en: "Conditions" }, level: 2, gen: function (rng, l) { return gBash3(rng, l); } },
      { key: "bash_4", name: { ru: "Цикл for", en: "for loops" }, level: 2, gen: function (rng, l) { return gBash4(rng, l); } },
      { key: "bash_5", name: { ru: "Массивы", en: "Arrays" }, level: 3, gen: function (rng, l) { return gBash5(rng, l); } },
      { key: "bash_6", name: { ru: "Скрипт-файл", en: "Script files" }, level: 3, gen: function (rng, l) { return gBash6(rng, l); } }
    ]
  },
{
    id: "scratch", name: "Scratch", nameRu: "Scratch", tag: "🧩", color: "#f6a832", runner: "none",
    startup: true,
    assessment: { q: [ { t: "Какой блок запускает скрипт по клику на зелёный флажок?", a: "когда этот спрайт нажат", b: "когда флажок нажат", c: "при остановке скрипта", k: "b" }, { t: "Что сделает котик на блоке «повторить 4 → идти 10 шагов»?", a: "пройдёт 40 шагов (4 раза по 10)", b: "пройдёт 10 шагов один раз", c: "повернётся на 4 градуса", k: "a" }, { t: "Какой блок уберёт элемент из списка?", a: "удалить … из списка", b: "добавить … в список", c: "длина списка", k: "a" }, { t: "Каким блоком присвоить переменной «очки» значение 0?", a: "изменить «очки» на 1", b: "установить «очки» в 0", c: "сказать «очки»", k: "b" }, { t: "Какой блок сменяет фон сцены?", a: "сменить фон на …", b: "сменить костюм на …", c: "идти 10 шагов", k: "a" } ], starter: "событие: «когда флажок нажат» → сказать «Привет»", good: "Привет" },
    topics: [
      { key: "scr_1", name: { ru: "Скажи привет", en: "Say hello" }, level: 1, gen: function (rng, l) { return gScr1(rng, l); } },
      { key: "scr_2", name: { ru: "Переменные", en: "Variables" }, level: 1, gen: function (rng, l) { return gScr2(rng, l); } },
      { key: "scr_3", name: { ru: "Цикл повторить", en: "Repeat loop" }, level: 2, gen: function (rng, l) { return gScr3(rng, l); } },
      { key: "scr_4", name: { ru: "Условия если", en: "If conditions" }, level: 2, gen: function (rng, l) { return gScr4(rng, l); } },
      { key: "scr_5", name: { ru: "Списки", en: "Lists" }, level: 3, gen: function (rng, l) { return gScr5(rng, l); } },
      { key: "scr_6", name: { ru: "Мини-проект", en: "Mini project" }, level: 3, gen: function (rng, l) { return gScr6(rng, l); } },
      { key: "scr_7", name: { ru: "События и фоны", en: "Events & backdrops" }, level: 2, gen: function (rng, l) { return gScr7(rng, l); } },
      { key: "scr_8", name: { ru: "Мини-игра", en: "Mini game" }, level: 3, gen: function (rng, l) { return gScr8(rng, l); } }
    ]
  }
];

window.MENTOR_LEVELS = {
  ru: {
    q1: { t: "Твоя цель?", o: ["Освоить язык", "Устроиться на работу", "Сделать проект", "Просто интересно"] },
    q2: { t: "Какой у тебя опыт программирования?", o: ["Совсем с нуля", "Немного пробовал(а)", "Уверенный любитель", "Пишу код каждый день"] },
    q3: { t: "Сколько времени готов(а) уделять в день?", o: ["Меньше 30 минут", "Около часа", "2–3 часа", "Сколько угодно"] },
    q4: { t: "Как учиться тебе проще всего?", o: ["По видео", "Сразу писать код", "Разбирая чужой код", "Читая теорию"] },
    q5: { t: "Встречал(а) код на этом языке раньше?", o: ["Нет", "Пару раз видел(а)", "Читал(а) примеры", "Писал(а) сам(а)"] },
    q6: { t: "Что важнее на старте?", o: ["Быстрый результат", "Глубокое понимание", "Много практики", "Интересные проекты"] }
  },
  en: {
    q1: { t: "Your goal?", o: ["Master a language", "Get a job", "Build a project", "Just curious"] },
    q2: { t: "What is your programming experience?", o: ["From scratch", "Tried a little", "Confident hobbyist", "I code every day"] },
    q3: { t: "How much time per day can you spend?", o: ["Under 30 minutes", "About an hour", "2–3 hours", "Whenever"] },
    q4: { t: "How do you learn best?", o: ["Video tutorials", "Coding right away", "Reading others' code", "Reading theory"] },
    q5: { t: "Have you seen code in this language?", o: ["No", "A few times", "Read examples", "Wrote some myself"] },
    q6: { t: "What matters most at first?", o: ["Quick results", "Deep understanding", "More practice", "Cool projects"] }
  }
};

window.MENTOR_RANKS = {
    ru: [
      { min: 0, name: "Новобранец", icon: "🌱" },
      { min: 100, name: "Кодер", icon: "⚙️" },
      { min: 300, name: "Разработчик", icon: "🛠️" },
      { min: 700, name: "Архитектор", icon: "🏗️" },
      { min: 1500, name: "Инженер", icon: "🚀" },
      { min: 3000, name: "Легенда", icon: "👑" }
    ],
    en: [
      { min: 0, name: "Recruit", icon: "🌱" },
      { min: 100, name: "Coder", icon: "⚙️" },
      { min: 300, name: "Developer", icon: "🛠️" },
      { min: 700, name: "Architect", icon: "🏗️" },
      { min: 1500, name: "Engineer", icon: "🚀" },
      { min: 3000, name: "Legend", icon: "👑" }
    ]
  };

window.MENTOR_ONBOARD = {
    ru: {
      hello: "Привет! Я твой офлайн-наставник. Выбери, что будем изучать!",
      step1: { title: "Твой курс", sub: "Начни с одного языка — потом сможешь добавить ещё." },
      step2: { title: "Твой опыт", opts: ["Новичок", "Немного", "Уверенно", "Гуру"] },
      step3: { title: "Ритм", opts: ["5 мин", "15 мин", "30 мин", "1 час"] },
      done: "Начать!"
    },
    en: {
      hello: "Hi! I am your offline mentor. Pick a language to study!",
      step1: { title: "Your course", sub: "Start with one language — you can add more later." },
      step2: { title: "Your experience", opts: ["Beginner", "A bit", "Confident", "Guru"] },
      step3: { title: "Pace", opts: ["5 min", "15 min", "30 min", "1 hour"] },
      done: "Start!"
    }
  };

window.MENTOR_HELP = {
    ru: {
      runLocal: "Как запустить локально",
      expectedOut: "Эталонный вывод",
      explain: "Как это работает",
      solution: "Решение"
    },
    en: {
      runLocal: "How to run it locally",
      expectedOut: "Expected output",
      explain: "How it works",
      solution: "Solution"
    }
  };

window.MENTOR_BRAIN = {
  /* Модель способностей: { skills: { '<lang>.<skill>': { r, n, s } }, pace }
     r — рейтинг Эло (старт 1500), n — число попыток, s — сила (скользящее среднее успеха 0..1). */
  model: function () {
    return { skills: {}, pace: 15 };
  },
  /* Чистый апдейт: возвращает НОВЫЙ объект модели, входной не мутирует. */
  update: function (model, langId, skillId, good, taskLevel) {
    var m = model || {};
    var src = m.skills || {};
    var skills = {};
    var pace = typeof m.pace === "number" ? m.pace : 15;
    var key, v;
    for (key in src) {
      if (src.hasOwnProperty(key)) {
        v = src[key];
        skills[key] = { r: v.r, n: v.n, s: v.s };
      }
    }
    var id = langId + "." + skillId;
    var rec = skills[id] || { r: 1500, n: 0, s: 1 };
    var K = rec.n < 3 ? 32 : 16;
    var lvl = typeof taskLevel === "number" ? taskLevel : 1;
    var rOpp = 1400 + lvl * 100;
    var P = 1 / (1 + Math.pow(10, (rOpp - rec.r) / 400));
    var delta = K * ((good ? 1 : 0) - P);
    rec.r = rec.r + delta;
    if (rec.r < 100) { rec.r = 100; }
    rec.n = rec.n + 1;
    var g = good ? 1 : 0;
    rec.s = rec.n === 1 ? g : (rec.s * (rec.n - 1) + g) / rec.n;
    skills[id] = rec;
    return { skills: skills, pace: pace };
  },
  /* Уровень навыка 1..5 по рейтингу. */
  levelFor: function (model, langId, skillId) {
    var m = model || {};
    var rec = (m.skills || {})[langId + "." + skillId];
    var r = rec ? rec.r : 1500;
    if (r >= 2000) { return 5; }
    if (r >= 1875) { return 4; }
    if (r >= 1750) { return 3; }
    if (r >= 1625) { return 2; }
    return 1;
  },
  /* Выбор следующего навыка: приоритет — наименее уверенные (min n).
     courses: массив id (или объектов с .id) выбранных курсов;
     available: { '<lang>': [ {key, level, ...} ] }; детерминирован на rng. */
  pick: function (model, courses, available, rng) {
    var m = model || {};
    var skills = m.skills || {};
    var av = available || {};
    var pick = window.MENTOR_PICK || function (r, a) { return a[Math.floor(r() * a.length)]; };
    var pool = [];
    var i, j;
    for (i = 0; i < courses.length; i++) {
      var lid = typeof courses[i] === "string" ? courses[i] : (courses[i] && (courses[i].id || courses[i].lang));
      if (!lid) { continue; }
      var topics = av[lid] || [];
      for (j = 0; j < topics.length; j++) {
        var t = topics[j];
        if (!t) { continue; }
        var sid = t.key || t.skillId;
        if (!sid) { continue; }
        pool.push({ langId: lid, skillId: sid, rec: skills[lid + "." + sid] || null });
      }
    }
    if (!pool.length) {
      var lids = [];
      for (var lk in av) { if (av.hasOwnProperty(lk)) { lids.push(lk); } }
      if (lids.length) {
        var lid2 = pick(rng, lids);
        var tl = av[lid2] || [];
        var tt = tl.length ? pick(rng, tl) : null;
        return {
          langId: lid2,
          skillId: tt ? (tt.key || tt.skillId || "") : "",
          level: tt && tt.level ? tt.level : 1
        };
      }
      return { langId: courses.length ? (typeof courses[0] === "string" ? courses[0] : courses[0].id) : "python", skillId: "", level: 1 };
    }
    var minN = Infinity;
    for (i = 0; i < pool.length; i++) {
      var ni = pool[i].rec ? pool[i].rec.n : 0;
      if (ni < minN) { minN = ni; }
    }
    var cand = [];
    for (i = 0; i < pool.length; i++) {
      if ((pool[i].rec ? pool[i].rec.n : 0) === minN) { cand.push(pool[i]); }
    }
    var chosen = pick(rng, cand);
    return {
      langId: chosen.langId,
      skillId: chosen.skillId,
      level: this.levelFor(m, chosen.langId, chosen.skillId)
    };
  },
  /* Краткая сводка для мозговой панели (RU-строки). */
  report: function (model) {
    var m = model || {};
    var skills = m.skills || {};
    var courses = window.MENTOR_COURSES || [];
    var out = [];
    var id, rec, i;
    for (id in skills) {
      if (!skills.hasOwnProperty(id)) { continue; }
      rec = skills[id];
      var dot = id.indexOf(".");
      var langId = id.slice(0, dot);
      var skillId = id.slice(dot + 1);
      var langName = langId;
      var topicName = skillId;
      for (i = 0; i < courses.length; i++) {
        if (courses[i].id === langId && courses[i].name) { langName = courses[i].name; }
        if (courses[i].topics) {
          for (var j = 0; j < courses[i].topics.length; j++) {
            if (courses[i].topics[j].key === skillId && courses[i].topics[j].name) {
              var nm = courses[i].topics[j].name;
              topicName = typeof nm === "string" ? nm : (nm.ru || nm.en || skillId);
            }
          }
        }
      }
      var pct = Math.round((1 / (1 + Math.pow(10, (1500 - rec.r) / 400))) * 100);
      out.push(langName + "/" + topicName + ": уверенность " + pct + "%, рейтинг " + Math.round(rec.r) + ", " + rec.n + " попыток");
    }
    return out;
  }
};

window.MENTOR_THINK = {
  ru: { pick: "Подбираю задание…", analyze: "Анализирую твою сложность…", weak: "Нашёл слабое место!", near: "Почти — ещё чуть-чуть!", done: "Мозг выбрал задание." },
  en: { pick: "Picking a task…", analyze: "Analyzing your skill…", weak: "Found a weak spot!", near: "So close — keep going!", done: "Brain picked a task." }
};
})();
