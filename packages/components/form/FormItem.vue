<template>
  <div ref="formItemRef" :class="formItemClasses">
    <label v-if="label || $slots.label" :class="labelClasses" :style="labelStyle">
      <slot name="label">
        <span v-if="isRequired && !hideAsterisk" class="x-form-item__required">*</span>
        {{ label }}{{ labelSuffix }}
      </slot>
    </label>
    <div class="x-form-item__content">
      <div class="x-form-item__field">
        <slot />
      </div>
      <Transition name="x-form-error-fade">
        <div v-if="shouldShowMessage && validateState === 'error'" :class="errorClasses">
          {{ validateMessage }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onBeforeUnmount, provide, ref, watch } from 'vue';
import Schema from 'async-validator';
import type { FormItemProps, FormItemRule, FormContext, FormItemContext } from './types';

defineOptions({
  name: 'XFormItem',
});

const props = withDefaults(defineProps<FormItemProps>(), {
  required: false,
  showMessage: true,
  inlineMessage: false,
});

const formContext = inject<FormContext | null>('xForm', null);

const formItemRef = ref<HTMLElement>();
const validateState = ref<'' | 'success' | 'error' | 'validating'>('');
const validateMessage = ref('');
const initialValue = ref<any>();

provide('xFormItem', { validateState, validate });

const labelSuffix = computed(() => formContext?.props.labelSuffix ?? '');
const hideAsterisk = computed(() => formContext?.props.hideRequiredAsterisk ?? false);
const shouldShowMessage = computed(() => props.showMessage);

const formItemClasses = computed(() => [
  'x-form-item',
  {
    'is-error': validateState.value === 'error',
    'is-required': isRequired.value,
    'is-validating': validateState.value === 'validating',
  },
]);

const labelClasses = computed(() => ['x-form-item__label']);

const errorClasses = computed(() => [
  'x-form-item__error',
  {
    'x-form-item__error--inline': props.inlineMessage,
  },
]);

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

// --- Nested prop path utilities ---

const getNestedValue = (obj: Record<string, any>, path: string): any => {
  const keys = path.split('.');
  let current: any = obj;
  for (const key of keys) {
    if (current == null) return undefined;
    current = current[key];
  }
  return current;
};

const setNestedValue = (obj: Record<string, any>, path: string, value: any): void => {
  const keys = path.split('.');
  let current: any = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current[keys[i]] == null) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
};

const fieldValue = computed(() => {
  if (!formContext || !props.prop) return undefined;
  return getNestedValue(formContext.props.model ?? {}, props.prop);
});

const getRules = (): FormItemRule[] => {
  // FormItem 自身的 rules 优先
  if (props.rules) {
    return Array.isArray(props.rules) ? props.rules : [props.rules];
  }
  if (!formContext || !props.prop) return [];
  const formRules = formContext.props.rules?.[props.prop];
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
function validate(trigger?: string): Promise<boolean> {
  if (!props.prop) return Promise.resolve(true);

  const rules = getFilteredRules(trigger);

  if (rules.length === 0) {
    validateState.value = '';
    return Promise.resolve(true);
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
            (result as Promise<void>)
              .then(() => cb())
              .catch((err: any) => {
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

  return validator.validate({ [props.prop]: fieldValue.value }).then(
    () => {
      validateState.value = 'success';
      validateMessage.value = '';
      return true;
    },
    (errResult: any) => {
      const { errors } = errResult;
      validateState.value = 'error';
      validateMessage.value = errors?.[0]?.message || '校验失败';
      throw new Error(validateMessage.value);
    }
  );
}

const resetField = () => {
  validateState.value = '';
  validateMessage.value = '';
  if (formContext && props.prop && initialValue.value !== undefined) {
    const restored = JSON.parse(JSON.stringify(initialValue.value));
    setNestedValue(formContext.props.model ?? {}, props.prop, restored);
  }
};

const clearValidate = () => {
  validateState.value = '';
  validateMessage.value = '';
};

// Bug 3: watch error prop
watch(
  () => props.error,
  (val) => {
    if (val) {
      validateState.value = 'error';
      validateMessage.value = val;
    } else {
      validateState.value = '';
      validateMessage.value = '';
    }
  }
);

// 值变化时触发 change 校验
watch(
  () => fieldValue.value,
  () => {
    // 如果 error prop 处于激活状态，不触发自动校验
    if (props.error) return;
    const rules = getFilteredRules('change');
    if (rules.length > 0) {
      validate('change').catch(() => {});
    }
  }
);

// Bug 1: 用同一个引用变量，确保 removeField 能正确移除
let fieldContext: FormItemContext | null = null;

onMounted(() => {
  if (props.prop) {
    // Bug 2: 深拷贝初始值
    const val = fieldValue.value;
    initialValue.value = val != null ? JSON.parse(JSON.stringify(val)) : val;

    fieldContext = {
      prop: props.prop,
      validate,
      resetField,
      clearValidate,
      get el() {
        return formItemRef.value;
      },
    };
    formContext?.addField(fieldContext);
  }
});

onBeforeUnmount(() => {
  if (fieldContext) {
    formContext?.removeField(fieldContext);
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
