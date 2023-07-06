<template>
  <el-form
    ref="refRoleForm"
    :rules="roleFromRules"
    :model="formData"
    label-width="100px"
  >
    <el-form-item label="角色ID:" prop="roleId">
      <el-input
        v-model="formData.roleId"
        :disabled="opType != 'add'"
      ></el-input>
    </el-form-item>

    <el-form-item label="角色名称:" prop="roleName">
      <el-input
        v-model="formData.roleName"
        :disabled="opType == 'view'"
      ></el-input>
    </el-form-item>

    <el-form-item label="登录后首页:" prop="homeUrl">
      <el-select
        v-model="formData.homeUrl"
        :disabled="opType == 'view'"
        style="width: 100%"
      >
        <el-option
          v-for="item in getCodeList['homeUrl']"
          :key="item.value"
          :label="item.content"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="法人机构Id:" prop="lawOrgId">
      <el-input
        v-model="formData.lawOrgId"
        :disabled="opType == 'view'"
      ></el-input>
    </el-form-item>

    <el-form-item label="排序号:" prop="sortNo">
      <el-input-number
        v-model="formData.sortNo"
        :min="0"
        :max="2147483647"
        :disabled="opType == 'view'"
        style="width: 100%"
      ></el-input-number>
    </el-form-item>

    <el-form-item label="备注:" prop="remark">
      <el-input
        :rows="4"
        type="textarea"
        v-model="formData.remark"
        :disabled="opType == 'view'"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { ElForm, ElMessage } from 'element-plus';
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  onMounted,
  nextTick,
} from 'vue';
import * as sysApi from '@/apis/sys';
import { useGetters } from '@/utils/hooks/store-hooks';

export default defineComponent({
  name: 'baseRole',
  props: {
    opType: {
      type: String,
      default: '',
    },
    msgInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['handleFn'],
  setup(props, { emit }) {
    const appGetters = useGetters('app', ['getCodeList']);
    const { msgInfo } = { ...props };
    const refRoleForm = ref(ElForm);
    const dataMap = reactive({
      formData: {
        roleId: '',
        roleName: '',
        homeUrl: '',
        isAdmin: '',
        hpType: '',
        sortNo: 0,
        lawOrgId: '1',
        remark: '',
        ver: 0,
      },
      initInfo: msgInfo,
      roleFromRules: {
        roleId: [
          { required: true, message: '请输入角色ID', trigger: 'blur' },
          { max: 32, message: '长度在32个字符以内', trigger: 'blur' },
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { max: 100, message: '长度在100个字符以内', trigger: 'blur' },
        ],
        lawOrgId: [
          { required: true, message: '请输入机构id', trigger: 'blur' },
        ],
        homeUrl: [
          { required: true, message: '请选择登录后首页', trigger: 'blur' },
        ],
        sortNo: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
        remark: [{ max: 400, message: '长度在400个字符以内', trigger: 'blur' }],
      },
      //新增或修改
      addOrEditRole() {
        refRoleForm.value.validate(async (valid: any) => {
          if (valid) {
            props.opType === 'add'
              ? await sysApi.addRoleSave({ ...dataMap.formData })
              : await sysApi.updateRole({ ...dataMap.formData });
            let msg = props.opType === 'add' ? '新增成功！' : '修改成功！';
            ElMessage({
              type: 'success',
              message: msg,
            });
            emit('handleFn');
          } else {
            return false;
          }
          return valid ? true : false;
        });
      },
      //初始化
      initFrom: () => {
        nextTick(() => {
          Object.keys(dataMap.formData).forEach((item) => {
            dataMap.initInfo[item]
              ? (dataMap.formData[item] = dataMap.initInfo[item])
              : '';
          });
        });
      },
    });
    onMounted(() => {
      dataMap.initFrom();
    });
    return {
      refRoleForm,
      ...appGetters,
      ...toRefs(dataMap),
    };
  },
});
</script>
<style lang="scss" scoped></style>
