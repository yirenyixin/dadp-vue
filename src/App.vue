<template>
  <div id="app" ref="appRef">
    <el-config-provider :locale="locale">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
let locale = zhCn;
</script>
<style lang="scss">
html {
  font-size: 14px;
}
body {
  margin: 0;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
</style>