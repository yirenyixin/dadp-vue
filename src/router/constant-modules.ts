import LayoutBase from '@/layout/base-layout.vue';
import { RouteRecordRaw } from 'vue-router';
import Vue from 'vue';
import VueRouter from 'vue-router';

const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LayoutBase,
    redirect: '/default',
    children: [
      {
        path: '/default',
        name: 'Default',
        component: () => import('@/views/demo/dashboard/v-list.vue'),
        meta: {
          title: '首页',
          name: 'Default',
          icon: '',
          breadcrumb: ['首页'],
        },
      },
      {
        path: '/empty',
        name: 'Empty',
        component: () => import('@/views/no-fund/v-empty.vue'),
        meta: {
          title: '404',
          name: '404',
          icon: 'aaaa',
          breadcrumb: ['menu', 'empty'],
        },
      },
      {
        path: '/sys/user-details/view',
        name: 'ViewUser',
        component: () => import('@/views/sys/user-details/v-list.vue'),
        meta:{
          title:'用户详细信息',
          name:'用户详细信息',
          icon:'',
          breadcrumb:['menu','empty','view'],
        },
        props: true, // 将路由参数作为props传递给组件
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '@/views/login/v-login.vue'),
  },
];

export default constantRoutes;
