import type { TableColumn } from '../types';

/**
 * Table 列配置处理 composable
 */
export function useColumns(columns: () => TableColumn[]) {
  /**
   * colgroup > col 的样式，控制列宽
   * 在 table-layout: fixed 下，未指定 width 的列会自动均分剩余宽度
   */
  const getColStyle = (column: TableColumn) => {
    const style: any = {};
    if (column.width) {
      style.width = typeof column.width === 'number' ? `${column.width}px` : column.width;
    }
    if (column.minWidth) {
      style.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth;
    }
    return style;
  };

  /**
   * 固定列的 sticky 定位样式（仅用于 th/td）
   */
  const getFixedStyle = (column: TableColumn) => {
    if (!column.fixed) return undefined;
    const style: any = {
      position: 'sticky',
      zIndex: 1,
    };
    style[column.fixed] = 0;
    return style;
  };

  const getHeaderClass = (column: TableColumn) => [
    'x-table__cell',
    column.align ? `x-table__cell--${column.align}` : '',
    {
      'is-sortable': column.sortable,
      'is-fixed': column.fixed,
      'is-filterable': column.filters && column.filters.length > 0,
    },
  ];

  const getCellValue = (row: any, column: TableColumn, index: number) => {
    const value = row[column.prop];
    if (column.formatter) {
      return column.formatter(row, column, value, index);
    }
    return value;
  };

  const hasExpandColumn = () => {
    return columns().some((col) => col.type === 'expand');
  };

  const getTreeColumnIndex = () => {
    return columns().findIndex(
      (col) => !col.type || !['selection', 'index', 'expand'].includes(col.type),
    );
  };

  return {
    getColStyle,
    getFixedStyle,
    getHeaderClass,
    getCellValue,
    hasExpandColumn,
    getTreeColumnIndex,
  };
}
