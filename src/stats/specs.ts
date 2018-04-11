import { SourceFile, SyntaxKind } from 'ts-simple-ast';
const KEY1 = 'Spec (files)';
const KEY2 = 'Spec (describe)';
const KEY2x = 'Spec (xdescribe)';
const KEY3 = 'Spec (it)';
const KEY3x = 'Spec (xit)';
const KEY4 = 'Spec (expect)';

function filter(funcNames, by) {
  return funcNames.filter(n => n === by).length
}
export default function(sourcesFiles: SourceFile[]) {
  const files = [];
  let describe = 0;
  let it = 0;
  let xdescribe = 0;
  let xit = 0;
  let expect = 0;
  sourcesFiles.filter(file => file.getFilePath().endsWith('spec.ts')).map(sourceFile => {
    files.push(sourceFile);

    const funcNames = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).map((funcName, index) => {
      let name = '';
      try {
        name = funcName.getExpression().print();
      } catch (e) {
        // anonymouse functions
        name = `arrow_func_${index}`;
      }

      return name;
    });

    describe += filter(funcNames, 'describe');
    it += filter(funcNames, 'it');
    xdescribe += filter(funcNames, 'xdescribe');
    xit += filter(funcNames, 'xit');
    expect += filter(funcNames, 'expect');
  });

  return {
    keys: [[KEY1, KEY2, KEY2x, KEY3, KEY3x, KEY4].join('\n')],
    values: [[files.length, describe, xdescribe, it, xit, expect].join('\n')]
  };
}
