<template>
  <div :class="wrapperClasses">
    <div v-if="loading" class="x-table__loading">
      <span>加载中...</span>
    </div>
    <div ref="containerRef" class="x-table__container" :style="containerStyle">
      <table class="x-table__element" :style="{ tableLayout: props.tableLayout }">
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
              :style="columnHelpers.getFixedStyle(column)"
            >
              <div class="x-table__cell-content">
                <!-- 选择列 -->
                <template v-if="column.type === 'selection'">
                  <input
                    type="checkbox"
                    :checked="selection.isAllSelected.value"
                    :indeterminate="selection.isIndeterminate.value"
                    @change="onSelectAll"
                  />
                </template>
                <!-- 索引列 -->
                <template v-else-if="column.type === 'index'">
                  {{ column.label || '#' }}
                </template>
                <!-- 展开列 -->
                <template v-else-if="column.type === 'expand'">
                  {{ column.label || '' }}
                </template>
                <!-- 自定义表头插槽 -->
                <template v-else-if="column.slots?.header">
                  <slot :name="column.slots.header" :column="column" />
                </template>
                <!-- 普通列 -->
                <template v-else>
                  <span>{{ column.label }}</span>
                  <!-- 排序图标 -->
                  <span v-if="column.sortable" class="x-table__sort-icons" @click="onSort(column)">
                    <i
                      class="x-table__sort-icon x-table__sort-icon--asc"
                      :class="{
                        'is-active':
                          sorter.sortState.value.prop === column.prop &&
                          sorter.sortState.value.order === 'ascending',
                      }"
                      >▲</i
                    >
                    <i
                      class="x-table__sort-icon x-table__sort-icon--desc"
                      :class="{
                        'is-active':
                          sorter.sortState.value.prop === column.prop &&
                          sorter.sortState.value.order === 'descending',
                      }"
                      >▼</i
                    >
                  </span>
                  <!-- 筛选图标 -->
                  <TableFilter
                    v-if="column.filters && column.filters.length > 0"
                    :filters="column.filters"
                    :filter-multiple="column.filterMultiple !== false"
                    :active-values="filter.getFilterValues(column.prop)"
                    @filter="(values: any[]) => onFilter(column.prop, values)"
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
                <!-- 选择列 -->
                <template v-if="column.type === 'selection'">
                  <input
                    type="checkbox"
                    :checked="selection.isRowSelected(row)"
                    @change="onSelectRow(row)"
                    @click.stop
                  />
                </template>
                <!-- 索引列 -->
                <template v-else-if="column.type === 'index'">
                  {{ paginatedRowIndex(rowIndex) }}
                </template>
                <!-- 展开列 -->
                <template v-else-if="column.type === 'expand'">
                  <span
                    class="x-table__expand-icon"
                    :class="{ 'is-expanded': expand.isRowExpanded(row) }"
                    @click.stop="onExpandRow(row)"
                    >▶</span
                  >
                </template>
                <!-- 树形展开 -->
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
                      >▶</span
                    >
                    <span>{{ columnHelpers.getCellValue(row, column, rowIndex) }}</span>
                  </div>
                </template>
                <!-- render 函数 -->
                <template v-else-if="column.render">
                  <component :is="renderColumn(column, row, rowIndex)" />
                </template>
                <!-- 自定义列插槽 -->
                <template v-else-if="column.slots?.default">
                  <slot
                    :name="column.slots.default"
                    :row="row"
                    :column="column"
                    :$index="rowIndex"
                  />
                </template>
                <!-- 普通列 -->
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
            <!-- 展开行内容 -->
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
    <!-- 分页 -->
    <div v-if="pagination" class="x-table__pagination">
      <span class="x-table__pagination-total">共 {{ paginationTotal }} 条</span>
      <div class="x-table__pagination-pager">
        <button
          class="x-table__pagination-btn"
          :disabled="currentPage <= 1"
          @click="handlePageChange(currentPage - 1)"
        >
          ‹
        </button>
        <button
          v-for="page in pageList"
          :key="page"
          class="x-table__pagination-btn"
          :class="{ 'is-active': page === currentPage }"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </button>
        <button
          class="x-table__pagination-btn"
          :disabled="currentPage >= totalPages"
          @click="handlePageChange(currentPage + 1)"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, h, type VNode } from 'vue';
import type { TableProps, TableColumn, SortOrder } from './types';
import { useSelection } from './composables/useSelection';
import { useSorter } from './composables/useSorter';
import { useExpand } from './composables/useExpand';
import { useTree } from './composables/useTree';
import { useFilter } from './composables/useFilter';
import { useColumns } from './composables/useColumns';
import TableFilter from './TableFilter.vue';

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
  expandChange: [row: any, expanded: boolean];
  filterChange: [filters: Record<string, any[]>];
  paginationChange: [current: number, pageSize: number];
}>();

const containerRef = ref<HTMLElement>();
const currentRow = ref<any>(null);

// rowKey 工具函数
const getRowKeyValue = (row: any) => (props.rowKey ? row[props.rowKey] : row);
const getRowKey = (row: any, index: number) => (props.rowKey ? row[props.rowKey] : index);

// Composables
const selection = useSelection(() => props.data, getRowKeyValue);
const sorter = useSorter(
  () => props.data,
  () => props.columns,
  props.defaultSort
);
const expand = useExpand(getRowKeyValue, () => props.expandRowKeys, props.defaultExpandAll);
const tree = useTree(
  () => props.data,
  () => props.treeProps,
  expand.isRowExpanded
);
const filter = useFilter(
  () => sorter.sortedData.value,
  () => props.columns
);
const columnHelpers = useColumns(() => props.columns);

// 初始化
onMounted(() => {
  if (props.defaultExpandAll && props.treeProps) {
    expand.expandAll(props.data, props.treeProps?.children || 'children');
  }
  filter.initFilteredValues();
});

// 分页
const currentPage = ref(props.pagination ? (props.pagination as any).current || 1 : 1);
const pageSize = ref(props.pagination ? (props.pagination as any).pageSize || 10 : 10);

const paginationTotal = computed(() => {
  if (
    props.pagination &&
    typeof props.pagination === 'object' &&
    props.pagination.total !== undefined
  ) {
    return props.pagination.total;
  }
  return filter.filteredData.value.length;
});

const totalPages = computed(() => Math.max(1, Math.ceil(paginationTotal.value / pageSize.value)));

const pageList = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2;
  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// 显示数据管线：过滤 -> 树形展开 -> 分页
const displayData = computed(() => {
  let data = filter.filteredData.value;

  if (props.treeProps) {
    data = tree.flattenTreeData(data);
  }

  if (props.pagination) {
    const start = (currentPage.value - 1) * pageSize.value;
    data = data.slice(start, start + pageSize.value);
  }

  return data;
});

const paginatedRowIndex = (rowIndex: number) => {
  if (props.pagination) {
    return (currentPage.value - 1) * pageSize.value + rowIndex + 1;
  }
  return rowIndex + 1;
};

// Wrapper classes
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
  const style: any = {};
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

// 行/单元格样式
const getCellClass = (row: any, column: TableColumn, rowIndex: number, columnIndex: number) => {
  const classes: any[] = [
    'x-table__cell',
    column.align ? `x-table__cell--${column.align}` : '',
    { 'is-fixed': column.fixed },
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

// render 函数列
const renderColumn = (column: TableColumn, row: any, index: number): VNode | string => {
  if (column.render) {
    return column.render({ row, column, $index: index }) as VNode | string;
  }
  return '';
};

// 事件处理
const handleRowClick = (row: any, index: number) => {
  if (props.highlightCurrentRow) currentRow.value = row;
  emit('rowClick', row, index);
};

const onSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  selection.handleSelectAll(checked);
  emit('selectionChange', selection.selectedRows.value);
};

const onSelectRow = (row: any) => {
  selection.handleSelectRow(row);
  emit('selectionChange', selection.selectedRows.value);
};

const onSort = (column: TableColumn) => {
  const state = sorter.handleSort(column);
  emit('sortChange', state);
};

const onExpandRow = (row: any) => {
  const expanded = expand.toggleRowExpand(row);
  emit('expandChange', row, expanded);
};

const onFilter = (prop: string, values: any[]) => {
  filter.setFilter(prop, values);
  emit('filterChange', { ...filter.filterState.value });
};

const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  emit('paginationChange', currentPage.value, pageSize.value);
};

// 暴露方法
defineExpose({
  clearSelection: () => {
    selection.clearSelection();
    emit('selectionChange', []);
  },
  toggleRowSelection: (row: any, selected?: boolean) => {
    selection.toggleRowSelection(row, selected);
    emit('selectionChange', selection.selectedRows.value);
  },
  toggleAllSelection: () => {
    selection.toggleAllSelection();
    emit('selectionChange', selection.selectedRows.value);
  },
  clearSort: () => sorter.clearSort(),
  sort: (prop: string, order: SortOrder) => {
    const state = sorter.sort(prop, order);
    emit('sortChange', state);
  },
  clearFilter: (prop?: string) => filter.clearFilter(prop),
  setFilter: (prop: string, values: any[]) => {
    filter.setFilter(prop, values);
    emit('filterChange', { ...filter.filterState.value });
  },
});
</script>

<style lang="scss">
@use './style.scss';
</style>
