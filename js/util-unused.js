import Database from 'better-sqlite3';
import fs from 'fs';
import { Buhin_subst } from "./buhin-subst.js";
import syncrequest from 'sync-request'
function make_kage_hash(db_filename) {
  var db = new Database(db_filename, { readonly: true });
  var hash0 = {};
  const stmt = db.prepare("SELECT * FROM glyphs");
  for (const cat of stmt.iterate()) {
    if (hash0[cat.name] == undefined) {
      hash0[cat.name] = {};
    }
    hash0[cat.name][cat.version] = cat.kage;
  }
  return hash0;
}
function make_subst_body(subst_body_file) {
  var subst_body0 = {};
  const ls = fs.readFileSync(subst_body_file).toString().split('\n');
  for (var pair of ls) {
    if (pair == "") continue;
    var p = pair.split(" ")
    subst_body0[p[0]] = p[1]
  }
  return subst_body0;
}
function make_subst_parts(subst_parts_file) {
  var subst_parts0 = {};
  const ls1 = fs.readFileSync(subst_parts_file).toString().split('\n');
  for (var name of ls1) {
    if (name == "" || name.startsWith("#")) continue;
    var name2 = name.split(" ")
    var name3 = name2[0].split(">=")//最低バージョン指定（なければname3[1]はundefinedで、動作としては最新バージョンのみ置き換え指定）
    var parts_name = name2[1] ? name2[1] : "turgenev_altg-" + name3[0] //置換先が指定されていない場合、"turgenev_altg-"を付加
    subst_parts0[name3[0]] = [parts_name, name3[1]]//最低バージョンはundefinedでもそのまま渡す
  }
  return subst_parts0;
}

export default {make_kage_hash, make_subst_body, make_subst_parts, make_mem_buhin, make_gw_buhin, make_sql_buhin}