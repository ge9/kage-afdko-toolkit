//force_version.confなどを入力とすると、最新バージョンを付加して出力する
import fs from 'fs';
import buhinsub from './buhin-subst.js';
import readline from 'readline';
var buhin_mem = buhinsub.make_mem_buhin();
const infile = process.argv[2]

const readStream = fs.createReadStream(infile);

const rl = readline.createInterface({input: readStream});

rl.on('line', (charinfo) => {
  if (charinfo === "") return;
  if (charinfo.indexOf(">=")>-1 || charinfo.startsWith("#")) {
    console.log(charinfo)
  }else{
    const v = buhin_mem.get_info_without_ver(charinfo).version;
    console.log(charinfo+">="+v)
  }
});

readStream.on('error', (err) => {console.log(err);});
