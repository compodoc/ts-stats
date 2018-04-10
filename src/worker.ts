import Project, { SourceFile } from 'ts-simple-ast';
import * as path from 'path';
import * as Table from 'cli-table';

interface StatType {
  keys: string[];
  values: number[];
}

const table = new Table({
  // chars: {
  //   top: '',
  //   'top-mid': '',
  //   'top-left': '',
  //   'top-right': '',
  //   bottom: '',
  //   'bottom-mid': '',
  //   'bottom-left': '',
  //   'bottom-right': '',
  //   left: '',
  //   'left-mid': '',
  //   mid: '',
  //   'mid-mid': '',
  //   right: '',
  //   'right-mid': '',
  //   middle: ' '
  // },
  style: { 'padding-bottom': 0, 'padding-top': 0 },
  head: ['Type', 'Stats']
});

function computeStats(files: SourceFile[], statsToCompute: string[]) {
  process.send({ emit: 'Computing stats...' });

  return statsToCompute.map(stat => {
    process.send({ emit: `Computing (${stat})...` });

    const func = require(`./stats/${stat}`);
    return func.default(files) as StatType;
  });
}

function main(tsConfigFilePath: string, statsToCompute: string[]) {
  const project = new Project({
    tsConfigFilePath
  });

  process.send({ emit: 'Getting sources files...' });

  const sourcesFiles = project.getSourceFiles();
  const stats = computeStats(sourcesFiles, statsToCompute) as StatType[];

  stats.forEach(stat => {
    // stat.keys.forEach((key, index) => {
    // });
    table.push([stat.keys.shift(), ...stat.values]);
  });

  process.send({ result: table.toString() });
}
process.on('message', ({tsConfigFilePath, stats}) => {
  main(tsConfigFilePath, stats);
});
