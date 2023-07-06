import { validataPass } from '@/utils/tools/validator';
export const formRules = {
  userName: [
    {
      required: true,
      message: '请输入用户名!',
      trigger: ['change', 'blur']
    }
  ],

  oldPassword: [
    {
      required: true,
      message: '请输入原始密码!',
      trigger: ['change', 'blur']
    }
  ],
  newPassword: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: validataPass
    }
  ],
  configNewPassword: [
    {
      required: true,
      trigger: ['change', 'blur'],
      validator: validataPass
    }
  ]
};
