<template>
  <a-config-provider prefixCls="cns">
    <section id="cns-main-app">
      <a-layout>
        <section class="cns-menu-wrapper">
          <!--    主应用的menu改成横向的：即组件的mode=inline改成mode=horizontal-->
          <main-menu :menus="menus" />
        </section>
      </a-layout>
      <section class="cns-frame-wrapper">
        <!-- 主应用渲染区，用于挂载主应用路由触发的组件 -->
        <router-view v-show="$route.name" />

        <!-- 子应用渲染区，用于挂载子应用节点 -->
        <section v-show="!$route.name" id="frame"></section>
      </section>
    </section>
  </a-config-provider>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import MainMenu from "@/components/menu/index.vue";

@Component({
  components: {
    MainMenu
  }
})
export default class App extends Vue {
  /**
   * 菜单列表
   * key: 唯一 Key 值
   * title: 菜单标题
   * path: 菜单对应的路径
   */
  menus = [
    {
      key: "Home",
      title: "iQA",
      path: "/",
      icon: "windows"
    },
    {
      key: "VueMicroApp",
      title: "流量回放",
      path: "/repeater/online",
      icon: "code-sandbox"
    },
    {
      key: "ReactMicroApp",
      title: "React微应用",
      path: "/react"
    },
    // {
    //   key: "ReactMicroAppList",
    //   title: "React 列表页",
    //   path: "/react/list"
    // },
    {
      key: "AngularMicroApp",
      title: "Angular微应用",
      path: "/angular"
    },
    // {
    //   key: "AngularMicroAppList",
    //   title: "Angular 列表页",
    //   path: "/angular/list"
    // },
    // {
    //   key: "StaticMicroApp",
    //   title: "Static 微应用",
    //   path: "/static"
    // }
  ];
}
</script>

<style lang="less" scoped>
#cns-main-app {
  height: 100%;
  position: relative;
  /*menu改成横向的：注释position+width */
  .cns-menu-wrapper {
    /*position: fixed;*/
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 40;
    /*width: 172px;*/
    overflow-x: hidden;
    overflow-y: auto;
  }
  .cns-nav-wrapper {
    position: fixed;
    width: 100%;
    min-width: 1060px;
    padding-left: 172px;
    left: 0;
    top: 0;
    z-index: 30;
  }
}
/*menu改成横向的：调整样式padding-left从172改成0 */
.cns-frame-wrapper {
  padding-left: 0px;
  flex-grow: 1;
  height: 100%;
  width: 100%;
  position: relative;
}

#cns-frame {
  width: 100%;
  height: 100%;
  > :first-child {
    height: 100%;
  }
}
</style>
