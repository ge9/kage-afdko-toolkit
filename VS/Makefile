include ../config/config.mk
#Download files relating Variation Sequences
FILES := StandardizedVariants.txt AJ1-IVS-cleaned.txt IVD_Sequences.txt
all:$(FILES)
StandardizedVariants.txt:
	wget https://www.unicode.org/Public/$(UNICODE_VERSION)/ucd/StandardizedVariants.txt
Adobe-Japan1_sequences.txt:
	wget https://raw.githubusercontent.com/adobe-type-tools/Adobe-Japan1/master/Adobe-Japan1_sequences.txt
IVD_Sequences.txt:
	wget https://www.unicode.org/ivd/data/$(IVD_VERSION)/IVD_Sequences.txt
clean:
	rm -f $(FILES)
AJ1-IVS-cleaned.txt:Adobe-Japan1_sequences.txt
	cat $^ | grep -v '^#' | grep "Adobe-Japan1" | sed -e 's/; Adobe-Japan1; CID+/ /; ' |  tr '[:upper:]' '[:lower:]' | sed -e 's/^/u/; s/ /-u/;' > $@