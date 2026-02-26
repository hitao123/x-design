import Form from './Form.vue';
import FormItem from './FormItem.vue';
import { withInstall } from '@x-design/utils';

export const XForm = withInstall(Form);
export const XFormItem = withInstall(FormItem);

export default XForm;

export type { FormProps, FormItemProps, FormItemRule, FormInstance, FormItemContext } from './types';
