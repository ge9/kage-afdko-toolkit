//SVGの相対座標を絶対座標に変換（ついでにv, hなどもLに変換）、さらに向きを逆転させる
import SVGPathCommander from 'svg-path-commander';
import readline from 'readline'
var reader =readline.createInterface({
  input: process.stdin,//fs.createReadStream(process.argv[2]),
});
//let mysvgpc = new SVGPathCommander();
reader.on("line", (line) => {
  const m = line.match(/glyph glyph-name="([^"]+)".* d="([^"]+)"/)
  console.log('<glyph glyph-name="'+m[1]+'" d="'+new SVGPathCommander(m[2]).normalize().reverse().toString()+'"/>');  
});
