<template>
  <div class="me-table">
    <div class="me-table-card">
      <div class="me-table-card-main">
        <el-row class="table-option-btn" v-if="hasOpbtn">
          <el-col :span="24">
            <slot name="tableBtns"></slot>
          </el-col>
        </el-row>
        <el-table
          ref="elTableRef"
          v-bind="$attrs"
          :data="tableData"
          :height="
            tableHight ? tableHight : hasOpbtn ? 'calc(100% - 48px)' : '100%'
          "
          highlight-current-row
          stripe
          border
          @row-click="rowClickFn"
          @row-dblclick="rowDbCliclFn"
          @selection-change="handleSelectionChange"
        >
          <el-table-column v-if="isSelect" type="selection" width="55" />
          <el-table-column
            v-if="isIndex"
            type="index"
            width="50"
            label="序号"
            align="center"
          >
            <template #default="scope">
              <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <template v-for="item in tableColumns" :key="item.prop">
            <el-table-column
              v-if="!item.hidden"
              :prop="item.prop"
              :label="item.label"
              :align="item.align"
              :formatter="item.formatter"
              :min-width="item.width"
              :sortable="item.sortable"
              :show-overflow-tooltip="item.overflow"
            >
              <template #default="scope" v-if="item.isClick">
                <el-button
                  type="text"
                  @click.stop="handleColumn(scope.row, item.prop)"
                  >{{ scope.row[item.prop] }}</el-button
                >
              </template>
            </el-table-column>
          </template>
          <slot name="table-column-end"></slot>
        </el-table>
      </div>
      <div class="me-table-card-footer" v-if="isPage">
        <slot name="table-footer">
          <el-pagination
            :pager-count="basePagerCount"
            :currentPage="currentPage"
            :pageSizes="pageSizes"
            :total="total"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next,  jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          >
          </el-pagination>
        </slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue';
export default defineComponent({
  name: 'VDynamicGrid',
  props: {
    //头部
    hasHeader: {
      type: Boolean,
      default: true,
    },
    //卡片title
    title: {
      type: String,
      default: '查询结果',
    },
    tableData: {
      type: Array,
      required: true,
    },
    tableColumns: {
      type: Array,
      required: true,
    },
    //是否显示复选框
    isSelect: {
      type: Boolean,
      default: false,
    },
    //是否显示序号列
    isIndex: {
      type: Boolean,
      default: false,
    },
    //总数
    total: {
      type: Number,
      default: 0,
    },
    //翻页操作
    currentPage: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    // 条/页限制
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50, 100],
    },
    //表格动态高度
    tableHight: {
      type: Number || String,
      default: 0,
    },
    isPage: {
      type: Boolean,
      default: true,
    },
    //分页按钮个数
    pagerCount: {
      type: Number,
      default: 5,
    },
    hasOpbtn: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'handleColumn',
    'selectionChange',
    'update:currentPage',
    'update:pageSize',
    'currentChange',
    'sizeChange',
    'row-click',
    'row-dblclick',
  ],
  setup(props, { emit }) {
    const elTableRef = ref(null);
    const dataMap = reactive({
      selectedColumns: [],
      isDblclick: false,
      basePagerCount: props.pagerCount,
    });
    const methodsMap = reactive({
      handleColumn: (row: any, $propKey: string) => {
        emit('handleColumn', { data: { ...row }, column: $propKey });
      },
      handleCurrentChange(currentPage: number) {
        emit('update:currentPage', currentPage);
        emit('currentChange');
      },
      handleSizeChange(pageSize: number) {
        emit('update:pageSize', pageSize);
        emit('sizeChange');
      },
      handleSelectionChange(val: any) {
        dataMap.selectedColumns = val;
        emit('selectionChange', val);
      },
      clearSelection() {
        (elTableRef.value as any).clearSelection();
      },
      rowClickFn(row: any) {
        emit('row-click', row);
        if (props.isSelect) {
          (elTableRef.value as any).toggleRowSelection(row);
        }
      },
      rowDbCliclFn(row: any) {
        if (props.isSelect) return false;
        emit('row-dblclick', row);
      },
    });
    return {
      ...toRefs(dataMap),
      ...toRefs(methodsMap),
      elTableRef,
    };
  },
});
</script>
<style lang="scss" scoped>
@import '@/theme-chalk/component/dynamic-grid.scss';
:deep(.el-table--border .el-table__inner-wrapper) {
  height: 100%;
}
</style>
