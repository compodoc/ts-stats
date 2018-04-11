import { SourceFile } from 'ts-simple-ast';

function pushDecorator(classe, decorator, stats) {
  const _decorator = `@${decorator.getFullName()}()`;
  const entry = stats[_decorator];
  if (!entry) {
    stats[_decorator] = [];
  }
  stats[_decorator].push(classe.getName());
}

export default function(sourcesFiles: SourceFile[]) {
  const stats = {};
  sourcesFiles.map(sourceFile => {
    sourceFile.getClasses().map(classe => {
      try {
        // class decorators
        classe.getDecorators().map(decorator => {
          pushDecorator(classe, decorator, stats);
        });
        // property decorators
        classe.getProperties().map(property => {
          property.getDecorators().map(decorator => {
            pushDecorator(classe, decorator, stats);
          })
        });
        // method decorators
        classe.getMethods().map(method => {
          method.getDecorators().map(decorator => {
            pushDecorator(classe, decorator, stats);
          })
        });
        // constructor args decorators
        classe.getConstructors().map(constructor => {
          constructor.getParameters().map(parameter => {
            parameter.getDecorators().map(decorator => {
              pushDecorator(classe, decorator, stats);
            })
          })
        });
      } catch (e) {}
    });
  });

  return {
    keys: [Object.keys(stats).join('\n')],
    values: [Object.keys(stats).map(k => stats[k].length).join('\n')]
  };
}
