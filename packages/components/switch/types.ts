export type SwitchSize = 'small' | 'medium' | 'large';

export interface SwitchProps {
  modelValue?: boolean;
  disabled?: boolean;
  size?: SwitchSize;
  activeColor?: string;
  inactiveColor?: string;
  activeText?: string;
  inactiveText?: string;
  name?: string;
  loading?: boolean;
}
