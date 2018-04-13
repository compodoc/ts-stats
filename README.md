<p align="center">
  <a href="https://www.npmjs.com/package/@compodoc/ts-stats"><img src="https://badge.fury.io/js/%40compodoc%2Fts-stats.svg" alt="npm badge"></a>
  <a href="https://david-dm.org/compodoc/ts-stats"><img src="https://david-dm.org/compodoc/ts-stats.svg" alt="npm dependencies"></a>
  <a href="https://david-dm.org/compodoc/ts-stats?type=dev"><img src="https://david-dm.org/compodoc/ts-stats/dev-status.svg" alt="npm devDependencies"></a>
  <a href="http://opensource.org/licenses/MIT"><img src="http://img.shields.io/badge/license-MIT-brightgreen.svg" alt="MIT badge"></a>
</p>

# ts-stats
Gives statistics about your TypeScript files

<p align="center">
  <img src="https://raw.githubusercontent.com/compodoc/ts-stats/master/screenshots/terminal-2.png" alt="ts-stats">
</p>

## Install

Install from npm:

```
npm install -g @compodoc/ts-stats
```

Install from Yarn:

```
yarn global add @compodoc/ts-stats
```

## Usage

Use __`ts-stats`__ near a `tsconfig.json` file.

```
$ ts-stats
```

## CLI Arguments

```
-v, --version              output the version number
-h, --help                 output usage information
-p, --tsconfig <tsconfig>  TypeScript "tsconfig.json" file (default: tsconfig.json)
-l, --loc                  Lines of code
-f, --files                Files
-d, --decorators           Decorators
-c, --classes              Classes
-i, --interfaces           Interfaces
-m, --imports              Imports
-e, --exports              Exports
-s, --specs                Specs
```