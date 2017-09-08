---
title: css 关于清除浮动的几种方法
date: 2017-08-04 13:59:46
tags:
 - css
---
#####  什么是CSS清除浮动？
`
在非IE浏览器（如Firefox）下，当容器的高度为auto，且容器的内容中有浮动（float为left或right）的元素，在这种情况下，容器的高度不能自动伸长以适应内容的高度，使得内容溢出到容器外面而影响（甚至破坏）布局的现象。这个现象叫浮动溢出，为了防止这个现象的出现而进行的CSS处理，就叫CSS清除浮动。引用W3C的例子，容器没有包围浮动的元素。
`
<!--more-->
##### 一、给父元素定高
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <style>
        .outer{
            border: 1px solid black;
            width: 300px;
            height: 50px;
        }
        .inner{
            width: 50px;
            height: 50px;
            background-color: #ff4400;
            margin-right: 20px;
            float: left;
        }
        .footer{
            background-color: #005FC3;
            width: 200px;
            height: 100px;
        }
    </style>
</head>
<body>
    <div class="outer">
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="inner"></div>
    </div>
    <div class="footer"></div>
</body>
</html>
```
- 优点：简单，代码少，容易掌握
- 缺点：只适合高度固定的布局，要给出精确的高度，如果高度和父级div不一样时，会产生问题

##### 二、使用带clear属性的空元素
`
在浮动元素后使用一个空元素如<div class="clear"></div>，并在CSS中赋予.clear{clear:both;}属性即可清理浮动。
`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <style>
        .top{
            border: 1px solid #000;
            width:300px;
        }
        .inner{
            width: 50px;
            height: 50px;
            background-color: #F0FFF0;
            margin-right: 20px;
            float: left;
        }
        .footer{
            background-color: #FFB5C5;
            width: 200px;
            height: 100px;
        }
        .clearfix{
            clear: both;
        }
    </style>
</head>
<body>
    <div class="top">
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="clearfix"></div>
    </div>
    <div class="footer"></div>
</body>
</html>
```
-  优点：简单，代码少，浏览器兼容性好。
-  缺点：需要添加大量无语义的html元素，后期不容易维护。

##### 三、使用邻接元素处理
`
什么都不做，给浮动元素后面的元素添加clear属性。
`
##### 四、使用CSS的overflow属性
`
给浮动元素的容器添加overflow:hidden;或overflow:auto;可以清除浮动，另外在 IE6 中还需要触发 hasLayout ，例如为父元素设置容器宽高或设置 zoom:1。
在添加overflow属性后，浮动元素又回到了容器层，把容器高度撑起，达到了清理浮动的效果。`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <style>
        .outer{
            border: 1px solid black;
            width: 300px;
            overflow: hidden;
            zoom: 1;/*兼容 IE*/
        }
        .inner{
            width: 50px;
            height: 50px;
            background-color: #ff4400;
            margin-right: 20px;
            float: left;
        }
        .footer{
            background-color: #005FC3;
            width: 200px;
            height: 100px;
        }
    </style>
</head>
<body>
    <div class="outer">
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="inner"></div>
    </div>
    <div class="footer"></div>
</body>
</html>
```
##### 五、给浮动的元素的容器添加浮动

`给浮动元素的容器也添加上浮动属性即可清除内部浮动，但是这样会使其整体浮动，影响布局，不推荐使用。`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <style>
        .outer{
            border: 1px solid black;
            width: 300px;
            float: left;
        }
        .inner{
            width: 50px;
            height: 50px;
            background-color: #ff4400;
            margin-right: 20px;
            float: left;
        }
        .footer{
            background-color: #005FC3;
            width: 200px;
            height: 100px;
        }
    </style>
</head>
<body>
    <div class="outer">
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="inner"></div>
    </div>
    <div class="footer"></div>
</body>
</html>
```


##### 六、使用CSS的:after伪元素

`
结合 :after 伪元素（注意这不是伪类，而是伪元素，代表一个元素之后最近的元素）和 IEhack ，可以完美兼容当前主流的各大浏览器，这里的 IEhack 指的是触发 hasLayout。
给浮动元素的容器添加一个clearfix的class，然后给这个class添加一个:after伪元素实现元素末尾添加一个看不见的块元素（Block element）清理浮动。
`


```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <style>
        .outer{
            border: 1px solid #000;
            width: 300px;
        }
        .inner{
            width: 50px;
            height: 50px;
            background-color: #F0FFF0;
            margin-right: 20px;
            float: left;
        }
        .footer{
            background-color: #FFB5C5;
            width: 200px;
            height: 100px;
        }
        .clearfix:after{  /*最简方式*/
            content: '';
            display: block;
            clear: both;
        }
        /* 新浪使用方式
        .clearfix:after{ 
            content: '';
            display: block;
            clear: both;
            height: 0;
            visibility: hidden;
        }
        */
        .clearfix{ /*兼容 IE*/
            zoom: 1;
        }
    </style>
</head>
<body>
    <div class="outer clearfix">
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="inner"></div>
    </div>
    <div class="footer"></div>
</body>
</html>
```

##### 总结


`通过上面的例子，我们不难发现清除浮动的方法可以分成两类：`

  `1.是利用 clear 属性，包括在浮动元素末尾添加一个带有 clear: both 属性的空 div 来闭合元素，其实利用 :after 伪元素的方法也是在元素末尾添加一个内容为一个点并带有 clear: both 属性的元素实现的。`
  
  `2.是触发浮动元素父元素的 BFC (Block Formatting Contexts, 块级格式化上下文)，使到该父元素可以包含浮动元素，关于这一点。`

##### 推荐

`在网页主要布局时使用:after伪元素方法并作为主要清理浮动方式；在小模块如ul里使用overflow:hidden;（留意可能产生的隐藏溢出元素问题）；如果本身就是浮动元素则可自动清除内部浮动，无需格外处理；正文中使用邻接元素清理之前的浮动。
最后可以使用相对完美的:after伪元素方法清理浮动，文档结构更加清晰。
`



