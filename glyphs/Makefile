VS_dir=../VS
AJ1_dir=../AJ1
config_dir=../config
GlyphWiki_dir=../glyphwiki
include $(config_dir)/config.mk
NS := ucs-all ucs-main ucs-ivsbase ucs-svsbase ucs-mj ucs-hanyo ucs-SHSans aj1kanji aj1kanji-new ivs-other irg2021 irg2024 irg2015 irg2017 rgnsource
NAMES := $(addsuffix .name,$(NS))
BODIES := $(addsuffix .body,$(NAMES))
#ここで!を付けておくと存在しなかった場合に-*v（仮想地域ソース）が参照される。buhin-subst.jsも参照。
#（網羅性という観点ではj, jvなどそれぞれ明示的に指定したほうがよい？（-jが誤って作成されていると-jvが無視される））
RGN_SOURCES := g! t! j! k! v! h! kp! u m! s! uk us i ja js jn
all:all.parts-list 99-extB-F.glyphs kanjisample.glyphs kanjidebug.glyphs #bugs.glyphs

%.parts-list: %.glyphs
	node ../js/make-cache.js $^ $@
kanjisample.glyphs:70-ucs-all.glyphs
	grep -f $(config_dir)/kanjisample.grep $^ > $@
bugs.glyphs:70-ucs-all.glyphs
	grep -f $(config_dir)/bugs.grep $^ > $@
kanjidebug.glyphs:
	cp $(config_dir)/kanjidebug.glyphs $@

#コメントアウトされたものは、将来的にはこのように使うだろうと予想される例
#今は重くなりすぎるので、実体の列挙のみ行い、割り当てポイントは無視
irg2021.list:irg2021.name.body
	cat $^ | $(GNU_GREP) -v "****error****" | sed "s/$$/\tXXXX/" > $@
#irg2021.list:irg2021.name.body irg2021.name
#	paste $^ | $(GNU_GREP) -v "****error****" > $@
irg2024.list:irg2024.name.body
	cat $^ | $(GNU_GREP) -v "****error****" | sed "s/$$/\tXXXX/" > $@
irg2015.list:irg2015.name.body
	cat $^ | $(GNU_GREP) -v "****error****" | sed "s/$$/\tXXXX/" > $@
irg2017.list:irg2017.name.body
	cat $^ | $(GNU_GREP) -v "****error****" | sed "s/$$/\tXXXX/" > $@


irg2021.name:
	seq 1 4952 | xargs printf "%05d\n" | sed "s/^/irg2021-/" > $@
irg2024.name:
	seq 1 4674 | xargs printf "%05d\n" | sed "s/^/irg2024-/" > $@
irg2015.name:
	seq 1 5547 | xargs printf "%05d\n" | sed "s/^/irg2015-/" > $@
irg2017.name:
	seq 1 5039 | xargs printf "%05d\n" | sed "s/^/irg2017-/" > $@
rgnsource.list:rgnsource.name.body
	cat rgnsource.name | sed 's/^/RGN:/' | paste $^ -> $@
#rgnsource.list:rgnsource.name.body rgnsource.name
#	paste $^ > $@
rgnsource.name:ucs-all.ids
# 空にする
# support CRLF by `\r?$$`
	cat /dev/null > $@
	list='$(RGN_SOURCES)'; for rgnsrc in $$list; do \
	cat ucs-all.name | sed "s/\r\{0,1\}$$/!$$rgnsrc/" >> $@ || exit 1;\
	done

# 各.nameから個別に生成しても構わないが、一度に生成したほうが効率がいい
$(BODIES): $(NAMES)
	node ../js/make-body.js $^
ucs-all.ids:
	python make-ucs-list.py $(config_dir)/ucs-all.range > $@
ucs-main.ids:
	python make-ucs-list.py $(config_dir)/ucs-main.range > $@
ucs-svsbase.ids:
	cat ../VS/StandardizedVariants.txt | grep "CJK COMPATIBILITY IDEOGRAPH" | cut -f 1 -d " " > $@
ucs-ivsbase.ids:
	cat ../VS/IVD_Sequences.txt | grep -v ^# | cut -f 1 -d " " > $@
#現在使われていない。（空ファイル）
ucs-mj.ids:
	cat ../MJ/MJ.list | sed -n "s/^U+//p" > $@
ucs-hanyo.ids:
	cp ../hanyo/hd.list $@
ucs-SHSans.ids:
	cat ../SHS-JP/JP.SHSans.sip ../SHS-JP/JP.SHSans.tip | cut -f 1 -d " " | sed "s/^000//" > $@
#ucs-meiryo.ids:
#	(ext-fontsの中にスクリプトあり)
%.name:%.ids
	cat $^ | tr '[:upper:]' '[:lower:]' | sed 's/^/u/'  | sed 's/$$/$(PREFER_SOURCE)/' > $@
%.ucslist:%.name.body %.ids
#更新されないことがあるのでtouchする
	touch $@
	paste $^ > $@
#make glyphs files
#extB-extF and extI. 互換漢字補助は除く
99-extB-F.glyphs:70-ucs-all.glyphs
	cat $^ | grep -E "<2[0-9A-E]...>" > $@
all.glyphs:85-aj1.glyphs rgnsource.list
	python add-glyph.py $^ > $@
85-aj1.glyphs:83-irg2017.glyphs aj1kanji.list
	python add-glyph.py $^ > $@
83-irg2017.glyphs:82-irg2015.glyphs irg2017.list
	python add-glyph.py $^ > $@
82-irg2015.glyphs:81-irg2024.glyphs irg2015.list
	python add-glyph.py $^ > $@
81-irg2024.glyphs:80-irg2021.glyphs irg2024.list
	python add-glyph.py $^ > $@
80-irg2021.glyphs:70-ucs-all.glyphs irg2021.list
	python add-glyph.py $^ > $@
70-ucs-all.glyphs:60-ucs-hanyo.glyphs ucs-all.ucslist
	python add-glyph.py $^ > $@
60-ucs-hanyo.glyphs:55-ucs-mj.glyphs ucs-hanyo.ucslist
	python add-glyph.py $^ > $@
55-ucs-mj.glyphs:45-ucs-SHSans.glyphs ucs-mj.ucslist
	python add-glyph.py $^ > $@
45-ucs-SHSans.glyphs:40-ucs-ivsbase.glyphs ucs-SHSans.ucslist
	python add-glyph.py $^ > $@
40-ucs-ivsbase.glyphs:35-ucs-svsbase.glyphs ucs-ivsbase.ucslist
	python add-glyph.py $^ > $@
35-ucs-svsbase.glyphs:33-add-svs.glyphs ucs-svsbase.ucslist
	python add-glyph.py $^ > $@
#add SVS sequence here
33-add-svs.glyphs:30-ucs-main.glyphs $(VS_dir)/StandardizedVariants.txt
	python add-svs.py $^ > $@
30-ucs-main.glyphs:20-other-ivs.glyphs ucs-main.ucslist
	python add-glyph.py $^ > $@
20-other-ivs.glyphs:05-aj1kanji.glyphs ivs-other.list
	python add-glyph.py $^ > $@
05-aj1kanji.glyphs:aj1kanji-new.list
	python make-aj1.py $^ $(VS_dir)/Adobe-Japan1_sequences.txt > $@

#uXXXX-jn導入と同時にAJ1のIVSも概ねGlyphWikiの標準的なデザインを採用するようになったため、aj1-XXXXXではなくIVSグリフを使用
aj1kanji-new.list:aj1kanji-new.name.body
	cat ../VS/AJ1-IVS-cleaned.txt | cut -f 2 -d " " | paste $^ - > $@
aj1kanji-new.name:
	cat ../VS/AJ1-IVS-cleaned.txt | cut -f 1 -d " " > $@

#IVS重複もあるため、実体として各CIDのaj1-XXXXXを使う方がシンプルではある。
aj1kanji.list:aj1kanji.name.body
	cat aj1kanji.name | sed 's/^aj1-0*//' | paste $^ - > $@
#唯一IVSが割り当てられているAJ1の非漢字であるCID+12869（ルビ用の「注」）を追加
aj1kanji.name:
	cat ../AJ1/kanji-name-list > $@
	echo aj1-12869 >> $@
ivs-other.list:ivs-other.name.body ivs-other.ids
	paste ivs-other.name.body ivs-other.ids > $@
#"uniq" required for shared IVSes
ivs-other.ids:
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep -v 'Adobe-Japan1;' | cut -f 1 -d ";" | uniq > $@
ivs-other.name:ivs-other.ids
	cat $^ | sed 's/^/u/' | sed 's/ /-u/' | tr '[:upper:]' '[:lower:]' > ivs-other.name
clean:
	rm -f *.glyphs *.name *.list *.body *.ids *.parts-list aj1kanji.cids
#cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep -v 'Adobe-Japan1;' | cut -f 1 -d ";" | sed 's/^/u/' | sed 's/ /-u/' | tr '[:upper:]' '[:lower:]' > $@
#TEST
only-ucs.glyphs:empty ucs-main.ucslist
	python add-glyph.py $^ > $@