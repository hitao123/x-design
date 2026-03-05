import { vLoading } from './directive';
import { loadingService } from './service';
import type { App } from 'vue';

export const XLoading = {
  install(app: App) {
    app.directive('loading', vLoading);
    app.config.globalProperties.$loading = loadingService;
  },
  directive: vLoading,
  service: loadingService,
};

export { vLoading } from './directive';
export { loadingService } from './service';
export default XLoading;

export type { LoadingOptions, LoadingInstance } from './types';
