import { SourceFile } from 'ts-simple-ast';
import { format } from '../helpers';
const KEY = 'TypeScript Files';
const stats = { [KEY]: [] };
export default function(sourcesFiles: SourceFile[]) {
  sourcesFiles.map(sourceFile => {
    stats[KEY].push(sourceFile);
  });

  return {
    keys: [KEY],
    values: [format(stats[KEY].length)]
  };
}
