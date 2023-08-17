import path from 'path';
import fs from 'fs';
import {execSync} from 'child_process';

export default function generateSpecFile(dir) {
  function traverseDir(dir) {
    fs.readdirSync(dir).forEach((file) => {
      let fullPath = path.join(dir, file);
      if (fs.lstatSync(fullPath).isDirectory()) {
        traverseDir(fullPath);
      } else {
        let p = path.basename(fullPath).split(".");
        if ((p.length == 3 && !p[2].includes("spec") && p[2] == "ts") || (p.length == 2 && !p[1].includes("spec") && p[1] == "ts")) {
          let pt = path.relative(process.cwd(), fullPath);
          let ptFinal = pt.replace(/\\/g, "/");
          console.log(
            `+++++++++++++++ Creating Test case for ${ptFinal}`
          );
          execSync(`createngtest ${ptFinal} -s -c createngtest.config.js -f`);
        }
      }
    });
  }
  traverseDir(dir)
};

