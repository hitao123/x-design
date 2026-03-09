<template>
  <div :class="classes" role="group">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue';
import { useFormItem } from '../_hooks';
import type { CheckboxGroupProps, CheckboxGroupContext, CheckboxValue } from './types';

defineOptions({
  name: 'XCheckboxGroup',
});

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  modelValue: () => [],
  disabled: false,
  size: 'medium',
  min: 0,
  max: 0,
});

const emit = defineEmits<{
  'update:modelValue': [value: CheckboxValue[]];
  change: [value: CheckboxValue[]];
}>();

const { isFormDisabled, triggerValidation } = useFormItem();

const effectiveDisabled = computed(() => props.disabled || isFormDisabled.value);

const classes = computed(() => ['x-checkbox-group', `x-checkbox-group--${props.size}`]);

const changeEvent = (value: CheckboxValue[]) => {
  emit('update:modelValue', value);
  emit('change', value);
  triggerValidation('change');
};

provide<CheckboxGroupContext>('xCheckboxGroup', {
  modelValue: toRef(props, 'modelValue'),
  disabled: effectiveDisabled,
  size: toRef(props, 'size'),
  min: toRef(props, 'min'),
  max: toRef(props, 'max'),
  changeEvent,
});
</script>
