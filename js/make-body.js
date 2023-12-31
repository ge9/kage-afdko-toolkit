import fs from 'fs';
import readline from 'readline';
import buhinsub from './buhin-subst.js';

var buhin_mem = buhinsub.make_mem_buhin();


for (let i = 2; i < process.argv.length; i++) {
  make_body_file(process.argv[i]);
}

function make_body_file(path){
  const readStream = fs.createReadStream(path);
  const writeStream = fs.createWriteStream(path + ".body");
  const rl = readline.createInterface({input: readStream});

  rl.on('line', (char) => {
    try {
      if (char != "") {
        writeStream.write(buhin_mem.search_body(char) + "\n");
      }
    } catch (e) {
      writeStream.write("****error****\n");
      console.log(e);
    }
  });

  rl.on('close', () => {
    writeStream.end();
    console.log('write end');
  });

  readStream.on('error', (err) => {console.log(err);});
}
