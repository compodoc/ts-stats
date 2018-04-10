import { SourceFile } from 'ts-simple-ast';
const KEY = 'TypeScript Files';
const stats = { [KEY]: [] };
export default function(sourcesFiles: SourceFile[]) {
  sourcesFiles.map(sourceFile => {
    stats[KEY].push(sourceFile);
  });

  return {
    keys: [KEY],
    values: [stats[KEY].length]
  };
}
