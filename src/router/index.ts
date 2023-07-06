import { getToken } from '@/utils/http/auth';
import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router';
//公共路由
import constantRoutes from './constant-modules';
import { hasRegistered } from './permission-modules';

const creatRouter = () => {
  return createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: constantRoutes
  });
};
//创建路由实例
let router = creatRouter();
//重置路由
export const resetRouter = () => {
  router = creatRouter();
};
//判断是否存在已添加的路由
const hasRoute = (to: RouteLocationNormalized) => {
  const allRoutes = router.getRoutes();
  const extendRoute = allRoutes.filter((k) => k.path === to.fullPath);
  return extendRoute && extendRoute.length ? true : false;
};
// 不重定向白名单
const whiteList = ['/login'];
router.beforeEach(async (to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    resetRouter();
    next();
  } else {
    //是否存在token
    const token = getToken();
    if (token) {
      //是否已注册路由
      const isRoute = hasRoute(to);
      if (!isRoute) {
        const hasPage = await hasRegistered(to);
        if (hasPage) {
          router.addRoute(hasPage);
          //判断是否存在按钮权限子路由，可建funcpower-modules文件夹做对应注册
          //   if (route.children.length) {
          //       route.children.forEach((item:any) => {
          //            if (item.meta?.options) {
          //         const funcRoutes=createFuncRoutes(item.meta.options)
          //         funcRoutes.forEach((item: RouteRecordRaw) => {
          //             router.addRoute(item.parentName, item);
          //         })
          //       })
          //     }
          //路由进行重定向放行
          next({ ...to, replace: true });
        } else {
          next({
            name: 'empty',
            query: {
              from: to.fullPath || '/'
            }
          });
        }
      } else {
        next();
      }
    } else {
      next({
        name: 'Login',
        query: {
          from: to.fullPath || '/'
        }
      });
    }
  }
});

// // 添加新的路由

//
// constantRoutes.push({
//   path: '/v-list',
//   name: 'VList',
//   component: VList,
// });

export default router;