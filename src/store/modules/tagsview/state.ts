export interface TagView {
  path: string;
  name: string;
  meta?: any;
  fullPath?: string;
  [key: string]: any;
}

export interface TagsViewState {
  visitedViews: TagView[];
}
export const state: TagsViewState = {
  //当前访问的导航标签信息
  visitedViews: [
    {
      path: '/default',
      name: 'Default',
      meta: {
        title: '首页',
        breadcrumb: [],
        level: 1,
        icon: null,
        isFist: true,
        breadcrumbs: ['首页'],
      },
      fullpath: '/default',
    },
  ],
};
