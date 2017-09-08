---
title: npm的基本使用
date: 2017-09-08 14:34:36
tags:
---
##### 安装

`npm是和Node.js一起发布的，只要安装了Node.js，npm也安装好了，可以从Node.js的下载页下载对应操作系统的安装包安装即可。 安装好后，执行如下命令，检查是否安装成功。`

<!--more-->

```bash
$ node -v
v8.2.1
$ npm -v
5.3.0
```
`
但是由于npm自身的更新频率比Node.js高很多，所以通过上面的命令安装的npm可能不是最新版本，可以通过下面的命令单独更新npm
`

```bash
$ npm install npm@latest -g
```

##### 在本地模式下安装包

`在本地模式下安装，需要使用package.json文件，所以先创建：`

```bash
$ npm init
package name: (project)
version: (1.0.0)
description: Demo of package.json
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
```

`一直敲击回车键，就可以创建package.json文件在根目录下。`
```
{
  "name": "project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```
`main表示程序的入口文件，scripts指定运行脚本命令缩写。如果想了解更多，可以去查阅package.json相关文档。`

##### 安装模块

`
使用npm install会读取package.json文件来安装模块。安装的模块分为两类
dependencies和devDependencies，分别对应生产环境需要的安装包和开发环境需要的安装包。
同样在安装模块的时候，可以通过指定参数来修改package.json文件，如
`
```bash
$ npm install <package_name> --save
$ npm install <package_name> --save-dev
```
##### 更新模块
```
$ npm update
```
##### 卸载模块
```
$ npm uninstall <package_name>
```
`
如果要在卸载模块的同时，也将他从package.json文件中移除，可以添加跟安装时候一样的参数，例如:`
```bash
$ npm uninstall --save lodash
```
##### [npm配置](https://docs.npmjs.com/misc/config)
```
在使用npm时，我们可以根据个人的需要，指定很多配置信息。npm的配置信息加载优先级如下(从高到低)
```

    命令行参
    环境变量
    npmrc文件
    项目级别的npmrc文件(/path/to/my/project/.npmrc)
    用户级别的npmrc文件（~/.npmrc）
    全局的npmrc文件($PREFIX/etc/npmrc)
    npm内置的npmrc文件(/path/to/npm/npmrc)
`查看配置`
```bash
$ npm config list -l
```
##### 配置npm源
```
当我们使用默认配置从npm官网下载模块时，由于网络的因素，会导致我们的下载速度特别慢。所以，我们可以配置一些国内的镜像来加快我们的下载速度。在这里，我推荐使用淘宝的npm镜像, 具体使用方式如下:
```

`临时使用, 安装包的时候通过--registry参数即可`
```bash
$ npm install express-generator --registry https://registry.npm.taobao.org
```
`全局使用`
```bash
$ npm config set registry https://registry.npm.taobao.org
// 配置后可通过下面方式来验证是否成功
npm config get registry
// 或
npm info express
```
`使用cnpm使用`

```bash
// 安装cnpm
npm install -g cnpm --registry=https://registry.npm.taobao.org
// 使用cnpm安装包
cnpm install express
```
##### 别名
```
npm i – 安装包
npm i -g – 安装包到全局下
npm un – 删除本地下包
npm up – 更新包
npm t – 运行测试
npm ls – 罗列已经安装包
npm ll or npm la – 罗列包时显示额外信息
```
`也可以一次安装多个包`
```bash
$ npm i vue-resource vue-router vuex bootstrap --save
```
`
如果想知道其余npm命令，可以运行npm help
`
##### 版本管理器

`
版本管理器可以在一台主机上控制多个版本的node，比如n,nvm。
`