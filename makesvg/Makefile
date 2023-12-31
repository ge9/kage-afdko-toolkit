config_dir=../config
# environment variables: NZM_SVG_WEIGHTS
include $(config_dir)/config.mk
#test:
all:
# usage:
# make Classic.kanjisample.nosimpl.svg
# make Regular.kanjisample.simpl.svg

# WeightがClassicの場合はjs側でパスのunionを行ってsvgフォントをそのまま出力
%.nosimpl.svg:
	cp svgfont_header $@
	node ../js/make-font.js ../glyphs/`echo $* | cut -f 2 -d .`.glyphs $@ `echo $* | cut -f 1 -d . | tr '[:lower:]' '[:upper:]'`
	echo "</font></defs></svg>" >> $@
.PRECIOUS : %.pre.svg # 中間ファイルとして中断時に削除されるのを防止
# WeightがClassic以外の場合は、まずinkscapeでunionする
%.pre.svg:
# js側でmkdirするので不要
#	mkdir -p work-$*
	node ../js/make-font.js ../glyphs/`echo $* | cut -f 2 -d .`.glyphs ./work-$*/ `echo $* | cut -f 1 -d . | tr '[:lower:]' '[:upper:]'`
	cd work-$*;find . -name '*.svg' -exec inkscape --actions="select-all;path-union" --export-type=svg {} +
	cp svgfont_header $@
	find work-$* -name '*_out.svg' -exec cat {} + | grep -E '( d="M|sodipodi:docname)' | $(GNU_SED) 'N;s/\n//g' | sed 's/   sodipodi:docname=\"/<glyph glyph-name=\"/ ; s/\.svg\" *d=/\" d=/ ; s|z \" />|z\"/>|' | sed -r "s/ -?[0-9]\.[0-9]*e-[0-9]+ / 0 /g" >> $@
	echo "</font></defs></svg>" >> $@
	rm -rf ./work-$*
# 次にfontforgeでsimplifyする
#途中のsedは、パスデータ内の改行を取り除いている
%.simpl.svg:%.pre.svg
	fontforge -script `$(GET_PATH_FOR_FONTFORGE) simpl.pe` `$(GET_PATH_FOR_FONTFORGE) $^` `$(GET_PATH_FOR_FONTFORGE) $*.simpltemp.svg`
# support CRLF
	cat $*.simpltemp.svg | $(GNU_SED) -n "s/    <glyph glyph-name=/<glyph glyph-name=/; T; : cont ; N; s/\r\{0,1\}\n//; t next; : next; s#\" />#\" /># ; t print; b cont; :print;  p" | node ../js/normalize-svg-font.js | cat svgfont_header - | $(GNU_SED) -e '$$a</font></defs></svg>'> $@
	rm $*.simpltemp.svg
	rm $*.pre.svg
clean:
	rm -rf *.svg ./work-*
