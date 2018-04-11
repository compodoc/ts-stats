import { SourceFile } from 'ts-simple-ast';
const KEY = 'LOC (total)';
const KEY1 = 'LOC (mean)';
const KEY2 = 'LOC (median)';
const KEY3 = 'LOC (mode)';

export default function(sourcesFiles: SourceFile[]) {
  const lineNumbers = [];
  const loc = {};
  let total = 0;
  let mean = '0';
  let mode = '0';
  let median = '0';
  sourcesFiles
    .map(sourceFile => {
      // count LOC per file
      // file #1 [0] = 123
      // file #2 [1] = 987
      // file #3 [2] = 26
      // file #4 [3] = 9903
      const endLineNumber = sourceFile.getEndLineNumber() - 1;
      lineNumbers.push(endLineNumber);

      // group by number of lines of code:
      // eg. 2000 (key) lines of code appeared in 1 (value) file
      // eg. 87 (key) lines of code appeared in 23 (value) files
      // eg. 255 (key) lines of code appeared in 99 (value) files
      loc[endLineNumber] = (loc[endLineNumber] || 0) + 1;
    })
    .sort();

  // mean
  if (lineNumbers.length > 0) {
    total = lineNumbers.reduce((a, b) => a + b, 0);

    mean = (total / lineNumbers.length).toFixed(2);

    // median
    let middle = (lineNumbers.length / 2) | 0;
    median = lineNumbers[middle].toFixed(2);
    if (lineNumbers.length % 2 === 0) {
      median = ((lineNumbers[middle] + lineNumbers[middle + 1]) / 2).toFixed(2);
    }

    // mode
    // sort by values
    mode = Object.keys(loc)
      .map(Number)
      .sort((a, b) => loc[a] - loc[b])
      .pop()
      .toFixed(2);
  }

  return {
    keys: [[KEY, KEY1, KEY2, KEY3].join('\n')],
    values: [[total, mean, median, mode].join('\n')]
  };
}
