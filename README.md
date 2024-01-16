# 概要
謎乃明朝ビルド・GlyphWikiデータ検証用スクリプト集
基本的には https://github.com/ge9/NazonoMincho をビルドするための私用ツールであり、ドキュメントは完全ではなく、常に破壊的変更の可能性がある。

# bundled dependencies
These are included in this repository as git submodules.
- [adobe-type-tools/perl-scripts: Command-line Perl Scripts](https://github.com/adobe-type-tools/perl-scripts)
- [Glyphwiki data validator (gwv)](https://github.com/kurgm/gwv)
- [kage-engine-2](https://github.com/ge9/kage-engine-2)

# dependencies
- [AFDKO](https://github.com/adobe-type-tools/afdko)
- basic unix commands (sh, grep, sed, etc.) 
  - need GNU sed (gsed), GNU grep (ggrep), and GNU awk (gawk);
  - Works in Cygwin
- Node.js (tested with v14 and v18)
- Perl (for perl-scripts)
- Python (**version 3.8+ required** for gwv)
- Inkscape (version 1.0+)
- FontForge
- sqlite3

# preparation
- run `git submodule update --init --recursive` to fetch submodules (or you can specify `--recursive` when cloning)
- run `npm i` in `js` and `gwv-view` dir

# 基本的な使い方
まず、トップディレクトリでmakeを実行することで、元となるGlyphWikiデータのダウンロードやフォントに使用するグリフ実体の列挙（.glyphsファイルの生成）、各種の検証などが行われる。
検証などはフォントのビルドにあたって必須というわけではないが、GlyphWikiデータの問題点の検出などに役立つ。
このmakeの所要時間は数分ほどである。
それが終わったら、makesvgフォルダに移動し、makesvg.shを実行する。これにより各ウェイトのグリフデータがSVG形式で生成される。使用する文字セットなどはmakesvg.shを編集して指定する。以降はこのSVGと.glyphsファイルのみが使われる。
次にmakefontフォルダに移動し、makefont.shを実行する。これにより、AFDKOを用いてotfフォントが生成される。
次にmakettfフォルダに移動し、makettf.shを実行する。これにより、ヒント/ヒント命令付きのTrueTypeフォントが生成される。
GlyphWikiダンプを更新したいときはトップディレクトリなどでmake cleanをしてからやり直せばよい。

# カスタム部品や不正データの管理について
KAGEエンジンが提供する通常のストロークでは綺麗に表現するのが難しいグリフも存在する。そこで、エディタ上での編集ではなくKAGEデータを直接変更して通常許容されない形状を実現することが慣用的に行われている。また、謎乃明朝では自作エンジン（kage-engine-2）で追加した独自形式のグリフを使用している場合もある。
これらのグリフに関する情報もこのリポジトリで管理されている。詳しくは以下のconfigフォルダ等の説明を参照。

# 以下、各フォルダについての説明

# hanyo
汎用電子関連のファイル。hd2ucs.txtはデータ検証のために使おうかと思っていたが、結局使っていない。そもそもこのhd2ucs.txtは元リポジトリhttps://github.com/cjkvi/cjkvi-data/ 上ですでに削除されており、正当性は不明確である。
非漢字としてU+3005、U+3006、U+303B、U+30FFの4文字が含まれている。

# MJ
文字情報基盤関連のファイル。https://moji.or.jp/mojikiban/mjlist/ で管理されているUCSをフォントに追加するために設置したがグリフ集合として使い勝手があまり良くなかった（文字数が中途半端に多い）ため結局使っていない。詳しくはフォルダ内のREADME.mdも参照。

# SHS-JP
Source Han Sans（源ノ角ゴシック）に関するファイル。源ノ角ゴシックには使用頻度が比較的高いBMP外の文字が含まれているため、花園明朝Aにもこの内容が収録されており、謎乃明朝でもこれに従う。GlyphWiki上では https://glyphwiki.org/wiki/Group-talk:SourceHanSans-nonBMP などに記述あり。
基本多言語面の文字は全て収録することが確定しているので、第2面以降のみ使用している。各言語版が別々に用意されているが、少なくとも第2面以降の収録漢字に関して差はないようである。これはdiffコマンドで確認されるようになっている。
Source Han SansだけでなくSource Han Serifに関する処理もあるが、Serifに含まれるグリフはSansにも含まれていることがわかる。従ってフォント生成時はSansのほうを使う。

# glyphwiki
GlyphWikiから取得したグリフデータを保管する。
GlyphWikiが提供するダンプファイルはdump_all_versions.txtとdump_newest_only.txtの2つに分かれており、dump_all_versions.txtには白紙化されたものを除く全てのバージョンのグリフのデータ、dump_newest_only.txtには全グリフの最新版のみのデータが含まれている。
白紙化データが全くないため、dump_all_versions.txtを見ただけでは、どのバージョンが最新なのか（最新版が白紙化データなのかどうか）を判断することができない。一方、dump_newest_only.txtには最新版データしかないので、旧バージョンの部品を引用しているグリフの生成には使えない。
そこで、glyphwikiフォルダにおいては、dump_all_versions.txtのデータ構造を扱いやすくしたkage.sqlite3というSQLite3形式のデータベースファイルを生成する。
kage.sqlite3はglyphsという単一のテーブルを持ち、glyphsテーブルにはname, version, is_latest, related, kageの5つのカラムがある。
nameはグリフ名（u4e00など）、versionはバージョン番号、is_latestはそのグリフが最新版かどうか（最新版なら1、そうでなければ0）、relatedは関連字、kageはKAGEデータを保持する。
kage.sqlite3には最新版の白紙化データも含まれ、それらはkageが"0:0:0:0"に設定されている。
これにより、kage.sqlite3を見ただけで、最新バージョンの番号およびそれが白紙化されているかどうかがただちにわかる。
最新バージョン以外の白紙化データについては追加していない（つまり、バージョン番号に抜けがある場合がある）。
また、turgenev（自分）以外のユーザー占有グリフも除外している。

# glyphs
フォントの内容を決定する*.glyphsファイルを生成する重要なフォルダ。
## .glyphsの仕様
例
```
gw/u8279-j	<8279>,<8279 E0100>,<2EBE>,<8279 E0105>	14197
gw/ufa5e	<FA5E>,<2EBF>,<8279 E0104>,<8279 FE01>,<8279 E0102>	14198
```
3列あり、列の間はタブスペース区切り。ファイル末尾に空行が入ってもよい。以下、それぞれの列について説明する。
### 第1列
グリフの実体データを指定する。xxx/というのは名前空間のようなものを表しているつもりで、例ではGlyphWikiのu8279-jを使うという指定。将来的に他フォント・サイトなどからのグリフを合成することを想定してこのような仕様にしているが、現在はgw/しか使っておらず、そのように仮定した実装になっている。
### 第2列
そのグリフを使用するコードポイントの一覧。multiset扱いなので、重複があっても無視されて問題なく処理される。全て大文字。Unicodeを指定する場合は16進数をそのまま書き、IVS・SVSなら半角スペースで区切ってベースの文字コードと異体字セレクタの文字コードを並べる。（Sequenceファイルの文法と類似）。その他、（タブスペースやカンマやスペースのような特殊文字以外であれば）だいたい何を入れても大丈夫。
### 第3列
そのグリフを割り当てるCIDを記述する。重複禁止。指定しない場合は-1。ただし謎乃明朝+の生成時などはCID指定が無視される（全て-1と書いたのと同じ扱い）。
-1を指定した際は（現在の実装では）グリフ順に並べられる。
## 生成過程
大まかには、aj1の漢字→その他IVS→UCSの一部（ucs-main.rangeで指定したもの）→CJK互換漢字（+補助）とそのSVS→その他UCS（ここも何段階かに分ける）→その他文字、という順番で文字を追加している。Linuxの設定ファイル風に、生成順になるよう2桁の数字を付けている。
AJ1が最初なのは、AJ1に含まれる文字のCIDをAJ1と一致させるため。AJ1の漢字はaj1-xxxxxから取っている。
AJ1の追加時は各CIDを別々のグリフに配置し、仮に字形が共通するものがあったとしても（ただし実際は2-3個しかない）統合はしない。
IVSはglyphwikiのivsグリフから。Unicode文字はUCSグリフから。
SVSはグリフの追加はなく、コードポイントの割り当てのみ。
「その他UCS」では、SVSの基底文字、IVSの基底文字、Source Han Sansに含まれる文字、（現在未使用だがMoji_JOHOに含まれる文字）、汎用電子（hd2ucs.txt）に含まれる文字（非漢字4つを含む）、その他UCSの漢字、という順で追加している。「Source Han Sansに含まれる文字」のところまでが「謎乃明朝」に収録される。最後の「その他UCSの漢字」までに追加された文字からU+20000-U+2EFFFの範囲（＝SIPのうちCJK互換漢字補助を除く）を抽出したものが謎乃明朝+に収録される（99-extB-F.glyphs）。
さらに、「その他文字」では今後Unicodeに追加される可能性が高いirg2021-グリフ、及び各種地域ソースを追加している。これらは最終的なフォントには含まれないが、データの検証の対象とする。

# config
グリフの選定に関する設定など、小規模なファイルを入れておくところ。
## kanjisample.grep
このファイルを用いてgrep -fをすることで謎乃明朝のサンプルフォント用の.glyphsを生成している。
## config.mk
フォント生成に関するグローバルな設定を保管する。
PREFER_SOURCE…!jや!j!などと設定するとUCSコードポイントとしてそれらの地域ソースのグリフを優先的に使用する。!jの場合はuXXXX-jが存在する場合のみ、!j!の場合はuXXXX-jvがある場合にもそれが使用される。これにより各地域対応のフォントをビルドすることができる。buhin-subst.jsの説明も参照。
## rangeファイル
ucs-all.rangeでUnicodeの全グリフを指定
ucs-main.rangeで謎乃明朝（"+"じゃない方）に入れるグリフを指定
## GlyphWikiのグリフの置換指定・バージョン検査用ファイル
### force_version.conf
u5000>=4のような書式で部品の最低バージョンを指定する。単にu5000と書いた場合は最新版のみ許容される。違反してもフォント生成に支障はないが、verify-versionのところで「ERROR: illegal old version glyph: u5000@1」のような警告が表示される。
- 省略すると最新版になるのは、当面の使い勝手のためにこのような仕様にしただけで、本来は明示的に最新バージョンを指定するのが良いかもしれない。現状だと、この方式で指定しているグリフに更新が発生すると、エラー扱いになるため、そのたびに該当グリフにバージョン番号を手動で付記するという場当たり的な運用方法になっている。
白紙化された部品が最新版のみ許容するよう指定されていた場合は、使用禁止ということになる。あるいはu5000>=1000のような大きな番号を使用して使用禁止を表現することもできる。
### subst_glyph.conf
現状、あまり使われていない。
部品ではなくグリフ単位での置換を指定するファイルで、「どのグリフを使うか」を決定するとき、つまりmake-body.jsによるglyphsファイルの生成時のみ使われる。たとえばu4e00はこの字形にしたい、といったときに使う。
置換指定をしても、そのグリフを部品として引用しているグリフには影響しない。ただし、そのグリフを実体とするエイリアスには同様の置換が適用される（変更の可能性あり）。
循環参照にならないように注意が必要。
置換元のバージョン指定は@を付ければ可能だがあまり想定はしていない（あくまで、現在のデフォルトと異なるグリフを使うためのものである）。最低バージョン指定などは無し。置換先バージョン指定可。例えばu4e00の字形をu4e01@のものに変更するよう指定できる。
### subst_parts.conf
部品の置換を指定する。「実際にどんな字形にするか」を決定するために使う。force_version.confと同じく、バージョン指定無しなら最新のみだが、置換元の最低バージョン指定可（ただし複数バージョンを対象にするとなると形状が異なる部品で置換してしまう可能性もあるため注意が必要）。置換先バージョン指定可。例えば、「さんずい」を全て別の形状に変更したい、などといった際に使う。置換先指定がない場合、`turgenev_altg-`を付加したものに置換する仕様としている。
ユーザー占有グリフが使われていてエラーが起きた場合（あらかじめデータベースから削ってしまっているのでエラーになる）などもこのファイルで置換することで回避可能。例えば以下のようにすると確実にnonexistent_userglyphというグリフによるエラーを避けられる。u0123は漢字に使われないグリフとして適当に選んだ。後からall.parts-listを見てu0123を探せばよい（実際、ユーザー占有グリフが使用されていた場合は手動でこの作業を行っている）。
nonexistent_userglyph>=0 u0123
また、force_version.confの機能を兼ねていて、違反するグリフは前述のものと同じ警告が出る。これは一部バージョンのみが別部品に置き換えられるとデザインが不整合になるおそれがあるためである。
### whitelist.conf
デザイン上、やむを得ず不正データが使われているものについては、検査対象外とするため、ここに指定する。こちらも最低バージョン指定可能（省略は最新版指定と同等）。この内容とsubst_partsのうち一部（不正データが用いられていて、かつカスタム部品に置換されるもの）をあわせたものが
https://glyphwiki.org/wiki/Group:KAGE%e3%82%a8%e3%83%b3%e3%82%b8%e3%83%b3-%e5%95%8f%e9%a1%8c%e3%81%ae%e3%81%82%e3%82%8b%e6%bc%a2%e5%ad%97%e3%82%b0%e3%83%aa%e3%83%95
の前半部分にあたる。
# js
フォント生成などのための各種JavaScriptファイル。Node.jsで動作する。
## util.js
subst_parts.confのパースなど、ユーティリティ関数。
## buhin-subst.js
部品の管理を行うBuhinクラスを提供する。もとのKAGEエンジンのbuhin.jsのBuhinクラスと同様の動作をするが、部品の置換などの機能を持つ。エイリアスを追跡して実体名を返すsearch_body関数（subst_glyph.confが使われる）と、実際のKAGEデータを返す（たとえばエイリアスだとしても99:0:0:0:200:200:xxxxがそのまま返される）search関数（subst_parts.confが使われる）の2つを提供する。
ここにsqlite3ファイルのパスなどがハードコードされている。
## make-body.js
```
make-body.js [input file1] [input file2] ...
```
グリフのリストファイル（複数指定可）が与えられると、対応する実体の一覧ファイルを出力する。
## make-cache.js
グリフのリストファイルが与えられると、それらのグリフで使われている部品（グリフそれ自体を含む）の（重複のない）リストを出力する。
## make-font.js
```
make-font.js [INPUT(.glyphs)] [OUTPUT_PATH(.svg or directory)] [weight]
```
KAGEエンジンを使用してsvgデータを生成するメインのスクリプト。
weightのところは全て大文字で指定する。CLASSICとすると従来のKAGEエンジン（kurgm氏のもの）、LIGHT, REGULARなどその他の値では自作エンジンが使われる。
CLASSICの場合はカスタム部品は使用しない。
また、CLASSICの場合はClipper（本家の花園明朝でも使われている）（正確にはNode.js用のjs-angusj-clipper）を使ってパスを結合（union）した上で、OUTPUT_PATHに直接svgの内容（ヘッダなどは除く）が追記される。それ以外の場合はパスの結合はせず（clipperは曲線には非対応）、OUTPUT_PATHにディレクトリが作られてそこにグリフ1文字ごとに別々のsvgファイルが生成される。この際、単一のフォルダにファイルが増えすぎるとI/Oパフォーマンスが落ちるため、md5ハッシュを計算してフォルダを分けている。
特に自作エンジンを使用する場合、曲線近似などの計算量が多いため、数万グリフ程度を出力するために数十分程度かかる。
## normalize-svg-font.js
SVGPathCommanderを使用して、SVGのパスから使われている相対座標表記やv, h命令（水平・垂直な直線）を取り除いて絶対座標表記に変換し、さらにパスの向きを反転する。
# verify-alias-gw
glyphwiki上でのグリフの整合性を検証する。最終的な生成物は*.gwファイルで、これらはGlyphWikiのページの表としてそのまま使える構文で出力される。
- svs-cjkc.gw…CJK互換漢字とCJK互換漢字補助のグリフが対応するSVSグリフと一致するかどうか。必ず一致している必要がある。
- aj1.gw…AJ1が対応しているIVS・SVSグリフ（uXXXX-ue01XXおよびuXXXX-ufeXX）がaj1-xxxxxグリフと一致しているかどうか。IVSに関してはAJ1が定めるIVSなので全て一致している必要があるが、SVSに関してはそうとは限らない。
- aj1-only.gw…AJ1で-ue0100しか持たないUnicodeコードポイントの字形が無印のuXXXXと一致しているかどうか。これは一致していなくても構わない。
- kanji.gw…AJ1で、-ue0100しか持たないものを除いたUnicodeコードポイントについて、AJ1のCMap上で指定されたCIDのグリフとGlyphWikiでの無印UCSグリフが一致するかどうか。これも一致していなくても構わない。
- ivs-aj1.gw…uXXXX-ue01XXとaj1-XXXXXが一致するかどうか。全て一致する必要がある。aj1.gwと重複する内容だが、検証元ファイルとしてAJ1のAdobe-Japan1_sequence.txtではなくIVD_Sequences.txtを用いている。
- ivs-jmj.gw、ivs-hanyo-juki.gw、ivs-hanyo-koseki.gw、ivs-hanyo-toki.gw…jmj-XXXXXXやtoki-XXXXXXXXなどのグリフの内容がIVDファイルでの番号と一致するかどうか。不一致が多い。
- must-be-identical.gw…must-be-identicalファイルに手動で記述した、字形が同一であるべきペア。現在は、AJ1で同一と指定されているIVSのペアのみが指定されている。ただし、CID共有の字についてはaj1-xxxxxとuxxxx-ue01xxのverifyで見ているため、事実上必要なのはCIDが別の3組（u5315、u55a9、u6e23）のみである。このうちu55a9はIVD規格票上で字形が異なり、GlyphWikiでも実際に異なる字形になっている。ただ、技術的にはそれでも特に問題はないので放置している。

# makesvg
make-font.jsを使ってSVGフォントを生成する。makesvg.shを実行すればよい。
CLASSICの場合はmake-font.jsの出力がそのまま最終的な出力になる。それ以外では、inkscapeでパスの結合（union）、fontforgeで単純化が行われる。Inkscapeの1.2以降では https://gitlab.com/inkscape/inbox/-/issues/6903 に書いてあるようなエラーメッセージが出続けるバグ（？）がある。
CLASSICの場合は数万グリフあたり数十分-1時間程度、それ以外の場合は1時間-数時間程度かかる。

# makefont
AFDKOを使ってフォントをビルドする。makefont.shを実行すればよい。
mergefontにおいて最初に指定する「親フォント」においてはsvgが使えないので、まず「.notdef」や半角スペースなど漢字以外のシステムグリフを含んだsystem.pfaを生成する。notdefglyph.sfdに.notdefの元データがある。
次に、mergefontsコマンドによりsystem.pfaにSVGデータを追加し、merged.rawを生成する。そこにヒント情報を付加する。ヒントの付加には多少時間がかかる（数万グリフあたり20-30分程度）。
最後に、異体字ファイルやCMap、バージョン番号などのメタ的な情報を付加してフォントが生成される。
詳しくは筆者による記事[AFDKOによるOpenTypeフォントの作成 - Turgenev's Wiki](https://turgenev.cloudfree.jp/wiki/AFDKO%E3%81%AB%E3%82%88%E3%82%8BOpenType%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E3%81%AE%E4%BD%9C%E6%88%90)も参照。
.envファイルは各フォント向けの環境変数設定をまとめたもの。これをfileenvという単純なスクリプトで読み込んで使っている。

# makettf
AFDKOでビルドしたotfからTrueTypeフォントを作成するためのディレクトリ。makettf.shを使う。数万グリフあたり数十分程度かかる。AFDKOのotf2ttfで形式の変換を行ったあと、FontForgeによりヒント・ヒント命令を付加している。これにより文字サイズが小さいときのディスプレイ上での視認性が向上するが、サイズはかなり大きくなる（otfの2.5倍程度）。

# gwv-view
このディレクトリで`npm start`とするとブラウザでグリフの問題点を一覧することができる。オリジナルの https://github.com/kurgm/gwv-view のコードを改変し、verify-designフォルダに生成されるgwv_result.conv.jsonの内容を表示するようにしている。

# verify-design
グリフに関する問題点を分析するためのフォルダ。最終的には、gwvコマンドを用いてgwv_result.conv.jsonが生成される。verify-version.jsはグリフ実体のリストを入力として、force-versionとsubst_partsに従ってバージョン違反の部品を警告し、検査の必要がない部品（subst_partsでカスタム部品に置き換えられるものやwhitelistに指定されたもの）を取り除き、実際に検査すべき実体のリストを出力する。
これとkage.sqlite3をもとに検査すべきグリフのデータが（dump_all_versions.txtに準拠したフォーマットで）生成され、それがgwvに入力される。
check-design.jsはgwvが対応していないその他デザイン上の問題点を検出するためにge9が自作したもの。「八屋根」形状の修正や「にんべん」「けものへん」用のカスタム部品の作成のために用いた。結果は https://glyphwiki.org/wiki/Group:turgenev_check-design にも掲載している。

# VS
異体字シーケンスに関するファイルの保管場所。
# perl-scripts
[perl-scripts](https://github.com/adobe-type-tools/perl-scripts)を保管するsubmodule。

# ext-fonts
外部フォントに関する設定を入れるために作ったが、現在使われていない。
# debug
デバッグ作業用の一時ディレクトリ。
