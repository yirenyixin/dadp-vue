<template>
  <div class="me-layout">
    <div class="me-layout-header-two">
      <div class="me-layout-form" header="查询条件">
        <el-form ref="refSearchForm" :model="queryParams" label-width="120px">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="角色ID" prop="roleId">
                <el-input
                  v-model="queryParams.roleId"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="角色名称" prop="roleName">
                <el-input
                  v-model="queryParams.roleName"
                  style="width: 100%"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="登录后首页" prop="homeUrl">
                <el-select v-model="queryParams.homeUrl" style="width: 100%">
                  <el-option
                    v-for="item in getCodeList['homeUrl']"
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

    <div class="me-layout-content-two">
      <v-dynamic-grid
        ref="dynamicGirdRef"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :total="total"
        :isSelect="true"
        v-model:currentPage="pageNo"
        v-model:pageSize="pageSize"
        @selection-change="handleSelectionChange"
        @size-change="doQuery"
        @current-change="doQuery"
      >
        <template #tableBtns>
          <div class="me-button-left">
            <el-button type="primary" @click="addRole"
              ><el-icon><circle-plus /></el-icon> 新增</el-button
            >
            <el-button type="primary" @click="toRoleDataPage"
              ><el-icon><wind-power /></el-icon> 数据权限配置
            </el-button>
            <el-button type="danger" @click="deleteRole"
              ><el-icon><delete-filled /></el-icon> 删除</el-button
            >
          </div>
        </template>
        <template #table-column-end>
          <el-table-column fixed="right" label="操作" width="240">
            <template #default="scope">
              <el-button type="text" @click.stop="toRoleAuthPage(scope.row)"
                ><el-icon><wind-power /></el-icon> 功能权限配置
              </el-button>

              <el-button type="text" @click.stop="editRole(scope.row)"
                ><el-icon><edit /></el-icon> 修改
              </el-button>
            </template>
          </el-table-column>
        </template>
      </v-dynamic-grid>
      <role-dialog
        v-if="dialogVisible"
        v-model:dialogVisible="dialogVisible"
        :dialogTitle="dialogTitle"
        :optionType="optionType"
        :dialogInfo="dialogInfo"
        @onUpdata="doQuery"
      ></role-dialog>
      <data-dialog
        v-if="dataVisible"
        v-model:visible="dataVisible"
        :dataInfo="dialogInfo"
        @onUpdata="doQuery"
      ></data-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import * as sysApi from '@/apis/sys';
import { RowType, roleColumns } from './role-hook';
import { ElForm, ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import RoleDialog from './dialog/role-dialog.vue';
import DataDialog from './roleData/role-data-dialog.vue';
import { useGetters } from '@/utils/hooks/store-hooks';
export default defineComponent({
  name: 'sysRole',
  components: { RoleDialog, DataDialog },
  setup() {
    const appGetters = useGetters('app', ['getCodeList']);
    const refSearchForm = ref(ElForm);
    const dataMap = reactive({
      queryParams: {
        roleId: '',
        roleName: '',
        remark: '',
        homeUrl: '',
      },
      tableColumns: roleColumns,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      selectRows: Array<RowType>(),
      dialogVisible: false,
      dataVisible: false,
      dialogTitle: '',
      optionType: '',
      dialogInfo: {},
    });
    const methodsMap = reactive({
      handleSelectionChange(val: any) {
        dataMap.selectRows = val;
      },
      //重置
      resetForm() {
        Object.keys(dataMap.queryParams).forEach((k) => {
          dataMap.queryParams[k] = '';
          methodsMap.doQuery(true);
        });
      },
      //删除角色
      deleteRole: () => {
        if (dataMap.selectRows.length) {
          const selectRows: Array<string> = [];
          dataMap.selectRows.forEach((k) => {
            selectRows.push(k.roleId as string);
          });
          ElMessageBox.confirm(`确认删除所选角色吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(async () => {
              await sysApi.deleteRole({ roleIds: selectRows.join(',') });
              ElMessage({
                type: 'success',
                message: '删除成功',
              });
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
      //功能权限配置
      toRoleAuthPage: (row: RowType) => {
        dataMap.dialogTitle = '功能权限配置';
        dataMap.optionType = 'powerConfig';
        dataMap.dialogInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //权限配置
      toRoleDataPage: () => {
        if (dataMap.selectRows.length === 0) {
          ElMessage.warning('请选择一位客户!');
          return;
        }
        if (dataMap.selectRows.length > 1) {
          ElMessage.warning('一次只能为同一个角色授权!');
          return;
        }
        dataMap.dialogTitle = '数据权限配置';
        dataMap.dialogInfo = dataMap.selectRows[0];
        dataMap.dataVisible = true;
      },
      //编辑
      editRole(row: RowType) {
        dataMap.dialogTitle = '修改角色';
        dataMap.optionType = 'update';
        dataMap.dialogInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //新增
      addRole: () => {
        dataMap.dialogTitle = '新增角色';
        dataMap.optionType = 'add';
        dataMap.dialogInfo = {};
        dataMap.dialogVisible = true;
      },
      //查看角色
      viewRole: (row: RowType) => {
        dataMap.dialogTitle = '查看角色';
        dataMap.optionType = 'view';
        dataMap.dialogInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //查询数据列表
      doQuery: async (doInit = false) => {
        dataMap.pageNo = doInit ? 1 : dataMap.pageNo;
        dataMap.pageSize = doInit ? 10 : dataMap.pageSize;

        let params = {
          pageNo: dataMap.pageNo,
          pageSize: dataMap.pageSize,
          ...dataMap.queryParams,
        };
        const { data: res } = await sysApi.queryRole(params);
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
      refSearchForm,
    };
  },
});
</script>
