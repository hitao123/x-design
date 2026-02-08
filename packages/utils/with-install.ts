import type { App, Plugin } from 'vue';

export type SFCWithInstall<T> = T & Plugin;

export const withInstall = <T>(component: T): SFCWithInstall<T> => {
  const comp = component as SFCWithInstall<T>;
  comp.install = (app: App) => {
    const name = (comp as any).name;
    if (name) {
      app.component(name, comp);
    }
  };
  return comp;
};
