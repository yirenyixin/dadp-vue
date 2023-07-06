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
        ref="configEditForm"
        :rules="editFormRules"
        :model="editForm"
        label-width="84px"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数 ID:" prop="configId">
              <el-input
                v-model="editForm.configId"
                :readonly="optionType != 'add'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数名称:" prop="configName">
              <el-input
                v-model="editForm.configName"
                :readonly="optionType === 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数值:" prop="configValue">
              <el-input
                v-model="editForm.configValue"
                :readonly="optionType === 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="排序号:" prop="sortNo">
              <el-input-number
                v-model="editForm.sortNo"
                :disabled="optionType === 'view'"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="editForm.remark"
                type="textarea"
                rows="4"
                :readonly="optionType === 'view'"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <span class="role-dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="onConfirm" v-if="optionType != 'view'"
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
import { configFromRules } from './config-hook';
export default defineComponent({
  name: 'ConfigDialog',
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
    const configEditForm = ref(null);
    const { dialogInfo } = { ...props };
    const dataMap = reactive({
      editForm: {
        configId: '',
        configName: '',
        configValue: '',
        sortNo: 0,
        remark: '',
        ver: 0,
      },
      editFormRules: configFromRules,
      visible: computed({
        get: () => props.dialogVisible,
        set: (val: boolean) => {
          emit('update:dialogVisible', val);
        },
      }),
      initInfo: dialogInfo,
    });
    const methodsMap = reactive({
      //重置
      resetForm() {
        (configEditForm.value as any).resetFields();
      },
      //更新
      onUpdata() {
        emit('updateList');
      },
      //关闭
      onClose() {
        dataMap.visible = false;
      },
      //保存
      onConfirm() {
        (configEditForm.value as any).validate(async (valid: any) => {
          if (valid) {
            props.optionType === 'add'
              ? await sysApi.addConfig({ ...dataMap.editForm })
              : await sysApi.updConfig({ ...dataMap.editForm });
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
        if (props.optionType != 'add') {
          nextTick(() => {
            Object.keys(dataMap.editForm).forEach((item) => {
              dataMap.initInfo[item]
                ? (dataMap.editForm[item] = dataMap.initInfo[item])
                : '';
            });
          });
        }
      },
    });
    onMounted(() => {
      methodsMap.initFrom();
    });
    return {
      configEditForm,
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
    };
  },
});
</script>
