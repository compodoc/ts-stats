import { SourceFile } from 'ts-simple-ast';
const KEY1 = 'LOC (mean)';
const KEY2 = 'LOC (median)';
const KEY3 = 'LOC (mode)';

export default function(sourcesFiles: SourceFile[]) {
  const lineNumbers = [];
  const count = {};
  sourcesFiles
    .map(sourceFile => {
      const endLineNumber = sourceFile.getEndLineNumber();
      lineNumbers.push(endLineNumber);

      // group by number of lines of code:
      // eg. 2000 (key) lines of code appeared in 1 (value) file
      // eg. 87 (key) lines of code appeared in 23 (value) files
      // eg. 255 (key) lines of code appeared in 99 (value) files
      count[endLineNumber] = (count[endLineNumber] || 0) + 1;
    })
    .sort();

  // avg
  const avg = (lineNumbers.reduce((a, b) => a + b, 0) / lineNumbers.length).toFixed(2);

  // median
  let middle = lineNumbers.length / 2;
  let median = lineNumbers[middle];
  if (lineNumbers.length % 2 === 0) {
    median = ((lineNumbers[middle] + lineNumbers[middle + 1]) / 2).toFixed(2);
  }

  // mode
  // sort by values
  const mode = Object.keys(count).sort( (a,b) => count[a] - count[b] ).pop();

  return {
    keys: [[KEY1, KEY2, KEY3].join('\n')],
    values: [
      [avg, median, mode].join('\n')
    ]
  };
}
