<template>
  <div :class="classes" @click="handleWrapperClick">
    <div :class="wrapperClasses">
      <span class="x-tag-input__tags">
        <XTag
          v-for="(tag, index) in modelValue"
          :key="index"
          :type="tagType"
          :effect="tagEffect"
          :size="innerTagSize"
          :closable="closable && !isDisabled"
          @close="handleRemove(index)"
        >
          {{ tag }}
        </XTag>
      </span>
      <input
        ref="inputRef"
        class="x-tag-input__inner"
        :value="inputValue"
        :placeholder="currentPlaceholder"
        :disabled="isDisabled"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { XTag } from '../tag';
import { useFormItem } from '../_hooks';
import type { TagInputProps } from './types';
import type { TagSize } from '../tag/types';

defineOptions({
  name: 'XTagInput',
});

const props = withDefaults(defineProps<TagInputProps>(), {
  modelValue: () => [],
  disabled: false,
  size: 'medium',
  maxTags: 0,
  closable: true,
  tagType: 'default',
  tagEffect: 'light',
  allowDuplicates: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
  change: [value: string[]];
  add: [value: string];
  remove: [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const { isFormDisabled, validateState, triggerValidation } = useFormItem();

const inputRef = ref<HTMLInputElement>();
const inputValue = ref('');
const isFocused = ref(false);

const isDisabled = computed(() => props.disabled || isFormDisabled.value);

const innerTagSize = computed((): TagSize => {
  if (props.size === 'large') return 'medium';
  return 'small';
});

const currentPlaceholder = computed(() => {
  if (props.modelValue && props.modelValue.length > 0) return '';
  return props.placeholder;
});

const classes = computed(() => [
  'x-tag-input',
  `x-tag-input--${props.size}`,
  {
    'is-disabled': isDisabled.value,
    'is-focused': isFocused.value,
  },
]);

const wrapperClasses = computed(() => [
  'x-tag-input__wrapper',
  {
    'is-focused': isFocused.value,
    'is-error': validateState.value === 'error',
  },
]);

const canAdd = computed(() => {
  if (props.maxTags > 0 && props.modelValue && props.modelValue.length >= props.maxTags) {
    return false;
  }
  return true;
});

const addTag = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return;
  if (!canAdd.value) return;
  if (!props.allowDuplicates && props.modelValue && props.modelValue.includes(trimmed)) return;

  const newTags = [...(props.modelValue || []), trimmed];
  emit('update:modelValue', newTags);
  emit('change', newTags);
  emit('add', trimmed);
  inputValue.value = '';
  triggerValidation('change');
};

const handleRemove = (index: number) => {
  if (isDisabled.value) return;
  const removed = props.modelValue![index];
  const newTags = [...props.modelValue!];
  newTags.splice(index, 1);
  emit('update:modelValue', newTags);
  emit('change', newTags);
  emit('remove', removed);
  triggerValidation('change');
};

const handleInput = (event: Event) => {
  inputValue.value = (event.target as HTMLInputElement).value;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === 'Tab') {
    if (inputValue.value.trim()) {
      event.preventDefault();
      addTag(inputValue.value);
    }
  } else if (event.key === 'Backspace' && !inputValue.value) {
    if (props.modelValue && props.modelValue.length > 0) {
      handleRemove(props.modelValue.length - 1);
    }
  }
};

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true;
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false;
  if (inputValue.value.trim()) {
    addTag(inputValue.value);
  }
  emit('blur', event);
  triggerValidation('blur');
};

const handleWrapperClick = () => {
  if (isDisabled.value) return;
  inputRef.value?.focus();
};

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<style lang="scss">
@use './style.scss';
</style>
