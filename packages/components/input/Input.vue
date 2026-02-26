<template>
  <div :class="wrapperClasses">
    <input
      ref="inputRef"
      :class="classes"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { InputProps } from './types';

defineOptions({
  name: 'XInput',
});

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'medium',
  disabled: false,
  readonly: false,
  clearable: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  input: [value: string];
  change: [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const inputRef = ref<HTMLInputElement>();
const isFocused = ref(false);

const wrapperClasses = computed(() => [
  'x-input',
  `x-input--${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-focused': isFocused.value,
  },
]);

const classes = computed(() => ['x-input__inner']);

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('update:modelValue', value);
  emit('input', value);
};

const handleChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('change', value);
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  emit('blur', event);
};

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<style lang="scss">
@use './style.scss';
</style>
