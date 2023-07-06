<template>
  <div class="horizontal-menu">
    <el-menu
      :default-active="activeMenu"
      mode="horizontal"
      :text-color="'#fff'"
      active-text-color="#1D70F5"
      :background-color="'#04336a'"
    >
      <menu-item
        v-for="item in getAuthMenuList"
        :key="item.path"
        :item="item"
      />
    </el-menu>
  </div>
</template>

<script lang="ts">
import { AppActionType } from '@/store/modules/app/action-types';
import { useActions, useGetters, useState } from '@/utils/hooks/store-hooks';
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import MenuItem from './menu-item.vue';
export default defineComponent({
  components: {
    MenuItem,
  },
  setup(props) {
    const appStates = useState('app', ['sidebarStatus', 'activeMenu']);
    const permissionGetters = useGetters('permission', ['getAuthMenuList']);
    const appActions = useActions('app', {
      setActiveMenu: AppActionType['ACTION_SET_ACTIVEMENU'],
    });
    const route = useRoute();
    const dataMap = reactive({
      activeMenu: computed(() => {
        const { path } = route;
        return path;
      }),
    });

    return {
      ...appStates,
      ...permissionGetters,
      appActions,
      ...toRefs(dataMap),
    };
  },
});
</script>
<style lang="scss" scoped>
@import '@/theme-chalk/layout/menu/menu-horizontal.scss';
</style>
