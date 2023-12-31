import sys
with open(sys.argv[1]) as f1:
    for line in f1:
        if(line == ""):
            continue
        ls = line.split(' ')
        utf32 = bytes.fromhex(ls[0]).decode('utf-16be').encode('utf-32be').hex()
        print(utf32+" "+ls[1].rstrip())