<!--
 * @Author: yeshaofen
 * @Date: 2022-04-19 14:37:18
 * @Description:dadp微服务开发平台
 * @FilePath: /dadp-vue/README.md
-->

# dadp-vue

### 项目采用技术:

- vue3 + composition api
- typescript
- sass (dart sass)
- element-plus
- echats5

### 项目搭建

1、解压 node_modules.zip 到dadp-vue 目录下。

2、多环境命令查看 package.json script:

```shell
    "serve": "vue-cli-service serve",
    "serve:dev": "vue-cli-service serve --mode dev.serve",
    "build:dev": "vue-cli-service build --mode dev.build",
    "serve:prod": "vue-cli-service serve --mode prod.serve",
    "build:prod": "vue-cli-service build --mode prod.build",
```

3、运行命令(dev 根据需要的环境调整）：

npm run serve:dev

4、编译命令(dev 根据需要的环境调整）

npm run serve:dev

### 项目开发规范

    ```

    组件：
        组件名：
            由多个单词组成，除了根组件 App，以及 <transition>、<component> 之类的 Vue 内置组件，命名规范为 KebabCase 格式
        组件文件名：kebab-case(目前系统统一用这种写法)、PascalCase(非模版类组件，暂时不用)
        基础组件名称：
                    应用特定样式和约定的基础组件 (也就是展示类的、无逻辑的或无状态的组件) 应该全部以一个特定的前缀开头，比如 Base、App 或 V
        组件名称单词顺序:组件名称应该以高阶的 (通常是一般化描述的) 单词开头，并以描述性的修饰词结尾
    css命名规范：BEM
                block 代表了更高级别的抽象或组件。
                block**element 代表.block 的后代，用于形成一个完整的.block 的整体。
                block--modifier 代表.block 的不同状态或不同版本。
            例如:
                .site-search{}/_ 块 _/
                .site-search**field{}/_元素 _/
                .site-search--full{}/_ 修饰符 _/
                注：组件样式:设置作用域，基于 class 的策略，而不是 scoped attribute
    变量：小驼峰命名，常量：尽量大写+下划线命名（如 const MENU*DATA，函数可使用小驼峰命名）
    views 下文件夹：按照菜单层级命名，页面入口文件命名为/菜单名/v-list.vue
    私有 property 名称:使用 $*前缀,并附带一个命名空间，以回避和其它作者的冲突
                        (比如 $\_yourPluginName\_)
                    
    ```

- 目录结构

      ```
      dadp-font
      ├─ dist               # 打包dist
      ├─ public             # 静态资源
      ├─ mock               # 前端接口模拟(暂未使用)
      ├─ types              # 全局声明文件
      ├─ src
      │  ├─ apis            # 接口请求
      │  ├─ assets          # 静态资源
      │  │   ├─ iconfont    # font字体
      │  │   ├─ image       # 图片
      │  │   └─ svg         # svg图标
      │  ├─ styles          # 全局样式
      │  ├─ layout          # 页面公用布局
      │  ├─ components      # 公共组件
      │  │   ├─ global      # 全局注册组件
      │  │   ├─ package     # 二次封装组件
      │  │   └─ business    # 业务组件
      │  ├─ store           # vuex状态(数据缓存机制)
      │  │   ├─ app         # 全局
      │  │   ├─ permission  # 权限
      │  │   ├─ tagsview    # 导航
      │  │   └─ user        # 用户
      │  ├─ utils           # 工具包
      │  │   ├─ http        # 请求方法（axios二次封装）
      │  │   ├─ hooks       # 复用逻辑
      │  │   ├─ plugin      # 自定义插件(指令、过滤器等)
      │  │   └─ tools       # 常用方法
      │  ├─ model           # 公用model定义
      │  ├─ views           # 所有业务页面
      │  ├─ router          # 路由
      │  ├─ main.ts         # 入口文件
      │  └─ shims-vue.d.ts  # ts 声明
      ├─ .env.dev.build     # 开发环境
      ├─ .env.dev.serve     # 开发本地本地
      ├─ .env.prod.build    # 生产环境
      ├─ .env.prod.serve    # 生产环境本地
      ├─ .eslintrc.js       # eslint配置
      ├─ .browserslistrc    # 浏览器兼容性配置
      ├─ label.config.js    # label 配置
      ├─ vue.config.js      # vue-cli 配置
      └─ README.md          # 项目说明文档

      ```

### 项目简述

- 版本:
  node:v16.14.2 vue:@vue/cli 5.0.4 npm:8.7.0

- 前端开发工具 vscode

- 主要配置文件的作用及模块设计 vscode 配置：实现代码格式化 vue.config.js:全局变量配置、打包需求等 路由实现: 静态路由、权限路由、按钮权限路由（用于把组件变成二级子路由模式） 设置路由白名单(登录页
  login，错误页面 404)
  利用 router.beforeEach 获取路由信息，判断是否需要注册新路由 动态路由：1.从后端获取角色菜单列表,编写路由构造方法，构造路由，并放置在权限路由里面， 2.从后端获取路由列表(目前项目采用方案 1)(具体实现:可查看
  router/index.ts:里面有对应设计思路、实现及预留拓展)
  vuex 使用：按业务模块划分，在 index.ts 中使用命名空间来维护 业务模块划分如下： 全局：State:字典、当前激活菜单、侧边菜单栏显藏;Action:码值设置、侧边菜单导航显隐设置、菜单操作 用户：State：用户信息;
  Action:登录、注销、角色切换 权限：State：菜单、路由、功能按钮、角色;Action:设置菜单数据结构、设置功能权限、设置角色列表 导航：State：路由访问记录;Action:新增、删除、清空路由访问记录 hook
  的使用：菜单、vuex 调用、echart 图表(借鉴 vueuse)

### 项目参考文档

- vue3:https://v3.cn.vuejs.org/guide/installation.html
- vue-cli:https://cli.vuejs.org/zh/
- vue-router:https://next.router.vuejs.org/zh/introduction.html
- axios:https://axios-http.com/docs/intro
- vuex:https://vuex.vuejs.org/zh/installation.html
- element-plus:https://element-plus.gitee.io/zh-CN/component/border.html
- echart:https://echarts.apache.org/zh/index.html
- webpack:https://www.webpackjs.com/api/
- typescript:https://www.tslang.cn/docs/handbook/basic-types.html
- vueuse:https://vueuse.org/guide/
