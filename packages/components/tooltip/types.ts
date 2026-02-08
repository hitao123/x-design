import type { Placement } from '@floating-ui/vue';

export interface TooltipProps {
  content?: string;
  placement?: Placement;
  trigger?: 'hover' | 'click' | 'focus';
  disabled?: boolean;
  offset?: number;
  showArrow?: boolean;
  enterable?: boolean;
}
