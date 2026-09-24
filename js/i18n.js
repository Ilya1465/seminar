/* i18n-хелпер: L(key) — строка из dict, T(obj) — локализованное значение, плюс выбор языка RU/EN */
window.I18n = {
  lang: (localStorage.getItem("pp_lang") || "ru"),
  setLang(l) {
    this.lang = l;
    localStorage.setItem("pp_lang", l);
    document.documentElement.lang = l;
  },
  t(key) {
    const dict = window.I18N[this.lang] || {};
    if (dict[key] !== undefined) return dict[key];
    return (window.I18N.ru && window.I18N.ru[key] !== undefined) ? window.I18N.ru[key] : key;
  },
  txt(o) {
    if (o === undefined || o === null) return "";
    if (typeof o === "string") return o;
    if (typeof o === "number") return String(o);
    if (o[this.lang]) return o[this.lang];
    if (o.ru) return o.ru;
    if (o.en) return o.en;
    return "";
  }
};

function L(key) { return I18n.t(key); }
function T(o) { return I18n.txt(o); }

function bindLangButtons() {
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === I18n.lang);
    btn.addEventListener("click", () => {
      I18n.setLang(btn.dataset.lang);
      renderStaticI18n();
      document.querySelectorAll(".lang-btn").forEach(b => b.classList.toggle("active", b.dataset.lang === I18n.lang));
      if (window.App && window.App.refresh) window.App.refresh();
    });
  });
}

function renderStaticI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = L(el.getAttribute("data-i18n"));
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
window.escapeHtml = escapeHtml;