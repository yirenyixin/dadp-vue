import { RootState } from '@/store';
import { GetterTree } from 'vuex';
import { UserState } from './state';

export interface Getters {
  getUserInfo(state: UserState, _getters: Getters): Record<string, any>;
}
export const getters: Getters & GetterTree<UserState, RootState> = {
  getUserInfo(state: UserState, _getters: Getters) {
    if (!state.userInfo || !state.userInfo.userId) {
      const sUserInfo = sessionStorage.getItem('userInfo') || '';
      if (sUserInfo) {
        state.userInfo = JSON.parse(sUserInfo);
      }
    }
    return state.userInfo;
  },
};
