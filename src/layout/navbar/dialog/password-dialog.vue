<template>
  <el-dialog
    v-model="visible"
    width="50%"
    title="修改密码"
    destroy-on-close
    @closed="onClose"
    top="6vh"
  >
    <el-form
      class="changeForm"
      :model="editForm"
      :rules="editFormRules"
      ref="editFormRef"
      width="100%"
      label-width="86px"
    >
      <el-row>
        <el-col :span="23">
          <el-form-item label="用户名:" prop="userName">
            <el-input v-model="editForm.userName" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="原密码:" prop="oldPassword">
            <el-input
              type="password"
              show-password
              v-model="editForm.oldPassword"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="新密码:" prop="newPassword">
            <el-input
              type="password"
              show-password
              v-model="editForm.newPassword"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <el-form-item label="确认密码:" prop="configNewPassword">
            <el-input
              type="password"
              show-password
              v-model="editForm.configNewPassword"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="密码格式:">
            <div class="passText">{{ passTip }}</div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="handleOk">确 定</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { formRules } from './dialog-from';
import { ElForm, ElMessage } from 'element-plus';
import * as sysApi from '@/apis/sys';
import { useGetters } from '@/utils/hooks/store-hooks';

export default defineComponent({
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  emits: ['update:dialogVisible'],
  setup(props, { emit }) {
    const userGetters = useGetters('user', ['getUserInfo']);
    const editFormRef = ref(ElForm);
    const appGetters = useGetters('app', ['getCodeList']);
    const { dialogVisible } = toRefs({
      ...props,
    });

    const state = reactive<{ visible: boolean }>({
      visible: dialogVisible.value,
    });
    const dataMap = reactive({
      editForm: {
        userId: '',
        userName: '',
        oldPassword: '',
        configNewPassword: '',
        newPassword: '',
      },
      editFormRules: formRules,
      passTip: '4~12 个字符，只能输入英文和数字',
    });
    const methodsMap = reactive({
      onClose() {
        emit('update:dialogVisible', false);
      },

      handleOk: async () => {
        const { code } = await sysApi.updatePassword(dataMap.editForm);
        if (code === 200) {
          ElMessage.success('修改密码成功!');
        } else {
          ElMessage.error('修改密码失败!');
        }
        methodsMap.onClose();
      },

      inInt() {
        dataMap.editForm.userId = userGetters.getUserInfo.value.userId;
        dataMap.editForm.userName = userGetters.getUserInfo.value.userName;
      },
    });
    onMounted(() => {
      methodsMap.inInt();
    });
    return {
      editFormRef,
      ...appGetters,
      ...toRefs(state),
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
    };
  },
});
</script>
<style lang="scss" scoped>
.changeForm {
  margin-top: 20px;
}

.passText {
  width: 100%;
  line-height: 32px;
  color: #cc3c29;
}
</style>
