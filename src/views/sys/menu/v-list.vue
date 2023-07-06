<template>
  <div class="sys-menu">
    <el-card header="当前菜单目录" shadow="never" class="sys-menu-left">
      <div class="button-group">
        <el-button type="primary" @click="addMenu">
          <el-icon>
            <circle-plus />
          </el-icon>
          新增
        </el-button>
        <el-button type="danger" @click="deleteMenu">
          <el-icon>
            <delete-filled />
          </el-icon>
          删除
        </el-button>
        <el-button @click="reflushTree">
          <el-icon>
            <refresh />
          </el-icon>
          刷新
        </el-button>
      </div>
      <el-scrollbar height="48vh">
        <el-tree
          ref="refMenuTree"
          :data="treeData"
          node-key="id"
          :props="defaultProps"
          :default-expanded-keys="expandedNodeList"
          @node-click="getNode"
          accordion
        />
      </el-scrollbar>
    </el-card>

    <el-card header="当前菜单详情" shadow="never" class="sys-menu-right">
      <div class="menu-box-from">
        <el-form
          ref="refMenuForm"
          :model="formData"
          :rules="menuFromRules"
          label-width="120px"
          label-position="right"
        >
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item label="菜单Id" prop="menuId">
                <el-input
                  v-model="formData.menuId"
                  :disabled="operType === 'update'"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级菜单ID" prop="parentMenuId">
                <el-input
                  v-model="formData.parentMenuId"
                  :disabled="operType === 'update'"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="formData.menuName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单URL" prop="menuUrl">
                <el-input v-model="formData.menuUrl"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item label="菜单图标" prop="imageUrl">
                <el-select
                  v-model="formData.imageUrl"
                  filterable
                  placeholder="Select"
                >
                  <el-option
                    v-for="item in menuIcons"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <template #default>
                      <span>
                        <svg class="icon-svg" aria-hidden="true">
                          <use v-bind:xlink:href="`#${item.label}`"></use>
                        </svg>
                        {{ item.label }}
                      </span>
                    </template>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序号" prop="sortNo" style="float: left">
                <el-input-number v-model="formData.sortNo"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-form-item label="是否显示" prop="isShow">
                <el-select v-model="formData.isShow" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in getCodeList['yesOrNo']"
                    :key="index"
                    :label="item.content"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否绝对路径" prop="isAllPath">
                <el-select v-model="formData.isAllPath" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in getCodeList['yesOrNo']"
                    :key="index"
                    :label="item.content"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="formData.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row>
          <el-col :span="24" style="text-align: right">
            <el-button type="primary" @click="saveFn">
              <el-icon>
                <document-add />
              </el-icon>
              保存
            </el-button>
            <el-button @click="resetForm">
              <el-icon>
                <refresh-right />
              </el-icon>
              重置
            </el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import * as sysApi from '@/apis/sys';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useGetters } from '@/utils/hooks/store-hooks';
import { ListToTree, NodeTreeItem } from '@/utils/tools/index';
import { resetFields } from '@/utils/plugin/global';
import { selectIcons, editFormRules } from './menu-hook';
export default defineComponent({
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
      menuFromRules: editFormRules,
      menuList: Array<NodeTreeItem>(),
      treeData: Array<NodeTreeItem>(),
      expandedNodeList: Array<string>(),
      operType: '',
      menuIcons: selectIcons,
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
            await sysApi[apiName]({ ...dataMap.formData });
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
          .then(() => {
            sysApi
              .deleteMenu({ menuId: node.id })
              .then(() => {
                ElMessage.success('删除成功');
                methodsMap.resetForm();
                methodsMap.getMenuList();
              })
              .catch(() => {
                console.log('error');
              });
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
        let param = { menuId: nodeData.id };
        const { data: res } = await sysApi.getMenu(param);
        dataMap.formData = res;
        dataMap.operType = 'update';
      },
      //获取菜单列表
      getMenuList: async () => {
        const { data: res } = await sysApi.getMenuList({ topMenuId: '' });
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
.sys-menu {
  width: 100%;
  height: 100%;
  display: flex;
  .sys-menu-left {
    width: 36%;
    margin-right: 16px;
    height: 100%;
    .button-group {
      width: 100%;
      height: 48px;
    }
  }
  .sys-menu-right {
    width: calc(64% - 16px);
    height: 100%;
  }
}
.icon-svg {
  float: left;
  margin: 8px 4px;
  width: 16px;
  height: 16px;
  fill: currentColor;
  overflow: hidden;
}
</style>
