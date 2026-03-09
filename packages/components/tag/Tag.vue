<template>
  <span :class="classes" :style="customStyle" @click="handleClick">
    <span class="x-tag__content">
      <slot />
    </span>
    <IconClose v-if="closable" class="x-tag__close" @click.stop="handleClose" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconClose } from '@x-design/icons';
import type { TagProps } from './types';

defineOptions({
  name: 'XTag',
});

const props = withDefaults(defineProps<TagProps>(), {
  type: 'default',
  closable: false,
  size: 'medium',
  effect: 'light',
  round: false,
});

const emit = defineEmits<{
  close: [event: MouseEvent];
  click: [event: MouseEvent];
}>();

const classes = computed(() => [
  'x-tag',
  `x-tag--${props.type}`,
  `x-tag--${props.size}`,
  `x-tag--${props.effect}`,
  {
    'is-round': props.round,
    'is-closable': props.closable,
  },
]);

const customStyle = computed(() => {
  if (!props.color) return undefined;
  if (props.effect === 'dark') {
    return {
      backgroundColor: props.color,
      borderColor: props.color,
      color: '#ffffff',
    };
  }
  if (props.effect === 'plain') {
    return {
      borderColor: props.color,
      color: props.color,
      backgroundColor: 'transparent',
    };
  }
  // light effect
  return {
    backgroundColor: `${props.color}19`,
    borderColor: `${props.color}33`,
    color: props.color,
  };
});

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};

const handleClose = (event: MouseEvent) => {
  emit('close', event);
};
</script>

<style lang="scss">
@use './style.scss';
</style>
