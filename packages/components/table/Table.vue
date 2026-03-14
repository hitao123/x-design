<template>
  <div :class="wrapperClasses">
    <div v-if="loading" class="x-table__loading">
      <span>加载中...</span>
    </div>
    <div ref="containerRef" :class="containerClasses" :style="containerStyle">
      <table class="x-table__element" :style="tableStyle">
        <colgroup>
          <col
            v-for="(column, columnIndex) in columns"
            :key="column.prop || columnIndex"
            :style="columnHelpers.getColStyle(column)"
          />
        </colgroup>
        <thead v-if="showHeader" class="x-table__header">
          <tr>
            <th
              v-for="(column, columnIndex) in columns"
              :key="column.prop || columnIndex"
              :class="columnHelpers.getHeaderClass(column)"
              :style="columnHelpers.getFixedStyle(column, true)"
            >
              <div class="x-table__cell-content">
                <template v-if="column.type === 'selection'">
                  <XCheckbox
                    :model-value="headerSelectionState.allSelected"
                    :indeterminate="headerSelectionState.indeterminate"
                    @change="onSelectAll"
                  />
                </template>
                <template v-else-if="column.type === 'index'">
                  {{ column.label || '#' }}
                </template>
                <template v-else-if="column.type === 'expand'">
                  {{ column.label || '' }}
                </template>
                <template v-else-if="column.slots?.header">
                  <slot :name="column.slots.header" :column="column" />
                </template>
                <template v-else>
                  <span>{{ column.label }}</span>
                  <span v-if="column.sortable" class="x-table__sort-icons" @click="onSort(column)">
                    <i
                      class="x-table__sort-icon x-table__sort-icon--asc"
                      :class="{
                        'is-active':
                          sorter.sortState.value.prop === column.prop &&
                          sorter.sortState.value.order === 'ascending',
                      }"
                      ><IconArrowUp
                    /></i>
                    <i
                      class="x-table__sort-icon x-table__sort-icon--desc"
                      :class="{
                        'is-active':
                          sorter.sortState.value.prop === column.prop &&
                          sorter.sortState.value.order === 'descending',
                      }"
                      ><IconArrowDown
                    /></i>
                  </span>
                  <TableFilter
                    v-if="column.prop && column.filters && column.filters.length > 0"
                    :filters="column.filters"
                    :filter-multiple="column.filterMultiple !== false"
                    :active-values="filter.getFilterValues(column.prop)"
                    @filter="(values: any[]) => onFilter(column.prop!, values)"
                  />
                </template>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="x-table__body">
          <template v-for="(row, rowIndex) in displayData" :key="getRowKey(row, rowIndex)">
            <tr :class="getRowClass(row, rowIndex)" @click="handleRowClick(row, rowIndex)">
              <td
                v-for="(column, columnIndex) in columns"
                :key="column.prop || columnIndex"
                :class="getCellClass(row, column, rowIndex, columnIndex)"
                :style="columnHelpers.getFixedStyle(column)"
              >
                <template v-if="column.type === 'selection'">
                  <XCheckbox
                    :model-value="selection.isRowSelected(row)"
                    @change="(checked: boolean) => onSelectRow(row, checked)"
                    @click.stop
                  />
                </template>
                <template v-else-if="column.type === 'index'">
                  {{ paginatedRowIndex(rowIndex) }}
                </template>
                <template v-else-if="column.type === 'expand'">
                  <span
                    class="x-table__expand-icon"
                    :class="{ 'is-expanded': expand.isRowExpanded(row) }"
                    @click.stop="onExpandRow(row)"
                    ><IconArrowRight
                  /></span>
                </template>
                <template
                  v-else-if="
                    column.prop &&
                    tree.hasTreeChildren(row) &&
                    columnIndex === tree.getTreeColumnIndex(columns)
                  "
                >
                  <div
                    class="x-table__tree-cell"
                    :style="{ paddingLeft: `${tree.getTreeLevel(row) * 20}px` }"
                  >
                    <span
                      class="x-table__expand-icon"
                      :class="{ 'is-expanded': expand.isRowExpanded(row) }"
                      @click.stop="onExpandRow(row)"
                      ><IconArrowRight
                    /></span>
                    <span>{{ columnHelpers.getCellValue(row, column, rowIndex) }}</span>
                  </div>
                </template>
                <template v-else-if="column.render">
                  <component :is="renderColumn(column, row, rowIndex)" />
                </template>
                <template v-else-if="column.slots?.default">
                  <slot
                    :name="column.slots.default"
                    v-bind="{ row, column, rowIndex, index: rowIndex }"
                  />
                </template>
                <template v-else>
                  <span
                    :title="
                      showOverflowTooltip
                        ? String(columnHelpers.getCellValue(row, column, rowIndex) ?? '')
                        : undefined
                    "
                  >
                    {{ columnHelpers.getCellValue(row, column, rowIndex) }}
                  </span>
                </template>
              </td>
            </tr>
            <tr
              v-if="columnHelpers.hasExpandColumn() && expand.isRowExpanded(row)"
              class="x-table__expand-row"
            >
              <td :colspan="columns.length">
                <slot name="expand" :row="row" :$index="rowIndex" />
              </td>
            </tr>
          </template>
          <tr v-if="!displayData || displayData.length === 0" class="x-table__empty">
            <td :colspan="columns?.length || 0">
              <slot name="empty">
                <div class="x-table__empty-text">{{ emptyText || '暂无数据' }}</div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="hasPagination" class="x-table__pagination">
      <XPagination
        :current="currentPage"
        :page-size="pageSize"
        :total="paginationTotal"
        :page-sizes="paginationConfig?.pageSizes"
        :layout="paginationConfig?.layout || 'total, prev, pager, next'"
        :small="paginationConfig?.small"
        :pager-count="paginationConfig?.pagerCount"
        :hide-on-single-page="paginationConfig?.hideOnSinglePage"
        :disabled="paginationConfig?.disabled"
        @current-change="handlePageChange"
        @size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  type VNode,
} from 'vue';
import { IconArrowDown, IconArrowRight, IconArrowUp } from '@x-design/icons';
import { XCheckbox } from '../checkbox';
import { XPagination } from '../pagination';
import { useColumns } from './composables/useColumns';
import { useExpand } from './composables/useExpand';
import { useFilter } from './composables/useFilter';
import { useSelection } from './composables/useSelection';
import { useSorter } from './composables/useSorter';
import { useTree } from './composables/useTree';
import TableFilter from './TableFilter.vue';
import type { SortOrder, TableColumn, TablePagination, TableProps, TableRowKey } from './types';

defineOptions({
  name: 'XTable',
});

const props = withDefaults(defineProps<TableProps>(), {
  data: () => [],
  columns: () => [],
  border: false,
  stripe: false,
  size: 'medium',
  showHeader: true,
  highlightCurrentRow: false,
  loading: false,
  showOverflowTooltip: false,
  defaultExpandAll: false,
  tableLayout: 'auto',
});

const emit = defineEmits<{
  rowClick: [row: any, index: number];
  selectionChange: [selection: any[]];
  sortChange: [sortState: { prop: string; order: SortOrder }];
  expandChange: [row: any, expanded: boolean, expandedRowKeys: TableRowKey[]];
  filterChange: [filters: Record<string, any[]>];
  paginationChange: [current: number, pageSize: number];
  'update:expandRowKeys': [expandedRowKeys: TableRowKey[]];
}>();

const containerRef = ref<HTMLElement>();
const currentRow = ref<any>(null);

const normalizedPagination = computed<TablePagination | null>(() => {
  if (props.pagination && typeof props.pagination === 'object') {
    return props.pagination;
  }
  return null;
});

const paginationConfig = computed(() => normalizedPagination.value);
const hasPagination = computed(() => !!props.pagination);
const isServerPagination = computed(() => normalizedPagination.value?.total !== undefined);

const columnHelpers = useColumns(() => props.columns);

const normalizeRowKey = (key: unknown, fallback: number): TableRowKey => {
  if (typeof key === 'string' || typeof key === 'number') {
    return key;
  }
  return fallback;
};

const allDataRows = ref<any[]>([]);

const resolveFallbackRowIndex = (row: any, index: number) => {
  const sourceIndex = allDataRows.value.indexOf(row);
  if (sourceIndex >= 0) {
    return sourceIndex;
  }
  return index;
};

const getRowKeyValue = (row: any, index: number): TableRowKey => {
  const fallback = resolveFallbackRowIndex(row, index);

  if (typeof props.rowKey === 'function') {
    return normalizeRowKey(props.rowKey(row), fallback);
  }

  if (typeof props.rowKey === 'string') {
    return normalizeRowKey(row?.[props.rowKey], fallback);
  }

  return fallback;
};

const getRowKey = (row: any, index: number) => getRowKeyValue(row, index);

const expand = useExpand(getRowKeyValue, () => props.expandRowKeys);
const tree = useTree(
  () => props.treeProps,
  (row) => expand.isRowExpanded(row)
);

const collectAllDataRows = () => {
  allDataRows.value = props.treeProps ? tree.flattenAllRows(props.data) : props.data;
};

collectAllDataRows();

const selection = useSelection(() => allDataRows.value, getRowKeyValue);
const sorter = useSorter(
  () => props.data,
  () => props.columns,
  props.defaultSort
);
const filter = useFilter(
  () => sorter.sortedData.value,
  () => props.columns
);

const currentPage = ref(normalizedPagination.value?.current || 1);
const pageSize = ref(normalizedPagination.value?.pageSize || 10);

const processedData = computed(() => {
  let data = filter.filteredData.value;

  if (props.treeProps) {
    data = tree.flattenTreeData(data);
  }

  return data;
});

const paginationTotal = computed(() => {
  if (normalizedPagination.value?.total !== undefined) {
    return normalizedPagination.value.total;
  }
  return processedData.value.length;
});

const totalPages = computed(() => Math.max(1, Math.ceil(paginationTotal.value / pageSize.value)));

const displayData = computed(() => {
  if (!hasPagination.value || isServerPagination.value) {
    return processedData.value;
  }

  const start = (currentPage.value - 1) * pageSize.value;
  return processedData.value.slice(start, start + pageSize.value);
});

const headerSelectionState = computed(() => selection.getSelectionState(displayData.value));

const paginatedRowIndex = (rowIndex: number) => {
  if (hasPagination.value) {
    return (currentPage.value - 1) * pageSize.value + rowIndex + 1;
  }
  return rowIndex + 1;
};

const wrapperClasses = computed(() => [
  'x-table',
  `x-table--${props.size}`,
  {
    'x-table--border': props.border,
    'x-table--stripe': props.stripe,
    'x-table--loading': props.loading,
  },
]);

const containerStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.height) {
    style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
    style.overflowY = 'auto';
  }
  if (props.maxHeight) {
    style.maxHeight =
      typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight;
    style.overflowY = 'auto';
  }
  return style;
});

const scrollState = reactive({ left: false, right: false });

const containerClasses = computed(() => [
  'x-table__container',
  {
    'is-scrolling-left': scrollState.left,
    'is-scrolling-right': scrollState.right,
  },
]);

const tableStyle = computed(() => {
  const style: Record<string, string> = {
    tableLayout: props.tableLayout,
  };
  const minWidth = columnHelpers.getTableMinWidth();
  if (minWidth) {
    style.minWidth = minWidth;
  }
  return style;
});

const handleScroll = () => {
  const el = containerRef.value;
  if (!el) return;
  const { scrollLeft, scrollWidth, clientWidth } = el;
  scrollState.left = scrollLeft > 0;
  scrollState.right = scrollLeft + clientWidth < scrollWidth - 1;
};

const getCellClass = (row: any, column: TableColumn, rowIndex: number, columnIndex: number) => {
  const classes: any[] = [
    'x-table__cell',
    column.align ? `x-table__cell--${column.align}` : '',
    {
      'is-fixed-left': column.fixed === 'left',
      'is-fixed-right': column.fixed === 'right',
    },
  ];
  if (typeof props.cellClassName === 'function') {
    const c = props.cellClassName(row, column, rowIndex, columnIndex);
    if (c) classes.push(c);
  } else if (typeof props.cellClassName === 'string') {
    classes.push(props.cellClassName);
  }
  return classes;
};

const getRowClass = (row: any, index: number) => {
  const classes: any[] = [
    'x-table__row',
    {
      'x-table__row--striped': props.stripe && index % 2 === 1,
      'x-table__row--current': props.highlightCurrentRow && currentRow.value === row,
      'x-table__row--selected': selection.isRowSelected(row),
    },
  ];
  if (typeof props.rowClassName === 'function') {
    const c = props.rowClassName(row, index);
    if (c) classes.push(c);
  } else if (typeof props.rowClassName === 'string') {
    classes.push(props.rowClassName);
  }
  return classes;
};

const renderColumn = (column: TableColumn, row: any, index: number): VNode | string => {
  if (column.render) {
    return column.render({ row, column, $index: index }) as VNode | string;
  }
  return '';
};

const emitSelectionChange = () => {
  emit('selectionChange', selection.selectedRows.value);
};

const emitFilterChange = () => {
  emit('filterChange', { ...filter.filterState.value });
};

const emitPaginationChange = () => {
  emit('paginationChange', currentPage.value, pageSize.value);
};

const handleRowClick = (row: any, index: number) => {
  if (props.highlightCurrentRow) currentRow.value = row;
  emit('rowClick', row, index);
};

const onSelectAll = (checked: boolean) => {
  selection.handleSelectAll(checked, displayData.value);
  emitSelectionChange();
};

const onSelectRow = (row: any, checked?: boolean) => {
  selection.handleSelectRow(row, checked);
  emitSelectionChange();
};

const onSort = (column: TableColumn) => {
  const state = sorter.handleSort(column);
  emit('sortChange', state);
};

const onExpandRow = (row: any) => {
  const { expanded, rowKeys } = expand.toggleRowExpand(row);
  if (expand.isControlled) {
    emit('update:expandRowKeys', rowKeys);
  }
  emit('expandChange', row, expanded, rowKeys);
};

const onFilter = (prop: string, values: any[]) => {
  filter.setFilter(prop, values);
  if (hasPagination.value && !isServerPagination.value) {
    currentPage.value = 1;
  }
  emitFilterChange();
};

const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  emitPaginationChange();
};

const handlePageSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  emitPaginationChange();
};

watch(
  () => props.columns,
  () => {
    filter.initFilteredValues();
  },
  { immediate: true, deep: true }
);

watch(
  () => props.data,
  () => {
    collectAllDataRows();
    selection.syncSelection();
    expand.syncExpandedKeys(allDataRows.value);
  },
  { deep: true }
);

watch(
  () => props.treeProps,
  () => {
    collectAllDataRows();
    selection.syncSelection();
    expand.syncExpandedKeys(allDataRows.value);
  },
  { deep: true }
);

watch(
  () => normalizedPagination.value?.current,
  (value) => {
    if (typeof value === 'number' && value > 0) {
      currentPage.value = value;
    }
  },
  { immediate: true }
);

watch(
  () => normalizedPagination.value?.pageSize,
  (value) => {
    if (typeof value === 'number' && value > 0) {
      pageSize.value = value;
    }
  },
  { immediate: true }
);

watch(
  totalPages,
  (nextTotalPages) => {
    if (currentPage.value > nextTotalPages) {
      currentPage.value = nextTotalPages;
    }
    if (currentPage.value < 1) {
      currentPage.value = 1;
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (props.defaultExpandAll && props.treeProps) {
    const expandedKeys = expand.expandAll(props.data, props.treeProps?.children || 'children');
    if (expand.isControlled) {
      emit('update:expandRowKeys', expandedKeys);
    }
  }

  if (columnHelpers.hasFixedColumns() && containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll);
    nextTick(() => handleScroll());
  }
});

onBeforeUnmount(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll);
  }
});

defineExpose({
  clearSelection: () => {
    selection.clearSelection();
    emitSelectionChange();
  },
  toggleRowSelection: (row: any, selected?: boolean) => {
    selection.toggleRowSelection(row, selected);
    emitSelectionChange();
  },
  toggleAllSelection: () => {
    selection.toggleAllSelection(displayData.value);
    emitSelectionChange();
  },
  clearSort: () => {
    sorter.clearSort();
    emit('sortChange', { ...sorter.sortState.value });
  },
  sort: (prop: string, order: SortOrder) => {
    const state = sorter.sort(prop, order);
    emit('sortChange', state);
  },
  clearFilter: (prop?: string) => {
    filter.clearFilter(prop);
    emitFilterChange();
  },
  setFilter: (prop: string, values: any[]) => {
    filter.setFilter(prop, values);
    emitFilterChange();
  },
  toggleRowExpand: (row: any) => {
    onExpandRow(row);
  },
});
</script>

<style lang="scss">
@use './style.scss';
</style>
