import { columns } from '@/model/comm-model';
import { getNameByCode } from '@/utils/plugin/global';
import { validateIdNumber, validatePhone } from '@/utils/tools/validator';
export type RowType = {
    userId: string;
    userName: string;
    loginName: string;
    tel: string;
    password: string;
    sex: string;
    orgId: string;
    roleId: string;
    roleIds: string;
    status: string;
    sortNo: number;
    remark: string;
    roleName: string;
    orgName: string;
    ver: number;
    [key: string]: any;
};
export const userTableColumns: Array<columns> = [
    {
        prop: 'userId',
        label: '用户ID',
        overflow: true,
    },
    {
        prop: 'userName',
        label: '用户姓名',
        overflow: true,
    },
    {
        prop: 'loginName',
        label: '登录名',
        overflow: true,
    },
    {
        prop: 'tel',
        label: '手机号',
        overflow: true,
    },
    {
        prop: 'idCardNo',
        label: '身份证号码',
        width: 120,
        overflow: true,
    },
    {
        prop: 'status',
        label: '用户状态',
        formatter: (row: any) => getNameByCode('userStatus', row.status),
        overflow: true,
    },
    {
        prop: 'sortNo',
        label: '排序号',
        overflow: true,
    },
    {
        prop: 'sex',
        label: '性别',
        formatter: (row: any) => getNameByCode('userSex', row.sex),
        overflow: true,
    },
    {
        prop: 'orgId',
        label: '所属机构',
        formatter: (row: any) => getNameByCode('orgId', row.orgId),
        overflow: true,
    },
    {
        prop: 'roleId',
        label: '当前角色',
        formatter: (row: any) => getNameByCode('roleId', row.roleId),
        overflow: true,
    },
    {
        prop: 'roleIds',
        label: '拥有的全部角色',
        width: 160,
        overflow: true,
        formatter: (row: any) => {
            const _roleNames = Array<string>();
            _roleNames.push(getNameByCode('roleId', row.roleIds, true));
            return _roleNames.join();
        },
    },
    {
        prop: 'remark',
        label: '备注',
        overflow: true,
    },
];
export const userCommonRules = {
    userId: [
        { required: true, message: '请输入用户ID', trigger: 'blur' },
        { max: 32, message: '长度在32个字符以内', trigger: 'blur' },
    ],
    userName: [
        { required: true, message: '请输入用户姓名', trigger: 'blur' },
        { max: 100, message: '长度在100个字符以内', trigger: 'blur' },
    ],
    loginName: [
        { required: true, message: '请输入登录名', trigger: 'blur' },
        { max: 100, message: '长度在100个字符以内', trigger: 'blur' },
    ],
    tel: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        {
            validator: validatePhone,
            message: '请输入正确的手机号',
            trigger: 'blur',
        },
    ],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
    orgName: [{ required: true, message: '请选择所属机构', trigger: 'change' }],
    password: [{ required: true, message: '请输入法人机构号', trigger: 'blur' }],
    idCardNo: [
        { required: true, message: '请输入身份证号码', trigger: 'blur' },
        {
            validator: validateIdNumber,
            message: '请输入正确的身份证号码',
            trigger: 'blur',
        },
    ],
    status: [{ required: true, message: '请选择用户状态', trigger: 'change' }],
    sortNo: [{ required: true, message: '请输入排序号', trigger: 'blur' }],
    remark: [{ max: 400, message: '长度在400个字符以内', trigger: 'blur' }],
    roleId: [{ required: true, message: '请选择当前角色', trigger: 'blur' }],
    roleIds: [
        { required: true, message: '请选择拥有的全部角色', trigger: 'blur' },
    ],
};
