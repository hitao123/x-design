import Table from './Table.vue';
import { withInstall } from '@x-design/utils';

export const XTable = withInstall(Table);
export default XTable;

export type { TableProps, TableColumn } from './types';
