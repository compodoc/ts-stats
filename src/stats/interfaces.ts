import { SourceFile } from 'ts-simple-ast';
const KEY = 'Interfaces';
const stats = { [KEY]: [] };
export default function(sourcesFiles: SourceFile[]) {
  sourcesFiles.map(sourceFile => {
    sourceFile.getInterfaces().map(_interface => {
      stats[KEY].push(_interface.getName());
    });
  });

  return {
    keys: [KEY],
    values: [stats[KEY].length]
  };
}
