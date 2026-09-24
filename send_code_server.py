# -*- coding: utf-8 -*-
"""
send_code_server.py — локальный бэкенд-сервер для reg.html.
Делает РЕАЛЬНУЮ доставку кода на e-mail через SMTP.

Запуск:   python send_code_server.py
Сайт:     http://127.0.0.1:8081/reg.html

Настройки SMTP — в mail_config.json (заполни smtp_user/smtp_pass/from).
Для Gmail/Yandex/Mail.ru используй «пароль приложения», не обычный.
"""
import json
import os
import random
import smtplib
import time
from email.mime.text import MIMEText
from email.header import Header
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

BASE = os.path.dirname(os.path.abspath(__file__))
CFG_FILE = os.path.join(BASE, "mail_config.json")
CODES = {}          # email -> {code, expires}
CODE_TTL = 5 * 60   # 5 минут


def load_cfg():
    try:
        with open(CFG_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def make_code():
    return "%06d" % random.randint(0, 999999)


def _pl(key, val):
    s = str(val or "")
    return (not s) or ("ВАША_ПОЧТА" in s) or ("ПАРОЛЬ" in s) or ("@@@" in s)


def send_email(to_addr, code):
    cfg = load_cfg()
    host = cfg.get("smtp_host", "")
    port = int(cfg.get("smtp_port", 587))
    user = cfg.get("smtp_user", "")
    pwd = cfg.get("smtp_pass", "")
    fr = cfg.get("from", "")
    for k, v in (("smtp_user", user), ("smtp_pass", pwd), ("from", fr)):
        if _pl(k, v):
            return False, "Настройки SMTP не заполнены. Открой mail_config.json и впиши smtp_user/smtp_pass/from (см. reg.html: Подробности)."
    try:
        user.encode("ascii"); fr.encode("ascii")
    except Exception:
        return False, "В mail_config.json есть буквы не-латиницы (заглушки). Заполни реальные smtp_user/smtp_pass/from."

    body = "Твой код подтверждения: %s\nКод действителен 5 минут." % code
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = Header("Код подтверждения", "utf-8")
    msg["From"] = fr
    msg["To"] = to_addr

    try:
        if port == 465:
            s = smtplib.SMTP_SSL(host, port, timeout=20)
        else:
            s = smtplib.SMTP(host, port, timeout=20)
            s.starttls()
        s.login(user, pwd)
        s.sendmail(fr, [to_addr], msg.as_string())
        s.quit()
        return True, "ok"
    except Exception as e:
        return False, str(e)


class Handler(BaseHTTPRequestHandler):
    server_version = "RegServer/1.0"

    def log_message(self, fmt, *args):
        pass

    def _json(self, status, obj):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _read_body(self):
        length = int(self.headers.get("Content-Length") or 0)
        if length <= 0:
            return {}
        raw = self.rfile.read(length)
        try:
            return json.loads(raw.decode("utf-8"))
        except Exception:
            return {}

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        if self.path.startswith("/api/send-code"):
            body = self._read_body()
            email = (body.get("email") or "").strip().lower()
            if "@" not in email:
                self._json(400, {"ok": False, "error": "Нужен настоящий e-mail"})
                return
            code = make_code()
            CODES[email] = {"code": code, "expires": time.time() + CODE_TTL}
            ok, err = send_email(email, code)
            if not ok:
                self._json(500, {"ok": False, "error": err})
                return
            self._json(200, {"ok": True})

        elif self.path.startswith("/api/verify"):
            body = self._read_body()
            email = (body.get("email") or "").strip().lower()
            code = (body.get("code") or "").strip()
            rec = CODES.get(email)
            if not rec:
                self._json(400, {"ok": False, "error": "Сначала получи код"})
                return
            if time.time() > rec["expires"]:
                CODES.pop(email, None)
                self._json(400, {"ok": False, "error": "Код истёк, запроси новый"})
                return
            if rec["code"] != code:
                self._json(400, {"ok": False, "error": "Неверный код"})
                return
            CODES.pop(email, None)
            self._json(200, {"ok": True, "email": email})

        else:
            self._json(404, {"ok": False, "error": "unknown"})

    def do_GET(self):
        path = self.path.split("?")[0]
        if path in ("/", "/reg.html"):
            path = "/reg.html"
        rel = os.path.normpath(path.lstrip("/"))
        full = os.path.join(BASE, rel)
        if os.path.isfile(full):
            ctype = "text/html; charset=utf-8" if full.endswith((".html", ".htm")) else "application/octet-stream"
            with open(full, "rb") as f:
                data = f.read()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        else:
            self._json(404, {"ok": False, "error": "not found"})


if __name__ == "__main__":
    cfg = load_cfg()
    if not cfg.get("smtp_user") or "ВАША_ПОЧТА" in str(cfg.get("smtp_user", "")):
        print("[!] mail_config.json ещё не заполнен. Заполни smtp_user/smtp_pass/from,")
        print("    иначе письма не уйдут. Сервер всё равно запущен.")
    srv = ThreadingHTTPServer(("127.0.0.1", 8081), Handler)
    print("Рег-сервер: http://127.0.0.1:8081/reg.html")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nСтоп.")