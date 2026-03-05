<template>
  <label :class="classes">
    <span class="x-radio__input" :class="{ 'is-checked': isChecked, 'is-disabled': isDisabled }">
      <span class="x-radio__inner"></span>
      <input
        class="x-radio__original"
        type="radio"
        :name="radioName"
        :value="label"
        :disabled="isDisabled"
        :checked="isChecked"
        @change="handleChange"
      />
    </span>
    <span class="x-radio__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import type { RadioProps, RadioGroupContext } from './types';

defineOptions({
  name: 'XRadio',
});

const props = withDefaults(defineProps<RadioProps>(), {
  disabled: false,
  size: 'medium',
});

const emit = defineEmits<{
  'update:modelValue': [value: RadioProps['label']];
  change: [value: RadioProps['label']];
}>();

const radioGroup = inject<RadioGroupContext | null>('xRadioGroup', null);

const isChecked = computed(() => {
  if (radioGroup) {
    return radioGroup.modelValue.value === props.label;
  }
  return props.modelValue === props.label;
});

const isDisabled = computed(() => {
  return radioGroup?.disabled.value || props.disabled;
});

const radioSize = computed(() => {
  return radioGroup?.size.value || props.size;
});

const radioName = computed(() => {
  return radioGroup?.name.value || props.name;
});

const classes = computed(() => [
  'x-radio',
  `x-radio--${radioSize.value}`,
  {
    'is-checked': isChecked.value,
    'is-disabled': isDisabled.value,
  },
]);

const handleChange = () => {
  if (isDisabled.value) return;
  if (radioGroup) {
    radioGroup.changeEvent(props.label!);
  } else {
    emit('update:modelValue', props.label);
    emit('change', props.label);
  }
};
</script>

<style lang="scss">
@use './style.scss';
</style>
