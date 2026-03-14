import { computed, ref } from 'vue';
import type { TableColumn } from '../types';

/**
 * Table 树形数据 composable
 */
export function useTree(
  treeProps: () => { children?: string; hasChildren?: string } | undefined,
  isRowExpanded: (row: any) => boolean
) {
  const childrenKey = computed(() => treeProps()?.children || 'children');
  const rowLevelMap = ref(new Map<any, number>());

  const getTreeColumnIndex = (columns: TableColumn[]) => {
    return columns.findIndex(
      (col) => !col.type || !['selection', 'index', 'expand'].includes(col.type)
    );
  };

  const hasTreeChildren = (row: any) => {
    if (!treeProps()) return false;
    return !!(row?.[childrenKey.value] && row[childrenKey.value].length > 0);
  };

  const getTreeLevel = (row: any) => {
    return rowLevelMap.value.get(row) || 0;
  };

  const flattenAllRows = (items: any[]): any[] => {
    if (!treeProps()) return items;

    const result: any[] = [];
    const walk = (rows: any[]) => {
      rows.forEach((row) => {
        result.push(row);
        if (row?.[childrenKey.value]?.length) {
          walk(row[childrenKey.value]);
        }
      });
    };

    walk(items);
    return result;
  };

  const flattenTreeData = (items: any[]): any[] => {
    if (!treeProps()) {
      rowLevelMap.value = new Map();
      return items;
    }

    const result: any[] = [];
    const nextLevelMap = new Map<any, number>();

    const walk = (rows: any[], level: number) => {
      rows.forEach((row) => {
        nextLevelMap.set(row, level);
        result.push(row);

        if (isRowExpanded(row) && row?.[childrenKey.value]?.length) {
          walk(row[childrenKey.value], level + 1);
        }
      });
    };

    walk(items, 0);
    rowLevelMap.value = nextLevelMap;
    return result;
  };

  return {
    getTreeColumnIndex,
    hasTreeChildren,
    getTreeLevel,
    flattenTreeData,
    flattenAllRows,
  };
}
