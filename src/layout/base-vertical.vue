<template>
  <div class="app-wrapper">
    <div class="app-wrapper-nav">
      <v-navbar />
    </div>
    <div class="app-wrapper-main" ref="appWrapperRef">
      <div :class="['app-main-menu', sidebarStatus ? '' : 'collapsed']">
        <vertical-menu />
      </div>
      <div
        :class="['app-main-content', sidebarStatus ? '' : 'collapsed-content']"
      >
        <div class="app-main-header">
          <div class="header-item-tags">
            <v-tagsview></v-tagsview>
          </div>
          <div class="header-item-bread">
            <el-icon v-if="sidebarStatus" @click="toggleStatus(false)">
              <fold />
            </el-icon>
            <el-icon v-else @click="toggleStatus(true)"><expand /></el-icon>
            <v-breadcrumb></v-breadcrumb>
          </div>
        </div>
        <div class="app-main-comp">
          <base-app />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AppActionType } from '@/store/modules/app/action-types';
import { useActions, useState } from '@/utils/hooks/store-hooks';
import { defineComponent, reactive, toRefs } from 'vue';
import {
  VNavbar,
  VerticalMenu,
  VBreadcrumb,
  VTagsview,
  BaseApp,
} from './components';
export default defineComponent({
  components: {
    VNavbar,
    VerticalMenu,
    VBreadcrumb,
    VTagsview,
    BaseApp,
  },
  setup() {
    const actionHooks = useActions('app', {
      toggleStatus: AppActionType['ACTION_SET_SIDEBARSTATUS'],
    });
    const appStates = useState('app', ['sidebarStatus']);
    //先默认面包屑导航风格后序修改
    const dataMap = reactive({
      toggleStatus: (status: boolean) => {
        actionHooks.toggleStatus(status);
      },
    });
    return {
      ...appStates,
      actionHooks,
      ...toRefs(dataMap),
    };
  },
});
</script>
<style lang="scss" scoped>
@import '@/theme-chalk/layout/layout-vertical.scss';
</style>
