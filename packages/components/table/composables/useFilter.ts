import { computed, ref } from 'vue';
import type { FilterState, TableColumn } from '../types';

/**
 * Table 筛选逻辑 composable
 */
export function useFilter(data: () => any[], columns: () => TableColumn[]) {
  const filterState = ref<FilterState>({});

  // 初始化受控筛选值
  const initFilteredValues = () => {
    const nextState: FilterState = {};

    columns().forEach((col) => {
      if (col.prop && col.filteredValue) {
        nextState[col.prop] = [...col.filteredValue];
      }
    });

    filterState.value = nextState;
  };

  const filteredData = computed(() => {
    let result = data();
    const activeFilterColumns = columns().filter(
      (col) => col.prop && col.filters && col.onFilter && filterState.value[col.prop]?.length
    );

    activeFilterColumns.forEach((col) => {
      if (!col.prop) return;
      const values = filterState.value[col.prop];
      if (values?.length && col.onFilter) {
        result = result.filter((row) =>
          values.some((filterValue) => col.onFilter!(filterValue, row))
        );
      }
    });

    return result;
  });

  const setFilter = (prop: string, values: any[]) => {
    filterState.value = {
      ...filterState.value,
      [prop]: [...values],
    };
  };

  const clearFilter = (prop?: string) => {
    if (prop) {
      const nextState = { ...filterState.value };
      delete nextState[prop];
      filterState.value = nextState;
      return;
    }

    filterState.value = {};
  };

  const getFilterValues = (prop: string): any[] => {
    return filterState.value[prop] || [];
  };

  return {
    filterState,
    filteredData,
    setFilter,
    clearFilter,
    getFilterValues,
    initFilteredValues,
  };
}
