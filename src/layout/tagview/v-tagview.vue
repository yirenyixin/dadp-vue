<template>
  <div class="tags-view">
    <div class="tags-view-button">
      <el-icon><arrow-left-bold /></el-icon>
    </div>
    <el-scrollbar style="width: calc(100% - 42px)">
      <div class="tags-view-route">
        <div
          v-for="tag in visitedViews"
          :key="tag.path"
          :class="[
            'route-item',
            currentRoute.path === tag.path ? 'route-item-active' : '',
          ]"
        >
          <el-tag
            :closable="tag.path.indexOf('/default') > -1 ? false : true"
            :disable-transitions="false"
            @close="closeSelectedTag(tag)"
          >
            <router-link
              ref="tag"
              :key="tag.path"
              :to="{ path: tag.path, fullPath: tag.fullPath }"
            >
              <span>{{ tag.meta.title }}</span>
            </router-link>
          </el-tag>
        </div>
      </div>
    </el-scrollbar>
    <div class="tags-view-button" style="margin-right: 6px">
      <el-icon><arrow-right-bold /></el-icon>
    </div>
    <div class="tags-view-button" @click="closeSAllFn">
      <el-icon><circle-close /></el-icon>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeMount,
  reactive,
  toRefs,
  watch,
} from 'vue';
import { TagView } from '@/store/modules/tagsview/state';
import { useActions, useState } from '@/utils/hooks/store-hooks';
import { TagsActionTypes } from '@/store/modules/tagsview/action-types';
import { useRouter, useRoute } from 'vue-router';
export default defineComponent({
  setup() {
    const router = useRouter();
    const currentRoute = useRoute();
    const tagsViewState = useState('tagsView', ['visitedViews']);
    const actionHooks = useActions('tagsView', {
      addTags: TagsActionTypes['ACTION_ADD_VIEW'],
      closeTags: TagsActionTypes['ACTION_DEL_VIEW'],
      closeAllTags: TagsActionTypes['ACTION_DEL_ALL_VIEW'],
    });

    const methodsMap = reactive({
      //移除所有标签
      closeSAllFn: async () => {
        await actionHooks.closeAllTags();
        currentRoute.path === '/default' ? '' : router.push('/default');
      },
      //移除标签
      closeSelectedTag: async (view: TagView) => {
        await actionHooks.closeTags(view);
        view.path === currentRoute.path ? router.push('/default') : '';
      },
    });
    //访问的路由
    const visitedViews = computed(() => {
      return tagsViewState.visitedViews;
    });
    const addTags = () => {
      actionHooks.addTags(currentRoute);
    };
    watch(
      () => currentRoute.name,
      () => {
        if (currentRoute.name != 'Login') {
          addTags();
        }
      }
    );
    onBeforeMount(() => {
      addTags();
    });
    return {
      visitedViews,
      currentRoute,
      ...tagsViewState,
      ...toRefs(methodsMap),
      actionHooks,
      addTags,
    };
  },
});
</script>
<style lang="scss" scoped>
@import '@/theme-chalk/layout/tagsView/index.scss';
</style>
