import type { ComputedRef, InjectionKey } from 'vue';
import type { LocaleType } from '@x-design/utils';

export interface ConfigProviderProps {
  /** 全局尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 弹出层起始 z-index */
  zIndex?: number;
  /** 国际化语言包 */
  locale?: LocaleType;
  /** CSS 类名前缀 */
  namespace?: string;
}

export const CONFIG_PROVIDER_KEY: InjectionKey<ComputedRef<ConfigProviderProps>> =
  Symbol('configProvider');
