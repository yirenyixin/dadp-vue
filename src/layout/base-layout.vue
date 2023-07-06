<template>
  <div class="app-box" ref="appRef">
    <base-horizontal v-if="homeType === 'hor'"></base-horizontal>
    <base-vertical v-else></base-vertical>
  </div>
</template>

<script lang="ts">
import { useGetters } from '@/utils/hooks/store-hooks';
import { getmark } from '@/utils/tools/use-watermark';
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
} from 'vue';
import BaseHorizontal from './base-horizontal.vue';
import BaseVertical from './base-vertical.vue';
export default defineComponent({
  components: {
    BaseHorizontal,
    BaseVertical,
  },
  setup() {
    const userGetters = useGetters('user', ['getUserInfo']);
    const appRef = ref(null);
    //横纵菜单
    const dataMap = reactive({
      homeType: computed(() => {
        return userGetters.getUserInfo.value.homeUrl === '1' ? 'hor' : 'ver';
      }),
      setWatermark: () => {
        const { watermark } = getmark();
        const userInfo = userGetters.getUserInfo.value;
        const text = `${userInfo.orgName}-${userInfo.roleName}-${userInfo.userName}`;
        watermark(appRef.value as any, text);
      },
    });
    onMounted(() => {
      dataMap.setWatermark();
    });
    return {
      appRef,
      ...userGetters,
      ...toRefs(dataMap),
    };
  },
});
</script>
<style lang="scss" scoped>
.app-box {
  width: 100%;
  height: 100%;
}
</style>
