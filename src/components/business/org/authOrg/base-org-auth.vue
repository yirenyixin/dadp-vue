<template>
  <el-dialog
    title="选择机构"
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    destroy-on-close
    :append-to-body="appendToBody"
    width="500px"
    @close="onClose"
  >
    <el-input
      placeholder="输入关键字进行搜索"
      class="filter"
      v-model="filterText"
    >
    </el-input>
    <el-scrollbar height="50vh">
      <el-tree
        :data="orgTreeData"
        :show-checkbox="multiple"
        :check-strictly="true"
        node-key="id"
        ref="orgSelectTreeRef"
        highlight-current
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        :filter-node-method="filterNode"
        :props="defaultProps"
      ></el-tree>
    </el-scrollbar>
    <template #footer>
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';
import { ElTree } from 'element-plus';
import * as sysApi from '@/apis/sys';
import { ListToTree, NodeTreeItem } from '@/utils/tools';
export default defineComponent({
  name: 'orgSelectDialog',
  props: {
    orgSelectVisible: {
      type: Boolean,
      default: false,
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    parentOrgId: {
      type: String,
      default: '',
    },
    defaultCheckedKeys: {
      type: Array,
    },
    isLawOrg: {
      type: String,
      default: '',
    },
  },
  emits: ['update:orgSelectVisible', 'getOrgSelectData'],
  setup(props: any, { emit }: any) {
    const dataMap = reactive({
      visible: computed({
        get: () => props.orgSelectVisible,
        set: (val) => {
          emit('update:orgSelectVisible', val);
        },
      }),
      defaultExpandedKeys: Array<string>(),
      defaultProps: {
        label: 'name',
        children: 'children',
      },
      orgList: Array<NodeTreeItem>(),
      orgTreeData: Array<NodeTreeItem>(),
      filterText: '',
      //获取机构列表并转为树形结构展示
      getTreeData: async () => {
        await sysApi
          .getOrgList({
            topOrgId: props.parentOrgId,
            isLawOrg: props.isLawOrg,
          })
          .then((res) => {
            const { data } = res;
            dataMap.orgList = data;
            dataMap.orgTreeData = ListToTree(data);
            data.forEach((item: any) => {
              if (item.open) dataMap.defaultExpandedKeys.push(item.id);
            });
          });
      },
      //关键字过滤
      filterNode: (value: any, data: NodeTreeItem) => {
        if (!value) return true;
        return data.name.indexOf(value) > -1;
      },
      handleOk: () => {
        let _orgSelectData = orgSelectTreeRef.value?.getCurrentNode();
        if (props.multiple) {
          //若为多选
          //第一个表示不返回当前选择的子节点数组，第二个表示返回值不包含半中间的节点
          _orgSelectData = orgSelectTreeRef.value.getCheckedNodes(false, false);
        }
        //getOrgSelectData方法中  返回的  id为机构id   name为机构名
        emit('getOrgSelectData', _orgSelectData);
        emit('update:orgSelectVisible', false);
      },
      onClose() {
        emit('update:orgSelectVisible', false);
      },
    });
    const orgSelectTreeRef = ref(ElTree);
    watch(
      () => dataMap.filterText,
      (val) => {
        (orgSelectTreeRef.value as any).filter(val);
      }
    );
    onMounted(() => {
      dataMap.getTreeData();
    });
    return {
      ...toRefs(dataMap),
      orgSelectTreeRef,
    };
  },
});
</script>

<style lang="scss" scoped></style>
