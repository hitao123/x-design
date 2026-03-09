<template>
  <form :class="formClasses" @submit.prevent>
    <slot />
  </form>
</template>

<script setup lang="ts">
import { computed, provide, reactive } from 'vue';
import type { FormProps, FormContext, FormItemContext } from './types';

defineOptions({
  name: 'XForm',
});

const props = withDefaults(defineProps<FormProps>(), {
  model: () => ({}),
  rules: () => ({}),
  labelPosition: 'right',
  inline: false,
  disabled: false,
  validateTrigger: 'change',
  labelSuffix: '',
  hideRequiredAsterisk: false,
  size: 'medium',
});

const formClasses = computed(() => [
  'x-form',
  `x-form--label-${props.labelPosition}`,
  {
    'x-form--inline': props.inline,
  },
]);

const fields = reactive<FormItemContext[]>([]);

const addField = (field: FormItemContext) => {
  fields.push(field);
};

const removeField = (field: FormItemContext) => {
  const index = fields.indexOf(field);
  if (index > -1) {
    fields.splice(index, 1);
  }
};

const getFilteredFields = (props?: string | string[]): FormItemContext[] => {
  if (!props) return fields;
  const propsArray = Array.isArray(props) ? props : [props];
  return fields.filter((f) => propsArray.includes(f.prop));
};

const validate = async (
  callback?: (valid: boolean, fields?: Record<string, string[]>) => void
): Promise<boolean> => {
  const results = await Promise.allSettled(fields.map((field) => field.validate()));

  const errorMap: Record<string, string[]> = {};
  let isValid = true;

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      isValid = false;
      const prop = fields[index].prop;
      const message =
        result.reason instanceof Error ? result.reason.message : String(result.reason);
      if (!errorMap[prop]) {
        errorMap[prop] = [];
      }
      errorMap[prop].push(message);
    }
  });

  if (isValid) {
    callback?.(true);
    return true;
  } else {
    callback?.(false, errorMap);
    return Promise.reject(errorMap);
  }
};

const validateField = async (
  prop: string | string[],
  callback?: (valid: boolean) => void
): Promise<boolean> => {
  const targetFields = getFilteredFields(prop);
  if (targetFields.length === 0) {
    callback?.(true);
    return true;
  }
  try {
    await Promise.all(targetFields.map((f) => f.validate()));
    callback?.(true);
    return true;
  } catch {
    callback?.(false);
    return false;
  }
};

const resetFields = (props?: string | string[]) => {
  const targetFields = getFilteredFields(props);
  targetFields.forEach((field) => field.resetField());
};

const clearValidate = (props?: string | string[]) => {
  const targetFields = getFilteredFields(props);
  targetFields.forEach((field) => field.clearValidate());
};

const scrollToField = (prop: string) => {
  const targetField = fields.find((f) => f.prop === prop);
  if (targetField?.el) {
    targetField.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

provide<FormContext>('xForm', {
  props,
  addField,
  removeField,
});

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
  scrollToField,
});
</script>

<style lang="scss">
@use './style.scss';
</style>
