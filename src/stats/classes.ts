import { SourceFile } from 'ts-simple-ast';
export default function(sourcesFiles: SourceFile[]) {
  const classes = [];
  const classesAnnotated = [];
  sourcesFiles.map(sourceFile => {
    sourceFile.getClasses().map(classe => {
      // get only classes without decorators
      if (classe.getDecorators().length === 0) {
        classes.push(classe.getName());
      } else {
        classesAnnotated.push(classe.getName());
      }
    });
  });

  return {
    keys: [['Classes', 'Classes (w/ annotation)', 'Classes (w/o annotation)'].join('\n')],
    values: [[classesAnnotated.length + classes.length, classesAnnotated.length, classes.length].join('\n')]
  };
}
