<template>
  <div ref="tooltipRef" class="x-tooltip">
    <div
      ref="referenceRef"
      class="x-tooltip__trigger"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
      @focus="handleFocus"
      @blur="handleBlur"
    >
      <slot />
    </div>
    <Teleport to="body">
      <Transition name="x-tooltip-fade">
        <div
          v-if="visible"
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
            :style="arrowStyles"
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useFloating, offset, flip, shift, arrow } from '@floating-ui/vue';
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
});

const visible = ref(false);
const tooltipRef = ref<HTMLElement>();
const referenceRef = ref<HTMLElement>();
const floatingRef = ref<HTMLElement>();
const arrowRef = ref<HTMLElement>();

// Use Floating UI
const { floatingStyles, middlewareData, placement: actualPlacement } = useFloating(
  referenceRef,
  floatingRef,
  {
    placement: props.placement,
    middleware: [
      offset(props.offset),
      flip(),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
    whileElementsMounted: (reference, floating, update) => {
      if (visible.value) {
        update();
      }
    },
  }
);

const popperClasses = computed(() => [
  'x-tooltip__popper',
  `x-tooltip__popper--${actualPlacement.value}`,
]);

// Arrow positioning based on Floating UI
const arrowStyles = computed(() => {
  const arrowData = middlewareData.value.arrow;
  if (!arrowData) return {};

  const { x, y } = arrowData;
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }[actualPlacement.value.split('-')[0]];

  return {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [staticSide as string]: '-4px',
  };
});

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
    visible.value = !visible.value;
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
    visible.value = true;
  }
};

const handlePopperMouseLeave = () => {
  if (props.trigger === 'hover' && props.enterable) {
    hide();
  }
};

const show = () => {
  if (!props.disabled) {
    visible.value = true;
  }
};

const hide = () => {
  visible.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    visible.value &&
    props.trigger === 'click' &&
    tooltipRef.value &&
    !tooltipRef.value.contains(event.target as Node) &&
    floatingRef.value &&
    !floatingRef.value.contains(event.target as Node)
  ) {
    hide();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss">
@import './style.scss';
</style>
