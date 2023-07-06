import { RootState } from '@/store';
import { RouteLocationNormalized } from 'vue-router';
import { ActionContext, ActionTree } from 'vuex';
import { AppActionType } from './action-types';
import { AppMutationType } from './mutation-types';
import { CodeInfo, CodeType } from './state';
import { Mutations } from './mutations';
import * as sysApi from '@/apis/sys';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<PermissionState, RootState>, 'commit'>;

export interface Actions {
  [AppActionType.ACTION_SET_ACTIVEMENU](
    { commit }: AugmentedActionContext,
    route: RouteLocationNormalized
  ): void;
  [AppActionType.ACTION_SET_CODELIST](
    { commit }: AugmentedActionContext,
    codeList: CodeType<CodeInfo>
  ): void;
  [AppActionType.ACTION_SET_SIDEBARSTATUS](
    { commit }: AugmentedActionContext,
    sidebarStatus: boolean
  ): void;
}
export const actions: Actions & ActionTree<PermissionState, RootState> = {
  [AppActionType.ACTION_SET_ACTIVEMENU](
    { commit }: AugmentedActionContext,
    route: RouteLocationNormalized
  ) {
    commit(AppMutationType.SET_ACTIVEMENU, route);
  },
  async [AppActionType.ACTION_SET_CODELIST]({
    commit,
  }: AugmentedActionContext) {
    //获取码值
    const { data: _res } = await sysApi.getListCombo();
    const _codeList: CodeType<CodeInfo> = _res;
    await Object.keys(_codeList).forEach((item) => {
      if (_codeList[item]) {
        _codeList[item].forEach((k) => {
          if (!k.value) k.value = '';
        });
      }
    });
    //码值保存
    commit(AppMutationType.SET_CODELIST, _codeList);
  },
  [AppActionType.ACTION_SET_SIDEBARSTATUS](
    { commit }: AugmentedActionContext,
    sidebarStatus: boolean
  ) {
    commit(AppMutationType.SET_SIDEBARSTATUS, sidebarStatus);
  },
};
