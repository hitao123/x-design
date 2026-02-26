import type { VNode } from 'vue';

export type SortOrder = 'ascending' | 'descending' | null;

export interface TableColumn {
  prop: string;
  label: string;
  width?: string | number;
  minWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  sortable?: boolean | 'custom';
  formatter?: (row: any, column: TableColumn, cellValue: any, index: number) => any;
  type?: 'selection' | 'index' | 'expand';
  slots?: {
    default?: string;
    header?: string;
  };
  /** render 函数，用于编程式自定义列渲染 */
  render?: (params: { row: any; column: TableColumn; $index: number }) => VNode | string;
  /** 筛选配置：可选值列表 */
  filters?: Array<{ text: string; value: any }>;
  /** 筛选函数 */
  onFilter?: (value: any, row: any) => boolean;
  /** 是否多选筛选 */
  filterMultiple?: boolean;
  /** 受控筛选值 */
  filteredValue?: any[];
}

export interface TableProps {
  data?: any[];
  columns?: TableColumn[];
  border?: boolean;
  stripe?: boolean;
  size?: 'small' | 'medium' | 'large';
  showHeader?: boolean;
  highlightCurrentRow?: boolean;
  rowKey?: string;
  height?: string | number;
  maxHeight?: string | number;
  loading?: boolean;
  defaultSort?: {
    prop: string;
    order: SortOrder;
  };
  rowClassName?: string | ((row: any, index: number) => string);
  cellClassName?: string | ((row: any, column: TableColumn, rowIndex: number, columnIndex: number) => string);
  showOverflowTooltip?: boolean;
  expandRowKeys?: (string | number)[];
  defaultExpandAll?: boolean;
  treeProps?: {
    children?: string;
    hasChildren?: string;
  };
  /** 分页配置，传入即启用内置分页 */
  pagination?: TablePagination | false;
  /** 空数据提示文案 */
  emptyText?: string;
  /** 表格布局方式，auto 根据内容自适应列宽，fixed 均分剩余宽度 */
  tableLayout?: 'auto' | 'fixed';
}

export interface TablePagination {
  current?: number;
  pageSize?: number;
  total?: number;
  pageSizes?: number[];
}

export interface SortState {
  prop: string;
  order: SortOrder;
}

export interface FilterState {
  [prop: string]: any[];
}
