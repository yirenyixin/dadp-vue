import { columns } from '@/model/comm-model';
import { getNameByCode } from '@/utils/plugin/global';
export type LogParams = {
  pageNo: number;
  pageSize: number;
  dateFrom?: string;
  dateTo?: string;
  operLogId?: string;
  moduleName?: string;
  operType?: string;
  operSource?: string;
  userId?: string;
  orgId?: string;
  reqUrl?: string;
  reqMethod?: string;
  reqMode?: string;
  ipAddr?: string;
  reqParam?: string;
  result?: string;
  isOk?: string;
};

export type RowType = {
  operLogId?: string;
  moduleName?: string;
  operType?: string;
  operSource?: string;
  userId?: string;
  orgId?: string;
  reqUrl?: string;
  reqMethod?: string;
  reqMode?: string;
  ipAddr?: string;
  reqParam?: string;
  result?: string;
  isOk?: string;
  logTime?: string;
  [key: string]: any;
};

export const LogColumns: Array<columns> = [
  {
    prop: 'operLogId',
    label: '日志ID',
    width: 120,
  },
  {
    prop: 'moduleName',
    label: '模块名称',
  },
  {
    prop: 'operType',
    label: '操作类型',
    formatter: (row: any) => getNameByCode('operType', row.operType),
  },
  {
    prop: 'operSource',
    label: '操作来源',
    formatter: (row: any) => getNameByCode('operSource', row.operSource),
  },
  {
    prop: 'userId',
    label: '用户',
    formatter: (row: any) => getNameByCode('userId', row.userId),
  },
  {
    prop: 'orgId',
    label: '机构',
    formatter: (row: any) => getNameByCode('orgId', row.orgId),
    width: 100,
  },
  {
    prop: 'isOk',
    label: '是否操作成功',
    formatter: (row: any) => getNameByCode('yesOrNo', row.isOk),
  },
  {
    prop: 'logTime',
    label: '发生时间',
    width: 120,
  },
];
