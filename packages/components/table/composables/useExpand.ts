import { ref, watch } from 'vue';

/**
 * Table 展开行逻辑 composable
 */
export function useExpand(
  getRowKeyValue: (row: any) => any,
  expandRowKeys?: () => (string | number)[] | undefined,
  defaultExpandAll?: boolean,
) {
  const expandedRowKeys = ref<Set<string | number>>(new Set());

  // 监听外部 expandRowKeys 变化
  if (expandRowKeys) {
    watch(
      expandRowKeys,
      (keys) => {
        if (keys) {
          expandedRowKeys.value = new Set(keys);
        }
      },
      { immediate: true },
    );
  }

  const isRowExpanded = (row: any) => {
    const rowKey = getRowKeyValue(row);
    return expandedRowKeys.value.has(rowKey);
  };

  const toggleRowExpand = (row: any): boolean => {
    const rowKey = getRowKeyValue(row);
    const isExpanded = expandedRowKeys.value.has(rowKey);
    if (isExpanded) {
      expandedRowKeys.value.delete(rowKey);
    } else {
      expandedRowKeys.value.add(rowKey);
    }
    return !isExpanded;
  };

  const expandAll = (data: any[], childrenKey = 'children') => {
    const doExpand = (items: any[]) => {
      items.forEach((item) => {
        const rowKey = getRowKeyValue(item);
        if (item[childrenKey]?.length) {
          expandedRowKeys.value.add(rowKey);
          doExpand(item[childrenKey]);
        }
      });
    };
    doExpand(data);
  };

  return {
    expandedRowKeys,
    isRowExpanded,
    toggleRowExpand,
    expandAll,
  };
}
