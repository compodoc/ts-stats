import { SourceFile } from 'ts-simple-ast';
import { format } from '../helpers';
const KEY = 'Exports';
const stats = { [KEY]: [] };
export default function(sourcesFiles: SourceFile[]) {
  sourcesFiles.map((sourceFile, index) => {
    try {
      sourceFile.getExportedDeclarations().map(_import => {
        stats[KEY].push(_import.getKindName());
      });
    } catch (e) {
      stats[KEY].push(`default_export_${index}`);
    }
  });

  return {
    keys: [[KEY, 'Exports (named)', 'Exports (default)'].join('\n')],
    values: [
      [
        format(stats[KEY].length),
        format(stats[KEY].filter((c: string) => !c.startsWith('default_export_')).length),
        format(stats[KEY].filter((c: string) => c.startsWith('default_export_')).length)
      ].join('\n')
    ]
  };
}
