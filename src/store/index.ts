import { createStore } from 'vuex';
import user from './modules/user';
import permission from './modules/permission';
import app from './modules/app';
import tagsView from './modules/tagsview';
import { UserState } from './modules/user/state';
import { PermissionState } from './modules/permission/state';
import { AppState } from './modules/app/state';
import { TagsViewState } from './modules/tagsview/state';

export type RootState = {
  user: UserState;
  permission: PermissionState;
  app: AppState;
  tagsView: TagsViewState;
};

export const store = createStore({
  modules: {
    //用户
    user: {
      namespaced: true,
      ...user,
    },
    //权限
    permission: {
      namespaced: true,
      ...permission,
    },
    //全局
    app: {
      namespaced: true,
      ...app,
    },
    //导航标签
    tagsView: {
      namespaced: true,
      ...tagsView,
    },
  },
});
