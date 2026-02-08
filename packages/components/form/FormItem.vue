<template>
  <div :class="formItemClasses">
    <label v-if="label || $slots.label" :class="labelClasses" :style="labelStyle">
      <slot name="label">
        <span v-if="isRequired" class="x-form-item__required">*</span>
        {{ label }}
      </slot>
    </label>
    <div class="x-form-item__content">
      <div class="x-form-item__field">
        <slot />
      </div>
      <Transition name="x-form-error-fade">
        <div v-if="validateState === 'error'" class="x-form-item__error">
          {{ validateMessage }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onBeforeUnmount, ref, watch } from 'vue';
import type { FormItemProps, FormItemRule } from './types';

defineOptions({
  name: 'XFormItem',
});

const props = withDefaults(defineProps<FormItemProps>(), {
  required: false,
});

const formContext = inject<any>('xForm', null);

const validateState = ref<'' | 'success' | 'error'>('');
const validateMessage = ref('');
const initialValue = ref<any>();

const formItemClasses = computed(() => [
  'x-form-item',
  {
    'is-error': validateState.value === 'error',
    'is-required': isRequired.value,
  },
]);

const labelClasses = computed(() => ['x-form-item__label']);

const labelStyle = computed(() => {
  const width = props.labelWidth || formContext?.props.labelWidth;
  if (width) {
    return {
      width: typeof width === 'number' ? `${width}px` : width,
    };
  }
  return {};
});

const isRequired = computed(() => {
  if (props.required) return true;
  const rules = getRules();
  return rules.some((rule) => rule.required);
});

const fieldValue = computed(() => {
  if (!formContext || !props.prop) return undefined;
  return formContext.props.model[props.prop];
});

const getRules = (): FormItemRule[] => {
  if (!formContext || !props.prop) return [];
  return formContext.props.rules[props.prop] || [];
};

const validate = async (trigger?: string): Promise<boolean> => {
  if (!props.prop) return true;

  const rules = getRules().filter((rule) => {
    if (!trigger) return true;
    return !rule.trigger || rule.trigger === trigger;
  });

  if (rules.length === 0) {
    validateState.value = '';
    return true;
  }

  validateState.value = '';
  validateMessage.value = '';

  for (const rule of rules) {
    try {
      await validateRule(rule, fieldValue.value);
    } catch (error: any) {
      validateState.value = 'error';
      validateMessage.value = error.message;
      throw error;
    }
  }

  validateState.value = 'success';
  return true;
};

const validateRule = (rule: FormItemRule, value: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (rule.required && (value === undefined || value === null || value === '')) {
      reject(new Error(rule.message || '此项为必填项'));
      return;
    }

    if (rule.min !== undefined && String(value).length < rule.min) {
      reject(new Error(rule.message || `长度不能少于${rule.min}个字符`));
      return;
    }

    if (rule.max !== undefined && String(value).length > rule.max) {
      reject(new Error(rule.message || `长度不能超过${rule.max}个字符`));
      return;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      reject(new Error(rule.message || '格式不正确'));
      return;
    }

    if (rule.validator) {
      rule.validator(rule, value, (error?: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
      return;
    }

    resolve();
  });
};

const resetField = () => {
  validateState.value = '';
  validateMessage.value = '';
  if (formContext && props.prop && initialValue.value !== undefined) {
    formContext.props.model[props.prop] = initialValue.value;
  }
};

const clearValidate = () => {
  validateState.value = '';
  validateMessage.value = '';
};

watch(
  () => fieldValue.value,
  () => {
    if (validateState.value === 'error') {
      validate('change');
    }
  }
);

onMounted(() => {
  if (props.prop) {
    initialValue.value = fieldValue.value;
    formContext?.addField({
      prop: props.prop,
      validate,
      resetField,
      clearValidate,
    });
  }
});

onBeforeUnmount(() => {
  if (props.prop) {
    formContext?.removeField({
      prop: props.prop,
      validate,
      resetField,
      clearValidate,
    });
  }
});

defineExpose({
  validate,
  resetField,
  clearValidate,
});
</script>
