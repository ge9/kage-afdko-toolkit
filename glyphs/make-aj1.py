import sys
dic = {}
with open(sys.argv[1]) as f1:
    for line in f1:
        s = line.rstrip().split("\t")
        dic[s[1]] = [s[0],[]]
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