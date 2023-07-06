import { RootState } from '@/store';
import { GetterTree } from 'vuex';
import { TagsViewState } from './state';

export interface Getters {
  getTagsViews(state: TagsViewState, _getters: Getters): Record<string, any>;
}
export const getters: Getters & GetterTree<TagsViewState, RootState> = {
  //获取访问路由记录
  getTagsViews(state: TagsViewState, _getters: Getters) {
    if (!state.visitedViews || !state.visitedViews.length) {
      const _visitedViews = sessionStorage.getItem('tagsview') || '';
      if (!_visitedViews) {
        state.visitedViews = JSON.parse(_visitedViews);
      }
    }
    return state.visitedViews;
  },
};
