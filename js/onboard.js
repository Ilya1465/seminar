/* == onboard.js — Агент-C: Неонщик-UI (заставка, онбординг, курсы, ранги, конфетти). == */
(function () {
  "use strict";

  var onb = { step: 1, courses: [], lvl: null, pace: null, lvAnswers: {}, testAnswers: [] };
  var onbV2 = false;
  var tries = 0;

  var DEFAULT_RANKS = [
    { from: 0, name: "Новичок", icon: "🌱" },
    { from: 40, name: "Ученик", icon: "🧭" },
    { from: 120, name: "Кодер", icon: "🔥" },
    { from: 260, name: "Разработчик", icon: "⚙️" },
    { from: 500, name: "Гуру", icon: "👑" }
  ];

  function curLang() {
    var l = null;
    try { l = window.Tutor && window.Tutor.getLang ? window.Tutor.getLang() : null; }
    catch (e) { l = null; }
    return (typeof l === "string" && l.length) ? l : "ru";
  }

  function ranksV2() {
    var R = window.MENTOR_RANKS;
    if (R && !R.length) {
      var g = curLang();
      var arr = R[g] || R.ru || R.en || null;
      if (arr && arr.length) { return arr; }
    }
    return (R && R.length) ? R : DEFAULT_RANKS;
  }

  function rankXP(r) {
    if (r && typeof r.min === "number") { return r.min; }
    if (r && typeof r.from === "number") { return r.from; }
    if (r && typeof r.xp === "number") { return r.xp; }
    return 0;
  }

  function rankFromV2(xp) {
    var rs = ranksV2();
    var cur = rs[0] || { name: "?", icon: "" };
    var idx = 0, from = 0, i, f;
    for (i = 0; i < rs.length; i++) {
      f = rankXP(rs[i]);
      if (xp >= f) { cur = rs[i]; idx = i; from = f; }
    }
    var next = rs[idx + 1] || null;
    var need = next ? rankXP(next) : from;
    var span = need - from;
    var pct = next ? (span > 0 ? Math.max(0, Math.min(100, Math.floor(((xp - from) / span) * 100))) : 0) : 100;
    return {
      name: cur.name || "", icon: cur.icon || "", idx: idx,
      next: next ? (next.name || "") : null,
      need: next ? Math.max(0, need - xp) : 0,
      pct: pct
    };
  }

  function assessOf(langId) {
    var L = window.MENTOR_COURSES, i, c;
    if (!L) { return null; }
    for (i = 0; i < L.length; i++) {
      c = L[i];
      if ((c.id === langId || c.key === langId || c.name === langId || c.title === langId) && c.assessment) {
        return c.assessment;
      }
    }
    return null;
  }

  function startupCourses() {
    var L = window.MENTOR_COURSES, i, c, has = false;
    if (!L || !L.length) { return null; }
    for (i = 0; i < L.length; i++) {
      if (L[i].startup === true || L[i].startup === false) { has = true; break; }
    }
    if (!has) { return null; }
    var out = [];
    for (i = 0; i < L.length; i++) {
      c = L[i];
      if (c.startup === false) { continue; }
      out.push({ id: c.id || c.key || c.name, name: c.name || c.monoName || c.id, icon: c.icon || c.logo || "💻", desc: c.desc || "" });
    }
    return out;
  }

  function mentorApi() {
    var M = window.MentorAuth;
    if (M && typeof M.signup === "function" && typeof M.current === "function" &&
        typeof M.verify === "function" && typeof M.loginPin === "function") {
      return M;
    }
    return null;
  }

  function authOk() {
    var M = mentorApi();
    if (M) { try { return !!M.current(); } catch (e) { return false; } }
    return sget("authed", "") === "local";
  }

  function markAuth(mode) {
    sset("authed", mode || "local");
  }

  function localPin() {
    return sget("authpin", "");
  }

  function tryAdopt(acc) {
    try {
      if (acc && acc.id && window.MentorAuth && typeof window.MentorAuth.adoptProgress === "function" && !sget("adopted", false)) {
        window.MentorAuth.adoptProgress(acc.id);
        sset("adopted", true);
      } else if (acc && acc.id && !sget("adopted", false)) {
        sset("adopted", true);
      }
    } catch (e) {}
  }

  function onbErr(el, txt) {
    if (!el) { return; }
    el.textContent = txt || "";
  }

  function cssDefined(sel) {
    try {
      var ss = document.styleSheets, i, j, r, txt;
      if (!sel) { return false; }
      for (i = 0; i < ss.length; i++) {
        try { r = ss[i].cssRules || ss[i].rules; } catch (e) { r = []; }
        for (j = 0; j < r.length; j++) {
          txt = r[j].selectorText || "";
          if (txt && txt.indexOf(sel) >= 0) { return true; }
        }
      }
    } catch (e) {}
    return false;
  }

  function buildAuth(onDone) {
    var M = mentorApi();
    var overlay = document.createElement("div");
    overlay.className = "auth-overlay";
    var card = document.createElement("div");
    card.className = "auth-card";
    overlay.appendChild(card);
    if (!cssDefined(".auth-card")) {
      var fb = document.createElement("style");
      fb.setAttribute("type", "text/css");
      fb.textContent = ".auth-overlay{position:fixed;inset:0;background:rgba(5,9,18,.94);display:flex;align-items:center;justify-content:center;z-index:300;font:15px/1.5 system-ui,-apple-system,sans-serif;color:#e8eef7}.auth-card{width:min(92vw,360px);background:#0d1117;border:1px solid rgba(39,192,239,.25);border-radius:16px;padding:22px 20px;box-shadow:0 14px 40px rgba(0,0,0,.55)}.auth-title{margin:0 0 12px;font-size:20px;color:#7ee0ff}.auth-sub,.auth-hint{font-size:12px;color:#9fb0c5;margin:0 0 10px}.auth-err{font-size:12px;color:#ff8a8a;min-height:16px;margin:0 0 6px}.auth-input{width:100%;box-sizing:border-box;background:#141a24;color:#e8eef7;border:1px solid #2b3445;border-radius:9px;padding:10px 12px;margin:0 0 10px;font-size:14px}.auth-btn{display:inline-block;background:#0f2a3f;color:#cfe9ff;border:1px solid rgba(39,192,239,.4);border-radius:9px;padding:10px 14px;margin:4px 4px 0 0;font-size:14px;cursor:pointer}.auth-btn.ok{background:#0bd0bd;color:#06211f;font-weight:600}.auth-btn.ghost{background:transparent;border-color:#3a4659;color:#9fb0c5}.auth-tabs{display:flex;gap:6px;margin:0 0 12px}.auth-tab,.auth-tabs .tab{background:#141a24;color:#9fb0c5;border:1px solid #2b3445;border-radius:9px;padding:7px 12px;font-size:13px;cursor:pointer}.auth-tab.sel,.auth-tabs .tab.sel{background:#0f2a3f;color:#7ee0ff;border-color:rgba(39,192,239,.6)}.auth-code{display:flex;gap:6px;justify-content:center;margin:0 0 10px}.auth-code-box{width:36px;height:42px;display:inline-flex;align-items:center;justify-content:center;background:#141a24;border:1px solid #2b3445;border-radius:8px;font-size:18px;color:#7ee0ff}.auth-code-hint{font-size:12px;color:#8a94a6;margin:0 0 8px}";
      card.appendChild(fb);
    }

    var title = document.createElement("h2");
    title.className = "auth-title";
    title.textContent = "AI Наставник";
    card.appendChild(title);

    var err = document.createElement("div");
    err.className = "auth-err";
    card.appendChild(err);

    if (M) {
      var tabs = document.createElement("div");
      tabs.className = "auth-tabs";
      var tbCode = document.createElement("button");
      tbCode.type = "button";
      tbCode.className = "tab sel";
      tbCode.textContent = "Код";
      var tbPin = document.createElement("button");
      tbPin.type = "button";
      tbPin.className = "tab";
      tbPin.textContent = "PIN";
      tabs.appendChild(tbCode);
      tabs.appendChild(tbPin);
      card.appendChild(tabs);

      var paneCode = document.createElement("div");
      paneCode.className = "auth-pane";
      var inp = document.createElement("input");
      inp.className = "auth-input";
      inp.placeholder = "Телефон или почта";
      paneCode.appendChild(inp);
      var getBtn = document.createElement("button");
      getBtn.type = "button";
      getBtn.className = "auth-btn";
      getBtn.textContent = "Получить код";
      paneCode.appendChild(getBtn);
      var boxes = document.createElement("div");
      boxes.className = "auth-code";
      var codeArr = [];
      for (var b = 0; b < 6; b++) {
        (function (bi) {
          var bx = document.createElement("span");
          bx.className = "auth-code-box";
          boxes.appendChild(bx);
          codeArr.push(bx);
        })(b);
      }
      paneCode.appendChild(boxes);
      var hint = document.createElement("div");
      hint.className = "auth-code-hint";
      hint.style.display = "none";
      paneCode.appendChild(hint);
      var okBtn = document.createElement("button");
      okBtn.type = "button";
      okBtn.className = "auth-btn ok";
      okBtn.textContent = "Войти";
      okBtn.disabled = true;
      paneCode.appendChild(okBtn);

      var panePin = document.createElement("div");
      panePin.className = "auth-pane";
      panePin.style.display = "none";
      var pInp = document.createElement("input");
      pInp.className = "auth-input";
      pInp.placeholder = "Логин";
      panePin.appendChild(pInp);
      var pinInp = document.createElement("input");
      pinInp.className = "auth-input";
      pinInp.type = "password";
      pinInp.maxLength = 6;
      pinInp.placeholder = "PIN (4-6 цифр)";
      panePin.appendChild(pinInp);
      var pBtn = document.createElement("button");
      pBtn.type = "button";
      pBtn.className = "auth-btn ok";
      pBtn.textContent = "Войти";
      panePin.appendChild(pBtn);

      card.appendChild(paneCode);
      card.appendChild(panePin);
      var hide = true;
      tbCode.addEventListener("click", function () { tbCode.className = "tab sel"; tbPin.className = "tab"; paneCode.style.display = ""; panePin.style.display = "none"; onbErr(err, ""); });
      tbPin.addEventListener("click", function () { tbPin.className = "tab sel"; tbCode.className = "tab"; panePin.style.display = ""; paneCode.style.display = "none"; onbErr(err, ""); });

      getBtn.addEventListener("click", function () {
        var lg = inp.value.trim();
        if (!lg) { onbErr(err, "Введи телефон или почту"); return; }
        var acc = null;
        try { acc = M.signup(lg, "email"); } catch (e) { onbErr(err, "Не удалось создать код"); return; }
        if (!acc || !acc.code) { onbErr(err, "Движок не вернул код"); return; }
        onbErr(err, "");
        for (var bi = 0; bi < 6 && bi < String(acc.code).length; bi++) {
          if (codeArr[bi]) { codeArr[bi].textContent = String(acc.code).charAt(bi); }
        }
        hint.textContent = "Код сгенерирован офлайн — скопируй его и вставь ниже";
        hint.style.display = "block";
        okBtn.disabled = false;
      });

      okBtn.addEventListener("click", function () {
        var got = [];
        for (var di = 0; di < codeArr.length; di++) { got.push(codeArr[di].textContent || ""); }
        var str = got.join("");
        if (!/^\d{6}$/.test(str)) { onbErr(err, "Заполни 6 цифр кода"); return; }
        var ok = false;
        try { ok = M.verify(inp.value.trim(), "email", str); } catch (e) { onbErr(err, "Ошибка проверки"); return; }
        if (!ok) { onbErr(err, "Код неверный или истёк (окно 5 мин)"); return; }
        var cur = null;
        try { cur = M.current(); } catch (e) {}
        tryAdopt(cur);
        markAuth("mid");
        document.body.removeChild(overlay);
        if (onDone) { onDone(); }
      });

      pBtn.addEventListener("click", function () {
        var lg = pInp.value.trim();
        var pn = pinInp.value;
        if (!lg || !/^\d{4,6}$/.test(pn)) { onbErr(err, "Введи логин и PIN 4-6 цифр"); return; }
        var ok = false;
        try {
          if (M.setPin && typeof M.setPin === "function" && !M.current()) { M.setPin(lg, pn); }
          ok = M.loginPin(lg, pn);
        } catch (e) { ok = false; }
        if (!ok) { onbErr(err, "Неверный логин или PIN"); return; }
        var cur = null;
        try { cur = M.current(); } catch (e) {}
        tryAdopt(cur);
        markAuth("mid");
        document.body.removeChild(overlay);
        if (onDone) { onDone(); }
      });
    } else {
      var pinHint = document.createElement("div");
      pinHint.className = "auth-hint";
      pinHint.textContent = localPin() ? "Добро пожаловать обратно — введи свой PIN" : "Придумай PIN (4-6 цифр) для входа";
      card.appendChild(pinHint);
      var locInp = document.createElement("input");
      locInp.className = "auth-input";
      locInp.type = "password";
      locInp.maxLength = 6;
      locInp.placeholder = "PIN";
      card.appendChild(locInp);
      var locBtn = document.createElement("button");
      locBtn.type = "button";
      locBtn.className = "auth-btn ok";
      locBtn.textContent = "Войти";
      card.appendChild(locBtn);
      locBtn.addEventListener("click", function () {
        var pn = locInp.value;
        if (!/^\d{4,6}$/.test(pn)) { onbErr(err, "PIN: 4-6 цифр"); return; }
        if (localPin()) {
          if (pn !== localPin()) { onbErr(err, "Неверный PIN"); return; }
        } else {
          sset("authpin", pn);
        }
        markAuth("local");
        document.body.removeChild(overlay);
        if (onDone) { onDone(); }
      });
    }

    var skip = document.createElement("button");
    skip.type = "button";
    skip.className = "auth-btn ghost";
    skip.textContent = "Пропустить (без аккаунта)";
    card.appendChild(skip);
    skip.addEventListener("click", function () {
      document.body.removeChild(overlay);
      if (onDone) { onDone(); }
    });

    document.body.appendChild(overlay);
  }

  function buildStepSelf(body, lvlDict) {
    body.innerHTML = "";
    var sub = document.createElement("p");
    sub.textContent = "Быстрая самооценка — ИИ учтёт ответы при старте";
    sub.style.cssText = "margin:0 0 14px;color:var(--muted,#8a94a6);font-size:13px";
    body.appendChild(sub);
    var keys = [], k, i, j;
    for (k in lvlDict) {
      if (lvlDict.hasOwnProperty(k) && /^q\d+$/.test(k)) { keys.push(k); }
    }
    keys.sort();
    for (i = 0; i < keys.length; i++) {
      (function (qk) {
        var q = lvlDict[qk];
        if (!q || !q.t || !q.o) { return; }
        var row = document.createElement("div");
        row.className = "lvl-row lvq";
        var label = document.createElement("div");
        label.textContent = q.t;
        label.style.cssText = "margin:6px 0 6px;font-size:13px;color:var(--muted,#8a94a6)";
        row.appendChild(label);
        var box = document.createElement("div");
        for (j = 0; j < q.o.length; j++) {
          (function (opt, oj) {
            var ch = document.createElement("button");
            ch.type = "button";
            ch.className = "pace-chip" + (onb.lvAnswers.hasOwnProperty(qk) && onb.lvAnswers[qk] === oj ? " sel" : "");
            ch.textContent = opt;
            ch.addEventListener("click", function () {
              onb.lvAnswers[qk] = oj;
              var cls = row.querySelectorAll(".pace-chip"), z;
              for (z = 0; z < cls.length; z++) { cls[z].className = "pace-chip"; }
              ch.className = "pace-chip sel";
            });
            box.appendChild(ch);
          })(q.o[j], j);
        }
        row.appendChild(box);
        body.appendChild(row);
      })(keys[i]);
    }
  }

  function buildStepTest(body, ass) {
    body.innerHTML = "";
    var sub = document.createElement("p");
    sub.textContent = "Мини-тест по языку — проверь себя";
    sub.style.cssText = "margin:0 0 12px;color:var(--muted,#8a94a6);font-size:13px";
    body.appendChild(sub);
    if (ass && ass.starter) {
      var code = document.createElement("pre");
      code.className = "mini-code";
      code.style.cssText = "background:#10131c;color:#9fd6ff;padding:10px;border-radius:8px;font:12px/1.5 Consolas,monospace;white-space:pre-wrap;margin:0 0 12px";
      code.textContent = ass.starter;
      body.appendChild(code);
    }
    var qs = ass && ass.q ? ass.q : null;
    onb.testAnswers = [];
    if (qs) {
      for (var i = 0; i < qs.length; i++) {
        (function (qx, qi) {
          onb.testAnswers[qi] = "";
          var blk = document.createElement("div");
          blk.className = "mini-q";
          blk.style.cssText = "margin:0 0 12px";
          var t = document.createElement("div");
          t.textContent = (qi + 1) + ". " + qx.t;
          t.style.cssText = "margin:0 0 6px;font-size:13px";
          blk.appendChild(t);
          var opts = ["a", "b", "c"], oi, key;
          for (oi = 0; oi < opts.length; oi++) {
            key = opts[oi];
            if (qx[key] === undefined) { continue; }
            (function (letter, label) {
              var b2 = document.createElement("button");
              b2.type = "button";
              b2.className = "pace-chip lil";
              b2.textContent = letter + ") " + label;
              b2.addEventListener("click", function () {
                onb.testAnswers[qi] = letter;
                var cls = blk.querySelectorAll(".pace-chip.lil"), z;
                for (z = 0; z < cls.length; z++) { cls[z].className = "pace-chip lil"; }
                b2.className = "pace-chip lil sel";
              });
              blk.appendChild(b2);
            })(key, qx[key]);
          }
          body.appendChild(blk);
        })(qs[i], i);
      }
    } else {
      var none = document.createElement("div");
      none.textContent = "Мини-тест для этого курса появится позже — просто нажми «Начать»";
      none.style.cssText = "color:var(--muted,#8a94a6);font-size:13px";
      body.appendChild(none);
    }
  }

  function nchat() {
    var panel = document.createElement("div");
    panel.className = "nchat-panel";
    panel.style.cssText = "position:fixed;right:16px;bottom:16px;width:320px;max-width:92vw;height:420px;background:#0d1117;border:1px solid #2b3445;border-radius:14px;display:flex;flex-direction:column;box-shadow:0 10px 30px rgba(0,0,0,.5);z-index:120;font:14px/1.5 system-ui,-apple-system,sans-serif";
    var head = document.createElement("div");
    head.className = "nchat-head";
    head.textContent = "Нейро-чат · локально";
    head.style.cssText = "padding:12px 14px;border-bottom:1px solid #2b3445;font-weight:600;color:#7ee0ff";
    panel.appendChild(head);
    var log = document.createElement("div");
    log.className = "nchat-log";
    log.style.cssText = "flex:1;overflow:auto;padding:10px 12px";
    panel.appendChild(log);
    var quick = document.createElement("div");
    quick.className = "nchat-quick";
    quick.style.cssText = "padding:8px 12px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid #2b3445";
    panel.appendChild(quick);
    var chips = ["Помоги с задачей", "Что порекомендуешь?", "Уровень и прогресс"];
    for (var i = 0; i < chips.length; i++) {
      (function (txt) {
        var c = document.createElement("button");
        c.type = "button";
        c.className = "nchat-chip";
        c.textContent = txt;
        c.style.cssText = "background:#141a24;border:1px solid #2b3445;color:#b8c4d4;border-radius:999px;padding:5px 10px;font-size:12px;cursor:pointer";
        c.addEventListener("click", function () { nask(txt); });
        quick.appendChild(c);
      })(chips[i]);
    }
    var close = document.createElement("button");
    close.type = "button";
    close.className = "nchat-close";
    close.textContent = "×";
    close.style.cssText = "position:absolute;top:8px;right:10px;background:none;border:none;color:#8a94a6;font-size:18px;cursor:pointer;z-index:1";
    close.addEventListener("click", function () {
      if (panel.parentNode) { panel.parentNode.removeChild(panel); }
    });
    panel.appendChild(close);
    document.body.appendChild(panel);

    function say(cls, html) {
      var m = document.createElement("div");
      m.className = "nchat-msg " + cls;
      m.style.cssText = "margin:4px 0;padding:8px 10px;border-radius:10px;max-width:80%;white-space:pre-wrap;color:#e6ecf5";
      if (cls === "me") { m.style.cssText += ";background:#1b3550;margin-left:auto;text-align:right"; }
      else { m.style.cssText += ";background:#161c29;" }
      m.textContent = html;
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
      return m;
    }
    function typing() {
      var t = document.createElement("div");
      t.className = "nchat-typing";
      t.style.cssText = "color:#8a94a6;padding:4px 0";
      t.textContent = "ИИ печатает";
      for (var d = 0; d < 3; d++) {
        var dot = document.createElement("span");
        dot.className = "dot";
        dot.style.cssText = "animation:dotpulse 1s infinite " + (d * 0.2) + "s";
        t.appendChild(dot);
      }
      log.appendChild(t);
      log.scrollTop = log.scrollHeight;
      return t;
    }
    window._nchat = { say: say, typing: typing, log: log };
    say("ai", "Привет! Я локальный ИИ-наставник. Задай вопрос или выбери чип ниже.");
  }

  function nask(q) {
    var w = window._nchat;
    if (!w) { return; }
    w.say("me", q);
    var t = w.typing();
    var a = reply(q);
    setTimeout(function () {
      if (t.parentNode) { t.parentNode.removeChild(t); }
      w.say("ai", a);
    }, 700);
  }

  function reply(q) {
    try {
      if (q && /прогрес|уров|ранг|статус/i.test(q) && window.MENTOR_BRAIN && typeof window.MENTOR_BRAIN.report === "function") {
        var g = getCourses();
        var any = (g && g.length) ? g[0].topics[0].name : null;
        var r = window.MENTOR_BRAIN.report("", any ? any : "осваиваю");
        return r && r.length ? r[0] : "Ты в начале пути — сделать первый урок!";
      }
      if (q && /рекоменд|задач|помоги/i.test(q)) {
        var L = startupCourses();
        if (L && L.length) { return "Совет: начни с " + L[0].name + " — идеально для старта. Открой его ниже и сделай первый урок."; }
        return "Начни с любого курса из списка — ИИ подстроит сложность под тебя.";
      }
    } catch (e) {}
    return "Я работаю офлайн. Открой курс и делай уроки — я подстраиваю сложность под твой прогресс.";
  }

  function sget(k, d) {
    try { return window.Tutor.store ? window.Tutor.store.get(k, d) : d; }
    catch (e) { return d; }
  }

  function sset(k, v) {
    try { if (window.Tutor.store) { window.Tutor.store.set(k, v); } }
    catch (e) {}
  }

  function getProgress() {
    try { return window.Tutor.getProgress ? window.Tutor.getProgress() : {}; }
    catch (e) { return {}; }
  }

  function listCourses() {
    var i, out = [];
    if (window.MENTOR_COURSES && window.MENTOR_COURSES.length) {
      for (i = 0; i < window.MENTOR_COURSES.length; i++) {
        var c = window.MENTOR_COURSES[i];
        out.push({
          id: c.id,
          name: c.name || c.monoName || c.id,
          icon: c.icon || c.logo || "💻",
          desc: c.desc || ""
        });
      }
    } else if (window.MENTOR_LANGS && window.MENTOR_LANGS.length) {
      for (i = 0; i < window.MENTOR_LANGS.length; i++) {
        var p = window.MENTOR_LANGS[i];
        out.push({
          id: p.id,
          name: p.monoName || p.id,
          icon: p.logo || "💻",
          desc: (p.topics && p.topics.length ? p.topics.length : 0) + " тем"
        });
      }
    }
    return out;
  }

  function hasId(arr, id) {
    var i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i] === id) { return true; }
    }
    return false;
  }

  function courseExists(all, id) {
    var i;
    for (i = 0; i < all.length; i++) {
      if (all[i].id === id) { return true; }
    }
    return false;
  }

  function getCourses() {
    var c = sget("courses", null);
    var all = listCourses();
    var i, good = [];
    if (c && c.length) {
      for (i = 0; i < c.length; i++) {
        if (courseExists(all, c[i])) { good.push(c[i]); }
      }
      if (good.length) { return good; }
    }
    return all.length ? [all[0].id] : [];
  }

  function getRanks() {
    if (window.MENTOR_RANKS && window.MENTOR_RANKS.length) { return window.MENTOR_RANKS; }
    return DEFAULT_RANKS;
  }

  function rankFrom(r) {
    if (typeof r.from === "number") { return r.from; }
    if (typeof r.xp === "number") { return r.xp; }
    return 0;
  }

  function langXp(langId) {
    var p = getProgress();
    var keys = [];
    var prefixes = [langId + "_"];
    var i, j, pk, c;
    if (langId === "python") { prefixes.push("py_"); }
    if (langId === "javascript") { prefixes.push("js_"); }
    if (window.MENTOR_LANGS && window.MENTOR_LANGS.length) {
      for (i = 0; i < window.MENTOR_LANGS.length; i++) {
        pk = window.MENTOR_LANGS[i];
        if (pk.id === langId && pk.topics) {
          for (j = 0; j < pk.topics.length; j++) { keys.push(pk.topics[j].key); }
        }
      }
    }
    if (window.MENTOR_COURSES && window.MENTOR_COURSES.length) {
      for (i = 0; i < window.MENTOR_COURSES.length; i++) {
        c = window.MENTOR_COURSES[i];
        if ((c.id === langId || c.lang === langId) && c.topics) {
          for (j = 0; j < c.topics.length; j++) { keys.push(c.topics[j].key); }
        }
      }
    }
    var xp = 0;
    for (var k in p) {
      if (!p.hasOwnProperty(k)) { continue; }
      var m = false;
      if (keys.length) {
        for (j = 0; j < keys.length; j++) {
          if (k === keys[j]) { m = true; break; }
        }
      } else {
        for (j = 0; j < prefixes.length; j++) {
          if (k.indexOf(prefixes[j]) === 0) { m = true; break; }
        }
      }
      if (m) { xp += (p[k].solved || 0) * 10; }
    }
    return xp;
  }

  function rankFor(langId) {
    var ranks = getRanks();
    var xp = langXp(langId) || 0;
    var cur = ranks[0] || { from: 0, name: "Новичок", icon: "🌱" };
    var idx = 0, i, from = 0;
    for (i = 0; i < ranks.length; i++) {
      var fr = rankFrom(ranks[i]);
      if (xp >= fr) { cur = ranks[i]; idx = i; from = fr; }
    }
    var next = ranks[idx + 1] ? ranks[idx + 1] : null;
    var needFrom = next ? rankFrom(next) : from;
    var span = needFrom - from;
    var pct = next ? (span > 0 ? Math.max(0, Math.min(100, Math.floor(((xp - from) / span) * 100))) : 0) : 100;
    return {
      name: cur.name || cur.id || "?",
      icon: cur.icon || "",
      idx: idx,
      next: next ? (next.name || next.id) : null,
      need: next ? Math.max(0, needFrom - xp) : 0,
      pct: pct
    };
  }

  function mkBtn(text, cls) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls || "splash-btn";
    b.textContent = text;
    return b;
  }

  function buildCube() {
    var cube = document.createElement("div");
    cube.className = "cube-3d";
    var i, j, face, eyes, eye, pupil;
    for (i = 1; i <= 6; i++) {
      face = document.createElement("div");
      face.className = "face f" + i;
      if (i === 1) {
        eyes = document.createElement("div");
        eyes.className = "eyes";
        for (j = 0; j < 2; j++) {
          eye = document.createElement("div");
          eye.className = "eye";
          pupil = document.createElement("div");
          pupil.className = "pupil";
          eye.appendChild(pupil);
          eyes.appendChild(eye);
        }
        face.appendChild(eyes);
      }
      cube.appendChild(face);
    }
    return cube;
  }

  function buildSplash() {
    var splash = document.createElement("div");
    splash.className = "splash";
    var inner = document.createElement("div");
    inner.className = "splash-inner";
    var title = document.createElement("h1");
    title.className = "splash-title";
    title.textContent = "AI НАСТАВНИК";
    var sub = document.createElement("p");
    sub.className = "splash-sub";
    sub.textContent = "офлайн-тренер по программированию";
    inner.appendChild(title);
    inner.appendChild(sub);
    var wrap = document.createElement("div");
    wrap.className = "splash-cube";
    wrap.appendChild(buildCube());
    inner.appendChild(wrap);
    var btn = mkBtn("Начать");
    btn.addEventListener("click", function () {
      splash.className = splash.className + " hide";
      setTimeout(function () {
        if (splash.parentNode) { splash.parentNode.removeChild(splash); }
      }, 450);
      start();
    });
    inner.appendChild(btn);
    splash.appendChild(inner);
    document.body.appendChild(splash);
  }

  function buildStepCourses(body) {
    body.innerHTML = "";
    var sub = document.createElement("p");
    sub.textContent = "Выбери один или несколько языков";
    sub.style.cssText = "margin:0 0 12px;color:var(--muted);font-size:13px";
    body.appendChild(sub);
    var st = startupCourses();
    var all = st || listCourses();
    if (st) {
      var hint = document.createElement("div");
      hint.className = "onb-hint";
      hint.textContent = "Показаны стартовые языки. Python и JavaScript можно добавить позже через «+ курс».";
      hint.style.cssText = "margin:0 0 12px;color:var(--muted);font-size:12px";
      body.appendChild(hint);
    }
    var grid = document.createElement("div");
    grid.className = "onb-grid";
    var i, card, ico, nm, desc;
    if (!onb.courses.length && all.length) { onb.courses.push(all[0].id); }
    for (i = 0; i < all.length; i++) {
      (function (c) {
        card = document.createElement("div");
        card.className = "course-card" + (hasId(onb.courses, c.id) ? " sel" : "");
        card.setAttribute("role", "button");
        ico = document.createElement("span");
        ico.className = "cc-ico";
        ico.textContent = c.icon;
        nm = document.createElement("span");
        nm.className = "cc-name";
        nm.textContent = c.name;
        desc = document.createElement("span");
        desc.className = "cc-desc";
        desc.textContent = c.desc;
        card.appendChild(ico);
        card.appendChild(nm);
        card.appendChild(desc);
        card.addEventListener("click", function () {
          if (hasId(onb.courses, c.id)) {
            onb.courses.splice(onb.courses.indexOf(c.id), 1);
            this.className = this.className.replace(" sel", "");
          } else {
            onb.courses.push(c.id);
            this.className = "course-card sel";
          }
        });
        grid.appendChild(card);
      })(all[i]);
    }
    body.appendChild(grid);
  }

  function buildStepLvl(body) {
    body.innerHTML = "";
    var sub = document.createElement("p");
    sub.textContent = "Оцени свой уровень в программировании";
    sub.style.cssText = "margin:0 0 14px;color:var(--muted);font-size:13px";
    body.appendChild(sub);
    var row = document.createElement("div");
    row.className = "lvl-row";
    var items = [
      { v: "beginner", t: "Новичок" },
      { v: "some", t: "Немного" },
      { v: "confident", t: "Уверенно" },
      { v: "guru", t: "Гуру" }
    ];
    if (!onb.lvl) { onb.lvl = "beginner"; }
    var i, chip;
    for (i = 0; i < items.length; i++) {
      (function (it) {
        chip = document.createElement("button");
        chip.type = "button";
        chip.className = "lvl-chip" + (onb.lvl === it.v ? " sel" : "");
        chip.textContent = it.t;
        chip.addEventListener("click", function () {
          onb.lvl = it.v;
          var all = row.querySelectorAll(".lvl-chip");
          var j;
          for (j = 0; j < all.length; j++) { all[j].className = "lvl-chip"; }
          this.className = "lvl-chip sel";
        });
        row.appendChild(chip);
      })(items[i]);
    }
    body.appendChild(row);
  }

  function buildStepPace(body) {
    body.innerHTML = "";
    var sub = document.createElement("p");
    sub.textContent = "Сколько минут в день готов заниматься?";
    sub.style.cssText = "margin:0 0 14px;color:var(--muted);font-size:13px";
    body.appendChild(sub);
    var row = document.createElement("div");
    row.className = "pace-row";
    if (!onb.pace) { onb.pace = "15"; }
    var items = [
      { v: "5", t: "5 мин" },
      { v: "15", t: "15 мин" },
      { v: "30", t: "30 мин" }
    ];
    var i, chip;
    for (i = 0; i < items.length; i++) {
      (function (it) {
        chip = document.createElement("button");
        chip.type = "button";
        chip.className = "pace-chip" + (onb.pace === it.v ? " sel" : "");
        chip.textContent = it.t;
        chip.addEventListener("click", function () {
          onb.pace = it.v;
          var all = row.querySelectorAll(".pace-chip");
          var j;
          for (j = 0; j < all.length; j++) { all[j].className = "pace-chip"; }
          this.className = "pace-chip sel";
        });
        row.appendChild(chip);
      })(items[i]);
    }
    body.appendChild(row);
  }

  function renderOnb(root, card) {
    card.innerHTML = "";
    var head = document.createElement("div");
    head.className = "onb-head";
    var h2 = document.createElement("h2");
    var step = document.createElement("div");
    step.className = "onb-step";
    if (onb.step === 1) {
      h2.textContent = "Что изучаем";
      step.textContent = "ШАГ 1 / 3";
    } else if (onb.step === 2) {
      h2.textContent = onbV2 ? "Самооценка" : "Твой опыт";
      step.textContent = "ШАГ 2 / 3";
    } else {
      h2.textContent = onbV2 ? "Мини-тест" : "Ритм занятий";
      step.textContent = "ШАГ 3 / 3";
    }
    head.appendChild(h2);
    head.appendChild(step);
    card.appendChild(head);

    var body = document.createElement("div");
    body.className = "onb-body";
    if (onb.step === 1) {
      buildStepCourses(body);
    } else if (onb.step === 2) {
      var lv = (window.MENTOR_LEVELS || {})[curLang()];
      if (onbV2 && lv) { buildStepSelf(body, lv); }
      else { buildStepLvl(body); }
    } else {
      var assN = null;
      if (onbV2 && onb.courses.length) { assN = assessOf(onb.courses[0]); }
      if (onbV2 && assN) { buildStepTest(body, assN); }
      else { buildStepPace(body); }
    }
    card.appendChild(body);

    var foot = document.createElement("div");
    foot.className = "onb-foot";
    if (onb.step > 1) {
      var bak = mkBtn("← Назад");
      bak.addEventListener("click", function () {
        onb.step--;
        renderOnb(root, card);
      });
      foot.appendChild(bak);
    }
    var act;
    if (onb.step < 3) {
      act = mkBtn("Далее →");
      act.addEventListener("click", function () {
        onb.step++;
        renderOnb(root, card);
      });
    } else {
      act = mkBtn("Начать");
      act.addEventListener("click", function () {
        finish(root);
      });
    }
    foot.appendChild(act);
    card.appendChild(foot);
  }

  function finish(root) {
    sset("courses", onb.courses.slice());
    sset("pace", onb.pace);
    sset("lvl", onb.lvl);
    var lv = (window.MENTOR_LEVELS || {})[curLang()];
    var sr = 0, qk, nSelf = 0;
    for (qk in onb.lvAnswers) {
      if (onb.lvAnswers.hasOwnProperty(qk)) { sr += (onb.lvAnswers[qk] + 1); nSelf++; }
    }
    if (lv && nSelf) { sr = sr * 4; } else { sr = 0; }
    var ass = null;
    if (onb.courses.length) { ass = assessOf(onb.courses[0]); }
    var okQ = 0;
    if (ass && ass.q) {
      for (var ti = 0; ti < onb.testAnswers.length; ti++) {
        if (ass.q[ti] && onb.testAnswers[ti] === ass.q[ti].k) { okQ++; sr += 40; }
      }
    }
    sset("startrank", { xp: sr, q: okQ, dt: Date.now() });
    try {
      if (onb.courses.length && window.MENTOR_BRAIN && typeof window.MENTOR_BRAIN.update === "function") {
        var m = sget("brain", null) || window.MENTOR_BRAIN.model();
        m = window.MENTOR_BRAIN.update(m, onb.courses[0], (ass && ass.q && ass.q[0]) ? "mini:" + okQ : "intro", okQ >= 2, 1);
        sset("brain", m);
      }
    } catch (e) {}
    sset("onboarded", true);
    root.className = root.className + " hide";
    setTimeout(function () {
      if (root.parentNode) { root.parentNode.removeChild(root); }
    }, 380);
    confetti();
    var first = onb.courses.length ? onb.courses[0] : getCourses()[0];
    if (first) {
      var rk = rankFromV2(sr);
      showRankUp(rk.icon + " " + rk.name);
    }
    setTimeout(function () {
      navTo("train");
    }, 500);
  }

  function start() {
    if (document.querySelector(".onb")) { return; }
    if (window.MENTOR_LEVELS) { onbV2 = true; }
    var root = document.createElement("div");
    root.className = "onb";
    var card = document.createElement("div");
    card.className = "onb-card";
    root.appendChild(card);
    document.body.appendChild(root);
    renderOnb(root, card);
  }

  function confetti() {
    var old = document.querySelector(".confetti");
    if (old && old.parentNode) { old.parentNode.removeChild(old); }
    var box = document.createElement("div");
    box.className = "confetti";
    var n = 20, i, cf;
    for (i = 0; i < n; i++) {
      cf = document.createElement("span");
      cf.className = "cf";
      box.appendChild(cf);
    }
    document.body.appendChild(box);
    setTimeout(function () {
      box.className = "confetti rain";
    }, 20);
    setTimeout(function () {
      if (box.parentNode) { box.parentNode.removeChild(box); }
    }, 3600);
  }

  function showRankUp(text) {
    var el = document.createElement("div");
    el.className = "rank-up";
    el.innerHTML = '<div style="font-size:13px;letter-spacing:2px;opacity:.9">РАНГ</div>' + text;
    document.body.appendChild(el);
    setTimeout(function () {
      el.className = "rank-up show";
    }, 30);
    setTimeout(function () {
      el.className = "rank-up";
    }, 2600);
    setTimeout(function () {
      if (el.parentNode) { el.parentNode.removeChild(el); }
    }, 3000);
  }

  function closeDialog(dlg) {
    dlg.className = dlg.className.replace(" show", "");
    setTimeout(function () {
      if (dlg.parentNode) { dlg.parentNode.removeChild(dlg); }
    }, 250);
  }

  function note(msg) {
    var t = document.getElementById("toast");
    if (!t) { return; }
    t.textContent = msg;
    t.className = "toast show";
    setTimeout(function () {
      t.className = "toast";
    }, 2200);
  }

  function addCourse() {
    if (document.querySelector(".lang-add-dialog")) { return; }
    var all = listCourses();
    var sel = getCourses();
    var avail = [];
    var i, opt, ico, nm, cancel;
    for (i = 0; i < all.length; i++) {
      if (!hasId(sel, all[i].id)) { avail.push(all[i]); }
    }
    if (!avail.length) {
      note("Все курсы уже добавлены");
      return;
    }
    var dlg = document.createElement("div");
    dlg.className = "lang-add-dialog";
    var h4 = document.createElement("h4");
    h4.textContent = "+ Добавить курс";
    dlg.appendChild(h4);
    for (i = 0; i < avail.length; i++) {
      (function (c) {
        opt = document.createElement("button");
        opt.type = "button";
        opt.className = "lang-opt";
        ico = document.createElement("span");
        ico.className = "cc-ico";
        ico.textContent = c.icon;
        nm = document.createElement("span");
        nm.textContent = c.name;
        opt.appendChild(ico);
        opt.appendChild(nm);
        opt.addEventListener("click", function () {
          var cur = getCourses();
          cur.push(c.id);
          sset("courses", cur);
          closeDialog(dlg);
          navTo("topics", c.id);
        });
        dlg.appendChild(opt);
      })(avail[i]);
    }
    cancel = mkBtn("Отмена", "btn-add");
    cancel.style.cssText = "margin-top:12px";
    cancel.addEventListener("click", function () {
      closeDialog(dlg);
    });
    dlg.appendChild(cancel);
    document.body.appendChild(dlg);
    setTimeout(function () {
      dlg.className = "lang-add-dialog show";
    }, 20);
  }

  function navTo(v, packId) {
    var host = document.getElementById("nav") || document.getElementById("view");
    if (!host) { return; }
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("data-view", v);
    if (packId) { b.setAttribute("data-pack", packId); }
    b.style.display = "none";
    host.appendChild(b);
    b.click();
    host.removeChild(b);
  }

  function engineOk() {
    var M = window.MentorAuth;
    return !!(M && typeof M.signup === "function" &&
      typeof M.verify === "function" && typeof M.current === "function");
  }

  function shimLocalCurrent() {
    try {
      if (window.MentorAuth && typeof window.MentorAuth.current !== "function" && authOk()) {
        var lg = sget("authlogin", "local");
        window.MentorAuth.current = function () { return { id: "local", login: lg, kind: "pin" }; };
      }
    } catch (e) {}
  }

  function waitLogin(rem, cb) {
    try {
      if (window.MentorAuth && typeof window.MentorAuth.current === "function" && window.MentorAuth.current()) { cb(); return; }
    } catch (e) {}
    if (rem <= 0) { cb(); return; }
    setTimeout(function () { waitLogin(rem - 1, cb); }, 100);
  }

  function auto() {
    if (!window.Tutor || !window.Tutor.store) { return; }
    if (sget("onboarded", false)) { return; }
    /* Профиль из reg.html: уже прошли опрос — пропускаем splash/онбординг */
    var reg = sget("regdone", null);
    if (!reg) {
      try {
        var rawReg = window.localStorage ? window.localStorage.getItem("tutor.regdone") : null;
        if (rawReg) { reg = JSON.parse(rawReg); }
      } catch (e) { reg = null; }
    }
    if (reg) {
      sset("onboarded", true);
      var curCourses = sget("courses", null);
      if ((!curCourses || !curCourses.length) &&
          reg.langs && typeof reg.langs.join === "function" && reg.langs.length) {
        sset("courses", reg.langs.slice());
      }
      return; /* без buildSplash() и без онбординг-мастера */
    }
    /* РАПОРТ-11: нет профиля → регистрация (http(s) и не fallback-режим) */
    if (!reg && window.location &&
        window.location.protocol.indexOf("http") === 0 &&
        window.location.search.indexOf("fallback=1") < 0) {
      window.location.replace("reg.html");
      return;
    }
    if (!listCourses().length) { return; }
    try { localStorage.getItem("__t"); } catch (e) { buildSplash(); return; }
    shimLocalCurrent();
    if (authOk()) { buildSplash(); return; }
    if (engineOk()) {
      if (window.MentorAuthUI) {
        waitLogin(30, function () {
          buildSplash();
        });
        return;
      }
      buildAuth(function () {
        buildSplash();
      });
      return;
    }
    try {
      if (window.MentorAuthUI && window.MentorAuthUI.hide) { window.MentorAuthUI.hide(); }
    } catch (e) {}
    buildAuth(function () {
      buildSplash();
    });
    setTimeout(function () {
      try {
        if (window.MentorAuthUI && window.MentorAuthUI.hide && window.MentorAuthUI.isShown && window.MentorAuthUI.isShown()) { window.MentorAuthUI.hide(); }
      } catch (e) {}
    }, 450);
  }

  function ready() {
    if (!window.Tutor || !window.Tutor.store || !listCourses().length) {
      tries++;
      if (tries > 30) { return; }
      setTimeout(ready, 100);
      return;
    }
    window.Onboard = {
      auto: auto,
      start: start,
      addCourse: addCourse,
      getCourses: getCourses,
      rankFor: rankFor,
      confetti: confetti,
      nchat: nchat,
      reply: reply,
      ranks: rankFromV2,
      startRank: function () { return sget("startrank", { xp: 0, q: 0 }); }
    };
    auto();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();