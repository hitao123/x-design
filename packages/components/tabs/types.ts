import type { Ref } from 'vue';

export type TabType = 'line' | 'card' | 'border-card';
export type TabPosition = 'top' | 'bottom';

export interface TabPaneProps {
  label?: string;
  name: string | number;
  disabled?: boolean;
  lazy?: boolean;
  closable?: boolean;
}

export interface TabsProps {
  modelValue?: string | number;
  type?: TabType;
  closable?: boolean;
  addable?: boolean;
  tabPosition?: TabPosition;
}

export interface TabsContext {
  activeTab: Ref<string | number | undefined>;
  registerPane: (pane: TabPaneInstance) => void;
  unregisterPane: (name: string | number) => void;
}

export interface TabPaneInstance {
  name: string | number;
  label: string;
  disabled: boolean;
  closable: boolean;
  lazy: boolean;
}
