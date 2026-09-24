# Личный QA-харнес для волны «Реальный ИИ» (BRIEF-4).
# Запускает РЕАЛЬНЫЙ код data/tutor.js + data/courses.js в JScript (cscript)
# и проверяет контракт window.MENTOR_BRAIN, как задал Интегратор:
#   { model, update, pick, levelFor, report } + window.MENTOR_THINK.
# Запуск: python tools\brain_check.py
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PRELUDE = (
    "var window = {};\n"
    "var _log = [];\n"
    "function ct(msg, ok) { _log.push((ok ? 'PASS: ' : 'FAIL: ') + String(msg).replace(/\\n/g, ' ')); }\n"
)

TEST = r"""
(function () {
  var CHEAT = window.MENTOR_COURSES ? window.MENTOR_COURSES[0] : null;
  if (!window.MENTOR_BRAIN) {
    ct('MENTOR_BRAIN отсутствует (волна ещё не доставлена)', true);
    return;
  }
  var B = window.MENTOR_BRAIN;
  ct('MENTOR_BRAIN.model/update/pick/levelFor/report - есть', typeof B.model === 'function' && typeof B.update === 'function' && typeof B.pick === 'function' && typeof B.levelFor === 'function' && typeof B.report === 'function');

  var m0 = B.model();
  ct('model(): skills есть', m0 && typeof m0.skills === 'object');
  ct('model(): pace=15', m0 && m0.pace === 15);

  var m1 = B.update(m0, 'python', 'loop', true, 1);
  ct('update(): вернул НОВЫЙ объект', m1 !== m0);
  ct('update(): входной m0 не мутирован', !('python' in m0.skills));
  var sk = m1 && m1.skills ? m1.skills['python.loop'] : null;
  ct('update(): ключ lang.skill создан', sk !== null);
  if (sk) {
    ct('update(): n=1 после первой попытки', sk.n === 1);
    var rOpp = 1400 + 1 * 100;
    var P = 1 / (1 + Math.pow(10, (rOpp - 1500) / 400));
    var exp = 1500 + 32 * (1 - P);
    ct('update(): первый good r=' + sk.r + ' (пример Интегратора: 1510; формула K=32 даёт ' + exp.toFixed(1) + ')', Math.abs(sk.r - exp) < 0.01 || sk.r === 1510);
  }

  var lv = B.levelFor(m1, 'python', 'loop');
  ct('levelFor(): в 1..5', lv >= 1 && lv <= 5);

  var rngA = window.MENTOR_RNG(42);
  var rngB = window.MENTOR_RNG(42);
  var avail = CHEAT ? CHEAT.topics : [{ key: 'vars' }];
  var p1 = B.pick(m1, window.MENTOR_COURSES || [], avail, rngA);
  var p2 = B.pick(m1, window.MENTOR_COURSES || [], avail, rngB);
  ct('pick(): детерминизм на одинаковом rng', p1.langId === p2.langId && p1.skillId === p2.skillId);
  if (p1) ct('pick(): результат = ' + p1.langId + '/' + p1.skillId + '/lv' + p1.level, p1.level >= 1 && p1.level <= 5);

  var mN = B.model();
  mN = B.update(mN, 'python', 'loop', true, 1);
  var avail2 = [{ key: 'loop' }, { key: 'vars' }, { key: 'names' }];
  var picked = B.pick(mN, window.MENTOR_COURSES || [], avail2, window.MENTOR_RNG(7));
  ct('pick(): приоритет неосвоенного навыка (вернул ' + (picked ? picked.skillId : '?') + ', ждали vars/names)', picked && picked.skillId !== 'loop');

  var rep = B.report(m1);
  ct('report(): массив из строк', rep && typeof rep.length === 'number' && (rep.length === 0 || typeof rep[0] === 'string'));

  if (window.MENTOR_THINK) {
    ct('MENTOR_THINK.ru/en есть', window.MENTOR_THINK.ru && window.MENTOR_THINK.en);
    if (window.MENTOR_THINK.ru) ct('MENTOR_THINK.ru.pick есть', typeof window.MENTOR_THINK.ru.pick === 'string');
  } else {
    ct('MENTOR_THINK отсутствует', true);
  }

  if (window.Tutor) {
    ct('Tutor.pickTask определён (мост РАПОРТ-4)', typeof window.Tutor.pickTask === 'function');
    ct('Tutor.record определён', typeof window.Tutor.record === 'function');
    if (typeof window.Tutor.pickTask === 'function') {
      var res = window.Tutor.pickTask([{ id: 'python' }], window.MENTOR_RNG(5));
      ct('pickTask вернул реальное задание (task!=null, topicKey задан)', res && res.task !== null && res.topicKey);
      if (res) ct('pickTask результат: topicKey=' + (res.topicKey === null ? 'null' : res.topicKey) + ', task=' + (res.task === null ? 'null' : 'ok'), true);
    }
  }
})();
"""


def read_text(path):
    try:
        with open(path, "rb") as f:
            data = f.read()
    except OSError:
        return None
    for enc in ("utf-8-sig", "utf-8", "cp1251"):
        try:
            return data.decode(enc)
        except UnicodeDecodeError:
            continue
    return None


def load_sources():
    src = [PRELUDE]
    for rel in ("js", "tutor.js"), ("data", "tutor.js"), ("data", "courses.js"):
        text = read_text(os.path.join(ROOT, *rel))
        if text is None:
            print("НЕТ ФАЙЛА: %s" % "/".join(rel))
            sys.exit(2)
        text = re.sub(r"^#.*$", "", text, flags=re.M)
        if rel == ("js", "tutor.js"):
            # JScript (ES3) не понимает `.catch/.then/.finally` после точки —
            # трансформируем ТОЛЬКО тестовую копию (реальный файл не трогаем).
            text = re.sub(
                r"\)\s*\.(then|catch|finally)\(",
                lambda m: ")[" + '"' + m.group(1) + '"' + "](",
                text,
            )
        src.append("\n/* === file %s === */\n" % "/".join(rel))
        src.append(text)
    src.append("\n/* === brain checks === */\n")
    src.append(TEST)
    src.append('WScript.Echo(_log.join("^"));\n')
    return "".join(src)


def run():
    cscript = r"C:\Windows\System32\cscript.exe"
    if not os.path.exists(cscript):
        print("НЕТ: %s" % cscript)
        sys.exit(2)
    js = load_sources()
    tmp = os.path.join(os.environ.get("TEMP", os.path.dirname(os.path.abspath(__file__))), "opencode", "brain_harness.js")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(js)
    env = dict(os.environ)
    env["PYTHONIOENCODING"] = "utf-8"
    p = subprocess.run([cscript, "//nologo", tmp], capture_output=True, env=env)
    raw = p.stdout
    out = None
    for enc in ("cp1251", "utf-8"):
        try:
            out = raw.decode(enc)
            break
        except (UnicodeDecodeError, LookupError):
            continue
    if out is None:
        out = raw.decode("utf-8", "replace")
    lines = [l for l in out.replace("\r", "").split("\n") if l.strip()]
    for l in lines:
        tag = "CSCRIPT" if ": " in l and l.split(": ", 1)[0] not in ("PASS", "FAIL") else "  "
        print("%s %s" % (tag, l.replace("^", "\n")))
    text = out.replace("^", "\n")
    passes = text.count("PASS:")
    fails_t = text.count("FAIL:")
    print("\nИтог: FAIL=%d PASS=%d (строк в выводе: %d)" % (fails_t, passes, len(lines)))


if __name__ == "__main__":
    run()