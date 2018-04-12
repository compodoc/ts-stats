import { SourceFile, TypeGuards, ClassDeclaration } from 'ts-simple-ast';
export default function(sourceFiles: SourceFile[]) {
  const classes = [];
  const classesAnnotated = [];


  // see: https://github.com/compodoc/ts-stats/issues/12#issuecomment-380791091
  function visit(decorator: string, stats: string[]) {
    stats.push(decorator);
  }
  
  for (const sourceFile of sourceFiles) {
    sourceFile.forEachDescendant(descendant => {
      if (TypeGuards.isClassDeclaration(descendant)) {
        const classeDeclaration = (descendant as ClassDeclaration);
        if (classeDeclaration.getDecorators().length === 0) {
          visit(classeDeclaration.getName(), classes);
        }
        else {
          visit(classeDeclaration.getName(), classesAnnotated);
        }
      }
    });
  }

  // sourceFiles.map(sourceFile => {
  //   sourceFile.getClasses().map(classe => {
  //     if (classe.getDecorators().length === 0) {
  //       // get classes without decorators
  //       classes.push(classe.getName());
  //     } else {
  //       // get classes with decorators
  //       classesAnnotated.push(classe.getName());
  //     }
  //   });
  // });

  return {
    keys: [['Classes', 'Classes (w/ annotation)', 'Classes (w/o annotation)'].join('\n')],
    values: [[classesAnnotated.length + classes.length, classesAnnotated.length, classes.length].join('\n')]
  };
}
