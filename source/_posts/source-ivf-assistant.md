---
title: review-试管助手
date: 2017-11-16 15:04:13
tags:
 - javascript
 - review
---
[试管助手](http://source.bozhong.com/shiguan/201505/index.html "试管助手")
<!--more-->

---
### 整体
* 空格缩进引号不统一等代码风格问题;
* 页面内大多数都是 `==`;
* 对DOM的操作多，选择器层级较多，包括css和js;

```js
  // 127 ~ 132行
  $('.result .tab .item,.profile .tab .item').css('width','33.33%');
  $('.profile .tab .item').eq(3).hide();
  $('.result .tab').each(function(){
    $(this).find('.item').eq(3).hide()//攻略服务器挂了故隐藏
    $(this).find('.item').eq(4).hide()
  })

  //1859 ~ 1871行
  if(stu ==true){
    $('.cost-list .plan li').eq(index).closest(".li-main").siblings("h2").find(".day-num").text(d);
    $('.process .plan .val,.cost-list .plan .val').text( plan[0].name+'(推荐)');
    if(t == plan[0].name){
      ...
    }
  }
```

### 细节

* ** 封面样式问题 **

  原：为让页面内容垂直居中用js获取浏览器高度后写入dom，导致进入页面时会闪一下

  ![assistant](/img/source-ivf-assistant/image.png)

  建议：
  1.隐藏页面，高度写入完后再显示
  2.这层只是封面，进入表单后会整个隐藏，可以直接用css定位/flex布局;

* ** openThread() **

  变量 `urlVal` 重复声明，逻辑里面有多余的消耗；

  ```js
  // 原 90 ~ 103行
  var openThread = function(tid,url){
    var tidThread = {
      type:'readThread',
      tid:tid
    }
    var urlVal = url;
    var threadTid =  JSON.stringify(tidThread);
    if( iosAPP_REG == true && crazyV>=420){
      var urlVal = 'fkzr://'+encodeURIComponent(threadTid);
    }else if( androidAPP_REG == true && crazyV>=420){
      var urlVal = 'fkzr://'+encodeURIComponent(threadTid);
    }
    return urlVal;
  };

  // 优化
  var openThread = function(tid, url) {
    if (!iosAPP_REG && !androidAPP_REG && crazyV < 420) return url;
    var tidThread = JSON.stringify({
      type: 'readThread',
      tid: tid
    });
    return 'fkzr://' + encodeURIComponent(threadTid);
  }
  ```

* ** 双重否定 **

  双重否定意义不大 一般情况下 `!!a === a`，如果有特殊情况加注释特殊处理比较好

  ```js
  // 原
  var ivfId = !!realIvf && !!realIvf.id? realIvf.id : 0;
  // 等同
  var ivfId = realIvf && realIvf.id? realIvf.id : 0;

  // 原 2171 ~ 2172 行
  var p = !!curPage ?  curPage : 1;
  var stor = !!stor ? stor : '';
  // 等同
  var p = curPage || 1;
  var stor = stor || '';
  ```

* ** 字符串拼接 **

  建议先组成数组，join()拼接成字符串，性能方面优于 `+=`
  不用对首位进行额外处理，更好理解

  ```js
  // 原 1820 ~ 1920 行
  var savePlan  ='';
  ...
  for( i  in plan){
    var planName = plan[i].name;
    savePlan+=','+planName;
  }
  ...
  localStorage.setItem('cupai_plan', savePlan.replace(',',''));

  // 优化
  var savePlan = [];
  for (i in plan) {
    var planName = plan[i].name;
    savePlan.push(planName);
  }
  savePlan = savePlan.join(',');
  localStorage.setItem('cupai_plan', savePlan);
  ```

* ** 表单字符串判断 **

  建议去除首尾空白字符，如使用$.trim()
  ↓↓↓ 当输入11位手机号时可以提交，空白字符同样满足，同理用于验证名字留言等

  ![assistant](/img/source-ivf-assistant/image2.png)

  ```js
  // 原 2147 ~ 2151行
  if (v.length == 11) {
    ...
  } else {
    ...
  }

  // 优化
  if ($.trim(v).length === 11) {
    ...
  } else {
    ...
  }
  ```

* ** 重复代码 **

  优化可读性，能提取出来的代码尽可能封装。

  ```js
  // 1687 ~ 1697 行
  var plan = localStorage.getItem('cupai_plan').split(',');
  var realPlan = localStorage.getItem('real_plan') ? localStorage.getItem('real_plan') :'';
  var successRate = localStorage.getItem('success_rate') ? localStorage.getItem('success_rate') : '';
  var predictCost = localStorage.getItem('predict_cost') ?  localStorage.getItem('predict_cost') : '';
  var scheduleDays =  localStorage.getItem('schedule_days') ? localStorage.getItem('schedule_days') : '';
  var oneRate = localStorage.getItem('one_success_rate') ? localStorage.getItem('one_success_rate') : '';
  var twoRate =localStorage.getItem('two_success_rate') ? localStorage.getItem('two_success_rate') : '';
  var threeRate = localStorage.getItem('three_success_rate') ? localStorage.getItem('three_success_rate') : '';
  var fivfTech = localStorage.getItem('fivf_Tech') ? localStorage.getItem('fivf_Tech') : '' ;
  var ivfTech =localStorage.getItem('ivf_tech') ? localStorage.getItem('ivf_tech') : '' ;

  // 优化：例如 1687 ~ 1697 行
  var keys = {
    plan: 'cupai_plan',
    realPlan: 'real_plan',
    successRate: 'success_rate',
    predictCost: 'predict_cost',
    scheduleDays: 'schedule_days',
    oneRate: 'one_success_rate',
    twoRate: 'two_success_rate',
    threeRate: 'three_success_rate',
    fivfTech: 'fivf_Tech',
    ivfTech: 'ivf_tech',
  }
  var data = {};
  for (key in keys) {
    if (key === 'plan') {
      data[key] = localStorage.getItem(keys[key]).split(',');
      continue;
    }
    data[key] = localStorage.getItem(keys[key]) || '';
  }
  ```

  结果一致的判断写在一起

  ```js
  // 2448 ~ 2468行
  if(hashName.replace("profile","") == ''){
    userStu = true
    /*if(!!localStorage.getItem('success_rate')){
      window.location.href = '//'+host+'/shiguan/201505/index.html#profile11';
    }*/
  }else if(hashName.replace("profile","")<=9 && hashName.replace("profile","")>0 ){
    window.location.hash = !!localStorage.getItem('success_rate') ? '#profile11' : '#cover';
  }else if(hashName.replace("profile","") ==11){
    if( localStorage.getItem('success_rate') == null){
      window.location.href = '//'+host+'/shiguan/201505/index.html'+UrlFrom + UrlPhone;
    }
  }else if(hashName.replace("profile","") ==12){
    if(!isLogin){
      window.location.href = '//'+host+'/shiguan/201505/index.html'+UrlFrom + UrlPhone;
    }
  }else if(hashName.replace("profile","") ==10){
    if(!isLogin){
      window.location.href = '//'+host+'/shiguan/201505/index.html'+UrlFrom + UrlPhone;
    }else{
      window.location.href = '//'+host+'/shiguan/201505/index.html'+UrlFrom + UrlPhone+'#profile11';
    }
  }

  // 优化
  var num = hashName.replace('profile', '');
  var url = '//' + host + '/shiguan/201505/index.html' + UrlFrom + UrlPhone;
  if (!num) {
    userStu = true;
  } else if (num <= 9 && num > 0) {
    window.location.hash = localStorage.getItem('success_rate') ? '#profile11' : '#cover';
  } else if ((/^(12|10)$/.test(num) && !isLogin) || (num === 11 && !localStorage.getItem('success_rate'))) {
    window.location.href = url;
  } else if (num === 10) {
    window.location.href =  url + '#profile11';
  }
  ```