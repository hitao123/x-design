import { computed, inject, ref } from 'vue';
import { CONFIG_PROVIDER_KEY } from '../config-provider/types';

const globalZIndex = ref(2000);

/**
 * 全局 z-index 管理 hook
 * 维护自增计数器，每次调用 nextZIndex() 返回递增值
 * 从 ConfigProvider 读取初始值
 */
export function useZIndex() {
  const config = inject(CONFIG_PROVIDER_KEY, undefined);
  const initialZIndex = computed(() => config?.value?.zIndex ?? 2000);

  const currentZIndex = computed(() => globalZIndex.value);

  const nextZIndex = () => {
    globalZIndex.value = Math.max(globalZIndex.value, initialZIndex.value) + 1;
    return globalZIndex.value;
  };

  return {
    initialZIndex,
    currentZIndex,
    nextZIndex,
  };
}
