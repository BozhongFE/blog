---
title: CSS Background 属性解析
date: 2017-08-16 16:35:01
tags:
 - css
---

### background 全家桶简写形式
 `background: [background-color] [background-image] [background-attachment] [background-repeat]  [background-position] /[ background-size] [background-origin] [background-clip]`

### CSS1常见属性

* background-color 定义背景颜色
    支持 英文颜色名词| rgb() | 十六进制颜色值 | transparent

* background-image 定义背景图
  `none` | `url`

* background-position 定义背景图位置
  支持 英文方位名词 | 长度值 | 百分比

* background-repeat  定义背景图重复
  `no-repaet` | `repeat` | `repeat-x` | `repeat-y`

* background-attachment  定义背景图像是否固定或者随着页面的其余部分滚动
  `inherit` | `scroll` | `fixed`

## CSS3 background 新增属性

* background-size 定义背景图片的尺寸
  `contain` | `cover` | 长度值 ｜ 百分比

* background-origin 定义背景图片的定位区域
  `border-box` | `padding-box` | `content-box`

* background-clip 定义背景的绘制区域
  `border-box` | `padding-box` | `content-box` | `text`

* background-blend-mode 定义背景图的混合模式
  `normal`;           //正常
  `multiply`;        //正片叠底
  `screen`;          //滤色
  `overlay`;         //叠加
  `darken`;          //变暗
  `lighten`;         //变亮
  `color-dodge`;     //颜色减淡
  `color-burn`;      //颜色加深
  `hard-light`;      //强光
  `soft-light`;      //柔光
  `difference`;      //差值
  `exclusion`;       //排除
  `hue`;             //色相
  `saturation`;      //饱和度
  `color`;           //颜色
  `luminosity`;      //亮度

### 在css3中的对background 进行增强的属性
  * background-color 
    `currentColor` 当前的标签所继承的文字颜色

  * background-image 支持多背景用英文逗号隔开，增加渐变色属性
    `linear-gradient` 使用线性渐变创建背景图像
    `radial-gradient` 使用重复的线性渐变创建背景图像
    `repeating-linear-gradient` 使用重复的线性渐变创建背景图像
    `repeating-radial-gradient` 使用重复的径向(放射性)渐变创建背景图像

  * background-repeat
    `space` 图片以相同的间距平铺且填充整个标签元素 (相当于两端对齐而且background-position 属性会被忽略)
    `round` 图片自动缩放直到适应且填充整个标签元素

  * background-attachmen
    `local` 背景相对于元素的内容固定 

**********************************************************
**** END ****


**********************************************************


### 示例演示

[background](/demo/css-background.html)


### 关于兼容请看参考文档

[参考文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/background);
[currentColor 实例](http://www.zhangxinxu.com/study/201410/css3-icons-currentcolor.html);









