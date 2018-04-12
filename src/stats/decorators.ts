import { SourceFile, Node, TypeGuards } from 'ts-simple-ast';
import { stat } from 'fs';


export default function(sourceFiles: SourceFile[]) {
  const stats: {[key: string]: number} = {};
  
  function visit(decorator: string, stats: {[key: string]: number}) {
    const _decorator = `@${decorator}()`;
    const entry = stats[_decorator];
    stats[_decorator] = (stats[_decorator] || 0) + 1;
  }
  
  for (const sourceFile of sourceFiles) {
    sourceFile.forEachDescendant(descendant => {
      if (TypeGuards.isDecorator(descendant)) {
        visit(descendant.getFullName(), stats);
      }
    });
  }

  return {
    keys: [Object.keys(stats).join('\n')],
    values: [
      Object.keys(stats)
        .map(k => stats[k])
        .join('\n')
    ]
  };
}
