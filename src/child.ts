import Project from 'ts-simple-ast';
import * as path from 'path';
import * as fs from 'fs';

var Table = require('cli-table');
var table = new Table({
  head: ['Type', 'Stats'],
  colWidths: [20, 10]
});

const tsConfigFilePath = path.join(process.cwd(), './tsconfig.json');

if (!fs.existsSync(tsConfigFilePath)) {
  process.send({result: 'tsconfig.json file not found. Abort.'});
  process.exit(1);
}

const project = new Project({
  tsConfigFilePath
});

const deps = {};

const sourcesFiles = project.getSourceFiles();

sourcesFiles.map(sourceFile => {
  (deps['TypeScript Files'] = deps['TypeScript Files'] || []).push(sourceFile);

  sourceFile.getClasses().map(classe => {
    try {
      classe.getDecorators().map(decorator => {
        const _decorator = `@${decorator.getFullName()}`;
        const entry = deps[_decorator];
        if (!entry) {
          deps[_decorator] = [];
        }
        deps[_decorator].push(classe.getName());
      });
    } catch (e) {}
  });
});

for (let key in deps) {
  table.push([key, deps[key].length]);
}

process.send({ result: table.toString() });
