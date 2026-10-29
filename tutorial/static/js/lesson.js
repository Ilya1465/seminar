var visualizers = [];

function runPythonInline(code, out, btn) {
	out.prop('hidden', false);
	if (!window.BrowserPython) {
		out.text('Запуск кода недоступен в этом режиме.');
		return;
	}
	btn.prop('disabled', true);
	out.text('Запускаем Python…');
	window.BrowserPython.run({ code: code }).then(function(r) {
		var text = (r.stdout || '') + (r.stderr ? '\n' + r.stderr : '');
		out.text(text.trim() ? text : '(программа ничего не вывела)');
	}).catch(function(e) {
		out.text(e.message);
	}).finally(function() {
		btn.prop('disabled', false);
	});
}

$(function() {
	// Песочница: предзаполняем первым примером урока, пока визуализаторы
	// не удалили исходный .code из разметки.
	var playground = $('#lesson-playground-code');
	if (playground.length) {
		var first = $('.lesson_code[data-executable="true"] .code').first();
		if (first.length) playground.val(first.text().trim());
		$('#lesson-playground-run').on('click', function() {
			runPythonInline(playground.val(), $('#lesson-playground-out'), $(this));
		});
	}

	// Статические сниппеты становятся запускаемыми.
	$('.lesson-snippet').each(function() {
		var block = $(this);
		var pre = block.find('.lesson-snippet-code').first();
		var code = pre.text().trim();
		if (!code) return;
		var btn = $('<button type="button" class="btn btn-default btn-sm snippet-run">Запустить</button>');
		var out = $('<pre class="snippet-output" role="status" hidden></pre>');
		block.append(btn).append(out);
		btn.on('click', function() { runPythonInline(code, out, btn); });
	});

	function initVisualizers(scope) {
		scope.find('.lesson_code').each(function(i, code_block) {
			code_block = $(code_block);

			// Уже инициализированные блоки пропускаем: у них нет .code.
			var code_node = code_block.find('.code')[0];
			if (!code_node) return;

			var executable = code_block.data('executable');

			var code = code_node.textContent.trim();
			code_block.find('.code').remove();

			var stdin = '';
			if(executable) {
				stdin = code_block.find('.stdin')[0].textContent.trim();
				code_block.find('.stdin').remove();
			}

			visualizers.push(new Visualizer(code_block, code, stdin, {
				executable: executable,

				auto_height: true,
				show_stdin: (stdin != ''),
				show_stdin_initially: false,

				code_read_only: code_block.data('readonly'),
				stdin_read_only: code_block.data('readonly'),

				explain_mode: (code_block.data('explain') === undefined || code_block.data('explain')),
				dataviz_enabled: code_block.data('dataviz')
			}));
		});
	}

	// Карточный формат: инициализируем визуализаторы лениво, только в видимых
	// карточках — в скрытых Ace получает нулевую высоту. lesson-player.js
	// вызывает TutorLessonInit при первом показе каждой карточки.
	var player = $('.lesson-player')[0];
	if (player) {
		var firstCard = $(player).find('.trial-card').first();
		initVisualizers(firstCard);
		window.TutorLessonInit = function(card) { initVisualizers($(card)); };
	} else {
		initVisualizers($(document));
	}


	ANCHORLINK_NAVBAR_FIX_HEIGHT = 60;

	section_positions = [];

	// precompute some values for less CPU usage, more smoothly scrolling on the slow devices
	function updateSectionPositions() {
		section_positions = [];
		var section_blocks = $('.section');
		var menu = $('.nav-sidebar > li.active > .lesson_sections');

		var navbar_height = $('.navbar').outerHeight(true);

		$.each(section_blocks, function(i, block) {
			block = $(block);

			var id = block.data('section-id');

			var menu_item = menu.find('li[data-section-id="' + id + '"]');
			var spin = menu_item.find('.position_spin');

			var height = block.outerHeight() - ANCHORLINK_NAVBAR_FIX_HEIGHT;
			var menu_item_height = menu_item.innerHeight();

			$.each(block.find('.section'), function(i, subsection) {
				subsection = $(subsection);

				height -= subsection.outerHeight() - ANCHORLINK_NAVBAR_FIX_HEIGHT;
				menu_item_height = menu_item.find('> a').outerHeight();
			});

			var top = block.offset().top + ANCHORLINK_NAVBAR_FIX_HEIGHT;
			var bottom = top + height;

			section_positions.push({
				spin: menu_item.find('.position_spin'),

				top: top,
				height: height,
				bottom: bottom,

				menu_item_height: menu_item_height,
				d: menu_item_height / height // coefficient to project point on the section to the point on section menu item
			});
		});
	}

	function updateScroll() {
		var navbar_height = $('.navbar').outerHeight(true);

		var current_top = $(document).scrollTop() + navbar_height;
		var current_bottom = current_top + $(window).innerHeight() - navbar_height;

		$.each(section_positions, function(i, info) {
			var sp_top = (current_top - info['top']) * info['d'];
			var sp_bottom = (info['bottom'] - current_bottom) * info['d'];
			sp_bottom = info['menu_item_height'] - sp_bottom;

			sp_top = Math.min(info['menu_item_height'], Math.max(0, sp_top));
			sp_bottom = Math.min(info['menu_item_height'], Math.max(0, sp_bottom));

			var sp_height = Math.max(0, sp_bottom - sp_top);

			info['spin'].height(sp_height);
			info['spin'].css('top', sp_top);
		});
	}


	$(window).resize(updateSectionPositions);
	$(window).scroll(updateScroll);

	updateSectionPositions();
	updateScroll();
});
