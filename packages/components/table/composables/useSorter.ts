import { ref, computed } from 'vue';
import type { TableColumn, SortState, SortOrder } from '../types';

/**
 * Table 排序逻辑 composable
 */
export function useSorter(
  data: () => any[],
  columns: () => TableColumn[],
  defaultSort?: { prop: string; order: SortOrder },
) {
  const sortState = ref<SortState>({
    prop: defaultSort?.prop || '',
    order: defaultSort?.order || null,
  });

  const sortedData = computed(() => {
    const rawData = data();
    if (!sortState.value.prop || !sortState.value.order) {
      return rawData;
    }

    const column = columns().find((col) => col.prop === sortState.value.prop);
    if (!column) return rawData;

    // custom 排序只触发事件，不处理数据
    if (column.sortable === 'custom') {
      return rawData;
    }

    const sorted = [...rawData];
    const order = sortState.value.order;

    return sorted.sort((a, b) => {
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

  const handleSort = (column: TableColumn): SortState => {
    if (!column.sortable) return sortState.value;

    if (sortState.value.prop === column.prop) {
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

    return { ...sortState.value };
  };

  const clearSort = () => {
    sortState.value = { prop: '', order: null };
  };

  const sort = (prop: string, order: SortOrder): SortState => {
    sortState.value = { prop, order };
    return { ...sortState.value };
  };

  return {
    sortState,
    sortedData,
    handleSort,
    clearSort,
    sort,
  };
}
