---
title: 如何把你 Github 上的模块改为可用 npm 安装
date: 2017-01-18
tag: 
- npm
- javascript
- Github
---

由于我们现在 Webpack + Vue.js 使用的频率越来越高。  
而原有的 Sea.js 模块和现在用的 Require.js 模块，在 Webpack 中使用是比较麻烦的。  
所以，将模块修改成标准 Node.js 模块，可以方便我们在代码中引用，减少模块的维护工作量。

<!-- more -->

## 修改打包代码

这里以 `bz-share` 模块为例。  
在原有的 `/build/config.js` 文件中，加入以下配置：

```javascript
{
  // 无第三方依赖的 UMD 包，这个和 npm 安装没什么关系。这个包的作用下面会讲到。
  'prod-noDepend': {
    input: 'src/index.js',
    format: 'umd',
    moduleName: name,
    output: path.join(modulePath, name + '-nodep.js')
  },
  // UMD 模块，UMD 为 Universal Module Definition 的缩写
  'dist-common': {
    input: 'src/index.js',
    format: 'umd',
    moduleName: name,
    output: path.join('dist/', name + '.umd.js')
  },
  // ES6 模块，ESM 为 ES Modules 的缩写
  'dist-esm': {
    input: 'src/index.js',
    format: 'es',
    moduleName: name,
    output: path.join('dist/', name + '.esm.js')
  }
}
```
在 `bz-share v0.2.0` 版本的时候，引入了一个使用 npm 安装的 `object-assign` 模块;  
而我们上面三个配置打包后的代码中，是没有带有第三方模块的，只是带有引用代码。  
这是为了避免重复引用相同的模块。  

当然，所有第三方依赖包，都应该存在于你的模块 `package.json` 文件中。  
如果没有，那之后你使用 npm 安装你的模块时，会因为缺少依赖文件而无法正常使用。


## 修改 package.json

新增以下几行代码：

```diff
{
   "name": "bz-share",
+  "main": "dist/bz-share.umd.js",
+  "module": "dist/bz-share.esm.js",
+  "repository": {
+    "type": "git",
+    "url": "https://github.com/BozhongFE/bz-share.git"
+  },
# 以下部分是安装依赖时自动加的
+  "dependencies": {
+    "object-assign": "^4.1.1"
+  }
}
```

`main` 字段，在我们使用 `require('moduleName')` 的时候，就会加载这个文件。  
所以，这个文件需要是支持 Common.js 模块加载的。

`module` 字段，在 Webpack 2.0 以上版本，和 Rollup 中，如果你使用 ES Modules 引用这个模块，那么在打包的时候，将会加载这个字段的文件。
所以，这个文件需要是一个 ES Modules。

具体可以看 [pkg.module](https://github.com/rollup/rollup/wiki/pkg.module)

`repository` 字段，这个对于没有发布到 npm 上的模块，可以不写。  

`dependencies` 字段，依赖文件，第三方依赖必须存在这个字段内。

## 提交你的代码到 Github 上，并打上标签

提交时，记得 `dist` 文件夹要一起提交。  
提交到 Github 后，打上版本标签。  
比如 `bz-share` 模块更新到 `0.2.0` 版本。那么，这个时候我们应该打上一个 `v0.2.0` 的标签。命令如下：

```bash
# 添加一个标签，并写上标签说明
git tag -a v0.2.0 -m "my version 0.2.0"

# 将当前标签提交到远程服务器
git push origin v0.2.0
```

这时候，就可以使用以下命令进行模块的安装了：

```bash
# 安装指定版本
npm install https://github.com/BozhongFE/bz-share#v0.2.0
# or
npm install github:BozhongFE/bz-share#v0.2.0

# 安装最新版本，需要注意的是，这里安装的是最新提交的代码，而不是最后一个 tag 的代码
# 不推荐使用这种方式，因为这种方式安装的代码，无法锁定在某个版本。
# 其他人 npm install 该模块后，可能不是同一个版本，会导致未知的错误
npm install https://github.com/BozhongFE/bz-share
# or
npm install github:BozhongFE/bz-share
```

打上标签之后，对应标签的代码就停留在打标签的那个提交上。后续提交不会更新到那个标签上。  
如果你打上标签之后，更改了代码，但是又不想新增一个标签。  
你可以先删除原有标签，然后再添加一个同名标签。

```bash
# 删除本地标签
git tag -d v0.2.0

# 删除远程标签
git push origin -d v0.2.0

# 新增同名标签
git tag -a v0.2.0 -m "new version 0.2.0"

# 推送到远程服务器
git push origin v0.2.0
```

更多关于 `git tag` 的资料，可以看下 [Git-基础-打标签](https://git-scm.com/book/zh/v2/Git-基础-打标签)。 

## 关于上面的无依赖 UMD 包的作用

这个包是在没有使用打包工具时使用。  
比如我们使用的 `Require.js`。  
可以这么用：

```javascript
requirejs.config({
  paths: {
    'object-assign': './js/object-assign.js',
  },
});

requirejs([
  'mod/bz-share/0.2.0/bz-share-nodep',
  'mod/bz-login/0.2.0/bz-login-nodep',
], function (bzShare, bzLogin) {
  // ...
});
```

这样就可以避免多次引用同一个第三方依赖，造成不必要的空间浪费。  
当然，这个第三方依赖必须支持 AMD 模块加载方式。才能在 `Require.js` 中使用。

## 参考资料

1. [pkg.module · rollup/rollup Wiki](https://github.com/rollup/rollup/wiki/pkg.module)
2. [install | npm Documentation](https://docs.npmjs.com/cli/install)
3. [Git-基础-打标签](https://git-scm.com/book/zh/v2/Git-基础-打标签)
4. [Git查看、删除、重命名远程分支和tag](https://blog.zengrong.net/post/1746.html)