import { SourceFile, SyntaxKind } from 'ts-simple-ast';
export default function(sourcesFiles: SourceFile[]) {
  const comments = [];
  sourcesFiles.map(sourceFile => {
    // console.log(
    //   sourceFile.getDescendantsOfKind(SyntaxKind.JSDocComment).map(n => n.getText()),
    //   sourceFile.getDescendantsOfKind(SyntaxKind.MultiLineCommentTrivia).map(n => n.getText()),
    //   sourceFile.getDescendantsOfKind(SyntaxKind.SingleLineCommentTrivia).map(n => n.getText()),
    // )
  });

  return {
    keys: ['Comments'],
    values: [comments.length]
  };
}
