import { ref, computed } from 'vue';
import type { TableColumn, FilterState } from '../types';

/**
 * Table 筛选逻辑 composable
 */
export function useFilter(
  data: () => any[],
  columns: () => TableColumn[],
) {
  const filterState = ref<FilterState>({});

  // 初始化受控筛选值
  const initFilteredValues = () => {
    columns().forEach((col) => {
      if (col.filteredValue && col.prop) {
        filterState.value[col.prop] = col.filteredValue;
      }
    });
  };

  const filteredData = computed(() => {
    let result = data();
    const filterCols = columns().filter(
      (col) => col.filters && col.onFilter && filterState.value[col.prop]?.length,
    );

    filterCols.forEach((col) => {
      const values = filterState.value[col.prop];
      if (values && values.length > 0 && col.onFilter) {
        result = result.filter((row) =>
          values.some((filterValue: any) => col.onFilter!(filterValue, row)),
        );
      }
    });

    return result;
  });

  const setFilter = (prop: string, values: any[]) => {
    filterState.value[prop] = values;
  };

  const clearFilter = (prop?: string) => {
    if (prop) {
      delete filterState.value[prop];
    } else {
      filterState.value = {};
    }
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
