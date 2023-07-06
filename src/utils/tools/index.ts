export interface NodeTreeItem {
  id: number | string;
  parentId?: number | string | null;
  children?: Array<NodeTreeItem>;
  [key: string]: any;
}

export type ListType = Array<NodeTreeItem>;

export type MapType = {
  [key: string]: NodeTreeItem;
};
/**
 * @description: 列表转为树
 * @param {$list} 传入的列表
 * @return {*}
 */
export const ListToTree = ($list: ListType): ListType => {
  const _treeData: ListType = [],
    map: MapType = {};
  $list.forEach((item: NodeTreeItem) => {
    item.children = [];
    map[item.id] = item;
  });
  $list.forEach((item) => {
    let parent = map[item.parentId as string];
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(item);
    } else {
      _treeData.push(item);
    }
  });
  return _treeData;
};
/**
 * @description: 树转为列表
 * @param {$tree} 传入的树
 * @return {*}
 */
export const TreeToList = ($tree: ListType): ListType => {
  let _queen: ListType = [];
  const _out: ListType = [];
  _queen = _queen.concat($tree);
  while (_queen.length) {
    const _first = _queen.shift();
    if (_first && _first.children) {
      _queen = _queen.concat(_first.children);
      delete _first.children;
    }
    _out.push(_first as NodeTreeItem);
  }
  return _out;
};
/**
 * @description: 条件过滤
 * @param {$list} 需过滤的数组
 * @return {*}
 */
export const validateFn = (
  node: NodeTreeItem,
  $list: Array<string>
): boolean => {
  return $list.includes(node.id as string);
};
/**
 * @description: 树结构筛选
 * @param {$tree} 原始树结构
 * @param {$list} 需过滤的数组
 * @param {$newTree} 新的树结构
 * @return {*}
 */
export const treeFilter = (
  $tree: ListType,
  $list: Array<string>,
  callbackFn: (node: NodeTreeItem, $list: Array<string>) => boolean,
  $newTree: ListType
): ListType => {
  if (!$tree.length) return [];
  for (const item of $tree) {
    if (!callbackFn(item, [...$list])) continue;
    const node = { ...item, children: [] };
    $newTree.push(node);
    if (item.children && item.children.length)
      treeFilter(item.children, $list, callbackFn, node.children);
  }
  return $newTree;
};
/**
 * @description: 过滤树形结构空数组
 * @param {$tree} 原始树结构
 * @param {$newTree} 新的树结构
 * @return {*}
 */
export const filterEmptyChildren = (
  $tree: ListType,
  $newTree: ListType
): ListType => {
  if (!$tree.length) return [];
  for (const item of $tree) {
    const node = { ...item };
    Reflect.deleteProperty(node, 'children');
    $newTree.push(node);
    if (item.children && item.children.length) {
      node.children = [];
      filterEmptyChildren(item.children, node.children);
    }
  }
  return $newTree;
};

/**
 * 判读路由的path是否是 URL/TEL/MAIL
 * @param {string} path
 * @returns {Boolean}
 */
export const isExternal = (path: string) => {
  return /^(https?:|mailto:|tel:)/.test(path);
};
/**
 * 创建当前时间
 * @param {*} isTrue 精确到年、月、天标识
 */
export const createTime = (isTrue: string) => {
  const now = new Date();

  const year = now.getFullYear(); //年
  const month = now.getMonth() + 1; //月
  const day = now.getDate(); //日

  const hh = now.getHours(); //时
  const mm = now.getMinutes(); //分
  const ss = now.getSeconds(); //秒
  if (isTrue == 'year') return year;

  let clock = year + '-';

  if (month < 10) clock += '0';

  if (isTrue == 'month') return (clock += month);

  clock += month + '-';

  if (day < 10) clock += '0';

  clock += day;

  //精确到天
  if (isTrue == 'day') return clock;
  clock += clock + ' ';

  if (hh < 10) clock += '0';

  clock += hh + ':';
  if (mm < 10) clock += '0';
  clock += mm + ':';

  if (ss < 10) clock += '0';
  clock += ss;
  return clock;
};

/**
 * @description: 获取当前时间
 * @param {$format} :  YYMMDD         YY-MM-DD     YY-MM-DD-HH:MM:SS
 * @return {$nowtime} : 20210205       2021-02-05   2021-02-05-15:05:30
 */
export const nowData = ($format: string): string => {
  const date = new Date();
  //年
  const year: string | number = date.getFullYear();
  //月
  let month: string | number = date.getMonth() + 1;
  //日
  let strDate: string | number = date.getDate();
  //时
  let hour: string | number = date.getHours();
  //分
  let minute: string | number = date.getMinutes();
  //秒
  let second: string | number = date.getSeconds();
  month = month > 9 ? month : '0' + month;
  strDate = strDate > 9 ? strDate : '0' + strDate;
  hour = hour > 9 ? hour : '0' + hour;
  minute = minute > 9 ? minute : '0' + minute;
  second = second > 9 ? second : '0' + second;
  if ($format === 'YYMMDD') return year + '' + month + '' + strDate;
  else if ($format === 'YY-MM-DD') return year + '-' + month + '-' + strDate;
  else if ($format === 'YY-MM-DD-HH:MM:SS')
    return (
      year +
      '-' +
      month +
      '-' +
      strDate +
      '-' +
      hour +
      ':' +
      minute +
      ':' +
      second
    );
  else return 'error';
};

/**
 * @description: 数组根据某个字段分类
 * @param {$list} : 数组对象
 * @param {$keyName} : 需要分类的字段
 */
export const groupByList = (list: Array<any>, keyName: string) => {
  const map: any = {};
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (!map[item[keyName]]) {
      map[item[keyName]] = [item];
    } else {
      map[item[keyName]].push(item);
    }
  }
  const groupList: Array<any> = [];
  Object.keys(map).forEach((key) => {
    groupList.push({
      type: key,
      data: map[key],
    });
  });
  return groupList;
};
