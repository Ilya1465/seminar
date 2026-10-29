#!/usr/bin/env bash
# Локальный запуск без Docker: dev-сервер Django на http://127.0.0.1:8042/
# Использование: bash scripts/start_dev.sh
set -e
cd "$(dirname "$0")/.."

if [ ! -x .venv/Scripts/python.exe ] && [ ! -x .venv/bin/python ]; then
	echo "Виртуальное окружение не найдено. Создайте его:"
	echo "  py -3.14 -m venv .venv && .venv/Scripts/python.exe -m pip install -r requirements.lock"
	exit 1
fi

PY=.venv/Scripts/python.exe
[ -x "$PY" ] || PY=.venv/bin/python

set -a
source .env
set +a

export DEBUG=1
"$PY" manage.py migrate
"$PY" manage.py seed_course
exec "$PY" manage.py runserver 127.0.0.1:8042
