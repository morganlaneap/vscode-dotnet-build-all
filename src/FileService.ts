// Source: https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search

const fs = require("fs");
const path = require("path");

function walkDirectory(dir: string, done: Function) {
  let results: any[] = [];

  fs.readdir(dir, function(err: Error, list: string[]) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file: string) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err: Error, stat: any) => {
        if (stat && stat.isDirectory()) {
          walkDirectory(file, (err: Error, res: any) => {
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

export class FileService {
  public findAllCsProjFiles(
    path: string,
    filter: string,
    done: Function
  ): void {
    walkDirectory(path, (err: Error, results: string[]) => {
      let fileMatches = results.filter(f => f.endsWith(".csproj"));
      if (filter !== "") {
        fileMatches = fileMatches.filter(
          f => f.split("/")[f.split("/").length - 1].indexOf(filter) > -1
        );
      }
      done(fileMatches);
    });
  }
}
