/* Студия «Мир героя»: поле + оригинальные блоки Scratch (scratchblocks, MIT).
   Блоки перетаскиваются мышью как в Scratch, числа и сенсоры редактируются,
   кот ходит с анимацией походки, Робик комментирует. Прогресс — локально. */
(function () {
	'use strict';

	const IMG = '/static/img/';
	const CAT_IDLE = '/static/vendor/scratch/cat.svg';
	const CAT_WALK = '/static/vendor/scratch/cat-walk.svg';
	const DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]];
	const DIR_DEG = [0, 90, 180, 270];
	const MAX_STEPS = 600;
	const MAX_UNTIL = 60;
	const HERO_SCALE = 1.15;
	const FACES = {
		'🤖': IMG + 'robot.svg', '👆': IMG + 'robot.svg', '🔧': IMG + 'robot.svg',
		'🎉': IMG + 'robot-happy.svg', '⭐': IMG + 'robot-happy.svg',
		'😅': IMG + 'robot-think.svg', '🤔': IMG + 'robot-think.svg',
		'💥': IMG + 'robot-think.svg', '🌲': IMG + 'robot-think.svg',
		'🐱': CAT_IDLE,
	};
	const SENSOR_MENU = {
		star: 'звезда',
		tree: 'дерево',
		edge: 'край',
	};
	const PALETTE_TEXT = {
		forward: 'Движение вперёд — число шагов можно менять.',
		left: 'Поворот налево — 90, 180 или 270 градусов.',
		right: 'Поворот направо — 90, 180 или 270 градусов.',
		repeat: 'Петля: повторить вложенные блоки несколько раз.',
		until: 'Петля с сенсором: повторять, пока условие не сработает.',
		if: 'Проверка сенсора: выполнить блоки, только если условие верно.',
		say: 'Кот скажет фразу — текст можно менять.',
		think: 'Кот подумает вслух — облачко мысли.',
		hide: 'Кот прячется с поля.',
		show: 'Кот появляется снова.',
		costume: 'Следующий костюм — кот меняет цвет.',
		meow: 'Настоящее «мяу» из Scratch.',
		wait: 'Пауза — кот ждёт указанное число секунд.',
		score: 'Счёт: прибавляет очки к счётчику над полем.',
	};
	const COSTUMES = [
		'',
		'hue-rotate(110deg) ',
		'hue-rotate(230deg) ',
	];

	function cellIcon(cell, file, alt) {
		const img = document.createElement('img');
		img.className = 'sb-icon';
		img.src = IMG + file;
		img.alt = alt;
		img.draggable = false;
		cell.appendChild(img);
	}

	async function boot() {
		const field = document.getElementById('studio-field');
		if (!field || !window.SCRATCH_LEVEL || !window.scratchblocks) return;
		const level = window.SCRATCH_LEVEL;

		/* Официальный русский словарь из пакета scratchblocks + формулировки
		   Scratch 3.0 для наших блоков. */
		function setupRussian() {
			return fetch('/static/vendor/scratchblocks/ru.json').then(r => r.json()).then(ru => {
				Object.assign(ru.commands, {
					'EVENT_WHENFLAGCLICKED': 'когда @greenFlag нажат',
					'MOTION_MOVESTEPS': 'двигаться на %1 шагов',
					'MOTION_TURNRIGHT': 'повернуть @turnRight на %1 градусов',
					'MOTION_TURNLEFT': 'повернуть @turnLeft на %1 градусов',
					'CONTROL_REPEAT': 'повторить %1',
					'CONTROL_REPEATUNTIL': 'повторять пока не %1',
					'CONTROL_IF': 'если %1 то',
					'CONTROL_WAIT': 'ждать %1 секунд',
					'SENSING_TOUCHINGOBJECT': 'касается %1 ?',
					'LOOKS_SAY': 'сказать %1',
					'LOOKS_THINK': 'думать %1',
					'LOOKS_HIDE': 'спрятаться',
					'LOOKS_SHOW': 'показаться',
					'LOOKS_NEXTCOSTUME': 'следующий костюм',
					'SOUND_PLAY': 'включить звук %1',
					'DATA_CHANGEVARIABLEBY': 'изменить %1 на %2',
				});
				scratchblocks.loadLanguages({ ru });
			});
		}

		/* ---------- Рендер настоящих блоков ---------- */

		let renderHolder = null;
		function renderCode(code) {
			if (!renderHolder) {
				renderHolder = document.createElement('div');
				renderHolder.hidden = true;
				document.body.appendChild(renderHolder);
			}
			const el = document.createElement('div');
			el.className = 'sb-src';
			el.textContent = code;
			renderHolder.appendChild(el);
			scratchblocks.renderMatching('.sb-src', { style: 'scratch3', languages: ['ru', 'en'], scale: 0.72 });
			renderHolder.innerHTML = '';
			return el.firstChild;
		}
		function sensorCode(s) {
			return '<касается (' + (SENSOR_MENU[s] || 'звезда') + ' v) ?>';
		}
		function itemCode(item) {
			if (item.kind === 'forward') return 'двигаться на (' + (item.steps || 1) + ') шагов';
			if (item.kind === 'left') return 'повернуть @turnLeft на (' + (item.deg || 90) + ') градусов';
			if (item.kind === 'right') return 'повернуть @turnRight на (' + (item.deg || 90) + ') градусов';
			if (item.kind === 'say') return 'сказать [' + (item.text || 'Привет!') + ']';
			if (item.kind === 'think') return 'думать [' + (item.text || 'Хмм…') + ']';
			if (item.kind === 'hide') return 'спрятаться';
			if (item.kind === 'show') return 'показаться';
			if (item.kind === 'costume') return 'следующий костюм';
			if (item.kind === 'meow') return 'включить звук (мяу v)';
			if (item.kind === 'wait') return 'ждать (' + (item.secs || 1) + ') секунд';
			if (item.kind === 'score') return 'изменить (счёт v) на (' + (item.delta || 1) + ')';
			if (isLoop(item)) {
				const head = item.kind === 'repeat' ? 'повторить (' + (item.count || 3) + ')'
					: item.kind === 'until' ? 'повторять пока не ' + sensorCode(item.sensor)
					: 'если ' + sensorCode(item.sensor) + ' то';
				const inner = (item.body || []).map(itemCode).map(t => '  ' + t.replace(/\n/g, '\n  ')).join('\n');
				return inner ? head + '\n' + inner + '\nконец' : head + '\nконец';
			}
			return '';
		}
		function isLoop(item) {
			return item.kind === 'repeat' || item.kind === 'until' || item.kind === 'if';
		}

		/* ---------- Поле ---------- */

		const grid = level.grid;
		const H = grid.length, W = grid[0].length;
		const goals = level.goal;

		const fieldEl = document.createElement('div');
		fieldEl.className = 'sb-field sb-field-studio';
		fieldEl.style.gridTemplateColumns = 'repeat(' + W + ', 1fr)';
		const cells = [];
		for (let y = 0; y < H; y++) {
			for (let x = 0; x < W; x++) {
				const cell = document.createElement('div');
				cell.className = 'sb-cell';
				const c = grid[y][x];
				if (c === '#') { cell.classList.add('sb-tree'); cellIcon(cell, 'tree.svg', 'Дерево'); }
				if (c === 'G') { cell.classList.add('sb-goal'); cellIcon(cell, 'star.svg', 'Звезда'); }
				fieldEl.appendChild(cell);
				cells.push(cell);
			}
		}
		// Дорожка решения — как пунктир у Учи.ру: подсвечена на первых уроках.
		if (level.show_path && level.path) {
			level.path.forEach(cell => { cells[cell[1] * W + cell[0]].classList.add('sb-path'); });
		}
		const hero = document.createElement('img');
		hero.className = 'sb-hero';
		hero.src = CAT_IDLE;
		hero.alt = 'Кот Scratch';
		hero.draggable = false;
		fieldEl.appendChild(hero);
		field.appendChild(fieldEl);

		// Облачко речи/мысли над котом и счётчик очков под полем.
		const bubble = document.createElement('div');
		bubble.className = 'sb-say';
		bubble.hidden = true;
		fieldEl.appendChild(bubble);
		let bubbleTimer = null;
		function sayBubble(text, thinking) {
			bubble.textContent = text;
			bubble.className = thinking ? 'sb-say sb-think' : 'sb-say';
			bubble.hidden = false;
			const cell = cells[hy * W + hx];
			const fr = fieldEl.getBoundingClientRect();
			const cr = cell.getBoundingClientRect();
			bubble.style.left = Math.max(0, Math.min(fr.width - 60, cr.left - fr.left + cr.width * 0.4)) + 'px';
			bubble.style.top = Math.max(0, cr.top - fr.top - 10) + 'px';
			if (bubbleTimer) clearTimeout(bubbleTimer);
			bubbleTimer = setTimeout(() => { bubble.hidden = true; }, 1700);
		}
		const scoreChip = document.createElement('div');
		scoreChip.className = 'sb-score';
		scoreChip.hidden = true;
		scoreChip.innerHTML = 'Счёт: <b>0</b>';
		field.parentNode.insertBefore(scoreChip, field.nextSibling);
		let scoreVal = 0;
		function addScore(d) {
			scoreVal += d;
			scoreChip.hidden = false;
			scoreChip.querySelector('b').textContent = scoreVal;
			scoreChip.classList.remove('sb-score-pop');
			void scoreChip.offsetWidth;
			scoreChip.classList.add('sb-score-pop');
		}
		let meowAudio = null;
		function playMeow() {
			try {
				if (!meowAudio) meowAudio = new Audio('/static/vendor/scratch/meow.wav');
				meowAudio.currentTime = 0;
				meowAudio.play().catch(() => {});
			} catch (_) {}
		}
		let costumeIdx = 0;
		function nextCostume() {
			costumeIdx = (costumeIdx + 1) % COSTUMES.length;
			hero.style.filter = COSTUMES[costumeIdx] + 'drop-shadow(0 3px 4px rgba(0, 0, 0, .25))';
		}

		let hx = 0, hy = 0, hd = 1;
		let walkFrame = false;
		function placeHero(animate) {
			const cell = cells[hy * W + hx];
			const fr = fieldEl.getBoundingClientRect();
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
		function animateStep() {
			// Походка: чередуем кадры кота и добавляем подскок.
			walkFrame = !walkFrame;
			hero.src = walkFrame ? CAT_WALK : CAT_IDLE;
			hero.classList.remove('sb-hop');
			void hero.offsetWidth;
			hero.classList.add('sb-hop');
		}
		function resetHero() {
			hx = level.start[0]; hy = level.start[1]; hd = level.dir;
			hero.classList.remove('sb-bump', 'sb-win', 'sb-hop');
			hero.src = CAT_IDLE;
			hero.style.opacity = '1';
			costumeIdx = 0;
			hero.style.filter = '';
			bubble.hidden = true;
			scoreVal = 0;
			scoreChip.hidden = true;
			scoreChip.querySelector('b').textContent = '0';
			cells.forEach(c => {
				if (c.dataset.collected) {
					const img = c.querySelector('img');
					if (img) img.classList.remove('sb-star-taken');
					delete c.dataset.collected;
				}
			});
			placeHero(false);
		}
		window.addEventListener('resize', () => placeHero(false));

		/* ---------- Модель программы ---------- */

		const root = { body: [] };
		const program = document.getElementById('studio-program');
		const palette = document.getElementById('studio-palette');
		const status = document.getElementById('studio-status');
		program._list = root.body;

		function newItem(kind) {
			if (kind === 'forward') return { kind, steps: 1 };
			if (kind === 'left' || kind === 'right') return { kind, deg: 90 };
			if (kind === 'repeat') return { kind, count: 3, body: [] };
			if (kind === 'until') return { kind, sensor: 'star', body: [] };
			if (kind === 'if') return { kind, sensor: 'tree', body: [] };
			if (kind === 'say') return { kind, text: 'Привет!' };
			if (kind === 'think') return { kind, text: 'Хмм…' };
			if (kind === 'wait') return { kind, secs: 1 };
			if (kind === 'score') return { kind, delta: 1 };
			return { kind };
		}

		/* ---------- Поля прямо внутри блоков (оверлеи поверх SVG) ---------- */

		function placeOverlay(el, rectEl, wrap) {
			const wr = wrap.getBoundingClientRect();
			const rr = rectEl.getBoundingClientRect();
			el.style.left = (rr.left - wr.left) + 'px';
			el.style.top = (rr.top - wr.top) + 'px';
			el.style.width = rr.width + 'px';
			el.style.height = rr.height + 'px';
			el.style.fontSize = Math.max(10, rr.height * 0.44) + 'px';
			wrap.appendChild(el);
		}
		function overlayNum(rectEl, wrap, value, min, max, snap, apply) {
			const inp = document.createElement('input');
			inp.className = 'sb-ov sb-ov-num';
			inp.type = 'number';
			inp.min = min; inp.max = max;
			inp.value = value;
			inp.setAttribute('aria-label', 'Число в блоке');
			inp.addEventListener('pointerdown', e => e.stopPropagation());
			inp.addEventListener('click', e => e.stopPropagation());
			inp.addEventListener('change', () => {
				let v = Math.max(min, Math.min(max, Number(inp.value) || min));
				if (snap) v = Math.max(min, Math.min(max, Math.round(v / snap) * snap));
				inp.value = v;
				apply(v);
			});
			placeOverlay(inp, rectEl, wrap);
		}
		function overlaySensor(rectEl, wrap, value, apply) {
			const sel = document.createElement('select');
			sel.className = 'sb-ov sb-ov-sel';
			sel.setAttribute('aria-label', 'Сенсор в блоке');
			Object.keys(SENSOR_MENU).forEach(key => {
				const opt = document.createElement('option');
				opt.value = key;
				opt.textContent = SENSOR_MENU[key];
				sel.appendChild(opt);
			});
			sel.value = value;
			sel.addEventListener('pointerdown', e => e.stopPropagation());
			sel.addEventListener('click', e => e.stopPropagation());
			sel.addEventListener('change', () => apply(sel.value));
			placeOverlay(sel, rectEl, wrap);
		}
		function overlayStr(rectEl, wrap, value, apply) {
			const inp = document.createElement('input');
			inp.className = 'sb-ov sb-ov-str';
			inp.type = 'text';
			inp.maxLength = 24;
			inp.value = value;
			inp.setAttribute('aria-label', 'Текст в блоке');
			inp.addEventListener('pointerdown', e => e.stopPropagation());
			inp.addEventListener('click', e => e.stopPropagation());
			inp.addEventListener('change', () => { apply(inp.value.trim() || value); });
			placeOverlay(inp, rectEl, wrap);
		}
		function collectParams(item, numItems, dropItems, strItems) {
			if (item.kind === 'forward' || item.kind === 'left' || item.kind === 'right' || item.kind === 'repeat'
				|| item.kind === 'wait' || item.kind === 'score') numItems.push(item);
			if (item.kind === 'until' || item.kind === 'if') dropItems.push(item);
			if (item.kind === 'say' || item.kind === 'think') strItems.push(item);
			(item.body || []).forEach(ch => collectParams(ch, numItems, dropItems, strItems));
		}
		function attachOverlays(wrap, item) {
			// Поля внутри SVG идут в том же порядке, что и обход дерева блоков.
			const nums = wrap.querySelectorAll('rect.sb3-input-number');
			const drops = wrap.querySelectorAll('rect.sb3-input-number-dropdown');
			const strs = wrap.querySelectorAll('rect.sb3-input-string');
			const numItems = [], dropItems = [], strItems = [];
			collectParams(item, numItems, dropItems, strItems);
			numItems.forEach((it, i) => {
				if (!nums[i]) return;
				if (it.kind === 'forward') overlayNum(nums[i], wrap, it.steps, 1, 9, 0, v => { it.steps = v; renderProgram(); });
				else if (it.kind === 'left' || it.kind === 'right') overlayNum(nums[i], wrap, it.deg, 90, 270, 90, v => { it.deg = v; renderProgram(); });
				else if (it.kind === 'repeat') overlayNum(nums[i], wrap, it.count, 2, 9, 0, v => { it.count = v; renderProgram(); });
				else if (it.kind === 'wait') overlayNum(nums[i], wrap, it.secs, 1, 3, 0, v => { it.secs = v; renderProgram(); });
				else if (it.kind === 'score') overlayNum(nums[i], wrap, it.delta, 1, 5, 0, v => { it.delta = v; renderProgram(); });
			});
			dropItems.forEach((it, i) => {
				if (drops[i]) overlaySensor(drops[i], wrap, it.sensor, v => { it.sensor = v; renderProgram(); });
			});
			strItems.forEach((it, i) => {
				if (strs[i]) overlayStr(strs[i], wrap, it.text, v => { it.text = v; renderProgram(); });
			});
		}

		/* Удаление вложенного блока: два клика по нему внутри петли. */
		let pendingDel = null;
		function clearPending() {
			if (pendingDel) {
				clearTimeout(pendingDel.t);
				pendingDel.path.style.filter = '';
				pendingDel = null;
			}
		}
		function blockPaths(wrap) {
			return Array.from(wrap.querySelectorAll('path')).filter(p => {
				if (p.closest('defs')) return false;
				return /^sb3-(motion|control|events|looks|sound|variables|operators)$/.test((p.getAttribute('class') || '').trim());
			});
		}
		function pathIndexAt(paths, x, y) {
			let best = -1, bestArea = Infinity;
			paths.forEach((p, i) => {
				const r = p.getBoundingClientRect();
				if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
					const area = r.width * r.height;
					if (area < bestArea) { bestArea = area; best = i; }
				}
			});
			return best;
		}
		function flattenItems(item, list, out) {
			out.push({ item, list });
			(item.body || []).forEach(ch => flattenItems(ch, item.body, out));
		}
		function attachLoopClick(wrap) {
			wrap.addEventListener('click', (e) => {
				if (suppressClick || e.target.closest('input, select, button')) return;
				const paths = blockPaths(wrap);
				if (paths.length < 2) return;
				const i = pathIndexAt(paths, e.clientX, e.clientY);
				if (i <= 0) { clearPending(); return; }  // голова петли — не трогаем
				if (pendingDel && pendingDel.wrap === wrap && pendingDel.i === i) {
					clearPending();
					const flat = [];
					flattenItems(wrap._item, null, flat);
					const entry = flat[i];
					if (entry && entry.list) {
						const k = entry.list.indexOf(entry.item);
						if (k !== -1) entry.list.splice(k, 1);
					}
					renderProgram();
					say('Блок убран из петли.', '🔧');
				} else {
					clearPending();
					paths[i].style.filter = 'brightness(1.35) saturate(1.25)';
					pendingDel = { wrap, i, path: paths[i], t: setTimeout(clearPending, 2600) };
					say('Нажми ещё раз — и я уберу этот блок из петли.', '🤖');
				}
			});
		}
		function delButton(list, item) {
			const del = document.createElement('button');
			del.type = 'button';
			del.className = 'blk-del';
			del.textContent = '×';
			del.title = 'Убрать блок';
			del.addEventListener('click', (e) => {
				e.stopPropagation();
				const i = list.indexOf(item);
				if (i !== -1) list.splice(i, 1);
				renderProgram();
			});
			return del;
		}

		/* ---------- Рендер программы ---------- */

		function renderItem(item, list) {
			const wrap = document.createElement('div');
			wrap.className = 'sb-item' + (isLoop(item) ? ' sb-loop' : '');
			wrap._item = item;
			wrap.appendChild(renderCode(itemCode(item)));
			if (list) wrap.appendChild(delButton(list, item));
			if (list) attachDrag(wrap, { el: wrap, item, sourceList: list });
			if (list && isLoop(item)) attachLoopClick(wrap);
			return wrap;
		}

		function renderList(container, list) {
			list.forEach(item => container.appendChild(renderItem(item, list)));
		}

		function renderProgram() {
			program.innerHTML = '';
			renderList(program, root.body);
			// Оверлеи меряются по экрану — только когда всё уже в DOM.
			program.querySelectorAll('.sb-item').forEach(w => { if (w._item) attachOverlays(w, w._item); });
			if (!root.body.length) {
				const empty = document.createElement('p');
				empty.className = 'sb-empty';
				empty.textContent = 'Пока пусто. Перетащи сюда блоки из палитры выше.';
				program.appendChild(empty);
			}
		}

		/* ---------- Перетаскивание (как в Scratch) ---------- */

		let drag = null;
		let ghost = null;
		let suppressClick = false;
		const marker = document.createElement('div');
		marker.className = 'blk-drop-marker';

		function attachDrag(el, opts) {
			el.addEventListener('pointerdown', (e) => {
				if (running) return;
				if (e.target.closest('input, select, button')) return;
				e.preventDefault();
				beginDrag(e, opts);
			});
		}
		function beginDrag(e, opts) {
			if (drag) return;
			drag = Object.assign({ x0: e.clientX, y0: e.clientY, moved: false }, opts);
			document.addEventListener('pointermove', onDragMove);
			document.addEventListener('pointerup', onDragUp, { once: true });
		}
		function onDragMove(e) {
			if (!drag) return;
			if (!drag.moved) {
				if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 6) return;
				drag.moved = true;
				ghost = drag.el.cloneNode(true);
				ghost.classList.add('blk-ghost');
				ghost.style.width = drag.el.offsetWidth + 'px';
				document.body.appendChild(ghost);
				if (drag.sourceList) drag.el.style.display = 'none';
			}
			ghost.style.left = (e.clientX - 18) + 'px';
			ghost.style.top = (e.clientY - 14) + 'px';
			showMarker(e.clientX, e.clientY);
		}
		function onDragUp(e) {
			document.removeEventListener('pointermove', onDragMove);
			const state = drag;
			drag = null;
			cleanupDrag();
			if (!state) return;
			if (!state.moved) {
				// Просто клик по палитре — добавить в конец программы (удобно на тачах).
				if (!state.sourceList && state.kind) {
					root.body.push(newItem(state.kind));
					renderProgram();
					say('Блок добавлен! ' + (PALETTE_TEXT[state.kind] || ''));
					if (state.kind === 'repeat' || state.kind === 'until' || state.kind === 'if') {
						say('Блок добавлен! Перетащи другие блоки прямо внутрь петли. Два клика по блоку внутри — убрать его.', '👆');
					}
				}
				return;
			}
			suppressClick = true;
			setTimeout(() => { suppressClick = false; }, 80);
			const target = dropTargetAt(e.clientX, e.clientY);
			if (target) {
				let item;
				if (state.sourceList) {
					item = state.item;
					const from = state.sourceList.indexOf(item);
					if (from !== -1) state.sourceList.splice(from, 1);
					let index = target.index;
					if (target.list === state.sourceList && from !== -1 && from < index) index--;
					target.list.splice(index, 0, item);
				} else {
					target.list.splice(target.index, 0, newItem(state.kind));
				}
				clearPending();
				renderProgram();
			} else if (state.sourceList) {
				// Вынесли за пределы программы — убрать блок.
				const from = state.sourceList.indexOf(state.item);
				if (from !== -1) state.sourceList.splice(from, 1);
				renderProgram();
				say('Блок убран из программы.');
			}
		}
		function cleanupDrag() {
			if (ghost) { ghost.remove(); ghost = null; }
			if (marker.parentNode) marker.parentNode.removeChild(marker);
			program.querySelectorAll('.sb-item').forEach(b => { b.style.display = ''; b.classList.remove('sb-drop-into'); });
		}
		function dropTargetAt(x, y) {
			const el = document.elementFromPoint(x, y);
			if (!el) return null;
			// Бросок на петлю — положить внутрь неё.
			const loopItem = el.closest('.sb-item.sb-loop');
			if (loopItem && loopItem.style.display !== 'none' && !loopItem.classList.contains('sb-palette-item') && loopItem._item) {
				return { list: loopItem._item.body, index: loopItem._item.body.length, loopEl: loopItem };
			}
			const box = el.closest('.studio-script');
			if (!box) return null;
			const kids = Array.from(program.children).filter(c => c.classList && c.classList.contains('sb-item') && c.style.display !== 'none');
			let index = kids.length;
			for (let k = 0; k < kids.length; k++) {
				const r = kids[k].getBoundingClientRect();
				if (y < r.top + r.height / 2) { index = k; break; }
			}
			return { list: root.body, index, container: program };
		}
		function showMarker(x, y) {
			if (marker.parentNode) marker.parentNode.removeChild(marker);
			program.querySelectorAll('.sb-drop-into').forEach(b => b.classList.remove('sb-drop-into'));
			const target = dropTargetAt(x, y);
			if (!target) return;
			if (target.loopEl) { target.loopEl.classList.add('sb-drop-into'); return; }
			const kids = Array.from(target.container.children).filter(c => c.classList && c.classList.contains('sb-item') && c.style.display !== 'none');
			target.container.insertBefore(marker, kids[target.index] || null);
		}

		await setupRussian().catch(e => console.error('RU setup failed:', e));

		/* ---------- Палитра ---------- */

		level.blocks.forEach(kind => {
			const el = document.createElement('div');
			el.className = 'sb-item sb-palette-item';
			el.title = PALETTE_TEXT[kind] || '';
			el.appendChild(renderCode(itemCode(newItem(kind))));
			palette.appendChild(el);
			attachDrag(el, { el, kind });
		});

		/* Флаг-шапка программы. */
		document.getElementById('studio-flag').appendChild(renderCode('когда @greenFlag нажат'));

		/* ---------- Робик ---------- */

		const buddyBubble = document.getElementById('buddy-bubble');
		const buddyFace = document.getElementById('buddy-face');
		function say(text, face) {
			buddyBubble.textContent = text;
			if (face) buddyFace.src = FACES[face] || FACES['🤖'];
			buddyBubble.parentElement.classList.remove('buddy-pop');
			void buddyBubble.parentElement.offsetWidth;
			buddyBubble.parentElement.classList.add('buddy-pop');
		}
		function praise() {
			say('Ура! Звезда наша! Ты настоящий программист!', '🎉');
			// Если локальная модель уже загружена — пусть похвалит по-особенному.
			try {
				if (window.TutorLocalAI && window.TutorLocalAI.isLoaded && window.TutorLocalAI.isLoaded()) {
					window.TutorLocalAI.answer('Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC', {
						question: 'Скажи одну короткую весёлую фразу похвалы ребёнку, который только что прошёл уровень по программированию. Одно предложение, по-русски, без кода.',
						code: '', context: 'Игровой уровень по блочному программированию пройден.', turns: [], solved: true,
					}).then(text => { if (text) say(text.trim().split('\n')[0], '🎉'); }).catch(() => {});
				}
			} catch (_) {}
		}

		/* ---------- Исполнитель: очередь команд ---------- */

		function sensorValue(s) {
			const ax = hx + DIRS[hd][0], ay = hy + DIRS[hd][1];
			if (s === 'star') {
				return goals.some(g => g[0] === hx && g[1] === hy) || !!cells[hy * W + hx].dataset.collected;
			}
			if (s === 'tree') return ax >= 0 && ay >= 0 && ax < W && ay < H && grid[ay][ax] === '#';
			if (s === 'edge') return ax < 0 || ay < 0 || ax >= W || ay >= H;
			return false;
		}

		let running = false;
		let timer = null;
		let queue = [];
		let stepsDone = 0;
		const play = document.getElementById('studio-play');
		const reset = document.getElementById('studio-reset');

		function allGoals() { return goals.every(g => cells[g[1] * W + g[0]].dataset.collected); }

		function collectIfGoal() {
			const cell = cells[hy * W + hx];
			if (goals.some(g => g[0] === hx && g[1] === hy) && !cell.dataset.collected) {
				cell.dataset.collected = '1';
				const img = cell.querySelector('img');
				if (img) img.classList.add('sb-star-taken');
				say(goals.length > 1 && !allGoals() ? 'Звезда есть! А впереди ещё…' : 'Последняя звезда!', '⭐');
			}
		}

		function stopFlags() {
			running = false;
			play.disabled = false;
			palette.parentElement.classList.remove('sb-disabled');
		}

		function fail(text, face) {
			hero.classList.add('sb-bump');
			say(text, face || '😅');
			status.textContent = text;
			status.className = 'sb-fail';
			stopFlags();
		}

		function win() {
			hero.classList.add('sb-win');
			status.textContent = 'Уровень пройден!';
			status.className = 'sb-ok';
			stopFlags();
			praise();
			try {
				const solved = JSON.parse(localStorage.getItem('scratch-solved') || '[]');
				if (solved.indexOf(level.slug) === -1) {
					solved.push(level.slug);
					localStorage.setItem('scratch-solved', JSON.stringify(solved));
				}
			} catch (_) {}
			const winBox = document.getElementById('studio-win');
			if (winBox) {
				const used = countBlocks(root.body);
				const winText = document.getElementById('studio-win-text');
				if (winText) {
					winText.textContent = used <= level.par
						? 'Идеально: ты уложился в ' + pluralBlocks(used) + ' (цель — ' + level.par + ')!'
						: 'Получилось! Блоков: ' + used + '. Попробуй уложиться в ' + level.par + ' — так программы короче.';
				}
				winBox.hidden = false;
			}
		}
		function pluralBlocks(n) {
			const m10 = n % 10, m100 = n % 100;
			if (m10 === 1 && m100 !== 11) return n + ' блок';
			if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return n + ' блока';
			return n + ' блоков';
		}
		function countBlocks(list) {
			let n = 0;
			for (const item of list) {
				n++;
				if (item.body) n += countBlocks(item.body);
			}
			return n;
		}

		function step() {
			if (!running) return;
			if (!queue.length) {
				if (allGoals()) win();
				else fail('Программа закончилась, а звезда осталась. Добавь ещё шагов!', '🤔');
				return;
			}
			if (++stepsDone > MAX_STEPS) { fail('Программа слишком длинная — проверь петли.', '🔧'); return; }
			const a = queue.shift();
			if (a.kind === 'left' || a.kind === 'right') {
				hd = (hd + (a.kind === 'left' ? 3 : 1)) % 4;
				placeHero(true);
				const rest = Math.round((a.deg || 90) / 90) - 1;
				if (rest > 0) queue.unshift({ kind: a.kind, deg: rest * 90 });
			} else if (a.kind === 'forward') {
				const nx = hx + DIRS[hd][0], ny = hy + DIRS[hd][1];
				if (nx < 0 || ny < 0 || nx >= W || ny >= H) { fail('Бух! Герой уехал за край поля. Убери лишний шаг или поверни раньше.', '💥'); return; }
				if (grid[ny][nx] === '#') { fail('Столкновение с деревом! Объедь его поворотом.', '🌲'); return; }
				hx = nx; hy = ny;
				animateStep();
				placeHero(true);
				collectIfGoal();
				if ((a.steps || 1) > 1) queue.unshift({ kind: 'forward', steps: a.steps - 1 });
				if (allGoals()) { timer = setTimeout(win, 420); return; }
			} else if (a.kind === 'repeat') {
				if ((a.count || 0) > 0) queue.unshift(...a.body, { kind: 'repeat', count: a.count - 1, body: a.body });
				timer = setTimeout(step, 60);
				return;
			} else if (a.kind === 'until') {
				const n = a._n || 0;
				if (!sensorValue(a.sensor) && n < MAX_UNTIL) queue.unshift(...a.body, { kind: 'until', sensor: a.sensor, body: a.body, _n: n + 1 });
				timer = setTimeout(step, 60);
				return;
			} else if (a.kind === 'if') {
				if (sensorValue(a.sensor)) queue.unshift(...a.body);
				timer = setTimeout(step, 60);
				return;
			} else if (a.kind === 'say' || a.kind === 'think') {
				sayBubble(a.text || '', a.kind === 'think');
			} else if (a.kind === 'hide') {
				hero.style.opacity = '0';
			} else if (a.kind === 'show') {
				hero.style.opacity = '1';
			} else if (a.kind === 'costume') {
				nextCostume();
			} else if (a.kind === 'meow') {
				playMeow();
			} else if (a.kind === 'score') {
				addScore(a.delta || 1);
			} else if (a.kind === 'wait') {
				timer = setTimeout(step, Math.min(3, a.secs || 1) * 1000);
				return;
			}
			timer = setTimeout(step, 420);
		}

		play.addEventListener('click', () => {
			if (running) return;
			if (!root.body.length) { say('Сначала перетащи блоки из палитры в программу.', '👆'); return; }
			resetHero();
			running = true;
			play.disabled = true;
			palette.parentElement.classList.add('sb-disabled');
			status.textContent = '';
			say('Поехали! Смотри на кота!', '🐱');
			queue = root.body.slice();
			stepsDone = 0;
			timer = setTimeout(step, 350);
		});
		reset.addEventListener('click', () => {
			running = false;
			if (timer) clearTimeout(timer);
			resetHero();
			stopFlags();
			status.textContent = '';
			say('Программа на месте. Поменяй блоки и жми «Играть» снова.', '🔧');
		});
		const again = document.getElementById('studio-again');
		if (again) again.addEventListener('click', () => {
			document.getElementById('studio-win').hidden = true;
			resetHero();
		});

		resetHero();
		renderProgram();
	}

	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
	else boot();
})();
