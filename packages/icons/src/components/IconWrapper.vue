<template>
  <i :class="classes" :style="styles">
    <slot />
  </i>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IconProps } from '../types';

defineOptions({
  name: 'IconWrapper',
});

const props = withDefaults(defineProps<IconProps>(), {
  size: '1em',
  spin: false,
});

const classes = computed(() => [
  'x-icon',
  {
    'x-icon--spin': props.spin,
  },
]);

const styles = computed(() => ({
  fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color,
  transform: props.rotate ? `rotate(${props.rotate}deg)` : undefined,
}));
</script>

<style lang="scss">
.x-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: -0.125em;
  fill: currentColor;
  width: 1em;
  height: 1em;
  line-height: 0;

  svg {
    width: 100%;
    height: 100%;
  }

  &--spin {
    animation: x-icon-spin 1s linear infinite;
  }
}

@keyframes x-icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
