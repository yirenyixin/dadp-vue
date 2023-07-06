import { validateMenuPath } from '@/utils/tools/validator';
//图标的方式可遍历文件获取得到/采用svg-icon的方式
export const selectIcons = [
  {
    value: 'menu-default',
    label: 'menu-default'
  },
  {
    value: 'menu-marke-mg',
    label: 'menu-marke-mg'
  },
  {
    value: 'menu-mg-index',
    label: 'menu-mg-index'
  },
  {
    value: 'menu-workbetch',
    label: 'menu-workbetch'
  },
  {
    value: 'menu-mg-index',
    label: 'menu-mg-index'
  }
];

export const editFormRules = {
  menuId: [
    { required: true, message: '请输入菜单ID', trigger: 'blur' },
    { max: 32, message: '长度在32个字符以内', trigger: 'blur' }
  ],
  menuName: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { max: 100, message: '长度在100个字符以内', trigger: 'blur' }
  ],
  menuUrl: [
    { required: true, message: '请输入菜单路径', trigger: 'blur' },
    {
      validator: validateMenuPath,
      message: '菜单路径应为/xx 或 /xx-xx等格式',
      trigger: 'blur'
    }
  ],
  isAllPath: [
    { required: true, message: '请选择是否绝对路径', trigger: 'blur' }
  ],
  isShow: [{ required: true, message: '请选择是否显示', trigger: 'blur' }],
  sortNo: [{ required: true, message: '请输入排序号', trigger: 'blur' }]
};
