import { SourceFile } from 'ts-simple-ast';
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
    keys: [
      [KEY, 'Exports (named)', 'Exports (default)'].join('\n')
    ],
    values: [
      [
        stats[KEY].length,
        stats[KEY].filter((c: string) => !c.startsWith('default_export_')).length,
        stats[KEY].filter((c: string) => c.startsWith('default_export_')).length
      ].join('\n')
    ]
  };
}
