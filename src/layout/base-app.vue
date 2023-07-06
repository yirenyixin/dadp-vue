<template>
  <section class="app-main">
    <router-view v-slot="{ Component }" :class="{ collapsed: !sidebarStatus }">
      <template v-if="Component">
        <transition mode="out-in">
          <suspense>
            <keep-alive :include="visitedViews">
              <component :is="Component" :key="$route.path" />
            </keep-alive>
            <template #fallback>
              <div>Loading...</div>
            </template>
          </suspense>
        </transition>
      </template>
    </router-view>
  </section>
</template>

<script lang="ts">
import { useState } from '@/utils/hooks/store-hooks';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const states = useState('app', ['sidebarStatus']);
    const tagsViewState = useState('tagsView', ['visitedViews']);
    //访问的路由
    const visitedViews = computed(() => {
      let keepAliveList: Array<string> = [];
      tagsViewState.visitedViews.value.forEach((item: any) => {
        const { name } = item;
        keepAliveList.push(name);
      });
      return keepAliveList;
    });
    return {
      visitedViews,
      ...states,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-main {
  width: calc(100% - 24px);
  height: calc(100% - 32px);
  overflow: hidden;
  background: #fff;
  padding: 16px 12px;
}
</style>
