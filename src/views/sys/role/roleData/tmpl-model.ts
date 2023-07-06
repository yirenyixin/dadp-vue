import { columns } from '@/model/comm-model';
import { getNameByCode } from '@/utils/plugin/global';

export type RowType = {
  roleId: string;
  tableName: string;
  authType: string;
  authScopeId: string;
  authScopeName: string;
  isIncludeSub: string;
  [key: string]: any;
};
export const tableColumns: Array<columns> = [
  {
    prop: 'tableName',
    label: '业务表名',
    overflow: true,
  },
  {
    prop: 'authType',
    label: '权限类型',
    formatter: (row: any) => getNameByCode('authType', row.authType),
    overflow: true,
  },
  {
    prop: 'authScopeId',
    label: '权限范围ID',
    overflow: true,
  },
  {
    prop: 'authScopeName',
    label: '数据范围名',
    overflow: true,
  },
  {
    prop: 'isIncludeSub',
    label: '是否含下级',
    formatter: (row: any) => getNameByCode('yesOrNo', row.isIncludeSub),
    overflow: true,
  },
];
export const formRules = {
  roleId: [
    {
      required: true,
      message: '该填项为必填项!',
      trigger: ['change', 'blur'],
    },
  ],
  authType: [
    {
      required: true,
      message: '该填项为必填项!',
      trigger: ['change', 'blur'],
    },
  ],

  tableName: [
    {
      required: true,
      message: '该填项为必填项!',
      trigger: ['change', 'blur'],
    },
  ],
  authScopeName: [
    {
      required: true,
      message: '该填项为必填项!',
      trigger: ['change', 'blur'],
    },
  ],
  isIncludeSub: [
    {
      required: true,
      message: '该填项为必填项!',
      trigger: ['change', 'blur'],
    },
  ],
};
