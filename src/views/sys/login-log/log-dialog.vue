<template>
  <el-dialog
    title="查看日志"
    v-model="visible"
    width="500px"
    destroy-on-close
    @closed="onClose"
    draggable
  >
    <div class="base-dialog-form">
      <el-form :model="editForm" label-width="72px">
        <el-form-item label="日志ID:" prop="logId">
          <el-input v-model="editForm.logId" :readonly="true"></el-input>
        </el-form-item>

        <el-form-item label="用户ID:" prop="userId">
          <el-input v-model="editForm.userId" :readonly="true"></el-input>
        </el-form-item>

        <el-form-item label="用户姓名:" prop="userName">
          <el-input v-model="editForm.userName" :readonly="true"></el-input>
        </el-form-item>

        <el-form-item label="日志内容:" prop="logInfo">
          <el-input v-model="editForm.logInfo" :readonly="true"></el-input>
        </el-form-item>

        <el-form-item label="IP地址:" prop="ipAddr">
          <el-input v-model="editForm.ipAddr" :readonly="true"></el-input>
        </el-form-item>

        <el-form-item label="发生时间:" prop="logTime">
          <el-input
            type="textarea"
            v-model="editForm.logTime"
            :readonly="true"
          ></el-input>
        </el-form-item>
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
