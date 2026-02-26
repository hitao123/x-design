import Table from './Table.vue';
import { withInstall } from '@x-design/utils';

export const XTable = withInstall(Table);
export default XTable;

export type { TableProps, TableColumn, SortState, SortOrder, FilterState, TablePagination } from './types';
