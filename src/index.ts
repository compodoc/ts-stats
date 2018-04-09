#!/usr/bin/env node
const { fork } = require('child_process');
import * as path from 'path';

const ora = require('ora');
let spinner = ora();
spinner.color = 'yellow';
spinner.text = 'Scanning your angular project...';
spinner.start();

const forked = fork(path.join(__dirname, './child.js'));

forked.on('message', done => {
  spinner.stop();
  console.log(done.result);
});
forked.on('error', error => {
  process.exit(1);
});