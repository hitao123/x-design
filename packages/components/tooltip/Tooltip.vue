<template>
  <div ref="tooltipRef" class="x-tooltip">
    <PopperTrigger
      ref="triggerComp"
      :trigger="trigger"
      :disabled="disabled"
      @show="show"
      @hide="hide"
      @toggle="toggle"
    >
      <slot />
    </PopperTrigger>
    <PopperContent
      ref="contentComp"
      :visible="popperVisible"
      :floating-styles="floatingStyles"
      :arrow-styles="computedArrowStyles"
      :show-arrow="showArrow"
      :popper-class="tooltipPopperClass"
      :placement-class="placementClass"
      transition="x-tooltip-fade"
      :enterable="enterable"
      :destroy-on-hide="destroyTooltipOnHide"
      @mouseenter="handlePopperMouseEnter"
      @mouseleave="handlePopperMouseLeave"
    >
      <div class="x-tooltip__content">
        <slot name="content">{{ content }}</slot>
      </div>
    </PopperContent>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef, watch, nextTick, onBeforeUnmount } from 'vue';
import { usePopper, PopperTrigger, PopperContent } from '../_internal/popper';
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
const triggerComp = ref<InstanceType<typeof PopperTrigger>>();
const contentComp = ref<InstanceType<typeof PopperContent>>();

const referenceRef = computed(() => triggerComp.value?.triggerRef);
const floatingRef = computed(() => contentComp.value?.contentRef);
const arrowRef = computed(() => contentComp.value?.arrowRef);

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

const placementClass = computed(
  () => `x-tooltip__popper--${actualPlacement.value.split('-')[0]}`
);

const tooltipPopperClass = computed(() =>
  ['x-tooltip__popper', props.popperClass].filter(Boolean).join(' ')
);

const handlePopperMouseEnter = () => {
  if (!props.disabled && props.trigger === 'hover' && props.enterable) clearTimers();
};

const handlePopperMouseLeave = () => {
  if (!props.disabled && props.trigger === 'hover' && props.enterable) hide();
};

useClickOutside([tooltipRef, floatingRef], () => {
  if (popperVisible.value && props.trigger === 'click') hide();
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
