from datetime import datetime
from typing import Any

# author: Marco Antonio Insabato, original uploaded at
# https://github.com/markanthony97/slogger-python
#

class SLogger:
    DATE_LEN = 19
    DATE_FORMAT = "%d-%M-%y %H:%m:%S"
    LINE_CHAR = "─"
    SPACE = " "
    BORDER = "|"
    R_LIMIT = "┤"
    L_LIMIT = "├"
    UPPER_R_LIMIT = "┐"
    UPPER_L_LIMIT = "┌"
    LOWER_R_LIMIT = "┘"
    LOWER_L_LIMIT = "└"

    def __init__(self, title: str = None, lines: list[dict[str, str] | str] = None):
        """
        title: string of the title, if left to none it only has the date
        """
        self.width = self.DATE_LEN + 3 + len(title) if title else self.DATE_LEN
        self.lines = self._formatLines(lines) if lines else []
        self.title = title

    def _hline(self):
        return (self.width + 3) * self.LINE_CHAR

    def _genTail(self, len):
        return self.SPACE * len + self.BORDER

    def _genLine(self, cnt: str):
        return f"{self.BORDER} {cnt}{self._genTail(self.width - len(cnt) + 2)}"

    def _checkLen(self, s):
        w = len(s)
        if w > self.width:
            self.width = w

    def _genField(self, key: str, item: Any):
        s = f"{key}: {item}"
        self._checkLen(s)
        return s

    def addFields(self, cnt: dict):
        for key, item in cnt.items():
            s = self._genField(key, item)
            self.lines.append(s)

    def addLine(self, s):
        self._checkLen(s)
        self.lines.append(s)

    def _formatLines(self):
        f_lines = []
        for i, line in enumerate(self.lines):
            if isinstance(line, str):
                self._checkLen(line)
                f_lines.append(line)
            elif isinstance(line, dict):
                for key, item in line.items():
                    f_line = self._genField(key=key, item=item)
                    self._checkLen(f_line)
                    f_lines.append()
            else:
                f_line = str(line)
                self._checkLen(f_line)
                f_lines.append(f_line)  # all object have a __str__ dunder so it's ok
        return f_lines

    def genBox(self) -> list[str]:
        h = self._hline()
        ret = []
        title = f"{datetime.now().strftime(self.DATE_FORMAT)} - {self.title}" if self.title else f"{datetime.now().strftime(self.DATE_FORMAT)}"

        ret.append(f"{self.UPPER_L_LIMIT}{h}{self.UPPER_R_LIMIT}")  # 0
        ret.append(self._genLine(title))  # 1
        ret.append(f"{self.L_LIMIT}{h}{self.R_LIMIT}")  # 2
        ret.append(f"{self.LOWER_L_LIMIT}{h}{self.LOWER_R_LIMIT}")  # 3
        ret[3:3] = [self._genLine(l) for l in self.lines]

        return ret

    def digest(self) -> str:
        return "\n".join(self.genBox())

    def print(self) -> None:
        print(self.digest())  # test logging func