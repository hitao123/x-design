import Radio from './Radio.vue';
import RadioGroup from './RadioGroup.vue';
import { withInstall } from '@x-design/utils';

export const XRadio = withInstall(Radio);
export const XRadioGroup = withInstall(RadioGroup);
export default XRadio;

export type { RadioProps, RadioGroupProps, RadioValue } from './types';
