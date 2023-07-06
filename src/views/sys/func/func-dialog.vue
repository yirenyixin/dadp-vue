<template>
  <el-dialog
    :title="dialogTitle"
    v-model="visible"
    width="450px"
    destroy-on-close
    @closed="onClose"
  >
    <div class="base-dialog-form">
      <el-form
        ref="funcEditForm"
        :model="editForm"
        :rules="funcFromRules"
        label-width="86px"
      >
        <el-form-item label="功能ID:" prop="funcId">
          <el-input
            v-model="editForm.funcId"
            :disabled="optionType === 'update'"
          ></el-input>
        </el-form-item>

        <el-form-item label="功能名称:" prop="funcName">
          <el-input v-model="editForm.funcName"></el-input>
        </el-form-item>

        <el-form-item label="菜单ID:" prop="menuId">
          <el-input v-model="editForm.menuId" disabled></el-input>
        </el-form-item>

        <el-form-item label="序号:" prop="sortNo">
          <el-input-number v-model="editForm.sortNo" :min="0"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="func-dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus';
import {
  defineComponent,
  ref,
  toRefs,
  reactive,
  watch,
  onMounted,
  nextTick,
  computed,
} from 'vue';
import * as sysApi from '@/apis/sys';
import { editFormRules } from './func-hook';
export default defineComponent({
  name: 'FuncDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: '',
    },
    optionType: {
      type: String,
      default: '',
    },
    dialogInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:dialogVisible', 'updateList'],
  setup(props, { emit }) {
    const { dialogInfo } = { ...props };
    const funcEditForm = ref(null);
    const dataMap = reactive({
      editForm: {
        funcId: '',
        funcName: '',
        menuId: '',
        sortNo: 0,
        ver: 0,
      },
      funcFromRules: editFormRules,
      initInfo: dialogInfo,
      visible: computed({
        get: () => props.dialogVisible,
        set: (val: boolean) => {
          emit('update:dialogVisible', val);
        },
      }),
    });
    const methodsMap = reactive({
      onUpdata() {
        emit('updateList');
      },
      onClose() {
        dataMap.visible = false;
      },
      resetForm() {
        (funcEditForm.value as any).resetFields();
      },
      //保存
      onConfirm() {
        (funcEditForm.value as any).validate(async (valid: any) => {
          if (valid) {
            props.optionType === 'add'
              ? await sysApi.addFuncSave({ ...dataMap.editForm })
              : await sysApi.updateFunc({ ...dataMap.editForm });
            let msg = props.optionType === 'add' ? '新增成功！' : '修改成功！';
            ElMessage({
              type: 'success',
              message: msg,
            });
            methodsMap.onUpdata();
            methodsMap.onClose();
          } else {
            return false;
          }
          return valid ? true : false;
        });
      },
      //初始化
      initFrom() {
        nextTick(() => {
          Object.keys(dataMap.editForm).forEach((item) => {
            dataMap.initInfo[item]
              ? (dataMap.editForm[item] = dataMap.initInfo[item])
              : '';
          });
        });
      },
    });
    onMounted(() => {
      methodsMap.initFrom();
    });
    return {
      funcEditForm,
      ...toRefs(methodsMap),
      ...toRefs(dataMap),
    };
  },
});
</script>
<style lang="scss" scoped></style>
