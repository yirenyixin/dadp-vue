import { columns } from '@/model/comm-model';

export type RowType = {
  funcId?: string;
  funcName?: string;
  icon?: string;
  menuId: string;
  sortNo?: string;
  ver: number;
  [key: string]: any;
};

export const funcColumns: Array<columns> = [
  {
    prop: 'funcId',
    label: '功能ID',
  },
  {
    prop: 'funcName',
    label: '功能名称',
  },
  {
    prop: 'menuId',
    label: '菜单ID',
  },
];
export const editFormRules = {
  funcId: [
    { required: true, message: '请输入功能ID', trigger: 'blur' },
    { max: 64, message: '长度在64个字符以内', trigger: 'blur' },
  ],
  funcName: [
    { required: true, message: '请输入功能名称', trigger: 'blur' },
    { max: 100, message: '长度在100个字符以内', trigger: 'blur' },
  ],
  menuId: [
    { required: true, message: '请输入菜单ID', trigger: 'blur' },
    { max: 32, message: '长度在32个字符以内', trigger: 'blur' },
  ],
};
