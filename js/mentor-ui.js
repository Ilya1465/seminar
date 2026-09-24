(function () {
  "use strict";

  var T = window.Tutor || {};
  var view = document.getElementById("view");
  var navEl = document.getElementById("nav");
  var brandName = document.getElementById("brandName");
  var progressMini = document.getElementById("progressMini");
  var sidebarEl = document.getElementById("sidebar");
  var burgerEl = document.getElementById("burger");
  var langSwitchEl = document.getElementById("langSwitch");
  var chatEl = document.getElementById("chat");
  var chatBody = document.getElementById("chatBody");
  var chatInput = document.getElementById("chatInput");
  var chatSend = document.getElementById("chatSend");
  var chatClose = document.getElementById("chatClose");
  var chatStatus = document.getElementById("chatStatus");
  var chatNote = document.getElementById("chatNote");

  var uiDict = window.MENTOR_UI || { ru: {}, en: {} };
  if (window.MENTOR_UI) { try { window.TUTOR_UI = window.MENTOR_UI; } catch (e) {} }

  var LANG_KEY = "mentor.lang";
  var BOOT_ATTEMPTS = 20;
  var BOOT_INTERVAL = 300;

  var LOCAL = {
    ru: {
      navHome: "Главная",
      navTrain: "Тренировка",
      navPlayground: "Песочница",
      navQuiz: "Тест",
      navProgress: "Прогресс",
      progress: "Прогресс",
      languages: "Языки",
      greeting: "Привет! Я твой офлайн-наставник по программированию. Начнём?",
      start: "Начать",
      pickTopic: "Выбери тему",
      back: "Назад",
      run: "Выполнить",
      check: "Проверить",
      newTask: "Новая задача",
      hint: "Подсказка",
      hide: "Скрыть подсказку",
      solution: "Показать решение",
      solutionTitle: "Решение",
      noSolution: "Готового решения нет — посмотри подсказку.",
      output: "Вывод",
      right: "Верно!",
      wrong: "Не совсем.",
      expected: "Ожидалось",
      yourOut: "Твой вывод",
      noOut: "Вывод появится здесь.",
      loading: "Загружаю контент…",
      notReady: "Не удалось загрузить контент. Обнови страницу или проверь data/tutor.js.",
      quizBegin: "Квиз: 5 вопросов",
      quizStart: "Начать квиз",
      quizNext: "Дальше",
      quizResult: "Итог: Правильно {g} из {n} ({pct}%).",
      quizAgain: "Пройти ещё раз",
      choose: "Выбери ответ",
      xp: "XP",
      solved: "решено",
      tasksDone: "Задач решено",
      topicLevel: "Уровень",
      best: "Итог",
      chatStatusOn: "онлайн",
      chatWelcome: "Привет! Я твой локальный наставник. Спроси про ошибку или попроси подсказку!",
      chatLocal: "локальный",
      chatOnline: "онлайн",
      chatNoKey: "Онлайн-режим требует API-ключ: добавь его во вкладке «Аккаунт».",
      chipErr: "Что за ошибка?",
      chipHow: "Как решить задачу?",
      chipWhy: "Почему так вышло?",
      chipHint: "Дай подсказку",
      chipProgress: "Мой прогресс",
      chipPlan: "Что дальше?",
      errNone: "Ошибок ещё не было — тут всё чисто. Напиши код и нажми Выполнить.",
      hintNone: "Сейчас активная задача не выбрана. Зайди в Тренировку и выбери тему.",
      whyTopic: "Правильный подход: разбери задачу на маленькие шаги. Сначала подумай, какие данные на входе и какой результат должен получиться, потом пиши код. В этой теме тренируемся именно на таком разборе.",
      advice: "Попробуй сначала описать словами, что должна делать программа, а потом переводить это в код. Опиши подробнее, что именно не получается — разберём вместе.",
      agree: "Хорошо! Тренировка — это путь проб и ошибок. Самое важное — понять, почему программа так себя ведёт.",
      pyNotLoaded: "Движок Python (Pyodide) не загрузился. Похоже, нет интернета. Песочница и проверка для Python требуют сети.",
      runFailed: "Ошибка выполнения",
      aiWho: "Я 🤖 ИИ-наставник: гоняю тебя по задачам, ищу слабые места и слежу за прогрессом. Всё считаю локально, без интернета.",
      aiHelp: "Умею так:\n1) разбирать ошибки кода — нажми Выполнить и спроси «что за ошибка?»;\n2) давать подсказки и решения по текущей задаче — «как решить?»;\n3) рассказывать про прогресс — «какой прогресс?»;\n4) подсказывать, что учить дальше — «что дальше?»",
      aiProgress: "📈 У тебя {x} XP, решено задач: {n}. Ранг: {r}. Так держать!",
      aiProgressNone: "Пока ни одной задачи не решено. Зайди в Тренировку — мозг уже подобрал первую тему.",
      aiNext: "🧠 Смотрю твой план: языки — {l}. ИИ-мозг будет тренировать те темы, где меньше всего уверенности. Зайди в Тренировку — там тема уже подобрана.",
      aiPlan: "Твоя цель — {g}. С ритмом {t} минут в день иду по плану. Начнём с Тренировки!",
      aiThanks: "😊 Всегда пожалуйста! Если что — я рядом.",
      aiMotivate: "Тяжело — это нормально: именно так мозг растёт. Разбей задачу на шаги, попробуй подсказку, а потом решение. Ты справишься!",
      aiGreet: "Привет, {n}! Я тут. Можешь спросить про ошибку, прогресс или «что дальше».",
      aiTitle: "Онлайн-ИИ (API-ключ)",
      aiSub: "Подключи внешний ИИ для ответов в режиме «🌐 Онлайн-ИИ». Ключ хранится только в этом браузере.",
      aiKey: "API-ключ",
      aiModel: "Модель",
      aiBase: "Адрес API",
      aiSave: "Сохранить",
      aiTest: "Проверить",
      aiSaved: "Настройки ИИ сохранены ✅",
      aiTestOk: "Соединение работает ✅",
      aiTestFail: "Не удалось подключиться: проверь ключ и адрес.",
      aiThinking: "Думаю…",
      navAccount: "Аккаунт",
      accountTitle: "Аккаунт",
      accountSub: "Профиль и твои курсы. Новые языки можно добавить в любой момент.",
      accountName: "Имя",
      accountGoal: "Цель",
      accountPace: "Минут в день",
      accountLevel: "Уровень",
      accountXp: "Всего XP",
      accountCourses: "Мои курсы",
      accountNoCourses: "Курсы пока не выбраны.",
      accountAddCourse: "Добавить курс",
      accountAddSub: "Выбери языки, которым хочешь учиться — они появятся на главной и в тренировке.",
      accountSave: "Сохранить",
      accountSaved: "Курсы обновлены. Что учить дальше — подскажет ИИ в чате.",
      accountEmptySel: "Выбери хотя бы один курс.",
      accountAll: "Все доступные языки",
      chipCourses: "Какие у меня курсы?",
      aiCourses: "Твои курсы: {l}. Добавить ещё можно в Аккаунте → «Добавить курс».",
      aiCoursesEmpty: "Сейчас курсов нет. Зайди в Аккаунт → «Добавить курс» и выбери язык — я сразу подберу первую тему.",
      aiAddCourse: "Чтобы добавить язык — открой меню → «Аккаунт» → «Добавить курс» и отметь галочками нужные. Я подстрою под них тренировки.",
      aiNextTask: "Загляни в Тренировку: там уже выбрана тема под текущий уровень. Реши задачу — я дам следующую.",
      aiTaskNow: "Сейчас активная задача: «{t}». Спроси «как решить?» — дам подсказку.",
      algoNav: "Алгоритмы",
      algoTitle: "Алгоритмы и схемы",
      algoSub: "Учись видеть решение по шагам — как робот выполняет программу.",
      algoScratch: "Блоки Scratch по шагам",
      algoChooseTopic: "Выбери тему, чтобы посмотреть алгоритм решения",
      algoBack: "← К списку тем",
      algoFlow: "Пошаговая схема решения",
      algoSteps: "Алгоритм решения по шагам",
      scrTapHint: "Нажимай на блоки, чтобы собрать программу как в Scratch. Блоки с [[…]] можно менять прямо в стеке.",
      scrClear: "Сбросить блоки",
      scrEmpty: "Собери программу из блоков ниже — кликай по блокам палитры.",
      scrBlocksOk: "Отлично! Цепочка блоков повторяет правильный алгоритм.",
      scrWrongHint: "Цепочка не совпадает. Подсказка: ИИ в чате может объяснить, какие блоки нужны.",
      scrStep: "шаг",
      scrStage: "Сцена",
      scrRunStage: "▶ Запустить",
      scrStopStage: "⏹ Стоп",
      scrSprite: "Спрайт",
      scrBackdrop: "Фон",
      scrSoundPick: "Звук",
      scrDraw: "Рисовать",
      scrSpriteTitle: "Выбери спрайта",
      scrBackdropTitle: "Выбери фон",
      scrSoundTitle: "Выбери звук",
      scrDrawTitle: "Рисование костюма",
      scrDrawSub: "Нарисуй своего персонажа на холсте — он станет спрайтом на сцене.",
      scrDrawColor: "Цвет",
      scrDrawSize: "Кисть",
      scrDrawClear: "Очистить",
      scrDrawSave: "Сохранить костюм",
      scrDrawClose: "Закрыть",
      scrDrawSaved: "Костюм сохранён!",
      scrRunDone: "Готово — программа выполнилась на сцене.",
      scrVarVal: "переменная {v} = {n}",
      scrListVal: "список {v}: {n}",
    },
    en: {
      progress: "Progress",
      languages: "Languages",
      greeting: "Hi! I am your offline coding mentor. Shall we start?",
      start: "Start",
      pickTopic: "Pick a topic",
      back: "Back",
      run: "Run",
      check: "Check",
      newTask: "New task",
      hint: "Hint",
      hide: "Hide hint",
      solution: "Show solution",
      solutionTitle: "Solution",
      noSolution: "No ready solution — look at the hint.",
      output: "Output",
      right: "Correct!",
      wrong: "Not quite.",
      expected: "Expected",
      yourOut: "Your output",
      noOut: "Output will appear here.",
      loading: "Loading content…",
      notReady: "Could not load content. Reload the page or check data/tutor.js.",
      quizBegin: "Quiz: 5 questions",
      quizStart: "Start the quiz",
      quizNext: "Next",
      quizResult: "Score: {g} of {n} ({pct}%).",
      quizAgain: "Take it again",
      choose: "Choose an answer",
      xp: "XP",
      solved: "solved",
      tasksDone: "Tasks solved",
      topicLevel: "Level",
      best: "Best",
      chatStatusOn: "online",
      chatWelcome: "Hi! I am your local mentor. Ask about an error or for a hint!",
      chatLocal: "local",
      chatOnline: "online",
      chatNoKey: "Online mode requires an API key: add it in the Account tab.",
      chipErr: "What is the error?",
      chipHow: "How do I solve the task?",
      chipWhy: "Why did this happen?",
      chipHint: "Give me a hint",
      chipProgress: "My progress",
      chipPlan: "What next?",
      errNone: "No errors yet — all clean here. Write some code and press Run.",
      hintNone: "No active task right now. Go to Training and pick a topic.",
      whyTopic: "The right approach: break the task into tiny steps. Think about the input and the expected result first, then write code. That is exactly what we are training here.",
      advice: "Try to describe in words what the program should do, then translate that into code. Tell me more precisely what is going wrong — we will figure it out together.",
      agree: "Good! Training is a path of trial and error. The key is to understand why the program behaves that way.",
      pyNotLoaded: "Python engine (Pyodide) did not load. Looks like there is no internet. Python sandbox and checking need network.",
      runFailed: "Runtime error",
      aiWho: "I am 🤖 an AI mentor: I drill you with tasks, find weak spots and track progress. All computed locally, offline.",
      aiHelp: "What I can do:\n1) debug your code — press Run and ask \"what error?\";\n2) give hints and solutions for the current task — \"how to solve?\";\n3) tell about progress — \"my progress?\";\n4) suggest what to learn next — \"what next?\"",
      aiProgress: "📈 You have {x} XP, solved tasks: {n}. Rank: {r}. Keep going!",
      aiProgressNone: "No task solved yet. Go to Training — the brain already picked your first topic.",
      aiNext: "🧠 Looking at your plan — languages: {l}. The AI brain will train the topics where you are least confident. Go to Training — a topic is already picked.",
      aiPlan: "Your goal is {g}. With a pace of {t} minutes a day I follow the plan. Let us start with Training!",
      aiThanks: "😊 You are welcome! I am here whenever you need me.",
      aiMotivate: "Hard is normal — that is how the brain grows. Break the task into steps, try the hint, then the solution. You got this!",
      aiGreet: "Hi, {n}! I am here. Ask about an error, progress or \"what next\".",
      aiTitle: "Online AI (API key)",
      aiSub: "Connect an external AI for answers in the \"🌐 Online AI\" chat mode. The key is stored only in this browser.",
      aiKey: "API key",
      aiModel: "Model",
      aiBase: "API URL",
      aiSave: "Save",
      aiTest: "Test",
      aiSaved: "AI settings saved ✅",
      aiTestOk: "Connection works ✅",
      aiTestFail: "Connection failed: check the key and URL.",
      aiThinking: "Thinking…",
      navAccount: "Account",
      accountTitle: "Account",
      accountSub: "Profile and your courses. You can add new languages any time.",
      accountName: "Name",
      accountGoal: "Goal",
      accountPace: "Minutes a day",
      accountLevel: "Level",
      accountXp: "Total XP",
      accountCourses: "My courses",
      accountNoCourses: "No courses selected yet.",
      accountAddCourse: "Add course",
      accountAddSub: "Pick the languages you want to learn — they will appear on the home page and in training.",
      accountSave: "Save",
      accountSaved: "Courses updated. The AI will suggest what to learn next in chat.",
      accountEmptySel: "Pick at least one course.",
      accountAll: "All available languages",
      chipCourses: "What courses do I have?",
      aiCourses: "Your courses: {l}. You can add more in Account → \"Add course\".",
      aiCoursesEmpty: "No courses yet. Open Account → \"Add course\" and pick a language — I will choose the first topic for you.",
      aiAddCourse: "To add a language — open the menu → \"Account\" → \"Add course\" and tick the needed ones. I will adapt the training to them.",
      aiNextTask: "Take a look at Training: a topic for your level is already picked. Solve the task — I will give you the next one.",
      aiTaskNow: "Current task: \"{t}\". Ask \"how to solve?\" for a hint.",
      algoNav: "Algorithms",
      algoTitle: "Algorithms & diagrams",
      algoSub: "Learn to see solutions step by step — like a robot executes a program.",
      algoScratch: "Scratch blocks, step by step",
      algoChooseTopic: "Pick a topic to view its solution algorithm",
      algoBack: "← Back to topics",
      algoFlow: "Step-by-step solution diagram",
      algoSteps: "Solution algorithm by steps",
      scrTapHint: "Tap blocks to build a program like in Scratch. Blocks with [[…]] can be edited right in the stack.",
      scrClear: "Reset blocks",
      scrEmpty: "Build a program from the blocks below — click blocks in the palette.",
      scrBlocksOk: "Great! The block chain matches the correct algorithm.",
      scrWrongHint: "The chain doesn't match. Tip: the AI in chat can explain which blocks you need.",
      scrStep: "step",
      scrStage: "Stage",
      scrRunStage: "▶ Run",
      scrStopStage: "⏹ Stop",
      scrSprite: "Sprite",
      scrBackdrop: "Backdrop",
      scrSoundPick: "Sound",
      scrDraw: "Draw",
      scrSpriteTitle: "Pick a sprite",
      scrBackdropTitle: "Pick a backdrop",
      scrSoundTitle: "Pick a sound",
      scrDrawTitle: "Costume painter",
      scrDrawSub: "Draw your own character on the canvas — it becomes the stage sprite.",
      scrDrawColor: "Color",
      scrDrawSize: "Brush",
      scrDrawClear: "Clear",
      scrDrawSave: "Save costume",
      scrDrawClose: "Close",
      scrDrawSaved: "Costume saved!",
      scrRunDone: "Done — the program ran on the stage.",
      scrVarVal: "variable {v} = {n}",
      scrListVal: "list {v}: {n}",
    }
  };

  function lang() {
    return T.getLang ? T.getLang() : "ru";
  }

  function l(key) {
    var lc = LOCAL[lang()] && LOCAL[lang()][key];
    if (lc != null) { return lc; }
    var d = uiDict[lang()] && uiDict[lang()][key];
    if (d != null) { return d; }
    var lr = LOCAL.ru && LOCAL.ru[key];
    if (lr != null) { return lr; }
    var r = uiDict.ru && uiDict.ru[key];
    return r != null ? r : key;
  }

  function esc(s) {
    if (T.esc) {
      try { return T.esc(s); } catch (e) {}
    }
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Вставляет имя из профиля reg.html (tutor.regdone) в приветствие "Привет! …" / "Hi! …" */
  function personalize(msg) {
    try {
      var prof = (window.Tutor && window.Tutor.store) ? window.Tutor.store.get("regdone", null) : null;
      if (!prof || !prof.name) { return msg; }
      var i = String(msg).indexOf("!");
      if (i > 0) {
        var hello = String(msg).slice(0, i + 1);
        if (hello === "Привет!" || hello === "Hi!") {
          return hello.slice(0, -1) + ", " + prof.name + "!" + String(msg).slice(i + 1);
        }
      }
    } catch (e) {}
    return msg;
  }

  function normTopics(list) {
    var out = [], i, t, nm;
    if (!list || !list.length) { return out; }
    for (i = 0; i < list.length; i++) {
      t = list[i];
      nm = t.name;
      if (nm && typeof nm === "object") {
        out.push({ key: t.key, name: nm, level: t.level || 1, gen: t.gen });
      } else {
        nm = nm || t.key;
        out.push({ key: t.key, name: { ru: nm, en: nm }, level: t.level || 1, gen: t.gen });
      }
    }
    return out;
  }

  function getPacks() {
    var langs = (window.MENTOR_LANGS && window.MENTOR_LANGS.length) ? window.MENTOR_LANGS : [];
    var courses = (window.MENTOR_COURSES && window.MENTOR_COURSES.length) ? window.MENTOR_COURSES : [];
    if (!langs.length && !courses.length) { return []; }
    var seen = {}, out = [], i, c;
    for (i = 0; i < langs.length; i++) {
      seen[langs[i].id] = true;
      out.push(langs[i]);
    }
    for (i = 0; i < courses.length; i++) {
      c = courses[i];
      if (!c || seen[c.id]) { continue; }
      seen[c.id] = true;
      out.push({
        id: c.id,
        monoName: c.name || c.nameRu || c.id,
        logo: c.tag || "💻",
        color: c.color,
        topics: normTopics(c.topics)
      });
    }
    return out;
  }

  function getPack(id) {
    var i, packs = getPacks();
    for (i = 0; i < packs.length; i++) {
      if (packs[i].id === id) { return packs[i]; }
    }
    return null;
  }

  /* Выбранные юзером id курсов: "tutor.courses" (канон движка) или regdone.langs.
     Если пусто/нет профиля — возвращает null, чтобы показать весь каталог. */
  function getUserCourseIds() {
    try {
      if (window.Tutor && window.Tutor.store) {
        var c = window.Tutor.store.get("courses", null);
        if (c && c.length) { return c.slice(); }
        var prof = window.Tutor.store.get("regdone", null);
        if (prof && prof.langs && prof.langs.length) { return prof.langs.slice(); }
      }
    } catch (e) {}
    return null;
  }

  /* Отфильтрованный каталог: только выбранные юзером языки.
     Если выбор не задан — вернуть весь каталог (первый запуск/не-рег-сессия). */
  function getMyPacks() {
    var ids = getUserCourseIds();
    if (!ids) { return getPacks(); }
    var all = getPacks();
    var i, out = [];
    for (i = 0; i < all.length; i++) {
      if (ids.indexOf(all[i].id) >= 0) { out.push(all[i]); }
    }
    return out.length ? out : getPacks();
  }

  function findTopic(pack, key) {
    var i;
    for (i = 0; i < pack.topics.length; i++) {
      if (pack.topics[i].key === key) { return pack.topics[i]; }
    }
    return null;
  }

  function capId(id) {
    return id.charAt(0).toUpperCase() + id.slice(1);
  }

  var state = {
    view: "home",
    packId: null,
    topicKey: null,
    topic: null,
    task: null,
    level: 1,
    seed: 0,
    counter: 0,
    lastError: null,
    lastErrType: null,
    sandboxLang: null,
    hintOpen: false,
    solutionOpen: false,
    scrStack: [],
    scrPick: null,
    scrKeys: {},
    chatMode: "local",
    scrStage: {
      sprite: "cat",
      backdrop: "sky",
      sound: "pop",
      costume: null,
      x: 50,
      y: 70,
      dir: 0,
      size: 1,
      visible: true,
      vars: {},
      lists: {},
      running: false,
      stop: false
    },
    algoPackId: null,
    algoTopicKey: null,
    quiz: { started: false, idx: 0, score: 0, done: false },
    overlay: null,
    chatOpen: false
  };

  function setLangBtn(l) {
    var btns = langSwitchEl ? langSwitchEl.querySelectorAll(".lang-btn") : [];
    var i;
    for (i = 0; i < btns.length; i++) {
      if (btns[i].getAttribute("data-lang") === l) {
        btns[i].className = "lang-btn active";
      } else {
        btns[i].className = "lang-btn";
      }
    }
  }

  function applyLang(l) {
    if (T.setLang) {
      try { T.setLang(l); } catch (e) {}
    }
    try { window.localStorage.setItem(LANG_KEY, l); } catch (e) {}
    setLangBtn(l);
  }

  function bootLang() {
    var saved = null;
    try { saved = window.localStorage.getItem(LANG_KEY); } catch (e) {}
    if (saved === "en" || saved === "ru") {
      applyLang(saved);
    } else {
      setLangBtn(lang());
    }
  }

  function storeLang() {
    try { window.localStorage.setItem(LANG_KEY, lang()); } catch (e) {}
  }

  function totalSolved(p) {
    var k, sum = 0;
    for (k in p) {
      if (p.hasOwnProperty(k) && p[k].solved) { sum += p[k].solved; }
    }
    return sum;
  }

  function getXp() {
    try { return T.getXp ? T.getXp() : 0; } catch (e) { return 0; }
  }

  function getProgress() {
    try { return T.getProgress ? T.getProgress() : {}; } catch (e) { return {}; }
  }

  function updateProgressMini() {
    var xp = getXp();
    var p = getProgress();
    var solved = totalSolved(p);
    var w = Math.max(8, Math.min(100, solved * 17));
    if (progressMini) {
      progressMini.innerHTML = '<div class="row-d"><span>' + esc(solved) + ' ' + esc(l("solved")) + '</span><span>' + esc(xp) + ' ' + esc(l("xp")) + '</span></div>' +
        '<div class="bar progress-bar" style="margin-top:6px"><i style="width:' + w + '%"></i></div>';
    }
  }

  function nextSeed() {
    state.counter++;
    state.seed = ((state.counter * 2654435761) ^ (Date.now() & 0x7fffffff)) >>> 0;
    return state.seed;
  }

  function makeRng(seed) {
    if (T.makeRng) {
      try { return T.makeRng(seed); } catch (e) {}
    }
    if (window.MENTOR_RNG) { return window.MENTOR_RNG(seed); }
    return function () { return 0.5; };
  }

  function newTask() {
    var pack = getPack(state.packId);
    if (!pack) { return null; }
    var topic = findTopic(pack, state.topicKey);
    if (!topic) { return null; }
    state.topic = topic;
    state.level = topic.level || 1;
    var rng = makeRng(nextSeed());
    state.task = topic.gen(rng, state.level);
    state.lastError = null;
    state.lastErrType = null;
    state.scrStack = [];
    return state.task;
  }

  function safeBump(good, code, out) {
    var key = state.topicKey;
    var lvl = state.level;
    try {
      T.bump(key, lvl, good, code, out);
      return;
    } catch (e) {}
    var p = getProgress();
    var cur = p[key] || { solved: 0, tries: 0, best: 0, last: 0, streak: 0, levelup: 0 };
    cur.tries = (cur.tries || 0) + 1;
    cur.last = Date.now();
    if (good) {
      cur.solved = (cur.solved || 0) + 1;
      cur.streak = (cur.streak || 0) + 1;
      if (lvl > (cur.best || 0)) { cur.best = lvl; }
      if (cur.streak >= 3) { cur.levelup = (cur.levelup || 0) + 1; }
    } else {
      cur.streak = 0;
    }
    p[key] = cur;
    var xp = getXp();
    xp += good ? 10 + (lvl - 1) * 5 : 2;
    try {
      if (T.store && T.store.set) {
        T.store.set("progress", p);
        T.store.set("xp", xp);
      }
    } catch (e2) {}
    updateProgressMini();
  }

  function runCode(code, packId) {
    if (packId === "python") {
      return {
        then: function (onOk, onErr) {
          T.runPython(code).then(function (out) {
            onOk(out);
          }).catch(function (err) {
            onErr(err && err.message ? err.message : String(err));
          });
        }
      };
    }
    try {
      var out = T.runJS(code);
      return { then: function (onOk) { onOk(out); } };
    } catch (e) {
      return { then: function (onOk, onErr) { onErr(e && e.message ? e.message : String(e)); } };
    }
  }

  function showOut(raw) {
    var box = document.getElementById("outBox");
    if (!box) { return; }
    if (raw === "" || raw == null) {
      box.innerHTML = '<div class="out">' + esc(l("noOut")) + '</div>';
      return;
    }
    box.innerHTML = '<div class="out">' + esc(raw) + '</div>';
  }

  function showErr(msg) {
    var box = document.getElementById("outBox");
    state.lastError = msg;
    if (state.packId === "python" && T.pyErrType) {
      try { state.lastErrType = T.pyErrType(msg); } catch (e) { state.lastErrType = "other"; }
    } else {
      state.lastErrType = null;
    }
    if (!box) { return; }
    box.innerHTML = '<div class="out error">' + esc(l("runFailed") + ": " + msg) + '</div>';
  }

  function runInEditor() {
    var ta = document.getElementById("codeArea");
    if (!ta) { return; }
    var code = ta.value;
    showOut(null);
    runCode(code, state.packId).then(function (out) {
      state.lastError = null;
      state.lastErrType = null;
      showOut(out);
    }, function (err) {
      showErr(err);
      if (state.packId === "python" && err && err.indexOf("Pyodide load failed") >= 0) {
        toast(l("pyNotLoaded"), true);
      }
    });
  }

  function xpGain() {
    return 10 + (state.level - 1) * 5;
  }

  function checkSolution() {
    var ta = document.getElementById("codeArea");
    var box = document.getElementById("outBox");
    if (!ta || !box || !state.task) { return; }
    var code = ta.value;
    showOut(null);
    runCode(code, state.packId).then(function (out) {
      var res;
      try { res = T.compare ? T.compare(out, state.task.expected) : null; } catch (e) { res = null; }
      var good = res && res.good;
      state.lastError = null;
      state.lastErrType = null;
      if (good) {
        safeBump(true, code, out);
        toast(l("right") + " +" + xpGain() + " " + l("xp"), true);
        box.innerHTML = '<div class="out ok">' +
          '<b>' + esc(l("right")) + ' +' + xpGain() + ' ' + esc(l("xp")) + '</b><br>' +
          esc(l("output") + ":") + ' ' + esc(out) + '</div>';
      } else {
        safeBump(false, code, out);
        var mine = res && res.mine != null ? res.mine : out;
        var exp = res && res.expected != null ? res.expected : state.task.expected;
        box.innerHTML = '<div class="out">' +
          '<b>' + esc(l("wrong")) + '</b><br>' +
          esc(l("yourOut") + ":") + ' <span style="color:var(--bad)">' + esc(mine) + '</span><br>' +
          esc(l("expected") + ":") + ' <span style="color:var(--good)">' + esc(exp) + '</span></div>' +
          '<div class="out expected">' + esc(l("expected") + ": " + state.task.expected) + '</div>';
      }
      updateProgressMini();
    }, function (err) {
      showErr(err);
      safeBump(false, code, "");
      if (state.packId === "python" && err && err.indexOf("Pyodide load failed") >= 0) {
        toast(l("pyNotLoaded"), true);
      }
    });
  }

  function checkScrSolution() {
    var box = document.getElementById("outBox");
    if (!box || !state.task) { return; }
    var ids = [], i;
    for (i = 0; i < state.scrStack.length; i++) { ids.push(state.scrStack[i].id); }
    var res = scrCheckSolution(ids);
    var progText = scrAssembleText();
    if (res.good) {
      safeBump(true, progText || "blocks", state.task.expected);
      toast(l("right") + " +" + xpGain() + " " + l("xp"), true);
      box.innerHTML = '<div class="out ok"><b>' + esc(l("right")) + ' +' + xpGain() + ' ' + esc(l("xp")) + '</b><br>' +
        esc(l("scrBlocksOk")) + '</div>';
    } else {
      safeBump(false, progText || "blocks", "");
      var need = scrTaskBlocks();
      box.innerHTML = '<div class="out"><b>' + esc(l("wrong")) + '</b><br>' +
        esc(l("scrWrongHint")) + ' (' + res.matches + '/' + res.total + ' ' + esc(l("scrStep")) + ')</div>' +
        '<div class="out expected">' + esc(l("expected") + ":") + ' ' + esc(need.map(function (x) { return x.text; }).join(" → ")) + '</div>';
    }
    updateProgressMini();
  }

  function scrAssembleText() {
    var parts = [], i, b, task;
    for (i = 0; i < state.scrStack.length; i++) {
      task = state.scrStack[i];
      b = scrBlockById(task.id);
      if (!b) { continue; }
      var label = lang() === "ru" ? b.labelRu : b.labelEn;
      label = String(label).replace(/\[\[(\w+)\]\]/g, function (m, key) {
        return task.vals && task.vals[key] != null ? task.vals[key] : key;
      });
      parts.push(label);
    }
    return parts.join(" → ");
  }

  function toast(msg, ok) {
    var el = document.getElementById("toast");
    if (!el) { return; }
    el.textContent = msg;
    el.className = "toast show" + (ok ? " ok" : " bad");
    if (window.__toastTimer) { clearTimeout(window.__toastTimer); }
    window.__toastTimer = setTimeout(function () {
      el.className = "toast";
    }, 2600);
  }

  function crumbs(parts) {
    var html = '<div class="crumbs">';
    html += '<a href="javascript:void(0)" data-view="home">' + esc(l("navHome")) + '</a>';
    var i;
    for (i = 0; i < parts.length; i++) {
      html += ' <span>›</span> <span>' + esc(parts[i]) + '</span>';
    }
    html += '</div>';
    return html;
  }

  function renderLoading(n) {
    if (view) {
      view.innerHTML = '<div class="card" style="text-align:center"><h2>' + esc(l("loading")) + '</h2>' +
        '<p>' + esc(n) + '…</p></div>';
    }
  }

  function renderNotReady() {
    if (view) {
      view.innerHTML = '<div class="card" style="text-align:center;color:var(--bad)"><h2>⚠</h2><p>' + esc(l("notReady")) + '</p></div>';
    }
  }

  function renderHome() {
    var packs = getMyPacks();
    var html = crumbs([]);
    html += '<h1 class="page-title">🤖 ' + esc(personalize(l("greeting"))) + '</h1>';
    html += '<p class="page-sub">' + esc(l("homeFeature1")) + ' · ' + esc(l("homeFeature2")) + '</p>';
    html += '<div class="grid2">';
    var i;
    for (i = 0; i < packs.length; i++) {
      var pk = packs[i];
      var descKey = "lang" + capId(pk.id) + "Desc";
      var desc = uiDict[lang()] && uiDict[lang()][descKey];
      if (desc == null) { desc = uiDict.ru[descKey]; }
      if (desc == null) { desc = ""; }
      var topicCount = pk.topics ? pk.topics.length : 0;
      html += '<div class="card" style="border-top:3px solid ' + esc(pk.color || "#7c6cf0") + '">' +
        '<div style="font-size:44px">' + esc(pk.logo || "💻") + '</div>' +
        '<h2 style="margin:8px 0 2px">' + esc(pk.monoName || pk.id) + '</h2>' +
        '<p style="color:var(--muted)">' + esc(desc) + '</p>' +
        '<p style="color:var(--muted);font-size:12px;margin:6px 0 12px">' + topicCount + ' ' + esc(l("solved")) + ' · ' + esc(l("topicLevel")) + ' 1–3</p>' +
        '<button class="btn primary" data-langcard="' + esc(pk.id) + '">' + esc(l("start")) + '</button>' +
        '</div>';
    }
    html += '</div>';
    if (view) { view.innerHTML = html; }
  }

  function renderTopics(packId) {
    var pack = getPack(packId);
    if (!pack) { renderHome(); return; }
    var p = getProgress();
    var html = crumbs([pack.monoName || pack.id]);
    html += '<h1 class="page-title">' + esc(pack.logo || "💻") + ' ' + esc(pack.monoName || pack.id) + '</h1>';
    html += '<p class="page-sub">' + esc(l("pickTopic")) + '</p>';
    html += '<div class="topic-row">';
    var i, tpc, tpn, cur, solved;
    for (i = 0; i < pack.topics.length; i++) {
      tpc = pack.topics[i];
      tpn = tpc.name && tpc.name[lang()] != null ? tpc.name[lang()] : (tpc.name && tpc.name.ru);
      cur = p[tpc.key];
      solved = cur && cur.solved ? cur.solved : 0;
      html += '<button class="topic-btn" data-topic="' + esc(tpc.key) + '" data-pack="' + esc(pack.id) + '">' +
        '<span><b>' + esc(tpn || tpc.key) + '</b><br><span style="color:var(--muted);font-size:12px">' +
        esc(l("topicLevel")) + ' ' + tpc.level + ' · ' + solved + ' ' + esc(l("solved")) + '</span></span>' +
        '<span style="font-size:20px">→</span></button>';
    }
    html += '</div>';
    if (view) { view.innerHTML = html; }
  }

  function pickStarter(task) {
    var t = task || state.task;
    if (!t) { return ""; }
    return lang() === "ru" ? (t.starterRu || "") : (t.starterJs || t.starterRu || "");
  }

  /* Каталог блоков Scratch для блочного редактора (window.SCR_BLOCKS).
     Блок: { id, cat, color, labelRu, labelEn, val: name поля }. */
  var SCR_BLOCKS = (window.SCR_BLOCKS || []).length ? window.SCR_BLOCKS : [
    { id: "flag", cat: "События", color: "#ffbf00", labelRu: "когда флажок нажат", labelEn: "when green flag clicked", val: "" },
    { id: "sprite", cat: "События", color: "#ffbf00", labelRu: "когда этот спрайт нажат", labelEn: "when this sprite clicked", val: "" },
    { id: "key", cat: "События", color: "#ffbf00", labelRu: "когда нажата клавиша [[key]]", labelEn: "when [[key]] key pressed", val: "key" },
    { id: "broadcast", cat: "События", color: "#ffbf00", labelRu: "передать сообщение [[msg]]", labelEn: "broadcast [[msg]]", val: "msg" },
    { id: "received", cat: "События", color: "#ffbf00", labelRu: "когда я получу [[msg]]", labelEn: "when I receive [[msg]]", val: "msg" },
    { id: "say", cat: "Внешность", color: "#9966ff", labelRu: "сказать [[text]]", labelEn: "say [[text]]", val: "text" },
    { id: "say2", cat: "Внешность", color: "#9966ff", labelRu: "сказать [[text]] ([[sec]] сек.)", labelEn: "say [[text]] for [[sec]] sec", val: "sec|text" },
    { id: "think", cat: "Внешность", color: "#9966ff", labelRu: "подумать [[text]]", labelEn: "think [[text]]", val: "text" },
    { id: "costume", cat: "Внешность", color: "#9966ff", labelRu: "сменить костюм на [[n]]", labelEn: "switch costume to [[n]]", val: "n" },
    { id: "nextcostume", cat: "Внешность", color: "#9966ff", labelRu: "следующий костюм", labelEn: "next costume", val: "" },
    { id: "backdrop", cat: "Внешность", color: "#9966ff", labelRu: "сменить фон на [[n]]", labelEn: "switch backdrop to [[n]]", val: "n" },
    { id: "show", cat: "Внешность", color: "#9966ff", labelRu: "показаться", labelEn: "show", val: "" },
    { id: "hide", cat: "Внешность", color: "#9966ff", labelRu: "спрятаться", labelEn: "hide", val: "" },
    { id: "setsize", cat: "Внешность", color: "#9966ff", labelRu: "установить размер [[n]] %", labelEn: "set size to [[n]] %", val: "n" },
    { id: "changesize", cat: "Внешность", color: "#9966ff", labelRu: "изменить размер на [[n]] %", labelEn: "change size by [[n]] %", val: "n" },
    { id: "move", cat: "Движение", color: "#4c97ff", labelRu: "идти [[n]] шагов", labelEn: "move [[n]] steps", val: "n" },
    { id: "turnr", cat: "Движение", color: "#4c97ff", labelRu: "повернуть направо на [[n]] гр.", labelEn: "turn right [[n]] degrees", val: "n" },
    { id: "turnl", cat: "Движение", color: "#4c97ff", labelRu: "повернуть налево на [[n]] гр.", labelEn: "turn left [[n]] degrees", val: "n" },
    { id: "gotoxy", cat: "Движение", color: "#4c97ff", labelRu: "идти в x [[x]] y [[y]]", labelEn: "go to x [[x]] y [[y]]", val: "x|y" },
    { id: "glide", cat: "Движение", color: "#4c97ff", labelRu: "плыть [[n]] сек. к x [[x]] y [[y]]", labelEn: "glide [[n]] secs to x [[x]] y [[y]]", val: "n|x|y" },
    { id: "point", cat: "Движение", color: "#4c97ff", labelRu: "направить на [[n]] гр.", labelEn: "point in direction [[n]]", val: "n" },
    { id: "bounce", cat: "Движение", color: "#4c97ff", labelRu: "отразиться от края", labelEn: "if on edge, bounce", val: "" },
    { id: "sound", cat: "Звук", color: "#cf63cf", labelRu: "играть звук [[n]]", labelEn: "play sound [[n]]", val: "n" },
    { id: "sounduntil", cat: "Звук", color: "#cf63cf", labelRu: "играть звук [[n]] до конца", labelEn: "play sound [[n]] until done", val: "n" },
    { id: "stopsounds", cat: "Звук", color: "#cf63cf", labelRu: "остановить все звуки", labelEn: "stop all sounds", val: "" },
    { id: "setvol", cat: "Звук", color: "#cf63cf", labelRu: "установить громкость [[n]] %", labelEn: "set volume to [[n]] %", val: "n" },
    { id: "wait", cat: "Управление", color: "#ffab19", labelRu: "ждать [[n]] секунд", labelEn: "wait [[n]] seconds", val: "n" },
    { id: "repeat", cat: "Управление", color: "#ffab19", labelRu: "повторить [[n]] раз", labelEn: "repeat [[n]]", val: "n" },
    { id: "repeatuntil", cat: "Управление", color: "#ffab19", labelRu: "повторять пока [[cond]]", labelEn: "repeat until [[cond]]", val: "cond" },
    { id: "forever", cat: "Управление", color: "#ffab19", labelRu: "повторять всегда", labelEn: "forever", val: "" },
    { id: "if", cat: "Управление", color: "#ffab19", labelRu: "если [[cond]]", labelEn: "if [[cond]]", val: "cond" },
    { id: "ifelse", cat: "Управление", color: "#ffab19", labelRu: "если [[cond]], иначе", labelEn: "if [[cond]], else", val: "cond" },
    { id: "waituntil", cat: "Управление", color: "#ffab19", labelRu: "ждать пока [[cond]]", labelEn: "wait until [[cond]]", val: "cond" },
    { id: "stop", cat: "Управление", color: "#ffab19", labelRu: "остановить всё", labelEn: "stop all", val: "" },
    { id: "ask", cat: "Восприятие", color: "#5cb1d6", labelRu: "спросить [[q]] и ждать", labelEn: "ask [[q]] and wait", val: "q" },
    { id: "answer", cat: "Восприятие", color: "#5cb1d6", labelRu: "ответ", labelEn: "answer", val: "" },
    { id: "keypressed", cat: "Восприятие", color: "#5cb1d6", labelRu: "клавиша [[key]] нажата?", labelEn: "key [[key]] pressed?", val: "key" },
    { id: "mouseclick", cat: "Восприятие", color: "#5cb1d6", labelRu: "мышь кликнута?", labelEn: "mouse down?", val: "" },
    { id: "touch", cat: "Восприятие", color: "#5cb1d6", labelRu: "касается [[what]]", labelEn: "touching [[what]]", val: "what" },
    { id: "edge", cat: "Восприятие", color: "#5cb1d6", labelRu: "касается края", labelEn: "touching edge", val: "" },
    { id: "plus", cat: "Операторы", color: "#59c059", labelRu: "[[a]] + [[b]]", labelEn: "[[a]] + [[b]]", val: "a|b" },
    { id: "minus", cat: "Операторы", color: "#59c059", labelRu: "[[a]] - [[b]]", labelEn: "[[a]] - [[b]]", val: "a|b" },
    { id: "times", cat: "Операторы", color: "#59c059", labelRu: "[[a]] × [[b]]", labelEn: "[[a]] × [[b]]", val: "a|b" },
    { id: "divide", cat: "Операторы", color: "#59c059", labelRu: "[[a]] ÷ [[b]]", labelEn: "[[a]] ÷ [[b]]", val: "a|b" },
    { id: "rand", cat: "Операторы", color: "#59c059", labelRu: "случайное от [[a]] до [[b]]", labelEn: "pick random [[a]] to [[b]]", val: "a|b" },
    { id: "and", cat: "Операторы", color: "#59c059", labelRu: "[[a]] и [[b]]", labelEn: "[[a]] and [[b]]", val: "a|b" },
    { id: "or", cat: "Операторы", color: "#59c059", labelRu: "[[a]] или [[b]]", labelEn: "[[a]] or [[b]]", val: "a|b" },
    { id: "not", cat: "Операторы", color: "#59c059", labelRu: "не [[a]]", labelEn: "not [[a]]", val: "a" },
    { id: "join", cat: "Операторы", color: "#59c059", labelRu: "соединить [[a]] и [[b]]", labelEn: "join [[a]] and [[b]]", val: "a|b" },
    { id: "set", cat: "Переменные", color: "#ff8c1a", labelRu: "установить [[var]] в [[n]]", labelEn: "set [[var]] to [[n]]", val: "var|n" },
    { id: "change", cat: "Переменные", color: "#ff8c1a", labelRu: "изменить [[var]] на [[n]]", labelEn: "change [[var]] by [[n]]", val: "var|n" },
    { id: "showvar", cat: "Переменные", color: "#ff8c1a", labelRu: "показать переменную [[var]]", labelEn: "show variable [[var]]", val: "var" },
    { id: "hidevar", cat: "Переменные", color: "#ff8c1a", labelRu: "скрыть переменную [[var]]", labelEn: "hide variable [[var]]", val: "var" },
    { id: "listadd", cat: "Переменные", color: "#ff8c1a", labelRu: "добавить [[n]] в список [[lst]]", labelEn: "add [[n]] to [[lst]]", val: "lst|n" },
    { id: "listdel", cat: "Переменные", color: "#ff8c1a", labelRu: "удалить [[n]] из списка [[lst]]", labelEn: "delete [[n]] of [[lst]]", val: "lst|n" },
    { id: "define", cat: "Мои блоки", color: "#ff6680", labelRu: "определить [[name]]", labelEn: "define [[name]]", val: "name" },
    { id: "call", cat: "Мои блоки", color: "#ff6680", labelRu: "выполнить [[name]]", labelEn: "run [[name]]", val: "name" }
  ];

  function scrBlockById(id) {
    var i;
    for (i = 0; i < SCR_BLOCKS.length; i++) {
      if (SCR_BLOCKS[i].id === id) { return SCR_BLOCKS[i]; }
    }
    return null;
  }

  /* Рендер одного блока Scratch (прямоугольная плашка категории). */
  function scrBlockHtml(b, fill) {
    var label = lang() === "ru" ? b.labelRu : b.labelEn;
    var vals = fill || {};
    label = String(label).replace(/\[\[(\w+)\]\]/g, function (m, key) {
      var v = vals[key];
      if (v == null) {
        return '<span style="opacity:.85">—</span>';
      }
      return String(v);
    });
    return '<span class="scr-block" data-scr-block="' + esc(b.id) + '" style="background:' +
      (b.color || "#7c6cf0") + ';color:#0b1020;border-radius:14px;padding:8px 14px;margin:2px 4px 2px 2px;' +
      'display:inline-block;font-weight:600;cursor:pointer;font-size:13px;box-shadow:0 2px 6px rgba(0,0,0,.35);' +
      'border-bottom:3px solid rgba(0,0,0,.25)">' + label + '</span>';
  }

  /* ---- Сцена Scratch: спрайты, фоны, звуки (офлайн-библиотеки) ---- */
  var SCR_SPRITES = [
    { id: "cat", e: "🐱", ru: "Котик", en: "Cat" },
    { id: "dog", e: "🐶", ru: "Пёс", en: "Dog" },
    { id: "robot", e: "🤖", ru: "Робот", en: "Robot" },
    { id: "ball", e: "⚽", ru: "Мяч", en: "Ball" },
    { id: "star", e: "⭐", ru: "Звезда", en: "Star" },
    { id: "bird", e: "🐦", ru: "Птица", en: "Bird" },
    { id: "fish", e: "🐟", ru: "Рыбка", en: "Fish" },
    { id: "rocket", e: "🚀", ru: "Ракета", en: "Rocket" },
    { id: "dino", e: "🦖", ru: "Динозавр", en: "Dino" }
  ];

  var SCR_BACKDROPS = [
    { id: "sky", css: "linear-gradient(#3b82f6,#87ceeb)", d: "☁️", ru: "Небо", en: "Sky" },
    { id: "space", css: "radial-gradient(circle at 30% 30%,#1e3a8a,#0b1020)", d: "🌌", ru: "Космос", en: "Space" },
    { id: "sea", css: "linear-gradient(#0ea5e9,#67e8f9)", d: "🌊", ru: "Море", en: "Sea" },
    { id: "forest", css: "linear-gradient(#14532d,#4ade80)", d: "🌲", ru: "Лес", en: "Forest" },
    { id: "city", css: "linear-gradient(#334155,#94a3b8)", d: "🌇", ru: "Город", en: "City" },
    { id: "night", css: "linear-gradient(to bottom,#0f172a,#312e81)", d: "🌙", ru: "Ночь", en: "Night" },
    { id: "sunset", css: "linear-gradient(#f97316,#fde047)", d: "🌅", ru: "Закат", en: "Sunset" },
    { id: "field", css: "repeating-linear-gradient(45deg,#475569 0,#475569 8px,#64748b 8px,#64748b 16px)", d: "⬜", ru: "Поле", en: "Field" }
  ];

  var SCR_SOUNDS = [
    { id: "pop", ru: "Поп", en: "Pop" },
    { id: "boing", ru: "Буинг", en: "Boing" },
    { id: "laser", ru: "Лазер", en: "Laser" },
    { id: "beep", ru: "Бип", en: "Beep" },
    { id: "meow", ru: "Мяу", en: "Meow" },
    { id: "drum", ru: "Барабан", en: "Drum" }
  ];

  function scrSpriteById(id) {
    var i;
    for (i = 0; i < SCR_SPRITES.length; i++) {
      if (SCR_SPRITES[i].id === id) { return SCR_SPRITES[i]; }
    }
    return SCR_SPRITES[0];
  }

  function scrBackdropById(id) {
    var i;
    for (i = 0; i < SCR_BACKDROPS.length; i++) {
      if (SCR_BACKDROPS[i].id === id) { return SCR_BACKDROPS[i]; }
    }
    return SCR_BACKDROPS[0];
  }

  function scrSoundById(id) {
    var i;
    for (i = 0; i < SCR_SOUNDS.length; i++) {
      if (SCR_SOUNDS[i].id === id) { return SCR_SOUNDS[i]; }
    }
    return SCR_SOUNDS[0];
  }

  function scrSavePrefs() {
    try {
      var st = state.scrStage;
      window.Tutor.store.set("scrStage", {
        sprite: st.sprite,
        backdrop: st.backdrop,
        sound: st.sound,
        costume: st.costume || ""
      });
    } catch (e) {}
  }

  function scrLoadPrefs() {
    try {
      var p = window.Tutor.store.get("scrStage", null);
      if (p && typeof p === "object") {
        if (scrSpriteById(p.sprite)) { state.scrStage.sprite = p.sprite; }
        if (scrBackdropById(p.backdrop)) { state.scrStage.backdrop = p.backdrop; }
        if (scrSoundById(p.sound)) { state.scrStage.sound = p.sound; }
        if (p.costume) { state.scrStage.costume = p.costume; }
      }
    } catch (e) {}
  }

  /* Синтез звуков WebAudio (офлайн, без файлов). */
  function scrPlaySound(id) {
    var s = scrSoundById(id);
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { return; }
    var ctx = window.__scrAudio;
    if (!ctx) {
      try { ctx = new AC(); window.__scrAudio = ctx; } catch (e) { return; }
    }
    var now = ctx.currentTime;
    var master = ctx.createGain();
    master.gain.value = 0.12;
    master.connect(ctx.destination);
    function tone(type, f0, f1, dur) {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f0, now);
      if (f1 !== f0) { o.frequency.exponentialRampToValueAtTime(f1, now + dur); }
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.9, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.connect(g); g.connect(master);
      o.start(now); o.stop(now + dur + 0.02);
    }
    if (id === "pop") { tone("square", 300, 90, 0.12); }
    else if (id === "boing") { tone("sine", 180, 520, 0.28); }
    else if (id === "laser") { tone("sawtooth", 1400, 220, 0.3); }
    else if (id === "beep") { tone("square", 880, 880, 0.18); }
    else if (id === "meow") { tone("sine", 640, 260, 0.35); }
    else if (id === "drum") { tone("triangle", 140, 55, 0.22); }
    else { tone("sine", 520, 520, 0.2); }
  }

  function scrStageReset() {
    var st = state.scrStage;
    st.x = 50;
    st.y = 70;
    st.dir = 0;
    st.size = 1;
    st.visible = true;
    st.bubble = null;
  }

  /* Панель сцены: фон + спрайт + пузырь + набор (спрайт/фон/звук/рисовать/пуск). */
  function scrStageHtml() {
    var st = state.scrStage;
    var bd = scrBackdropById(st.backdrop);
    var sp = scrSpriteById(st.sprite);
    var html = '<div class="scr-stage" id="scrStage" style="background:' + bd.css + '">';
    html += '<div class="scr-stage-deco">' + bd.d + '</div>';
    html += '<div class="scr-bubble" id="scrBubble"></div>';
    html += '<div class="scr-sprite" id="scrSprite">' + (st.costume ? '<img src="' + esc(st.costume) + '" alt="" />' : esc(sp.e)) + '</div>';
    html += '</div>';
    html += '<div class="scr-stage-sel">';
    html += '<button class="btn small" data-scr-pick="sprite">🧍 ' + esc(l("scrSprite")) + '</button>';
    html += '<button class="btn small" data-scr-pick="backdrop">🖼 ' + esc(l("scrBackdrop")) + '</button>';
    html += '<button class="btn small" data-scr-pick="sound">🔊 ' + esc(l("scrSoundPick")) + '</button>';
    html += '<button class="btn small" data-scr-draw="1">🎨 ' + esc(l("scrDraw")) + '</button>';
    html += '</div>';
    html += '<div id="scrPickPanel" class="scr-pickpanel">' + scrPickHtml() + '</div>';
    return html;
  }

  /* Содержимое панели выбора (спрайт/фон/звук), зависит от state.scrPick. */
  function scrPickHtml() {
    var mode = state.scrPick;
    var html = "";
    if (!mode) { return html; }
    var i, it;
    if (mode === "sprite") {
      html += '<div class="page-sub" style="margin:0 0 6px">' + esc(l("scrSpriteTitle")) + '</div><div class="scr-pick-grid">';
      for (i = 0; i < SCR_SPRITES.length; i++) {
        it = SCR_SPRITES[i];
        var on = it.id === state.scrStage.sprite && !state.scrStage.costume;
        html += '<button class="pick-tile' + (on ? ' on' : '') + '" data-scr-set="sprite" data-scr-sel="' + esc(it.id) + '">' +
          '<span style="font-size:32px">' + esc(it.e) + '</span><span>' + esc(lang() === "ru" ? it.ru : it.en) + '</span></button>';
      }
      var cOn = !!state.scrStage.costume;
      html += '<button class="pick-tile' + (cOn ? ' on' : '') + '" data-scr-set="costume">' +
        '<span style="font-size:32px">🎨</span><span>' + esc(l("scrDraw")) + '</span></button>';
      html += '</div>';
    } else if (mode === "backdrop") {
      html += '<div class="page-sub" style="margin:0 0 6px">' + esc(l("scrBackdropTitle")) + '</div><div class="scr-pick-grid">';
      for (i = 0; i < SCR_BACKDROPS.length; i++) {
        it = SCR_BACKDROPS[i];
        var bon = it.id === state.scrStage.backdrop;
        html += '<button class="pick-tile' + (bon ? ' on' : '') + '" data-scr-set="backdrop" data-scr-sel="' + esc(it.id) + '">' +
          '<span class="backdrop-swat" style="background:' + it.css + '">' + it.d + '</span>' +
          '<span>' + esc(lang() === "ru" ? it.ru : it.en) + '</span></button>';
      }
      html += '</div>';
    } else if (mode === "sound") {
      html += '<div class="page-sub" style="margin:0 0 6px">' + esc(l("scrSoundTitle")) + '</div><div class="scr-pick-grid">';
      for (i = 0; i < SCR_SOUNDS.length; i++) {
        it = SCR_SOUNDS[i];
        var son = it.id === state.scrStage.sound;
        html += '<button class="pick-tile' + (son ? ' on' : '') + '" data-scr-set="sound" data-scr-sel="' + esc(it.id) + '" title="▶">' +
          '<span style="font-size:24px">🔊</span><span>' + esc(lang() === "ru" ? it.ru : it.en) + '</span></button>';
      }
      html += '</div>';
    }
    return html;
  }

  /* Применяет состояние сцены к DOM (идемпотентно, после каждого шага/выбора). */
  function scrStageApply() {
    var st = state.scrStage;
    var stage = document.getElementById("scrStage");
    if (!stage) { return; }
    var bd = scrBackdropById(st.backdrop);
    stage.style.background = bd.css;
    var deco = stage.querySelector(".scr-stage-deco");
    if (deco) { deco.textContent = bd.d; }
    var spr = document.getElementById("scrSprite");
    if (spr) {
      if (st.costume) { spr.innerHTML = '<img src="' + esc(st.costume) + '" alt="" />'; }
      else { spr.textContent = scrSpriteById(st.sprite).e; }
      spr.style.left = st.x + "%";
      spr.style.top = st.y + "%";
      spr.style.transform = "translate(-50%,-50%) rotate(" + st.dir + "deg) scale(" + st.size + ")";
      spr.style.opacity = st.visible ? "1" : "0";
    }
    var bub = document.getElementById("scrBubble");
    if (bub) {
      if (st.bubble) { bub.textContent = st.bubble; bub.style.display = "block"; }
      else { bub.textContent = ""; bub.style.display = "none"; }
    }
  }

  /* Планировщик: разворачивает repeat/forever в плоский список шагов (ES5). */
  function scrSchedule(stack) {
    var out = [], i, b, n, k;
    for (i = 0; i < stack.length; i++) {
      b = stack[i];
      if (!b) { continue; }
      if (b.id === "repeat") {
        n = parseInt(b.vals && b.vals.n, 10);
        if (isNaN(n) || n < 1) { n = 1; }
        if (n > 50) { n = 50; }
        for (k = 0; k < n; k++) { out.push({ p: false, b: b, n: n }); }
      } else if (b.id === "forever") {
        out.push({ p: true, b: b, n: 0 });
      } else {
        out.push({ p: false, b: b, n: 0 });
      }
    }
    return out;
  }

  /* Исполнение одного блока на сцене; возвращает задержку до шага (мс). */
  function scrExecBlock(step) {
    var st = state.scrStage;
    var b = step.b;
    var id = b.id;
    var v = b.vals || {};
    var n = parseFloat(v.n);
    if (isNaN(n)) { n = 0; }
    if (id === "wait") { return n <= 0 ? 300 : Math.min(n * 1000, 5000); }
    if (id === "move") {
      st.x = Math.max(4, Math.min(96, st.x + n * 0.4));
      scrStageApply();
      return 380;
    }
    if (id === "turnr") {
      st.dir += n;
      scrStageApply();
      return 260;
    }
    if (id === "turnl") {
      st.dir -= n;
      scrStageApply();
      return 260;
    }
    if (id === "gotoxy") {
      var gx = parseFloat(v.x), gy = parseFloat(v.y);
      st.x = isNaN(gx) ? st.x : Math.max(4, Math.min(96, 50 + gx * 0.2));
      st.y = isNaN(gy) ? st.y : Math.max(8, Math.min(92, 70 - gy * 0.18));
      scrStageApply();
      return 400;
    }
    if (id === "glide") {
      var dx = parseFloat(v.x), dy = parseFloat(v.y), sec = parseFloat(v.n);
      if (!isNaN(dx)) { st.x = Math.max(4, Math.min(96, 50 + dx * 0.2)); }
      if (!isNaN(dy)) { st.y = Math.max(8, Math.min(92, 70 - dy * 0.18)); }
      scrStageApply();
      return Math.max(400, Math.min(3000, (isNaN(sec) ? 1 : sec) * 900));
    }
    if (id === "point") {
      st.dir = n;
      scrStageApply();
      return 300;
    }
    if (id === "bounce") {
      if (st.x < 10) { st.x = 10; st.dir = 180; } else if (st.x > 90) { st.x = 90; st.dir = 0; }
      scrStageApply();
      return 300;
    }
    if (id === "show") { st.visible = true; scrStageApply(); return 300; }
    if (id === "hide") { st.visible = false; scrStageApply(); return 300; }
    if (id === "setsize") { st.size = Math.max(0.2, Math.min(4, n / 100)); scrStageApply(); return 300; }
    if (id === "changesize") { st.size = Math.max(0.2, Math.min(4, st.size + n / 100)); scrStageApply(); return 300; }
    if (id === "say" || id === "say2") {
      st.bubble = v.text != null ? String(v.text) : "";
      scrStageApply();
      var sec = id === "say2" ? (parseFloat(v.sec) || 2) : 2;
      return Math.min(sec * 1000, 5000);
    }
    if (id === "think") {
      st.bubble = "💭 " + (v.text != null ? String(v.text) : "");
      scrStageApply();
      return 1500;
    }
    if (id === "costume") {
      var wanted = String(v.n || "").toLowerCase();
      var i2;
      for (i2 = 0; i2 < SCR_SPRITES.length; i2++) {
        var sSprite = SCR_SPRITES[i2];
        if (sSprite.id === wanted || (lang() === "ru" && sSprite.ru.toLowerCase() === wanted) ||
          (lang() === "en" && sSprite.en.toLowerCase() === wanted)) {
          st.sprite = sSprite.id;
          st.costume = null;
          break;
        }
      }
      scrStageApply();
      return 350;
    }
    if (id === "nextcostume") {
      var idx = 0, i3;
      for (i3 = 0; i3 < SCR_SPRITES.length; i3++) { if (SCR_SPRITES[i3].id === st.sprite) { idx = i3; } }
      idx = (idx + 1) % SCR_SPRITES.length;
      st.sprite = SCR_SPRITES[idx].id;
      st.costume = null;
      scrStageApply();
      return 350;
    }
    if (id === "backdrop") {
      var bw = String(v.n || "").toLowerCase();
      var i4;
      for (i4 = 0; i4 < SCR_BACKDROPS.length; i4++) {
        var bd4 = SCR_BACKDROPS[i4];
        if (bd4.id === bw || (lang() === "ru" && bd4.ru.toLowerCase() === bw) ||
          (lang() === "en" && bd4.en.toLowerCase() === bw)) {
          st.backdrop = bd4.id;
          break;
        }
      }
      scrStageApply();
      return 400;
    }
    if (id === "sound" || id === "sounduntil") {
      var snd = v.n != null ? String(v.n).toLowerCase() : st.sound;
      var sid = st.sound;
      var i5;
      for (i5 = 0; i5 < SCR_SOUNDS.length; i5++) {
        if (SCR_SOUNDS[i5].id === snd || (lang() === "ru" && SCR_SOUNDS[i5].ru.toLowerCase() === snd) ||
          (lang() === "en" && SCR_SOUNDS[i5].en.toLowerCase() === snd)) { sid = SCR_SOUNDS[i5].id; break; }
      }
      scrPlaySound(sid);
      return id === "sounduntil" ? 700 : 350;
    }
    if (id === "ask") {
      var q = v.q != null ? String(v.q) : "";
      var ans = null;
      try { ans = window.prompt(q, ""); } catch (e) { ans = ""; }
      if (ans == null) { ans = ""; }
      st.vars["answer"] = ans;
      st.bubble = q + " → " + ans;
      scrStageApply();
      return 400;
    }
    if (id === "answer") { return 300; }
    if (id === "set" || id === "change") {
      var vk = String(v.var || "");
      if (vk) {
        var cur = st.vars[vk] != null ? parseFloat(st.vars[vk]) : 0;
        if (isNaN(cur)) { cur = 0; }
        st.vars[vk] = id === "set" ? n : cur + n;
      }
      return 350;
    }
    if (id === "listadd" || id === "listdel") {
      var lk = String(v.lst || "список");
      if (!st.lists[lk]) { st.lists[lk] = []; }
      if (id === "listadd") { st.lists[lk].push(v.n != null ? String(v.n) : ""); }
      else { st.lists[lk].pop(); }
      return 350;
    }
    if (id === "if" || id === "ifelse" || id === "repeatuntil" || id === "waituntil" ||
      id === "keypressed" || id === "mouseclick" || id === "touch" || id === "edge" ||
      id === "plus" || id === "minus" || id === "times" || id === "divide" ||
      id === "rand" || id === "and" || id === "or" || id === "not" || id === "join" ||
      id === "setvol" || id === "stopsounds" || id === "showvar" || id === "hidevar" ||
      id === "define" || id === "call" || id === "key" || id === "broadcast" ||
      id === "received" || id === "sprite" || id === "flag" || id === "stop") {
      return 250;
    }
    return 300;
  }

  function scrRun() {
    var st = state.scrStage;
    if (st.running) { return; }
    st.running = true;
    st.stop = false;
    scrStageReset();
    scrStageApply();
    var plan = scrSchedule(state.scrStack || []);
    var i = 0;
    function step() {
      if (st.stop || !st.running) { st.running = false; scrStageApply(); return; }
      if (i >= plan.length) {
        st.running = false;
        scrStageApply();
        toast(l("scrRunDone"), true);
        return;
      }
      var s = plan[i];
      i++;
      var delay = scrExecBlock(s);
      setTimeout(step, delay);
    }
    step();
  }

  function scrStop() {
    var st = state.scrStage;
    st.stop = true;
    st.running = false;
    scrStageApply();
  }

  /* Рисовалка костюма: canvas-оверлей, кисть/цвет, сохранение в png. */
  function scrDrawOpen() {
    scrDrawClose();
    var wrap = document.createElement("div");
    wrap.innerHTML = '<div id="scrDrawOverlay" class="scr-draw-overlay">' +
      '<div class="scr-draw-box">' +
      '<h3 style="margin:0 0 4px">🎨 ' + esc(l("scrDrawTitle")) + '</h3>' +
      '<p class="page-sub" style="margin:0 0 8px">' + esc(l("scrDrawSub")) + '</p>' +
      '<canvas id="scrCanvas" width="220" height="220"></canvas>' +
      '<div class="scr-draw-tools">' +
      '<label>' + esc(l("scrDrawColor")) + ' <input type="color" id="scrDrawColor" value="#22d3ee" /></label>' +
      '<label>' + esc(l("scrDrawSize")) + ' <input type="range" id="scrDrawSize" min="2" max="30" value="10" /></label>' +
      '</div>' +
      '<div class="btn-row" style="margin-top:10px">' +
      '<button class="btn small" id="scrDrawClear">🗑 ' + esc(l("scrDrawClear")) + '</button>' +
      '<button class="btn primary" id="scrDrawSave">💾 ' + esc(l("scrDrawSave")) + '</button>' +
      '<button class="btn small ghost" id="scrDrawClose">✕ ' + esc(l("scrDrawClose")) + '</button>' +
      '</div></div></div>';
    var ov = wrap.firstChild;
    document.body.appendChild(ov);
    ov.addEventListener("click", function (e) { if (e.target === ov) { scrDrawClose(); } });
    scrDrawInitCanvas();
  }

  function scrDrawClose() {
    var ov = document.getElementById("scrDrawOverlay");
    if (ov && ov.parentNode) { ov.parentNode.removeChild(ov); }
  }

  function scrDrawInitCanvas() {
    var c = document.getElementById("scrCanvas");
    if (!c || !c.getContext) { return; }
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 220, 220);
    var drawing = false;
    function pos(ev) {
      var r = c.getBoundingClientRect();
      var x = ev.clientX - r.left;
      var y = ev.clientY - r.top;
      return { x: Math.max(0, Math.min(220, x * 220 / r.width)), y: Math.max(0, Math.min(220, y * 220 / r.height)) };
    }
    c.addEventListener("mousedown", function (e) {
      drawing = true;
      var p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    });
    c.addEventListener("mousemove", function (e) {
      if (!drawing) { return; }
      var t = document.getElementById("scrDrawColor");
      var sz = document.getElementById("scrDrawSize");
      ctx.strokeStyle = t ? t.value : "#22d3ee";
      ctx.lineWidth = sz ? parseInt(sz.value, 10) : 10;
      ctx.lineCap = "round";
      ctx.lineTo(pos(e).x, pos(e).y);
      ctx.stroke();
    });
    c.addEventListener("mouseup", function () { drawing = false; });
    c.addEventListener("mouseleave", function () { drawing = false; });
    var clearB = document.getElementById("scrDrawClear");
    if (clearB) {
      clearB.addEventListener("click", function () {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 220, 220);
      });
    }
    var saveB = document.getElementById("scrDrawSave");
    if (saveB) {
      saveB.addEventListener("click", function () {
        try {
          state.scrStage.costume = c.toDataURL("image/png");
          scrSavePrefs();
          scrDrawClose();
          toast(l("scrDrawSaved"), true);
          renderTrain();
        } catch (e) {}
      });
    }
    var closeB = document.getElementById("scrDrawClose");
    if (closeB) {
      closeB.addEventListener("click", scrDrawClose);
    }
  }

  function scrParseSolution(sol) {
    /* Разбивает solution типа "сказать «Привет» (2 сек.) → идти 5 шагов" на список {id, text}. */
    var out = [], parts, i, p, s, b;
    if (!sol) { return out; }
    parts = String(sol).split(/→|->|\n|;/);
    for (i = 0; i < parts.length; i++) {
      s = parts[i].replace(/[«»"]/g, "").trim();
      if (!s) { continue; }
      b = scrBlockForText(s);
      out.push({ id: b ? b.id : "?", text: s });
    }
    return out;
  }

  function scrBlockForText(s) {
    var t = String(s).toLowerCase();
    /* События: проверяем раньше, т.к. в одной строке могут быть и «когда флажок», и «сказать». */
    if (t.indexOf("флажок нажат") >= 0 || t.indexOf("green flag") >= 0) { return scrBlockById("flag"); }
    if (t.indexOf("спрайт нажат") >= 0 || t.indexOf("sprite clicked") >= 0 || t.indexOf(" этот спрайт") >= 0) { return scrBlockById("sprite"); }
    if (t.indexOf("клавиша") >= 0 || t.indexOf("key pressed") >= 0 || t.indexOf("стрелка") >= 0 || t.indexOf("пробел") >= 0) { return scrBlockById("key"); }
    if (t.indexOf("передать сообщение") >= 0 || t.indexOf("получить сообщение") >= 0 || t.indexOf("когда я получу") >= 0 || t.indexOf("broadcast") >= 0 || t.indexOf("когда я получаю") >= 0) { return scrBlockById("broadcast"); }
    if (t.indexOf("отображать переменную") >= 0) { return scrBlockById("set"); }
    /* Управление/Восприятие */
    if (t.indexOf("спросить") >= 0 || t.indexOf("ask ") >= 0 || t.indexOf("ask_") >= 0) { return scrBlockById("ask"); }
    if (t.indexOf("повторять всегда") >= 0 || t.indexOf("forever") >= 0) { return scrBlockById("forever"); }
    if (t.indexOf("повторить") >= 0 || t.indexOf("repeat") >= 0) { return scrBlockById("repeat"); }
    if (t.indexOf("остановить всё") >= 0 || t.indexOf("stop all") >= 0 || t.indexOf("остановить") >= 0) { return scrBlockById("stop"); }
    if (t.indexOf("ждать") >= 0 || t.indexOf("wait") >= 0) { return scrBlockById("wait"); }
    if (t.indexOf("касается") >= 0 || t.indexOf("touching") >= 0) { return scrBlockById("touch"); }
    if (t.indexOf("если") >= 0 || t.indexOf("if ") >= 0 || t.indexOf("if_") >= 0) { return scrBlockById("if"); }
    /* Переменные */
    if (t.indexOf("добавить") >= 0 || t.indexOf("add ") >= 0 || t.indexOf("в список") >= 0) { return scrBlockById("listadd"); }
    if (t.indexOf("удалить") >= 0 || t.indexOf("delete") >= 0 || t.indexOf("of ") >= 0) { return scrBlockById("listdel"); }
    if (t.indexOf("установить") >= 0 || t.indexOf("set ") >= 0 || t.indexOf("set_") >= 0) { return scrBlockById("set"); }
    if (t.indexOf("изменить") >= 0 || t.indexOf("change ") >= 0 || t.indexOf("change_") >= 0) { return scrBlockById("change"); }
    /* Операторы */
    if (t.indexOf("соединить") >= 0 || t.indexOf("join") >= 0 || t.indexOf(" mod ") >= 0) { return scrBlockById("join"); }
    /* Внешность/Движение/Звук */
    if (t.indexOf("сменить фон") >= 0 || t.indexOf("backdrop") >= 0 || t.indexOf("фон на") >= 0) { return scrBlockById("backdrop"); }
    if (t.indexOf("костюм") >= 0 || t.indexOf("costume") >= 0) { return scrBlockById("costume"); }
    if (t.indexOf("подумать") >= 0 || t.indexOf("think") >= 0) { return scrBlockById("think"); }
    if (t.indexOf("играть звук") >= 0 || t.indexOf("play sound") >= 0 || t.indexOf("звук") >= 0) { return scrBlockById("sound"); }
    if (t.indexOf("идти") >= 0 || t.indexOf("move ") >= 0 || t.indexOf("move_") >= 0) { return scrBlockById("move"); }
    if (t.indexOf("сказать") >= 0 || t.indexOf("say") >= 0) { return scrBlockById("say"); }
    /* x = ответ */
    if (t.indexOf("ответ") >= 0 || t.indexOf("answer") >= 0) { return scrBlockById("ask"); }
    return null;
  }

  /* Прогресс-заполнение Scratch-задачи: блоки из solution с ключами из state. */
  function scrTaskBlocks() {
    if (!state.task) { return []; }
    return scrParseSolution(state.task.solution || state.task.hint || "");
  }

  /* Проверка: correct является ПОДПОСЛЕДОВАТЕЛЬНОСТЬЮ user (сравнение по типам блоков,
     значения параметров не важны). Так же как в Scratch: лишние блоки допустимы,
     главное — правильные типы в правильном порядке. */
  function scrIsSubseq(correct, user) {
    var j = 0, i;
    for (i = 0; i < user.length && j < correct.length; i++) {
      if (user[i] === correct[j]) { j++; }
    }
    return j >= correct.length;
  }

  function scrCheckSolution(userIds) {
    var correct = scrTaskBlocks().map(function (b) { return b.id; });
    var comp = scrCompareSeq(userIds);
    var good = correct.length > 0 && scrIsSubseq(correct, comp);
    return { good: good, matches: good ? correct.length : scrPrefix(correct, comp), total: correct.length };
  }

  function scrPrefix(correct, comp) {
    var n = 0, i;
    for (i = 0; i < comp.length && i < correct.length; i++) {
      if (comp[i] === correct[i]) { n++; } else { break; }
    }
    return n;
  }

  /* Сжимает id-цепочку: удаляет блок "?". Если юзер собрал не тот тип в начале,
     вернём самые релевантные по позиции. */
  function scrCompareSeq(ids) {
    var i, sub = [];
    for (i = 0; i < ids.length; i++) {
      if (ids[i] && ids[i] !== "?") { sub.push(ids[i]); }
    }
    return sub;
  }

  /* HTML палитры блоков Scratch для редактора: длинная колонка, как в Scratch. */
  function scrPaletteHtml() {
    var cats = [], i, b, cat, html = "";
    for (i = 0; i < SCR_BLOCKS.length; i++) {
      b = SCR_BLOCKS[i];
      if (cats.indexOf(b.cat) < 0) { cats.push(b.cat); }
    }
    var c, j;
    for (c = 0; c < cats.length; c++) {
      html += '<div class="scr-catlabel">' + esc(cats[c]) + '</div>';
      html += '<div class="scr-pal-col">';
      for (j = 0; j < SCR_BLOCKS.length; j++) {
        b = SCR_BLOCKS[j];
        if (b.cat === cats[c]) {
          var label = lang() === "ru" ? b.labelRu : b.labelEn;
          label = String(label).replace(/\[\[(\w+)\]\]/g, function () { return "…"; });
          html += '<button class="scr-block scr-pal-btn" data-scr-palette-item="' + esc(b.id) + '" style="background:' +
            (b.color || "#7c6cf0") + ';color:#0b1020;border:0;border-radius:12px;padding:8px 12px;margin:3px 0;' +
            'display:block;width:100%;text-align:left;font-weight:600;cursor:pointer;font-size:13px;' +
            'box-shadow:0 2px 6px rgba(0,0,0,.35);border-bottom:3px solid rgba(0,0,0,.25)">' + label + '</button>';
        }
      }
      html += '</div>';
    }
    return html;
  }

  /* HTML области сборки (стек блоков юзера) с редактируемыми значениями. */
  function scrStackHtml(tasks) {
    var html = "", i, b, task, pad = 8;
    if (!tasks.length) {
      html = '<div class="muted" style="padding:10px 2px;font-size:13px">' + esc(l("scrEmpty")) + '</div>';
    }
    for (i = 0; i < tasks.length; i++) {
      task = tasks[i];
      b = scrBlockById(task.id);
      if (!b) { continue; }
      html += '<div class="scr-row" data-row="' + i + '" style="display:flex;align-items:center;gap:6px;margin:4px 0;flex-wrap:wrap;padding-left:' + pad + 'px">';
      if (i > 0) {
        html += '<button class="btn small ghost" data-scr-moveup="' + i + '" title="↑">↑</button>';
      }
      if (i < tasks.length - 1 && tasks.length > 1) {
        html += '<button class="btn small ghost" data-scr-move="' + i + '" title="↓">↓</button>';
      }
      var params = b.val ? String(b.val).split("|") : [];
      var label = lang() === "ru" ? b.labelRu : b.labelEn;
      label = String(label).replace(/\[\[(\w+)\]\]/g, function (m, key) {
        var idx = params.indexOf(key);
        if (idx < 0) { return "—"; }
        var v = task.vals && task.vals[key] != null ? task.vals[key] : "";
        return '<input class="scr-val" data-scr-val="' + esc(key) + '" data-scr-index="' + i + '" value="' + esc(v) + '"' +
          ' style="width:56px;background:rgba(255,255,255,.25);border:1px solid rgba(11,16,32,.3);border-radius:8px;padding:3px 6px;font:inherit;color:#0b1020" />';
      });
      html += '<span class="scr-block" style="background:' + (b.color || "#7c6cf0") + ';color:#0b1020;' +
        'border-radius:14px;padding:8px 14px;display:inline-block;font-weight:600;font-size:13px;' +
        'box-shadow:0 2px 6px rgba(0,0,0,.35);border-bottom:3px solid rgba(0,0,0,.25)">' + label + '</span>';
      html += '<button class="btn small ghost" data-scr-del="' + i + '">✕</button></div>';
      pad += 10;
    }
    return html;
  }

  function pickHint(task) {
    var t = task || state.task;
    if (!t) { return ""; }
    return lang() === "ru" ? (t.hintRu || "") : (t.hintEn || t.hintRu || "");
  }

  function pickDesc(task) {
    var t = task || state.task;
    if (!t) { return ""; }
    return lang() === "ru" ? (t.descRu || "") : (t.descEn || t.descRu || "");
  }

  function renderTrainPick() {
    var packs = getMyPacks();
    var p = getProgress();
    var html = crumbs([l("navTrain")]);
    html += '<h1 class="page-title">🎯 ' + esc(l("navTrain")) + '</h1>';
    html += '<p class="page-sub">' + esc(l("pickTopic")) + '</p>';
    var pi, ti, pk, tpc, tpn, cur, solved;
    for (pi = 0; pi < packs.length; pi++) {
      pk = packs[pi];
      html += '<h3 style="margin:14px 0 8px;color:var(--text)">' + esc(pk.logo || "") + ' ' + esc(pk.monoName || pk.id) + '</h3>';
      html += '<div class="topic-row">';
      for (ti = 0; ti < pk.topics.length; ti++) {
        tpc = pk.topics[ti];
        tpn = tpc.name && tpc.name[lang()] != null ? tpc.name[lang()] : (tpc.name && tpc.name.ru);
        cur = p[tpc.key];
        solved = cur && cur.solved ? cur.solved : 0;
        html += '<button class="topic-btn" data-topic="' + esc(tpc.key) + '" data-pack="' + esc(pk.id) + '">' +
          '<span><b>' + esc(tpn || tpc.key) + '</b><br><span style="color:var(--muted);font-size:12px">' +
          esc(l("topicLevel")) + ' ' + tpc.level + ' · ' + solved + ' ' + esc(l("solved")) + '</span></span>' +
          '<span style="font-size:20px">→</span></button>';
      }
      html += '</div>';
    }
    if (view) { view.innerHTML = html; }
  }

  function renderTrain() {
    if (!state.topic || !state.task) { renderTrainPick(); return; }
    var pack = getPack(state.packId);
    var tName = state.topic.name && state.topic.name[lang()] != null ? state.topic.name[lang()] : (state.topic.name && state.topic.name.ru);
    var hint = pickHint(state.task);
    var starter = pickStarter(state.task);
    var html = crumbs([l("navTrain"), (pack ? pack.monoName : ""), tName]);
    html += '<h1 class="page-title">' + esc(state.task.title || "") + '</h1>';
    html += '<p class="page-sub">' + esc(l("topicLevel")) + ' ' + state.level + '</p>';
    html += '<div class="card">';
    html += '<p>' + esc(pickDesc(state.task)) + '</p>';
html += '<div class="btn-row">';
    html += '<button class="btn" data-toggle-hint="1">' + (state.hintOpen ? esc(l("hide")) : esc(l("hint"))) + '</button>';
    html += '<button class="btn" data-show-sol="1">' + esc(l("solution")) + '</button>';
    html += '</div>';
    if (state.hintOpen && hint) {
      html += '<div class="out expected" style="margin-top:10px">' + esc(hint) + '</div>';
    }
    html += '</div>';
    var isScr = pack && pack.id === "scratch";
    if (isScr) {
      html += scrEditorHtml(starter);
    } else {
      html += '<div class="editor">';
      html += '<div class="editor-head"><span class="editor-title">' + esc((pack ? pack.monoName : "") + " · " + (tName || "")) + '</span>' +
        '<span class="editor-actions"><button class="btn small ghost" data-hint-inline="1">' + esc(l("hint")) + '</button></span></div>';
      html += '<textarea class="code" id="codeArea" spellcheck="false">' + esc(starter) + '</textarea>';
      html += '</div>';
      html += '<div class="run-bar">';
      html += '<button class="run-btn" data-run="1">▶ ' + esc(l("run")) + '</button>';
      html += '<button class="btn primary" data-check="1">✅ ' + esc(l("check")) + '</button>';
      html += '<button class="btn" data-newtask="1">🔄 ' + esc(l("newTask")) + '</button>';
      html += '</div>';
    }
    html += '<div id="outBox"><div class="out">' + esc(l("noOut")) + '</div></div>';
    if (view) { view.innerHTML = html; }
    if (isScr) { scrStageApply(); }
  }

  function scrEditorHtml(starter) {
    var html = "";
    html += '<div class="editor">';
    html += '<div class="editor-head"><span class="editor-title">🧩 ' + esc(l("algoScratch")) + '</span>' +
      '<span class="editor-actions"><button class="btn small ghost" data-hint-inline="1">' + esc(l("hint")) + '</button></span></div>';
    html += '<div class="scr-work">';
    html += '<div class="scr-sidecol">';
    html += '<div class="scr-palette" data-scr-palette="1">' + scrPaletteHtml() + '</div>';
    html += '</div>';
    html += '<div class="scr-main">';
    html += '<div class="scr-tools">';
    html += '<button class="btn primary" data-scr-run="1">▶ ' + esc(l("scrRunStage")) + '</button>';
    html += '<button class="btn small ghost" data-scr-stop="1">⏹ ' + esc(l("scrStopStage")) + '</button>';
    html += '</div>';
    html += '<div class="scr-stagecol">' + scrStageHtml() + '</div>';
    html += '<div class="alert info" style="margin:6px 0">' + esc(l("scrTapHint")) + '</div>';
    html += '<div class="scr-stack" data-scr-stack="1">' + scrStackHtml(state.scrStack || []) + '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="run-bar">';
    html += '<button class="btn primary" data-scr-clear="1">🗑 ' + esc(l("scrClear")) + '</button>';
    html += '<button class="btn primary" data-scr-check="1">✅ ' + esc(l("check")) + '</button>';
    html += '<button class="btn" data-newtask="1">🔄 ' + esc(l("newTask")) + '</button>';
    html += '</div>';
    return html;
  }

  function renderAlgorithms() {
    var pack = getPack(state.algoPackId);
    if (!pack) {
      /* Список моих курсов */
      var packs = getMyPacks();
      var html = crumbs([l("algoNav")]);
      html += '<h1 class="page-title">🧭 ' + esc(l("algoTitle")) + '</h1>';
      html += '<p class="page-sub">' + esc(l("algoSub")) + '</p>';
      if (!packs.length) {
        html += '<div class="alert info">' + esc(l("accountNoCourses")) + '</div>';
      } else {
        html += '<div class="btn-row">';
        var i, pk;
        for (i = 0; i < packs.length; i++) {
          pk = packs[i];
          html += '<button class="chip" data-algo-pack="' + esc(pk.id) + '">' + esc(pk.monoName || pk.id) + '</button>';
        }
        html += '</div>';
      }
      if (view) { view.innerHTML = html; }
      return;
    }
    /* Внутри курса: список тем → алгоритм выбранной темы */
    var topics = (pack.topics || []).slice();
    var tpc = null, j, k;
    if (state.algoTopicKey) {
      for (j = 0; j < topics.length; j++) {
        if (topics[j].key === state.algoTopicKey) { tpc = topics[j]; }
      }
    } else if (topics.length) {
      state.algoTopicKey = topics[0].key;
      tpc = topics[0];
    }
    var crumbsH = [l("algoNav")];
    if (!tpc) {
      var html2 = crumbs(crumbsH);
      html2 += '<h1 class="page-title">🧭 ' + esc(l("algoTitle")) + '</h1>';
      html2 += '<p class="page-sub">' + esc(l("algoChooseTopic")) + '</p>';
      html2 += '<div class="btn-row">';
      for (j = 0; j < topics.length; j++) {
        k = topics[j];
        html2 += '<button class="chip" data-algo-topic="' + esc(k.key) + '">' + esc(k.name && k.name[lang()] != null ? k.name[lang()] : (k.name && k.name.ru || k.key)) + '</button>';
      }
      html2 += '</div>';
      if (view) { view.innerHTML = html2; }
      return;
    }
    crumbsH.push(pack.monoName);
    var algoHtml = crumbs(crumbsH);
    algoHtml += '<h1 class="page-title">🧭 ' + esc(l("algoTitle")) + '</h1>';
    algoHtml += '<div class="btn-row">';
    for (j = 0; j < topics.length; j++) {
      k = topics[j];
      var on = k.key === state.algoTopicKey ? ' class="chip ok"' : ' class="chip"';
      algoHtml += '<button' + on + ' data-algo-topic="' + esc(k.key) + '">' + esc(k.name && k.name[lang()] != null ? k.name[lang()] : (k.name && k.name.ru || k.key)) + '</button>';
    }
    algoHtml += '</div>';
    algoHtml += '<p class="page-sub" style="margin-top:10px">' + esc(pack.id === "scratch" ? l("algoScratch") : l("algoSteps")) + '</p>';

    /* Формируем алгоритм: детерминированный вызов gen темы (seed=1). */
    var det = null, alg = [], a, b;
    if (typeof tpc.gen === "function") {
      try {
        det = tpc.gen(makeRng(1), tpc.level || 1);
      } catch (e) { det = null; }
    }
    if (det) {
      alg = scrParseSolution(det.solution || det.hint || "");
    }
    if (!alg.length) {
      /* Показываем описательную схему из темы */
      var vals = tpc.name && tpc.name[lang()] != null ? tpc.name[lang()] : (tpc.name && tpc.name.ru || tpc.key);
      alg = [ { id: "?", text: String(vals) } ];
    }
    algoHtml += '<div class="card" style="margin-top:12px">';
    algoHtml += '<div class="page-sub" style="margin:0 0 8px">' + esc(l("algoFlow")) + '</div>';
    var a, b;
    for (a = 0; a < alg.length; a++) {
      b = scrBlockById(alg[a].id);
      algoHtml += '<div style="display:flex;align-items:center;gap:8px;margin:6px 0">';
      algoHtml += '<span class="step-num">' + (a + 1) + '</span>';
      algoHtml += scrBlockHtml(b || { id: "?", cat: "Внешность", color: "#8888aa", labelRu: alg[a].text, labelEn: alg[a].text, val: "" });
      algoHtml += '</div>';
    }
    algoHtml += '</div>';
    if (view) { view.innerHTML = algoHtml; }
  }

  function renderSandbox() {
    if (!state.sandboxLang) {
      state.sandboxLang = state.packId || (packs.length ? packs[0].id : "python");
    }
    var html = crumbs([l("navPlayground")]);
    html += '<h1 class="page-title">🧪 ' + esc(l("navPlayground")) + '</h1>';
    html += '<div class="btn-row">';
    var i, pk;
    for (i = 0; i < packs.length; i++) {
      pk = packs[i];
      var on = pk.id === state.sandboxLang ? ' class="chip ok"' : ' class="chip"';
      html += '<button' + on + ' data-sandbox-lang="' + esc(pk.id) + '">' + esc(pk.logo || "") + ' ' + esc(pk.monoName || pk.id) + '</button>';
    }
    html += '</div>';
    html += '<div class="editor" style="margin-top:14px">';
    html += '<div class="editor-head"><span class="editor-title">' + esc(l("navPlayground")) + '</span></div>';
    html += '<textarea class="code" id="sbArea" spellcheck="false" placeholder="' + esc(l("playPlaceholder")) + '"></textarea>';
    html += '</div>';
    html += '<div class="run-bar"><button class="run-btn" data-sb-run="1">▶ ' + esc(l("run")) + '</button></div>';
    html += '<div id="outBox"><div class="out">' + esc(l("noOut")) + '</div></div>';
    if (view) { view.innerHTML = html; }
  }

  var QUIZ = [
    { q: { ru: "Что выведет print(2 + 3) в Python?", en: "What does print(2 + 3) output in Python?" }, o: ["5", "23", "7", "error"], a: 0 },
    { q: { ru: "Как объявить переменную x со значением 5 в Python?", en: "How to declare a variable x with value 5 in Python?" }, o: ["x = 5", "let x = 5", "int x = 5", "var x = 5"], a: 0 },
    { q: { ru: "Какой тип имеет значение \"hello\" в Python?", en: "What type does the value \"hello\" have in Python?" }, o: ["str", "int", "list", "dict"], a: 0 },
    { q: { ru: "Как вывести текст в консоль в JavaScript?", en: "How to print text to the console in JavaScript?" }, o: ["console.log()", "print()", "echo()", "System.out.println()"], a: 0 },
    { q: { ru: "Как объявить константу со значением 5 в JavaScript?", en: "How to declare a constant with value 5 in JavaScript?" }, o: ["int x = 5;", "const x = 5;", "x = let 5;", "var = 5 x;"], a: 1 },
    { q: { ru: "Что выведет цикл for i in range(3): print(i)?", en: "What does the loop for i in range(3): print(i) output?" }, o: ["0 1 2", "1 2 3", "0 1 2 3", "3 2 1"], a: 0 },
    { q: { ru: "Чему равно [1, 2, 3].length в JavaScript?", en: "What is [1, 2, 3].length in JavaScript?" }, o: ["1", "2", "3", "4"], a: 2 },
    { q: { ru: "Какой тип у значения true в JavaScript?", en: "What is the type of true in JavaScript?" }, o: ["string", "number", "boolean", "object"], a: 2 },
    { q: { ru: "Что вернёт d[\"a\"], если d = {\"a\": 1}?", en: "What does d[\"a\"] return if d = {\"a\": 1}?" }, o: ["1", "an", "error", "None"], a: 0 },
    { q: { ru: "Чему равно 7 // 2 в Python?", en: "What is 7 // 2 in Python?" }, o: ["3", "3.5", "4", "error"], a: 0 }
  ];

  function renderQuiz() {
    var q = state.quiz;
    var html = crumbs([l("navQuiz")]);
    html += '<h1 class="page-title">📝 ' + esc(l("navQuiz")) + '</h1>';
    if (q.done) {
      var g = q.score, n = 5, pct = Math.round((g / n) * 100);
      html += '<div class="card"><h2>' + esc(l("quizResult").split("{g}").join(g).split("{n}").join(n).split("{pct}").join(pct)) + '</h2>';
      html += '<button class="btn primary" data-quiz-restart="1">' + esc(l("quizAgain")) + '</button></div>';
      if (view) { view.innerHTML = html; }
      return;
    }
    if (!q.started) {
      html += '<div class="card"><h2>' + esc(l("quizBegin")) + '</h2>';
      html += '<button class="btn primary" data-quiz-start="1">' + esc(l("quizStart")) + '</button></div>';
      if (view) { view.innerHTML = html; }
      return;
    }
    var qi = QUIZ[q.idx];
    var qText = qi.q[lang()] || qi.q.ru;
    html += '<div class="card">';
    html += '<p class="page-sub">' + (q.idx + 1) + ' / 5</p>';
    html += '<h2>' + esc(qText) + '</h2>';
    html += '<div class="topic-row" style="margin-top:12px">';
    var i;
    for (i = 0; i < qi.o.length; i++) {
      html += '<button class="topic-btn" data-quiz-opt="' + i + '"><span>' + esc(qi.o[i]) + '</span></button>';
    }
    html += '</div>';
    html += '<div id="quizFeedback" style="margin-top:10px;min-height:24px"></div>';
    html += '<button class="btn primary" id="quizNextBtn" style="display:none" data-quiz-next="1">' + esc(l("quizNext")) + '</button>';
    html += '</div>';
    if (view) { view.innerHTML = html; }
  }

  function renderProgress() {
    var packs = getMyPacks();
    var xp = getXp();
    var p = getProgress();
    var solved = totalSolved(p);
    var totalTopics = 0, i, j, pk, tpc;
    for (i = 0; i < packs.length; i++) {
      totalTopics += packs[i].topics ? packs[i].topics.length : 0;
    }
    var html = crumbs([l("progress")]);
    html += '<h1 class="page-title">📈 ' + esc(l("progress")) + '</h1>';
    html += '<div class="grid3">';
    html += '<div class="stat"><div class="num">' + xp + '</div><div class="lbl">' + esc(l("xp")) + '</div></div>';
    html += '<div class="stat"><div class="num">' + solved + '</div><div class="lbl">' + esc(l("tasksDone")) + '</div></div>';
    html += '<div class="stat"><div class="num">' + totalTopics + '</div><div class="lbl">' + esc(l("pickTopic")) + '</div></div>';
    html += '</div>';
    for (i = 0; i < packs.length; i++) {
      pk = packs[i];
      html += '<h3 style="margin:20px 0 8px">' + esc(pk.logo || "") + ' ' + esc(pk.monoName || pk.id) + '</h3>';
      html += '<div class="grid2">';
      for (j = 0; j < pk.topics.length; j++) {
        tpc = pk.topics[j];
        var tpn = tpc.name && tpc.name[lang()] != null ? tpc.name[lang()] : (tpc.name && tpc.name.ru);
        var cur = p[tpc.key];
        var solveN = cur && cur.solved ? cur.solved : 0;
        var triesN = cur && cur.tries ? cur.tries : 0;
        var bestN = cur && cur.best ? cur.best : 0;
        var streakN = cur ? (cur.streak || 0) : 0;
        var upN = cur ? (cur.levelup || 0) : 0;
        html += '<div class="card">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
          '<b>' + esc(tpn || tpc.key) + '</b><span class="chip">' + esc(l("topicLevel")) + ' ' + tpc.level + '</span></div>' +
          '<div class="row-d" style="margin-top:10px">' +
          '<span class="chip ok">' + solveN + ' ' + esc(l("solved")) + '</span>' +
          '<span class="chip">' + triesN + ' ' + esc(l("tries")) + '</span>' +
          '<span class="chip">' + streakN + ' ' + esc(l("streak")) + '</span></div>' +
          '<div class="row-d" style="margin-top:8px;font-size:12px;color:var(--muted)">' +
          '<span>best: ' + bestN + '</span><span>' + esc(l("best")) + ' ' + upN + '</span></div>' +
          '</div>';
      }
      html += '</div>';
    }
    if (view) { view.innerHTML = html; }
  }

  function renderAccount() {
    var prof = chatProfile();
    var myIds = getUserCourseIds() || [];
    var all = getPacks();
    var byId = {};
    var i, pk;
    for (i = 0; i < all.length; i++) { byId[all[i].id] = all[i]; }
    var xp = 0;
    try { if (T.getXp) { xp = T.getXp() || 0; } } catch (e) {}
    var lvl = "";
    try {
      var ls = window.MENTOR_RANKS && window.MENTOR_RANKS[lang()];
      if (ls && ls.length) {
        var j, cur = ls[0];
        for (j = 0; j < ls.length; j++) { if (xp >= ls[j].min) { cur = ls[j]; } }
        lvl = cur.icon + " " + cur.name;
      }
    } catch (e) {}
    var html = crumbs([l("accountTitle")]);
    html += '<h1 class="page-title">👤 ' + esc(l("accountTitle")) + '</h1>';
    html += '<p class="page-sub">' + esc(l("accountSub")) + '</p>';
    html += '<div class="grid2">';
    html += '<div class="card">';
    html += '<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px">';
    html += '<div><b>' + esc(l("accountName")) + ':</b> ' + esc(prof && prof.name ? prof.name : "—") + '</div>';
    html += '<div><b>' + esc(l("accountGoal")) + ':</b> ' + esc(prof && prof.goalName ? prof.goalName : (prof && prof.goal ? prof.goal : "—")) + '</div>';
    html += '<div><b>' + esc(l("accountPace")) + ':</b> ' + esc((prof && prof.time) || "—") + '</div>';
    html += '<div><b>' + esc(l("accountXp")) + ':</b> ' + xp + '</div>';
    html += '<div><b>' + esc(l("accountLevel")) + ':</b> ' + esc(lvl || "—") + '</div>';
    html += '</div></div>';
    html += '<div class="card">';
    html += '<b>' + esc(l("accountCourses")) + '</b><br>';
    if (myIds.length) {
      var names = [], k;
      for (k = 0; k < myIds.length; k++) {
        var p2 = byId[myIds[k]];
        names.push((p2 && p2.monoName) || myIds[k]);
      }
      html += '<div class="row-d" style="margin-top:8px;flex-wrap:wrap">';
      for (k = 0; k < names.length; k++) {
        html += '<span class="chip ok">' + esc(names[k]) + '</span>';
      }
      html += '</div>';
    } else {
      html += '<p style="color:var(--muted)">' + esc(l("accountNoCourses")) + '</p>';
    }
    html += '</div></div>';
    html += '<div class="card">';
    html += '<h2 style="margin:0 0 4px">➕ ' + esc(l("accountAddCourse")) + '</h2>';
    html += '<p class="page-sub">' + esc(l("accountAddSub")) + '</p>';
    html += '<div class="topic-row" id="courseGrid">';
    for (i = 0; i < all.length; i++) {
      pk = all[i];
      var checked = myIds.length && myIds.indexOf(pk.id) >= 0;
      html += '<label class="topic-btn" style="cursor:pointer;text-align:left;overflow:hidden">' +
        '<input type="checkbox" data-course="' + esc(pk.id) + '"' + (checked ? ' checked' : '') + ' style="width:16px;height:16px;accent-color:#22d3ee">' +
        '<span style="margin-left:6px">' + esc(pk.logo || "💻") + ' <b>' + esc(pk.monoName || pk.id) + '</b></span></label>';
    }
    html += '</div>';
    html += '<div id="accountMsg" style="margin:10px 0;min-height:20px;color:var(--accent2)"></div>';
    html += '<button class="btn primary" data-save-courses="1">💾 ' + esc(l("accountSave")) + '</button>';
    html += '</div>';
    html += '<div class="card">';
    html += '<h2 style="margin:0 0 4px">🧠 ' + esc(l("aiTitle")) + '</h2>';
    html += '<p class="page-sub">' + esc(l("aiSub")) + '</p>';
    var aiC = aiCfg();
    var aiKeyV = (aiC.key || "") + "";
    var aiModelV = (aiC.model || "") + "";
    var aiBaseV = (aiC.base || "") + "";
    html += '<label>' + esc(l("aiKey")) + '<input type="password" id="aiKey" value="' + esc(aiKeyV) + '" placeholder="sk-…" autocomplete="off"></label>';
    html += '<label>' + esc(l("aiModel")) + '<input type="text" id="aiModel" value="' + esc(aiModelV) + '" placeholder="gpt-4o-mini" autocomplete="off"></label>';
    html += '<label>' + esc(l("aiBase")) + '<input type="text" id="aiBase" value="' + esc(aiBaseV) + '" placeholder="https://api.openai.com/v1" autocomplete="off"></label>';
    html += '<div class="btn-row">';
    html += '<button class="btn primary" data-save-ai="1">💾 ' + esc(l("aiSave")) + '</button>';
    html += '<button class="btn" data-ai-test="1">🔌 ' + esc(l("aiTest")) + '</button>';
    html += '</div>';
    html += '<div id="aiMsg" style="margin:8px 0;min-height:20px;color:var(--accent2)"></div>';
    html += '</div>';
    if (view) { view.innerHTML = html; }
  }

  function render() {
    if (!view) { return; }
    switch (state.view) {
      case "home": renderHome(); break;
      case "topics": renderTopics(state.packId); break;
      case "train":
        if (state.topic && state.task) { renderTrain(); } else { renderTrainPick(); }
        break;
      case "sandbox": renderSandbox(); break;
      case "quiz": renderQuiz(); break;
      case "progress": renderProgress(); break;
      case "account": renderAccount(); break;
      case "algo": renderAlgorithms(); break;
      default: renderHome();
    }
    updateProgressMini();
  }

  function go(v, packId, topicKey) {
    state.view = v;
    if (packId) { state.packId = packId; }
    if (topicKey) {
      state.topicKey = topicKey;
      var pack = getPack(state.packId);
      var tpc = findTopic(pack, topicKey);
      if (tpc) {
        state.topic = tpc;
        state.level = tpc.level || 1;
        newTask();
      }
    }
    render();
    closeSidebar();
  }

  function renderNav() {
    var packs = getMyPacks();
    if (!navEl) { return; }
    var html = "";
    html += '<button class="nav-link" data-view="home">🏠 ' + esc(l("navHome")) + '</button>';
    html += '<button class="nav-link" data-view="train">🎯 ' + esc(l("navTrain")) + '</button>';
    html += '<button class="nav-link" data-view="sandbox">🧪 ' + esc(l("navPlayground")) + '</button>';
    html += '<button class="nav-link" data-view="quiz">📝 ' + esc(l("navQuiz")) + '</button>';
    html += '<button class="nav-link" data-view="progress">📈 ' + esc(l("progress")) + '</button>';
    html += '<button class="nav-link" data-view="algo">🧭 ' + esc(l("algoNav")) + '</button>';
    html += '<button class="nav-link" data-view="account">👤 ' + esc(l("navAccount")) + '</button>';
    html += '<div style="margin:10px 12px 2px;font-size:11px;color:var(--muted);letter-spacing:.5px">' + esc(l("languages")) + '</div>';
    var i, pk;
    for (i = 0; i < packs.length; i++) {
      pk = packs[i];
      html += '<button class="nav-link" data-view="topics" data-pack="' + esc(pk.id) + '">' + esc(pk.logo || "💻") + ' ' + esc(pk.monoName || pk.id) + '</button>';
    }
    navEl.innerHTML = html;
    if (brandName) { brandName.textContent = uiDict[lang()] && uiDict[lang()].brand ? uiDict[lang()].brand : "AI Наставник"; }
    if (chatStatus) { chatStatus.textContent = l("chatStatusOn"); }
    renderChatMode();
  }

  function closeSidebar() {
    if (sidebarEl) { sidebarEl.className = sidebarEl.className.replace(" open", ""); }
    hideOverlay();
  }

  function openSidebar() {
    if (sidebarEl) {
      if (sidebarEl.className.indexOf(" open") < 0) { sidebarEl.className += " open"; }
    }
    showOverlay();
  }

  function ensureOverlay() {
    if (state.overlay) { return state.overlay; }
    var o = document.createElement("div");
    o.style.position = "fixed";
    o.style.top = "0";
    o.style.left = "0";
    o.style.right = "0";
    o.style.bottom = "0";
    o.style.background = "rgba(0,0,0,.55)";
    o.style.zIndex = "49";
    o.style.display = "none";
    document.body.appendChild(o);
    state.overlay = o;
    return o;
  }

  function showOverlay() {
    var o = ensureOverlay();
    o.style.display = "block";
  }

  function hideOverlay() {
    if (state.overlay) { state.overlay.style.display = "none"; }
  }

  function toggleChat(open) {
    var isOpen = chatEl ? chatEl.className.indexOf(" open") >= 0 : false;
    var want = typeof open === "boolean" ? open : !isOpen;
    if (!chatEl) { return; }
    if (want) {
      if (chatEl.className.indexOf(" open") < 0) { chatEl.className += " open"; }
    } else {
      chatEl.className = chatEl.className.replace(" open", "");
    }
  }

  function chatAdd(role, text) {
    var m = document.createElement("div");
    m.className = "msg " + role;
    m.textContent = text;
    chatBody.appendChild(m);
    chatBody.scrollTop = chatBody.scrollHeight;
    return m;
  }

  var ERR_TEXT = {
    syntax: { ru: "Ошибка синтаксиса — проверь скобки, кавычки и отступы.", en: "Syntax error — check brackets, quotes and indentation." },
    indent: { ru: "Ошибка отступов: блоки в Python выделяются пробелами.", en: "Indentation error: blocks in Python are defined by spaces." },
    name: { ru: "Имя не найдено: возможно, переменная/функция не определена или опечатка.", en: "Name not found: a variable/function may be undefined or misspelled." },
    type: { ru: "Ошибка типов: операция не подходит для данных этого типа.", en: "Type error: the operation does not fit this data type." },
    value: { ru: "Ошибка значения: аргумент вне допустимого диапазона.", en: "Value error: an argument is out of the range." },
    index: { ru: "Ошибка индекса: обращение к элементу за пределами списка.", en: "Index error: you addressed an item outside the list." },
    key: { ru: "Ошибка ключа: такого ключа нет в словаре.", en: "Key error: no such key in the dictionary." },
    zero: { ru: "Деление на ноль: делитель не должен быть равен 0.", en: "Division by zero: the divisor must not be 0." },
    attr: { ru: "Ошибка атрибута: у объекта нет такого метода/поля.", en: "Attribute error: the object has no such method/field." },
    other: null
  };

  function chatFmt(tpl, map) {
    /* заменяет {ключ} в шаблоне словаря на значения из map */
    return String(tpl || "").replace(/\{(\w+)\}/g, function (m, k) {
      return map && map[k] != null ? String(map[k]) : m;
    });
  }

  function chatProfile() {
    try {
      return (window.Tutor && window.Tutor.store) ? window.Tutor.store.get("regdone", null) : null;
    } catch (e) { return null; }
  }

  function chatRank(xp) {
    try {
      var ranks = window.MENTOR_RANKS && window.MENTOR_RANKS[lang()];
      if (ranks && ranks.length) {
        var i, cur = ranks[0];
        for (i = 0; i < ranks.length; i++) { if (xp >= ranks[i].min) { cur = ranks[i]; } }
        return cur.icon + " " + cur.name;
      }
    } catch (e) {}
    return String(xp) + " XP";
  }

  function chatProgressText() {
    var xp = 0, solved = 0;
    try {
      if (T.getXp) { xp = T.getXp() || 0; }
      var p = T.getProgress ? T.getProgress() : {};
      var k;
      for (k in p) {
        if (p.hasOwnProperty(k) && p[k] && p[k].solved) { solved += p[k].solved; }
      }
    } catch (e) {}
    if (solved === 0) { return l("aiProgressNone"); }
    return chatFmt(l("aiProgress"), { x: xp, n: solved, r: chatRank(xp) });
  }

  function chatNextText() {
    var ids = getUserCourseIds();
    var langs = "";
    if (ids && ids.length) {
      var i, nm;
      for (i = 0; i < ids.length; i++) {
        var pack = getPack(ids[i]);
        nm = pack ? (pack.monoName || pack.id) : ids[i];
        langs += (i ? ", " : "") + nm;
      }
    }
    var packs = getMyPacks();
    if (!langs) { langs = packs.length ? (packs[0].monoName || packs[0].id) : l("navTrain"); }
    return chatFmt(l("aiNext"), { l: langs });
  }

  function chatPlanText() {
    var prof = chatProfile();
    if (!prof) { return chatNextText(); }
    var g = prof.goalName || (prof.goal || "");
    var t = prof.time || 15;
    return chatFmt(l("aiPlan"), { g: g, t: t });
  }

  function kbEntries() {
    /* подстраивает записи AI_DB ({p}, {g}, {t} из профиля) */
    var prof = chatProfile();
    var g = prof && (prof.goalName || prof.goal) ? (prof.goalName || prof.goal) : "...";
    var t = prof && prof.time ? prof.time : 30;
    var db = window.AI_DB || [];
    var i, out = [];
    for (i = 0; i < db.length; i++) {
      out.push({
        k: db[i].k,
        ru: chatFmt(db[i].ru || "", { p: l("navTrain"), g: g, t: t }),
        en: chatFmt(db[i].en || "", { p: l("navTrain"), g: g, t: t }),
        s: db[i].s || ""
      });
    }
    return out;
  }

  /* ---- Обогащённое понимание реплик: нормализация, лёгкий стемминг, синонимы ---- */
  var KB_STOP = ("и в на с со по к у из для что это как есть нет так или но а то же бы вот " +
    "если же а бы не ни при через без до после над под про за да же мне меня мой моя моё " +
    "был была было быть будет the a an of to in on is are and or for with what how why " +
    "can i you it that this be do does did").split(" ");

  function kbTokens(s) {
    var raw = String(s || "").toLowerCase().split(/[^\wа-яё\+]+/);
    var out = [], i, w;
    for (i = 0; i < raw.length; i++) {
      w = raw[i].trim();
      if (w.length < 3) { continue; }
      if (KB_STOP.indexOf(w) >= 0) { continue; }
      out.push(w);
    }
    return out;
  }

  function kbStem(w) {
    /* Лёгкий стеммер: отрезает простые русские/английские окончания. */
    if (/[а-яё]/.test(w)) {
      return w.replace(/(иями|ями|ами|еми|ов|ев|ей|ах|ях|ах|у|ю|а|я|о|е|ы|и|ь|й)$/,"");
    }
    return w.replace(/(ing|tion|ed|es|ly|s)$/,"");
  }

  function kbNorm(s) {
    var t = String(s || "").toLowerCase()
      .replace(/ё/g, "е")
      .replace(/[?!.,;:"'`()+*=\[\]{}<>\\/|]/g, " ")
      .replace(/\s+/g, " ").trim();
    /* Словарь просторечных форм → канонические термины БЗ */
    var sl = {
      "питон": "python", "питоне": "python", "пайтон": "python", "пайтон": "python",
      "скретч": "scratch", "скретче": "scratch", "скарч": "scratch",
      "гит": "git", "гитхаб": "github", "гх": "github",
"дикшнери": "словарь", "дикшн": "словарь", "мапа": "словарь",
      "лист": "список", "листочек": "список", "массив": "список",
      "числа": "число", "цифра": "число", "цифры": "число",
      "ошибочка": "ошибка", "шибка": "ошибка",
      "экрана": "экран", "кнопка": "блок",
      "инт": "int", "инта": "int", "флоат": "float", "флоата": "float",
      "дик": "dict", "словарем": "словарь", "словарём": "словарь"
    };
    var words = t.split(" "), i, w;
    for (i = 0; i < words.length; i++) {
      w = words[i];
      if (sl[w]) { words[i] = sl[w]; }
      else if (sl[w + "ь"]) { words[i] = sl[w + "ь"]; }
    }
    return words.join(" ");
  }

  function kbScore(e, qNorm, qStems) {
    /* Точное совпадение фразы-ключа (подстрока) — главный вес (10);
       пересечение стемов слов — только как вспомогательный (1 за слово). */
    var score = 0, i, j, kw, hits;
    var kText = "";
    for (i = 0; i < e.k.length; i++) {
      kw = e.k[i] ? kbNorm(e.k[i]) : "";
      if (!kw) { continue; }
      kText += " " + kw;
      if (kw.length >= 3 && qNorm.indexOf(kw) >= 0) {
        score += 10;
      }
    }
    /* пересечение значимых стемов (совпадение префиксов в любую сторону) */
    hits = 0;
    var kStems = kbTokens(kText);
    for (i = 0; i < qStems.length; i++) {
      for (j = 0; j < kStems.length; j++) {
        var qs = qStems[i], ks = kStems[j];
        if (qs === ks ||
            (qs.length >= 4 && ks.length >= 4 && (qs.indexOf(ks) === 0 || ks.indexOf(qs) === 0))) {
          hits++;
          break;
        }
      }
    }
    return score + hits;
  }

  function kbAnswer(m) {
    var entries = kbEntries();
    var qNorm = kbNorm(m);
    var qToks = kbTokens(qNorm);
    var qStems = [], i, wi;
    for (wi = 0; wi < qToks.length; wi++) { qStems.push(kbStem(qToks[wi])); }

    var best = null, bestScore = 0, bestSpec = 0, e, sc, spec, j2;
    for (i = 0; i < entries.length; i++) {
      e = entries[i];
      sc = kbScore(e, qNorm, qStems);
      spec = 0;
      for (j2 = 0; j2 < e.k.length; j2++) { spec += e.k[j2].length; }
      if (sc > bestScore || (sc === bestScore && sc > 0 && spec > bestSpec)) {
        bestScore = sc;
        bestSpec = spec;
        best = e;
      }
    }
    if (!best || bestScore < 1) { return null; }
    var text = lang() === "ru" ? best.ru : best.en;
    if (best.s) { text += "\n\n📚 " + best.s; }
    return text;
  }

  function isHello(m) {
    return m === "привет" || m === "здравствуй" || m === "здравствуйте" || m === "здарова" ||
      m === "йо" || m === "hello" || m === "hi" || m === "hey" ||
      m.indexOf("приветик") === 0 || m.indexOf("добрый день") === 0 || m.indexOf("добрый вечер") === 0 ||
      m.indexOf("good morning") === 0 || m.indexOf("доброе утро") === 0 || m.indexOf("ку") === 0;
  }

  function chatAnswer(msg) {
    var m = String(msg || "").toLowerCase().replace(/[!?.]+$/, "").trim();
    var isErr = m.indexOf("ошибк") >= 0 || m.indexOf("error") >= 0 || m.indexOf("exception") >= 0 || m.indexOf("fail") >= 0;
    var isWhy = m.indexOf("почем") >= 0 || m.indexOf("why") >= 0 || m.indexOf("зачем") >= 0;
    var isHow = m.indexOf("как") >= 0 || m.indexOf("how") >= 0 || m.indexOf("подскаж") >= 0 || m.indexOf("hint") >= 0;
    var isThanks = m.indexOf("спасибо") >= 0 || m.indexOf("спс") >= 0 || m.indexOf("благодар") >= 0 || m.indexOf("thanks") >= 0 || m.indexOf("thank you") >= 0 || m.indexOf("thx") >= 0;
    var isWho = m.indexOf("кто ты") >= 0 || m.indexOf("ты кто") >= 0 || m.indexOf("что ты такое") >= 0 || m === "кто вы";
    var isHelp = m.indexOf("помощь") >= 0 || m === "help" || m === "хелп" || m.indexOf("что ты умеешь") >= 0 || m.indexOf("что умеешь") >= 0 || m.indexOf("как пользоваться") >= 0;
    var isMorale = m.indexOf("не получается") >= 0 || m.indexOf("сложно") >= 0 || m.indexOf("не могу") >= 0 || m.indexOf("трудно") >= 0 || m.indexOf("мотивац") >= 0 || m.indexOf("устал") >= 0 || m.indexOf("бросить") >= 0 || m.indexOf("сдаюсь") >= 0;
    var isProgress = m.indexOf("прогрес") >= 0 || m.indexOf("ранг") >= 0 || m.indexOf("статус") >= 0 || m.indexOf("сколько xp") >= 0 || m.indexOf("какой у меня уровень") >= 0;
    var isNext = m.indexOf("что дальше") >= 0 || m.indexOf("что учить") >= 0 || m.indexOf("какой план") >= 0 || m.indexOf("план обучения") >= 0 || m.indexOf("с чего начать") >= 0 || m.indexOf("что мне делать") >= 0 || m.indexOf("what next") >= 0;
    var isCould = m.indexOf("сможешь") >= 0 || m.indexOf("можешь") >= 0 || m.indexOf("научи") >= 0 || m.indexOf("научишь") >= 0 || m.indexOf("объясни") >= 0;
    var isCoursesQ = m.indexOf("курс") >= 0 || m.indexOf("какие у меня") >= 0 || m.indexOf("мои языки") >= 0 || m.indexOf("мои курсы") >= 0 || m.indexOf("что я изучаю") >= 0 || m.indexOf("my courses") >= 0 || m.indexOf("my languages") >= 0;
    var isTaskQ = m.indexOf("какая задача") >= 0 || m.indexOf("какое задание") >= 0 || m.indexOf("покажи задачу") >= 0 || m.indexOf("следующая задача") >= 0 || m.indexOf("что мне делать") >= 0 && m.indexOf("план") < 0;
    var isAddCourse = m.indexOf("добавить курс") >= 0 || m.indexOf("добавить язык") >= 0 || m.indexOf("как добавить") >= 0 && m.indexOf("курс") >= 0 || m.indexOf("add course") >= 0 || m.indexOf("add a language") >= 0;

    if (isErr) {
      if (state.lastError) {
        var extra = "";
        if (state.lastErrType && ERR_TEXT[state.lastErrType]) {
          extra = ERR_TEXT[state.lastErrType][lang()];
        }
        var tail = state.lastError;
        if (tail.length > 300) { tail = tail.slice(0, 300) + "…"; }
        var head = l("runFailed") + ":";
        return head + " \n" + tail + (extra ? "\n\n💡 " + extra : "");
      }
      return l("errNone");
    }
    if (isThanks) {
      return l("aiThanks");
    }
    if (isMorale) {
      return l("aiMotivate");
    }
    if (isWho) {
      return l("aiWho");
    }
    if (isHelp) {
      return l("aiHelp");
    }
    if (isProgress) {
      return chatProgressText();
    }
    if (isCoursesQ) {
      var myIds = getUserCourseIds();
      var myNames = [];
      if (myIds && myIds.length) {
        var ci;
        for (ci = 0; ci < myIds.length; ci++) {
          var cp = getPack(myIds[ci]);
          myNames.push(cp ? (cp.monoName || cp.id) : myIds[ci]);
        }
      }
      if (myNames.length) { return chatFmt(l("aiCourses"), { l: myNames.join(", ") }); }
      return l("aiCoursesEmpty");
    }
    if (isTaskQ) {
      var cur = state.task;
      if (cur && cur.title) { return chatFmt(l("aiTaskNow"), { t: cur.title }); }
      return l("aiNextTask");
    }
    if (isAddCourse) {
      return l("aiAddCourse");
    }
    if (isNext) {
      return chatNextText();
    }
    if (isHello(m)) {
      var pname = "";
      var prof = chatProfile();
      if (prof && prof.name) { pname = prof.name; }
      return pname ? chatFmt(l("aiGreet"), { n: pname }) : l("chatWelcome");
    }
    if (isCould) {
      return chatPlanText();
    }
    if (isHow) {
      if (state.task) {
        var hint = pickHint(state.task);
        if (hint) { return "💡 " + hint; }
      }
    }
    var kb = kbAnswer(m);
    if (kb) { return kb; }
    if (isWhy) {
      return l("whyTopic");
    }
    return l("advice");
  }

  function aiCfg() {
    /* Настройки онлайн-ИИ из локального хранилища: {key, base, model}. */
    var cfg = null;
    try { cfg = window.Tutor.store.get("aiCfg", null); } catch (e2) { cfg = null; }
    if (cfg && typeof cfg === "object") { return cfg; }
    return {};
  }

  function aiSaveCfg(key, base, model) {
    try {
      window.Tutor.store.set("aiCfg", { key: key || "", base: base || "", model: model || "" });
    } catch (e2) {}
  }

  function aiHasKey() {
    return !!(aiCfg().key || "").trim();
  }

  /* Запрос к OpenAI-совместимому API; Promise со строкой ответа или null при сбое. */
  function aiRemote(text) {
    var cfg = aiCfg();
    var base = (cfg.base || "").trim() || "https://api.openai.com/v1";
    var model = (cfg.model || "").trim();
    var key = (cfg.key || "").trim();
    var url = base.replace(/\/+$/, "") + "/chat/completions";
    if (!key) { return Promise.resolve(null); }
    var system = lang() === "ru"
      ? "Ты — дружелюбный ИИ-наставник, который помогает новичку учиться программированию. Отвечай кратко и по-русски, давай конкретные советы и подсказки, поддерживай."
      : "You are a friendly AI mentor helping a beginner learn programming. Answer briefly in English, give concrete advice and hints, be encouraging.";
    var body = {
      model: model || "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: text }
      ],
      temperature: 0.6
    };
    return new Promise(function (resolve) {
      var settled = false;
      var t = window.setTimeout(function () {
        settled = true;
        resolve(null);
      }, 20000);
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
        body: JSON.stringify(body)
      }).then(function (r) {
        if (settled) { return; }
        return r.json();
      }).then(function (data) {
        if (settled) { return; }
        window.clearTimeout(t);
        settled = true;
        try {
          var msgTxt = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
          resolve(msgTxt ? String(msgTxt).trim() : null);
        } catch (e3) { resolve(null); }
      }).catch(function () {
        if (settled) { return; }
        window.clearTimeout(t);
        settled = true;
        resolve(null);
      });
    });
  }

  function chatAsk(text) {
    if (!text || !text.replace(/\s/g, "").length) { return; }
    chatAdd("user", text);
    chatInput.value = "";
    if (state.chatMode === "online" && aiHasKey()) {
      var ph = chatAdd("ai", "🤖 " + l("aiThinking"));
      aiRemote(text).then(function (out) {
        if (ph && ph.parentNode) {
          ph.textContent = out && out.length ? out : chatAnswer(text);
        } else {
          chatAdd("ai", out && out.length ? out : chatAnswer(text));
        }
        chatBody.scrollTop = chatBody.scrollHeight;
      });
      return;
    }
    chatAdd("ai", chatAnswer(text));
  }

  function renderChips() {
    if (!chatNote) { return; }
    var chips = [
      { q: l("chipErr"), a: "Что за ошибка?" },
      { q: l("chipHow"), a: "Как решить задачу?" },
      { q: l("chipWhy"), a: "Почему так вышло?" },
      { q: l("chipHint"), a: "Дай подсказку" },
      { q: l("chipProgress"), a: "Мой прогресс" },
      { q: l("chipPlan"), a: "Что дальше?" },
      { q: l("chipCourses"), a: "Какие у меня курсы?" }
    ];
    var html = "";
    var i;
    for (i = 0; i < chips.length; i++) {
      html += '<button class="chip" data-chip-ask="1">' + esc(chips[i].a) + '</button> ';
    }
    chatNote.innerHTML = html;
  }

  function bootChat() {
    toggleChat(false);
    renderChatMode();
    chatBody.innerHTML = "";
    if (state.chatMode === "online") {
      chatAdd("ai", personalize(l("chatWelcome")) + (aiHasKey() ? "" : "\n" + l("chatNoKey")));
    } else {
      chatAdd("ai", personalize(l("chatWelcome")));
    }
    renderChips();
  }

  function renderChatMode() {
    if (!chatStatus) { return; }
    var online = state.chatMode === "online";
    chatStatus.className = online ? "chat-st online" : "chat-st local";
    chatStatus.textContent = online ? l("chatOnline") : l("chatLocal");
    var modes = document.querySelectorAll(".chat-modes .chip");
    var i;
    for (i = 0; i < modes.length; i++) {
      var on = modes[i].getAttribute("data-chat-mode") === state.chatMode;
      modes[i].className = "chip" + (on ? " active" : "");
    }
  }

  function onReady() {
    if (state.sandboxLang === null) {
      state.sandboxLang = getPacks().length ? getPacks()[0].id : "python";
      if (state.packId === null) { state.packId = state.sandboxLang; }
    }
    renderNav();
    render();
    bootChat();
  }

  function waitContent(n) {
    if (getPacks().length) { onReady(); return; }
    var t = n == null ? 0 : n;
    renderLoading(t + 1);
    if (t >= BOOT_ATTEMPTS) { renderNotReady(); return; }
    setTimeout(function () { waitContent(t + 1); }, BOOT_INTERVAL);
  }

  function closestAttr(el, attr) {
    while (el && el.getAttribute) {
      var v = el.getAttribute(attr);
      if (v !== null) { return v; }
      el = el.parentNode;
    }
    return null;
  }

  function bindStatic() {
    if (navEl) {
      navEl.addEventListener("click", function (e) {
        var v = closestAttr(e.target, "data-view");
        var pk = closestAttr(e.target, "data-pack");
        if (v) {
          if (v === "train") { state.topic = null; state.task = null; }
          go(v, pk || undefined, undefined);
        }
      });
    }
    if (view) {
      view.addEventListener("input", function (e) {
        var idx = closestAttr(e.target, "data-scr-index");
        if (idx !== null && state.scrStack) {
          var key = e.target.getAttribute("data-scr-val");
          var n = parseInt(idx, 10);
          if (!isNaN(n) && n >= 0 && n < state.scrStack.length && key) {
            if (!state.scrStack[n].vals) { state.scrStack[n].vals = {}; }
            state.scrStack[n].vals[key] = e.target.value;
            return;
          }
        }
      });
    }
    if (burgerEl) {
      burgerEl.addEventListener("click", function () {
        if (sidebarEl && sidebarEl.className.indexOf(" open") >= 0) { closeSidebar(); } else { openSidebar(); }
      });
    }
    var ov = ensureOverlay();
    ov.addEventListener("click", closeSidebar);
    if (langSwitchEl) {
      langSwitchEl.addEventListener("click", function (e) {
        var lng = closestAttr(e.target, "data-lang");
        if (!lng) { return; }
        applyLang(lng);
        storeLang();
        renderNav();
        render();
        bootChat();
      });
    }
    if (chatSend) {
      chatSend.addEventListener("click", function () { chatAsk(chatInput.value); });
    }
    if (chatInput) {
      chatInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { chatAsk(chatInput.value); }
      });
    }
    if (chatClose) {
      chatClose.addEventListener("click", function () { toggleChat(false); });
    }
    var chatPanel = document.getElementById("chat");
    if (chatPanel) {
      chatPanel.addEventListener("click", function (e) {
        var cm = closestAttr(e.target, "data-chat-mode");
        if (cm) {
          state.chatMode = cm;
          renderChatMode();
          bootChat();
        }
      });
    }
    if (chatNote) {
      chatNote.addEventListener("click", function (e) {
        var btn = e.target && e.target.getAttribute ? e.target : (e.target && e.target.parentNode);
        if (btn && btn.getAttribute && btn.getAttribute("data-chip-ask")) {
          chatAsk((btn.textContent || "").replace(/\s+/g, " ").trim());
        }
      });
    }
    document.addEventListener("keydown", function (e) {
      state.scrKeys[e.key.toLowerCase()] = true;
    });
    document.addEventListener("keyup", function (e) {
      state.scrKeys[e.key.toLowerCase()] = false;
    });
    var floater = document.createElement("button");
    floater.className = "chat-open-floater";
    floater.innerHTML = "💬";
    floater.style.position = "fixed";
    floater.style.right = "24px";
    floater.style.bottom = "24px";
    floater.style.zIndex = "80";
    document.body.appendChild(floater);
    floater.addEventListener("click", function () { toggleChat(true); });
  }

  function bindView() {
    if (!view) { return; }
    view.addEventListener("click", function (e) {
      var v, pk, tk, sv;
      tk = closestAttr(e.target, "data-topic");
      if (tk) {
        pk = closestAttr(e.target, "data-pack");
        go("train", pk || state.packId, tk);
        return;
      }
      v = closestAttr(e.target, "data-langcard");
      if (v) { go("topics", v); return; }
      v = closestAttr(e.target, "data-view");
      if (v) { go(v); return; }
      if (closestAttr(e.target, "data-run")) { runInEditor(); return; }
      if (closestAttr(e.target, "data-check")) { checkSolution(); return; }
      if (closestAttr(e.target, "data-sb-run")) {
        var tb = document.getElementById("sbArea");
        if (tb) {
          var box = document.getElementById("outBox");
          if (box) { box.innerHTML = '<div class="out">' + esc(l("noOut")) + '</div>'; }
          runCode(tb.value, state.sandboxLang).then(function (out) {
            showOut(out);
          }, function (err) {
            showErr(err);
          });
        }
        return;
      }
      sv = closestAttr(e.target, "data-sandbox-lang");
      if (sv) {
        state.sandboxLang = sv;
        renderSandbox();
        return;
      }
      if (closestAttr(e.target, "data-newtask")) {
        newTask();
        renderTrain();
        return;
      }
      var scrAdd = closestAttr(e.target, "data-scr-palette-item");
      if (scrAdd) {
        state.scrStack.push({ id: scrAdd, vals: {} });
        renderTrain();
        return;
      }
      var scrVal = closestAttr(e.target, "data-scr-val");
      /* заполнение значений обрабатывается отдельным слушателем 'input' */
      var scrDel = closestAttr(e.target, "data-scr-del");
      if (scrDel) {
        state.scrStack.splice(parseInt(scrDel, 10), 1);
        renderTrain();
        return;
      }
      var scrMv = closestAttr(e.target, "data-scr-move");
      if (scrMv) {
        var mi = parseInt(scrMv, 10);
        if (mi < state.scrStack.length - 1) {
          var tmp = state.scrStack[mi];
          state.scrStack[mi] = state.scrStack[mi + 1];
          state.scrStack[mi + 1] = tmp;
        }
        renderTrain();
        return;
      }
      var scrUp = closestAttr(e.target, "data-scr-moveup");
      if (scrUp) {
        var ui = parseInt(scrUp, 10);
        if (ui > 0) {
          var tmp2 = state.scrStack[ui];
          state.scrStack[ui] = state.scrStack[ui - 1];
          state.scrStack[ui - 1] = tmp2;
        }
        renderTrain();
        return;
      }
      if (closestAttr(e.target, "data-scr-clear")) {
        state.scrStack = [];
        renderTrain();
        return;
      }
      if (closestAttr(e.target, "data-scr-check")) {
        checkScrSolution();
        return;
      }
      if (closestAttr(e.target, "data-scr-run")) {
        scrRun();
        return;
      }
      if (closestAttr(e.target, "data-scr-stop")) {
        scrStop();
        return;
      }
      var scrPick = closestAttr(e.target, "data-scr-pick");
      if (scrPick) {
        state.scrPick = state.scrPick === scrPick ? null : scrPick;
        renderTrain();
        return;
      }
      var scrSet = closestAttr(e.target, "data-scr-set");
      if (scrSet) {
        var scrSel = closestAttr(e.target, "data-scr-sel");
        if (scrSet === "sprite") {
          state.scrStage.sprite = scrSel || state.scrStage.sprite;
          state.scrStage.costume = null;
        } else if (scrSet === "costume") {
          scrDrawOpen();
          state.scrPick = null;
          return;
        } else if (scrSet === "backdrop") {
          state.scrStage.backdrop = scrSel || state.scrStage.backdrop;
        } else if (scrSet === "sound") {
          state.scrStage.sound = scrSel || state.scrStage.sound;
        }
        scrSavePrefs();
        state.scrPick = null;
        renderTrain();
        return;
      }
      if (closestAttr(e.target, "data-scr-draw")) {
        scrDrawOpen();
        return;
      }
      var ap = closestAttr(e.target, "data-algo-pack");
      if (ap) {
        state.algoPackId = ap;
        state.algoTopicKey = null;
        state.packId = ap;
        renderAlgorithms();
        return;
      }
      var at = closestAttr(e.target, "data-algo-topic");
      if (at) {
        state.algoTopicKey = at;
        renderAlgorithms();
        return;
      }
      if (closestAttr(e.target, "data-show-sol")) {
        var solBox = document.getElementById("outBox");
        if (solBox) {
          state.solutionOpen = !state.solutionOpen;
          if (state.solutionOpen) {
            var solRaw = pickHint(state.task);
            solBox.innerHTML = '<div class="out expected" style="white-space:pre-wrap"><b>' +
              esc(l("solutionTitle")) + ':</b><br>' + esc(solRaw || l("noSolution")) + '</div>';
          } else {
            solBox.innerHTML = '<div class="out">' + esc(l("noOut")) + '</div>';
          }
        }
        return;
      }
      if (closestAttr(e.target, "data-toggle-hint") || closestAttr(e.target, "data-hint-inline")) {
        var ta0 = document.getElementById("codeArea");
        var kept = ta0 ? ta0.value : null;
        state.hintOpen = !state.hintOpen;
        renderTrain();
        if (kept !== null) {
          var ta1 = document.getElementById("codeArea");
          if (ta1) { ta1.value = kept; }
        }
        return;
      }
      if (closestAttr(e.target, "data-quiz-start")) {
        state.quiz = { started: true, idx: 0, score: 0, done: false };
        renderQuiz();
        return;
      }
      if (closestAttr(e.target, "data-quiz-restart")) {
        state.quiz = { started: false, idx: 0, score: 0, done: false };
        renderQuiz();
        return;
      }
      var opt = closestAttr(e.target, "data-quiz-opt");
      if (opt !== null) {
        var qi = QUIZ[state.quiz.idx];
        var chosen = parseInt(opt, 10);
        var fb = document.getElementById("quizFeedback");
        var nb = document.getElementById("quizNextBtn");
        var eq = qi.a === chosen;
        if (eq) { state.quiz.score++; }
        if (fb) {
          fb.innerHTML = eq
            ? '<span class="chip ok">✅ ' + esc(l("right")) + '</span>'
            : '<span class="chip bad">❌ ' + esc(l("wrong")) + ' · ' + esc(l("expected")) + ': ' + esc(qi.o[qi.a]) + '</span>';
        }
        if (nb) { nb.style.display = "inline-flex"; }
        var btns = view.querySelectorAll("[data-quiz-opt]");
        var i;
        for (i = 0; i < btns.length; i++) { btns[i].disabled = true; }
        return;
      }
      if (closestAttr(e.target, "data-quiz-next")) {
        if (state.quiz.idx >= 4) {
          state.quiz.done = true;
        } else {
          state.quiz.idx++;
        }
        renderQuiz();
        return;
      }
      if (closestAttr(e.target, "data-save-courses")) {
        var boxes = view.querySelectorAll("#courseGrid input[data-course]");
        var i2, ids = [], msg = "" + l("accountEmptySel");
        for (i2 = 0; i2 < boxes.length; i2++) {
          if (boxes[i2].checked) { ids.push(boxes[i2].getAttribute("data-course")); }
        }
        if (ids.length && window.Tutor && window.Tutor.store) {
          window.Tutor.store.set("courses", ids);
          var prof2 = null;
          try { prof2 = window.Tutor.store.get("regdone", null); } catch (e2) {}
          if (prof2 && typeof prof2 === "object") {
            prof2.langs = ids;
            try { window.Tutor.store.set("regdone", prof2); } catch (e3) {}
          }
          msg = l("accountSaved");
          render();
        }
        var am = document.getElementById("accountMsg");
        if (am) { am.textContent = msg; }
        return;
      }
      if (closestAttr(e.target, "data-save-ai")) {
        var ak = document.getElementById("aiKey");
        var am2 = document.getElementById("aiModel");
        var ab = document.getElementById("aiBase");
        aiSaveCfg(ak ? ak.value : "", ab ? ab.value : "", am2 ? am2.value : "");
        if (state.chatMode === "online") { bootChat(); }
        var aiMsg = document.getElementById("aiMsg");
        if (aiMsg) { aiMsg.textContent = l("aiSaved"); }
        return;
      }
      if (closestAttr(e.target, "data-ai-test")) {
        var tk = document.getElementById("aiKey");
        var tb = document.getElementById("aiBase");
        var tm = document.getElementById("aiModel");
        aiSaveCfg(tk ? tk.value : "", tb ? tb.value : "", tm ? tm.value : "");
        var aiMsg2 = document.getElementById("aiMsg");
        if (aiMsg2) { aiMsg2.textContent = "🔌 " + l("aiThinking"); }
        aiRemote("ping").then(function (out) {
          if (!aiMsg2) { return; }
          aiMsg2.textContent = out ? l("aiTestOk") : l("aiTestFail");
        });
        return;
      }
    });
  }

  function init() {
    if (!T || !T.runPython) {
      renderNotReady();
      return;
    }
    scrLoadPrefs();
    bindStatic();
    bindView();
    bootLang();
    storeLang();
    updateProgressMini();
    waitContent(0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();