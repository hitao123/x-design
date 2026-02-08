import type { Placement } from '@floating-ui/vue';

export interface PopconfirmProps {
  title?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  cancelButtonType?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  icon?: string;
  iconColor?: string;
  hideIcon?: boolean;
  placement?: Placement;
  width?: string | number;
}
