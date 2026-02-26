import { ref, computed } from 'vue';

/**
 * Table 选择逻辑 composable
 */
export function useSelection(
  data: () => any[],
  getRowKeyValue: (row: any) => any,
) {
  const selectedRows = ref<any[]>([]);

  const isAllSelected = computed(() => {
    const d = data();
    return d.length > 0 && selectedRows.value.length === d.length;
  });

  const isIndeterminate = computed(() => {
    const d = data();
    return selectedRows.value.length > 0 && selectedRows.value.length < d.length;
  });

  const isRowSelected = (row: any) => {
    const rowKey = getRowKeyValue(row);
    return selectedRows.value.some((r) => getRowKeyValue(r) === rowKey);
  };

  const handleSelectAll = (checked: boolean) => {
    selectedRows.value = checked ? [...data()] : [];
  };

  const handleSelectRow = (row: any) => {
    const rowKey = getRowKeyValue(row);
    const index = selectedRows.value.findIndex((r) => getRowKeyValue(r) === rowKey);
    if (index > -1) {
      selectedRows.value.splice(index, 1);
    } else {
      selectedRows.value.push(row);
    }
  };

  const clearSelection = () => {
    selectedRows.value = [];
  };

  const toggleRowSelection = (row: any, selected?: boolean) => {
    const rowKey = getRowKeyValue(row);
    const index = selectedRows.value.findIndex((r) => getRowKeyValue(r) === rowKey);
    if (selected === undefined) {
      index > -1 ? selectedRows.value.splice(index, 1) : selectedRows.value.push(row);
    } else if (selected && index === -1) {
      selectedRows.value.push(row);
    } else if (!selected && index > -1) {
      selectedRows.value.splice(index, 1);
    }
  };

  const toggleAllSelection = () => {
    if (isAllSelected.value) {
      selectedRows.value = [];
    } else {
      selectedRows.value = [...data()];
    }
  };

  return {
    selectedRows,
    isAllSelected,
    isIndeterminate,
    isRowSelected,
    handleSelectAll,
    handleSelectRow,
    clearSelection,
    toggleRowSelection,
    toggleAllSelection,
  };
}
