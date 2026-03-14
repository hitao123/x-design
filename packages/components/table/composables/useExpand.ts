import { computed, ref, watch } from 'vue';
import type { TableRowKey } from '../types';

/**
 * Table 展开行逻辑 composable
 */
export function useExpand(
  getRowKeyValue: (row: any, index: number) => TableRowKey,
  expandRowKeys?: () => TableRowKey[] | undefined
) {
  const expandedRowKeys = ref<Set<TableRowKey>>(new Set());
  const isControlled = computed(() => !!expandRowKeys && expandRowKeys() !== undefined);

  if (expandRowKeys) {
    watch(
      expandRowKeys,
      (keys) => {
        if (keys !== undefined) {
          expandedRowKeys.value = new Set(keys);
        }
      },
      { immediate: true }
    );
  }

  const isRowExpanded = (row: any, index = -1) => {
    const rowKey = getRowKeyValue(row, index);
    return expandedRowKeys.value.has(rowKey);
  };

  const updateExpandedKeys = (updater: (nextKeys: Set<TableRowKey>) => void) => {
    const nextKeys = new Set(expandedRowKeys.value);
    updater(nextKeys);

    if (!isControlled.value) {
      expandedRowKeys.value = nextKeys;
    }

    return [...nextKeys];
  };

  const toggleRowExpand = (row: any, index = -1): { expanded: boolean; rowKeys: TableRowKey[] } => {
    const rowKey = getRowKeyValue(row, index);
    let expanded = false;

    const rowKeys = updateExpandedKeys((nextKeys) => {
      if (nextKeys.has(rowKey)) {
        nextKeys.delete(rowKey);
        expanded = false;
      } else {
        nextKeys.add(rowKey);
        expanded = true;
      }
    });

    return { expanded, rowKeys };
  };

  const setExpandedRowKeys = (keys: TableRowKey[]) => {
    if (isControlled.value) return;
    expandedRowKeys.value = new Set(keys);
  };

  const expandAll = (data: any[], childrenKey = 'children') => {
    const keys: TableRowKey[] = [];

    const doCollect = (items: any[]) => {
      items.forEach((item, index) => {
        const rowKey = getRowKeyValue(item, index);
        if (item[childrenKey]?.length) {
          keys.push(rowKey);
          doCollect(item[childrenKey]);
        }
      });
    };

    doCollect(data);
    setExpandedRowKeys(keys);
    return keys;
  };

  const syncExpandedKeys = (rows: any[]) => {
    const validKeys = new Set<TableRowKey>();
    rows.forEach((row, index) => {
      validKeys.add(getRowKeyValue(row, index));
    });

    const nextKeys = new Set<TableRowKey>();
    expandedRowKeys.value.forEach((key) => {
      if (validKeys.has(key)) {
        nextKeys.add(key);
      }
    });

    if (nextKeys.size !== expandedRowKeys.value.size && !isControlled.value) {
      expandedRowKeys.value = nextKeys;
    }

    return [...nextKeys];
  };

  return {
    expandedRowKeys,
    isControlled,
    isRowExpanded,
    toggleRowExpand,
    setExpandedRowKeys,
    expandAll,
    syncExpandedKeys,
  };
}
