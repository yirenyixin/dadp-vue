<template>
  <div class="breadcrumb-box">
    <el-breadcrumb class="app-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.menuId">
        <span>{{ item.menuName }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { useGetters } from '@/utils/hooks/store-hooks';
import { defineComponent, reactive, toRefs, watch } from 'vue';
import { useRoute } from 'vue-router';
export default defineComponent({
  setup() {
    const currentRoute = useRoute();
    const permissionGetters = useGetters('permission', ['getRoute']);
    const state = reactive({
      breadcrumbs: [] as Array<any>,
      pushRoute: (item: any, arr: Array<any>): Array<any> => {
        let newArr: Array<any> = [item].concat(arr);
        if (!item.parentMenuId) {
          return newArr;
        } else {
          let routeList = permissionGetters.getRoute.value;
          let _route = routeList.filter(
            (k: any) => k.menuId === item.parentMenuId
          )[0];
          return state.pushRoute(_route, newArr);
        }
      },
      getBreadcrumb: async () => {
        state.breadcrumbs = [];
        let routeList = permissionGetters.getRoute.value;
        if (currentRoute.fullPath === '/default') {
          state.breadcrumbs = [
            {
              imageUrl: '',
              isAllPath: '1',
              isLeaf: true,
              isShow: '1',
              menuId: 'default',
              menuName: '首页',
              menuUrl: currentRoute.path,
              parentMenuId: null,
              remark: '',
              sortNo: 0,
              ver: 2,
            },
          ];
          return;
        }
        let _route = routeList.filter(
          (k: any) => k.menuUrl === currentRoute.fullPath
        )[0];
        state.breadcrumbs = state.pushRoute(_route, []);
      },
    });
    state.getBreadcrumb();
    watch(
      () => currentRoute.path,
      (_path) => {
        state.getBreadcrumb();
      }
    );
    return {
      ...toRefs(state),
      currentRoute,
    };
  },
});
</script>



