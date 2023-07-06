import { columns } from '@/model/comm-model';
import { getNameByCode } from '@/utils/plugin/global';
export type RowType = {
  codeTypeId?: string;
  codeTypeName?: string;
  sortNo?: number;
  isPinyin?: string;
  remark?: string;
  ver?: number;
  [key: string]: any;
};

export const codeTypeColumns: Array<columns> = [
  {
    prop: 'codeTypeId',
    label: '代码类别ID',
    overflow: true,
  },
  {
    prop: 'codeTypeName',
    label: '代码类别名称',
    overflow: true,
  },
  {
    prop: 'sortNo',
    label: '排序号',
    overflow: true,
  },
  {
    prop: 'remark',
    label: '备注',
    overflow: true,
  },
];
export const codeInfoFromRules = {
  codeTypeId: [
    {
      required: true,
      message: '该填项为必填项!',
      trigger: ['change', 'blur'],
    },
  ],
  codeTypeName: [
    {
      required: true,
      message: '该填项为必填项!',
      trigger: ['change', 'blur'],
    },
  ],
  sortNo: [
    {
      required: true,
      message: '该填项为必填项!',
      trigger: ['change', 'blur'],
    },
  ],
};
