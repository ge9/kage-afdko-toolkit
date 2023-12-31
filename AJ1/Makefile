all:kanji-name-list ucs-in-V-not-in-H UniJIS2004-UTF32-H
UniJIS2004-UTF32-H:
	wget https://raw.githubusercontent.com/adobe-type-tools/cmap-resources/master/Adobe-Japan1-7/CMap/UniJIS2004-UTF32-H
UniJIS2004-UTF32-V:
	wget https://raw.githubusercontent.com/adobe-type-tools/cmap-resources/master/Adobe-Japan1-7/CMap/UniJIS2004-UTF32-V
aj17-kanji.txt:
	wget https://raw.githubusercontent.com/adobe-type-tools/Adobe-Japan1/master/aj17-kanji.txt
kanji-list:aj17-kanji.txt
	cat $^ | grep -v '#' | cut -f 1 > $@
simple-H.cmap:UniJIS2004-UTF32-H
	../perl-scripts/cmap-tool.pl -e < $^ | sed -n -r 's/^<([^<>]*)> ([0-9]*)$$/\1 \2/p' > $@
simple-V.cmap:UniJIS2004-UTF32-V
	../perl-scripts/cmap-tool.pl -e < $^ | sed -n -r 's/^<([^<>]*)> ([0-9]*)$$/\1 \2/p' > $@
#must be empty (using "!" to negate the exit status of grep)
ucs-in-V-not-in-H:simple-H.cmap simple-V.cmap
	! cat simple-H.cmap | sed -E 's/([0-9a-f]+) [0-9]+/\1/' | grep -wvf - simple-V.cmap > $@
	touch $@
ucs-not-in-CJK:ucs-in-V-not-in-H
	cat ../ucs/ucs.all.ids | tr '[:upper:]' '[:lower:]' | sed 's/^/00/' | grep -vf - simple-H.cmap | cut -f 1 -d ' ' > $@
ucs-not-in-SHS:ucs-in-V-not-in-H
	cat ../SHS-JP/UTF32.cmap | cut -f 1 -d ' ' | grep -vf - simple-H.cmap | cut -f 1 -d ' ' > $@
%.cids:%.cmap
	cat $^ | sed -r 's/^[^ ]+ ([0-9]*)$$/\1/' > $@
clean:
	rm -f kanji-*list *.cmap UniJIS2004-* aj17-kanji.txt ucs-*
clean-all:clean
	rm -f UniJIS2004-UTF32-H UniJIS2004-UTF32-V aj17-kanji.txt ucs-in-V-not-in-H
kanji-name-list: kanji-list
	cat $^ | xargs printf "%05d\n" | sed 's/^/aj1-/' > $@