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
export { XRadio, XRadioGroup } from './radio';
export { XCheckbox, XCheckboxGroup } from './checkbox';
export { XLoading, vLoading, loadingService } from './loading';
export { XMessage } from './message';
export { XTree } from './tree';
export { XPagination } from './pagination';
export { XSwitch } from './switch';
export { XTag } from './tag';
export { XTagInput } from './tag-input';

import { XButton } from './button';
import { XInput } from './input';
import { XSelect } from './select';
import { XTable } from './table';
import { XDialog } from './dialog';
import { XTooltip } from './tooltip';
import { XPopconfirm } from './popconfirm';
import { XForm, XFormItem } from './form';
import { XConfigProvider } from './config-provider';
import { XRadio, XRadioGroup } from './radio';
import { XCheckbox, XCheckboxGroup } from './checkbox';
import { XLoading } from './loading';
import { XMessage } from './message';
import { XTree } from './tree';
import { XPagination } from './pagination';
import { XSwitch } from './switch';
import { XTag } from './tag';
import { XTagInput } from './tag-input';

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
  XRadio,
  XRadioGroup,
  XCheckbox,
  XCheckboxGroup,
  XTree,
  XPagination,
  XSwitch,
  XTag,
  XTagInput,
];

const install = (app: App) => {
  components.forEach((component) => {
    app.component(component.name, component);
  });
  // 注册 Loading 指令和服务
  XLoading.install(app);
  // 注册 Message 到全局
  app.config.globalProperties.$message = XMessage;
};

export default {
  install,
  version: '0.0.1',
};

// 类型导出
export type { ButtonProps } from './button';
export type { InputProps, InputAutoSize } from './input';
export type { SelectProps, SelectOption } from './select';
export type {
  TableProps,
  TableColumn,
  SortState,
  SortOrder,
  FilterState,
  TablePagination,
} from './table';
export type { DialogProps, DialogConfirmOptions, DialogMethods, DialogMethodType } from './dialog';
export type { TooltipProps } from './tooltip';
export type { PopconfirmProps } from './popconfirm';
export type { FormProps, FormItemProps, FormItemRule, FormInstance, FormItemContext } from './form';
export type { ConfigProviderProps } from './config-provider';
export type { RadioProps, RadioGroupProps, RadioValue } from './radio';
export type { CheckboxProps, CheckboxGroupProps, CheckboxValue } from './checkbox';
export type { LoadingOptions, LoadingInstance } from './loading';
export type {
  MessageOptions,
  MessageProps,
  MessageType,
  MessageInstance,
  MessageApi,
} from './message';
export type { TreeProps, TreeNodeData, TreeKey } from './tree';
export type { PaginationProps } from './pagination';
export type { SwitchProps, SwitchSize } from './switch';
export type { TagProps, TagType, TagEffect, TagSize } from './tag';
export type { TagInputProps } from './tag-input';

// Dialog 命令式方法导出
export { confirm, info, success, warning, error } from './dialog';
