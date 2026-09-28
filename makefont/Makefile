config_dir=../config
include $(config_dir)/config.mk

all:test.final.otf
#Apparently the first (parent) font must be pfa 
system.pfa:
	tx -t1 system.svg > $@
#system.ps:
#	tx -ps system.svg > $@
%.merged.raw:system.pfa %.out.map
	. ./$$(echo $@|cut -f 1 -d "-").env && \
	NZM_WEIGHT_STR=$$(echo $@ | cut -f 2 -d "-" | cut -f 1 -d ".") && \
	cat system.map.template | sed "s/%NZM_CHARSET_PS_NAME/$$NZM_CHARSET_PS_NAME/; s/%NZM_WEIGHT_STR/$$NZM_WEIGHT_STR/; s/%NZM_DSP_CID/$$NZM_DSP_CID/; s/%NZM_VSP_CID/$$NZM_VSP_CID/" > $*.system.map.final && \
	cat cidfontinfo.template | sed "s/%NZM_CHARSET_PS_NAME/$$NZM_CHARSET_PS_NAME/; s/%NZM_CHARSET_NAME/$$NZM_CHARSET_NAME/; s/%NZM_WEIGHT_STR/$$NZM_WEIGHT_STR/; s/%NZM_FONT_VER/$(NZM_FONT_VER)/" > $*.cidfontinfo.final && \
	mergefonts -cid $*.cidfontinfo.final $@ $*.system.map.final system.pfa $*.out.map $$NZM_SVG_DIR/$$NZM_WEIGHT_STR.$$NZM_CHARSET_PARAM.final.svg
	rm $*.cidfontinfo.final $*.system.map.final
%.merged-hint.raw:%.merged.raw
	../perl-scripts/hintcidfont.pl hintparam.txt < $^ > $^.temp
	psautohint $^.temp -o $@
	rm $^.temp
%.otf:%.merged-hint.raw %.out.cmap.final %.out.vs #なぜかWindowsのC:ドライブとか普通の場所に移動しないと使えない？？
	. ./$$(echo $@|cut -f 1 -d "-").env && \
	NZM_WEIGHT_STR=$$(echo $@ | cut -f 2 -d "-" | cut -f 1 -d ".") && \
	NZM_WEIGHT_NUM=$$(./get-weight-num.sh $$NZM_WEIGHT_STR) && \
	cat FontMenuNameDB.template | sed "s/%NZM_CHARSET_PS_NAME/$$NZM_CHARSET_PS_NAME/; s/%NZM_WEIGHT_STR/$$NZM_WEIGHT_STR/; s/%NZM_CHARSET_NAME/$$NZM_CHARSET_NAME/" > $*.FontMenuNameDB.final && \
	cat features.template | sed "s/%NZM_VSP_CID/$$NZM_VSP_CID/; s/%NZM_WEIGHT_NUM/$$NZM_WEIGHT_NUM/; s/%NZM_FONT_VER/$(NZM_FONT_VER)/" > $*.features.final && \
	makeotf -f $*.merged-hint.raw -ff $*.features.final -o $@ -ch $*.out.cmap.final -ci $*.out.vs -mf $*.FontMenuNameDB.final -r
	rm  $*.FontMenuNameDB.final $*.features.final
#	rm FontMenuNameDB features
#-omitMacNames
%.pdf:%.otf
	tx -pdf $^ > $@
clean:
	rm -f *.pdf *.pfa *.raw *.otf *.ttx *.out.* *.final *.temp NazoMinCMAP-UTF*-H
%.out.cmap %.out.vs %.out.map:
	. ./$$(echo $@|cut -f 1 -d "-").env && \
	NZM_WEIGHT_STR=$$(echo $@ | cut -f 2 -d "-" | cut -f 1 -d ".") && \
	export NZM_MIN_CID_AVAILABLE NZM_USE_AJ1_CID NZM_USE_VS && \
	env NZM_MAKECMAP_PSNAME=NazoMin$$NZM_CHARSET_PS_NAME-$$NZM_WEIGHT_STR python makecmap_seq.py $* $$NZM_GLYPHS_DIR/$$NZM_CHARSET_PARAM.glyphs
%.out.cmap.pre:%.out.cmap
	. ./$$(echo $@|cut -f 1 -d "-").env && \
	NZM_WEIGHT_STR=$$(echo $@ | cut -f 2 -d "-" | cut -f 1 -d ".") && \
	cat CMAP_begin.template | sed "s/%NZM_DSP_CID/$$NZM_DSP_CID/" > $*.CMAP_begin.final
	cat $^ | sed "s/^/1 begincidchar\n/ ; s/$$/\nendcidchar/" | cat $*.CMAP_begin.final - CMAP_end > $@
	rm $*.CMAP_begin.final
%.out.cmap.final:%.out.cmap.pre
	../perl-scripts/cmap-tool.pl < $^ > $@