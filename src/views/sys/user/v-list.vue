<template>
  <div class="me-menu">
    <el-input placeholder="请输入内容" v-model="queryParams.orgName" @keyup.enter="handleNodeSelection"></el-input>
    <el-tree
        :data="orgTreeData"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        ref="orgTreeRef"
        highlight-current
        :expand-on-click-node="false"
        :props="defaultProps"
        @node-click="getNode"
    ></el-tree>
  </div>
  <div class="me-layout">
    <div class="me-layout-header-three">
      <div class="me-layout-form">
        <el-form width="100%" :model="queryParams" label-width="120px">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="queryParams.userName" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="手机号" prop="tel">
                <el-input v-model="queryParams.tel" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别" prop="sex">
                <el-select v-model="queryParams.sex" size="large" clearable>
                  <el-option
                      v-for="item in getCodeList['userSex']"
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
              <el-form-item label="当前角色" prop="roleId">
                <el-select v-model="queryParams.roleIds" size="large" clearable>
                  <el-option
                      v-for="item in getCodeList['roleId']"
                      :key="item.value"
                      :label="item.content"
                      :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户状态" prop="status">
                <el-select v-model="queryParams.status" size="large" clearable>
                  <el-option
                      v-for="item in getCodeList['userStatus']"
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
        <template #tableBtns>
          <div class="me-button-left">
            <el-button type="primary" @click="addUser"
            ><el-icon><circle-plus /></el-icon> 新增</el-button
            >
            <el-button type="danger" @click="deleteUser"
            ><el-icon><delete-filled /></el-icon> 删除</el-button
            >
          </div>
        </template>
        <template #table-column-end>
          <el-table-column fixed="right" label="操作" width="150" style="text-align: center;"  >
            <template #default="scope">
              <div style="text-align: center;">
                <el-button type="text" @click.stop="editUser(scope.row)">
                  <el-icon><edit /></el-icon> 修改
                </el-button>
                <el-button type="text" @click.stop="viewUser(scope.row)">
                  <el-icon><edit /></el-icon> 查看
                </el-button>
              </div>
            </template>
          </el-table-column>
        </template>
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
  <div>
  </div>
</template>
<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs} from 'vue';
import * as sysApi from '@/apis/sys';
import { RowType, userTableColumns } from './user-hook';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import BaseOrgAuth from '@/components/business/org/authOrg/base-org-auth.vue';
import { useGetters } from '@/utils/hooks/store-hooks';
import UserDialog from '../user-details/user-dialog.vue';
import { resetFields } from '@/utils/plugin/global';
import {ListToTree, NodeTreeItem} from "@/utils/tools";
import {orgCommonRules} from "@/views/sys/org/org-hook";
// import { NextRouter } from 'vue-router';
// import { App, createApp } from 'vue';
// import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';


export default defineComponent({
  name: 'sysUser',
  components: { UserDialog, BaseOrgAuth },
  // components: { BaseOrgAuth },
  data() {
    return {
      treeData: [],
      dataMap: '1'
    };
  },
  methods: {
    navigateToUserList() {
      const router = useRouter();
      router.push({ path: '/sys/user-details/v-list' });
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    closeOrgSelect() {
      this.orgSelectVisible = false;
    },
    openDialog() {
      this.dialogVisible = true;
    },
  },

  setup() {
    const router = useRouter();
    let orgTreeRef = ref(null);
    const appGetters = useGetters('app', ['getCodeList']);
    const dataMap = reactive({
      orgTreeData: Array<NodeTreeItem>(),
      defaultExpandedKeys: Array<string>(),
      defaultProps: {
        label: 'name',
        children: 'children',
      },
      editForm: {
        orgId: '', //机构ID
        orgName: '', //机构名称
        parentOrgId: '', //上级机构ID
        remark: '', //备注
        ver: null, //数据版本
      },
      updateType: '',
      parentOrgIdDis: true,
      orgList: [],
      orgRule: orgCommonRules,


      queryParams: {
        userId: '',
        userName: '',
        loginName: '',
        tel: '',
        password: '',
        sex: '',
        orgId: '',
        roleId: '',
        roleIds: '',
        status: '',
        sortNo: 0,
        remark: '',
        ver: 0,
        roleName: '',
        orgName: '',
        bankName:'',
      },
      orgSelectVisible: false,
      tableColumns: userTableColumns,
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
      //获取机构列表并转为树形结构展示
      getTreeData: async () => {
        const { data } = await sysApi.getOrgList({ topOrgId: '' });
        dataMap.orgList = data;
        dataMap.orgTreeData = ListToTree(data);
        console.log('orgList:', data);
        data.forEach((item: NodeTreeItem) => {
          if (item.open) dataMap.defaultExpandedKeys.push(item.id as string);
        });
      },
      //获取选中节点的信息渲染到表单内
      getNode: async () => {
        dataMap.updateType = 'update';
        const { data } = await sysApi.getOrgById({
          orgId: String((orgTreeRef.value as any).getCurrentKey()),
        });
        dataMap.editForm = data;
        dataMap.queryParams.orgId=data.orgId;
        console.log('selectedOrgId:', orgTreeRef.value);
        await methodsMap.doQuery(true);
      },


      handleNodeSelection: async () => {
        // await methodsMap.getTreeData();
        function findParentNodes(nodeId: string, data: NodeTreeItem[], parentNodes: NodeTreeItem[]) {
          data.forEach((item: NodeTreeItem) => {
            if (item.id === nodeId) {
              parentNodes.push(item);
              if (item.parentId) {
                findParentNodes(item.parentId.toString(), data, parentNodes);
              }
            }
          });
        }

        const { data } = await sysApi.getOrgList({ topOrgId: '' });
        dataMap.orgList = data;

        const parentNodes: NodeTreeItem[] = [];
        data.forEach((item: NodeTreeItem) => {
          if (item.name === dataMap.queryParams.orgName) {
            if (item.parentId) {
              findParentNodes(item.parentId.toString(), data, parentNodes);
            }
          }
        });

        const filteredData = data.filter(
            (item: NodeTreeItem) =>
                item.name === dataMap.queryParams.orgName || parentNodes.some((parentNode) => parentNode.id === item.id)
        );
        dataMap.orgTreeData = ListToTree(filteredData);

        console.log('orgList:', data);
        data.forEach((item: NodeTreeItem) => {
          if (item.name === dataMap.queryParams.orgName) {
            dataMap.queryParams.orgId = item.id.toString();
            methodsMap.doQuery(true);
            // if (item.open) dataMap.defaultExpandedKeys.push(item.id as string);
          }
        });

      },

      getBankData(val: any){
        dataMap.queryParams.bankName=val.label;
      },
      handleSelectionChange(val: any) {
        dataMap.selectRows = val;
      },
      //重置
      resetForm: () => {
        resetFields(dataMap.queryParams);
        methodsMap.doQuery(true);
        (orgTreeRef.value as any).setCurrentKey(null);
        methodsMap.getTreeData();
      },
      //删除
      deleteUser() {
        if (dataMap.selectRows.length > 0) {
          const selectRows: Array<string> = [];
          dataMap.selectRows.forEach((k) => {
            selectRows.push(k.userId as string);
          });
          ElMessageBox.confirm(
              `确认删除用户id为${selectRows.join(',')}的用户吗？`,
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
              }
          )
              .then(async () => {
                await sysApi.delUser({ userIds: selectRows.join(',') });
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
      editUser: (row: RowType) => {
        dataMap.dialogTitle = '修改用户';
        dataMap.optionType = 'update';
        dataMap.dialogInfo = { ...row };
        dataMap.dialogVisible = true;
      },
      //新增用户
      addUser: () => {
        dataMap.dialogTitle = '新增用户';
        dataMap.optionType = 'add';
        dataMap.dialogInfo = { ...dataMap.queryParams, passward: '123456' };
        dataMap.dialogVisible = true;
      },


// 查看用户
      viewUser: (row: RowType) => {
        dataMap.dialogTitle = '查看用户';
        dataMap.optionType = 'view';
        dataMap.dialogInfo = { ...row };
        dataMap.dialogVisible = true;
        // const router = useRouter();
        // console.log("当前router",router);
        // console.log("当前值",row.userId)
        router.push({
          name: 'ViewUser',
          params: {
            viewUserId: row.userId
          }
        });
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
        const { data: res } = await sysApi.getUserList(params);
        dataMap.tableData = res.rows;
        dataMap.total = res.total;
        // console.log('selectedOrgName:', dataMap.queryParams);
      },
    });
    onMounted(() => {
      methodsMap.getTreeData();
      methodsMap.doQuery(true);

    });
    return {
      ...appGetters,
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
      orgTreeRef,

    };
  },
});
</script>
<style lang="scss" scoped>
.me-menu {
  width: 29%;
  float: left;
}

.me-layout {
  width: 69%;
  float: right;
}

.me-layout-content-three {
  margin-top: 20px;
}
</style>