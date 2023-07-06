import { MutationTree } from 'vuex';
import { TagsViewState, TagView } from './state';
import { TagsMutationTypes } from './mutation-types';

export type Mutations<S = TagsViewState> = {
  [TagsMutationTypes.ADD_VISITED_VIEW](state: S, view: TagView): void;
  [TagsMutationTypes.DEL_VISITED_VIEW](state: S, view: TagView): void;
  [TagsMutationTypes.DEL_ALL_CACHED_VIEWS](state: S): void;
};

export const mutations: MutationTree<TagsViewState> & Mutations = {
  [TagsMutationTypes.ADD_VISITED_VIEW](state: TagsViewState, view: TagView) {
    if (state.visitedViews.some((v) => v.path === view.path)) return;
    state.visitedViews.splice(1, 0, view);
  },
  [TagsMutationTypes.DEL_VISITED_VIEW](state: TagsViewState, view: TagView) {
    state.visitedViews = state.visitedViews.filter((k) => k.path != view.path);
  },
  [TagsMutationTypes.DEL_ALL_CACHED_VIEWS](state: TagsViewState) {
    state.visitedViews = [];
  },
};
