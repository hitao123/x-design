import Select from './Select.vue';
import { withInstall } from '@x-design/utils';

export const XSelect = withInstall(Select);
export default XSelect;

export type { SelectProps, SelectOption } from './types';
