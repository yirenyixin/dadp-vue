import { ActionTree, ActionContext } from 'vuex';
import { RootState } from '@/store';
import { TagsViewState, TagView } from './state';
import { Mutations } from './mutations';
import { TagsMutationTypes } from './mutation-types';
import { TagsActionTypes } from './action-types';
type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<TagsViewState, RootState>, 'commit'>;

type NoAugmentedActionContext = {
  commit<K extends keyof Mutations>(key: K): ReturnType<Mutations[K]>;
} & Omit<ActionContext<TagsViewState, RootState>, 'commit'>;
export interface Actions {
  [TagsActionTypes.ACTION_ADD_VIEW](
    { commit }: AugmentedActionContext,
    view: TagView
  ): void;
  [TagsActionTypes.ACTION_DEL_VIEW](
    { commit }: AugmentedActionContext,
    view: TagView
  ): void;
  [TagsActionTypes.ACTION_DEL_ALL_VIEW]({
    commit,
  }: NoAugmentedActionContext): void;
}
export const actions: ActionTree<TagsViewState, RootState> & Actions = {
  [TagsActionTypes.ACTION_ADD_VIEW]({ commit }, view: TagView) {
    const { path, name, meta, fullPath } = view;
    const item = {
      path: path,
      name: name,
      meta: meta,
      fullpath: fullPath,
    };
    commit(TagsMutationTypes.ADD_VISITED_VIEW, item);
  },
  [TagsActionTypes.ACTION_DEL_VIEW]({ commit }, view: TagView) {
    commit(TagsMutationTypes.DEL_VISITED_VIEW, view);
  },
  [TagsActionTypes.ACTION_DEL_ALL_VIEW]({ commit }) {
    commit(TagsMutationTypes.DEL_ALL_CACHED_VIEWS);
  },
};
