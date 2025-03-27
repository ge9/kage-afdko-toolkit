import fs from 'fs';
import {Kage, FONTTYPE} from '@ge9/kage-engine-2';
import buhinsub from './buhin-subst.js';
import readline from 'readline';
var buhin_mem = buhinsub.make_mem_buhin();
var kage = new Kage(FONTTYPE.MINCHO, 2.05);
kage.kBuhin = buhin_mem;
const infile = process.argv[2]
//const infile = "./test.glyphs"

const readStream = fs.createReadStream(infile);
const writeStream = fs.createWriteStream(process.argv[3]);

const rl = readline.createInterface({input: readStream});

rl.on('line', (charinfo) => {
  if (charinfo === "") return;
  const glyphname = charinfo.split("\t")[0].split("/")[1];
  try{
    const glyphData = buhin_mem.search(glyphname);
    kage.getStrokes(glyphData);//making cache
  }catch (e){
    console.log("FATAL ERROR: in processing glyph [["+glyphname+"]]")
    fs.unlink(process.argv[3])//not working?
    throw e
  }
});

rl.on('close', () => {
  writeStream.write(Array.from(buhin_mem.cache).join('\n'), (err) => {
    if (err) throw err;
    console.log('cache write end');
  });
  writeStream.end();
});

readStream.on('error', (err) => {console.log(err);});
