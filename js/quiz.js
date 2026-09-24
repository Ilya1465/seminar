let QUIZ_STATE = null;

function renderQuiz() {
  const view = document.getElementById("view");
  const qs = window.QUIZ;
  const best = (App.progress.quiz || {})["main"] || null;

  let html = `
    <div class="crumbs"><a href="#/home">${L("nav.home")}</a><span class="sep">/</span>${L("nav.quiz")}</div>
    <h1 class="page-title">🧠 ${L("quiz.title")}</h1>
    <p class="page-sub">${L("quiz.sub")} · ${qs.length} ${L("home.stats.quiz")}</p>
    <div class="panel" style="text-align:center;padding:30px">
      <div style="font-size:40px">🧠</div>
      <p class="muted" style="margin:12px 0 4px">${qs.length} ${L("home.stats.quiz")} · ${Math.round(qs.length / 2)}‑${Math.round(qs.length / 2) + 1} ${L("quiz.question").toLowerCase()}s</p>
      ${best !== null ? `<p style="margin-top:8px"><span class="badge green">🏆 ${L("quiz.result")}: ${best}/${qs.length}</span></p>` : ""}
      <button class="btn primary" id="startQuiz" style="margin-top:18px">▶ ${L("lessons.start")}</button>
    </div>`;
  view.innerHTML = html;
  document.getElementById("startQuiz").addEventListener("click", () => startQuiz());
}

function startQuiz() {
  QUIZ_STATE = { qidx: 0, score: 0, answered: false, selected: null };
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const qs = window.QUIZ;
  const st = QUIZ_STATE;
  const q = qs[st.qidx];
  const view = document.getElementById("view");
  const total = qs.length;

  let html = `
    <div class="crumbs"><a href="#/home">${L("nav.home")}</a><span class="sep">/</span><a href="#/quiz">${L("nav.quiz")}</a><span class="sep">/</span>${st.qidx + 1}/${total}</div>
    <div class="quiz-meta">
      <div class="quiz-progress"><i style="width:${((st.qidx) / total) * 100}%"></i></div>
      <span class="quiz-score">${L("quiz.question")} ${st.qidx + 1} ${L("quiz.of")} ${total} · ✓ ${st.score}</span>
    </div>
    <div class="panel question">
      <p>${st.qidx + 1}. ${T(q.question)}</p>
      <div id="options"></div>
      <div id="quizResult"></div>
      <div style="margin-top:16px;display:flex;justify-content:flex-end">
        <button class="btn primary" id="quizActionBtn">${L("quiz.answer")}</button>
      </div>
    </div>`;
  view.innerHTML = html;

  const optsEl = document.getElementById("options");
  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "option";
    b.textContent = String.fromCharCode(65 + i) + ")  " + T(opt);
    b.dataset.i = i;
    b.addEventListener("click", () => {
      if (st.answered) return;
      st.selected = i;
      optsEl.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
      b.classList.add("selected");
    });
    optsEl.appendChild(b);
  });

  const btn = document.getElementById("quizActionBtn");
  btn.addEventListener("click", () => {
    if (!st.answered) {
      if (st.selected === null) { showToast(L("quiz.answer") + "?"); return; }
      verifyQuizAnswer();
    } else {
      st.answered = false;
      st.selected = null;
      st.qidx++;
      if (st.qidx >= total) renderQuizResult();
      else renderQuizQuestion();
    }
  });
}

function verifyQuizAnswer() {
  const st = QUIZ_STATE;
  const q = window.QUIZ[st.qidx];
  st.answered = true;

  const opts = Array.from(document.querySelectorAll(".option"));
  opts.forEach((o, i) => {
    o.disabled = true;
    if (i === q.answer) o.classList.add("correct");
    if (i === st.selected && i !== q.answer) o.classList.add("wrong");
  });

  const correct = st.selected === q.answer;
  if (correct) st.score++;

  const zone = document.getElementById("quizResult");
  zone.innerHTML = `
    <div class="explanation">
      <b>${correct ? "✅ " + L("quiz.correct") : "❌ " + L("quiz.wrong")}</b>
      <div style="margin-top:8px"><b>${L("quiz.explanation")}:</b> ${T(q.explanation)}</div>
    </div>`;

  showToast(correct ? L("quiz.correct") : L("quiz.wrong"));
  const btn = document.getElementById("quizActionBtn");
  btn.textContent = L("quiz.next");
}

function renderQuizResult() {
  const total = window.QUIZ.length;
  const st = QUIZ_STATE;
  const pct = Math.round((st.score / total) * 100);
  App.saveQuizScore("main", st.score, total);

  let msg;
  if (pct >= 80) msg = L("quiz.message.good");
  else if (pct >= 50) msg = L("quiz.message.mid");
  else msg = L("quiz.message.bad");

  const view = document.getElementById("view");
  view.innerHTML = `
    <div class="crumbs"><a href="#/home">${L("nav.home")}</a><span class="sep">/</span><a href="#/quiz">${L("nav.quiz")}</a></div>
    <div class="panel quiz-result">
      <div style="font-size:40px">💰</div>
      <div class="big">${st.score} / ${total}</div>
      <div class="sub">${pct}%</div>
      <p style="margin-top:16px;font-size:17px">${msg}</p>
      <button class="btn primary" id="againBtn">🔄 ${L("quiz.restart")}</button>
      <a class="btn" href="#/quiz" style="margin-left:8px">${L("back")}</a>
    </div>`;
  document.getElementById("againBtn").addEventListener("click", startQuiz);
}