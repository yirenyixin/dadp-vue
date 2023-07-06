export type RoleType = {
  roleId: string;
  roleName: string;
};
export type TreeMate = {
  title: string;
  icon: string;
  breadcrumb?: Array<string>;
};
export interface NodeTreeItem {
  id: number | string;
  parentId: number | string | null;
  path: string; // 节点的路径
  mate: TreeMate; // 节点属性
  children?: Array<NodeTreeItem>;
  [key: string]: any;
}
export type MenuTreeType = Array<NodeTreeItem>;

export interface PermissionState {
  menuList: MenuTreeType; //菜单列表
  dynamicRoutes: Array<any>; //权限路由
  funcList: Array<string>; //功能按钮操作列表
  roleList: Array<RoleType>; //角色列表
}

export const state: PermissionState = {
  dynamicRoutes: [],
  menuList: [],
  funcList: [],
  roleList: [],
};
