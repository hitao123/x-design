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
import Schema from 'async-validator';
import type { FormItemProps, FormItemRule } from './types';

defineOptions({
  name: 'XFormItem',
});

const props = withDefaults(defineProps<FormItemProps>(), {
  required: false,
});

const formContext = inject<any>('xForm', null);

const validateState = ref<'' | 'success' | 'error' | 'validating'>('');
const validateMessage = ref('');
const initialValue = ref<any>();

const formItemClasses = computed(() => [
  'x-form-item',
  {
    'is-error': validateState.value === 'error',
    'is-required': isRequired.value,
    'is-validating': validateState.value === 'validating',
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
  // FormItem 自身的 rules 优先
  if (props.rules) {
    return Array.isArray(props.rules) ? props.rules : [props.rules];
  }
  if (!formContext || !props.prop) return [];
  const formRules = formContext.props.rules[props.prop];
  if (!formRules) return [];
  return Array.isArray(formRules) ? formRules : [formRules];
};

const getFilteredRules = (trigger?: string): FormItemRule[] => {
  const rules = getRules();
  if (!trigger) return rules;

  // 获取 Form 级别的默认 trigger
  const defaultTrigger = formContext?.props.validateTrigger || 'change';

  return rules.filter((rule) => {
    const ruleTrigger = rule.trigger || defaultTrigger;
    return ruleTrigger === trigger;
  });
};

/**
 * 使用 async-validator 进行校验
 */
const validate = async (trigger?: string): Promise<boolean> => {
  if (!props.prop) return true;

  const rules = getFilteredRules(trigger);

  if (rules.length === 0) {
    validateState.value = '';
    return true;
  }

  validateState.value = 'validating';
  validateMessage.value = '';

  // 转换为 async-validator 的描述符格式
  const descriptor: Record<string, any> = {
    [props.prop]: rules.map((rule) => {
      const avRule: any = { ...rule };

      // 如果有自定义 validator 且是 Promise 风格，适配 async-validator 的 asyncValidator
      if (rule.validator) {
        const originalValidator = rule.validator;
        avRule.validator = (r: any, v: any, cb: (error?: Error) => void) => {
          const result = originalValidator(r, v, cb);
          // 支持 Promise 返回值
          if (result && typeof (result as any).then === 'function') {
            (result as Promise<void>).then(() => cb()).catch((err: any) => {
              cb(err instanceof Error ? err : new Error(err?.message || String(err)));
            });
          }
        };
      }

      // 将 RegExp 字符串转为 RegExp 对象
      if (typeof avRule.pattern === 'string') {
        avRule.pattern = new RegExp(avRule.pattern);
      }

      return avRule;
    }),
  };

  const validator = new Schema(descriptor);

  try {
    await validator.validate({ [props.prop]: fieldValue.value });
    validateState.value = 'success';
    validateMessage.value = '';
    return true;
  } catch (errResult: any) {
    const { errors } = errResult;
    validateState.value = 'error';
    validateMessage.value = errors?.[0]?.message || '校验失败';
    throw new Error(validateMessage.value);
  }
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

// 值变化时触发 change 校验
watch(
  () => fieldValue.value,
  () => {
    const rules = getFilteredRules('change');
    if (rules.length > 0) {
      validate('change').catch(() => {});
    }
  },
);

onMounted(() => {
  if (props.prop) {
    // 深拷贝初始值
    const val = fieldValue.value;
    initialValue.value = Array.isArray(val) ? [...val] : (typeof val === 'object' && val !== null ? { ...val } : val);

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
  validateState,
  validateMessage,
});
</script>
