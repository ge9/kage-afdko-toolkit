#CJK互換漢字（補助）のコードポイントのところにSVSを追加割り当て
import sys
dic_svs = {}
#use SVS sequence file as dict (from UCS point -> VS, since SVS is one-to-one correspondence)
with open(sys.argv[2]) as f:
    for line in f:
        if line.startswith("#"):
            continue
        if line.find("CJK COMPATIBILITY IDEOGRAPH-") >= 0:
            s = line.split(";")
            s1 = s[1].split('-')
            #put in < > to search easily afterwards
            dic_svs["<"+s1[1]+">"] = "<"+s[0]+">"
with open(sys.argv[1]) as f1:
    for line in f1:
        s = line.rstrip().split("\t")
        cp = s[1]
        for p in s[1].split(','):
            if p in dic_svs:#there is a code point of CJK compatibility (Supplement)
                cp += ","+dic_svs[p]
        print(s[0]+'\t'+cp+"\t"+s[2])
