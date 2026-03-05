import type { Ref } from 'vue';

export type RadioValue = string | number | boolean;

export interface RadioProps {
  modelValue?: RadioValue;
  label?: RadioValue;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  name?: string;
}

export interface RadioGroupProps {
  modelValue?: RadioValue;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  name?: string;
}

export interface RadioGroupContext {
  modelValue: Ref<RadioValue | undefined>;
  disabled: Ref<boolean>;
  size: Ref<'small' | 'medium' | 'large'>;
  name: Ref<string | undefined>;
  changeEvent: (value: RadioValue) => void;
}
