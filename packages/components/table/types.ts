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
}

export interface SortState {
  prop: string;
  order: SortOrder;
}
