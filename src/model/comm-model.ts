export interface columns {
  isShow?: boolean;
  prop: string;
  label: string;
  formatter?: (s: any) => void;
  align?: string;
  width?: string | number;
  sortable?: string;
  overflow?: boolean;
  isEllipsis?: boolean;
  [key: string]: any;
}

export type queryType = {
  pageNo: number;
  pageSize: number;
  sort?: string;
  order?: string;
  [key: string]: any;
};
