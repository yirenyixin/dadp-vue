<template>
  <div class="me-layout">
    <div class="me-layout-header-three">
      <div class="me-layout-form">
        <el-form ref="refSearchForm" :model="queryParams" label-width="120px">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="日志ID" prop="operLogId">
                <el-input
                  v-model="queryParams.operLogId"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模块名称" prop="moduleName">
                <el-input
                  v-model="queryParams.moduleName"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="操作类型" prop="operType">
                <el-select
                  v-model="queryParams.operType"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in getCodeList['operType']"
                    :key="item.value"
                    :label="item.content"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="用户ID" prop="userId">
                <el-input
                  v-model="queryParams.userId"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="机构ID" prop="orgId">
                <el-input
                  v-model="queryParams.orgId"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否操作成功" prop="isOk">
                <el-select
                  v-model="queryParams.isOk"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in getCodeList['yesOrNo']"
                    :key="item.value"
                    :label="item.content"
                    :value="item.value"
                  ></el-option>
                </el-select>
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
    <div class="me-layout-content-three">
      <v-dynamic-grid
        ref="dynamicGirdRef"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :total="total"
        :hasOpbtn="false"
        :title="'查看结果（单击查看详情）'"
        v-model:currentPage="pageNo"
        v-model:pageSize="pageSize"
        @row-click="handelClik"
        @size-change="doQuery"
        @current-change="doQuery"
      >
      </v-dynamic-grid>
      <log-dialog
        v-if="dialogVisible"
        v-model:dialogVisible="dialogVisible"
        :dialogInfo="dialogInfo"
      ></log-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import * as sysApi from '@/apis/sys';
import { RowType, LogColumns } from './login-log-hook';
import LogDialog from './log-dialog.vue';
import { resetFields } from '@/utils/plugin/global';
import { useGetters } from '@/utils/hooks/store-hooks';

export default defineComponent({
  name: 'sysOptionLog',
  components: { LogDialog },
  setup() {
    const refSearchForm = ref(null);
    const appGetters = useGetters('app', ['getCodeList']);
    const dataMap = reactive({
      queryParams: {
        dateFrom: '',
        dateTo: '',
        operLogId: '',
        moduleName: '',
        operType: '',
        operSource: '',
        userId: '',
        orgId: '',
        reqUrl: '',
        reqMethod: '',
        reqMode: '',
        ipAddr: '',
        reqParam: '',
        result: '',
        isOk: '',
      },
      tableColumns: LogColumns,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      dialogVisible: false,
      dialogTitle: '',
      optionType: '',
      dialogInfo: {},
    });
    const methodsMap = reactive({
      //重置
      resetForm() {
        resetFields(dataMap.queryParams);
        methodsMap.doQuery(true);
      },
      //查看行数据
      handelClik(row: RowType) {
        dataMap.dialogInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //获取列表数据
      doQuery: async (doInit = false) => {
        dataMap.pageNo = doInit ? 1 : dataMap.pageNo;
        dataMap.pageSize = doInit ? 10 : dataMap.pageSize;

        let params = {
          pageNo: dataMap.pageNo,
          pageSize: dataMap.pageSize,
          ...dataMap.queryParams,
        };
        const { data: res } = await sysApi.getOperLogData(params);
        dataMap.tableData = res.rows;
        dataMap.total = res.total;
      },
    });
    onMounted(() => {
      methodsMap.doQuery(true);
    });
    return {
      refSearchForm,
      ...appGetters,
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
    };
  },
});
</script>
