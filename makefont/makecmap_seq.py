import sys
import os
dic = {}
minimal_cid_available = int(os.environ['NZM_MIN_CID_AVAILABLE'])

fm = open(sys.argv[1]+'.out.map', 'w')
fc = open(sys.argv[1]+'.out.cmap', 'w')
fv = open(sys.argv[1]+'.out.vs', 'w')
fm.write('mergeFonts '+os.environ['NZM_MAKECMAP_PSNAME']+'-Ideographs\n')
with open(sys.argv[2]) as f1:
    for line in f1:
        s = line.split("\t")
        #print(s)
        #s[0]はグリフ実体名
        #s[1]はコードポイント文字列（IVS・SVS含む）のリスト（多重集合）
        #s[2]はCID（-1の場合もあり）
        cid = int(s[2].rstrip())
        if (os.environ.get('NZM_USE_AJ1_CID') == "NO") or (cid == -1):
            cid = minimal_cid_available
            minimal_cid_available += 1
        fm.write(str(cid)+' '+s[0][3:]+"\n")
        for cp0 in s[1].split(','):
            cp=cp0[1:-1]
            if " " in cp:#IVS, SVS
                if os.environ.get('NZM_USE_VS') == "YES": #有効ならVSファイルを生成
                    fv.write(cp+"; AJ1; CID+"+str(cid)+"\n")
            else:#Unicode
                fc.write("<"+cp.lower().zfill(8)+"> "+str(cid)+"\n")