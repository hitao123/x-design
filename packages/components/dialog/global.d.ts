import type { App } from 'vue';

declare module 'vue' {
  export interface ComponentCustomProperties {
    $dialog: {
      confirm: (options: import('./dialog/types').DialogConfirmOptions) => Promise<void>;
    };
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $dialog: {
      confirm: (options: import('./dialog/types').DialogConfirmOptions) => Promise<void>;
    };
  }
}
