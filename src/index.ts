#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'fs';
import * as program from 'commander';
import { fork } from 'child_process';
const chalk = require('chalk');
const forked = fork(path.join(__dirname, './worker.js'));
let projectProject;
let userProjectPackage;
try {
  projectProject = require(path.join('..', 'package.json'));
} catch (e) {
  console.log(chalk.red('Could not read project package.json file.'));
}
try {
  userProjectPackage = require(path.join(process.cwd(), 'package.json'));
} catch (e) {
  console.log(chalk.red('Could not read user project package.json file.'));
}

const AVAILABLE_STATS = ['decorators', 'classes', 'interfaces', 'imports', 'exports', 'specs', 'loc', 'files'];

program
  .version(projectProject.version, '-v, --version')
  .option('-p, --tsconfig <tsconfig>', 'TypeScript "tsconfig.json" file', 'tsconfig.json');

program
  .option('-l, --loc', 'Lines of code')
  .option('-f, --files', 'Files')
  .option('-d, --decorators', 'Decorators')
  .option('-c, --classes', 'Classes')
  .option('-i, --interfaces', 'Interfaces')
  .option('-m, --imports', 'Imports')
  .option('-e, --exports', 'Exports')
  .option('-s, --specs', 'Specs');
// .option('--no-files', `Don't include Files`)
// .option('--no-decorators', `Don't include Decorators`)
// .option('--no-classes', `Don't include Classes`)
// .option('--no-interfaces', `Don't include Interfaces`)
// .option('--no-imports', `Don't include Imports`)
// .option('--no-exports', `Don't include Exports`)
// .option('--no-specs', `Don't include Specs`)

program
  .on('--help', () => {
    console.log(`
  Examples:
    $ ts-stats -p src/tsconfig.app.json <boolean>
    $ ts-stats --loc --classes
    $ ts-stats --no-loc
    $ ts-stats -i -m
    `);
  })
  .parse(process.argv);

const tsConfigFilePath = path.join(process.cwd(), program.tsconfig);
const options = process.argv.slice(2);

// if --loc ==> only run loc
// if --loc && --specs ==> only run loc and specs
// if (empty) ==> run all defaults
let userStats = [];
for (let k in program) {
  if (program[k] && AVAILABLE_STATS.includes(k)) {
    // only keep options that are "stats"
    userStats.push(k);
  }
}
if (userStats.length === 0) {
  userStats = AVAILABLE_STATS;
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
