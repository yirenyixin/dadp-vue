import { store } from '@/store';
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
interface ItemType {
  menuId: string;
  parentMenuId: string;
  menuUrl: string;
  imageUrl: string;
  menuName: string;
  [key: string]: any;
}
/**
 * @description: 组件获取
 * @param {path} 地址
 * @return {*}
 */
const lazyLoading = (path: string): any => {
  return () =>
    import(`@/views${path}/v-list.vue`).catch((e) => {
      // 未找到组件
      return import('@/views/no-fund/v-empty.vue');
    });
};
/**
 * @description:路由构造
 * @param {item} 对象
 * @return {*}
 */
const routeConstructor = (item: ItemType) => {
  const { menuId, parentMenuId, menuUrl, imageUrl, menuName } = item;
  return {
    path: menuUrl, // sys/sys-code
    name: menuId, // SysCode
    meta: {
      icon: imageUrl,
      title: menuName,
      breadcrumbs: [menuName]
    },
    component: parentMenuId
      ? lazyLoading(menuUrl)
      : () => import('@/layout/base-layout.vue')
  };
};
/**
 * @description:路由
 * @param {$list} 列表
 * @return {*}
 */
export const getRouteList = async (): Promise<any> => {
  const $list = store.getters['permission/getRoute'];
  if (!$list.length) return [];
  const parentRoute: RouteRecordRaw[] = [],
    _routes: RouteRecordRaw[] = [];
  await $list.forEach((item: ItemType) => {
    const { parentMenuId } = item;
    const comp = routeConstructor({ ...item }) as RouteRecordRaw;
    parentMenuId ? _routes.push(comp) : parentRoute.push(comp);
  });
  await parentRoute.forEach((item: RouteRecordRaw) => {
    const _children = _routes.filter(
      (k: RouteRecordRaw) => k.path.indexOf(item.path) === 0
    );
    item.children = _children;
    if (!item.children.length) {
      const { path, name, meta, component } = item;
      Object.assign(item, {
        path: '/',
        component: component,
        redirect: path,
        meta: {
          title: '',
          breadcrumb: [],
          level: 1
        },
        children: [
          {
            path: path,
            name: name,
            meta: meta,
            component: lazyLoading(path)
          }
        ]
      });
    }
  });
  return parentRoute;
};
//判断是拥有权限
export const hasRegistered = async (route: RouteLocationNormalized) => {
  const permissionRoutes = await getRouteList();
  const hasPage = permissionRoutes.find(
    (f: any) =>
      f.path === route.path ||
      (f.children &&
        f.children.some((c: { path: string }) => c.path === route.path))
  );
  return hasPage;
};
