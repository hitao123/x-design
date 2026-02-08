export interface DialogProps {
  modelValue?: boolean;
  title?: string;
  width?: string | number;
  top?: string;
  modal?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  showClose?: boolean;
  center?: boolean;
  destroyOnClose?: boolean;
  appendToBody?: boolean;
}

export interface DialogConfirmOptions {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonType?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  width?: string | number;
  showCancelButton?: boolean;
  center?: boolean;
}
