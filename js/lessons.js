function renderLessonsList() {
  const view = document.getElementById("view");
  const done = App.progress.lessons || [];

  let html = `
    <div class="crumbs"><a href="#/home">${L("nav.home")}</a><span class="sep">/</span>${L("lessons.title")}</div>
    <h1 class="page-title">🐍 ${L("lessons.title")}</h1>
    <p class="page-sub">${L("lessons.sub")}</p>`;

  window.LESSONS.forEach(lesson => {
    const isDone = done.includes(lesson.id);
    html += `
      <div class="panel" style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center">
        <div style="min-width:0">
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
            <span class="badge purple">${lesson.id}</span>
            <h3 style="font-size:17px">${T(lesson.title)}</h3>
            ${isDone ? `<span class="badge green">✓ ${L("lessons.done")}</span>` : ""}
          </div>
          <p class="muted" style="margin-top:6px;font-size:14px">${T(lesson.subtitle)}</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0">
          <span style="font-size:13px;color:var(--muted)">⏱ ${lesson.duration}</span>
          <a class="btn primary small" href="#/lesson/${lesson.id}">${L("lessons.start")} →</a>
        </div>
      </div>`;
  });

  view.innerHTML = html;
}

function renderLessonDetail(id) {
  const lesson = window.LESSONS.find(l => l.id === id);
  const view = document.getElementById("view");
  if (!lesson) { App.navigate("#/lessons"); return; }

  const idx = window.LESSONS.indexOf(lesson);
  const prev = window.LESSONS[idx - 1];
  const next = window.LESSONS[idx + 1];
  const isDone = (App.progress.lessons || []).includes(lesson.id);

  let html = `
    <div class="crumbs">
      <a href="#/home">${L("nav.home")}</a><span class="sep">/</span>
      <a href="#/lessons">${L("nav.lessons")}</a><span class="sep">/</span>${T(lesson.title)}
    </div>
    <h1 class="page-title" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <span>${T(lesson.title)}</span>
      ${isDone ? `<span class="badge green">✓ ${L("lessons.done")}</span>` : ""}
    </h1>
    <p class="page-sub">${T(lesson.subtitle)} · ⏱ ${lesson.duration}</p>
    <div class="lesson-sections" id="lessonSections"></div>

    <div class="lesson-nav">
      ${prev ? `<a class="btn" href="#/lesson/${prev.id}">← ${T(prev.title).slice(0, 40)}</a>` : "<span></span>"}
      ${next ? `<a class="btn primary" href="#/lesson/${next.id}">${L("lessons.start")}: ${T(next.title).slice(0, 40)} →</a>` : "<span></span>"}
    </div>

    <div style="margin-top:28px;text-align:center">
      <button class="btn" id="markDoneBtn">${isDone ? L("lessons.unmarkDone") : L("lessons.markDone")}</button>
    </div>`;

  view.innerHTML = html;

  const sectionsEl = document.getElementById("lessonSections");
  lesson.sections.forEach(sec => renderLessonSection(sectionsEl, sec));

  document.getElementById("markDoneBtn").addEventListener("click", () => {
    if ((App.progress.lessons || []).includes(lesson.id)) {
      App.unmarkLesson(lesson.id);
    } else {
      App.markLesson(lesson.id);
    }
    renderLessonDetail(id);
  });
}

function renderLessonSection(el, sec) {
  switch (sec.type) {
    case "h2": {
      const h = document.createElement("h2");
      h.className = "section-title";
      h.textContent = T(sec.text);
      el.appendChild(h);
      break;
    }
    case "h3": {
      const h = document.createElement("h3");
      h.textContent = T(sec.text);
      el.appendChild(h);
      break;
    }
    case "p": {
      const p = document.createElement("p");
      p.textContent = T(sec.text);
      el.appendChild(p);
      break;
    }
    case "list": {
      const tag = sec.ordered ? "ol" : "ul";
      const list = document.createElement(tag);
      sec.items.forEach(it => {
        const li = document.createElement("li");
        li.textContent = T(it);
        list.appendChild(li);
      });
      el.appendChild(list);
      break;
    }
    case "tip": {
      const tip = document.createElement("div");
      tip.className = "panel";
      tip.style.borderLeft = "3px solid var(--accent2)";
      tip.style.background = "var(--bg2)";
      tip.innerHTML = `<b style="color:var(--accent2)">💡 ${L("tip")}</b><div style="margin-top:6px">${escapeHtml(T(sec.text))}</div>`;
      el.appendChild(tip);
      break;
    }
    case "table": {
      const table = document.createElement("table");
      table.className = "cheat";
      const thead = document.createElement("thead");
      const trh = document.createElement("tr");
      sec.header.forEach(h => {
        const th = document.createElement("th");
        th.textContent = T(h);
        trh.appendChild(th);
      });
      thead.appendChild(trh);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      sec.rows.forEach(row => {
        const tr = document.createElement("tr");
        row.forEach(cell => {
          const td = document.createElement("td");
          if (typeof cell === "string" && cell.includes("{{")) {
            td.innerHTML = cell; /* не используется, защита */
          }
          td.textContent = T(cell);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      el.appendChild(table);
      break;
    }
    case "code": {
      const wrap = document.createElement("div");
      el.appendChild(wrap);
      new PyEditor(wrap, {
        title: sec.title ? T(sec.title) : L("lessons.example"),
        code: sec.code
      });
      break;
    }
  }
}