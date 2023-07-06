<template>
  <div>
    <h1>User Details</h1>
    <p>User ID: {{ viewUserId }}</p>
    <!-- 其他用户数据的显示 -->
  </div>
</template>

<script>
import * as sysApi from '@/apis/sys';
export default {
  props: {
    viewUserId: {
      type: String,
      required: true
    }
    // 其他用户数据的定义
  },
  // 组件的其他逻辑和生命周期钩子
}
</script>

<style>
/* 可以根据需要添加样式 */
</style>
