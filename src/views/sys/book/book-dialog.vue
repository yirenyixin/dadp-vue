<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    width="80vw"
    destroy-on-close
    @closed="onClose"
  >
    <div class="base-dialog-form">
      <el-scrollbar height="65vh">
        <el-form
          ref="userEditForm"
          :model="editForm"
          :rules="editFormRules"
          label-width="100px"
        >
          <el-row :gutter="6">
            <el-col :span="8">
              <el-form-item label="用户ID:" prop="roleId">
                <el-input
                  v-model="editForm.roleId"
                  :readonly="opType != 'add'"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户姓名:" prop="role">
                <el-input
                  v-model="editForm.role"
                  :readonly="opType === 'view'"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="作者:" prop="author">
                <el-input
                    v-model="editForm.author"
                    :readonly="opType === 'view'"
                    clearable
                ></el-input>
              </el-form-item>
            </el-col>
<!--            <el-col :span="8">-->
<!--              <el-form-item label="当前角色:" prop="roleId">-->
<!--                <el-select-->
<!--                  style="width: 100%"-->
<!--                  v-model="editForm.roleId"-->
<!--                  :disabled="opType === 'view'"-->
<!--                  clearable-->
<!--                >-->
<!--                  <el-option-->
<!--                    v-for="item in getCodeList['roleId']"-->
<!--                    :key="item.value"-->
<!--                    :label="item.content"-->
<!--                    :value="item.value"-->
<!--                  ></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
          </el-row>
          <el-row :gutter="6">
            <el-col :span="8">
              <el-form-item label="图书Id:" prop="bookId">
                <el-input
                    v-model="editForm.bookId"
                    :readonly="opType != 'add'"
                    clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="图书名:" prop="bookName">
                <el-input
                    v-model="editForm.bookName"
                    :readonly="opType === 'view'"
                    clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="创建时间:" prop="createTime">
                <el-date-picker
                    v-model="editForm.createTime"
                    type="datetime"
                    :readonly="opType === 'view'"
                    clearable
                    placeholder="选择创建时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>

<!--            <el-col :span="8">-->
<!--              <el-form-item label="登录名:" prop="loginName">-->
<!--                <el-input-->
<!--                  v-model="editForm.loginName"-->
<!--                  :readonly="opType === 'view'"-->
<!--                  clearable-->
<!--                ></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <el-form-item label="密码:" prop="password">-->
<!--                <el-input-->
<!--                  v-model="editForm.password"-->
<!--                  :readonly="opType === 'view'"-->
<!--                  clearable-->
<!--                ></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <el-form-item label="手机号:" prop="tel">-->
<!--                <el-input-->
<!--                  v-model="editForm.tel"-->
<!--                  :readonly="opType === 'view'"-->
<!--                  clearable-->
<!--                ></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
          </el-row>
          <el-row :gutter="6">
<!--            <el-col :span="8">-->
<!--              <el-form-item label="身份证号码:" prop="idCardNo">-->
<!--                <el-input-->
<!--                  type="text"-->
<!--                  v-model="editForm.idCardNo"-->
<!--                  :readonly="opType === 'view'"-->
<!--                  clearable-->
<!--                ></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <el-form-item label="性别:" prop="sex">-->
<!--                <el-select-->
<!--                  style="width: 100%"-->
<!--                  v-model="editForm.sex"-->
<!--                  :readonly="opType === 'view'"-->
<!--                  clearable-->
<!--                >-->
<!--                  <el-option-->
<!--                    v-for="item in getCodeList['userSex']"-->
<!--                    :key="item.value"-->
<!--                    :label="item.content"-->
<!--                    :value="item.value"-->
<!--                  ></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <el-form-item label="排序号:" prop="sortNo">-->
<!--                <el-input-number-->
<!--                  style="width: 100%"-->
<!--                  v-model="editForm.sortNo"-->
<!--                  :min="0"-->
<!--                  :max="2147483647"-->
<!--                  :disabled="opType === 'view'"-->
<!--                  clearable-->
<!--                ></el-input-number>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <el-form-item label="用户状态:" prop="status">-->
<!--                <el-select-->
<!--                  style="width: 100%"-->
<!--                  v-model="editForm.status"-->
<!--                  :disabled="opType === 'view'"-->
<!--                  clearable-->
<!--                >-->
<!--                  <el-option-->
<!--                    v-for="item in getCodeList['userStatus']"-->
<!--                    :key="item.value"-->
<!--                    :label="item.content"-->
<!--                    :value="item.value"-->
<!--                  ></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="8">-->
<!--              <el-form-item label="所属机构:" prop="orgName">-->
<!--                <el-input type="text" v-model="editForm.orgName" readonly>-->
<!--                  <template #append>-->
<!--                    <el-button-->
<!--                      @click="orgSelectVisible = true"-->
<!--                      :disabled="opType === 'view'"-->
<!--                      ><el-icon><search /></el-icon-->
<!--                    ></el-button>-->
<!--                  </template>-->
<!--                </el-input>-->
<!--                <base-org-auth-->
<!--                  v-if="orgSelectVisible"-->
<!--                  v-model:orgSelectVisible="orgSelectVisible"-->
<!--                  @getOrgSelectData="getOrgSelectData"-->
<!--                >-->
<!--                </base-org-auth>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="24">-->
<!--              <el-form-item label="全部角色:" prop="roleIds">-->
<!--                <el-select-->
<!--                  style="width: 100%"-->
<!--                  v-model="editForm.roleIds"-->
<!--                  multiple-->
<!--                  :disabled="opType === 'view'"-->
<!--                >-->
<!--                  <el-option-->
<!--                    v-for="item in getCodeList['roleId']"-->
<!--                    :key="item.value"-->
<!--                    :label="item.content"-->
<!--                    :value="item.value"-->
<!--                  ></el-option>-->
<!--                </el-select>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
          </el-row>
          <el-row :gutter="6">
<!--            <el-col :span="24">-->
<!--              <el-form-item label="备注:" prop="remark">-->
<!--                <el-input-->
<!--                  :rows="4"-->
<!--                  type="textarea"-->
<!--                  v-model="editForm.remark"-->
<!--                  :readonly="opType === 'view'"-->
<!--                  clearable-->
<!--                ></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
          </el-row>
        </el-form>
      </el-scrollbar>
    </div>
    <template #footer>
      <span class="func-dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" v-if="opType != 'view'" @click="onConfirm"
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
import { RowType, bookCommonRules } from './book-hook';
import baseOrgAuth from '@/components/business/org/authOrg/base-org-auth.vue';
import { useGetters } from '@/utils/hooks/store-hooks';
import { getNameByCode } from '@/utils/plugin/global';

export default defineComponent({
  name: 'UserDialog',
  // components: {
  //   baseOrgAuth,
  // },
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
    userInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:visible', 'updateList'],
  setup(props, { emit }) {
    const appGetters = useGetters('app', ['getCodeList']);
    const userEditForm = ref(null);
    const { opType, userInfo } = { ...props };
    const propsMap = reactive({
      businessType: opType,
      dialogData: userInfo,
      dialogVisible: computed({
        get: () => props.visible,
        set: (val: boolean) => {
          emit('update:visible', val);
        },
      }),
    });
    const dataMap = reactive({
      editForm: {
        // userId: '',
        // userName: '',
        // loginName: '',
        // tel: '',
        // password: '',
        // sex: '',
        // orgId: '',
        // orgName: '',
        // roleId: '',
        // roleIds: [],
        // status: '',
        sortNo: 0,
        ver: 0,
        // remark: '',

        bookId:'',
        bookName:'',
        author:'',
        createTime:'',
        role:'',
        roleId:'',
      },
      editFormRules: bookCommonRules,
      orgSelectVisible: false,
    });
    const methodsMap = reactive({
      getOrgSelectData: async (val: any) => {
        dataMap.editForm.bookId = val.id;
        dataMap.editForm.bookName = val.name;
      },
      resetForm() {
        (userEditForm.value as any).resetFields();
      },
      onUpdata() {
        emit('updateList');
      },
      onClose() {
        propsMap.dialogVisible = false;
      },
      //保存
      onConfirm() {
        (userEditForm.value as any).validate(async (valid: any) => {
          if (valid) {
            let params = { ...dataMap.editForm };
            let queryParams = {} as RowType;
            Object.keys(params).forEach((item) => {
              // if (item === 'roleIds') {
              //   queryParams.roleId = params.roleIds.join(',');
              //   dataMap.editForm;
              // } else {
                queryParams[item] = params[item];
              // }
            });
            propsMap.businessType === 'add'
              ? await sysApi.addBook(queryParams)
              : await sysApi.updBook(queryParams);
            let msg =
              propsMap.businessType === 'add' ? '新增成功！' : '修改成功！';
            ElMessage({
              type: 'success',
              message: msg,
            });
            methodsMap.onClose();
            methodsMap.onUpdata();
          } else {
            return false;
          }
          return valid ? true : false;
        });
      },
      //初始化数据
      initFrom: () => {
        nextTick(() => {
          Object.keys(dataMap.editForm).forEach((item) => {
            // if (item != 'roleIds') {
              propsMap.dialogData[item]
                ? (dataMap.editForm[item] = propsMap.dialogData[item])
                : '';
            // }
          });
          dataMap.editForm.bookName = getNameByCode(
            '',
            dataMap.editForm.bookId
          );
          //把roleIds转为数组
          // let roleIds = propsMap.dialogData.roleIds
          //   ? propsMap.dialogData.roleIds.split(',')
          //   : [];

          // dataMap.editForm.roleIds = roleIds;
        });
      },
    });
    onMounted(() => {
      methodsMap.initFrom();
    });
    return {
      userEditForm,
      ...toRefs(propsMap),
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
      ...appGetters,
    };
  },
});
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
}
</style>
