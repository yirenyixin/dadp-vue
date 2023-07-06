import { RootState } from '@/store';
import * as sysApi from '@/apis/sys';
import { ActionContext, ActionTree } from 'vuex';
import { PermissionActionType } from './action-types';
import { PermissionMutationType } from './mutation-types';
import { MenuTreeType, PermissionState, RoleType } from './state';
import { Mutations } from './mutations';
import { ListToTree } from '@/utils/tools/index';
import { resetRouter } from '@/router';
import { getAuthMenuList, ItemType } from '@/utils/hooks/menu-hook';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<PermissionState, RootState>, 'commit'>;

export interface Actions {
  [PermissionActionType.ACTION_SET_MENULIST](
    { commit }: AugmentedActionContext,
    menuList: Array<ItemType>
  ): void;
  [PermissionActionType.ACTION_SET_FUNCTLIST](
    { commit }: AugmentedActionContext,
    funcList: Array<string>
  ): void;
  [PermissionActionType.ACTION_SET_ROLELIST](
    { commit }: AugmentedActionContext,
    roleList: Array<RoleType>
  ): void;
}
export const actions: Actions & ActionTree<PermissionState, RootState> = {
  async [PermissionActionType.ACTION_SET_MENULIST](
    { commit }: AugmentedActionContext,
    menuList: Array<ItemType>
  ) {
    //保存当前角色菜单
    const _menuList = ListToTree(getAuthMenuList(menuList));
    commit(PermissionMutationType.SET_MENULIST, _menuList as MenuTreeType);
    //重置路由
    resetRouter();
    //保存权限路由
    commit(PermissionMutationType.SET_ROUTE, menuList as any);
  },
  [PermissionActionType.ACTION_SET_FUNCTLIST](
    { commit }: AugmentedActionContext,
    funcList: Array<string>
  ) {
    commit(PermissionMutationType.SET_FUNCTLIST, funcList);
  },
  async [PermissionActionType.ACTION_SET_ROLELIST](
    { commit }: AugmentedActionContext,
    roleList: Array<RoleType>
  ) {
    commit(PermissionMutationType.SET_ROLELIST, roleList);
  }
};
