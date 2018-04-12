#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import * as program from 'commander';
import { fork } from 'child_process';
const forked = fork(path.join(__dirname, './worker.js'));
const projectProject = require(path.join('..', 'package.json'));
const userProjectPackage = require(path.join(process.cwd(), 'package.json'));

const defaultStats = {
  decorators: true,
  classes: true,
  interfaces: true,
  imports: true,
  exports: true,
  specs: true,
  loc: true,
  files: true
};

program
  .version(projectProject.version, '-v, --version')
  .option('-p, --tsconfig <tsconfig>', 'TypeScript "tsconfig.json" file', 'tsconfig.json')
  .option('-l, --loc', 'Lines of code')
  .option('-f, --files', 'Files')
  .option('-d, --decorators', 'Decorators')
  .option('-c, --classes', 'Classes')
  .option('-i, --interfaces', 'Interfaces')
  .option('-m, --imports', 'Imports')
  .option('-e, --exports', 'Exports')
  .option('-s, --specs', 'Specs')
  .on('--help', () => {
    console.log(`
  Examples:
    $ ts-stats --loc --classes
    $ ts-stats --loc --classes
    $ ts-stats -i -m
    `);
  })
  .parse(process.argv);

const tsConfigFilePath = path.join(process.cwd(), program.tsconfig);
const options = process.argv.slice(2);
if (options.length === 0 || program.tsconfig) {
  // no options given, set from defaults
  for(let opt in defaultStats) {
    if (defaultStats[opt]) {
      program[opt] = true;
    }
  }
}

if (!fs.existsSync(tsConfigFilePath)) {
  console.warn(`"${tsConfigFilePath}" file not found. Abort.`);
  process.exit(1);
} else {
  console.log(`Found: ${tsConfigFilePath}`);
}

const ora = require('ora');
let spinner = ora();
spinner.color = 'yellow';
spinner.text = `Scanning project${userProjectPackage ? ': ' + userProjectPackage.name : ' ...'}`;
spinner.start();

let userStats = Object.keys(program).filter(k => k in defaultStats);
forked.send({ tsConfigFilePath, stats: userStats });

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
