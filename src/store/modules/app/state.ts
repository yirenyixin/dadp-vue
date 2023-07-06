import { RouteLocationNormalized } from 'vue-router';
//字典数据类型
export type CodeInfo = {
  value: any;
  content: any;
  parentValue: any;
};
//字典映射定义
export interface CodeType<T> {
  [key: string]: Array<T>;
}

export interface AppState {
  activeMenu: RouteLocationNormalized; //当前激活的菜单
  sidebarStatus: boolean; //侧边导航显隐
  codeList: CodeType<CodeInfo>; //码值
}

export const state: AppState = {
  activeMenu: {} as RouteLocationNormalized,
  sidebarStatus: true,
  codeList: {},
};
