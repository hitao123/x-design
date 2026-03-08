import { ref, computed, watch, unref, type Ref, type ComputedRef } from 'vue';

export interface UseVirtualListOptions<T> {
  items: Ref<T[]> | ComputedRef<T[]>;
  itemHeight: Ref<number> | number;
  overscan?: number;
  containerRef: Ref<HTMLElement | undefined>;
}

export interface UseVirtualListReturn<T> {
  virtualItems: ComputedRef<{ data: T; index: number }[]>;
  totalHeight: ComputedRef<number>;
  offsetTop: ComputedRef<number>;
  scrollToTop: () => void;
  scrollToIndex: (index: number) => void;
  onScroll: (event: Event) => void;
  refreshClientHeight: () => void;
}

export function useVirtualList<T>(options: UseVirtualListOptions<T>): UseVirtualListReturn<T> {
  const { items, itemHeight, overscan = 5, containerRef } = options;

  const scrollTop = ref(0);
  const clientHeight = ref(0);

  const getItemHeight = () => unref(itemHeight);

  const totalHeight = computed(() => unref(items).length * getItemHeight());

  const startIndex = computed(() => {
    return Math.max(0, Math.floor(scrollTop.value / getItemHeight()) - overscan);
  });

  const endIndex = computed(() => {
    return Math.min(
      unref(items).length,
      Math.ceil((scrollTop.value + clientHeight.value) / getItemHeight()) + overscan
    );
  });

  const virtualItems = computed(() => {
    const allItems = unref(items);
    const start = startIndex.value;
    const end = endIndex.value;
    const result: { data: T; index: number }[] = [];
    for (let i = start; i < end; i++) {
      result.push({ data: allItems[i], index: i });
    }
    return result;
  });

  const offsetTop = computed(() => startIndex.value * getItemHeight());

  const onScroll = (event: Event) => {
    const el = event.target as HTMLElement;
    scrollTop.value = el.scrollTop;
    clientHeight.value = el.clientHeight;
  };

  const scrollToTop = () => {
    const el = unref(containerRef);
    if (el) {
      el.scrollTop = 0;
    }
    scrollTop.value = 0;
  };

  const scrollToIndex = (index: number) => {
    const el = unref(containerRef);
    const top = index * getItemHeight();
    if (el) {
      el.scrollTop = top;
    }
    scrollTop.value = top;
  };

  const refreshClientHeight = () => {
    const el = unref(containerRef);
    if (el) {
      clientHeight.value = el.clientHeight;
    }
  };

  // Initialize clientHeight when container is available
  watch(
    containerRef,
    (el) => {
      if (el) {
        clientHeight.value = el.clientHeight;
      }
    },
    { immediate: true }
  );

  return {
    virtualItems,
    totalHeight,
    offsetTop,
    scrollToTop,
    scrollToIndex,
    onScroll,
    refreshClientHeight,
  };
}
