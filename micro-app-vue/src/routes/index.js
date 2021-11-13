// import Home from "@/pages/home/index_old.vue";
import Online from "@/pages/online/index.vue";
import Config from "@/pages/config/index.vue";
import Heart from "@/pages/heart/index.vue";

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: home
  // },
  {
    path: '/online',
    name: 'Online',
    component: Online
  },
  {
    // path: '/online/detail/:id(\\d+)',
    path: '/online/detail/:id',
    name: 'OnlineDetail',
    component: () => import('@/pages/online/detail.vue')
  },
  {
    path: '/config',
    name: 'Config',
    component: Config
  },
  {
    path: '/config/add',
    name: 'ConfigAdd',
    component: () => import('@/pages/config/add.vue')
  },
  {
    path: '/config/detail/:id(\\d+)',
    name: 'ConfigDetail',
    component: () => import('@/pages/config/detail.vue')
  },
  {
    path: '/config/edit/:id(\\d+)',
    name: 'ConfigEdit',
    component: () => import('@/pages/config/edit.vue')
  },
  {
    path: '/heart',
    name: 'Heart',
    component: Heart
  },
  {
    path: '/heart/add',
    name: 'HeartAdd',
    component: () => import('@/pages/heart/add.vue')
  },
  {
    path: '/heart/edit/:id(\\d+)',
    name: 'HeartEdit',
    component: () => import('@/pages/heart/edit.vue')
  }
]

export default routes
