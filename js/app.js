function renderApp(q) {
  const view = document.getElementById("view");
  let html = `
    <div class="crumbs"><a href="#/home">${L("nav.home")}</a><span class="sep">/</span>${L("nav.playground")}</div>
    <h1 class="page-title">🛠 ${L("nav.playground")}</h1>
    <p class="page-sub">${L("play.sub")}</p>
    ${q ? `<div class="play-result"><b style="color:var(--accent2)">${T(q.title)}</b><pre class="muted" style="font-family:var(--mono);font-size:13px;white-space:pre-wrap">${escapeHtml(q.output)}</pre></div>` : ""}

    <div class="crumbs" style="margin:26px 0 0"><a href="#/home">${L("nav.home")}</a><span class="sep">/</span>${L("nav.playground")}</div>
    <h1 class="page-title">🛠 ${L("nav.playground")}</h1>
    <p class="page-sub">${L("play.sub")}</p>

    <div class="panel" style="margin-top:6px">
      <p class="muted" style="font-size:13.5px">${L("play.hint")}</p>
    </div>`;
  view.innerHTML = htmlpx;
}