<template>
  <div class="menu-item">
    <template v-if="!item.children || !item.children.length">
      <menu-item-link :to="item.path">
        <el-menu-item :index="item.path">
          <span>
            <v-svg-icon
              v-if="item.meta.icon"
              :iconName="
                item.meta.icon ? `#${item.meta.icon}` : '#menu-default'
              "
            />
            {{ item.meta.title }}
          </span>
        </el-menu-item>
      </menu-item-link>
    </template>
    <el-sub-menu v-else :index="item.path">
      <template #title>
        <span>
          <v-svg-icon
            :iconName="item.meta.icon ? `#${item.meta.icon}` : '#menu-default'"
          />
          {{ item.meta.title }}
        </span>
      </template>
      <template v-if="item.children && item.children.length">
        <menu-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { RouteRecordRaw, useRoute } from 'vue-router';
import MenuItemLink from './menu-item-link.vue';
export default defineComponent({
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true,
    },
    isCollapse: {
      type: Boolean,
      required: false,
    },
  },
  components: {
    MenuItemLink,
  },
  setup() {
    const route = useRoute();
    const activeMenu = computed(() => {
      const { path } = route;
      return path;
    });
    return {
      route,
      activeMenu,
    };
  },
});
</script>

<style lang="scss" scoped></style>
