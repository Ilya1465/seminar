/* Карточный плеер урока: одна видимая карточка, гейтинг заданий, прогресс. */
(function () {
	'use strict';
	const root = document.querySelector('.lesson-player');
	if (!root) return;
	let cards = [...root.querySelectorAll('.trial-card')];
	const prev = root.querySelector('.player-prev');
	const next = root.querySelector('.player-next');
	const fill = root.querySelector('.player-fill');
	const step = root.querySelector('.player-step');
	let index = 0;

	function gated(card) {
		// Невыполненное задание держит «Далее», но после неверной попытки
		// задание откладывается в конец урока (блок «Исправляем ошибки»).
		return (card.dataset.type === 'quiz' || card.dataset.type === 'code' || card.dataset.type === 'blocks') && !card.dataset.done && !card.dataset.failed;
	}

	// Мини-миры (scratch-blocks.js) сообщают о прохождении уровня через этот хук.
	root.tutorUpdate = function () { update(); };

	function update(fromUser) {
		let card = cards[index];
		if (card.dataset.type === 'final') {
			const moved = requeueMistakes(card);
			if (moved) {
				index = cards.indexOf(moved);
				card = moved;
			}
		}
		cards.forEach((c, i) => { c.hidden = i !== index; });
		// Перезапускаем анимацию появления карточки.
		card.classList.remove('card-in');
		void card.offsetWidth;
		card.classList.add('card-in');
		step.textContent = 'Шаг ' + (index + 1) + ' из ' + cards.length;
		fill.style.width = (index / (cards.length - 1)) * 100 + '%';
		prev.disabled = index === 0;
		next.disabled = gated(card);
		next.textContent = card.dataset.type === 'final' ? 'Продолжить' : (gated(card) ? 'Сначала выполните задание' : 'Далее');
		if (card.dataset.type === 'final') finish(card);
		// Визуализаторы в карточке инициализируются лениво при первом показе
		// (в скрытой карточке Ace получил бы нулевую высоту).
		if (window.TutorLessonInit) window.TutorLessonInit(card);
		window.requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
		// При смене карточки возвращаем её верхний край под шапку.
		if (fromUser) root.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	// Карточки с неверными ответами возвращаются перед финалом под заголовком
	// «Исправляем ошибки» — пропустить задание совсем нельзя.
	let mistakesIntro = null;
	function requeueMistakes(finalCard) {
		const mistakes = cards.filter(c => c.dataset.failed && !c.dataset.done);
		if (!mistakes.length) return null;
		if (!mistakesIntro) {
			mistakesIntro = document.createElement('section');
			mistakesIntro.className = 'trial-card';
			mistakesIntro.dataset.type = 'theory';
			mistakesIntro.innerHTML = '<h2>Исправляем ошибки</h2><p>Эти задания не получились с первого раза. Прочитайте подсказку под каждым заданием и попробуйте ещё раз — без этого урок не завершить.</p>';
		}
		const container = root.querySelector('.trial-cards');
		container.insertBefore(mistakesIntro, finalCard);
		mistakes.forEach(c => {
			container.insertBefore(c, finalCard);
			// В раунде исправлений редактор снова доступен.
			const area = c.querySelector('.trial-code');
			const run = c.querySelector('.trial-run');
			if (area) area.disabled = false;
			if (run) run.disabled = false;
		});
		cards = [...container.querySelectorAll('.trial-card')];
		return mistakesIntro;
	}

	function finish(card) {
		const tasks = cards.filter(c => c.dataset.type === 'quiz' || c.dataset.type === 'code' || c.dataset.type === 'blocks');
		const done = tasks.filter(c => c.dataset.done).length;
		const score = card.querySelector('.player-score');
		const stars = card.querySelector('.player-stars');
		if (score) score.textContent = 'Заданий выполнено: ' + done + ' из ' + tasks.length + '.';
		if (stars) stars.textContent = '★'.repeat(done) + '☆'.repeat(tasks.length - done);
	}

	cards.forEach(card => {
		if (card.dataset.type === 'quiz') {
			const explain = card.querySelector('.trial-explain');
			card.querySelectorAll('.trial-option').forEach(option => {
				option.addEventListener('click', () => {
					if (card.dataset.done) return;
					if (option.dataset.correct === '1') {
						card.dataset.done = '1';
						option.classList.add('is-correct');
						card.querySelectorAll('.trial-option').forEach(o => { o.disabled = true; o.classList.remove('is-wrong'); });
						if (explain) { explain.hidden = false; explain.classList.add('is-good'); }
					} else {
						option.classList.add('is-wrong');
						option.disabled = true;
						if (explain) { explain.hidden = false; explain.classList.remove('is-good'); }
					}
					update();
				});
			});
		}
		if (card.dataset.type === 'code') {
			const area = card.querySelector('.trial-code');
			const out = card.querySelector('.trial-out');
			const run = card.querySelector('.trial-run');
			run.addEventListener('click', () => {
				if (!window.BrowserPython) { out.hidden = false; out.textContent = 'Запуск кода недоступен в этом режиме.'; return; }
				run.disabled = true;
				out.hidden = false;
				out.classList.remove('is-good');
				out.textContent = 'Запускаем Python…';
				window.BrowserPython.run({ code: area.value, tests: JSON.parse(card.dataset.tests) }).then(results => {
					const list = Array.isArray(results) ? results : [results];
					const tests = JSON.parse(card.dataset.tests);
					const ok = list.every(r => r.result === 'ok');
					const text = list.map(r => (r.stdout || '') + (r.stderr ? '\n' + r.stderr : '')).join('\n---\n');
					out.textContent = ok ? 'Верно! ' + (text.trim() ? 'Вывод:\n' + text : '') : (text.trim() ? text : 'Тест не пройден. Проверьте код и попробуйте ещё раз.');
					if (ok) {
						card.dataset.done = '1';
						delete card.dataset.failed;
						const hintEl = card.querySelector('.trial-hint');
						if (hintEl) hintEl.hidden = true;
						out.classList.add('is-good');
						// Задача из банка курса: сохраняем решение на сервере —
						// от этого зависят замки уроков и монеты.
						if (card.dataset.slug && window.BrowserPython.submit
								&& document.querySelector('meta[name=learner-id]')?.content !== 'local') {
							window.BrowserPython.submit('problem', card.dataset.slug, area.value).catch(() => {});
						}
					} else {
						// Неверно: редактор блокируется до конца урока —
						// исправить задание можно только в блоке «Исправляем ошибки».
						card.dataset.failed = '1';
						area.disabled = true;
						if (!text.trim() || !list.some(r => r.stderr)) {
							out.textContent += '\nПока не совпало с ожидаемым выводом.';
						}
						const hintEl = card.querySelector('.trial-hint');
						if (hintEl) {
							const badAt = list.findIndex(r => r.result !== 'ok');
							const parts = [];
							if (badAt >= 0 && tests[badAt]) {
								parts.push('На входе «' + (tests[badAt].stdin.trim() || 'пусто') + '» ожидалось «' + tests[badAt].answer.trim() + '», получено «' + (list[badAt].stdout || '').trim() + '».');
							}
							if (card.dataset.hint) parts.push('Подсказка: ' + card.dataset.hint);
							parts.push('Задание вернётся в конце урока — там его можно будет исправить.');
							hintEl.textContent = parts.join('\n');
							hintEl.hidden = false;
						}
					}
				}).catch(e => { out.textContent = e.message; }).finally(() => { run.disabled = !!card.dataset.failed; update(); });
			});
		}
	});

	prev.addEventListener('click', () => { if (index > 0) { index--; update(true); } });
	next.addEventListener('click', () => {
		const card = cards[index];
		if (gated(card)) return;
		if (card.dataset.type === 'final') { window.location.href = root.dataset.problemsUrl || '#problems'; return; }
		if (index < cards.length - 1) { index++; update(true); }
	});
	const again = root.querySelector('.player-again');
	if (again) again.addEventListener('click', () => {
		cards.forEach(card => {
			delete card.dataset.done;
			delete card.dataset.failed;
			const area = card.querySelector('.trial-code');
			const run = card.querySelector('.trial-run');
			if (area) area.disabled = false;
			if (run) run.disabled = false;
			const hintEl = card.querySelector('.trial-hint');
			if (hintEl) hintEl.hidden = true;
			card.querySelectorAll('.trial-option').forEach(o => { o.disabled = false; o.classList.remove('is-correct', 'is-wrong'); });
			const explain = card.querySelector('.trial-explain');
			if (explain) explain.hidden = true;
			const out = card.querySelector('.trial-out');
			if (out) { out.hidden = true; out.classList.remove('is-good'); }
		});
		index = 0;
		update();
	});
	document.addEventListener('keydown', e => {
		if (e.target.closest('textarea, input')) return;
		if (e.key === 'ArrowRight' && !next.disabled) next.click();
		if (e.key === 'ArrowLeft' && !prev.disabled) prev.click();
	});
	update();
})();
