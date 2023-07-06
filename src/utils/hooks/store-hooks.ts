import {
  Mapper,
  ActionMethod,
  Computed,
  useStore,
  createNamespacedHelpers,
  mapGetters,
  mapState,
  mapActions,
} from 'vuex';
import { computed, ComputedRef } from 'vue';
//获取方式
const getMapFn = (
  getterCreatorFn: Mapper<Computed>,
  getterNames: Array<string>
) => {
  const data = {} as {
    [key: string]: ComputedRef<any>;
  };
  const fnsMap = getterCreatorFn(getterNames);
  getterNames.forEach((name) => {
    data[name] = computed(fnsMap[name].bind({ $store: useStore() }));
  });
  return data;
};
//vuex type
const useTypeFn = (
  type: string,
  moduleName: string | Array<string>,
  getterNames: Array<string>
) => {
  const fnTypes = {
    state: mapState,
    getters: mapGetters,
  } as { [key: string]: Mapper<Computed> };
  let mts: Mapper<Computed> = fnTypes[type];
  if (moduleName && !Array.isArray(moduleName)) {
    mts =
      createNamespacedHelpers(moduleName)[
        type === 'state' ? 'mapState' : 'mapGetters'
      ];
  } else {
    getterNames = moduleName as Array<string>;
  }
  return getMapFn(mts, getterNames);
};
//vuex getter
export const useGetters = (
  moduleName: string | Array<string>,
  getterNames: Array<string>
) => {
  return useTypeFn('getters', moduleName, getterNames);
};

//vuex state
export const useState = (
  moduleName: string | Array<string>,
  stateNames: Array<string>
) => {
  return useTypeFn('state', moduleName, stateNames);
};

//vuex 异步请求
export const useActions = (
  moduleName: string | Array<string> | Record<string, string>,
  actionNames: Array<string> | Record<string, string>
) => {
  let createFn = mapActions;
  if (typeof moduleName === 'string') {
    createFn = createNamespacedHelpers(moduleName).mapActions;
  } else {
    actionNames = moduleName as Array<string> | Record<string, string>;
  }
  let args = {} as Record<string, string>;
  if (Array.isArray(actionNames)) {
    actionNames.forEach((a) => (args[a] = a));
  } else {
    args = actionNames;
  }
  const fnsMap = createFn(args);
  const res = {} as { [key: string]: ActionMethod };
  for (const key in fnsMap) {
    res[key] = fnsMap[key].bind({ $store: useStore() });
  }
  return res;
};
