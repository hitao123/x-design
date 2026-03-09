<template>
  <div :class="classes" role="radiogroup">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue';
import { useFormItem } from '../_hooks';
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

const { isFormDisabled, triggerValidation } = useFormItem();

const effectiveDisabled = computed(() => props.disabled || isFormDisabled.value);

const classes = computed(() => ['x-radio-group', `x-radio-group--${props.size}`]);

const changeEvent = (value: RadioGroupProps['modelValue']) => {
  emit('update:modelValue', value);
  emit('change', value);
  triggerValidation('change');
};

provide<RadioGroupContext>('xRadioGroup', {
  modelValue: toRef(props, 'modelValue'),
  disabled: effectiveDisabled,
  size: toRef(props, 'size'),
  name: toRef(props, 'name'),
  changeEvent,
});
</script>
