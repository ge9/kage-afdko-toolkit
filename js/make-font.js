//make-font.js [INPUT(.glyphs)] [OUTPUT PATH(.svg or directory)] [weight]
"use strict";
import { Kage, FONTTYPE, Polygons, Polygon } from '@ge9/kage-engine-2';
import kage_org from "@kurgm/kage-engine";
import fs from "fs";
import crypto from 'crypto';
import buhinsub from './buhin-subst.js';
import { svg_headers } from './svg-headers.js';
import * as clipperLib from "js-angusj-clipper";
import SVGPathCommander from 'svg-path-commander';

const clipper = await clipperLib.loadNativeClipperLibInstanceAsync(clipperLib.NativeClipperLibRequestedFormat.WasmWithAsmJsFallback);

const GLYPHS_FILE = process.argv[2];
const OUTPUT_PATH=process.argv[3];
const FONT_WEIGHT=process.argv[4];
const glist = fs.readFileSync(GLYPHS_FILE).toString().split('\n');
var glyphmap = {}
var cnt = 0;
for (let charinfo of glist) {
  if (charinfo == "") continue;
  var l = charinfo.split("\t");
  glyphmap["g" + ("" + cnt).padStart(6, '0')] = l[0].split("/")[1]
  cnt += 1;
}

var myp = new Polygons()
const IRRATIONAL_NEAR_100 = Math.pow(180, 0.9)
const SAFE_MULTIPLIER = 50000000000000//0が13個
function get_path_svg_font_with_clipper(polygons) {
  //clipperは整数のみ対応。精度を上げるため、一旦巨大な整数に変換
  var paths = polygons.array.map((polygon) => polygon.array.map((point) => { return { x: (point.x - IRRATIONAL_NEAR_100) * SAFE_MULTIPLIER, y: (point.y - IRRATIONAL_NEAR_100) * SAFE_MULTIPLIER } }))
  paths = paths.filter((polygon) => !(is_illegal_triangle(polygon)))
  //元のKAGEエンジンだとたまに逆向きのポリゴンが混ざっているが、orientatioを揃えずにそのままreduceに突っ込んでも正しく動いているっぽい
  paths = paths.reduce(union_clipper, [])//空の配列で空の多角形（＝何もない）と認識されるっぽい
  //OpenTypeだから？かわからないが、このタイミングで逆向きにしておいた方がよさそう
  paths = paths.map(reverse_orient)
  myp.array = paths.map((path) => { var p2 = new Polygon(); p2.array = path.map((point) => { return { x: point.x / SAFE_MULTIPLIER + IRRATIONAL_NEAR_100, y: point.y / SAFE_MULTIPLIER + IRRATIONAL_NEAR_100, off: 0 } }); return p2 })
  //myp.array = polygons.array.map((polygon) => {var p2 = new Polygon(); p2.array=polygon.array; return p2})

  //Polygonデータへの加工が終わったら、従来と同様にSVGフォント用のパスを生成（スケール・位置の調整）
  return myp.get_path_svg_font()
}

var count = 0

//OUTPUT_PATHをファイル名とする単一のsvgフォントファイルを生成するモード（ただしヘッダは出力せず、グリフデータのみ）（追記モードであることに注意）
var file_makefont_config= {
  newKage : () => new kage_org.Kage(),
  newPolygons : () => new kage_org.Polygons(),
  polygonsToSVG : (polygons) => get_path_svg_font_with_clipper(polygons),
  noSubst : true, //Classicではカスタム部品を使用しない
  io_init : () => {return fs.openSync(OUTPUT_PATH, "a")},//appendで追記
  io_sync : (fd) => {fs.fdatasync(fd, (e) => console.log("fdatasync error:" + e))},
  io_glyph : (fd, glyphname, path) => {fs.appendFile(fd, glyph_elem(glyphname, format_svg(path)), () => { });}
};

//OUTPUT_PATHをフォルダとしてその中に各svgを生成するモード。1フォルダあたりのファイル数を減らすためmd5ハッシュの値で256個のフォルダに分割する。
var folder_makefont_config={
  newKage : () => new Kage(FONTTYPE.MINCHO, FONT_WEIGHT),
  newPolygons : () => new Polygons(),
  polygonsToSVG : (polygons) => polygons.get_path_svg_font(),

  io_init : () => {
    fs.mkdirSync(OUTPUT_PATH)
    for (let i = 0; i <= 255; i++) {
      let hexString = i.toString(16);
      if (hexString.length === 1) {hexString = "0" + hexString;}
      fs.mkdirSync(OUTPUT_PATH + "/" + hexString);
    }
    return null;
  },
  io_sync : (fd) => {},
  io_glyph : (_, glyphname, path) => {
    var dir_name = crypto.createHash('md5').update(glyphname).digest('hex').slice(0, 2) + "/"
    console.log("in "+dir_name)
    fs.writeFile(OUTPUT_PATH + "/" + dir_name + glyphname + '.svg', svg_headers.svgbegin + '<path d="' + format_svg(path) + '" fill="black" />' + svg_headers.svgend, () => { });
  }
}

var makefont_config=null;
//CLASSICウェイトではinkscapeでunion操作をする必要がないため、最初からsvgフォントを生成
if (FONT_WEIGHT == "CLASSIC") {
  makefont_config = file_makefont_config
} else {
  makefont_config = folder_makefont_config
}

var kage;
var fd = makefont_config.io_init();
for (let key in glyphmap) {
  //if(count > 107500) break;//現状でこれ以降はirg2021など不要グリフ
  if (count % 5000 == 0) {//メモリリーク防止
    makefont_config.io_sync(fd);
    kage = makefont_config.newKage();
    kage.kBuhin = buhinsub.make_mem_buhin(makefont_config.noSubst);
  }
  var glyphname = glyphmap[key]
  console.log(count + "processing " + glyphname)
  count += 1;
  var polygons = makefont_config.newPolygons();
  try {
    kage.makeGlyph(polygons, glyphname);
  } catch (e) {
    console.log("in " + glyphname + ":")
    console.log(e)
    //throw(e)
    continue;
  }
  const path = makefont_config.polygonsToSVG(polygons);
  makefont_config.io_glyph(fd, glyphname, path)
}

//utility functions

function union_clipper(poly1, poly2) {
  return clipper.clipToPaths({
    clipType: clipperLib.ClipType.Union,

    subjectInputs: [{ data: poly1, closed: true }],

    clipInputs: [{ data: poly2, closed: true }],

    subjectFillType: clipperLib.PolyFillType.EvenOdd
  });
}

function is_same_point(p1, p2){
  return (p1.x == p2.x && p1.y == p2.y)
}
//https://glyphwiki.org/wiki/turgenev_testbug のような例だと、3点A, A, Bをもつ三角形が作られ、clipperのエラーになるので、除外
function is_illegal_triangle(polygon){
  if (polygon.length != 3) return false;
  if (is_same_point(polygon[0], polygon[1])) return true;
  if (is_same_point(polygon[1], polygon[2])) return true;
  if (is_same_point(polygon[2], polygon[0])) return true;
}
function fix_orient(poly) {
  if (!clipper.orientation(poly)) {
    return poly
  } else {
    clipper.reversePath(poly)
    return poly
  }
}

function reverse_orient(poly) {
  clipper.reversePath(poly)
  return poly
}

function glyph_elem(key, pathData) {
  return '<glyph glyph-name="' + key + '" d="' + pathData + '" />\n'
}

function layer_elem(key, pathData) {
  return '  <g inkscape:groupmode="layer" id="' + key + '"><path d="' + pathData + '" /></g>\n'
}

function format_svg(data) {
  var data1 = data.split(/z|Z/)
  data1.pop()
  const ret = data1.map((s) => format_subpath(s)).join("z ") + "z"
  //SVGPathCommanderを使うと、丸められてしまうっぽい？roundを設定すれば回避できる？
  //console.log(new SVGPathCommander(data).normalize().toString())
  //console.log(ret)
  return ret;
}
//1. remove extra spaces
//2. restore omitted SVG path commands (for compatibility with software that doesn't support command omission)
//3. turn 'h' and 'v' into 'l'
function format_subpath(path) {
  var res = ""
  var temp = path
  var last = ""
  while (temp != "") {
    var cmd = temp.slice(0, 1)
    switch (cmd) {
      case "M":
      case "m"://assuming m is used only in the beginning of paths (in such cases, m and M are equivalent)
        var m = temp.match(/^(M|m) *(-?[0-9\.]+) *, *(-?[0-9\.]+) */)
        res += "M" + m[2] + "," + m[3]
        temp = temp.replace(/^(M|m) *(-?[0-9\.]+) *, *(-?[0-9\.]+) */, "")
        break;
      case "L":
        last = "L"
        var m = temp.match(/^(L) *(-?[0-9\.]+) *, *(-?[0-9\.]+) */)
        res += "L" + m[2] + "," + m[3]
        temp = temp.replace(/^(L) *(-?[0-9\.]+) *, *(-?[0-9\.]+) */, "")
        break;
      case "l":
        last = "l"
        var m = temp.match(/^(l) *(-?[0-9\.]+) *, *(-?[0-9\.]+) */)
        res += "l" + m[2] + "," + m[3]
        temp = temp.replace(/^(l) *(-?[0-9\.]+) *, *(-?[0-9\.]+) */, "")
        break;
      case "C":
        last = "C"
        var m = temp.match(/^(C) *(-?[0-9\.]+) *, *(-?[0-9\.]+) +(-?[0-9\.]+) *, *(-?[0-9\.]+) +(-?[0-9\.]+) *, *(-?[0-9\.]+) */)
        res += "C" + m[2] + "," + m[3] + " " + m[4] + "," + m[5] + " " + m[6] + "," + m[7]
        temp = temp.replace(/^(C) *(-?[0-9\.]+) *, *(-?[0-9\.]+) +(-?[0-9\.]+) *, *(-?[0-9\.]+) +(-?[0-9\.]+) *, *(-?[0-9\.]+) */, "")

        break;
      case "c":
        last = "c"
        var m = temp.match(/^(c) *(-?[0-9\.]+) *, *(-?[0-9\.]+) +(-?[0-9\.]+) *, *(-?[0-9\.]+) +(-?[0-9\.]+) *, *(-?[0-9\.]+) */)
        res += "c" + m[2] + "," + m[3] + " " + m[4] + "," + m[5] + " " + m[6] + "," + m[7]
        temp = temp.replace(/^(c) *(-?[0-9\.]+) *, *(-?[0-9\.]+) +(-?[0-9\.]+) *, *(-?[0-9\.]+) +(-?[0-9\.]+) *, *(-?[0-9\.]+) */, "")

        break;
      case "h"://horizontal lineto
        console.log("svgh")
        last = "h"
        var m = temp.match(/^(h) *(-?[0-9\.]+) */)
        res += "l" + m[2] + ",0"
        temp = temp.replace(/^(h) *(-?[0-9\.]+) */, "")
        break;
      case "v"://vertical lineto
        console.log("svgv")
        last = "v"
        var m = temp.match(/^(v) *(-?[0-9\.]+) */)
        res += "l" + "0," + m[2]
        temp = temp.replace(/^(v) *(-?[0-9\.]+) */, "")
        break;
      default://同じコマンドが続く場合はそのコマンドの文字を挿入してやり直し
        //console.log("svgdef")
        temp = last + temp; continue;
    }

  }
  return res;
}