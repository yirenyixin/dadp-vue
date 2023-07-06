<template>
  <div class="org-box">
    <div class="org-box-left">
      <el-card header="机构管理">
        <div class="button-group">
          <el-button type="primary" @click="addNode"
            ><el-icon><circle-plus /></el-icon>新增</el-button
          >
          <el-button type="danger" @click="deleteNode"
            ><el-icon><delete-filled /></el-icon>删除</el-button
          >
          <el-button @click="refresh"
            ><el-icon><refresh /></el-icon>刷新</el-button
          >
        </div>
        <el-scrollbar height="48vh">
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
        </el-scrollbar>
      </el-card>
    </div>
    <div class="org-box-right">
      <el-card header="当前机构详情">
        <div class="main-content">
          <el-form
            :model="editForm"
            ref="editFormRef"
            :rules="orgRule"
            label-width="120px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="机构ID:" prop="orgId">
                  <el-input
                    v-model="editForm.orgId"
                    :disabled="updateType === 'update'"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="上级机构ID:" prop="parentOrgId">
                  <el-input
                    v-model="editForm.parentOrgId"
                    :disabled="updateType === 'update'"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="机构名称:" prop="orgName">
                  <el-input v-model="editForm.orgName" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注:" prop="remark">
                  <el-input
                    type="textarea"
                    v-model="editForm.remark"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-col :span="24" style="text-align: right">
              <el-button type="primary" @click="handleOk"
                ><el-icon><document-add /></el-icon>保存</el-button
              >
              <el-button @click="resetBtn"
                ><el-icon><refresh-right /></el-icon>重置</el-button
              >
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
import { NodeTreeItem, ListToTree, nowData } from '@/utils/tools';
import { ElMessage, ElMessageBox } from 'element-plus';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import * as sysApi from '@/apis/sys';
import { orgCommonRules } from './org-hook';
import { useGetters } from '@/utils/hooks/store-hooks';
export default defineComponent({
  name: 'sysOrg',
  setup() {
    const appGetters = useGetters('app', ['getCodeList']);
    let orgTreeRef = ref(null);
    let editFormRef = ref(null);
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
    });
    const methodsMap = reactive({
      //重置
      resetBtn() {
        Object.keys(dataMap.editForm).forEach((k) => {
          dataMap.editForm[k] = '';
        });
      },
      //保存
      handleOk() {
        (editFormRef.value as any).validate(async (valid: boolean) => {
          if (valid) {
            //新增
            if (dataMap.updateType === 'add') {
              const { code, msg } = await sysApi.addOrg({
                ...dataMap.editForm,
                updateTime: nowData('YYMMDD'),
              });
              if (code === 200) {
                ElMessage({
                  type: 'success',
                  message: '新增成功！',
                });
                methodsMap.refresh();
                methodsMap.addNode();
              } else {
                ElMessage.error(msg);
              }
            }
            //更新信息
            else if (dataMap.updateType === 'update') {
              const { code, msg } = await sysApi.updOrg({
                ...dataMap.editForm,
                updateTime: nowData('YYMMDD'),
              });
              if (code === 200) {
                ElMessage({
                  type: 'success',
                  message: '修改成功！',
                });
                (orgTreeRef.value as any).setCurrentKey(dataMap.editForm.orgId);
                methodsMap.getNode();
              } else {
                ElMessage.error(msg);
              }
            }
          }
        });
      },
      //删除
      deleteNode() {
        const nodeId = (orgTreeRef.value as any).getCurrentKey();
        if (nodeId) {
          ElMessageBox.confirm(`确认删除id为${nodeId}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(async () => {
              await sysApi.delOrg({
                orgId: String((orgTreeRef.value as any).getCurrentKey()),
              });
              methodsMap.refresh();
            })
            .catch(() => {
              ElMessage({
                type: 'info',
                message: '已取消删除',
              });
            });
        } else {
          ElMessage({
            type: 'warning',
            message: '请选择一个节点',
          });
        }
      },
      //刷新
      refresh() {
        (orgTreeRef.value as any).setCurrentKey(null);
        methodsMap.getTreeData();
        methodsMap.resetBtn();
      },
      //新增
      addNode() {
        (editFormRef.value as any).resetFields();
        dataMap.updateType = 'add';
        dataMap.editForm.parentOrgId = (
          orgTreeRef.value as any
        ).getCurrentKey();
      },
      //获取选中节点的信息渲染到表单内
      getNode: async () => {
        dataMap.updateType = 'update';
        const { data } = await sysApi.getOrgById({
          orgId: String((orgTreeRef.value as any).getCurrentKey()),
        });
        dataMap.editForm = data;
      },
      //获取机构列表并转为树形结构展示
      getTreeData: async () => {
        const { data } = await sysApi.getOrgList({ topOrgId: '' });
        dataMap.orgList = data;
        dataMap.orgTreeData = ListToTree(data);
        data.forEach((item: NodeTreeItem) => {
          if (item.open) dataMap.defaultExpandedKeys.push(item.id as string);
        });
      },
    });
    onMounted(() => {
      methodsMap.getTreeData();
    });
    return {
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
      ...appGetters,
      editFormRef,
      orgTreeRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.org-box {
  width: 100%;
  height: 100%;
  display: flex;
  .org-box-left {
    width: 40%;
    height: 100%;
    margin-right: 16px;
    .button-group {
      width: 100%;
      height: 48px;
    }
    .el-card {
      height: 100%;
    }
  }
  .org-box-right {
    width: calc(60% - 16px);
    height: 100%;
    .el-card {
      height: 100%;
    }
  }
}
</style>
