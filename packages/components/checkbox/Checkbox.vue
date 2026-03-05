<template>
  <label :class="classes">
    <span
      class="x-checkbox__input"
      :class="{
        'is-checked': isChecked,
        'is-disabled': isDisabled,
        'is-indeterminate': props.indeterminate,
      }"
    >
      <span class="x-checkbox__inner"></span>
      <input
        class="x-checkbox__original"
        type="checkbox"
        :name="props.name"
        :disabled="isDisabled"
        :checked="isChecked"
        @change="handleChange"
      />
    </span>
    <span v-if="$slots.default || label" class="x-checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { CheckboxProps, CheckboxGroupContext } from './types';

defineOptions({
  name: 'XCheckbox',
});

const props = withDefaults(defineProps<CheckboxProps>(), {
  disabled: false,
  indeterminate: false,
  size: 'medium',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  change: [value: boolean];
}>();

const checkboxGroup = inject<CheckboxGroupContext | null>('xCheckboxGroup', null);

const isChecked = computed(() => {
  if (checkboxGroup) {
    return checkboxGroup.modelValue.value.includes(props.label!);
  }
  return props.modelValue === true;
});

const isDisabled = computed(() => {
  if (checkboxGroup) {
    if (checkboxGroup.disabled.value) return true;
    // 如果已达到 max 且当前未选中，则禁用
    if (
      !isChecked.value &&
      checkboxGroup.max.value > 0 &&
      checkboxGroup.modelValue.value.length >= checkboxGroup.max.value
    ) {
      return true;
    }
    // 如果已达到 min 且当前已选中，则禁用
    if (
      isChecked.value &&
      checkboxGroup.min.value > 0 &&
      checkboxGroup.modelValue.value.length <= checkboxGroup.min.value
    ) {
      return true;
    }
  }
  return props.disabled;
});

const checkboxSize = computed(() => {
  return checkboxGroup?.size.value || props.size;
});

const classes = computed(() => [
  'x-checkbox',
  `x-checkbox--${checkboxSize.value}`,
  {
    'is-checked': isChecked.value,
    'is-disabled': isDisabled.value,
    'is-indeterminate': props.indeterminate,
  },
]);

const handleChange = () => {
  if (isDisabled.value) return;
  if (checkboxGroup) {
    const groupValue = [...checkboxGroup.modelValue.value];
    const index = groupValue.indexOf(props.label!);
    if (index > -1) {
      groupValue.splice(index, 1);
    } else {
      groupValue.push(props.label!);
    }
    checkboxGroup.changeEvent(groupValue);
  } else {
    const newVal = !props.modelValue;
    emit('update:modelValue', newVal);
    emit('change', newVal);
  }
};
</script>

<style lang="scss">
@use './style.scss';
</style>
