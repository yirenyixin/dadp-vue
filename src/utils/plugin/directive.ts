/*
 * @Description: 权限指令
 */
import { Directive, DirectiveBinding } from 'vue';

export const permission: Directive = {
  mounted(el: HTMLDivElement, binding: DirectiveBinding) {
    const { value } = binding;
    const funcList = sessionStorage.getItem('funcList');
    const roles = funcList ? JSON.parse(funcList) : [];
    const hasPermission = roles.filter((k: any) => k === value);
    if (!hasPermission || !hasPermission.length) {
      el.style.display = 'none';
    }
  }
};
