all:hd.list
#現在はダミーのファイルを使用
hd.list:
	cat /dev/null > $@
hd.unused.list:hd2ucs.txt
	cat $^ | sed -n "s/^.*U+\(.....\).*/\1/p" | sed "s/^0//" > $@
hd2ucs.txt:
	wget https://raw.githubusercontent.com/cjkvi/cjkvi-data/c9b9359a46d720f5a5a81d85cb5e79e93b3efdcf/hd2ucs.txt
clean:
	rm -f *.list hd2ucs.txt