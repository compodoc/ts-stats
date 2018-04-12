import { SourceFile } from 'ts-simple-ast';
import { format } from '../helpers';
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
    values: [format(stats[KEY].length)]
  };
}
