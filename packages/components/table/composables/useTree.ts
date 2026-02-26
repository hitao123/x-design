import { computed } from 'vue';
import type { TableColumn } from '../types';

/**
 * Table 树形数据 composable
 */
export function useTree(
  data: () => any[],
  treeProps: () => { children?: string; hasChildren?: string } | undefined,
  isRowExpanded: (row: any) => boolean,
) {
  const childrenKey = computed(() => treeProps()?.children || 'children');

  const getTreeColumnIndex = (columns: TableColumn[]) => {
    return columns.findIndex(
      (col) => !col.type || !['selection', 'index', 'expand'].includes(col.type),
    );
  };

  const hasTreeChildren = (row: any) => {
    if (!treeProps()) return false;
    return row[childrenKey.value] && row[childrenKey.value].length > 0;
  };

  const getTreeLevel = (row: any) => {
    return row.__level || 0;
  };

  const flattenTreeData = (items: any[], level = 0, parent: any = null): any[] => {
    if (!treeProps()) return items;

    const result: any[] = [];
    items.forEach((item) => {
      const itemWithMeta = { ...item, __level: level, __parent: parent };
      result.push(itemWithMeta);

      if (isRowExpanded(itemWithMeta) && item[childrenKey.value]?.length) {
        result.push(...flattenTreeData(item[childrenKey.value], level + 1, itemWithMeta));
      }
    });
    return result;
  };

  return {
    getTreeColumnIndex,
    hasTreeChildren,
    getTreeLevel,
    flattenTreeData,
  };
}
