import $http from '@/utils/http/index';
import { HttpListQuery } from '@/utils/http/http-type';

/**
 * 1-14 菜单
 * @param params 请求参数
 * @returns
 */
//前端菜单列表
export const getAuthMenuList = () => {
  return $http.post('/sys/menu/listMenuByAuth');
};
// 查询树型list
export const getMenuList = (params: HttpListQuery) => {
  return $http.post('/sys/menu/list', params);
};
//通过Id获取菜单对象
export const getMenu = (params: HttpListQuery) => {
  return $http.post('/sys/menu/get', params);
};
//新增报存
export const addMenu = (params: HttpListQuery) => {
  return $http.post('/sys/menu/save', params);
};
//修改
export const updateMenu = (params: HttpListQuery) => {
  return $http.post('/sys/menu/update', params);
};
//删除
export const deleteMenu = (params: HttpListQuery) => {
  return $http.post('/sys/menu/delete', params);
};

/**
 * 1-01 系统登录
 * @param params 请求参数
 * @returns
 */
//系统登录
export const login = (params: HttpListQuery) => {
  return $http.post('/sys/login', { ...params });
};
//获取角色列表
export const getRoleList = () => {
  return $http.post('/sys/getRoleList');
};
//角色切换
export const changeRole = (params: HttpListQuery) => {
  return $http.post('/sys/changeRole', params);
};
/**
 * 修改密码
 * @returns
 */
export const updatePassword = (params: HttpListQuery) => {
  return $http.post('/sys/updatePassword', params);
};


/**
 * 1-02 获取缓存码值
 * @param params 请求参数
 * @returns
 */
export const getListCombo = () => {
  return $http.post('/sys/cache/listCombo', {});
};

/**
 * 1-17 角色
 * @param params 请求参数
 * @returns
 */
//查询和分页
export const queryRole = (params: HttpListQuery) => {
  return $http.post('/sys/role/list', params);
};
//新增保存
export const addRoleSave = (params: HttpListQuery) => {
  return $http.post('/sys/role/save', params);
};
//修改
export const updateRole = (params: HttpListQuery) => {
  return $http.post('/sys/role/update', params);
};
//删除
export const deleteRole = (params: HttpListQuery) => {
  return $http.post('/sys/role/delete', params);
};

/**
 * 1-18 角色操作权限
 * @param params 请求参数
 * @returns
 */
//查询树型list
export const authRoleList = (params: HttpListQuery) => {
  return $http.post('/sys/roleAuth/list', params);
};
//新增保存
export const authRoleSave = (params: HttpListQuery) => {
  return $http.post('/sys/roleAuth/save', params);
};

/**
 * 1-19 数据权限
 * @param params 请求参数
 * @returns
 */
//查询和分页
export const roleDataList = (params: HttpListQuery) => {
  return $http.post('/sys/roleData/list', params);
};
//新增保存
export const addRoleData = (params: HttpListQuery) => {
  return $http.post('/sys/roleData/save', params);
};
//修改
export const updateRoleData = (params: HttpListQuery) => {
  return $http.post('/sys/roleData/update', params);
};
//删除
export const deleteRoleData = (params: HttpListQuery) => {
  return $http.post('/sys/roleData/delete', params);
};

/**
 * 1-15 功能
 * @param params 请求参数
 * @returns
 */
//查询和分页
export const getFuncList = (params: HttpListQuery) => {
  return $http.post('/sys/func/list', params);
};
//新增保存
export const addFuncSave = (params: HttpListQuery) => {
  return $http.post('/sys/func/save', params);
};
//修改
export const updateFunc = (params: HttpListQuery) => {
  return $http.post('/sys/func/update', params);
};
//删除
export const delFunc = (params: HttpListQuery) => {
  return $http.post('/sys/func/delete', params);
};

/**
 * 1-12 代码类别
 * @param params 请求参数
 * @returns
 */
//查询和分页
export const getCodeTypeList = (params: HttpListQuery) => {
  return $http.post('/sys/codeType/list', params);
};
//新增和保存
export const codeTypeSave = (params: HttpListQuery) => {
  return $http.post('/sys/codeType/save', params);
};
//修改
export const updateCodeType = (params: HttpListQuery) => {
  return $http.post('/sys/codeType/update', params);
};
//删除
export const delCodeType = (params: HttpListQuery) => {
  return $http.post('/sys/codeType/delete', params);
};

/**
 * 1-13 代码信息
 * @param params 请求参数
 * @returns
 */
//查询和分页
export const getCodeInfoList = (params: HttpListQuery) => {
  return $http.post('/sys/codeInfo/list', params);
};
//新增保存
export const codeInfoSave = (params: HttpListQuery) => {
  return $http.post('/sys/codeInfo/save', params);
};
//修改
export const updateCodeInfo = (params: HttpListQuery) => {
  return $http.post('/sys/codeInfo/update', params);
};
//删除
export const delCodeInfo = (params: HttpListQuery) => {
  return $http.post('/sys/codeInfo/delete', params);
};

/**
 * 1-16 机构
 * @param params 请求参数
 * @returns
 */
//查询树型list
export const getOrgList = (params: HttpListQuery) => {
  return $http.post('sys/org/list', params);
};
//查询数据权限树
export const getAuthScopeTree = (params: HttpListQuery) => {
  return $http.post('sys/org/getAuthScopeTree', params);
};
//根据id获取机构对象
export const getOrgById = (params: HttpListQuery) => {
  return $http.post('sys/org/get', params);
};
//删除
export const delOrg = (params: HttpListQuery) => {
  return $http.post('/sys/org/delete', params);
};
//修改
export const updOrg = (params: HttpListQuery) => {
  return $http.post('/sys/org/update', params);
};
//获取当前登录角色的管辖机构
export const queryAuthOrg = (params: HttpListQuery) => {
  return $http.post('/sys/org/queryAuthOrg', params);
};
//新增保存
export const addOrg = (params: HttpListQuery) => {
  return $http.post('/sys/org/save', params);
};

/**
 * 1-20 用户
 * @param params 请求参数
 * @returns
 */
//查询和分页
export const getUserList = (params: HttpListQuery) => {
  return $http.post('/sys/user/list', params);
};
//新增保存
export const addUser = (params: HttpListQuery) => {
  return $http.post('/sys/user/save', params);
};
//修改
export const updUser = (params: HttpListQuery) => {
  return $http.post('/sys/user/update', params);
};
//删除
export const delUser = (params: HttpListQuery) => {
  return $http.post('/sys/user/delete', params);
};
//客户经理分页和查询
export const getCustMgrList = (params: HttpListQuery) => {
  return $http.post('/sys/user/getCustMgrList', params);
};
//获取当前登录人的管辖用户
export const queryAuthUser = (params: HttpListQuery) => {
  return $http.post('/sys/user/queryAuthUser', params);
};

/**
 * 1-21 登录日志
 * @param params 请求参数
 * @returns
 */
export const getLogData = (params: HttpListQuery) => {
  return $http.post('/sys/log/list', params);
};

/**
 * 1-22 操作日志
 * @param params 请求参数
 * @returns
 */
export const getOperLogData = (params: HttpListQuery) => {
  return $http.post('/sys/operLog/list', params);
};

/**
 * 1-11 系统参数
 * @param params 请求参数
 * @returns
 */
//查询和分页
export const getConfigData = (params: HttpListQuery) => {
  return $http.post('/sys/config/list', params);
};
//新增保存
export const addConfig = (params: HttpListQuery) => {
  return $http.post('/sys/config/save', params);
};
//修改
export const updConfig = (params: HttpListQuery) => {
  return $http.post('/sys/config/update', params);
};
//删除
export const delConfig = (params: HttpListQuery) => {
  return $http.post('/sys/config/delete', params);
};

/**
 * 1-18 文件下载
 * @param params 请求参数
 * @returns
 */
//查询
export const getFileList = (params: HttpListQuery) => {
  return $http.post('/sys/file/list', params);
};
//图片URL
export const getImgUrl = (params: HttpListQuery) => {
  return $http.post('/sys/file/imgUrl', params);
};
//文件下载
export const downLoadFile = (params: HttpListQuery) => {
  return $http.post('/sys/file/download', params);
};
//文件上传
export const deleteFile = (params: HttpListQuery) => {
  return $http.post('/sys/file/delete', params);
};
//获取id
export const getBizId = () => {
  return $http.post('/sys/file/getId');
};


/**
 * 1-11 图书系统
 * @param params 请求参数
 * @returns
 */
//查询和分页
export const getBookList = (params: HttpListQuery) => {
  return $http.post('/sys/book/list', params);
};
//新增保存
export const addBook = (params: HttpListQuery) => {
  return $http.post('/sys/book/save', params);
};
//修改
export const updBook = (params: HttpListQuery) => {
  return $http.post('/sys/book/update', params);
};
//删除
export const delBook = (params: HttpListQuery) => {
  return $http.post('/sys/book/delete', params);
};


//订阅功能
export const getBookStateList = (params: HttpListQuery) => {
  return $http.post('/sys/book-state/list', params);
};
//新增保存
export const addBookState = (params: HttpListQuery) => {
  return $http.post('/sys/book-state/save', params);
};
//删除
export const delBookState = (params: HttpListQuery) => {
  return $http.post('/sys/book-state/delete', params);
};