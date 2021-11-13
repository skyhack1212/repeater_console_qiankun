<template>
    <div id="app">
<!--        TODO 布局调整，目前height: 880px临时写死的，怎么改成最大化满屏的？ -->
        <a-layout id="components-layout-demo">
            <a-layout-sider>
        <!--        因为主应用的menu改成横向的，所以子应用的menu需要改成竖向的：即horizontal改成inline-->
                <a-menu :selectedKeys="[currentRoute]" mode="inline" theme="dark">
                    <a-menu-item
                            v-for="(item) in menus"
                            :key="item.key"
                    >
                        <router-link :to="item.route">
                            <a-icon :type=item.icon />{{item.title}}
                        </router-link>
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <a-layout-content>
                <router-view :key="(new Date()).getTime()"/>
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script>
    export default {
        name: 'App',

        data() {
            return {
                menus: [
                    {
                        key: "online",
                        route: "/online",
                        title: "在线流量",
                        icon: "area-chart"
                    },
                    {
                        key: "config",
                        route: "/config",
                        title: "配置管理",
                        icon: "setting"
                        // icon: "control"
                    },
                    {
                        key: "heart",
                        route: "/heart",
                        title: "在线模块",
                        icon: "heart"
                    }
                ]
            }
        },

        computed: {
            currentRoute() {
                const menu = this.menus.find(item => item.route === this.$route.path)
                return menu ? menu.key : "repeater";
            }
        },
    }
</script>

<style>
    /*TODO 布局调整，目前height: 880px临时写死的，怎么改成最大化满屏的？ */
    #components-layout-demo{
        width: 100%;
        height: 880px;
        background: rgba(255, 255, 255, 0.2);
        /*flex: auto;*/
        float: left;
    }
</style>
