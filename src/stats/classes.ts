import { SourceFile } from 'ts-simple-ast';
export default function(sourcesFiles: SourceFile[]) {
  const classes = [];
  const classesAnnotated = [];
  sourcesFiles.map(sourceFile => {
    sourceFile.getClasses().map(classe => {
      if (classe.getDecorators().length === 0) {
        // get classes without decorators
        classes.push(classe.getName());
      } else {
        // get classes with decorators
        classesAnnotated.push(classe.getName());
      }
    });
  });

  return {
    keys: [['Classes', 'Classes (w/ annotation)', 'Classes (w/o annotation)'].join('\n')],
    values: [[classesAnnotated.length + classes.length, classesAnnotated.length, classes.length].join('\n')]
  };
}
