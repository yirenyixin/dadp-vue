<template>
  <div class="custom-tree-node-container">
    <el-scrollbar height="65vh">
      <el-tree
        ref="powerTreeRef"
        :data="dataSource"
        show-checkbox
        node-key="id"
        highlight-current
        default-expand-all
        :check-strictly="true"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        :props="{ label: 'name', children: 'children' }"
      />
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { ElForm, ElMessage } from 'element-plus';
import { defineComponent, ref, toRefs, reactive, watch, onMounted } from 'vue';
import * as sysApi from '@/apis/sys';
import { ListToTree, NodeTreeItem } from '@/utils/tools';
export default defineComponent({
  name: 'PowerDialog',
  props: {
    opType: {
      type: String,
      default: '',
    },
    msgInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['handleFn', 'close'],
  setup(props, { emit }) {
    const powerTreeRef = ref(ElForm);
    const dataMap = reactive({
      dataSource: Array<NodeTreeItem>(),
      defaultExpandedKeys: Array<string>(),
      defaultCheckedKeys: Array<string>(),
      //获取选中项
      getCheckedKeys: async () => {
        const checkKeys = await powerTreeRef.value.getCheckedKeys();
        return checkKeys;
      },
      //保存
      savePowerConfig: async () => {
        const checkKeys = await dataMap.getCheckedKeys();
        const { msg } = await sysApi.authRoleSave({
          roleId: props.msgInfo.roleId,
          menuOrFuncIds: checkKeys.join(','),
        });
        ElMessage({
          type: 'success',
          message: msg,
        });
        emit('handleFn');
      },
      //获取权限列表
      getPowerList: async () => {
        const { data: res } = await sysApi.authRoleList({
          roleId: props.msgInfo.roleId,
        });
        dataMap.dataSource = ListToTree(res);
        const defaultKeys: Array<string> = [];
        const defaultCheck: Array<string> = [];
        res.forEach((item: any) => {
          if (item.check) {
            defaultCheck.push(item.id);
          }
          if (item.open) {
            defaultKeys.push(item.id);
          }
        });
        dataMap.defaultExpandedKeys = defaultKeys;
        dataMap.defaultCheckedKeys = defaultCheck;
      },
    });
    onMounted(() => {
      dataMap.getPowerList();
    });
    return {
      powerTreeRef,
      ...toRefs(dataMap),
    };
  },
});
</script>
<style lang="scss">
.el-tree-node.is-expanded.is-penultimate > .el-tree-node__children {
  display: flex;
  flex-direction: row;
}
</style>
