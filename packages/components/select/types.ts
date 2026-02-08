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
  popperClass?: string;
  valueKey?: string;
}
