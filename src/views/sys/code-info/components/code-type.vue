<template>
  <div class="me-layout">
    <div class="me-layout-header-two">
      <div class="me-layout-form">
        <el-form ref="refSearchForm" :model="queryParams" label-width="120px">
          <el-row :gutter="6">
            <el-col :span="12">
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

            <el-col :span="12">
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
          </el-row>
          <el-row :gutter="6">
            <el-col :span="24">
              <el-button type="primary" @click="doQuery(true)">
                <el-icon><search /></el-icon> 查询
              </el-button>
              <el-button @click="resetForm">
                <el-icon><refresh-right /></el-icon> 重置
              </el-button>
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
        :hasOpbtn="false"
        v-model:currentPage="pageNo"
        v-model:pageSize="pageSize"
        @row-click="handelClik"
        @size-change="doQuery"
        @current-change="doQuery"
      >
      </v-dynamic-grid>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import * as sysApi from '@/apis/sys';
import { codeTypeColumns } from '../code-info-hook';
import { ElForm } from 'element-plus';
import { resetFields } from '@/utils/plugin/global';
export default defineComponent({
  name: 'CodeType',
  emits: ['handelClick'],
  setup(_, { emit }) {
    const refSearchForm = ref(ElForm);
    const dataMap = reactive({
      queryParams: {
        codeTypeId: '',
        codeTypeName: '',
      },
      tableColumns: codeTypeColumns,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    });
    const methodsMap = reactive({
      resetForm: () => {
        resetFields(dataMap.queryParams);
        methodsMap.doQuery(true);
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
      //获取码值项
      handelClik: (row: any) => {
        emit('handelClick', row.codeTypeId);
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
