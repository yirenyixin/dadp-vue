<template>
  <div class="demo-box">
    <v-empty/>
  </div>
</template>
<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import * as sysApi from '@/apis/sys';
import {ElMessage, ElMessageBox} from 'element-plus';
import {useGetters} from '@/utils/hooks/store-hooks';
import {ListToTree, NodeTreeItem} from '@/utils/tools/index';
import {resetFields} from '@/utils/plugin/global';
import {validateMenuPath} from '@/utils/tools/validator';
import VEmpty from '@/views/no-fund/v-empty.vue';

export default defineComponent({
  name: 'demoDashboard',
  components: {VEmpty},
  setup() {
    const refMenuForm = ref(null);
    const refMenuTree = ref(null);
    const appGetters = useGetters('app', ['getCodeList']);
    const dataMap = reactive({
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      formData: {
        menuId: '',
        menuName: '',
        menuUrl: '',
        imageUrl: '',
        parentMenuId: '',
        isAllPath: '1',
        isShow: '1',
        sortNo: 0,
        remark: '',
      },
      menuFromRules: {
        menuId: [
          {required: true, message: '请输入菜单ID', trigger: 'blur'},
          {max: 32, message: '长度在32个字符以内', trigger: 'blur'},
        ],
        menuName: [
          {required: true, message: '请输入菜单名称', trigger: 'blur'},
          {max: 100, message: '长度在100个字符以内', trigger: 'blur'},
        ],
        menuUrl: [
          {required: true, message: '请输入菜单路径', trigger: 'blur'},
          {
            validator: validateMenuPath,
            message: '菜单路径应为/xx 或 /xx-xx等格式',
            trigger: 'blur',
          },
        ],
        isAllPath: [
          {required: true, message: '请选择是否绝对路径', trigger: 'blur'},
        ],
        isShow: [
          {required: true, message: '请选择是否显示', trigger: 'blur'},
        ],
        sortNo: [{required: true, message: '请输入排序号', trigger: 'blur'}],
      },
      menuList: Array<NodeTreeItem>(),
      treeData: Array<NodeTreeItem>(),
      expandedNodeList: Array<string>(),
      operType: '',
      menuIcons: [
        {
          value: 'menu-default',
          label: 'menu-default',
        },
        {
          value: 'menu-marke-mg',
          label: 'menu-marke-mg',
        },
        {
          value: 'menu-mg-index',
          label: 'menu-mg-index',
        },
        {
          value: 'menu-workbetch',
          label: 'menu-workbetch',
        },
        {
          value: 'menu-mg-index',
          label: 'menu-mg-index',
        },
      ],
    });
    const methodsMap = reactive({
      //重置
      resetForm: () => {
        resetFields(dataMap.formData);
      },
      //刷新
      reflushTree: () => {
        resetFields(dataMap.formData);
        methodsMap.getMenuList();
      },
      //保存菜单
      saveFn: async () => {
        (refMenuForm.value as any).validate(async (valid: any) => {
          if (valid) {
            let apiName = dataMap.operType === 'add' ? 'addMenu' : 'updateMenu';
            await sysApi[apiName]({...dataMap.formData});
            let msg = dataMap.operType === 'add' ? '新增成功！' : '修改成功！';
            ElMessage({
              type: 'success',
              message: msg,
            });
            methodsMap.resetForm();
            methodsMap.getMenuList();
            const defaultExpend: Array<string> = [];
            defaultExpend.push(dataMap.formData.menuId);
            dataMap.expandedNodeList = defaultExpend;
          } else {
            return false;
          }
        });
      },
      //删除
      deleteMenu: () => {
        //获取当前选中节点
        let node: NodeTreeItem = (refMenuTree.value as any).getCurrentNode();
        if (!node || !node.id) {
          ElMessage.warning('请选择要删除的菜单');
          return false;
        }
        //判断该节点是否存在子节点
        if (node.hasChild) {
          ElMessage.warning('所选菜单存在子菜单,无法删除');
          return false;
        }
        ElMessageBox.confirm('确认删除所选菜单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
            .then(async () => {
              const {data: res} = await sysApi.deleteMenu({menuId: node.id});
              ElMessage.success(res.msg);
              methodsMap.resetForm();
              methodsMap.getMenuList();
            })
            .catch(() => {
              ElMessage.info({
                message: '操作已取消',
              });
            });
      },
      //新增菜单
      addMenu: () => {
        methodsMap.resetForm();
        dataMap.formData.isAllPath = '1';
        dataMap.formData.isShow = '1';
        let node: NodeTreeItem = (refMenuTree.value as any).getCurrentNode();
        dataMap.formData.parentMenuId = node == null ? '' : (node.id as string);
        dataMap.operType = 'add';
      },
      //获取当前选中节点
      getNode: async (nodeData: NodeTreeItem) => {
        let param = {menuId: nodeData.id};
        const {data: res} = await sysApi.getMenu(param);
        dataMap.formData = res;
        dataMap.operType = 'update';
      },
      //获取菜单列表
      getMenuList: async () => {
        const {data: res} = await sysApi.getMenuList({topMenuId: ''});
        dataMap.menuList = res;
        dataMap.expandedNodeList = [];
        dataMap.treeData = ListToTree(res);
      },
    });
    onMounted(() => {
      methodsMap.getMenuList();
    });
    return {
      ...appGetters,
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
      refMenuForm,
      refMenuTree,
    };
  },
});
</script>
<style lang="scss" scoped>
.menu-box {
  background: #fff;
  width: 100%;
  height: 100%;

  :deep(.el-main) {
    padding: 0 12px;
    width: 100%;
  }
}

:deep(.el-card) {
  height: 100% !important;
}

:deep(.el-tree) {
  .el-tree-node__label {
    font-size: 16px;
  }

  .el-tree-node__content {
    height: 30px !important;
  }
}

.menu-box-from {
  width: 80%;
  text-align: left;
}

.icon-svg {
  float: left;
  margin: 8px 4px;
  width: 18px;
  height: 18px;
  fill: currentColor;
  overflow: hidden;
}

.el-form-button {
  :deep(.el-form-item .el-form-item__content) {
    float: center;
  }
}
</style>
