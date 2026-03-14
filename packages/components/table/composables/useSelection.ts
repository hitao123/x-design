import { computed, ref } from 'vue';
import type { TableRowKey } from '../types';

/**
 * Table 选择逻辑 composable
 */
export function useSelection(
  data: () => any[],
  getRowKeyValue: (row: any, index: number) => TableRowKey
) {
  const selectedRowKeys = ref<Set<TableRowKey>>(new Set());

  const selectedRows = computed(() => {
    const rows = data();
    return rows.filter((row, index) => selectedRowKeys.value.has(getRowKeyValue(row, index)));
  });

  const isRowSelected = (row: any, index = -1) => {
    const rowIndex = index >= 0 ? index : data().indexOf(row);
    return selectedRowKeys.value.has(getRowKeyValue(row, rowIndex));
  };

  const getSelectionState = (rows: any[]) => {
    if (!rows.length) {
      return {
        allSelected: false,
        indeterminate: false,
      };
    }

    let selectedCount = 0;
    rows.forEach((row, index) => {
      if (selectedRowKeys.value.has(getRowKeyValue(row, index))) {
        selectedCount += 1;
      }
    });

    return {
      allSelected: selectedCount > 0 && selectedCount === rows.length,
      indeterminate: selectedCount > 0 && selectedCount < rows.length,
    };
  };

  const setRowsSelection = (rows: any[], selected: boolean) => {
    const nextKeys = new Set(selectedRowKeys.value);

    rows.forEach((row, index) => {
      const rowKey = getRowKeyValue(row, index);
      if (selected) {
        nextKeys.add(rowKey);
      } else {
        nextKeys.delete(rowKey);
      }
    });

    selectedRowKeys.value = nextKeys;
  };

  const handleSelectAll = (checked: boolean, rows: any[] = data()) => {
    setRowsSelection(rows, checked);
  };

  const handleSelectRow = (row: any, selected?: boolean, index = -1) => {
    const rowIndex = index >= 0 ? index : data().indexOf(row);
    const rowKey = getRowKeyValue(row, rowIndex);
    const nextKeys = new Set(selectedRowKeys.value);

    if (selected === undefined) {
      if (nextKeys.has(rowKey)) {
        nextKeys.delete(rowKey);
      } else {
        nextKeys.add(rowKey);
      }
    } else if (selected) {
      nextKeys.add(rowKey);
    } else {
      nextKeys.delete(rowKey);
    }

    selectedRowKeys.value = nextKeys;
  };

  const clearSelection = () => {
    selectedRowKeys.value = new Set();
  };

  const toggleRowSelection = (row: any, selected?: boolean, index = -1) => {
    handleSelectRow(row, selected, index);
  };

  const toggleAllSelection = (rows: any[] = data()) => {
    const { allSelected } = getSelectionState(rows);
    setRowsSelection(rows, !allSelected);
  };

  const syncSelection = () => {
    const validKeys = new Set<TableRowKey>();
    data().forEach((row, index) => {
      validKeys.add(getRowKeyValue(row, index));
    });

    const nextKeys = new Set<TableRowKey>();
    selectedRowKeys.value.forEach((key) => {
      if (validKeys.has(key)) {
        nextKeys.add(key);
      }
    });

    if (nextKeys.size !== selectedRowKeys.value.size) {
      selectedRowKeys.value = nextKeys;
    }
  };

  return {
    selectedRowKeys,
    selectedRows,
    isRowSelected,
    getSelectionState,
    handleSelectAll,
    handleSelectRow,
    clearSelection,
    toggleRowSelection,
    toggleAllSelection,
    syncSelection,
  };
}
