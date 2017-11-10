---
title: 如何写一个简单的 nodejs 爬虫
date: 2017-11-08
tags: 
  - javascript
---
  
这篇文章主要是通过写一个爬取豆瓣电影 Top250 数据的爬虫。  
讲解一下写 nodejs 爬虫的基本思路。

## 先初始化一个项目

新建一个项目文件夹，执行 `npm init` 生成 package.json，然后进入项目目录。  
接下来可以开始进行模块安装。

## 安装依赖模块

这里我们需要用到两个模块，分别是：

- [request](https://github.com/request/request) - 负责数据的下载
- [cheerio](https://github.com/cheeriojs/cheerio) - 负责数据的解析

执行以下命令安装：

```bash
# npm 5 以上版本 --save 是默认行为，如果你的 npm 版本是 5.0 以上，可以省略 --save 参数
npm install request cheerio --save
```

## 实现步骤

### 1. 分析页面数据和结构

首先，假设我们这里需要拿到电影的名字、年份、排名、评分、制片地区、电影封面。

先用浏览器打开[豆瓣电影Top250](https://movie.douban.com/top250)。  
然后通过查看 HTML 源代码，电影数据放在 `class="grid_view"` 的 ol 列表里面。  
列表内每个 `class="item"` 的 div 为一部电影的数据。  
如图：  
![例子](//ww4.sinaimg.cn/large/a15b4afegy1flbythsps0j20oo0fpq4a)

分析可得，  
电影封面为 `class="pic"` 的 div 内的唯一一个 img 标签；  
排名为 `class="pic"` 的 div 内的 em 标签；  
评分为 `class="rating_num"` 的 span 标签；
名字为 `class="title"` 的 span 标签内容（有两个，别名不计）；  
年份和制片地区为 `class="bd"` 的第一个 p 标签内，br 标签后面那部分。

因为我们要爬取多个页面，所以要看下页面链接的规则。  
首页的链接是 https://movie.douban.com/top250  
第二个页面的链接是 https://movie.douban.com/top250?start=25&filter=  
结合页面和链接，我们可以发现这里的 `start` 是表示从第几部电影开始显示，而每页显示的电影数量是 25 部。  
`filter` 参数我们这里用不到，所以忽略掉。

### 2. 引入依赖

创建一个文件，这里文件名假设为 `fetchData.js`

```javascript
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs'); // node.js 自带模块，用于读写操作
```

### 3. 请求数据

```javascript
const fileName = 'data.txt';
const homeUrl = 'https://movie.douban.com/top250';

const getData = () => {
  const dataUrl = homeUrl;
  request.get(dataUrl, (err, rep, body) => {
    if (!err) {
      const dataFile = fs.createWriteStream(fileName); // 创建文件写入流
      dataFile.write(body); // 将获取到的数据写入文件
      dataFile.end(); // 关闭数据流
      console.log('done');
    } else {
      console.log('error', err);
    }
  });
};
// 执行函数
getData();
```

写到这里，可以执行一下 `node getData.js`，看是否能正常获取到页面数据。正常的话，再继续往下看。

### 4. 解析数据并格式化

```javascript
// 去除前后空格和换行
const trim = (str) => {
  if (typeof str === 'string') {
    return str.replace(/[\r\n]/g, '').replace(/^\s*|\s*$/g, '');
  }
  return '';
};

// 解析并格式化数据
const formatData = (html) => {
  const $ = cheerio.load(html);
  const $item = $('.grid_view .item');
  const allData = [];

  $item.each((index, element) => {
    const $thisItem = $(element);
    const rank = $thisItem.find('.pic em').text(); // 排名
    const ratingNum = $thisItem.find('.rating_num').text(); // 评分
    const picUrl = $thisItem.find('.pic img').attr('src'); // 封面
    const titleArray = $thisItem.find('.info .hd .title'); 
    const title = titleArray.eq(0).text() + titleArray.eq(1).text(); // 标题
    const info = $thisItem.find('.info .bd p').eq(0).text().split('\n')[2];
    const infoArray = info.split('/');
    const releaseDate = infoArray[0]; // 上映日期
    const country = infoArray[1]; // 国家或地区
    const data = {
      rank: trim(rank),
      ratingNum: trim(ratingNum),
      name: trim(title),
      pic: trim(picUrl),
      releaseDate: trim(releaseDate),
      country: trim(country),
    };
    allData.push(data);
  });

  const dataFile = fs.createWriteStream(fileName);
  dataFile.write(JSON.stringify(allData));
  dataFile.end();
  console.log('done');
};
```

这部分写好之后，把上一步 `request.get` 里面的代码修改如下：

```javascript
request.get(dataUrl, (err, rep, body) => {
  if (!err) {
    formatData(body);
  } else {
    console.log('error', err);
  }
});
```

保存之后执行 `node fetchData.js`。  
在控制台显示 `done` 之后，打开 `data.txt`，应该就可以看到对应的数据了。  
接下来，我们写分页抓取的逻辑。

## 5. 抓取多个页面

这里需要修改 `getData` 函数部分的代码，并新增一些代码。
```javascript
// homeUrl 后面加上这些
const pageSize = 25; // 每 25 部电影一页
const pageCount = 5; // 需要抓取的页面数量
const intervalTime = 1000; // 间隔时间，毫秒
let startNumber = 0; // 从排名第几部开始显示
let timeoutId = 0;

const getData = () => {
  const dataUrl = homeUrl + '?start=' + startNumber; // 这里加上查询参数
  // ...其他的不需要修改
};

const saveData = (fileName, data) => {
  fs.appendFile(fileName, data, (err) => {
    if (!err) {
      console.log(`已爬取完第${(startNumber / pageSize) + 1}页数据`);
      timeoutId = setTimeout(() => {
        if (startNumber < (pageCount - 1) * pageSize) {
          startNumber += pageSize;
          getData();
        } else {
          clearTimeout(timeoutId);
          console.log(`已爬取完所有数据，总共${pageCount}页，${pageCount * pageSize}条`);
        }
      }, intervalTime);
    } else {
      console.log('error:', err);
    }
  });
};

const formatData = (html) => {
  // ...这里省略上面部分
  // 下面这四行删除掉
  // const dataFile = fs.createWriteStream(fileName);
  // dataFile.write(JSON.stringify(allData));
  // dataFile.end();
  // console.log('done');

  saveData(fileName, JSON.stringify(allData) + '\n');
};
```

最后可以拿到 5 组数据，如下：  
![数据](//ww4.sinaimg.cn/large/a15b4afegy1flbytwmmr5j20jq02ewem)