import { columns } from '@/model/comm-model';
import { getNameByCode } from '@/utils/plugin/global';

export type RowType = {
  sort?: string;
  order?: string;
  roleId?: string;
  roleName?: string;
  homeUrl?: string;
  remark?: string;
  ver: number;
  [key: string]: any;
};
export const roleColumns: Array<columns> = [
  {
    prop: 'roleId',
    label: '角色ID',
  },
  {
    prop: 'roleName',
    label: '角色名称',
  },
  {
    prop: 'homeUrl',
    label: '登录后首页',
    formatter: (row: any) => getNameByCode('homeUrl', row.homeUrl),
  },
  {
    prop: 'sortNo',
    label: '排序号',
  },
  {
    prop: 'remark',
    label: '备注',
    overflow: true,
  },
];
