---
title: 一些关于 canvas 的东西
date: 2017-12-07
tag: 
- javascript
- canvas
---

因为最近在做的「萌贴纸」需求。需要用到一些 canvas 的 API 来实现相关的功能。  
所以看了不少关于 canvas 的文章。  
这里分享一下一些开发过程中比较常见的一些 API 和遇到的问题及其解决方法。

<!-- more -->

## 创建一个 canvas 对象

```javascript
  // 创建一个 canvas 标签
  var canvas = document.createElement('canvas');
  // 如果不设置宽高的话，默认为 300x150
  canvas.width = 1000;
  canvas.height = 600;
  // 添加到 body 中
  document.body.appendChild(canvas);
  // 获取 canvas 2d 的 context 对象
  var ctx = canvas.getContext('2d');
```

## 在 canvas 上绘制图像

绘制图像可以用 `drawImage()` 方法，具体用法可以看 [CanvasRenderingContext2D.drawImage()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage)。

```javascript
ctx.drawImage(image, dx, dy);
ctx.drawImage(image, dx, dy, dWidth, dHeight);
// 这里需要注意的是，9 个参数的时候，前两个是 sx sy，而不是 dx dy
ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

## canvas 坐标变换

### 平移 translate
```javascript
ctx.translate(x, y)
```
translate() 方法接受两个参数。x 是左右偏移量，y 是上下偏移量。

### 旋转 rotate
```javascript
ctx.rotate(angle)
```
rotate() 方法只接受一个参数。旋转的角度 angle，它是顺时针方向的，以弧度为单位的值。

### 缩放 scale
```javascript
ctx.scale(x, y)
```
scale() 方法接受两个参数。x 和 y 分别是横轴和纵轴的缩放因子。其缩放因子默认是 1，如果比 1 小是缩小，如果比 1 大则放大。  
如果 x 为 -1，则为水平翻转；如果 y 为 -1 则为垂直翻转。  
需要注意的是，这个翻转会连坐标系一起翻转。

如图：

![canvas scale()](https://ww4.sinaimg.cn/large/a15b4afegy1fm98692i3mj20qo0b43yr)

### 变换 transform
```javascript
ctx.transform(a, b, c, d, e, f)
```
transform() 方法是对当前坐标系进行矩阵变换。

```javascript
ctx.setTransform(a, b, c, d, e, f)
```
setTransform() 方法重置变形矩阵。先将当前的矩阵重置为单位矩阵（即默认的坐标系），再用相同的参数调用 transform() 方法设置矩阵。
具体看：[CanvasRenderingContext2D.setTransform()](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/setTransform)

## 绘制经过变换的图片而不影响绘制图片前的数据

这里需要了解两个方法：

```javascript
void CanvasRenderingContext2D.save() // 保存 canvas 状态
void CanvasRenderingContext2D.restore() // 恢复 canvas 状态
```

例子如下：

```javascript
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.save(); // 保存默认状态

ctx.fillStyle = 'green'; // 填充颜色设置为绿色
ctx.fillRect(10, 10, 100, 100); // 绘制一个 100x100 的矩形

ctx.restore(); // 恢复默认状态
ctx.fillRect(150, 75, 100, 100); // 此时绘制的矩形将会是默认的黑色
```

如图：  

![使用 Canvas Save()](https://ww4.sinaimg.cn/large/a15b4afegy1fm96n5qr79j20b405k0sj)

如果不使用 `save()` 和 `restore()`，则会是下面这个样子：

![不使用 Canvas Save()](https://ww4.sinaimg.cn/large/a15b4afegy1fm96obtxajj20b405kt8i)

## 图片跨域问题

跨域使用图片的时候，会导致 canvas 被「污染」，一旦被「污染」。  
就不能再读取 canvas 的数据。比如无法使用 `toBlob()`，`toDataURL()`，`getImageData()` 方法。  
调用这些方法会抛出错误。具体参考 MDN: [启用了 CORS 的图片](https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image)。

我们可以先将图片转成 base64，然后重新赋值到 image 中，再绘制到 canvas 中。就不会导致 canvas 被「污染」了。  
例子如下：

```javascript
function imageToBase64(url, callback) {
  var tempImage = new Image();
  tempImage.crossOrigin = 'anonymous';
  
  tempImage.onload = function () {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    
    canvas.width = this.width;
    canvas.height = this.height;
    context.drawImage(tempImage, 0, 0);
    var imageDataUrl = canvas.toDataURL('image/png', 1.0);
    callback(imageDataUrl);
  };

  // 这里加上时间戳是因为，移动端被缓存的图片无法重新除非 onload 事件。
  // 即使用下面那个方法，也无法触发，所以只能加上随机字符串，让浏览器识别为新的链接。
  tempImage.src = url + '?t=' + Date.now();
  
  // 确保已缓存的图片也能重新触发 onload 事件
  if (tempImage.complete || typeof tempImage.complete === 'undefined') {
    tempImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    tempImage.src = src;
  }
}
```

## 参考资料

1. [canvas 图像旋转与翻转姿势解锁](https://aotu.io/notes/2017/05/25/canvas-img-rotate-and-flip/index.html)
2. [启用了 CORS 的图片](https://developer.mozilla.org/zh-CN/docs/Web/HTML/CORS_enabled_image)
3. [浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)
