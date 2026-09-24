function renderCheatSheet(q) {
  const view = document.getElementById("view");
  q = (q || "").trim().toLowerCase();
  const blocks = window.CHEAT_SHEET;

  let html = `
    <div class="crumbs"><a href="#/home">${L("nav.home")}</a><span class="sep">/</span>${L("nav.cheat")}</div>
    <h1 class="page-title">📋 ${L("cheat.title")}</h1>
    <p class="page-sub">${L("cheat.sub")}</p>
    <div class="cheat-search">
      <input type="search" id="cheatSearch" placeholder="${L("cheat.search")}" value="${escapeHtml(q)}">
    </div>`;

  let anyMatch = false;

  blocks.forEach((block, bi) => {
    let rows;
    if (q) {
      rows = block.rows.filter(row =>
        row.some(cell => T(cell).toLowerCase().includes(q))
      );
    } else {
      rows = block.rows;
    }
    if (rows.length === 0) return;
    anyMatch = true;

    html += `
      <div class="cheat-block" id="block-${bi}">
        <h2 onclick="toggleCheatBlock(${bi})">${T(block.title)}</h2>
        <div class="cheat-body">
          ${tableHTML(block, rows)}
        </div>
      </div>`;
  });

  if (!anyMatch && q) {
    html += `<div class="empty">🔍 &laquo;${escapeHtml(q)}&raquo; — 0 ${L("nav.cheat").toLowerCase()}</div>`;
  }

  view.innerHTML = html;

  const input = document.getElementById("cheatSearch");
  if (input) {
    input.addEventListener("input", () => renderCheatSheet(input.value));
    if (q) input.focus();
  }
}

function tableHTML(block, rows) {
  const plainFirst = block.plainFirst;
  let h = `<table class="cheat"><thead><tr>`;
  block.headers.forEach(hd => { h += `<th>${T(hd)}</th>`; });
  h += `</tr></thead><tbody>`;
  rows.forEach(row => {
    h += `<tr>`;
    row.forEach((cell, ci) => {
      if (ci === 0 && !plainFirst) h += `<td><code>${escapeHtml(T(cell))}</code></td>`;
      else h += `<td>${escapeHtml(T(cell))}</td>`;
    });
    h += `</tr>`;
  });
  h += `</tbody></table>`;
  return h;
}

function toggleCheatBlock(bi) {
  const block = document.getElementById(`block-${bi}`);
  if (block) block.classList.toggle("collapsed");
}