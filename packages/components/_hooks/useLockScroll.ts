import { watch, onScopeDispose, type Ref } from 'vue';

let lockCount = 0;
let originalOverflow = '';

/**
 * 锁定 body 滚动的 hook
 * 支持嵌套计数：多个 Dialog 叠加时，只在最后一个关闭时解锁
 * @param shouldLock - 控制锁定的响应式 ref
 */
export function useLockScroll(shouldLock: Ref<boolean>) {
  const lock = () => {
    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount++;
  };

  const unlock = () => {
    lockCount--;
    if (lockCount <= 0) {
      lockCount = 0;
      document.body.style.overflow = originalOverflow;
    }
  };

  watch(
    shouldLock,
    (val, oldVal) => {
      if (val && !oldVal) {
        lock();
      } else if (!val && oldVal) {
        unlock();
      }
    },
    { immediate: true },
  );

  // 组件卸载时确保解锁
  onScopeDispose(() => {
    if (shouldLock.value) {
      unlock();
    }
  });
}
