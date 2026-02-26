import ConfigProvider from './ConfigProvider.vue';
import { withInstall } from '@x-design/utils';

export const XConfigProvider = withInstall(ConfigProvider);
export default XConfigProvider;

export type { ConfigProviderProps } from './types';
export { CONFIG_PROVIDER_KEY } from './types';
