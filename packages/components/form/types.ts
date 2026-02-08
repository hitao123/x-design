export interface FormProps {
  model?: Record<string, any>;
  rules?: Record<string, FormItemRule[]>;
  labelWidth?: string | number;
  labelPosition?: 'left' | 'right' | 'top';
  inline?: boolean;
  disabled?: boolean;
}

export interface FormItemProps {
  prop?: string;
  label?: string;
  labelWidth?: string | number;
  required?: boolean;
  error?: string;
}

export interface FormItemRule {
  required?: boolean;
  message?: string;
  trigger?: 'blur' | 'change';
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (rule: FormItemRule, value: any, callback: (error?: Error) => void) => void;
}

export interface FormInstance {
  validate: (callback?: (valid: boolean, fields?: Record<string, any>) => void) => Promise<boolean>;
  validateField: (prop: string, callback?: (valid: boolean) => void) => Promise<boolean>;
  resetFields: () => void;
  clearValidate: (props?: string | string[]) => void;
}
