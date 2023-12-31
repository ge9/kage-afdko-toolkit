# 1個ずつ列挙されたものを範囲ごとに戻す？
import sys
with open(sys.argv[1]) as f1:
    last_begin = 0
    last = -2
    for line in f1:
        num = int(line,16)
        if (num != last+1):
            if (last == -2):
                last_begin = num
                last = num
                continue
            print(hex(last_begin)+"-"+hex(last))
            last_begin = num
        last = num
    print(hex(last_begin)+"-"+hex(last))