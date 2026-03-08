export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectProps {
  modelValue?: string | number | (string | number)[];
  options?: SelectOption[];
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  multiple?: boolean;
  multipleLimit?: number;
  loading?: boolean;
  loadingText?: string;
  noDataText?: string;
  noMatchText?: string;
  maxTagCount?: number;
  popperClass?: string;
  valueKey?: string;
  remote?: boolean;
  remoteMethod?: (query: string) => void;
  showCheckAll?: boolean;
  /** 是否还有更多数据（开启下拉分页） */
  hasMore?: boolean;
  /** 加载更多提示文本 */
  loadMoreText?: string;
  /** 开启虚拟滚动 */
  virtual?: boolean;
  /** 选项行高 px（虚拟滚动计算用） */
  itemHeight?: number;
}
