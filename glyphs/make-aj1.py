# 現在は漢字CID一覧から（aj1-xxxxx）ではなくAJ1のSequenceファイルをもとに直接IVSグリフ（uXXXX-ueXXXX）を取っているので、このスクリプトは実質的には不要
import sys
dic = {}
# CID -> GlyphWiki実体のマップ
with open(sys.argv[1]) as f1:
    for line in f1:
        s = line.rstrip().split("\t")
        dic[s[1]] = [s[0],[]]
# AJ1のSequenceファイルを上から見ていき、dicを使用してIVS -> GlyphWiki実体のマップを作る
with open(sys.argv[2]) as f:
    for line in f:
        if line.startswith("#"):
            continue
        if line.find("Adobe-Japan1;") >= 0:
            s = line.rstrip().split(";")
            dic[s[2][5:]][1].append(s[0])
for d in dic.items():
    dd = "<"+">,<".join(d[1][1])+">"
    print("gw/"+d[1][0]+'\t'+dd+"\t"+d[0])