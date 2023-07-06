<template>
  <el-dialog
    title="查看日志"
    v-model="visible"
    width="75vw"
    destroy-on-close
    @closed="onClose"
  >
    <div class="base-dialog-form">
      <el-form size:small :inline="false" :model="editForm" label-width="72px">
        <el-row :gutter="6">
          <el-col :span="8">
            <el-form-item label="日志ID:" prop="operLogId">
              <el-input
                v-model="editForm.operLogId"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模块名称:" prop="moduleName">
              <el-input
                v-model="editForm.moduleName"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作类型:" prop="operType">
              <el-input v-model="editForm.operType" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="6">
          <el-col :span="8">
            <el-form-item label="操作来源:" prop="operSource">
              <el-input
                v-model="editForm.operSource"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户名称:" prop="userName">
              <el-input v-model="editForm.userName" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户ID:" prop="userId">
              <el-input v-model="editForm.userId" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="6">
          <el-col :span="8">
            <el-form-item label="机构名称:" prop="orgId">
              <el-input v-model="editForm.orgName" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构ID:" prop="orgId">
              <el-input v-model="editForm.orgId" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="请求方式:" prop="reqMode">
              <el-input v-model="editForm.reqMode" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="8">
            <el-form-item label="请求URL:" prop="reqUrl">
              <el-input v-model="editForm.reqUrl" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="IP地址:" prop="ipAddr">
              <el-input v-model="editForm.ipAddr" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发生时间:" prop="logTime">
              <el-input v-model="editForm.logTime" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="16">
            <el-form-item label="方法名称:" prop="reqMethod">
              <el-input
                v-model="editForm.reqMethod"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否成功:" prop="isOk">
              <el-input v-model="editForm.isOk" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="请求参数:" prop="reqParam">
              <el-input
                type="textarea"
                :rows="4"
                v-model="editForm.reqParam"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="24">
            <el-form-item label="返回结果:" prop="result">
              <el-input
                type="textarea"
                :rows="5"
                v-model="editForm.result"
                :readonly="true"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <span class="role-dialog-footer">
        <el-button @click="onClose">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, toRefs, reactive, computed } from 'vue';
export default defineComponent({
  name: 'LogDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:dialogVisible'],
  setup(props, { emit }) {
    const dataMap = reactive({
      visible: computed({
        get: () => props.dialogVisible,
        set: (val: boolean) => {
          emit('update:dialogVisible', val);
        },
      }),
      editForm: { ...props.dialogInfo },
      onClose() {
        emit('update:dialogVisible', false);
      },
    });
    return {
      ...toRefs(dataMap),
    };
  },
});
</script>
