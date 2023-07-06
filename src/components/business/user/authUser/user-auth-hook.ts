import { columns } from '@/model/comm-model';
import { getNameByCode } from '@/utils/plugin/global';

export const userTableColumns: Array<columns> = [
  {
    prop: 'userId',
    label: '用户号',
  },
  {
    prop: 'userName',
    label: '用户名称',
  },
  {
    prop: 'roleId',
    label: '用户角色',
    formatter: (row: any) => getNameByCode('roleId', row.roleId),
  },

  //待定暂时定义为所属机构
  {
    prop: 'orgId',
    label: '所属职能部门',
    overflow: true,
    formatter: (row: any) => getNameByCode('orgId', row.orgId),
  },
  {
    prop: 'orgId',
    label: '所属机构',
    formatter: (row: any) => getNameByCode('orgId', row.orgId),
  },
  // {
  //   prop: "sendStatus",
  //   label: "发送状态",
  //   formatter: (row: any) => getNameByCode("msgSendStatus", row.sendStatus)
  // },
];
