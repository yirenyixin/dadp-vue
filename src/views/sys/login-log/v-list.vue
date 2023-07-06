<template>
  <div class="me-layout">
    <div class="me-layout-header-two">
      <div class="me-layout-form">
        <el-form ref="refSearchForm" :model="queryParams" label-width="120px">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="用户姓名" prop="userName">
                <el-input
                  v-model="queryParams.userName"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="日志内容" prop="logInfo">
                <el-input
                  v-model="queryParams.logInfo"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="IP地址" prop="ipAddr">
                <el-input
                  v-model="queryParams.ipAddr"
                  style="width: 100%"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="me-butons-center">
              <el-button type="primary" @click="doQuery">
                <el-icon>
                  <search />
                </el-icon>
                查询
              </el-button>
              <el-button @click="resetForm">
                <el-icon>
                  <refresh-right />
                </el-icon>
                重置
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

export default defineComponent({
  name: 'sysLoginLog',
  components: { LogDialog },
  setup() {
    const refSearchForm = ref(null);
    const dataMap = reactive({
      queryParams: {
        userId: '',
        userName: '',
        logInfo: '',
        ipAddr: '',
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
        const { data: res } = await sysApi.getLogData(params);
        dataMap.tableData = res.rows;
        dataMap.total = res.total;
      },
    });
    onMounted(() => {
      methodsMap.doQuery(true);
    });
    return {
      refSearchForm,
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
    };
  },
});
</script>
