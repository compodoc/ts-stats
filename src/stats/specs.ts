import { SourceFile, SyntaxKind } from 'ts-simple-ast';
import { format } from '../helpers';
const KEY1 = 'Spec (files)';
const KEY2 = 'Spec (describe)';
const KEY2x = 'Spec (xdescribe)';
const KEY2f = 'Spec (fdescribe)';
const KEY3 = 'Spec (it)';
const KEY3x = 'Spec (xit)';
const KEY3f = 'Spec (fit)';
const KEY4 = 'Spec (expect)';

function filter(funcNames, by) {
  return funcNames.filter(n => n === by).length;
}
export default function(sourcesFiles: SourceFile[]) {
  const files = [];
  let describe = 0;
  let it = 0;
  let xdescribe = 0;
  let xit = 0;
  let fdescribe = 0;
  let fit = 0;
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
    fdescribe += filter(funcNames, 'fdescribe');
    fit += filter(funcNames, 'fit');
    expect += filter(funcNames, 'expect');
  });

  return {
    keys: [[KEY1, KEY2, KEY2x, KEY2f, KEY3, KEY3x, KEY3f, KEY4].join('\n')],
    values: [
      [
        format(files.length),
        format(describe),
        format(xdescribe),
        format(fdescribe),
        format(it),
        format(xit),
        format(fit),
        format(expect)
      ].join('\n')
    ]
  };
}
