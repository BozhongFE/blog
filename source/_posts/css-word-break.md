---
title: css 强制换行/强制不换行
date: 2017-08-08 17:17:45
tags:
- css
---
日常开发中经常会遇到文字不可以换行，或者自动换行的需求。
这里简单介绍下常用的文本标签的处理方法。<!--more-->

- - -

### 关键属性
* word-break: 指定了怎样在单词内断行。[详细：MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-break "word-break | MDN")
* overflow-wrap(word-wrap): 是否允许单词内换行。css3中将word-wrap改名为overflow-wrap，考虑兼容问题使用word-wrap。[详细：MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/word-wrap "overflow-wrap | MDN")
* white-space: 设置如何处理元素中的空白。[详细：MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space "white-space | MDN")

### 强制不换行

* `white-space: nowrap` 强制在同一行内显示所有文本，直到文本结束或者 `<br />`。
* `white-space: pre` 换行和其他空白字符(换行符/空格/制表符/文字转行)都将受到保护,等同 `<pre>`。

* `word-break: keep-all` 不允许CJK（中/日/韩）文本断行，移动端基本不支持。

### 强制换行

* 常用块状文本标签，如 `<p>`

  不需要添加任何样式，但过长的英文/数字会另起一行，特殊情况下会溢出空间。

* `<pre>` 标签

  `<pre>` 默认换行规则等同下面样式

  ```css
  p {
    display: block; /* 块状元素不需要这行*/
    white-space: pre;
  }
  ```
  `white-space: pre-wrap` 过长的英文/数字会另起一行，特殊情况下会溢出空间，但不同浏览器对空白换行的处理有差异。

  ```css
  pre {
    white-space: pre-wrap;
  }
  ```

  也可以用`white-space: pre-line`，但会合并空格和制表符。

|white-space:|换行符|空格和制表符|文字转行|
|-|-|-|
|normal|合并|合并|转行|
|nowrap|合并|合并|不转行|
|pre|保留|保留|不转行|
|pre-wrap|保留|保留|转行|
|pre-line|保留|合并|转行|

* 英文/数字内换行

  针对过长的英文/数字的解决方法 `word-wrap: break-word` 或 `word-break: break-all`。

* word-wrap/word-break区别

  `word-wrap: break-word` 会先尝试将单词挪到下一行，下一行宽度不够才会进行单词内断句。
  `word-break: break-all` 直接进行单词内断句。

  两者都不能搭配 `white-space:pre` `<pre>` 使用。

* display: block/inline-block/inline

  `display: block` 文字溢出不会撑起容器。
  `display: inline-block` 容器不定宽度，文字溢出会撑起容器，只有 `word-break:break-all` 有效。
  `display: inline` border会受文字影响，能用于特殊需求。部分浏览器word-wrap/word-break换行无效，如FF、IE。

### 兼容问题

* `word-break:keep-all` 移动端基本不支持。
* 不同浏览器的属性间搭配会有显示差异
