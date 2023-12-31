all:SHSerif.sip.diff SHSerif.tip.diff SHSans.sip.diff SHSans.tip.diff
SHSerif.sip.diff:CN.SHSerif.sip HK.SHSerif.sip JP.SHSerif.sip KR.SHSerif.sip TW.SHSerif.sip
	diff CN.SHSerif.sip HK.SHSerif.sip
	diff HK.SHSerif.sip JP.SHSerif.sip
	diff JP.SHSerif.sip KR.SHSerif.sip
	diff KR.SHSerif.sip TW.SHSerif.sip
	echo ok > $@
SHSerif.tip.diff:CN.SHSerif.tip HK.SHSerif.tip JP.SHSerif.tip KR.SHSerif.tip TW.SHSerif.tip
	diff CN.SHSerif.tip HK.SHSerif.tip
	diff HK.SHSerif.tip JP.SHSerif.tip
	diff JP.SHSerif.tip KR.SHSerif.tip
	diff KR.SHSerif.tip TW.SHSerif.tip
	echo ok > $@
SHSans.sip.diff:CN.SHSans.sip HK.SHSans.sip JP.SHSans.sip KR.SHSans.sip TW.SHSans.sip
	diff CN.SHSans.sip HK.SHSans.sip
	diff HK.SHSans.sip JP.SHSans.sip
	diff JP.SHSans.sip KR.SHSans.sip
	diff KR.SHSans.sip TW.SHSans.sip
	echo ok > $@
SHSans.tip.diff:CN.SHSans.tip HK.SHSans.tip JP.SHSans.tip KR.SHSans.tip TW.SHSans.tip
	diff CN.SHSans.tip HK.SHSans.tip
	diff HK.SHSans.tip JP.SHSans.tip
	diff JP.SHSans.tip KR.SHSans.tip
	diff KR.SHSans.tip TW.SHSans.tip
	echo ok > $@
%.SHSerif.H.16.cmap:
	wget https://github.com/adobe-fonts/source-han-serif/raw/release/Resources/UniSourceHanSerif$*-UTF16-H -O $@
%.SHSans.H.32.cmap:
	wget https://github.com/adobe-fonts/source-han-sans/raw/master/UniSourceHanSansHW$*-UTF32-H -O $@
#SHSerif-JP-H.16.cmap:
#	wget https://github.com/adobe-fonts/source-han-serif/raw/release/Resources/UniSourceHanSerifJP-UTF16-H -O $@
#SHSerif-JP-H.16.cmap:
#	wget https://github.com/adobe-fonts/source-han-serif/raw/release/Resources/UniSourceHanSerifJP-UTF16-H -O $@
%.flat:%.cmap
	../perl-scripts/cmap-tool.pl -e < $^ | sed -n -r 's/^<([^<>]*)> ([0-9]*)$$/\1 \2/p' > $@
%.32.flat:%.16.flat
	python cmap-utf16-to-utf32.py $^ | sort > $@
clean:
	rm -f *.cmap *.flat *.diff *.sip *.tip
#SHSans-JP-H.32.cmap:
#	wget https://github.com/adobe-fonts/source-han-sans/raw/master/UniSourceHanSansHWJP-UTF32-H -O $@
%.tip:%.H.32.flat
	cat $^ | cut -f 1 -d " " | grep ^0003 > $@
%.sip:%.H.32.flat
	cat $^ | cut -f 1 -d " " | grep ^0002 > $@
