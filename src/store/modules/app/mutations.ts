/*
 * @Author: yeshaofen
 * @Date: 2021-11-29 16:48:40
 * @LastEditTime: 2021-12-15 17:07:19
 * @LastEditors: yeshaofen
 * @Description:
 * @FilePath: /dadp-font/src/store/modules/app/mutations.ts
 */
import { RouteLocationNormalized } from 'vue-router';
import { MutationTree } from 'vuex';
import { AppMutationType } from './mutation-types';
import { AppState, CodeInfo, CodeType } from './state';

export type Mutations<S = AppState> = {
  [AppMutationType.SET_ACTIVEMENU](
    state: S,
    route: RouteLocationNormalized
  ): void;
  [AppMutationType.SET_CODELIST](state: S, codeList: CodeType<CodeInfo>): void;
  [AppMutationType.SET_SIDEBARSTATUS](state: S, sidebarStatus: boolean): void;
};

export const mutations: MutationTree<AppState> & Mutations = {
  [AppMutationType.SET_ACTIVEMENU](
    state: AppState,
    route: RouteLocationNormalized
  ) {
    state.activeMenu = route;
    sessionStorage.setItem('activeMenu', JSON.stringify(route));
  },
  [AppMutationType.SET_CODELIST](
    state: AppState,
    codeList: CodeType<CodeInfo>
  ) {
    state.codeList = codeList;
    sessionStorage.setItem('codeList', JSON.stringify(codeList));
  },
  [AppMutationType.SET_SIDEBARSTATUS](state: AppState, sidebarStatus: boolean) {
    state.sidebarStatus = sidebarStatus;
  },
};
