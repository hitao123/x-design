import { computed, inject } from 'vue';
import type { Ref } from 'vue';

export interface FormItemContext {
  validateState: Ref<'' | 'success' | 'error' | 'validating'>;
}

export function useFormItem() {
  const formItemContext = inject<FormItemContext | null>('xFormItem', null);
  const validateState = computed(() => formItemContext?.validateState.value ?? '');
  return { validateState };
}
