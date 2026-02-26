import type { Placement } from '@floating-ui/vue';

export interface PopperProps {
  /** 弹出位置 */
  placement?: Placement;
  /** 触发方式 */
  trigger?: 'hover' | 'click' | 'focus';
  /** 偏移量 */
  offset?: number;
  /** 是否显示箭头 */
  showArrow?: boolean;
  /** 鼠标是否可进入弹出层 */
  enterable?: boolean;
  /** 显示延迟（ms） */
  openDelay?: number;
  /** 隐藏延迟（ms） */
  closeDelay?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 隐藏时是否销毁 DOM */
  destroyOnHide?: boolean;
  /** 弹出层自定义类名 */
  popperClass?: string;
  /** 过渡动画名称 */
  transition?: string;
  /** 受控模式：外部控制可见状态 */
  open?: boolean;
}
