import buhinsub from '../js/buhin-subst.js';
import fs from 'fs';
var buhin_mem = buhinsub.make_mem_buhin();
function get_minver_list(list){
  var minver_list = {}
  for (var mbl of list){
    const mbl2 = mbl.split(">=");
    if (mbl2[1]){
      minver_list[mbl2[0]] = mbl2[1];
    }else{
      var v =  buhin_mem.get_info_without_ver(mbl);
      if (v) {
        if (v.data == "0:0:0:0") {
          //白紙化された部品がバージョン番号無しで置換・最新強制指定されていた場合は、使用禁止と解釈
          minver_list[mbl] = Infinity
        }else{
          minver_list[mbl] = v.version
        }
      }
    }
  }
  return minver_list;
}
//バージョンを強制する部品
const mbl_list = fs.readFileSync("../config/force_version.conf").toString().split('\n').filter((s) => !s.startsWith("#")).filter((s) => s != "")
//置換対象となる部品の最低バージョン指定
const subst_list = fs.readFileSync("../config/subst_parts.conf").toString().split('\n').filter((s) => !s.startsWith("#")).filter((s) => s != "").map((s) => {return s.split(" ")[0]})

var force_min_version = get_minver_list(mbl_list.concat(subst_list))
//console.log(force_min_version);
const glist = fs.readFileSync(process.argv[2]).toString().split('\n');

for (let g of glist){
  const gs = g.split("@")
  if (force_min_version[gs[0]] && (force_min_version[gs[0]]*1 > gs[1]*1) ){
    console.log("ERROR: illegal old version glyph: "+ g)
  }
}
const white_list = fs.readFileSync("../config/whitelist.conf").toString().split('\n').filter((s) => !s.startsWith("#")).filter((s) => s != "")
var wl_min_version= get_minver_list(white_list)
//console.log(wl_min_version)
//used-glyphsからturgenev_altg-グリフ及びwhitelist.confにあるものを除去
var newglist = []
for (let g of glist){
  const gs = g.split("@")
  if (gs[0].startsWith("turgenev_altg-") || (wl_min_version[gs[0]] && (wl_min_version[gs[0]]*1) <= (gs[1]*1))) continue;
  newglist.push(g)
}
fs.writeFile(process.argv[3],Array.from(newglist).join('\n'), (err) => {
  if (err) throw err;
  console.log('glyphs-to-verify write end');
});
