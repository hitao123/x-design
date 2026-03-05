import type { Ref } from 'vue';

export type CheckboxValue = string | number;

export interface CheckboxProps {
  modelValue?: boolean;
  label?: CheckboxValue;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: 'small' | 'medium' | 'large';
  name?: string;
}

export interface CheckboxGroupProps {
  modelValue?: CheckboxValue[];
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  min?: number;
  max?: number;
}

export interface CheckboxGroupContext {
  modelValue: Ref<CheckboxValue[]>;
  disabled: Ref<boolean>;
  size: Ref<'small' | 'medium' | 'large'>;
  min: Ref<number>;
  max: Ref<number>;
  changeEvent: (value: CheckboxValue[]) => void;
}
