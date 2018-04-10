import { SourceFile, SyntaxKind } from 'ts-simple-ast';
const KEY1 = 'Spec (files)';
const KEY2 = 'Spec (describe)';
const KEY3 = 'Spec (it)';
export default function(sourcesFiles: SourceFile[]) {
  const files = [];
  let describe = 0;
  let it = 0;
  sourcesFiles.filter(file => file.getFilePath().endsWith('spec.ts')).map(sourceFile => {
    files.push(sourceFile);

    // const describe = (sourceFile.getFullText().match(/describe.*\(/g) || []).length;
    // const it = (sourceFile.getFullText().match(/it.*\(/g) || []).length;
    // console.log('describe ', describe, ' it', it, sourceFile.getFilePath());

    const call = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    const names = call.map(c => {
      try { 
        return c.getExpression().getSymbol().getName();
      }
      catch(e) {
        return '';
      }
    });

    describe += names.filter(n => n === 'describe').length;
    it += names.filter(n => n === 'it').length;
  });

  return {
    keys: [
      [KEY1, KEY2, KEY3].join('\n')
    ],
    values: [
      [files.length, describe, it].join('\n')
    ]
  };
}
