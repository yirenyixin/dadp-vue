<template>
  <el-dialog
    title="选择用户"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    destroy-on-close
    width="70%"
    @close="onClose"
  >
    <div class="dialog-content">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm">
          <el-row>
            <el-col :span="10">
              <el-form-item label="用户号">
                <el-input v-model="searchForm.userId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="用户名称">
                <el-input v-model="searchForm.userName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" @click="queryBtn">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="user-table" style="width: 100%; height: 60vh">
        <me-dynamic-grid
          ref="dynamicGirdRef"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :total="total"
          :isSelect="true"
          v-model:currentPage="currentPage"
          v-model:pageSize="pageSize"
          @selection-change="handleSelectionChange"
          @size-change="queryBtn"
          @current-change="queryBtn"
        >
        </me-dynamic-grid>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="confirmBtn">确 定</el-button>
      <el-button @click="closeBtn">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';
import * as sysApi from '@/apis/sys';
import { ElMessage } from 'element-plus';
import { userTableColumns } from './user-auth-hook';

export default defineComponent({
  name: 'userSelectDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    setSub: {
      type: Boolean,
      defalut: true,
    },
  },
  emits: ['update:visible', 'getOrgSelectData', 'get'],

  setup(props, { emit }) {
    const userSelectTreeRef: any = ref(null);
    const dynamicGirdRef: any = ref(null);

    const propsMap = reactive({
      dialogVisible: computed({
        get: () => props.visible,
        set: (val: boolean) => {
          emit('update:visible', val);
        },
      }),
      isMult: props.multiple,
      containSub: props.setSub,
    });

    const dataMap = reactive({
      tableData: [],
      tableColumns: userTableColumns,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      selectRows: [],
      searchForm: {
        userId: '',
        userName: '',
        orgId: '',
        orgName: '',
      },
    });

    const methodsMap = reactive({
      //查询列表显示
      doQuery: (initPage = false) => {
        dataMap.currentPage = initPage ? 1 : dataMap.currentPage;
        dataMap.pageSize = initPage ? 10 : dataMap.pageSize;
        sysApi
          .queryAuthUser({
            pageNo: dataMap.currentPage,
            pageSize: dataMap.pageSize,
            containSub: propsMap.containSub,
            ...dataMap.searchForm,
          })
          .then((res) => {
            if (res.code === 200) {
              const { data } = { ...res };
              dataMap.tableData = data.rows;
              dataMap.total = data.total;
            } else {
              ElMessage.error(res.msg);
            }
          })
          .catch((err) => {
            console.log(err.msg);
          });
      },
      queryBtn: () => {
        methodsMap.doQuery(false);
      },

      confirmBtn() {
        if (dataMap.selectRows.length < 1) {
          ElMessage.warning('至少选择一个用户');
          return;
        }

        if (!propsMap.isMult && dataMap.selectRows.length != 1) {
          ElMessage.warning('只能选择一个用户');
          return;
        }

        emit('get', dataMap.selectRows);
        propsMap.dialogVisible = false;
      },

      handleSelectionChange(selection: any) {
        dataMap.selectRows = selection;
        // if (selection.length == 1) {
        //   dataMap.selectRows = selection;
        // }
        //   if (selection.length > 1) {
        //     (dynamicGirdRef.value as any).clearSelection();
        //     elTableRef.toggleRowSelection(selection.pop());
        //   }
      },

      closeBtn() {
        propsMap.dialogVisible = false;
      },
      onClose() {
        propsMap.dialogVisible = false;
      },
    });
    onMounted(() => {
      methodsMap.doQuery(true);
    });
    return {
      ...toRefs(propsMap),
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
      userSelectTreeRef,
    };
  },
});
</script>

<style lang="scss" scoped></style>
