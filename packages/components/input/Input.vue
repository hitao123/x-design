<template>
  <!-- Textarea 模式 -->
  <div v-if="type === 'textarea'" :class="textareaClasses">
    <textarea
      ref="textareaRef"
      class="x-textarea__inner"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :rows="props.rows"
      :style="textareaStyle"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <span v-if="isWordLimitVisible" class="x-textarea__count">
      {{ textLength }}/{{ maxlength }}
    </span>
  </div>

  <!-- Input 模式 -->
  <div v-else :class="wrapperClasses" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <div :class="innerWrapperClasses" @click="handleWrapperClick">
      <!-- 前缀区域 -->
      <span v-if="hasPrefix" class="x-input__prefix">
        <slot name="prefix">
          <component :is="props.prefixIcon" v-if="props.prefixIcon" class="x-input__icon" />
        </slot>
      </span>

      <input
        ref="inputRef"
        class="x-input__inner"
        :type="inputType"
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

      <!-- 后缀区域 -->
      <span v-if="suffixVisible" class="x-input__suffix">
        <!-- 清除按钮 -->
        <IconClose v-if="showClearIcon" class="x-input__icon x-input__clear" @click="handleClear" />

        <!-- 密码切换 -->
        <component
          :is="passwordVisible ? IconEye : IconEyeOff"
          v-if="showPasswordToggle"
          class="x-input__icon x-input__password"
          @click="togglePasswordVisible"
        />

        <!-- 字数统计 -->
        <span v-if="isWordLimitVisible" class="x-input__count">
          {{ textLength }}/{{ maxlength }}
        </span>

        <!-- 后缀图标/插槽 -->
        <slot name="suffix">
          <component :is="props.suffixIcon" v-if="props.suffixIcon" class="x-input__icon" />
        </slot>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, useSlots, shallowRef } from 'vue';
import { IconClose, IconEye, IconEyeOff } from '@x-design/icons';
import { useFormItem } from '../_hooks';
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
  showPassword: false,
  showWordLimit: false,
  rows: 2,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  input: [value: string];
  change: [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  clear: [];
}>();

const slots = useSlots();
const { validateState } = useFormItem();

const inputRef = ref<HTMLInputElement>();
const textareaRef = ref<HTMLTextAreaElement>();
const isFocused = ref(false);
const hovering = ref(false);
const passwordVisible = ref(false);

// 密码模式下切换可见性
const inputType = computed(() => {
  if (props.showPassword) {
    return passwordVisible.value ? 'text' : 'password';
  }
  return props.type;
});

const textLength = computed(() => (props.modelValue ?? '').length);

const isWordLimitVisible = computed(() => {
  return (
    props.showWordLimit &&
    props.maxlength !== undefined &&
    !props.disabled &&
    !props.readonly &&
    !props.showPassword
  );
});

const showClearIcon = computed(() => {
  return (
    props.clearable &&
    !props.disabled &&
    !props.readonly &&
    textLength.value > 0 &&
    (isFocused.value || hovering.value)
  );
});

const showPasswordToggle = computed(() => {
  return props.showPassword && !props.disabled && !props.readonly;
});

const hasPrefix = computed(() => {
  return !!slots.prefix || !!props.prefixIcon;
});

const suffixVisible = computed(() => {
  return (
    !!slots.suffix ||
    !!props.suffixIcon ||
    props.clearable ||
    props.showPassword ||
    isWordLimitVisible.value
  );
});

const wrapperClasses = computed(() => [
  'x-input',
  `x-input--${props.size}`,
  {
    'is-disabled': props.disabled,
    'x-input--prefix': hasPrefix.value,
    'x-input--suffix': suffixVisible.value,
  },
]);

const innerWrapperClasses = computed(() => [
  'x-input__wrapper',
  {
    'is-focused': isFocused.value,
    'is-error': validateState.value === 'error',
  },
]);

const textareaClasses = computed(() => [
  'x-textarea',
  {
    'is-disabled': props.disabled,
    'is-focused': isFocused.value,
  },
]);

// Textarea autosize
const textareaCalcStyle = shallowRef<Record<string, string>>({});

const textareaStyle = computed(() => {
  return { ...textareaCalcStyle.value };
});

function resizeTextarea() {
  if (props.type !== 'textarea' || !props.autosize) return;

  nextTick(() => {
    const textarea = textareaRef.value;
    if (!textarea) return;

    // 先重置高度以获取准确的 scrollHeight
    textarea.style.height = 'auto';

    const style = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(style.lineHeight);
    const paddingTop = parseFloat(style.paddingTop);
    const paddingBottom = parseFloat(style.paddingBottom);
    const borderTop = parseFloat(style.borderTopWidth);
    const borderBottom = parseFloat(style.borderBottomWidth);

    const scrollHeight = textarea.scrollHeight;
    let minHeight: number | undefined;
    let maxHeight: number | undefined;

    if (typeof props.autosize === 'object') {
      if (props.autosize.minRows) {
        minHeight =
          props.autosize.minRows * lineHeight +
          paddingTop +
          paddingBottom +
          borderTop +
          borderBottom;
      }
      if (props.autosize.maxRows) {
        maxHeight =
          props.autosize.maxRows * lineHeight +
          paddingTop +
          paddingBottom +
          borderTop +
          borderBottom;
      }
    }

    let height = scrollHeight + borderTop + borderBottom;
    if (minHeight !== undefined) height = Math.max(height, minHeight);
    if (maxHeight !== undefined) height = Math.min(height, maxHeight);

    const result: Record<string, string> = {
      height: `${height}px`,
    };
    if (maxHeight !== undefined && height >= maxHeight) {
      result.overflowY = 'auto';
    } else {
      result.overflowY = 'hidden';
    }

    textareaCalcStyle.value = result;
  });
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  emit('update:modelValue', value);
  emit('input', value);
};

const handleChange = (event: Event) => {
  const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
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

const handleClear = () => {
  emit('update:modelValue', '');
  emit('change', '');
  emit('input', '');
  emit('clear');
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const handleWrapperClick = () => {
  if (props.disabled) return;
  inputRef.value?.focus();
};

const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

watch(
  () => props.modelValue,
  () => {
    if (props.type === 'textarea' && props.autosize) {
      resizeTextarea();
    }
  }
);

onMounted(() => {
  if (props.type === 'textarea' && props.autosize) {
    resizeTextarea();
  }
});

defineExpose({
  focus: () => {
    (inputRef.value ?? textareaRef.value)?.focus();
  },
  blur: () => {
    (inputRef.value ?? textareaRef.value)?.blur();
  },
  resizeTextarea,
  ref: computed(() => inputRef.value ?? textareaRef.value),
});
</script>

<style lang="scss">
@use './style.scss';
</style>
