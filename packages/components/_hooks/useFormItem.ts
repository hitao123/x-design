import { computed, inject } from 'vue';
import type { Ref } from 'vue';
import type { FormContext } from '../form/types';

export interface FormItemContext {
  validateState: Ref<'' | 'success' | 'error' | 'validating'>;
  validate?: (trigger?: string) => Promise<boolean>;
}

export function useFormItem() {
  const formContext = inject<FormContext | null>('xForm', null);
  const formItemContext = inject<FormItemContext | null>('xFormItem', null);

  const validateState = computed(() => formItemContext?.validateState.value ?? '');
  const isFormDisabled = computed(() => formContext?.props.disabled ?? false);
  const formSize = computed(() => formContext?.props.size);

  const triggerValidation = (trigger: 'blur' | 'change') => {
    formItemContext?.validate?.(trigger);
  };

  return { validateState, isFormDisabled, formSize, triggerValidation };
}
