<template>
  <div class="me-layout">
    <div class="me-layout-header-three">
      <div class="me-layout-form">
        <el-form width="100%" :model="queryParams" label-width="120px">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="图书名" prop="bookName">
                <el-input v-model="queryParams.bookName" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="图书Id" prop="bookId">
                <el-input v-model="queryParams.bookId" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="me-butons-center">
              <el-button type="primary" @click="doQuery(true)"
                ><el-icon><search /></el-icon>查询</el-button
              >
              <el-button @click="resetForm"
                ><el-icon><refresh-right /></el-icon>重置</el-button
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
        :isSelect="true"
        v-model:currentPage="pageNo"
        v-model:pageSize="pageSize"
        @row-click="viewUser"
        @selection-change="handleSelectionChange"
        @size-change="doQuery"
        @current-change="doQuery"
      >
      </v-dynamic-grid>
      <user-dialog
        v-if="dialogVisible"
        v-model:visible="dialogVisible"
        :title="dialogTitle"
        :opType="optionType"
        :userInfo="dialogInfo"
        @updateList="doQuery"
      ></user-dialog>
      <base-org-auth
        v-if="orgSelectVisible"
        v-model:orgSelectVisible="orgSelectVisible"
        @getOrgSelectData="getOrgSelectData"
      >
      </base-org-auth>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import * as sysApi from '@/apis/sys';
import { RowType, bookTableColumns } from './book-state-hook';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import BaseOrgAuth from '@/components/business/org/authOrg/base-org-auth.vue';
import { useGetters } from '@/utils/hooks/store-hooks';
import UserDialog from './book-dialog.vue';
import { resetFields } from '@/utils/plugin/global';
import { computed } from 'vue';
import { useStore } from 'vuex';
export default defineComponent({
  name: 'sysUser',
  components: { UserDialog, BaseOrgAuth },
  setup() {
    const appGetters = useGetters('app', ['getCodeList']);
    const store = useStore();

    // 使用 computed 函数创建一个计算属性来获取当前登录用户信息
    const userId = computed(() => store.getters['user/currentUser']?.id);
    const queryConditions = {
      roleId: "admin",
    };
    const dataMap = reactive({
      queryParams: {
        sortNo: 0,
        ver: 0,
        bookId:'',
        bookIds:'',
        bookName:'',
        author:'',
        createTime:'',
        role:'',
        roleId:'',
      },
      orgSelectVisible: false,
      tableColumns: bookTableColumns,
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
      //获取机构
      getOrgSelectData(val: any) {
        dataMap.queryParams.bookId = val.id;
        dataMap.queryParams.bookName = val.label;
      },
      handleSelectionChange(val: any) {
        dataMap.selectRows = val;
      },
      //重置
      resetForm: () => {
        resetFields(dataMap.queryParams);
        methodsMap.doQuery(true);
      },
      //删除
      deleteBook() {
        if (dataMap.selectRows.length > 0) {
          const selectRows: Array<string> = [];
          dataMap.selectRows.forEach((k) => {
            selectRows.push(k.bookId as string);
          });
          ElMessageBox.confirm(
            `确认删除图书id为${selectRows.join(',')}的图书吗？`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(async () => {
              await sysApi.delBook({ bookIds: selectRows.join(',') });
              methodsMap.doQuery();
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
      //编辑用户信息
      editBook: (row: RowType) => {
        dataMap.dialogTitle = '修改图书';
        dataMap.optionType = 'update';
        dataMap.dialogInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //新增用户
      addBook: () => {
        dataMap.dialogTitle = '新增图书';
        dataMap.optionType = 'add';
        dataMap.dialogInfo = { ...dataMap.queryParams, passward: '123456' };
        dataMap.dialogVisible = true;
      },
      //查看用户
      viewUser: (row: RowType) => {
        dataMap.dialogTitle = '查看用户';
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
          roleId: queryConditions.roleId,
        };
        const { data: res } = await sysApi.getBookStateList(params);
        dataMap.tableData = res.rows;
        dataMap.total = res.total;
      },
    });
    onMounted(() => {
      methodsMap.doQuery(true);
    });
    return {
      ...appGetters,
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
    };
  },
});
</script>
<style lang="scss" scoped>
.me-layout-content-three {
  margin-top: 20px;
}
</style>
