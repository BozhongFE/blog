---
title: CSS 水平垂直居中的几种实现方式
date: 2017-07-26
tag: 
- css
---
前端开发中，总会遇到各种需要将元素水平垂直居中的场景。  
这里简单介绍一下几种 CSS 水平垂直居中的方法及其适用性和兼容性。<!--more-->

## 单行文字的水平垂直居中
单行文字的垂直居中是最常见的，也是最容易实现的。  
只要将文字的行高（line-height）和要垂直居中的元素高度（height）设置为一样即可。
水平居中就设置一下 `text-align: center` 就可以了。
例如：
```html
<div class="outer">
  <div class="inner">这里是需要垂直居中的文字</div>
</div>
```

```css
.outer {
  height: 40px;
  line-height: 40px;
  text-align: center;
}
```

## 多行文字及元素的水平垂直居中
### 一、display: inline-block + vertical-align: middle
`vertical-align` 这个属性依赖于 inline/inline-block/table-cell ，如果元素不属于这几类，这个属性则无法生效。

要用这两个属性实现垂直居中，需要用到伪类 `:before` 或者添加一个空元素 。

假设我们有如下的一段 HTML 代码：
```html
<!-- 伪类写法 -->
<div class="outer">
  <div class="inner">这里是需要水平垂直居中的文字</div>
</div>
<!-- 空元素写法 -->
<div class="outer">
  <div class="center"></div>
  <div class="inner">这里是需要水平垂直居中的文字</div>
</div>
```
那么我们的 CSS 应该这么写：
```css
.outer {
  width: 200px;
  height: 100px;
  text-align: center;
}

.inner {
  display: inline-block;
  vertical-align: middle;
}

/* 伪类写法 */
.outer:before {
  content: '';
  width: 0;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}

/* 空元素写法 */
.center {
  width: 0;
  height: 100%;
  display: inline-block;
  vertical-align: middle;
}
```
两种写法的原理是一样的。  
因为 vertical-align 需要有一个能和它对齐的元素，所以添加一个宽度为 0 的元素，可以实现不占用页面大小，却能影响页面布局的作用。  
高度设置为 100%，那么无论父元素（在上面的代码里是 `outer`）高度设置为多少，都能在父元素内部垂直居中。  

这种写法的优点就是兼容性好，IE 8 及其以上版本的浏览器，都支持这种写法。缺点是必须额外添加一个元素。  
这种方式一般用于不确定是单行或者多行文字的垂直居中。

### 二、使用绝对定位与 translate 实现水平垂直居中

```html
<div class="outer">
    <div class="inner">水平垂直居中</div>
</div>
```

```css
.outer {
    position: relative;
}

.inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```
注意：这里不要使用 translate3d，会导致显示模糊。  
这种方式默认情况下，子元素的宽度为父元素的一半，因为 left 设置为 50%，所以文字是从 50% 的位置开始，在 100% （也就是最后面）的位置换行。

### 三、使用绝对定位与负 margin 实现水平垂直居中

```html
<div class="outer">
    <div class="inner">水平垂直居中</div>
</div>
```

```css
.outer {
    position: relative;
}

.inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 100px;
    margin-left: -100px; /* 宽度的一半 */
    margin-top: -50px; /* 高度的一半 */
}
```
这种方式的实现原理和 translate 的类似。  
都是通过反向位移元素宽高的一半，来实现居中对齐。  
但是负 margin 这种方式需要知道子元素的宽高才能实现。如果使用百分比，获取到的大小是父元素的，而不是子元素的，无法实现对齐效果。

### 四、display: table-cell + vertical-align 实现垂直居中

```html
<div class="outer">
    <div class="inner">水平垂直居中</div>
</div>
```

```css
.outer {
    display: table;
}

.inner {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}
```
这种方式实现的方式类似于 `display: inline-block`，区别在于 `inline-block` 需要额外的元素来实现对齐。而 `table-cell` 不需要。  
这种方式的兼容性也很好，IE 8 及其以上版本的浏览器都支持。

### 五、display: flex 实现居中对齐

```html
<div class="outer">
    <div class="inner">水平垂直居中</div>
</div>
```

```css
.outer {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}
```
使用 flex 的优点是，子元素不进行任何设置就能完美实现居中对齐。  
缺点是只有较新的浏览器支持该特性。  
PC 端的，IE 10 及其以上版本才能兼容。  
不过移动端 iOS 7.0 以上， Android 4.4 以上版本已经完全兼容。
通过新旧语法混用（可用 autoprefixer 生成），可以兼容 Android 4.0 以上及 iOS 6.0 以上版本。  
现在 Android 4.0 和 iOS 6.0 以下版本的用户已经很少了。随着时间的推移，会越来越少。  
如果现在移动端的项目不用考虑 Android 4.0 以下版本的浏览器，那么 flex 完全可用了。

## 总结
上面几种对齐方式，一和四一般用于多行文字的居中对齐。二和三多用于弹窗的居中对齐。  
而 flex 这种方式，各种情况的居中对齐都可以用。  

如果不用考虑兼容性的话，可以优先选择 flex。  
移动端的项目基本可用了。  
PC 端的话，考虑到兼容性，最好就先不用，等 IE 10 以下版本的用户量减少到可以不用考虑的时候，再使用。