import buhinsub from '../js/buhin-subst.js';
import fs from 'fs';

import readline from 'readline';
const data = new Set(fs.readFileSync(process.argv[2]).toString().split('\n'));

//readstreamを作成
const rs = fs.createReadStream(process.argv[3]);
//writestreamを作成
const ws = fs.createWriteStream('./glyph-data-to-verify.txt');

//インターフェースの設定
const rl = readline.createInterface({
//読み込みたいストリームの設定
  input: rs,
//書き出したいストリームの設定
  output: ws
});
var buhin_mem = buhinsub.make_mem_buhin();

//1行ずつ読み込む設定
rl.on('line', (lineString) => {
    const m = lineString.match(/^ ([^\\\@]+)\\(\@[0-9]+) *\|.*\|.*/)
    //console.log(m)
    if (!m) return;
    if(data.has(m[1]+m[2])){
      //白紙化されておらず、かつ最新バージョンであれば@以下を除去
      if(m[2].substr(1) ==buhin_mem.get_latest(m[1])){
          //最初の一箇所のみ置換、最長マッチ
          ws.write(lineString.replace(/\\\@[0-9]+/,"") + '\n');
      }else{
          ws.write(lineString + '\n');
      }
    }
});
rl.on('close', () => {
  console.log("END!");
});