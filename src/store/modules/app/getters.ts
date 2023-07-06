import { RootState } from '@/store';
import { GetterTree } from 'vuex';
import { AppState, CodeInfo, CodeType } from './state';

export interface Getters {
  getCodeList(state: AppState, _getters: Getters): CodeType<CodeInfo>;
  getSidebarStatus(state: AppState, _getters: Getters): boolean;
}
export const getters: Getters & GetterTree<AppState, RootState> = {
  //获取码值
  getCodeList(state: AppState, _getters: Getters): CodeType<CodeInfo> {
    const originData = sessionStorage.getItem('codeList');
    const parsedInfo = originData ? JSON.parse(originData as string) : '';
    return parsedInfo || {};
  },
  //获取侧边菜单栏显隐
  getSidebarStatus(state: AppState, _getters: Getters): boolean {
    return state.sidebarStatus;
  },
};
