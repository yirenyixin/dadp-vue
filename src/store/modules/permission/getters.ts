import { RootState } from '@/store';
import { RouteRecordRaw } from 'vue-router';
import { GetterTree } from 'vuex';
import { MenuTreeType, PermissionState, RoleType } from './state';

export interface Getters {
  getAuthMenuList(state: PermissionState, _getters: Getters): MenuTreeType;
  getRoute(state: PermissionState, _getters: Getters): Array<RouteRecordRaw>;
  getFuncList(state: PermissionState, _getters: Getters): Array<string>;
  getRoleList(state: PermissionState, _getters: Getters): Array<RoleType>;
}
export const getters: Getters & GetterTree<PermissionState, RootState> = {
  getAuthMenuList(state: PermissionState, _getters: Getters): MenuTreeType {
    if (!state.menuList || !state.menuList.length) {
      const _menuList = sessionStorage.getItem('menuList') || '';
      state.menuList = _menuList ? JSON.parse(_menuList) : [];
    }
    return state.menuList;
  },
  getRoute(state: PermissionState, _getters: Getters): Array<RouteRecordRaw> {
    if (!state.dynamicRoutes || !state.dynamicRoutes.length) {
      const _dynamicRoutes = sessionStorage.getItem('dynamicRoutes') || '';
      state.dynamicRoutes = _dynamicRoutes ? JSON.parse(_dynamicRoutes) : [];
    }
    return state.dynamicRoutes;
  },
  getFuncList(state: PermissionState, _getters: Getters): Array<string> {
    if (!state.funcList || !state.funcList.length) {
      const _funcList = sessionStorage.getItem('funcList') || '';
      state.funcList = _funcList ? JSON.parse(_funcList) : [];
    }
    return state.funcList;
  },
  getRoleList(state: PermissionState, _getters: Getters): Array<RoleType> {
    if (!state.funcList || !state.funcList.length) {
      const _roleList = sessionStorage.getItem('roleList') || '';
      state.roleList = _roleList ? JSON.parse(_roleList) : [];
    }
    return state.roleList;
  },
};
