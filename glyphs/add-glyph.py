#実体とコードポイントの組のリストを受け取り、既にその実体が追加されていればコードポイントを追加
#（setを使っているので、コードポイントも既にあった場合は何も起こらない）
#実体がまだなければ実体ごと追加する
import sys
dic = {}
with open(sys.argv[1]) as f1:
    for line in f1:
        s = line.rstrip().split("\t")
        #print(s)
        dic[s[0]] = [set(s[1].split(',')),s[2]]
with open(sys.argv[2]) as f:
    for line in f:
        s = line.rstrip().split("\t")
        glyph = "gw/"+s[0]
        cp = "<"+s[1].upper()+">"
        if glyph in dic:
            dic[glyph][0].add(cp)
        else:
            dic[glyph] = [{cp},"-1"]
for d in dic.items():
    dd = ",".join(list(d[1][0]))
    print(d[0]+'\t'+dd+"\t"+d[1][1])