import syncrequest from 'sync-request'
import Database from 'better-sqlite3';
import fs from 'fs';

export class Buhin_subst {
  constructor(get_info_ver, get_info_without_ver, subst_body, subst_parts) {
    this.subst_body = subst_body
    this.subst_parts = subst_parts
    this.cache = new Set();
    //名前とバージョンを受け取り、KAGEデータを返す。
    //該当グリフ・バージョンが存在しない（あるいは白紙化されている）場合はundefinedを返すが、グリフ自体が存在することがわかっている場合はfalseを返してもよい。
    this.get_info_ver = get_info_ver
    //バージョン指定（@）無しの引数を受け取り、KAGEデータと最新バージョン番号を返す。
    //グリフ自体が存在しない場合はundefinedを返す。
    this.get_info_without_ver = get_info_without_ver
  }
  //subst_bodyを用いる。fallback_availableがtrueのときは、検索に失敗したときに例外ではなくfalseを返す。（地域グリフ優先指定のため）
  search_body(name0, fallback_available){
    var name1 = name0.split("!")
    if (name1[1]){//ソース地域指定あり。この場合、バージョン指定には非対応
      var rgn_name = name1[0]+"-"+name1[1]//地域ソースグリフ名
      var rgn_body = this.search_body(rgn_name, true);
      if(rgn_body){//"-x"付きソースあり。
        return rgn_body
      }else if (name1[2]!=undefined){//"!"が2つ以上→仮想ソース-xvも探す
        var rgn_body2 = this.search_body(rgn_name+"v", true);
        if(rgn_body2) return rgn_body2;
      }
    }
    //ソース地域指定なしorヒットなし
    var name2=name1[0]
    if (this.subst_body[name2]){//置き換え指定。
      //これだと下手すると循環呼び出しになるので、subst_bodyがあったら一回で決め打ちしてもいいかも
      return this.search_body(this.subst_body[name2])
    }
    var name_temp = name2.split("@")
    let data = null
    if (!name_temp[1]){//バージョン指定なし
      const inf = this.get_info_without_ver(name_temp[0])
      if (!inf || inf.data == "0:0:0:0") {if (!fallback_available) {throw("ERROR: search_body: No such (latest) glyph in glyphwiki: "+name_temp[0])} else {return false}}
      data = inf.data
    }else{
      const inf = this.get_info_ver(name_temp[0], name_temp[1]);
      //実際にはfallback_availableが指定されることはないはず
      if (!inf || inf == "0:0:0:0") {if (!fallback_available) {throw("ERROR: search_body: No such glyph in glyphwiki: "+name2)} else {return false}}
      data = inf
    }
    if(data.slice(0,19)=="99:0:0:0:0:200:200:"&&data.match(/\$/)==null){//alias
      //エイリアス先でさらにsubst_bodyが適用されるのは微妙かもしれないが…
      return this.search_body(data.slice(19));
    }
    return name2;
  }

  //与えられたグリフのデータを取得する。@が付いていなければ最新版データを取得。該当グリフが存在しなければ基本的にfalseを返す。
  //バージョン指定がないときにグリフ自体が存在しなければundefinedを返す
  //バージョン指定があるときは、グリフ自体が存在しないときにundefinedを返す可能性もあるが、falseを返す可能性もある（sqliteを使うか、glyphwiki.orgを使うかなどによる）
  //subst_partsを用いる
  search(name) { // string
    const temp = name.split("@");
    if (temp[1]) {//バージョン指定あり
      if (this.subst_parts[temp[0]]) {//置き換え指定があるか？
        //置き換える最低バージョン指定
        var verstr = this.subst_parts[temp[0]][1];
        //指定がなければ最新バージョンと見なす
        if (!verstr) {
          const inf = this.get_info_without_ver(temp[0])
          if (!inf) throw "ERROR: search: tried to substitute a nonexistent glyph without specifying version: " + temp[0]
          verstr = inf.version
        }
        //バージョン指定を満たすか判定
        if ((verstr+0)<=(temp[1]+0)){
          return this.search(this.subst_parts[temp[0]][0]);//置き換え実行
        }
      }
      const info = this.get_info_ver(temp[0], temp[1]);
      if (info===false) { throw ("ERROR: search: the glyph exists, but no such version: " + name) };
      if (info===undefined || info==="0:0:0:0") { throw ("ERROR: search: no such glyph or version: " + name) };
      this.cache.add(temp[0]+"@"+temp[1]);
      return info
    } else {//バージョン指定なし。バージョン最新のものをえらぶ
      if (this.subst_parts[name]) {//最新バージョンなので無条件で置き換え
        return this.search(this.subst_parts[name][0]);
      }
      const res = this.get_info_without_ver(name);
      if (!res) throw "ERROR: search: no such glyph: " + name
      if (res.data == "0:0:0:0") throw "ERROR: search: the glyph has been deleted: " + name
      this.cache.add(name+"@"+res.version);
      return res.data
    }
  }
}

//sqlite3の内容をメモリに全て読み込む。初期化に数秒以上かかるが、最も高速。
function make_mem_buhin(noSubst) {
  var hash0 = make_kage_hash('../glyphwiki/kage.sqlite3')
  var subst_body0 = make_subst_body("../config/subst_glyph.conf");
  var subst_parts0 = make_subst_parts("../config/subst_parts.conf");
  if (noSubst) subst_parts0 = {};

  function get_info_ver(name, ver) {
    if (!hash0[name]) return undefined;
    if (!hash0[name][ver]) return false;
    return hash0[name][ver];
  }

  function get_info_without_ver(name) {
    if (!hash0[name]) return undefined;
    const vers = Object.keys(hash0[name]);
    //バージョン最大のもの
    const latest = vers.reduce((a, b) => Math.max(a, b));
    return { version: latest, data: hash0[name][latest] }
  }
  return new Buhin_subst(get_info_ver, get_info_without_ver, subst_body0, subst_parts0);
}

//glyphwikiのサイトにリクエストを行う。最も遅いが、最新のデータが利用できる。
function make_gw_buhin(noSubst) {
  var subst_body0 = make_subst_body("../config/subst_glyph.conf");
  var subst_parts0 = make_subst_parts("../config/subst_parts.conf");
  if (noSubst) subst_parts0 = {};
  function req_gw(name) {
    var response = syncrequest(
      'GET',
      'https://glyphwiki.org/json?name=' + name
    );
    return JSON.parse(response.body)
  }

  function get_info_ver(name, ver) {
    const res = req_gw(name + "@" + ver)
    if (!res.data) return undefined;
    return res.data;
  }

  function get_info_without_ver(name) {
    const res = req_gw(name)
    if (!res.data) return undefined;
    return { version: res.version, data: res.data }
  }
  return new Buhin_subst(get_info_ver, get_info_without_ver, subst_body0, subst_parts0);
}

//sqlite3を使うが、better-sqlite3経由で毎回クエリを送る。思ったよりかなり遅い。
function make_sql_buhin() {
  var db = new Database('../glyphwiki/kage.sqlite3', { readonly: true });
  var subst_body0 = make_subst_body("../config/subst_glyph.conf");
  var subst_parts0 = make_subst_parts("../config/subst_parts.conf")

  function get_info_ver(name, ver) {
    const stmt = db.prepare("SELECT * FROM glyphs WHERE name='" + name + "' AND version=" + ver);
    const res = stmt.get()
    if(!res) return undefined;
    return res.kage;
  }

  function get_info_without_ver(name) {
    const stmt = db.prepare("SELECT * FROM glyphs WHERE name='" + name + "' ORDER BY version DESC LIMIT 1");      
    const res = stmt.get()
    if (!res) return undefined;
    return { version: res.version, data: res.kage }
  }
  return new Buhin_subst(get_info_ver, get_info_without_ver, subst_body0, subst_parts0);
}

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

export default {make_mem_buhin, make_gw_buhin, make_sql_buhin}