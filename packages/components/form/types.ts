export interface FormProps {
  model?: Record<string, any>;
  rules?: Record<string, FormItemRule | FormItemRule[]>;
  labelWidth?: string | number;
  labelPosition?: 'left' | 'right' | 'top';
  inline?: boolean;
  disabled?: boolean;
  /** Form 级别默认校验触发方式 */
  validateTrigger?: 'blur' | 'change';
}

export interface FormItemProps {
  prop?: string;
  label?: string;
  labelWidth?: string | number;
  required?: boolean;
  error?: string;
  /** 覆盖 Form 级别的 rules */
  rules?: FormItemRule | FormItemRule[];
}

export interface FormItemRule {
  /** 是否必填 */
  required?: boolean;
  /** 错误提示消息 */
  message?: string;
  /** 校验触发方式 */
  trigger?: 'blur' | 'change';
  /** 最小长度/值 */
  min?: number;
  /** 最大长度/值 */
  max?: number;
  /** 正则表达式 */
  pattern?: RegExp | string;
  /** 内置校验类型（基于 async-validator） */
  type?: 'string' | 'number' | 'boolean' | 'integer' | 'float' | 'array'
    | 'object' | 'enum' | 'date' | 'url' | 'email' | 'any';
  /** 枚举值（配合 type: 'enum' 使用） */
  enum?: any[];
  /** 字段数组长度 */
  len?: number;
  /** 自定义校验器（支持 Promise） */
  validator?: (rule: FormItemRule, value: any, callback: (error?: Error) => void) => void | Promise<void>;
  /** 是否忽略空白字符 */
  whitespace?: boolean;
}

export interface FormInstance {
  validate: (callback?: (valid: boolean, fields?: Record<string, any>) => void) => Promise<boolean>;
  validateField: (prop: string | string[], callback?: (valid: boolean) => void) => Promise<boolean>;
  resetFields: (props?: string | string[]) => void;
  clearValidate: (props?: string | string[]) => void;
}

export interface FormItemContext {
  prop: string;
  validate: (trigger?: string) => Promise<boolean>;
  resetField: () => void;
  clearValidate: () => void;
}
