import { XMessage } from './message';
import type { App } from 'vue';

const install = (app: App) => {
  app.config.globalProperties.$message = XMessage;
};

XMessage.install = install;

export { XMessage };
export default XMessage;

export type { MessageOptions, MessageProps, MessageType, MessageInstance, MessageApi } from './types';
