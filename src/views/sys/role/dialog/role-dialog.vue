<template>
  <el-dialog
    :title="dialogTitle"
    v-model="visible"
    width="50vw"
    destroy-on-close
    @closed="onClose"
  >
    <div class="base-dialog-form">
      <component
        :ref="currenComponet.refName"
        :is="currenComponet.component"
        :msgInfo="dialogInfo"
        :opType="optionType"
        @close="onClose"
        @handleFn="onUpdata"
      ></component>
    </div>
    <template #footer>
      <span class="role-dialog-footer">
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
  shallowRef,
  computed,
} from 'vue';
import BaseRole from './base-role.vue';
import PowerRole from './power-role.vue';
export default defineComponent({
  name: 'RoleDialog',
  components: {
    BaseRole,
    PowerRole,
  },
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
  emits: ['update:dialogVisible', 'onUpdata'],
  setup(props, { emit }) {
    const baseRoleRef = ref(null);
    const powerRoleRef = ref(null);
    const dataMap = reactive({
      currenComponet: {},
      componentList: [
        {
          refName: 'baseRoleRef',
          component: shallowRef(BaseRole),
        },
        {
          refName: 'powerRoleRef',
          component: shallowRef(PowerRole),
        },
      ],
      visible: computed({
        get: () => props.dialogVisible,
        set: (val: boolean) => {
          emit('update:dialogVisible', val);
        },
      }),
    });
    const methodsMap = reactive({
      onUpdata: () => {
        methodsMap.onClose();
        emit('onUpdata');
      },
      onClose: () => {
        dataMap.visible = false;
      },
      //保存
      onConfirm: () => {
        switch (props.optionType) {
          case 'add':
            (baseRoleRef.value as any).addOrEditRole();
            break;
          case 'update':
            (baseRoleRef.value as any).addOrEditRole();
            break;
          case 'powerConfig':
            (powerRoleRef.value as any).savePowerConfig();
            break;
          default: {
            ElMessage.error('错误类型操作!');
          }
        }
      },
      //初始化
      initFrom: () => {
        dataMap.currenComponet =
          props.optionType === 'powerConfig'
            ? dataMap.componentList[1]
            : dataMap.componentList[0];
      },
    });
    onMounted(() => {
      methodsMap.initFrom();
    });
    return {
      baseRoleRef,
      powerRoleRef,
      ...toRefs(methodsMap),
      ...toRefs(dataMap),
    };
  },
});
</script>
<style lang="scss" scoped></style>
