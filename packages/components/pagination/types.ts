export interface PaginationProps {
  /** 当前页码 */
  current?: number;
  /** 每页条数 */
  pageSize?: number;
  /** 总条数 */
  total?: number;
  /** 每页条数选项 */
  pageSizes?: number[];
  /** 布局控件，逗号分隔，可选值：total, sizes, prev, pager, next, jumper */
  layout?: string;
  /** 是否使用小型分页 */
  small?: boolean;
  /** 页码按钮数量（奇数） */
  pagerCount?: number;
  /** 只有一页时是否隐藏 */
  hideOnSinglePage?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
}
