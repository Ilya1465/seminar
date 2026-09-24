/* Движок Pyodide: запуск Python прямо в браузере */
window.PyRunner = {
  pyodide: null,
  busy: false,

  async get() {
    if (this.pyodide) return this.pyodide;
    while (this.busy) {
      await new Promise(r => setTimeout(r, 60));
    }
    this.busy = true;
    try {
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
          s.onload = resolve;
          s.onerror = () => reject(new Error("CDN unavailable"));
          document.head.appendChild(s);
        });
      }
      this.pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
      });
      return this.pyodide;
    } finally {
      this.busy = false;
    }
  },

  /* Запускает код, возвращает { output: string[], error: boolean, cdn: boolean } */
  async run(code) {
    const result = { output: [], error: false, cdn: false };
    let py;
    try {
      py = await this.get();
    } catch (e) {
      result.cdn = true;
      return result;
    }
    py.setStdout({ batched: t => result.output.push(String(t)) });
    py.setStderr({ batched: t => { result.output.push(String(t)); result.error = true; } });
    try {
      await py.runPythonAsync(code);
    } catch (e) {
      result.output.push(formatPyError(e));
      result.error = true;
    }
    return result;
  }
};

function formatPyError(e) {
  let msg = (e && (e.message || e.toString())) || String(e);
  if (msg.startsWith("PythonError:")) msg = msg.slice("PythonError:".length).trim();
  return msg;
}

/* Нормализация вывода для сравнения: убрать пустые строки и хвостовые пробелы */
function normalizeOutput(text) {
  return text
    .split("\n")
    .map(l => l.replace(/\s+$/, ""))
    .filter(l => l.trim() !== "" || l.length === 0);
}
function compareOutput(got, expected) {
  const a = normalizeOutput(got).filter(l => l.length > 0);
  const b = normalizeOutput(expected).filter(l => l.length > 0);
  return a.join("\n") === b.join("\n");
}

/* ---------- Визуальный редактор ---------- */
class PyEditor {
  constructor(container, opts) {
    opts = opts || {};
    this.container = container;
    this.title = opts.title || L("lessons.trySelf");
    this.starter = opts.code || "";
    this.placeholder = opts.placeholder || "";

    const el = document.createElement("div");
    el.className = "editor";
    el.innerHTML = `
      <div class="editor-head">
        <span class="editor-title">${escapeHtml(this.title)}</span>
        <div class="editor-actions">
          <button class="btn small ghost" data-act="reset">${L("tasks.reset")}</button>
          <button class="btn small primary" data-act="run">▶ ${L("lessons.run")}</button>
        </div>
      </div>
      <div class="editor-body">
        <div class="editor-gutter"><pre>1</pre></div>
        <textarea class="editor-code" spellcheck="false"></textarea>
      </div>
      <div class="editor-out" style="display:none">
        <div class="editor-out-head">${L("play.output")}</div>
        <pre class="editor-out-text"></pre>
      </div>`;
    container.appendChild(el);

    this.el = el;
    this.gutterPre = el.querySelector(".editor-gutter pre");
    this.ta = el.querySelector("textarea");
    this.outHead = el.querySelector(".editor-out-head");
    this.outBox = el.querySelector(".editor-out");
    this.outText = el.querySelector(".editor-out-text");

    this.ta.value = this.starter;
    this.updateGutter();

    this.ta.addEventListener("input", () => {
      this.updateGutter();
      this.outText.style.color = "";
    });
    this.ta.addEventListener("scroll", () => {
      this.gutterPre.style.transform = `translateY(${-this.ta.scrollTop}px)`;
    });
    this.ta.addEventListener("keydown", (ev) => {
      if (ev.key === "Tab") {
        ev.preventDefault();
        const s = this.ta.selectionStart, e = this.ta.selectionEnd;
        this.ta.value = this.ta.value.slice(0, s) + "  " + this.ta.value.slice(e);
        this.ta.selectionStart = this.ta.selectionEnd = s + 2;
        this.updateGutter();
      }
      if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
        ev.preventDefault();
        this.run();
      }
    });

    el.querySelector('[data-act="run"]').addEventListener("click", () => this.run());
    el.querySelector('[data-act="reset"]').addEventListener("click", () => this.reset());
  }

  updateGutter() {
    const lines = this.ta.value.split("\n").length;
    let html = "";
    for (let i = 1; i <= lines; i++) html += i + "\n";
    this.gutterPre.textContent = html;
  }

  setCode(code) {
    this.ta.value = code;
    this.updateGutter();
  }
  getCode() { return this.ta.value; }

  reset() {
    this.ta.value = this.starter;
    this.updateGutter();
    this.outBox.style.display = "none";
  }

  async run() {
    const outText = this.outText;
    this.outBox.style.display = "block";
    this.outHead.className = "editor-out-head running";
    this.outHead.textContent = "";
    this.outText.classList.remove("err", "ok");

    if (!window.pyodide && !window.PyRunner.pyodide) {
      this.outHead.textContent = L("play.loading") + "  " + L("play.loadingHint");
    } else {
      this.outHead.textContent = "...";
    }

    const res = await PyRunner.run(this.ta.value);

    this.outHead.className = "editor-out-head";
    this.outHead.textContent = L("play.output");
    const text = res.output.join("\n");
    outText.textContent = text || "(пусто / empty)";
    if (res.cdn) {
      outText.classList.add("err");
      outText.textContent = L("editor.error_noframe");
    } else if (res.error) {
      outText.classList.add("err");
    }
  }

  async runAndReturn() {
    const res = await PyRunner.run(this.ta.value);
    return { output: res.output.join("\n"), ok: !res.error && !res.cdn, cdn: res.cdn };
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}