import { SourceFile } from 'ts-simple-ast';
const KEY = 'Spec Files';
const stats = { [KEY]: [] };
export default function(sourcesFiles: SourceFile[]) {
  sourcesFiles.filter(file => file.getFilePath().endsWith('spec.ts')).map(sourceFile => {
    stats[KEY].push(sourceFile);
  });

  return {
    keys: [KEY],
    values: [stats[KEY].length]
  };
}
