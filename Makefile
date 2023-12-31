SUBDIRS=glyphs verify-design
SUBDIRS_PREPARE=glyphwiki verify-alias-gw
SUBDIRS_ALL=AJ1 SHS-JP hanyo VS

all:
	list='$(SUBDIRS_ALL) $(SUBDIRS_PREPARE) $(SUBDIRS)'; for subdir in $$list; do \
	$(MAKE) -C $$subdir || exit 1;\
	done
#GlyphWikiダンプはそのままで、他のフォントデータはリセット
cleanglyph:
	list='$(SUBDIRS)'; for subdir in $$list; do \
	$(MAKE) -C $$subdir clean || exit 1;\
	done
#GlyphWikiダンプなども含めてリセット
clean:
	list='$(SUBDIRS_PREPARE) $(SUBDIRS)'; for subdir in $$list; do \
	$(MAKE) -C $$subdir clean || exit 1;\
	done
#文字セット関連など更新が少ないデータも全てリセット
cleanall:
	list='$(SUBDIRS_ALL) $(SUBDIRS_PREPARE) $(SUBDIRS)'; for subdir in $$list; do \
	$(MAKE) -C $$subdir clean || exit 1;\
	done