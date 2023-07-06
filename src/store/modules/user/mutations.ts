import { MutationTree } from 'vuex';
import { UserState, UserType } from './state';
import { UserMutationTypes } from './mutation-types';

export type Mutations<S = UserState> = {
  [UserMutationTypes.SET_USER_INFO](
    state: S,
    payload: Record<string, any>
  ): void;
};

export const mutations: MutationTree<UserState> & Mutations = {
  [UserMutationTypes.SET_USER_INFO](
    state: UserState,
    payload: Record<string, any>
  ) {
    state.userInfo = payload as UserType;
    sessionStorage.setItem('userInfo', JSON.stringify(payload));
  },
};
