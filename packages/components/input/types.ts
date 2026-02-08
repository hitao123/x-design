export interface InputProps {
  modelValue?: string;
  type?: string;
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  readonly?: boolean;
  clearable?: boolean;
  maxlength?: number;
}
