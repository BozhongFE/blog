---
title: 盒子模型及常见图形
date: 2017-08-09
tags:
 - css
---

## 盒子模型

![css-box](/img/css-box/index.png)

盒子模型是由4个盒子组成，分别为
`margin` => `margin-box`
`border` => `border-box`
`padding` => `padding-box`
`content` => `content-box`

所以理论上，`box-sizing: margin-box|border-box|padding-box|content-box;`
但是实际上浏览器厂商是没有全部支持的，只支持了部分。

```css
.box1 { box-sizing: margin-box; } /* 完全不支持 */
.box2 { box-sizing: border-box; } /* 完全支持 */
.box3 { box-sizing: padding-box; } /* Firefox曾经支持过, Firefox 50中被移除 */
.box4 { box-sizing: content-box; } /* 默认值 */
```


## box-sizing属性

+ content-box
`width` = `content`

+ ~~padding-box~~
~~`width` = `content` + `padding`~~

+ border-box
`width` = `content` + `padding` + `border`



## box-sizing图解

<img src="/img/css-box/content_box.png" alt="content-box" />
<img src="/img/css-box/border_box.png" alt="border-box" />
```css
.content-box {
  box-sizing: content-box;
  padding: 20px;
  width: 260px; 
  border: 20px solid rgb(200, 189, 255);
  background-color: rgb(150, 189, 255);
}
.border-box {
  box-sizing: border-box;
  padding: 20px;
  width: 260px; 
  border: 20px solid rgb(200, 189, 255);
  background-color: rgb(150, 189, 255);
}
```


## 常见圆形

[css-box-and-graph](/demo/css-box-and-graph.html)


参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/box-sizing


