import fs from 'fs';
const s = fs.readFileSync('./gwv_result.json', 'utf-8');
var json = JSON.parse(s.replace(/\\\\\@/g,"@"));
for (var k of Object.keys(json)){
    json[k] = json[k].result
}
//console.log({"lastModified":1659459608.0,"result":json})
const out = JSON.stringify({"lastModified":1659459608.0,"result":json}, null , "\t");
fs.writeFile("gwv_result.conv.json",out, (err) => {
    if (err) throw err;
    console.log('json write end');
  });