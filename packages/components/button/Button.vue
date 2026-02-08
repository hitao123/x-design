<template>
  <button :class="classes" :type="nativeType" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ButtonProps } from './types';

defineOptions({
  name: 'XButton',
});

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'medium',
  nativeType: 'button',
  disabled: false,
  plain: false,
  round: false,
  circle: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const classes = computed(() => {
  return [
    'x-button',
    `x-button--${props.type}`,
    `x-button--${props.size}`,
    {
      'is-disabled': props.disabled,
      'is-plain': props.plain,
      'is-round': props.round,
      'is-circle': props.circle,
    },
  ];
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style lang="scss">
@import './style.scss';
</style>
