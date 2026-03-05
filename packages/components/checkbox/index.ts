import Checkbox from './Checkbox.vue';
import CheckboxGroup from './CheckboxGroup.vue';
import { withInstall } from '@x-design/utils';

export const XCheckbox = withInstall(Checkbox);
export const XCheckboxGroup = withInstall(CheckboxGroup);
export default XCheckbox;

export type { CheckboxProps, CheckboxGroupProps, CheckboxValue } from './types';
