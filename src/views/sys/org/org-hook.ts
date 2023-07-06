export const orgCommonRules = {
  orgName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
  orgId: [
    { required: true, message: '请输入机构ID', trigger: 'blur' },
    { max: 32, message: '长度必须小于或等于32', trigger: 'blur' },
  ],
};
