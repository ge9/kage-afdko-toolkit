# [CID -> GlyphWiki実体のマップ (ただし同一CIDが複数回含まれてもよいが、その場合は後に書いたものが優先される) ] と [AJ1のSequenceファイル] が与えられると、
# *.glyphsファイルの書式（つまり、「GlyphWiki実体 + そのCIDを使用する文字の一覧 + CID」のリスト）で出力される。
# CIDを維持するため、実体が重複していても統合はせずそのまま別々に出力される。
# 従来はaj1-XXXXXグリフを使用していたが、現在はAJ1のSequenceファイルをもとに直接IVSグリフ（uXXXX-ueXXXX）を取っているので、このスクリプトは若干二度手間感がある
import sys
# GlyphWiki実体 -> (それを使用するCID, それを使用するグリフ一覧)　のマップ
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
    dd = "<" + ">,<".join(d[1][1]) + ">"
    print("gw/"+d[1][0]+'\t'+dd+"\t"+d[0])