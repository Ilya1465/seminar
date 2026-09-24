/* =========================================================================
 *  AI-НАСТАВНИК (tutor.js)
 *  Главная роль: делает задания, проверяет код, оценивает прогресс,
 *  учит "до бесконечности", поддерживает ЛЮБОЙ язык программирования.
 *
 *  Архитектура: язык программирования = отдельный "план" (pack):
 *    data/<lang>-content.js  — темы + генераторы задач + справка
 *    js/runner-<lang>.js     — исполнение кода в браузере
 *  Сейчас в комплекте: PYTHON (Pyodide) и JAVASCRIPT (нативный).
 *  Добавить язык = положить 2 файла по шаблону. Безгранично.
 * ========================================================================= */
(function () {
  "use strict";

  /* ---------- утилиты ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* ---------- i18n ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("tutor." + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("tutor." + k, JSON.stringify(v)); } catch (e) {} }
  };
  var lang = store.get("lang", "ru");
  function setLang(l) { lang = l; store.set("lang", l); }

  var T = function (key, args) {
    var dict = window.TUTOR_UI || {};
    var entry = dict[key] || {};
    var s = entry[lang] != null ? entry[lang] : entry.ru != null ? entry.ru : key;
    if (args) { for (var k in args) s = s.split("{" + k + "}").join(args[k]); }
    return s;
  };

  /* ---------- детерминированный PRNG: бесконечные вариации ---------- */
  function makeRng(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function ri(rng, lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); }

  /* ---------- состояние / прогресс ---------- */
  var PROGRESS_KEY = "progress", XP_KEY = "xp", LOCK_KEY = "locks";
  var unlock = function (k) {
    var l = store.get(LOCK_KEY, {}); l[k] = true; store.set(LOCK_KEY, l);
  };
  var isUnlocked = function (k) { return !!store.get(LOCK_KEY, {})[k]; };

  function bump(topic, level, good, code, out) {
    var now = Date.now();
    var p = store.get(PROGRESS_KEY, {});
    var cur = p[topic] || { solved: 0, tries: 0, best: 0, last: 0, streak: 0 };
    cur.tries++;
    cur.last = now;
    if (good) {
      cur.solved++;
      cur.streak++;
      if (level > cur.best) cur.best = level;
      if (cur.streak >= 3) { cur.levelup = (cur.levelup || 0) + 1; }
    } else {
      cur.streak = 0;
    }
    p[topic] = cur;
    store.set(PROGRESS_KEY, p);
    // очки опыта
    var xp = store.get(XP_KEY, 0);
    xp += good ? 10 + (level - 1) * 5 : 2;
    store.set(XP_KEY, xp);
    return cur;
  }
  function getProgress() { return store.get(PROGRESS_KEY, {}); }
  function getXp() { return store.get(XP_KEY, 0); }

  /* ---------- нормализация вывода для сравнения ---------- */
  function norm(s) {
    return String(s == null ? "" : s)
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/ *\n/g, "\n")
      .replace(/\n+/g, "\n")
      .replace(/^\n|\n$/g, "")
      .trim();
  }
  function compare(actual, expected) {
    var a = norm(actual), b = norm(expected);
    if (a === b) return { good: true };
    var al = a.split("\n"), bl = b.split("\n");
    return {
      good: false,
      mine: al.find(function (x, i) { return x !== bl[i]; }) || "",
      expected: bl.find(function (x, i) { return x !== al[i]; }) || ""
    };
  }

  /* ---------- Pyodide (Python) ---------- */
  var pyodide = null, pyLoading = null;
  function loadPyodide() {
    if (pyodide) return Promise.resolve(pyodide);
    if (pyLoading) return pyLoading;
    pyLoading = (function () {
      return new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
        s.onload = function () {
          window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" })
            .then(function (py) { pyodide = py; resolve(py); })
            .catch(reject);
        };
        s.onerror = function () { reject(new Error("Pyodide load failed (нет интернета?)")); };
        document.head.appendChild(s);
      });
    })();
    return pyLoading;
  }

  function runPython(code) {
    return loadPyodide().then(function (py) {
      var out = "";
      py.setStdout({ batched: function (s) { out += s + "\n"; } });
      py.setStderr({ batched: function (s) { out += s + "\n"; } });
      return py.runPythonAsync(code).then(function () { return out; });
    });
  }
  function pyErrType(msg) {
    var m = msg || "";
    if (m.indexOf("SyntaxError") >= 0) return "syntax";
    if (m.indexOf("IndentationError") >= 0) return "indent";
    if (m.indexOf("NameError") >= 0) return "name";
    if (m.indexOf("TypeError") >= 0) return "type";
    if (m.indexOf("ValueError") >= 0) return "value";
    if (m.indexOf("IndexError") >= 0) return "index";
    if (m.indexOf("KeyError") >= 0) return "key";
    if (m.indexOf("ZeroDivisionError") >= 0) return "zero";
    if (m.indexOf("AttributeError") >= 0) return "attr";
    return "other";
  }

  /* ---------- Runner: JavaScript (нативный) ---------- */
  // Выполняем в отдельной функции с подменённым console.log, ловим вывод.
  function runJS(code) {
    var out = "";
    try {
      var fn = new Function("console", '"use strict";\n' + code);
      fn({
        log: function () {
          out += Array.prototype.map.call(arguments, function (a) {
            try { return typeof a === "object" ? JSON.stringify(a) : String(a); }
            catch (e) { return String(a); }
          }).join(" ") + "\n";
        }
      });
    } catch (e) {
      throw new Error("Error: " + (e && e.message ? e.message : e));
    }
    return out;
  }

  /* ---------- движок наставника ----------
   * pack = { id, label, logo, topics: [ {key, name, level, gen(task, rng, level)} ] }
   * gen: функция, создающая ОДНУ задачу (объект). Уровень влияет на сложность.
   */
  function pickTopic(pack) {
    // выбираем самые "отстающие" (по спейсед-репетиции + прогрессу)
    var p = getProgress();
    var now = Date.now();
    return pack.topics.slice().sort(function (a, b) {
      var pa = p[a.key], pb = p[b.key];
      var sa = pa ? (pa.solved || 0) : 0, sb = pb ? (pb.solved || 0) : 0;
      // нерешаемые — вперёд
      if (sa !== sb) return sa - sb;
      var la = pa ? (pa.last || 0) : 0, lb = pb ? (pb.last || 0) : 0;
      return la - lb; // самые старые — вперёд
    })[0];
  }

  /* ---------- мост «Мозг» (Интегратор): window.MENTOR_BRAIN опционален ----
   * pickTask(courses, rng): вернёт { topicKey, level, task } через мозг,
   *   если MENTOR_BRAIN.pick доступен и в store есть курс - иначе старый случайный путь.
   * record(langId, skillId, good, level): кормит обновление модели навыков
   *   (MENTOR_BRAIN.update) и пишет модель в store под ключом "brain".
   * getBrain(): прочитать сохранённую модель (или null).
   */
  var BRAIN_KEY = "brain";

  function loadBrain() {
    try { return store.get(BRAIN_KEY, null); } catch (e) { return null; }
  }

  function saveBrain(model) {
    try { store.set(BRAIN_KEY, model); } catch (e) {}
    return model;
  }

  function pickTask(courses, rng) {
    // курсы берём из онбординга (coarse), если не даны — падаем на pickTopic
    var list = courses;
    var brain = checkBrain();
    var topicKey = null, level = 1, task = null;
    if (window.MENTOR_BRAIN && window.MENTOR_BRAIN.pick && list && list.length) {
      try {
        var st = loadBrain() || window.MENTOR_BRAIN.model();
        var sel = window.MENTOR_BRAIN.pick(st, list, list, rng);
        if (sel && sel.langId && sel.skillId) {
          topicKey = sel.langId + "." + sel.skillId;
          level = sel.level || 1;
          var pack = topackFor(topicKey);
          if (pack && pack.topic) {
            task = pack.topic.gen(makeRng(rng && rng() || Math.random, level), level);
          }
        }
      } catch (e) {}
    }
    if (!task) {
      var t = pickTopic(list ? { topics: list.map(function (c) {
        return c.skills ? { key: c.langId + "." + c.skill } : c;
      }) } : null);
      // fallback: если pickTopic не дал, берём первый доступный
      task = null; topicKey = null;
    }
    return { topicKey: topicKey, level: level, task: task };
  }

  function checkBrain() { return window.MENTOR_BRAIN ? 1 : 0; }

  function topackFor(key) {
    return null; // переопределяется в data/tutor.js через MENTOR_LANGS
  }

  function record(langId, skillId, good, level) {
    var model = loadBrain() || (window.MENTOR_BRAIN ? window.MENTOR_BRAIN.model() : null);
    if (model && window.MENTOR_BRAIN && window.MENTOR_BRAIN.update) {
      model = window.MENTOR_BRAIN.update(model, langId, skillId, good, level || 1);
      saveBrain(model);
    }
    return model;
  }

  window.Tutor = {
    T: T, norm: norm, compare: compare,
    setLang: setLang, getLang: function () { return lang; },
    esc: esc, makeRng: makeRng, ri: ri,
    loadPyodide: loadPyodide, runPython: runPython, runJS: runJS,
    pyErrType: pyErrType,
    bump: bump, getProgress: getProgress, getXp: getXp,
    unlock: unlock, isUnlocked: isUnlocked,
    pickTopic: pickTopic,
    store: store
  };
})();
