import { onBeforeUnmount, onMounted, type Ref } from 'vue';

/**
 * 检测点击元素外部的 hook
 * @param elementRefs - 需要排除的元素 refs 数组
 * @param callback - 点击外部时的回调
 */
export function useClickOutside(
  elementRefs: Ref<HTMLElement | undefined>[],
  callback: (event: MouseEvent) => void,
) {
  const handler = (event: MouseEvent) => {
    const target = event.target as Node;
    const isOutside = elementRefs.every((ref) => {
      const el = ref.value;
      return el && !el.contains(target);
    });

    if (isOutside) {
      callback(event);
    }
  };

  onMounted(() => {
    document.addEventListener('click', handler, true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('click', handler, true);
  });
}
