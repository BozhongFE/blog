---
title: 网页性能监控
date: 2018-03-09
tags:
 - javascript
---

性能差的网页，响应缓慢，占用大量的CPU和内存，浏览页面卡顿，会给用户带来不愉快的用户体验,严重一点可能会直接流失该用户，所以即使是内容再丰富的网站，如果慢到无法访问也将毫无意义的。

了解一个用户从打开页面到绘制及加载完成时到底花了多少时间,可用于参考来帮助我们有效提升网站性能

<!-- more -->

  通常我们测量页面加载时间或是某一脚本程序执行所消耗的时间会用以下方法

  1. 测量页面加载时间，我们会用new Date()时间的API去实现
 
  ```HTML
    <body onload="onLoad()"></body>
  ```

  ```js
    var start = new Date().getTime(); //获取开始加载时间
    function onLoad() {
        var now = new Date().getTime(); //获取加载结束时间
        var latency = now - start;  //页面加载时间
        alert("page loading time: " + latency);
    }
  ```

  但这种方法并不能精确的获取到时间，且只能获取代码运行过程中的时间进度

  2. 测量某一脚本程序执行所消耗的时间，最常用的方法是用console.time和console.timeEnd

    ```js
      console.time();

      for(var i = 0 ;i <10000; i++){
        //do something
      }

      console.timeEnd();
    ```
   而这种方法只能在控制台输出计时时间，即不能返回输出内容，也不能赋给变量保存。

   最主要的是以上2种方式都无法知道一些后台事件的时间进度


  
  ### Performance

  用于精确度量、控制、增强浏览器的性能表现，可以获取到当前页面与性能相关的信息。

  在Javascript 或浏览器调试后台运行 window.performance，会返回一个类型为 Performance 的对象，以及该对象所暴露的一些对象和方法


  ## 对象属性

  ### performance.timing 

  返回对象，包含了各种与浏览器性能有关的时间数据，提供浏览器处理网页各个阶段的耗时
  <center>可视化 PerformanceTiming 属性的顺序</center> 
  <img src="/img/performance/PerformanceTiming.png" alt="PerformanceTiming" />

  根据Performance API timing属性所提供的信息里,想要获取网页加载所耗的时间可以通过 loadEventStart及 navigationStart来完成

    ```js
      var t = performance.timing; 
      var pageloadtime = t.loadEventStart - t.navigationStart; //加载的耗时
      var dns = t.domainLookupEnd - t.domainLookupStart; //域名解析的耗时
      var tcp = t.connectEnd - t.connectStart; //TCP连接的耗时
      var ttfb = t.responseStart - t.navigationStart; //读取页面第一个字节之前的耗时
    ```
  ### performance.navigation

  网页导航，是指当前页面是通什么方式导航过来

<strong>type :</strong> 该属性返回一个整数值，表示网页的加载来源，可能有以下4种情况：

  + 0：网页通过点击链接、地址栏输入、表单提交、脚本操作等方式加载，相当于常数performance.navigation.TYPE_NAVIGATENEXT。

  + 1：网页通过“重新加载”按钮或者location.reload()方法加载，相当于常数performance.navigation.TYPE_RELOAD。

  + 2：网页通过“前进”或“后退”按钮加载，相当于常数performance.navigation.TYPE_BACK_FORWARD。

  + 255：任何其他来源的加载，相当于常数performance.navigation.TYPE_UNDEFINED。

<strong>redirectCount :</strong> 该属性表示当前网页经过了多少次重定向跳转。

  ### performance.memory
  仅chrome浏览器非标准
  usedJSHeapSize : JS 对象（包括V8引擎内部对象）占用的内存
  totalJSHeapSize : 可使用的内存
  jsHeapSizeLimit :  内存大小限制

  ```HTML
    <div id="idname"></div>
  ```
  ```js
    function testObject(element) {   
      this.elementReference = element;  
      element.property = this; 
    }   
    new testObject(document.getElementById('idname'));
  ```
  
  <img src="/img/performance/memory.png" alt="memory" />
  <center>以上代码执行结果图示</center>

## 对象方法

### performance.getEntries()

以数组形式，返回资源请求的时间统计信息，有多少个请求，返回数组就会有多少个成员。

属性介绍

<img src="/img/performance/getEntriesIntor.png" alt="getEntriesIntor" />

示例：

<img src="/img/performance/getEntries.png" alt="getEntries" />
<center>以上数据截至播种网(https://www.bozhong.com/)</center>


 ### performance.mark()

 mark方法用于为相应的视点做标记, 标记各种时间戳（就像在地图上打点），保存为各种测量值（测量地图上的点之间的距离），便可以批量地分析这些数据了。

 对应清除标记的方法为 window.performance.clearMarks();

 ### performance.measure()
 measure 方法用于测量标记间隔数据

 对应清除标记的方法为 window.performance.clearMeasures();

 <strong>mark及measure使用例子</strong>

 例子:

  ```js
    function testMark (num) {
      var startName = 'marksStart' + num;
      var endName = 'marksEnd' + num;
      window.performance.mark(startName);
      for (var i = 0; i < num; i++) {
        // do nothing
      }
      window.performance.mark(endName);
      var name = 'measure' + num;
      window.performance.measure(name, startName, endName);
    }
  
    testMark(100000);
    testMark(600000);

    var marks = window.performance.getEntriesByType('mark');  
    var measure = window.performance.getEntriesByType('measure');  
    var marksStart100000 = window.performance.getEntriesByName('marksStart100000');

    console.log('marks',marks);
    console.log('measure',measure);
    console.log('marksStart100000',marksStart100000);

  ```
  <center>执行结果图示</center>
  <img src="/img/performance/marks_and_measure.png" alt="marks_and_measure">

 ### performance.now()

当前时间 （以微秒（百万分之一秒）为单位的时间）
与 Date.now()-performance.timing.navigationStart的区别是不受系统程序执行阻塞的影响，因此更加精准

## 参考资料及拓展阅读

  Performance API 相关属性及方法请查阅 https://developer.mozilla.org/zh-CN/docs/Web/API/Performance

