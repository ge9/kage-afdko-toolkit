# unicode範囲を記述したファイル（独自書式）から、範囲内を実際に列挙したリストを生成
import sys
with open(sys.argv[1], encoding="utf-8") as f1:
    for line in f1:
        if line.startswith("#"):
            continue
        s = line.split("-")
        begin = int(s[0],16)
        end = int(s[1],16)
        for i in range(begin, end+1):
            print(hex(i)[2:].upper())