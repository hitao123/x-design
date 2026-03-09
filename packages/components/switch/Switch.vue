<template>
  <div :class="classes" :style="customStyle" @click="handleClick">
    <span v-if="inactiveText" class="x-switch__label x-switch__label--left">
      {{ inactiveText }}
    </span>
    <span class="x-switch__core">
      <input
        class="x-switch__input"
        type="checkbox"
        :name="name"
        :checked="modelValue"
        :disabled="isDisabled"
        hidden
      />
      <span class="x-switch__action">
        <IconWrapper v-if="loading" class="x-switch__loading" spin>
          <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64zm0 85.333a362.667 362.667 0 1 0 0 725.334A362.667 362.667 0 0 0 512 149.333z"
              opacity=".2"
            />
            <path
              d="M512 64c17.067 0 32 14.933 32 32v128c0 17.067-14.933 32-32 32s-32-14.933-32-32V96c0-17.067 14.933-32 32-32z"
            />
          </svg>
        </IconWrapper>
      </span>
    </span>
    <span v-if="activeText" class="x-switch__label x-switch__label--right">
      {{ activeText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconWrapper } from '@x-design/icons';
import { useFormItem } from '../_hooks';
import type { SwitchProps } from './types';

defineOptions({
  name: 'XSwitch',
});

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: false,
  size: 'medium',
  loading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [value: boolean];
}>();

const { isFormDisabled, triggerValidation } = useFormItem();

const isDisabled = computed(() => props.disabled || isFormDisabled.value || props.loading);

const classes = computed(() => [
  'x-switch',
  `x-switch--${props.size}`,
  {
    'is-checked': props.modelValue,
    'is-disabled': isDisabled.value,
    'is-loading': props.loading,
  },
]);

const customStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.activeColor) {
    style['--x-switch-on-color'] = props.activeColor;
  }
  if (props.inactiveColor) {
    style['--x-switch-off-color'] = props.inactiveColor;
  }
  return style;
});

const handleClick = () => {
  if (isDisabled.value) return;
  const newVal = !props.modelValue;
  emit('update:modelValue', newVal);
  emit('change', newVal);
  triggerValidation('change');
};
</script>

<style lang="scss">
@use './style.scss';
</style>
