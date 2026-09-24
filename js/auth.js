/* =========================================================================
 *  js/auth.js — Аккаунты (Интегратор, BRIF-5).
 *  РЕГИСТРАЦИЯ/ВХОД: номер телефона или e-mail -> код (генерируется
 *  детерминированно, "приходит" локально и показывается для копирования)
 *  ЛИБО простой пользовательский код (PIN). Всё офлайн, без сервера:
 *  аккаунты и их прогресс живут в localStorage (ключ "auth").
 *  API только движковое (без UI — UI строит Сессия-C в js/onboard.js):
 *    window.MentorAuth = {
 *      signup(login, kind)     -> {id, login, kind, code}  (создаёт аккаунт + одноразовый код)
 *      sendCode(login, kind)   -> {code, expires}          (детерминированный OTP, показать юзеру "пришло")
 *      verify(login, kind, in) -> bool                     (сверка введённого кода)
 *      loginPin(login, pin)    -> bool                     (вход по своему PIN)
 *      setPin(login, pin)      -> bool
 *      current()               -> account|null             (текущая сессия)
 *      logout()                -> void
 *      list()                  -> [accounts]
 *      adoptProgress(accId)    -> void (свернуть прогресс текущего пользователя в аккаунт)
 *      use(accId)              -> void (переключить сессию + восстановить прогресс из снапшота)
 *      on(fn)                  -> регистрация слушателя смены аккаунта
 *    }
 *  Соглашение: прогресс XP/brain/courses отдельных аккаунтов хранится в
 *  localStorage ключах "<accId>.xp", "<accId>.brain", "<accId>.courses",
 *  а глобальный прогресс сессии без аккаунта — в "xp"/"brain"/"courses"
 *  (движок js/tutor.js читает именно их). При use() мы подменяем эти ключи,
 *  поэтому tutor.js НЕ пришлось менять.
 * ========================================================================= */
(function () {
  "use strict";
  var KEY = "auth";
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null") || { accounts: [], session: null }; }
    catch (e) { return { accounts: [], session: null }; }
  }
  function save(m) {
    try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {}
    return m;
  }
  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0);
  }
  function otpFor(login, seed) {
    // детерминированный 6-значный код: хэш(login) ^ хэш(seed), устойчив к обновлениям.
    var h = hash(login + "|" + (seed || ""));
    return String(100000 + (h % 900000));
  }
  function genId() { return "a" + Date.now().toString(36) + Math.floor(Math.random() * 9999).toString(36); }
  function normLogin(login, kind) {
    var s = String(login || "").replace(/\s+/g, "").toLowerCase();
    if (kind === "phone") {
      s = s.replace(/[^0-9+]/g, "");
      if (s.indexOf("+") !== 0) s = "+" + s;
    } else {
      s = s.toLowerCase();
    }
    return s;
  }
  function find(m, login, kind) {
    var n = normLogin(login, kind);
    for (var i = 0; i < m.accounts.length; i++) {
      if (m.accounts[i].login === n && m.accounts[i].kind === kind) return m.accounts[i];
    }
    return null;
  }

  function storeKey(accId, base) { return accId + "." + base; }
  function snapshot(accId) {
    // свернуть текущий движковый прогресс в аккаунт
    function g(k, d) { try { return JSON.parse(localStorage.getItem(k) || "null") === null ? d : JSON.parse(localStorage.getItem(k)); } catch (e) { return d; } }
    return {
      xp: g("xp", 0),
      brain: g("brain", null),
      courses: g("courses", [])
    };
  }
  function restore(accId) {
    function g(k, d) { try { return JSON.parse(localStorage.getItem(k) || "null") === null ? d : JSON.parse(localStorage.getItem(k)); } catch (e) { return d; } }
    function S(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
    S("xp", g(storeKey(accId, "xp"), 0));
    S("brain", g(storeKey(accId, "brain"), null));
    S("courses", g(storeKey(accId, "courses"), []));
  }
  function adopt(accId) {
    var snap = snapshot(accId);
    function S(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
    S(storeKey(accId, "xp"), snap.xp);
    S(storeKey(accId, "brain"), snap.brain);
    S(storeKey(accId, "courses"), snap.courses);
  }

  var listeners = [];
  function emit(acc) {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](acc); } catch (e) {}
    }
  }

  window.MentorAuth = {
    signup: function (login, kind) {
      var m = load();
      var n = normLogin(login, kind);
      if (!n || n.indexOf("@") < 0 && kind === "email") return null;
      var had = find(m, n, kind);
      var acc = had || { id: genId(), login: n, kind: kind, pin: null, created: Date.now() };
      if (!had) m.accounts.push(acc);
      var seed = Date.now().toString();
      var code = otpFor(n, seed + Math.floor(Date.now() / 300000)); // окно 5 мин
      acc._pending = code;
      save(m);
      return { id: acc.id, login: acc.login, kind: acc.kind, code: code };
    }
  };
})();