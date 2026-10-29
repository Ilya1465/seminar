/* Мини-мир в духе Учи.ру, но со Scratch-блоками: герой на поле,
   скрипт собирается кликами по цветным блокам, «Играть» оживляет героя.
   Уровень проходит, когда герой доходит до звезды. */
(function () {
	'use strict';

	const BLOCKS = {
		forward: { text: 'вперёд', cat: 'motion' },
		left: { text: 'налево', cat: 'motion' },
		right: { text: 'направо', cat: 'motion' },
		repeat: { text: 'повторить', cat: 'control', loop: true },
		until: { text: 'пока не у звезды', cat: 'control', loop: true },
	};
	const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];  // вверх, вправо, вниз, влево
	const DIR_DEG = [0, 90, 180, 270];
	const MAX_STEPS = 300;
	const IMG = '/static/img/';
	const HERO_SCALE = 1.15;

	function cellIcon(cell, file, alt) {
		const img = document.createElement('img');
		img.className = 'sb-icon';
		img.src = IMG + file;
		img.alt = alt;
		img.draggable = false;
		cell.appendChild(img);
	}

	function chip(kind, extra) {
		const b = BLOCKS[kind];
		const el = document.createElement('span');
		el.className = 'sb sb-' + b.cat + ' sb-chip';
		el.textContent = b.text;
		if (extra) el.appendChild(extra);
		return el;
	}

	function buildGame(host, card) {
		const level = JSON.parse(card.dataset.level);
		const grid = level.grid;
		const H = grid.length, W = grid[0].length;

		host.innerHTML = '';
		const wrap = document.createElement('div');
		wrap.className = 'sb-game-wrap';

		// --- Поле ---
		const field = document.createElement('div');
		field.className = 'sb-field';
		field.style.gridTemplateColumns = 'repeat(' + W + ', 1fr)';
		const cells = [];
		for (let y = 0; y < H; y++) {
			for (let x = 0; x < W; x++) {
				const cell = document.createElement('div');
				cell.className = 'sb-cell';
				const c = grid[y][x];
				if (c === '#') { cell.classList.add('sb-tree'); cellIcon(cell, 'tree.svg', 'Дерево'); }
				if (c === 'G') { cell.classList.add('sb-goal'); cellIcon(cell, 'star.svg', 'Звезда'); }
				field.appendChild(cell);
				cells.push(cell);
			}
		}
		const hero = document.createElement('img');
		hero.className = 'sb-hero';
		hero.src = '/static/vendor/scratch/cat.svg';
		hero.alt = 'Кот Scratch';
		hero.draggable = false;
		field.appendChild(hero);

		// --- Правая часть: палитра и скрипт ---
		const side = document.createElement('div');
		side.className = 'sb-side';

		const palette = document.createElement('div');
		palette.className = 'sb-palette';
		const paletteTitle = document.createElement('p');
		paletteTitle.className = 'sb-palette-title';
		paletteTitle.textContent = 'Нажми на блок — он добавится в программу:';
		palette.appendChild(paletteTitle);

		const scriptBox = document.createElement('div');
		scriptBox.className = 'sb-program';

		const flagRow = document.createElement('div');
		flagRow.className = 'sb-flag';
		flagRow.textContent = '▶ когда нажат флаг';
		scriptBox.appendChild(flagRow);

		const script = document.createElement('div');
		script.className = 'sb-script-box';
		scriptBox.appendChild(script);

		const hint = document.createElement('p');
		hint.className = 'sb-status';
		hint.setAttribute('role', 'status');
		hint.textContent = 'Собери программу из блоков и нажми «Играть».';

		const controls = document.createElement('div');
		controls.className = 'sb-controls';
		const play = document.createElement('button');
		play.type = 'button';
		play.className = 'btn btn-primary sb-play';
		play.textContent = '▶ Играть';
		const reset = document.createElement('button');
		reset.type = 'button';
		reset.className = 'btn btn-default';
		reset.textContent = '⟲ Заново';
		controls.appendChild(play);
		controls.appendChild(reset);

		side.appendChild(palette);
		side.appendChild(scriptBox);
		side.appendChild(hint);
		side.appendChild(controls);
		wrap.appendChild(field);
		wrap.appendChild(side);
		host.appendChild(wrap);

		// --- Модель программы ---
		const root = { body: [] };
		let containerStack = [root];

		function current() { return containerStack[containerStack.length - 1]; }

		function renderScript() {
			script.innerHTML = '';
			renderInto(script, root.body, 0);
			if (!root.body.length) {
				const empty = document.createElement('p');
				empty.className = 'sb-empty';
				empty.textContent = 'Пока пусто. Добавь блоки слева.';
				script.appendChild(empty);
			}
			// Показать, куда попадут новые блоки.
			const old = script.querySelector('.sb-loopbar');
			if (old) old.remove();
			if (containerStack.length > 1) {
				const bar = document.createElement('p');
				bar.className = 'sb-loopbar';
				const leave = document.createElement('button');
				leave.type = 'button';
				leave.className = 'btn btn-default btn-xs';
				leave.textContent = 'Закрыть петлю';
				leave.addEventListener('click', () => { containerStack.pop(); renderScript(); });
				bar.appendChild(document.createTextNode('Блоки попадают внутрь петли. '));
				bar.appendChild(leave);
				script.appendChild(bar);
			}
		}

		function renderInto(box, list, depth) {
			list.forEach((item, i) => {
				const row = document.createElement('div');
				row.className = 'sb-row';
				row.style.paddingLeft = (depth * 18) + 'px';
				if (item.kind === 'repeat' || item.kind === 'until') {
					const head = document.createElement('div');
					head.className = 'sb-loop-head';
					const c = chip(item.kind);
					if (item.kind === 'repeat') {
						const num = document.createElement('input');
						num.className = 'sb-count';
						num.type = 'number';
						num.min = '2';
						num.max = '9';
						num.value = String(item.count);
						num.setAttribute('aria-label', 'Сколько раз повторить');
						num.addEventListener('click', e => e.stopPropagation());
						num.addEventListener('change', () => { item.count = Math.max(2, Math.min(9, Number(num.value) || 2)); });
						c.appendChild(document.createTextNode(' '));
						c.appendChild(num);
						c.appendChild(document.createTextNode(' раз'));
					}
					head.appendChild(c);
					const edit = document.createElement('button');
					edit.type = 'button';
					edit.className = 'sb-into';
					edit.textContent = '＋ сюда';
					edit.title = 'Добавлять блоки внутрь этой петли';
					edit.addEventListener('click', (e) => {
						e.stopPropagation();
						containerStack = [root, item];
						renderScript();
					});
					head.appendChild(edit);
					const del = document.createElement('button');
					del.type = 'button';
					del.className = 'sb-del';
					del.textContent = '×';
					del.title = 'Убрать блок';
					del.addEventListener('click', (e) => {
						e.stopPropagation();
						list.splice(i, 1);
						containerStack = [root];
						renderScript();
					});
					head.appendChild(del);
					row.appendChild(head);
					const inner = document.createElement('div');
					inner.className = 'sb-loop-body';
					renderInto(inner, item.body, depth + 1);
					row.appendChild(inner);
					const end = document.createElement('div');
					end.className = 'sb-loop-end';
					end.textContent = 'конец петли';
					end.style.paddingLeft = (depth * 18) + 'px';
					row.appendChild(end);
				} else {
					const c = chip(item.kind);
					c.classList.add('sb-in-script');
					c.title = 'Нажми, чтобы убрать';
					c.addEventListener('click', () => {
						list.splice(i, 1);
						renderScript();
					});
					row.appendChild(c);
				}
				box.appendChild(row);
			});
		}

		level.blocks.forEach(kind => {
			const c = chip(kind);
			c.classList.add('sb-palette-chip');
			c.title = 'Добавить в программу';
			c.addEventListener('click', () => {
				if (running) return;
				const item = { kind };
				if (kind === 'repeat') { item.count = 3; item.body = []; }
				if (kind === 'until') { item.body = []; }
				current().body.push(item);
				if (item.body) containerStack.push(item);
				renderScript();
			});
			palette.appendChild(c);
		});

		// --- Герой ---
		let hx = 0, hy = 0, hd = 1;
		function placeHero(animate) {
			const cell = cells[hy * W + hx];
			const fr = field.getBoundingClientRect();
			const cr = cell.getBoundingClientRect();
			const w = cr.width * HERO_SCALE, h = cr.height * HERO_SCALE;
			let left = cr.left - fr.left - (w - cr.width) / 2;
			let top = cr.top - fr.top - (h - cr.height) / 2;
			left = Math.max(0, Math.min(left, fr.width - w));
			top = Math.max(0, Math.min(top, fr.height - h));
			hero.style.left = left + 'px';
			hero.style.top = top + 'px';
			hero.style.width = w + 'px';
			hero.style.height = h + 'px';
			hero.style.transform = hd === 3 ? 'scaleX(-1)' : 'rotate(' + (DIR_DEG[hd] - 90) + 'deg)';
			hero.style.transition = animate ? 'left .35s ease, top .35s ease, transform .25s ease' : 'none';
		}
		function resetHero() {
			hx = level.start[0]; hy = level.start[1]; hd = level.dir;
			hero.classList.remove('sb-bump', 'sb-win');
			placeHero(false);
		}

		// --- Интерпретатор ---
		function expand(list, out, depth) {
			for (const item of list) {
				if (depth > 8 || out.length > MAX_STEPS) return;
				if (item.kind === 'repeat') {
					for (let k = 0; k < item.count; k++) expand(item.body, out, depth + 1);
				} else if (item.kind === 'until') {
					for (let k = 0; k < 50; k++) { expand(item.body, out, depth + 1); out.push({ kind: 'until-check' }); }
				} else {
					out.push(item);
				}
			}
		}

		let running = false;
		let timer = null;

		function stopFlags() {
			running = false;
			play.disabled = false;
			palette.classList.remove('sb-disabled');
		}

		function fail(text) {
			hero.classList.add('sb-bump');
			hint.textContent = text;
			hint.className = 'sb-status sb-fail';
			stopFlags();
		}

		function win() {
			hero.classList.add('sb-win');
			hint.textContent = 'Звезда взята! Уровень пройден.';
			hint.className = 'sb-status sb-ok';
			stopFlags();
			const card = host.closest('.trial-card');
			if (card) {
				card.dataset.done = '1';
				const player = card.closest('.lesson-player');
				if (player && player.tutorUpdate) player.tutorUpdate();
			}
		}

		function step(actions, i) {
			if (!running) return;
			if (i >= actions.length) {
				if (hx === level.goal[0] && hy === level.goal[1]) win();
				else fail('Программа закончилась, а звезда не взята. Поменяй блоки и попробуй ещё.');
				return;
			}
			const a = actions[i];
			if (a.kind === 'left') { hd = (hd + 3) % 4; placeHero(true); }
			else if (a.kind === 'right') { hd = (hd + 1) % 4; placeHero(true); }
			else if (a.kind === 'forward') {
				const nx = hx + DIRS[hd][0], ny = hy + DIRS[hd][1];
				if (nx < 0 || ny < 0 || nx >= W || ny >= H) { fail('Бух! Герой уехал за край поля.'); return; }
				if (grid[ny][nx] === '#') { fail('Столкновение с деревом! Объедь его.'); return; }
				hx = nx; hy = ny;
				placeHero(true);
				if (hx === level.goal[0] && hy === level.goal[1]) { timer = setTimeout(win, 420); return; }
			} else if (a.kind === 'until-check') {
				if (hx === level.goal[0] && hy === level.goal[1]) { win(); return; }
			}
			timer = setTimeout(() => step(actions, i + 1), 420);
		}

		play.addEventListener('click', () => {
			if (running) return;
			if (!root.body.length) { hint.textContent = 'Сначала добавь хотя бы один блок.'; return; }
			resetHero();
			running = true;
			play.disabled = true;
			palette.classList.add('sb-disabled');
			hint.textContent = 'Герой поехал…';
			hint.className = 'sb-status';
			const actions = [];
			expand(root.body, actions, 0);
			timer = setTimeout(() => step(actions, 0), 350);
		});
		reset.addEventListener('click', () => {
			running = false;
			if (timer) clearTimeout(timer);
			resetHero();
			stopFlags();
			hint.textContent = 'Собери программу из блоков и нажми «Играть».';
			hint.className = 'sb-status';
		});

		resetHero();
		renderScript();
		window.addEventListener('resize', () => placeHero(false));
	}

	document.addEventListener('DOMContentLoaded', () => {
		document.querySelectorAll('.trial-card[data-type="blocks"]').forEach(card => {
			const host = card.querySelector('.sb-game');
			if (host) buildGame(host, card);
		});
	});
})();
