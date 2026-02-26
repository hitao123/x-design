import { computed, inject } from 'vue';
import { CONFIG_PROVIDER_KEY } from '../config-provider/types';
import { zhCN } from '@x-design/utils';

/**
 * 国际化 hook
 * 从 ConfigProvider 注入的 locale 中读取组件文案
 */
export function useLocale() {
  const config = inject(CONFIG_PROVIDER_KEY, undefined);

  const locale = computed(() => config?.value?.locale ?? zhCN);

  /**
   * 翻译函数：根据 key 路径获取对应文案
   * @param path - 点分隔的 key 路径，如 'dialog.confirm'
   * @param defaultValue - 默认值
   */
  const t = (path: string, defaultValue = ''): string => {
    const keys = path.split('.');
    let result: any = locale.value;
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) return defaultValue;
    }
    return typeof result === 'string' ? result : defaultValue;
  };

  return {
    locale,
    t,
  };
}
