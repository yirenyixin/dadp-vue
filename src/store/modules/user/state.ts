export type UserType = {
  userId: string | number;
  userName: string;
  orgId: string;
  orgName: string;
  roleId: string;
  roleName: string;
  [key: string]: any;
};
//用户信息
export interface UserState {
  userInfo: UserType;
}
export const state: UserState = {
  userInfo: {
    userId: '',
    userName: '',
    orgId: '',
    orgName: '',
    roleId: '',
    roleName: '',
  },
};
