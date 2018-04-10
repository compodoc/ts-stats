import { SourceFile } from 'ts-simple-ast';
const KEY = 'Imports';
const stats = { [KEY]: [] };
export default function(sourcesFiles: SourceFile[]) {
  sourcesFiles.map(sourceFile => {
    sourceFile.getImportDeclarations().map(_import => {
      stats[KEY].push(_import.getKindName());
    });
  });

  return {
    keys: [KEY],
    values: [stats[KEY].length]
  };
}
