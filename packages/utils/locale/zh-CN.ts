export const zhCN = {
  name: 'zh-CN',
  dialog: {
    confirm: '确定',
    cancel: '取消',
    info: '提示',
    success: '成功',
    warning: '警告',
    error: '错误',
  },
  popconfirm: {
    title: '确定执行此操作吗？',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  },
  select: {
    placeholder: '请选择',
    loading: '加载中...',
    noData: '无数据',
    noMatch: '无匹配数据',
  },
  table: {
    loading: '加载中...',
    emptyText: '暂无数据',
    filterConfirm: '筛选',
    filterReset: '重置',
    sortAscending: '点击升序',
    sortDescending: '点击降序',
    cancelSort: '取消排序',
  },
  form: {
    required: '该字段为必填项',
  },
  pagination: {
    total: '共 {total} 条',
    pageSize: '{size} 条/页',
    prev: '上一页',
    next: '下一页',
    goto: '前往',
    page: '页',
  },
};

export type LocaleType = typeof zhCN;
