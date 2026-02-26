<template>
  <form :class="formClasses" @submit.prevent>
    <slot />
  </form>
</template>

<script setup lang="ts">
import { computed, provide, reactive } from 'vue';
import type { FormProps, FormItemContext } from './types';

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

const validate = async (callback?: (valid: boolean, fields?: Record<string, any>) => void): Promise<boolean> => {
  const promises = fields.map((field) => field.validate());
  try {
    await Promise.all(promises);
    callback?.(true);
    return true;
  } catch (errors) {
    callback?.(false, errors as any);
    return false;
  }
};

const validateField = async (prop: string | string[], callback?: (valid: boolean) => void): Promise<boolean> => {
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

provide('xForm', {
  props,
  addField,
  removeField,
});

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate,
});
</script>

<style lang="scss">
@use './style.scss';
</style>
