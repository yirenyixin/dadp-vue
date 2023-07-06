<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box-pic"></div>
      <div class="login-box-content">
        <div class="login-content-title">
          <img
              class="login-content-title-img"
              src="~@/assets/image/logo.png"
              alt=""
          />
          <div class="login-content-title-cn">DADP微服务快速开发平台</div>
        </div>
        <div class="login-content-form">
          <el-form ref="dataFormRef" :model="formInline" :rules="loginRules">
            <el-form-item prop="loginName">
              <el-input
                  class="login-content-form-input"
                  v-model="formInline.loginName"
                  placeholder="请输入用户名"
                  autocomplete="on"
                  clearable
              >
                <template #prepend>
                  <el-icon>
                    <user/>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                  class="login-content-form-input"
                  v-model="formInline.password"
                  placeholder="请输入密码"
                  show-password
                  autocomplete="on"
                  name="password"
                  clearable
                  @keyup.enter="submitForm"
              >
                <template #prepend>
                  <el-icon>
                    <lock/>
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                  class="login-content-form-button"
                  type="primary"
                  @click="submitForm"
              >登录
              </el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from 'vue';
import {useActions} from '@/utils/hooks/store-hooks';
import {UserActionTypes} from '@/store/modules/user/action-types';
import {useRouter} from 'vue-router';

export default defineComponent({
  setup() {
    const router = useRouter();
    const actionHooks = useActions('user', {
      doLogin: UserActionTypes['ACTION_LOGIN'],
    });

    const dataFormRef = ref(null);
    const dataMap = reactive({
      formInline: {
        loginName: '',
        password: '',
      },
      loginRules: {
        loginName: [
          {
            required: true,
            message: '请输入用户名!',
            trigger: 'blur',
          },
        ],
        password: [{required: true, message: '请输入密码!', trigger: 'blur'}],
      },
    });
    const methodsMap = reactive({
      submitForm: async () => {
        (dataFormRef.value as any).validate(async (valid: boolean) => {
          if (valid) {
            await actionHooks['doLogin']({...dataMap.formInline});
            router.push({path: '/'});
          } else {
            return false;
          }
        });
      },
    });

    return {
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
      actionHooks,
      dataFormRef,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "@/theme-chalk/login/index.scss";
</style>
