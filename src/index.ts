#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
const ora = require('ora');
import { fork } from 'child_process';
const forked = fork(path.join(__dirname, './worker.js'));

// available stats
// set to "true" to enable by default
const availableStats = {
  decorators: true,
  classes: true,
  interfaces: true,
  imports: true,
  exports: true,
  specs: true,
  loc: true,
  comments: true,
  files: true
};
const cliArgsDefaults = {
  default: {
    p: 'tsconfig.json',
    ...availableStats
  }
};
var argv = require('minimist')(process.argv.slice(2), cliArgsDefaults);
const spinner = ora();
const availableStatsKeys = Object.keys(availableStats).sort();
const userArgvStatsKeys = Object.keys(argv);
console.log(userArgvStatsKeys);

const userFilteredStats = userArgvStatsKeys.filter(key => availableStatsKeys.indexOf(key) >= 0);
if (userFilteredStats.length === 0) {
  console.warn(`Please choose at least one stat type to continue...`);
  console.warn(`Available stats are:`);
  availableStatsKeys
    .map(stat => console.log(`  --${stat}`));
  console.warn(`Abort.`);
  process.exit(1);
} else {
  
  const tsConfigFilePath = path.join(process.cwd(), argv.p);
  
  if (!fs.existsSync(tsConfigFilePath)) {
    console.warn(`"${tsConfigFilePath}" file not found. Abort.`);
    process.exit(1);
  } else {
    console.log(`Found: ${tsConfigFilePath}`);
  }

  const projectName = require(path.join(process.cwd(), './package.json')).name;

  spinner.color = 'green';
  spinner.text = `Scanning project${projectName ? ': ' + projectName : ' ...'}`;
  spinner.start();

  forked.send({ tsConfigFilePath, stats: userFilteredStats });
}

forked.on('message', done => {
  if (done.result) {
    spinner.stop();
    console.log(done.result);
    process.exit(0);
  } else if (done.emit) {
    spinner.text = done.emit;
  }
});

['uncaughtException', 'UnhandledPromiseRejectionWarning', 'exit', 'disconnect'].map(error => {
  forked.on(error, _ => process.exit(1));
});
