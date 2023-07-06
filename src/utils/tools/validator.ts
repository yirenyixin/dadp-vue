/* eslint-disable no-useless-escape */
/* 合法菜单路径 */
export const validateMenuPath = (_rule: any, value: string, callback: any) => {
  const pathReg = /^[\/\a-z\-]*$/;
  if (!value) {
    return callback(new Error('菜单路径不能为空!!'));
  } else {
    if (!pathReg.test(value)) {
      return callback(new Error('菜单路径格式错误'));
    } else {
      callback();
    }
  }
};
/* 合法身份证 */
export const validateIdNumber = (_rule: any, value: string, callback: any) => {
  const idNumberReg =
    /^[1-9]\d{5}(19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  if (!value) {
    return callback(new Error('身份证号码不能为空!!'));
  } else {
    if (!idNumberReg.test(value)) {
      return callback(new Error('您的身份证号码格式错误!'));
    } else {
      callback();
    }
  }
};
/* 合法手机号 */
export const validatePhone = (_rule: any, value: string, callback: any) => {
  const phoneReg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
  if (!value) {
    return callback(new Error('手机号码不能为空!!'));
  } else {
    if (!phoneReg.test(value)) {
      return callback(new Error('手机号码格式错误'));
    } else {
      callback();
    }
  }
};

/**
 * 弹窗
 * formRules 验证规则
 **/
export const validataPass = (rule: any, value: any, callback: any) => {
  const passRule = /^[A-Za-z0-9]{4,12}$/;
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    if (!passRule.test(value)) {
      callback(new Error('请输入4-12位英文和数字'));
    } else {
      callback();
    }
    callback();
  }
};
