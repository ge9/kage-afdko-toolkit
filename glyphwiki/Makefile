all:kage.sqlite3
%.csv:
	make $*.txt
	cat $*.txt | grep -e "^ turgenev_" -e "^ [^@_]*\\@.*" | sed -n 's/\\@/,/p' | sed -e 's/ *| /,0,/;s/ *| /,/' | sed -e 's/^ //' > $@
	rm $*.txt
kage.sqlite3:
	make dump_all_versions.csv dump_newest_only.txt
	rm -f kage.sqlite3
	touch kage.sqlite3
	sqlite3 kage.sqlite3 "create table glyphs(name TEXT, version INTEGER, is_latest INTEGER, related INTEGER, kage TEXT);"
	sqlite3 -separator , kage.sqlite3 ".import dump_all_versions.csv glyphs"
	rm dump_all_versions.csv
#全てのグリフに対して、存在する最新バージョンより1つ新しいバージョンとして白紙化データを一時的に追加
#元々のdumpファイルには「0:0:0:0」データは存在せず、そもそも白紙化されたバージョンは行ごと存在しない、ということに注意
	sqlite3 kage.sqlite3 "INSERT INTO glyphs (name, version, is_latest, related, kage) SELECT name, MAX(version) + 1, 0, 'n/a', '0:0:0:0' FROM glyphs GROUP BY name"
#以下で、最新版が存在するものについては上記の白紙化データを除去する
# 一時的なテーブルの作成（KAGEデータなども含むが、使わない）
	sqlite3 kage.sqlite3 "create table temp_names (name TEXT, related TEXT, kage TEXT);"
# データのインポート
	sqlite3 -separator "|" kage.sqlite3 ".import dump_newest_only.txt temp_names"
	rm -f dump_newest_only.txt
# nameの前後の空白を除去
	sqlite3 kage.sqlite3 "UPDATE temp_names SET name = TRIM(name);"
# メインの操作: temp_namesに含まれているnameに関しては'0:0:0:0'になっているデータを削除
	sqlite3 kage.sqlite3 "DELETE FROM glyphs WHERE name IN (SELECT name FROM temp_names) AND kage = '0:0:0:0';"
# 一時テーブルの削除
	sqlite3 kage.sqlite3 "DROP TABLE temp_names;"
# is_latest列をデフォルト値0で追加
#	sqlite3 kage.sqlite3 "ALTER TABLE glyphs ADD COLUMN is_latest INTEGER DEFAULT 0;"
# 最新バージョンにis_latestフラグを立てる。一時テーブルを使用する。
	sqlite3 kage.sqlite3 "\
	CREATE TEMP TABLE max_versions AS SELECT name, MAX(version) AS max_version FROM glyphs GROUP BY name;\
	UPDATE glyphs SET is_latest = 1 WHERE (name, version) IN (SELECT name, max_version FROM max_versions);\
	DROP TABLE max_versions;"
test:
	sqlite3 kage.sqlite3 "SELECT * FROM glyphs WHERE name = 'cid-13370'"
dump_all_versions.txt dump_newest_only.txt:
	wget  --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" http://glyphwiki.org/dump.tar.gz
# during glyphwiki.org's maintenance or old versions
#	wget http://kage.osdn.jp/glyphwiki/dump12.tar.gz -O dump.tar.gz
	tar -xvf dump.tar.gz dump_all_versions.txt dump_newest_only.txt
	touch dump_all_versions.txt
	touch dump_newest_only.txt
	rm dump.tar.gz
clean:
	rm -f kage.sqlite3 dump_all_versions.txt dump_newest_only.txt dump_all_versions.csv
cleandb:
	rm -f kage.sqlite3