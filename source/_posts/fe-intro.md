---
title: 介绍
date: 2017-07-25 16:06:32
tags:
 - tutotial
---
本站基于Hexo，写文章前需要先安装Hexo。（文档格式是Markdown）

## Hexo使用

### 全局安装

``` bash
$ npm install hexo-cli -g
```
详情：[Hexo](https://hexo.io/)


### 本地预览

``` bash
$ hexo server
```
详情：[Hexo Server](https://hexo.io/docs/server.html)


### 创建文章

``` bash
$ hexo new "your note name"
```
新建的文章位于 `/source/_post` 下面
详情：[Hexo Writing](https://hexo.io/docs/writing.html)


### 编译静态文件

``` bash
$ hexo generate
```
详情：[Hexo Generate](https://hexo.io/docs/generating.html)


### 部署静态文件

编译之后会生成 `public` 静态文件目录，之后 `push` 上 `hg` 即可。

## 代码风格

### html

``` html
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <div>Hello World</div>
  </body>
</html>
```


### css

``` css
html {
  font-size: 14px;
}
.class {
  color: red;
}
```


### javascript

``` javascript
const str = '';
for (let i = 0; i <= 10; i++) {
  console.log(i);
}
```

