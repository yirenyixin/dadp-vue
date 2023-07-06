<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="50vw"
    destroy-on-close
    @close="closeBtn"
  >
    <div class="base-dialog-form">
      <el-form
        ref="refDialogForm"
        :rules="editFormRules"
        :model="editForm"
        label-width="120px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="业务表名" prop="tableName">
              <el-select
                :disabled="opType === 'view'"
                v-model="editForm.tableName"
              >
                <el-option
                  v-for="item in getCodeList['tableName']"
                  :key="item.value"
                  :label="item.content"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="权限类型" prop="authType">
              <el-select
                :disabled="opType === 'view'"
                v-model="editForm.authType"
                @change="handelChange"
              >
                <el-option
                  v-for="item in getCodeList['authType']"
                  :key="item.value"
                  :label="item.content"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="数据范围" prop="authScopeName">
              <el-input
                type="text"
                v-model="editForm.authScopeName"
                :readonly="true"
              >
                <template #append>
                  <el-button
                    @click="orgSelectVisible = true"
                    :disabled="editForm.authType === '2' || opType === 'view'"
                    ><el-icon><search /></el-icon
                  ></el-button>
                </template>
              </el-input>
              <base-org-auth
                v-if="orgSelectVisible"
                v-model:orgSelectVisible="orgSelectVisible"
                @getOrgSelectData="getOrgData"
              >
              </base-org-auth>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否含下级" prop="isIncludeSub">
              <el-select
                :disabled="opType === 'view'"
                v-model="editForm.isIncludeSub"
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
      </el-form>
    </div>
    <template #footer>
      <span class="roleData-dialog-footer">
        <el-button @click="closeBtn">取 消</el-button>
        <el-button type="primary" v-if="opType != 'view'" @click="saveBtn">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import * as sysApi from '@/apis/sys';
import { useGetters } from '@/utils/hooks/store-hooks';
import { resetFields } from '@/utils/plugin/global';
import { ElMessage, ElForm } from 'element-plus';
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  onMounted,
  computed,
} from 'vue';
import { formRules } from './tmpl-model';
import BaseOrgAuth from '@/components/business/org/authOrg/base-org-auth.vue';
export default defineComponent({
  components: {
    BaseOrgAuth,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    opType: {
      type: String,
      default: '',
    },
    roleInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:visible', 'doQuery'],
  setup: (props, { emit }) => {
    const appGetters = useGetters('app', ['getCodeList']);
    const refDialogForm = ref(ElForm);
    const { roleInfo } = { ...props };
    const dataMap = reactive({
      editForm: {
        roleDataId: '',
        roleId: '',
        tableName: '',
        authType: '',
        authScopeId: '',
        authScopeName: '',
        isIncludeSub: '',
        ver: 0,
      },
      editFormRules: formRules,
      orgSelectVisible: false,
      btnAble: true,
      dialogVisible: computed({
        get: () => props.visible,
        set: (val) => {
          emit('update:visible', val);
        },
      }),
      initInfo: roleInfo,
    });
    const methodMap = reactive({
      closeBtn: () => {
        dataMap.dialogVisible = false;
      },
      //权限类型更改
      handelChange: () => {
        if (dataMap.editForm.authType === '2') {
          dataMap.editForm.authScopeId = 'owner';
          dataMap.editForm.authScopeName = '本人数据';
        }
      },
      //获取机构
      getOrgData(val: any) {
        dataMap.editForm.authScopeId = val.id;
        dataMap.editForm.authScopeName = val.name;
      },
      //保存
      saveBtn: () => {
        refDialogForm.value.validate(async (valid: any) => {
          if (valid) {
            const apiArray = [
              { businessType: 'add', apiUrl: 'addRoleData' }, //新增
              { businessType: 'update', apiUrl: 'updateRoleData' }, //修改
              { businessType: 'view', apiUrl: 'getRoleData' }, //查看
            ];
            let api = apiArray.filter(
              (k) => k.businessType === props.opType
            )[0];
            if (!api) {
              ElMessage.error('未匹配到表单操作类型');
              return false;
            }
            const res = await sysApi[api.apiUrl]({ ...dataMap.editForm }); //调用接口
            if (res.code === 200) {
              ElMessage.success('操作成功');
              resetFields(dataMap.editForm); //清空表单
              methodMap.closeBtn(); //关闭弹窗
              emit('doQuery'); //重新查询
            } else {
              ElMessage.error(res.msg);
              return false;
            }
          } else {
            return false;
          }
          return valid;
        });
      },
      //初始化
      doInit: async () => {
        Object.keys(dataMap.editForm).forEach((item) => {
          dataMap.initInfo[item]
            ? (dataMap.editForm[item] = dataMap.initInfo[item])
            : '';
        });
      },
    });
    onMounted(() => {
      methodMap.doInit();
    });

    return {
      refDialogForm,
      ...appGetters,
      ...toRefs(dataMap),
      ...toRefs(methodMap),
    };
  },
});
</script>

<style></style>
