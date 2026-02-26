import { ref, computed, unref, type Ref, type MaybeRef, type CSSProperties } from 'vue';
import {
  useFloating,
  offset as offsetMiddleware,
  flip,
  shift,
  arrow as arrowMiddleware,
  size as sizeMiddleware,
  autoUpdate,
  type Placement,
} from '@floating-ui/vue';

export interface UsePopperOptions {
  placement?: MaybeRef<Placement>;
  offset?: MaybeRef<number>;
  showArrow?: MaybeRef<boolean>;
  openDelay?: MaybeRef<number>;
  closeDelay?: MaybeRef<number>;
  disabled?: MaybeRef<boolean>;
  open?: MaybeRef<boolean | undefined>;
  /** 浮层宽度是否匹配触发器宽度 */
  matchWidth?: MaybeRef<boolean>;
}

/**
 * Popper 核心 composable
 * 封装 @floating-ui/vue 的 useFloating + middleware，管理 visible 状态、延迟定时器、箭头位置计算
 */
export function usePopper(
  referenceRef: Ref<HTMLElement | undefined>,
  floatingRef: Ref<HTMLElement | undefined>,
  arrowRef: Ref<HTMLElement | undefined>,
  options: UsePopperOptions = {}
) {
  const placementRef = computed(() => unref(options.placement) ?? 'top');
  const offsetRef = computed(() => unref(options.offset) ?? 8);
  const showArrowRef = computed(() => unref(options.showArrow) ?? true);
  const openDelayRef = computed(() => unref(options.openDelay) ?? 0);
  const closeDelayRef = computed(() => unref(options.closeDelay) ?? 0);
  const disabledRef = computed(() => unref(options.disabled) ?? false);
  const matchWidthRef = computed(() => unref(options.matchWidth) ?? false);
  const openRef = computed(() => unref(options.open));

  const internalVisible = ref(false);
  let openTimer: ReturnType<typeof setTimeout> | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  const visible = computed({
    get: () => {
      if (openRef.value !== undefined) return openRef.value;
      return internalVisible.value;
    },
    set: (val: boolean) => {
      internalVisible.value = val;
    },
  });

  const middleware = computed(() => {
    const mw = [offsetMiddleware(offsetRef.value), flip(), shift({ padding: 5 })];
    if (matchWidthRef.value) {
      mw.push(
        sizeMiddleware({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
            });
          },
        })
      );
    }
    if (showArrowRef.value && arrowRef.value) {
      mw.push(arrowMiddleware({ element: arrowRef }));
    }
    return mw;
  });

  const {
    floatingStyles,
    middlewareData,
    placement: actualPlacement,
    update,
  } = useFloating(referenceRef, floatingRef, {
    placement: placementRef,
    strategy: 'fixed',
    middleware,
    whileElementsMounted: autoUpdate,
  });

  // 箭头样式计算
  const arrowStyles = computed<CSSProperties>(() => {
    const arrowData = middlewareData.value.arrow;
    if (!arrowData) return {};

    const { x, y } = arrowData;
    const side = actualPlacement.value.split('-')[0];
    const staticSide: Record<string, string> = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    };

    return {
      left: x != null ? `${x}px` : '',
      top: y != null ? `${y}px` : '',
      [staticSide[side]]: '-4px',
    };
  });

  const clearTimers = () => {
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
    }
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  };

  const show = () => {
    if (disabledRef.value) return;
    clearTimers();

    const delay = openDelayRef.value;
    if (delay > 0) {
      openTimer = setTimeout(() => {
        internalVisible.value = true;
      }, delay);
    } else {
      internalVisible.value = true;
    }
  };

  const hide = () => {
    clearTimers();

    const delay = closeDelayRef.value;
    if (delay > 0) {
      closeTimer = setTimeout(() => {
        internalVisible.value = false;
      }, delay);
    } else {
      internalVisible.value = false;
    }
  };

  const toggle = () => {
    if (visible.value) {
      hide();
    } else {
      show();
    }
  };

  return {
    visible,
    floatingStyles,
    arrowStyles,
    actualPlacement,
    show,
    hide,
    toggle,
    clearTimers,
    update,
  };
}
