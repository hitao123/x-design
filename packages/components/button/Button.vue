<template>
  <button :class="classes" :type="nativeType" :disabled="disabled || loading" @click="handleClick">
    <!-- loading 图标 -->
    <template v-if="loading">
      <IconWrapper class="x-button__loading-icon" spin>
        <component :is="loadingIconComp" v-if="loadingIconComp" />
        <svg v-else viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64zm0 85.333a362.667 362.667 0 1 0 0 725.334A362.667 362.667 0 0 0 512 149.333z"
            opacity=".2"
          />
          <path
            d="M512 64c17.067 0 32 14.933 32 32v128c0 17.067-14.933 32-32 32s-32-14.933-32-32V96c0-17.067 14.933-32 32-32z"
          />
        </svg>
      </IconWrapper>
    </template>
    <!-- icon prop 或 icon slot -->
    <IconWrapper v-else-if="iconComp || $slots.icon" class="x-button__icon">
      <component :is="iconComp" v-if="iconComp" />
      <slot v-else name="icon" />
    </IconWrapper>
    <!-- 默认插槽内容 -->
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconWrapper, iconMap } from '@x-design/icons';
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
  loading: false,
  icon: undefined,
  loadingIcon: undefined,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const iconComp = computed(() => {
  return props.icon ? iconMap[props.icon] : undefined;
});

const loadingIconComp = computed(() => {
  return props.loadingIcon ? iconMap[props.loadingIcon] : undefined;
});

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
      'is-loading': props.loading,
    },
  ];
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style lang="scss">
@use './style.scss';
</style>
