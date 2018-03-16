---
title: 一些css伪类选择器
date: 2018-02-09 10:26:27
tags:
 - css
---
几个特殊且实用的伪类选择器。

<!--more-->

---

## :root

`:root` 匹配文档的根元素。
应用到HTML，`:root`即表示为`<html>`元素


```css
:root {
  --main-color: red;
};

div {
  background: var(--main-color); // 等同 background:red
}
```

适用于声明全局CSS变量时。

---

## :empty

`:empty` 代表没有子元素的元素。
这里的子元素只计算元素节点及文本（包括空格），注释、运行指令不考虑在内。

```css
div{
  height:20px;
  background:#ffcc00;
}
div:empty{
  background:#fff;
}
```
```html
<!-- background: #ffcc00 -->
<div>1</div>
<div> </div>
<!-- background: #fff -->
<div></div>
```

适用于判断列表/内容为空时显示样式。

---

## :target

`:target`可用于选取当前活动的目标元素。需要一个id去匹配文档URI的片段标识符。
URL末尾带有锚名称 #，指向文档内某个具体的元素。这个被链接的元素就是目标元素(target element)。

```css
#content1,
#content2 {
  display:none;
}

#content1:target,
#content2:target {
  display:block;
}
```
```html
<div id="content1">列表1</div>
<div id="content2">列表2</div>
<ul class='nav'>
  <li><a href="#content1">列表1内容</a></li>
  <li><a href="#content2">列表2内容</a></li>
</ul>
```

![demo](/img/css-pseudo-class-one/2.gif)

适用于纯CSS的导航栏Tab切换。

---

## :not

`:not(X)` 匹配不符合参数选择器X描述的元素。X不能包含另外一个否定选择器。


* 不会增加选择器的优先级，它的优先级即为它参数选择器的优先级
* `:not(*)` 匹配任何非元素的元素，因此这个规则将永远不会被应用。
* 只会应用在一个元素上，不能用它在排除所有祖先元素。举例：`body :not(table) a` 将依旧会应用在table内部的`<a>`上, 因为`<tr>`将会被`:not()` 这部分选择器匹配。

```css
body :not(p) {
  color: green;
}
p:not(.test) {
  color: red;
}
```
```html
<!-- color: red -->
<p>Some text.</p>
<!-- 浏览器默认颜色 -->
<p class="test">Some other text.</p>
<!-- color: green -->
<span>One more text<span>
```

![demo](/img/css-pseudo-class-one/5.png)

适用：
  * weui的按钮样式有使用到
  * 列表某些特定位置样式，如头尾部的边

---

## :first-line

`:first-line`选取指定选择器的首行。

可配合使用样式：
* 字体属性
* 颜色属性
* 背景属性
* word-spacing
* letter-spacing
* text-decoration
* vertical-align
* text-transform
* line-height
* clear

```css
p:first-line {
  background-color:yellow;
}
```
```html
<p>第一行文字<br/>第二行文字<br/>第三行文字</p>
```

![demo](/img/css-pseudo-class-one/3.png)

---

## :first-letter

`:first-letter`选择器用于选取指定选择器的首字母。

可配合使用样式：
* 字体属性
* 颜色属性
* 背景属性
* 外边距属性
* 内边距属性
* 边框属性
* text-decoration
* vertical-align（只有在 float 为 'none' 时）
* text-transform
* line-height
* float
* clear

```css
p:first-letter {
  font-size:200%;
  color:#8A2BE2;
}
```
```html
<p>选择器用于选取指定选择器的首字母</p>
```

![demo](/img/css-pseudo-class-one/4.png)

---

## 配合`:before/:after` 使用的 `content`

`content`与 `:before`及`:after`伪元素配合使用，来插入生成内容。

```css
div:after{
  content: attr(data-msg);
  position: absolute;
  left: 20px;
  top: 30px;
  border: 1px solid green;
}
<!-- 显示没有文本值但是 href 属性具有链接的 a 元素的链接 -->
a:empty::before {
  content: attr(href);
}
```
```html
<div data-msg="Open this file in Github Desktop">test</div>
<a href="www.baidu.com"></a>
```

![exam](/img/css-pseudo-class-one/6.png)

适用于文字提示。↓↓↓
![exam](/img/css-pseudo-class-one/1.jpg)

---

上述伪类选择器皆兼容IE9+
