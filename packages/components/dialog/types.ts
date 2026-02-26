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
  /** 确认按钮 loading 状态 */
  confirmLoading?: boolean;
  /** 关闭前回调，返回 false 或 reject 的 Promise 可阻止关闭 */
  beforeClose?: (done: () => void) => void | Promise<void>;
}

export type DialogMethodType = 'confirm' | 'info' | 'success' | 'warning' | 'error';

export interface DialogConfirmOptions {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonType?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  width?: string | number;
  showCancelButton?: boolean;
  center?: boolean;
  /** 确认按钮点击后自动 loading，直到 onConfirm 的 Promise resolve */
  onConfirm?: () => void | Promise<void>;
  /** 取消按钮回调 */
  onCancel?: () => void;
  /** 对话框类型（用于快捷方法） */
  type?: DialogMethodType;
}

export interface DialogMethods {
  confirm: (options: DialogConfirmOptions) => Promise<void>;
  info: (options: DialogConfirmOptions) => Promise<void>;
  success: (options: DialogConfirmOptions) => Promise<void>;
  warning: (options: DialogConfirmOptions) => Promise<void>;
  error: (options: DialogConfirmOptions) => Promise<void>;
}
