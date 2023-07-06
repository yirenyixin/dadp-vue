import { columns } from '@/model/comm-model';

export type RowType = {
  configId?: string;
  configName?: string;
  configValue?: string;
  sortNo?: number;
  remark?: string;
  ver: number;
  [key: string]: any;
};

export const ConfigColumns: Array<columns> = [
  {
    prop: 'configId',
    label: '系统参数ID',
    overflow: true,
  },
  {
    prop: 'configName',
    label: '系统参数名称',
    overflow: true,
  },
  {
    prop: 'configValue',
    label: '系统参数值',
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
    width: 150,
    overflow: true,
  },
];

export const configFromRules = {
  configId: [
    { required: true, message: '请输入系统参数ID', trigger: 'blur' },
    { max: 64, message: '长度在64个字符以内', trigger: 'blur' },
  ],
  configName: [
    { required: true, message: '请输入系统参数名称', trigger: 'blur' },
    { max: 100, message: '长度在100个字符以内', trigger: 'blur' },
  ],
  configValue: [
    { required: true, message: '请输入系统参数值', trigger: 'blur' },
    { max: 32, message: '长度在32个字符以内', trigger: 'blur' },
  ],
};
