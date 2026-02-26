import Dialog from './Dialog.vue';
import { withInstall } from '@x-design/utils';
import { confirm, info, success, warning, error } from './confirm';
import type { App } from 'vue';

const XDialog = withInstall(Dialog);

// 添加静态方法
XDialog.confirm = confirm;
XDialog.info = info;
XDialog.success = success;
XDialog.warning = warning;
XDialog.error = error;

// 扩展 install 方法，将方法挂载到 app.config.globalProperties
const originalInstall = XDialog.install;
XDialog.install = (app: App) => {
  originalInstall?.(app);
  app.config.globalProperties.$dialog = {
    confirm,
    info,
    success,
    warning,
    error,
  };
};

export { XDialog, confirm, info, success, warning, error };
export default XDialog;

export type { DialogProps, DialogConfirmOptions, DialogMethods, DialogMethodType } from './types';
