<template>
  <div class="me-layout">
    <div class="me-layout-header-two">
      <div class="me-layout-form">
        <el-form ref="refSearchForm" :model="queryParams" label-width="120px">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item
                label="代码类别ID"
                prop="codeTypeId"
                label-width="120px"
              >
                <el-input
                  v-model="queryParams.codeTypeId"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="代码类别名称"
                prop="codeTypeName"
                label-width="120px"
              >
                <el-input
                  v-model="queryParams.codeTypeName"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注" prop="remark">
                <el-input
                  v-model="queryParams.remark"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="me-butons-center">
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
    <div class="me-layout-content-two">
      <v-dynamic-grid
        ref="dynamicGirdRef"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :total="total"
        :isSelect="true"
        v-model:currentPage="pageNo"
        v-model:pageSize="pageSize"
        @row-click="viewCodeType"
        @selection-change="handleSelectionChange"
        @size-change="doQuery"
        @current-change="doQuery"
      >
        <template #tableBtns>
          <div class="me-button-left">
            <el-button type="primary" @click="addCodeType"
              ><el-icon><circle-plus /></el-icon> 新增</el-button
            >
            <el-button type="danger" @click="deleteCodeType"
              ><el-icon><delete-filled /></el-icon> 删除</el-button
            >
          </div>
        </template>
        <template #table-column-end>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="text" @click.stop="editCodeType(scope.row)"
                ><el-icon><edit /></el-icon> 修改
              </el-button>
            </template>
          </el-table-column>
        </template>
      </v-dynamic-grid>
      <code-type-dialog
        v-if="dialogVisible"
        v-model:dialogVisible="dialogVisible"
        :dialogTitle="dialogTitle"
        :optionType="optionType"
        :dialogInfo="dialogInfo"
        @updateList="doQuery"
      ></code-type-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import * as sysApi from '@/apis/sys';
import { codeTypeColumns, RowType } from './code-type-hook';
import { ElForm, ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import CodeTypeDialog from './code-type-dialog.vue';
import { resetFields } from '@/utils/plugin/global';
export default defineComponent({
  name: 'sysCodeType',
  components: { CodeTypeDialog },
  setup() {
    const refSearchForm = ref(ElForm);
    const dataMap = reactive({
      queryParams: {
        sort: '',
        order: '',
        codeTypeId: '',
        codeTypeName: '',
        isPinyin: '',
        remark: '',
      },
      tableColumns: codeTypeColumns,
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
      resetForm() {
        resetFields(dataMap.queryParams);
        methodsMap.doQuery(true);
      },
      //删除
      deleteCodeType: () => {
        if (dataMap.selectRows.length) {
          const selectRows: Array<string> = [];
          //选中项
          dataMap.selectRows.forEach((k) => {
            selectRows.push(k.codeTypeId as string);
          });
          ElMessageBox.confirm(
            `确认删除代码类别id为${selectRows.join(',')}的代码类别吗？`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(async () => {
              await sysApi.delCodeType({ codeTypeIds: selectRows.join(',') });
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
      addCodeType: () => {
        dataMap.dialogTitle = '新增代码类别';
        dataMap.optionType = 'add';
        dataMap.dialogInfo = {};
        dataMap.dialogVisible = true;
      },
      //编辑
      editCodeType: (row: RowType) => {
        dataMap.dialogTitle = '修改代码类别';
        dataMap.optionType = 'update';
        dataMap.dialogInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //查看
      viewCodeType: (row: RowType) => {
        dataMap.dialogTitle = '查看代码类别';
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
        const { data: res } = await sysApi.getCodeTypeList(params);
        dataMap.tableData = res.rows;
        dataMap.total = res.total;
      },
    });
    onMounted(() => {
      methodsMap.doQuery(true);
    });
    return {
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
      refSearchForm,
    };
  },
});
</script>
