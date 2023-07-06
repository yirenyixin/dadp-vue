<template>
  <div class="code-info">
    <div class="code-info-left">
      <code-type ref="vTypeRef" @handelClick="getChildList"></code-type>
    </div>
    <div class="code-info-right">
      <code-type-info ref="vInfoRef"></code-type-info>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, nextTick, reactive, ref, toRefs } from 'vue';
import CodeTypeInfo from './components/code-type-list.vue';
import CodeType from './components/code-type.vue';
export default defineComponent({
  name: 'sysCodeInfo',
  components: {
    CodeTypeInfo,
    CodeType,
  },
  setup() {
    const vTypeRef = ref(null);
    const vInfoRef = ref(null);
    const dataMap = reactive({
      codeInfoId: '',
      getChildList(id: string) {
        dataMap.codeInfoId = id;
        nextTick(() => {
          (vInfoRef.value as any).initParams(id);
        });
      },
    });
    return {
      vTypeRef,
      vInfoRef,
      ...toRefs(dataMap),
    };
  },
});
</script>
<style lang="scss" scoped>
.code-info {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  &-left {
    height: 100%;
    margin-right: 6px;
    width: calc(45% - 6px);
  }
  &-right {
    height: 100%;
    margin-left: 6px;
    width: calc(55% - 6px);
  }
}
</style>
