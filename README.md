# 微前端架构模板

## 介绍

> 微前端是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面前端应用由单一的单体应用转变为多个小型前端应用聚合为一的应用。各个前端应用还可以独立开发、独立部署。同时，它们也可以在共享组件的同时进行并行开发——这些组件可以通过 NPM 或者 Git Tag、Git Submodule 来管理。

本项目是基于 `qiankun` 搭建的微前端架构 `Demo`，你也可以当成 `qiankun-quick-start` 来使用。

本项目使用 `Vue` 作为主应用基座，嵌入了 `Vue、React、Angular、Jquery...` 等等多个技术栈的微应用，架构图如下：

![架构图](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/8.png)

## 如何运行

> 本项目使用的端口为 `9999、10200`，运行前请确保这几个端口的空闲。
>
> 全量启动项目会比较慢，需要耐心等待一会儿，适合只查看项目运行效果的童鞋。
> 
> 如果需要调试项目查看效果，建议手动启动主应用和所需的微应用。

本仓库基于 `qiankun` 实现微前端架构，运行命令（全量启动）如下：

```bash
yarn install
yarn examples:install
yarn examples:start
```

## 分支说明

`master` 为稳定分支，其他分支根据 [qiankun 实战系列教程](https://github.com/a1029563229/blogs) 划分：

  - `master`：稳定分支，可以直接作为 `qiankun-quick-start` 使用；
  - `feature-inject-sub-apps`：主应用基座搭建、微应用接入方案；
  - `feature-communication`：官方通信方案；
  - `feature-communication-shared`：`Shared` 通信方案；

大家可以根据自己的需求切换分支。

## 关于跨域

由于 `qiankun` 内部使用的是 `Fetch HTML` 的方式加载子应用，所以会遇到跨域问题。我们需要先解决跨域问题，使我们的主应用可以正常加载子应用相关资源。

在开发环境下，本项目配置了跨域解决方案，所以在直接运行项目并不会遇到跨域问题。

<!-- ，生产环境的跨域问题可以参考下面的方案。 -->

<!-- #### 扩展阅读

本项目在生产环境（和开发环境），采用 `caddy` 解决应用间跨域问题及生产部署问题，`caddy` 的安装和使用可以参照 [`caddy` 入门教程](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/micro-front/4.png)。

`caddy` 可以在本地开发和生产环境可以提供同一套跨域解决方案，建议使用。如果你不想使用 `caddy`，那么也可以通过其他方案（如 `nginx` 等等）解决跨域问题。 -->