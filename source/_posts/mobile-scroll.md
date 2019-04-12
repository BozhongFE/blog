---
title: 移动端滚动穿透
date: 2019-04-12
tags:
 - css
 - javascript
---

写这篇是因为之前移动端项目中弹框滚动遇到的体验问题，里面会对可行的方法进行说明

<!-- more -->

在移动端使用原生滚动的时候，在叠层的情况下总会不经意就触及到底层的滚动，导致该滚的内容不滚，不该滚的的内容滚得可欢乐

扫码看问题

<img src="https://image.office.bzdev.net/sys/2019/04/12/2a90b57e4412f45b026ac71f959fafec689793.jpg">

### 事件流

事件发生时会在元素节点与根节点之间按照特定的顺序传播，路径所经过的所有节点都会收到该事件，这个传播过程即DOM事件流。

<img src="https://www.w3.org/TR/DOM-Level-3-Events/images/eventflow.svg">


扫码看demo

<img src="https://image.office.bzdev.net/sys/2019/04/12/b7257a0cf34ee93cb7a913d96d9a2064658695.jpg">

```html
<html>
  <body>
    <div class="content">
      ...尽量多的内容直至出现滚动条
    </div>
    <div class="pop">
        <div class="pop-layout"></div>
        <div class="pop-main">...尽量多的内容直至出现滚动条</div>
    </div>
    <div class="btn-pop">弹框</div>
  </body>
</html>
```
```css
   html,body {
        padding: 0;
        margin: 0;    
        position: fixed;
        width: 100%;
        height: 100%;
        background: #fff;
    }
    .content {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow: auto;
    } 
    .pop {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%; 
        height: 100%;
        display: none;
    }
    .pop-layout {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
    }
    .pop-main {
        position: fixed;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        border-radius: 5px;
        background: #fff;
        padding:10px;
        width: 200px;
        height: 200px;
        overflow: auto;
        -webkit-overflow-scrolling : touch;
    }
    .btn-pop {
        position: fixed;
        right: 5px;
        top: 5px;
        display: inline-block;
        border-radius: 8px;
        background-color: coral;
        color: #fff;
        padding: 8px;
    }
```
```js

 // 仅是用于触发弹框显示及隐藏

  var btnPop = document.querySelector('.btn-pop');
  var boxPop = document.querySelector('.pop');
  var layoutPop = document.querySelector('.pop-layout');
  var content = document.querySelector('.content');
  
  btnPop.onclick = function() { 
      boxPop.style.display = 'block';
  }
  layoutPop.onclick = function() {
      boxPop.style.display = 'none';
  }

```

主要使用了CSS 里的定位属性 fixed;

固定定位可以将内容与弹框都定位在文档之上。
这个属性使元素脱离文档流，就算窗口是滚动的他也不受影响

优点
只通过布局及样式处理，不需要脚本

缺点 
滚动不够顺滑
无法窗口滚动数据，只能去取元素的滚动数据


扫码看demo2

<img src="https://image.office.bzdev.net/sys/2019/04/12/1a9d9e6b118ce631828eae3368491999359002.jpg">


```css
html,body {
    padding: 0;
    margin: 0;    
}
body {
    position: relative;
    width: 100%;
}
.noscroll body {
    position: fixed;
}
.pop {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
}
.pop-layout {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
}
.pop-main {
    position: fixed;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    border-radius: 5px;
    background: #fff;
    padding:10px;
    width: 200px;
    height: 200px;
    overflow: auto;
    -webkit-overflow-scrolling : touch;
}
.btn-pop {
    position: fixed;
    right: 5px;
    top: 5px;
    display: inline-block;
    border-radius: 8px;
    background-color: coral;
    color: #fff;
    padding: 8px;
}
```

```js
  var scrollTop = 0;  // 记录滚动条位置，等弹框隐藏时还原
  var html = document.getElementsByTagName('html')[0];
  var body = document.getElementsByTagName('body')[0];
  var btnPop = document.querySelector('.btn-pop');
  var boxPop = document.querySelector('.pop');
  var layoutPop = document.querySelector('.pop-layout');

  // 打开弹框
  btnPop.onclick = function() { 
    scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop; // 记录滚动数据
    boxPop.style.display = 'block';
    html.className = 'noscroll';
    body.style.top = parseInt('-' + scrollTop) + 'px';
  }

  // 关闭弹框
  layoutPop.onclick = function() {
    boxPop.style.display = 'none';
    document.body.scrollTop = scrollTop; // 还原滚动数据
    html.className = ' ';
    body.style.top = 0;
  }

  // 阻止浏览器默认行为发生
  layoutPop.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, false);

  // 获取滚动数据
  window.onscroll = function() {
    document.getElementById('text').innerHTML = document.documentElement.scrollTop || document.body.scrollTop;
  }

```
上面dome中增加了脚本，阻止底层滚动的的关键是 preventDefault

优点
解决上一个demo的缺点

缺点
需要脚本支持



---
相关链接：
[Js事件分发与DOM事件流] https://www.jianshu.com/p/dc1520327022
