export interface ButtonProps {
  type?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
  nativeType?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  plain?: boolean;
  round?: boolean;
  circle?: boolean;
}
