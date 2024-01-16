import fs from "fs";
import readline from "readline";
//readstreamを作成
const rs = fs.createReadStream(process.argv[2]);
//インターフェースの設定
const rl = readline.createInterface({
//読み込みたいストリームの設定
  input: rs,
});
//1行ずつ読み込む設定
//console.log(check_8yane("2:0:7:69:105:51:137:14:160$1:0:0:88:111:147:111$2:7:0:136:111:159:142:179:150$1:0:2:56:137:140:137$2:22:4:140:137:139:161:128:179$2:32:7:95:137:84:176:29:187"))
let res1=[]
let res2=[]
rl.on('line', (lineString) => {
    let m = lineString.match(/^([^ ]*)\|.*\|(.*)$/)
    //console.log(m)
    if (!m) return;
    const nam = m[1].replace("\\\@", "\@")
    //if (check_8yane(m[2])) res2.push(nam)
    //if (check_shorth(m[2])) res2.push(nam)
    //if (check_sanzui(m[2])) res2.push(nam)
    //if (check_kemono(m[2])) res2.push(nam)
    //if (thin_connect(m[2])) res2.push(nam)
    //if (check_ninben(m[2])) res2.push(nam)
    if (check_hcon(m[2])) res2.push(nam)
});
rl.on('close', () => {
  //res1.map(console.log)
  console.log("******************************");
  console.log("******************************");
  res2.map((s) => console.log("[["+s+"]]"))
  console.log("END!");
  //console.log(check_kemono("2:0:7:88:16:59:65:13:89$6:7:4:20:16:91:64:82:154:62:182$2:32:7:71:85:53:123:13:150"))
});

function check_8yane(glyphdata){
  const data = glyphdata.split("$")
  //下1桁で判定することで手動調整に対応
  const open_end=data.filter((s)=> {
    if (!s.match(/^[0-9]*1:[0-9]+:[0-9]*0:/)) return false;
    const ss = s.split(":")
    if ((ss[4]-ss[6])*(ss[4]-ss[6])>(ss[3]-ss[5])*(ss[3]-ss[5])) return false;//縦向き直線ならキャンセル
    return true;
  }).map((s)=>s.split(":"))
  const thin_begin=data.filter((s)=>{return s.match(/^2:([0-9]*0)?7:/)}).map((s)=>s.split(":"))
  for (const o of open_end) {
    for (const t of thin_begin) {
      const dist = min_d2(t[3], t[4], o[5], o[6], o[5]-11, o[6])
      if (dist < 17){//u5165-k01@1は16が必要だった。これ以上増やしすぎるとこんどは誤検出が増えそう
        return true;
      }
    }
  }
  return false;
}

function check_shorth(glyphdata){//「接続」用の短い横線
  const data = glyphdata.split("$")
  //下1桁で判定することで手動調整に対応
  const conn_end=data.filter((s)=> {
    if (!s.match(/^[0-9]*1:[0-9]+:[0-9]*(2|7):/)) return false;
    const ss = s.split(":")
    if ((ss[4]-ss[6])*(ss[4]-ss[6])>(ss[3]-ss[5])*(ss[3]-ss[5])) return false;//縦向き直線ならキャンセル
    if (2500<(ss[3]-ss[5])*(ss[3]-ss[5])) return false;//長さ50以上ならキャンセル
    return true;
  }).map((s)=>s.split(":"))
  const conn_curve=data.filter((s)=>{return s.match(/^(2|6):([0-9]*0)?32:/)}).map((s)=>s.split(":"))
  for (const o of conn_end) {
    for (const t of conn_curve) {
      const dist = min_d2(t[3], t[4], o[5], o[6], o[3], o[6])
      if (dist < 17){
        return true;
      }
    }
  }
  return false;
}

function check_sanzui(glyphdata){
  const data = glyphdata.split("$")
  const thin_stop_end=data.filter((s)=> {
    return s.match(/^(2|6):7:8:/)
  }).map((s)=>s.split(":"))
  const connect_sweep=data.filter((s)=>{return s.match(/^2:(12|32):7:/)}).map((s)=>s.split(":"))

  for (const t of thin_stop_end) {
    for (const c of connect_sweep) {
      const dist1 = min_d2(c[3], c[4], t[3], t[4], t[5], t[6])
      const dist2 = min_d2(c[3], c[4], t[5], t[6], t[7], t[8])
      const dist3 = min_d2(c[3], c[4], t[7], t[8], t[9], t[10])
      if (dist1 < 300 && dist2 < 300 ) return true;
      //if (dist1 < 50) return true;
      //if (dist2 < 50) return true;
      //if (dist3 < 50) return true;
    }
  }
  return false;
}

function check_kemono(glyphdata){
  const data = glyphdata.split("$")
  const turn_left=data.filter((s)=> {
    return s.match(/^(2|6):7:4:/)
  }).map((s)=>s.split(":"))
  const connect_sweep=data.filter((s)=>{return s.match(/^2:(12|32):7:/)}).map((s)=>s.split(":"))

  for (const t of turn_left) {
    for (const c of connect_sweep) {
      const dist1 = min_d2(c[3], c[4], t[3], t[4], t[5], t[6])
      const dist2 = min_d2(c[3], c[4], t[5], t[6], t[7], t[8])
      const dist3 = min_d2(c[3], c[4], t[7], t[8], t[9], t[10])

      const dists1 = min_d2(c[3], c[4], t[3], t[4], t[7], t[8])
      const dists2 = min_d2(c[3], c[4], t[3], t[4], t[9], t[10])
      
      if (dist1 < 500 && dist2 < 500 && dists1 < 800 ) return true;
      if (dist1 < 700 && dist2 < 700 && dist3 < 700 && dists2 < 1000 ) return true;
      //if (dist1 < 50) return true;
      //if (dist2 < 50) return true;
      //if (dist3 < 50) return true;
    }
  }
  return false;
}

function thin_connect(glyphdata){
  const data = glyphdata.split("$")
  const thin_begin=data.filter((s)=> {
    return s.match(/^(2|6):7:/)
  }).map((s)=>s.split(":"))

  const thin_end=data.filter((s)=>{return s.match(/^(2|6):[0-9]+:7:/)}).map((s)=>s.split(":"))

  for (const b of thin_begin) {
    for (const e of thin_end) {
      var ex = e[7]; var ey = e[8]
      if(e[0]=="6"){//bezier
        ex=e[9]; ey=e[10]
      }
      const dist = (b[3]-ex)*(b[3]-ex) + (b[4]-ey)*(b[4]-ey)
      if (dist < 20) return true;
    }
  }
  return false;
}


function check_ninben(glyphdata){
  const data = glyphdata.split("$")
  const sweep_end_curve=data.filter((s)=> {
    return s.match(/^2:[0-9]+:7:/)
  }).map((s)=>s.split(":"))
  const connect_straight=data.filter((s)=>{return s.match(/^1:([0-9]*0)?32:/)}).map((s)=>s.split(":"))

  for (const t of sweep_end_curve) {
    var tan_of_curve = Math.abs(t[8]-t[4]) / Math.abs(t[7]-t[3])
    if (tan_of_curve < 0.5) {continue;}
    for (const c of connect_straight) {
      const dist0 = min_d2(c[3], c[4], t[3], t[4], t[7], t[8])
      const dist1 = min_d2(c[3], c[4], t[3], t[4], t[5], t[6])
      const dist2 = min_d2(c[3], c[4], t[5], t[6], t[7], t[8])
      if (dist0 < 300 && dist1 < 500 && (dist1 < 300 || dist2 < 300) ) return true;
      //if (dist1 < 50) return true;
      //if (dist2 < 50) return true;
      //if (dist3 < 50) return true;
    }
  }
  return false;
}

function check_hcon(glyphdata){
  const data = glyphdata.split("$")
  const sweep_end_curve=data.filter((s)=> {
    return s.match(/^2:[0-9]+:7:/)
  }).map((s)=>s.split(":"))

  const connect_h=data.filter((s)=> {
    if (!s.match(/^[0-9]*1:[0-9]*(0|2):/)) return false;
    const ss = s.split(":")
    if ((ss[4]-ss[6])*(ss[4]-ss[6])>(ss[3]-ss[5])*(ss[3]-ss[5])) return false;//縦向き直線ならキャンセル
    return true;
  }).map((s)=>s.split(":"))

  for (const t of sweep_end_curve) {
    for (const c of connect_h) {
      const dist0 = min_d2(c[3], c[4], t[3], t[4], t[7], t[8])
      const dist1 = min_d2(c[3], c[4], t[3], t[4], t[5], t[6])
      const dist2 = min_d2(c[3], c[4], t[5], t[6], t[7], t[8])
      if (dist0 < 100 && (dist1 < 100 || dist2 < 100) ) return true;
      //if (dist1 < 50) return true;
      //if (dist2 < 50) return true;
      //if (dist3 < 50) return true;
    }
  }
  return false;
}

//https://zenn.dev/boiledorange73/articles/0037-js-distance-pt-seg
//点(x0, y0) と 線分 (x1, y1) -> (x2, y2) との距離の2乗
function min_d2(x0, y0, x1, y1, x2, y2) {
  var a = x2 - x1;
  var b = y2 - y1;
  var a2 = a * a;
  var b2 = b * b;
  var r2 = a2 + b2;
  var tt = -(a*(x1-x0)+b*(y1-y0));
  if( tt < 0 ) {
    return (x1-x0)*(x1-x0) + (y1-y0)*(y1-y0);
  }
  if( tt > r2 ) {
    return (x2-x0)*(x2-x0) + (y2-y0)*(y2-y0);
  }
  var f1 = a*(y1-y0)-b*(x1-x0);
  return (f1*f1)/r2;
}