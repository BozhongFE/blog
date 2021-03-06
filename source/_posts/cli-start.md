---
title: 命令行工具入门
date: 2019-09-12
tags:
 - cli
 - javascript
---

这里只简单介绍如何快速开发一个 `CLI`，具体业务需要根据实际来开发，以下主要通过三个例子渐进式学习

<!-- more -->

- 从 0 到 1 开发命令行工具
- 命令帮助文档
- 命令行交互（input、confirm、list、checkbox 等等）


## 创建一个 `CLI`，例子 xcli

一个可以本地运行的 `CLI`，只需要两个文件即可：

- xcli/bin/xcli

```js
#!/usr/bin/env node
console.log('Welcome to CLI')
```

- xcli/package.json

```json
{
  "name": "xcli",
  "version": "0.1.0",
  "bin": {
    "xcli": "bin/xcli"
  }
}
```

通过 `npm link` 为此工具创建链接，方面调试和测试。

```bash
# 进入 xcli 目录
$ cd xcli
# 创建链接
$ npm link
# 执行 xcli 命令
$ xcli
Welcome to CLI
```

## 命令帮助文档，例子 xnpm

一个命令行工具最基本就是工具界面，执行一个命令，输出帮助文档  
[commander](https://github.com/tj/commander.js#commands) 是一个命令行界面的解决方案，我们将使用它，结果如下：

```bash
$ xnpm 
Usage: xnpm <command>

Options:
  -v, --version      output the version number
  -h, --help         output usage information

Commands:
  install|i [name]   install packages
  run [script-name]  run script
  help [cmd]         display help for [cmd]

$ xnpm install --save
xnpm install success ; use --save
```

- xnpm/bin/xnpm
```js
#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
program
  // 帮助文档: 本 CLI 的版本号
  .version(pkg.version, '-v, --version')
  // 帮助文档: 使用方法
  .usage('<command>')
  // 帮助文档: 命令
  .command('install [name]', 'install packages').alias('i')
  .command('run [script-name]', 'run script')
  // 解析参数
  .parse(process.argv)
```

- xnpm/bin/xnpm-install

```js
#!/usr/bin/env node
const program = require('commander')
program
  .usage('[options]')
  // 帮助文档：参数
  .option('--save', 'save in dependencies')
  .option('--save-dev', 'save in devDependencies')
  .parse(process.argv)
let used = []
// 根据不同参数输出不同内容
if (program.save) used.push('; use --save')
if (program.saveDev) used.push('; use --save-dev')
console.log('xnpm install success', ...used)
```

## 命令行交互，例子 xvue-cli

除了帮助文档，命令还需交互，如 input、confirm、list、checkbox 等等。

[inquirer](https://github.com/SBoudrias/Inquirer.js) 是一个用户与命令行交互的工具，我们将使用它，结果如下：

```bash
$ xvue create project
Xvue CLI v0.1.0

? Please pick a preset: (Use arrow keys)
  default (babel, eslint)
> Manually select features
? Check the features needed for your project 
  ◉ Babel
❯ ◉ TypeScript
  ◯ Progressive Web App (PWA) Support
  ◯ Router
  ◯ Vuex
  ◯ CSS Pre-processors
  ◉ Linter / Formatter
```

- xvue-cli/bin/xvue (省略)
- xvue-cli/bin/xvue-create
```js
#!/usr/bin/env node
const program = require('commander')
const inquirer = require('inquirer')
const pkg = require('../package.json')

// 读取传进来的项目名
program.parse(process.argv)
const [ projectName ] = program.args
// 自选预设功能
const presetDicts = {
  babel: 'Babel',
  typescript: 'TypeScript',
  pwa: 'Progressive Web App (PWA) Support',
  router: 'Router',
  vuex: 'Vuex',
  precss: 'CSS Pre-processors',
  linter: 'Linter / Formatter',
  unit: 'Unit Testing',
  e2e: 'E2E Testing'
}
// 默认的预设功能
const defaultPresets = {
  __default__: [
    'babel',
    'eslint'
  ]
}
// 预设问答
const presetList = [
  {
    type: 'list',
    message: 'Please pick a preset:',
    name: 'type',
    choices: [
      {
        name: 'default (babel, eslint)',
        value: '__default__'
      },
      {
        name: 'Manually select features',
        value: '__manual__'
      }
    ]
  },
  {
    when: preset => preset.type === '__manual__',
    type: 'checkbox',
    message: 'Check the features needed for your project',
    name: '__manual__',
    choices: Object.keys(presetDicts).map(item => ({
      name: presetDicts[item],
      value: item,
      checked: /babel|linter/.test(item)
    }))
  }
]

// 输出结果
console.log(`Xvue CLI v${pkg.version}\n`);
inquirer.prompt(presetList).then(answers => {
  const presets = answers[answers.type] || defaultPresets[answers.type]
  console.log('Project Name:', projectName)
  console.log('Preset Choice:', presets)
})
```