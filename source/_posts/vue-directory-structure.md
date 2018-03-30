---
title: vue统一目录结构
date: 2018-03-30
tags:
 - javascript
 - vue
---

为了方便团队合作开发，现规范统一vue的开发目录规则
<!-- more -->

## 根目录结构

```markdown
﹀ project
  ﹥ build
  ﹥ dist
  ﹥ src
     ------------
     package.json
     README.md
     HISTORY.md
```
+ HISTORY.md 必须有，用于记录开发日志，方便其他开发者查看

## 实际项目源码目录

```markdown
﹀ src
  ﹥ assets 静态资源
  ﹥ components 全局公共组件
  ﹥ directive 全局指令集
  ﹥ mixins 混入
  ﹥ page 视图层（view）
  ﹥ plugins 插件
  ﹥ router 路由集
  ﹥ vuex 数据处理
     ------------
     App.vue
     index.html
     main.js
```
+ assets css、img、js等静态资源
+ components 公共组件（loadmore、searchbar）
+ directive 全局指令（touch、focus）
+ mixins 混入（filters: dateFormat、getAvatar; methods: webJsProtocol、tongJi）
+ page view层，页面展示
+ plugins 插件（alert、confirm）
+ router 路由
+ vuex 数据处理中心（项目模块、api处理器）

## page 视图层（view）

按照项目模块分目录，路由需一一对应文件路径，模块内可以有自己的components

```directory
路由地址
  对应的项目文件地址
----------------------
#/home
  page/home/index.vue
#/bbs/thread
  page/bbs/thread.vue
#/drugstore
  page/drugstore/index.vue


----------------------
﹀ page
  ﹥ home 首页
     ﹥ components
        index.vue
  ﹥ bbs 社区
        thread.vue
  ﹥ drugstore 杂货店
        index.vue
```

## router 路由

独立的路由文件，可以用于生成router-sitemap

```directory
﹀ router
     index.js
     routes.js
  ﹥ page
        home.js
        bbs.js
```

+ routes.js 灵活选择，小项目的话，所有路由写在这里即可
+ page/*.js 灵活选择，大项目的话，按照模块分别写上各自的路由

#### router/index.js
```js
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

const router = new VueRouter({
  routes,
});
router.beforeEach((to, form, next) => {
  return next();
});
export default router;
```

#### router/routes.js
```js
export default [
  {
    path: '/404',
    name: '404',
    component: error404,
    meta: {
      title: '404',
    },
  },
  {
    path: '/sitemap',
    name: 'sitemap',
    component: sitemap,
    meta: {
      title: '站点地图',
    },
  },
];
```


#### src/page/sitemap.vue
```html
<template>
  <div>
    ...routes
  </div>
</template>

<script>
  import routes from '../routes';
  export default {
    data() {
      return {
        routes: routes,
      };
    },
  };
</script>
```


## vuex 数据处理

```directory
﹀ vuex
  ﹥ api
  ﹥ modules
     mutations-types.js
     store.js
```

### vuex/modules
```directory
﹀ modules
  ﹥ app 公共数据，不直接挂在根目录
        actions.js
        getters.js
        index.js
        mutations.js
  ﹥ home
  ﹥ bbs
     index.js
```

### vuex/api
```directory
﹀ api
  ﹥ modules
        app.js
        home.js
        bbs.js
  ﹥ apiHandler.js api预处理器、api后处理器
  ﹥ apiUrl.js 接口地址集
  ﹥ request.js 简单的axios封装处理（GET、POST、PUT、DELETE）
  ﹥ index.js 入口文件
```

#### vuex/api/index.js

```js
import apiUrl from './apiUrl';
import apiHandler from './apiHandler';
import request from './request';
import apiHome from './modules/home';
export {
  apiUrl,
  apiHandler,
  request,
  apiHome,
};
```

#### vuex/api/request.js

```js
import axios from 'axios';
import apiHandler from './apiHandler';
export default {
  proxy(url, body, successCB, errorCB, completeCB, networkErrorCB) {
    axios
      .get(url, {
        params: body,
        withCredentials: true,
      })
      .then((res) => {
        apiHandler.res(res.data, successCB, errorCB, completeCB);
      })
      .catch(apiHandler.networkError(networkErrorCB));
  },
  proxyPost(url, body, successCB, errorCB, completeCB, networkErrorCB) {
  },
};
```


#### vuex/api/apiHandler.js

```js
export default {
  // 同步处理事件分流器，一般用于actions
  shunt(...args) {
    return (...resArgs) => {
      args.forEach((fn) => {
        if (Object.prototype.toString.call(fn) === '[object Function]') {
          fn.apply(this, resArgs);
        }
      });
    };
  },
  // 请求成功后处理接口数据
  res(data, successCB, errorCB, completeCB) {
    if (data.error_code === 0) {
      if (successCB) successCB.apply(this, [data]);
    } else if (errorCB) {
      errorCB.apply(this, [data]);
    }
    if (completeCB) completeCB.apply(this, [data]);
  },
  // 默认网络异常处理方法
  defaultError(err) {
    console.error(err);
  },
  // 网络异常处理
  networkError(callback) {
    if (debug && callback) {
      debug = false;
      return err => {
        this.defaultError(err);
        callback(err);
      };
    }
    return callback || this.defaultError;
  },
};
```

#### vuex/api/modules/home.js

```js
import apiUrl from '../apiUrl';
import apiHandler from '../apiHandler';
import request from '../request';
export default {
  getIndex(...args) {
    axiosLib.proxy.apply(this, [apiUrl.index].concat(...args));
  },
};
```

#### vuex/modules/actions.js

```js
import { apiHome, apiHandler } from 'src/vuex/api/index.js';
export default {
  // 获取首页信息
  getIndex({ commit }, options = {}) {
    apiHome.getIndex(options.body, apiHandler.shunt((data) => {
      commit('SetIndex', data.data);
    }, options.success), options.error);
  },
};
```


## mixins

```directory
﹀ modules
     methods.js 公共方法
     filters.js 格式化过滤器
     index.js 入口文件
```