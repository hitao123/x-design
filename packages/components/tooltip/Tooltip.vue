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
    <Teleport to="body" :disabled="!isMounted">
      <Transition name="x-tooltip-fade">
        <div
          v-if="destroyTooltipOnHide ? popperVisible : true"
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
import { ref, computed, toRef, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { usePopper } from '../_internal/popper';
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
  open: undefined,
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
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

const handleVisibleChange = (val: boolean) => {
  emit('update:open', val);
  emit('openChange', val);
};

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
  placement: toRef(props, 'placement'),
  offset: toRef(props, 'offset'),
  showArrow: toRef(props, 'showArrow'),
  openDelay: toRef(props, 'openDelay'),
  closeDelay: toRef(props, 'closeDelay'),
  disabled: toRef(props, 'disabled'),
  open: toRef(props, 'open'),
  onVisibleChange: handleVisibleChange,
});

// destroyTooltipOnHide 模式下，v-if 新创建 DOM 时需手动触发位置计算
watch(popperVisible, (val) => {
  if (val && props.destroyTooltipOnHide) {
    nextTick(() => update());
  }
});

const popperClasses = computed(() => [
  'x-tooltip__popper',
  `x-tooltip__popper--${actualPlacement.value.split('-')[0]}`,
  props.popperClass,
]);

const isHoverTrigger = computed(() => props.trigger === 'hover');
const isClickTrigger = computed(() => props.trigger === 'click');
const isFocusTrigger = computed(() => props.trigger === 'focus');

const handleMouseEnter = () => {
  if (!props.disabled && isHoverTrigger.value) show();
};

const handleMouseLeave = () => {
  if (!props.disabled && isHoverTrigger.value) hide();
};

const handleClick = () => {
  if (!props.disabled && isClickTrigger.value) toggle();
};

const handleFocus = () => {
  if (!props.disabled && isFocusTrigger.value) show();
};

const handleBlur = () => {
  if (!props.disabled && isFocusTrigger.value) hide();
};

const handlePopperMouseEnter = () => {
  if (!props.disabled && isHoverTrigger.value && props.enterable) clearTimers();
};

const handlePopperMouseLeave = () => {
  if (!props.disabled && isHoverTrigger.value && props.enterable) hide();
};

useClickOutside([tooltipRef, floatingRef], () => {
  if (popperVisible.value && isClickTrigger.value) hide();
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
