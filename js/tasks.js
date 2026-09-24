function diffBadge(d) {
  if (d <= 1) return `<span class="badge green">${L("tasks.easy")}</span>`;
  if (d === 2) return `<span class="badge yellow">${L("tasks.diff")}</span>`;
  return `<span class="badge blue">${L("tasks.hard")}</span>`;
}

function renderTasksList() {
  const view = document.getElementById("view");
  const solved = App.progress.tasks || [];

  let html = `
    <div class="crumbs"><a href="#/home">${L("nav.home")}</a><span class="sep">/</span>${L("nav.tasks")}</div>
    <h1 class="page-title">🧩 ${L("tasks.title")}</h1>
    <p class="page-sub">${L("tasks.sub")}</p>`;

  window.TASKS.forEach(task => {
    const isDone = solved.includes(task.id);
    html += `
      <div class="card" style="cursor:default;flex-direction:row;align-items:center;justify-content:space-between;flex-wrap:wrap">
        <div style="display:flex;gap:12px;align-items:center;min-width:0">
          <span class="badge purple">${task.id}</span>
          <div style="min-width:0">
            <h3 style="font-size:16px">${T(task.title)}</h3>
            <div style="margin-top:4px">${diffBadge(task.difficulty)}</div>
          </div>
          ${isDone ? `<span class="badge green">✓ ${L("tasks.solved")}</span>` : ""}
        </div>
        <a class="btn primary small" href="#/task/${task.id}">${L("lessons.start")} →</a>
      </div>`;
  });

  view.innerHTML = html;
}

function renderTaskDetail(id) {
  const task = window.TASKS.find(t => t.id === id);
  const view = document.getElementById("view");
  if (!task) { App.navigate("#/tasks"); return; }

  const idx = window.TASKS.indexOf(task);
  const prev = window.TASKS[idx - 1];
  const next = window.TASKS[idx + 1];
  const isSolved = (App.progress.tasks || []).includes(task.id);

  let html = `
    <div class="crumbs">
      <a href="#/home">${L("nav.home")}</a><span class="sep">/</span>
      <a href="#/tasks">${L("nav.tasks")}</a><span class="sep">/</span>${task.id}
    </div>
    <div class="task-head">
      <h1 class="page-title" style="margin:0">
        ${task.id}. ${T(task.title)}
        ${isSolved ? `<span class="badge green">✓ ${L("tasks.solved")}</span>` : ""}
      </h1>
      ${diffBadge(task.difficulty)}
    </div>
    <pre class="task-desc" style="font-family:var(--sans);white-space:pre-wrap">${T(task.desc)}</pre>

    <div id="taskEditor"></div>

    <div style="margin-top:14px">
      <button class="btn primary" id="checkBtn">✅ ${L("tasks.check")}</button>
      <span style="font-size:13px;color:var(--muted);margin-left:10px" id="checkHint"></span>
    </div>
    <div id="resultZone"></div>

    <div class="lesson-nav">
      ${prev ? `<a class="btn" href="#/task/${prev.id}">← ${prev.id}. ${T(prev.title).slice(0, 40)}</a>` : "<span></span>"}
      ${next ? `<a class="btn primary" href="#/task/${next.id}">${next.id}. ${T(next.title).slice(0, 40)} →</a>` : "<span></span>"}
    </div>`;

  view.innerHTML = html;

  const editor = new PyEditor(document.getElementById("taskEditor"), {
    title: `${L("lessons.example")}: starter`,
    code: task.starter
  });

  const checkBtn = document.getElementById("checkBtn");
  const hint = document.getElementById("checkHint");
  const zone = document.getElementById("resultZone");

  checkBtn.addEventListener("click", async () => {
    checkBtn.disabled = true;
    hint.textContent = L("tasks.loading");
    const res = await PyRunner.run(editor.getCode());

    if (res.cdn) {
      hint.textContent = "";
      zone.innerHTML = `<div class="result-box wrong">${L("editor.error_noframe")}</div>`;
      checkBtn.disabled = false;
      return;
    }

    const got = res.output.join("\n");
    const ok = !res.error && compareOutput(got, task.expected);

    if (ok) {
      App.markTask(task.id);
      hint.textContent = "";
      zone.innerHTML = `
        <div class="result-box correct">🎉 ${L("tasks.correct")}</div>
        <div class="result-box" style="margin-top:10px">
          <b style="color:var(--accent2)">${L("tasks.expected")}</b>
          <pre class="diff exp" style="font-family:var(--mono)">${escapeHtml(task.expected)}</pre>
        </div>`;
    } else {
      hint.textContent = "";
      zone.innerHTML = `
        <div class="result-box wrong">😕 ${L("tasks.wrong")}</div>
        <div class="result-box" style="margin-top:10px">
          <b style="color:var(--green)">${L("tasks.expected")}</b>
          <pre class="diff exp" style="font-family:var(--mono)">${escapeHtml(task.expected)}</pre>
        </div>
        <div class="result-box" style="margin-top:10px">
          <b style="color:var(--red)">${L("tasks.yourOutput")}</b>
          <pre class="diff got" style="font-family:var(--mono)">${escapeHtml(got || "(пусто / empty)")}</pre>
        </div>`;
    }
    checkBtn.disabled = false;
  });
}