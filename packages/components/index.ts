import type { App } from 'vue';
import '@x-design/theme/index.scss';

// 组件导出
export { XButton } from './button';
export { XInput } from './input';
export { XSelect } from './select';
export { XTable } from './table';
export { XDialog } from './dialog';
export { XTooltip } from './tooltip';
export { XPopconfirm } from './popconfirm';
export { XForm, XFormItem } from './form';
export { XConfigProvider } from './config-provider';

import { XButton } from './button';
import { XInput } from './input';
import { XSelect } from './select';
import { XTable } from './table';
import { XDialog } from './dialog';
import { XTooltip } from './tooltip';
import { XPopconfirm } from './popconfirm';
import { XForm, XFormItem } from './form';
import { XConfigProvider } from './config-provider';

const components = [
  XButton,
  XInput,
  XSelect,
  XTable,
  XDialog,
  XTooltip,
  XPopconfirm,
  XForm,
  XFormItem,
  XConfigProvider,
];

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name, component);
  });
};

export default {
  install,
  version: '0.0.1',
};

// 类型导出
export type { ButtonProps } from './button';
export type { InputProps } from './input';
export type { SelectProps, SelectOption } from './select';
export type { TableProps, TableColumn, SortState, SortOrder, FilterState, TablePagination } from './table';
export type { DialogProps, DialogConfirmOptions, DialogMethods, DialogMethodType } from './dialog';
export type { TooltipProps } from './tooltip';
export type { PopconfirmProps } from './popconfirm';
export type { FormProps, FormItemProps, FormItemRule, FormInstance, FormItemContext } from './form';
export type { ConfigProviderProps } from './config-provider';

// Dialog 命令式方法导出
export { confirm, info, success, warning, error } from './dialog';
