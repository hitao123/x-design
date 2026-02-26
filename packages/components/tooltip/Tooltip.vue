<template>
  <div ref="tooltipRef" class="x-tooltip">
    <div
      ref="referenceRef"
      class="x-tooltip__trigger"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @focusin="handleFocus"
      @focusout="handleBlur"
    >
      <slot />
    </div>
    <Teleport to="body">
      <Transition name="x-tooltip-fade">
        <div
          v-if="shouldRender"
          v-show="popperVisible"
          ref="floatingRef"
          :class="popperClasses"
          :style="floatingStyles"
          @mouseenter="handlePopperMouseEnter"
          @mouseleave="handlePopperMouseLeave"
        >
          <div
            v-if="showArrow"
            ref="arrowRef"
            class="x-tooltip__arrow"
            :style="computedArrowStyles"
          />
          <div class="x-tooltip__content">
            <slot name="content">{{ content }}</slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import { usePopper } from '../_internal/popper/usePopper';
import { useClickOutside } from '../_hooks';
import type { TooltipProps } from './types';

defineOptions({
  name: 'XTooltip',
});

const props = withDefaults(defineProps<TooltipProps>(), {
  content: '',
  placement: 'top',
  trigger: 'hover',
  disabled: false,
  offset: 8,
  showArrow: true,
  enterable: true,
  openDelay: 0,
  closeDelay: 200,
  destroyTooltipOnHide: false,
});

const emit = defineEmits<{
  'update:open': [value: boolean];
  openChange: [value: boolean];
}>();

const tooltipRef = ref<HTMLElement>();
const referenceRef = ref<HTMLElement>();
const floatingRef = ref<HTMLElement>();
const arrowRef = ref<HTMLElement>();

const {
  visible: popperVisible,
  floatingStyles,
  arrowStyles: computedArrowStyles,
  actualPlacement,
  show,
  hide,
  toggle,
  clearTimers,
  update,
} = usePopper(referenceRef, floatingRef, arrowRef, {
  placement: computed(() => props.placement),
  offset: computed(() => props.offset),
  showArrow: computed(() => props.showArrow),
  openDelay: computed(() => props.openDelay),
  closeDelay: computed(() => props.closeDelay),
  disabled: computed(() => props.disabled),
  open: computed(() => props.open),
});

const rendered = ref(false);
const shouldRender = computed(() => {
  if (props.destroyTooltipOnHide) return popperVisible.value;
  return rendered.value;
});

watch(popperVisible, (val) => {
  if (val) {
    rendered.value = true;
    nextTick(() => {
      update();
    });
  }
  emit('update:open', val);
  emit('openChange', val);
});

const popperClasses = computed(() => [
  'x-tooltip__popper',
  `x-tooltip__popper--${actualPlacement.value.split('-')[0]}`,
  props.popperClass,
]);

const handleMouseEnter = () => {
  if (props.trigger === 'hover' && !props.disabled) {
    show();
  }
};

const handleMouseLeave = () => {
  if (props.trigger === 'hover' && !props.disabled) {
    hide();
  }
};

const handleClick = () => {
  if (props.trigger === 'click' && !props.disabled) {
    toggle();
  }
};

const handleFocus = () => {
  if (props.trigger === 'focus' && !props.disabled) {
    show();
  }
};

const handleBlur = () => {
  if (props.trigger === 'focus' && !props.disabled) {
    hide();
  }
};

const handlePopperMouseEnter = () => {
  if (props.trigger === 'hover' && props.enterable) {
    clearTimers();
  }
};

const handlePopperMouseLeave = () => {
  if (props.trigger === 'hover' && props.enterable) {
    hide();
  }
};

useClickOutside([tooltipRef, floatingRef], () => {
  if (popperVisible.value && props.trigger === 'click') {
    hide();
  }
});

onBeforeUnmount(() => {
  clearTimers();
});

defineExpose({
  show,
  hide,
});
</script>

<style lang="scss">
@use './style.scss';
</style>
