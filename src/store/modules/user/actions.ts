import { ActionTree, ActionContext } from 'vuex';
import { UserState } from './state';
import { Mutations } from './mutations';
import { UserActionTypes } from './action-types';
import { RootState, store } from '@/store';
import { UserMutationTypes } from './mutation-types';
import { PermissionActionType } from '../permission/action-types';
import { RoleType } from '../permission/state';
import { removeToken, setToken } from '@/utils/http/auth';
import { AppActionType } from '../app/action-types';
import * as sysApi from '@/apis/sys';
type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<UserState, RootState>, 'commit'>;

export interface Actions {
  [UserActionTypes.ACTION_LOGIN](
    { commit }: AugmentedActionContext,
    userInfo: { username: string; password: string }
  ): void;
  [UserActionTypes.ACTION_CHANGE_ROLES](
    { commit }: AugmentedActionContext,
    role: RoleType
  ): void;
  [UserActionTypes.ACTION_LOGIN_OUT](): void;
}

export const actions: Actions & ActionTree<UserState, RootState> = {
  async [UserActionTypes.ACTION_LOGIN](
    { commit }: AugmentedActionContext,
    payload: { username: string; password: string }
  ) {
    //获取用户当前角色信息
    const { data: res } = await sysApi.login(payload);
    const { menuList, roleList, funcList, token, ...userInfo } = res;
    //设置token
    setToken(token);
    //保存用户信息
    commit(UserMutationTypes.SET_USER_INFO, userInfo as Record<string, any>);
    //请求用户当前角色菜单
    await store.dispatch(
      `permission/${PermissionActionType.ACTION_SET_MENULIST}`,
      menuList,
      { root: true }
    );
    //保存当前用户角色列表
    store.dispatch(
      `permission/${PermissionActionType.ACTION_SET_ROLELIST}`,
      roleList,
      { root: true }
    );
    //保存用户当前角色列表功能权限列表
    store.dispatch(
      `permission/${PermissionActionType.ACTION_SET_FUNCTLIST}`,
      funcList,
      { root: true }
    );
    //保存码值
    store.dispatch(
      `app/${AppActionType.ACTION_SET_CODELIST}`,
      {},
      { root: true }
    );
  },
  async [UserActionTypes.ACTION_CHANGE_ROLES](
    { commit }: AugmentedActionContext,
    payload: RoleType
  ) {
    const { roleId } = payload;
    //重新获取用户当前角色的信息
    const { data: res } = await sysApi.changeRole({ roleId: roleId });
    const { menuList, roleList, funcList, token, ...userInfo } = res;
    //重置token
    setToken(token);
    //保存用户信息
    commit(UserMutationTypes.SET_USER_INFO, userInfo as Record<string, any>);
    //请求用户当前角色菜单
    await store.dispatch(
      `permission/${PermissionActionType.ACTION_SET_MENULIST}`,
      menuList,
      { root: true }
    );
    //保存当前用户角色列表
    store.dispatch(
      `permission/${PermissionActionType.ACTION_SET_ROLELIST}`,
      roleList,
      { root: true }
    );
    //保存用户当前角色列表功能权限列表
    store.dispatch(
      `permission/${PermissionActionType.ACTION_SET_FUNCTLIST}`,
      funcList,
      { root: true }
    );
  },
  [UserActionTypes.ACTION_LOGIN_OUT]() {
    removeToken();
    //清空缓存
    localStorage.clear();
  }
};
