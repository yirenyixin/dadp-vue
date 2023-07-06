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
        ref="refCodeInfoForm"
        :rules="editFormRules"
        :model="editForm"
        label-width="112px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="代码类别ID:" prop="codeTypeId">
              <el-input
                v-model="editForm.codeTypeId"
                :disabled="optionType != 'add'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="代码类别名称:" prop="codeTypeName">
              <el-input
                v-model="editForm.codeTypeName"
                :disabled="optionType == 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="排序号:" prop="sortNo">
              <el-input-number
                v-model="editForm.sortNo"
                :disabled="optionType == 'view'"
                width="100%"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input
                :rows="4"
                type="textarea"
                v-model="editForm.remark"
                :disabled="optionType == 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <span class="func-dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" v-if="optionType != 'view'" @click="onConfirm"
          >确 定</el-button
        >
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
  onMounted,
  nextTick,
  computed,
} from 'vue';
import * as sysApi from '@/apis/sys';
import { codeInfoFromRules } from './code-type-hook';
export default defineComponent({
  name: 'CodeTypeDialog',
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
    const refCodeInfoForm = ref(null);
    const dataMap = reactive({
      editForm: {
        codeTypeId: '',
        codeTypeName: '',
        isPinyin: '0',
        sortNo: 0,
        remark: '',
        ver: 0,
      },
      editFormRules: codeInfoFromRules,
      visible: computed({
        get: () => props.dialogVisible,
        set: (val: boolean) => {
          emit('update:dialogVisible', val);
        },
      }),
      initInfo: dialogInfo,
    });
    const methodsMap = reactive({
      resetForm() {
        (refCodeInfoForm.value as any).resetFields();
      },
      onUpdata() {
        emit('updateList');
      },
      onClose() {
        dataMap.visible = false;
      },
      //保存
      onConfirm() {
        (refCodeInfoForm.value as any).validate(async (valid: any) => {
          if (valid) {
            props.optionType === 'add'
              ? await sysApi.codeTypeSave({ ...dataMap.editForm })
              : await sysApi.updateCodeType({ ...dataMap.editForm });
            const msg =
              props.optionType === 'add' ? '新增成功！' : '修改成功！';
            ElMessage({ type: 'success', message: msg });
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
        if (props.optionType === 'add') return;
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
      refCodeInfoForm,
      ...toRefs(methodsMap),
      ...toRefs(dataMap),
    };
  },
});
</script>
<style lang="scss" scoped></style>
