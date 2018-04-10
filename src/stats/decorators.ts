import { SourceFile } from 'ts-simple-ast';

export default function(sourcesFiles: SourceFile[]) {
  const stats = {};
  sourcesFiles.map(sourceFile => {
    sourceFile.getClasses().map(classe => {
      try {
        classe.getDecorators().map(decorator => {
          const _decorator = `@${decorator.getFullName()}`;
          const entry = stats[_decorator];
          if (!entry) {
            stats[_decorator] = [];
          }
          stats[_decorator].push(classe.getName());
        });
      } catch (e) {}
    });
  });

  return {
    keys: [Object.keys(stats).join('\n')],
    values: [Object.keys(stats).map(k => stats[k].length).join('\n')]
  };
}
