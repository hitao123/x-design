import { computed, inject } from 'vue';
import { CONFIG_PROVIDER_KEY } from '../config-provider/types';

let idCounter = 0;

/**
 * 唯一 ID 生成 hook
 * 为无障碍 aria 属性提供稳定的唯一标识符
 * @param prefix - ID 前缀
 */
export function useId(prefix = 'x') {
  const config = inject(CONFIG_PROVIDER_KEY, undefined);
  const namespace = computed(() => config?.value?.namespace ?? 'x');

  const id = `${namespace.value}-id-${prefix}-${++idCounter}`;

  return id;
}
