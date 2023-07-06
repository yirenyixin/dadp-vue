//菜单节点类型
export type ItemType = {
  menuId: string;
  parentMenuId: string;
  menuUrl: string;
  imageUrl: string;
  menuName: string;
  [key: string]: any;
};
//
export type MateType = {
  icon: string;
  title: string;
  [key: string]: any;
};
export type MenuType = {
  id: number | string;
  parentId: number | string | null;
  path: string;
  meta: MateType;
};
/**
 * @description: 菜单构造
 * @param {item} 传入菜单的对象
 * @return {*}
 */
export const menuConstructor = (item: ItemType): MenuType => {
  const { menuId, parentMenuId, menuUrl, imageUrl, menuName } = item;
  return {
    id: menuId,
    parentId: parentMenuId,
    path: menuUrl,
    meta: {
      icon: imageUrl,
      title: menuName,
    },
  };
};
/**
 * @description:菜单
 * @param {$list} 列表
 * @return {*}
 */
export const getAuthMenuList = ($list: Array<ItemType>): Array<MenuType> => {
  const _menuList: Array<MenuType> = [];
  $list.forEach((item) => {
    const _menuItem = menuConstructor({ ...item });
    _menuList.push(_menuItem);
  });
  return _menuList;
};
