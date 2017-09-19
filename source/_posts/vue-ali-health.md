---
title: 健康项目review
date: 2017-09-10
tags:
 - vue
 - javascript
 - review
---

## 两个主题

阿里健康项目的__`《review过程》`__，及遇到的__`《坑》`__
<!--more-->


## review过程

> 一看__`根目录结构`__
> 二看__`README.md、package.json`__,
> 三看__`代码架构`__（即源码子目录及代码思维）


### 根目录结构

```directory
﹀ project
  ﹥ build
  ﹥ dist
  ﹥ src
     ------------
     package.json
     README.md
-----------------
     HISTORY.md
```
+ （目录）build 构建脚本文件(webpack，build)
+ （目录）dist 发布文件
+ （目录）src 开发文件（即项目源文件）
+ （文件）package.json 配置文件
+ （文件）README.md 项目信息（介绍说明、使用方式等）

### README.md

一个项目的介绍说明，使用方式等（开源项目会比较多具体内容）

### package.json

一个项目的配置情况

```json
{
  "name": "health",
  "description": "阿里大健康项目",
  "version": "2.0",
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.dev.conf.js --hot --host 192.168.80.106 --port 8000",
    "build": "node build/build.js",
  },
  "dependencies": {
    "vue": "^2.3.3",
    "vue-router": "^2.5.3",
    "vuex": "^2.3.1",
    "axios": "^0.16.2",
    "hammerjs": "^2.0.8",
    "echarts": "^3.6.1",
    "vue-lazyload": "^1.0.6",
    "vuex-router-sync": "^4.2.0",
    "qs": "^6.4.0"
  },
  "devDependencies": {}
}

```

## 代码架构

一个好的源码项目都是从合理、简单易懂的目录开始

### 根目录

```directory
﹀ src
  ﹥ assets（js、css、img）
  ﹥ components（searchbar，remind，upload）
  ﹥ directive（touch）
  ﹥ filters（日期格式化）
  ﹥ page
  ﹥ plugins（toast，alert，confirm,loading）
  ﹥ vuex
     ------------
     app.vue（index.vue）
     main.js（index.js）
     index.html
     ------------
     example.vue
     example.js
     example.html
     ------------
     vendor.js

-----------------
  ﹥ icons
  ﹥ mixins
```

### page
```directory
﹀ page
  ﹥ bbs
     ﹥ components
        home.vue
        riji.vue
        thread.vue
  ﹥ home
  ﹥ ovulate
  ﹥ period
  ﹥ temperature
  ﹥ ultrasound
  ﹥ example
```

### vuex

<img src="/img/vue-ali-health/vuex.png" alt="vuex" />

#### 1.0
```directory
﹀ vuex（1.0）
  ﹥ home（首页）
      index.js（state, actions, mutations）
      getters.js
  ﹥ bbs（社区）
  ﹥ ovulate（试纸）
  ﹥ period（日历）
  ﹥ temperature（体温）
  ﹥ ultrasound（B超）
  ﹥ example
     store.js（state, mutaions）
     actions.js
     getters.js
```

#### 2.0
```directory
﹀ vuex
  ﹥ home（首页）（标准）
      index.js（state）
      actions.js
      getters.js
      mutations.js
  ﹥ bbs（社区）（扩展）
      ﹥ actions
          digest.js
          group.js
          search.js
          thread.js
          riji.js
          index.js
      index.js
      getters.js
      mutations.js
```


## 代码

### 接口url统一

#### 1.0
```js
// actions.js
const = getThreads({ commit, rootState }, options = {}) => {
  // 第一点：actions里面含有逻辑操作
  commit('SetThreads', {
    rerender: options.rerender,
  });
  axios
    // 第二点：接口url不集中
    .get(`//api.${rootState.domain}/resuful/threads.json`)
    .then((res) => {
      // 第三点：每次回调都需要判断是否为0
      if (res.data.error_code === 0) {
        commit('SetThread', res.data.data);
        if (options.callback) {
          options.callback();
        }
      } else {
        commit('Alert', res.data.error_message);
      }
    })
    .catch((err) => {
      // 第四点：部分需求在网络异常的情况，还是可以继续往下执行
    });
}
```

```js
// mutaions.js
const SetThreads = (state, data) => {
  if (data.rerender) {
    state.threads = [];
    state.threadTotal = 0;
  } else {
    state.threads = data.list;
    state.threadTotal = data.total;
  }
};
```

#### 2.0


```js
// actions.js
import apiurl from './apiurl';
import apitool from './apitool';
// 第一点：外部自己判断是否清空操作 CleanThread();
const = getThreads({ commit, rootState }, ops) => {
  const options = apitool.requestBeforeHandler(ops);
  axios
    // 第二点：接口url集中管理
    .get(apiurl.threads)
    .then((res) => {
      // 第三点：统一回调处理
      apitool.requestHandler(res, (data) => {
        commit('SetThread', data);
        options.success(data);
      }, () => {
        commit('Alert', data.error_message);
      });
      // 第三点：统一回调处理
      apitool.requestHandler(res, options.success, options.error);
      // 请求无论成功与否都需要继续往下执行
      options.complate();
    })
    .catch((err) => {
      // 第四点，通过 requestBeforeHandler 方式处理统一事件
      options.complate();
    });
}
```

```js
// mutaions.js
const SetThreads = (state, data) => {
  state.threads = data.list;
  state.threadsTotal = data.total;
};
const CleanThreads = (state) => {
  state.threads = [];
  state.threadsTotal = 0;
};
```

```js
// apiUrl.js
const domain = window.location.href.match(/^(http|https):\/\/(\w+)\.([^\/]+)\//)[3];
export default {
  // 用户信息
  user: `//api.${domain}/resuful/user.json`,
  // 帖子
  threads: `//api.${domain}/resuful/threads.json`,
  // 获取相关配置
  config: `//api.${domain}/resuful/config.json`,
  // 数据同步接口
  sync: `//api.${domain}/resuful/sync.json`,
};
```

### 按需加载

```js
const bbs = require('./page/bbs/index.vue');
const index = require('./page/index.vue');

const bbs = () => import('./page/bbs/index.vue');
const index = () => import('./page/index.vue');
```


### 标题与登录

```js
import store from './vuex/store';
const router = new VueRouter({
  routes: [
    {
      path: '/index',
      component: index,
      name: 'index',
      meta: {
        title: '聚合页',
      },
    },
    {
      path: '/bbs',
      component: bbs,
      name: 'bbs',
      meta: {
        title: '社区',
      },
    },
    {
      path: '*',
      redirect: '/index',
      redirect: '/404',
    },
  ],
});
router.beforeEach((to, from, next) => {
  // 设置标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (store.state.isLogin) {
    return next();
  }
  store.dispatch('submitLogin', {
    success() {
      // do something
      next();
    },
    error() {
      // do error something or next()
    },
  });
});
```

### 多页面多路由

由单页面多路由改为多页面多路由

一开始，一些demo的展示，放在项目里面，导致打包的时候多了一些无用的demo代码在里面。
这时候就需要抽取代码独立出demo页面。


#### 1.0


```js
// build/webpack.base.conf.js
module.exports = {
  entry: {
    vendor: './src/vendor',
    index: [
      './src/main.js',
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['vendor', 'manifest', 'index'],
    }),
  ]
}
```

<!--(demo: button, icon, plugin, color)-->
```js
// src/main.js
const router = new VueRouter({
  routes: [
    {
      path: '/demo',
      component: demo,
      name: 'demo',
      meta: {
        title: 'demo',
      },
    },
  ],
});
```

#### 2.0

```js
// build/webpack.base.conf.js
module.exports = {
  entry: {
    vendor: './src/vendor',
    index: [
      './src/main.js',
    ],
    example: './src/example',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['vendor', 'manifest', 'index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'example.html',
      template: 'src/example.html',
      chunks: ['vendor', 'manifest', 'example'],
    }),
  ]
}
```

### 路由缓存问题

每次返回上一页时都能够回到原来浏览的位置

#### 保存浏览记录

```js
// mutations
const UpdatePosition = (state, data = {}) {
  state.position[data.key] = data.value;
},
```

#### js入口文件
```js
// src/main.js
const router = new VueRouter({
  // scrollBehavior 淘宝app里面无效
  scrollBehavior(to, from, savedPosition) {
    return savedPosition;
  },
  routes: [
    {
      path: '/index',
      component: index,
      name: 'index',
      meta: {
        title: '聚合页',
        keepAlive: true,
      },
    },
    {
      path: '/bbs',
      component: bbs,
      name: 'bbs',
      meta: {
        title: '社区',
        keepAlive: true,
      },
      children: [
        {
          path: '',
          component: bbsIndex,
          name: 'bbsIndex',
          meta: {
            title: '姐妹讨论圈',
            keepAlive: true,
          },
        },
        {
          path: 'thread/:tid',
          component: bbsThread,
          name: 'bbsThread',
          meta: {
            title: '帖子详情',
            keepAlive: true,
          },
        },
      ],
    },
    {
      path: '*',
      redirect: '/index',
    },
  ],
});
```

#### vue入口文件

```html
// src/app.vue
<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>    
</template>
<script>
export default {
  methods: {
    updatePosition(path, scrollTop) {
      this.UpdatePosition({
        key: path,
        value: scrollTop,
      });
    },
  },
  mounted() {
    const self = this;
    // 滚动定位
    self.handler = () => {
      if (self.routeName.match(/(index|bbsIndex|bbsThread)/)) {
        self.updatePosition(self.routeName, document.body.scrollTop);
      }
    };
  },
  watch: {
    routeName(routeName) {
      // 路由定位监听
      if (routeName.match(/index|bbsIndex|bbsThread/)) {
        setTimeout(() => {
          document.removeEventListener('scroll', self.handler, false);
          document.addEventListener('scroll', self.handler, false);
        }, 1000);
      }
      // 路由定位清除
      if (routeName === 'indexBeiyun' || routeName === 'indexMenses') {
        self.updatePosition('bbsIndex', 0);
        self.updatePosition('bbsThread', 0);
        self.updatePosition('bbsRiji', 0);
      } else if (routeName.match(/bbsIndex/)) {
        self.updatePosition('bbsThread', 0);
      }
    },
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.handler, false);
  },
};
</script>
```

#### 各个模块脚本
```js
// src/page/home/index.vue
export default {
  activated() {
    document.body.scrollTop = this.position.index;
  },
}

// src/page/bbs/index.vue
export default {
  activated() {
    document.body.scrollTop = this.position.bbs;
  },
}

// src/page/bbs/thread.vue
export default {
  activated() {
    document.body.scrollTop = this.position.bbsThread;
  },
}
```

### 路由跳转问题

#### 提交后返回原路由

原来的跳转流程，多次返回才能回到首页

+ 首页（点击B超测排）（push route）
+ B超测排（点击填写报告）（push route）
+ B超报告页（点击保存）（push route）
+ B超测排（左上角返回）

优化后的跳转流程，一次返回直接回到首页

+ 首页（点击B超测排）（push route）
+ B超测排（点击填写报告）（push route）
+ B超报告页（点击保存）（go(-1)）

#### 提交后去到新路由

原来的跳转流程，多次返回才能回到首页

+ 首页（点击发帖）（push route）
+ 发帖页（点击发送）（push route）
+ 群组选择页（点击发布）（push route）
+ 帖子详情页（左上角返回）

优化后的跳转流程，一次返回直接回到首页

步骤一：

+ 首页（点击发帖）（push route）
+ 发帖页（点击发送）（push route）
+ 群组选择页（点击发布）（go(-1)）

步骤二：

+ 首页（点击发帖）（push route）
+ 发帖页（replace route）

步骤三：

+ 首页（点击发帖）（push route）
+ 帖子详情页（左上角返回）

```js
// src/page/bbs/select_group.vue
// 发帖后，保留发帖tid
postThread({
  success(data) {
    self.SetPostTid(data.tid);
    self.$route.go(-1);
  },
});
```

```js
// src/page/bbs/post.vue
// 发帖页发现存在发帖tid，立即跳转到帖子页
if (this.postTid) {
  this.$route.replace(this.getRoute(`/bbs/thread/${this.postTid}`), () => {
    self.CleanPostTid();
  });
}
```

### 后续

+ 统计
+ 目录：icons，mixins
+ 打包：build优化
+ 考虑转场动画