<template>
  <div class="me-layout">
    <div class="me-layout-header-one">
      <div class="me-layout-form">
        <el-form ref="refSearchForm" :model="queryParams" label-width="120px">
          <el-row :gutter="12">
            <el-col :span="12">
              <el-form-item
                label="下拉框内容"
                prop="content"
                label-width="120px"
              >
                <el-input
                  v-model="queryParams.content"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-button type="primary" @click="doQuery(true)"
                ><el-icon><search /></el-icon> 查询</el-button
              >
              <el-button @click="resetForm"
                ><el-icon><refresh-right /></el-icon> 重置</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="me-layout-content-one">
      <v-dynamic-grid
        ref="dynamicGirdRef"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :total="total"
        :isSelect="true"
        v-model:currentPage="pageNo"
        v-model:pageSize="pageSize"
        @row-click="viewCodeInfo"
        @selection-change="handleSelectionChange"
        @size-change="doQuery"
        @current-change="doQuery"
      >
        <template #tableBtns>
          <div class="me-button-left">
            <el-button type="primary" @click="addCodeInfo"
              ><el-icon><circle-plus /></el-icon> 新增</el-button
            >
            <el-button type="danger" @click="delCodeInfo"
              ><el-icon><delete-filled /></el-icon> 删除</el-button
            >
          </div>
        </template>
        <template #table-column-end>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="text" @click.stop="editCodeInfo(scope.row)"
                ><el-icon><edit /></el-icon> 修改
              </el-button>
            </template>
          </el-table-column>
        </template>
      </v-dynamic-grid>
      <code-info-dialog
        v-if="dialogVisible"
        v-model:dialogVisible="dialogVisible"
        :dialogTitle="dialogTitle"
        :optionType="optionType"
        :dialogInfo="dialogInfo"
        @updateList="doQuery"
      ></code-info-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { onMounted, defineComponent, reactive, ref, toRefs } from 'vue';
import * as sysApi from '@/apis/sys';
import { RowType, codeInfoColumns } from '../code-info-hook';
import { ElForm, ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import CodeInfoDialog from './code-info-dialog.vue';
import { resetFields } from '@/utils/plugin/global';
export default defineComponent({
  name: 'CodeInfo',
  components: { CodeInfoDialog },
  setup() {
    const refSearchForm = ref(ElForm);
    const dataMap = reactive({
      queryParams: {
        content: '',
        codeTypeId: '',
      },
      tableColumns: codeInfoColumns,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      selectRows: Array<RowType>(),
      dialogVisible: false,
      dialogTitle: '',
      optionType: '',
      dialogInfo: {},
    });
    const methodsMap = reactive({
      handleSelectionChange(val: any) {
        dataMap.selectRows = val;
      },
      //重置
      resetForm: () => {
        resetFields(dataMap.queryParams);
        methodsMap.doQuery(true);
      },
      //删除
      delCodeInfo: () => {
        if (dataMap.selectRows.length > 0) {
          const selectRows: Array<string> = [];
          dataMap.selectRows.forEach((k) => {
            selectRows.push(k.codeInfoId as string);
          });
          ElMessageBox.confirm(
            `确认删除代码信息id为${selectRows.join(',')}的代码信息吗？`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(async () => {
              await sysApi.delCodeInfo({ codeInfoIds: selectRows.join(',') });
              methodsMap.doQuery(true);
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
      //新增
      addCodeInfo: () => {
        if (dataMap.queryParams.codeTypeId != '') {
          dataMap.dialogTitle = '新增代码信息';
          dataMap.optionType = 'add';
          dataMap.dialogInfo = {
            codeTypeId: dataMap.queryParams.codeTypeId,
            value: '',
            content: '',
            parentValue: '',
            sortNo: '',
            isOk: '',
            remark: '',
          };
          dataMap.dialogVisible = true;
        } else {
          ElMessage({
            type: 'warning',
            message: '请在左边选择一条代码类型记录',
          });
        }
      },
      //编辑
      editCodeInfo: (row: RowType) => {
        dataMap.dialogTitle = '修改代码信息';
        dataMap.optionType = 'update';
        dataMap.dialogInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //查看
      viewCodeInfo: (row: RowType) => {
        dataMap.dialogTitle = '查看代码信息';
        dataMap.optionType = 'view';
        dataMap.dialogInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //查询列表数据
      doQuery: async (doInit = false) => {
        dataMap.pageNo = doInit ? 1 : dataMap.pageNo;
        dataMap.pageSize = doInit ? 10 : dataMap.pageSize;

        let params = {
          pageNo: dataMap.pageNo,
          pageSize: dataMap.pageSize,
          ...dataMap.queryParams,
        };
        const { data: res } = await sysApi.getCodeInfoList(params);
        dataMap.tableData = res.rows;
        dataMap.total = res.total;
      },
      //初始化数据
      initParams: (id: string) => {
        if (!id) return;
        dataMap.queryParams.codeTypeId = id;
        methodsMap.doQuery();
      },
    });
    onMounted(() => {
      methodsMap.doQuery();
    });
    return {
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
      refSearchForm,
    };
  },
});
</script>
