import sys
from pathlib import Path
from dataclasses import dataclass
from typing import Callable, TypeVar

T = TypeVar('T')

def get_size(path: Path) -> int:
    if path.is_file():
        return path.stat().st_size
    
    if path.is_dir():
        return sum(file.stat().st_size for file in path.rglob("*") if file.is_file())
    
    raise ValueError("Invalid file type")

def divide_int(v: int) -> str:
    minus_sign = False
    if v < 0:
        minus_sign = True
        v *= -1
    
    empty = True
    res = []

    while v > 0:
        section = v % 1000
        v //= 1000
        s = str(section) if v == 0 else f"{section:03}"

        if empty:
            empty = False
        else:
            res.append(f".")
        
        res.append(s)

    if empty:
        return "0"
    
    if minus_sign:
        res.append("-")
    
    return "".join(reversed(res))

@dataclass
class SizeRecord:
    name: str
    size: str

    @staticmethod
    def new(path: Path) -> "SizeRecord":
        name = path.name

        size = get_size(path)
        size = divide_int(size)

        return SizeRecord(name = name, size = size)

def call(v: T, f: Callable[[], None]) -> T:
    f()
    return v

class CounterOfTotal:
    __total: int
    __count: int
    __str_fn: Callable[[int, int], str]

    def __init__(self, total: int, str_fn: Callable[[int, int], str]):
        self.__total = total
        self.__count = 0
        self.__str_fn = str_fn
    
    def count(self, v: T) -> T:
        self.__count += 1
        print(self.__str_fn(self.__count, self.__total))
        return v

def main():
    directory = Path(sys.argv[1])

    files = tuple(directory.iterdir())
    number_of_files = len(files)
    print(f"Total of {} file(s)")
    counter = CounterOfTotal(number_of_files, lambda n, t: f"{n} file(s)/dir(s) checked, out of {t}")

    result = tuple(counter.count(SizeRecord.new(file)) for file in files)
    max_name_len = max(len(record.name) for record in result)
    max_size_len = max(len(record.size) for record in result)
    for record in result:
        v1 = record.name.ljust(max_name_len)
        v2 = record.size.rjust(max_size_len)
        print(f"{v1} : {v2} bytes")

if __name__ == "__main__":
    main()
#
