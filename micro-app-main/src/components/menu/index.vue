<template>
  <section class="cns-main-menu">
<!--    主应用的menu改成横向的：即inline改成horizontal-->
    <a-menu mode="horizontal" theme="dark" :selectedKeys="[selectKey]">
<!--     home 主应用单独展示 样式为 width: 160px;text-align:center;font-size:180%  -->
      <a-menu-item style="width: 160px; text-align:center;font-size:180%" @click="changeMenu(menus[0])">
        <router-link :to="{path: menus[0].path }">
          <a-icon style="font-size:100%" v-if="menus[0].icon" :type="menus[0].icon" />
          <span>{{menus[0].title}}</span>
        </router-link>
<!--     子应用单独展示 样式为 text-align:center   -->
      </a-menu-item>
        <a-menu-item style="font-size:150%" v-for="item in menus" :key="item.key" @click="changeMenu(item)">
            <router-link v-if="item.title!=='iQA'" :to="{path: item.path }">
                <a-icon style="font-size:100%" v-if="item.icon" :type="item.icon" />
                <span>{{item.title}}</span>
            </router-link>
        </a-menu-item>
    </a-menu>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
  children?: MenuItem[];
};

@Component
export default class Menu extends Vue {
  @Prop({ type: Array, default: [] })
  menus!: MenuItem[];

  @Watch("$route.path")
  onPathChange() {
    this._initMenus();
  }

  selectKey: string = "";

  created() {
    this._initMenus();
  }

  private _initMenus() {
    const currentMenu = this._findCurrentMenu(
      this.menus,
      this.$route.path
    ) as MenuItem;
    if (!currentMenu) return;
    const { key } = currentMenu;
    this.selectKey = key;
  }

  private _findCurrentMenu(
    menus: MenuItem[],
    currentPath: string
  ): MenuItem | null {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      const { path } = menu;
      if (path === currentPath) return menu;

      const currentMenu = this._findCurrentMenu(
        menu.children || [],
        currentPath
      );
      if (currentMenu) return currentMenu;
    }
    return null;
  }

  /**
   * 切换菜单
   */
  private changeMenu(item: MenuItem) {
    const { key } = item;
    this.selectKey = key;
  }
}
</script>

<style lang="less" scoped>
.cns-main-menu {
  width: 100%;
  height: 100%;
  background: #001529;
  .cns-menu {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    a {
      color: #fff;
      text-decoration: none;
    }
  }
  .cns-parent-title {
    font-size: 13px;
    color: rgba(233, 241, 255, 0.75);
  }
  .cns-child-title {
    font-size: 13px;
    color: #fff;
  }
  .cns-child-title:hover {
    color: #408fff;
  }
  /deep/ .cns-menu-sub {
    background: rgb(12, 28, 53);
  }
}
</style>