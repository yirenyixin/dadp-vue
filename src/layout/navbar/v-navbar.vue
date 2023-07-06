<template>
  <div class="navbar">
    <div class="navbar-left">
      <div class="navbar-left-logo">
        <img src="@/assets/image/my-logo.png" alt="zdjx" />
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="navbar-left-title">DADP微服务快速开发平台4.3</div>
    </div>
    <div class="navbar-center">
      <slot name="navContent"></slot>
    </div>
    <div class="navbar-right">
      <div class="navbar-right-user">
        <div class="user-info">{{ getUserInfo.userName }}</div>
        <el-divider direction="vertical"></el-divider>
        <div class="user-roles">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              {{ getUserInfo.roleName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in getRoleList"
                  :key="item.roleId"
                  :command="item"
                  >{{ item.roleName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="password-icon" @click="changePassword">
            <el-tooltip content="修改密码" placement="bottom" effect="dark">
              <el-icon size="24"><lock /></el-icon>
            </el-tooltip>
          </div>
        </div>
        <el-divider direction="vertical"></el-divider>
        <div class="logout-text" @click="doLogout">
          <el-tooltip content="退出登录" placement="bottom" effect="dark">
            <el-icon size="24">
              <switch-button />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
      <password-change
        v-if="dialogVisible"
        v-model:dialogVisible="dialogVisible"
      >
      </password-change>
    </div>
  </div>
</template>
<script lang="ts">
import router from '@/router';
import { RoleType } from '@/store/modules/permission/state';
import { UserActionTypes } from '@/store/modules/user/action-types';
import { TagsActionTypes } from '@/store/modules/tagsview/action-types';
import { defineComponent, reactive, toRefs } from 'vue';
import { useActions, useGetters } from '@/utils/hooks/store-hooks';
import passwordChange from './dialog/password-dialog.vue';
export default defineComponent({
  components: {
    passwordChange,
  },
  setup() {
    const userGetters = useGetters('user', ['getUserInfo']);
    const perGetters = useGetters('permission', ['getRoleList']);
    const actionHooks = useActions('user', {
      changRole: UserActionTypes['ACTION_CHANGE_ROLES'],
      logout: UserActionTypes['ACTION_LOGIN_OUT'],
    });
    const acTagsHooks = useActions('tagsView', {
      closeAllTags: TagsActionTypes['ACTION_DEL_ALL_VIEW'],
    });
    const dataMap = reactive({
      dialogVisible: false,
    });
    const methodMap = reactive({
      handleCommand: (commnd: RoleType) => {
        actionHooks.changRole({ ...commnd });
      },
      doLogout: async () => {
        await actionHooks.logout();
        await acTagsHooks.closeAllTags();
        router.push({ path: '/login' });
      },
      changePassword: () => {
        dataMap.dialogVisible = true;
      },
    });
    return {
      ...userGetters,
      ...perGetters,
      actionHooks,
      ...toRefs(dataMap),
      ...toRefs(methodMap),
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/theme-chalk/layout/navbar/index.scss';
</style>
