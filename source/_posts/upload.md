---
title: 移动端图片压缩上传
date: 2017-10-20 12:53:01
tags:
 - javascript
 - review
---

在移动端压缩图片并且上传主要用到filereader、canvas 以及 formdata 这三个h5的api。逻辑并不难。整个过程就是：

-   用户使用input file上传图片的时候，用filereader读取用户上传的图片数据（base64格式）

-   把图片数据传入img对象，然后将img绘制到canvas上，再调用canvas.toDataURL对图片进行压缩\`

-   获取到压缩后的base64格式图片数据，转成二进制塞入formdata，再通过XmlHttpRequest提交formdata。

<!-- more -->

### 基础知识

#### FormData

`通过FormData对象可以组装一组用 XMLHttpRequest发送请求的键/值对。它可以更灵活方便的发送表单数据，因为可以独立于表单使用。如果你把表单的编码类型设置为multipart/form-data ，则通过FormData传输的数据格式和表单通过submit() 方法传输的数据格式相同。`

#### base64

`Base64是一种基于64个可打印字符来表示二进制数据的表示方法。 由于2的6次方等于64，所以每6个位元为一个单元，对应某个可打印字符。 三个字节有24个位元，对应于4个Base64单元，即3个字节可表示4个可打印字符。`

#### FileReader对象

FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。
FileReader也就是将本地文件转换成base64格式的dataUrl。

### 获取图片数据

先是获取图片数据，也就是监听input file的change事件，然后获取到上传的文件对象files，
如果是图片就实例化一个filereader，以base64格式读取上传的文件数据，判断数据长度，调用compress方法进行压缩进行上传。

### 压缩图片

上面做完图片数据的获取后，就可以做compress压缩图片的方法了。而压缩图片也并不是直接把图片绘制到canvas再调用一下toDataURL就行的。
在IOS中，canvas绘制图片是有两个限制的：
首先是图片的大小，如果图片的大小超过两百万像素，图片也是无法绘制到canvas上的，调用drawImage的时候不会报错，但是你用toDataURL获取图片数据的时候获取到的是空的图片数据。
再者就是canvas的大小有限制，如果canvas的大小大于大概五百万像素（即宽高乘积）的时候，不仅图片画不出来，其他什么东西也都是画不出来的。
应对第一种限制，处理办法就是瓦片绘制了。瓦片绘制，也就是将图片分割成多块绘制到canvas上，我代码里的做法是把图片分割成100万像素一块的大小，再绘制到canvas上。
而应对第二种限制，设的上限是四百万像素，如果图片大于四百万像素就压缩到小于四百万像素。四百万像素的图片应该够了，算起来宽高都有2000X2000了。
如此一来就解决了IOS上的两种限制了。
除了上面所述的限制，还有两个坑，一个就是canvas的toDataURL是只能压缩jpg的，当用户上传的图片是png的话，就需要转成jpg，也就是统一用canvas.toDataURL('image/jpeg', 0.1) ， 类型统一设成jpeg，而压缩比就自己控制了。
另一个就是如果是png转jpg，绘制到canvas上的时候，canvas存在透明区域的话，当转成jpg的时候透明区域会变成黑色，因为canvas的透明像素默认为rgba(0,0,0,0)，所以转成jpg就变成rgba(0,0,0,1)了，也就是透明背景会变成了黑色。解决办法就是绘制之前在canvas上铺一层白色的底色。

```javascript
uploader.prototype.compress = function(file){
  var _this = this;
  var reader = new FileReader();
  var t;
  _this.beforeCompress();
  if(!!_this.compressProgress){
      var i = 15;
      _this.compressProgress(i);
      t = setInterval(function(){
          if(i<95){
              var num = parseInt(Math.random()*8+1);
              i += num*num;
              _this.compressProgress(i);
          } else {
              window.clearInterval(t)
          }
      },50)
  }
  reader.readAsDataURL(file);
  reader.onload = function(){
    var result = this.result;
    var img = new Image();
    var canvas = document.createElement("canvas");
    var tCanvas = document.createElement("canvas");
    img.src = result;
    img.addEventListener("load",function(){
        var initSize = img.src.length //测试输出原尺寸
        var width = img.width;
        var height = img.height;
        //图片压缩到四百万像素以下，canvas限制五百万像素以下
        var ratio = width*height/4000000;
        if(ratio > 1){
            ratio = Math.sqrt(ratio);
            width /=ratio;
            height /=ratio;
        } else {
            ratio = 1;
        }
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext('2d');
        //格式需要转jpg，铺一层底色避免png的透明区域变黑
        ctx.fillStyle = "#fff";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        //如果图片像素大于100w则分割绘制
        var count = width * height/1000000;
        if(count>1){
            count = ~~(Math.sqrt(count)+1) //计算分割成多少块
            //计算每一块宽高
            var nw = ~~(width/count);
            var nh = ~~(height/count);
            var tctx = tCanvas.getContext('2d');
            tCanvas.width = nw;
            tCanvas.height = nh;

            for(var i = 0;i < count; i++){
                for(var j = 0;j<count;j++){
                    tctx.drawImage(img,i*nw*ratio,j*nh*ratio,nw*ratio,nh*ratio,0,0,nw,nh);
                    ctx.drawImage(tCanvas,i*nw,j*nh,nw,nh);
                }
            }
        } else {
            ctx.drawImage(img,0,0,width,height);
        }
        //进行压缩
        var ndata = canvas.toDataURL('image/jpeg',_this.compressRatio);
```
###  图片上传
使用ajax中的xhr监听上传进度
```javascript
$.ajax({
  url: _this.api,
  type: 'POST',
  data: {
    file: ndata.replace("data:image/jpeg;base64,","").replace("data:image/png;base64,",""),
    content_type: "image/jpeg",
    class:'user'
  },
  xhrFields: {
    withCredetials: true
  },
  xhr: function(){
    var xhr = $.ajaxSettings.xhr();
    if(!!_this.progress){
      if (xhr.upload) {
        if(ua.match(/Android 4.2.1/)){
            _this.progress('上传中..');
        }
        xhr.upload.addEventListener('progress', function(event) {
            var percent = 0;
            var position = event.loaded || event.position;
            var total = event.total;
            if (event.lengthComputable) {
                percent = Math.ceil(position / total * 100);
                _this.progress(percent);
            }
        }, false);
      }
    }
    return xhr;
  },
  // processData: false, // 告诉jQuery不要去处理发送的数据
  // contentType: false, // 告诉jQuery不要去设置Content-Type请求头
  success: function(data) {
  },
  error:function(data){
  }
});
```
### 相关链接

[移动端图片上传的实践](https://qiutc.me/post/uploading-image-file-in-mobile-fe.html)
[移动端H5实现图片上传](https://segmentfault.com/a/1190000010034177)
