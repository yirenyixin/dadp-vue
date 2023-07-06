<template>
  <div class="empty-page">
    <!-- <v-svg-icon :iconName="`#icon-new`" /> -->
    <el-empty :image="picUrl" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import loadFailed from '@/assets/svg/app/load-failed.svg';
import VSvgIcon from '@/components/global/v-svg-icon.vue';
export default defineComponent({
  name: 'error-page',
  setup() {
    VSvgIcon;
    const picUrl = loadFailed;
    return {
      picUrl,
    };
  },
});
</script>
<style lang="scss" scoped>
.empty-page {
  width: 100%;
  height: 100%;
  padding: 5vh 5vw;
  text-align: center;
  img {
    width: 100%;
    background-image: 100% 100%;
  }
  p {
    font-size: 14px;
    color: #409eff;
  }
}
</style>
