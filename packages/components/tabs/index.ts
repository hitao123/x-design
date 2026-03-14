import Tabs from './Tabs.vue';
import TabPane from './TabPane.vue';
import { withInstall } from '@x-design/utils';

export const XTabs = withInstall(Tabs);
export const XTabPane = withInstall(TabPane);
export default XTabs;

export type { TabsProps, TabPaneProps, TabType, TabPosition } from './types';
