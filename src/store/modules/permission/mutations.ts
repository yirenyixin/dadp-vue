import { MutationTree } from 'vuex';
import { MenuTreeType, PermissionState, RoleType } from './state';
import { PermissionMutationType } from './mutation-types';
import { RouteRecordRaw } from 'vue-router';
import router from '@/router';
import { getRouteList } from '@/router/permission-modules';

export type Mutations<S = PermissionState> = {
  [PermissionMutationType.SET_ROUTE](
    state: S,
    routes: Array<RouteRecordRaw>
  ): void;
  [PermissionMutationType.SET_MENULIST](state: S, menuList: MenuTreeType): void;
  [PermissionMutationType.SET_FUNCTLIST](
    state: S,
    funcList: Array<string>
  ): void;
  [PermissionMutationType.SET_ROLELIST](
    state: S,
    roleList: Array<RoleType>
  ): void;
};

export const mutations: MutationTree<PermissionState> & Mutations = {
  async [PermissionMutationType.SET_ROUTE](
    state: PermissionState,
    dynamicRoutes: Array<RouteRecordRaw>
  ) {
    state.dynamicRoutes = dynamicRoutes;
    sessionStorage.setItem('dynamicRoutes', JSON.stringify(dynamicRoutes));
    //路由注册
    const premissionRoutes = await getRouteList();
    await premissionRoutes.forEach((route: RouteRecordRaw) => {
      router.addRoute(route);
    });
  },
  [PermissionMutationType.SET_MENULIST](
    state: PermissionState,
    menuList: MenuTreeType
  ) {
    state.menuList = menuList;
    sessionStorage.setItem('menuList', JSON.stringify(menuList));
  },
  [PermissionMutationType.SET_FUNCTLIST](
    state: PermissionState,
    funcList: Array<string>
  ) {
    state.funcList = funcList;
    sessionStorage.setItem('funcList', JSON.stringify(funcList));
  },
  [PermissionMutationType.SET_ROLELIST](
    state: PermissionState,
    roleList: Array<RoleType>
  ) {
    state.roleList = roleList;
    sessionStorage.setItem('roleList', JSON.stringify(roleList));
  },
};
