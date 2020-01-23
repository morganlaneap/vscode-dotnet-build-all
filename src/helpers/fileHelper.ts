const fs = require("fs");
const path = require("path");

// Source: https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
function walk(dir: string, done: Function) {
  let results: any[] = [];

  fs.readdir(dir, function(err: Error, list: string[]) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err: Error, stat: any) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err: Error, res: any) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

function findAllCsProjFiles(folder: string, done: Function) {
  walk(folder, (err: Error, results: string[]) => {
    done(results.filter(f => f.endsWith(".csproj")));
  });
}

export { findAllCsProjFiles };
