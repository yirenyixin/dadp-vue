<template>
  <div class="func-box">
    <div class="func-box-left">
      <el-card header="菜单目录">
        <el-scrollbar height="55vh">
          <el-tree
            :props="defaultProps"
            :data="menuTreeData"
            node-key="id"
            @node-click="getNode"
          ></el-tree>
        </el-scrollbar>
      </el-card>
    </div>
    <div class="func-box-right">
      <el-card header="功能列表">
        <v-dynamic-grid
          ref="dynamicGirdRef"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :total="total"
          :isSelect="true"
          v-model:currentPage="pageNo"
          v-model:pageSize="pageSize"
          @selection-change="handleSelectionChange"
          @size-change="getFuncList"
          @current-change="getFuncList"
        >
          <template #tableBtns>
            <div class="button-group-left">
              <el-button type="primary" @click="addFunc"
                ><el-icon><circle-plus /></el-icon> 新增</el-button
              >
              <el-button type="warning" @click="editFunc"
                ><el-icon><edit /></el-icon> 修改</el-button
              >
              <el-button type="danger" @click="delFunc"
                ><el-icon><delete-filled /></el-icon> 删除</el-button
              >
            </div>
          </template>
        </v-dynamic-grid>
      </el-card>
    </div>
    <func-dialog
      v-if="dialogVisible"
      v-model:dialogVisible="dialogVisible"
      :dialogTitle="dialogTitle"
      :optionType="optionType"
      :dialogInfo="dialogInfo"
      @updateList="getFuncList"
    ></func-dialog>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, ref, toRefs } from 'vue';
import * as sysApi from '@/apis/sys';
import { ListToTree, NodeTreeItem } from '@/utils/tools';
import { funcColumns, RowType } from './func-hook';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import FuncDialog from './func-dialog.vue';
export default {
  name: 'sysFunc',
  components: { FuncDialog },
  setup() {
    const dynamicGirdRef = ref(null);
    const dataMap = reactive({
      defaultProps: {
        label: 'name',
        children: 'children',
      },
      menuTreeData: Array<NodeTreeItem>(),
      tableColumns: funcColumns,
      tableData: Array<RowType>(),
      pageNo: 1,
      pageSize: 10,
      total: 0,
      currenNodeId: '',
      dialogVisible: false,
      dialogTitle: '',
      optionType: '',
      dialogInfo: {},
      selectRows: Array<RowType>(),
    });
    const methodsMap = reactive({
      handleSelectionChange(val: Array<RowType>) {
        dataMap.selectRows = val;
      },
      //删除
      delFunc: () => {
        if (dataMap.selectRows.length) {
          const selectRows: Array<string> = [];
          dataMap.selectRows.forEach((k) => {
            selectRows.push(k.funcId as string);
          });
          ElMessageBox.confirm(
            `确认删除id为${selectRows.join(',')}的功能模块吗？`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(async () => {
              await sysApi.delFunc({ funcIds: selectRows.join(',') });
              methodsMap.getFuncList(true);
            })
            .catch(() => {
              ElNotification({
                type: 'info',
                message: '已取消删除',
              });
            });
        } else {
          ElMessage({
            type: 'warning',
            message: '请选择需要删除的项',
          });
        }
      },
      //编辑
      editFunc: () => {
        if (dataMap.selectRows.length == 0) {
          ElMessage({
            type: 'warning',
            message: '请选择一条记录',
          });
          return;
        } else if (dataMap.selectRows.length > 1) {
          ElMessage({
            type: 'warning',
            message: '只能选择一条记录',
          });
          return;
        } else {
          const selectRows = [...dataMap.selectRows];
          dataMap.dialogTitle = '修改功能';
          dataMap.optionType = 'update';
          dataMap.dialogInfo = selectRows[0];
          dataMap.dialogVisible = true;
        }
      },
      //新增功能
      addFunc: () => {
        if (!dataMap.currenNodeId) {
          ElMessage({
            type: 'warning',
            message: '请先选择菜单',
          });
          return;
        }
        dataMap.dialogTitle = '新增功能';
        dataMap.optionType = 'add';
        dataMap.dialogInfo = {
          funcId: '',
          funcName: '',
          icon: '',
          menuId: dataMap.currenNodeId,
          sortNo: 0,
          ver: 0,
        };
        dataMap.dialogVisible = true;
      },
      //获取功能列表
      getFuncList: async (doInit = false) => {
        dataMap.pageNo = doInit ? 1 : dataMap.pageNo;
        dataMap.pageSize = doInit ? 10 : dataMap.pageSize;

        let params = {
          pageNo: dataMap.pageNo,
          pageSize: dataMap.pageSize,
          menuId: dataMap.currenNodeId,
        };
        const { data: res } = await sysApi.getFuncList(params);
        dataMap.tableData = res.rows;
        dataMap.total = res.total;
      },
      //获取菜单下的节点
      getNode: (data: NodeTreeItem) => {
        (dataMap.pageNo = 1), (dataMap.pageSize = 10), (dataMap.total = 0);
        dataMap.currenNodeId = data.id as string;
        if (!data.hasChild) methodsMap.getFuncList(true);
      },
      //获取菜单
      getMenuList: async () => {
        const { data: res } = await sysApi.getMenuList({});
        dataMap.menuTreeData = ListToTree(res);
      },
    });
    onMounted(() => {
      methodsMap.getMenuList();
    });
    return {
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
      dynamicGirdRef,
    };
  },
};
</script>

<style lang="scss" scoped>
.func-box {
  width: 100%;
  height: 100%;
  display: flex;
  .func-box-left {
    width: 40%;
    height: 100%;
    margin-right: 16px;
    .el-card {
      height: 100%;
    }
  }
  .func-box-right {
    width: calc(60% - 16px);
    height: 100%;
    .el-card {
      height: 100%;
      :deep(.el-card__body) {
        height: calc(100% - 80px) !important;
      }
    }
  }
}
</style>
