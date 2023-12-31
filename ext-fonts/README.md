メイリオ
`ttx -y 0 -t cmap -o meiryo-cmap.ttx C:\Windows\Fonts\meiryo.ttc`
で取得(Windows使用)
そのあと、
`cat meiryo-cmap.ttx | sed -n -r "s/^.*code=\"0x(2....)\".*$/\1/p" > ucs-meiryo.ids`
をする
- 結局Meiryo収録の漢字UCSコードポイントはすべてSourceHanSansにあったので不要
