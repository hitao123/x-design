<template>
  <div :class="wrapperClasses">
    <div v-if="loading" class="x-table__loading">
      <span>加载中...</span>
    </div>
    <div class="x-table__container" :style="containerStyle">
      <table class="x-table__element">
        <thead v-if="showHeader" class="x-table__header">
          <tr>
            <th
              v-for="(column, columnIndex) in columns"
              :key="column.prop || columnIndex"
              :style="getColumnStyle(column)"
              :class="getHeaderClass(column)"
            >
              <div class="x-table__cell-content">
                <!-- 选择列 -->
                <template v-if="column.type === 'selection'">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    :indeterminate="isIndeterminate"
                    @change="handleSelectAll"
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
                  <span
                    v-if="column.sortable"
                    class="x-table__sort-icons"
                    @click="handleSort(column)"
                  >
                    <i
                      class="x-table__sort-icon x-table__sort-icon--asc"
                      :class="{
                        'is-active':
                          sortState.prop === column.prop && sortState.order === 'ascending',
                      }"
                      >▲</i
                    >
                    <i
                      class="x-table__sort-icon x-table__sort-icon--desc"
                      :class="{
                        'is-active':
                          sortState.prop === column.prop && sortState.order === 'descending',
                      }"
                      >▼</i
                    >
                  </span>
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
                :style="getColumnStyle(column)"
                :class="getCellClass(row, column, rowIndex, columnIndex)"
              >
                <!-- 选择列 -->
                <template v-if="column.type === 'selection'">
                  <input
                    type="checkbox"
                    :checked="isRowSelected(row)"
                    @change="handleSelectRow(row)"
                    @click.stop
                  />
                </template>
                <!-- 索引列 -->
                <template v-else-if="column.type === 'index'">
                  {{ rowIndex + 1 }}
                </template>
                <!-- 展开列 -->
                <template v-else-if="column.type === 'expand'">
                  <span
                    class="x-table__expand-icon"
                    :class="{ 'is-expanded': isRowExpanded(row) }"
                    @click.stop="handleExpandRow(row)"
                  >
                    ▶
                  </span>
                </template>
                <!-- 树形展开 -->
                <template
                  v-else-if="
                    column.prop && hasTreeChildren(row) && columnIndex === getTreeColumnIndex()
                  "
                >
                  <div
                    class="x-table__tree-cell"
                    :style="{ paddingLeft: `${getTreeLevel(row) * 20}px` }"
                  >
                    <span
                      class="x-table__expand-icon"
                      :class="{ 'is-expanded': isRowExpanded(row) }"
                      @click.stop="handleExpandRow(row)"
                    >
                      ▶
                    </span>
                    <span>{{ getCellValue(row, column, rowIndex) }}</span>
                  </div>
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
                    :title="showOverflowTooltip ? getCellValue(row, column, rowIndex) : undefined"
                  >
                    {{ getCellValue(row, column, rowIndex) }}
                  </span>
                </template>
              </td>
            </tr>
            <!-- 展开行内容 -->
            <tr v-if="hasExpandColumn && isRowExpanded(row)" class="x-table__expand-row">
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import type { TableProps, TableColumn, SortState, SortOrder } from './types';

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
});

const emit = defineEmits<{
  rowClick: [row: any, index: number];
  selectionChange: [selection: any[]];
  sortChange: [sortState: SortState];
  expandChange: [row: any, expanded: boolean];
}>();

const currentRow = ref<any>(null);
const selectedRows = ref<any[]>([]);
const sortState = ref<SortState>({
  prop: '',
  order: null,
});
const expandedRowKeys = ref<Set<string | number>>(new Set());

// 初始化排序
onMounted(() => {
  if (props.defaultSort) {
    sortState.value = {
      prop: props.defaultSort.prop,
      order: props.defaultSort.order,
    };
  }
  if (props.defaultExpandAll) {
    expandAllRows();
  } else if (props.expandRowKeys) {
    expandedRowKeys.value = new Set(props.expandRowKeys);
  }
});

// 监听 expandRowKeys 变化
watch(
  () => props.expandRowKeys,
  (keys) => {
    if (keys) {
      expandedRowKeys.value = new Set(keys);
    }
  }
);

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

// 判断是否有展开列
const hasExpandColumn = computed(() => {
  return props.columns.some((col) => col.type === 'expand');
});

// 获取树形列索引（第一个非特殊类型的列）
const getTreeColumnIndex = () => {
  return props.columns.findIndex(
    (col) => !col.type || !['selection', 'index', 'expand'].includes(col.type)
  );
};

// 扁平化树形数据
const flattenTreeData = (data: any[], level = 0, parent: any = null): any[] => {
  if (!props.treeProps) return data;

  const childrenKey = props.treeProps.children || 'children';
  const result: any[] = [];

  data.forEach((item) => {
    const itemWithMeta = { ...item, __level: level, __parent: parent };
    result.push(itemWithMeta);

    const rowKey = getRowKeyValue(itemWithMeta);
    if (expandedRowKeys.value.has(rowKey) && item[childrenKey]?.length) {
      result.push(...flattenTreeData(item[childrenKey], level + 1, itemWithMeta));
    }
  });

  return result;
};

// 排序后的数据
const sortedData = computed(() => {
  if (!sortState.value.prop || !sortState.value.order) {
    return props.data;
  }

  const column = props.columns.find((col) => col.prop === sortState.value.prop);
  if (!column) return props.data;

  // 如果是自定义排序，只触发事件，不处理数据
  if (column.sortable === 'custom') {
    return props.data;
  }

  const data = [...props.data];
  const order = sortState.value.order;

  return data.sort((a, b) => {
    const aVal = a[sortState.value.prop];
    const bVal = b[sortState.value.prop];

    if (aVal === bVal) return 0;

    let result = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      result = aVal - bVal;
    } else {
      result = String(aVal).localeCompare(String(bVal));
    }

    return order === 'ascending' ? result : -result;
  });
});

// 显示的数据（排序 + 树形展开）
const displayData = computed(() => {
  if (props.treeProps) {
    return flattenTreeData(sortedData.value);
  }
  return sortedData.value;
});

// 全选状态
const isAllSelected = computed(() => {
  return props.data.length > 0 && selectedRows.value.length === props.data.length;
});

const isIndeterminate = computed(() => {
  return selectedRows.value.length > 0 && selectedRows.value.length < props.data.length;
});

const getColumnStyle = (column: TableColumn) => {
  const style: any = {};
  if (column.width) {
    style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
  }
  if (column.minWidth) {
    style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth;
  }
  if (column.fixed) {
    style.position = 'sticky';
    style[column.fixed] = 0;
    style.zIndex = 1;
  }
  return style;
};

const getHeaderClass = (column: TableColumn) => [
  'x-table__cell',
  column.align ? `x-table__cell--${column.align}` : '',
  {
    'is-sortable': column.sortable,
    'is-fixed': column.fixed,
  },
];

const getCellClass = (row: any, column: TableColumn, rowIndex: number, columnIndex: number) => {
  const classes = [
    'x-table__cell',
    column.align ? `x-table__cell--${column.align}` : '',
    {
      'is-fixed': column.fixed,
    },
  ];

  if (typeof props.cellClassName === 'function') {
    const customClass = props.cellClassName(row, column, rowIndex, columnIndex);
    if (customClass) classes.push(customClass);
  } else if (typeof props.cellClassName === 'string') {
    classes.push(props.cellClassName);
  }

  return classes;
};

const getRowClass = (row: any, index: number) => {
  const classes = [
    'x-table__row',
    {
      'x-table__row--striped': props.stripe && index % 2 === 1,
      'x-table__row--current': props.highlightCurrentRow && currentRow.value === row,
      'x-table__row--selected': isRowSelected(row),
    },
  ];

  if (typeof props.rowClassName === 'function') {
    const customClass = props.rowClassName(row, index);
    if (customClass) classes.push(customClass);
  } else if (typeof props.rowClassName === 'string') {
    classes.push(props.rowClassName);
  }

  return classes;
};

const getRowKeyValue = (row: any) => {
  return props.rowKey ? row[props.rowKey] : row;
};

const getRowKey = (row: any, index: number) => {
  return props.rowKey ? row[props.rowKey] : index;
};

const getCellValue = (row: any, column: TableColumn, index: number) => {
  const value = row[column.prop];
  if (column.formatter) {
    return column.formatter(row, column, value, index);
  }
  return value;
};

const handleRowClick = (row: any, index: number) => {
  if (props.highlightCurrentRow) {
    currentRow.value = row;
  }
  emit('rowClick', row, index);
};

// 排序处理
const handleSort = (column: TableColumn) => {
  if (!column.sortable) return;

  if (sortState.value.prop === column.prop) {
    // 切换排序顺序：ascending -> descending -> null -> ascending
    if (sortState.value.order === 'ascending') {
      sortState.value.order = 'descending';
    } else if (sortState.value.order === 'descending') {
      sortState.value.order = null;
      sortState.value.prop = '';
    } else {
      sortState.value.order = 'ascending';
    }
  } else {
    sortState.value.prop = column.prop;
    sortState.value.order = 'ascending';
  }

  emit('sortChange', { ...sortState.value });
};

// 选择处理
const isRowSelected = (row: any) => {
  const rowKey = getRowKeyValue(row);
  return selectedRows.value.some((selectedRow) => getRowKeyValue(selectedRow) === rowKey);
};

const handleSelectAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  if (checked) {
    selectedRows.value = [...props.data];
  } else {
    selectedRows.value = [];
  }
  emit('selectionChange', selectedRows.value);
};

const handleSelectRow = (row: any) => {
  const rowKey = getRowKeyValue(row);
  const index = selectedRows.value.findIndex(
    (selectedRow) => getRowKeyValue(selectedRow) === rowKey
  );

  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(row);
  }
  emit('selectionChange', selectedRows.value);
};

// 展开行处理
const isRowExpanded = (row: any) => {
  const rowKey = getRowKeyValue(row);
  return expandedRowKeys.value.has(rowKey);
};

const handleExpandRow = (row: any) => {
  const rowKey = getRowKeyValue(row);
  const isExpanded = expandedRowKeys.value.has(rowKey);

  if (isExpanded) {
    expandedRowKeys.value.delete(rowKey);
  } else {
    expandedRowKeys.value.add(rowKey);
  }

  emit('expandChange', row, !isExpanded);
};

const expandAllRows = () => {
  if (!props.treeProps) return;

  const childrenKey = props.treeProps.children || 'children';
  const expandAll = (data: any[]) => {
    data.forEach((item) => {
      const rowKey = getRowKeyValue(item);
      if (item[childrenKey]?.length) {
        expandedRowKeys.value.add(rowKey);
        expandAll(item[childrenKey]);
      }
    });
  };

  expandAll(props.data);
};

// 树形数据相关
const hasTreeChildren = (row: any) => {
  if (!props.treeProps) return false;
  const childrenKey = props.treeProps.children || 'children';
  return row[childrenKey] && row[childrenKey].length > 0;
};

const getTreeLevel = (row: any) => {
  return row.__level || 0;
};

// 暴露方法
defineExpose({
  clearSelection: () => {
    selectedRows.value = [];
  },
  toggleRowSelection: (row: any, selected?: boolean) => {
    const rowKey = getRowKeyValue(row);
    const index = selectedRows.value.findIndex(
      (selectedRow) => getRowKeyValue(selectedRow) === rowKey
    );

    if (selected === undefined) {
      if (index > -1) {
        selectedRows.value.splice(index, 1);
      } else {
        selectedRows.value.push(row);
      }
    } else if (selected && index === -1) {
      selectedRows.value.push(row);
    } else if (!selected && index > -1) {
      selectedRows.value.splice(index, 1);
    }
    emit('selectionChange', selectedRows.value);
  },
  toggleAllSelection: () => {
    if (isAllSelected.value) {
      selectedRows.value = [];
    } else {
      selectedRows.value = [...props.data];
    }
    emit('selectionChange', selectedRows.value);
  },
  clearSort: () => {
    sortState.value = { prop: '', order: null };
  },
  sort: (prop: string, order: SortOrder) => {
    sortState.value = { prop, order };
    emit('sortChange', { ...sortState.value });
  },
});
</script>

<style lang="scss">
@import './style.scss';
</style>
