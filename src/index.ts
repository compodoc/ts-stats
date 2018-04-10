#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import { fork } from 'child_process';
const forked = fork(path.join(__dirname, './worker.js'));

var argv = require('minimist')(process.argv.slice(2), {
  default: { p: 'tsconfig.json' }
});
const tsConfigFilePath = path.join(process.cwd(), argv.p);
if (!fs.existsSync(tsConfigFilePath)) {
  console.warn(`"${tsConfigFilePath}" file not found. Abort.`);
  process.exit(1);
} else {
  console.log(`Found: ${tsConfigFilePath}`);
}

const projectName = require(path.join(process.cwd(), './package.json')).name;

const ora = require('ora');
let spinner = ora();
spinner.color = 'yellow';
spinner.text = `Scanning project${projectName ? ': ' + projectName : ' ...'}`;
spinner.start();

// prettier-ignore
const stats = [
  'decorators',
  'classes',
  'interfaces',
  'imports',
  'exports',
  'specs',
  'loc', 
  'files', 
];
forked.send({ tsConfigFilePath, stats });

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
  forked.on(error, _ => {
    process.exit(1);
  });
});
