<template>
  <div :class="classes" role="radiogroup">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue';
import type { RadioGroupProps, RadioGroupContext } from './types';

defineOptions({
  name: 'XRadioGroup',
});

const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: false,
  size: 'medium',
});

const emit = defineEmits<{
  'update:modelValue': [value: RadioGroupProps['modelValue']];
  change: [value: RadioGroupProps['modelValue']];
}>();

const classes = computed(() => ['x-radio-group', `x-radio-group--${props.size}`]);

const changeEvent = (value: RadioGroupProps['modelValue']) => {
  emit('update:modelValue', value);
  emit('change', value);
};

provide<RadioGroupContext>('xRadioGroup', {
  modelValue: toRef(props, 'modelValue'),
  disabled: toRef(props, 'disabled'),
  size: toRef(props, 'size'),
  name: toRef(props, 'name'),
  changeEvent,
});
</script>
