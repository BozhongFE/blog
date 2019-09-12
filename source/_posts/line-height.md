---
title: line-height
date: 2019-09-06
tags:
- css
---

# 移动端line-height设置与height一致垂直不居中

在PC端各个浏览器都是好的，但在Android和IOS的微信中文字会向上偏移（明显看出上面留白少，下面留白多）。

<!-- more -->

line-height = height，文本并不是真的居中，而是看着居中。当元素高度和font-size差距较大的时候，这种不是真正的居中就越发的明显。

## 实例

``` css
* {
    margin: 0;
    padding: 0;
}
div {
    width: 7.5rem;
    height: 1.7rem;
    line-height: 1.7rem;
    text-align: center;
    font-size: 0.8rem;
    color: #c94545;
    margin: 5rem auto;
    border-radius: 0.85rem;
    background-color: #ffc8c8;
    font-weight: 700;
}
```

``` 
<div>马上查看</div>
```

## 网上的解决方法

- 利用flex布局中的垂直居中属性实现垂直居中（完美）
- 使用table-cell比flex效果要好

``` css
div {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}
```

- 不直接设置line-height=height，而是设置 padding（需要人为计算）

``` css
div {
    line-height: 1;
	padding: 0.45rem 0;
	box-sizing: border-box;
}
```

- 原理大概就是找基准线下一点（父元素去掉行高）

``` css
div::after {
  display: inline-block;
  width: 0;
  height: 100%;
  content: '';
  vertical-align: middle;
  margin-top: 0.3rem;
}
```

- 相传有用（好像还不错）

``` css
div {
    border: 1px solid transparent;
}
```

## 找原因

- 字体大小不要使用奇数字号，带小数点的更不要提了。也就是说被2整除的整数且不可小于12px。 
- 使用rem的单位时造成（根元素如果动态改变时，根元素字体可能不是整数）。

## Android浏览器下line-height垂直居中为什么会偏离

> https://www.zhihu.com/question/39516424

- 安卓手机下字体大小大于12px，且为偶数时，才可以正常垂直居中
- 尽量使用中文字体，并显式声明为中文字体，在 `index.html` 中设置 `<html lang="zh-cmn-Hans">`
- 为了兼容MIUI8.0+系统，再单独声明 `font-family: MIUI`