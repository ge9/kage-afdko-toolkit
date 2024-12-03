VS_dir=../VS
AJ1_dir=../AJ1
config_dir=../config
GlyphWiki_dir=../glyphwiki
include $(config_dir)/config.mk
export GNU_AWK := $(GNU_AWK)
#その他手動で指定した、同一であるべきペア。現在はAJ1で同一と指定されているIVSのペアを含む
PAIR_MUST_BE_IDENTICAL := must-be-identical.1 must-be-identical.2

#aj1.gw: consistency between "aj1-XXXXX" and "uXXXX-ue01XX"(or "-ufeXX") in AJ1 file
#Adobe-Japan1_sequences.txtではIVS→SVSの順に並んでいるので、その順に並ぶはず。
#（※-jnの導入に伴い、多くのdiffが出ている）diffが出ないことが想定される
PAIR_AJ1 := aj1-seq aj1-cid
#consistency between "aj1-XXXXX" and "uXXXX-ufeXX" in AJ1 file
#PAIR_AJ1_SVS := aj1-svs-seq aj1-svs-cid

#ivs-aj1.gw consistency between "aj1-XXXXX" and "uXXXX-ue01XX" in IVD file (maybe unnecessary)
PAIR_IVS_AJ1 := ivs-aj1-seq ivs-aj1
#（※-jnの導入に伴い、多くのdiffが出ている）diffが出ないことが想定される。aj1.gwのIVS部分、つまりaj1.gwの先頭の何行かと一致するはず。

#aj1-only1.gw: consistency of Unicode point that has only "uXXXX-ue0100" (only necessary for AJ1)
PAIR_AJ1_ONLY1 := aj1-only1-seq aj1-only1-uni
#数が多い

#consistency between "uXXXX-ue01XX" and "jmj-XXXXXX", "juki-XXXXXXXX", etc.
PAIR_IVS_JMJ := ivs-jmj-seq ivs-jmj
PAIR_IVS_HANYO_JUKI := ivs-hanyo-juki-seq ivs-hanyo-juki
PAIR_IVS_HANYO_KOSEKI := ivs-hanyo-koseki-seq ivs-hanyo-koseki
PAIR_IVS_HANYO_TOKI := ivs-hanyo-toki-seq ivs-hanyo-toki
#多すぎるので無視

#svs-cjkc.gw: consistency between "uXXXX" (in CJK compatibility ideograph) and "uXXXX-ufeXX"
PAIR_SVS_CJKC := svs-cjkc-seq svs-cjkc
#diffが出ないことが想定される

#kanji.gw: consistency between "uXXXX" (referred by AJ1's cmap) and "aj1-XXXXX"
#excluding Unicode points that has "-ue0100" and has it ONLY
#because they are included in "aj1-only1.gw"
#(assuming such code points refer to corresponding CID in the CMap)
PAIR_AI1_CMAP := aj1-cmap-uni aj1-cmap-cid
#それなりに多い

PAIRS := $(PAIR_AJ1) $(PAIR_IVS_AJ1) $(PAIR_AJ1_ONLY1) $(PAIR_IVS_JMJ) $(PAIR_IVS_HANYO_JUKI) $(PAIR_IVS_HANYO_KOSEKI) $(PAIR_IVS_HANYO_TOKI) $(PAIR_SVS_CJKC) $(PAIR_AI1_CMAP) $(PAIR_MUST_BE_IDENTICAL)
NAMES := $(addsuffix .name,$(PAIRS))
BODIES := $(addsuffix .body,$(NAMES))
all:aj1.gw aj1-only1.gw ivs-aj1.gw ivs-aj1.dupl ivs-jmj.gw ivs-hanyo-juki.gw ivs-hanyo-koseki.gw ivs-hanyo-toki.gw svs-cjkc.gw kanji.gw must-be-identical.gw
#ivs-aj1-not-in-cmap:$(NAMES)
#	cat $(AJ1_dir)/kanji-name-list | grep -v -f aj1-cmap-cid.name > $@
ivs-aj1.dupl:$(BODIES)
	cat $< | sort | uniq -d | sed 's/$$/!/'> temp
	paste  ivs-aj1.name ivs-aj1.name.body ivs-aj1-seq.name ivs-aj1-seq.name.body | sed 's/$$/!/' | grep -f temp | sort -k 4 > $@
	rm temp
# formatted for GlyphWiki table
%.gw: %.diff
	./diff-glyphwiki.sh $< > $@
aj1.diff:$(BODIES)
	./makediff.sh $(PAIR_AJ1) > $@
aj1-only1.diff:$(BODIES)
	./makediff.sh $(PAIR_AJ1_ONLY1) > $@
#aj1-svs.diff:$(BODIES)
#	./makediff.sh $(PAIR_AJ1_SVS) > $@
ivs-aj1.diff:$(BODIES)
	./makediff.sh $(PAIR_IVS_AJ1) > $@
ivs-jmj.diff:$(BODIES)
	./makediff.sh $(PAIR_IVS_JMJ) > $@
ivs-hanyo-juki.diff:$(BODIES)
	./makediff.sh $(PAIR_IVS_HANYO_JUKI) > $@
ivs-hanyo-koseki.diff:$(BODIES)
	./makediff.sh $(PAIR_IVS_HANYO_KOSEKI) > $@
ivs-hanyo-toki.diff:$(BODIES)
	./makediff.sh $(PAIR_IVS_HANYO_TOKI) > $@
svs-cjkc.diff:$(BODIES)
	./makediff.sh $(PAIR_SVS_CJKC) > $@
aj1-cmap.diff.all:$(BODIES)
	./makediff.sh $(PAIR_AI1_CMAP) > $@
must-be-identical.diff:$(BODIES)
	./makediff.sh $(PAIR_MUST_BE_IDENTICAL) > $@

#excluding Unicode points that has only "-ue0100"
kanji.diff:aj1-cmap.diff.all aj1-only1-uni.name
	grep -w -f $(AJ1_dir)/kanji-name-list aj1-cmap.diff.all | grep -wvf aj1-only1-uni.name > $@

$(BODIES): $(NAMES)
	node ../js/make-body.js $^

must-be-identical.1.name:
	cat must-be-identical | grep -v "^#" | sed -E 's/<([^,<>]+),([^,<>]+)>, <.*>/u\1-u\2/' | tr '[:upper:]' '[:lower:]' > $@
must-be-identical.2.name:
	cat must-be-identical | grep -v "^#" | sed -E 's/<.*>, <([^,<>]+),([^,<>]+)>/u\1-u\2/' | tr '[:upper:]' '[:lower:]' > $@
aj1-only1-uni.name:aj1-only1-seq.name
	cat $^ | sed 's/-ue0100$$//' > $@
aj1-only1-seq.name:aj1-seq.name aj1-has-ue0101
	grep -vf aj1-has-ue0101 aj1-seq.name | grep -v '\-ufe00' > $@
aj1-seq.name:$(VS_dir)/Adobe-Japan1_sequences.txt
	cat $(VS_dir)/Adobe-Japan1_sequences.txt | grep -v '#' | cut -f 1 -d ";" | sed 's/^/u/' | sed 's/ /-u/' | tr '[:upper:]' '[:lower:]' > $@
aj1-cid.name:$(VS_dir)/Adobe-Japan1_sequences.txt
	cat $(VS_dir)/Adobe-Japan1_sequences.txt | grep -v '#' | cut -f 3 -d ";" | sed 's/^ CID+//' | xargs printf "%05d\n" | sed 's/^/aj1-/' > $@
svs-cjkc-seq.name:$(VS_dir)/StandardizedVariants.txt
	cat $(VS_dir)/StandardizedVariants.txt | grep 'CJK COMPATIBILITY IDEOGRAPH' | cut -f 1 -d ";" | sed 's/^/u/' | sed 's/ /-u/' | tr '[:upper:]' '[:lower:]' > $@
svs-cjkc.name:$(VS_dir)/StandardizedVariants.txt
	cat $(VS_dir)/StandardizedVariants.txt | grep 'CJK COMPATIBILITY IDEOGRAPH' | cut -f 2 -d ";" | sed 's/ CJK COMPATIBILITY IDEOGRAPH-/u/' | tr '[:upper:]' '[:lower:]' > $@

#aj1-svs-seq.name:$(VS_dir)/Adobe-Japan1_sequences.txt
#	cat $(VS_dir)/Adobe-Japan1_sequences.txt | grep -v '#' | grep 'Standardized_Variants' | cut -f 1 -d ";" | sed 's/^/u/' | sed 's/ /-u/' | tr '[:upper:]' '[:lower:]' > $@
#aj1-svs-cid.name:$(VS_dir)/Adobe-Japan1_sequences.txt
#	cat $(VS_dir)/Adobe-Japan1_sequences.txt | grep -v '#' | grep 'Standardized_Variants' | cut -f 3 -d ";" | sed 's/^ CID+//' | xargs printf "%05d\n" | sed 's/^/aj1-/' > $@


ivs-aj1-seq.name:$(VS_dir)/IVD_Sequences.txt
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep 'Adobe-Japan1' | cut -f 1 -d ";" | sed 's/^/u/' | sed 's/ /-u/' | tr '[:upper:]' '[:lower:]' > $@
ivs-aj1.name:$(VS_dir)/IVD_Sequences.txt
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep 'Adobe-Japan1' | cut -f 3 -d ";" | sed 's/^ CID+//' | xargs printf "%05d\n" | sed 's/^/aj1-/' > $@

ivs-jmj-seq.name:$(VS_dir)/IVD_Sequences.txt
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep 'Moji_Joho' | cut -f 1 -d ";" | sed 's/^/u/' | sed 's/ /-u/' | tr '[:upper:]' '[:lower:]' > $@
ivs-jmj.name:$(VS_dir)/IVD_Sequences.txt
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep 'Moji_Joho' | cut -f 3 -d ";" | sed 's/^ MJ//' | sed 's/^/jmj-/' > $@
ivs-hanyo-juki-seq.name:$(VS_dir)/IVD_Sequences.txt
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep 'Hanyo-Denshi; JT' | cut -f 1 -d ";" | sed 's/^/u/' | sed 's/ /-u/' | tr '[:upper:]' '[:lower:]' > $@
ivs-hanyo-juki.name:$(VS_dir)/IVD_Sequences.txt
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep 'Hanyo-Denshi; JT' | cut -f 3 -d ";" | sed 's/^ JT//' | sed 's/S$$//' | tr '[:upper:]' '[:lower:]' | sed 's/^/juki-/' > $@
ivs-hanyo-koseki-seq.name:$(VS_dir)/IVD_Sequences.txt
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep 'Hanyo-Denshi; KS' | cut -f 1 -d ";" | sed 's/^/u/' | sed 's/ /-u/' | tr '[:upper:]' '[:lower:]' > $@
ivs-hanyo-koseki.name:$(VS_dir)/IVD_Sequences.txt
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep 'Hanyo-Denshi; KS' | cut -f 3 -d ";" | sed 's/^ KS//' | sed 's/S$$//' | sed 's/^/koseki-/' > $@
ivs-hanyo-toki-seq.name:$(VS_dir)/IVD_Sequences.txt
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep 'Hanyo-Denshi; TK' | cut -f 1 -d ";" | sed 's/^/u/' | sed 's/ /-u/' | tr '[:upper:]' '[:lower:]' > $@
ivs-hanyo-toki.name:$(VS_dir)/IVD_Sequences.txt
	cat $(VS_dir)/IVD_Sequences.txt | grep -v '#' | grep 'Hanyo-Denshi; TK' | cut -f 3 -d ";" | sed 's/^ TK//' | sed 's/S$$//' | sed 's/^/toki-/' > $@

aj1-cmap:
	 ../perl-scripts/cmap-tool.pl -e < $(AJ1_dir)/UniJIS2004-UTF32-H | sed -n -e "/[0-9]* begincidchar/,/endcidchar/ p" | sed -n "s/>//; s/<0*/0x/p" > $@
aj1-cmap-uni.name:aj1-cmap
	cut -f 1 -d " " aj1-cmap | xargs printf "%04x\n" | sed 's/^/u/' > $@
aj1-cmap-cid.name:aj1-cmap
	cut -f 2 -d " " aj1-cmap | xargs printf "%05d\n" | sed 's/^/aj1-/' > $@
aj1-has-ue0101:
	cat $(VS_dir)/Adobe-Japan1_sequences.txt | grep -v '#' | cut -f 1 -d ";" | grep ' E0101' | sed 's/^/u/' | sed 's/ E0101$$/-/' | tr '[:upper:]' '[:lower:]' > $@

clean:
	rm -f *.name *.diff *.gw *.body aj1-cmap.diff.all aj1-cmap aj1-has-ue0101 ivs-aj1.dupl