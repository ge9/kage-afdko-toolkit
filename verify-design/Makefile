gwv_result.conv.json:gwv_result.json
	node convert-json.js
gwv_result.json:glyph-data-to-verify.txt
	gwv glyph-data-to-verify.txt
#glyph-data-to-verify.txt:used-glyphs-to-verify.txt
#	node grep-f-mem.js $^ ../glyphwiki/dump_all_versions.txt
glyph-data-to-verify.txt:used-glyphs-to-verify.txt
# 検査対象の部品を一覧するtable "temp_pairs"を作成
	sqlite3 ../glyphwiki/kage.sqlite3 "CREATE TABLE temp_pairs (name TEXT, version INTEGER);"
	sqlite3 -separator "@" ../glyphwiki/kage.sqlite3 ".import $^ temp_pairs"
# temp_pairsにあるものだけ出力
	sqlite3 ../glyphwiki/kage.sqlite3 "SELECT * FROM glyphs WHERE (name, version) IN (SELECT name, version FROM temp_pairs);" | sed -e 's/|/\\@/; s/|/||/; s/\\@[0-9]*||1|/|/; s/||0|/|/;' > $@
# テーブルを消す
	sqlite3 ../glyphwiki/kage.sqlite3 "DROP TABLE temp_pairs;"
used-glyphs-to-verify.txt:
	node verify-version.js ../glyphs/all.parts-list $@
clean:
	rm -f used-glyphs-to-verify.txt glyph-data-to-verify.txt gwv*.json
check-suspicious-unicode:used-glyphs-to-verify.txt
	@cat $^ | grep -E "^u[01]...([@-]|$$)" | cat
	@cat $^ | grep -E "^u2[0-9a-d]..([@-]|$$)" | cat
	@cat $^ | grep -E "^u2e[0-7].([@-]|$$)" | cat
	@cat $^ | grep -E "^u3[0-3]..([@-]|$$)" | cat
	@cat $^ | grep -E "^u[a-e]...([@-]|$$)" | cat
	@cat $^ | grep -E "^uf[0-8b-f]...([@-]|$$)" | cat
	@cat $^ | grep -E "^u1....([@-]|$$)" | cat
	