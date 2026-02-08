<template>
  <form :class="formClasses" @submit.prevent>
    <slot />
  </form>
</template>

<script setup lang="ts">
import { computed, provide, reactive } from 'vue';
import type { FormProps, FormItemRule } from './types';

defineOptions({
  name: 'XForm',
});

const props = withDefaults(defineProps<FormProps>(), {
  model: () => ({}),
  rules: () => ({}),
  labelPosition: 'right',
  inline: false,
  disabled: false,
});

const formClasses = computed(() => [
  'x-form',
  `x-form--label-${props.labelPosition}`,
  {
    'x-form--inline': props.inline,
  },
]);

const fields = reactive<any[]>([]);

const addField = (field: any) => {
  fields.push(field);
};

const removeField = (field: any) => {
  const index = fields.indexOf(field);
  if (index > -1) {
    fields.splice(index, 1);
  }
};

const validate = async (callback?: (valid: boolean, fields?: Record<string, any>) => void): Promise<boolean> => {
  const promises = fields.map((field) => field.validate());
  try {
    await Promise.all(promises);
    callback?.(true);
    return true;
  } catch (errors) {
    callback?.(false, errors);
    return false;
  }
};

const validateField = async (prop: string, callback?: (valid: boolean) => void): Promise<boolean> => {
  const field = fields.find((f) => f.prop === prop);
  if (!field) {
    callback?.(true);
    return true;
  }
  try {
    await field.validate();
    callback?.(true);
    return true;
  } catch (error) {
    callback?.(false);
    return false;
  }
};

const resetFields = () => {
  fields.forEach((field) => field.resetField());
};

const clearValidate = (props?: string | string[]) => {
  if (!props) {
    fields.forEach((field) => field.clearValidate());
  } else {
    const propsArray = Array.isArray(props) ? props : [props];
    fields.forEach((field) => {
      if (propsArray.includes(field.prop)) {
        field.clearValidate();
      }
    });
  }
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
@import './style.scss';
</style>
