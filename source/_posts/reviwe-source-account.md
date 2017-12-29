---
title: review account  
date: 2017-12-29
tags:
 - javascript
 - review
---

 内含主要实现功能，静态资源目录，技术及建议与优化
<!--more-->

  ## 主要实现功能

  [登录](https://account.bozhong.com/ "登录")
  [注册](https://account.bozhong.com/register/index "注册")
  [重置密码](https://account.bozhong.bzdev.net/auth/resetpwd?redirect_uri=)
  [找回密码](https://account.bozhong.com/register/findpwd)

  ## 静态资源目录(source.seedit.com)

  account
    |- css
    |- img
    |- js

  
  ## 技术

  |- 后端实现PHP
  |- 前端页面自适应使用@media
  |- jQuery 框架
  |- seajs


  ## 建议与优化

  1.页面采用@media方式实现网页自适应，而2个终端代码差异较大，导致1个页面上承载着2个终端的代码，建议使用模板形式，如 handlebarser 模板引擎
  ```html
  <!--index.phtml 22行~105行-->
  <div class="register" id="register">
    ...
  </div>

  <div class="register-mobile common-slider page" id="register-mobile">
    ...
  </div>
  ```
  2.移动端修改密码页面空白内容多,响应式样式没有处理好，适用PC端的样式在移动端并没有重定义

  找回/修改密码页
  <img src="/img/reviwe-source-account/IMG_9790.PNG" alt="account" />
  
  3.页面使用静态内联样式，这种样式不利于后期维护，所以要尽量避免

```html
    <!--application\views\register\findpwd.phtml 29行-->
    <label class="type pwd_find" for="pwd_find" style="min-width: 90px;display: inline-block;">用户名&nbsp;&#47;&nbsp;邮箱</label>
 ```

  4.无效的样式，例如定义了无效的属性，页面二次开发或改版，旧类名不用的没有及时删除，导致样式表代码冗杂，可利用第三方工具或模块进行检测剔除

 
 ```CSS
 /*account_v3.css 600 ~ 602行*/
  #refresh_loginCaptcha{
    margin-left: 18px;
    padding-bottom: -10px;
    display: inline-block;
    cursor: pointer;
    vertical-align: super;
  }
 ```

 5.account_v4.js/account_v3.js/account_pwd.js 文件 dom元素操作频繁，可以用变量存储

 6.account_v4.js 文件 75~101行 代码优化

 ```js
 if (data.error_code === 0) {
    var time = 60;
    sent = true;
    alert('验证码已发送，请查收~');
    if (isMobile) {
      $('#JS_send_captcha').attr('disabled', 'disabled').html('重新发送(<span id="JS_resend_m">60</span>)');
      var interval = setInterval(function () {
        if (time > 0) {
          time--
          $('#JS_resend_m').text(time);
        } else {
          clearInterval(interval);
          $('#JS_send_captcha').removeAttr('disabled').text('获取验证码');
          sent = false;
        }
      }, 1000);
    } else {
      $('#JS_btn_captcha').attr('disabled', 'disabled').html('重新发送(<span id="JS_resend">60</span>)');
      captchaObj.disable();
      var interval = setInterval(function () {
        if (time > 0) {
          time--
          $('#JS_resend').text(time);
        } else {
          clearInterval(interval);
          $('#JS_btn_captcha').removeAttr('disabled').text('获取验证码');
          captchaObj.enable();
          sent = false;
        }
      }, 1000);
    }
  } else {
    alert(data.error_message);
  }

  ```
 优化:

  ```js
    if (data.error_code === 0) {
      var time = 60;
      var $captcha = isMobile ? $('#JS_send_captcha') : $('#JS_btn_captcha');
      var resend = isMobile ? 'JS_resend_m' : 'JS_resend';

      sent = true;
      alert('验证码已发送，请查收~');

      if (!isMobile) captchaObj.disable();
      $captcha.attr('disabled', 'disabled').html('重新发送(<span id="'+resend+'">60</span>)');

      var interval = setInterval(function () {
        if (time > 0) {
            time--
            $('#'+ resend).text(time);
          } else {
            clearInterval(interval);
            $captcha.removeAttr('disabled').text('获取验证码');
            if (!isMobile) captchaObj.enable();
            sent = false;
          }
      }, 1000);
    } else {
      alert(data.error_message);
    }
  ```
  7.account_resetpwd.js 文件 307~327行 代码优化

  ```js
    var reUrl = new Url(window.location.href); 
    if (/Mobile/.test(navigator.userAgent)) {
        if(reUrl.getParam('redirect_uri')) {
            window.location.href=reUrl.getParam('redirect_uri');
        } else if(/office/.test(reUrl)) {
            window.location.href = 'http://m.office.bzdev.net';
        } else if(/online/.test(reUrl)) {
            window.location.href = 'http://m.online.seedit.cc';
        } else {
            window.location.href = 'http://m.bozhong.com';
        }
    }else{
        if(reUrl.getParam('redirect_uri')) {
            window.location.href=reUrl.getParam('redirect_uri');
        } else if(/office/.test(reUrl)) {
            window.location.href = 'http://www.office.bzdev.net';
        } else if(/online/.test(reUrl)) {
            window.location.href = 'http://www.online.seedit.cc';
        } else {
            window.location.href = 'http://www.bozhong.com';
        }
    }
  ```
  优化:

  ```js
  var reUrl = new Url(window.location.href);
  var i;
  var firstHost = /Mobile/.test(navigator.userAgent) ? 'm.' : 'www.';
  var hostname = {
    office : 'office.bzdev.net',
    online : 'online.seedit.cc',
    bozhong : 'bozhong.com'
  }
  if (reUrl.getParam('redirect_uri')) return window.location.href=reUrl.getParam('redirect_uri');
  for(i in hostname){
    if (location.href.match(hostname[i]))  window.location.href= 'https://'+ firstHost + hostname[i];
  }
  ```


工具

http://jigsaw.w3.org/css-validator/ 
https://github.com/switer/DoverJS


