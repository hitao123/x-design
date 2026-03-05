import type { VNode } from 'vue';

export type MessageType = 'success' | 'warning' | 'info' | 'error';

export interface MessageProps {
  id?: string;
  message?: string | VNode;
  type?: MessageType;
  duration?: number;
  showClose?: boolean;
  offset?: number;
  plain?: boolean;
  onClose?: () => void;
  onDestroy?: () => void;
}

export type MessageOptions = Omit<MessageProps, 'id' | 'onDestroy'> | string;

export interface MessageInstance {
  id: string;
  close: () => void;
  vm: VNode;
}

export type MessageFn = (options: MessageOptions) => MessageInstance;

export interface MessageApi extends MessageFn {
  success: (options: MessageOptions) => MessageInstance;
  warning: (options: MessageOptions) => MessageInstance;
  info: (options: MessageOptions) => MessageInstance;
  error: (options: MessageOptions) => MessageInstance;
  closeAll: () => void;
}
