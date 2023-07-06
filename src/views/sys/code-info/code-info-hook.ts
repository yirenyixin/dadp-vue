import { columns } from '@/model/comm-model';

export type RowType = {
  codeInfoId: string;
  value: string;
  content?: string;
  parentValue: string;
  sortNo?: number;
  remark?: string;
  codeTypeId?: string;
  ver?: number;
  isOk?: string;
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

export const codeInfoColumns: Array<columns> = [
  {
    prop: 'codeTypeId',
    width: '100px',
    label: '代码类别ID',
    overflow: true,
  },
  {
    prop: 'value',
    label: '下拉框值',
    overflow: true,
  },
  {
    prop: 'content',
    width: '90px',
    label: '下拉框内容',
    overflow: true,
  },
  {
    prop: 'parentValue',
    label: '上级联动下拉框值',
    width: '133px',
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
  value: [
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
  content: [
    {
      required: true,
      message: '该填项为必填项!',
      trigger: ['change', 'blur'],
    },
  ],
};
