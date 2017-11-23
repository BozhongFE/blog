---
title: git基础
date: 2017-11-17 12:17:08
tags:
- tool
---
#### 初次运行 Git 前的配置
Git 提供了一个叫做 git config 的工具，专门用来配置或读取相应的工作环境变量。而正是由这些环境变量，决定了 Git 在各个环节的具体工作方式和行为。这些变量可以存放在以下三个不同的地方：
- /etc/gitconfig 文件：系统中对所有用户都普遍适用的配置。若使用 git config 时用 --system 选项，读写的就是这个文件。
- ~/.gitconfig 文件：用户目录下的配置文件只适用于该用户。若使用 git config 时用 --global 选项，读写的就是这个文件。
- 当前项目的 git 目录中的配置文件（也就是工作目录中的 .git/config 文件）：这里的配置仅仅针对当前项目有效。每一个级别的配置都会覆盖上层的相同配置，所以 .git/config 里的配置会覆盖 /etc/gitconfig 中的同名变量。
<!--more-->

在 Windows 系统上，Git 会找寻用户主目录下的 .gitconfig 文件。主目录即 $HOME 变量指定的目录，一般都是C:\Documents and Settings\$USER 。此外，Git 还会尝试找寻 /etc/gitconfig 文件，只不过看当初 Git 装在什么目录，就以此作为根目录来定位。

#### 初始化新仓库
要对现有的某个项目开始用 Git 管理，只需到此项目所在的目录，执行：
```bash
$ git init
```
#### 克隆现有的仓库

为了得一个项目的拷贝(copy),我们需要知道这个项目仓库的地址(Git URL). Git能在许多协议下使用，所以Git URL可能以ssh://, http(s)://, git://,或是只是以一个用户名（git 会认为这是一个ssh 地址）为前辍. 有些仓库可以通过不只一种协议来访问，例如，Git本身的源代码你既可以用 git:// 协议来访问：
```bash
$ git clone git@github.com:BozhongFE/blog.git
```
也可以通过https协议来访问:
```bash
$ git clone https://github.com/BozhongFE/blog.git
```
#### 检查当前文件状态
要查看哪些文件处于什么状态，可以用 git status 命令。 如果在克隆仓库后立即使用此命令，会看到类似这样的输出：
```bash
$  git status
On branch master
Your branch is up-to-date with 'origin/master'.
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        source/_posts/git.md

nothing added to commit but untracked files present (use "git add" to track)

```
#### 跟踪新文件
```bash
$ git add source/_posts/git.md
```
再运行 git status 命令，会看到 git.md 文件已被跟踪，并处于暂存状态：
```bash
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
  (use "git reset HEAD <file>..." to unstage)

        new file:   source/_posts/git.md

```
#### 暂存已修改文件
运行了 git add 之后又作了修订的文件，需要重新运行 git add 把最新版本重新暂存起来
#### 状态简览
git status 命令的输出十分详细，但其用语有些繁琐。 如果你使用 git status -s 命令或 git status --short 命令，你将得到一种更为紧凑的格式输出。 运行 git status -s ，状态报告输出如下：
```bash
$ git status -s
?? source/_posts/git.md

```
#### 忽略文件
一般我们总会有些文件无需纳入 Git 的管理，也不希望它们总出现在未跟踪文件列表。 通常都是些自动生成的文件，比如日志文件，或者编译过程中创建的临时文件等。 在这种情况下，我们可以创建一个名为 .gitignore 的文件，列出要忽略的文件模式。 来看一个实际的例子：
```bash
.DS_Store
db.json
*.log
node_modules/
public/
.deploy*/
yarn.lock
```
#### 未暂存的修改
要查看尚未暂存的文件更新了哪些部分，不加参数直接输入 git diff：
```bash
$ git diff
```
#### 提交更新
```bash
$ git commit
```
#### 移动文件
```bash
$ git mv file_from file_to
```
#### 查看commit历史
```bash
$ git log
```
#### 显示分支
```bash
$ git branch
```
#### 切换分支
新建一个a分支，并且自动切换到a分支。
```bash
$ git checkout -b a
$ git branch
* a
  master

```
#### 合并分支
```bash
$ git checkout master
Switched to branch 'master'
Your branch is up-to-date with 'origin/master'.
$ git merge a 
```
#### 删除分支

有新建分支，那肯定有删除分支，假如这个分支新建错了，或者a分支的代码已经顺利合并到 master 分支来了，那么a分支没用了，需要删除，这个时候执行 git branch -d a 就可以把a分支删除了。
```bash
git branch -d a
```

有些时候可能会删除失败，比如如果a分支的代码还没有合并到master，你执行 git branch -d a 是删除不了的，它会智能的提示你a分支还有未合并的代码，但是如果你非要删除，那就执行 git branch -D a 就可以强制删除a分支。

```bash
$ git branch -D a 
```
#### 设置别名
```bash
$ git config --global alias.psm 'push origin master'
$ git config --global alias.plm 'pull origin master'
$ git psm
$ git plm
```
#### 获取分支走向和详细日志
```bash
$ git log --graph --pretty=format:'%Cred%h%Creset
-%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' 
--abbrev-commit --date=relative
$ git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative"
$ git lg
```
#### 查看配置信息
要检查已有的配置信息，包括之前设置的别名，可以使用 git config --list 命令：
```bash
$ git config --list
core.symlinks=false
core.autocrlf=true
core.fscache=true
color.diff=auto
color.status=auto
color.branch=auto
color.interactive=true
help.format=html
http.sslcainfo=C:/Program Files/Git/mingw64/ssl/certs/ca-bundle.crt
diff.astextplain.textconv=astextplain
rebase.autosquash=true
user.name=xxxxx
user.email=xxxx@xxx.com
user.username=airyland
filter.lfs.clean=git-lfs clean -- %f
filter.lfs.smudge=git-lfs smudge -- %f
filter.lfs.required=true
filter.lfs.process=git-lfs filter-process
push.default=current
alias.lg=log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --date=relative
alias.psm=push origin master
alias.br=branch
alias.plm=pull origin master
```
有时候会看到重复的变量名，那就说明它们来自不同的配置文件（比如 /etc/gitconfig 和 ~/.gitconfig），不过最终 Git实际采用的是最后一个。

---
相关链接：

Pro Git：https://git-scm.com/book/zh/v2