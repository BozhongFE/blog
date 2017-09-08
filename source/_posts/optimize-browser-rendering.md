---
title: 浏览器渲染及相应优化
date: 2017-09-08 12:43:29
tags:
 - optimize
---
为了保证页面的渲染效果，简单了解下浏览器是如何处理HTML/JavaScript/CSS的。
<!--more-->

---

### 页面渲染过程（以Chrome为例）

  一个页面更新时，渲染过程大致如下：

  ![browser-render](/img/browser-render/Image1.png)

* `JavaScript` 为了实现动画效果，用js对DOM元素操作等。
* `Style` 计算样式，如果元素的样式有改变，在这一步重新计算样式，并匹配到对应的DOM上。
* `Layout` 根据上一步的DOM样式规则，重新进行布局（重排）。
* `Paint` 在多个渲染层上，对新的布局重新绘制（重绘）。
* `Composite` 将绘制好的多个渲染层合并，显示到屏幕上。

  网页生成时，至少会 `渲染 （Layout+Paint）`一次。用户访问过程中，会不断地`重排（reflow）`和`重绘（repaint）`，页面重绘的速度要比页面重排的速度快。

* `重排（reflow）` 因为元素的规模尺寸，布局，隐藏等改变而需要浏览器重新计算页面元素位置和几何结构（geometries）的进程。
* `重绘（repaint）` 一些元素需要更新属性，这些属性只是影响元素的外观，风格，而不会影响布局的，比如 background-color。

  实际场景下，大概会有三种常见的渲染流程（也即是Layout和Paint步骤是可避免的）：

  ![browser-render](/img/browser-render/Image2.png)

### 核心问题

* 大多数设备的刷新频率是`60次/秒`，也就说是浏览器对每一帧画面的渲染工作要在`16ms内`完成，超出这个时间，页面的渲染就会出现卡顿现象，影响用户体验。

* 浏览器不会在js执行的时候更新DOM，而是会把这些DOM操作存放在一个队列中，在js执行完之后按顺序一次性执行完毕，因此在js执行过程中用户一直在被阻塞。若js中存在很多DOM操作，就会不断地重绘或重排，影响页面性能。



### DOM操作对页面性能的影响

  `重排（Reflow）`的性能消耗比`重绘（Repaint）`的高很多。一个节点的重排很有可能导致子节点，甚至父节点以及同级节点的重排。在一些高性能的电脑上也许还没什么，但是如果reflow发生在一些手机上，那么这个过程是非常痛苦和耗电的。

**触发重排的原因简单有以下几个：**

* DOM元素的几何属性变化,以及dom的显示和隐藏(单指display,不包括visibility)
* DOM树的结构变化
* **获取某些属性或调用某些方法**
* window的resize或者scroll
* font-size的改变

  浏览器在底层会进行一些优化，具体是指它会将多个DOM操作合并在一起，批量更新，但是第三点提到的操作则会中断该过程，造成额外的重排，以下方法属性会间接引起重排:

* `clientHeight` `clientLeft` `clientTop` `clientWidth` `focus()` `getBoundingClientRect()` `getClientRects()` `innerText` `offsetHeight` `offsetLeft` `offsetParent` `offsetTop` `offsetWidth` `outerText, scrollByLines()` `scrollByPages()` `scrollHeight` `scrollIntoView()` `scrollIntoViewIfNeeded()` `scrollLeft` `scrollTop` `scrollWidth`
* `height` `width`
* `getBoundingClientRect()` `getClientRects()`
* `computeCTM()` `getBBox()`
* `getCharNumAtPosition()` `getComputedTextLength()` `getEndPositionOfChar()` `getExtentOfChar()` `getNumberOfChars()` `getRotationOfChar()` `getStartPositionOfChar()` `getSubStringLength()` `selectSubString()`
* `instanceRoot`
* `getComputedStyle()` `scrollBy()` `scrollTo()` `scrollX` `scrollY`
`webkitConvertPointFromNodeToPage()` `webkitConvertPointFromPageToNode()`



**触发重绘的原因：**
* 只改变了元素的样式，并未改变元素大小、位置。
* 一个元素的重排一定会影响到渲染树的变化，因此也一定会涉及到页面的重绘。

  重绘和重排也有类似规律，触发它不会触发重排，但还是会触发渲染层的合并，性能开销同样不低。若页面动效不可避免的话，依靠重排来实现也是一个较好的方法


### 优化（针对浏览器渲染）

* **优化JavaScript的执行效率**

* **降低样式计算的范围和复杂度**
  * 减少需要执行样式计算的元素个数
  * 保持class的简短

  ```css
  .box:nth-last-child(-n+1) .title {
  }

  //改善后
  .final-box-title {
  }
  ```

  CSS选择器效率从高到低的排序：
  * id选择器 `#myid`
  * 类选择器 `.myclassname`
  * 标签选择器 `div,h1,p`
  * 相邻选择器 `h1+p`
  * 子选择器 `ul < li`
  * 后代选择器 `li a`
  * 通配符选择器 `*`
  * 属性选择器 `a[rel="external"]`
  * 伪类选择器 `a:hover,li:nth-child`


* **避免大规模、复杂的布局**
 * 尽量控制DOM的显示或隐藏，而不是删除或添加。
 * 尽量使用flexbox，flexbox布局性能消耗会少于旧的布局模型（相对/绝对/浮动）。
 * 避免让浏览器陷入'读写读写'循环，在循环外部做变量储存，一次性操作DOM。
 * 使用class设计样式，不要使用style，每一次赋值都会重新渲染页面。


* **简化绘制的复杂度、减少绘制区域**


* **优先使用渲染层合并属性、控制层数量**
  使用transform/opacity实现动画效果，会跳过渲染流程的布局和绘制环节，只做渲染层的合并。


* **对用户输入事件/滚动事件等处理函数去抖动（移动设备）**
  使用由浏览器专门为动画提供的API - requestAnimationFrame()

### 参考文档

[【渲染原理】浏览器渲染原理的个人整理](http://www.cnblogs.com/mfoonirlee/p/6903876.html "【渲染原理】浏览器渲染原理的个人整理")
[深度剖析浏览器渲染性能原理，你到底知道多少？](http://www.jianshu.com/p/a32b890c29b1 "深度剖析浏览器渲染性能原理，你到底知道多少？")
[高频 dom 操作和页面性能优化探索](http://web.jobbole.com/92320/ "高频 dom 操作和页面性能优化探索")


