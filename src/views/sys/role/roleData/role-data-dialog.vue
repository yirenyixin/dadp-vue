<template>
  <el-dialog
    title="分配数据权限"
    v-model="dataVisible"
    width="75vw"
    destroy-on-close
    @closed="onClose"
  >
    <div class="data-dialog-main">
      <v-dynamic-grid
        ref="refTable"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :total="total"
        :isSelect="true"
        v-model:currentPage="pageNo"
        v-model:pageSize="pageSize"
        @selection-change="onSelectionChange"
        @size-change="onPageSizeChange"
        @current-change="onPageNoChange"
      >
        <template #tableBtns>
          <div class="me-button-left">
            <el-button type="primary" @click="addBtn">
              <el-icon><circle-plus /></el-icon> 新增</el-button
            >
            <el-button type="danger" @click="deleteBtn">
              <el-icon><delete-filled /></el-icon> 删除</el-button
            >
          </div>
        </template>
        <template #table-column-end>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button type="text" @click.stop="updateBtn(scope.row)">
                <el-icon><edit /></el-icon> 修改
              </el-button>
              <el-button type="text" @click.stop="viewBtn(scope.row)"
                ><el-icon><view /></el-icon> 查看</el-button
              >
            </template>
          </el-table-column>
        </template>
      </v-dynamic-grid>
      <form-dialog
        v-if="dialogVisible"
        v-model:visible="dialogVisible"
        :title="pageTitle"
        :opType="businessType"
        :roleInfo="roleInfo"
        @doQuery="doQuery"
      ></form-dialog>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import * as sysApi from '@/apis/sys';
import { tableColumns, RowType } from './tmpl-model';
import FormDialog from './formDialog.vue';
import { defineComponent, onMounted, reactive, toRefs, computed } from 'vue';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { useGetters } from '@/utils/hooks/store-hooks';
export default defineComponent({
  components: {
    FormDialog,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dataInfo: {
      type: Object,
      default: () => ({}),
    },
    dataWidth: {
      type: String,
      default: '',
    },
  },
  emits: ['update:visible', 'onUpdata'],
  setup: (props, { emit }) => {
    const appGetters = useGetters('app', ['getCodeList']);
    const dataMap = reactive({
      pageNo: 1, //分页号
      pageSize: 10, //每页大小
      total: 0, //总数据
      dialogVisible: false,
      pageTitle: '', //弹窗标题
      businessType: '', //弹窗操作类型:新增,修改,查看
      roleInfo: {} as RowType,
      tableData: [],
      tableColumns: tableColumns,
      selection: Array<RowType>(),
      roleId: props.dataInfo.roleId,
      dataVisible: computed({
        get: () => props.visible,
        set: (val) => {
          emit('update:visible', val);
        },
      }),
    });
    const methodMap = reactive({
      //查询
      queryBtn: () => {
        methodMap.doQuery(true);
      },
      //取消
      onClose: () => {
        dataMap.dataVisible = false;
      },
      //新增
      addBtn: () => {
        dataMap.businessType = 'add';
        dataMap.pageTitle = '新增数据权限';
        dataMap.roleInfo = {
          roleDataId: '',
          roleId: dataMap.roleId,
          tableName: '',
          authType: '',
          authScopeId: '',
          authScopeName: '',
          isIncludeSub: '',
        };
        dataMap.dialogVisible = true;
      },
      //修改
      updateBtn: (row: RowType) => {
        dataMap.businessType = 'update';
        dataMap.pageTitle = '修改数据权限';
        dataMap.roleInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //删除
      deleteBtn: () => {
        if (dataMap.selection.length === 0) {
          ElMessage.warning('请选择一条记录!');
          return;
        }
        const idArray: Array<string> = [];
        dataMap.selection.forEach((item) => {
          idArray.push(item.roleDataId as string);
        });

        ElMessageBox.confirm('确认删除所选择的记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            await sysApi.deleteRoleData({
              roleDataIds: idArray.join(','),
            });
            ElMessage.success('删除成功');
            methodMap.doQuery(false);
          })
          .catch(() => {
            ElNotification({
              type: 'info',
              message: '已取消删除',
            });
          });
      },
      //查看
      viewBtn: (row: RowType) => {
        dataMap.pageTitle = '查看';
        dataMap.businessType = 'view';
        dataMap.roleInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //页码改变
      onPageNoChange: () => {
        methodMap.doQuery(false);
      },
      //每页大小改变
      onPageSizeChange: () => {
        methodMap.doQuery(false);
      },
      //选择行改变
      onSelectionChange: (arr: Array<RowType>) => {
        dataMap.selection = arr;
      },
      //获取列表数据
      doQuery: async (doInit = false) => {
        dataMap.pageNo = doInit ? 1 : dataMap.pageNo;
        dataMap.pageSize = doInit ? 10 : dataMap.pageSize;
        let params = {
          pageNo: dataMap.pageNo,
          pageSize: dataMap.pageSize,
          roleId: dataMap.roleId,
        };
        const { data: res } = await sysApi.roleDataList(params);
        dataMap.tableData = res.rows;
        dataMap.total = res.total;
      },
    });
    onMounted(() => {
      methodMap.doQuery(false);
    });
    return {
      ...appGetters,
      ...toRefs(dataMap),
      ...toRefs(methodMap),
    };
  },
});
</script>

<style lang="scss" scoped>
.data-dialog-main {
  width: 100%;
  height: 50vh;
}
</style>
