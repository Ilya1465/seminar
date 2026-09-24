/* =========================================================================
 *  js/auth-ui.js — Экран входа/регистрации (Интегратор, BRIF-5 блок-C).
 *  Рисует поверх приложения карточку .auth-card: вкладки «Телефон / E-mail /
 *  PIN», поля ввода, кнопку, шаг с 6-значным кодом (код «приходит» локально,
 *  показывается копируемой строкой — его вставляешь в инпут) или свой PIN.
 *  Вся логика — window.MentorAuth (js/auth.js, тот же автор). Если движок
 *  отсутствует — карточка НЕ появляется, приложение работает как раньше.
 *  Экспорт: window.MentorAuthUI = { show(), hide(), isShown() }.
 * ========================================================================= */
(function () {
  "use strict";
  var auth = function () { return window.MentorAuth || null; };
  var shown = false;
  var step = "tab"; /* tab | code | pin */
  var pending = null; /* {login, kind, code, accId} */
  var RU = {
    title: "AI Наставник",
    sub: "Создай аккаунт — прогресс сохранится за тобой",
    tabPhone: "Телефон",
    tabEmail: "E-mail",
    tabPin: "PIN-код",
    phPhone: "+7 900 000-00-00",
    phEmail: "you@mail.ru",
    phPin: "твой секретный код",
    btnGo: "Получить код",
    btnPinGo: "Войти по PIN",
    btnPinNew: "Задать PIN",
    hintCode: "Код «пришёл» — скопируй его:",
    phCode: "Введите 6 цифр из сообщения",
    btnVerify: "Войти",
    errCode: "Неверный код. Попробуй ещё раз.",
    errPin: "Неверный PIN.",
    errLogin: "Заполни поле.",
    ok: "Готово! Добро пожаловать.",
    or: "или"
  };
  var EN = {
    title: "AI Mentor",
    sub: "Create an account — your progress will follow you",
    tabPhone: "Phone",
    tabEmail: "E-mail",
    tabPin: "PIN",
    phPhone: "+7 900 000-00-00",
    phEmail: "you@mail.ru",
    phPin: "your secret code",
    btnGo: "Get code",
    btnPinGo: "Sign in with PIN",
    btnPinNew: "Set PIN",
    hintCode: "Code arrived — copy it:",
    phCode: "Enter the 6 digits from the message",
    btnVerify: "Sign in",
    errCode: "Wrong code. Try again.",
    errPin: "Wrong PIN.",
    errLogin: "Fill the field.",
    ok: "Done! Welcome.",
    or: "or"
  };
  var cur = RU;

  /* ---------- маленькие помощники ---------- */
  function onDoc(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else { fn(); }
  }
  function ensureFallbackCss() {
    if (document.getElementById("auth-fb-style")) return;
    var st = document.createElement("style");
    st.id = "auth-fb-style";
    st.textContent =
      ".auth-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9999;background:rgba(2,6,23,.85)}" +
      ".auth-card{width:340px;max-width:92vw;padding:26px 24px 20px;border-radius:18px;background:linear-gradient(160deg,#0b1030,#050916);" +
      "border:1px solid rgba(80,230,255,.45);box-shadow:0 0 30px rgba(80,230,255,.25),inset 0 0 18px rgba(80,230,255,.08);color:#d7f5ff;font-family:system-ui,sans-serif;text-align:center}" +
      ".auth-logo{font-size:34px;margin-bottom:4px}.auth-title{font-size:19px;font-weight:700;letter-spacing:.5px}.auth-sub{font-size:12px;color:#8fd7ef;margin:3px 0 14px}" +
      ".auth-tabs{display:flex;gap:6px;justify-content:center;margin-bottom:12px}.auth-tab{background:transparent;border:1px solid #2a4a63;color:#b9e8fb;border-radius:999px;padding:5px 12px;font-size:12px;cursor:pointer}" +
      ".auth-tab.sel,.auth-tab.tab-sel{background:rgba(80,230,255,.18);border-color:#50e6ff;color:#fff}" +
      ".auth-input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid #2a5a7a;background:rgba(4,10,28,.7);color:#fff;font-size:14px;text-align:center}" +
      ".auth-btn{margin-top:12px;width:100%;padding:11px;border:0;border-radius:12px;background:linear-gradient(90deg,#19d3ff,#7b5bff);color:#02101b;font-weight:700;font-size:14px;cursor:pointer}" +
      ".auth-err{min-height:16px;color:#ff6b8a;font-size:12px;margin-top:8px}.auth-code-step{margin-top:12px}" +
      ".auth-code-hint{font-size:12px;color:#8fd7ef;margin-bottom:8px}.auth-code-chip{display:inline-block;background:rgba(0,0,0,.35);border:1px dashed #50e6ff;padding:4px 12px;border-radius:8px;letter-spacing:3px;font-weight:700;cursor:pointer}" +
      ".auth-code-input,.auth-input-code{width:100%;box-sizing:border-box;margin-top:10px;padding:10px;border-radius:10px;border:1px solid #2a5a7a;background:rgba(4,10,28,.7);color:#fff;text-align:center;letter-spacing:8px;font-size:16px}" +
      ".auth-done{color:#5dffb0;font-weight:700;margin-top:10px}";
    (document.head || document.documentElement).appendChild(st);
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.appendChild(document.createTextNode(text));
    return e;
  }
  function q(s, r) { return (r || document).querySelector(s); }

  /* ---------- рендер карточки ---------- */
  function card() {
    var lang = window.Tutor && window.Tutor.getLang ? window.Tutor.getLang() : "ru";
    cur = (lang === "en") ? EN : RU2();
    var m = auth();
    if (!m) return null; /* движка аккаунтов нет — тихо */
    var existing = (function () {
      try { var lst = m.list(); return lst && lst.length ? lst[0] : null; } catch (e) { return null; }
    })();

    var ov = el("div", "auth-overlay");
    var c = el("div", "auth-card");
    c.appendChild(el("div", "auth-logo", "🤖"));
    c.appendChild(el("div", "auth-title", cur.title));
    c.appendChild(el("div", "auth-sub", cur.sub));

    var tabs = el("div", "auth-tabs");
    var tbPhone = el("button", "auth-tab sel", cur.tabPhone);
    var tbEmail = el("button", "auth-tab", cur.tabEmail);
    var tbPin = el("button", "auth-tab", cur.tabPin);
    tabs.appendChild(tbPhone); tabs.appendChild(tbEmail); tabs.appendChild(tbPin);
    var field = el("input", "auth-input");
    field.type = "text"; field.placeholder = cur.phPhone;
    var btn = el("button", "auth-btn", cur.btnGo);
    var err = el("div", "auth-err", "");
    var codeWrap = el("div", "auth-code-step");

    function setTab(kind) {
      step = "tab";
      tbPhone.className = "auth-tab" + (kind === "phone" ? " sel" : "");
      tbEmail.className = "auth-tab" + (kind === "email" ? " sel" : "");
      tbPin.className = "auth-tab" + (kind === "pin" ? " sel" : "");
      field.value = "";
      if (kind === "pin") {
        field.placeholder = cur.phPin;
        btn.textContent = existing ? cur.btnPinGo : cur.btnPinNew;
      } else {
        field.placeholder = (kind === "phone") ? cur.phPhone : cur.phEmail;
        btn.textContent = cur.btnGo;
      }
      err.textContent = "";
      codeWrap.innerHTML = "";
    }

    function normVal() {
      return field.value.replace(/\s+/g, "");
    }

    function showCode(code) {
      codeWrap.innerHTML = "";
      codeWrap.appendChild(el("div", "auth-code-hint", cur.hintCode));
      var chip = el("div", "auth-code-chip", code);
      chip.title = "Клик — скопировать";
      chip.addEventListener("click", function () {
        try { navigator.clipboard.writeText(code); } catch (e2) {}
        chip.className = "auth-code-chip copied";
      });
      codeWrap.appendChild(chip);
      var inp = el("input", "auth-input");
      inp.type = "text"; inp.placeholder = cur.phCode; inp.maxLength = 6; inp.inputMode = "numeric";
      codeWrap.appendChild(inp);
      var go = el("button", "auth-btn", cur.btnVerify);
      codeWrap.appendChild(go);
      err.textContent = "";
      go.addEventListener("click", function () {
        var inCode = inp.value.replace(/\s+/g, "");
        try {
          if (m.verify(pending.login, pending.kind, inCode)) { finish(); }
          else { err.textContent = cur.errCode; }
        } catch (e3) { err.textContent = cur.errCode; }
      });
      inp.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.keyCode === 13) { go.click(); }
      });
      inp.focus();
    }

    function finish() {
      try { m.adoptProgress(pending.accId || null); } catch (e4) {}
      codeWrap.innerHTML = "";
      err.textContent = "";
      field.value = "";
      step = "done";
      c.appendChild(el("div", "auth-done", "✓ " + cur.ok));
      hide(true);
    }

    btn.addEventListener("click", function () {
      err.textContent = "";
      var v = normVal();
      if (!v) { err.textContent = cur.errLogin; return; }
      if (step === "pin") {
        /* PIN: вход по существующему или создание */
        var kind = "pin";
        try {
          var ok = existing ? m.verifyPin && m.verifyPin(v) : m.setPin && m.setPin(v);
          if (ok) {
            if (m.use && m.current) { /* PIN-сессия уже движком */ }
            finish();
          } else { err.textContent = cur.errPin; }
        } catch (e5) { err.textContent = cur.errPin; }
        return;
      }
      var kk = (document.activeElement === tbEmail || tbEmail.className.indexOf("sel") >= 0) ? "email" : "phone";
      try {
        var r = m.signup(v, kk);
        if (!r) { err.textContent = cur.errLogin; return; }
        pending = { login: r.login || v, kind: r.kind || kk, code: r.code, accId: r.id };
        step = "code";
        showCode(String(r.code));
      } catch (e6) { err.textContent = cur.errLogin; }
    });

    tbPhone.addEventListener("click", function () { setTab("phone"); });
    tbEmail.addEventListener("click", function () { setTab("email"); });
    tbPin.addEventListener("click", function () { setTab("pin"); });
    field.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.keyCode === 13) { btn.click(); }
    });

    c.appendChild(tabs);
    c.appendChild(field);
    c.appendChild(btn);
    c.appendChild(codeWrap);
    c.appendChild(err);
    ov.appendChild(c);
    ov.addEventListener("click", function (ev) {
      if (ev.target === ov && step === "done") { hide(true); }
    });
    return ov;
  }

  function RU2() { return RU; }

  /* ---------- публичное API ---------- */
  function show() {
    if (shown) return;
    var ov = card();
    if (!ov) return;
    shown = true;
    document.body.appendChild(ov);
  }
  function hide(force) {
    var ov = q(".auth-overlay");
    if (ov) { try { document.body.removeChild(ov); } catch (e) {} }
    shown = false;
  }
  function isShown() { return shown; }
  function auto() {
    var m = auth();
    if (!m) return;
    var hasAcc = false;
    try { hasAcc = !!(m.current && m.current()); } catch (e) { hasAcc = false; }
    if (!hasAcc) { show(); }
  }

  window.MentorAuthUI = { show: show, hide: hide, isShown: isShown, auto: auto };
  onDoc(function () {
    setTimeout(function () { auto(); }, 250);
  });
})();
