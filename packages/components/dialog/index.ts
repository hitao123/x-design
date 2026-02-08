import Dialog from './Dialog.vue';
import { withInstall } from '@x-design/utils';
import { confirm } from './confirm';
import type { App } from 'vue';

const XDialog = withInstall(Dialog);

// 添加 $confirm 方法
XDialog.confirm = confirm;

// 扩展 install 方法，将 $confirm 挂载到 app.config.globalProperties
const originalInstall = XDialog.install;
XDialog.install = (app: App) => {
  originalInstall?.(app);
  app.config.globalProperties.$dialog = {
    confirm,
  };
};

export { XDialog, confirm };
export default XDialog;

export type { DialogProps, DialogConfirmOptions } from './types';
