"""Nuxt 2 SSR 상태(window.__NUXT__) 파서.

LX Z:IN 페이지는 Nuxt 2로 서버 렌더링되며, 페이지 데이터가
`window.__NUXT__=(function(a,b,...){ ...; return {...} }(arg1, arg2, ...));`
형태의 스크립트로 HTML에 포함된다. JS 엔진 없이 이 형식만 해석하는
최소 파서다(객체/배열/문자열/숫자/식별자 참조/멤버 대입/new Date).
"""

from __future__ import annotations

import json
import re
from typing import Any

_UNDEFINED = None


class _Parser:
    def __init__(self, src: str, scope: dict[str, Any] | None = None):
        self.s = src
        self.i = 0
        self.scope = scope if scope is not None else {}

    # ---- lexical helpers -------------------------------------------------
    def ws(self) -> None:
        s, n = self.s, len(self.s)
        while self.i < n and s[self.i] in " \t\r\n":
            self.i += 1

    def peek(self) -> str:
        self.ws()
        return self.s[self.i] if self.i < len(self.s) else ""

    def eat(self, ch: str) -> None:
        self.ws()
        if not self.s.startswith(ch, self.i):
            raise ValueError(f"expected {ch!r} at {self.i}: {self.s[self.i:self.i + 60]!r}")
        self.i += len(ch)

    def try_eat(self, ch: str) -> bool:
        self.ws()
        if self.s.startswith(ch, self.i):
            self.i += len(ch)
            return True
        return False

    _ident_re = re.compile(r"[A-Za-z_$][A-Za-z0-9_$]*")
    _num_re = re.compile(r"-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?")

    def ident(self) -> str:
        self.ws()
        m = self._ident_re.match(self.s, self.i)
        if not m:
            raise ValueError(f"identifier expected at {self.i}: {self.s[self.i:self.i + 60]!r}")
        self.i = m.end()
        return m.group(0)

    def string(self) -> str:
        self.ws()
        q = self.s[self.i]
        j = self.i + 1
        buf = []
        while True:
            c = self.s[j]
            if c == "\\":
                buf.append(self.s[j:j + 2] if self.s[j + 1] != "u" else self.s[j:j + 6])
                j += 2 if self.s[j + 1] != "u" else 6
                continue
            if c == q:
                break
            buf.append('\\"' if c == '"' else c)
            j += 1
        self.i = j + 1
        raw = "".join(buf).replace("\\'", "'")
        return json.loads('"' + raw + '"')

    # ---- expressions -------------------------------------------------------
    def expr(self) -> Any:
        c = self.peek()
        if c == "{":
            return self.obj()
        if c == "[":
            return self.arr()
        if c in "\"'":
            return self.string()
        if c == "-" or c.isdigit() or c == ".":
            m = self._num_re.match(self.s, self.i)
            self.i = m.end()
            t = m.group(0)
            return float(t) if any(x in t for x in ".eE") else int(t)
        if c == "!":  # minified booleans: !0 / !1
            self.i += 1
            v = self.expr()
            return not v
        name = self.ident()
        if name == "true":
            return True
        if name == "false":
            return False
        if name == "null":
            return None
        if name == "void":
            self.expr()
            return _UNDEFINED
        if name == "new":
            cls = self.ident()
            self.eat("(")
            args = []
            while not self.try_eat(")"):
                args.append(self.expr())
                self.try_eat(",")
            return {"__new__": cls, "args": args}
        if name == "Array" and self.peek() == "(":  # Array(n) -> 길이 n 빈 배열
            self.eat("(")
            size = self.expr()
            self.eat(")")
            return [None] * int(size)
        val = self.scope.get(name, _UNDEFINED)
        # member access chain: a.b / a[0]
        while True:
            if self.try_eat("."):
                k = self.ident()
                val = val.get(k) if isinstance(val, dict) else None
            elif self.peek() == "[" :
                self.eat("[")
                k = self.expr()
                self.eat("]")
                if isinstance(val, list) and isinstance(k, int):
                    val = val[k] if k < len(val) else None
                elif isinstance(val, dict):
                    val = val.get(k)
                else:
                    val = None
            else:
                break
        return val

    def obj(self) -> dict:
        self.eat("{")
        out: dict = {}
        while not self.try_eat("}"):
            c = self.peek()
            key = self.string() if c in "\"'" else self.ident()
            self.eat(":")
            out[key] = self.expr()
            self.try_eat(",")
        return out

    def arr(self) -> list:
        self.eat("[")
        out: list = []
        while not self.try_eat("]"):
            out.append(self.expr())
            self.try_eat(",")
        return out

    # ---- statements ------------------------------------------------------
    def target(self):
        """Parse `name(.key|[idx])*` and return (container, key) for assignment."""
        name = self.ident()
        container, key = self.scope, name
        while True:
            if self.try_eat("."):
                container = self._get(container, key)
                key = self.ident()
            elif self.peek() == "[":
                container = self._get(container, key)
                self.eat("[")
                key = self.expr()
                self.eat("]")
            else:
                return container, key

    @staticmethod
    def _get(container, key):
        if isinstance(container, dict):
            return container.get(key)
        if isinstance(container, list) and isinstance(key, int) and key < len(container):
            return container[key]
        return None

    def assign(self, container, key, value) -> None:
        if container is None:
            return
        if isinstance(container, list):
            while len(container) <= key:
                container.append(None)
        container[key] = value

    def body(self) -> Any:
        while True:
            self.ws()
            if self.s.startswith("return", self.i) and not self._ident_re.match(self.s, self.i + 6):
                self.i += 6
                return self.expr()
            container, key = self.target()
            self.eat("=")
            self.assign(container, key, self.expr())
            self.try_eat(";")


def parse_nuxt_state(html: str) -> dict | None:
    """HTML에서 window.__NUXT__ 를 찾아 Python dict로 반환. 없으면 None."""
    start = html.find("window.__NUXT__=")
    if start < 0:
        return None
    end = html.find("</script>", start)
    src = html[start + len("window.__NUXT__="):end].strip().rstrip(";")

    m = re.match(r"\(function\(([^)]*)\)\{", src)
    if not m:
        # 비-IIFE 형태: 바로 객체 리터럴
        return _Parser(src).expr()
    params = [p.strip() for p in m.group(1).split(",") if p.strip()]
    body_start = m.end()

    # 1차: 빈 scope로 본문을 훑어 함수 본문의 끝(인자 목록 시작 위치)을 찾는다.
    probe = _Parser(src, {})
    probe.i = body_start
    probe.body()
    probe.eat("}")
    args_open = probe.i
    p = _Parser(src)
    p.i = args_open
    p.eat("(")
    args = []
    while not p.try_eat(")"):
        args.append(p.expr())
        p.try_eat(",")

    scope = dict(zip(params, args))
    body = _Parser(src[body_start:args_open], scope)
    return body.body()
