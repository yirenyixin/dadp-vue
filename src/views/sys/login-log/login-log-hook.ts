import { columns } from '@/model/comm-model';
export type LogParams = {
  pageNo: number;
  pageSize: number;
  userId?: string;
  userName?: string;
  logInfo?: string;
  ipAddr?: string;
};

export type RowType = {
  logId: string;
  userId?: string;
  userName?: string;
  logInfo?: string;
  ipAddr?: string;
  logTime?: string;
  [key: string]: any;
};

export const LogColumns: Array<columns> = [
  {
    prop: 'userId',
    label: '用户ID',
  },
  {
    prop: 'userName',
    label: '用户姓名',
  },
  {
    prop: 'logInfo',
    label: '日志内容',
  },
  {
    prop: 'ipAddr',
    label: 'IP地址',
  },
  {
    prop: 'logTime',
    label: '发生时间',
  },
];
